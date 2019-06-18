
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
Mattermost.sendmsg('Test Message');
```

If you want to use custom channel for send message pass option in second parameter url and username.
If you pass this parameter library will use passed parameter other wise it will use set parameter for error.
```
Mattermost.sendmsg('Test Message', {
   'url': 'mattermost_webhook_url',
   'username': 'Username which display on your mattermost channel'
});
```

## License

This project is licensed under the MIT License - see the license.md file for details
