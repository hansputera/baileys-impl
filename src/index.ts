/* eslint-disable @typescript-eslint/no-unsafe-call */
import makeWASocket, {useMultiFileAuthState, DisconnectReason, Browsers, decryptMessageNode, type BinaryNode} from '@gampang-pkg/baileys-edge';
import {type Boom} from '@hapi/boom';
import {messageUpsertHandler} from './handlers/message-upsert';

export const runImpl = async (sock?: ReturnType<typeof makeWASocket>): Promise<void> => {
	const auth = await useMultiFileAuthState('sessions');

	sock = makeWASocket({
		auth: auth.state,
		browser: Browsers.macOS('Safari'),
		// eslint-disable-next-line @typescript-eslint/naming-convention
		printQRInTerminal: true,
	});

	sock.ev.on('messages.upsert', console.log);
	sock.ws.on('CB:message', async (n: BinaryNode) => {
		const {fullMessage, decrypt} = decryptMessageNode(n, auth.state);
		await decrypt().catch(() => {
			// Do nothing
		});

		await messageUpsertHandler(sock!, fullMessage);
	});
	sock.ev.on('connection.update', async conn => {
		const error = conn.lastDisconnect?.error as Boom;

		if (error && error.output.statusCode !== DisconnectReason.loggedOut && conn.connection === 'close') {
			sock?.ws.close();
			void runImpl(sock);
		} else if (error && error.output.statusCode === DisconnectReason.loggedOut) {
			console.log('Logged out');
			process.exit(0);
		}

		await auth.saveCreds();
	});
};

void runImpl();
