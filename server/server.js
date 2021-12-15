

const loopback = require('loopback');
const boot = require('loopback-boot');
var bodyParser = require('body-parser');
var path = require('path');
var http = require('http');
var https = require('https');
const app = module.exports = loopback();
var multer = require('multer');
const express = require('express');
let fs = require('fs');
var moment = require('moment-timezone');
const { v4: uuidv4 } = require('uuid');
app.use(bodyParser.urlencoded({ extended: true }));

var storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, 'client/views/uploads') },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`)
  }
})

var upload = multer({ storage: storage });

app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {

  const file = req.file;
  if (!file) {
    const error = new Error("Error");
    error.httpStatusCode = 400;
    return next(error);
  }
  res.send(file);
})

var server = null;

app.start = function () {
  //start the web server
  return app.listen(function () {
    app.emit('started');
    const baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      const explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
  // return server;
};



app.get('/login', function (req, res) {
  res.sendFile(path.join(__dirname, '/..', '/client/views/login/login.html'));
});

app.get('/create-blog', function (req, res) {
  res.sendFile(path.join(__dirname, '/..', '/client/views/index.html'));
});

app.get('/create-forum', function (req, res) {
  res.sendFile(path.join(__dirname, '/..', '/client/views/index.html'));
});

app.get('/edit-blog', function (req, res) {
  res.sendFile(path.join(__dirname, '/..', '/client/views/index.html'));
});

app.get('/editor-main', function (req, res) {
  res.sendFile(path.join(__dirname, '/..', '/client/views/index.html'));
});

app.get('/edit-public-editor-note', function (req, res) {
  res.sendFile(path.join(__dirname, '/..', '/client/views/index.html'));
});

app.get('/create-public-editor-note', function (req, res) {
  res.sendFile(path.join(__dirname, '/..', '/client/views/index.html'));
});

app.get('/manage-teenache', function (req, res) {
  res.sendFile(path.join(__dirname, '/..', '/client/views/index.html'));
});

app.get('/create-teenache', function (req, res) {
  res.sendFile(path.join(__dirname, '/..', '/client/views/index.html'));
});

app.get('/manage-public-editor-note', function (req, res) {
  res.sendFile(path.join(__dirname, '/..', '/client/views/index.html'));
});

app.get('/edit-private-editor-note', function (req, res) {
  res.sendFile(path.join(__dirname, '/..', '/client/views/index.html'));
});

app.get('/create-private-editor-note', function (req, res) {
  res.sendFile(path.join(__dirname, '/..', '/client/views/index.html'));
});

app.get('/manage-private-editor-note', function (req, res) {
  res.sendFile(path.join(__dirname, '/..', '/client/views/index.html'));
});

app.get('/edit-home-editor-note', function (req, res) {
  res.sendFile(path.join(__dirname, '/..', '/client/views/index.html'));
});

app.get('/create-home-editor-note', function (req, res) {
  res.sendFile(path.join(__dirname, '/..', '/client/views/index.html'));
});

app.get('/manage-home-editor-note', function (req, res) {
  res.sendFile(path.join(__dirname, '/..', '/client/views/index.html'));
});

app.get('/edit-forum', function (req, res) {
  res.sendFile(path.join(__dirname, '/..', '/client/views/index.html'));
});

app.get('/manage-forum', function (req, res) {
  res.sendFile(path.join(__dirname, '/..', '/client/views/index.html'));
});

app.get('/manage-blog', function (req, res) {
  res.sendFile(path.join(__dirname, '/..', '/client/views/index.html'));
});

app.get('/manage-contactus', function (req, res) {
  res.sendFile(path.join(__dirname, '/..', '/client/views/index.html'));
});

app.get('/create-customer', function (req, res) {
  res.sendFile(path.join(__dirname, '/..', '/client/views/index.html'));
});

app.get('/edit-customer', function (req, res) {
  res.sendFile(path.join(__dirname, '/..', '/client/views/index.html'));
});

app.get('/manage-customer', function (req, res) {
  res.sendFile(path.join(__dirname, '/..', '/client/views/index.html'));
});

app.get('/dashboard', function (req, res) {
  res.sendFile(path.join(__dirname, '/..', '/client/views/index.html'));
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/..', '/client/views/login/login.html'));
});

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname);

if (require.main === module) {
  //Comment this app.start line and add following lines
  //app.start();
  app.io = require('socket.io')(app.start());


  app.io.on('connection', function (socket) {

    const Customer = app.models.Customer;
    const PrivateChat = app.models.PrivateChat;
    const CustomerChatList = app.models.CustomerChatList;
    const ChatList = app.models.ChatList;
    const FriendList = app.models.FriendList;
    const Groups = app.models.Groups;
    const GroupChat = app.models.GroupChat;
    const FriendRequest = app.models.FriendRequest;
    const ReadedOfMsg = app.models.ReadedOfMsg;

    console.log("user connected");

    socket.on('priReqAccOrRej', data => {

      if (data) {

        let date = `${moment.tz(new Date(), 'Asia/Kolkata').format('YYYY-MM-DD')}T00:00:00.000Z`,
          dateFormat = moment.tz(new Date(), 'Asia/Kolkata').format('DD/MM/YYYY'),
          time = moment.tz(new Date(), 'Asia/Kolkata').format('hh:mm a');

        let { id, isAccepted } = data;

        if (id) {
          if (isAccepted) {
            FriendRequest.upsertWithWhere({ id }, {
              isAccepted, acceptTime: time,
              acceptDateFormat: dateFormat, acceptDate: date
            }, (err, res) => {
              if (res) {
                let { requestId, acceptId } = res;
                CustomerChatList.upsertWithWhere({ customerId: requestId }, { customerId: requestId }, (crErr, crRes) => {
                  if (crRes) {
                    FriendList.create({ customerChatListId: crRes.id, friendRequestId: res.id, customerId: acceptId })
                  }
                })
                CustomerChatList.upsertWithWhere({ customerId: acceptId }, { customerId: acceptId }, (crErr, crRes) => {
                  if (crRes) {
                    FriendList.create({ customerChatListId: crRes.id, friendRequestId: res.id, customerId: requestId })
                  }
                })
              }
            })
          } else {
            FriendRequest.deleteById(id)
          }
        }
      }
    });

    socket.on('privateRequest', data => {

      if (data) {

        let date = `${moment.tz(new Date(), 'Asia/Kolkata').format('YYYY-MM-DD')}T00:00:00.000Z`,
          dateFormat = moment.tz(new Date(), 'Asia/Kolkata').format('DD/MM/YYYY'),
          time = moment.tz(new Date(), 'Asia/Kolkata').format('hh:mm a');

        let { requestId, senderId, isPrivate } = data;

        FriendRequest.upsertWithWhere({ acceptId: senderId }, {
          date, dateFormat, time, requestId, acceptId: senderId, isPrivate
        });

        Customer.findOne({ where: { id: senderId } }, (err, res) => {
          if (res && res.socketId) {
            app.io.to(res.socketId).emit("new-request", { message: "Success" });
          }
        })

        Customer.findOne({ where: { id: requestId } }, (err, res) => {
          if (res && res.socketId) {
            app.io.to(res.socketId).emit("new-request", { message: "Success" });
          }
        })
      }
    });

    socket.on('userconnected', data => {
      if (data && data.customerId && socket && socket.id) {
        let { customerId } = data;
        if (customerId) {
          Customer.upsertWithWhere({ id: customerId }, { socketId: socket.id, isOnline: true }, () => {
            Customer.find({ where: { isOnline: true } }, (fErr, fRes) => {
              if (fRes && fRes.length) {
                for (let data of fRes) {
                  app.io.to(data.socketId).emit("after-connect-emit", { message: "Success" });
                }
              }
            })
          });
        }
        else socket.emit('userconnected', { data: { Error: 'No CsutomerId. Please try again' } })
      }
    });

    socket.on("group-msg-read", (data) => {
      if (data) {
        let { customerId, msgIds } = data;
        if (msgIds && customerId) {
          for (let obj of msgIds) {
            ReadedOfMsg.upsertWithWhere({ groupChatId: obj.msgId, customerId, isReaded: true }, { groupChatId: obj.msgId, customerId, isReaded: true })
          }
        }
      }
    });

    socket.on("groupmsg", (data) => {
      if (data) {
        let { groupId, msg, fromId } = data;
        if (groupId) {
          Groups.findOne({ where: { id: groupId }, include: [{ relation: "groupContacts", scope: { include: [{ relation: "customer" }] } }] }, (gErr, gRes) => {
            gRes = JSON.parse(JSON.stringify(gRes));
            if (groupId = gRes.id) {
              if (gRes && gRes.groupContacts) {
                let date = `${moment.tz(new Date(), 'Asia/Kolkata').format('YYYY-MM-DD')}T00:00:00.000Z`,
                  dateFormat = moment.tz(new Date(), 'Asia/Kolkata').format('DD/MM/YYYY');
                time = moment.tz(new Date(), 'Asia/Kolkata').format('hh:mm a');
                let uuid = uuidv4();

                for (let { customer } of gRes.groupContacts) {
                  if (fromId != customer.id) {
                    console.log(msg, customer.username, customer.id, fromId);
                    app.io.to(customer.socketId).emit("groupmsg", { msg, groupId, fromId });
                  }
                }
                let time_order = (new Date()).getTime();
                Groups.upsertWithWhere({ id: groupId }, { time_order }, (er, r) => {
                  time_order = (new Date()).getTime();
                  ChatList.upsertWithWhere({ groupsId: groupId }, { time_order }, (err, rress) => {
                    time_order = (new Date()).getTime();
                    GroupChat.create({
                      time_order: (new Date()).getTime(), uuid, msg, groupsId: groupId,
                      senderId: fromId, time, dateFormat, date
                    }, (gChErr, gChRes) => {
                      ReadedOfMsg.upsertWithWhere({ groupChatId: gChRes.id, customerId: fromId, isReaded: true }, { groupChatId: gChRes.id, customerId: fromId, isReaded: true })
                    })
                  })
                })
              }
            }
          })
        }
      }
    })

    socket.on('msg-readed', (msgdata) => {
      if (msgdata) {
        let { uuid } = msgdata;
        if (uuid) PrivateChat.updateAll({ uuid }, { msg_readed: true })
      }
    })

    socket.on("privatemessage", (user, message) => {
      user = JSON.parse(JSON.stringify(user));
      if (user && user.from && user.to) {
        let { from, to } = user;

        //from details
        CustomerChatList.upsertWithWhere({ customerId: from }, { customerId: from }, (err, res) => {
          if (res) {
            let { id } = res;
            ChatList.upsertWithWhere({ customerId: to, customerChatListId: id }, { customerId: to, customerChatListId: id, time_order: (new Date()).getTime() }, (chErr, chRes) => {
              let date = `${moment.tz(new Date(), 'Asia/Kolkata').format('YYYY-MM-DD')}T00:00:00.000Z`,
                dateFormat = moment.tz(new Date(), 'Asia/Kolkata').format('DD/MM/YYYY');
              time = moment.tz(new Date(), 'Asia/Kolkata').format('hh:mm a');
              let uuid = uuidv4();
              PrivateChat.create({
                send_msg: message, send_time: time, send_date_format: dateFormat, msg_readed: false,
                isSend: true, time_order: (new Date()).getTime(), send_date: date, uuid, chatListId: chRes.id
              })
            })
          }
        })

        Customer.findOne({ where: { id: user.to } }, (err, res) => {
          if (res && res.socketId) {

            console.log(" message ", message, " user from ", from, " user to ", to);

            CustomerChatList.upsertWithWhere({ customerId: to }, { customerId: to }, (cclerr, clcres) => {
              if (clcres) {
                let { id } = clcres;
                ChatList.upsertWithWhere({ customerId: from, customerChatListId: id }, { customerId: from, customerChatListId: id, time_order: (new Date()).getTime() }, (chErr, chRes) => {
                  let date = `${moment.tz(new Date(), 'Asia/Kolkata').format('YYYY-MM-DD')}T00:00:00.000Z`,
                    dateFormat = moment.tz(new Date(), 'Asia/Kolkata').format('DD/MM/YYYY');
                  time = moment.tz(new Date(), 'Asia/Kolkata').format('hh:mm a');
                  let uuid = uuidv4();
                  app.io.to(res.socketId).emit("privatemessage", { message, user, uuid, msg_readed: false, customerChatListId: id });
                  PrivateChat.create({
                    send_msg: message, send_time: time, send_date_format: dateFormat, msg_readed: false,
                    isSend: false, time_order: (new Date()).getTime(), send_date: date, uuid, chatListId: chRes.id
                  })
                })
              }
            })
          }
        })
      }
    });

    socket.on('disconnect', function (data) {
      if (socket && socket.id) {
        Customer.upsertWithWhere({ socketId: socket.id }, { isOnline: false }, () => {
          Customer.find({ where: { isOnline: true } }, (fErr, fRes) => {
            if (fRes && fRes.length) {
              for (let data of fRes) {
                app.io.to(data.socketId).emit("after-connect-emit", { message: "Success" });
              }
            }
          })
        })
      }
      console.log('user disconnected');
    });
  });
}
