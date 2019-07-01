
# Overview

mattermost-api library is used for track node js error in mattermost and also used for custom message

## Version
V1.0.0

## Use

Download this library and run `npm install`

var Mattermost = require("mattermost-api");

const  express  =  require('express');

var  app  =  express();

If you set mattermost_webhook_url error message will throw in error in webhook url's channel
```
app.use(Mattermost({
   'url': 'mattermost_webhook_url',
   'username': 'Username which display on your mattermost channel'
}));
```

For send custom message
```
Mattermost.sendmsg('your message');
```

If you want to use custom channel for send message pass option in second parameter url and username.
If you pass this parameter library will use passed parameter other wise it will use set parameter for error.
```
Mattermost.sendmsg('your message', {
   'url': 'mattermost_webhook_url',
   'username': 'Username which display on your mattermost channel',
   'icon_url':'URL'(optional if you want to diffrent icon then you set in error)
   'image_url':'URL'(optional if you want to attach image)
});
```

For send custom message by user set these paramesters
```
app.use(Mattermost({
   'url': 'mattermost_webhook_url',
   'username': 'Username which display on your mattermost channel',
   'userid': 'userid',
   'password': 'password',
   'mattermosturl': 'your mattermost URL',
   'channelid': 'dwrgf5kzwib88gbjaozt59gpnw'
}));
```
Then use this function

```
Mattermost.sendmsgByUser('your message');
```

Also you can send message with diffrent user
```
Mattermost.sendmsgByUser('your message', {
        userid: 'userid',(optional or use set parameter for error)
        password: 'password',(optional or use set parameter for error)
        mattermosturl: 'your mattermost URL',(optional or use set parameter for error)
        channelid: 'w9yn5153kbgzf8g5fpppu3uuqr',(optional or use set parameter for error)
        file: data,data must be Buffer (optional if you want to upload file)
        filename: 'abc'(must use with file)
        image_url:'URL'(optional if you want to attach image)
});
```

## License

This project is licensed under the MIT License - see the license.md file for details
