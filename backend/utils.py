"""
Utility functions for Pratinidhi AI backend.
"""

import os


# Base directories
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTPUT_DIR = os.path.join(BASE_DIR, "output")
VIDEOS_DIR = os.path.join(OUTPUT_DIR, "videos")
AUDIO_DIR = os.path.join(OUTPUT_DIR, "audio")
AVATARS_DIR = os.path.join(BASE_DIR, "avatars")


def ensure_dirs():
    """Create necessary output directories if they don't exist."""
    for d in [VIDEOS_DIR, AUDIO_DIR, AVATARS_DIR]:
        os.makedirs(d, exist_ok=True)
    print(f"Output directories ready: {OUTPUT_DIR}")


def get_video_path(avatar_id: str) -> str:
    """Get the output video file path for an avatar ID."""
    return os.path.join(VIDEOS_DIR, f"{avatar_id}.mp4")


def get_audio_path(avatar_id: str) -> str:
    """Get the output audio file path for an avatar ID."""
    return os.path.join(AUDIO_DIR, f"{avatar_id}.mp3")


def get_avatar_image_path(filename: str) -> str:
    """Get the path for an avatar source image."""
    return os.path.join(AVATARS_DIR, filename)


def cleanup_temp_files(avatar_id: str):
    """Remove temporary audio files after video generation."""
    audio_path = get_audio_path(avatar_id)
    if os.path.exists(audio_path):
        os.remove(audio_path)
        print(f"Cleaned up: {audio_path}")


if __name__ == "__main__":
    ensure_dirs()
    print("All directories created successfully.")
