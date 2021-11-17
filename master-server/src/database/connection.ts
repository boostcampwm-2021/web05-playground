import mysql from 'mysql2';

const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectionLimit: parseInt(
        process.env.DB_LIMIT === undefined ? '' : process.env.DB_LIMIT,
    ),
});

const pool = connection.promise();

export { pool };
