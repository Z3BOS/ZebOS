const shellLog = document.getElementById('shell-log');
const shellInput = document.getElementById('shell-input');
const sendBtn = document.getElementById('send-btn');
const promptSpan = document.getElementById('prompt'); 

// State tracking & Advanced VFS Storage Device Module
let systemState = { 
    version: "1.6.2", 
    currentUser: "guest", 
    uptime: 0,
    activeApp: null,
    currentDirectory: "", // "" means root directory. Matches folder name if nested (e.g., "documents")
    fileSystem: {
        "readme.txt": { type: "file", content: "Welcome to ZebOS SP1! Use 'cd [folder]' to explore folders." },
        "test.txt": { type: "file", content: "Hello World line buffer data output test script." },
        "documents": { type: "dir", content: {} } // Sub-directory container
    }
};

// Helper function to return the object representing our active directory context node
function getActiveFolderContext() {
    if (systemState.currentDirectory === "") {
        return systemState.fileSystem; 
    }
    return systemState.fileSystem[systemState.currentDirectory].content; 
}

// Helper function to update the command line prompt indicator view
function updatePromptUI() {
    if (systemState.currentDirectory === "") {
        promptSpan.textContent = "user@zebos:~$";
    } else {
        promptSpan.textContent = `user@zebos:~/${systemState.currentDirectory}$`;
    }
}

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

    // Log user input with active path context label
    appendToLog(`${promptSpan.textContent} ${cleanInput}`, 'user');
    
    // Parse arguments correctly out of string arrays
    const args = cleanInput.split(/\s+/);
    const command = args[0].toLowerCase(); // args[0] is strictly the executable handle

    // Dynamically retrieve our active file pointer workspace map layer node
    const currentContext = getActiveFolderContext();

    switch (command) {
        case 'help':
            appendToLog("Commands: help, status, version, cd [dir], ls, mkdir [dir], rm [item], ren [old] [new], edit [file], view [file], calc, snake, drivers, memusage, clear, alert [msg]");
            break;
        case 'status':
            appendToLog(`User: ${systemState.currentUser} | Path Context: /${systemState.currentDirectory} | ZebOS SP1 Active!`);
            break;
        case 'drivers':
            appendToLog(`Drivers are a feature coming soon! Sound support and more will be added later!`);
            break;
        case 'memusage':
            appendToLog(`Memory Usage (Estimated)`);
            appendToLog(`Memory: 43.5MB | Total Core Storage Object Node Count: ${Object.keys(systemState.fileSystem).length}`);
            break;
        case 'version':
            appendToLog(`Current release branch: ${systemState.version} ZebOS Production SP1 v1.6.2 (c) 2026 7Zeb`);
            break;

        case 'cd': 
            const targetFolder = args[1]; // Explicit index tracking for targeted path parameter
            
            // Running 'cd' alone or 'cd ..' returns the user back to the root directory
            if (!targetFolder || targetFolder === "..") {
                systemState.currentDirectory = "";
                updatePromptUI();
                break;
            }

            if (currentContext.hasOwnProperty(targetFolder)) {
                if (currentContext[targetFolder].type === "dir") {
                    systemState.currentDirectory = targetFolder;
                    updatePromptUI();
                } else {
                    appendToLog(`Error: '${targetFolder}' is a file, not a directory.`, "error");
                }
            } else {
                appendToLog(`Error: Directory '${targetFolder}' does not exist inside current workspace.`, "error");
            }
            break;
            
        case 'ls': 
            appendToLog(`--- DIRECTORY MAP: /${systemState.currentDirectory} ---`);
            const items = Object.keys(currentContext);
            if (items.length === 0) {
                appendToLog("[Directory is completely empty]");
            } else {
                items.forEach(name => {
                    const node = currentContext[name];
                    const visualPrefix = node.type === "dir" ? `[DIR]  ${name}/` : `[FILE] ${name}`;
                    appendToLog(` - ${visualPrefix}`);
                });
            }
            break;

        case 'mkdir': 
            const newDirName = args[1];
            if (!newDirName) {
                appendToLog("Error: Missing parameter. Usage: mkdir [directory_name]", "error");
                break;
            }
            if (currentContext.hasOwnProperty(newDirName)) {
                appendToLog(`Error: Name identifier '${newDirName}' already exists.`, "error");
            } else {
                currentContext[newDirName] = { type: "dir", content: {} };
                appendToLog(`Directory System: Created structure node allocation '${newDirName}/'.`);
            }
            break;

        case 'rm': 
            const targetRmItem = args[1];
            if (!targetRmItem) {
                appendToLog("Error: Missing parameter. Usage: rm [filename/directory]", "error");
                break;
            }
            if (currentContext.hasOwnProperty(targetRmItem)) {
                const nodeType = currentContext[targetRmItem].type;
                delete currentContext[targetRmItem];
                appendToLog(`File system: Successfully unlinked and erased ${nodeType} entry '${targetRmItem}'.`);
            } else {
                appendToLog(`Error: Object reference target '${targetRmItem}' not found.`, "error");
            }
            break;

        case 'ren': 
            const oldName = args[1];
            const newName = args[2];
            if (!oldName || !newName) {
                appendToLog("Error: Missing parameters. Usage: ren [old_name] [new_name]", "error");
                break;
            }
            if (currentContext.hasOwnProperty(oldName)) {
                currentContext[newName] = currentContext[oldName];
                delete currentContext[oldName];
                appendToLog(`File system: Successfully reassigned identifier '${oldName}' to '${newName}'.`);
            } else {
                appendToLog(`Error: Source target handle '${oldName}' does not exist.`, "error");
            }
            break;

        case 'edit':
            const targetEditFile = args[1] || "untitled.txt";
            if (currentContext[targetEditFile] && currentContext[targetEditFile].type === "dir") {
                appendToLog(`Error: '${targetEditFile}' is a system folder directory. Cannot save text content inside it directly.`, "error");
                break;
            }
            try {
                const module = await import('./programs/editor.js');
                const existingContent = currentContext[targetEditFile] ? currentContext[targetEditFile].content : "";
                
                systemState.activeApp = new module.TextEditor(
                    targetEditFile,
                    existingContent,
                    (savedName, savedData) => {
                        if (savedName) {
                            const saveContext = getActiveFolderContext();
                            saveContext[savedName] = { type: "file", content: savedData };
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
            if (currentContext.hasOwnProperty(targetViewFile)) {
                const targetNode = currentContext[targetViewFile];
                if (targetNode.type === "dir") {
                            case 'view':
            const targetViewFile = args[1];
            if (!targetViewFile) {
                appendToLog("Error: Please provide a filename. Example: view notes.txt", "error");
                break;
            }
            if (currentContext.hasOwnProperty(targetViewFile)) {
                const targetNode = currentContext[targetViewFile];
                if (targetNode.type === "dir") {
                    appendToLog(`Error: '${targetViewFile}' is a folder directory object container. Use 'cd ${targetViewFile}' to open it.`, "error");
                } else {
                    appendToLog(`--- READING FILE CONTENT: ${targetViewFile} ---`);
                    appendToLog(targetNode.content);
                }
            } else {
                appendToLog(`Error: Target object reference '${targetViewFile}' does not exist inside active folder context workspace.`, "error");
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
