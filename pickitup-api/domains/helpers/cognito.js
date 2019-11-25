module.exports.cognitoId = (event) => {
    const authProvider = event.requestContext.identity.cognitoAuthenticationProvider
    const parts = authProvider.split(':')
    // User pool and user pool ids
    const userPoolIdParts = parts[parts.length - 3].split('/')
    const userPoolId = userPoolIdParts[userPoolIdParts.length - 1]
    const userPoolUserId = parts[parts.length - 1]

    return userPoolUserId
}