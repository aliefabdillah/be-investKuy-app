import express from "express";
import faqController from "../controllers/faq.controller.js";
import articleController from "../controllers/article.controller.js";
import usersController from "../controllers/users.controller.js";
import adminController from "../controllers/admin.controller.js";
import pengajuanController from "../controllers/pengajuan.controller.js";
import verificationController from "../controllers/verification.controller.js";
import walletController from "../controllers/wallet.controller.js";
import merchantController from "../controllers/merchant.controller.js";
import rekeningController from "../controllers/rekening.controller.js";
import pendanaanController from "../controllers/pendanaan.controller.js";
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
router.get('/faq', faqController.get);                      //users
router.post('/faq', faqController.create);                  //admin
router.put('/faq/:faqId', faqController.update);            //admin
router.delete('/faq/:faqId', faqController.deleteById);     //admin

/* Articles */
router.get('/articles', articleController.getAll);                  //users
router.get('/articles/:articleId', articleController.getById);      //users
router.post('/articles', cloudinaryConfig.uploadArticleImg.single('img_url'), articleController.create);            //admin
router.put('/articles/:articleId', cloudinaryConfig.uploadArticleImg.single('img_url'), articleController.update);  //admin
router.delete('/articles/:articleId', articleController.deleteById);                                                //admin

/* Pengajuan */
router.post(
    '/pengajuan', 
    cloudinaryConfig.uploadPengajuan.any([{name:'image1'},{name:'image2'},{name:'image3'},{name:'laporan'}])
    ,pengajuanController.create
);             //UMKM
router.put(
    '/pengajuan/:pengajuanId', 
    cloudinaryConfig.uploadPengajuan.any([{name:'image1'},{name:'image2'},{name:'image3'}])
    ,pengajuanController.updateById
);              //UMKM
router.get('/riwayat-crowdfunding/:username', pengajuanController.getRiwayatCrowdfunding)              //UMKM
router.get('/riwayat-payment/:username', pengajuanController.getRiwayatPayment)              //UMKM
router.get('/pengajuan-details/:pengajuanId', pengajuanController.getById)                      //UMKM
router.post(
    '/pengajuan/:pengajuanId/tambah-laporan', 
    cloudinaryConfig.uploadPengajuan.single('laporan'), 
    pengajuanController.addLaporanKeuangan
);                                                                                      //UMKM
router.put('/pengajuan/:pengajuanId/cancel', pengajuanController.cancel)                //UMKM
router.get('/pengajuan/:pengajuanId/list-investor', pengajuanController.getInvestor)    //UMKM
router.put('/pengajuan/:pengajuanId/tarik-pendanaan', pengajuanController.tarikPendanaan)   //UMKM
router.put('/pengajuan/:pengajuanId/bayar-cicilan', pengajuanController.bayarCicilanPengajuan) //UMKM

/* Pengajuan Investor */
router.get('/pengajuan/:page', pengajuanController.getAll)                                      //Investor
router.get('/pengajuan/:pengajuanId/laporan-keuangan', pengajuanController.getLaporan)          //investor

/* Verification */
router.post(
    '/verification/:username', 
    cloudinaryConfig.uploadVerification.any([{name:'ktpImg'}, {name: 'pasFoto'}]),
    verificationController.create
);          //USERS

router.get('/verification', verificationController.getAll)  //sisi admin
router.get('/verification/:verificationId', verificationController.getById) // sisi admin
router.put('/verification/:verificationId/:verifiedStatus', verificationController.updateVerified)      //sisi admin

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

/* Pendanaan Investor */
router.post('/pendanaan/:pengajuanId/:userId', pendanaanController.create)
router.put('/pendanaan/cancel/:pengajuanId/:userId', pendanaanController.cancel)
router.put('/pendanaan/:pendanaanId/tarik-pendanaan', pendanaanController.tarikIncome)

/* Profile Users */
router.get('/user/profile/:userId', usersController.getUsersProfile)
router.put('/user/profile/ubah-info-akun/:userId', cloudinaryConfig.uploadImageProfile.single("img_profile"), usersController.updateInfoAkun)
router.put('/user/profile/ubah-password/:userId', usersController.updatePass)
router.put('/user/profile/ubah-pin/:userId', usersController.updatePin)

export default router;