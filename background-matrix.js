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

function initRain() {
    columns = Math.floor(canvas.width / fontSize);
    rainDrops = [];
    for (let x = 0; x < columns; x++) {
        // Stagger positions so it doesn't all fall at once
        rainDrops[x] = Math.floor(Math.random() * -30); 
    }
}
initRain();

function draw() {
    // Semi-transparent black background creates the trailing fade effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < rainDrops.length; i++) {
        const x = i * fontSize;
        const y = rainDrops[i] * fontSize;

        if (y >= 0) {
            const text = alphabet[Math.floor(Math.random() * alphabet.length)];
            
            // Fainter rain logic:
            // 5% chance to flash a slightly brighter dim green, otherwise a very dark green
            if (Math.random() > 0.95) {
                ctx.fillStyle = 'rgba(0, 180, 0, 0.25)'; 
            } else {
                ctx.fillStyle = 'rgba(0, 100, 0, 0.12)'; // Low opacity green makes it faint and look far away
            }
            
            ctx.fillText(text, x, y);
        }

        // Reset code to the top when it clears the bottom
        if (y > canvas.height && Math.random() > 0.975) {
            rainDrops[i] = 0;
        }
        
        rainDrops[i]++;
    }
}

window.addEventListener('resize', () => {
    resizeCanvas();
    initRain();
});

// Runs smoothly at standard 40ms intervals
setInterval(draw, 40);