


var UserModel = require('../GlobalDB/User').User;
var FriendshipModel = require('../GlobalDB/Friendship').Friendship;
var UserGroup = require('../GlobalDB/UserGroup').UserGroup;
var Group = require('../GlobalDB/Group').Group;
var dbName = "DatabaseItalia";

//set the db name


var DB = require('../GlobalDB/FSDB');
DB.dbName(dbName);
DB.addModuleDB(UserModel,"User");

DB.addModuleDB(FriendshipModel,"Friendship");

DB.addModuleDB(UserGroup,"UserGroup");

DB.addModuleDB(Group,"Group");



function createFriendship(name1,name2){
//create friendship
    DB.addTableDB("Friendship",name1+name2);
    //for create a friendship 2->n
    DB.addTableInfo("User",name1,{"friends":name1+name2});

    DB.addTableInfo("User",name2,{"friends":name1+name2});

    DB.addTableInfo("Friendship",name1+name2,{user1:name1,user2:name2});

}


function addUserToGroup(name1,group1){
    //create a user group
    DB.addTableDB("UserGroup",name1+group1);

    DB.addTableInfo("UserGroup",name1+group1,{user:name1,group:group1});

    DB.addTableInfo("Group",group1,{userGroup:name1+group1});

    DB.addTableInfo("User",name1,{groups:name1+group1});

}

////For create Users
//DB.addTableDB("User","MarcoBedulli");
//
//DB.addTableDB("User","PincoPallino");
//
////create Groups
//DB.addTableDB("Group","GlobalFS");


//create 21 user
for(var name =0; name <=200;name++){
    DB.addTableDB("User","User"+name);
}

//create 10 group
for(var name =0; name <=100;name++){
    DB.addTableDB("Group","Group"+name);
}

//create 40 random friendship
for(var n = 0;n<100;n++){
    var u1= Math.floor((Math.random() * 200));
    var u2= Math.floor((Math.random() * 200));
    if(u1!=u2){

        createFriendship("User"+u1,"User"+u2);
    }
}
//create 10 different froup
for(var n = 0;n<50;n++){
        DB.addTableDB("Group","Group"+n);
}


//assign random group for each users
for(var name =0; name <=200;name++){
    for(var i=0;i<10;i++) {
        var u2 = Math.floor((Math.random() * 50));
        addUserToGroup("User" + name, "Group" + u2);
    }

}






