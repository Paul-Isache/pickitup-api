'use strict'

const defaultHeaders = {
    'Access-Control-Allow-Origin': '*', // Required for CORS support to work
}

module.exports.mapResponse = (body = {}, headers, statusCode = 200) => ({
    statusCode,
    headers: Object.assign({}, defaultHeaders, headers),
    body
})