import mysql from 'mysql2';

const connection2 = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectionLimit: parseInt(
        process.env.DB_LIMIT === undefined ? '' : process.env.DB_LIMIT,
    ),
});

const pool2 = connection2.promise();

export { pool2 };
