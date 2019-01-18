# 유저상태 업데이트 (updateState)

| 메소드 | 경로          | 짧은 설명         |
| ------ | ------------- | ----------------- |
| POST   | /update_state | 유저상태 업데이트 |

- 시나리오의 flow를 담당하는, User 테이블의 scenario, state 칼럼을 같이 업데이트 시키는 API


#### Request Header

```
{ 'content-type': 'application/json' }
```

#### Request Body

```
{
      "kakao_id": "4OUiLgza_oAvKaaJAAAA",
      "scenario": "100",
      "state": "init"
}
```

#### Response Body

**success**

```
{
    "success": true,
    "message": "User State Update complete."
}
```

**Internal Server or DB error**

```
{
	"success": "false", 
	"message": "Internal Server or Database Error. err: " + err.message
}
```





