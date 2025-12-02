const API_BASE_URL = 'http://localhost:8080/api';

let currentMarket = 'market_1';
let currentProducts = [];
let selectedProduct = null;
let mapCanvas, mapCtx;

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    mapCanvas = document.getElementById('mapCanvas');
    mapCtx = mapCanvas.getContext('2d');
    
    initializeEventListeners();
    loadMarkets();
    drawMap2D();
});

function initializeEventListeners() {
    // Arama
    document.getElementById('searchBtn').addEventListener('click', performSearch);
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    // Filtreler
    document.getElementById('marketSelect').addEventListener('change', (e) => {
        currentMarket = e.target.value || 'market_1';
        if (currentProducts.length > 0) {
            displayResults(currentProducts);
        }
    });

    document.getElementById('cheapestBtn').addEventListener('click', () => {
        filterByCheapest();
    });

    document.getElementById('freshestBtn').addEventListener('click', () => {
        filterByFreshest();
    });

    // Tab değiştirme
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            switchTab(e.target.dataset.tab);
        });
    });

    // 3D kat değiştirme
    document.querySelectorAll('.floor-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            switchFloor(parseInt(e.target.dataset.floor));
        });
    });
}

async function performSearch() {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) {
        alert('Lütfen bir ürün adı girin');
        return;
    }

    try {
        const marketId = document.getElementById('marketSelect').value || 'market_1';
        const response = await fetch(`${API_BASE_URL}/products/search?query=${encodeURIComponent(query)}&marketId=${marketId}`);
        const data = await response.json();

        currentProducts = data.results || [];
        displayResults(currentProducts);
        displayAISuggestions(data.aiSuggestions || []);

        // Eğer sonuç varsa, haritada göster
        if (currentProducts.length > 0) {
            drawProductsOnMap(currentProducts);
        }
    } catch (error) {
        console.error('Arama hatası:', error);
        alert('Arama sırasında bir hata oluştu');
    }
}

function displayResults(products) {
    const container = document.getElementById('resultsContainer');
    container.innerHTML = '';

    if (products.length === 0) {
        container.innerHTML = '<p>Sonuç bulunamadı</p>';
        return;
    }

    products.forEach(product => {
        const card = createProductCard(product);
        container.appendChild(card);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    if (selectedProduct && selectedProduct.id === product.id) {
        card.classList.add('selected');
    }

    const minPrice = product.minPrice || 'N/A';
    const stallNumber = product.stallNumber || '-';
    const vendorName = product.vendorName || '-';

    card.innerHTML = `
        <div class="product-name">${product.name}</div>
        <div class="product-info">
            <span>Kategori: ${product.category}</span>
            <span>Birim: ${product.unit}</span>
        </div>
        <div class="product-price">💰 ${minPrice} ₺</div>
        <div class="product-info">
            <span>📍 Tezgah: ${stallNumber}</span>
            <span>🏪 ${vendorName}</span>
        </div>
        ${product.allPrices && product.allPrices.length > 1 ? `
            <div class="price-comparison">
                <strong>Fiyat Karşılaştırması:</strong>
                ${product.allPrices.map(p => `
                    <div class="price-item">
                        <span>${p.stallNumber} - ${p.vendorName}</span>
                        <span>${p.price} ₺</span>
                    </div>
                `).join('')}
            </div>
        ` : ''}
    `;

    card.addEventListener('click', () => {
        selectProduct(product);
        showStallOnMap(product);
        showStallDetails(product);
    });

    return card;
}

function selectProduct(product) {
    selectedProduct = product;
    document.querySelectorAll('.product-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
}

function displayAISuggestions(suggestions) {
    const container = document.getElementById('aiSuggestions');
    container.innerHTML = '';

    if (suggestions.length === 0) return;

    const title = document.createElement('div');
    title.textContent = '🤖 AI Önerileri:';
    title.style.fontWeight = '600';
    title.style.marginBottom = '8px';
    container.appendChild(title);

    suggestions.forEach(suggestion => {
        const badge = document.createElement('span');
        badge.className = 'ai-suggestion';
        badge.textContent = suggestion;
        badge.addEventListener('click', () => {
            document.getElementById('searchInput').value = suggestion;
            performSearch();
        });
        container.appendChild(badge);
    });
}

function drawMap2D() {
    // Harita arka planı
    mapCtx.fillStyle = '#f5f5f5';
    mapCtx.fillRect(0, 0, mapCanvas.width, mapCanvas.height);

    // Grid çizgileri
    mapCtx.strokeStyle = '#e0e0e0';
    mapCtx.lineWidth = 1;
    for (let i = 0; i <= mapCanvas.width; i += 40) {
        mapCtx.beginPath();
        mapCtx.moveTo(i, 0);
        mapCtx.lineTo(i, mapCanvas.height);
        mapCtx.stroke();
    }
    for (let i = 0; i <= mapCanvas.height; i += 40) {
        mapCtx.beginPath();
        mapCtx.moveTo(0, i);
        mapCtx.lineTo(mapCanvas.width, i);
        mapCtx.stroke();
    }

    // Giriş noktası
    mapCtx.fillStyle = '#2196F3';
    mapCtx.beginPath();
    mapCtx.arc(20, 20, 8, 0, Math.PI * 2);
    mapCtx.fill();
    mapCtx.fillStyle = '#333';
    mapCtx.font = '10px Arial';
    mapCtx.fillText('Giriş', 5, 40);
}

function drawProductsOnMap(products) {
    drawMap2D(); // Haritayı yeniden çiz

    products.forEach((product, index) => {
        if (product.location) {
            const x = product.location.x;
            const y = product.location.y;
            const isCheapest = index === 0 || product.minPrice === Math.min(...products.map(p => p.minPrice || Infinity));

            // Tezgah çiz
            mapCtx.fillStyle = isCheapest ? '#4CAF50' : '#FF9800';
            mapCtx.fillRect(x - 15, y - 15, 30, 30);
            mapCtx.strokeStyle = '#333';
            mapCtx.lineWidth = 2;
            mapCtx.strokeRect(x - 15, y - 15, 30, 30);

            // Tezgah numarası
            mapCtx.fillStyle = '#fff';
            mapCtx.font = 'bold 10px Arial';
            mapCtx.textAlign = 'center';
            mapCtx.fillText(product.stallNumber || '?', x, y + 4);

            // Ürün adı
            mapCtx.fillStyle = '#333';
            mapCtx.font = '9px Arial';
            mapCtx.fillText(product.name.substring(0, 8), x, y + 25);

            // Tıklanabilir alan
            mapCanvas.addEventListener('click', (e) => {
                const rect = mapCanvas.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const clickY = e.clientY - rect.top;
                
                if (clickX >= x - 15 && clickX <= x + 15 && clickY >= y - 15 && clickY <= y + 15) {
                    selectProduct(product);
                    showStallDetails(product);
                }
            });
        }
    });
}

function showStallOnMap(product) {
    if (!product.location) return;

    // 3D görünümde de göster
    const stall3D = document.querySelector(`.stall-3d[data-stall="${product.stallNumber}"]`);
    if (stall3D) {
        document.querySelectorAll('.stall-3d').forEach(s => s.classList.remove('selected'));
        stall3D.classList.add('selected');
    }
}

function showStallDetails(product) {
    const container = document.getElementById('stallDetails');
    
    if (!product.location) {
        container.innerHTML = '<p>Bu ürün için konum bilgisi bulunamadı</p>';
        return;
    }

    container.innerHTML = `
        <div class="stall-detail">
            <strong>Tezgah:</strong> ${product.stallNumber || '-'}<br>
            <strong>Satıcı:</strong> ${product.vendorName || '-'}<br>
            <strong>Fiyat:</strong> ${product.minPrice || 'N/A'} ₺<br>
            <strong>Konum:</strong> X: ${product.location.x}, Y: ${product.location.y}
        </div>
        <div class="route-info">
            <h4>📍 Yol Tarifi</h4>
            <p>Pazar girişinden ${product.stallNumber} numaralı tezgaha yürüyün.</p>
            <p>Tahmini süre: 2-3 dakika</p>
        </div>
    `;
}

async function filterByCheapest() {
    if (currentProducts.length === 0) {
        alert('Önce bir arama yapın');
        return;
    }

    const marketId = document.getElementById('marketSelect').value || 'market_1';
    const sorted = [...currentProducts].sort((a, b) => {
        const priceA = a.minPrice || Infinity;
        const priceB = b.minPrice || Infinity;
        return priceA - priceB;
    });

    displayResults(sorted);
    drawProductsOnMap(sorted);
}

function filterByFreshest() {
    if (currentProducts.length === 0) {
        alert('Önce bir arama yapın');
        return;
    }

    // Taze ürünleri önce göster (freshness = "Taze" olanlar)
    const sorted = [...currentProducts].sort((a, b) => {
        const freshA = a.freshness === 'Taze' ? 1 : 0;
        const freshB = b.freshness === 'Taze' ? 1 : 0;
        return freshB - freshA;
    });

    displayResults(sorted);
    drawProductsOnMap(sorted);
}

function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.map-view').forEach(view => view.classList.remove('active'));
    
    document.querySelector(`.tab-btn[data-tab="${tab}"]`).classList.add('active');
    document.getElementById(`map${tab.toUpperCase()}`).classList.add('active');
}

function switchFloor(floor) {
    document.querySelectorAll('.floor-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // 3D görünümde kat değiştirme animasyonu
    const view = document.getElementById('3dView');
    view.style.transform = `translateY(${floor * -10}px)`;
    view.style.transition = 'transform 0.3s';
}

async function loadMarkets() {
    try {
        const response = await fetch(`${API_BASE_URL}/markets`);
        const markets = await response.json();
        
        const select = document.getElementById('marketSelect');
        select.innerHTML = '<option value="">Tüm Pazarlar</option>';
        
        markets.forEach(market => {
            const option = document.createElement('option');
            option.value = market.id;
            option.textContent = market.name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Pazarlar yüklenemedi:', error);
    }
}

// Harita canvas'a tıklama ile etkileşim
mapCanvas.addEventListener('click', (e) => {
    const rect = mapCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Tıklanan tezgahı bul
    currentProducts.forEach(product => {
        if (product.location) {
            const px = product.location.x;
            const py = product.location.y;
            if (Math.abs(x - px) < 20 && Math.abs(y - py) < 20) {
                selectProduct(product);
                showStallDetails(product);
            }
        }
    });
});
