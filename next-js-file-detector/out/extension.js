"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
function activate(context) {
    console.log("Next.js File Detector is now active!");
    const fileCreateWatcher = vscode.workspace.onDidCreateFiles(async (event) => {
        for (const file of event.files) {
            const filePath = file.fsPath;
            if ((filePath.endsWith("page.tsx") || filePath.endsWith("page.jsx")) && filePath.includes(`${path.sep}app${path.sep}`)) {
                const folderName = path.basename(path.dirname(filePath));
                const formatedName = folderName.charAt(0).toUpperCase() + folderName.slice(1);
                const functionName = formatedName === 'App' ? 'HomePage' : `${formatedName}Page`;
                const fileContent = `export default function ${functionName}() {
  return (
    <div>
      <h1>${functionName}</h1>
    </div>
  );
}`;
                try {
                    const encoder = new TextEncoder();
                    await vscode.workspace.fs.writeFile(file, encoder.encode(fileContent));
                    const document = await vscode.workspace.openTextDocument(file);
                    await vscode.window.showTextDocument(document);
                }
                catch (err) {
                    console.error("Failed to write boilerplate code:", err);
                }
            }
        }
    });
    context.subscriptions.push(fileCreateWatcher);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map