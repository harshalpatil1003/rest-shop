const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const User = require('../models/user');




exports.users_get_all = (req, res, next) => {

    User.find()
        .select('_id email ')
        .exec()
        .then(docs => {

            const response = {
                count: docs.length,
                users: docs.map(doc => {
                    return {
                        id: doc._id,
                        email: doc.email,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/users/" + doc._id
                        }
                    }
                })
            }

            res.status(200).json(response);
        })
        .catch(err => {
            resstatus(500).json({
                error: err
            });

        });




}

exports.users_login = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            } else {
                bcrypt.compare(req.body.password, user[0].password, (err, result) => {

                    if (err) {
                        return res.status(401).json({
                            message: "Auth failed"
                        });
                    }
                    if (result) {
                        const token = jwt.sign({
                            email: user[0].email,
                            id: user[0]._id
                        },
                            process.env.JWT_KEY,
                            {
                                expiresIn: "1h"
                            }
                        );


                        return res.status(200).json({
                            message: "Auth Succesful",
                            token: token
                        });
                    }
                })
            }
        })
        .catch(err => {

            res.status(500).json({
                error: err
            });


        });





}


exports.users_signup = (req, res, next) => {

    User.find({ email: req.body.email })
        .then(user => {
            if (user.length >= 1) {
                res.status(409).json({
                    message: "Email already used"
                });

            } else {

                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    }
                    else {
                        const user = new User({
                            _id: mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user
                            .save()
                            .then(result => {
                                res.status(200).json({
                                    message: "User Created"
                                });
                            })
                            .catch(err => {
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                })

            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

exports.users_get_user = (req, res, next) => {

    User.findById({ _id: req.params.userId })

        .exec()
        .then(result => {
            if (result) {
                res.status(200).json({
                    result: result,
                    request: {
                        message: "Delete User",
                        type: "DELETE",
                        url: "http://localhost:3000/users/" + result._id

                    }
                });

            } else {

                res.status(404).json({
                    "message": "Invalid User Id"

                });

            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });



        });



}


exports.users_delete_user = (req, res, next) => {
    User.remove({ _id: req.params.userId })
        .exec()
        .then(result => {
            res.status(200).json({
                result: result,
                message: "User Deleted"
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });


        });



}