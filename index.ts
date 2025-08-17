import { env } from 'bun'
import { Mwn } from 'mwn'

import type { Heading } from './types'

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
    .flatMap(l => l),
  summary = 'obastan ded🥀🕊️'

for (const lemma of lemmalist) {
  bot
    .request({
      action: 'parse',
      page: lemma,
      prop: 'sections|wikitext',
      format: 'json',
    })
    .then(async data => {
      const headings: Array<Heading> = data.parse.sections,
        { wikitext }: { wikitext: string } = data.parse,
        L2s = headings.filter(h => h.level === '2'),
        azL2 = L2s.findIndex(h => h.anchor === 'Azerbaijani')

      if (azL2 === -1) return

      // [lemma]#Azerbaijani isn't an orange link
      const az = wikitext
        .match(
          new RegExp(
            azL2 === L2s.length - 1
              ? '(==Azerbaijani==.*)'
              : `(==Azerbaijani==.*)==${L2s[azL2 + 1]?.anchor}==`,
            's'
          ) // i couldn't make it a single regex sorry😔😔
        )![1]!
        .trim()

      if (!az.match(/\{\{r\:(az\:)?obastan\}\}/i)) return

      // entry contains {{R:az:Obastan}} or {{R:Obastan}}

      var text = wikitext,
        references = az.match(/(====?References===.*?)(?====.*===|$)/s)?.[1]?.trim(),
        furtherReading = az.match(
          /(====?Further reading====?.*?)(?===.*===|$)/s
        )?.[1]?.trim()

      if (furtherReading) {
        if (!references) {
          text = wikitext.replace(
            furtherReading,
            `${furtherReading.startsWith('====') ? '====' : '==='}References${
              furtherReading.startsWith('====') ? '====' : '==='
            }\n* {{R:az:ADIL}}`
          )
        }
      }

      await bot.edit(lemma, () => ({
        text,
        summary,
        minor: true,
      }))
    })
    .catch(() => {})
}
