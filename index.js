'use strict'
const request = require('request');
var config, userConfig = [];

module.exports = mattermost
module.exports.sendmsg = sendmsg
module.exports.sendmsgByUser = sendmsgByUser


/**
 * function for send error to mattermost
 * @param object of url and username 
 */
function mattermost(option) {
    config = JSON.parse(JSON.stringify(option));
    // webhook url of mattermost
    if (!option.url) throw new Error('URL required');
    // username which displays on mattermost
    if (!option.username) throw new Error('username required');
    return function mattermost(err, req, res, next) {
        try {
            let message = "#### Error occurred in " + option.username + ".\n";
            message += "Requested URL : " + req.protocol + "://" + req.subdomains + req.hostname + req.originalUrl + "\n";
            message += "Requested Method : " + req.method + "\n";
            message += "res.headersSent  : " + res.headersSent + "\n";
            message += "Body : \n " + JSON.stringify(req.body) + "\n";
            message += "Query String : \n " + JSON.stringify(req.query) + " \n";
            message += "Stack : \n ```\n " + err.stack + " \n``` \n";
            // post request for send message to mattermost
            let body = {
                text: message,
                username: option.username
            }
            if (option.icon_url) {
                body['icon_url'] = option.icon_url;
            }
            request.post({
                url: option.url,
                body: body,
                json: true
            }, function (error, response, body) {
                if (error) throw error;
            });
        } catch (e) {
            throw e;
        }
        next();
    }
}

/**
 * function for send custom message to mattermost
 * @param string message which sent to mattermost
 * @param object of url and username
 */
function sendmsg(message, option = null) {
    let url, username;
    if (!config && !option) throw new Error('required object of url and username');
    if (!message) throw new Error('message required');
    if (config) {
        url = config.url;
        username = config.username;
    }
    if (option != null && option.url) {
        url = option.url;
    }
    if (option != null && option.username) {
        username = option.username;
    }
    try {
        // post request for send message to mattermost
        let body = {
            text: message,
            username: username
        }
        if (config && config.icon_url) {
            body['icon_url'] = config.icon_url;
        }
        if (option != null && option.icon_url) {
            body['icon_url'] = option.icon_url;
        }
        if (option && option.image_url) {
            body['attachments'] = [{
                "image_url": option.image_url
            }];
        }
        request.post({
            url: url,
            body: body,
            json: true
        }, function (error, response, body) {
            if (error) throw error;
        });
    } catch (e) {
        throw e;
    }
}


/**
 * @param {object} option object contains userid, password, mattermost URL, message, channelid 
 */
function sendmsgByUser(message, option) {
    let apiToken = '',
        userid, password, mattermosturl, channelid;
    if (!message) throw new Error('required message');
    if (!config.userid && !option.userid) throw new Error('required userid');
    if (!config.password && !option.password) throw new Error('required password');
    if (!config.mattermosturl && !option.mattermosturl) throw new Error('required mattermost URL');
    if (!config.channelid && !option.channelid) throw new Error('required channelid');

    // set required parameter
    if (option && option.userid) {
        userid = option.userid;
    } else {
        userid = config.userid;
    }
    if (option && option.password) {
        password = option.password;
    } else {
        password = config.password;
    }
    if (option && option.mattermosturl) {
        mattermosturl = option.mattermosturl;
    } else {
        mattermosturl = config.mattermosturl;
    }
    if (option && option.channelid) {
        channelid = option.channelid;
    } else {
        channelid = config.channelid;
    }
    // if user aleredy loggedin then use earlier token 
    for (let inx in userConfig) {
        if (userConfig[inx].userid == userid) {
            apiToken = userConfig[inx].token;
            break;
        }
    }
    // if user is not loggedin then call api for login and set user's info in userConfig array
    if (apiToken == '') {
        request.post({
            url: 'https://' + mattermosturl + '/api/v4/users/login',
            body: {
                login_id: userid,
                password: password
            },
            json: true
        }, function (error, response, body) {
            if (error) throw error;
            userConfig.push({
                'userid': userid,
                'password': password,
                'token': response.headers.token
            });
            apiToken = response.headers.token;
            // function for sent message
            msgsent();
        });
    } else {
        // if user alerady logged in then sent message with old token
        msgsent();
    }

    //function for send message with optional file parameter
    function msgsent() {
        // if user send only message info
        if (!option || (option && !option.file && !option.filename)) {
            let props = {};
            if (option && option.image_url) {
                props['attachments'] = [{
                    "image_url": option.image_url
                }];
            }
            request.post({
                url: 'https://' + mattermosturl + '/api/v4/posts',
                headers: {
                    'Authorization': 'Bearer ' + apiToken
                },
                body: {
                    message: message,
                    channel_id: channelid,
                    props: props
                },
                json: true
            }, function (error, response, body) {
                if (error) throw error;
            });
        }
        // if user send message with file
        if (option && option.file && option.filename) {
            // api for upload file
            request.post({
                url: 'https://' + mattermosturl + '/api/v4/files?channel_id=' + channelid + '&filename=' + option.filename,
                headers: {
                    'Authorization': 'Bearer ' + apiToken,
                    "Content-Type": "multipart/form-data"
                },
                formData: {
                    files: option.file,
                    channel_id: channelid
                },
            }, function (error, response, body) {
                if (error) {
                    throw error
                } else {
                    body = JSON.parse(body);
                    let file_ids = [];
                    // set upload files id to create post api
                    for (let i in body.file_infos) {
                        file_ids[i] = body.file_infos[i].id;
                    }
                    // api for create post(message)
                    let props = {};
                    if (option && option.image_url) {
                        props['attachments'] = [{
                            "image_url": option.image_url
                        }];
                    }
                    request.post({
                        url: 'https://' + mattermosturl + '/api/v4/posts',
                        headers: {
                            'Authorization': 'Bearer ' + apiToken
                        },
                        body: {
                            message: message,
                            channel_id: channelid,
                            file_ids: file_ids,
                            props: props
                        },
                        json: true
                    }, function (err, res, body) {
                        if (err) throw err;
                    });
                }
            });
        }
    }
};