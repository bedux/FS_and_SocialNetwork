/**
 * Created by Bedux on 25/06/15.
 */
/**
 * Created by Bedux on 25/06/15.
 */

var Group_mod = {

    root:"./Groups/",

    key:{name:"",type:"string",index:["a1","name"]},

    userGroup:{name:"users",type:"Array PT_UserGroup"},

    info:{name:"Info.json",type:"file",index:{name:"groupName"}}

};

module.exports = {
    Group:Group_mod
}