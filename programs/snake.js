// programs/snake.js
export class SnakeGame {
    constructor(onExitCallback) {
        this.onExit = onExitCallback;
        
        this.shellLog = document.getElementById('shell-log');
        this.inputRow = document.querySelector('.input-row');
        this.snakeScreen = document.getElementById('snake-screen');
        this.canvas = document.getElementById('snake-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreSpan = document.getElementById('snake-score');
        
        this.gridSize = 20;
        this.snake = [];
        this.food = { x: 0, y: 0 };
        this.dx = this.gridSize;
        this.dy = 0;
        this.score = 0;
        this.gameInterval = null;
        
        this.keyHandler = (e) => this.handleKeyDown(e);
    }

    open() {
        this.shellLog.classList.add('hidden-view');
        this.inputRow.classList.add('hidden-view');
        this.snakeScreen.classList.remove('hidden-view');
        
        window.addEventListener('keydown', this.keyHandler);
        this.resetGame();
        
        // Run the game engine frame ticks at a classic retro speed (100ms per step)
        this.gameInterval = setInterval(() => this.tick(), 100);
    }

    resetGame() {
        this.snake = [
            { x: 160, y: 200 },
            { x: 140, y: 200 },
            { x: 120, y: 200 }
        ];
        this.dx = this.gridSize;
        this.dy = 0;
        this.score = 0;
        this.scoreSpan.textContent = this.score;
        this.spawnFood();
    }

    spawnFood() {
        this.food.x = Math.floor(Math.random() * (this.canvas.width / this.gridSize)) * this.gridSize;
        this.food.y = Math.floor(Math.random() * (this.canvas.height / this.gridSize)) * this.gridSize;
    }

    handleKeyDown(e) {
        if (e.key === 'Escape') {
            e.preventDefault();
            this.close();
            return;
        }

        // Intercept Arrow Directions to change velocity vectors
        if (e.key === 'ArrowUp' && this.dy === 0) { this.dx = 0; this.dy = -this.gridSize; }
        if (e.key === 'ArrowDown' && this.dy === 0) { this.dx = 0; this.dy = this.gridSize; }
        if (e.key === 'ArrowLeft' && this.dx === 0) { this.dx = -this.gridSize; this.dy = 0; }
        if (e.key === 'ArrowRight' && this.dx === 0) { this.dx = this.gridSize; this.dy = 0; }
        
        // Prevent window scrolling while using navigation pad keys
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
        }
    }

    tick() {
        // Calculate new head coordinates position vectors
        const head = { x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy };
        
        // Frame boundary crash check loops
        if (head.x < 0 || head.x >= this.canvas.width || head.y < 0 || head.y >= this.canvas.height || this.checkSelfCollision(head)) {
            alert(`GAME OVER! Final Score achieved: ${this.score}`);
            this.resetGame();
            return;
        }

        this.snake.unshift(head);

        // Check if snake head touches target coordinates
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.scoreSpan.textContent = this.score;
            this.spawnFood();
        } else {
            this.snake.pop();
        }

        this.draw();
    }

    checkSelfCollision(head) {
        return this.snake.some(segment => segment.x === head.x && segment.y === head.y);
    }

    draw() {
        // Background Refresh
        this.ctx.fillStyle = '#000500';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw Matrix Grid Accent Background
        this.ctx.strokeStyle = '#001100';
        for (let i = 0; i < this.canvas.width; i += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(i, 0); this.ctx.lineTo(i, this.canvas.height);
            this.ctx.moveTo(0, i); this.ctx.lineTo(this.canvas.width, i);
            this.ctx.stroke();
        }

        // Draw Food Object Core
        this.ctx.fillStyle = '#ff5555';
        this.ctx.fillRect(this.food.x + 2, this.food.y + 2, this.gridSize - 4, this.gridSize - 4);

        // Draw Snake Node Array Items
        this.snake.forEach((segment, idx) => {
            this.ctx.fillStyle = idx === 0 ? '#55ff55' : '#00aa00'; // Flash head brighter
            this.ctx.fillRect(segment.x + 1, segment.y + 1, this.gridSize - 2, this.gridSize - 2);
        });
    }

    close() {
        clearInterval(this.gameInterval);
        window.removeEventListener('keydown', this.keyHandler);
        
        this.snakeScreen.classList.add('hidden-view');
        this.shellLog.classList.remove('hidden-view');
        this.inputRow.classList.remove('hidden-view');
        this.onExit();
    }
}
