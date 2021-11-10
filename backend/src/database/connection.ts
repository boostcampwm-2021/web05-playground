import mysql from 'mysql2';

const connection1 = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE1,
    connectionLimit: parseInt(
        process.env.DB_LIMIT === undefined ? '' : process.env.DB_LIMIT,
    ),
});

const connection2 = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE2,
    connectionLimit: parseInt(
        process.env.DB_LIMIT === undefined ? '' : process.env.DB_LIMIT,
    ),
});

const pool1 = connection1.promise();
const pool2 = connection2.promise();

export { pool1, pool2 };
