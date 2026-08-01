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
        if (e.key === 'Escape') { e.preventDefault(); this.close(); return; }
        if (e.key === 'ArrowUp' && this.dy === 0) { this.dx = 0; this.dy = -this.gridSize; }
        if (e.key === 'ArrowDown' && this.dy === 0) { this.dx = 0; this.dy = this.gridSize; }
        if (e.key === 'ArrowLeft' && this.dx === 0) { this.dx = -this.gridSize; this.dy = 0; }
        if (e.key === 'ArrowRight' && this.dx === 0) { this.dx = this.gridSize; this.dy = 0; }
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
    }

    tick() {
        // Calculate raw next segment projection vectors
        let nextX = this.snake[0].x + this.dx;
        let nextY = this.snake[0].y + this.dy;

        // SP1 WRAP-AROUND PHYSICS: Loop coordinates smoothly to the opposite boundary edge
        if (nextX < 0) nextX = this.canvas.width - this.gridSize;
        if (nextX >= this.canvas.width) nextX = 0;
        if (nextY < 0) nextY = this.canvas.height - this.gridSize;
        if (nextY >= this.canvas.height) nextY = 0;

        const head = { x: nextX, y: nextY };
        
        // Self-collision checks remain active to maintain game challenge
        if (this.checkSelfCollision(head)) {
            alert(`GAME OVER! Final Score achieved: ${this.score}`);
            this.resetGame();
            return;
        }

        this.snake.unshift(head);

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
        this.ctx.fillStyle = '#000500';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.strokeStyle = '#001100';
        for (let i = 0; i < this.canvas.width; i += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(i, 0); this.ctx.lineTo(i, this.canvas.height);
            this.ctx.moveTo(0, i); this.ctx.lineTo(this.canvas.width, i);
            this.ctx.stroke();
        }
        this.ctx.fillStyle = '#ff5555';
        this.ctx.fillRect(this.food.x + 2, this.food.y + 2, this.gridSize - 4, this.gridSize - 4);
        this.snake.forEach((segment, idx) => {
            this.ctx.fillStyle = idx === 0 ? '#55ff55' : '#00aa00';
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
