import * as vscode from "vscode";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
  console.log("Next.js File Detector is now active!");

  const fileCreateWatcher = vscode.workspace.onDidCreateFiles(async(event) => {
      for (const file of event.files) {
        const filePath = file.fsPath;

        if((filePath.endsWith("page.tsx") || filePath.endsWith("page.jsx")) && filePath.includes(`${path.sep}app${path.sep}`)) {
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


          try{
            const encoder = new TextEncoder();
            await vscode.workspace.fs.writeFile(file, encoder.encode(fileContent));

            const document = await vscode.workspace.openTextDocument(file);
            await vscode.window.showTextDocument(document);
          }
          catch(err) {
            console.error("Failed to write boilerplate code:", err);
          }
        }
      }
    }
  );

  context.subscriptions.push(fileCreateWatcher);
}

export function deactivate() {}