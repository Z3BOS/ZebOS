const shellLog = document.getElementById('shell-log');
const shellInput = document.getElementById('shell-input');
const sendBtn = document.getElementById('send-btn');

// State tracking for future releases
let systemState = { 
    version: "1.3.0", 
    currentUser: "guest", 
    uptime: 0,
    activeApp: null // Holds the instance of the loaded external app
};

// Log printer helper function
function appendToLog(text, type = 'system') {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    // Modern timestamp formatting
    const time = new Date().toLocaleTimeString();
    entry.textContent = `[${time}] ${text}`;
    shellLog.appendChild(entry);
    shellLog.scrollTop = shellLog.scrollHeight; // Auto scroll down
}

// Initial boot sequence printouts
appendToLog("SYSTEM START: Initializing Zeb Kernel...");
appendToLog(`ZebOS Version ${systemState.version} loaded successfully.`);
appendToLog("Type 'help' for a list of basic test triggers.");

// Basic modern command router
async function runCommand(inputString) {
    const cleanInput = inputString.trim();
    if (!cleanInput) return;

    // 1. APP INTERCEPTOR: If an app is running, feed it input directly
    if (systemState.activeApp) {
        systemState.activeApp.handleInput(inputString);
        return;
    }

    // 2. KERNEL COMMANDS
    appendToLog(`user@zebos:~$ ${cleanInput}`, 'user');
    const args = cleanInput.split(' ');
    const command = args[0].toLowerCase();

    switch (command) {
        case 'help':
            appendToLog("Commands: help, status, version, edit, view, drivers, memusage, clear, alert [msg]");
            break;
        case 'status':
            appendToLog(`User: ${systemState.currentUser} | ZebOS Running!`);
            break;
        case 'drivers':
            appendToLog(`Drivers are a feature coming soon! Sound support and more will be added later!`);
            break;
        case 'memusage':
            appendToLog(`Memory Usage (Estimated)`);
            appendToLog(`Memory: 35.1MB`);
            break;
        case 'version':
            appendToLog(`Current release branch: ${systemState.version} ZebOS v1.3.0 (c) 2026 7Zeb`);
            appendToLog(`Compiled on: July 31, 2026`);
            break;
        case 'edit':
            try {
                // Dynamically import the editor module file on demand
                const module = await import('./editor.js');
                
                // Instantiate the app and give it a callback to clear the OS state on exit
                systemState.activeApp = new module.TextEditor(shellLog, () => {
                    systemState.activeApp = null; 
                });
                
                systemState.activeApp.open();
            } catch (err) {
                appendToLog("Error: Failed to load editor.js app module.", "error");
                console.error(err);
            }
            break;
        case 'view':
            if (systemState.activeApp) {
                appendToLog(systemState.activeApp.getContent());
            } else if (window.lastSavedContent) {
                appendToLog("--- SAVED FILE CONTENT ---");
                appendToLog(window.lastSavedContent);
            } else {
                appendToLog("[No file data found in memory. Use 'edit' first]");
            }
            break;
        case 'clear':
            shellLog.innerHTML = '';
            break;
        case 'alert':
            const message = args.slice(1).join(' ') || "No text provided!";
            alert(message); // Standard browser alert popup
            break;
        default:
            appendToLog(`Error: Command '${command}' does not exist yet. Suggest for the next version!`, 'error');
    }
}

// Event hooks to process input actions
function submitAction() {
    runCommand(shellInput.value);
    shellInput.value = '';
    shellInput.focus();
}

shellInput.addEventListener('keydown', (e) => { 
    if (e.key === 'Enter') submitAction(); 
});

sendBtn.addEventListener('click', submitAction);

// Keep track of internal uptime ticks
setInterval(() => {
    systemState.uptime++;
}, 1000);
