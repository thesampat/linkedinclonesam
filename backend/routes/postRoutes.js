const router = require('express').Router()
const postController = require('../controllers/postController')
const multer = require('multer')
const path = require('path');


const upload = multer();



router.post('/', upload.any() ,postController.create_post)
router.patch('/:id', upload.any() ,postController.update_post)
router.delete('/:id', upload.any() ,postController.delete_post)
router.get('/', upload.any() ,postController.get_all_posts)


module.exports = router