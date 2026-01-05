const { Router } = require('express');
const { createQrCode, getMyQrCodes, updateMyQrCodes, deleteQrCode } = require('../controller/qr.controller');
const userController = require('../controller/user.conroller');
const historyController = require('../controller/history.controller');

const router = Router();

router.post('/registration', userController.registration);
router.post('/login', userController.login);

router.post('/qrcodes', createQrCode);
router.get('/qrcodes', getMyQrCodes);
router.put('/qrcodes/:id', updateMyQrCodes);
router.delete('/qrcodes/:id', deleteQrCode);

router.post('/history', historyController.addScanHistory);
router.get('/history', historyController.getMyScanHistory);
router.delete('/history/:id', historyController.deleteHistoryRecord);

module.exports = router;