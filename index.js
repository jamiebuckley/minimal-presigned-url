const url = require('url')
const AWS = require('aws-sdk')
const s3 = new AWS.S3({apiVersion: '2006-03-01', region: 'eu-west-2'})

const express = require('express')
const app = express()
app.set('view engine', 'ejs')
app.use('/public', express.static('public'));
const port = 3000

const handleIndex = (req, res) => {
    const success_url = url.format({ protocol: req.protocol, host: req.get('host'), pathname: 'upload_success' });
    const presignedParams = {
        Bucket: process.env['AWS_BUCKET'],
        Fields: { 
            key: 'GeneratedFile' + Date.now(),
            "success_action_redirect": success_url
        }
    };

    s3.createPresignedPost(presignedParams, (err, data) => {
        if (err) {
            console.error(err);
            res.render('error');
        } else {
            console.log(data);
            res.render('index', {
                url: data.url,
                key: data.fields.key,
                bucket: data.fields.bucket,
                algorithm: data.fields['X-Amz-Algorithm'],
                credential: data.fields['X-Amz-Credential'],
                date: data.fields['X-Amz-Date'],
                signature: data.fields['X-Amz-Signature'],
                policy: data.fields['Policy'],
                success_action_redirect: success_url
            })
        }
    });
};

app.get('/', (req, res) => handleIndex(req, res))
app.get('/upload_success', (req, res) => res.render('success'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))