FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY weather_mcp.py .

# MCP stdio üzerinden çalışır ama docker içinde genelde bir server gibi çalışması beklenir.
# Ancak MCP'nin doğası gereği genellikle stdio veya SSE kullanılır.
# Ödev kapsamında "servis" denildiği için sürekli çalışan bir yapı kuruyoruz.
# FastMCP run komutu stdio dinler.

CMD ["python", "weather_mcp.py"]
