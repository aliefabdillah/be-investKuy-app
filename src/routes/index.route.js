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

/* Pengajuan */
router.post(
    '/pengajuan', 
    cloudinaryConfig.uploadPengajuan.any([{name:'image1'},{name:'image2'},{name:'image3'},{name:'laporan'}])
    ,pengajuanController.create
);
router.put(
    '/pengajuan/:pengajuanId', 
    cloudinaryConfig.uploadPengajuan.any([{name:'image1'},{name:'image2'},{name:'image3'}])
    ,pengajuanController.updateById
);
router.get('/riwayat-pengajuan/:username', pengajuanController.getRiwayat)
router.get('/pengajuan/:pengajuanId', pengajuanController.getById)
router.post(
    '/pengajuan/tambah-laporan/:pengajuanId', 
    cloudinaryConfig.uploadPengajuan.single('laporan'), 
    pengajuanController.addLaporanKeuangan
);
router.put('/pengajuan/cancel/:pengajuanId', pengajuanController.cancel)

/* Verification */
router.post(
    '/verification/:username', 
    cloudinaryConfig.uploadVerification.any([{name:'ktpImg'}, {name: 'pasFoto'}]),
    verificationController.create
);

router.get('/verification', verificationController.getAll)  //sisi admin
router.get('/verification/:verificationId', verificationController.getById) // sisi admin
router.put('/verification/:verificationId/:verifiedStatus', verificationController.updateVerified)
export default router;