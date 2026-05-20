const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();

const katakana = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const alphabet = katakana.split("");

const fontSize = 16;
let columns = canvas.width / fontSize;
let rainDrops = [];

// Track special clickable words currently on screen
let specialWords = [];

function initRain() {
    columns = Math.floor(canvas.width / fontSize);
    rainDrops = [];
    for (let x = 0; x < columns; x++) {
        // Start raindrops at staggered negative positions so they don't fall in a flat line initially
        rainDrops[x] = Math.floor(Math.random() * -20); 
    }
}
initRain();

function draw() {
    // Semi-transparent black background creates the trailing fade effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = fontSize + 'px monospace';

    // Filter out special words that have completely fallen off the bottom of the screen
    specialWords = specialWords.filter(word => word.y < canvas.height);

    for (let i = 0; i < rainDrops.length; i++) {
        const x = i * fontSize;
        const y = rainDrops[i] * fontSize;

        // 1. DRAW NORMAL GREEN RAIN
        if (y >= 0) {
            const text = alphabet[Math.floor(Math.random() * alphabet.length)];
            if (Math.random() > 0.98) {
                ctx.fillStyle = '#fff'; // White lightning highlights
            } else {
                ctx.fillStyle = '#0F0'; // Classic Matrix Green
            }
            ctx.fillText(text, x, y);
        }

        // Reset rain drop to top if it hits the bottom
        if (y > canvas.height && Math.random() > 0.975) {
            rainDrops[i] = 0;

            // 2. CHANCE TO SPAWN THE SPECIAL RED WORD
            if (Math.random() > 0.93) { 
                specialWords.push({
                    text: "HMHS",
                    x: x,
                    y: 0, // Starts at the top of the screen
                    width: fontSize,
                    height: 4 * fontSize // 4 characters long
                });
                // Delays this specific column's green rain so it doesn't overlap the red text immediately
                rainDrops[i] = -6; 
            }
        }
        
        rainDrops[i]++;
    }

    // 3. DRAW SPECIAL "HMHS" WORDS ON TOP (SOLID RED - NO GLOW/BLEED)
    ctx.font = `bold ${fontSize}px monospace`;

    specialWords.forEach(word => {
        ctx.fillStyle = '#FF3333'; // Vibrant, solid Matrix Red without any bleeding shadows
        
        // Draw the word vertically, letter by letter
        for (let j = 0; j < word.text.length; j++) {
            ctx.fillText(word.text[j], word.x, word.y + (j * fontSize));
        }
        
        // Moves the special word down the screen smoothly
        word.y += 4; 
    });
}

// 4. CLICK DETECTION
canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    specialWords.forEach(word => {
        const leftOfWord = word.x;
        const rightOfWord = word.x + word.width;
        const topOfWord = word.y;
        const bottomOfWord = word.y + word.height;

        // Check if the click coordinates fall inside the word's current box
        if (mouseX >= leftOfWord && mouseX <= rightOfWord &&
            mouseY >= topOfWord && mouseY <= bottomOfWord) {
            
            // Redirects to club.html in the same directory and opens in the same tab
            window.open("club.html", "_self"); 
        }
    });
});

// Change mouse cursor to a pointer when hovering over a red word
canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    let hovering = false;

    specialWords.forEach(word => {
        if (mouseX >= word.x && mouseX <= word.x + word.width &&
            mouseY >= word.y && mouseY <= word.y + word.height) {
            hovering = true;
        }
    });

    canvas.style.cursor = hovering ? 'pointer' : 'default';
});

window.addEventListener('resize', () => {
    resizeCanvas();
    initRain();
});

// Kickoff animation loop
setInterval(draw, 40);