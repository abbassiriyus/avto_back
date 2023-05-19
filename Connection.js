const { Client } = require("pg")

const pool = new Client({
    user: "postgres",
    host: "containers-us-west-39.railway.app",
    database: "railway",
    password: "62H1xhc9TpSn9zVqJbyP",
    port: 6666
})

pool.connect(err => {
    if(err) {
        console.log("Connect Error");
    } else {
        console.log("Connect To PostgreSql");
    }
})

module.exports = pool