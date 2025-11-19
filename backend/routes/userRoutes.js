const router = require('express').Router()
const {authUser} = require('../controllers/userControllers')

router.post('', authUser)

module.exports = router