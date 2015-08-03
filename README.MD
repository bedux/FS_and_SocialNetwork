login:
POST 127.0.0.1:3000/login    param: mail,pwd
return the key

sign in
POST 127.0.0.1:3000/login/add param: user,mail,pwd
return the key


get user friend
GET 127.0.0.1:3000/login/friends/key

get user group
GET 127.0.0.1:3000/login/groups/key


add a new group 
POST 127.0.0.1:3000/login/addGroup  param:groupName,desc 

add a new friends
POST 127.0.0.1:3000/login/addFriend param: yourKey,friendsKey

add user to group 
POST 127.0.0.1:3000/login/addUserToGroup param: userKey, groupName


modify user mail
POST 127.0.0.1:3000/login/changeMail param: key, mail
