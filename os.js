const shellLog = document.getElementById('shell-log');
const shellInput = document.getElementById('shell-input');
const sendBtn = document.getElementById('send-btn');

// State tracking for future releases
let systemState = {
    version: "1.0.1",
    currentUser: "guest",
    uptime: 0
};

// Log printer helper
function appendToLog(text, type = 'system') {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    
    // Modern timestamp formatting
    const time = new Date().toLocaleTimeString();
    entry.textContent = `[${time}] ${text}`;
    
    shellLog.appendChild(entry);
    shellLog.scrollTop = shellLog.scrollHeight; // Auto scroll down
}

// Initial ugly boot sequence printouts
appendToLog("SYSTEM START: Initializing Zeb Kernel...");
appendToLog(`ZebOS Version ${systemState.version} loaded successfully.`);
appendToLog("Type 'help' for a list of basic test triggers.");

// Basic modern command router
function runCommand(inputString) {
    const cleanInput = inputString.trim();
    if (!cleanInput) return;

    // Echo back the command entered
    appendToLog(`user@zebos:~$ ${cleanInput}`, 'user');

    const args = cleanInput.split(' ');
    const command = args[0].toLowerCase();

    switch (command) {
        case 'help':
            appendToLog("Commands: help, status, version, clear, alert [msg]");
            break;
        case 'status':
            appendToLog(`User: ${systemState.currentUser} | ZebOS Running!`);
            break;
        case 'drivers':
            appendToLog(`Drivers are a feature coming soon! Sound support and more will be added later!`);
            break;
        case 'version':
            appendToLog(`Current release branch: ${systemState.version} ZebOS v1.0.0 (c) 2026 7Zeb`);
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
