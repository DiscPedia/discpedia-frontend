# AI 채팅 API 연동 계약 초안

현재 프론트엔드는 아래 계약을 기준으로 구현되어 있습니다. 실제 백엔드 경로가 다르면
`VITE_AI_CHAT_ENDPOINT` 환경 변수로 변경할 수 있습니다.

## 요청

`POST /api/v1/ai/chat`

```json
{
  "message": "비 오는 날 듣기 좋은 국내 인디 LP 추천해줘",
  "conversationId": "optional-conversation-id"
}
```

- `Authorization: Bearer <accessToken>` 헤더를 사용합니다.
- 첫 요청에서는 `conversationId`를 생략하고, 이후 요청에서는 서버가 반환한 값을 다시 보냅니다.
- 사용자가 새 대화를 누르면 프론트가 기존 `conversationId`를 버립니다.

## 일반 JSON 응답

프로젝트의 공통 응답 래퍼를 사용하는 형태를 권장합니다.

```json
{
  "success": true,
  "message": "OK",
  "data": {
    "conversationId": "conversation-123",
    "content": "잔잔하지만 기타 톤이 살아 있는 앨범을 골랐어요.",
    "recommendations": [
      {
        "aladinItemId": 123456,
        "title": "비적응",
        "artistName": "새소년",
        "reason": "실리카겔과 결이 비슷한 기타 사운드예요.",
        "mediaType": "LP",
        "price": 46500,
        "coverImageUrl": "https://example.com/cover.jpg"
      }
    ]
  },
  "timestamp": "2026-09-30T00:00:00Z"
}
```

`aladinItemId`는 추천 카드를 기존 음반 상세 화면과 연결하는 키이므로 포함하는 것이 좋습니다.

## 스트리밍 응답

긴 응답의 체감 속도를 높이려면 같은 요청에서 `Content-Type: text/event-stream`을 반환할 수
있습니다. 프론트는 `data:` 행의 `delta`, `token`, `text` 또는 `content` 문자열을 순서대로
이어 붙입니다. 마지막 이벤트에는 `conversationId`와 `recommendations`를 함께 내려줄 수
있습니다.

```text
data: {"delta":"잔잔하지만 "}

data: {"delta":"기타 톤이 살아 있는 앨범을 골랐어요."}

data: {"conversationId":"conversation-123","recommendations":[...]}

data: [DONE]
```

## 백엔드에서 함께 정하면 좋은 항목

- 대화 저장 기간과 최대 문맥 길이
- 한 사용자당 요청 횟수 제한과 `429` 응답 규칙
- AI 타임아웃, 모델 오류, 유해 요청 등에 대한 오류 코드
- 추천 결과가 없을 때의 빈 배열 처리
- 클라이언트 연결 종료 시 생성 작업을 취소할지 여부
- 사용자 컬렉션·리뷰를 AI 모델로 보낼 때의 개인정보 처리 범위
