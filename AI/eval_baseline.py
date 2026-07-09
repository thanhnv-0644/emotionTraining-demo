"""
Đánh giá accuracy của emotion2vec_plus_base (CHƯA fine-tune) trên test set.
So sánh baseline vs sau fine-tune (75.42%).

Chạy:
    cd AI
    python eval_baseline.py
"""

import re
import numpy as np
import pandas as pd
import librosa
import torch
from pathlib import Path
from tqdm import tqdm
from funasr import AutoModel

# ── Config ────────────────────────────────────────────────────────────────────
TEST_CSV   = Path(__file__).parent.parent / "test.csv"
TARGET_SR  = 16_000
MAX_SEC    = 6
DEVICE     = "cuda" if torch.cuda.is_available() else "cpu"

# 6 lớp của bộ dataset
OUR_EMOTIONS = ["angry", "fear", "happy", "neutral", "sad", "surprise"]

# Base model dùng 9 lớp → map về 6 lớp của ta
BASE_LABEL_MAP = {
    "angry":     "angry",
    "disgusted": "angry",    # gần nhất
    "fearful":   "fear",
    "happy":     "happy",
    "neutral":   "neutral",
    "other":     "neutral",  # gần nhất
    "sad":       "sad",
    "surprised": "surprise",
    "<unk>":     "neutral",
}

# ── Load base model ───────────────────────────────────────────────────────────
print("Tải emotion2vec_plus_base (base, chưa fine-tune)...")
model = AutoModel(
    model="iic/emotion2vec_plus_base",
    model_hub="hf",
    disable_update=True,
)
print("✓ Model loaded\n")

# ── Load test set ─────────────────────────────────────────────────────────────
df = pd.read_csv(TEST_CSV)

# Fix đường dẫn nếu cần (path trong CSV có thể khác máy)
def fix_path(p: str) -> str:
    match = re.search(r'processed[/\\](.+)', p)
    if match:
        base = Path("/Users/nvt/Documents/GR/dataset_v2/processed")
        return str(base / match.group(1))
    return p

df["path"] = df["path"].apply(fix_path)
df = df[df["path"].apply(lambda p: Path(p).exists())].reset_index(drop=True)
print(f"Test samples: {len(df)}\n")

# ── Inference ─────────────────────────────────────────────────────────────────
y_true, y_pred = [], []
errors = 0

for _, row in tqdm(df.iterrows(), total=len(df), desc="Evaluating", ncols=70):
    try:
        # Load audio
        audio, _ = librosa.load(row["path"], sr=TARGET_SR, mono=True)
        max_len = TARGET_SR * MAX_SEC
        if len(audio) > max_len:
            audio = audio[:max_len]
        else:
            audio = np.pad(audio, (0, max_len - len(audio)))

        # Predict với base model
        res = model.generate(
            input=audio,
            output_dir=None,
            granularity="utterance",
            extract_embedding=False,
        )

        # Lấy label có score cao nhất
        scores = res[0]["scores"]      # list of float
        labels = res[0]["labels"]      # list of str
        best_label = labels[int(np.argmax(scores))]

        # Map về 6 lớp
        pred = BASE_LABEL_MAP.get(best_label, "neutral")

        y_true.append(row["emotion"])
        y_pred.append(pred)

    except Exception as e:
        errors += 1

# ── Kết quả ──────────────────────────────────────────────────────────────────
y_true = np.array(y_true)
y_pred = np.array(y_pred)
acc = (y_true == y_pred).mean()

print(f"\n{'='*50}")
print(f"  Baseline Accuracy (chưa fine-tune): {acc*100:.2f}%")
print(f"  Fine-tuned Accuracy:                75.42%")
print(f"  Cải thiện:                         +{(0.7542 - acc)*100:.2f}%")
print(f"{'='*50}")

print(f"\n{'Class':12s} {'Correct':>8} {'Total':>6} {'Acc':>7}")
print("-" * 36)
for emo in OUR_EMOTIONS:
    mask    = y_true == emo
    correct = ((y_pred == emo) & mask).sum()
    total   = mask.sum()
    print(f"{emo:12s} {correct:>8} {total:>6} {correct/total*100:>6.1f}%")

if errors:
    print(f"\n⚠ Lỗi đọc file: {errors} samples")
