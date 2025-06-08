import { env } from 'bun'
import { Mwn } from 'mwn'

const bot = await Mwn.init({
    apiUrl: 'https://en.wiktionary.org/w/api.php',

    // Can be skipped if the bot doesn't need to sign in
    username: env.BOT_USERNAME,
    password: env.BOT_PASSWORD,

    // Set your user agent (required for WMF wikis, see https://meta.wikimedia.org/wiki/User-Agent_policy):
    userAgent: 'Qäyur Bot/0.1 ([[m:User:Qäyur Bot]])',

    // Set default parameters to be sent to be included in every API request
    defaultParams: {
      assert: 'user', // ensure we're logged in
    },
  }),
  lemmalistIndex = [
    ...(
      await bot.read('User:Allahverdi Verdizade/Azerbaijani lemmalist')
    ).revisions![0]!.content!.matchAll(/\[\[(.+)\|.+\]\]/g),
  ]!.map(m => m[1]!),
  lemmalistPages = await bot.read(lemmalistIndex),
  lemmalist = lemmalistPages
    .filter(p => !p.missing)
    .map(p =>
      [...p.revisions![0]!.content!.matchAll(/\{\{l\|az\|(.+)\}\}/g)]!.map(
        m => m[1]!
      )
    )
    .flatMap(l => l)

lemmalist.forEach(async lemma => {
  await bot
    .edit(lemma, rev => ({
      text: rev.content.replace('{{R:az:Obastan}}', '{{R:az:ADIL}}'),
      summary: 'obastan ded🥀🕊️',
      minor: true,
    }))
    .catch(() => {})
})
