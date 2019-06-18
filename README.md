
# Overview

Mattermost-api library for node.js. Get notification when error or message arrive. 

We are using this library:  [request](https://github.com/request/request)


## Use

Install

`npm install mattermost-api`

JavaScript Code:

var Mattermost = require("mattermost-api");

const  express  =  require('express');

var  app  =  express();

// For handle error

```
app.use(Mattermost({
        'url': 'mattermost_webhook_url',
        'username': 'Username which display on your mattermost channel'
    }));
```

// For send message
```
Mattermost.sendmsg('Test Message');
```

// If you don't use error handler then you need to pass object 
```
Mattermost.sendmsg('Test Message', {
                'url': 'mattermost_webhook_url',
                'username': 'Username which display on your mattermost channel'
            });
```

## License

This project is licensed under the MIT License - see the license.md file for details