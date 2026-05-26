## 0. 프로젝트 개요

### 프로젝트명

**마음의 날씨**

---

### 서비스 한 줄 소개

**마음의 날씨는 사용자의 하루 기억을 날짜별 공간으로 저장하고, 그 기억을 날씨·조명·색감·사물로 표현하는 감성 기록 서비스입니다.**

---

### 서비스 핵심 문장

> 마음의 날씨는 일기를 글 목록으로 저장하는 서비스가 아니라,
> 
> 
> 기억이 머무는 방으로 다시 돌아가게 해주는 서비스입니다.
> 

---

### 핵심 컨셉

사용자는 특정 날짜에 하나의 기억을 남깁니다.

그 기억은 AI 또는 Mock 분석을 통해 다음 요소로 변환됩니다.

- 날씨
- 조명
- 색감
- 방 제목
- 사물

그리고 사용자는 시간이 지난 뒤에도 캘린더에서 날짜를 선택해

그날의 방과 기억을 다시 확인할 수 있습니다.

---

# 1. 요구사항 명세서

## 1-1. 사용자 유형

| 사용자 유형 | 설명 |
| --- | --- |
| 비회원 | 서비스 소개 화면 확인 가능 |
| 회원 | 로그인 후 개인 방, 기록 작성, 날짜별 방 확인 가능 |
| 관리자 | MVP에서는 제외. 추후 신고 관리, 사용자 관리 가능 |

MVP 기준에서는 **관리자 기능은 제외**합니다.

---

## 1-2. 핵심 기능 목록

| 구분 | 기능명 | 우선순위 | MVP 포함 |
| --- | --- | --- | --- |
| 인증 | 회원가입 | 상 | 포함 |
| 인증 | 로그인 | 상 | 포함 |
| 인증 | 로그아웃 | 중 | 포함 |
| 방 | 개인 방 조회 | 상 | 포함 |
| 방 | 월별 방 조회 | 상 | 포함 |
| 기록 | 날짜 선택 | 상 | 포함 |
| 기록 | 날짜별 기억 작성 | 상 | 포함 |
| 기록 | 날짜별 기억 조회 | 상 | 포함 |
| 기록 | 날짜별 기억 수정 | 중 | 선택 |
| 기록 | 날짜별 기억 삭제 | 중 | 선택 |
| AI | 분위기 분석 | 상 | 포함 |
| AI | Mock 분석 | 상 | 포함 |
| 연출 | 날씨 변화 | 상 | 포함 |
| 연출 | 조명 변화 | 상 | 포함 |
| 연출 | 색감 변화 | 상 | 포함 |
| 사물 | 사물 자동 생성 | 상 | 포함 |
| 사물 | 사물과 글 연결 | 상 | 포함 |
| 사물 | 사물 클릭 시 기억 확인 | 상 | 포함 |
| 아카이브 | 월별 기록 조회 | 중 | 포함 |
| 아카이브 | 월별 방 아카이브 | 중 | 포함 |
| 확장 | 공동 방 | 하 | 제외 또는 발표 확장 |
| 확장 | 우편함 | 하 | 제외 |
| 확장 | 음악 재생 | 하 | 선택 |
| 확장 | 방 스냅샷 저장 | 하 | 선택 |

---

## 1-3. 기능 요구사항 상세

---

## A. 회원가입

### 기능 설명

사용자는 이메일, 비밀번호, 닉네임을 입력하여 회원가입할 수 있습니다.

### 입력 항목

| 항목 | 필수 여부 | 조건 |
| --- | --- | --- |
| 이메일 | 필수 | 이메일 형식 |
| 비밀번호 | 필수 | 8자 이상 권장 |
| 비밀번호 확인 | 필수 | 비밀번호와 일치 |
| 닉네임 | 필수 | 2~12자 |

### 처리 흐름

1. 사용자가 회원가입 정보를 입력한다.
2. 프론트에서 기본 유효성 검사를 수행한다.
3. 백엔드로 회원가입 요청을 보낸다.
4. 서버에서 이메일 중복 여부를 확인한다.
5. 비밀번호를 암호화하여 저장한다.
6. 회원가입 성공 응답을 반환한다.
7. 사용자는 로그인 화면으로 이동한다.

### 예외 상황

| 상황 | 처리 |
| --- | --- |
| 이메일 형식 오류 | “올바른 이메일 형식이 아닙니다.” |
| 이메일 중복 | “이미 사용 중인 이메일입니다.” |
| 비밀번호 불일치 | “비밀번호가 일치하지 않습니다.” |
| 닉네임 공백 | “닉네임을 입력해주세요.” |

---

## B. 로그인

### 기능 설명

사용자는 이메일과 비밀번호로 로그인할 수 있습니다.

### 처리 흐름

1. 사용자가 이메일과 비밀번호를 입력한다.
2. 백엔드로 로그인 요청을 보낸다.
3. 서버가 회원 정보를 검증한다.
4. 인증 성공 시 JWT 토큰을 발급한다.
5. 프론트는 토큰을 저장한다.
6. 개인 방 화면으로 이동한다.

### 예외 상황

| 상황 | 처리 |
| --- | --- |
| 이메일 없음 | “가입되지 않은 이메일입니다.” |
| 비밀번호 오류 | “비밀번호가 올바르지 않습니다.” |
| 토큰 만료 | 로그인 화면으로 이동 |

---

## C. 개인 방 조회

### 기능 설명

로그인한 사용자는 자신의 월별 방을 확인할 수 있습니다.

### 기본 화면 구성

- 상단: 프로젝트명 / 현재 월 / 사용자 메뉴
- 좌측: 캘린더
- 중앙: 방 화면
- 우측: 선택 날짜의 기억 카드
- 하단: 기록 작성 버튼

### 방 구성 요소

| 요소 | 설명 |
| --- | --- |
| 창문 | 날씨 효과 표시 |
| 벽 | 색감, 포스터, 장식 표시 |
| 바닥 | 러그, 신발, 식물 등 배치 |
| 조명 | 조명 색상 및 밝기 표현 |
| 책상 | 라디오, 컵, 책 등 배치 |
| 사물 슬롯 | 기록과 연결된 사물 위치 |
| 기억 카드 | 선택 날짜의 글 표시 |

---

## D. 날짜 선택

### 기능 설명

사용자는 캘린더에서 날짜를 선택할 수 있습니다.

### 날짜 상태

| 상태 | 설명 |
| --- | --- |
| 오늘 | 오늘 날짜 강조 |
| 과거 날짜 | 선택 가능 |
| 미래 날짜 | 선택 불가 |
| 기록 있음 | 작은 점 또는 아이콘 표시 |
| 선택 날짜 | 테두리 또는 배경 강조 |

### 규칙

- 오늘 날짜 작성 가능
- 과거 날짜 작성 가능
- 미래 날짜 작성 불가
- 하나의 날짜에는 하나의 기억만 작성 가능
- 이미 기록한 날짜는 중복 작성 불가

---

## E. 날짜별 기억 작성

### 기능 설명

사용자는 특정 날짜에 하루의 기억을 작성할 수 있습니다.

### 입력 항목

| 항목 | 필수 여부 | 설명 |
| --- | --- | --- |
| 날짜 | 필수 | 캘린더에서 선택 |
| 기억 내용 | 필수 | 사용자가 작성한 글 |
| 사물 선택 | 선택 | MVP에서는 자동 추천 가능 |

### 작성 조건

| 조건 | 설명 |
| --- | --- |
| 미래 날짜 금지 | 오늘 이후 날짜는 작성 불가 |
| 중복 날짜 금지 | 같은 날짜에는 하나의 기억만 가능 |
| 글자 수 제한 | 10~500자 권장 |
| 로그인 필수 | 비로그인 사용자는 작성 불가 |

### 처리 흐름

1. 사용자가 날짜를 선택한다.
2. 기록 작성 모달을 연다.
3. 사용자가 기억을 작성한다.
4. 서버에 작성 요청을 보낸다.
5. 서버가 날짜 유효성을 검사한다.
6. 서버가 AI 분석 또는 Mock 분석을 수행한다.
7. 분석 결과를 바탕으로 기억 데이터를 저장한다.
8. 방 화면이 해당 분위기로 변경된다.
9. 사물이 방에 추가된다.

---

## F. AI 분위기 분석

### 기능 설명

사용자의 글을 감정으로 직접 진단하지 않고,

방을 꾸미기 위한 분위기 정보로 변환합니다.

OpenAI API를 사용할 경우, 분석 결과는 자유 텍스트보다 JSON Schema 기반의 구조화된 출력으로 받는 것이 좋습니다. OpenAI의 Structured Outputs는 모델 응답이 개발자가 제공한 JSON Schema를 따르도록 하는 기능으로 설명되어 있어, `mood`, `weather`, `lighting` 같은 고정 필드를 받아야 하는 이 프로젝트에 적합합니다.

### 입력 예시

```
오늘은 이상하게 비 오는 냄새가 좋았다.
```

### 출력 예시

```
{
  "roomTitle":"비 냄새가 남은 저녁",
  "mood":"quiet",
  "weather":"rain",
  "lighting":"blue_dim",
  "palette":"blue_gray",
  "objectKey":"window_chair",
  "slotKey":"window",
  "message":"창가에 조용한 기억이 남았습니다."
}
```

### 분석 기준

| mood | 의미 | 날씨 | 조명 | 색감 | 추천 사물 |
| --- | --- | --- | --- | --- | --- |
| quiet | 고요한 기억 | rain | blue_dim | blue_gray | window_chair |
| warm | 따뜻한 기억 | sunny | warm_light | cream_yellow | small_plant |
| longing | 그리운 기억 | sunset | orange_dim | orange_brown | old_radio |
| uneasy | 흐린 기억 | cloudy | flicker | gray_blue | desk_lamp |

### 중요한 UX 규칙

화면에는 다음 표현을 사용하지 않습니다.

- “당신은 우울합니다.”
- “불안 수치 80%”
- “외로움 감정으로 분석되었습니다.”

대신 다음처럼 표현합니다.

- “창가에 조용한 기억이 남았습니다.”
- “오늘의 방에 비가 내립니다.”
- “조명이 조금 낮아졌습니다.”
- “비 냄새가 남은 저녁”

---

## G. 방 분위기 변화

### 기능 설명

AI 분석 결과에 따라 방의 시각 상태가 변경됩니다.

### 변경 요소

| 요소 | 설명 |
| --- | --- |
| 날씨 | 창밖 비, 햇빛, 노을, 흐림 |
| 조명 | 푸른 조명, 따뜻한 조명, 주황 조명, 흔들림 |
| 색감 | 전체 방 팔레트 변경 |
| 사물 | 기억과 연결된 오브젝트 추가 |
| 방 제목 | AI가 생성한 제목 표시 |

### 연출 예시

사용자 글:

```
오늘은 이상하게 비 오는 냄새가 좋았다.
```

결과:

- 방 제목: 비 냄새가 남은 저녁
- 날씨: 비
- 조명: 푸른 조명
- 색감: 푸른 회색
- 사물: 창가 의자

## H. 사물 시스템

### 기능 설명

사물은 단순 장식이 아니라 기억 저장 매체입니다.

각 사물은 하나의 날짜 기록과 연결됩니다.

### 사물 예시

| objectKey | 이름 | 슬롯 | 연결 분위기 |
| --- | --- | --- | --- |
| window_chair | 창가 의자 | window | quiet |
| small_plant | 작은 식물 | floor | warm |
| old_radio | 오래된 라디오 | desk | longing |
| desk_lamp | 스탠드 조명 | desk | uneasy |
| mug_cup | 머그컵 | desk | warm |
| letter | 편지 | wall | longing |
| poster | 포스터 | wall | warm |
| rug | 러그 | floor | quiet |

### 사물 클릭 시 표시 정보

```
2026.06.14

비 냄새가 남은 저녁

오늘은 이상하게 비 오는 냄새가 좋았다.
```

### MVP 배치 방식

자유 드래그는 제외합니다.

대신 슬롯형 배치를 사용합니다.

| 슬롯 | 배치 가능 사물 |
| --- | --- |
| window | 창가 의자 |
| desk | 라디오, 머그컵, 스탠드 |
| wall | 포스터, 편지 |
| floor | 식물, 러그 |
| light | 조명 |

---

## I. 월별 아카이브

### 기능 설명

한 달 단위로 방이 관리됩니다.

예:

```
2026년 6월의 마음의 날씨
2026년 7월의 마음의 날씨
```

### 처리 방식

- 사용자가 6월 기록을 작성하면 6월 방에 사물이 쌓임
- 7월이 되면 7월 방이 새로 시작됨
- 6월 방은 삭제되지 않고 아카이브됨
- 사용자는 이전 월을 선택해 과거 방을 볼 수 있음

### MVP 구현 방식

방 스냅샷 이미지를 실제 저장하지 않아도 됩니다.

대신 다음 데이터를 기반으로 방을 다시 렌더링합니다.

- 해당 월의 기록 목록
- 각 기록의 날짜
- 날씨
- 조명
- 사물
- 슬롯

---

# 2. 구성

## 2-1. 전체 시스템 구성

```
[사용자 브라우저]
        |
        | HTTPS
        v
[AWS Amplify - Frontend]
        |
        | REST API 요청
        v
[AWS Elastic Beanstalk - Backend]
        |
        | JDBC / JPA
        v
[AWS RDS MySQL - Database]

[Backend]
   |
   | 필요 시
   v
[OpenAI API 또는 Mock Analyzer]
```

---

## 2-2. 웹 UI 구성

### 페이지 구조

| 경로 | 화면명 | 설명 |
| --- | --- | --- |
| `/` | 랜딩 페이지 | 서비스 소개 |
| `/login` | 로그인 | 이메일/비밀번호 로그인 |
| `/signup` | 회원가입 | 회원가입 |
| `/room` | 개인 방 | 메인 서비스 화면 |
| `/archive` | 월별 아카이브 | 과거 월별 방 확인 |
| `/profile` | 프로필 | 닉네임, 로그아웃 |

---

## 2-3. 주요 컴포넌트 구성

```
src/
 ┣ components/
 ┃ ┣ layout/
 ┃ ┃ ┣ Header.tsx
 ┃ ┃ ┣ Sidebar.tsx
 ┃ ┃ ┗ PageContainer.tsx
 ┃ ┣ auth/
 ┃ ┃ ┣ LoginForm.tsx
 ┃ ┃ ┗ SignupForm.tsx
 ┃ ┣ calendar/
 ┃ ┃ ┣ MemoryCalendar.tsx
 ┃ ┃ ┗ CalendarDayCell.tsx
 ┃ ┣ room/
 ┃ ┃ ┣ RoomView.tsx
 ┃ ┃ ┣ RoomWindow.tsx
 ┃ ┃ ┣ WeatherEffect.tsx
 ┃ ┃ ┣ LightingOverlay.tsx
 ┃ ┃ ┣ RoomObject.tsx
 ┃ ┃ ┗ ObjectSlot.tsx
 ┃ ┣ memory/
 ┃ ┃ ┣ MemoryWriteModal.tsx
 ┃ ┃ ┣ MemoryCard.tsx
 ┃ ┃ ┗ MemoryDetailModal.tsx
 ┃ ┗ archive/
 ┃   ┗ MonthlyArchiveList.tsx
 ┣ pages 또는 app/
 ┣ api/
 ┣ hooks/
 ┣ stores/
 ┣ types/
 ┣ utils/
 ┗ constants/
```

---

## 2-4. UI 화면 상세

## A. 랜딩 페이지

### 목적

서비스의 감성을 전달하고 로그인/회원가입으로 유도합니다.

### 주요 문구

```
오늘의 기억은 어떤 날씨로 남을까요?

마음의 날씨는 하루의 기억을
날씨와 조명, 사물로 보관하는 감성 기록 서비스입니다.
```

### 버튼

- 로그인
- 회원가입
- 시작하기

---

## B. 로그인 화면

### 구성

- 이메일 입력
- 비밀번호 입력
- 로그인 버튼
- 회원가입 이동 링크

---

## C. 회원가입 화면

### 구성

- 이메일 입력
- 닉네임 입력
- 비밀번호 입력
- 비밀번호 확인
- 회원가입 버튼

---

## D. 개인 방 화면

### 레이아웃

```
┌──────────────────────────────────────┐
│ Header                               │
├──────────────┬───────────────────────┤
│ Calendar     │        Room           │
│              │                       │
│ 날짜 선택     │   날씨/조명/사물 표시    │
│              │                       │
├──────────────┴───────────────────────┤
│ Selected Memory Card / Write Button  │
└──────────────────────────────────────┘
```

### 방 화면 구성

- 방 제목
- 창문
- 날씨 효과
- 조명 효과
- 사물 슬롯
- 사물 클릭 이벤트
- 기록 작성 버튼

---

## E. 기록 작성 모달

### 문구

```
그날 마음에 남은 장면을 적어보세요.
길지 않아도 괜찮아요.
```

### 입력창 placeholder

```
오늘은 이상하게 비 오는 냄새가 좋았다.
```

### 버튼

- 취소
- 방에 남기기

---

## F. 기억 상세 모달

사물 클릭 시 표시합니다.

```
2026.06.14

비 냄새가 남은 저녁

오늘은 이상하게 비 오는 냄새가 좋았다.
```

---

## 2-5. DB 구성

DB는 **RDS MySQL** 기준으로 설계합니다.

### 핵심 테이블

| 테이블명 | 설명 |
| --- | --- |
| users | 사용자 |
| memory_entries | 날짜별 기억 |
| room_objects | 사물 카탈로그 |
| monthly_rooms | 월별 방 |
| object_slots | 슬롯 정의 |
| refresh_tokens | 로그인 유지용 토큰, 선택 |

---

# 3. 개발 환경

## 3-1. Frontend 개발 환경

| 항목 | 내용 |
| --- | --- |
| Language | TypeScript |
| Framework | React 또는 Next.js |
| Styling | Tailwind CSS |
| State | Zustand 또는 Context API |
| API 통신 | Axios 또는 Fetch |
| Build | Vite 또는 Next build |
| Deploy | AWS Amplify Hosting |

### 추천

학원 3주 프로젝트라면 **React + Vite + Tailwind** 조합이 가장 단순합니다.

Next.js를 이미 배웠다면 Next.js를 사용해도 됩니다.

## 3-2. Backend 개발 환경

| 항목 | 내용 |
| --- | --- |
| Language | Java |
| Framework | Spring Boot |
| ORM | Spring Data JPA |
| Security | Spring Security + JWT |
| DB | MySQL |
| Build | Gradle |
| Deploy | AWS Elastic Beanstalk |

---

## 3-3. Database 개발 환경

| 항목 | 내용 |
| --- | --- |
| Local DB | MySQL |
| Cloud DB | AWS RDS MySQL |
| Migration | 수동 SQL 또는 Flyway 선택 |
| ERD Tool | dbdiagram.io, ERDCloud, MySQL Workbench |

---

## 3-4. AI 개발 환경

| 항목 | 내용 |
| --- | --- |
| 방식 1 | OpenAI API |
| 방식 2 | Mock Analyzer |
| MVP 추천 | Mock 먼저 구현 후 API 연결 |

### Mock Analyzer 예시

```
if (content.contains("비")||content.contains("조용")) {
returnquietResult;
}

if (content.contains("따뜻")||content.contains("좋았다")) {
returnwarmResult;
}

if (content.contains("그립")||content.contains("생각났다")) {
returnlongingResult;
}

returnuneasyResult;
```

MVP에서는 처음부터 OpenAI API를 붙이기보다,

Mock 분석으로 방 변화 로직을 먼저 완성한 뒤 API를 연결하는 것이 안전합니다.

---

# 4. 배포 환경

## 4-1. 배포 구조

```
Frontend Repository
        |
        v
AWS Amplify
        |
        v
배포된 프론트 URL

Backend Repository
        |
        v
AWS Elastic Beanstalk
        |
        v
배포된 API 서버 URL

Database
        |
        v
AWS RDS MySQL
```

---

## 4-2. AWS Amplify 설정

### 사용 목적

프론트엔드 배포.

### 배포 대상

- React 앱
- Next.js 앱
- 정적 웹 앱

Amplify Hosting은 여러 SPA 프레임워크와 SSR 프레임워크를 지원하는 웹 앱 호스팅 서비스로 안내되어 있으며, Git 기반 배포 워크플로우와 CDN 배포를 제공하므로 프론트엔드 배포용으로 적합합니다.

### 환경 변수 예시

```
VITE_API_BASE_URL=https://api.maeum-weather.com
VITE_APP_NAME=마음의 날씨
```

Next.js를 사용할 경우:

```
NEXT_PUBLIC_API_BASE_URL=https://api.maeum-weather.com
NEXT_PUBLIC_APP_NAME=마음의 날씨
```

---

## 4-3. Elastic Beanstalk 설정

### 사용 목적

백엔드 API 서버 배포.

Elastic Beanstalk는 애플리케이션과 환경 단위로 웹 앱을 관리하며, 환경은 애플리케이션을 실행하는 인프라 구성으로 이해할 수 있습니다. 공식 문서에서는 Beanstalk가 EC2 인스턴스 프로비저닝, 로드 밸런싱 구성, 헬스 모니터링, 동적 스케일링을 처리한다고 설명합니다.

### 배포 대상

- Spring Boot `.jar`

### 환경 변수 예시

```
SPRING_PROFILES_ACTIVE=prod
SERVER_PORT=5000

DB_HOST=your-rds-endpoint
DB_PORT=3306
DB_NAME=maeum_weather
DB_USERNAME=admin
DB_PASSWORD=your-password

JWT_SECRET=your-jwt-secret
OPENAI_API_KEY=your-openai-api-key
AI_MODE=mock
```

Elastic Beanstalk는 일반적으로 5000 포트를 사용하는 예제가 많으므로, 배포 환경에서는 `server.port=5000`으로 맞추는 구성이 편합니다.

---

## 4-4. RDS MySQL 설정

### 사용 목적

사용자, 기억, 방, 사물 데이터 저장.

### 권장 설정

| 항목 | 값 |
| --- | --- |
| Engine | MySQL |
| Version | MySQL 8.x |
| DB Name | `maeum_weather` |
| Public Access | 가능하면 비공개 |
| Backup | 개발 중 최소 설정 |
| Charset | utf8mb4 |
| Collation | utf8mb4_unicode_ci |

### 주의

- RDS 보안 그룹에서 Elastic Beanstalk 서버의 접근을 허용해야 합니다.
- DB 비밀번호는 코드에 직접 넣지 않고 환경 변수로 관리합니다.
- 프론트에서 DB에 직접 접근하지 않습니다.
- DB 접근은 반드시 백엔드를 통해 처리합니다.

---

# 5. 변수명 및 명명 규칙

## 5-1. 전체 명명 원칙

프로젝트 전체에서 이름은 다음 원칙을 따릅니다.

| 원칙 | 설명 |
| --- | --- |
| 의미 중심 | 축약어보다 의미 있는 이름 사용 |
| 일관성 | 같은 개념은 같은 단어 사용 |
| 영어 사용 | 코드, DB, API는 영어 사용 |
| 감성 표현은 UI에서만 | DB/코드는 명확한 기술 이름 사용 |
| Boolean은 is/has/can 사용 | 상태값 명확화 |

---

## 5-2. 프로젝트 도메인 용어

| 한글 용어 | 코드명 |
| --- | --- |
| 사용자 | `user` |
| 기억 | `memory` |
| 날짜별 기억 | `memoryEntry` |
| 방 | `room` |
| 월별 방 | `monthlyRoom` |
| 사물 | `roomObject` |
| 슬롯 | `objectSlot` |
| 날씨 | `weather` |
| 조명 | `lighting` |
| 색감 | `palette` |
| 분위기 | `mood` |
| 방 제목 | `roomTitle` |

---

## 5-3. Frontend 변수명 규칙

### 파일명

컴포넌트 파일은 PascalCase.

```
RoomView.tsx
MemoryCalendar.tsx
MemoryWriteModal.tsx
WeatherEffect.tsx
LightingOverlay.tsx
```

일반 유틸 파일은 camelCase.

```
formatDate.ts
getMoodStyle.ts
apiClient.ts
```

상수 파일은 camelCase 또는 kebab-case.

```
moodConstants.ts
weatherConstants.ts
```

---

### 컴포넌트명

PascalCase 사용.

```
functionRoomView() {}
functionMemoryCalendar() {}
functionMemoryWriteModal() {}
```

---

### 변수명

camelCase 사용.

```
constselectedDate='2026-06-14';
constmemoryContent='오늘은 이상하게 비 오는 냄새가 좋았다.';
constroomTitle='비 냄새가 남은 저녁';
constweatherType='rain';
```

---

### Boolean 변수

`is`, `has`, `can` 사용.

```
constisLoggedIn=true;
consthasMemory=false;
constcanWriteMemory=true;
constisFutureDate=false;
```

---

### 이벤트 핸들러

`handle` 접두어 사용.

```
consthandleDateSelect= () => {};
consthandleMemorySubmit= () => {};
consthandleObjectClick= () => {};
consthandleLogin= () => {};
```

---

### API 함수명

동사 + 대상 형태 사용.

```
getMonthlyRoom()
getMemoryByDate()
createMemoryEntry()
updateMemoryEntry()
deleteMemoryEntry()
analyzeMemoryMood()
```

## 5-4. Backend 변수명 규칙

### 패키지 구조

```
com.maeumweather
 ┣ global
 ┃ ┣ config
 ┃ ┣ security
 ┃ ┣ exception
 ┃ ┗ util
 ┣ user
 ┃ ┣ controller
 ┃ ┣ service
 ┃ ┣ repository
 ┃ ┣ entity
 ┃ ┗ dto
 ┣ memory
 ┃ ┣ controller
 ┃ ┣ service
 ┃ ┣ repository
 ┃ ┣ entity
 ┃ ┗ dto
 ┣ room
 ┃ ┣ controller
 ┃ ┣ service
 ┃ ┣ repository
 ┃ ┣ entity
 ┃ ┗ dto
 ┣ object
 ┃ ┣ controller
 ┃ ┣ service
 ┃ ┣ repository
 ┃ ┣ entity
 ┃ ┗ dto
 ┗ ai
   ┣ service
   ┣ dto
   ┗ mock
```

---

### Java 클래스명

PascalCase 사용.

```
UserController
MemoryController
RoomController
AiAnalysisService
MemoryEntry
RoomObject
```

---

### 메서드명

camelCase 사용.

```
createMemoryEntry()
getMemoryByDate()
getMonthlyRoom()
analyzeMemory()
validateMemoryDate()
```

---

### DTO 이름

요청 DTO는 `Request`, 응답 DTO는 `Response` 접미어 사용.

```
LoginRequest
LoginResponse
CreateMemoryRequest
CreateMemoryResponse
MemoryDetailResponse
AiAnalysisResponse
```

---

### Entity 이름

단수형 사용.

```
User
MemoryEntry
MonthlyRoom
RoomObject
ObjectSlot
```

---

## 5-5. DB 명명 규칙

### 테이블명

snake_case, 복수형 사용.

```
users
memory_entries
monthly_rooms
room_objects
object_slots
refresh_tokens
```

---

### 컬럼명

snake_case 사용.

```
user_id
memory_date
room_title
object_key
slot_key
created_at
updated_at
```

---

### PK 이름

```
id
```

또는 명확하게 하려면:

```
user_id
memory_id
room_id
```

MVP에서는 모든 테이블에 `id`를 두는 방식이 단순합니다.

---

### FK 이름

```
user_id
memory_entry_id
room_object_id
monthly_room_id
```

---

## 5-6. Enum 명명 규칙

### Mood

```
publicenumMoodType {
QUIET,
WARM,
LONGING,
UNEASY
}
```

DB 저장값은 소문자 snake_case 또는 소문자 문자열.

```
quiet
warm
longing
uneasy
```

---

### Weather

```
rain
sunny
sunset
cloudy
```

---

### Lighting

```
blue_dim
warm_light
orange_dim
flicker
```

---

### Palette

```
blue_gray
cream_yellow
orange_brown
gray_blue
```

# 6. 전체 흐름도

## 6-1. 서비스 전체 흐름도

![mermaid-diagram.png](attachment:279bed32-6f0d-4727-81fe-e6bf7178a676:mermaid-diagram.png)

6-2. 기억 작성 상세 흐름도

![mermaid-diagram (1).png](attachment:d5774802-fa3a-4f09-9bcf-c6cb115a2b90:mermaid-diagram_(1).png)

6-3. AI 분석 흐름도

![mermaid-diagram (2).png](attachment:a679c9c7-1918-419f-97d0-58b0bb90eae9:mermaid-diagram_(2).png)

6-4. 배포 흐름도

![mermaid-diagram (3).png](attachment:c77fdded-1806-48fd-af7a-4817fedb61d3:mermaid-diagram_(3).png)

# 7. DB 구성

## 7-1. ERD

![mermaid-diagram (4).png](attachment:8effd382-0daf-4e85-9ef6-c83f24ce0f3e:mermaid-diagram_(4).png)

## 7-2. 테이블 상세

## users

사용자 정보를 저장합니다.

```
CREATETABLE users (
    id BIGINT AUTO_INCREMENTPRIMARYKEY,
    emailVARCHAR(100)NOTNULLUNIQUE,
    passwordVARCHAR(255)NOTNULL,
    nicknameVARCHAR(50)NOTNULL,
    created_at DATETIMENOTNULLDEFAULTCURRENT_TIMESTAMP,
    updated_at DATETIMENOTNULLDEFAULTCURRENT_TIMESTAMPONUPDATECURRENT_TIMESTAMP
);
```

---

## monthly_rooms

월별 방 정보를 저장합니다.

```
CREATETABLE monthly_rooms (
    id BIGINT AUTO_INCREMENTPRIMARYKEY,
    user_id BIGINTNOTNULL,
yearINTNOTNULL,
monthINTNOTNULL,
    titleVARCHAR(100)NOTNULL,
    archived_at DATETIMENULL,
    created_at DATETIMENOTNULLDEFAULTCURRENT_TIMESTAMP,
    updated_at DATETIMENOTNULLDEFAULTCURRENT_TIMESTAMPONUPDATECURRENT_TIMESTAMP,

CONSTRAINT fk_monthly_rooms_user
FOREIGNKEY (user_id)REFERENCES users(id),

CONSTRAINT uk_user_year_month
UNIQUE (user_id,year,month)
);
```

---

## memory_entries

날짜별 기억을 저장합니다.

```
CREATETABLE memory_entries (
    id BIGINT AUTO_INCREMENTPRIMARYKEY,
    user_id BIGINTNOTNULL,
    monthly_room_id BIGINTNOTNULL,
    memory_dateDATENOTNULL,
    content TEXTNOTNULL,
    room_titleVARCHAR(100)NOTNULL,
    moodVARCHAR(30)NOTNULL,
    weatherVARCHAR(30)NOTNULL,
    lightingVARCHAR(30)NOTNULL,
    paletteVARCHAR(30)NOTNULL,
    object_keyVARCHAR(50)NOTNULL,
    slot_keyVARCHAR(50)NOTNULL,
    messageVARCHAR(255)NULL,
    created_at DATETIMENOTNULLDEFAULTCURRENT_TIMESTAMP,
    updated_at DATETIMENOTNULLDEFAULTCURRENT_TIMESTAMPONUPDATECURRENT_TIMESTAMP,

CONSTRAINT fk_memory_entries_user
FOREIGNKEY (user_id)REFERENCES users(id),

CONSTRAINT fk_memory_entries_monthly_room
FOREIGNKEY (monthly_room_id)REFERENCES monthly_rooms(id),

CONSTRAINT uk_user_memory_date
UNIQUE (user_id, memory_date)
);
```

중요한 제약은 이것입니다.

```
UNIQUE (user_id, memory_date)
```

이 제약을 통해

**한 사용자는 하나의 날짜에 하나의 기억만 작성 가능**하게 만들 수 있습니다.

---

## room_objects

사물 카탈로그를 저장합니다.

```
CREATETABLE room_objects (
    id BIGINT AUTO_INCREMENTPRIMARYKEY,
    object_keyVARCHAR(50)NOTNULLUNIQUE,
    object_nameVARCHAR(50)NOTNULL,
    moodVARCHAR(30)NOTNULL,
    slot_keyVARCHAR(50)NOTNULL,
    image_urlVARCHAR(255)NULL,
    is_activeBOOLEANNOTNULLDEFAULTTRUE,
    created_at DATETIMENOTNULLDEFAULTCURRENT_TIMESTAMP,
    updated_at DATETIMENOTNULLDEFAULTCURRENT_TIMESTAMPONUPDATECURRENT_TIMESTAMP
);
```

초기 데이터 예시:

```
INSERTINTO room_objects
(object_key, object_name, mood, slot_key, image_url)
VALUES
('window_chair','창가 의자','quiet','window','/objects/window-chair.png'),
('small_plant','작은 식물','warm','floor','/objects/small-plant.png'),
('old_radio','오래된 라디오','longing','desk','/objects/old-radio.png'),
('desk_lamp','스탠드 조명','uneasy','desk','/objects/desk-lamp.png'),
('mug_cup','머그컵','warm','desk','/objects/mug-cup.png'),
('letter','편지','longing','wall','/objects/letter.png'),
('poster','포스터','warm','wall','/objects/poster.png'),
('rug','러그','quiet','floor','/objects/rug.png');
```

---

## object_slots

사물 배치 위치를 저장합니다.

```
CREATETABLE object_slots (
    id BIGINT AUTO_INCREMENTPRIMARYKEY,
    slot_keyVARCHAR(50)NOTNULLUNIQUE,
    slot_nameVARCHAR(50)NOTNULL,
    position_xINTNOTNULL,
    position_yINTNOTNULL,
    is_activeBOOLEANNOTNULLDEFAULTTRUE,
    created_at DATETIMENOTNULLDEFAULTCURRENT_TIMESTAMP,
    updated_at DATETIMENOTNULLDEFAULTCURRENT_TIMESTAMPONUPDATECURRENT_TIMESTAMP
);
```

초기 데이터 예시:

```
INSERTINTO object_slots
(slot_key, slot_name, position_x, position_y)
VALUES
('window','창가',280,180),
('desk','책상',520,330),
('wall','벽',420,120),
('floor','바닥',360,460),
('light','조명',600,100);
```

---

## refresh_tokens

로그인 유지 기능을 넣을 경우 사용합니다.

```
CREATETABLE refresh_tokens (
    id BIGINT AUTO_INCREMENTPRIMARYKEY,
    user_id BIGINTNOTNULL,
    tokenVARCHAR(255)NOTNULL,
    expires_at DATETIMENOTNULL,
    created_at DATETIMENOTNULLDEFAULTCURRENT_TIMESTAMP,

CONSTRAINT fk_refresh_tokens_user
FOREIGNKEY (user_id)REFERENCES users(id)
);
```

MVP에서는 refresh token 없이 access token만 사용해도 됩니다.

---

# 8. API 설계

## 8-1. Auth API

| Method | URL | 설명 |
| --- | --- | --- |
| POST | `/api/auth/signup` | 회원가입 |
| POST | `/api/auth/login` | 로그인 |
| POST | `/api/auth/logout` | 로그아웃 |
| GET | `/api/auth/me` | 내 정보 조회 |

---

### 회원가입 요청

```
{
  "email":"test@example.com",
  "password":"password1234",
  "nickname":"구름"
}
```

### 회원가입 응답

```
{
  "userId":1,
  "email":"test@example.com",
  "nickname":"구름"
}
```

---

### 로그인 요청

```
{
  "email":"test@example.com",
  "password":"password1234"
}
```

### 로그인 응답

```
{
  "accessToken":"jwt-token",
  "user": {
    "id":1,
    "email":"test@example.com",
    "nickname":"구름"
  }
}
```

---

## 8-2. Memory API

| Method | URL | 설명 |
| --- | --- | --- |
| GET | `/api/memories?year=2026&month=6` | 월별 기억 목록 |
| GET | `/api/memories/date?date=2026-06-14` | 특정 날짜 기억 조회 |
| POST | `/api/memories` | 기억 작성 |
| PUT | `/api/memories/{memoryId}` | 기억 수정 |
| DELETE | `/api/memories/{memoryId}` | 기억 삭제 |

---

### 기억 작성 요청

```
{
  "memoryDate":"2026-06-14",
  "content":"오늘은 이상하게 비 오는 냄새가 좋았다."
}
```

### 기억 작성 응답

```
{
  "memoryId":10,
  "memoryDate":"2026-06-14",
  "content":"오늘은 이상하게 비 오는 냄새가 좋았다.",
  "roomTitle":"비 냄새가 남은 저녁",
  "mood":"quiet",
  "weather":"rain",
  "lighting":"blue_dim",
  "palette":"blue_gray",
  "objectKey":"window_chair",
  "slotKey":"window",
  "message":"창가에 조용한 기억이 남았습니다."
}
```

---

## 8-3. Room API

| Method | URL | 설명 |
| --- | --- | --- |
| GET | `/api/rooms/current` | 현재 월 방 조회 |
| GET | `/api/rooms?year=2026&month=6` | 특정 월 방 조회 |
| GET | `/api/rooms/archive` | 월별 아카이브 목록 |

---

### 월별 방 조회 응답

```
{
  "year":2026,
  "month":6,
  "title":"2026년 6월의 마음의 날씨",
  "memories": [
    {
      "memoryId":10,
      "memoryDate":"2026-06-14",
      "roomTitle":"비 냄새가 남은 저녁",
      "mood":"quiet",
      "weather":"rain",
      "lighting":"blue_dim",
      "palette":"blue_gray",
      "objectKey":"window_chair",
      "slotKey":"window"
    }
  ]
}
```

---

## 8-4. Object API

| Method | URL | 설명 |
| --- | --- | --- |
| GET | `/api/objects` | 사물 카탈로그 조회 |
| GET | `/api/slots` | 슬롯 목록 조회 |

---

# 9. 방 렌더링 로직

## 9-1. 기본 원칙

날짜별 방 전체를 DB에 저장하지 않습니다.

대신 기억 데이터를 기반으로 방을 다시 그립니다.

---

## 9-2. 특정 날짜 방 조회 방식

예를 들어 사용자가 `2026-06-14`를 선택하면:

1. `2026-06-01`부터 `2026-06-14`까지의 기억을 조회한다.
2. 각 기억에 연결된 사물을 방에 표시한다.
3. 선택 날짜인 `2026-06-14`의 `weather`, `lighting`, `palette`를 현재 방 분위기로 적용한다.
4. 선택 날짜의 기억 카드를 표시한다.

---

## 9-3. 예시

6월 기록:

| 날짜 | 사물 | 날씨 |
| --- | --- | --- |
| 6월 1일 | 작은 식물 | sunny |
| 6월 5일 | 오래된 라디오 | sunset |
| 6월 14일 | 창가 의자 | rain |

6월 14일 선택 시:

- 작은 식물 표시
- 오래된 라디오 표시
- 창가 의자 표시
- 방 분위기는 6월 14일 기준으로 rain / blue_dim / blue_gray 적용

---

# 10. 예외 처리 정책

## 10-1. 날짜 관련

| 상황 | 응답 |
| --- | --- |
| 미래 날짜 작성 | `미래 날짜에는 기억을 남길 수 없습니다.` |
| 같은 날짜 중복 작성 | `이미 이 날짜에 남긴 기억이 있습니다.` |
| 날짜 형식 오류 | `날짜 형식이 올바르지 않습니다.` |

---

## 10-2. 인증 관련

| 상황 | 응답 |
| --- | --- |
| 로그인하지 않음 | `로그인이 필요합니다.` |
| 토큰 만료 | `다시 로그인해주세요.` |
| 권한 없음 | `접근 권한이 없습니다.` |

---

## 10-3. 기억 작성 관련

| 상황 | 응답 |
| --- | --- |
| 내용 없음 | `기억을 입력해주세요.` |
| 내용 너무 짧음 | `조금 더 자세히 적어주세요.` |
| 내용 너무 김 | `500자 이내로 작성해주세요.` |

---

## 10-4. AI 분석 관련

| 상황 | 처리 |
| --- | --- |
| AI API 실패 | Mock 분석 결과 사용 |
| AI 응답 JSON 파싱 실패 | 기본 mood인 quiet 적용 |
| API 키 없음 | Mock 모드로 실행 |

---

# 11. 개발 우선순위

## 1순위

- 로그인 / 회원가입
- 개인 방 화면
- 캘린더 날짜 선택
- 날짜별 기억 작성
- 날짜 중복 방지
- 미래 날짜 작성 방지
- Mock 분위기 분석
- 방 분위기 변화
- 사물 클릭 시 기억 확인

---

## 2순위

- OpenAI API 연결
- 월별 아카이브
- 사물 이미지 적용
- 방 애니메이션
- 기억 수정/삭제

---

## 3순위

- 음악 재생
- 방 스냅샷
- 공동 방
- 우편함
- 공감 기능

---

# 12. 3주 개발 일정

## 1주차 — 기본 구조 완성

### 목표

서비스의 뼈대를 완성합니다.

### 작업

- 프론트 프로젝트 세팅
- 백엔드 프로젝트 세팅
- DB 설계 및 생성
- 회원가입 / 로그인 구현
- 개인 방 기본 UI 구현
- 캘린더 UI 구현
- Mock 데이터로 방 표시

---

## 2주차 — 핵심 기능 구현

### 목표

기억 작성 → 분석 → 방 변화 흐름을 완성합니다.

### 작업

- 날짜별 기억 작성 API
- 날짜 중복 방지
- 미래 날짜 작성 방지
- Mock 분위기 분석
- 기억 저장
- 월별 기억 조회
- 방 분위기 변경
- 사물 자동 배치
- 사물 클릭 상세 모달

---

## 3주차 — 완성도 및 배포

### 목표

발표 가능한 수준으로 다듬고 배포합니다.

### 작업

- UI 감성 개선
- 날씨 효과 추가
- 조명 효과 추가
- OpenAI API 연결 또는 Mock 안정화
- Amplify 프론트 배포
- Elastic Beanstalk 백엔드 배포
- RDS 연결
- 발표 시나리오 준비
- 테스트 데이터 준비

---

# 13. 발표용 핵심 시나리오

## 시연 흐름

1. 사용자가 로그인한다.
2. 개인 방으로 들어간다.
3. 캘린더에서 6월 14일을 선택한다.
4. 아직 기록이 없어서 작성 버튼이 표시된다.
5. 사용자가 다음 문장을 입력한다.

```
오늘은 이상하게 비 오는 냄새가 좋았다.
```

1. AI 또는 Mock 분석이 실행된다.
2. 방 제목이 생성된다.

```
비 냄새가 남은 저녁
```

1. 방에 비가 내리고 조명이 푸르게 바뀐다.
2. 창가 의자가 추가된다.
3. 창가 의자를 클릭하면 6월 14일 기억이 열린다.
4. 월별 아카이브에서 6월의 방을 확인한다.

---

# 14. 최종 제외 기능

3주 프로젝트에서는 아래 기능을 제외하는 것이 좋습니다.

| 기능 | 제외 이유 |
| --- | --- |
| 공동 방 | 구현 범위가 큼 |
| 우편함 | 공동 방과 연결되어 우선순위 낮음 |
| 자유 드래그 | 좌표 저장, 충돌 처리, UI 복잡 |
| 3D | 디자인/개발 리소스 부족 |
| 채팅 | 핵심 서비스와 거리 있음 |
| 친구 시스템 | 인증/관계 관리 복잡 |
| 음악 자동 재생 | 브라우저 제한 및 발표 변수 |
| 복잡한 스킨 시스템 | 디자인 작업량 과다 |

---

# 15. 확인 질문 리스트

아래 질문에 답해주면 이 문서를 **팀 제출용 최종본**처럼 더 정확하게 바꿀 수 있습니다.

1. 프론트는 **React**인가요, **Next.js**인가요?
2. 백엔드는 **Spring Boot**가 맞나요?
3. DB는 **MySQL / MariaDB / PostgreSQL** 중 무엇을 사용할 예정인가요?
4. AI 분석은 실제 **OpenAI API**를 붙이나요, 아니면 **Mock 분석**으로 발표하나요?
5. 로그인은 JWT 방식으로 구현하나요?
6. 배포는 정말 **Frontend = Amplify, Backend = Elastic Beanstalk** 구조가 맞나요?
7. 팀 인원은 몇 명인가요?
8. 프로젝트 기간은 정확히 3주인가요?
9. 방 화면은 직접 CSS로 그리나요, 아니면 이미지 에셋을 사용하나요?
10. 사물은 몇 개 정도 구현할 수 있나요? 예: 4개, 8개, 12개
11. 기억 수정/삭제 기능도 MVP에 포함할까요?
12. 월별 아카이브는 실제 별도 화면으로 만들까요, 아니면 메인 화면에서 월 선택만 가능하게 할까요?