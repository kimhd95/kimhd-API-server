'use strict';

const
    express = require('express'),
    userService = require('../../../services/users'),
    models = require('../../../models'),
    chatbotService = require('../../../services/users/chatbot');

let router = express.Router();

console.log('apis/users/index.js called');
/**
 * api/v1/users/
 */
// router.use(chatbotService.checkTokenVerified);
router.post('/verify_token', chatbotService.verifyToken);
router.post('/register_user', chatbotService.registerUser);
router.post('/login', chatbotService.login);
router.post('/social_login', chatbotService.socialLogin);
router.post('/logout', chatbotService.logout);
router.post('/send_new_password', chatbotService.sendNewPassword);
router.post('/member_withdraw', chatbotService.memberWithdraw);
router.post('/update_password', chatbotService.updatePassword);

router.post('/update_user', chatbotService.updateUser);
router.post('/get_restaurant', chatbotService.getRestaurant);
router.post('/get_two_restaurant', chatbotService.getTwoRestaurant);
router.post('/get_all_history', chatbotService.getAllHistory);
router.post('/get_subway_history', chatbotService.getSubwayHistory);
router.post('/get_count_history', chatbotService.getCountHistory);
router.post('/update_socket', chatbotService.updateSocket);
router.post('/update_chatlog', chatbotService.updateChatLog);

router.post('/update_state_email', chatbotService.updateStateEmail);
router.post('/delete_part_log', chatbotService.deletePartLog);
router.post('/get_part_log', chatbotService.getPartLog);
router.post('/update_part_log', chatbotService.updatePartLog);


router.get('/get_user_info/:kakao_id', chatbotService.getUserInfo);
router.get('/get_user_info2/:email', chatbotService.getUserInfoByEmail);
router.post('/get_restaurant_info', chatbotService.getRestaurantInfo);
router.post('/update_user_start', chatbotService.updateUserStart);
router.post('/update_place_start', chatbotService.updatePlaceStart);
router.post('/update_rest2', chatbotService.updateRest2);
router.post('/update_place_info', chatbotService.updatePlaceInfo);
router.post('/update_mid_info', chatbotService.updateMidInfo);
router.post('/create_decide_history', chatbotService.createDecideHistory);
router.post('/create_user_feedback', chatbotService.createUserFeedback);
router.post('/get_feedback_info', chatbotService.getFeedbackInfo);
router.post('/create_user_log', chatbotService.createUserLog);
router.post('/update_limit_cnt', chatbotService.updateLimitCnt);
router.post('/verify_limit', chatbotService.verifyLimit);
router.post('/update_state', chatbotService.updateState);
router.get('/get_all_subway', chatbotService.getAllSubway);
router.get('/get_all_restaurant', chatbotService.getAllRestsaurant);
router.post('/verify_subway', chatbotService.verifySubway);
router.post('/verify_subway_drinktype', chatbotService.verifySubwayDrinktype);
router.post('/crawl_image', chatbotService.crawlImage);
router.post('/crawl_two_image', chatbotService.crawlTwoImage);
router.post('/previous_register_user', chatbotService.previousRegisterUser);
router.post('/get_chat_log', chatbotService.getChatLog);
router.post('/delete_chat_log', chatbotService.deleteChatLog);
router.post('/find_subway_drink_type', chatbotService.findSubwayDrinkType);
router.post('/get_drink_restaurant', chatbotService.getDrinkRestaurant);
router.post('/update_drink_start', chatbotService.updateDrinkStart);
router.get('/get_subway_list_history', chatbotService.getSubwayListHistory);
router.post('/update_limit_cnt_drink', chatbotService.updateLimitCntDrink);
router.post('/verify_limit_drink', chatbotService.verifyLimitDrink);


router.get('/get_users', userService.getUsers); // 현재 미사용
router.get('/:id', userService.getUserWithId); // 현재 미사용


router.use('/*', models.verifyAPIKEY); //현재 미사용
// ^Middleware. Make sure to put all the routes which needs authentication below this middleware.

module.exports = router;
