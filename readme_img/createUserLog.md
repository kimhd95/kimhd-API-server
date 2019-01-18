# 대화기록 생성 (createUserLog)

| 메소드 | 경로             | 짧은 설명     |
| ------ | ---------------- | ------------- |
| POST   | /create_user_log | 대화기록 생성 |

- 사용자의 대화 로그를 하나 씩 기록하는 API, 봇이 한 말은 id가 foodle로 저장된다.

#### Request Header

```
{ 'content-type': 'application/json' }
```

#### Request Body

```
{
      "kakao_id": "4OUiLgza_oAvKaaJAAAA",
      "scenario": "100",
      "state": "init",
      "content": "",
      "type": "chat message button",
      "answer_num": ""
}
```

#### Response Body

**success**

```
{
    "success": true,
    "message": "User Log and User both Update complete."
}
```

**Internal Server or DB error**

```
{
	"success": "false", 
	"message": "Internal Server or Database Error. err: " + err.message
}
```





