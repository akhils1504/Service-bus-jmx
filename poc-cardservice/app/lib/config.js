const env = process.env.NODE_ENV || 'dev';

const dev = {
    app: {
      port: parseInt(process.env.DEV_APP_PORT) || 5000
    },
    db: {
      host: process.env.DEV_DB_HOST || 'localhost',
      port: parseInt(process.env.DEV_DB_PORT) || 27017,
      name: process.env.DEV_DB_NAME || 'taskgo'
    }
   };
   
const test = {
    app: {
      port: parseInt(process.env.TEST_APP_PORT) || 6000
    },
    db: {
      host: process.env.TEST_DB_HOST || 'localhost',
      port: parseInt(process.env.TEST_DB_PORT) || 27017,
      name: process.env.TEST_DB_NAME || 'taskgo'
    }
   };

const prod = {
    app: {
      port: parseInt(process.env.TEST_APP_PORT) || 7000
    },
    db: {
      host: process.env.PROD_DB_HOST || 'localhost',
      port: parseInt(process.env.PROD_DB_PORT) || 27017,
      name: process.env.PROD_DB_NAME || 'taskgo'
    }
   };   
   
const config = {
    dev,
    prod,
    test
   };

module.exports = config[env];