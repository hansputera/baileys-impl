import {type WAProto} from '@gampang-pkg/baileys-edge';
import {editMessageFeature} from '../features/editmsg';
import {type WhatsAppClient} from '../types';

export const messageUpsertHandler = async (client: WhatsAppClient, msg: WAProto.IWebMessageInfo) => {
	const text = (msg.message?.conversation
        ?? msg.message?.extendedTextMessage?.text)?.toLowerCase();

	if (text && msg.key.fromMe) {
		if (text === 'edit_this') {
			await editMessageFeature(client, msg);
		}
	}
};
