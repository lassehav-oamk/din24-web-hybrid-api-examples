const express = require('express')
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const app = express()
const port = 3000

const users = []; // in-memory user storage

app.use(bodyParser.json());

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "SECRET_SIGNING_KEY";
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    // here we can do further verification if needed
    // for example, we can check if the userId in jwt_payload exists in our user database
    console.log('JWT payload received:', jwt_payload);
    return done(null, jwt_payload);
}))

// configure passport to use HTTP Basic strategy
passport.use(new BasicStrategy(function(username, password, done) {
    console.log('passport-http verify function, username:', username, 'password:', password);
    // find the user by username
    const user = users.find(u => u.username === username);
    if(user == undefined) {
        // user not found, reject the request
        return done(null, false);
    } else {
        // user found, verify the password
        bcrypt.compare(password, user.passwordHash, (err, result) => {
            if(result === true) {
                // password match
                return done(null, user);
            } else {
                // password does not match
                return done(null, false);
            }
        });
    }

}));


app.get('/', (req, res) => {
  res.send('Hello World!')
})

/* requst body structure
{
    "username": string,
    "password": string
} */
app.post('/register', (req, res) => {
    // validate the request body (this is skipped in this example)
    // read the username and password from the http request body
    const bodyContent = req.body;
    console.log(bodyContent);
    
    // hash the password
    bcrypt.hash(bodyContent.password, 10, (err, hash) => {
        if (err) {
            console.error('Error hashing password', err);
            res.status(500).send('Internal server error');
            return;
        }
        // store the username and hashed password in memory array (database in real life)
        users.push({
            username: bodyContent.username,
            passwordHash: hash
        })
        console.log('Registered users:', users);
        res.send('user registered');
    })
});

// http basic auth, response contains JWT 
app.get('/login', 
    passport.authenticate('basic', { session: false }),
    (req, res) => {
        console.log('route handler for login')
        const token = jwt.sign({
            foo: "bar",
            userId: 1
        }, "SECRET_SIGNING_KEY");

        res.json({token: token});
    });

// jwt protected resource
app.get('/protectedResource', 
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        console.log('Protected resource accessed');
        res.send('You have accessed a protected resource');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
