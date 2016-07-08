var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../models/user.js');


router.post('/register', function(req, res) {
    User.register(new User({
            username: req.body.username
        }),
        req.body.password,
        function(err, account) {
            if (err) {
                return res.status(500).json({
                    err: err
                });
            }
            passport.authenticate('local')(req, res, function() {
                return res.status(200).json({
                    status: 'Registration successful!'
                });
            });
        });
});


router.post('/getSettings', function(req, res) {
    User.findOne({
        _id: req.body.id
    }, function(err, data) {
        if (err) {
            return res.status(500).json({
                err: err
            });
        } else {
            return res.status(200).json({
                status: 'Retrieved Settings!',
                data: data
            });
        }
    });
});


router.post('/updateSettings', function(req, res) {
    User.findOneAndUpdate({
        _id: req.body.id
    }, {
        $set: {
            first: req.body.first,
            last: req.body.last,
            city: req.body.city,
            state: req.body.state
        }
    }, {
        new: true
    }, function(err, data) {
        if (err) {
            return res.status(500).json({
                err: err
            });
        } else {
            return res.status(200).json({
                status: 'Updated Settings!',
                data: data
            });
        }
    });
});


router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({
                err: info
            });
        }
        req.logIn(user, function(err) {
            if (err) {
                return res.status(500).json({
                    err: 'Could not log in user'
                });
            }
            res.status(200).json({
                status: 'Login successful!',
                user: user._id
            });
        });
    })(req, res, next);
});

router.get('/logout', function(req, res) {
    req.logout();
    res.status(200).json({
        status: 'Bye!'
    });
});

router.get('/status', function(req, res) {
    // console.log('server side. status:', req.isAuthenticated());

    if (!req.isAuthenticated()) {
        return res.status(200).json({
            status: false
        });
    }
    res.status(200).json({
        status: true
    });
});

module.exports = router;