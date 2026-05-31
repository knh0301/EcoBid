const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');

// 인증 불필요
router.post('/register', authController.register);
router.post('/login',    authController.login);
router.post('/social',   authController.socialLogin);
router.post('/google',   authController.googleLogin);
router.post('/password-reset/request', authController.requestPasswordReset);
router.post('/password-reset/confirm', authController.resetPassword);
router.post('/refresh',  authController.refresh);

// 인증 필요
router.post('/logout',   authenticate, authController.logout);
router.get('/me',        authenticate, authController.getMe);
router.patch('/me',      authenticate, authController.updateMe);
router.delete('/me',     authenticate, authController.deleteMe);
router.post('/me/profile-image', authenticate, authController.uploadProfileImage);

module.exports = router;
