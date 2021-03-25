require('dotenv').config();
const express = require('express');
const app = express();
const massive = require('massive');
const session = require('express-session');
const middlewares = require('./middlewares/middlewares');
const authController = require('./controllers/authController');

const { SERVER_PORT, DB_STRING, SESSION_SECRET} = process.env;

app.use(express.json());

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}))

// auth endpoints
app.post('/auth/register', middlewares.checkUsername, authController.register);
app.get('/auth/session', authController.getSession)

massive({
    connectionString: DB_STRING,
    ssl: {
        rejectUnauthorized: false
    }
})
.then(dbInstance => {
    app.set('db', dbInstance);
    app.listen(SERVER_PORT, () => console.log(`DB & Server up on ${SERVER_PORT}`))
})
.catch(err => console.log(err))
