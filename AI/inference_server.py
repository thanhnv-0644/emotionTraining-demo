"""
Emotion SER Inference Server
FastAPI server load model Emotion2Vec fine-tuned, nhận audio → trả cảm xúc + confidence.

Chạy:
    pip install -r requirements.txt
    uvicorn inference_server:app --host 0.0.0.0 --port 8000 --reload
"""

import io
import types
from pathlib import Path
from typing import List

import numpy as np
import torch
import torch.nn as nn
import librosa
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ── Config ────────────────────────────────────────────────────────────────────
MODEL_PATH  = Path(__file__).parent / "emotion2vec_viet_finetuned.pt"
TARGET_SR   = 16_000
MAX_SEC     = 6
NUM_CLASSES = 6
DEVICE      = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Model labels → system emotion keys
MODEL_EMOTIONS = ["angry", "fear", "happy", "neutral", "sad", "surprise"]
LABEL_MAP = {
    "angry":    "anger",
    "fear":     "fear",
    "happy":    "happiness",
    "neutral":  "neutral",
    "sad":      "sadness",
    "surprise": "surprise",
}

# ── Model definition (phải giống colab) ──────────────────────────────────────
class Emotion2VecSER(nn.Module):
    def __init__(self, num_classes: int = NUM_CLASSES):
        super().__init__()
        from funasr import AutoModel
        _m = AutoModel(model="iic/emotion2vec_plus_base", model_hub="hf", disable_update=True)
        self.backbone = _m.model
        self.head = nn.Sequential(
            nn.LayerNorm(768),
            nn.Linear(768, 256),
            nn.GELU(),
            nn.Dropout(0.3),
            nn.Linear(256, num_classes),
        )

    def forward(self, wav: torch.Tensor) -> torch.Tensor:
        out = self.backbone(wav, features_only=True)
        if isinstance(out, dict):
            hidden = out["x"]
        elif hasattr(out, "last_hidden_state"):
            hidden = out.last_hidden_state
        elif isinstance(out, (tuple, list)):
            hidden = out[0]
        else:
            hidden = out
        return self.head(hidden.mean(dim=1))


def _no_mask_fwd(self, source, padding_mask=None, mask=True,
                 features_only=False, output_layer=None,
                 output_hidden_states=False, **kw):
    return self._orig_fwd(source, padding_mask=padding_mask, mask=False,
                          features_only=features_only,
                          output_layer=output_layer,
                          output_hidden_states=output_hidden_states, **kw)


# ── Load model once on startup ────────────────────────────────────────────────
print(f"Loading model from {MODEL_PATH} on {DEVICE} …")
_model = Emotion2VecSER(NUM_CLASSES).to(DEVICE)
ckpt   = torch.load(MODEL_PATH, map_location=DEVICE)
_model.load_state_dict(ckpt["model"])
_model.backbone._orig_fwd = _model.backbone.forward
_model.backbone.forward = types.MethodType(_no_mask_fwd, _model.backbone)
_model.eval()
print("✓ Model ready")


# ── FastAPI ───────────────────────────────────────────────────────────────────
app = FastAPI(title="Emotion SER API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictResult(BaseModel):
    filename:   str
    emotion:    str           # system key, e.g. "anger"
    confidence: float         # 0‒1
    scores:     dict[str, float]  # all 6 system keys


def predict_file(audio_bytes: bytes, filename: str) -> PredictResult:
    try:
        audio, _ = librosa.load(io.BytesIO(audio_bytes), sr=TARGET_SR, mono=True)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Cannot decode audio '{filename}': {e}")

    max_len = TARGET_SR * MAX_SEC
    if len(audio) > max_len:
        audio = audio[:max_len]
    else:
        audio = np.pad(audio, (0, max_len - len(audio)))

    wav = torch.FloatTensor(audio).unsqueeze(0).to(DEVICE)
    with torch.no_grad():
        logits = _model(wav)
        probs  = torch.softmax(logits, dim=1).squeeze(0).cpu().numpy()

    best_idx    = int(probs.argmax())
    model_label = MODEL_EMOTIONS[best_idx]
    scores = {
        LABEL_MAP[MODEL_EMOTIONS[i]]: round(float(probs[i]), 4)
        for i in range(NUM_CLASSES)
    }
    return PredictResult(
        filename=filename,
        emotion=LABEL_MAP[model_label],
        confidence=round(float(probs[best_idx]), 4),
        scores=scores,
    )


@app.get("/health")
def health():
    return {"status": "ok", "device": str(DEVICE)}


@app.post("/predict", response_model=List[PredictResult])
async def predict(files: List[UploadFile] = File(...)):
    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded")
    results = []
    for f in files:
        data = await f.read()
        results.append(predict_file(data, f.filename or "unknown"))
    return results
