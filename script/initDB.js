
var fs = require('fs')

var UserModel = require('../GlobalDB/User').User;
var FriendshipModel = require('../GlobalDB/Friendship').Friendship;
var UserGroup = require('../GlobalDB/UserGroup').UserGroup;
var Group = require('../GlobalDB/Group').Group;
var query = require('../script/query');

var dbName = "UK";
if(!fs.existsSync(dbName)){
        fs.mkdirSync(dbName);
    }
//set the db name
 

var DB = require('../GlobalDB/FSDB');
DB.makeIndex("userName","string");

DB.dbName(dbName);
DB.addModuleDB(UserModel,"User");

DB.addModuleDB(FriendshipModel,"Friendship");

DB.addModuleDB(UserGroup,"UserGroup");

DB.addModuleDB(Group,"Group");





function createFriendship(name1,name2){
//create friendship
    if(DB.addTableDB("Friendship",name1+name2)!=false){
    //for create a friendship 2->n
    DB.addTableInfo("User",name1,{"friends":name1+name2});

    DB.addTableInfo("User",name2,{"friends":name1+name2});

    DB.addTableInfo("Friendship",name1+name2,{user1:name1,user2:name2});
    }

}


function addUserToGroup(name1,group1){
    //create a user group

    if(DB.addTableDB("UserGroup",name1+group1)!=false){


        DB.addTableInfo("UserGroup",name1+group1,{user:name1,group:group1});

        DB.addTableInfo("Group",group1,{userGroup:name1+group1});

        DB.addTableInfo("User",name1,{groups:name1+group1});
    }

}

function makeMail(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVZ1234567890";
    var possibleMail = ["gmail","yahoo","hotmail","usi"];
    var possiblePref = ["it","com","ch","us","cn"];

    for( var i=0; i < Math.random()*15+2; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text+"@"+possibleMail[Math.floor(Math.random())*possibleMail.length]+"."+possiblePref[Math.floor(Math.random())*possiblePref.length];

}

function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVZ1234567890";

    for( var i=0; i < Math.random()*15+2; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function makeKey()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVZ1234567890";

    for( var i=0; i < 15; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

////For create Users
//DB.addTableDB("User","MarcoBedulli");
//
//DB.addTableDB("User","PincoPallino");
//
////create Groups
//DB.addTableDB("Group","GlobalFS");


//create 21 user
// for(var name =0; name <=20;name++){

//     if(DB.addTableDB("User","User"+name)!=false){
//        DB.addTableInfo("User","User"+name,{pwd:"123123123"});
//     }
// }

    //  if(DB.addTableDB("User","123")!=false){
    //    DB.addTableInfo("User","123",{pwd:"123123123",info:JSON.stringify({name:"asd",mail:makeMail()})});
    // }


    //    DB.addTableInfo("User","123",{pwd:"123123123",info:JSON.stringify({mail:makeMail()})});
    
    
    


