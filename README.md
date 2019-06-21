# food-api-server

food-chatbot API Server

ORM : Sequelize

### DB ERD

2019/01/18

![diagram](./readme_img/diagram.png)

### Basic Router

```
/api/v1/users/
```

### HTTP Status Code

| Status Code | 내용                 |
| ----------- | -------------------- |
| 200         | 정상                 |
| 401         | no parameter         |
| 403         | no result            |
| 500         | 내부 서버 or DB 오류 |



### 새로운 API 추가하기

1. **[server/services/users/](./server/services/users/)**에 새로운 API 모듈 추가하기
2. **[server/controllers/apis/users/index.js](./server/controllers/apis/users/index.js)**에 라우터 설정


### API

**verifyAPIKEY**

- API 요청이 왔을 때, API-KEY를 검사해서 사용가능 여부를 판단하게 한다.
  - 현재는 개발 단계이기 때문에, 사용하지 않음.

**[회원정보 업데이트 (updateUser)](./readme_img/updateUser.md)**

- ```
  [POST] /update_user  (+request_body)
  ```

**[추천 음식점 조회 (getRestaurant)](./readme_img/getRestaurant.md)**

- ```
  [POST] /get_restaurant  (+request_body)
  ```


**[소켓정보 업데이트 (updateSocket)](./readme_img/updateSocket.md)**

- ```
  [POST] /update_socket  (+request_body)
  ```


**채팅로그 업데이트 (updateChatLog)**

- ```
  [POST] /update_chatlog  (+request_body)
  ```

- 재접속 시, 이전에 대화한 기록을 불러오기 위한 채팅기록을 통채로 저장하는 API로서, 매번 채팅마다 사용된다. 너무 많은 기록 저장을 지양하기 위해, html의 String Length 기준으로 1000000 이상일 시, 초기화 된다.

**[선택기록 생성 (createDecideHistory)](./readme_img/createDecideHistory.md)**

- ```
  [POST] /create_decide_history  (+request_body)
  ```


**[피드백 생성 (createUserFeedback)](./readme_img/createUserFeedback.md)**

- ```
  [POST] /create_user_feedback  (+request_body)
  ```


**[대화기록 생성 (createUserLog)](./readme_img/createUserLog.md)**

- ```
  [POST] /create_user_log  (+request_body)
  ```


**[선택제한 업데이트 (updateLimitCnt)](./readme_img/updateLimitCnt.md)**

- ```
  [POST] /update_limit_cnt  (+request_body)
  ```

**[선택제한 여부 확인 (verifyLimit)](./readme_img/verifyLimit.md)**

- ```
  [POST] /verify_limit  (+request_body)
  ```


**[유저상태 업데이트 (updateState)](./readme_img/updateState.md)**

- ```
  [POST] /update_state  (+request_body)
  ```


**[지하철 자동완성 검색 (getAllSubway)](./readme_img/getAllSubway.md)**

- ```
  [GET] /get_all_subway?term=(+querystring)
  ```


**[지하철 존재여부 확인 (verifySubway)](./readme_img/verifySubway.md)**

- ```
  [POST] /verify_subway  (+request_body)
  ```


**[이미지 크롤링 (crawlImage)](./readme_img/crawlImage.md)**

- ```
  [POST] /crawl_image  (+request_body)
  ```


**[채팅로그 조회 (getChatLog)](./readme_img/getChatLog.md)**

- ```
  [POST] /get_chat_log  (+request_body)
  ```

**[지하철 선택 기록 자동완성 조회 (getSubwayListHistory)](./readme_img/getSubwayListHistory.md)**

- ```
  [GET] /get_subway_list_history?email=(+querystring)
  ```


### API -2019.6.19 추가

**[유저 등록 (registerUser)]**

  ```
  [Post] /register_user
  ```

**[로그인 (login)]**

  ```
  [Post] /login
  ```

**[소셜로그인 (socialLogin)]**

  ```
  [Post] /social_login
  ```

**[로그아웃 (logout)]**

  ```
  [Post] /logout
  ```

**[패스워드 변경 (updatePassword)]**

  ```
  [Post] /update_password
  ```

**[회원탈퇴 (memeberWithdraw)]**

  ```
  [Post] /member_withdraw
  ```

**[ID로 2개 음식점 조회 (getTwoRestaurant)]**

  ```
  [Post] /get_two_restaurant
  ```

**[가까운 음식점 조회 (getNearRestaurant)](./readme_img/getNearRestaurant.md)**

  ```
  [Post] /get_near_restaurant
  ```

  사용자의 위도, 경도 값을 기준으로 가까운 음식점을 조회한다.


**[지하철 선택 기록 조회 (getSubwayHistory)]**

  ```
  [Post] /get_subway_history
  ```

**[계정별 선택 기록 개수 조회 (getCountHistory)]**

  ```
  [Post] /get_count_history
  ```

**[계정별 모든 선택 기록 조회 (getAllHistory)]**

  ```
  [Post] /get_all_history
  ```

**[계정 state 업데이트 (updateStateEmail)]**

  ```
  [Post] /update_state_email
  ```

**[일회용 계정 등록 (registerOnetimeUser)]**

  ```
  [Post] /register_onetime_user
  ```

**[일회용 계정으로 로그인 (loginOnetime)]**

  ```
  [Post] /login_onetime
  ```

**[사용자 정보 조회 (getUserInfo)]**

  ```
  [Get] /get_user_info/:kakao_id
  [Get] /get_user_info2/:email
  ```

**[음식점 정보 조회 (getRestaurantInfo)]**

  ```
  [Post] /get_restaurant_info
  ```

  ID값으로 식당 정보를 조회한다. 해당 식당이 DB에 어떻게 저장되었는지 칼럼 값을 조회할 수 있다.

**[계정에 추천 음식점ID 저장 (updateRest2)]**

  ```
  [Post] /update_rest2
  ```

  DB 내 사용자 계정 레코드에 코기 Decide_final 단계에서 제시된 2개의 식당의 ID값을 저장한다. 이렇게 저장된 ID 정보는 '다른식당보기' 등에서 사용된다.

**[DB내 모든 음식점 조회 (getAllRestaurant)]**

  ```
  [Get] /get_all_restaurant
  ```

  ※ 이용자 제한이 필요한 API로 현재 임시 비활성화 상태이다.

**[비슷한 음식점 조회 (getSimilarRestaurant)](./readme_img/getSimilarRestaurant.md)**
**[비슷한 술집 조회 (getSimilarDrinkRestaurant)]**

  ```
  [Post] /get_similar_restaurant
  [Post] /get_similar_drink_restaurant
  ```

  사용자가 최종적으로 선택한 식당을 기준으로 비슷한 식당 정보를 반환한다.

**[다른 음식점 조회 (getOtherRestaurant)](./readme_img/getOtherRestaurant.md)**
**[다른 술집 조회 (getOtherDrinkRestaurant)]**

  ```
  [Post] /get_other_restaurant
  [Post] /get_other_drink_restaurant
  ```

  코기 시나리오 중 Decide_final 단계에서 추천된 식당/술집을 제외하고 동일 조건으로 다른 식당/술집을 찾아 반환한다. 결과가 3개 이상일 경우 랜덤으로 2개를 추출하여 반환한다.


**[추천 술집 조회 (getDrinkRestaurant)]**

  ```
  [Post] /get_drink_restaurant
  ```

  조건에 맞는 술집 정보를 반환한다. getRestaurant API의 로직과 거의 동일하게 동작한다.

**[음식점 필터링 결과 존재여부 확인 (verifyResultExist)]**

  ```
  [Post] /verify_result_exist
  ```

  특정 조건에 맞는 식당의 존재여부를 반환한다. 코기 시나리오 中 '1만원 미만' 시나리오에서 추가질문의 유효성을 확인하기 위한 용도로 구현하였다.

**[음식점 위,경도값 갱신 (setRestaurantLatLng)]**

  ```
  [Post] /set_restaurant_latlng
  ```

  식당의 위도, 경도 값을 업데이트하는 API로, 일괄적으로 업데이트하기 위한 용도로 구현하였다.

**[음식점 폐점유무 갱신 (updateClosedown)]**

  ```
  [Post] /update_closedown
  ```

  식당 폐점유무를 갱신한다. 이 API는 현재 매달 1일마다 Scheduler로 자동 실행된다.

**[역 근처 음식점 조회 (getRestaurantSubway)]**

  ```
  [Post] /get_restaurant_subway
  ```

**[MBTI 사용 로그 기록 (updateMBTILogs)]**

  ```
  [Post] /update_MBTI_logs
  ```

  MBTI 사용 로그 데이터를 저장한다.

**[슐랭가이드 항목 추가 (addChelinguideItem)](./readme_img/addChelinguideItem.md)**

  ```
  [Post] /add_chelinguide_item
  ```

**[슐랭가이드 항목 삭제 (deleteChelinguideItem)](./readme_img/deleteChelinguideItem.md)**

  ```
  [Post] /delete_chelinguide_item
  ```

**[슐랭가이드 목록 조회 (getChelinguideList)](./readme_img/getChelinguideList.md)**

  ```
  [Post] /get_chelinguide_list
  ```

**[슐랭가이드 항목 수정 (modifyChelinguideItem)](./readme_img/modifyChelinguideItem.md)**

  ```
  [Post] /modify_chelinguide_item
  ```

**[슐랭가이드 항목 정보 조회 (getChelinguideItemInfo)](./readme_img/getChelinguideItemInfo.md)**

  ```
  [Post] /get_chelinguide_item_info
  ```

**[여행챗봇 Plan 데이터 생성 (savePlan)](./readme_img/savePlan.md)**

  ```
  [Post] /save_plan
  ```

**[여행챗봇 Plan 데이터 조회 (searchPlan)](./readme_img/searchPlan.md)**

  ```
  [Post] /search_plan
  ```



### TODO?

- 기존 카카오톡 기반 플랫폼과 달리 웹 기반이기 때문에, 세션처리가 용이하다.  
- 꼭 필요한 정보 아니면, 세션으로 처리해서 칼럼을 줄이는 게 더 효율적이라고 생각한다.
