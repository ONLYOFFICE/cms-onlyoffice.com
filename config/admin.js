const { env } = require("../config.json");
const { jwtSecret } = dbconfig;

module.exports = ({ env }) => ({
  auth: {
    secret: jwtSecret,
  },
});
