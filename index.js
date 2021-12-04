const express = require('express')
const fileUpload = require('express-fileupload');
const fs = require('fs')
const cors = require('cors')
const uuidv4 = require('uuid').v4
const { insertImage, initPool, getImages } = require('./dal')
const { Storage } = require('@google-cloud/storage');
const app = express()
const { Server } = require("socket.io");
const http = require('http');

const port = 5000

initPool();

app.options('*', cors());
app.use(cors());
app.use(fileUpload());

app.get('/welcome', (req, res) => {
    res.send('test')
})

app.post('/uploadFile', async function (req, res) {
    let sampleFile;
    let localServerFilePath;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    sampleFile = req.files.File;
    const uniqueFileName = [uuidv4() , ...sampleFile.name.split('.').slice(1,2)].join(".")
    localServerFilePath = __dirname + '/images/' + uniqueFileName;

    console.log("new name for file is: " , uniqueFileName)

    try {
        !fs.existsSync(__dirname + '/images') && fs.mkdirSync(__dirname + '/images', { recursive: true })
        
        fs.writeFileSync(localServerFilePath, sampleFile.data);
        console.log("File added")
    }
    catch(err) {
        console.log(err)
        return res.status(500).send(err);
    }


    // The ID of your GCS bucket
    const bucketName = 'eu.artifacts.bamboo-volt-333817.appspot.com';
    const cloudImagePath = "images/" + uniqueFileName

    // Creates a client
    const storage = new Storage();

    async function uploadFile() {
        await storage.bucket(bucketName).upload(localServerFilePath, {
            destination: cloudImagePath,
        });

        console.log(`${localServerFilePath} uploaded to ${bucketName}`);
    }

    try {
        await uploadFile();
        await insertImage(cloudImagePath, req?.body?.DateTime)
        if (fs.existsSync(localServerFilePath)) {
            fs.unlink(localServerFilePath, (err) => {
                if (err) {
                    console.log(err);
                }
                console.log('deleted');
            })
        }
    }
    catch(err) {
        console.log(err);
        return res.status(400).send('Upload failed');
    }
});

let image = {}

app.get('/getImage', async (req, res) => {
    const data = await getImages()
    if(JSON.stringify(data) !== JSON.stringify(image)) {
        image = data
        io.emit("new-image", image);
    }

    res.send(image)
})

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  })

io.on("connection", function(socket) {
    console.log('a user connected');
});

server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})