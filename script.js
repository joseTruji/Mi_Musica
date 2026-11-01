const lrcText = `
[00:32.78] Antes de tres lunas volvería por ti
[00:39.25] Antes que me eches de menos
[00:45.23] Dejaste vías muertas, hundidas, al pasar
[00:51.73] Nunca te he esperado tanto
[00:56.48] A un minuto de ti
[00:59.85] Voy detrás de ti
[01:02.85] A un minuto de ti, te seguiré
[01:10.77] El viento se ha calzado sus guantes de piel
[01:17.32] Se entretiene con mi pelo
[01:23.81] Bebo el agua que viene conmigo, estoy
[01:30.11] Estancado en tu reflejo
[01:34.94] Solamente de ti, gota a gota
[01:41.36] Solamente de ti, veneno y sed
        `;

function parseLRC(text) {
    const lines = text.trim().split('\n');
    const result = [];
    const regex = /\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/;

    lines.forEach(line => {
        const match = line.match(regex);
        if (match) {
            const timeInSeconds = (parseInt(match[1]) * 60) + parseInt(match[2]) + (parseInt(match[3]) / 100);
            const lyricText = match[4].trim();
            if (lyricText) result.push({ time: timeInSeconds, text: lyricText });
        }
    });
    return result;
}

const letrasData = parseLRC(lrcText);
const audio = document.getElementById('audio-player');
const container = document.getElementById('lyrics-container');
const playBtn = document.getElementById('play-btn');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');
const cover = document.getElementById('cover');
const coverWrapper = document.getElementById('cover-wrapper');

let particleInterval;
const notes = ['♪', '♫', '♬', '♩'];

function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.innerText = notes[Math.floor(Math.random() * notes.length)];
    
    const tx = (Math.random() - 0.5) * 160; 
    const rot = (Math.random() - 0.5) * 120; 
    
    particle.style.setProperty('--tx', `${tx}px`);
    particle.style.setProperty('--rot', `${rot}deg`);
    
    coverWrapper.appendChild(particle);
    
    setTimeout(() => {
        particle.remove();
    }, 2500);
}

playBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
        playBtn.classList.add('playing');
        cover.style.animationPlayState = 'running';
        
        particleInterval = setInterval(createParticle, 500);
    } else {
        audio.pause();
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
        playBtn.classList.remove('playing');
        cover.style.animationPlayState = 'paused';
        
        clearInterval(particleInterval);
    }
});

letrasData.forEach((line) => {
    const div = document.createElement('div');
    div.className = 'lyric-line';
    div.innerText = line.text;
    container.appendChild(div);
});

audio.addEventListener('timeupdate', () => {
    const currentTime = audio.currentTime;
    let activeIndex = -1;

    for (let i = 0; i < letrasData.length; i++) {
        if (currentTime >= letrasData[i].time) {
            activeIndex = i;
        }
    }

    const allLines = document.querySelectorAll('.lyric-line');
    allLines.forEach((line, index) => {
        if (index === activeIndex) {
            line.classList.add('active');
            line.classList.remove('exit');
        } else if (index < activeIndex) {
            line.classList.remove('active');
            line.classList.add('exit');
        } else {
            line.classList.remove('active');
            line.classList.remove('exit');
        }
    });
    
    if (activeIndex !== -1 && activeIndex < letrasData.length - 1) {
        const nextTime = letrasData[activeIndex + 1].time;
        if (nextTime - currentTime > 5 && currentTime - letrasData[activeIndex].time > 4) {
            allLines[activeIndex].classList.remove('active');
            allLines[activeIndex].classList.add('exit');
        }
    }
});