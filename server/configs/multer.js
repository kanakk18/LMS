import multer from 'multer';

// Define storage options
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the directory where the file should be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Define a unique filename for each file
  },
});

// Initialize multer with storage options
const upload = multer({ storage });

// Export the multer instance
export default upload;
