const { dbconfig } = require("../config.json");
const { host, port, database, user, password, ssl } = dbconfig;

module.exports = ({ env }) => ({
  connection: {
    client: "mysql",
    connection: {
      host: env("DATABASE_HOST", host || "127.0.0.1"),
      port: env.int("DATABASE_PORT", port || 3306),
      database: env("DATABASE_NAME", database || "strapi_www_cms"),
      user: env("DATABASE_USERNAME", user || "root"),
      password: env("DATABASE_PASSWORD", password || "root"),
      ssl: env.bool("DATABASE_SSL", ssl),  
    },
  }, 
}); 