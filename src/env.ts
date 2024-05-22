import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export async function getEnvironment(uri: vscode.Uri | undefined) {
    let cwd, resource;

    if (uri && uri.scheme === 'file') {
        const status = fs.lstatSync(uri.fsPath);

        if (status.isDirectory()) {
            cwd = uri.fsPath;
            resource = '.';
        } else if (status.isFile()) {
            cwd = path.dirname(uri.fsPath);
            resource = path.basename(uri.fsPath);
        }
    } else {
        // Dùng phím tắt, mở hộp thoại chọn thư mục
        const selectedFolders = await vscode.window.showOpenDialog({
            canSelectFolders: true,
            canSelectFiles: false,
            canSelectMany: false,
            openLabel: 'Select Folder'
        });

        if (selectedFolders && selectedFolders.length > 0) {
            const selectedFolderUri = selectedFolders[0];
            cwd = selectedFolderUri.fsPath;
            resource = '.';
        }
    }

    return {
        cwd,
        resource
    };
}