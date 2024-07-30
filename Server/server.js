const express       = require("express");
const cors          = require("cors");
const mysql         = require("mysql");
const app           = express();
const bcrypt        = require("bcrypt");
const session       = require("express-session");
const bodyParser    = require("body-parser");
const cookieParser  = require("cookie-parser");
const jwt           = require("jsonwebtoken");

const saltRounds = 10;

const verifyJWT     = (req, res, next) => {
    const token     = req.headers["x-access-token"];

    if(!token){
        res.send("Token is missing");
    }else{
        jwt.verify(token, "jwtSecret", (err, decoded) => {
            if(err){
                res.json({auth: false, message: "failed to authenticate"});
            }else{
                req.userId = decoded.id;
                next();
            }
        })
    }
}

app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(cookieParser());

app.use(bodyParser.urlencoded({extended:true}));

app.use(session({
    key: "userid",
    secret: "important",
    resave: false,
    saveUninitialized: false,
    cookies:{
        expires : 60 * 60 * 24,
    }
}))

app.use(express.json());

//dbCOnnected
const db      = mysql.createConnection({
    port:       3307,
    user:       'root',
    host:       'localhost',
    password:   '',
    database:   'employeeSystem'
});

//Employee Additions
//ADD EMPLOYEE
app.post("/create", (req, res) => {
    const name      = req.body.name;
    const age       = req.body.age;
    const team      = req.body.team;
    const position  = req.body.position;
    db.query('INSERT INTO employees (name,age,team,position) VALUES(?,?,?,?)',
        [name, age, team, position],
        (err,result) => {
            if(err){
                console.log(err);
            }else{
                res.send("Values Inserted");
            }
        });
});

//SHOW EMPLOYEE
app.get("/employees", (req,res) => {
    db.query('SELECT * FROM employees',
        (err,result) => {
            if(err){
                console.log(err);
            }else{
                res.send(result);
            }
        }
    )
});

//UPDATE EMPLOYEE
app.put("/update", (req, res) => {
    const id  = req.body.id;
    const age = req.body.age;
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
    const id = req.params.id;

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
app.post('/register', (req, res) => {
    const name      = req.body.name;
    const email     = req.body.email;
    const password  = req.body.password;

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if(err){
            res.send(err);
        }
        db.query('INSERT INTO admin (name,email,password) VALUES(?,?,?)',
        [name, email, hash],
        (err,result) => {
            if(err){
                console.log(err);
            }else{
                res.send("Admin Added");
            }
        });
    })
});

app.get('/isUserAuth', verifyJWT, (req,res) => {
    res.send("You are authenticated!")
})

// Admin Login
app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    db.query('SELECT * FROM admin WHERE email = ?', email, (err, result) => {
        if (err) {
            return res.status(500).send({ err: err });
        }

        if (result.length > 0) {
            bcrypt.compare(password, result[0].password, (err, isMatch) => {
                if (err) {
                    return res.status(500).send({ err: err });
                }

                if (isMatch) {
                    // Store only the relevant user information
                    const user = {
                        id: result[0].adminID,
                        name: result[0].name,
                        email: result[0].email
                    };

                    const token = jwt.sign({ id: user.id }, 'jwtSecret', {
                        expiresIn : 300,                        
                    })


                    req.session.user = user;
                    console.log(req.session.user);

                    res.json({auth: true, token: token, user: req.session.user})
                } else {
                    res.json({auth: false, message: "Wrong email or password"})
                }
            });
        } else {
            res.json({auth: false, message: "No user exists"})
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
            res.clearCookie('userid'); // clear the session cookie
            res.send({ message: 'Logout successful' });
        }
    });
});

//SERVER STARTED
app.listen(3010, ()=>{
    console.log("Server started running on Port 3010");
});