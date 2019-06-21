# 여행챗봇 Plan 조회 (searchPlan)

| 메소드 |     경로     | 짧은 설명          |
| ------ | ----------- | ----------------- |
| POST   | /search_plan | 여행챗봇 Plan 조회 |


#### Request Header

```
{ 'content-type': 'application/json' }
```

#### Request Body

```
{
      "name",
      "password",
}
```

#### Response Body

**success**

```
{
    "success": true,
    "message": {
      "name",
      "password",
      "plan_type"
    }
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
