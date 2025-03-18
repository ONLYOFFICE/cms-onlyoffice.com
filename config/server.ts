import config from '../config.json';
const {host, port, appKeys }= config.env; 

export default () => ({
  host: host, 
  port: port,
  app: {
    keys: appKeys.split(','),
  },
});
