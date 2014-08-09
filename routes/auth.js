//Required configuration 

exports.verifyAccessToken = function (req, res, next) {
  var accessKey = req.header('accessKey');
  if(!accessKey) {
      res.status(403);
      res.send('Unauthorized');
  }
  
    //gettting accesskey from Nodecache
  var nodecache = req.app.get('nodeCache');
  var cacheObj = nodecache.get(accessKey)[accessKey];
    console.log(JSON.stringify(cacheObj));
  if(!cacheObj) {
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
          nodecache.set(accessKey, {isValid:true}); 
          next();
        } else {
          nodecache.set(accessKey, {isValid:false}); 
          res.status(403);
          res.send('Unauthorized');
        }
      });
  } else {
      if(cacheObj.isValid) {
          next();
      } else {
          res.status(403);
          res.send('Unauthorized');
      }
  }
};