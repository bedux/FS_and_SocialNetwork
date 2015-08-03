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



function makeKey()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVZ1234567890";

    for( var i=0; i < 15; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}



exports.logIn = function(name,pws,callback){

	var res = db.searchInIndex("userMail",name);
	if(res.length>0){
		console.log(res);
		var key = res[0].substr(res[0].lastIndexOf("/")+1,res[0].length);
		console.log(key,"asdas");
			fs.readFile(res[0]+"/"+UserModel.pwd["name"],"utf8" ,function (err, data) {
			  if (err) callback({status:"NoCredential"});
			  	if(data==pws){

			  		callback({status:"Done",key:key});

			  	}else{
			  		callback({status:"NoCredential"});
			  	}

			});
		}else{
            
            callback({status:"NoCredential"});
        }

}

exports.singIn = function(name,pws,mail,callback){
var res = db.searchInIndex("userMail",mail);
	if(!res){
		var key  = makeKey();
		db.addTableDB("User",key);
        db.addTableInfo("User",key,{pwd:pws,info:JSON.stringify({name:name,mail:mail})});
        callback({status:"Done",key:key});
                                         
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
			console.log(users[0],users[1],name)
			if(users[0]!=name){
					var userDir = fs.readlinkSync(path.join(pathh,fU[f])+"/"+users[0]);
					var f = fs.readFileSync(userDir+"/"+"Info.json",{encoding:"utf8"});
					res.push(JSON.parse(f));
			}else{
					var userDir = fs.readlinkSync(path.join(pathh,fU[f])+"/"+users[1]);
					var f = fs.readFileSync(userDir+"/"+"Info.json",{encoding:"utf8"});
					res.push(JSON.parse(f));

			}
	}
	callback(res);
}

exports.searchIndex= function(name,index,callback){

	db.getAllFromKey(index,name,callback);
}


exports.addFriends=function(yourKey,friendKey){

	  if(db.addTableDB("Friendship",yourKey+friendKey)!=false){

	    //for create a friendship 2->n
	    db.addTableInfo("User",yourKey,{friends:yourKey+friendKey});

	    db.addTableInfo("User",friendKey,{friends:yourKey+friendKey});

	    db.addTableInfo("Friendship",yourKey+friendKey,{user1:yourKey,user2:friendKey});
	    return true;
    }
    return false;
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
					var userDir = fs.readlinkSync(path.join(pathh,fU[f])+"/"+users[0]);
					var f = fs.readFileSync(userDir+"/"+"Info.json",{encoding:"utf8"});
					res.push(JSON.parse(f));
			}else{
					var userDir = fs.readlinkSync(path.join(pathh,fU[f])+"/"+users[1]);
					var f = fs.readFileSync(userDir+"/"+"Info.json",{encoding:"utf8"});
					res.push(JSON.parse(f));

			}
	}
	callback(res);
}

exports.addGroup = function(groupName,desc){

	var key = makeKey();
	 if(db.addTableDB("Group",key)){
	 	db.addTableInfo("Group",key,{info:JSON.stringify({name:groupName,desc:desc})});
	 	return true;
	 }else{
	 	return false;
	 }
}

exports.joinGroup = function(userKey,groupName){

	var data = db.searchInIndex("groupName",groupName);
	var group1 = data[0].substr(data[0].lastIndexOf("/")+1,data[0].length);
    if(db.addTableDB("UserGroup",userKey+group1)!=false){
        db.addTableInfo("UserGroup",userKey+group1,{user:userKey,group:group1});
        db.addTableInfo("Group",group1,{userGroup:userKey+group1});
        db.addTableInfo("User",userKey,{groups:userKey+group1});
        return true;
    }
    return false;
}


exports.changeUserMail = function(userKey,userMail){
	db.addTableInfo("User",userKey,{info:JSON.stringify({mail:userMail})});
}




