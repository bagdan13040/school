from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
import shutil
import tempfile
import openai
from .ai_api import generate_text, analyze_file
import logging

app = FastAPI()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class GenerateRequest(BaseModel):
    prompt: str
    model: str | None = None


@app.post('/generate')
async def generate(req: GenerateRequest):
    try:
        text = generate_text(req.prompt, model=req.model)
        return {"response": text}
    except openai.RateLimitError as e:
        logger.warning("Rate limit exceeded: %s", e)
        raise HTTPException(status_code=503, detail="Upstream provider rate-limited. Try again later.")
    except Exception as e:
        logger.error("Error in /generate: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@app.post('/analyze-file')
async def analyze_file_endpoint(file: UploadFile = File(...), question: str = Form(...), model: str | None = Form(None)):
    # save uploaded file to a temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".tmp") as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name
    try:
        result = analyze_file(tmp_path, question, model=model)
        return {"response": result}
    except openai.RateLimitError:
        logger.warning("Rate limit exceeded during file analysis")
        raise HTTPException(status_code=503, detail="Upstream provider rate-limited. Try again later.")
    except Exception as e:
        logger.error("Error in /analyze-file: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@app.get('/health')
def health():
    return {"status": "ok"}
