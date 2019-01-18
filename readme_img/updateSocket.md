# 소켓정보 업데이트 (updateSocket)

| 메소드 | 경로           | 짧은 설명         |
| ------ | -------------- | ----------------- |
| POST   | /update_socket | 소켓정보 업데이트 |

- 사용자의 접속 종료와, 접속 끊김을 대비하여, 로그인에 따른 시나리오 유지를 위한 API. 
- 접속 때마다 웹소켓은 매번 변경되므로, 새로 접속 시 인식된 웹소켓을 User 테이블에 업데이트시켜준다.
- **getChatLog 의 접속 끊김/종료 판단을 위해, silent 옵션을 적용하여 updated_at timestamp에 영향을 주지 않게 하였다.**

#### Request Header

```
{ 'content-type': 'application/json' }
```

#### Request Body

```
{
      "email": "c@d.com",
      "socket_id": "1DaEbbdEB4L5nFEvAAAC"
}
```

#### Response Body

**success**

```
{
    "success": true,
    "message": "User Socket Update complete.",
    "email": "c@d.com"
}
```

**Internal Server or DB error**

```
{
	"success": "false", 
	"message": "Internal Server or Database Error. err: " + err.message
}
```





