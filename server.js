const http = require('http')
const request = require('request')
const https = require('https')
const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')
const uniqid = require('uniqid')
const sqlite3 = require('sqlite3')
const util = require('util')
const config = require('./config')
const path = require('path')

const privateKey = fs.readFileSync(config.https.privateKey, 'utf8')
const certificate = fs.readFileSync(config.https.certificate, 'utf8')

const app = express()
const db = new sqlite3.Database('bot.db')

app.use(express.static('static'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))

// parse application/json
app.use(bodyParser.json())

async function sendResponse(uid, text, parse_mode, reply_markup, disable_web_page_preview, photo, disable_notification, callback) {
    parse_mode = parse_mode || ''
    disable_web_page_preview = disable_web_page_preview || false
	disable_notification = disable_notification || false
    let method = 'sendMessage'
    let postData = {
        chat_id: uid,
        text: text,
        parse_mode: parse_mode,
        reply_markup: reply_markup,
        disable_web_page_preview: disable_web_page_preview,
		disable_notification: disable_notification
    }
    reply_markup = reply_markup || {}
    if (photo) {
		if (photo.startsWith('https')) {
			postData.photo = photo
			method = 'sendPhoto'
			delete postData.text
			postData.caption = text
		} else {
			postData.text = photo
		}
        // postData.caption = text
    }
    request.post(config.bot.token + method, {
            json: postData
        },
        (error, response, body) => {
			if (callback) {
            	if (error) callback(error)
            	else callback(response)
			}
        }
    )
}

let getUserToken = function(uid) {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE chatId = ?', [uid], (error, row) => {
            if (error) {
                reject(error)
            } else {
                resolve(row)
            }
        })
    })
}

let genUserToken = function(chatId) {
    return new Promise((resolve, reject) => {
        let token = uniqid()
        db.run('INSERT INTO users VALUES(?, ?)', [chatId, token], error => {
            if (error) {
                reject(error)
            } else {
                resolve(token)
            }
        })
    })
}

let removeUid = function(uid) {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM users WHERE chatId = ?', [uid], error => {
            if (error) reject(error)
            else resolve()
        })
    })
}

let genUUIDupperCase = function uuidU() {
    var s = [];
    var hexDigits = "0123456789ABCDEF";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuidU = s.join("");
    return uuidU;
}
let genUUIDlowerCase = function uuidL() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuidL = s.join("");
    return uuidL;
}

app.post('/inlineQuery', (req, resp) => {
    if (req.body.message.text && req.body.message.text === '/start') {
        let uid = req.body.message.chat.id
		let hintText = config.ui.startHint
        getUserToken(uid).then(row => {
            if (row) {
                sendResponse(uid, util.format(hintText, row.chatToken), 'Markdown', undefined, true)
                return Promise.reject(1)
            } else {
                console.log('not exist', uid)
                return genUserToken(uid)
            }
        }).then(token => {
            sendResponse(uid, util.format(hintText, token), 'Markdown', undefined, true)
        }).catch((error) => {
            console.log(error)
        })
    } else if (req.body.message.text && req.body.message.text === '/end') {
        let uid = req.body.message.chat.id
        removeUid(uid).then(() => {
            sendResponse(uid, config.ui.stopHint)
        }).catch(() => {
            sendResponse(uid, config.ui.errorHint)
        })
    }
    if (req.body.message.text && req.body.message.text === 'UUID') {
        sendResponse(uid, genUUIDupperCase(), 'Markdown', undefined, true)
    } else if (req.body.message.text && req.body.message.text === 'uuid') {
        sendResponse(uid, genUUIDlowerCase(), 'Markdown', undefined, true)
    }
    resp.send('hello')
})

app.post('/sendMessage/:token', (req, resp) => {
    console.log(req.body)
    db.get('SELECT * FROM users WHERE chatToken = ?', [req.params.token], (error, row) => {
        if (!error) {
            sendResponse(row.chatId, req.body.text, req.body.parse_mode, req.body.reply_markup, req.body.disable_web_page_preview, req.body.photo, req.body.disable_notification, (res) => {
                let respData = {
                    result: {
						body: res.body,
						statusCode: res.statusCode
					}
                }
                resp.json(respData)
            })
        } else {
            resp.json({
				result: config.ui.userNotExistHint
            })
        }
    })
})

app.get('/sendMessage/:token', (req, resp) => {
    console.log(req.query.parse_mode)
    db.get('SELECT * FROM users WHERE chatToken = ?', [req.params.token], (error, row) => {
        if (!error) {
            sendResponse(row.chatId, req.query.text, req.query.parse_mode, req.query.reply_markup, req.query.disable_web_page_preview, req.query.photo, req.query.disable_notification, (res) => {
                let respData = {
                    result: {
						body: res.body,
						statusCode: res.statusCode
					}
                }
                resp.json(respData)
            })
        } else {
            resp.json({
                result: config.ui.userNotExistHint
            })
        }
    })
})

app.get('/', (req, resp) => {
    console.log(req.url)
    resp.send(config.ui.httpsTestHint);
})

app.get('/redirectTo', (req, resp) => {
	resp.redirect(req.query.url)
})

app.get('/rulesets/smart/', (req, resp) => {
	console.log(req.url);
	let confFile = path.join(__dirname, 'potatso.json');
    fs.createReadStream(confFile).pipe(resp);
})

app.post('/rulesets/update/', (req, resp) => {
	resp.json({
		"status": 0,
		"data": []
	})
})

const httpsServer = https.createServer({
    key: privateKey,
    cert: certificate
}, app)

httpsServer.listen(443, config.https.domain, () => {
    console.log('listening on port 443')
})
