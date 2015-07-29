var fs = require('fs');
var rmdir = require('rimraf');
var crypto = require('crypto');
var shasum = crypto.createHash('sha1');
var wrench = require('wrench'),
    util = require('util');
    var recursive = require('recursive-readdir');

var moduleList = [];
var indexesList = [];

String.prototype.replaceAll = function(search, replace)
{
    //if replace is not sent, return original string otherwise it will
    //replace search string with 'undefined'.
    if (replace === undefined) {
        return this.toString();
    }

    return this.replace(new RegExp('[' + search + ']', 'g'), replace);
};


function generateNum(num){
         shasum = crypto.createHash('sha512');
        shasum.update(num);
        return shasum.digest('hex').substring(0,3);
}


function computePath(key){
        
        //console.log("compute payh ",key)
        return generateNum(key)+"/"+key;

}

function createDir(name,del){
    
    if(!fs.existsSync(name)){
        fs.mkdirSync(name);
        return true;
    }else{
        return false;
    }
}

function createDirWithBucket(path,key){
     //   console.log(" createDirWithBucket ",key,path)


        var num =generateNum(key)
       // console.log(num);
        if(!fs.existsSync(path+num)){
            createDir(path+num);
        }
        if(createDir(path+num+"/"+key)){
            return path+num+"/"+key+"/";
        }else{
            return false;
        }
    }


//pass relative path start with ./
function createSymLink(dest,source,type){

    var absolutePath = __dirname.replace("/GlobalDB","/");
    source=source.replace("./",absolutePath);
    dest=dest.replace("./",absolutePath);
           // console.log(dest,source);

    if(fs.existsSync(source)){

    }else {
        fs.symlinkSync(dest, source, type);
    }
}



function addInStringIndex(indexName,path,key){
            var rootCurrIndex = "./indexes/"+indexName+"/";
            for(i = 0; i < key.length ; i++){
                rootCurrIndex+=key[i];
                createDir(rootCurrIndex);
                rootCurrIndex+="/";
            }
            rootCurrIndex+=key;
            if(createDir(rootCurrIndex)){
            var name = path.split("/").join("-");
            rootCurrIndex+="/"+name.replace(".","");
            createSymLink(path,rootCurrIndex,"dir");
            }


}

function addInIntIndex(indexName,path,key){
            var rootCurrIndex = "./indexes/"+indexName+"/";

    
}

var dbName = "NoName";


module.exports = {

    dbName: function (name){dbName=name},

    addModuleDB: function (mod, name) {
        moduleList[name] = mod;
        mod.root="./"+dbName+mod.root.replace(".","");
        createDir(mod.root,true);
    },

    addTableDB: function (name, key) {


        if (!(name in moduleList)) {
            throw "Invalid Module Name";
            return false;
        }

        if(module.exports.searchInIndex(name,key)!=false){
            return false;
        }

        var newRoot = createDirWithBucket(moduleList[name].root,key);
        if(newRoot==false){
            return false;
        }

        module.exports.makeIndex(name,moduleList[name]["key"]["type"]);
        module.exports.addInIndex(name,newRoot,key);

        for(var inMo in moduleList[name]["key"]["index"]){

            module.exports.makeIndex(moduleList[name]["key"]["index"][inMo],moduleList[name]["key"]["type"]);
          //  console.log(key);
            module.exports.addInIndex(moduleList[name]["key"]["index"][inMo],newRoot,key);
        }


        for(var  a in moduleList[name]){
            if(a!="key"&& a!="root"){

                if(moduleList[name][a]["type"]=="file"){
                   // console.log("File");
                    fs.open(newRoot+moduleList[name][a]["name"],"w+",function(err,fd){

                        fs.close(fd,function(){

                        });
                    });


                }else  if(moduleList[name][a]["type"].indexOf("Array")!=-1){
                    createDir(newRoot+moduleList[name][a]["name"],false);
                }
            }
        }
        return newRoot;

    },

    addTableInfo:function(name,key,params){

            //compute path of the table
           var mod = moduleList[name];
           var path =  moduleList[name].root+computePath(key);

            for(var paramKey in params){
                if(paramKey in mod){

                    //case is an array of PT
                    if(mod[paramKey]["type"].indexOf("PT")!=-1 && mod[paramKey]["type"].indexOf("Array")!=-1){
                     //   console.log("array of pointer");
                        //get PT_ type
                        var type =  mod[paramKey]["type"].substring(mod[paramKey]["type"].indexOf("PT_")+3).replace(" ","");
                        
                        var pathLink = moduleList[type].root+computePath(params[paramKey]);

                        // console.log(pathLink,path+"/"+params[paramKey]);

                        createSymLink(pathLink,path+"/"+mod[paramKey]["name"]+"/"+params[paramKey],'dir');
                    }else if(mod[paramKey]["type"].indexOf("PT")!=-1){
                       // console.log("pointer");
                        //get PT_ type
                        var type =  mod[paramKey]["type"].substring(mod[paramKey]["type"].indexOf("PT_")+3).replace(" ","");


                        var pathLink = moduleList[type].root+computePath(params[paramKey]);
                        
                        // console.log(pathLink,path+"/"+params[paramKey]);

                        createSymLink(pathLink,path+"/"+params[paramKey],'dir');


                    }
                    else if(mod[paramKey]["type"].indexOf("file")!=-1){
                      //  console.log(path+"/"+mod[paramKey]["name"]);
                            fs.open(path+"/"+mod[paramKey]["name"],"w+",function(err,fd){
                                    fs.write(fd,params[paramKey]);
                                    fs.close(fd,function(err){
                                    })

                          });       
                    }


                }
            }
    },

    computePath:function(key){
        return generateNum(key)+"/"+key;

    },

    makeIndex:function(indexName,type){
            if(!(indexName in indexesList)){
                indexesList[indexName]=type;
                createDir("./indexes/"+indexName);
            }

    },

    searchInIndex:function(indexName,key){


                var path = "./indexes/"+indexName+"/";
                for(var i = 0; i < key.length;i++){
                    path+=key[i]+"/"
                }
                path+=key;
                if(fs.existsSync(path)){
                    var m = fs.readdirSync(path);
                    for(var dir in m){
                        m[dir]=fs.readlinkSync(path+"/"+m[dir]);
                    }
                    return m;
                }
                return false;

            

    },
    //let's say that the value is the path to the directory wich contain the actual value
    //get also the key to insert. you could add a key like ciao with inside the link of something call Gunio. Each node has a concrete dir with contain a link to the dir. The key doesn't be unique!

    addInIndex:function(indexName,path,key){
            switch(indexesList[indexName]){
                case "string":
                    addInStringIndex(indexName,path,key);
                    break;
                case "int":
                    addInIntIndex(indexName,path,key);
                    break;

            }


    },
    getAllFromKey: function(indexName,key,callback){
        var path = "./indexes/"+indexName;

                for(var i = 0; i < key.length;i++){
                    path+="/"+key[i]
                }

                   // console.log(path);
                    var allFiles = [];
                     recursive(path,function(err,data){
                            for(var d in data){

                                var realPath = fs.readlinkSync(data[d]);

                                 var type = realPath.substr(realPath.indexOf("/"+dbName+"/")+("/"+dbName+"/").length,realPath.length);

                                 type = type.substr(0,type.indexOf("/"));
                                 data[d]={path:realPath,type:type};

                            }
                            callback(data);

                     })
                   
                
                return false;


    }





}