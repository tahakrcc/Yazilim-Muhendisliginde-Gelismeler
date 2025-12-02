# Frontend Proje Yapısı

## Klasör Organizasyonu

```
frontend/
├── src/
│   ├── components/          # React component'leri
│   │   ├── layout/         # Layout component'leri
│   │   │   ├── Header.tsx
│   │   │   └── Header.css
│   │   ├── search/         # Arama component'leri
│   │   │   ├── SearchPanel.tsx
│   │   │   └── SearchPanel.css
│   │   ├── products/       # Ürün component'leri
│   │   │   ├── ProductResults.tsx
│   │   │   └── ProductResults.css
│   │   └── maps/          # Harita component'leri
│   │       ├── Map2D.tsx
│   │       ├── Map2D.css
│   │       ├── Map3D.tsx
│   │       ├── Map3D.css
│   │       ├── MapView.tsx
│   │       └── MapView.css
│   ├── types/             # TypeScript type tanımları
│   │   └── index.ts
│   ├── services/          # API servisleri
│   │   └── api.ts
│   ├── constants/         # Sabitler
│   │   └── index.ts
│   ├── utils/             # Yardımcı fonksiyonlar
│   │   └── index.ts
│   ├── App.tsx            # Ana component
│   ├── App.css
│   ├── main.tsx           # Entry point
│   └── index.css          # Global stiller
├── public/                # Statik dosyalar
├── package.json
├── tsconfig.json
├── vite.config.ts
└── Dockerfile
```

## Açıklama

### Components
- **layout/**: Sayfa düzeni component'leri (Header, Footer, vb.)
- **search/**: Arama ve filtreleme component'leri
- **products/**: Ürün listeleme ve detay component'leri
- **maps/**: 2D ve 3D harita görselleştirme component'leri

### Types
TypeScript interface ve type tanımları merkezi olarak burada tutulur.

### Services
API çağrıları ve backend ile iletişim burada yönetilir.

### Constants
Proje genelinde kullanılan sabit değerler (renkler, boyutlar, vb.)

### Utils
Yardımcı fonksiyonlar (formatPrice, sortByPrice, vb.)

## Avantajlar

✅ Modüler yapı
✅ Kolay bakım
✅ Yeniden kullanılabilir component'ler
✅ Type-safe kod
✅ Merkezi API yönetimi
✅ Temiz kod organizasyonu

