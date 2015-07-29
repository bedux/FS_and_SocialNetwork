var express = require('express');
var router = express.Router();
var query = require('../script/query');

/* GET home page. */
router.get('/:current', function(req, res, next) {
	console.log("asd",req.params.current)
  	query.searchIndex(req.params.current,"name",function(data){
  	res.json(data);
  });
    
});
module.exports = router;
