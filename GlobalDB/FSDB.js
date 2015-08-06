var fs = require('fs');
var rmdir = require('rimraf');
var crypto = require('crypto');
var shasum = crypto.createHash('sha1');
var wrench = require('wrench'),
    util = require('util');
    var recursive = require('recursive-readdir');
var execFileSync = require('exec-file-sync');
var moduleList = [];
var indexesList = [];

function isJson(str) {
   if(str.indexOf("{")!=-1){
    return true;
   }return false;
}
String.prototype.replaceAll = function(search, replace)
{
    //if replace is not sent, return original string otherwise it will
    //replace search string with 'undefined'.
    if (replace === undefined) {
        return this.toString();
    }

    return this.replace(new RegExp('[' + search + ']', 'g'), replace);
};


var child = require('child_process');

var rmdir = function(directories, callback) {
    if(typeof directories === 'string') {
        directories = [directories];
    }
    var args = directories;
    args.unshift('-rf');
    execFileSync('rm', args);
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
    if(fs.existsSync(source)){
    }else {
        fs.symlinkSync(dest, source, type);
    }
}



function addInStringIndex(indexName,path,key){
    module.exports.makeIndex(indexName,"string");
            var rootCurrIndex = "./indexes/"+indexName+"/";
            createDir(rootCurrIndex);
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
            console.log("arleady exist")
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
                    var id = fs.openSync(newRoot+moduleList[name][a]["name"],"w+");
                    fs.closeSync(id);


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
           // console.log(name,key,params);
           var path =  moduleList[name].root+computePath(key);

            for(var paramKey in params){
                if(paramKey in mod){
                    if(mod[paramKey]["type"].indexOf("PT")!=-1 && mod[paramKey]["type"].indexOf("Array")!=-1){
                                            console.log("add PT array",key);

                     //   console.log("array of pointer");
                        //get PT_ type
                        var type =  mod[paramKey]["type"].substring(mod[paramKey]["type"].indexOf("PT_")+3).replace(" ","");
                        
                        var pathLink = moduleList[type].root+computePath(params[paramKey]);

                        // console.log(pathLink,path+"/"+params[paramKey]);

                        createSymLink(pathLink,path+"/"+mod[paramKey]["name"]+"/"+params[paramKey],'dir');
                    }else if(mod[paramKey]["type"].indexOf("PT")!=-1){
                                            console.log("add PT",key);

                       // console.log("pointer");
                        //get PT_ type
                        var type =  mod[paramKey]["type"].substring(mod[paramKey]["type"].indexOf("PT_")+3).replace(" ","");


                        var pathLink = moduleList[type].root+computePath(params[paramKey]);
                        
                        // console.log(pathLink,path+"/"+params[paramKey]);

                        createSymLink(pathLink,path+"/"+params[paramKey],'dir');


                    }
                    else if(mod[paramKey]["type"].indexOf("file")!=-1){
                            var oldContent = fs.readFileSync(path+"/"+mod[paramKey]["name"],{encoding:"utf8"});
                            var fd = fs.openSync(path+"/"+mod[paramKey]["name"],"w+");
                            var toWrite = oldContent;
                            if(toWrite.length!=0){

                                
                            }else{
                                toWrite="";
                            }

                            if(isJson(params[paramKey])==true){
                                var io = JSON.parse(params[paramKey]);
                                if(toWrite.length==0){toWrite="{}"}
                                toWrite = JSON.parse(toWrite);

                                for(var l in io){
                                    toWrite[l]=io[l];

                                }
                                toWrite=JSON.stringify(toWrite);
                            }else{
                                toWrite=params[paramKey];
                            }

                            fs.writeSync(fd,toWrite);
                            fs.closeSync(fd);

                                if(mod[paramKey]["index"]){
                                    var obj =JSON.parse(params[paramKey]);
                                    var old=false;
                                    if(oldContent.length!=0){
                                           old=JSON.parse(oldContent);
                                    }         
                                    for(var i in mod[paramKey]["index"]){
                                        if(obj[i]!=undefined){
                                            if(old){
                                                console.log("UpdateIndex",old[i],obj[i]);

                                                module.exports.updateKeyIndex(mod[paramKey]["index"][i],old[i],obj[i],path);
                                            }else{
                                              addInStringIndex(mod[paramKey]["index"][i],path,obj[i]);

                                            }
                                        }
                                    }
                                }         
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


    },
    //modifie the content of a key
    updateIndexKeyPathLink:function(indexName,key,newPath){
         var path = "./indexes/"+indexName+"/";
                for(var i = 0; i < key.length;i++){
                    path+=key[i]+"/"
                }
                path+=key;
                if(fs.existsSync(path)){
                        var m = fs.readdirSync(path);
                        fs.unlinkSync(path+"/"+m[0]);
                         var name = newPath.split("/").join("-");
                        path+="/"+name.replace(".","");
                        createSymLink(newPath,path,"dir");

                }

    },
    updateKeyIndex:function(indexName,key,newKey,pathLink){

        var path =  "./indexes/"+indexName+"/";
        if(fs.existsSync(path)){
        for(var i = 0 ; i < key.length;i++){
            path+=key[i]+"/";
             if(fs.existsSync(path)){
                   var m = fs.readdirSync(path);
                   if(m.length<=1){
                    rmdir(path);
                    path = path.substr(0,path.length-2);
                    rmdir(path);  
                   }
             }else{
                break;
             }
        }
        }
        addInStringIndex(indexName, pathLink,newKey)
    },
   




}