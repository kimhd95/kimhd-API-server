# 채팅로그 조회 (getChatLog)

| 메소드 | 경로          | 짧은 설명     |
| ------ | ------------- | ------------- |
| POST   | /get_chat_log | 채팅로그 조회 |

- 사용자의 통채로 저장된 채팅기록을 가져오는 API, 동시에 접속 종료와 접속 끊김에 대한 판별도 수행한다.
- - 현재 시간과 사용자의 마지막 기록 시간을 비교하여, 차이가 10분 이상일시, 접속 종료로 판단하고, 새 시나리오 시작을 위해, scenario와 state을 100, init으로 업데이트 한다.(disconn_type: 'permanent' return)
- - 차이가 10분 이하일시 접속 끊김으로 판단하고, 이전 시나리오에서 이어서 진행하게 한다.(disconn_type: 'temporary' return)


#### Request Header

```
{ 'content-type': 'application/json' }
```

#### Request Body

```
{
      "email": "c@d.com"
}
```

#### Response Body

**success**

```
{
    "success": true,
    "message": null,
    "disconn_type": "temporary"
}
```

**Internal Server or DB error**

```
{
	"success": "false", 
	"message": "Internal Server or Database Error. err: " + err.message
}
```





