const { query } = require("../pool")
const pool = require("../pool")

exports.createBookReport = async (req, res) => {
    if (req.session.userId) {
        // 로그인이 되어있는 상태인지 확인 안 되어 있으면
        const title = req.body.title
        const contents = req.body.contents
        const rating = req.body.rating
        const userid = req.body.userid
        const isbn = req.body.isbn
        try {
            await pool.query(
                "INSERT INTO BOOKWEB.BookReportTB(title, contents, rating, userid, isbn) VALUES (?,?,?,?,?)",
                [title, contents, rating, userid, isbn]
            )
            return res.json({
                issuccess: true,
                message: "create book report success",
            })
        } catch (err) {
            return res.json({ issuccess: false, message: "db error" })
        }
    } else {
        return res.json({ issuccess: false, message: "not login yet" }) // 여기서 로그인하고 오라고 함
    }
}

exports.getBookReports = async (req, res) => {
    try {
        console.log(req.query)
        const sql = getSQL()
        const values = getValues()
        const queryDataSets = await pool.query(sql, values)

        if (queryDataSets.length != 0) {
            const jsonData = new Object()
            jsonData.data = queryDataSets
            return res.json(
                Object.assign(jsonData, {
                    issuccess: true,
                    message: "success",
                })
            )
        } else {
            return res.json({ issuccess: false, message: "no data" })
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }

    function getSQL() {
        if (req.query.sort == "date")
            return "SELECT R.*, B.title AS bookTitle FROM BOOKWEB.BookReportTB AS R JOIN BOOKWEB.BookTB AS B ON R.isbn = B.isbn ORDER BY date DESC"
        else if (req.query.sort == "view")
            return "SELECT R.*, B.title AS bookTitle, B.thumbnail FROM BOOKWEB.BookReportTB AS R JOIN BOOKWEB.BookTB AS B ON R.isbn = B.isbn ORDER BY views DESC"
        else if (req.query.isbn && !req.query.userid)
            return "SELECT R.*, B.title AS bookTitle FROM BOOKWEB.BookReportTB R JOIN BOOKWEB.BookTB B ON R.isbn = B.isbn WHERE R.isbn = ? ORDER BY date DESC"
        else if (!req.query.isbn && req.query.userid)
            return "SELECT R.*, B.title AS bookTitle FROM BOOKWEB.BookReportTB R JOIN BOOKWEB.BookTB B ON R.isbn = B.isbn WHERE R.userid = ? ORDER BY date DESC"
    }

    function getValues() {
        if (req.query.isbn && !req.query.userid) return [isbn]
        else if (!req.query.isbn && req.query.userid) return [userid]
    }
}

// Get Book report 5
// 독후감 정보 가져오기(isbn, userid 기준 - 한 개만 선택됨)
exports.getBookReport = async (req, res) => {
    const { userid } = req.params
    const { isbn } = req.params
    try {
        // 고유한 독후감 정보를 가져오는 것은 단일 독후감 게시물을 읽을 때이므로 조회수에 해당하는 views 값을 하나 증가시켜 update해줘야 함
        await pool.query(
            "UPDATE BOOKWEB.BookReportTB SET views = views+1 WHERE userid = ? AND isbn = ?",
            [userid, isbn]
        )
        const data = await pool.query(
            "SELECT R.*, B.title AS bookTitle FROM BOOKWEB.BookReportTB R JOIN BOOKWEB.BookTB B ON R.isbn = B.isbn WHERE R.userid = ? AND R.isbn = ?",
            [userid, isbn]
        )

        if (data.length != 0) {
            return res.json(
                Object.assign(data[0], { issuccess: true, message: "success" })
            )
        } else {
            return res.json({ issuccess: false, message: "no data" })
        }
    } catch (err) {
        return res.status(500).json(err)
    }
}
