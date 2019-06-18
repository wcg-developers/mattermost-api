'use strict'
const request = require('request');
var config;

module.exports = mattermost
module.exports.sendmsg = sendmsg
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
            request.post({
                url: option.url,
                body: {
                    text: message,
                    username: option.username
                },
                json: true
            }, async function (error, response, body) {
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
        request.post({
            url: url,
            body: {
                text: message,
                username: username
            },
            json: true
        }, async function (error, response, body) {
            if (error) throw error;
        });
    } catch (e) {
        throw e;
    }
}