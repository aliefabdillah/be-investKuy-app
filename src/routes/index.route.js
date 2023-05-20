import express from "express";
import faqController from "../controllers/faq.controller.js";
import articleController from "../controllers/article.controller.js";
import usersController from "../controllers/users.controller.js";
import adminController from "../controllers/admin.controller.js";
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

export default router;