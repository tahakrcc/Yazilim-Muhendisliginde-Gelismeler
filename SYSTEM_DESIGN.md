# Sistem Tasarımı ve Akış Diyagramı

Aşağıda, kullanıcının sistem üzerinden ürün araması ve seçilen ürüne navigasyon başlatması sürecini gösteren **Sequence Diagram (Sıralama Diyagramı)** yer almaktadır.

Bu diyagram **MermaidJS** formatındadır ve markdown destekleyen görüntüleyicilerde (GitHub, GitLab, VS Code vb.) otomatik olarak render edilir.

```mermaid
sequenceDiagram
    autonumber
    actor User as Kullanıcı
    participant FE as Frontend (React)
    participant BE as Backend (Spring Boot)
    participant DB as Veritabanı (MongoDB)
    participant AI as AI Servisi (MCP/Gemini)

    Note over User, AI: Ürün Arama ve Navigasyon Senaryosu

    User->>FE: Arama kutusuna "Domates" yazar
    FE->>BE: GET /api/products/search?q=domates
    activate BE
    BE->>DB: Ürünleri bul (Regex/Text Search)
    activate DB
    DB-->>BE: [Domates, Salkım Domates]
    deactivate DB
    BE-->>FE: Ürün Listesi JSON
    deactivate BE
    
    FE-->>User: Sonuçları Listeler

    User->>FE: "Salkım Domates" detayına tıklar
    FE->>BE: GET /api/products/{id}/cheapest
    activate BE
    BE->>DB: En ucuz fiyatı sorgula
    activate DB
    DB-->>BE: Fiyat ve Market Bilgisi
    deactivate DB
    BE-->>FE: Detay Bilgisi
    deactivate BE

    User->>FE: "Haritada Göster" butonuna tıklar
    
    par Harita Verisi
        FE->>BE: GET /api/markets/{marketId}/map
        BE-->>FE: Pazar Planı ve Tezgah Koordinatları
    and AI Desteği (Opsiyonel)
        FE->>AI: "Salkım domates nerede?"
        AI-->>FE: " Girişten sağa dönün, 3. tezgah."
    end

    FE-->>User: 3D/2D Harita üzerinde rotayı çizer
```
