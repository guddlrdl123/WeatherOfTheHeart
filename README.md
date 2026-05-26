# 마음의 날씨

말하지 못한 이야기를 글로 남기면, 그 마음이 창밖의 날씨와 방 안의 오브젝트로 표현되는 감성 기록 서비스입니다.

현재 저장소는 **Vite + React + TypeScript 스타일의 프론트엔드 목업**입니다. Next.js App Router 구조는 아니므로, 추천 구조의 `frontend/app/*` 경로는 현재 프로젝트에서 `src/app/pages/*`와 경량 라우터로 대응합니다.

## 실행

```bash
npm install
npm run dev
npm run build
```

## 현재 프론트엔드 구조

```text
src/
 ┣ app/
 ┃ ┣ App.tsx
 ┃ ┣ app.css
 ┃ ┣ pages/
 ┃ ┃ ┣ LandingPage.tsx
 ┃ ┃ ┣ LoginPage.tsx
 ┃ ┃ ┣ SignupPage.tsx
 ┃ ┃ ┣ RoomPage.tsx
 ┃ ┃ ┣ PlazaListPage.tsx
 ┃ ┃ ┣ PlazaNewPage.tsx
 ┃ ┃ ┣ PlazaDetailPage.tsx
 ┃ ┃ ┣ MailboxPage.tsx
 ┃ ┃ ┗ ProfilePage.tsx
 ┃ ┣ components/
 ┃ ┃ ┣ common/
 ┃ ┃ ┣ layout/
 ┃ ┃ ┣ auth/
 ┃ ┃ ┣ room/
 ┃ ┃ ┣ calendar/
 ┃ ┃ ┣ plaza/
 ┃ ┃ ┣ object/
 ┃ ┃ ┣ mailbox/
 ┃ ┃ ┣ profile/
 ┃ ┃ ┗ ui/
 ┃ ┣ constants/
 ┃ ┣ hooks/
 ┃ ┣ lib/
 ┃ ┣ services/
 ┃ ┣ stores/
 ┃ ┣ types/
 ┃ ┗ utils/
 ┗ main.tsx
```

## 추천 Next.js 전환 구조

나중에 Next.js App Router로 이전한다면 아래 구조를 기준으로 이동합니다.

```text
frontend/
 ┣ app/
 ┃ ┣ page.tsx
 ┃ ┣ login/
 ┃ ┣ signup/
 ┃ ┣ room/
 ┃ ┣ archive/
 ┃ ┣ plazas/
 ┃ ┣ mailbox/
 ┃ ┗ profile/
 ┣ components/
 ┃ ┣ common/
 ┃ ┣ layout/
 ┃ ┣ auth/
 ┃ ┣ room/
 ┃ ┣ calendar/
 ┃ ┣ plaza/
 ┃ ┣ object/
 ┃ ┗ mailbox/
 ┣ constants/
 ┣ hooks/
 ┣ lib/
 ┣ services/
 ┣ stores/
 ┣ types/
 ┗ utils/
```

## Frontend 환경 변수 예시

현재 Vite 프로젝트에서는 `VITE_` 접두사를 사용합니다.

```env
VITE_API_BASE_URL=https://api.maeum-weather.com
VITE_APP_NAME=마음의 날씨
VITE_S3_ASSET_BASE_URL=https://assets.maeum-weather.com
```

Next.js로 이전하면 아래처럼 변경합니다.

```env
NEXT_PUBLIC_API_BASE_URL=https://api.maeum-weather.com
NEXT_PUBLIC_APP_NAME=마음의 날씨
NEXT_PUBLIC_S3_ASSET_BASE_URL=https://assets.maeum-weather.com
```

## Backend 권장 구조

| 항목 | 내용 |
| --- | --- |
| Language | Java |
| Framework | Spring Boot |
| ORM | Spring Data JPA |
| Security | Spring Security + JWT |
| DB | MySQL |
| Build Tool | Gradle |
| 배포 | AWS Elastic Beanstalk |

```text
backend/
 ┗ src/main/java/com/maeumweather/
   ┣ global/
   ┃ ┣ config/
   ┃ ┣ security/
   ┃ ┣ exception/
   ┃ ┗ util/
   ┣ auth/
   ┃ ┣ controller/
   ┃ ┣ service/
   ┃ ┣ dto/
   ┃ ┗ jwt/
   ┣ user/
   ┣ room/
   ┣ memory/
   ┣ object/
   ┣ plaza/
   ┣ like/
   ┣ mailbox/
   ┗ ai/
```

## Backend 환경 변수 예시

```yml
server:
  port: 5000

spring:
  datasource:
    url: jdbc:mysql://${DB_HOST}:${DB_PORT}/${DB_NAME}?serverTimezone=Asia/Seoul&characterEncoding=UTF-8
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}

  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        format_sql: true

jwt:
  secret: ${JWT_SECRET}
  access-token-expiration: ${JWT_ACCESS_EXPIRATION}

aws:
  s3:
    bucket: ${S3_BUCKET_NAME}
    region: ${AWS_REGION}

ai:
  mode: ${AI_MODE}
```

```env
SPRING_PROFILES_ACTIVE=prod
DB_HOST=maeum-weather-db.xxxxxx.ap-northeast-2.rds.amazonaws.com
DB_PORT=3306
DB_NAME=maeum_weather
DB_USERNAME=admin
DB_PASSWORD=비밀번호

JWT_SECRET=긴_랜덤_문자열
JWT_ACCESS_EXPIRATION=3600000

AWS_REGION=ap-northeast-2
S3_BUCKET_NAME=maeum-weather-assets

AI_MODE=mock
```

## DB

| 항목 | 내용 |
| --- | --- |
| Local DB | MySQL |
| Production DB | AWS RDS MySQL |
| Charset | utf8mb4 |
| Collation | utf8mb4_unicode_ci |
| Migration | 수동 SQL 또는 Flyway |
| ERD Tool | ERDCloud, dbdiagram.io, MySQL Workbench |

운영 DB는 RDS MySQL을 사용하고, 백업은 RDS 스냅샷 또는 자동 백업 정책으로 관리합니다.

## 배포 환경

| 영역 | 서비스 |
| --- | --- |
| 프론트엔드 | AWS Amplify |
| 백엔드 | AWS Elastic Beanstalk |
| DB | AWS RDS MySQL |
| 이미지 저장 | AWS S3 |
| CI/CD | Amplify 자동 배포 + GitHub Actions 선택 |

## 명명 규칙

| 원칙 | 설명 |
| --- | --- |
| 코드명은 영어 사용 | 한글 변수명 사용 금지 |
| UI 문구는 한글 사용 | 사용자에게 보이는 문구만 한글 |
| 약어 남발 금지 | `object`, `count`처럼 풀어 쓰기 |
| 같은 개념은 같은 단어 사용 | memory, object, plaza 등 통일 |
| boolean은 is/has/can 사용 | 상태값을 명확히 표현 |
| DB는 snake_case | MySQL 기준 |
| JS/TS는 camelCase | 변수, 함수 |
| React 컴포넌트는 PascalCase | 파일명도 동일 |
| Java 클래스는 PascalCase | Controller, Service 등 |
| Java 메서드/변수는 camelCase | 표준 Java 컨벤션 |

## 도메인 용어

| 한글 | 코드명 |
| --- | --- |
| 사용자 | user |
| 나만의 방 | privateRoom |
| 광장 | plaza |
| 글 / 메모 / 이야기 | memory |
| 사물 / 가구 / 오브젝트 | object |
| 마음 상태 | mood |
| 날씨 | weather |
| 조명 | lighting |
| 제목 | title |
| 우편함 | mailbox |
| 좋아요 | like |
| 스냅샷 | snapshot |

## Frontend 명명 규칙

컴포넌트 파일명:

```text
PascalCase.tsx
```

일반 함수 파일명:

```text
camelCase.ts
```

변수명:

```ts
const selectedDate = "2026-06-02";
const memoryTitle = "비 오는 날의 메모";
const memoryContent = "오늘은 이상하게 비 오는 냄새가 좋았다.";
const selectedMood = "rainy";
const selectedObjectKey = "old_radio";
```

boolean 변수:

```ts
const isLoggedIn = true;
const isMyObject = false;
const hasMemory = true;
const canEditMemory = false;
const isPlazaClosed = false;
```

이벤트 핸들러:

```ts
const handleLogin = () => {};
const handleDateSelect = () => {};
const handleMemorySubmit = () => {};
const handleObjectClick = () => {};
const handlePlazaCreate = () => {};
```

API 함수명:

```ts
login();
signup();
getMyRoom();
getMemoriesByMonth();
createMemory();
updateMemory();
getPlazaList();
createPlaza();
createPlazaEntry();
toggleObjectLike();
```

## Backend 명명 규칙

Controller:

```text
AuthController
UserController
PrivateRoomController
MemoryController
ObjectController
PlazaController
MailboxController
```

Service:

```text
AuthService
MemoryService
PrivateRoomService
PlazaService
MailboxService
WeatherService
```

Repository:

```text
UserRepository
MemoryRepository
PrivateRoomRepository
PlazaRepository
PlazaEntryRepository
ObjectCatalogRepository
```

Entity:

```text
User
PrivateRoom
PrivateMemory
ObjectCatalog
ObjectSlot
Plaza
PlazaEntry
ObjectLike
MailboxItem
```

DTO는 요청 DTO에 `Request`, 응답 DTO에 `Response` 접미어를 붙입니다.

## DB 명명 규칙

테이블명:

```text
users
private_rooms
private_memories
object_catalogs
object_slots
plazas
plaza_entries
object_likes
mailbox_items
room_snapshots
```

컬럼명:

```text
user_id
memory_date
object_key
weather_key
created_at
updated_at
is_searchable
is_invitable
```

Enum 값:

```text
sunny
rainy
cloudy
sunset
snowy
night
```

Java Enum:

```text
SUNNY
RAINY
CLOUDY
SUNSET
SNOWY
NIGHT
```

## Git 브랜치 규칙

```text
main
develop
feature/FE-room-ui
feature/FE-plaza-list
feature/BE-auth
feature/BE-memory-api
feature/BE-plaza-api
fix/FE-calendar-bug
fix/BE-login-error
```

## 커밋 메시지 규칙

```text
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅, 세미콜론 등
refactor: 리팩토링
test: 테스트 코드
chore: 설정 파일, 빌드 작업
```

예시:

```text
feat: 개인 방 글 작성 API 추가
feat: 광장 리스트 UI 구현
fix: 미래 날짜 작성 가능 버그 수정
docs: 요구사항 명세서 수정
refactor: MemoryService 로직 분리
chore: AWS 배포 환경 변수 추가
```
