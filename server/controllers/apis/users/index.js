'use strict';

const
    express = require('express'),
    userService = require('../../../services/users'),
    models = require('../../../models'),
    chatbotService = require('../../../services/users/chatbot');

let router = express.Router();

console.log('apis/users/index.js called');

// Special request for Dashboard Chart URL for users from Kakao Chatbot Server.
router.get('/get_user_chart_url/:encrypted_kakao_id', chatbotService.getUserChartURL);

// ------ Kakao chatbot requests ------ //
// TODO: The below APIs do not follow the convention of making use of POST GET PUT DELETE for general purposes.
// Therefore, the naming may need to be updated in the future.
// For example, router.post('/register_user') => router.post('/user') and so on.

/**
 * api/v1/users/
 */

router.post('/register_user', chatbotService.registerUser);
router.post('/verify_doctor_code', chatbotService.verifyDoctorCode);
router.post('/update_user', chatbotService.updateUser);
router.post('/update_daily', chatbotService.updateDaily);
router.post('/update_stamp', chatbotService.updateStamp);
router.post('/update_test', chatbotService.updateTest);
router.post('/create_user_image', chatbotService.createUserImage);
router.post('/create_user_log', chatbotService.createUserLog);
router.post('/update_exit', chatbotService.updateExit);
router.post('/update_user_start', chatbotService.updateUserStart);
router.post('/update_place_start', chatbotService.updatePlaceStart);
router.post('/update_rest4', chatbotService.updateRest4);
router.post('/get_restaurant', chatbotService.getRestaurant);
router.post('/get_two_restaurant', chatbotService.getTwoRestaurant);
router.get('/get_user_info/:kakao_id', chatbotService.getUserInfo);
router.post('/get_restaurant_info', chatbotService.getRestaurantInfo);
router.get('/get_medicine_time/:kakao_id', chatbotService.getMedicineTime);
router.post('/create_medicine_time', chatbotService.createMedicineTime);
router.get('/get_medicine_check/:kakao_id', chatbotService.getMedicineCheck);
router.post('/create_medicine_check', chatbotService.createMedicineCheck);
router.post('/create_decide_history', chatbotService.createDecideHistory);
router.post('/update_rest_only2', chatbotService.updateRestOnly2);
router.post('/update_place_info', chatbotService.updatePlaceInfo);
router.post('/update_mid_info', chatbotService.updateMidInfo);

router.post('/create_mood_check', chatbotService.createMoodCheck);
router.post('/create_mood_check_text', chatbotService.createMoodCheckText);

router.get('/get_medicine_time_to_check/:kakao_id/:time', chatbotService.getMedicineTimeToCheck);


router.get('/get_users', userService.getUsers);
router.get('/:id', userService.getUserWithId);


router.use('/*', models.verifyAPIKEY);
// ^Middleware. Make sure to put all the routes which needs authentication below this middleware.

router.post('/register_doctor_code', userService.registerDoctorCode);
router.post('/kakao_text', userService.kakaoText);
router.post('/medicine_check', userService.medicineCheck);
router.post('/medicine_check_miss_reason', userService.medicineCheckMissReason);
router.post('/medicine_check_med_side', userService.medicineCheckMedSide);
//router.post('/medicine_check_med_side_degree', userService.medicineCheckMedSideDegree);
router.post('/mood_check', userService.moodCheck);
router.post('/mood_check_reason', userService.moodCheckReason);

module.exports = router;
