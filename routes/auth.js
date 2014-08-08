//Required configuration 

exports.verifyAccessToken = function (req, res, next) {
  var accessKey = req.header('accessKey');
  var mongo = req.app.get('mongoConnection');
  if (!mongo) {
    res.status(500);
    res.send('Not yet intialized. Try after some time');
  }
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
};