# 마음의 날씨

말하지 못한 이야기를 글로 남기면, 그 마음이 창밖의 날씨와 방 안의 오브젝트로 표현되는 감성 기록 서비스입니다.

## 저장소 루트 구조

GitHub 첫 화면에는 아래 5개 항목만 보이도록 정리했습니다.

```text
README.md
.gitignore
.gitattributes
frontend/
backend/
```

## Frontend

현재 프론트엔드는 Vite + React 기반 목업입니다. Next.js App Router가 아니라 `frontend/src/app/pages/*`와 경량 라우터로 화면을 연결합니다.

```bash
cd frontend
npm install
npm run dev
npm run build
```

주요 구조:

```text
frontend/
 ┣ src/
 ┃ ┣ app/
 ┃ ┃ ┣ App.tsx
 ┃ ┃ ┣ app.css
 ┃ ┃ ┣ pages/
 ┃ ┃ ┣ components/
 ┃ ┃ ┣ constants/
 ┃ ┃ ┣ hooks/
 ┃ ┃ ┣ lib/
 ┃ ┃ ┣ services/
 ┃ ┃ ┣ stores/
 ┃ ┃ ┣ types/
 ┃ ┃ ┗ utils/
 ┃ ┣ main.tsx
 ┃ ┗ vite-env.d.ts
 ┣ index.html
 ┣ package.json
 ┣ package-lock.json
 ┣ postcss.config.mjs
 ┗ vite.config.ts
```

## Backend

백엔드는 Spring Boot 전환을 고려한 패키지 구조와 환경 변수 예시만 준비된 상태입니다.

```text
backend/
 ┣ README.md
 ┣ .env.example
 ┗ src/main/
   ┣ java/com/maeumweather/
   ┃ ┣ global/
   ┃ ┣ auth/
   ┃ ┣ user/
   ┃ ┣ room/
   ┃ ┣ memory/
   ┃ ┣ object/
   ┃ ┣ plaza/
   ┃ ┣ like/
   ┃ ┣ mailbox/
   ┃ ┗ ai/
   ┗ resources/
     ┗ application-prod.yml.example
```

## 구현된 기능

- 랜딩, 로그인, 회원가입, 나만의 방, 광장, 우편함, 마이페이지 화면
- mock auth와 localStorage 기반 상태 저장
- 개인 방 캘린더, 글 작성 모달, 오브젝트 선택, 날씨 효과, 글 팝업
- 광장 생성, 광장 상세, 광장 글 남기기, 내가 쓴 오브젝트 보기
- 다크 모드와 라이트 모드 테마

## 아직 Mock인 부분

- 실제 인증 API
- 개인 기록 API
- 광장 API
- 우편함 API
- 이미지 생성 및 S3 저장

실제 API 연동 시에는 `frontend/src/app/services/*`의 localStorage 구현을 HTTP 클라이언트 호출로 교체하면 됩니다.

## 커밋 메시지 규칙

```text
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 리팩토링
test: 테스트 코드
chore: 설정 파일, 빌드 작업
```
