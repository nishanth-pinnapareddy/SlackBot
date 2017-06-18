/**
 * Created by Nishanth Reddy on 3/5/2017.
 */

'use strict';

const slackClient = require('../server/slackClient');
const service = require('../server/service');
const http = require('http');
const server = http.createServer(service);

const witToken = 'L33EHIF736CQ5PTVQ6NQWIUYVVOIDXFZ';
const witClient = require('../server/witClient')(witToken);

const slackToken = 'xoxb-163322015555-30r7oIBgbHU6RcLfDEVs7BG9';
const slackLogLevel = 'verbose';

const serviceRegistry = service.get('serviceRegistry');
const rtm = slackClient.init(slackToken, slackLogLevel, witClient, serviceRegistry);
rtm.start();

slackClient.addAuthenticationHandler(rtm, () => server.listen(3000));

server.on('listening', function () {
    console.log(`Slack_bot is listening in ${server.address().port} in ${service.get('env')} mode.`)
})


