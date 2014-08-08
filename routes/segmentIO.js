var context = require('rabbit.js').createContext('amqp://localhost');
var pub = context.socket('PUBLISH');

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
    pub.connect('SEGMENT_IO_SYNC');
    console.log(pub.write(JSON.stringify(segmentIOPayLoad), 'utf8'));

}