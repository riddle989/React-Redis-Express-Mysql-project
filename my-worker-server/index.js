import express from "express";
import { createClient } from "redis";
import mysql from "mysql2";


// const app = express();

const sqlDbConfig = {
    host: "localhost",
    database: "testdb",
    user: "riddle1",
    password: "65006500"
};

const redisUrl = "redis://:@localhost:6379";
const redisChannel = "ChannelForWorker";


const insertIntoMysql = async (data)=>{
    const sqlQuery = `INSERT INTO post (data) VALUES ('${data}')`;
    const sqlConnection = await mysql.createConnection(sqlDbConfig);
    return sqlConnection.execute(sqlQuery);
}

(function () {
    const redisClient = createClient({url: redisUrl});
    redisClient.connect();

    redisClient.on('error', (err)=> console.log("\n Redis error \n", err));
    redisClient.on('connect', ()=> console.log("\n Connected to Redis \n"));
    redisClient.on('reconnecting', ()=> console.log("\n Reconnecting to redis \n "));

    redisClient.on('ready', ()=> {
        console.log("\n Redis is ready to use");

        redisClient.subscribe(redisChannel, async (msg) =>{
            try{
                console.log("Messege received by redis server. Data => ", msg)
                await insertIntoMysql(msg);
            }catch (error){
                console.log({error});
            };
        });
    });
})();





// app.listen(5001);