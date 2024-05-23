const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const sandParticles = [];
const walls = [];
const sandSize = 2;
const gravity = 0.5;
let isDragging = false;
let startX, startY;

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

        // Check for collision with walls
        walls.forEach(wall => {
            if (this.x >= wall.x && this.x <= wall.x + wall.width &&
                this.y + sandSize >= wall.y && this.y <= wall.y + wall.height) {
                this.y = wall.y - sandSize;
                this.vy = 0;
            }
        });

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

class Wall {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw() {
        ctx.fillStyle = 'gray';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
    isDragging = true;
});

canvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const rect = canvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;
        const width = currentX - startX;
        const height = currentY - startY;
        walls.push(new Wall(startX, startY, width, height));
        startX = currentX;
        startY = currentY;
    } else {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        sandParticles.push(new SandParticle(x, y));
    }
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
});

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    walls.forEach(wall => wall.draw());

    sandParticles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    requestAnimationFrame(animate);
}

animate();
