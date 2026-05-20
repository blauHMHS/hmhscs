// script.js
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

// Make the canvas full screen
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();

// Character set (Matrix uses Japanese Katakana + Latin letters & numbers)
const katakana = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const alphabet = katakana.split("");

const fontSize = 16;
let columns = canvas.width / fontSize;

// An array to track the y-coordinate of the drop for each column
const rainDrops = [];

// Initialize the rain drops starting position at y = 1
function initRain() {
    columns = canvas.width / fontSize;
    for (let x = 0; x < columns; x++) {
        rainDrops[x] = 1;
    }
}
initRain();

// The main draw loop
function draw() {
    // Crucial trick: Draw a semi-transparent black rectangle over the 
    // canvas on every frame to create the "fading/glowing trail" effect.
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set font style
    ctx.font = fontSize + 'px monospace';

    // Loop through each column and draw a single character
    for (let i = 0; i < rainDrops.length; i++) {
        // Pick a random character
        const text = alphabet[Math.floor(Math.random() * alphabet.length)];
        
        // Calculate X and Y coordinates
        const x = i * fontSize;
        const y = rainDrops[i] * fontSize;

        // Make the leading character white for an authentic look, else neon green
        if (Math.random() > 0.98) {
            ctx.fillStyle = '#fff'; 
        } else {
            ctx.fillStyle = '#0F0'; // Neon Green
        }

        ctx.fillText(text, x, y);

        // Reset the drop back to the top randomly once it hits the bottom
        if (y > canvas.height && Math.random() > 0.975) {
            rainDrops[i] = 0;
        }
        
        // Move the drop down by one unit
        rainDrops[i]++;
    }
}

// Handle window resizing dynamically
window.addEventListener('resize', () => {
    resizeCanvas();
    initRain();
});

// Run the animation at roughly 30 frames per second
setInterval(draw, 30);