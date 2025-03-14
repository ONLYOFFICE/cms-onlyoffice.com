const { env } = require("../config.json");
const { adminJwtSecret } = env;

module.exports = () => ({
  auth: {
    secret: 'ADMIN_JWT_SECRET', adminJwtSecret,
  },
});
