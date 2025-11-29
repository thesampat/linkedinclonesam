const AWS = require("@aws-sdk/client-s3");


const client = new AWS.S3({
    region: "eu-north-1",
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET,
    },
});



client.listObjects().then(res=>{
    console.log(res)
})

module.exports = client;