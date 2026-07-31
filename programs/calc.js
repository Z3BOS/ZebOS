// calc.js
export class RetroCalculator {
    constructor(onExitCallback) {
        this.onExit = onExitCallback;
        
        // Query elements from the layout registry maps
        this.shellLog = document.getElementById('shell-log');
        this.inputRow = document.querySelector('.input-row');
        this.calcScreen = document.getElementById('calc-screen');
        this.displayBox = document.getElementById('calc-display-box');
        
        // Intercept arrays state trackers
        this.currentValue = "0";
        this.storedValue = null;
        this.activeOperator = null;
        this.resetOnNextInput = false;

        this.keyHandler = (e) => this.handleKeyDown(e);
        this.clickHandler = (e) => this.handleButtonClick(e);
    }

    open() {
        // Toggle system UI screens viewport elements visibility layers flags
        this.shellLog.classList.add('hidden-view');
        this.inputRow.classList.add('hidden-view');
        this.calcScreen.classList.remove('hidden-view');
        
        this.clearAll();
        
        // Listen directly for hardware inputs pipeline hooks
        window.addEventListener('keydown', this.keyHandler);
        this.calcScreen.addEventListener('click', this.clickHandler);
    }

    handleButtonClick(e) {
        if (!e.target.classList.contains('calc-btn')) return;
        const btnText = e.target.textContent;
        this.processInput(btnText);
    }

    handleKeyDown(e) {
        if (e.key === 'Escape') {
            e.preventDefault();
            this.close();
            return;
        }

        // Forward matching physical keystrokes straight to calculation parsing routine logic
        const validKeys = "0123456789.+-*/=";
        if (validKeys.includes(e.key)) {
            this.processInput(e.key);
        } else if (e.key === 'Enter') {
            this.processInput('=');
        } else if (e.key.toLowerCase() === 'c') {
            this.processInput('C');
        }
    }

    processInput(value) {
        if (!isNaN(value) || value === '.') {
            this.appendDigit(value);
        } else if (value === 'C') {
            this.clearAll();
        } else if (value === '=') {
            this.evaluateEquation();
        } else {
            this.setOperator(value);
        }
        this.updateDisplay();
    }

    appendDigit(digit) {
        if (this.resetOnNextInput) {
            this.currentValue = "";
            this.resetOnNextInput = false;
        }
        if (digit === '.' && this.currentValue.includes('.')) return;
        if (this.currentValue === "0" && digit !== '.') this.currentValue = "";
        
        this.currentValue += digit;
    }

    setOperator(op) {
        if (this.activeOperator && !this.resetOnNextInput) {
            this.evaluateEquation();
        }
        this.storedValue = parseFloat(this.currentValue);
        this.activeOperator = op;
        this.resetOnNextInput = true;
    }

    evaluateEquation() {
        if (!this.activeOperator || this.storedValue === null) return;
        
        const current = parseFloat(this.currentValue);
        let result = 0;

        switch (this.activeOperator) {
            case '+': result = this.storedValue + current; break;
            case '-': result = this.storedValue - current; break;
            case '*': result = this.storedValue * current; break;
            case '/': result = current !== 0 ? this.storedValue / current : "ERR: DIV/0"; break;
        }

        this.currentValue = result.toString();
        this.activeOperator = null;
        this.storedValue = null;
        this.resetOnNextInput = true;
    }

    clearAll() {
        this.currentValue = "0";
        this.storedValue = null;
        this.activeOperator = null;
        this.resetOnNextInput = false;
        this.updateDisplay();
    }

    updateDisplay() {
        // Cut string value down if it overflows layout spacing boundary limits
        if (this.currentValue.length > 14) {
            this.displayBox.textContent = this.currentValue.substring(0, 14);
        } else {
            this.displayBox.textContent = this.currentValue;
        }
    }

    close() {
        // Remove active running process listeners triggers context pipelines safely
        window.removeEventListener('keydown', this.keyHandler);
        this.calcScreen.removeEventListener('click', this.clickHandler);
        
        // Return visibility configurations back to system shell state defaults logs
        this.calcScreen.classList.add('hidden-view');
        this.shellLog.classList.remove('hidden-view');
        this.inputRow.classList.remove('hidden-view');
        
        this.onExit();
    }
}
