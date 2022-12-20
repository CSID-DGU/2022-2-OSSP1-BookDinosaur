# 2022-02-OSSP1-BookDinosaur-3

> 2022-02 공개SW프로젝트 A+
>
> READ LEAD
>
> 독후감/서평 공유 및 도서 추천 플랫폼 개선
>
> 원본 프로젝트: https://github.com/CSID-DGU/2022-01-OSSP1-NoHongchulRed-1

## Demo Website

> https://bookdinosaur.tk

## Team Member

| 학번       | 이름   |
| ---------- | ------ |
| 2020112119 | 강동희 |
| 2019113328 | 박근용 |
| 2020110128 | 박지민 |
| 2018112180 | 정대용 |

## Tech Stack

<div align=center>
  <img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white">
  <img src="https://img.shields.io/badge/css-1572B6?style=for-the-badge&logo=css3&logoColor=white">
  <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=black">
  <img src="https://img.shields.io/badge/MUI-2196F3?style=for-the-badge&logo=MUI&logoColor=white">
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=Express&logoColor=white">
  <br>

  <img src="https://img.shields.io/badge/python-3776AB?style=for-the-badge&logo=python&logoColor=white">
  <img src="https://img.shields.io/badge/scikitlearn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white">
  <img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white">
  <img src="https://img.shields.io/badge/KakaoAPI-FFCD00?style=for-the-badge&logo=Kakao&logoColor=black">
  <img src="https://img.shields.io/badge/docker-2496ED?style=for-the-badge&logo=docker&logoColor=white">
  <img src="https://img.shields.io/badge/nginx-009639?style=for-the-badge&logo=nginx&logoColor=white">
  <img src="https://img.shields.io/badge/oracle cloud-F80000?style=for-the-badge&logo=oracle&logoColor=white">
  <br>

  <img src="https://img.shields.io/badge/Visual Studio Code-007ACC?style=for-the-badge&logo=Visual Studio Code&logoColor=white">
  <img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white">
  <img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white">
</div>

## Environment

### Server

-   Node.js 16.14.2
-   Express 4.18.1
-   MySQL 8.0.29-0ubuntu0.20.04.3
-   Nginx 1.23.1

### Client

-   React 17.0.2

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
