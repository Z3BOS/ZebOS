// editor.js
export class TextEditor {
    constructor(fileName, fileContent, onExitCallback) {
        this.fileName = fileName;
        this.content = fileContent;
        this.onExit = onExitCallback;
        
        // Query app container reference elements
        this.shellLog = document.getElementById('shell-log');
        this.inputRow = document.querySelector('.input-row');
        this.editorScreen = document.getElementById('editor-screen');
        this.textarea = document.getElementById('editor-textarea');
        this.fileNameSpan = document.getElementById('current-filename');
        
        // Menu Elements
        this.menuFile = document.getElementById('menu-file');
        this.fileDropdown = document.getElementById('file-dropdown');
        this.optSave = document.getElementById('opt-save');
        this.optSaveAs = document.getElementById('opt-saveas');
        this.optExit = document.getElementById('opt-exit');

        // Dynamic Bound Handlers for Clean Cleanup Hooks
        this.keyHandler = (e) => this.handleKeyDown(e);
        this.menuToggleHandler = (e) => this.toggleDropdown(e);
        this.saveClickHandler = () => this.saveFile();
        this.saveAsClickHandler = () => this.saveAsFile();
        this.exitClickHandler = () => this.close();
    }

    open() {
        this.shellLog.classList.add('hidden-view');
        this.inputRow.classList.add('hidden-view');
        this.editorScreen.classList.remove('hidden-view');
        
        this.fileNameSpan.textContent = this.fileName;
        this.textarea.value = this.content;
        this.textarea.focus();
        
        window.addEventListener('keydown', this.keyHandler);
        this.menuFile.addEventListener('click', this.menuToggleHandler);
        this.optSave.addEventListener('click', this.saveClickHandler);
        this.optSaveAs.addEventListener('click', this.saveAsClickHandler);
        this.optExit.addEventListener('click', this.exitClickHandler);
    }

    toggleDropdown(e) {
        e.stopPropagation();
        this.fileDropdown.classList.toggle('hidden-view');
        this.menuFile.classList.toggle('active');
    }

    handleKeyDown(e) {
        if (e.key === 'F2') {
            e.preventDefault();
            this.saveFile();
        }
        if (e.key === 'F3') {
            e.preventDefault();
            this.saveAsFile();
        }
        if (e.key === 'Escape') {
            e.preventDefault();
            this.close();
        }
    }

    saveFile() {
        this.content = this.textarea.value;
        this.hideMenu();
        
        this.flashFooterFeedback(`SAVED SUCCESSFUL TO FILE: ${this.fileName}`);
    }

    saveAsFile() {
        this.hideMenu();
        
        // Open browser prompt to capture new file name target
        const newName = prompt("Enter new filename:", this.fileName);
        
        // If the user cancelled or provided empty strings, do not execute rename procedure
        if (newName === null || newName.trim() === "") {
            this.textarea.focus();
            return;
        }
        
        this.fileName = newName.trim();
        this.content = this.textarea.value;
        this.fileNameSpan.textContent = this.fileName;
        
        this.flashFooterFeedback(`SAVED AS SUCCESSFUL: ${this.fileName}`);
        this.textarea.focus();
    }

    hideMenu() {
        this.fileDropdown.classList.add('hidden-view');
        this.menuFile.classList.remove('active');
    }

    flashFooterFeedback(message) {
        const footer = document.getElementById('editor-footer');
        footer.textContent = message;
        footer.style.backgroundColor = "#55ff55";
        
        setTimeout(() => {
            footer.textContent = "F2: Save File | F3: Save As | Esc: Exit Editor View";
            footer.style.backgroundColor = "#00aaaa";
        }, 1500);
    }

    close() {
        this.content = this.textarea.value;
        
        window.removeEventListener('keydown', this.keyHandler);
        this.menuFile.removeEventListener('click', this.menuToggleHandler);
        this.optSave.removeEventListener('click', this.saveClickHandler);
        this.optSaveAs.removeEventListener('click', this.saveAsClickHandler);
        this.optExit.removeEventListener('click', this.exitClickHandler);
        
        this.hideMenu();
        this.editorScreen.classList.add('hidden-view');
        
        this.shellLog.classList.remove('hidden-view');
        this.inputRow.classList.remove('hidden-view');
        
        // Pass final state back to os.js filesystem container map tracking
        this.onExit(this.fileName, this.content);
    }
}
