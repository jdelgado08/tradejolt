//connect function to DB
require('dotenv').config();
const mongoose = require('mongoose');

const mongoUri = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB}?ssl=true&retryWrites=true&w=majority&appName=NodeExpressProjects&authSource=admin&replicaSet=atlas-ojd1nx-shard-0`;

const mongoDB = async () => {
  try {

    mongoose.set('strictQuery', true); 

    await mongoose.connect(mongoUri, {
      writeConcern: {
        w: 'majority',
        wtimeout: 5000
      }
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    process.exit(1); // Exit process with failure
  }
};

module.exports = mongoDB;
