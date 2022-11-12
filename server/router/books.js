const express = require('express');
const pool = require('../pool');
const router = express.Router();

// Add book data
// 책 등록
router.post('/api/db/books', async (req, res) => {
  const isbn = req.body.isbn;
  const title = req.body.title;
  const authors = req.body.authors;
  const publisher = req.body.publisher;
  const thumbnail = req.body.thumbnail;
  try {
    await pool.query('INSERT INTO BOOKWEB.BookTB(isbn, title, authors, publisher, thumbnail) VALUES (?,?,?,?,?)',
      [isbn, title, authors, publisher, thumbnail]);
    return res.json({ issuccess: true, message: "add book success" });
  } catch (err) {
    return res.json({ issuccess: false, message: "db error" });
  }
});

// Get Book
// 책 정보 가져오기
router.get('/api/db/books/:isbn', async (req, res) => {
  const { isbn } = req.params;
  try {
    const data = await pool.query('SELECT * FROM BOOKWEB.BookTB WHERE isbn = ?', [isbn]);
    if (data[0].length != 0) {
      return res.json(Object.assign(data[0][0], { issuccess: true, message: "success" }));
    } else {
      return res.json({ issuccess: false, message: "no data" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
