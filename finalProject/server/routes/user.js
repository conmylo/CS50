/**
 * Description Router
 *
 */
const express = require('express');
const userController = require('../controllers/user');
const router = express.Router();
const auth = require('../middlewares/auth');

router.post('/', userController.create);
router.post('/login', userController.login);

router.get('/', auth, userController.fetchAllUsers);
router.get('/me', auth, userController.fetchMe)
router.get('/:id', auth, userController.fetchUserById);

router.delete('/:id', auth, userController.deleteUser);

module.exports = router;
