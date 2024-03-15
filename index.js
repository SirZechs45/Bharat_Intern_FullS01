var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")

const app = express()

app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:true
}))

mongoose.connect('mongodb://localhost:27017/Database')
var db = mongoose.connection
db.on('error', ()=>console.log("Error while Database Connection"))
db.once('open', ()=>console.log("Database Connection Successful"))

function isUsernameUnique(username, callback) {
    db.collection('users').findOne({ 'username': username }, (err, result) => {
        if (err) {
            throw err;
        }
        callback(result === null);
    });
}
app.post("/signup", (req, res) => {
    var name = req.body.name;
    var uname = req.body.uname;
    var email = req.body.email;
    var phone = req.body.phone;
    let genderRadios = req.body.gender;
    var password = req.body.password;
    var password2 = req.body["confirm-password"];

    if (password !== password2) {
        return res.redirect("pass_err.html");
    }
    if (phone.length != 10) {
        return res.redirect("phone_err.html");
    }

    
    isUsernameUnique(uname, (isUnique) => {
        if (!isUnique) {
            return res.redirect("usern_err.html");
        }

        var data = {
            "fullname": name,
            "username": uname,
            "email": email,
            "phone": phone,
            "gender": genderRadios,
            "password": password
        };

        db.collection("users").insertOne(data, (err, collection) => {
            if (err) {
                throw err;
            }
            console.log("Record Inserted Successfully");
        });

        return res.redirect("signup_success.html");
    });
});


app.get("/", (req, res)=>{
    res.set({
        "Allow-access-Allow-Origin":"*"
    })
    return res.redirect('index.html')
}).listen(3000)

console.log("Listening to port 3000")