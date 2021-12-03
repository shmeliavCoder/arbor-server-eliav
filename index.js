const express = require('express')
const fileUpload = require('express-fileupload');
const fs = require('fs')
const cors = require('cors')
const uuidv4 = require('uuid').v4
const { insertImage } = require('./dal')
const { Storage } = require('@google-cloud/storage');
const app = express()
const port = 5000

app.options('*', cors());
app.use(cors());
app.use(fileUpload());

app.get('/welcome', (req, res) => {
    res.send('yo')
})

app.post('/uploadFile', async function (req, res) {
    let sampleFile;
    let uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    sampleFile = req.files.File;
    uploadPath = __dirname + '/images/' + sampleFile.name;
    const bucketFileName = [uuidv4() , ...sampleFile.name.split('.').slice(1,2)].join(".")

    console.log("new name for file is: " , bucketFileName)

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(uploadPath, function (err) {
        if (err)
            return res.status(500).send(err);

        res.send('File uploaded!');
    });

    /**
     * TODO(developer): Uncomment the following lines before running the sample.
     */
    // The ID of your GCS bucket
    const bucketName = 'eu.artifacts.bamboo-volt-333817.appspot.com';
    const cloudImagePath = "images/" + bucketFileName


    // UNCOMMENT THIS UPLOADS TO GCP

    // Creates a client
    const storage = new Storage();

    async function uploadFile() {
        await storage.bucket(bucketName).upload(uploadPath, {
            destination: cloudImagePath,
        });

        console.log(`${uploadPath} uploaded to ${bucketName}`);
    }

    try {
        await uploadFile();
        insertImage(cloudImagePath, req?.body?.DateTime)
        if (fs.existsSync(uploadPath)) {
            fs.unlink(uploadPath, (err) => {
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



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})