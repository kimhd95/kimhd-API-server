# 슐랭가이드 항목 수정 (modifyChelinguideItem)

| 메소드 |           경로            | 짧은 설명           |
| ------ | ------------------------ | ------------------ |
| POST   | /modify_chelingiude_item | 슐랭가이드 항목 수정 |


#### Request Header

```
{ 'content-type': 'application/json' }
```

#### Request Body

```
{
      "apikey": "9Y3-7bE-Ud3-7Ja",
      "id",
      "user_id",
      "res_name",
      "region",
      "subway",
      "rating",
      "comment",
      "mood",
      "price",
      "img_urls"
}
```

#### Response Body

**success**

```
{
    "success": true,
}
```

**Internal Server or DB error**

```
{
	"success": "false",
	"message": "Internal Server or Database Error. err: " + err.message
}
```
