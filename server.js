//imports
import express from 'express';  //imports express library for use of'import'
import connectDatabase from './config/db'; //imports function
import { check, validationResult } from 'express-validator';
import cors from 'cors';
import User from './models/User'; //creates and saves user to the Register user endpoint
import bcrypt from 'bcryptjs'; //as User does
import jwt from 'jsonwebtoken';
import config from 'config';
import auth from './middleware/auth';


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
app.post(
    '/api/users', 
     /** validation code */
    [
        check('name', 'Please enter your name').not().isEmpty(),
        check('email', 'Please enter a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').isLength({min: 6})
    ],
    /*mongoose queries are asynchronous, so we add async in front of the callback*/
    async (req, res) => {
        /**Add error code */
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        } else {
            const { name, email, password } = req.body;
            try {
                //check if user exists
                let user = await User.findOne({ email: email });
                if (user) {
                    return res
                    .status(400)
                    .json({ errors: [{ msg: 'User already exists' }] });
                }

                //create a new user
                user = new User({
                    name: name,
                    email: email,
                    password: password 
                });

                //encrypt the password
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(password, salt);

                //save to the db and return
                await user.save();

                //Generate and return a JWT token
                returnToken(user, res);
            } catch (error) {
                res.status(500).send('Server error');
            }    //end catch block
        } //end else
    } //end request
); //end post

/**
 * @route GET api/auth
 * @desc Authenticate user
 */
app.get('/api/auth', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).send('Unknown server error');
    }
});

/**
 * @route POST api/login
 * @desc Login user
 */

app.post(
    '/api/login',
    [
        check('email', 'Plese enter a valid email').isEmail(),
        check('password', 'A password is required').exists()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        } else {
            const { email, password } = req.body;
            try {
                //check if user exists
                let user = await User.findOne({ email: email });
                if (!user) {
                    return res
                    .status(400)
                    .json({ errors: [{ msg: 'Invalid email or password' }] });
                }

                //check password
                const match = await bcrypt.compare(password, user.password);
                if (!match) {
                    return res
                    .status(400)
                    .json({ errors: [{ msg: 'Invalid email or password' }] });
                }

                //generate and return a JWT token
                returnToken(user, res);
            } catch (erro) {
                res.status(500).send('Server error');
            }
        }
    }
);

const returnToken = (user, res) => {
    const payload = {
        user: {
            id: user.id
        }
    };

    jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: '10hr' },
        (err, token) => {
            if (err) throw err;
            res.json({ token: token });
        }
    );
};

//Connection listener
const port = 5000;
app.listen(port, () => console.log('Express server running on port ${port}'));
