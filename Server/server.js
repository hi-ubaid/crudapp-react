const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const app = express();
const bcrypt = require("bcrypt");
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

const saltRounds = 10;

const verifyJWT = (req, res, next) => {
    const token = req.headers["x-access-token"];

    if (!token) {
        res.send("Token is missing");
    } else {
        jwt.verify(token, "jwtSecret", (err, decoded) => {
            if (err) {
                res.json({ auth: false, message: "Failed to authenticate" });
            } else {
                req.userId = decoded.id;
                next();
            }
        });
    }
};

app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    key: "userid",
    secret: "important",
    resave: false,
    saveUninitialized: false,
    cookies: {
        expires: 60 * 60 * 24,
    }
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Setup Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error("Only .jpeg, .jpg and .png files are allowed"));
        }
    }
});

//dbConnected
const db = mysql.createConnection({
    port: 3307,
    user: 'root',
    host: 'localhost',
    password: '',
    database: 'employeeSystem'
});

//Employee Additions
//ADD EMPLOYEE
app.post("/create", (req, res) => {
    const { name, age, team, position } = req.body;
    db.query('INSERT INTO employees (name, age, team, position) VALUES (?, ?, ?, ?)',
        [name, age, team, position],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Error inserting employee");
            } else {
                res.send("Employee added");
            }
        });
});

//SHOW EMPLOYEE
app.get("/employees", (req, res) => {
    db.query('SELECT * FROM employees', (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error fetching employees");
        } else {
            res.send(result);
        }
    });
});

//UPDATE EMPLOYEE
app.put("/update", (req, res) => {
    const { id, age } = req.body;
    db.query('UPDATE employees SET age = ? WHERE id = ?',
        [age, id],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Error updating employee");
            } else {
                res.send("Employee updated");
            }
        });
});

//DELETE EMPLOYEE
app.delete("/delete/:id", (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM employees WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error deleting employee");
        } else {
            res.send("Employee deleted");
        }
    });
});

//ADMINS
//Admin registered
app.post('/register', upload.single('profilePicture'), (req, res) => {
    const { name, email, password } = req.body;
    const profilePicture = req.file ? req.file.filename : null;
    console.log('Uploaded file:', profilePicture); // Log the filename
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            console.error("Error hashing password:", err);
            return res.status(500).send("Error processing request.");
        }

        db.query('INSERT INTO admin (name, email, password, profilePicture) VALUES (?, ?, ?, ?)',
            [name, email, hash, profilePicture],
            (err, result) => {
                if (err) {
                    console.error("Error inserting into database:", err);
                    return res.status(500).send("Error processing request.");
                } else {
                    res.send("Admin added");
                }
            });
    });
});

app.get('/isUserAuth', verifyJWT, (req, res) => {
    res.send("You are authenticated!");
});

// Admin Login
// Admin Login
app.post('/login', (req, res) => {
    const { email, password, isAdmin } = req.body;
  
    if (isAdmin) {
      // Super admin login logic (assuming super admin table is named superAdmin)
      db.query('SELECT * FROM superAdmin WHERE email = ?', [email], (err, result) => {
        if (err) return res.status(500).send({ err });
  
        if (result.length > 0) {
          if (password === result[0].password) {
            const user = {
              id: result[0].adminID,
              name: result[0].name,
              email: result[0].email,
              profilePicture: result[0].profilePicture,
              isSuperAdmin: true
            };
  
            const token = jwt.sign({ id: user.id }, 'jwtSecret', { expiresIn: 300 });
            req.session.user = user;
            res.json({ auth: true, token, user });
          } else {
            res.json({ auth: false, message: "Wrong email or password" });
          }
        } else {
          res.json({ auth: false, message: "No user exists" });
        }
      });
    } else {
      // Regular admin login logic
      db.query('SELECT * FROM admin WHERE email = ?', [email], (err, result) => {
        if (err) return res.status(500).send({ err });
  
        if (result.length > 0) {
          if (result[0].status === 0) {
            return res.json({ auth: false, message: "Your account has been disabled" });
          }
  
          bcrypt.compare(password, result[0].password, (err, isMatch) => {
            if (err) return res.status(500).send({ err });
  
            if (isMatch) {
              const user = {
                id: result[0].adminID,
                name: result[0].name,
                email: result[0].email,
                profilePicture: result[0].profilePicture,
                isSuperAdmin: false
              };
  
              const token = jwt.sign({ id: user.id }, 'jwtSecret', { expiresIn: 300 });
              req.session.user = user;
              res.json({ auth: true, token, user });
            } else {
              res.json({ auth: false, message: "Wrong email or password" });
            }
          });
        } else {
          res.json({ auth: false, message: "No user exists" });
        }
      });
    }
  });
  
// Update admin status
app.put('/admin/status', (req, res) => {
    const { adminID, status } = req.body;
  
    db.query('UPDATE admin SET status = ? WHERE adminID = ?', [status, adminID], (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error updating admin status");
      } else {
        res.send("Admin status updated");
      }
    });
  });
  
// Get all admins
app.get('/admins', (req, res) => {
    db.query('SELECT * FROM admin', (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error fetching admins");
        } else {
            res.send(result);
        }
    });
});

// Check Login Status
app.get("/login", (req, res) => {
    if (req.session.user) {
        res.send({ loggedIn: true, user: req.session.user });
    } else {
        res.send({ loggedIn: false, user: null });
    }
});

// Logout route
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send({ message: 'Logout failed' });
        } else {
            res.clearCookie('userid');
            res.send({ message: 'Logout successful' });
        }
    });
});

//SERVER STARTED
app.listen(3010, () => {
    console.log("Server started running on Port 3010");
});
