import {generateWAMessage, getUrlInfo, proto} from '@gampang-pkg/baileys-edge';
import {type WhatsAppClient} from '../types';

export const editMessageFeature = async (client: WhatsAppClient, msg: proto.IWebMessageInfo) => {
	const newMsg = await generateWAMessage(msg.key.remoteJid!, {
		text: 'ae',
	}, {
		userJid: client.user!.id,
		upload: client.waUploadToServer,
		getUrlInfo: async t => getUrlInfo(t),
	});

	newMsg.message = proto.Message.create({
		editedMessage: {
			message: proto.Message.create({
				protocolMessage: proto.Message.ProtocolMessage.create({
					key: msg.key,
					type: proto.Message.ProtocolMessage.Type.MESSAGE_EDIT,
					editedMessage: proto.Message.create({
						conversation: 'edit_this_work',
					}),
				}),
			}),
		},
	});

	await client.relayMessage(msg.key.remoteJid!, newMsg.message, {
		messageId: newMsg.key.id!,
		additionalAttributes: {},
	});
};
