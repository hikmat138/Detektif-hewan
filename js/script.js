// Daftar 34 Murid SD Negeri Ranca Tales
let remainingStudents = [
    "Abizar", "Ahmad Maftuhi", "Ali Bardan", "Aqila", "Ariijna", "Aulia",
    "Deni", "Dinda Bela", "Fano", "Faunio", "Hana Wulan", "Hazmi",
    "Jallaludin", "Muayyyad", "Afian", "Dana", "Fauzan", "Ilyas",
    "Imron", "Kenzi", "Nabil", "Naelul", "Nafisha", "Naufal",
    "Neisya", "Raesha", "Raziq", "Siren", "Syahdan", "Siti Hana",
    "Suci Indriyani", "Tania", "Ulufiyah", "Zea"
];

// Skor awal untuk seluruh murid
const allStudentsList = [...remainingStudents];
let scores = {};
allStudentsList.forEach(s => scores[s] = 0);

let currentStudent = "Nama Siswa";
let isSpinning = false;

// ==========================================
// UTITAS NAVIGASI SKRIN
// ==========================================
function showScreen(id) {
    document.querySelectorAll('.view-screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if (id === 'screenScore') renderScoreboard();
}

// ==========================================
// RODA ACAK MURID (CANVAS)
// ==========================================
const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');

function drawWheel() {
    const numSlices = remainingStudents.length;
    if (numSlices === 0) return;
    
    const sliceAngle = (2 * Math.PI) / numSlices;
    ctx.clearRect(0, 0, 400, 400);
    
    remainingStudents.forEach((name, i) => {
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
    
    // Jika semua murid sudah selesai, reset daftar murid
    if (remainingStudents.length === 0) {
        remainingStudents = [...allStudentsList];
        drawWheel();
    }

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
        const sliceSize = 360 / remainingStudents.length;
        const selectedIndex = Math.floor((360 - (actualDeg % 360) + 270) % 360 / sliceSize) % remainingStudents.length;
        
        // Ambil murid terpilih & HAPUS dari daftar giliran
        currentStudent = remainingStudents[selectedIndex];
        remainingStudents.splice(selectedIndex, 1);
        
        // Gambar ulang roda tanpa nama murid yang baru terpilih
        drawWheel();
        
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

// ==========================================
// BANK DATA & GENERATOR TANTANGAN DINAMIS
// ==========================================

// Databank untuk Tantangan 1 & 2 (Pilihan Ganda & Benar/Salah)
const quizBank = [
    { name: "Kucing", img: "assets/images/kucing.jpg", type: "VIVIPAR", isOvipar: false },
    { name: "Ayam", img: "assets/images/ayam.jpg", type: "OVIPAR", isOvipar: true },
    { name: "Penyu", img: "assets/images/penyu.jpg", type: "OVIPAR", isOvipar: true },
    { name: "Sapi", img: "assets/images/sapi.jpg", type: "VIVIPAR", isOvipar: false },
    { name: "Bebek", img: "assets/images/bebek.jpg", type: "OVIPAR", isOvipar: true },
    { name: "Kambing", img: "assets/images/kambing.jpg", type: "VIVIPAR", isOvipar: false },
    { name: "Elang", img: "assets/images/elang.jpg", type: "OVIPAR", isOvipar: true },
    { name: "Kuda", img: "assets/images/kuda.jpg", type: "VIVIPAR", isOvipar: false },
    { name: "Kelinci", img: "assets/images/kelinci.jpg", type: "VIVIPAR", isOvipar: false },
    { name: "Ikan Mas", img: "assets/images/ikan_mas.jpg", type: "OVIPAR", isOvipar: true },
    { name: "Gajah", img: "assets/images/gajah.jpg", type: "VIVIPAR", isOvipar: false },
    { name: "Harimau", img: "assets/images/harimau.jpg", type: "VIVIPAR", isOvipar: false }
];

// Databank Siklus Hidup Tantangan 3
const cycleBank = [
    {
        title: "Penyu",
        items: [
            { id: "telur", name: "Telur Penyu", img: "assets/images/telur_penyu.jpg" },
            { id: "tukik", name: "Tukik", img: "assets/images/tukik.jpg" },
            { id: "dewasa", name: "Penyu Dewasa", img: "assets/images/penyu.jpg" }
        ]
    },
    {
        title: "Ayam",
        items: [
            { id: "telur", name: "Telur Ayam", img: "assets/images/telur_ayam.jpg" },
            { id: "tukik", name: "Anak Ayam", img: "assets/images/anak_ayam.jpg" },
            { id: "dewasa", name: "Ayam Dewasa", img: "assets/images/ayam.jpg" }
        ]
    },
    {
        title: "Elang",
        items: [
            { id: "telur", name: "Telur Elang", img: "assets/images/telur_elang.jpg" },
            { id: "tukik", name: "Anak Elang", img: "assets/images/anak_elang.jpg" },
            { id: "dewasa", name: "Elang Dewasa", img: "assets/images/elang.jpg" }
        ]
    },
    {
        title: "Kucing",
        items: [
            { id: "telur", name: "Anak Baru Lahir", img: "assets/images/anak_kucing_baru_lahir.jpg" },
            { id: "tukik", name: "Anak Kucing", img: "assets/images/anak_kucing.jpg" },
            { id: "dewasa", name: "Kucing Dewasa", img: "assets/images/kucing_dewasa.jpg" }
        ]
    },
    {
        title: "Kelinci",
        items: [
            { id: "telur", name: "Bayi Kelinci", img: "assets/images/bayi_kelinci.jpg" },
            { id: "tukik", name: "Kelinci Muda", img: "assets/images/kelinci_muda.jpg" },
            { id: "dewasa", name: "Kelinci Dewasa", img: "assets/images/kelinci_dewasa.jpg" }
        ]
    }
];

function loadChallenge(type) {
    const body = document.getElementById('challengeBody');
    const title = document.getElementById('challengeTitle');
    body.innerHTML = '';

    if (type === 1) {
        // TANTANGAN 1: Pilihan Ganda (Random Animal)
        const item = quizBank[Math.floor(Math.random() * quizBank.length)];
        title.innerText = "Tantangan 1: Pilihan Ganda Perkembangbiakan";
        body.innerHTML = `
            <img src="${item.img}" class="img-challenge">
            <p style="font-weight:800; font-size:1.3rem; margin:10px 0;">Bagaimana cara ${item.name} berkembang biak?</p>
            <div class="opt-grid" style="gap:20px;">
                <button class="btn-opt" style="font-size:1.3rem; padding:12px 28px; background:linear-gradient(180deg, #70e000 0%, #38b000 100%); color:white;" 
                        onclick="evalAnswer(${item.type === 'VIVIPAR'})">
                    VIVIPAR (Melahirkan)
                </button>
                <button class="btn-opt" style="font-size:1.3rem; padding:12px 28px; background:linear-gradient(180deg, #ffb703 0%, #fb8500 100%); color:white;" 
                        onclick="evalAnswer(${item.type === 'OVIPAR'})">
                    OVIPAR (Bertelur)
                </button>
            </div>
        `;
    } else if (type === 2) {
        // TANTANGAN 2: Pernyataan Benar/Salah (Random Statement)
        const item = quizBank[Math.floor(Math.random() * quizBank.length)];
        const isTrueStatement = Math.random() > 0.5;
        const statementType = isTrueStatement ? item.type : (item.type === 'OVIPAR' ? 'VIVIPAR (Melahirkan)' : 'OVIPAR (Bertelur)');
        
        title.innerText = "Tantangan 2: Pernyataan Benar atau Salah";
        body.innerHTML = `
            <img src="${item.img}" class="img-challenge">
            <p style="font-weight:800; font-size:1.2rem; margin:10px 0;">
                Pernyataan: "${item.name} berkembang biak dengan cara ${statementType}."
            </p>
            <div class="opt-grid" style="gap:20px;">
                <button class="btn-opt" style="font-size:1.4rem; padding:12px 35px; background:#38b000; color:white;" onclick="evalAnswer(${isTrueStatement})">BENAR</button>
                <button class="btn-opt" style="font-size:1.4rem; padding:12px 35px; background:#d90429; color:white;" onclick="evalAnswer(!isTrueStatement)">SALAH</button>
            </div>
        `;
    } else if (type === 3) {
        // TANTANGAN 3: Urutkan Siklus Hidup (Tap-to-Place Dropzone)
        const cycle = cycleBank[Math.floor(Math.random() * cycleBank.length)];
        title.innerText = `Tantangan 3: Urutkan Siklus Hidup ${cycle.title}!`;
        
        availableOptions = [...cycle.items].sort(() => Math.random() - 0.5);
        targetSlots = [null, null, null];
        selectedOptionIndex = null;
        renderDropzoneChallenge();
    } else if (type === 4) {
        // TANTANGAN 4: Kategori Ovipar / Vivipar
        const isTargetOvipar = Math.random() > 0.5;
        title.innerText = isTargetOvipar ? "Tantangan 4: Pilih Hewan yang Bertelur (Ovipar)!" : "Tantangan 4: Pilih Hewan yang Melahirkan (Vivipar)!";
        
        const correctAnimals = quizBank.filter(a => a.isOvipar === isTargetOvipar);
        const wrongAnimals = quizBank.filter(a => a.isOvipar !== isTargetOvipar);
        
        const correctChoice = correctAnimals[Math.floor(Math.random() * correctAnimals.length)];
        const wrongChoice1 = wrongAnimals[Math.floor(Math.random() * wrongAnimals.length)];
        let wrongChoice2 = wrongAnimals[Math.floor(Math.random() * wrongAnimals.length)];
        while (wrongChoice2.name === wrongChoice1.name) {
            wrongChoice2 = wrongAnimals[Math.floor(Math.random() * wrongAnimals.length)];
        }

        const options = [
            { item: correctChoice, correct: true },
            { item: wrongChoice1, correct: false },
            { item: wrongChoice2, correct: false }
        ].sort(() => Math.random() - 0.5);

        body.innerHTML = `
            <p style="font-weight:800; margin-bottom:10px;">Sentuh gambar hewan yang tepat di bawah ini:</p>
            <div class="opt-grid" style="gap:20px;">
                ${options.map(opt => `
                    <div class="animal-card-3d" style="width:150px; cursor:pointer;" onclick="evalAnswer(${opt.correct})">
                        <img src="${opt.item.img}" style="height:100px;">
                        <div class="label" style="font-size:1.1rem;">${opt.item.name}</div>
                    </div>
                `).join('')}
            </div>
        `;
    } else if (type === 5) {
        // TANTANGAN 5: Menjodohkan 4 Pasangan Hewan
        title.innerText = "Tantangan 5: Jodohkan Induk & Anaknya!";
        
        matchingParents = [
            { id: "sapi", name: "Induk Sapi", img: "assets/images/sapi_dewasa.jpg" },
            { id: "kambing", name: "Induk Kambing", img: "assets/images/kambing_dewasa.jpg" },
            { id: "ayam", name: "Induk Ayam", img: "assets/images/ayam.jpg" },
            { id: "bebek", name: "Induk Bebek", img: "assets/images/bebek.jpg" }
        ];

        matchingChildren = [
            { id: "kambing", name: "Anak Kambing", img: "assets/images/anak_kambing.jpg" },
            { id: "bebek", name: "Anak Bebek", img: "assets/images/anak_bebek.jpg" },
            { id: "sapi", name: "Anak Sapi (Pedet)", img: "assets/images/pedet_sapi.jpg" },
            { id: "ayam", name: "Anak Ayam", img: "assets/images/anak_ayam.jpg" }
        ].sort(() => Math.random() - 0.5);

        selectedParent = null;
        selectedChild = null;
        userMatches = {};
        renderMatchingChallenge();
    }
}

// ==========================================
// LOGIKA TANTANGAN 3 (DROPZONE)
// ==========================================
let availableOptions = [];
let targetSlots = [null, null, null];
let selectedOptionIndex = null;

function renderDropzoneChallenge() {
    const body = document.getElementById('challengeBody');
    body.innerHTML = `
        <p style="font-weight:800; font-size:1rem; margin-bottom:5px;">
            Pilih gambar di bawah, lalu sentuh Kotak Target untuk menyusun urutannya!
        </p>
        
        <!-- TARGET DROPZONE -->
        <div style="display:flex; gap:15px; justify-content:center; margin:10px 0;">
            ${targetSlots.map((slot, index) => `
                <div onclick="placeInSlot(${index})" 
                     style="width:130px; height:140px; border:3px dashed #8a4819; border-radius:18px; background:rgba(255,255,255,0.7); display:flex; flex-direction:column; align-items:center; justify-content:center; cursor:pointer; padding:5px;">
                    <span style="font-size:0.85rem; font-weight:800; color:#57290b; margin-bottom:2px;">Urutan ${index + 1}</span>${slot ? `
                        <img src="${slot.img}" style="width:100%; height:85px; object-fit:cover; border-radius:10px;">
                        <span style="font-size:0.85rem; font-weight:800; margin-top:3px;">${slot.name}</span>
                    ` : `
                        <span style="font-size:2rem; color:#b06b32;">➕</span>
                        <span style="font-size:0.75rem; color:#888;">Ketuk di sini</span>
                    `}
                </div>
            `).join('')}
        </div>

        <!-- PILIHAN GAMBAR -->
        <div style="display:flex; gap:15px; justify-content:center; margin-top:5px;">
            ${availableOptions.map((item, index) => `
                <div onclick="selectOption(${index})" 
                     style="width:120px; padding:6px; background:#ffe066; border:${selectedOptionIndex === index ? '4px solid #ff0054' : '3px solid #8a4819'}; border-radius:15px; cursor:pointer; opacity:${item === null ? '0.3' : '1'}; transform:${selectedOptionIndex === index ? 'scale(1.08)' : 'scale(1)'}; transition:all 0.2s;">
                    ${item ? `
                        <img src="${item.img}" style="width:100%; height:75px; object-fit:cover; border-radius:8px;">
                        <span style="font-size:0.8rem; font-weight:800; display:block; margin-top:2px;">${item.name}</span>
                    ` : `
                        <span style="font-size:0.8rem; color:#777;">Dipilih</span>
                    `}
                </div>
            `).join('')}
        </div>

        <div style="margin-top:12px; display:flex; gap:10px; justify-content:center;">
            <button class="btn-green-3d" style="font-size:1.1rem; padding:8px 25px;" onclick="checkDropzoneAnswer()">PERIKSA JAWABAN</button>
            <button class="btn-top" style="background:#d90429; font-size:0.95rem; padding:8px 15px;" onclick="loadChallenge(3)">🔄 Reset</button>
        </div>
    `;
}

function selectOption(index) {
    if (availableOptions[index] !== null) {
        selectedOptionIndex = index;
        renderDropzoneChallenge();
    }
}

function placeInSlot(slotIndex) {
    if (selectedOptionIndex !== null) {
        if (targetSlots[slotIndex] !== null) {
            const oldItem = targetSlots[slotIndex];
            const emptyOptionIndex = availableOptions.findIndex(opt => opt === null);
            if (emptyOptionIndex !== -1) availableOptions[emptyOptionIndex] = oldItem;
        }
        
        targetSlots[slotIndex] = availableOptions[selectedOptionIndex];
        availableOptions[selectedOptionIndex] = null;
        selectedOptionIndex = null;
        renderDropzoneChallenge();
    } else if (targetSlots[slotIndex] !== null) {
        const itemToReturn = targetSlots[slotIndex];
        targetSlots[slotIndex] = null;
        const emptyOptionIndex = availableOptions.findIndex(opt => opt === null);
        if (emptyOptionIndex !== -1) availableOptions[emptyOptionIndex] = itemToReturn;
        renderDropzoneChallenge();
    }
}

function checkDropzoneAnswer() {
    if (targetSlots.includes(null)) {
        if (typeof playVO === 'function') playVO('salah');
        showPopup('SALAH', 'Lengkapi semua 3 kotak urutan terlebih dahulu ya!');
        return;
    }
    
    const isCorrect = targetSlots[0].id === 'telur' && 
                      targetSlots[1].id === 'tukik' && 
                      targetSlots[2].id === 'dewasa';
    evalAnswer(isCorrect);
}

// ==========================================
// LOGIKA TANTANGAN 5 (MATCHING GAME)
// ==========================================
let matchingParents = [];
let matchingChildren = [];
let selectedParent = null;
let selectedChild = null;
let userMatches = {};

function renderMatchingChallenge() {
    const body = document.getElementById('challengeBody');
    body.innerHTML = `
        <p style="font-weight:800; font-size:0.95rem; margin-bottom:6px;">
            Sentuh 1 Induk di sebelah kiri, lalu sentuh Anaknya yang cocok di sebelah kanan!
        </p>

        <div style="display:flex; gap:30px; justify-content:center; align-items:center;">
            <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:8px;">
                ${matchingParents.map((parent) => {
                    const isSelected = selectedParent === parent.id;
                    const isMatched = userMatches[parent.id] !== undefined;
                    return `
                        <div onclick="selectParent('${parent.id}')" 
                             style="width:120px; padding:5px; background:#ffe066; 
                                    border:${isSelected ? '4px solid #ff0054' : isMatched ? '4px solid #38b000' : '3px solid #8a4819'}; 
                                    border-radius:12px; cursor:pointer; text-align:center;">
                            <img src="${parent.img}" style="width:100%; height:65px; object-fit:cover; border-radius:8px;">
                            <span style="font-size:0.8rem; font-weight:800; display:block; margin-top:2px;">${parent.name}</span>${isMatched ? '<span style="font-size:0.75rem; color:#38b000; font-weight:800;">✓ Ok</span>' : ''}
                        </div>
                    `;
                }).join('')}
            </div>

            <div style="font-size:1.8rem; font-weight:900; color:#5a382d;">➡️</div>

            <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:8px;">
                ${matchingChildren.map((child) => {
                    const isSelected = selectedChild === child.id;
                    const isMatched = Object.values(userMatches).includes(child.id);
                    return `
                        <div onclick="selectChild('${child.id}')" 
                             style="width:120px; padding:5px; background:#ffe066; 
                                    border:${isSelected ? '4px solid #ff0054' : isMatched ? '4px solid #38b000' : '3px solid #8a4819'}; 
                                    border-radius:12px; cursor:pointer; text-align:center;">
                            <img src="${child.img}" style="width:100%; height:65px; object-fit:cover; border-radius:8px;">
                            <span style="font-size:0.8rem; font-weight:800; display:block; margin-top:2px;">${child.name}</span>${isMatched ? '<span style="font-size:0.75rem; color:#38b000; font-weight:800;">✓ Ok</span>' : ''}
                        </div>
                    `;
                }).join('')}
            </div>
        </div>

        <div style="margin-top:10px; display:flex; gap:12px; justify-content:center;">
            <button class="btn-green-3d" style="font-size:1.1rem; padding:8px 25px;" onclick="checkMatchingAnswer()">COCOKKAN!</button>
            <button class="btn-top" style="background:#d90429; font-size:0.95rem; padding:8px 15px;" onclick="loadChallenge(5)">🔄 Reset</button>
        </div>
    `;
}

function selectParent(parentId) {
    selectedParent = parentId;
    tryAutoMatch();
    renderMatchingChallenge();
}

function selectChild(childId) {
    selectedChild = childId;
    tryAutoMatch();
    renderMatchingChallenge();
}

function tryAutoMatch() {
    if (selectedParent && selectedChild) {
        userMatches[selectedParent] = selectedChild;
        selectedParent = null;
        selectedChild = null;
    }
}

function checkMatchingAnswer() {
    if (Object.keys(userMatches).length < 4) {
        if (typeof playVO === 'function') playVO('salah');
        showPopup('SALAH', 'Jodohkan ke-4 pasangan Induk dan Anak terlebih dahulu ya!');
        return;
    }

    const isCorrect = userMatches['sapi'] === 'sapi' && 
                      userMatches['kambing'] === 'kambing' && 
                      userMatches['ayam'] === 'ayam' && 
                      userMatches['bebek'] === 'bebek';
                      
    evalAnswer(isCorrect);
}

// ==========================================
// EVALUASI & POPUP OVERLAY
// ==========================================
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
    allStudentsList.forEach(s => {
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
