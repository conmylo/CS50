/**
 * Description Router
 *
 */
const express = require('express');
const itemController = require('../controllers/item');
const router = express.Router();
const auth = require('../middlewares/auth');

router.get('/:id', auth, itemController.fetchByListId);

router.post('/', auth, itemController.create);

router.put('/delete/:id', auth, itemController.deleteItemFromList);
router.put('/:id', auth, itemController.update);

module.exports = router;
