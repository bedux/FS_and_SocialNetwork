var fs = require('fs');
var path = require('path');
var db = require('../GlobalDB/FSDB');


var exports = module.exports = {};

var UserModel = require('../GlobalDB/User').User;
var FriendshipModel = require('../GlobalDB/Friendship').Friendship;
var UserGroup = require('../GlobalDB/UserGroup').UserGroup;
var Group = require('../GlobalDB/Group').Group;


function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}







exports.logIn = function(name,pws,callback){

	var res = db.searchInIndex("User",name);
	console.log(res);
	if(res.length>0){
			console.log(res[0]+UserModel.pwd["name"]);
			fs.readFile(res[0]+UserModel.pwd["name"],"utf8" ,function (err, data) {
			  if (err) callback({status:"NoCredential"});
			  	if(data==pws){

			  		callback({status:"Done"});

			  	}else{
			  		callback({status:"NoCredential"});
			  	}

			});
		}else{
            
            callback({status:"NoCredential"});
        }

}

exports.singIn = function(name,pws,callback){

    if(db.addTableDB("User",name)!=false){ 
        
        db.addTableInfo("User",name,{pwd:pws});
        callback({status:"Done"});
                                         
    }else{
        callback({status:"ArleadyExists"});

    }

}

exports.getUserFriend= function(name,callback){
	var res = db.searchInIndex("User",name);
	if(res==false){
		callback({error:"Not user"});
		return;
	}
	var pathh = res[0]+UserModel.friends["name"];
	var fU = fs.readdirSync(pathh);
	var res= [];
	for(var f=0;f<fU.length;f++){
			var users = getDirectories(path.join(pathh,fU[f]));
			if(users[0]!=name){
					res.push({name:users[0]});
			}else{
					res.push({name:users[1]});

			}
	}
	callback(res);
}

exports.searchIndex= function(name,index,callback){

	db.getAllFromKey(index,name,callback);
}



exports.getUserGroups= function(name,callback){
	var res = db.searchInIndex("User",name);
	if(res==false){
		callback({error:"Not user"});
		return;
	}
	var pathh = res[0]+UserModel.groups["name"];
	var fU = fs.readdirSync(pathh);
	var res= [];
	for(var f=0;f<fU.length;f++){
			var users = getDirectories(path.join(pathh,fU[f]));
			if(users[0]!=name){
					res.push({name:users[0]});
			}else{
					res.push({name:users[1]});

			}
	}
	callback(res);
}