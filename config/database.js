const { dbconfig } = require("../config.json");
const { host, port, database, user, password, ssl } = dbconfig;

module.exports = ({ env }) => ({
  connection: {
    client: "mysql",
    connection: {
      host: host || "127.0.0.1",
      port: port || 3306,
      database: database || "strapi_www_cms",
      user: user || "root",
      password: password || "root",
      ssl: ssl,  
    },
  }, 
}); 