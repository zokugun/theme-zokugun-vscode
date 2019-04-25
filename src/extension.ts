import * as vscode from 'vscode'

const pkg = require('../package.json')

const VERSION_ID = `${pkg.publisher}/${pkg.name}/version`

async function showWhatsNewMessage(version: string) {
	const actions: vscode.MessageItem[] = [{
		title: 'Homepage'
	}, {
		title: 'Release Notes'
	}];

	const result = await vscode.window.showInformationMessage(
		`${pkg.displayName} has been updated to v${version} — check out what's new!`,
		...actions
	);

	if(result != null) {
		if(result === actions[0]) {
			await vscode.commands.executeCommand(
				'vscode.open',
				vscode.Uri.parse(`${pkg.homepage}`)
			);
		}
		else if(result === actions[1]) {
			await vscode.commands.executeCommand(
				'vscode.open',
				vscode.Uri.parse(`${pkg.homepage}/blob/master/CHANGELOG.md`)
			);
		}
	}
}

export async function activate(context: vscode.ExtensionContext) {
	const previousVersion = context.globalState.get<string>(VERSION_ID);
	const currentVersion = pkg.version;

	if(previousVersion === undefined || currentVersion !== previousVersion) {
		await showWhatsNewMessage(currentVersion);

		context.globalState.update(VERSION_ID, currentVersion);
	}
};