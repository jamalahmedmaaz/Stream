var amqp = require('amqp');
var config = require('config');

var queueName = config.get('amq_queue_name');
var exchangeName = config.get('amq_exchange_name');
var exchange;
var queue;

// Open a connection
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
}, {
  defaultExchangeName: exchangeName,
  reconnect: true, // Enable reconnection
  reconnectBackoffStrategy: 'linear',
  reconnectBackoffTime: 1000, // Try reconnect once a second
});

// When connected create the exchange
amqpconnection.on('ready', function () {
  // declare the default exchange
  exchange = amqpconnection.exchange(exchangeName);
});

exports.post = function (request, response) {
  addToQueue(request.body);
  response.send(true);
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
  if (!exchange) {
    console.error('Payload skipped. Exchange is not yet ready', segmentIOPayLoad);
    return;
  }
  // publish a message
  exchange.publish(queueName, {
    body: segmentIOPayLoad
  });
}