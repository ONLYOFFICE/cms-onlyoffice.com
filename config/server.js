const config = require("../config.json");
const { env } = config;
const { host, port } = env;

module.exports = () => ({
  host: host,
  port: port,
  url: config.cmsUrl,
});

