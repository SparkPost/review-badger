const axios = require('axios')
const {
  GITHUB_API_URL,
  GITHUB_REPOSITORY,
  GITHUB_TOKEN,
  SLACK_CHANNEL,
  SLACK_WEBHOOK_URL,
} = require('./constants.js')

function getPRs() {
  return axios({
    method: 'GET',
    url: `${GITHUB_API_URL}/repos/${GITHUB_REPOSITORY}/pulls`,
    headers: {
      Authorization: GITHUB_TOKEN,
    },
  }).catch(err => console.log(err))
}

function postSlackMsg({ text, blocks } = {}) {
  if (!SLACK_WEBHOOK_URL)
    throw new Error('No SLACK_WEBHOOK_URL supplied - messages cannot be posted.')

  if (!SLACK_CHANNEL) throw new Error('No slackChannel supplied - messages cannot be posted.')

  return axios({
    method: 'POST',
    url: SLACK_WEBHOOK_URL,
    data: {
      channel: SLACK_CHANNEL,
      username: 'Review Badger',
      text,
      blocks,
    },
  }).catch(err => console.log(err))
}

module.exports = {
  getPRs,
  postSlackMsg,
}
