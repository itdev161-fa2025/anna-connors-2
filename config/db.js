//imports
import mongoose from 'mongoose';
import config from 'config';

//get the connection string MongoURI from config/default
const db = config.get('mongoURI');

//connect to Mongo database with a function
const connectDatabase = async() => {
    try {
        await mongoose.connect(db, {
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error(error.message);

    //exit with failure code
        process.exit(1);
    }
};

//EXPORT DATABASE FUNCTION SO OTHER FILES CAN USE IT
export default connectDatabase;