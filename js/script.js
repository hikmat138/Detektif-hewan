const students = [
    "Abizar", "Ahmad Maftuhi", "Ali Bardan", "Aqila", "Ariijna", "Aulia",
    "Deni", "Dinda Bela", "Fano", "Faunio", "Hana Wulan", "Hazmi",
    "Jallaludin", "Muayyyad", "Afian", "Dana", "Fauzan", "Ilyas",
    "Imron", "Kenzi", "Nabil", "Naelul", "Nafisha", "Naufal",
    "Neisya", "Raesha", "Raziq", "Siren", "Syahdan", "Siti Hana",
    "Suci Indriyani", "Tania", "Ulufiyah", "Zea"
];

let scores = {};
students.forEach(s => scores[s] = 0);
let currentStudent = "Nama Siswa";
let isSpinning = false;

function showScreen(id) {
    document.querySelectorAll('.view-screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if (id === 'screenScore') renderScoreboard();
}

const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');

// PENGGAMBARAN RODA DENGAN CANVAS (PAS PRESI DI TENGAH 200, 200)
function drawWheel() {
    const numSlices = students.length;
    const sliceAngle = (2 * Math.PI) / numSlices;
    ctx.clearRect(0, 0, 400, 400);
    
    students.forEach((name, i) => {
        const angle = i * sliceAngle;
        
        // 1. Gambar Potongan Roda
        ctx.beginPath();
        ctx.fillStyle = i % 2 === 0 ? '#ffb703' : '#00b4d8';
        ctx.moveTo(200, 200);
        ctx.arc(200, 200, 195, angle, angle + sliceAngle);
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();
        
        // 2. Teks Nama Murid (Sangat Jelas)
        ctx.save();
        ctx.translate(200, 200);
        ctx.rotate(angle + sliceAngle / 2);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px Nunito, sans-serif';
        ctx.textAlign = 'right';
        ctx.shadowColor = "rgba(0,0,0,0.8)";
        ctx.shadowBlur = 2;
        
        ctx.fillText(name, 185, 4);
        ctx.restore();
    });
}

let currentRotation = 0;

function spinWheel() {
    if (isSpinning) return;
    isSpinning = true;
    
    if (typeof playVO === 'function') playVO('putar');
    
    const randomExtraDegrees = Math.floor(Math.random() * 360) + 1800;
    currentRotation += randomExtraDegrees;
    
    canvas.style.transition = "transform 4s cubic-bezier(0.15, 0.99, 0.18, 1)";
    canvas.style.transform = `rotate(${currentRotation}deg)`;
    
    setTimeout(() => {
        isSpinning = false;
        
        const actualDeg = currentRotation % 360;
        const sliceSize = 360 / students.length;
        const selectedIndex = Math.floor((360 - (actualDeg % 360) + 270) % 360 / sliceSize) % students.length;
        
        currentStudent = students[selectedIndex];
        
        document.getElementById('activeStudentLabel').innerText = `Detektif: ${currentStudent}`;
        document.getElementById('boxStudentTitle').innerText = `Detektif ${currentStudent}, Buka Kotak Misterimu! 🎁`;
        
        showScreen('screenBox');
    }, 4000);
}

function openMysteryBox() {
    if (typeof playVO === 'function') playVO('putar');
    const challengeTypes = [1, 2, 3, 4, 5];
    const randomType = challengeTypes[Math.floor(Math.random() * challengeTypes.length)];
    
    showScreen('screenChallenge');
    loadChallenge(randomType);
}

function loadChallenge(type) {
    const body = document.getElementById('challengeBody');
    const title = document.getElementById('challengeTitle');
    body.innerHTML = '';

    if (type === 1) {
        title.innerText = "Tantangan 1: Pilihan Ganda Perkembangbiakan";
        body.innerHTML = `
            <img src="assets/images/kucing.jpg" class="img-challenge">
            <p style="font-weight:800; font-size:1.2rem;">Bagaimana cara Kucing berkembang biak?</p>
            <div class="opt-grid">
                <button class="btn-opt" onclick="evalAnswer(true)">VIVIPAR (Melahirkan)</button>
                <button class="btn-opt" onclick="evalAnswer(false)">OVIPAR (Bertelur)</button>
                <button class="btn-opt" onclick="evalAnswer(false)">OVOVIVIPAR</button>
            </div>
        `;
    } else if (type === 2) {
        title.innerText = "Tantangan 2: Pernyataan Benar atau Salah";
        body.innerHTML = `
            <img src="assets/images/ayam.jpg" class="img-challenge">
            <p style="font-weight:800; font-size:1.2rem;">Pernyataan: "Ayam berkembang biak dengan cara melahirkan."</p>
            <div class="opt-grid">
                <button class="btn-opt" style="background:#38b000; color:white;" onclick="evalAnswer(false)">BENAR</button>
                <button class="btn-opt" style="background:#d90429; color:white;" onclick="evalAnswer(true)">SALAH</button>
            </div>
        `;
    } else {
        title.innerText = "Tantangan 3: Urutkan Siklus Hidup!";
        body.innerHTML = `
            <p style="font-weight:800;">Urutan Siklus Hidup yang benar:</p>
            <div class="opt-grid">
                <div class="drop-box">1. Telur</div>
                <div class="drop-box">2. Anak Ayam</div>
                <div class="drop-box">3. Ayam Dewasa</div>
            </div>
            <button class="btn-green-3d" style="margin-top:15px;" onclick="evalAnswer(true)">PERIKSA JAWABAN</button>
        `;
    }
}

function evalAnswer(isCorrect) {
    if (isCorrect) {
        if (currentStudent !== "Nama Siswa") scores[currentStudent] += 10;
        if (typeof playVO === 'function') playVO('benar');
        showPopup('BENAR', `Hebat Detektif ${currentStudent}! Jawabanmu Tepat (+10 Poin)`);
    } else {
        if (typeof playVO === 'function') playVO('salah');
        showPopup('SALAH', `Ayo Coba Lagi Detektif ${currentStudent}!`);
    }
}

function showPopup(status, message) {
    const overlay = document.getElementById('popupOverlay');
    const title = document.getElementById('popupTitle');
    const desc = document.getElementById('popupDesc');
    
    if (status === 'BENAR') {
        title.innerText = 'HEBAT! 🌟';
        title.className = 'popup-title correct';
    } else {
        title.innerText = 'SANGAT DEKAT! 💪';
        title.className = 'popup-title wrong';
    }
    
    desc.innerText = message;
    overlay.classList.add('active');
}

function closePopup() {
    document.getElementById('popupOverlay').classList.remove('active');
    showScreen('screenWheel');
}

function renderScoreboard() {
    const grid = document.getElementById('scoreGrid');
    grid.innerHTML = '';
    students.forEach(s => {
        const card = document.createElement('div');
        card.className = `score-card ${s === currentStudent ? 'active-user' : ''}`;
        card.innerHTML = `<div>${s}</div><div style="color:#ff0054;">⭐ ${scores[s]}</div>`;
        grid.appendChild(card);
    });
}

// Inisialisasi awal
window.onload = function() {
    drawWheel();
    document.getElementById('activeStudentLabel').innerText = `Detektif: ${currentStudent}`;
};
