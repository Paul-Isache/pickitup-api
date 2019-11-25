'use strict'
const fetch = require('node-fetch')
const { URLSearchParams } = require('url')
const { mapResponse } = require('../helpers/http')

const COGNITO_BASE = 'https://notifier.auth.eu-central-1.amazoncognito.com'
const COGNITO_APP_ID = '1k27egq7oaurvbf8cja3gj90i'
const REDIRECT_URL = 'http://localhost:3000/login'

module.exports.signinUri = (event, context, callback) => {
  const response = mapResponse(JSON.stringify({
    url: `${COGNITO_BASE}/login?response_type=code&client_id=${COGNITO_APP_ID}&redirect_uri=${REDIRECT_URL}`,
  }))

  callback(null, response)
}

module.exports.token = async (event, context, callback) => {
  const params = new URLSearchParams()

  params.append('grant_type', 'authorization_code');
  params.append('client_id', COGNITO_APP_ID);
  params.append('scope', 'grant_type');
  params.append('code', JSON.parse(event.body).code);
  params.append('redirect_uri', REDIRECT_URL);

  const cognitoToken = await fetch(`${COGNITO_BASE}/oauth2/token`, { method: 'POST', body: params }).then(res => res.json())

  callback(null, mapResponse(JSON.stringify(cognitoToken)))
}
