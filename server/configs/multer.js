import multer from 'multer';
const storage = multer.diskStorage({})
const upload = multer.MulterError({storage})
export default upload