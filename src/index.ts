import makeWASocket, { useMultiFileAuthState, DisconnectReason } from '@gampang-pkg/baileys-edge';
import {type Boom} from '@hapi/boom';

export const runImpl = async (sock?: ReturnType<typeof makeWASocket>): Promise<void> => {
    const auth = await useMultiFileAuthState('sessions');

    sock = makeWASocket({
        auth: auth.state,
        printQRInTerminal: true,
    });

    sock.ev.on('connection.update', async (conn) => {
        const error = conn.lastDisconnect?.error as Boom;
        
        if (error && error.output.statusCode !== DisconnectReason.loggedOut && conn.connection === 'close') {
            sock?.ws.close();
            runImpl(sock);
        } else if (error && error.output.statusCode === DisconnectReason.loggedOut) {
            console.log('Logged out');
            process.exit(0);
        }
        await auth.saveCreds();
    });
}

runImpl();