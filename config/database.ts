
import config from '../config.json';
const {host, port, database, user, password, ssl}= config.dbconfig; 

module.exports = () => ({
  connection: {
    client: "mysql",
    connection: {
      charset: 'utf8mb4',
      collation: 'utf8mb4_unicode_ci',
      host: host,
      port: port, 
      database: database,
      user: user,
      password: password,
    },
  }, 
});

