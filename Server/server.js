const express = require("express");
const cors    = require("cors");
const mysql   = require("mysql");
const app     = express();

app.use(cors());
app.use(express.json());

const db      = mysql.createConnection({
    port:       3307,
    user:       'root',
    host:       'localhost',
    password:   '',
    database:   'employeeSystem'
});

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

app.put("/update", (req,res) => {
    const id  = req.body.id;
    const age = req.body.age;
    db.query('UPDATE employees SET age = ? WHERE id = ?',
        [age, id],
        (err,result) => {
            if(err){
                console.log(err);
            }else{
                res.send("Values Inserted");
            }
        });
});

app.delete("/delete", (req,res) => {

});

app.listen(3010, ()=>{
    console.log("Server started running on Port 3010");
});