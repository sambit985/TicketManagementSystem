const { MongoClient } = require('mongodb');

const mongoUrl = 'mongodb://127.0.0.1:27017';
const dbName = 'unitBit';

let client = null;

const connect = async () => {
  try {
    client = await MongoClient.connect(mongoUrl);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

const disconnect = () => {
  if (client) {
    client.close();
    console.log('Disconnected from MongoDB');
  }
};

const getDb = () => {
  if (!client) {
    throw new Error('Database connection not established');
  }
  return client.db(dbName);
};

module.exports = { connect, disconnect, getDb };
