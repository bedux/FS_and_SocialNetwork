var fs = require('fs');
var rmdir = require('rimraf');
var crypto = require('crypto');
var shasum = crypto.createHash('sha1');

var moduleList = [];

function generateNum(num){
         shasum = crypto.createHash('sha512');
        shasum.update(num);
        return shasum.digest('hex').substring(0,3);
}


function computePath(key){
        
        return generateNum(key)+"/"+key;

}

function createDir(name,del){
    
    if(!fs.existsSync(name)){
        fs.mkdirSync(name);
    }
}

function createDirWithBucket(path,key){


        var num =generateNum(key)
       // console.log(num);
        if(!fs.existsSync(path+num)){
            createDir(path+num);
        }
        createDir(path+num+"/"+key);
        return path+num+"/"+key+"/";
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
            return;
        }

        var newRoot = createDirWithBucket(moduleList[name].root,key);

        for(var  a in moduleList[name]){
            if(a!="key"&& a!="root" && a.indexOf("Type")==-1){
                if(moduleList[name][a+"_Type"]=="file"){
                   // console.log("File");
                    fs.open(newRoot+moduleList[name][a],"w+");

                }else  if(moduleList[name][a+"_Type"].indexOf("Array")!=-1){
                   // console.log("Array");
                    createDir(newRoot+moduleList[name][a],false);
                }
            }
        }

    },

    addTableInfo:function(name,key,params){

            //compute path of the table
           var mod = moduleList[name];
           var path =  moduleList[name].root+computePath(key);

            for(var paramKey in params){
                if(paramKey in mod){

                    //case is an array of PT
                    if(mod[paramKey+"_Type"].indexOf("PT")!=-1 && mod[paramKey+"_Type"].indexOf("Array")!=-1){
                     //   console.log("array of pointer");
                        //get PT_ type
                        var type =  mod[paramKey+"_Type"].substring(mod[paramKey+"_Type"].indexOf("PT_")+3).replace(" ","");
                        
                        var pathLink = moduleList[type].root+computePath(params[paramKey]);

                        console.log(pathLink,path+"/"+params[paramKey]);

                        createSymLink(pathLink,path+"/"+mod[paramKey]+"/"+params[paramKey],'dir');
                    }else if(mod[paramKey+"_Type"].indexOf("PT")!=-1){
                       // console.log("pointer");
                        //get PT_ type
                        var type =  mod[paramKey+"_Type"].substring(mod[paramKey+"_Type"].indexOf("PT_")+3).replace(" ","");


                        var pathLink = moduleList[type].root+computePath(params[paramKey]);
                        
                        console.log(pathLink,path+"/"+params[paramKey]);

                        createSymLink(pathLink,path+"/"+params[paramKey],'dir');


                    }


                }
            }



    }

}