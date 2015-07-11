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
	fs.exists(UserModel.root+db.computePath(name),function(exist){
		console.log(exist);
		if(exist){
			console.log(UserModel.root+db.computePath(name)+"/"+UserModel.pwd);
			fs.readFile(UserModel.root+db.computePath(name)+"/"+UserModel.pwd,"utf8" ,function (err, data) {
			  if (err) throw err;
			  	if(data==pws){

			  		callback(true);

			  	}else{
			  		callback(false);
			  	}

			});
		}
	});

}


exports.getUserFriend= function(name,callback){
	var pathh = UserModel.root+db.computePath(name)+"/"+UserModel.friends;
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

exports.getUserGroups= function(name,callback){
	var pathh = UserModel.root+db.computePath(name)+"/"+UserModel.groups;
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