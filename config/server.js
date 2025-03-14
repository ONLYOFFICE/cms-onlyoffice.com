const { env } = require("../config.json");
const { host, port} = env;
module.exports = () => ({
  host: host,
  port: port,
});

