// controller.js
// Import user model
User = require('../models/user');
const bcrypt = require('bcrypt');
// Handle index actions
exports.index = function(req, res) {
    User.get(function(err, users) {
        if (err) {
            res.json({
                status: 'error',
                message: err
            });
        }
        res.json({
            status: 'success',
            message: 'Users retrieved successfully',
            data: users
        });
    });
};
// Handle create user actions
exports.new = async function(req, res) {
    let check = await User.find({ email: req.body.email });
    if (check[0] != null) {
        return res.status(200).send('That user already exists!');
    } else {
        var user = new User({
            name: req.body.name,
            city: req.body.city,
            country: req.body.country,
            birthday: req.body.birthday,
            email: req.body.email,
            password: req.body.password
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        // save the user and check for errors
        user.save(function(err) {
            // Check for validation error
            if (err) res.json(err);
            else
                res.json({
                    status: 'success',
                    message: 'New user created!',
                    data: user
                });
        });
    }
};
// Handle view user info
exports.view = function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
        if (err) res.send(err);
        res.json({
            message: 'User details loading..',
            data: user
        });
    });
};
// Handle update user info
exports.update = function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
        if (err) res.send(err);
        user.name = req.body.name;
        user.city = req.body.city;
        user.country = req.body.country;
        user.birthday = req.body.birthday;
        user.email = req.body.email;
        user.password = req.body.password;
        // save the user and check for errors
        user.save(function(err) {
            if (err) res.json(err);
            res.json({
                status: 'success',
                message: 'User Info updated',
                data: user
            });
        });
    });
};
// Handle delete user
exports.delete = function(req, res) {
    User.remove({
            _id: req.params.user_id
        },
        function(err, user) {
            if (err) res.send(err);
            res.json({
                status: 'success',
                message: 'User deleted'
            });
        }
    );
};