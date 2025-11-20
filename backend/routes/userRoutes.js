const router = require('express').Router()
const authUser = require('../controllers/userControllers')

router.post('', authUser.authUser)
router.post('/friend_request', authUser.sendFriendRequest)
router.post('/friend_response', authUser.acceptRejectFriendRequest)

module.exports = router