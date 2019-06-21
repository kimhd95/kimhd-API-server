# 슐랭가이드 항목 정보 조회 (getChelinguideItemInfo)

| 메소드 |        경로            | 짧은 설명           |
| ------ | --------------------- | ------------------ |
| POST   | /get_chelingiude_item_info | 슐랭가이드 항목 정보 조회 |


#### Request Header

```
{ 'content-type': 'application/json' }
```

#### Request Body

```
{
      "apikey": "9Y3-7bE-Ud3-7Ja",
      "id",
      "user_id"
}
```

#### Response Body

**success**

```
{
    "success": true,
    "message": {
      "id",
      "user_id",
      "rating",
      "comment",
      "res_id",
      "res_name",
      "res_region",
      "res_subway",
      "res_mood",
      "res_food_type",
      "res_food_name",
      "res_price",
      "created_at",
      "updated_at",
      "res_image1",
      "res_image2",
      "res_image3",
      "res_image4",
      "res_image5"
    }
}
```

**Internal Server or DB error**

```
{
	"success": "false",
	"message": "Internal Server or Database Error. err: " + err.message
}
```
