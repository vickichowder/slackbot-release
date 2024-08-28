import type {Block, DividerBlock, SectionBlock} from '@slack/types'
import type {OauthV2AccessResponse} from '@slack/web-api/dist/response'
import axios from 'axios'
import {markdownToBlocks} from '@instantish/mack'

interface Repository {
  repo: string
  owner: string
}

interface Release {
  html_url: string
  name: string
  body: string
}

interface ChangelogParameters {
  slackWebhookUrl: string
  release: Release
  repo: Repository
}

export async function notifyChangelog({
  slackWebhookUrl,
  release,
  repo
}: ChangelogParameters): Promise<OauthV2AccessResponse> {
  const linkBlock: SectionBlock = {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `🍾🎉<${release.html_url}|*${repo.repo} changelog ${release.name}*>`
    }
  }
  const dividerBlock: DividerBlock = {type: 'divider'}

  const bodyBlocks: Block[] = await markdownToBlocks(release.body)

  return await axios.post(slackWebhookUrl, {
    text: `${release.name} has been released in ${repo.owner}/${repo.repo}`,
    blocks: [linkBlock, dividerBlock, ...bodyBlocks]
  })
}
