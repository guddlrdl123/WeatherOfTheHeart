# 마음의 날씨 Backend

Spring Boot 백엔드가 추가될 때 사용할 권장 패키지 구조입니다.

## Stack

| 항목 | 내용 |
| --- | --- |
| Language | Java |
| Framework | Spring Boot |
| ORM | Spring Data JPA |
| Security | Spring Security + JWT |
| DB | MySQL |
| Build Tool | Gradle |
| 배포 | AWS Elastic Beanstalk |

## Package Structure

```text
src/main/java/com/maeumweather/
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

현재는 구조 스캐폴드만 준비되어 있으며, 실제 Spring Boot 프로젝트 파일은 백엔드 구현 시 추가합니다.
