'use strict';
const fetch = require('node-fetch');
const { URLSearchParams } = require('url');

const COGNITO_BASE = 'https://notifier.auth.eu-central-1.amazoncognito.com'
const COGNITO_APP_ID = '1k27egq7oaurvbf8cja3gj90i'
const REDIRECT_URL = 'http://localhost:3000/login'

const RESPONSE_MODEL = {
  statusCode: 200,
  headers: {
    'Access-Control-Allow-Origin': '*', // Required for CORS support to work
  },
  body: {}
}

module.exports.signinUri = (event, context, callback) => {
  const response = Object.assign({}, RESPONSE_MODEL, {
    body: JSON.stringify({
      url: `${COGNITO_BASE}/login?response_type=code&client_id=${COGNITO_APP_ID}&redirect_uri=${REDIRECT_URL}`,
    }),
  })

  callback(null, response)
}

module.exports.token = async (event, context, callback) => {
  const response = Object.assign({}, RESPONSE_MODEL)
  const params = new URLSearchParams()

  params.append('grant_type', 'authorization_code');
  params.append('client_id', COGNITO_APP_ID);
  params.append('scope', 'grant_type');
  params.append('code', JSON.parse(event.body).code);
  params.append('redirect_uri', REDIRECT_URL);

  const cognitoToken = await fetch(`${COGNITO_BASE}/oauth2/token`, { method: 'POST', body: params }).then(res => res.json())
  response.body = JSON.stringify(cognitoToken);

  callback(null, response)
}