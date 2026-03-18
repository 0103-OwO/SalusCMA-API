import multer from 'multer';

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(new Error('Formato de archivo no soportado. Solo se permiten JPG, JPEG y PNG.'), false);
    }
};

export const upload = multer({ 
  storage: multer.memoryStorage(),
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } 
});