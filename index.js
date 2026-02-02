const express = require('express')
const app = express()
const port = 3000

const accessLogger = require('./exercises/accessLogger.js')

app.use(function(req, res, next) {
    console.log('This is application level middleware executing');
    // if everything is good in this middleware, and you want to pass execution to the next thing
    next();
});

app.use(function(req, res, next) {
    console.log('Second app level middlware')
    next();
})

app.use(accessLogger)


app.get('/', 
    (req, res, next) => {
        console.log('mw 1')
        next();
    },
    (req, res, next) => {
        console.log('mw 2')
        next();
    },
    (req, res, next) => {
        console.log('mw3')
        next();
    },
    (req, res) => {
        res.send('Hello World!')
})

app.post('/products', (req, res) => {
    console.log('POST /products executing');
    // authenticate the user / client who is sending the new product
    // authorize the user

    // do the validation of the incoming new product
    // if the validation fails, then fail the request

    // is validation succeeds, then continue

    // do sometihng to serve the request
    res.send('POST received')
})

app.get('/header-demo', (req, res) => {
    // the objective is to have user data available here in req object

    console.log(req.user);

    res.send('header demo route')
});

app.get('/http-basic-demo', (req, res) => {
    /*
        - check if Authenticate header field is present
        - If no
        - then respond with 401 unauthorized, header "WWW-Authenticate": "Basic realm="then something"".
    */

    // first check if the Authenticate header field is present
    const authHeader = req.get('Authorization');
    if(authHeader === undefined) {
        res.set('WWW-Authenticate', 'Basic realm="Foo bar area"');
        return res.status(401).send('Unauthorized - No Authorization header present');
    }

    /*
    - If yes
    - read the authenticate field value
    - check if it begins with word "Basic"
    - if yes, then we know that http basic is used
    - if no, then respond 403 forbidden
    */
    const authHeaderParts = authHeader.split(' ');
    if(authHeaderParts.length == 2) {
        if(authHeaderParts[0] === 'Basic') {
            // we have the basic auth so lets decode the credentials from base64 format
            const decodedCredentials = Buffer.from(authHeaderParts[1], 'base64').toString('utf-8');
            const splittedCredentials = decodedCredentials.split(':');
            const username = splittedCredentials[0];
            const password = splittedCredentials[1];

            // next we can authenticate the user, by checking the username and password against stored values
            // the store could be a database, or in memory store, or file based store etc.
            // For this demo, we will use hardcoded values username=max password=123456
            if(username === 'max' && password === '123456') {
                // authentication successful
                res.send('JAY authorized, now we have access to the cheese');
            } else {
                return res.status(401).send('Unauthorized - Invalid credentials');
            }
        } else {
            return res.status(403).send('Forbidden - Only Basic authentication is supported');
        }
    } else {
        return res.status(403).send('Forbidden - Malformed Authorization header');
    }

});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
