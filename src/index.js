const { formatDistanceToNow } = require('date-fns')
const { getPRs, postSlackMsg, getPR } = require('./api.js')

function getIntroMsg(numberOfPRs) {
  if (numberOfPRs === 1) return 'There is 1 PR that still needs to be reviewed.'

  return `There are ${numberOfPRs} PRs that still need to be reviewed.`
}

async function start() {
  const { data } = await getPRs()
  const PRsNeedingReview = data
    .filter(PR => PR.requested_reviewers.length === 0 && PR.draft === false)
    .filter(PR => PR.user.login !== 'dependabot[bot]')

  if (PRsNeedingReview.length > 0) {
    const introMsg = getIntroMsg(PRsNeedingReview.length)

    await postSlackMsg({
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*A wild Review Badger appeared!* \n ${introMsg}`,
          },
        },
        ...PRsNeedingReview.map(PR => {
          const { html_url, title, created_at } = PR
          const timeSinceCreation = formatDistanceToNow(new Date(created_at))

          return {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `<${html_url}|:point_right: ${title}> _${timeSinceCreation} since pull request was opened_`,
            },
          }
        }),
      ],
    })
  }
}

start()
