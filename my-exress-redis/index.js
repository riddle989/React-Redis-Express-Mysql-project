import express, { json } from "express";
import { createClient } from 'redis';
import cors from "cors";
import mysql from "mysql2/promise";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const sqlDbConfig = {
    host: "localhost",
    user: "riddle1",
    database: "testdb",
    password: "65006500"
};

const redisClient = createClient({
    url: 'redis://:@localhost:6379'
});
const redisChannel = "ChannelForWorker";

redisClient.on('error', err => console.log('Redis Client Error', err));

const setRedisCache = async(data) => {
    const val = JSON.stringify(data);
    await redisClient.connect();
    await redisClient.set('key', val);
    const value = await redisClient.get('key');
    await redisClient.disconnect();
    return value
}

const getRedisCache = async()=>{
    await redisClient.connect();
    const value = await redisClient.get('key');
    await redisClient.disconnect();
    return value;
};

const publishToRedis = async (data) => {
    await redisClient.connect();
    const subcriberCount = await redisClient.publish(redisChannel, data);
    await redisClient.disconnect();
    return subcriberCount;
}

const deleteRedisCache = async ()=>{
    await redisClient.connect();
    await redisClient.del('key');
    return await redisClient.disconnect();
}

const getDataFromSqlServer = async ()=>{
    const sqlQuery = `SELECT * FROM post`;
    const sqlConnection = await mysql.createConnection(sqlDbConfig);
    const [result, _] =  await sqlConnection.execute(sqlQuery);
    await setRedisCache(result);
    sqlConnection.end();
    return JSON.stringify(result);
}


app.get('/', async (req, res)=>{
    const value = await getRedisCache();
    if(value !== null){
        console.log("Data from Redis server")
        res.send(`Data from Redis server -> ${value}`);
    }else{
        const [result, _] = await getDataFromSqlServer();
        const val = await getRedisCache();
        console.log("Data from SQL server")
        res.send(`Data from SQL server -> ${val}`);
    }
    
});

app.post('/', async (req, res) =>{
    const data = req.body.data;
    try{
        if(!data) throw new Error("missing data");
        const subcriberCount = await publishToRedis(data);
        console.log("Total subscriber count ", {subcriberCount});
        const test = await deleteRedisCache();
        res.status(200).json({messege:"success"});
    }catch(error){
        console.log("Post request failed", error);
        res.status(500).json({messege: "failure", error});
    }
})


app.listen(5000);