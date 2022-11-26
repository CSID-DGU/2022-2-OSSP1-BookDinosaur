const pool = require("../pool");
const bcrypt = require("bcrypt");
const saltOrRounds = 10;

// id에 해당하는 유저가 있는지 찾고 bcrypt.compare로 비밀번호를 비교
// 성공하면 세션에 유저 정보 담아서 프론트로 넘겨줌
exports.login = async (req, res) => {
  const userid = req.body.userid;
  const password = req.body.password;

  try {
    const data = await pool.query(
      "SELECT * FROM BOOKWEB.UserTB WHERE userid = ?",
      [userid]
    );
    // id 유무 체크
    if (data.length != 0) {
      const userData = data[0];
      // password 체크
      const compare = await bcrypt.compare(password, userData.password);
      if (compare) {
        req.session.userId = userData.userid;
        req.session.nickname = userData.nickname;
        req.session.save((err) => {
          if (err) {
            console.log(err);
            return res.status(500).send("<h1>500 error</h1>");
          }
        });
        return res.json(
          Object.assign(req.session, { issuccess: true, message: "success" })
        );
      } else {
        return res.json({ issuccess: false, message: "wrong password" });
      }
    } else {
      return res.json({ issuccess: false, message: "no data" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.logout = async (req, res) => {
  if (req.session.userId) {
    await req.session.destroy(function (err) {
      if (err) throw err;
    });
    return res.json({ issuccess: true, message: "success" });
  } else {
    return res.json({ issuccess: false, message: "not login yet" });
  }
};

// id가 중복인지 체크하고 없으면 데이터 값 가지고 insert
exports.signup = async (req, res) => {
  const userid = req.body.userid;
  const password = req.body.password;
  const nickname = req.body.nickname;
  const age = req.body.age;
  const sexuality = req.body.sexuality;
  const preference = req.body.preference;

  const hashPassword = bcrypt.hashSync(password, saltOrRounds); // 암호화
  try {
    const data = await pool.query(
      "SELECT * FROM BOOKWEB.UserTB WHERE userid = ?",
      [userid]
    );
    // id 유무 체크 (로그인과 달리 중복 id가 없어야 함)
    if (data.length == 0) {
      pool.query(
        "INSERT INTO BOOKWEB.UserTB(userid, password, nickname, age, sexuality, preference) VALUES (?,?,?,?,?,?)",
        [userid, hashPassword, nickname, age, sexuality, preference]
      );
      return res.json({ issuccess: true, message: "register success" });
    } else {
      return res.json({ issuccess: false, message: "id is duplicated" });
    }
  } catch (err) {
    return res.json({ issuccess: false, message: "db error" });
  }
};

exports.getSession = async (req, res) => {
  try {
    return res.json(
      Object.assign(req.session, { issuccess: true, message: "success" })
    );
  } catch (err) {
    return res.status(500).json(err);
  }
};
