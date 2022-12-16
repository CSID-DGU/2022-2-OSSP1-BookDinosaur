const pool = require("../pool");
const spawn = require("child_process").spawn;

exports.createBook = async (req, res) => {
  const isbn = req.body.isbn;
  const title = req.body.title;
  const authors = req.body.authors;
  const publisher = req.body.publisher;
  const thumbnail = req.body.thumbnail;
  try {
    await pool.query(
      "INSERT INTO BOOKWEB.BookTB(isbn, title, authors, publisher, thumbnail) VALUES (?,?,?,?,?)",
      [isbn, title, authors, publisher, thumbnail]
    );
    return res.json({ issuccess: true, message: "add book success" });
  } catch (err) {
    return res.json({ issuccess: false, message: "db error" });
  }
};

exports.readBook = async (req, res) => {
  const { isbn } = req.params;
  try {
    const data = await pool.query(
      "SELECT * FROM BOOKWEB.BookTB WHERE isbn = ?",
      [isbn]
    );
    if (data[0].length != 0) {
      return res.json(
        Object.assign(data[0], { issuccess: true, message: "success" })
      );
    } else {
      return res.json({ issuccess: false, message: "no data" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

// get recommend data
exports.readRecommendedBooksByRatings = async (req, res) => {
  // result 변수에 최종 데이터 담아 넘겨주면 될 듯
  let result;

  try {
    // 유저 배열 useridList, 책의 isbn 배열 isbnList
    const useridList = await pool.query(
      "SELECT userid FROM BOOKWEB.UserTB WHERE NOT userid = ?",
      [req.session.userId]
    );
    const isbnList = await pool.query(
      "SELECT isbn FROM BOOKWEB.BookTB ORDER BY isbn ASC"
    );
    const ulen = useridList.length;
    const ilen = isbnList.length;

    //dataMat 배열 만들기 (초기화된 상태로)
    let dataMat = new Array(ulen);

    for (let i = 0; i < ulen; i++) {
      dataMat[i] = new Array(ilen);
    }

    //dataMat 배열 채우기
    for (let i = 0; i < ulen; i++) {
      for (let j = 0; j < ilen; j++) {
        const ratingData = await pool.query(
          "SELECT rating FROM BOOKWEB.BookReportTB WHERE userid = ? AND isbn = ?",
          [useridList[i].userid, isbnList[j].isbn]
        );
        if (ratingData.length == 0) {
          dataMat[i][j] = 0;
        } else {
          dataMat[i][j] = ratingData[0].rating;
        }
      }
    }

    // 데이터 없으면 파이썬 실행 전에 처리
    const reportNum = await pool.query(
      "SELECT COUNT(rating) as cnt FROM BOOKWEB.BookReportTB WHERE userid=?",
      [req.session.userId]
    );
    if (reportNum[0].cnt < 2) {
      result = new Object();
      result.data = [];
      return res.json(
        Object.assign(result, { issuccess: false, message: "no recommand" })
      );
    }

    // 현재 세션의 유저 배열 만들기
    let sessionUserRating = [];
    for (let i = 0; i < ilen; i++) {
      const ratingData = await pool.query(
        "SELECT rating FROM BOOKWEB.BookReportTB WHERE userid=? AND isbn = ?",
        [req.session.userId, isbnList[i].isbn]
      );
      if (ratingData.length == 0) {
        sessionUserRating[i] = 0;
      } else {
        sessionUserRating[i] = ratingData[0].rating;
      }
    }

    dataMat.push(sessionUserRating); // 현재 추천해줄 유저의 평점 정보 추가

    const process = spawn("/usr/bin/python", [
      "python/svd.py",
      JSON.stringify(dataMat),
    ]);
    // stdout에 대한 콜백
    process.stdout.on("data", async function (data) {
      // 받아온 데이터는 추천 순위 인덱스 정보이므로 해당 인덱스에 해당하는 isbn을 찾아 실제 도서 정보를 넘겨줘야 함
      const recommendIndex = JSON.parse(data);
      let recommendIsbn = [];
      for (const element of recommendIndex) {
        recommendIsbn.push(isbnList[element]);
      }

      // isbn 배열로 도서를 찾아서 도서 정보 리턴해줌
      // 모든 책을 다 읽은 경우 내용이 배열에 내용이 없을 수 있음, 프론트쪽에서 처리하여 '더이상 추천해줄 도서가 없습니다.'와 같이 메시지를 출력해주는 것이 좋을 듯
      let recommendBookArray = []; // 추천 도서 정보 배열
      for (let i = 0; i < recommendIsbn.length; i++) {
        const data = await pool.query(
          "SELECT * FROM BOOKWEB.BookTB WHERE isbn = ?",
          [recommendIsbn[i].isbn]
        );
        recommendBookArray[i] = data[0];
      }

      result = new Object();
      result.data = recommendBookArray;

      return res.json(
        Object.assign(result, { issuccess: true, message: "success" })
      );
      /*
      내용 출력 테스트용
      console.log("stdout: " + data.toString());
      result = data.toString();
      return res.json(result);
      */
    });

    // stderr에 대한 콜백
    process.stderr.on("data", function (data) {
      result = data.toString();
      return res.json(
        Object.assign(result, { issuccess: false, message: "error" })
      );
    });
  } catch (err) {
    return res.status(500).json(err);
  }
};

// get recommend data (cosine)
exports.readRecommendedBooksByPreferences = async (req, res) => {
  try {
    //나를 제외하고 독후감을 하나 이상 쓴 모든 유저의 userid, preference 가져오기
    let userData;
    try {
      const allUser = await pool.query(
        "SELECT DISTINCT U.userid, U.preference FROM BOOKWEB.UserTB AS U, BOOKWEB.BookReportTB AS R WHERE U.userid = R.userid AND NOT U.userid = ?",
        [req.session.userId]
      );
      userData = allUser;
    } catch {
      return res.json({ issuccess: false, message: "user data get failed" });
    }
    let userList = [];
    let preferMat = [];

    for (const element of userData) {
      userList.push(element.userid);
      preferMat.push(element.preference.split(","));
    }

    const myData = await pool.query(
      "SELECT preference FROM BOOKWEB.UserTB WHERE userid = ?",
      [req.session.userId]
    );
    const myPrefer = myData[0].preference.split(",");

    let result;

    const process = spawn("/usr/bin/python", [
      "python/cos.py",
      JSON.stringify(preferMat),
      JSON.stringify(myPrefer),
    ]);
    process.stdout.setEncoding("utf8");
    // stdout에 대한 콜백
    process.stdout.on("data", async function (data) {
      const recommendIndex = JSON.parse(data);
      let similarUser = [];
      for (const element of recommendIndex) {
        similarUser.push(userList[element]);
      }

      //내가 독후감을 쓴 책의 isbn 목록 가져오기
      data = await pool.query(
        "SELECT isbn FROM BOOKWEB.BookReportTB WHERE userid = ?",
        [req.session.userId]
      );
      const myBook = data;

      let bookList = [];
      for (const element of myBook) {
        bookList.push([element.isbn, 0]);
      }

      // 상위 3명 유저(similarUser[0]~[2])가 읽은 책 목록을 bookList에 업데이트, rating 추가
      // 상위 n명 유저에 대한 상수를 NUMOFUSER로 선언
      const NUMOFUSER = 3;
      let similar = [];
      for (let i = 0; i < NUMOFUSER; i++) {
        const data = await pool.query(
          "SELECT isbn, rating FROM BOOKWEB.BookReportTB WHERE userid = ?",
          [similarUser[i]]
        );
        similar.push(data[0]);
      }

      function RatingList(arr) {
        //[["isbn", raing1, rating2, ....], ...] 이렇게 추가함
        for (const element of arr) {
          let inBookList = 0;
          for (let j = 0; j < bookList.length; j++) {
            if (bookList[j][0] == element.isbn) {
              //이미 동일한 isbn이 리스트에 있을 시
              bookList[j].push(element.rating); //뒤에 rating 추가
              inBookList = 1;
              break;
            }
          }
          if (inBookList == 0)
            //동일한 isbn이 리스트에 없을 시
            bookList.push([arr[i].isbn, arr[i].rating]); //isbn과 rating을 리스트로 추가
        }
      }

      for (let i = 0; i < NUMOFUSER; i++) {
        RatingList(similar[i]);
      }

      //bookList에서 내가 읽은 것 제외
      for (let i = 0; i < myBook.length; i++) {
        for (let j = 0; j < bookList.length; j++) {
          if (bookList.length == 0) {
            break;
          }
          if (bookList[j][0] == myBook[i].isbn) {
            bookList.splice(j, 1);
          }
        }
      }

      //책마다 모든 rating 더해서 평균 구하기
      if (bookList.length === 0) {
        return res.json(bookList);
      }
      let averageRating = [];
      for (let i = 0; i < bookList.length; i++) {
        let sum = 0;
        for (let j = 1; j < bookList[i].length; j++) {
          sum += bookList[i][j];
        }
        const average = sum / NUMOFUSER;
        averageRating.push([bookList[i][0], average]);
      }

      //평점순으로 정렬
      averageRating.sort(function (a, b) {
        return b[1] - a[1];
      });

      //최고 평점인 책 최대 3개의 isbn 가져오기
      //평점 평균 상위 n권에 대한 상수를 NUMOFBOOK으로 선언
      const NUMOFBOOK = 3;
      let recBookIsbn = [];
      let count = 0;
      for (let i = 0; i < averageRating.length; i++) {
        if (count == NUMOFBOOK) {
          break;
        }
        recBookIsbn.push(averageRating[i][0]);
        count++;
      }

      // isbn 배열로 도서를 찾아서 도서 정보 리턴해줌
      let recBookArray = []; // 추천 도서의 정보 배열
      for (let i = 0; i < recBookIsbn.length; i++) {
        const data = await pool.query(
          "SELECT * FROM BOOKWEB.BookTB WHERE isbn = ?",
          [recBookIsbn[i]]
        );
        recBookArray[i] = data[0];
      }
      result = new Object();
      result.data = recBookArray;
      return res.json(
        Object.assign(result, { issuccess: true, message: "success" })
      );
    });

    // stderr에 대한 콜백
    process.stderr.on("data", function (data) {
      result = data.toString();
      return res.json(
        Object.assign(result, { issuccess: false, message: "error" })
      );
    });
  } catch (err) {
    return res.status(500).json(err);
  }
};
