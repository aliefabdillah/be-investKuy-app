import express from "express";
import faqController from "../controllers/faq.controller.js";
import articleController from "../controllers/article.controller.js";
import usersController from "../controllers/users.controller.js";
import adminController from "../controllers/admin.controller.js";
import walletController from "../controllers/wallet.controller.js";
import merchantController from "../controllers/merchant.controller.js";
import rekeningController from "../controllers/rekening.controller.js";
import cloudinaryConfig from "../configs/cloudinary.config.js";
import verifyTokenMiddleware from "../middlewares/verifyToken.middleware.js";
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ 'Message': 'ok' });
});

/* Auth Admin & CS */
router.post('/admin/login', adminController.login);
router.post('/admin/register', adminController.register);

/* Auth Users */
router.post('/user/login', usersController.login);
router.post('/user/register', usersController.register);

/* Get All Users (Admin) */
router.get('/admin/users', verifyTokenMiddleware.verifyTokenAdmin, usersController.getAllUsers);
router.get('/cs/users', verifyTokenMiddleware.verifyTokenCustomerService, usersController.getAllUsers);

/* FAQ */
router.get('/faq', faqController.get);
router.post('/faq', faqController.create);
router.put('/faq/:faqId', faqController.update);
router.delete('/faq/:faqId', faqController.deleteById);

/* Articles */
router.get('/articles', articleController.getAll);
router.get('/articles/:articleId', articleController.getById);
router.post('/articles', cloudinaryConfig.uploadArticleImg.single('img_url'), articleController.create);
router.put('/articles/:articleId', cloudinaryConfig.uploadArticleImg.single('img_url'), articleController.update);
router.delete('/articles/:articleId', articleController.deleteById);

/* Merchant */
router.get('/merchants', merchantController.get);
router.get('/merchants/:id', merchantController.getById);
router.post('/merchants', verifyTokenMiddleware.verifyTokenAdmin, merchantController.create);
router.put('/merchants/:id', verifyTokenMiddleware.verifyTokenAdmin, merchantController.update);
router.delete('/merchants/:id', verifyTokenMiddleware.verifyTokenAdmin, merchantController.deleteById);

/* Rekening */
router.get('/rekenings/:userId', verifyTokenMiddleware.verifyTokenUser, rekeningController.get);
router.get('/rekenings/id/:id', verifyTokenMiddleware.verifyTokenUser, rekeningController.getById);
router.post('/rekenings', verifyTokenMiddleware.verifyTokenUser, rekeningController.create);
router.put('/rekenings/:id', verifyTokenMiddleware.verifyTokenUser, rekeningController.update);
router.delete('/rekenings/:id', verifyTokenMiddleware.verifyTokenUser, rekeningController.deleteById);

/* Wallet */
router.get('/wallet/:username', verifyTokenMiddleware.verifyTokenUser, walletController.getWallet);
router.get('/wallet/debits/:walletId', verifyTokenMiddleware.verifyTokenUser, walletController.getAllDebitTransactions);
router.get('/wallet/credits/:walletId', verifyTokenMiddleware.verifyTokenUser, walletController.getAllCreditTransactions);
router.post('/wallet/debits', verifyTokenMiddleware.verifyTokenUser, walletController.createDebitTransaction);
router.post('/wallet/credits', verifyTokenMiddleware.verifyTokenUser, walletController.createCreditTransaction);

export default router;