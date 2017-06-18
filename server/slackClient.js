/**
 * Created by Nishanth Reddy on 4/2/2017.
 */

'use strict';

const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
let rtm = null;
let nlp = null;
let registry = null;

function handleOnAuthenticated(rtmStartData) {
    console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
}

function handleONMessage(message){

    if (message.text.toLowerCase().includes('mybot')) {
        nlp.ask(message.text, (err, res) => {
            if (err) {
                console.log(err);
                return;
            }

            try {
                if (!res.intent || !res.intent[0] || !res.intent[0].value) {
                    throw new Error("Could not extract intent.")
                }

                const intent = require('../server/intents/' + res.intent[0].value.trim() + 'Intent');
                intent.process(res, registry, function(error, response){
                    if (error) {
                        console.log(error.message);
                        return;
                    }
                    return rtm.sendMessage(response, message.channel);
                })
            } catch (err) {
                console.log(err);
                console.log(res);
                return rtm.sendMessage("Sorry, I didn't know what you are talking about.", message.channel);
            }
        });
    }
}

function addAuthenticationHandler(rtm, handler){
    rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, handler);
}


module.exports.init = function slackClient(token, logLevel, nlpClient, serviceRegistry) {
    rtm = new RtmClient(token, {logLevel: logLevel});
    nlp = nlpClient;
    registry = serviceRegistry;
    addAuthenticationHandler(rtm, handleOnAuthenticated);
    rtm.on(RTM_EVENTS.MESSAGE, handleONMessage);
    return rtm;
}

module.exports.addAuthenticationHandler = addAuthenticationHandler;


