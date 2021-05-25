const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { tokenTypes } = require("../config/tokens");

/**
 * Generate jwt token
 * - Payload must contain fields
 * --- "sub": `userId` parameter
 * --- "type": `type` parameter
 *
 * - Token expiration must be set to the value of `expires` parameter
 *
 * @param {ObjectId} userId - Mongo user id
 * @param {Number} expires - Token expiration time in seconds since unix epoch
 * @param {string} type - Access token type eg: Access, Refresh
 * @param {string} [secret] - Secret key to sign the token, defaults to config.jwt.secret
 * @returns {string}
 */
const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
  const accessToken = jwt.sign({"exp": expires, "sub": userId, "type": type}, secret)
  return accessToken
};

/**
 * Generate auth token
 * - Generate jwt token
 * - Token type should be "ACCESS"
 * - Return token and expiry date in required format
 *
 * @param {User} user
 * @returns {Promise<Object>}
 *
 * Example response:
 * "access": {
 *          "token": "eyJhbGciOiJIUzI1NiIs...",
 *          "expires": "2021-01-30T13:51:19.036Z"
 * }
 */
const generateAuthTokens = async (user) => {
  const type = tokenTypes.ACCESS
  const expires = config.jwt.accessExpirationMinutes * 60
  // Calculate seconds since Epoch 
  const secondsSinceEpoch = Math.round(Date.now() / 1000)
  const expiresSinceEpoch = expires + secondsSinceEpoch

  const token = generateToken(user.id, expiresSinceEpoch, type)

  // convert secSinceEpoch to Date
  const t = new Date(Date.UTC(1970, 0, 1));
  const expireDate = new Date(t.setUTCSeconds(expiresSinceEpoch))

  const access = {"access": { "token": token,
                    "expires": expireDate }}
  return access;          
};

module.exports = {
  generateToken,
  generateAuthTokens,
};
