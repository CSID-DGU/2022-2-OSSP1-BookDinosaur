const pool = require("../pool");

// id가 중복인지 체크하고 없으면 데이터 값 가지고 insert
exports.createUser = async (req, res) => {
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
