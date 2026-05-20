const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();

const katakana = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const alphabet = katakana.split("");

// LARGER FONT SIZE
const fontSize = 24; 
let columns = canvas.width / fontSize;
let rainDrops = [];

// Track special clickable words currently on screen
let specialWords = [];

function initRain() {
    columns = Math.floor(canvas.width / fontSize);
    rainDrops = [];
    for (let x = 0; x < columns; x++) {
        rainDrops[x] = Math.floor(Math.random() * -20); 
    }
}
initRain();

function draw() {
    ctx.shadowBlur = 0;
    ctx.shadowColor = "transparent";

    // Balanced fade layer for normal rain drops
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
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
                ctx.fillStyle = '#fff'; // White highlights
            } else {
                ctx.fillStyle = '#0F0'; // Classic Matrix Green
            }
            ctx.fillText(text, x, y);
        }

        // Reset rain drop to top if it hits the bottom
        if (y > canvas.height && Math.random() > 0.985) {
            rainDrops[i] = 0;

            // 2. CHANCE TO SPAWN THE HIDDEN CLICKABLE WORD
            if (Math.random() > 0.90) { 
                specialWords.push({
                    text: "HMHS",
                    x: x,
                    y: 0, 
                    width: fontSize,
                    height: 4 * fontSize 
                });
                // Delay normal rain column so it doesn't mesh right on top instantly
                rainDrops[i] = -8; 
            }
        }
        
        rainDrops[i]++;
    }

    // 3. DRAW SPECIAL "HMHS" WORDS IN MATCHING GREEN
    ctx.font = `bold ${fontSize}px monospace`;

    specialWords.forEach(word => {
        // TAIL WIPER FIX: Wipe out a clean column of space directly over the word's trajectory
        // This clears out the old blurry residue left behind by previous frames.
        ctx.fillStyle = '#000000';
        ctx.fillRect(word.x, word.y - 10, word.width, word.height + 20);

        // Render the actual crisp letters over the freshly cleaned canvas segment
        ctx.fillStyle = '#00FF00'; 
        
        // Draw the word vertically, letter by letter
        for (let j = 0; j < word.text.length; j++) {
            ctx.fillText(word.text[j], word.x, word.y + (j * fontSize));
        }
        
        // SLOWER FALL SPEED
        word.y += 2; 
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

        if (mouseX >= leftOfWord && mouseX <= rightOfWord &&
            mouseY >= topOfWord && mouseY <= bottomOfWord) {
            
            window.open("club.html", "_self"); 
        }
    });
});

// Change mouse cursor to a pointer when hovering over the hidden words
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

// SLOWER LOOP INTERVAL
setInterval(draw, 65);