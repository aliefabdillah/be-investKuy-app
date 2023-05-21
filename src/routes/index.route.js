import express from "express";
import faqController from "../controllers/faq.controller.js";
import articleController from "../controllers/article.controller.js";
import usersController from "../controllers/users.controller.js";
import adminController from "../controllers/admin.controller.js";
import pengajuanController from "../controllers/pengajuan.controller.js";
import verificationController from "../controllers/verification.controller.js";
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
router.get('/riwayat-pengajuan/:username', pengajuanController.getRiwayat)      //UMKM
router.get('/pengajuan/:pengajuanId', pengajuanController.getById)              //UMKM
router.post(
    '/pengajuan/:pengajuanId/tambah-laporan', 
    cloudinaryConfig.uploadPengajuan.single('laporan'), 
    pengajuanController.addLaporanKeuangan
);                                                                              //UMKM
router.put('/pengajuan/:pengajuanId/cancel', pengajuanController.cancel)        //UMKM

/* Pengajuan Investor */
router.get('/pengajuan', pengajuanController.getAll)                                    //Investor
router.get('/pengajuan/:pengajuanId/laporan-keuangan', pengajuanController.getLaporan)  //investor

/* Verification */
router.post(
    '/verification/:username', 
    cloudinaryConfig.uploadVerification.any([{name:'ktpImg'}, {name: 'pasFoto'}]),
    verificationController.create
);          //USERS

router.get('/verification', verificationController.getAll)  //sisi admin
router.get('/verification/:verificationId', verificationController.getById) // sisi admin
router.put('/verification/:verificationId/:verifiedStatus', verificationController.updateVerified)      //sisi admin

export default router;