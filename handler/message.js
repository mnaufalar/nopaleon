const { WASocket, proto, getContentType, downloadContentFromMessage } = require('@adiwajshing/baileys')
const axios = require('axios').default
const { PassThrough } = require('stream')
const moment = require('moment-timezone')
const ffmpeg = require('fluent-ffmpeg')
const FormData = require('form-data')
const chalk = require('chalk')
const crypto = require('crypto') 
const fs = require('fs')
const qs = require('qs')
const { help } = require('../utils/message')
const { sleep } = require('../utils/myfunc') 
//// BUTTON ////
//// DIGIFLAZZ //////
const Digiflazz = require('digiflazz')
const digiflazz = new Digiflazz('tuxaxeoQKjKW', '370e81e2-5f98-51e0-889f-707199dad0bf');
//// APIGAMES //////
let mrc = 'M220704ZTWG2765MX';
let sct = 'ad7224521e2a25e5e21d9a1576faecbc96155f525171e05852ad38d0e95a5aa4';

/**
 *
 * @param { string } text
 * @param { string } color
 */
const color = (text, color) => {
    return !color ? chalk.green(text) : chalk.keyword(color)(text)
}

Array.prototype.random = function () {
    return this[Math.floor(Math.random() * this.length)]
}

/**
 * @param {WASocket} sock
 * @param {proto.IWebMessageInfo} msg
 */
module.exports = async (sock, msg) => {
    const { ownerNumber, ownerName, botName, apikey } = require('../config.json')

    const time = moment().tz('Asia/Jakarta').format('HH:mm:ss')
    if (msg.key && msg.key.remoteJid === 'status@broadcast') return
    if (!msg.message) return

    const type = getContentType(msg.message)
    const quotedType = getContentType(msg.message?.extendedTextMessage?.contextInfo?.quotedMessage) || null
    if (type == 'ephemeralMessage') {
        msg.message = msg.message.ephemeralMessage.message
        msg.message = msg.message.ephemeralMessage.message.viewOnceMessage
    }
    if (type == 'viewOnceMessage') {
        msg.message = msg.message.viewOnceMessage.message
    }

    const botId = sock.user.id.includes(':') ? sock.user.id.split(':')[0] + '@s.whatsapp.net' : sock.user.id

    const from = msg.key.remoteJid
    const body = type == 'conversation' ? msg.message?.conversation : msg.message[type]?.caption || msg.message[type]?.text || ''
    const responseMessage = type == 'listResponseMessage' ? msg.message?.listResponseMessage?.singleSelectReply?.selectedRowId || '' : type == 'buttonsResponseMessage' ? msg.message?.buttonsResponseMessage?.selectedButtonId || '' : ''
    const isGroup = from.endsWith('@g.us')

    var sender = isGroup ? msg.key.participant : msg.key.remoteJid
    sender = sender.includes(':') ? sender.split(':')[0] + '@s.whatsapp.net' : sender
    const senderName = msg.pushName
    const senderNumber = sender.split('@')[0]

    const groupMetadata = isGroup ? await sock.groupMetadata(from) : null
    const groupName = groupMetadata?.subject || ''
    const groupMembers = groupMetadata?.participants || []
    const groupAdmins = groupMembers.filter((v) => v.admin).map((v) => v.id)

    const isCmd = /^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\\\©^]/.test(body)
    const prefix = isCmd ? body[0] : ''
    const isGroupAdmins = groupAdmins.includes(sender)
    const isBotGroupAdmins = groupMetadata && groupAdmins.includes(botId)
    const isOwner = ownerNumber.includes(sender)
    const chats = (type === 'conversation' && msg.message.conversation) ? msg.message.conversation : (type == 'imageMessage') && msg.message.imageMessage.caption ? msg.message.imageMessage.caption : (type == 'documentMessage') && msg.message.documentMessage.caption ? msg.message.documentMessage.caption : (type == 'videoMessage') && msg.message.videoMessage.caption ? msg.message.videoMessage.caption : (type == 'extendedTextMessage') && msg.message.extendedTextMessage.text ? msg.message.extendedTextMessage.text : (type == 'buttonsResponseMessage') && msg.message.buttonsResponseMessage.selectedButtonId ? msg.message.buttonsResponseMessage.selectedButtonId : (type == "templateButtonReplyMessage" && msg.message.templateButtonReplyMessage.selectedId) ? msg.message.templateButtonReplyMessage.selectedId : (type == "listResponseMessage") ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : (type == "messageContextInfo") ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : ''
    const cokmand = chats.toLowerCase().split(' ')[0] || ''
    const mek = z = chats.slice(cokmand.length + 1, chats.length)

       
    let command = isCmd ? body.slice(1).trim().split(' ').shift().toLowerCase() : ''
    let responseId = msg.message?.listResponseMessage?.singleSelectReply?.selectedRowId || msg.message?.buttonsResponseMessage?.selectedButtonId || null
    let args = body.trim().split(' ').slice(1)
    let q = args.join(" ")
    let full_args = body.replace(command, '').slice(1).trim()
    let sign = crypto.createHash('md5').update(`${mrc}${sct}`).digest("hex")
    let randomString = 'NS-'
		charSet = "QWERTYUIOPASDFGHJKL1234567890ZXCVBNM"
		for (let i = 0; i < 5; i++) {
		let randomPoz = Math.floor(Math.random() * charSet.length)
		randomString += charSet.substring(randomPoz, randomPoz + 1)
	    }
    let mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || []

    const isImage = type == 'imageMessage'
    const isVideo = type == 'videoMessage'
    const isAudio = type == 'audioMessage'
    const isSticker = type == 'stickerMessage'
    const isContact = type == 'contactMessage'
    const isLocation = type == 'locationMessage'
    
    const isQuoted = type == 'extendedTextMessage'
    const isQuotedImage = isQuoted && quotedType == 'imageMessage'
    const isQuotedVideo = isQuoted && quotedType == 'videoMessage'
    const isQuotedAudio = isQuoted && quotedType == 'audioMessage'
    const isQuotedSticker = isQuoted && quotedType == 'stickerMessage'
    const isQuotedContact = isQuoted && quotedType == 'contactMessage'
    const isQuotedLocation = isQuoted && quotedType == 'locationMessage'
	


    var mediaType = type
    var stream
    if (isQuotedImage || isQuotedVideo || isQuotedAudio || isQuotedSticker) {
        mediaType = quotedType
        msg.message[mediaType] = msg.message.extendedTextMessage.contextInfo.quotedMessage[mediaType]
        stream = await downloadContentFromMessage(msg.message[mediaType], mediaType.replace('Message', '')).catch(console.error)
    }

    if (!isGroup && !isCmd) console.log(color(`[ ${time} ]`, 'white'), color('[ PRIVATE ]', 'aqua'), color(body.slice(0, 50), 'white'), 'from', color(senderNumber, 'yellow'))
    if (isGroup && !isCmd) console.log(color(`[ ${time} ]`, 'white'), color('[  GROUP  ]', 'aqua'), color(body.slice(0, 50), 'white'), 'from', color(senderNumber, 'yellow'), 'in', color(groupName, 'yellow'))
    if (!isGroup && isCmd) console.log(color(`[ ${time} ]`, 'white'), color('[ COMMAND ]', 'aqua'), color(body, 'white'), 'from', color(senderNumber, 'yellow'))
    if (isGroup && isCmd) console.log(color(`[ ${time} ]`, 'white'), color('[ COMMAND ]', 'aqua'), color(body, 'white'), 'from', color(senderNumber, 'yellow'), 'in', color(groupName, 'yellow'))

    const reply = async (text) => {
        return sock.sendMessage(from, { text: text.trim() }, { quoted: msg })
    }

    //Auto read
sock.readMessages([msg.key.id])
sock.sendReceipt(from, isGroup ? sender : '', [msg.key.id], 'read')
sock.sendPresenceUpdate('available', from)




    switch (command) {
    
        case 'cekinvoice':
            if (!isOwner) return reply(`Only Owner`)
               axios.get(`https://v1.apigames.id/merchant/${mrc}/cektrx/${args[0]}`)
            .then(({data}) => {
            let epep = `Status : ${data.data.status}
            nick/refId : ${data.data.sn}
            `;
              reply(epep)
              })
              .catch((err) => {
              console.log(err);
              });
            break
              
             case 'mla':
              if (!isOwner) return reply(`Perintah ini hanya bisa digunakan oleh owner bot`)
            axios.get(`https://v1.apigames.id/transaksi/http-get-v1?merchant=${mrc}&secret=${sct}&produk=ML${args[0]}&tujuan=${args[1]}${args[2]}&ref=${randomString}`)
            .then(({data}) => {
            let epep = `*「 Transaksi ${data.data.status} 」*
            
            › *Order ID* : ${args[1]}(${args[2]})
            › *Produk* : ${args[0]} Diamonds
            › *Sn* : ${data.data.sn}
            
            Terimakasih sudah order
            *_${botName}_*
            `;
              reply(epep)
              })
              .catch((err) => {
              console.log(err);
              });
              break
              
            case "cekmla":
               if (!isOwner) return  reply(`Perintah ini hanya bisa digunakan oleh owner bot`)
            axios
              .get(
            `https://v1.apigames.id/merchant/${mrc}/cek-koneksi?engine=smileone&signature=${sign}`
              )
              .then(({data}) => {
            let epep = `*「 CEK KONEKSI MLA 」*
            
            › *Nama Akun* : ${data.data.data.customer_name}
            › *Saldo* : ${data.data.data.balance} Coin
            
            _Berikut di atas Data Akun MLA anda_`;
            reply(epep);
            console.log(data)
              })
              .catch((err) => {
            reply('Pastikan Akun Sudah Terkoneksi dengan akun anda');
              });
            break;

    case 'produk':
if (!isOwner) return reply('perintah ini hanya dapat di gunakan oleh owner')
            let harga = await digiflazz.daftarHarga();
            let skuyy = '•------------------------------------•\n'
for (let i = 0; i < harga.length; i++) {
  skuyy += `\nPRODUK : ${harga[i].product_name}\nKategori : ${harga[i].category}\nBrand : ${harga[i].brand}\nNama Provider : ${harga[i].seller_name}\nHarga : ${harga[i].price}\nKode : ${harga[i].buyer_sku_code}\n`
  skuyy += '•------------------------------------•'
}
reply(skuyy)
        break
		
        
case 'ceksaldo':
    if (!isOwner) return reply('perintah ini hanya dapat di gunakan oleh owner')
let saldo = await digiflazz.cekSaldo();
let saldoku = await JSON.stringify(saldo.deposit)
let katasaldo = `*CEK SALDO*\n\nSisa Saldo : ${saldoku}`;
reply(`${katasaldo}`)
break

case 'order':
if (!isOwner) return reply('perintah ini hanya dapat di gunakan oleh owner')
if (args.length < 1) return reply(`Penggunaan : ${prefix}order [produk] [tujuan]

Jika Orderan Mobile Legends silahkan gabung ID+SERVER

Contoh : .order ml86 1136707732575

*Harap Perhatikan Penulisan* `)
let deposit = await digiflazz.transaksi(args[0], args[1], `${randomString}`);
let status = `${deposit.status}`
let respon = `*「 PEMBELIAN ${deposit.status.toUpperCase()} 」*

Ref ID : ${randomString}`
reply(respon)
await sleep(30000)
case 'cekorderandigi':
    let depositt = await digiflazz.transaksi(args[0], args[1], `${args[2]}`);
    reply(`*「 PEMBELIAN ${depositt.status.toUpperCase()}」*

*›› Produk :* ${args[0].toUpperCase()}
*›› Data :* ${depositt.customer_no}
*›› Date :* ${new Date().toLocaleString("en-US", {timeZone: "Asia/Jakarta"})}
*›› RefId :* ${depositt.ref_id}
*›› Sn :* ${depositt.sn}
*›› Keterangan :* Terimakasih kak Sudah Order 😁 , Jika dalam 10 menit belum masuk mohon infokan`)
break

case 'dgg':
if (!isOwner) return reply('perintah ini hanya dapat di gunakan oleh owner')
if (args.length < 1) return reply(`Penggunaan : Penggunaan : ${prefix}dgg [produk] [tujuan]

Jika Orderan Mobile Legends silahkan gunakan Spasi untuk memisah ID SERVER

Contoh : .dgg ml86 113670773 2575

*Harap Perhatikan Penulisan* `)
let mlorder = await digiflazz.transaksi(args[0], `${args[1]} ${args[2]}`, `${randomString}`);
let res = `*「 PEMBELIAN ${mlorder.status.toUpperCase()} 」*

_Mohon tunggu 30 Detik_`
reply(res)
await sleep(30000)
case 'cekorderandigi':
    let cekorderml = await digiflazz.transaksi(args[0], `${args[1]} ${args[2]}`, `${mlorder.ref_id}`);
    reply(`*「 PEMBELIAN ${cekorderml.status.toUpperCase} 」*

*›› Produk :* ${args[0].toUpperCase}
*›› Data :* ${cekorderml.customer_no}
*›› Date :* ${new Date().toLocaleString("en-US", {timeZone: "Asia/Jakarta"})}
*›› RefId :* ${cekorderml.ref_id}
*›› Sn :* ${cekorderml.sn}
*›› Keterangan :* Terimakasih kak sudah order 😁`)
break

case 'help':
    reply(`.produk\n.dg\n.dgg\n.ceksaldo\n.cekmla\n.mla\n.cekinvoice`)
    break

case 'deposit':
let reqdepo = await digiflazz.deposit(args[0],args[1],args[2]);
let depo = `*Bank* : ${args[1]}\n *A/n* : ${args[2]}\n*Amount* : ${reqdepo.data.amount}\n*Notes* : ${reqdepo.data.notes}`
reply(depo)
break

case 'bot':
    reply('dah aktif ngab')
    break
	
case 'menu':
	const sections = [
    {
 title: `Hallo`,
 rows: [
     {title: "MENU STORE", rowId: "#menustore", description: "Menampilkan Menu Store"},
     {title: "MENU GROUP", rowId: "#menugroup", description: "Menampilkan Menu Group"},
     {title: "MENU DONWLOAD", rowId: "#menudownload", description: "Menampilkan Menu Download"},
     {title: "MENU GABUT", rowId: "#menugabut", description: "Menampilkan Menu Gabut"},
     {title: "MENU GAME", rowId: "#menugame", description: "Menampilkan Menu Game"}
 ]
    },
    {
    title: `MenuOwner`,
    rows: [
        {title: "Owner Menu", rowId: "owner-admin", description: "Menampilkan Menu Owner"}
        ]
     },
]


const listMessage = {
  text: `kontol`,
  buttonText: "Click here!",
  sections
}

const tah = await sock.sendMessage(from, listMessage, {quoted : msg})
break



        // Information //
        default:
         
    }
}