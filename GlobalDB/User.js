/**
 * Created by Bedux on 25/06/15.
 */

var User_mod = {

    root:"./Users/",

    key:{name:"",type:"string",index:["a1"]},

    friends:{name:"friends",type:"Array PT_Friendship"},
   // friends_Type:"Array PT_Friendship",

    info:{name:"Info.json",type:"file"},
    //info_Type:"file",

   
    pwd:{name:"pass.json",type:"file"},

    groups:{name:"groups",type:"Array PT_UserGroup"},

};

module.exports = {
    User:User_mod
}