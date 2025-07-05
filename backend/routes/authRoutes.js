const express = require('express');
const router = express.Router();
const { signUp, signIn, getUsers, getUserById, getProfile, updateProfile } = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/signup', signUp);
router.post('/signin', signIn);
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);

module.exports = router; 