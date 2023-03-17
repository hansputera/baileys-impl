import {type WAProto} from '@gampang-pkg/baileys-edge';

export const messageUpsertHandler = async (msg: WAProto.IWebMessageInfo) => {
	const text = (msg.message?.conversation
        ?? msg.message?.extendedTextMessage?.text)?.toLowerCase();

	if (text) {
		console.log(text);
	}
};
