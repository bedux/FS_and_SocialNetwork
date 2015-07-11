/**
 * Created by Bedux on 25/06/15.
 */

var User_mod = {

    root:"./Users/",

    key:"",
    key_Type:"String",

    friends:"friends",
    friends_Type:"Array PT_Friendship",

    info:"Info.json",
    info_Type:"file",

    groups:"groups",
    groups_Type:"Array PT_UserGroup"

};

module.exports = {
    User:User_mod
}