const express = require('express')
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const app = express()
const port = 3000

const users = []; // in-memory user storage

app.use(bodyParser.json());

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
app.get('/login', (req, res) => {});

// jwt protected resource
app.get('/protectedResource', (req, res) => {});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
