const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let balls = [];
let collisionCount = 0;
let removedCount = 0;

const CENTER = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 40 // smaller hollow circle
};

class Ball {
  constructor(x, y, dx, dy, radius, color) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.color = color;
    this.originalColor = color;
    this.collisionTimer = 0;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }

  update() {
    if (this.x + this.radius > canvas.width || this.x - this.radius < 0) this.dx *= -1;
    if (this.y + this.radius > canvas.height || this.y - this.radius < 0) this.dy *= -1;

    this.x += this.dx;
    this.y += this.dy;

    if (this.collisionTimer > 0) {
      this.collisionTimer--;
      if (this.collisionTimer === 0) {
        this.color = this.originalColor;
      }
    }

    this.draw();
  }

  collideWith(other) {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < this.radius + other.radius;
  }

  flash() {
    this.color = "#fff";
    this.collisionTimer = 10;
  }

  isInTarget() {
    const dx = this.x - CENTER.x;
    const dy = this.y - CENTER.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return dist < CENTER.radius;
  }
}

function randomColor() {
  return `hsl(${Math.random() * 360}, 100%, 50%)`;
}

function addBall() {
  const radius = 25; // Larger balls
  const x = Math.random() * (canvas.width - radius * 2) + radius;
  const y = Math.random() * (canvas.height - radius * 2) + radius;
  const dx = (Math.random() - 0.5) * 10; // Faster speed
  const dy = (Math.random() - 0.5) * 10;
  const color = randomColor();
  balls.push(new Ball(x, y, dx, dy, radius, color));
  updateStats();
}

function updateStats() {
  document.getElementById('ballCount').textContent = balls.length;
  document.getElementById('collisionCount').textContent = collisionCount;
  document.getElementById('removedCount').textContent = removedCount;
}

function drawCenterCircle() {
  ctx.beginPath();
  ctx.strokeStyle = "#00ffff";
  ctx.lineWidth = 3;
  ctx.arc(CENTER.x, CENTER.y, CENTER.radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.closePath();
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawCenterCircle();

  for (let i = 0; i < balls.length; i++) {
    balls[i].update();

    for (let j = i + 1; j < balls.length; j++) {
      if (balls[i].collideWith(balls[j])) {
        balls[i].flash();
        balls[j].flash();
        collisionCount++;
        updateStats();
      }
    }
  }

  balls = balls.filter(ball => {
    if (ball.isInTarget()) {
      removedCount++;
      updateStats();
      return false;
    }
    return true;
  });

  requestAnimationFrame(animate);
}

// Start with 25 faster, larger balls
for (let i = 0; i < 25; i++) addBall();
animate();
