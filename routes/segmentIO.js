var amqp = require('amqp');
var amqpconnection = amqp.createConnection({
    host: 'turtle.rmq.cloudamqp.com',
    login: 'jpophmne',
    password: '8S64KCUj0fu5telpyNFdtfCLh0Nv1qHC',
    connectionTimeout: 0,
    vhost: 'jpophmne',
    noDelay: true,
    ssl: {
        enabled: true
    }
}, function (err, data) {
    if (err)
        console.error('we failed ' + err);
    else
        console.log('passssed ' + data);
});

exports.post = function (request, response) {
    //    console.log(request);
    var bodyObject = request.body;
    addToQueue(bodyObject);
    response.send(JSON.stringify(bodyObject));
}

function addToQueue(data) {
    var payload = createPOJO(data);
    sendToQueue(payload);
}

function createPOJO(data) {
    var segmentIOPayLoad = {};
    segmentIOPayLoad.data = data;
    segmentIOPayLoad.subType = 'SEGMENT_IO';
    return segmentIOPayLoad;
}

function compress() {}

function sendToQueue(segmentIOPayLoad) {


    console.log(JSON.stringify(segmentIOPayLoad));

    //console.log(connection);

    var exchange = amqpconnection.exchange('gainsight-click-stream-exchange', {
        type: 'fanout',
        durable: false
    }, function () {
        // Declaring a queue with a bogus name
        var queue = amqpconnection.queue('gainsight-click-stream-queue', {
            durable: false,
            exclusive: true
        }, function () {
            console.log("q234");
        });

        // callback when queue binding was successful...
        queue.on('queueBindOk', function () {
            console.log("BIND OK....");
        });

        exchange.publish("message.text", "NodeJS says HOWDY! " + Date.now());
    });

    console.log("-------");

}