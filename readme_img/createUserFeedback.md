# 피드백 생성 (createUserFeedback)

| 메소드 | 경로                  | 짧은 설명   |
| ------ | --------------------- | ----------- |
| POST   | /create_user_feedback | 피드백 생성 |

- **'개발팀에게 피드백하기'** 시나리오에서 사용하는 API로서, 사용자의 피드백을 DB에 저장시킨다. 익명성을 위해, 소켓번호, 성별, 생일, 직업, 날짜만 저장시킨다.(18/12/28 기준으로 성별, 생일, 직업을 회원가입시 받지 않으므로, 공란으로 비워두었다.)

#### Request Header

```
{ 'content-type': 'application/json' }
```

#### Request Body

```
{
      "kakao_id": "r91PIeFjeOBihLfAAAAM",
      "sex": "남성",
      "birthday": "19951120",
      "job": "학생",
      "feedback_content": "음식점 더 추가해주세요!"
}
```

#### Response Body

**success**

```
{
    "success": true,
    "message": "UserFeedback Create complete."
}
```

**Internal Server or DB error**

```
{
	"success": "false", 
	"message": "Internal Server or Database Error. err: " + err.message
}
```





