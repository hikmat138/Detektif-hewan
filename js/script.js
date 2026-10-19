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

// Variabel Khusus Tantangan 3 (Menyusun Siklus)
let currentOrder = [];
let selectedIndex = null;

function showScreen(id) {
    document.querySelectorAll('.view-screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if (id === 'screenScore') renderScoreboard();
}

const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');

function drawWheel() {
    const numSlices = students.length;
    const sliceAngle = (2 * Math.PI) / numSlices;
    ctx.clearRect(0, 0, 400, 400);
    
    students.forEach((name, i) => {
        const angle = i * sliceAngle;
        
        ctx.beginPath();
        ctx.fillStyle = i % 2 === 0 ? '#ffb703' : '#00b4d8';
        ctx.moveTo(200, 200);
        ctx.arc(200, 200, 195, angle, angle + sliceAngle);
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();
        
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
        
        if (typeof stopAllAudio === 'function') stopAllAudio();

        const actualDeg = currentRotation % 360;
        const sliceSize = 360 / students.length;
        const selectedStudentIndex = Math.floor((360 - (actualDeg % 360) + 270) % 360 / sliceSize) % students.length;
        
        currentStudent = students[selectedStudentIndex];
        
        document.getElementById('activeStudentLabel').innerText = `Detektif: ${currentStudent}`;
        document.getElementById('boxStudentTitle').innerText = `Detektif ${currentStudent}, Buka Kotak Misterimu! 🎁`;
        
        if (typeof playVO === 'function') playVO('terpilih', currentStudent);
        
        showScreen('screenBox');
    }, 4000);
}

function openMysteryBox() {
    if (typeof playVO === 'function') playVO('buka_kotak');
    
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
            <p style="font-weight:800; font-size:1.3rem; margin:10px 0;">Bagaimana cara Kucing berkembang biak?</p>
            <div class="opt-grid" style="gap:20px;">
                <button class="btn-opt" style="font-size:1.4rem; padding:15px 30px; background:linear-gradient(180deg, #70e000 0%, #38b000 100%); color:white;" onclick="evalAnswer(true)">
                    VIVIPAR (Melahirkan)
                </button>
                <button class="btn-opt" style="font-size:1.4rem; padding:15px 30px; background:linear-gradient(180deg, #ffb703 0%, #fb8500 100%); color:white;" onclick="evalAnswer(false)">
                    OVIPAR (Bertelur)
                </button>
            </div>
        `;
    } else if (type === 2) {
        title.innerText = "Tantangan 2: Pernyataan Benar atau Salah";
        body.innerHTML = `
            <img src="assets/images/ayam.jpg" class="img-challenge">
            <p style="font-weight:800; font-size:1.2rem; margin:10px 0;">Pernyataan: "Ayam adalah hewan Ovipar yang berkembang biak dengan cara bertelur."</p>
            <div class="opt-grid" style="gap:20px;">
                <button class="btn-opt" style="font-size:1.4rem; padding:12px 35px; background:#38b000; color:white;" onclick="evalAnswer(true)">BENAR</button>
                <button class="btn-opt" style="font-size:1.4rem; padding:12px 35px; background:#d90429; color:white;" onclick="evalAnswer(false)">SALAH</button>
            </div>
        `;
    } else if (type === 3) {
        title.innerText = "Tantangan 3: Urutkan Siklus Hidup Penyu!";
        // Pilihan awal diacak (misal: Tukik, Telur, Dewasa)
        currentOrder = [
            { id: "tukik", name: "Tukik", img: "assets/images/tukik.jpg" },
            { id: "telur", name: "Telur Penyu", img: "assets/images/telur_penyu.jpg" },
            { id: "dewasa", name: "Penyu Dewasa", img: "assets/images/penyu.jpg" }
        ];
        selectedIndex = null;
        renderSequenceChallenge();
    } else if (type === 4) {
        title.innerText = "Tantangan 4: Pilih Hewan yang Bertelur (Ovipar)!";
        body.innerHTML = `
            <p style="font-weight:800; margin-bottom:10px;">Sentuh gambar hewan yang berkembang biak dengan bertelur:</p>
            <div class="opt-grid" style="gap:20px;">
                <div class="animal-card-3d" style="width:150px; cursor:pointer;" onclick="evalAnswer(true)">
                    <img src="assets/images/bebek.jpg" style="height:100px;">
                    <div class="label" style="font-size:1.1rem;">Bebek</div>
                </div>
                <div class="animal-card-3d" style="width:150px; cursor:pointer;" onclick="evalAnswer(false)">
                    <img src="assets/images/sapi.jpg" style="height:100px;">
                    <div class="label" style="font-size:1.1rem;">Sapi</div>
                </div>
                <div class="animal-card-3d" style="width:150px; cursor:pointer;" onclick="evalAnswer(false)">
                    <img src="assets/images/kambing.jpg" style="height:100px;">
                    <div class="label" style="font-size:1.1rem;">Kambing</div>
                </div>
            </div>
        `;
    } else if (type === 5) {
        title.innerText = "Tantangan 5: Jodohkan Induk & Anaknya!";
        body.innerHTML = `
            <div class="matching-grid" style="display:flex; gap:30px; justify-content:center; align-items:center;">
                <div class="animal-card-3d" style="width:160px;">
                    <p style="color:white; font-weight:800;">Induk Sapi</p>
                    <img src="assets/images/sapi_dewasa.jpg" style="height:100px;">
                </div>
                <div style="font-size:2rem; font-weight:bold; color:#5a382d;">➡️</div>
                <div class="animal-card-3d" style="width:160px;">
                    <p style="color:white; font-weight:800;">Anak Sapi</p>
                    <img src="assets/images/pedet_sapi.jpg" style="height:100px;">
                </div>
            </div>
            <button class="btn-green-3d" style="margin-top:15px; font-size:1.2rem;" onclick="evalAnswer(true)">COCOKKAN!</button>
        `;
    }
}

// Render Ulang Tampilan Kartu Siklus Hidup
function renderSequenceChallenge() {
    const body = document.getElementById('challengeBody');
    body.innerHTML = `
        <p style="font-weight:800; margin-bottom:5px;">Sentuh dua kartu di layar PID untuk menukar urutannya hingga benar!</p>
        <div class="opt-grid" style="gap:15px; margin-top:10px;">
            ${currentOrder.map((item, index) => `
                <div class="animal-card-3d" 
                     style="width:140px; padding:5px; cursor:pointer; border:${selectedIndex === index ? '5px solid #ff0054' : '5px solid #ffe066'}; transform:${selectedIndex === index ? 'scale(1.05)' : 'scale(1)'};" 
                     onclick="selectSequenceCard(${index})">
                    <img src="${item.img}" style="height:90px; width:100%; object-fit:cover; border-radius:10px;">
                    <div class="label" style="font-size:0.95rem;">Urutan ${index + 1}:<br><b>${item.name}</b></div>
                </div>
            `).join('')}
        </div>
        <button class="btn-green-3d" style="margin-top:15px; font-size:1.2rem;" onclick="checkSequenceAnswer()">PERIKSA JAWABAN</button>
    `;
}

// Logika Menukar Kartu
function selectSequenceCard(index) {
    if (selectedIndex === null) {
        selectedIndex = index;
    } else {
        // Tukar posisi dua kartu
        let temp = currentOrder[selectedIndex];
        currentOrder[selectedIndex] = currentOrder[index];
        currentOrder[index] = temp;
        selectedIndex = null;
    }
    renderSequenceChallenge();
}

// Evaluasi Urutan
function checkSequenceAnswer() {
    const isCorrect = currentOrder[0].id === 'telur' && 
                      currentOrder[1].id === 'tukik' && 
                      currentOrder[2].id === 'dewasa';
    evalAnswer(isCorrect);
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

window.onload = function() {
    drawWheel();
    document.getElementById('activeStudentLabel').innerText = `Detektif: ${currentStudent}`;
};
