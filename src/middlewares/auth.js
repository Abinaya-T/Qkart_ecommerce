const passport = require("passport");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");

/**
 * Custom callback function implementation to verify callback from passport
 * - If authentication failed, reject the promise and send back an ApiError object with
 * --- Response status code - "401 Unauthorized"
 * --- Message - "Please authenticate"
 *
 * - If authentication succeeded,
 * --- set the `req.user` property as the user object corresponding to the authenticated token
 * --- resolve the promise
 */

/**
 * Auth middleware to authenticate using Passport "jwt" strategy with sessions disabled and a custom callback function
 * 
 */
const auth = () => async (req, res, next) => {
  return new Promise((resolve, reject) => {
       passport.authenticate('jwt',  { session: false },
      (err,user,info) => {
        if(err){
          const error = new ApiError(httpStatus.UNAUTHORIZED, "Please Authenticate");
          reject(error);
          
        }
        if(!user){
          const error = new ApiError(httpStatus.UNAUTHORIZED,  "Please Authenticate");
          reject(error);
        }
        req.user = user;
        resolve();
      })(req,res,next)
  })
    .then(() => next())
    .catch((err) => next(err));
};

module.exports = auth;
