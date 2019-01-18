# 지하철 자동완성 검색 (getAllSubway)

| 메소드 | 경로            | 짧은 설명            |
| ------ | --------------- | -------------------- |
| GET    | /get_all_subway | 지하철 자동완성 검색 |

![chosung_autocomplete](./chosung_autocomplete.png)
- 지하철 선택의 자동완성을 담당하는 API 
- 사용자가 문자를 입력할 때 마다, term이 query 값으로 넘어오게 된다.
- 이 query값과, 현재 restaurant 테이블의 모든 subway 칼럼을 검색해서 비교를 한 후, 알맞은 결과 값을 배열로 return 한다.
- Hangul.js를 이용해서, term이 초성으로 넘어와도 똑같이 검색이 가능하게 하였다.

> 정식버젼이 아닌, 유저가 수정한 버젼을 사용하였다.
>
> Hangul.js 초성 검색 가능 버젼
>
> <https://github.com/g1s/Hangul.js>


#### Request Querystring

```
term=ㄱㄴ
```

#### Response Body

**success**

```
[
    "강남역"
]
```

**Internal Server or DB error**

```
{
	"success": "false", 
	"message": "Internal Server or Database Error. err: " + err.message
}
```





