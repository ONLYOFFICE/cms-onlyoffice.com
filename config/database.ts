
import config from '../config.json';
const {host, port, database, user, password}= config.dbconfig; 

module.exports = () => ({
  connection: {
    client: "mysql",
    connection: {
      host: host,
      port: port, 
      database: database,
      user: user,
      password: password,
    },
  }, 
});

