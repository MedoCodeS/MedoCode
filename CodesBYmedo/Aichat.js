const bk9endpoint = 'https://api.bk9.dev/ai/BK95'
const model = 'llama-3.3-70b-versatile'// فيه مودلات ثانيه موجوده زي "gemma2-9b-it" و "deepseek-r1-distill-llama-70b" و "llama-3.1-8b-instant" و "llama3-70b-8192" و "llama3-8b-8192"
const medop = 'رد بالعربي و بي طريقه تضحك و استعمل ايموجيات كانك انسان بس لا تكون سخيف' //medo هنا ممكن تكتبو لـلـai يرد عليك ازاي

const handler = async (m, { conn, text, usedPrefix, command }) => {
  const medoquery = (text || '').trim() || (m.quoted?.text || m.quoted?.caption || '').trim()
  if (!medoquery) return m.reply(`اكتب سؤالك أو رد على رسالة:\n${usedPrefix}${command} سؤالك`)

  await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

  const medourl = `${bk9endpoint}?BK9=${encodeURIComponent(medop)}&q=${encodeURIComponent(medoquery)}&model=${encodeURIComponent(model)}`
  try {
    const medores = await fetch(medourl)
    if (!medores.ok) throw new Error('HTTP ' + medores.status)
    const medojson = await medores.json().catch(() => ({}))
    const medoans = medojson?.BK9 || medojson?.reply || medojson?.text || 'مش لاقي رد الapi'

    await m.reply(medoans)
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
  } catch {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    await m.reply('فيه مشكلة تقرييا جرب وقت ثاني')
  }
}

handler.help = ['bk9']
handler.tags = ['ai']
handler.command = /^شات$/i // هنا ممكن تبدل كلمه "شات" بالحاجه الي عايز الامر يستجيب لها

export default handler
