// 환경변수 불러오기
require("dotenv").config({ path: "../.env" })

// mysql2 모듈 불러오기
const mariadb = require("mariadb")

const pool = mariadb.createPool({
    host: process.env.MARIADB_ROOT_HOST,
    port: process.env.DB_PORT,
    user: process.env.MARIADB_USER,
    password: process.env.MARIADB_PASSWORD,
    database: process.env.DB_NAME,
})

module.exports = pool
