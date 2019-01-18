# 선택기록 생성 (createDecideHistory)

| 메소드 | 경로                   | 짧은 설명     |
| ------ | ---------------------- | ------------- |
| POST   | /create_decide_history | 선택기록 생성 |

- 사용자가 음식점 최종 선택을 할 때, 그 기록을 저장하는 API로서, 최종후보 2곳, 우승 음식점 이름, 지하철역, 선택 날짜를 년도-달-일 로 저장시킨다.

#### Request Header

```
{ 'content-type': 'application/json' }
```

#### Request Body

```
{
      "kakao_id": "r91PIeFjeOBihLfAAAAM",
      "rest1": "2409",
      "rest2": "2408",
      "rest_winner": "2408",
      "res_name": "블루밍가든",
      "subway": "강남역"
}
```

#### Response Body

**success**

```
{
    "success": true,
    "message": "DecideHistory Update complete."
}
```

**Internal Server or DB error**

```
{
	"success": "false", 
	"message": "Internal Server or Database Error. err: " + err.message
}
```





