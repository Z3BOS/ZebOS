export class TextEditor {
    constructor(osLogElement, onExitCallback) {
        this.logElement = osLogElement;
        this.onExit = onExitCallback;
        this.content = "";
    }

    // Opens the editor view
    open() {
        this.printSystemLine("--- TEXT EDITOR OPENED ---");
        this.printSystemLine("Type lines of text freely. Type 'exit' to close.");
    }

    // Handles text input sent from the OS shell
    handleInput(line) {
        const cleanLine = line.trim();
        
        if (cleanLine.toLowerCase() === 'exit') {
            this.close();
            return;
        }

        this.content += line + "\n";
        this.printLine(`> ${line}`);
    }

    // Returns the saved content buffer
    getContent() {
        return this.content || "[File is empty]";
    }

    close() {
        this.printSystemLine("--- TEXT EDITOR CLOSED ---");
        this.onExit(); // Notify the OS kernel that editing has stopped
    }

    // Internal UI helpers
    printLine(text) {
        const entry = document.createElement('div');
        entry.className = 'log-entry editor-line';
        entry.textContent = `[${new Date().toLocaleTimeString()}] ${text}`;
        this.logElement.appendChild(entry);
        this.logElement.scrollTop = this.logElement.scrollHeight;
    }

    printSystemLine(text) {
        const entry = document.createElement('div');
        entry.className = 'log-entry system';
        entry.textContent = text;
        this.logElement.appendChild(entry);
        this.logElement.scrollTop = this.logElement.scrollHeight;
    }
}
