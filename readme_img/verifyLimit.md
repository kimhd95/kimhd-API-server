# 선택제한 여부 확인 (verifyLimit)

| 메소드 | 경로          | 짧은 설명          |
| ------ | ------------- | ------------------ |
| POST   | /verify_limit | 선택제한 여부 확인 |

- food-chatbot은 '메뉴 고르기' 를 30분 당 5번만 이용할 수 있다. 그 여부를 판단하는 API

- User 테이블의 limit_cnt와, decided_updated_at 칼럼을 이용해서 여부를 판단한다.

  - limit_cnt의 기본값은 0으로, 한번 '메뉴 고르기' 시나리오를 수행할 때 마다, updateLimitCnt API의 조건에 따라 1씩 증가하고, 조건에 따라 decided_updated_at가 업데이트된다.(moment 모듈 사용)

  - > updateLimitCnt 참고

- 판별 경우의 수

- - 음식점 선택 횟수(limit_cnt)가 5일때

  - - 마지막 선택 시간으로부터 30분이 지나면,
    - - 음식점 선택 횟수(limit_cnt)를 0으로 초기화하고 시나리오 진행 가능(success)
    - 마지막 선택 시간으로부터 30분이 지나지 않았으면,
    - - 시나리오 진행 불가(failed)

  - 음식점 선택 횟수(limit_cnt)가 5가 아닐 때,

  - - 마지막 선택 시간으로부터 30분이 지나면,

    - - 음식점 선택 횟수를 0으로 초기화하고 시나리오 진행 가능(success)

      - > 이전 30분에 대한 조건은 끝났으므로, 다시 30분을 카운트 하기 위함.

    - 마지막 선택 시간으로부터 30분이 지나지 않았으면,

    - - 시나리오 진행 가능(success)

#### Request Header

```
{ 'content-type': 'application/json' }
```

#### Request Body

```
{
      "kakao_id": "4OUiLgza_oAvKaaJAAAA",
      "limit_cnt": "2",
      "decide_updated_at": "2019-01-16T12:41:44+09:00"
}
```

#### Response Body

**success**

```
{
    "result": "success"
}
```

**Internal Server or DB error**

```
{
	"success": "false", 
	"message": "Internal Server or Database Error. err: " + err.message
}
```





