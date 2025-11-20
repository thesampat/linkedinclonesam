const router = require('express').Router()
const authUser = require('../controllers/userControllers')
const googleAuth = require('../middlewear/googleauth')

router.post('', authUser.authUser)
router.post('/friend_request', googleAuth ,authUser.sendFriendRequest)
router.post('/friend_response',  googleAuth ,authUser.acceptRejectFriendRequest)

module.exports = router