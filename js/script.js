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
let currentStudent = students[0];

// Switch Screen
function showScreen(id) {
    document.querySelectorAll('.view-screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if (id === 'screenScore') renderScoreboard();
}

// Wheel Setup
const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');

function drawWheel() {
    const numSlices = students.length;
    const sliceAngle = (2 * Math.PI) / numSlices;
    ctx.clearRect(0, 0, 300, 300);
    
    students.forEach((name, i) => {
        ctx.beginPath();
        ctx.fillStyle = i % 2 === 0 ? '#ffb703' : '#00b4d8';
        ctx.moveTo(150, 150);
        ctx.arc(150, 150, 140, i * sliceAngle, (i + 1) * sliceAngle);
        ctx.fill();
        ctx.stroke();
        
        ctx.save();
        ctx.translate(150, 150);
        ctx.rotate(i * sliceAngle + sliceAngle / 2);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 9px Nunito';
        ctx.fillText(name.substring(0, 8), 65, 4);
        ctx.restore();
    });
}

let currentRotation = 0;
function spinWheel() {
    playVO('putar');
    const randomDegrees = Math.floor(3600 + Math.random() * 360);
    currentRotation += randomDegrees;
    canvas.style.transform = `rotate(${currentRotation}deg)`;
    
    setTimeout(() => {
        const actualDeg = currentRotation % 360;
        const sliceSize = 360 / students.length;
        const selectedIndex = Math.floor((360 - (actualDeg % 360)) / sliceSize) % students.length;
        
        currentStudent = students[selectedIndex];
        document.getElementById('activeStudentLabel').innerText = `Detektif: ${currentStudent}`;
        document.getElementById('boxStudentTitle').innerText = `Detektif ${currentStudent}, Buka Kotak Misterimu! 🎁`;
        showScreen('screenBox');
    }, 4000);
}

// Mystery Box Generator (Acak 1 dari 5 Jenis Tantangan)
function openMysteryBox() {
    playVO('putar');
    const challengeTypes = [1, 2, 3, 4, 5];
    const randomType = challengeTypes[Math.floor(Math.random() * challengeTypes.length)];
    
    showScreen('screenChallenge');
    loadChallenge(randomType);
}

function loadChallenge(type) {
    const body = document.getElementById('challengeBody');
    const title = document.getElementById('challengeTitle');
    body.innerHTML = '';

    // TIPE 1: Pilihan Ganda Gambar
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
    } 
    // TIPE 2: Benar / Salah
    else if (type === 2) {
        title.innerText = "Tantangan 2: Pernyataan Benar atau Salah";
        body.innerHTML = `
            <img src="assets/images/ayam.jpg" class="img-challenge">
            <p style="font-weight:800; font-size:1.2rem;">Pernyataan: "Ayam adalah hewan Ovipar yang berkembang biak dengan cara melahirkan."</p>
            <div class="opt-grid">
                <button class="btn-opt" style="background:#38b000; color:white;" onclick="evalAnswer(false)">BENAR</button>
                <button class="btn-opt" style="background:#d90429; color:white;" onclick="evalAnswer(true)">SALAH</button>
            </div>
        `;
    }
    // TIPE 3: Mengurutkan Siklus Hidup
    else if (type === 3) {
        title.innerText = "Tantangan 3: Urutkan Siklus Hidup Ayam!";
        body.innerHTML = `
            <p style="font-weight:800;">Tap nomor urut yang tepat di PID!</p>
            <div class="opt-grid">
                <div class="drop-box">1. Telur <br><img src="assets/images/ayam.jpg" style="width:70px; margin-top:5px;"></div>
                <div class="drop-box">2. Anak Ayam</div>
                <div class="drop-box">3. Ayam Dewasa</div>
            </div>
            <button class="btn-main" style="margin-top:15px;" onclick="evalAnswer(true)">PERIKSA JAWABAN</button>
        `;
    }
    // TIPE 4: Drag & Drop Pengelompokan (PID Touch Click)
    else if (type === 4) {
        title.innerText = "Tantangan 4: Kelompokkan Hewan Ovipar!";
        body.innerHTML = `
            <p style="font-weight:800;">Pilih gambar hewan yang bertelur (Ovipar):</p>
            <div class="opt-grid">
                <img src="assets/images/bebek.jpg" class="drag-item" onclick="evalAnswer(true)">
                <img src="assets/images/sapi.jpg" class="drag-item" onclick="evalAnswer(false)">
                <img src="assets/images/kambing.jpg" class="drag-item" onclick="evalAnswer(false)">
            </div>
        `;
    }
    // TIPE 5: Menjodohkan Induk & Anak
    else if (type === 5) {
        title.innerText = "Tantangan 5: Jodohkan Induk & Anaknya!";
        body.innerHTML = `
            <div class="matching-grid">
                <div class="match-col">
                    <p style="font-weight:800;">Induk</p>
                    <img src="assets/images/kucing.jpg" class="match-card" onclick="selectMatch(this, 'kucing')">
                </div>
                <div class="match-col">
                    <p style="font-weight:800;">Anak</p>
                    <img src="assets/images/kucing.jpg" class="match-card" onclick="selectMatch(this, 'anak_kucing')">
                </div>
            </div>
            <button class="btn-main" style="margin-top:15px;" onclick="evalAnswer(true)">COCOKKAN!</button>
        `;
    }
}

let selectedMatch = null;
function selectMatch(el, id) {
    if (selectedMatch) selectedMatch.classList.remove('selected');
    selectedMatch = el;
    el.classList.add('selected');
}

function evalAnswer(isCorrect) {
    if (isCorrect) {
        scores[currentStudent] += 10;
        playVO('benar');
        showPopup('BENAR', `Hebat Detektif ${currentStudent}! Jawabanmu Tepat (+10 Poin)`);
    } else {
        playVO('salah');
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
drawWheel();
