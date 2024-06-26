import * as vscode from 'vscode';
import { TerminalCommand } from './command';

let previousTerminal: vscode.Terminal | undefined;

export async function runCommand(command: TerminalCommand, cwd?: string, resource?: string) {
    // if useActive option true, use current terminal instead of creating new
    let terminal: vscode.Terminal | undefined;
    if (command.useActive && !!vscode.window.activeTerminal) {
        terminal = vscode.window.activeTerminal;
    } else {
        terminal = vscode.window.createTerminal({ cwd: cwd });
    };
    terminal!.show();

    ensureDisposed();

    const result = await insertVariables(command.command, resource);

    terminal!.sendText(result.command, command.auto && result.successful);

    if (!command.preserve) {
        previousTerminal = terminal;
    }
}

function ensureDisposed() {
    if (previousTerminal) {
        previousTerminal.dispose();
        previousTerminal = undefined;
    }
}

async function insertVariables(command: string, resource?: string) {
    const resourceResult = insertVariable(command, 'resource', resource);
    const clipboardResult = insertVariable(resourceResult.command, 'clipboard', await vscode.env.clipboard.readText());
    const currentPosition = vscode.window?.activeTextEditor?.selection.active;
    const lineResult = insertVariable(
        clipboardResult.command, 'line', currentPosition ? String(currentPosition.line + 1): ''
    );
    const columnResult = insertVariable(
        lineResult.command, 'column', currentPosition ? String(currentPosition.character + 1): ''
    );

    return {
        command: columnResult.command,
        successful: resourceResult.successful &&
                    clipboardResult.successful &&
                    lineResult.successful &&
                    columnResult.successful
    }

}

function insertVariable(command: string, variable: string, value?: string) {
    let successful = true;
    const pattern = `{${variable}}`;

    if (new RegExp(pattern, 'i').test(command)) {
        command = command.replace(new RegExp(pattern, 'ig'), value || '');

        if (!value) {
            successful = false;
        }
    }

    return {
        command,
        successful
    };
}
