# 지하철 선택 기록 자동완성 조회 (getSubwayListHistory)

| 메소드 | 경로                     | 짧은 설명                      |
| ------ | ------------------------ | ------------------------------ |
| GET    | /get_subway_list_history | 지하철 선택 기록 자동완성 조회 |

![history_autocomplete](./history_autocomplete.png)
- 지하철 선택의 자동완성에서, 유저가 아무것도 입력하지 않았을 때, 기본 자동완성으로 유저의 최근 지하철 선택 기록을 보여주는 API
- Decide_history 테이블에서 사용자에 따른 지하철 검색 기록과 날짜를 불러온 후, 마지막 5개를 배열에 담아서 return 한다.(동일 지하철은 최신 날짜 하나만 선택)


#### Request Querystring

```
email={email}
```

#### Response Body

**success**

```
[
    {
        "subway": "홍대입구역",
        "date": "12.10"
    },
    {
        "subway": "잠실역",
        "date": "12.17"
    },
    {
        "subway": "성수역",
        "date": "12.18"
    },
    {
        "subway": "건대입구역",
        "date": "12.20"
    },
    {
        "subway": "강남역",
        "date": "01.18"
    }
]
```

**Internal Server or DB error**

```
{
	"success": "false", 
	"message": "Internal Server or Database Error. err: " + err.message
}
```





