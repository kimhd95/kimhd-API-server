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
router.post('/logout', chatbotService.logout);

router.post('/previous_register_user', chatbotService.previousRegisterUser);
router.post('/update_user', chatbotService.updateUser);
router.post('/update_limit_cnt', chatbotService.updateLimitCnt);
router.post('/update_stamp', chatbotService.updateStamp);
router.post('/update_state', chatbotService.updateState);
router.post('/create_user_log', chatbotService.createUserLog);
router.post('/update_user_start', chatbotService.updateUserStart);
router.post('/update_place_start', chatbotService.updatePlaceStart);
router.post('/update_rest4', chatbotService.updateRest4);
router.post('/verify_limit', chatbotService.verifyLimit);
router.post('/get_restaurant', chatbotService.getRestaurant);
router.post('/get_two_restaurant', chatbotService.getTwoRestaurant);
router.post('/get_last_history', chatbotService.getLastHistory);
router.post('/get_today_history', chatbotService.getTodayHistory);
router.post('/get_three_history', chatbotService.getThreeHistory);
router.post('/get_count_history', chatbotService.getCountHistory);
router.post('/get_subway_history', chatbotService.getSubwayHistory);
router.post('/get_all_history', chatbotService.getAllHistory);
router.post('/update_closedown', chatbotService.updateClosedown);
router.get('/get_user_info/:kakao_id', chatbotService.getUserInfo);
router.get('/get_rest_info/:id', chatbotService.getRestInfo);
router.get('/get_all_subway', chatbotService.getAllSubway);
router.get('/get_all_restaurant', chatbotService.getAllRestsaurant);
router.post('/verify_subway', chatbotService.verifySubway);
router.post('/get_restaurant_info', chatbotService.getRestaurantInfo);
router.post('/create_decide_history', chatbotService.createDecideHistory);
router.post('/create_user_feedback', chatbotService.createUserFeedback);
router.post('/get_feedback_info', chatbotService.getFeedbackInfo);
router.post('/update_rest_only2', chatbotService.updateRestOnly2);
router.post('/update_place_info', chatbotService.updatePlaceInfo);
router.post('/update_mid_info', chatbotService.updateMidInfo);
router.post('/crawl_two_image', chatbotService.crawlTwoImage);
router.post('/crawl_image', chatbotService.crawlImage);

router.get('/get_beer_info/:id', userService.getBeerInfo);

router.get('/get_users', userService.getUsers);
router.get('/:id', userService.getUserWithId);


router.use('/*', models.verifyAPIKEY);
// ^Middleware. Make sure to put all the routes which needs authentication below this middleware.
router.post('/get_beer', chatbotService.getBeer);
router.post('/get_two_beer', chatbotService.getTwoBeer);
router.post('/update_beer_only2', chatbotService.updateBeerOnly2);

module.exports = router;
