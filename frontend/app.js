const API_BASE_URL = 'http://localhost:8080/api';

// Login form handler
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        displayResponse('Login Response', data);
    } catch (error) {
        displayResponse('Login Error', { error: error.message });
    }
});

// Register form handler
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const name = document.getElementById('regName').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, name }),
        });

        const data = await response.json();
        displayResponse('Register Response', data);
    } catch (error) {
        displayResponse('Register Error', { error: error.message });
    }
});

// Health check handler
document.getElementById('healthCheckBtn').addEventListener('click', async () => {
    const statusDiv = document.getElementById('healthStatus');
    statusDiv.textContent = 'Kontrol ediliyor...';
    statusDiv.className = 'status';

    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        const data = await response.json();
        
        if (response.ok) {
            statusDiv.textContent = `✅ Backend çalışıyor! Status: ${data.status || 'OK'}`;
            statusDiv.className = 'status success';
            displayResponse('Health Check', data);
        } else {
            throw new Error('Backend yanıt vermiyor');
        }
    } catch (error) {
        statusDiv.textContent = `❌ Backend'e bağlanılamadı: ${error.message}`;
        statusDiv.className = 'status error';
        displayResponse('Health Check Error', { error: error.message });
    }
});

// Display response in the response area
function displayResponse(title, data) {
    const responseArea = document.getElementById('responseArea');
    const timestamp = new Date().toLocaleTimeString();
    responseArea.textContent = `[${timestamp}] ${title}:\n${JSON.stringify(data, null, 2)}\n\n${responseArea.textContent}`;
}

