const API_URL = 'http://localhost:3000/api';

document.querySelectorAll('.nav-btn').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
        button.classList.add('active');
        document.getElementById(button.dataset.target).classList.add('active');
    });
});

function showAlert(message, type = 'success') {
    const alertBox = document.getElementById('alertBox');
    alertBox.textContent = message;
    alertBox.className = `alert alert-${type} show`;
    setTimeout(() => { alertBox.classList.remove('show'); }, 4000);
}

async function apiCall(endpoint, payload) {
    try {
        const response = await fetch(`${API_URL}/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        if(!response.ok) throw new Error(data.message || 'Terjadi Kesalahan Server');
        return data;
    } catch (err) {
        showAlert(err.message, 'error');
        throw err;
    }
}

document.getElementById('formCreateVps').addEventListener('submit', async (e) => {
    e.preventDefault();
    const resultBox = document.getElementById('vpsResult');
    resultBox.style.display = 'block';
    resultBox.textContent = 'Memproses request ke DigitalOcean...';
    try {
        const res = await apiCall('vps/create', {
            apiKey: document.getElementById('doApiKey').value,
            hostname: document.getElementById('vpsHostname').value,
            spec: document.getElementById('vpsSpec').value,
            region: document.getElementById('vpsRegion').value,
            image: document.getElementById('vpsImage').value
        });
        resultBox.textContent = `VPS Created!\nIP: ${res.ip}\nPassword: ${res.password}\nID: ${res.id}`;
        showAlert('Berhasil membuat VPS!', 'success');
    } catch (err) {
        resultBox.textContent = `Error: ${err.message}`;
    }
});

document.getElementById('btnListVps').addEventListener('click', async () => {
    const resultBox = document.getElementById('vpsResult');
    resultBox.style.display = 'block';
    resultBox.textContent = 'Mengambil data server...';
    try {
        const res = await apiCall('vps/list', {
            apiKey: document.getElementById('doApiKey').value
        });
        resultBox.textContent = JSON.stringify(res.droplets, null, 2);
    } catch (err) {
        resultBox.textContent = `Error: ${err.message}`;
    }
});

document.getElementById('formInstall').addEventListener('submit', async (e) => {
    e.preventDefault();
    const resultBox = document.getElementById('instResult');
    resultBox.style.display = 'block';
    resultBox.textContent = 'Menghubungkan ke SSH dan mengeksekusi script...';
    try {
        const res = await apiCall('install/run', {
            ip: document.getElementById('instIp').value,
            pass: document.getElementById('instPass').value,
            domain: document.getElementById('instDomain').value,
            action: document.getElementById('instAction').value
        });
        resultBox.textContent = `Status: Sukses\n\nLog Eksekusi:\n${res.log}`;
        showAlert('Instalasi selesai.', 'success');
    } catch (err) {
        resultBox.textContent = `Installer Failed: \n${err.message}`;
    }
});

document.getElementById('formProtect').addEventListener('submit', async (e) => {
    e.preventDefault();
    await handleProtectAction('install');
});

document.getElementById('btnUnprotect').addEventListener('click', async () => {
    await handleProtectAction('uninstall');
});

async function handleProtectAction(action) {
    const resultBox = document.getElementById('protResult');
    resultBox.style.display = 'block';
    resultBox.textContent = `Menjalankan ${action} protect...`;
    try {
        const res = await apiCall('protect/run', {
            ip: document.getElementById('protIp').value,
            pass: document.getElementById('protPass').value,
            protectId: document.getElementById('protType').value,
            action: action
        });
        resultBox.textContent = res.message + '\n\n' + res.log;
        showAlert(`${action} protect berhasil`, 'success');
    } catch (err) {
        resultBox.textContent = `Error: ${err.message}`;
    }
}

document.getElementById('formPanel').addEventListener('submit', async (e) => {
    e.preventDefault();
    const resultBox = document.getElementById('pnlResult');
    resultBox.style.display = 'block';
    resultBox.textContent = 'Mengirim request ke Pterodactyl API...';
    try {
        const res = await apiCall('panel/create', {
            domain: document.getElementById('pnlDomain').value,
            apiKey: document.getElementById('pnlKey').value,
            username: document.getElementById('pnlUser').value,
            memory: document.getElementById('pnlPlan').value,
            nodeId: document.getElementById('pnlNode').value,
            eggId: document.getElementById('pnlEgg').value,
            locId: document.getElementById('pnlLoc').value
        });
        resultBox.textContent = `Panel Created Successfully!\n\nEmail: ${res.email}\nUsername: ${res.username}\nPassword: ${res.password}`;
        showAlert('Panel Berhasil Dibuat', 'success');
    } catch (err) {
        resultBox.textContent = `Error: ${err.message}`;
    }
});

document.getElementById('formEncrypt').addEventListener('submit', async (e) => {
    e.preventDefault();
    const outputBox = document.getElementById('encOutput');
    outputBox.value = 'Mengenkripsi kode...';
    try {
        const res = await apiCall('encrypt/run', {
            code: document.getElementById('encInput').value,
            method: document.getElementById('encMethod').value
        });
        outputBox.value = res.encryptedCode;
        showAlert('Enkripsi Berhasil!', 'success');
    } catch (err) {
        outputBox.value = `Gagal: ${err.message}`;
    }
});