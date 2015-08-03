var express = require('express');
var router = express.Router();
var query = require('../script/query');



/* GET home page. */
router.get('/friends/:current', function(req, res, next) {
  	query.getUserFriend(req.params.current,function(data){
  	res.json({friends:data});
  });
    
});

router.get('/groups/:current', function(req, res, next) {
  	query.getUserGroups(req.params.current,function(data){
  	res.json({groups:data});
  });
    
});




router.post('/addFriend',function(req,res,next){
	if(query.addFriends(req.body.yourKey,req.body.friendKey)){
		res.json({status:"done"});
	}else{
		res.json({status:"error"});

	}
});

router.post('/addGroup',function(req,res,next){
	if(query.addGroup(req.body.groupName,req.body.desc)){
		res.json({status:"done"});
	}else{
		res.json({status:"error"});

	}
});

router.post('/addUserToGroup',function(req,res,next){
	if(query.joinGroup(req.body.userKey,req.body.groupName)){
		res.json({status:"done"});
	}else{
		res.json({status:"error"});

	}
});



router.post('/', function(req, res, next) {
	query.logIn(req.body.mail,req.body.pwd,function(resp){
        console.log(resp);
			if(resp.status=="Done"){
                res.json(resp);
			}else{
                res.json(resp)
			}
	});

});

router.post('/add', function(req, res, next) {
    	query.singIn(req.body.user,req.body.pwd,req.body.mail,function(resp){
			if(resp.status=="Done"){
                res.json(resp);
			}else{
                res.json(resp)
			}
	});

});



router.post('/changeMail',function(req,res,next){
query.changeUserMail(req.body.key,req.body.mail);
res.json({status:"done"});

});





module.exports = router;
