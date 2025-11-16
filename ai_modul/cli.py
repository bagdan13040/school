#!/usr/bin/env python3
"""Small CLI wrapper for ai_modul.ai_api so Node can call it when FastAPI isn't running.
Usage:
  python cli.py generate    <- reads JSON {"prompt": "...", "model": "..."} from stdin and prints JSON
  python cli.py analyze    <- reads JSON {"file_path": "...", "question": "...", "model": "..."} from stdin and prints JSON
"""
import sys
import json
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from ai_modul.ai_api import generate_text, analyze_file


def _read_stdin_json():
    try:
        raw = sys.stdin.read()
        if not raw:
            return {}
        return json.loads(raw)
    except Exception:
        return {}


def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "missing command"}))
        sys.exit(2)

    cmd = sys.argv[1]
    data = _read_stdin_json()

    try:
        if cmd == 'generate':
            prompt = data.get('prompt')
            model = data.get('model')
            out = generate_text(prompt, model=model)
            print(json.dumps({"response": out}))
            return
        elif cmd == 'analyze':
            file_path = data.get('file_path')
            question = data.get('question')
            model = data.get('model')
            out = analyze_file(file_path, question, model=model)
            print(json.dumps({"response": out}))
            return
        else:
            print(json.dumps({"error": "unknown command"}))
            sys.exit(2)
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)


if __name__ == '__main__':
    main()
