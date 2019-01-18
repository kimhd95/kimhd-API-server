# 추천 음식점 조회 (getRestaurant)

| 메소드 | 경로            | 짧은 설명        |
| ------ | --------------- | ---------------- |
| POST   | /get_restaurant | 추천 음식점 조회 |

- food-chatbot의 마지막 시나리오에 사용되는 주 API로서, 사용자가 선택한 조건에 따라, 알맞은 음식점 두 곳을 선택해준다.
- - FULL-TEXT-SEARCH 방식으로 쿼리를 작성하였으며, 시나리오상의 **'상관없음'**, **'~ 빼고'** 를 선택한 경우를 고려하여 각 쿼리문 앞에 NOT을 판단하는 변수를 두어, 예외처리를 할 수 있게 하였다.
- 만약 첫번째  쿼리에서 결과가 2개가 안나올 시, 출구(exit_quarter)를 전체로 두고 다시 검색해서 결과를 return 한다.
- **try** 값으로, 첫 번째 만에 2곳이 나왔는지, 두 번째에 2곳이 나왔는지를 구분한다.

#### Request Header

```
{ 'content-type': 'application/json' }
```

#### Request Body

```
{
      "apikey": "9Y3-7bE-Ud3-7Ja",
      "kakao_id": "1DaEbbdEB4L5nFEvAAAC",
      "subway": "강남역",
      "exit_quarter": "1,2,3,4",
      "mood": "약속",
      "mood2": "프랜차이즈",
      "taste": "기름진",
      "food_type": "한식"
}
```

#### Response Body

**success**

```
{
    "success": true,
    "try": 1,
    "message": [
        {
            "id": 2410,
            "region": "서울",
            "res_name": "육전식당 4호점",
            "subway": "강남역",
            "exit_quarter": 4,
            "food_type": "한식",
            "food_name": "삼겹살, 목살",
            "mood": "약속",
            "lunch_option": 1,
            "taste": "기름진,고기,바비큐",
            "mood2": "향토적인,프랜차이즈",
            "drink_type": "소주",
            "drink_round": "1,2",
            "food_ingre": null,
            "food_cost": null,
            "res_size": null,
            "calories": null,
            "res_phone": null,
            "closedown": 0
        },
        {
            "id": 2474,
            "region": "서울",
            "res_name": "고수닭갈비 강남2호점",
            "subway": "강남역",
            "exit_quarter": 2,
            "food_type": "한식",
            "food_name": "닭갈비",
            "mood": "캐주얼,약속",
            "lunch_option": 1,
            "taste": "기름진,치즈,자극적인,매운,밥,고기",
            "mood2": "향토적인,프랜차이즈",
            "drink_type": "소주",
            "drink_round": "1",
            "food_ingre": null,
            "food_cost": null,
            "res_size": null,
            "calories": null,
            "res_phone": null,
            "closedown": 0
        }
    ]
}
```

**no result**

```
{
    "success": false,
    "message": "no result."
}
```

**Internal Server or DB error**

```
{
	"success": "false", 
	"message": "Internal Server or Database Error. err: " + err.message
}
```





