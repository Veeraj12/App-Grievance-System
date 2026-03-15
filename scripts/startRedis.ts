import { exec } from "child_process"

exec("redis-server",(err)=>{

if(err){
console.log("Redis failed to start")
}else{
console.log("Redis server running")
}

})