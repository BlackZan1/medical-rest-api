const { Router } = require('express');
const router = Router();
const { check } = require('express-validator');

// Middlewares
const verify = require('../middlewares/verify');

// Controllers
const {
    login,
    signup,
    me
} = require('../controllers/auth');

// POST - login
router.post('/login', login);

// POST - signup
router.post('/signup', [
    check('email', 'Invalid email').isEmail(),
    check('password', 'Password must be more than 8 and less 32 symbols').isLength({ min: 8, max: 32 })
], signup);

// GET - me
router.get('/me', verify, me);

module.exports = router;