const mysql = require ('mysql2')

const db = mysql.createConnection({
    host : "localhost",
    user: "root",
    password : "Root@123",
    database : "project"
})

db.connect((err)=>{
    if (err){
        console.error("Database Connection failed: ", err)
        return
    }
    console.log("MySQL Connected!")
})

module.exports = db