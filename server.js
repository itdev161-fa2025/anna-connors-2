//imports
import express from 'express';  //imports express library for use of'import'
import connectDatabase from './config/db'; //imports function
import { check, validationResult } from 'express-validator';
import cors from 'cors';


//create express object
const app = express();

//after app initialization, connect to database
connectDatabase();

//configure middleware, necessary for converting json to js
app.use(express.json({ extended: false }));
app.use(cors({ origin: 'http://localhost:3000'}));

// API Endpoints
/**
 * @route GET /
 * @desc Test endpoint
 */

//point app to endpoint
app.get('/', (req, res) =>
    res.send('http get request sent to root api endpoint')
);

/**
 * @route POST api/users
 * @desc Register user
 */
app.post('/api/users', 
     /** validation code */
    [
        check('name', 'Please enter your name').not().isEmpty(),
        check('email', 'Please enter a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').isLength({min: 6})
    ],
    (req, res) => {
        /**Add error code */
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        } else {
            return res.send(req.body);
        }
    }
);

//Connection listener
const port = 5000;
app.listen(port, () => console.log('Express server running on port ${port}'));
