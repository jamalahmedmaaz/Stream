//Required configuration 

exports.verifyAccessToken = function (req, res, next) {
    var accessKey = req.header('accessKey');
    console.log('Found header: ' + accessKey);

    var mongo = req.app.get('mongoConnection');
    var collection = mongo.collection('accessKey');
    collection.findOne({
        'accessKeyHashed': accessKey
    }, ['tenantId', 'projectId'], function (err, object) {

        if (object && object.tenantId) {
            //console.log("Found", object);
            next();
        } else {
            res.status(403);
            res.send('Unauthorized');
        }
    });
}