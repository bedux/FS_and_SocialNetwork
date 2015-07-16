var express = require('express');
var router = express.Router();
var query = require('../script/query');



/* GET home page. */
router.get('/friends/:current', function(req, res, next) {
	console.log("sono qui");
  	query.getUserFriend(req.params.current,function(data){
  	res.json({friends:data});
  });
    
});

router.get('/groups/:current', function(req, res, next) {
	console.log("sono qui");
  	query.getUserGroups(req.params.current,function(data){
  	res.json({groups:data});
  });
    
});



router.get('/', function(req, res, next) {


});



router.post('/', function(req, res, next) {
    
    console.log(req.body.user,req.body.pwd);
	query.logIn(req.body.user,req.body.pwd,function(resp){
        console.log(resp);
			if(resp.status=="Done"){
				//res.redirect("logged.html?user="+req.body.user);
                res.json({status:"logged"});
			}else{
                res.json({status:"NoLogged"})
			}
	});

});

router.post('/add', function(req, res, next) {
    
    console.log(req.body.user,req.body.pwd);
	query.singIn(req.body.user,req.body.pwd,function(resp){
        console.log(resp);
			if(resp.status=="Done"){
				//res.redirect("logged.html?user="+req.body.user);
                res.json({status:"logged"});
			}else{
                res.json({status:"NoLogged"})
			}
	});

});






module.exports = router;
