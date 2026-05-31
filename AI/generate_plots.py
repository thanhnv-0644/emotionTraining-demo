"""
Tạo 3 ảnh cho luận văn chương 5:
  1. training_curve.png     — accuracy theo epoch (train + val)
  2. class_distribution.png — số mẫu mỗi cảm xúc (train/val/test)
  3. data_sources.png       — tỉ lệ nguồn dữ liệu (ViSEC vs phim)

Chạy: python AI/generate_plots.py
Ảnh được lưu vào thư mục AI/
"""

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import numpy as np
from pathlib import Path

OUT = Path(__file__).parent
EMOTIONS_VI = ["Tức giận\n(angry)", "Sợ hãi\n(fear)", "Vui vẻ\n(happy)",
               "Trung tính\n(neutral)", "Buồn bã\n(sad)", "Ngạc nhiên\n(surprise)"]
EMOTIONS_EN = ["angry", "fear", "happy", "neutral", "sad", "surprise"]

plt.rcParams.update({
    "font.family": "DejaVu Sans",
    "axes.spines.top": False,
    "axes.spines.right": False,
    "figure.dpi": 150,
})

# ── 1. Training curve ─────────────────────────────────────────────────────────
epochs   = list(range(1, 19))
train_acc = [0.4070, 0.5994, 0.6475, 0.6828, 0.7275, 0.7372, 0.7598,
             0.7621, 0.7937, 0.8014, 0.8164, 0.8355, 0.8318, 0.8463,
             0.8602, 0.8630, 0.8597, 0.8697]
val_acc   = [0.5692, 0.6667, 0.6875, 0.7100, 0.7108, 0.7508, 0.7725,
             0.7133, 0.7583, 0.7725, 0.7817, 0.7725, 0.7842, 0.7758,
             0.7758, 0.7733, 0.7808, 0.7817]

fig, ax = plt.subplots(figsize=(9, 5))
ax.plot(epochs, [v * 100 for v in train_acc], "o-", color="#4C72B0",
        linewidth=2, markersize=5, label="Train accuracy")
ax.plot(epochs, [v * 100 for v in val_acc],   "s--", color="#DD8452",
        linewidth=2, markersize=5, label="Validation accuracy")

best_ep = val_acc.index(max(val_acc)) + 1
best_v  = max(val_acc) * 100
ax.axvline(best_ep, color="green", linestyle=":", linewidth=1.5, alpha=0.7)
ax.annotate(f"Best val\n{best_v:.2f}%\n(epoch {best_ep})",
            xy=(best_ep, best_v), xytext=(best_ep + 1.2, best_v - 8),
            arrowprops=dict(arrowstyle="->", color="green"),
            fontsize=9, color="green")

ax.axvline(18, color="red", linestyle=":", linewidth=1.5, alpha=0.6)
ax.text(17.5, 42, "Early\nstopping", ha="right", fontsize=8, color="red", alpha=0.8)

ax.set_xlabel("Epoch", fontsize=11)
ax.set_ylabel("Accuracy (%)", fontsize=11)
ax.set_title("Quá trình huấn luyện — Emotion2Vec fine-tune tiếng Việt", fontsize=12, fontweight="bold")
ax.set_xlim(0.5, 19)
ax.set_ylim(35, 95)
ax.set_xticks(epochs)
ax.legend(fontsize=10, loc="lower right")
ax.grid(axis="y", alpha=0.3)
fig.tight_layout()
fig.savefig(OUT / "training_curve.png", bbox_inches="tight")
plt.close(fig)
print("✓ training_curve.png")

# ── 2. Class distribution (train / val / test) ────────────────────────────────
train_counts = [946, 936, 946, 946, 946, 946]
val_counts   = [200, 200, 200, 200, 200, 200]
test_counts  = [200, 200, 200, 200, 200, 200]

x   = np.arange(len(EMOTIONS_VI))
w   = 0.28
fig, ax = plt.subplots(figsize=(10, 5))
b1 = ax.bar(x - w, train_counts, w, label="Train", color="#4C72B0", alpha=0.85)
b2 = ax.bar(x,     val_counts,   w, label="Validation", color="#DD8452", alpha=0.85)
b3 = ax.bar(x + w, test_counts,  w, label="Test", color="#55A868", alpha=0.85)

for bar in [*b1, *b2, *b3]:
    h = bar.get_height()
    ax.text(bar.get_x() + bar.get_width() / 2, h + 8, str(int(h)),
            ha="center", va="bottom", fontsize=7.5)

ax.set_xticks(x)
ax.set_xticklabels(EMOTIONS_VI, fontsize=9)
ax.set_ylabel("Số mẫu", fontsize=11)
ax.set_title("Phân phối mẫu theo cảm xúc và tập dữ liệu", fontsize=12, fontweight="bold")
ax.legend(fontsize=10)
ax.set_ylim(0, 1150)
ax.grid(axis="y", alpha=0.3)
fig.tight_layout()
fig.savefig(OUT / "class_distribution.png", bbox_inches="tight")
plt.close(fig)
print("✓ class_distribution.png")

# ── 3. Data sources — pie + bar ───────────────────────────────────────────────
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 5))

# Pie: tỉ lệ nguồn
sizes  = [50, 50]
labels = ["ViSEC\n(hustep-lab)\n~4.000 mẫu", "Phim & series\ntruyền hình Việt\n~4.000 mẫu"]
colors = ["#4C72B0", "#DD8452"]
wedges, texts, autotexts = ax1.pie(sizes, labels=labels, colors=colors,
                                    autopct="%1.0f%%", startangle=90,
                                    textprops={"fontsize": 10},
                                    wedgeprops={"edgecolor": "white", "linewidth": 2})
for at in autotexts:
    at.set_fontsize(13)
    at.set_fontweight("bold")
ax1.set_title("Tỉ lệ nguồn dữ liệu", fontsize=12, fontweight="bold")

# Bar: split
splits = ["Train\n(5.666)", "Validation\n(1.200)", "Test\n(1.200)"]
vals   = [5666, 1200, 1200]
cols   = ["#4C72B0", "#DD8452", "#55A868"]
bars   = ax2.bar(splits, vals, color=cols, alpha=0.85, width=0.5, edgecolor="white")
for bar, v in zip(bars, vals):
    ax2.text(bar.get_x() + bar.get_width() / 2, v + 60, f"{v:,}",
             ha="center", va="bottom", fontsize=11, fontweight="bold")
ax2.set_ylabel("Số mẫu", fontsize=11)
ax2.set_title("Phân chia tập dữ liệu (70/15/15)", fontsize=12, fontweight="bold")
ax2.set_ylim(0, 6800)
ax2.grid(axis="y", alpha=0.3)

fig.suptitle("Tổng quan bộ dữ liệu — 8.066 mẫu tiếng Việt, 6 cảm xúc",
             fontsize=13, fontweight="bold", y=1.01)
fig.tight_layout()
fig.savefig(OUT / "data_sources.png", bbox_inches="tight")
plt.close(fig)
print("✓ data_sources.png")

print("\nXong! Copy 3 file PNG vào thư mục figures/ của LaTeX.")
