const Username = document.getElementById('username').value;
const Room = document.getElementById('room');
const Client = document.getElementById('client');
const Form = document.getElementById('form');

function myFunction() {
    const Username = document.getElementById('username').value;
    document.getElementById('room').value = Username
}

// var User = require("./models/user");
// function myFunction() {
//     const Username = document.getElementById('username').value;
//     var user1 = new User({
//         username: Username
//     });
//     user1.save(function (err) {

//         if (err)
//             return console.log(err);
//         else {
//             // User.find({}, function (err, users1) {
//             document.getElementById('room').value = users1.username;
//             // })
//         }

//     });

// }