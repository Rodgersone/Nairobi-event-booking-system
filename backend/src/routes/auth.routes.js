const express = require('express');
const router = express.Router();

//  FIXED: Destructuring {} is required to catch the functions from the controller
const { register, login } = require('../controllers/auth.controller'); 

// If 'register' or 'login' were undefined, line 8 or 9 would crash the app
router.post('/register', register);
router.post('/login', login); 

module.exports = router;