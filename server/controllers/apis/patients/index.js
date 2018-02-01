'use strict';

const
	express = require('express'),
	patientService = require('../../../services/patients'),
	models = require('../../../models'),
	chatbotService = require('../../../services/patients/chatbot')

let router = express.Router();

console.log('apis/patients/index.js called')

// Special request for Dashboard Chart URL for patients from Kakao Chatbot Server.
router.get('/get_patient_chart_url/:kakao_id', chatbotService.getPatientChartURL)

// ------ Kakao chatbot requests ------ //
// TODO: The below APIs do not follow the convention of making use of POST GET PUT DELETE for general purposes.
// Therefore, the naming may need to be updated in the future.
// For example, router.post('/register_patient') => router.post('/patient') and so on.
router.post('/register_patient', chatbotService.registerPatient)
router.post('/update_patient', chatbotService.updatePatient)
router.post('/create_patient_log', chatbotService.createPatientLog)
router.get('/get_patient_info/:kakao_id', chatbotService.getPatientInfo)
router.get('/get_medicine_time/:kakao_id', chatbotService.getMedicineTime)
router.post('/create_medicine_time', chatbotService.createMedicineTime)
router.get('/get_medicine_check/:kakao_id', chatbotService.getMedicineCheck)
router.post('/create_medicine_check', chatbotService.createMedicineCheck)

router.post('/create_mood_check', chatbotService.createMoodCheck)
router.post('/create_mood_check_text', chatbotService.createMoodCheckText)

router.get('/get_medicine_time_to_check/:kakao_id/:time', chatbotService.getMedicineTimeToCheck)


router.get('/get_patients', patientService.getPatients);
router.get('/:id', patientService.getPatientWithId);


router.use('/*', models.verifyAPIKEY);
// ^Middleware. Make sure to put all the routes which needs authentication below this middleware.

router.post('/register_kakao_id', patientService.registerKakaoId);
router.post('/register_doctor_code', patientService.registerDoctorCode);
router.post('/kakao_text', patientService.kakaoText);
router.post('/medicine_check', patientService.medicineCheck);
router.post('/medicine_check_miss_reason', patientService.medicineCheckMissReason);
router.post('/medicine_check_med_side', patientService.medicineCheckMedSide);
//router.post('/medicine_check_med_side_degree', patientService.medicineCheckMedSideDegree);
router.post('/mood_check', patientService.moodCheck);
router.post('/mood_check_reason', patientService.moodCheckReason);

module.exports = router;
