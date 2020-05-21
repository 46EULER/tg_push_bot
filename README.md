
### TG推送机器人 Telegram Push Notifications Bot
[更新日志 Update Log](https://github.com/46EULER/tg_push_bot#%E6%9B%B4%E6%96%B0%E6%97%A5%E5%BF%97)


Forked from [Fndroid/tg_push_bot](https://github.com/Fndroid/tg_push_bot)

[点我添加Bot --- Click here to add this bot to your telegram](https://t.me/begabung_bot) 

[在VPS/ECS上搭建Bot Server --- Creat your own Bot Server](SETUP.md)

[Chrome插件 --- Chrom Plugin](https://github.com/Fndroid/tg_notification_chrome)

### 推送消息 Push Notifications


[Nodejs及Python示例 --- demo for Node.JS && Python](https://github.com/46EULER/tg_push_bot/tree/master/examples)

```
// using get
curl -X GET https://tgmsgbot.begabung.site/notifyME/sendMessage/:Token?text=HelloWorld

// using post
curl -d "text=Helloworld&photo=https%3A%2F%2Fgithub.com%2F46EULER%2Ftg_push_bot%2Fblob%2Fmaster%2Fimgs%2Fphoto_2018-04-21_15-29-55.jpg%3Fraw%3Dtrue" -X POST https://tgmsgbot.begabung.site/notifyME/sendMessage/:Token
```


> GET调用的URL长度会有限制，所以如果要发送图片或者发送内容较长，请使用POST
> 
> Length of URL is limited by GET Method. POST Method is preferred if seding Picture or long text.

### 字段解释 description of parameters

参数Param Name|类型Type|必须Must-use|说明Description
-|-|-|-
text|String|True|发送的文字内容 --- Contained text
photo|URL String|False|发送的图片地址，支持HTTPS/HTTP --- Pic url. HTTPS/HTTP prefix is supported
parse_mode|String|False|发送文字内容的样式，可以是Markdown或HTML --- Type of contained text could be Markdown or HTML
reply_markup|JSON String|False|用于控制消息底下的操作按钮
disable_web_page_preview|Boolean|False|控制是否展示链接的卡片
disable_notification|Boolean|False|控制是否发送通知 --- Show device(Mac/iOS/Win etc.) notification or not.

> reply_markup可以参考：[Telegram Bot API](https://core.telegram.org/bots/api#sendmessage)

> 当photo存在时，text不必须存在（即可以单独发送图片）

### 隐私相关 Privicy

Bot不会识别和储存任何用户推送的消息，只会将推送消息发送给Telegram服务器。Bot只会记录用户会话ID，此ID是向Telegram推送消息的凭据。

This bot doesn't record or analysis any data pushed by end users. Messages received from user would be forword to Telegram Server directly.  Only ChatID is recorded while end user start using this bot. As you know, the ChatID is required by Telegram to push message correctly.

### 更新日志 Update Log
#### 2020.05.08
1. 增加uuid生成功能，向机器人发送‘UUID’可返回一串uuid。
~~2. 发送“/help”可返回简略的提示~~function of creating uuid string is online.



#### 2018.04.20

1. 增加POST请求支持，接受格式为``JSON``或``x-www-form-urlencoded``
2. 增加属性``parse_mode``、``reply_markup``和``disable_web_page_preview``设置，具体参考：[Telegram Bot API](https://core.telegram.org/bots/api#sendmessage)
3. 增加通过URL发送图片，字段为``photo``，参考：[Telegram Bot API](https://core.telegram.org/bots/api#sendphoto)，(如果有photo字段，则text自动理解为caption)
4. 请求改为同步返回并将对Telegram的请求响应直接回复给请求者

#### 2018.04.21

1. 支持属性``disable_notification``，可以静默发送消息，采集记录用途

#### 2018.04.22

1. 增加Chrome插件支持，可以通过插件向Telegram推送图片、链接和文字内容，具体参考：[TG推送插件](https://github.com/Fndroid/tg_notification_chrome)

#### 2018.04.24

1. 当图片地址为Http时，当作``text``处理

#### 2018.04.26

1. 给Telegram X增加一个推送非HTTP(S)链接的折中方法，将链接URL编码后链接到``https://tgbot.lbyczf.com/redirectTo?url=``后，在Telegram X打开后会重定向

#### 2018.04.27

1. 代码已经上传，可以参考[配置说明](SETUP.md)在自己的VPS/ECS上搭建Bot后台


### 感谢支持
![感谢](https://github.com/Fndroid/tg_push_bot)
