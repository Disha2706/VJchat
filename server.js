const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
var User = require("./models/user");
var Chat = require("./models/chats");
const dotenv = require("dotenv");

dotenv.config();

const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');
var config = require("./config/database");
var mongoose = require("mongoose");
var db_url=process.env.dbURL;

mongoose.connect(db_url, { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true, useUnifiedTopology: true });

const app = express();
const server = http.createServer(app);
const io = socketio(server);
app.set("view engine", "ejs");

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'SpadeChat Bot';

// Run when client connects
io.on('connection', socket => {

  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    var user1 = new User({
      username: user.username
    });
    user1.save();
    socket.join(user.room);

    // Welcome current user
    // Chat.find({ room: user.room }, function (err, x) {
    //   console.log(x);
    //   for (var i = 0; i < x.length; i++) {
    //     socket.emit('message', formatMessage(x[i].username, x[i].message));
    //   }
    // })
    socket.emit('message', formatMessage(botName, 'Welcome to SpadeChat!'));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  // Listen for chatMessage
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);
    var chat1 = new Chat({
      username: user.username,
      room: user.room,
      message: msg,
    })
    chat1.save();
    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);
    User.deleteMany({ username: user.username }, function (err) {

      if (err)
        return console.log(err);
    });
    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});

app.get("/", function (req, res) {
  res.render("index");
})
app.get("/admin", function (req, res) {
  User.find({}, function (err, users1) {
    if (err) { console.log("Error"); }
    else {
      res.render("joinchat", { type: "admin", users: users1 });
    }
  });
})
app.get("/client", function (req, res) {
  res.render("joinchat", { type: "client" });
})
app.get("/chat", function (req, res) {
  res.render("chat");
})

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
