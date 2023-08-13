# Use a base Python image
FROM python:3.9
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends wget \
    && rm -rf /var/lib/apt/lists/*
RUN apt-get update && apt-get install -y libgl1-mesa-glx
COPY /mahai/code .
RUN pip install --no-cache-dir -r requirements.txt
RUN apt-get update && apt-get install -y curl
RUN wget -O S3D.onnx https://sc.link/BNnGk

ENTRYPOINT [ "python", "server.py" ]