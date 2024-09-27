//imports
import express from 'express';  //imports express library for use of'import'
import connectDatabase from './config/db'; //imports function

//create express object
const app = express();

//after app initialization, connect to database
connectDatabase();

//point app to endpoint
app.get('/', (req, res) =>
    res.send('http get request sent to root api endpoint')
);

//Connection listener
app.listen(3000, () => console.log('Express server running on port 3000'));
