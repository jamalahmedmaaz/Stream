var context = require('rabbit.js').createContext('amqp://localhost');
var pub = context.socket('PUBLISH');


exports.post = function (request, response) {
    console.log(request);
    var bodyObject = request.body;
    response.send(JSON.stringify(bodyObject));
}

