import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { upload } from '../config/cloudinary.js';
import { uploadImage } from '../controllers/uploadController.js';

const router: Router = Router();

router.use(authenticate);

router.post('/', upload.single('image'), uploadImage);

export default router;
