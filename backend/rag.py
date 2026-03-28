import os
import ollama
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
# Removed LangChain Ollama and related LCEL imports as we're switching to the official 'ollama' library

from avatars import get_avatar

# Multilingual embedding model supporting Hindi, Marathi, Tamil, Bengali
EMBEDDING_MODEL = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"

# Ollama LLM configuration
LLM_MODEL = "llama3.2:3b"

# Global embeddings instance for reuse
_embeddings = None

def get_embeddings():
    global _embeddings
    if _embeddings is None:
        _embeddings = HuggingFaceEmbeddings(
            model_name=EMBEDDING_MODEL,
            model_kwargs={"device": "cpu"},
        )
    return _embeddings

def _build_vector_store(avatar_id: str) -> FAISS | None:
    """
    Build or load a FAISS vector store for the given avatar's knowledge base.
    """
    avatar = get_avatar(avatar_id)
    if not avatar:
        return None

    knowledge_dir = avatar["knowledge_dir"]
    faiss_dir = f"knowledge_base/{avatar_id}_faiss"

    embeddings = get_embeddings()

    # Try to load existing FAISS index
    if os.path.exists(faiss_dir):
        try:
            return FAISS.load_local(
                faiss_dir, embeddings, allow_dangerous_deserialization=True
            )
        except Exception:
            pass  # Rebuild if loading fails

    # Check if knowledge directory has text files
    if not os.path.exists(knowledge_dir):
        os.makedirs(knowledge_dir, exist_ok=True)
        return None

    txt_files = [f for f in os.listdir(knowledge_dir) if f.endswith(".txt")]
    if not txt_files:
        return None

    # Load Text files
    loader = DirectoryLoader(
        knowledge_dir,
        glob="**/*.txt",
        loader_cls=TextLoader,
    )
    documents = loader.load()

    if not documents:
        return None

    # Split documents
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50,
    )
    splits = text_splitter.split_documents(documents)

    # Create FAISS index
    vector_store = FAISS.from_documents(splits, embeddings)

    # Save for future use
    os.makedirs(faiss_dir, exist_ok=True)
    vector_store.save_local(faiss_dir)

    return vector_store


def _format_docs(docs):
    """Format retrieved documents into a single context string."""
    return "\n\n".join(doc.page_content for doc in docs)


def answer_question(avatar_id: str, question: str) -> str:
    """
    Answer a question using retrieved context and official Ollama Python library.
    Ensures answers follow the avatar's persona and language constraints.
    """
    avatar = get_avatar(avatar_id)
    if not avatar:
        return "Avatar not found."

    # 1. Retrieve Context from FAISS
    vector_store = _build_vector_store(avatar_id)
    context = ""
    if vector_store:
        try:
            # Simple similarity search for context
            docs = vector_store.similarity_search(question, k=3)
            context = _format_docs(docs)
        except Exception as e:
            print(f"Retrieval error for {avatar_id}: {e}")

    # 2. Prepare System Prompt (Injecting Context)
    # Most avatars use placeholders: {context} and {question}
    try:
        system_prompt = avatar["full_prompt"].format(context=context, question=question)
    except Exception:
        # Fallback if formatting fails (e.g., missing keys in prompt template)
        system_prompt = avatar["full_prompt"]

    # 3. Generate Answer using Ollama
    try:
        response = ollama.chat(
            model=LLM_MODEL,
            messages=[
                {'role': 'system', 'content': system_prompt},
                {'role': 'user', 'content': question},
            ],
            options={
                'temperature': 0.3, # Keep it factual
            }
        )
        answer = response['message']['content'].strip()
        
        # Final cleanup: sometimes LLMs repeat the prompt headers, though less likely with Llama 3
        if ":" in answer and len(answer.split(":")[0]) < 20:
             # Basic check to skip prefixes like "Answer:" or "उत्तर:"
             pass

        return answer if answer else avatar["greeting"]

    except Exception as e:
        print(f"Ollama error for {avatar_id}: {e}")
        return avatar["greeting"]
