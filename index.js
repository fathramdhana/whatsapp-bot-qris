const { default: makeWASocket, DisconnectReason } = require('@adiwajshing/baileys');
const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

async function start() {
  const conn = makeWASocket({ printQRInTerminal: true });

  conn.ev.on('messages.upsert', async m => {
    const msg = m.messages[0];
    if (!msg.key.fromMe && msg.message.conversation) {
      const text = msg.message.conversation.toLowerCase();
      let reply = 'Maaf, saya belum paham.';

      if (text.includes('halo')) reply = 'Halo! Mau cari produk apa hari ini?';
      else if (text.includes('spefikasi')) reply = 'Spesifikasi produk A: ... Harga 100rb.';
      else if (text.includes('beli')) {
        reply = 'Terima kasih! Ini QRIS bayar 100rb: https://via.placeholder.com/150';
      }

      await conn.sendMessage(msg.key.remoteJid, { text: reply });
    }
  });

  conn.ev.on('connection.update', update => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close' && lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut) {
      start();
    } else if (connection === 'open') {
      console.log('Bot connected');
    }
  });
}

start();

app.listen(PORT, () => {
  console.log(`Express berjalan di port ${PORT}`);
});

