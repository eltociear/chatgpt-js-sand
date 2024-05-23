const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const sandParticles = [];
const sandSize = 2;
const gravity = 0.5;

class SandParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vy = 0;
        this.color = this.randomColor();
    }

    randomColor() {
        const b = 255;
        const r = Math.floor(Math.random() * 256);
        const g = r; // 白から青の範囲に限定
        return `rgb(${r}, ${g}, ${b})`;
    }

    update() {
        this.vy += gravity;
        this.y += this.vy;

        // If particle falls below the canvas, reset to top
        if (this.y + sandSize > canvas.height) {
            this.y = -sandSize;
            this.vy = 0;
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, sandSize, sandSize);
    }
}

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    sandParticles.push(new SandParticle(x, y));
});

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    sandParticles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    requestAnimationFrame(animate);
}

animate();
