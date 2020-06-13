const express = require("express");
const router = express.Router();



const checkAuth = require('../middleware/check-auth');


const UsersControllers = require('../controllers/users');


router.get('/', UsersControllers.users_get_all);


router.post('/login', UsersControllers.users_login);


router.get('/:userId', UsersControllers.users_get_user);


router.post('/signup', UsersControllers.users_signup);


router.delete('/:userId', checkAuth, UsersControllers.users_delete_user);


    module.exports = router;