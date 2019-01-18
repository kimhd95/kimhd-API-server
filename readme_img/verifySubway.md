# 지하철 존재여부 확인 (verifySubway)

| 메소드 | 경로           | 짧은 설명            |
| ------ | -------------- | -------------------- |
| POST   | /verify_subway | 지하철 존재여부 확인 |

- 사용자의 지하철 선택 입력을 받아서, DB내에 존재하는 지하철 여부임을 판단하는 API


#### Request Header

```
{ 'content-type': 'application/json' }
```

#### Request Body

```
{
      "subway": "강남역"
}
```

#### Response Body

**success**

```
{
    "result": "success"
}
```

**Internal Server or DB error**

```
{
	"success": "false", 
	"message": "Internal Server or Database Error. err: " + err.message
}
```





