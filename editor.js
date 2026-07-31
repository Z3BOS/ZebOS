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
        this.optExit = document.getElementById('opt-exit');

        // Dynamic Bound Handlers for Clean Cleanup Hooks
        this.keyHandler = (e) => this.handleKeyDown(e);
        this.menuToggleHandler = (e) => this.toggleDropdown(e);
        this.saveClickHandler = () => this.saveFile();
        this.exitClickHandler = () => this.close();
    }

    open() {
        // Toggle view presentation frameworks layers visibility
        this.shellLog.classList.add('hidden-view');
        this.inputRow.classList.add('hidden-view');
        this.editorScreen.classList.remove('hidden-view');
        
        // Pass payload values arrays strings back onto UI elements fields
        this.fileNameSpan.textContent = this.fileName;
        this.textarea.value = this.content;
        this.textarea.focus();
        
        // Setup Functional Keyboard Framework Listeners 
        window.addEventListener('keydown', this.keyHandler);
        this.menuFile.addEventListener('click', this.menuToggleHandler);
        this.optSave.addEventListener('click', this.saveClickHandler);
        this.optExit.addEventListener('click', this.exitClickHandler);
    }

    toggleDropdown(e) {
        e.stopPropagation();
        this.fileDropdown.classList.toggle('hidden-view');
        this.menuFile.classList.toggle('active');
    }

    handleKeyDown(e) {
        // Intercept F2 Hotkey to instantly execute save command operations
        if (e.key === 'F2') {
            e.preventDefault();
            this.saveFile();
        }
        // Intercept Escape key string inputs to shut framework layer down
        if (e.key === 'Escape') {
            e.preventDefault();
            this.close();
        }
    }

    saveFile() {
        this.content = this.textarea.value;
        // Close the open dropdown menu after click action complete
        this.fileDropdown.classList.add('hidden-view');
        this.menuFile.classList.remove('active');
        
        // Flash feedback to the bottom UI banner to let the user know it worked
        const footer = document.getElementById('editor-footer');
        footer.textContent = `SAVED SUCCESSFUL TO LOCAL DEVICE REGISTRY TREE BUFFER!`;
        footer.style.backgroundColor = "#55ff55";
        
        setTimeout(() => {
            footer.textContent = "F2: Save File | Esc: Exit Editor View";
            footer.style.backgroundColor = "#00aaaa";
        }, 1500);
    }

    close() {
        // Sync active state buffer data
        this.content = this.textarea.value;
        
        // Unbind UI dynamic event triggers pipelines hook points
        window.removeEventListener('keydown', this.keyHandler);
        this.menuFile.removeEventListener('click', this.menuToggleHandler);
        this.optSave.removeEventListener('click', this.saveClickHandler);
        this.optExit.removeEventListener('click', this.exitClickHandler);
        
        // Clean out active views states dropdown presentation layer frameworks
        this.fileDropdown.classList.add('hidden-view');
        this.menuFile.classList.remove('active');
        this.editorScreen.classList.add('hidden-view');
        
        // Return visibility configurations back to standard system console logging layout view
        this.shellLog.classList.remove('hidden-view');
        this.inputRow.classList.remove('hidden-view');
        
        // Send final transaction context back into original master state tracker core pipeline array hook
        this.onExit(this.fileName, this.content);
    }
}
