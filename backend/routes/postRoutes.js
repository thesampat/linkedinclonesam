const router = require('express').Router()
const postController = require('../controllers/postController')
const multer = require('multer')
const path = require('path');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../opt/render/project/src/upload')); // upload folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });



router.post('/', upload.any() ,postController.create_post)
router.patch('/:id', upload.any() ,postController.update_post)
router.delete('/:id', upload.any() ,postController.delete_post)
router.get('/', upload.any() ,postController.get_all_posts)


module.exports = router