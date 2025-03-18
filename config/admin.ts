import config from '../config.json';
const { adminJwtSecret, apiTokenSalt } = config.env;

module.exports = () => ({
  auth: {
    secret: adminJwtSecret,
  },
  apiToken: {
    salt: apiTokenSalt
  }
});