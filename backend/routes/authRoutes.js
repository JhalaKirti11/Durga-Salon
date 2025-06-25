const express = require('express');
const router = express.Router();
const { signUp, signIn, getUsers, getUserById } = require('../controllers/authController');

router.post('/signup', signUp);
router.post('/signin', signIn);
router.get('/users', getUsers);
router.get('/users/:id', getUserById);

module.exports = router; 