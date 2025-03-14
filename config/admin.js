const { env } = require("../config.json");
const { adminJwtSecret, apiTokenSalt } = env;

module.exports = () => ({
  auth: {
    secret: adminJwtSecret,
  },
  apiToken: {
    salt: apiTokenSalt
  }
});
