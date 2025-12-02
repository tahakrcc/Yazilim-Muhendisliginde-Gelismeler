# Port Bilgilendirmesi

## Frontend Portu Değişti

Frontend artık **port 5173**'te çalışıyor (Vite default portu).

### Erişim
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:8080
- **Swagger**: http://localhost:8080/swagger-ui.html

### Neden Değişti?
- Port 3000 ve 3001 başka uygulamalar tarafından kullanılıyordu
- Vite'ın default portu 5173 olduğu için bu porta geçildi
- Port çakışması sorunu çözüldü

### Çalıştırma

```bash
cd frontend
npm run dev
```

Tarayıcı otomatik açılacak: http://localhost:5173

