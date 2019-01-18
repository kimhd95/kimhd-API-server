# 회원정보 업데이트 (updateUser)

| 메소드 | 경로         | 짧은 설명         |
| ------ | ------------ | ----------------- |
| POST   | /update_user | 회원정보 업데이트 |

request body에 따라, User 테이블의 칼럼들을 Update 하는 API 이다.

#### Request Header

```
{ 'content-type': 'application/json' }
```

#### Request Body

```
{
      "apikey": "9Y3-7bE-Ud3-7Ja",
      "kakao_id": "1DaEbbdEB4L5nFEvAAAC",
      "subway": "강남역"
}
```

#### Response Body

**success**

```
{
    "success": true,
    "message": "user data updated. Result info: Rows matched: 1  Changed: 0  Warnings: 0"
}
```

**Internal Server or DB error**

```
{
	"success": "false", 
	"message": "Internal Server or Database Error. err: " + err.message
}
```





