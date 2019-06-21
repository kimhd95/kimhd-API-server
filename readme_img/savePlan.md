# 여행챗봇 Plan 저장 (savePlan)

| 메소드 |    경로    | 짧은 설명          |
| ------ | --------- | ----------------- |
| POST   | /save_plan | 여행챗봇 Plan 저장 |


#### Request Header

```
{ 'content-type': 'application/json' }
```

#### Request Body

```
{
      "name",
      "password",
      "plan_type"
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
