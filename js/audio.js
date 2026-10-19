// Aset Efek Suara (SFX)
const sounds = {
    putar: new Audio('assets/audio/spin_wheel.mp3'),
    pemenang: new Audio('assets/audio/winner.mp3'),
    bukaKotak: new Audio('assets/audio/open_box.mp3'),
    benar: new Audio('assets/audio/correct.mp3'),
    salah: new Audio('assets/audio/wrong.mp3')
};

// Fungsi Voice Over (VO) Otomatis menggunakan Text-to-Speech Bawaan Browser
function speakText(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Hentikan suara sebelumnya jika ada
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'id-ID'; // Bahasa Indonesia
        utterance.rate = 1.0;     // Kecepatan normal
        utterance.pitch = 1.2;    // Nada ceria untuk murid SD
        window.speechSynthesis.speak(utterance);
    }
}

// Fungsi Pemutar Audio Utama Game
function playVO(type, customText = '') {
    if (type === 'putar') {
        sounds.putar.currentTime = 0;
        sounds.putar.play().catch(e => console.log(e));
        speakText("Ayo kita acak rodanya!");
    } 
    else if (type === 'terpilih') {
        sounds.pemenang.currentTime = 0;
        sounds.pemenang.play().catch(e => console.log(e));
        setTimeout(() => {
            speakText(`Selamat! Detektif ${customText}, giliranmu buka kotak misteri!`);
        }, 600);
    } 
    else if (type === 'buka_kotak') {
        sounds.bukaKotak.currentTime = 0;
        sounds.bukaKotak.play().catch(e => console.log(e));
        speakText("Wah, kotak misterimu terbuka! Siap-siap untuk tantanganmu!");
    } 
    else if (type === 'benar') {
        sounds.benar.currentTime = 0;
        sounds.benar.play().catch(e => console.log(e));
        setTimeout(() => {
            speakText(`Hebat sekali! Jawabanmu tepat, kamu dapat sepuluh poin!`);
        }, 400);
    } 
    else if (type === 'salah') {
        sounds.salah.currentTime = 0;
        sounds.salah.play().catch(e => console.log(e));
        setTimeout(() => {
            speakText(`Ayo coba lagi! Tetap semangat ya!`);
        }, 400);
    }
}
