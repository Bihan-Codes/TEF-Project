const express = require('express')

const router = express.Router()

const db = require('../db')


router.post('/login',(req,res)=>{
    
    const {gmail,password} = req.body

    const sql = "SELECT * FROM users WHERE gmail=? AND password=?"
    db.query(sql,[gmail,password],(err,result)=>{
        if (err) {
            console.error(err)
            return res.status(500).json({ message: "Server error" })
        }

        if (result.length > 0) {
            res.json({
                message: "Login successful",
                user: result[0]
            })
        } 
        else {
            res.status(401).json({
                message: "Invalid username or password"
            })
        }
    })

})

module.exports = router
