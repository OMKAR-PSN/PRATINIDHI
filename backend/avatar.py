"""
Avatar Generation Module
Uses SadTalker for generating talking avatar videos from a source image and audio.
Falls back to FFmpeg-based placeholder video if SadTalker is not available.
"""

import subprocess
import os
import shutil


# Path to SadTalker installation (update this to your SadTalker path)
SADTALKER_PATH = os.environ.get("SADTALKER_PATH", "./SadTalker")


def generate_avatar_video(image_path: str, audio_path: str, output_path: str) -> str:
    """
    Generate a talking avatar video using SadTalker.

    Args:
        image_path: Path to the source face image.
        audio_path: Path to the speech audio file.
        output_path: Path where the output video should be saved.

    Returns:
        Path to the generated video file.
    """
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    # Try SadTalker first
    if os.path.exists(SADTALKER_PATH):
        return _run_sadtalker(image_path, audio_path, output_path)
    else:
        print("SadTalker not found. Using FFmpeg fallback to create placeholder video.")
        return _ffmpeg_fallback(image_path, audio_path, output_path)


def _run_sadtalker(image_path: str, audio_path: str, output_path: str) -> str:
    """Run SadTalker inference to generate the avatar video."""
    result_dir = os.path.dirname(output_path)

    cmd = [
        "python",
        os.path.join(SADTALKER_PATH, "inference.py"),
        "--driven_audio", os.path.abspath(audio_path),
        "--source_image", os.path.abspath(image_path),
        "--result_dir", os.path.abspath(result_dir),
        "--still",
        "--preprocess", "crop",
        "--enhancer", "gfpgan",
    ]

    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=300,  # 5 minute timeout
            cwd=SADTALKER_PATH,
        )

        if result.returncode != 0:
            print(f"SadTalker error: {result.stderr}")
            raise RuntimeError(f"SadTalker failed: {result.stderr}")

        # SadTalker outputs to result_dir, find the generated video
        generated_files = [
            f for f in os.listdir(result_dir)
            if f.endswith('.mp4') and f != os.path.basename(output_path)
        ]
        if generated_files:
            generated_path = os.path.join(result_dir, generated_files[-1])
            shutil.move(generated_path, output_path)

        print(f"Avatar video generated: {output_path}")
        return output_path

    except subprocess.TimeoutExpired:
        raise RuntimeError("SadTalker timed out after 5 minutes")
    except FileNotFoundError:
        print("SadTalker not properly installed. Falling back to FFmpeg.")
        return _ffmpeg_fallback(image_path, audio_path, output_path)


def _ffmpeg_fallback(image_path: str, audio_path: str, output_path: str) -> str:
    """
    Create a simple video from image + audio using FFmpeg.
    This serves as a fallback when SadTalker is not available.
    """
    cmd = [
        "ffmpeg",
        "-y",
        "-loop", "1",
        "-i", os.path.abspath(image_path),
        "-i", os.path.abspath(audio_path),
        "-c:v", "libx264",
        "-tune", "stillimage",
        "-c:a", "aac",
        "-b:a", "192k",
        "-pix_fmt", "yuv420p",
        "-shortest",
        "-vf", "scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2",
        os.path.abspath(output_path),
    ]

    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)

        if result.returncode != 0:
            print(f"FFmpeg error: {result.stderr}")
            raise RuntimeError(f"FFmpeg failed: {result.stderr}")

        print(f"Fallback video created: {output_path}")
        return output_path

    except FileNotFoundError:
        raise RuntimeError(
            "Neither SadTalker nor FFmpeg is available. "
            "Please install FFmpeg or set SADTALKER_PATH environment variable."
        )


if __name__ == "__main__":
    # Quick test
    test_image = "../avatars/leader.jpg"
    test_audio = "../output/audio/speech.mp3"
    test_output = "../output/videos/test_avatar.mp4"

    if os.path.exists(test_image) and os.path.exists(test_audio):
        video = generate_avatar_video(test_image, test_audio, test_output)
        print(f"Video generated: {video}")
    else:
        print("Test files not found. Please provide leader.jpg and speech.mp3")
