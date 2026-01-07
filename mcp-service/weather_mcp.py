import os
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import google.generativeai as genai

# --- Configuration ---
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    print("WARNING: GEMINI_API_KEY is not set!")

# Configure Gemini
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

# Initialize FastAPI
app = FastAPI(title="Pazar AI Service")

# CORS (Allow Frontend to connect)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, specify domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Mock Data Context for AI ---
MARKET_CONTEXT = """
Sen "Pazar Yönetim Sistemi" için akıllı bir asistansın.
Aşağıdaki 'Sanal Pazar Verileri'ne tam erişimin var.
Kullanıcı sana soru sorduğunda bu verilerden cevap ver.

VERİLER:
1. Beşiktaş Cumartesi Pazarı (ID: market_1)
   - Konum: Beşiktaş, İstanbul
   - Durum: Bugün AÇIK
   - Öne Çıkan Ürünler: 
     * Salkım Domates (20 TL/kg) - En Ucuz!
     * Amasya Elması (25 TL/kg)
     * Çengelköy Salatalık (30 TL/kg)

2. Kadıköy Salı Pazarı (ID: market_2)
   - Konum: Kadıköy, İstanbul
   - Durum: Bugün KAPALI
   - Ürünler: Genelde tekstil ağırlıklı ama sebze de var.

3. Feriköy Organik Pazarı (ID: market_3)
   - Konum: Şişli, İstanbul
   - Durum: Bugün AÇIK
   - Öne Çıkanlar: Organik Yumurta (45 TL/10lu), Taze Yeşillikler.

KURALLAR:
1. Kullanıcı "Domates nerede?" derse, açık pazarlardaki fiyatları karşılaştır. "Beşiktaş'ta 20 TL" de.
2. Eğer kullanıcı bir yere gitmek istiyorsa veya "beni oraya götür" derse, cevabının sonuna MUTLAKA JSON formatında aksiyon ekle.
3. Sohbet normal devam ediyorsa sadece metin dön.
4. Çıktın HER ZAMAN JSON formatında olmalı:
   {
     "text": "Kullanıcıya gösterilecek mesaj",
     "action": { "type": "NAVIGATE", "marketId": "market_1", "productId": "p1" } // Opsiyonel
   }
"""

class ChatRequest(BaseModel):
    message: str

@app.get("/health")
def health_check():
    return {"status": "ok"}


# --- Rule Based Fallback ---
def rule_based_fallback(message):
    msg_lower = message.lower()
    
    # 1. Product Search
    if "domates" in msg_lower:
        return '{ "text": "En ucuz Salkım Domates Beşiktaş Pazarında 20 TL.", "action": { "type": "NAVIGATE", "marketId": "market_1", "productId": "p_tom" } }'
    elif "elma" in msg_lower:
        return '{ "text": "Amasya Elması Beşiktaş Pazarında 25 TL.", "action": { "type": "NAVIGATE", "marketId": "market_1", "productId": "p_app" } }'
    elif "salatalık" in msg_lower:
        return '{ "text": "Çengelköy Salatalık Beşiktaş Pazarında 30 TL.", "action": { "type": "NAVIGATE", "marketId": "market_1", "productId": "p_cuc" } }'
    elif "yumurta" in msg_lower:
        return '{ "text": "Organik Yumurta Feriköy Pazarında 45 TL (10lu).", "action": { "type": "NAVIGATE", "marketId": "market_3", "productId": "p_egg" } }'
        
    # 2. Market Status
    elif "beşiktaş" in msg_lower and ("açık" in msg_lower or "ne zaman" in msg_lower):
        return '{ "text": "Beşiktaş Pazarı bugün AÇIK. (Cumartesi günleri kurulur)" }'
    elif "kadıköy" in msg_lower:
        return '{ "text": "Kadıköy Pazarı bugün KAPALI. Salı günleri hizmet vermektedir." }'
    elif "feriköy" in msg_lower:
        return '{ "text": "Feriköy Organik Pazarı bugün AÇIK." }'
        
    # 3. General Greetings
    elif "merhaba" in msg_lower or "selam" in msg_lower:
        return '{ "text": "Merhaba! Size en ucuz pazar ürünlerini bulmanızda yardımcı olabilirim." }'
    elif "nasılsın" in msg_lower:
        return '{ "text": "Sanal bir asistan olduğum için duygularım yok ama sistemlerim gayet iyi çalışıyor! Size nasıl yardım edebilirim?" }'
        
    # Default
    return '{ "text": "Bu konuda şu an bilgim yok ama pazardaki diğer ürünleri sorabilirsiniz. (Örn: Domates, Elma)" }'

@app.post("/chat")
def chat_endpoint(req: ChatRequest):
    print(f"DEBUG: Received message: {req.message}", flush=True)
    
    try:
        # Construct Prompt
        full_system_prompt = f"{MARKET_CONTEXT}\n\nKULLANICI: {req.message}\nASİSTAN (JSON):"
        
        # Call Gemini via REST API (requests) to avoid gRPC/Container issues
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={API_KEY}"
        headers = {'Content-Type': 'application/json'}
        payload = {
            "contents": [{
                "parts": [{"text": full_system_prompt}]
            }]
        }

        print("DEBUG: Calling Gemini REST API...", flush=True)
        try:
            response = requests.post(url, headers=headers, json=payload, timeout=5) # Reduced timeout for faster fallback
            
            if response.status_code != 200:
                print(f"ERROR: Gemini API returned {response.status_code}. Using Fallback.", flush=True)
                return rule_based_fallback(req.message)

            data = response.json()
            # ... response parsing (same as before) ...
            try:
                response_text = data["candidates"][0]["content"]["parts"][0]["text"]
                clean_text = response_text.replace("```json", "").replace("```", "").strip()
                return clean_text
            except Exception:
                 return rule_based_fallback(req.message)

        except Exception as api_err:
             print(f"ERROR: API Request failed: {api_err}. Using Fallback.", flush=True)
             return rule_based_fallback(req.message)
        
    except Exception as e:
        print(f"CRITICAL ERROR: {e}. Using Fallback.", flush=True)
        return rule_based_fallback(req.message)

if __name__ == "__main__":
    print("Starting AI Service on port 8000...", flush=True)
    uvicorn.run(app, host="0.0.0.0", port=8000)
