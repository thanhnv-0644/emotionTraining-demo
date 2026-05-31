FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY inference_server.py .
COPY emotion2vec_viet_finetuned.pt .
EXPOSE 8000
CMD ["uvicorn", "inference_server:app", "--host", "0.0.0.0", "--port", "8000"]
