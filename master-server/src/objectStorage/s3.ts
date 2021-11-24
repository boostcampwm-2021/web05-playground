import AWS from 'aws-sdk';
import { PutObjectCommand } from '@aws-sdk/client-s3';

const endpoint = new AWS.Endpoint('pfrtwzglkdkt9048310.cdn.ntruss.com');
const region = 'kr-standard';
const accessKey = 'VouTJ0RlGKTifqzMz7z3';
const secretKey = '4qBnWfUJrTkqwciZ48Y2FZ1KRDKJog9V9YAc8FBD';

export const bucketName = 'playground';

AWS.config.update({
    region,
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
    },
});

export const S3 = new AWS.S3({
    endpoint: endpoint.href,
});
