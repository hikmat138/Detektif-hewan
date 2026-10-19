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
// UTILITAS NAVIGASI SCREEN
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
    
    // Jika semua murid sudah selesai giliran, reset ulang daftar murid
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
        
        // Ambil murid terpilih & hapus dari daftar giliran
        currentStudent = remainingStudents[selectedIndex];
        remainingStudents.splice(selectedIndex, 1);
        
        // Render ulang roda tanpa murid yang baru terpilih
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

// Databank untuk Tantangan 1, 2, & 4 (Vivipar, Ovipar, Ovovivipar)
const quizBank = [
    { name: "Kucing", img: "assets/images/kucing.jpg", category: "VIVIPAR" },
    { name: "Ayam", img: "assets/images/ayam.jpg", category: "OVIPAR" },
    { name: "Penyu", img: "assets/images/penyu.jpg", category: "OVIPAR" },
    { name: "Sapi", img: "assets/images/sapi.jpg", category: "VIVIPAR" },
    { name: "Bebek", img: "assets/images/bebek.jpg", category: "OVIPAR" },
    { name: "Kambing", img: "assets/images/kambing.jpg", category: "VIVIPAR" },
    { name: "Elang", img: "assets/images/elang.jpg", category: "OVIPAR" },
    { name: "Kuda", img: "assets/images/kuda.jpg", category: "VIVIPAR" },
    { name: "Kelinci", img: "assets/images/kelinci.jpg", category: "VIVIPAR" },
    { name: "Ikan Mas", img: "assets/images/ikan_mas.jpg", category: "OVIPAR" },
    { name: "Gajah", img: "assets/images/gajah.jpg", category: "VIVIPAR" },
    { name: "Harimau", img: "assets/images/harimau.jpg", category: "VIVIPAR" },
    { name: "Ular", img: "assets/images/ular.jpg", category: "OVOVIVIPAR" },
    { name: "Pari", img: "assets/images/pari.jpg", category: "OVOVIVIPAR" },
    { name: "Hiu", img: "assets/images/hiu.jpg", category: "OVOVIVIPAR" }
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

// Databank 5 Misi Tantangan 5 (Tepat 2 Pasang Hewan per Misi)
const matchingMissions = [
    {
        missionName: "Misi 1: Hewan Ternak Besar",
        parents: [
            { id: "sapi", name: "Induk Sapi", img: "assets/images/sapi_dewasa.jpg" },
            { id: "kambing", name: "Induk Kambing", img: "assets/images/kambing_dewasa.jpg" }
        ],
        children: [
            { id: "kambing", name: "Anak Kambing", img: "assets/images/anak_kambing.jpg" },
            { id: "sapi", name: "Anak Sapi (Pedet)", img: "assets/images/pedet_sapi.jpg" }
        ]
    },
    {
        missionName: "Misi 2: Unggas Bersayap",
        parents: [
            { id: "ayam", name: "Induk Ayam", img: "assets/images/ayam.jpg" },
            { id: "bebek", name: "Induk Bebek", img: "assets/images/bebek.jpg" }
        ],
        children: [
            { id: "bebek", name: "Anak Bebek", img: "assets/images/anak_bebek.jpg" },
            { id: "ayam", name: "Anak Ayam", img: "assets/images/anak_ayam.jpg" }
        ]
    },
    {
        missionName: "Misi 3: Hewan Peliharaan Lucu",
        parents: [
            { id: "kucing", name: "Induk Kucing", img: "assets/images/kucing_dewasa.jpg" },
            { id: "kelinci", name: "Induk Kelinci", img: "assets/images/kelinci_dewasa.jpg" }
        ],
        children: [
            { id: "kelinci", name: "Bayi Kelinci", img: "assets/images/bayi_kelinci.jpg" },
            { id: "kucing", name: "Anak Kucing Baru Lahir", img: "assets/images/anak_kucing_baru_lahir.jpg" }
        ]
    },
    {
        missionName: "Misi 4: Hewan Gagah & Tangkas",
        parents: [
            { id: "kuda", name: "Induk Kuda", img: "assets/images/kuda_dewasa.jpg" },
            { id: "elang", name: "Induk Elang", img: "assets/images/elang.jpg" }
        ],
        children: [
            { id: "elang", name: "Anak Elang", img: "assets/images/anak_elang.jpg" },
            { id: "kuda", name: "Anak Kuda", img: "assets/images/anak_kuda.jpg" }
        ]
    },
    {
        missionName: "Misi 5: Satwa Air",
        parents: [
            { id: "ikan", name: "Induk Ikan", img: "assets/images/ikan_mas.jpg" },
            { id: "penyu", name: "Induk Penyu", img: "assets/images/penyu.jpg" }
        ],
        children: [
            { id: "penyu", name: "Tukik Penyu", img: "assets/images/tukik.jpg" },
            { id: "ikan", name: "Anak Ikan", img: "assets/images/anak_ikan.jpg" }
        ]
    }
];

function loadChallenge(type) {
    const body = document.getElementById('challengeBody');
    const title = document.getElementById('challengeTitle');
    body.innerHTML = '';

    if (type === 1) {
        // TANTANGAN 1: Pilihan Ganda 3 Opsi
        const item = quizBank[Math.floor(Math.random() * quizBank.length)];
        title.innerText = "Tantangan 1: Pilihan Ganda Perkembangbiakan";
        body.innerHTML = `
            <img src="${item.img}" class="img-challenge">
            <p style="font-weight:800; font-size:1.3rem; margin:10px 0;">Bagaimana cara ${item.name} berkembang biak?</p>
            <div class="opt-grid" style="gap:15px;">
                <button class="btn-opt" style="font-size:1.1rem; padding:12px 22px; background:linear-gradient(180deg, #70e000 0%, #38b000 100%); color:white;" 
                        onclick="evalAnswer('${item.category}' === 'VIVIPAR')">
                    VIVIPAR (Melahirkan)
                </button>
                <button class="btn-opt" style="font-size:1.1rem; padding:12px 22px; background:linear-gradient(180deg, #ffb703 0%, #fb8500 100%); color:white;" 
                        onclick="evalAnswer('${item.category}' === 'OVIPAR')">
                    OVIPAR (Bertelur)
                </button>
                <button class="btn-opt" style="font-size:1.1rem; padding:12px 22px; background:linear-gradient(180deg, #9d4edd 0%, #5a189a 100%); color:white;" 
                        onclick="evalAnswer('${item.category}' === 'OVOVIVIPAR')">
                    OVOVIVIPAR (Bertelur & Melahirkan)
                </button>
            </div>
        `;
    } else if (type === 2) {
        // TANTANGAN 2: Pernyataan Benar atau Salah
        const item = quizBank[Math.floor(Math.random() * quizBank.length)];
        const isTrueStatement = Math.random() > 0.5;
        
        let statementCategory = item.category;
        if (!isTrueStatement) {
            const wrongCategories = ["OVIPAR", "VIVIPAR", "OVOVIVIPAR"].filter(c => c !== item.category);
            statementCategory = wrongCategories[Math.floor(Math.random() * wrongCategories.length)];
        }
        
        let labelCategory = "";
        if (statementCategory === "OVIPAR") labelCategory = "OVIPAR (Bertelur)";
        else if (statementCategory === "VIVIPAR") labelCategory = "VIVIPAR (Melahirkan)";
        else labelCategory = "OVOVIVIPAR (Bertelur & Melahirkan)";

        title.innerText = "Tantangan 2: Pernyataan Benar atau Salah";
        body.innerHTML = `
            <img src="${item.img}" class="img-challenge">
            <p style="font-weight:800; font-size:1.2rem; margin:10px 0;">
                Pernyataan: "${item.name} berkembang biak dengan cara ${labelCategory}."
            </p>
            <div class="opt-grid" style="gap:25px;">
                <button class="btn-opt" style="font-size:1.4rem; padding:12px 40px; background:#38b000; color:white;" onclick="evalAnswer(${isTrueStatement})">BENAR</button>
                <button class="btn-opt" style="font-size:1.4rem; padding:12px 40px; background:#d90429; color:white;" onclick="evalAnswer(${!isTrueStatement})">SALAH</button>
            </div>
        `;
    } else if (type === 3) {
        // TANTANGAN 3: Urutkan Siklus Hidup
        const cycle = cycleBank[Math.floor(Math.random() * cycleBank.length)];
        title.innerText = `Tantangan 3: Urutkan Siklus Hidup ${cycle.title}!`;
        
        availableOptions = [...cycle.items].sort(() => Math.random() - 0.5);
        targetSlots = [null, null, null];
        selectedOptionIndex = null;
        renderDropzoneChallenge();
    } else if (type === 4) {
        // TANTANGAN 4: Pilih Hewan Kategori Spesifik
        const categories = ["OVIPAR", "VIVIPAR", "OVOVIVIPAR"];
        const targetCategory = categories[Math.floor(Math.random() * categories.length)];
        
        let labelTarget = "";
        if (targetCategory === "OVIPAR") labelTarget = "Bertelur (Ovipar)";
        else if (targetCategory === "VIVIPAR") labelTarget = "Melahirkan (Vivipar)";
        else labelTarget = "Bertelur & Melahirkan (Ovovivipar)";

        title.innerText = `Tantangan 4: Pilih Hewan yang ${labelTarget}!`;
        
        const correctAnimals = quizBank.filter(a => a.category === targetCategory);
        const wrongAnimals = quizBank.filter(a => a.category !== targetCategory);
        
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
        // TANTANGAN 5: Menjodohkan Hewan (Acak Misi 1 - 5)
        const selectedMission = matchingMissions[Math.floor(Math.random() * matchingMissions.length)];
        title.innerText = `Tantangan 5: ${selectedMission.missionName}`;
        
        matchingParents = [...selectedMission.parents];
        matchingChildren = [...selectedMission.children].sort(() => Math.random() - 0.5);

        selectedParent = null;
        selectedChild = null;
        userMatches = {};
        renderMatchingChallenge();
    }
}

// ==========================================
// LOGIKA TANTANGAN 3 (DRAG AND DROP DROPZONE)
// ==========================================
let availableOptions = [];
let targetSlots = [null, null, null];
let selectedOptionIndex = null;

function renderDropzoneChallenge() {
    const body = document.getElementById('challengeBody');
    body.innerHTML = `
        <p style="font-weight:800; font-size:1rem; margin-bottom:5px;">
            Geser (Drag) atau sentuh gambar di bawah ke Kotak Target untuk menyusun urutannya!
        </p>
        
        <!-- TARGET DROPZONE (KOTAK KOSONG) -->
        <div style="display:flex; gap:15px; justify-content:center; margin:10px 0;">
            ${targetSlots.map((slot, index) => `
                <div onclick="placeInSlot(${index})" 
                     ondragover="allowDrop(event)" 
                     ondrop="handleDrop(event, ${index})"
                     style="width:130px; height:140px; border:3px dashed #8a4819; border-radius:18px; background:rgba(255,255,255,0.75); display:flex; flex-direction:column; align-items:center; justify-content:center; cursor:pointer; padding:5px;">
                    <span style="font-size:0.85rem; font-weight:800; color:#57290b; margin-bottom:2px;">Urutan ${index + 1}</span>${slot ? `
                        <img src="${slot.img}" style="width:100%; height:85px; object-fit:cover; border-radius:10px;">
                        <span style="font-size:0.85rem; font-weight:800; margin-top:3px;">${slot.name}</span>
                    ` : `
                        <span style="font-size:2rem; color:#b06b32;">➕</span>
                        <span style="font-size:0.75rem; color:#888;">Taruh di sini</span>
                    `}
                </div>
            `).join('')}
        </div>

        <!-- PILIHAN GAMBAR -->
        <div style="display:flex; gap:15px; justify-content:center; margin-top:5px;">
            ${availableOptions.map((item, index) => `
                <div onclick="selectOption(${index})" 
                     draggable="${item !== null}" 
                     ondragstart="handleDragStart(event, ${index})"
                     style="width:120px; padding:6px; background:#ffe066; border:${selectedOptionIndex === index ? '4px solid #ff0054' : '3px solid #8a4819'}; border-radius:15px; cursor:pointer; opacity:${item === null ? '0.3' : '1'}; transform:${selectedOptionIndex === index ? 'scale(1.08)' : 'scale(1)'}; transition:all 0.2s;">
                    ${item ? `
                        <img src="${item.img}" style="width:100%; height:75px; object-fit:cover; border-radius:8px; pointer-events:none;">
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

function allowDrop(ev) {
    ev.preventDefault();
}

function handleDragStart(ev, index) {
    ev.dataTransfer.setData("optionIndex", index);
}

function handleDrop(ev, slotIndex) {
    ev.preventDefault();
    const optIndex = ev.dataTransfer.getData("optionIndex");
    if (optIndex !== null && optIndex !== undefined && availableOptions[optIndex] !== null) {
        selectedOptionIndex = parseInt(optIndex);
        placeInSlot(slotIndex);
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
// LOGIKA TANTANGAN 5 (MATCHING GAME - TEPAT 2 HEWAN)
// ==========================================
let matchingParents = [];
let matchingChildren = [];
let selectedParent = null;
let selectedChild = null;
let userMatches = {};

function renderMatchingChallenge() {
    const body = document.getElementById('challengeBody');
    body.innerHTML = `
        <p style="font-weight:800; font-size:1.1rem; margin-bottom:12px;">
            Sentuh 1 Induk di sebelah kiri, lalu sentuh Anaknya yang cocok di sebelah kanan!
        </p>

        <div style="display:flex; gap:50px; justify-content:center; align-items:center; margin:10px 0;">
            <!-- KOLOM INDUK (KIRI - HANYA 2 PASANG) -->
            <div style="display:flex; flex-direction:column; gap:15px;">
                ${matchingParents.map((parent) => {
                    const isSelected = selectedParent === parent.id;
                    const isMatched = userMatches[parent.id] !== undefined;
                    return `
                        <div onclick="selectParent('${parent.id}')" 
                             style="width:150px; padding:8px; background:#ffe066; 
                                    border:${isSelected ? '5px solid #ff0054' : isMatched ? '5px solid #38b000' : '4px solid #8a4819'}; 
                                    border-radius:18px; cursor:pointer; text-align:center; transition:all 0.2s;
                                    transform:${isSelected ? 'scale(1.05)' : 'scale(1)'};">
                            <img src="${parent.img}" style="width:100%; height:95px; object-fit:cover; border-radius:10px;">
                            <span style="font-size:0.95rem; font-weight:800; display:block; margin-top:4px;">${parent.name}</span>${isMatched ? '<span style="font-size:0.8rem; color:#38b000; font-weight:800;">✓ Terjodohkan</span>' : ''}
                        </div>
                    `;
                }).join('')}
            </div>

            <div style="font-size:2.5rem; font-weight:900; color:#5a382d;">➡️</div>

            <!-- KOLOM ANAK (KANAN - HANYA 2 PASANG DIACAK) -->
            <div style="display:flex; flex-direction:column; gap:15px;">
                ${matchingChildren.map((child) => {
                    const isSelected = selectedChild === child.id;
                    const isMatched = Object.values(userMatches).includes(child.id);
                    return `
                        <div onclick="selectChild('${child.id}')" 
                             style="width:150px; padding:8px; background:#ffe066; 
                                    border:${isSelected ? '5px solid #ff0054' : isMatched ? '5px solid #38b000' : '4px solid #8a4819'}; 
                                    border-radius:18px; cursor:pointer; text-align:center; transition:all 0.2s;
                                    transform:${isSelected ? 'scale(1.05)' : 'scale(1)'};">
                            <img src="${child.img}" style="width:100%; height:95px; object-fit:cover; border-radius:10px;">
                            <span style="font-size:0.95rem; font-weight:800; display:block; margin-top:4px;">${child.name}</span>${isMatched ? '<span style="font-size:0.8rem; color:#38b000; font-weight:800;">✓ Terjodohkan</span>' : ''}
                        </div>
                    `;
                }).join('')}
            </div>
        </div>

        <div style="margin-top:15px; display:flex; gap:15px; justify-content:center;">
            <button class="btn-green-3d" style="font-size:1.2rem; padding:10px 30px;" onclick="checkMatchingAnswer()">COCOKKAN!</button>
            <button class="btn-top" style="background:#d90429; font-size:1rem; padding:10px 20px;" onclick="loadChallenge(5)">🔄 Reset</button>
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
    if (Object.keys(userMatches).length < 2) {
        if (typeof playVO === 'function') playVO('salah');
        showPopup('SALAH', 'Jodohkan kedua pasangan Induk dan Anak terlebih dahulu ya!');
        return;
    }

    let isAllCorrect = true;
    for (let parentId in userMatches) {
        if (userMatches[parentId] !== parentId) {
            isAllCorrect = false;
            break;
        }
    }
                      
    evalAnswer(isAllCorrect);
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
