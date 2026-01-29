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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
