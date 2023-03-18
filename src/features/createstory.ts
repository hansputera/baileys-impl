import {generateWAMessage, getUrlInfo, proto} from '@gampang-pkg/baileys-edge';
import {type WhatsAppClient} from '../types';
import {randomBytes} from 'node:crypto';

/**
 * Need Patch

 * - We need to fill the `broadcast` (true OR false) on proto.WebMessageInfo structure.
 * - file: https://github.com/adiwajshing/Baileys/blob/master/src/Utils/messages.ts
 */

export const createStoryFeature = async (client: WhatsAppClient) => {
	const messages = ['Hello World!', 'Hello There!', 'Hi!'];
	const storyExtMsg = proto.Message.ExtendedTextMessage.create({
		text: messages[Math.floor(Math.random() * messages.length)],
		backgroundArgb: 4283744869,
		textArgb: 4294967295,
		font: proto.Message.ExtendedTextMessage.FontType.SANS_SERIF,
		previewType: proto.Message.ExtendedTextMessage.PreviewType.NONE,
		inviteLinkGroupTypeV2: proto.Message.ExtendedTextMessage.InviteLinkGroupType.DEFAULT,
	});

	const waMsg = await generateWAMessage('status@broadcast', {
		text: '',
	}, {
		upload: client.waUploadToServer,
		getUrlInfo: async t => getUrlInfo(t),
		userJid: client.user!.id,
	});

	waMsg.broadcast = true;
	waMsg.message = proto.Message.create({
		extendedTextMessage: storyExtMsg,
		senderKeyDistributionMessage: proto.Message.SenderKeyDistributionMessage.create({
			groupId: 'status@broadcast',
			axolotlSenderKeyDistributionMessage: randomBytes(32),
		}),
		protocolMessage: proto.Message.ProtocolMessage.create({
			key: proto.MessageKey.create({
				fromMe: true,
				remoteJid: 'status@broadcast',
				id: waMsg.key.id,
				participant: client.user!.id,
			}),
		}),
	});

	await client.relayMessage('status@broadcast', waMsg.message, {
		messageId: waMsg.key.id!,
		additionalAttributes: {},
	});
};
