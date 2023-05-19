# 2022-02-OSSP1-BookDinosaur-3


> 2022-02 공개SW프로젝트 A+팀
> 
> BookDinosaur 프로젝트
> 
> https://bookdinosaur.tk/
>
> 기존의 Read Lead 사이트(http://146.56.172.91/) 보완
>
> (https://github.com/CSID-DGU/2022-01-OSSP1-NoHongchulRed-1)




## Team Member

|학과|학번|이름|역할|
|------|------|---|---|
|컴퓨터공학과|2020112119|강동희|추천시스템알고리즘|
|컴퓨터공학과|2019113328|박근용|[보안](https://www.notion.so/fd76b78743b9428f8fbcf272faaaacdf)|
|국어국문문예창작학부|2020110128|박지민|서버,데이터베이스|
|컴퓨터공학과|2018112180|정대용|리팩토링,테스팅|




## Tech Stack

<div align=center>
  <img src="https://img.shields.io/badge/Ubuntu-E95420?style=for-the-badge&logo=Ubuntu&logoColor=black">
  <img src="https://img.shields.io/badge/oracle cloud-F80000?style=for-the-badge&logo=oracle&logoColor=white">
  <img src="https://img.shields.io/badge/docker-2496ED?style=for-the-badge&logo=docker&logoColor=white">
  <img src="https://img.shields.io/badge/nginx-009639?style=for-the-badge&logo=nginx&logoColor=white">
  <img src="https://img.shields.io/badge/Let's Encrypt-003A70?style=for-the-badge&logo=Let's Encrypt&logoColor=white">
  <br>
  
  <img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white">
  <img src="https://img.shields.io/badge/css-1572B6?style=for-the-badge&logo=css3&logoColor=white">
  <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=black">
  <img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white">
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=Express&logoColor=white">
  <br>

  <img src="https://img.shields.io/badge/python-3776AB?style=for-the-badge&logo=python&logoColor=white">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white">
  <img src="https://img.shields.io/badge/scikitlearn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white">
  <img src="https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=MariaDB&logoColor=white">
  <img src="https://img.shields.io/badge/KakaoAPI-FFCD00?style=for-the-badge&logo=Kakao&logoColor=black">
  <br>

  <img src="https://img.shields.io/badge/Visual Studio Code-007ACC?style=for-the-badge&logo=Visual Studio Code&logoColor=white">
  <img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white">
  <img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white">
</div>




## Environment

### Server
- Nginx 1.18.0 (Ubuntu)
- Node.js 18.12.1
- Express 4.18.1

### Database
- MariaDB 10.10.2 ~ Ubuntu 0.22.04 

### Client
- React 17.0.2




## Main Feature

### Recommend System

**1. Hybrid recommend system**
- 복수의 알고리즘이 계산한 개별 사용자의 개별 아이템에 대한 예측치 모두 규칙으로 결합
- 전체 사용자의 평점을 바탕으로 개별 사용자의 평점 데이터 사용
<br>

**2. Neural Network recommend system**
<br>
<br>
### Page
**1. Login page**

![Loginpage](https://user-images.githubusercontent.com/83688807/173960048-0095d697-658e-4765-8e64-bbf409d9fe81.PNG)
- 아이디와 비밀번호를 사용하여 로그인
<br>

## Requirements

-   주어진 API에 맞는 DB 서버
-   카카오 API 키, DB 설정값, 세션 secret 정보 관련 환경변수 파일(.env)

### .env 원형

```
PUBLIC_URL=
SESSION_SECRET=
PORT=3000

# DATABASE(MARIADB)
MARIADB_ROOT_PASSWORD=
MARIADB_USER=
MARIADB_PASSWORD=
TZ=Asia/Seoul

DB_PORT=3306
DB_NAME=BOOKWEB
DB_HOST=database

# KAKAO
KAKAO_API_KEY=
```

### DB Schema

```
CREATE DATABASE BOOKWEB;

USE BOOKWEB;

CREATE TABLE BookTB (
    Id INT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    information VARCHAR(100) NOT NULL,
    genres VARCHAR(100) NOT NULL
);

CREATE TABLE UserTB (
    userid VARCHAR(25) PRIMARY KEY,
    password VARCHAR(60) NOT NULL,
    nickname VARCHAR(25) NOT NULL,
    age INT NOT NULL,
    sexuality VARCHAR(25) NOT NULL,
    preference VARCHAR(50) NOT NULL
);

CREATE TABLE BookReportTB (
    userid VARCHAR(25) NOT NULL,
    isbn VARCHAR(24) NOT NULL,
    title VARCHAR(100) NOT NULL,
    contents VARCHAR(300) NOT NULL,
    rating VARCHAR(5) NOT NULL,
    date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    views INT NOT NULL DEFAULT 0,
    CONSTRAINT FK_userid
    FOREIGN KEY (userid) REFERENCES UserTB (userid),
    CONSTRAINT FK_isbn
    FOREIGN KEY (isbn) REFERENCES BookTB (isbn)
);

CREATE TABLE RatingTB (
    User_id INT PRIMARY KEY,
    book_id INT NOT NULL,
    Rating INT NOT NULL
);
```
