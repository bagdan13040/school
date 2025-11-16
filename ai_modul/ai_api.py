import os
import time
from pathlib import Path
from typing import Optional

import openai
from openai import OpenAI
from dotenv import load_dotenv


load_dotenv()


OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
OPENAI_BASE_URL = os.environ.get("OPENAI_BASE_URL", "https://openrouter.ai/api/v1")
OPENAI_MODEL = os.environ.get("OPENAI_MODEL", "google/gemini-2.0-flash-exp:free")

_client: Optional[OpenAI] = None


def _get_client() -> Optional[OpenAI]:
    global _client
    if _client is None and OPENAI_API_KEY:
        _client = OpenAI(api_key=OPENAI_API_KEY, base_url=OPENAI_BASE_URL)
    return _client


def generate_text(prompt: str, model: Optional[str] = None) -> str:
    """Generate text for a given prompt using the specified model.

    model: optional model id (if None, OPENAI_MODEL env var is used).
    """
    model = model or OPENAI_MODEL
    if not model:
        raise RuntimeError("Model id not specified. Set OPENAI_MODEL or pass model param.")

    # quick offline/no-network safety: if API key is missing, return a canned response
    client = _get_client()

    if not OPENAI_API_KEY or client is None:
        return f"(offline) simulated response for prompt: {prompt[:120]}"

    # retry/backoff for transient rate limits from upstream provider
    max_retries = 5
    delay = 1.0
    for attempt in range(1, max_retries + 1):
        try:
            resp = client.chat.completions.create(
                model=model,
                messages=[{"role": "user", "content": prompt}],
            )
            return resp.choices[0].message.content
        except openai.RateLimitError as e:
            # if last attempt, re-raise to let caller handle it
            if attempt == max_retries:
                raise
            # otherwise wait and retry
            time.sleep(delay)
            delay *= 2
        except openai.OpenAIError as e:
            # If provider unreachable, return a friendly offline message rather than crash.
            # This keeps the local CLI fallback useful during debugging.
            return f"(error) AI provider error: {str(e)}"


def summarize_text(text: str, model: Optional[str] = None) -> str:
    """Return a short (3-4 sentence) summary of the provided text."""
    prompt = f"Summarize the following text in 3-4 short sentences:\n\n{text}"
    return generate_text(prompt, model=model)


def analyze_file(file_path: str, question: str, model: Optional[str] = None) -> str:
    """Read a local file and answer a question about it.

    For very large files the content is trimmed to the first 30000 characters.
    """
    p = Path(file_path)
    if not p.exists():
        raise FileNotFoundError(file_path)
    text = p.read_text(encoding="utf-8", errors="ignore")
    if len(text) > 30000:
        text = text[:30000]
    prompt = f"File content:\n\n{text}\n\nQuestion: {question}"
    return generate_text(prompt, model=model)

if __name__ == '__main__':
    # Demo when run directly
    print(generate_text("Напиши короткое приветствие про осень"))