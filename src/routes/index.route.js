import express from "express";
import faqController from "../controllers/faq.controller.js";
import articleController from "../controllers/article.controller.js";
import usersController from "../controllers/users.controller.js";
import adminController from "../controllers/admin.controller.js";
import pengajuanController from "../controllers/pengajuan.controller.js";
import cloudinaryConfig from "../configs/cloudinary.config.js";
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ 'Message': 'ok' });
});

/* Auth Admin & CS */
router.post('/loginAdmin', adminController.login);
router.post('/registerAdmin', adminController.register);

/* Auth Users */
router.post('/login', usersController.login);
router.post('/register', usersController.register);

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
export default router;