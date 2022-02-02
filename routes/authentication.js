const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

module.exports = (router) => {
    router.post('/register', (req, res) => {
        if (!req.body.email) {
            res.json({ success: false, message: 'You Must Provide an Email' });
        } else {
            if (!req.body.username) {
                res.json({ success: false, message: 'You Must Provide a User Name' });
            } else {
                if (!req.body.password) {
                    res.json({ success: false, message: 'You Must Provide a Password' });
                } else {
                    let user = new User({
                        email: req.body.email.toLowerCase(),
                        username: req.body.username.toLowerCase(),
                        password: req.body.password
                    });
                    user.save((err) => {
                        if (err) {
                            if (err.code == 11000) {
                                res.json({ success: false, message: 'E-mail or Username already exist' });
                            } else {
                                if (err.errors) {
                                    if (err.errors.email) {
                                        res.json({ success: false, message: err.errors.email.message });
                                    } else {
                                        if (err.errors.username) {
                                            res.json({ success: false, message: err.errors.username.message });
                                        } else {
                                            if (err.errors.password) {
                                                res.json({ success: false, message: err.errors.password.message });
                                            } else {
                                                res.json({ success: false, message: err });
                                            }
                                        }
                                    }
                                } else {
                                    res.json({ success: false, message: 'Could Not Save User. Error: ', err });
                                }
                            }
                        } else {
                            res.json({ success: true, message: 'Account Registered !' });
                        }
                    })
                }
            }
        }
    });
    router.get('/checkEmail/:email', (req, res) => {
        if (!req.params.email) {
            res.json({ success: false, message: 'Email was not provided' });
        } else {
            User.findOne({ email: req.params.email.toLowerCase() }, (err, user) => {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    if (user) {
                        res.json({ success: false, message: 'Email is Not Available' });
                    } else {
                        res.json({ success: true, message: 'Email is Available' });
                    }
                }
            })
        }
    });
    router.get('/checkUsername/:username', (req, res) => {
        if (!req.params.username) {
            res.json({ success: false, message: 'Username was not provided' });
        } else {
            User.findOne({ username: req.params.username.toLowerCase() }, (err, user) => {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    if (user) {
                        res.json({ success: false, message: 'Username is Not Available' });
                    } else {
                        res.json({ success: true, message: 'Username is Available' });
                    }
                }
            });
        }
    });
    router.post('/login', (req, res) => {
        if (!req.body.username) {
            res.json({ success: false, message: 'Username was not provided' });
        } else {
            if (!req.body.password) {
                res.json({ success: false, message: 'Password was not provided' });
            } else {
                User.findOne({ username: req.body.username.toLowerCase() }, (err, user) => {
                    if (err) {
                        res.json({ success: false, message: err });
                    } else {
                        if (!user) {
                            res.json({ success: false, message: 'Username Not Found' });
                        } else {
                            const validPassword = user.comparePassword(req.body.password);
                            if (!validPassword) {
                                res.json({ success: false, message: 'Password Invalid' });
                            } else {
                                const token = jwt.sign({ userId: user._id }, config.secret, { expiresIn: '24h' });


                                res.json({ success: true, message: 'Success!', token: token, user: { username: user.username } });
                            }
                        }
                    }
                })
            }
        }
    });

    router.use((req, res, next) => {
        const token = req.headers['authorization'];
        if (!token) {
            res.json({ success: false, message: 'No Token Provided' });
        } else {
            jwt.verify(token, config.secret, (err, decoded) => {
                if (err) {
                    res.json({ success: false, message: 'Token Invalid: ' + err });
                } else {
                    req.decoded = decoded;
                    next();
                }
            })
        }
    });

    router.get('/profile', (req, res) => {
        User.findOne({ _id: req.decoded.userId }).select('username email').exec((err, user) => {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                if (!user) {
                    res.json({ success: false, message: 'User Not Found' });
                } else {
                    res.json({ success: true, user: user });
                }
            }
        })
    });
    return router;
}