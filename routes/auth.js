exports.verifyAccessToken = function (req, res, next) {
  var accessKey = req.header('accessKey');
  if (!accessKey) {
    res.status(403);
    res.send('Unauthorized');
    return;
  }

  // Get accesskey from Nodecache
  var nodecache = req.app.get('nodeCache');
  var cacheObj = nodecache.get(accessKey)[accessKey];

  if (!cacheObj) {
    console.log('Cache miss. Hit the mongo');
    var mongo = req.app.get('mongoConnection');
    var collection = mongo.collection('accessKey');
    collection.findOne({
      'accessKeyHashed': accessKey
    }, ['tenantId', 'projectId'], function (err, object) {

      if (object && object.tenantId) {
        //console.log("Found", object);
        nodecache.set(accessKey, {
          isValid: true
        });
        next();
      } else {
        nodecache.set(accessKey, {
          isValid: false
        });
        res.status(403);
        res.send('Unauthorized');
      }
    });
  } else {
    if (cacheObj.isValid) {
      next();
    } else {
      res.status(403);
      res.send('Unauthorized');
    }
  }
};
