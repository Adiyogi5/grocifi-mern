
exports.jsonObject = async(param)=>{
    if(typeof param == 'string'){
        param = JSON.parse(param);
        console.log(`Converting Into json through string`);
      }else{
         param = JSON.parse(JSON.stringify(param));
         console.log(`Converting  json into  string then Json`);
      }
      return param;
}