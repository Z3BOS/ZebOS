const shellLog = document.getElementById('shell-log');
const shellInput = document.getElementById('shell-input');
const sendBtn = document.getElementById('send-btn');

// State tracking & Virtual Storage Device System Container
let systemState = { 
    version: "1.4.0", 
    currentUser: "guest", 
    uptime: 0,
    activeApp: null,
    fileSystem: {
        "readme.txt": "Welcome to ZebOS! This file is inside your memory system storage context layer.",
        "test.txt": "Hello World!"
        "zeb.txt": "This is ZebOS"
    }
};

function appendToLog(text, type = 'system') {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    const time = new Date().toLocaleTimeString();
    entry.textContent = `[${time}] ${text}`;
    shellLog.appendChild(entry);
    shellLog.scrollTop = shellLog.scrollHeight;
}

appendToLog("SYSTEM START: Initializing Zeb Kernel...");
appendToLog(`ZebOS Version ${systemState.version} loaded successfully.`);
appendToLog("Type 'help' for a list of basic test triggers.");

async function runCommand(inputString) {
    const cleanInput = inputString.trim();
    if (!cleanInput) return;

    // Standard shell logging print hook back
    appendToLog(`user@zebos:~$ ${cleanInput}`, 'user');
    
    const args = cleanInput.split(/\s+/);
    const command = args[0].toLowerCase();

    switch (command) {
        case 'help':
            appendToLog("Commands: help, status, version, edit [filename], view [filename], ls, drivers, memusage, clear, alert [msg]");
            break;
        case 'status':
            appendToLog(`User: ${systemState.currentUser} | ZebOS Running!`);
            break;
        case 'drivers':
            appendToLog(`Drivers are a feature coming soon! Sound support and more will be added later!`);
            break;
        case 'memusage':
            appendToLog(`Memory Usage (Estimated)`);
            appendToLog(`Memory: 36.4MB | Total Virtual Storage Files: ${Object.keys(systemState.fileSystem).length}`);
            break;
        case 'version':
            appendToLog(`Current release branch: ${systemState.version} ZebOS v1.4.0 (c) 2026 7Zeb`);
            break;
            
        case 'ls': // ls, as in linux
            appendToLog("--- YOUR HARD DRIVE ---");
            const files = Object.keys(systemState.fileSystem);
            if (files.length === 0) {
                appendToLog("[Directory is completely empty]");
            } else {
                files.forEach(fileName => appendToLog(` - ${fileName}`));
            }
            break;

        case 'edit':
            const targetEditFile = args[1] || "untitled.txt";
            try {
                const module = await import('./editor.js');
                
                // Read from fileSystem memory map or fallback to blank string values
                const existingContent = systemState.fileSystem[targetEditFile] || "";
                
                systemState.activeApp = new module.TextEditor(
                    targetEditFile,
                    existingContent,
                    (savedName, savedData) => {
                        // Callback to save changes into the core OS data state tree map layout
                        if (savedName) {
                            systemState.fileSystem[savedName] = savedData;
                        }
                        systemState.activeApp = null;
                        shellInput.focus();
                    }
                );
                systemState.activeApp.open();
            } catch (err) {
                appendToLog("Error: Failed to load editor.js app module system layer.", "error");
                console.error(err);
            }
            break;

        case 'view':
            const targetViewFile = args[1];
            if (!targetViewFile) {
                appendToLog("Error: Please provide a filename. Example: view notes.txt", "error");
                break;
            }
            if (systemState.fileSystem.hasOwnProperty(targetViewFile)) {
                appendToLog(`--- READING FILE Content: ${targetViewFile} ---`);
                appendToLog(systemState.fileSystem[targetViewFile]);
            } else {
                appendToLog(`Error: File '${targetViewFile}' does not exist inside storage registry tree arrays.`, "error");
            }
            break;

        case 'clear':
            shellLog.innerHTML = '';
            break;
        case 'alert':
            const message = args.slice(1).join(' ') || "No text provided!";
            alert(message); 
            break;
        default:
            appendToLog(`Error: Command '${command}' does not exist yet.`, 'error');
    }
}

function submitAction() {
    // If text editor is taking full screen layout focus, lock normal command processor pipeline inputs
    if (systemState.activeApp) return;
    
    runCommand(shellInput.value);
    shellInput.value = '';
    shellInput.focus();
}

shellInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') submitAction(); });
sendBtn.addEventListener('click', submitAction);
setInterval(() => { systemState.uptime++; }, 1000);
