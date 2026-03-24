import traceback
from rag import answer_question

print("================ RAG DEBUG ================")
try:
    print("Testing answer_question for 'arjun'...")
    ans = answer_question("arjun", "What is PM Kisan?")
    print("Returned:", ans)
except Exception as e:
    print("Caught Exception:")
    traceback.print_exc()
print("===========================================")
