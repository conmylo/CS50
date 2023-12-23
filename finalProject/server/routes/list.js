/**
 * Description Router
 *
 */
const express = require('express');
const listController = require('../controllers/list');
const router = express.Router();
const auth = require('../middlewares/auth');

router.get('/', auth, listController.fetchAll);
router.get('/:id', auth, listController.fetchById);

router.post('/', auth, listController.create);
router.put('/:id', auth, listController.update);

router.delete('/:id', auth, listController.deleteList);


module.exports = router;
