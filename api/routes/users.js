const { Router } = require('express');

// Controllers
const {
    getUserById,
    getUsers
} = require('../controllers/users')

const router = Router();

// GET
router.get('/', getUsers);

// GET by ID
router.get('/:id', getUserById);

module.exports = router;