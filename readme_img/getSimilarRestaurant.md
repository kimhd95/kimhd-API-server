# 비슷한 음식점 조회 (getSimilarRestaurant)

| 메소드 |            경로          | 짧은 설명         |
| ------ | ----------------------- | ---------------- |
| POST   | /get_similar_restaurant | 비슷한 음식점 조회 |


#### Request Header

```
{ 'content-type': 'application/json' }
```

#### Request Body

```
{
      "rest"
}
```

#### Response Body

**success**

```
{
    "success": true,
    "message": [{
        "id",
        "region",
        "res_name",
        "subway",
        "exit_quarter",
        "food_type",
        "food_name",
        "mood",
        "lunch_option",
        "taste",
        "mood2",
        "price_lunch",
        "price_dinner",
        "drink_type",
        "drink_round",
        "phone",
        "address",
        "open_mf",
        "close_mf",
        "open_sat",
        "close_sat",
        "open_sun",
        "close_sun",
        "holiday",
        "last_order",
        "etc",
        "closedown",
        "food_inre",
        "food_cost",
        "res_size",
        "calories",
        "res_phone",
        "lat",
        "lng",
      }...]
}
```

**no result**

```
{
    "success": false,
    "message": "no result"
}
```

**Internal Server or DB error**

```
{
	"success": "false",
	"message": "Internal Server or Database Error. err: " + err.message
}
```
