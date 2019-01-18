# 선택제한 업데이트 (updateLimitCnt)

| 메소드 | 경로              | 짧은 설명         |
| ------ | ----------------- | ----------------- |
| POST   | /update_limit_cnt | 선택제한 업데이트 |

- 기본값 0에서, '메뉴 고르기' 시나리오를 수행할 때 마다, 조건에 따라 1씩 증가시키는 API

  > verifyLimit 참고

  - 요청된 limit_cnt가 1인 경우
  - - 처음 시작하는 경우이므로, decide_updated_at을 현재 시간으로 함께 업데이트 시킨다.
  - 요청된 limit_cnt가 1이 아닌 경우
  - - 처음 시작하는 경우가 아니므로, limit_cnt만 업데이트 시킨다.

#### Request Header

```
{ 'content-type': 'application/json' }
```

#### Request Body

```
{
      "kakao_id": "4OUiLgza_oAvKaaJAAAA",
      "limit_cnt": "4"
}
```

#### Response Body

**success**

```
{
    "success": true,
    "message": "updateLimitCnt Update complete."
}
```

**Internal Server or DB error**

```
{
	"success": "false", 
	"message": "Internal Server or Database Error. err: " + err.message
}
```





