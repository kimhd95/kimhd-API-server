# 슐랭가이드 목록 조회 (getChelinguideList)

| 메소드 |        경로            | 짧은 설명           |
| ------ | --------------------- | ------------------ |
| POST   | /get_chelingiude_list | 슐랭가이드 목록 조회 |


#### Request Header

```
{ 'content-type': 'application/json' }
```

#### Request Body

```
{
      "apikey": "9Y3-7bE-Ud3-7Ja",
      "user_id",
      "subway",
      "sortby"
}
```

#### Response Body

**success**

```
{
    "success": true,
    "num": <슐랭가이드 아이템 개수>,
    "message": <슐랭가이드 아이템 목록>
}
```

**Internal Server or DB error**

```
{
	"success": "false",
	"message": "Internal Server or Database Error. err: " + err.message
}
```
