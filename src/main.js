/* --- 기존 코드 시작 (수정 금지 영역) --- */
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let width, height;
let balls = [];

const mouse = {
    x: undefined,
    y: undefined,
    radius: 220 
};

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}

window.addEventListener('resize', resize);
window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

window.addEventListener('mouseout', () => {
    mouse.x = undefined;
    mouse.y = undefined;
});

class Ball {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 35 + 15;
        this.vx = (Math.random() - 0.5) * 1.2; 
        this.vy = (Math.random() - 0.5) * 1.2;
        this.density = (Math.random() * 25) + 15;
        this.hue = Math.random() * 40 + 220; 
        this.color = `hsla(${this.hue}, 70%, 50%, 0.3)`; 
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (mouse.x !== undefined) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouse.radius) {
                let force = (mouse.radius - distance) / mouse.radius;
                let directionX = (dx / distance) * force * this.density;
                let directionY = (dy / distance) * force * this.density;
                this.x -= directionX;
                this.y -= directionY;
            }
        }
        if (this.x - this.size < 0) { this.x = this.size; this.vx *= -1; } 
        else if (this.x + this.size > width) { this.x = width - this.size; this.vx *= -1; }
        if (this.y - this.size < 0) { this.y = this.size; this.vy *= -1; } 
        else if (this.y + this.size > height) { this.y = height - this.size; this.vy *= -1; }
    }

    draw() {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        ctx.save();
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 0.5; 
        ctx.strokeStyle = `hsla(${this.hue}, 80%, 70%, 0.6)`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }
}

function init() {
    resize();
    balls = [];
    for (let i = 0; i < 100; i++) {
        balls.push(new Ball());
    }
}

function animate() {
    ctx.fillStyle = 'rgba(10, 10, 11, 0.1)';
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'lighter'; 
    balls.forEach(ball => {
        ball.update();
        ball.draw();
    });
    ctx.globalCompositeOperation = 'source-over';
    requestAnimationFrame(animate);
}

window.openProjectDetail = function(title, description) {
    const modal = document.getElementById('project-modal');
    const container = document.getElementById('scramble-text-container');
    modal.style.display = "block";
    container.innerHTML = ""; 
    const fullText = `${title} : ${description}`;
    fullText.split("").forEach((char, i) => {
        const span = document.createElement('span');
        span.innerText = char === " " ? "\u00A0" : char;
        span.className = 'scramble-char';
        const randomX = (Math.random() - 0.5) * 1000;
        const randomY = (Math.random() - 0.5) * 1000;
        const randomRotate = Math.random() * 720;
        span.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotate}deg)`;
        span.style.opacity = "0";
        container.appendChild(span);
        setTimeout(() => {
            span.style.transform = `translate(0, 0) rotate(0deg)`;
            span.style.opacity = "1";
        }, 100 + i * 30);
    });
};

window.closeModal = function() {
    document.getElementById('project-modal').style.display = "none";
};

window.openScrambleModal = function(title, description) {
    const modal = document.getElementById('scramble-modal');
    const container = document.getElementById('scramble-effect-container');
    modal.style.display = "block";
    container.innerHTML = ""; 
    const targetContent = `${title} : ${description}`;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#@$%&?0123456789";
    targetContent.split("").forEach((char, index) => {
        const span = document.createElement('span');
        span.className = 'scramble-char'; 
        span.style.opacity = "1";
        span.style.color = "#00f2ff";
        container.appendChild(span);
        let iteration = 0;
        const interval = setInterval(() => {
            span.innerText = chars[Math.floor(Math.random() * chars.length)];
            if (iteration >= 10 + index * 2) { 
                span.innerText = char === " " ? "\u00A0" : char;
                clearInterval(interval);
            }
            iteration += 1;
        }, 35);
    });
};

window.closeScrambleModal = function() {
    document.getElementById('scramble-modal').style.display = "none";
};
/* --- 기존 코드 끝 --- */

/* --- 7번째 프로젝트: Real Wiper Physics (마찰 및 부착 로직) --- */
let waterCanvas, waterCtx, wiperParticles = [], isWiperActive = false;
let wiperBar = { 
    x: 0, y: 0, 
    angle: -Math.PI / 2, 
    prevAngle: -Math.PI / 2,
    length: 0, 
    t: 0 
};
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

class FallingChar {
    constructor(canvasWidth) {
        this.reset(canvasWidth);
    }

    reset(canvasWidth) {
        this.char = chars[Math.floor(Math.random() * chars.length)];
        this.x = Math.random() * canvasWidth;
        this.y = -30;
        this.vx = 0;
        this.vy = Math.random() * 0.5 + 0.5; // 천천히 낙하
        this.isStuck = false; // 막대에 붙어있는 상태
        this.angle = 0;
        this.va = 0;
        this.friction = Math.random() * 0.05 + 0.02; // 글자마다 다른 마찰력
    }

    update() {
        if (!this.isStuck) {
            // 1. 공중에 떠 있을 때: 아래로 낙하 + 기존 관성
            this.x += this.vx;
            this.y += this.vy;
            this.vx *= 0.99; // 공기 저항
            
            // 막대와의 충돌 체크
            const barEndX = wiperBar.x + Math.cos(wiperBar.angle) * wiperBar.length;
            const barEndY = wiperBar.y + Math.sin(wiperBar.angle) * wiperBar.length;
            const dx = barEndX - wiperBar.x;
            const dy = barEndY - wiperBar.y;
            const l2 = dx * dx + dy * dy;
            let t = Math.max(0, Math.min(1, ((this.x - wiperBar.x) * dx + (this.y - wiperBar.y) * dy) / l2));
            const projX = wiperBar.x + t * dx;
            const projY = wiperBar.y + t * dy;
            const dist = Math.sqrt((this.x - projX) ** 2 + (this.y - projY) ** 2);

            // 막대에 닿는 순간 '부착'
            if (dist < 15 && this.y < projY) {
                this.isStuck = true;
            }
        } else {
            // 2. 막대에 붙어 있을 때: 막대의 궤적을 따라 이동
            const barAngularVel = wiperBar.angle - wiperBar.prevAngle; // 막대의 회전 속도
            
            // 현재 막대 위에서의 상대적 위치 계산
            const distFromPivot = Math.sqrt((this.x - wiperBar.x)**2 + (this.y - wiperBar.y)**2);
            
            // 막대가 글자를 밀어냄 (부착 상태 유지하며 이동)
            this.x = wiperBar.x + Math.cos(wiperBar.angle) * distFromPivot;
            this.y = wiperBar.y + Math.sin(wiperBar.angle) * distFromPivot;

            // 막대의 회전 속도가 빨라지거나, 막대가 아래로 기울면 '원심력/중력'으로 인해 떨어져 나감
            if (Math.abs(barAngularVel) > 0.015 || Math.random() < 0.01) {
                this.isStuck = false;
                // 막대의 접선 방향으로 튕겨나가는 속도 부여
                this.vx = Math.cos(wiperBar.angle - Math.PI/2) * (barAngularVel * 500);
                this.vy = Math.sin(wiperBar.angle - Math.PI/2) * (barAngularVel * 500);
                this.va = barAngularVel * 10; // 회전 효과
            }
        }

        // 화면 밖 재생성
        if (this.y > waterCanvas.height + 50 || this.x < -100 || this.x > waterCanvas.width + 100) {
            this.reset(waterCanvas.width);
        }
    }

    draw() {
        waterCtx.save();
        waterCtx.translate(this.x, this.y);
        waterCtx.rotate(this.angle);
        waterCtx.fillStyle = this.isStuck ? "#ffffff" : "#00f2ff";
        waterCtx.font = "bold 18px Pretendard";
        waterCtx.shadowBlur = this.isStuck ? 10 : 0;
        waterCtx.shadowColor = "#ffffff";
        waterCtx.fillText(this.char, 0, 0);
        waterCtx.restore();
    }
}

function animateWater() {
    if (!isWiperActive) return;
    waterCtx.clearRect(0, 0, waterCanvas.width, waterCanvas.height);

    // 실제 와이퍼 속도 (천천히)
    wiperBar.prevAngle = wiperBar.angle;
    wiperBar.t += 0.008; 
    wiperBar.angle = -Math.PI / 2 + (Math.sin(wiperBar.t) * (Math.PI / 2.2));

    // 와이퍼 바 그리기
    waterCtx.strokeStyle = "rgba(0, 242, 255, 0.8)";
    waterCtx.lineWidth = 8;
    waterCtx.lineCap = "round";
    waterCtx.beginPath();
    waterCtx.moveTo(wiperBar.x, wiperBar.y);
    waterCtx.lineTo(
        wiperBar.x + Math.cos(wiperBar.angle) * wiperBar.length,
        wiperBar.y + Math.sin(wiperBar.angle) * wiperBar.length
    );
    waterCtx.stroke();

    wiperParticles.forEach(p => {
        p.update();
        p.draw();
    });

    requestAnimationFrame(animateWater);
}

window.openWaterModal = function() {
    const modal = document.getElementById('water-modal');
    modal.style.display = "block";
    waterCanvas = document.getElementById('water-canvas');
    waterCtx = waterCanvas.getContext('2d');
    
    waterCanvas.width = waterCanvas.offsetWidth;
    waterCanvas.height = 450;

    wiperBar.x = waterCanvas.width / 2;
    wiperBar.y = waterCanvas.height;
    wiperBar.length = waterCanvas.height * 0.95;
    wiperBar.t = 0;
    
    isWiperActive = true;
    wiperParticles = [];
    for (let i = 0; i < 300; i++) { /* --- 글자 갯수 조절 300 --- */
        wiperParticles.push(new FallingChar(waterCanvas.width));
    }
    
    animateWater();
};

window.closeWaterModal = function() {
    document.getElementById('water-modal').style.display = "none";
    isWiperActive = false;
};

init();
animate();