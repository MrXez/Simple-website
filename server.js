const express = require('express')
const flash = require('express-flash')
const session = require('express-session')
const app = express()
const bcrypt = require('bcrypt')
const initializePassport = require('./js/passport')
const passport = require('passport')
const methodOverride = require('method-override')
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "yourusername",
    password: "yourpassword",
    database: "accountdatabase"
});

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

const users = []

app.set('view-engine', 'ejs')
app.use(express.urlencoded({
    extended: false
}))
app.use(flash())
app.use(session({
    secret: cookie - parser,
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.get('/', checkAuthenticated, (req, res) => {
    res.render('dashboard.ejs', {
        name: req.user.name
    })
})

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/dashboard.ejs',
    failureRedirect: '/login.ejs',
    failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('/register.ejs')
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.username,
            email: req.body.useremail,
            password: hashedPassword
        })
        res.redirect('/login.ejs')
    } catch {
        res.redirect('/register.ejs')
    }
})

app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login.ejs')
})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login.ejs')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/dashboard.ejs')
    }
    next()
}

app.listen(3000)