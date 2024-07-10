import mysql from 'mysql2'

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Legobuddy203_-',
    database: 'realhome_wil'
}).promise();

async function GetRows(){
    const [rows] = await pool.query('SELECT * FROM agents');
    return rows
}
console.log(GetRows());