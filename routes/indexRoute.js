const express = require("express");
const validator = require("validator");
const mysql = require("mysql");
const router = express.Router();
const axios = require("axios");

const connection = mysql.createConnection({
  host: "remotemysql.com",
  port: 3306,
  user: "TUKN9qkrxO",
  password: "b6JQaYWxLn",
  database: "TUKN9qkrxO"
});

function handleDisconnect() {
  connection.connect(function(err) {
    // The server is either down
    if (err) {
      // or restarting (takes a while sometimes).
      console.log("error when connecting to db:", err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    } // to avoid a hot loop, and to allow our node script to
  }); // process asynchronous requests in the meantime.
  // If you're also serving http, display a 503 error.
  connection.on("error", function(err) {
    console.log("db error", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      // Connection to the MySQL server is usually
      handleDisconnect(); // lost due to either server restart, or a
    } else {
      // connnection idle timeout (the wait_timeout
      throw err; // server constiable configures this)
    }
  });
}

handleDisconnect();

getBlogs = () => {
  axios
    .get(
      "https://www.googleapis.com/blogger/v3/blogs/7700064348074737886/posts?key=AIzaSyBlfj5LD1--6G3Eat9s5Rffg7I6C6h9Bwo"
    )
    .then(function(res) {
      // handle success
      let data = res.data;
      console.log(data);
    })
    .catch(function(err) {
      // handle error
      console.log(err);
    });
};
getBlogs();

let BCAC = 0;
let IMC = 0;
let BCA = 76;
let IM = 22;
let all = 0;

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index");
});

router.get("/delete:id", function(req, res) {
  const id = req.params.id.substring(1);
  //UPDATE `users` SET `ID` = ID + 100 WHERE `users`.`ID` = 1 ;
  connection.query(
    "UPDATE `users` SET `ID` = ID + 100 WHERE `users`.`ID` = " + id + ";",
    function(err, results, fields) {
      console.log(results);

      res.render("search", {
        err: false,
        scc: false,
        msg: "",
        lname: "",
        fname: "",
        id: ""
      });
    }
  );
});

router.get("/sid", function(req, res) {
  res.render("searchbyid", {
    err: false,
    scc: false,
    msg: "",
    lname: "",
    fname: "",
    id: ""
  });
});
router.post("/sid", function(req, res) {
  let { Year, rollno, section, clas } = req.body;
  let id = clas + Year + section + rollno;
  console.log(id);
  if (Year != "" && rollno != "" && section != "" && clas != "") {
    connection.query(
      "SELECT Fname,Lname,ID  FROM `users`  where UserID=" + id + ";",
      function(err, results, fields) {
        if (err) {
          res.render("searchbyid", {
            err: true,
            scc: false,
            msg: "something went wrong",
            lname: "",
            fname: "",
            id: ""
          });
        }

        if (results.length > 0) {
          console.log(results[0].Fname);
          res.render("searchbyid", {
            err: false,
            scc: true,
            msg: "",
            lname: results[0].Lname,
            fname: results[0].Fname,
            id: results[0].ID
          });
        } else {
          console.log("empty");
          res.render("searchbyid", {
            err: true,
            scc: false,
            msg: "no data found",
            lname: "",
            fname: "",
            id: ""
          });
        }
      }
    );
  }
});

router.get("/search", function(req, res) {
  res.render("search", {
    err: false,
    scc: false,
    msg: "",
    lname: "",
    fname: "",
    id: ""
  });
});

router.post("/search", function(req, res) {
  const id = req.body.search;
  if (id) {
    connection.query(
      "SELECT Fname,Lname  FROM `users`  where ID=" + id + ";",
      function(err, results, fields) {
        if (err) {
          res.render("search", {
            err: true,
            scc: false,
            msg: "something went wrong",
            lname: "",
            fname: "",
            id: ""
          });
        }

        if (results.length > 0) {
          console.log(results[0].Fname);
          res.render("search", {
            err: false,
            scc: true,
            msg: "",
            lname: results[0].Lname,
            fname: results[0].Fname,
            id: id
          });
        } else {
          console.log("empty");
          res.render("search", {
            err: true,
            scc: false,
            msg: "no data found",
            lname: "",
            fname: "",
            id: ""
          });
        }
      }
    );
  }
});

router.get("/register", function(req, res) {
  res.render("register", {
    check: false,
    type: "",
    msg: "",
    swal: false,
    id: ""
  });
});

router.post("/register", function(req, res) {
  let users;

  let { fname, Lname, email, Year, rollno, section, clas } = req.body;
  //console.log(fname,Lname,email,Year,rollno,section,clas);

  let ID = clas + Year + section + rollno;

  if (
    fname == "" ||
    Lname == "" ||
    email == "" ||
    Year == "" ||
    section == "" ||
    clas == ""
  ) {
    res.render("register", {
      check: true,
      type: "alert-danger",
      msg: "Please insert All value",
      swal: false,
      id: ""
    });
    return;
  }

  if (Year != "2017" && Year != "2018" && Year != "2019") {
    res.render("register", {
      check: true,
      type: "alert-danger",
      msg: "invalid year",
      swal: false,
      id: ""
    });
    return;
  }

  if (!validator.isEmail(email)) {
    res.render("register", {
      check: true,
      type: "alert-danger",
      msg: "invalid Email",
      swal: false,
      id: ""
    });
    return;
  }

  if (section != "1" && section != "2" && section != "3") {
    res.render("register", {
      check: true,
      type: "alert-danger",
      msg: "invalid Section",
      swal: false,
      id: ""
    });
    return;
  }

  if (clas != "1" && clas != "2") {
    res.render("register", {
      check: true,
      type: "alert-danger",
      msg: "invalid Course",
      swal: false,
      id: ""
    });
    return;
  }

  connection.query("SELECT * FROM `users`", function(err, results, fields) {
    if (err) {
      return console.log(err);
    }

    console.log(results);
    users = results;

    for (let item of users) {
      if (item.UserID == ID) {
        res.render("register", {
          check: true,
          type: "alert-danger",
          msg: "You are already Register",
          swal: false,
          id: ""
        });
        return;
      }
      if (item.Email == email) {
        res.render("register", {
          check: true,
          type: "alert-danger",
          msg: "this email Already Register",
          swal: false,
          id: ""
        });
        return;
      }
    }
  });

  if (clas == 1) {
    if (BCA <= BCAC) {
      res.render("register", {
        check: true,
        type: "alert-danger",
        msg: "Registration are Over",
        swal: false,
        id: ""
      });
      return;
    }
    BCAC++;
  } else {
    if (IM <= IMC) {
      res.render("register", {
        check: true,
        type: "alert-danger",
        msg: "Registration are Over",
        swal: false,
        id: ""
      });
      return;
    }
    IMC++;
  }

  all++;
  connection.query(
    "INSERT INTO `users` (`UserID`, `ID`, `Fname`, `Lname`, `Email`  ) VALUES ('" +
      ID +
      "', '" +
      all +
      "', '" +
      fname +
      "', '" +
      Lname +
      "', '" +
      email +
      "');",
    function(err, results, fields) {
      if (err) {
        res.render("register", {
          check: true,
          type: "alert-danger",
          msg: "Some thing Went Wrong",
          swal: false,
          id: ""
        });
        return console.log(err);
      }

      if (results) {
        res.render("register", {
          check: true,
          type: "alert-success",
          msg: "successfully registered",
          swal: true,
          id: all
        });

        return;
      }
    }
  );
});

module.exports = router;
