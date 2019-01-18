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

### 새로운 API 추가하기

1. **[server/services/users/](./server/services/users/)**에 새로운 API 모듈 추가하기
2. **[server/controllers/apis/users/index.js](./server/controllers/apis/users/index.js)**에 라우터 설정



### TODO?

- 기존 카카오톡 기반 플랫폼과 달리 웹 기반이기 때문에, 세션처리가 용이하다.  
- 꼭 필요한 정보 아니면, 세션으로 처리해서 칼럼을 줄이는 게 더 효율적이라고 생각한다.