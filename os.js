const shellLog = document.getElementById('shell-log');
const shellInput = document.getElementById('shell-input');
const sendBtn = document.getElementById('send-btn');

// State tracking & Advanced VFS Storage Device Module
let systemState = { 
    version: "1.6.1-SP1", 
    currentUser: "guest", 
    uptime: 0,
    activeApp: null,
    fileSystem: {
        "readme.txt": { type: "file", content: "Welcome to ZebOS SP1! Hierarchical folder structures are now active." },
        "test.txt": { type: "file", content: "Hello World line buffer data output test script." },
        "documents": { type: "dir", content: {} } // New Directory Node Support
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

appendToLog("SYSTEM START: Initializing Zeb Kernel [Service Pack 1]...");
appendToLog(`ZebOS Version ${systemState.version} loaded successfully.`);
appendToLog("Type 'help' for a list of basic test triggers.");

async function runCommand(inputString) {
    const cleanInput = inputString.trim();
    if (!cleanInput) return;

    appendToLog(`user@zebos:~$ ${cleanInput}`, 'user');
    
    const args = cleanInput.split(/\s+/);
    const command = args[0].toLowerCase();

    switch (command) {
        case 'help':
            appendToLog("Commands: help, status, version, edit [file], view [file], ls, mkdir [dir], rm [item], ren [old] [new], calc, snake, drivers, memusage, clear, alert [msg]");
            break;
        case 'status':
            appendToLog(`User: ${systemState.currentUser} | ZebOS SP1 Stable Architecture Active!`);
            break;
        case 'drivers':
            appendToLog(`Drivers are a feature coming soon! Sound support and more will be added later!`);
            break;
        case 'memusage':
            appendToLog(`Memory Usage (Estimated)`);
            appendToLog(`Memory: 43.1MB | Total Storage Node Inodes Object Records: ${Object.keys(systemState.fileSystem).length}`);
            break;
        case 'version':
            appendToLog(`Current release branch: ${systemState.version} ZebOS Production SP1 v1.6.1 (c) 2026 7Zeb`);
            break;
            
        case 'ls': 
            appendToLog("--- VIRTUAL FILE SYSTEM DIRECTORY MAP ---");
            const items = Object.keys(systemState.fileSystem);
            if (items.length === 0) {
                appendToLog("[Directory is completely empty]");
            } else {
                items.forEach(name => {
                    const node = systemState.fileSystem[name];
                    const visualPrefix = node.type === "dir" ? `[DIR]  ${name}/` : `[FILE] ${name}`;
                    appendToLog(` - ${visualPrefix}`);
                });
            }
            break;

        case 'mkdir': // Make Directory Allocation Command
            const newDirName = args[1];
            if (!newDirName) {
                appendToLog("Error: Missing parameter. Usage: mkdir [directory_name]", "error");
                break;
            }
            if (systemState.fileSystem.hasOwnProperty(newDirName)) {
                appendToLog(`Error: Reference identifier '${newDirName}' already exists.`, "error");
            } else {
                systemState.fileSystem[newDirName] = { type: "dir", content: {} };
                appendToLog(`Directory System: Created structure node allocation '${newDirName}/'.`);
            }
            break;

        case 'rm': // Structural Removal Tool (Handles files & directories)
            const targetRmItem = args[1];
            if (!targetRmItem) {
                appendToLog("Error: Missing parameter. Usage: rm [filename/directory]", "error");
                break;
            }
            if (systemState.fileSystem.hasOwnProperty(targetRmItem)) {
                const nodeType = systemState.fileSystem[targetRmItem].type;
                delete systemState.fileSystem[targetRmItem];
                appendToLog(`File system: Successfully unlinked and erased ${nodeType} entry '${targetRmItem}'.`);
            } else {
                appendToLog(`Error: Object reference target '${targetRmItem}' not found.`, "error");
            }
            break;

        case 'ren': // Core Renaming Engine Tool
            const oldName = args[1];
            const newName = args[2];
            if (!oldName || !newName) {
                appendToLog("Error: Missing parameters. Usage: ren [old_name] [new_name]", "error");
                break;
            }
            if (systemState.fileSystem.hasOwnProperty(oldName)) {
                systemState.fileSystem[newName] = systemState.fileSystem[oldName];
                delete systemState.fileSystem[oldName];
                appendToLog(`File system: Successfully reassigned identifier '${oldName}' to '${newName}'.`);
            } else {
                appendToLog(`Error: Source target handle '${oldName}' does not exist.`, "error");
            }
            break;

        case 'edit':
            const targetEditFile = args[1] || "untitled.txt";
            if (systemState.fileSystem[targetEditFile] && systemState.fileSystem[targetEditFile].type === "dir") {
                appendToLog(`Error: '${targetEditFile}' is a system folder directory. Cannot execute string stream write operations.`, "error");
                break;
            }
            try {
                const module = await import('./programs/editor.js');
                const existingContent = systemState.fileSystem[targetEditFile] ? systemState.fileSystem[targetEditFile].content : "";
                
                systemState.activeApp = new module.TextEditor(
                    targetEditFile,
                    existingContent,
                    (savedName, savedData) => {
                        if (savedName) {
                            systemState.fileSystem[savedName] = { type: "file", content: savedData };
                        }
                        systemState.activeApp = null;
                        shellInput.focus();
                    }
                );
                systemState.activeApp.open();
            } catch (err) {
                appendToLog("Error: Failed to fetch module from './programs/editor.js'. Check files.", "error");
                console.error(err);
            }
            break;

        case 'calc':
            try {
                const module = await import('./programs/calc.js');
                systemState.activeApp = new module.RetroCalculator(() => {
                    systemState.activeApp = null;
                    shellInput.focus();
                });
                systemState.activeApp.open();
            } catch (err) {
                appendToLog("Error: Failed to fetch module from './programs/calc.js'. Check files.", "error");
                console.error(err);
            }
            break;

        case 'snake':
            try {
                const module = await import('./programs/snake.js');
                systemState.activeApp = new module.SnakeGame(() => {
                    systemState.activeApp = null;
                    shellInput.focus();
                });
                systemState.activeApp.open();
            } catch (err) {
                appendToLog("Error: Failed to fetch module from './programs/snake.js'. Check files.", "error");
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
                const targetNode = systemState.fileSystem[targetViewFile];
                if (targetNode.type === "dir") {
                    appendToLog(`Error: '${targetViewFile}' is a folder structure container object. use 'ls' to see nodes maps.`, "error");
                } else {
                    appendToLog(`--- READING FILE CONTENT: ${targetViewFile} ---`);
                    appendToLog(targetNode.content);
                }
            } else {
                appendToLog(`Error: Target object reference '${targetViewFile}' does not exist inside storage matrices.`, "error");
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
    if (systemState.activeApp) return;
    runCommand(shellInput.value);
    shellInput.value = '';
    shellInput.focus();
}

shellInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') submitAction(); });
sendBtn.addEventListener('click', submitAction);
setInterval(() => { systemState.uptime++; }, 1000);
