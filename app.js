// npm install express bycrptjs mongoose body-parser
const express = require('express');
const app = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/user');
const bcrypt = requier('bcryptjs')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27.0.0.1/login', { useMongoClient: true }, () => {
    console.log('connected ')
});

// mongoose require a promise
mongoose.Promise = global.Promise

// post route for registration
app.post('/register', (req, res) => {
    const newUser = new User();
    newUser.email = req.body.email
    newUser.password = req.body.password

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) return err;
            newUser.password = hash;

            newUser.save().then(userSaved => {
                res.send('user saved');
            }).catch(err => {
                res.send('User was not saved because...', err);
            });
        })
    })
    // res.send(newUser); 
});

// post route for login
app.post('/login', (req, res) => {
    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (err) return err;
                if (result) {
                    res.send('User was able to login in')
                } else[
                    res.send('not able to login')
                ]
            })
        }
    })
})

app.listen(4000, () => {
    console.log('server started on port 4000')
})