const express = require("express")
const app = express()
const cors = require("cors")
const fileUpload = require("express-fileupload")
const pool = require("./Connection")
const fs = require("fs")

app.use(fileUpload())
app.use(cors())
app.use(express.static("Images"))

// users
app.get("/users", (req, res) => {
    pool.query("SELECT * FROM users", (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.send(err)
        }
    })
})

app.get('/users/:id', (req, res) => {
    pool.query("SELECT * FROM users where userid=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})

app.post("/users", (req, res) => {
    const body = req.body
    pool.query('INSERT INTO users (username, email, phone, password) VALUES ($1, $2, $3, $4) RETURNING *', [body.username, body.email, body.phone, body.password], (err, result) => {
        if (err) {
            res.status(400).send(err)
        } else {
            res.status(201).send("Created")
        }
    })
})

app.delete("/users/:id", (req, res) => {
    const id = req.params.id
    pool.query('DELETE FROM users WHERE userid = $1', [id], (err, result) => {
        if (err) {
            res.status(400).send(err)
        } else {
            res.status(200).send("Deleted")
        }
    })
})

app.put("/users/:id", (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query(
        'UPDATE users SET username = $1, email = $2, phone=$3, password=$4 WHERE userid = $5',
        [body.username, body.email, body.phone, body.password, id],
        (err, result) => {
            if (err) {
                res.status(400).send(err)
            } else {
                res.status(200).send("Updated")
            }
        }
    )
})


// admins
app.get("/admin", (req, res) => {
    pool.query("SELECT * FROM admin", (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.send(err)
        }
    })
})

app.get('/admin/:id', (req, res) => {
    pool.query("SELECT * FROM admin where adminid=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})

app.post("/admin", (req, res) => {
    const body = req.body
    const imgFile = req.files.image
    const imgName = Date.now() + imgFile.name

    pool.query('INSERT INTO admin (name, email, phone, password, image) VALUES ($1, $2, $3, $4, $5) RETURNING *', [body.name, body.email, body.phone, body.password, imgName], (err, result) => {
        if (err) {
            res.status(400).send(err)
        } else {
            imgFile.mv(`${__dirname}/Images/${imgName}`)
            res.status(201).send("Created")
        }
    })
})

app.delete("/admin/:id", (req, res) => {
    pool.query("SELECT * FROM admin where adminid=$1", [req.params.id], (err, result) => {
        if (result.rows.length > 0) {
            if (!err) {
                fs.unlink(`./Images/${result.rows[0].image}`, function (err) {
                    if (err && err.code == 'ENOENT') {
                        console.info("File doesn't exist, won't remove it.");
                    } else if (err) {
                        console.error("Error occurred while trying to remove file");
                    } else {
                        console.info(`removed`);
                    }
                });
            } else {
                res.status(400).send(err)
            }
        }
    })

    pool.query("DELETE FROM admin WHERE adminid=$1", [req.params.id], (err, result) => {
        if (!err) {
            if (result.rowCount === 1) {

                res.status(200).send("Deleted")
            } else {
                res.status(400).send("Id not found")
            }
        } else {
            res.status(400).send(err)
        }
    })
})

app.put("/admin/:id", (req, res) => {
    const body = req.body
    pool.query(`UPDATE admin SET name=$1, email=$3, phone=$4, password=$5 WHERE adminid=$2`,
        [body.name, req.params.id, body.email, body.phone, body.password], (err, result) => {
            if (!err) {
                if (result.rowCount === 1) {
                    res.status(200).send("Updated")
                } else {
                    res.status(400).send("Id not found")
                }
            } else {
                res.status(400).send(err)
            }
        })
})

// cars
app.get("/car", (req, res) => {
    pool.query("SELECT * FROM car", (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.send(err)
        }
    })
})

app.get('/car/:id', (req, res) => {
    pool.query("SELECT * FROM car where carid=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})

app.post("/car", (req, res) => {
    const body = req.body
    pool.query('INSERT INTO car (carname, price, year, model, color, make, transmission, condition, fuel, engine) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
        [body.carname, body.price, body.year, body.model, body.color, body.make, body.transmission, body.condition, body.fuel, body.engine], (err, result) => {
            if (err) {
                res.status(400).send(err)
            } else {
                res.status(201).send("Created")
            }
        })
})

app.delete("/car/:id", (req, res) => {
    const id = req.params.id
    pool.query('DELETE FROM car WHERE carid = $1', [id], (err, result) => {
        if (err) {
            res.status(400).send(err)
        } else {
            res.status(200).send("Deleted")
        }
    })
})

app.put("/car/:id", (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query(
        'UPDATE car SET carname = $1, price = $2, year=$3, model=$4, color=$5, make = $6, transmission = $7, condition=$8, fuel=$9, engine=$10 WHERE carid = $11',
        [body.carname, body.price, body.year, body.model, body.color, body.make, body.transmission, body.condition, body.fuel, body.engine, id],
        (err, result) => {
            if (err) {
                res.status(400).send(err)
            } else {
                res.status(200).send("Updated")
            }
        }
    )
})

// carImg
app.get("/carimg", (req, res) => {
    pool.query("SELECT * FROM carimg", (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.send(err)
        }
    })
})

app.get('/carimg/:id', (req, res) => {
    pool.query("SELECT * FROM carimg where carimgid=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})

app.post("/carimg", (req, res) => {
    const body = req.body
    const imgFile = req.files.image
    const imgName = Date.now() + imgFile.name

    pool.query('INSERT INTO carimg (carid, image) VALUES ($1, $2) RETURNING *', [body.carid, imgName], (err, result) => {
        if (err) {
            res.status(400).send(err)
        } else {
            imgFile.mv(`${__dirname}/Images/${imgName}`)
            res.status(201).send("Created")
        }
    })
})

app.delete("/carimg/:id", (req, res) => {
    pool.query("SELECT * FROM carimg where carimgid=$1", [req.params.id], (err, result) => {
        if (result.rows.length > 0) {
            if (!err) {
                fs.unlink(`./Images/${result.rows[0].image}`, function (err) {
                    if (err && err.code == 'ENOENT') {
                        console.info("File doesn't exist, won't remove it.");
                    } else if (err) {
                        console.error("Error occurred while trying to remove file");
                    } else {
                        console.info(`removed`);
                    }
                });
            } else {
                res.status(400).send(err)
            }
        }
    })

    pool.query("DELETE FROM carimg WHERE carimgid=$1", [req.params.id], (err, result) => {
        if (!err) {
            if (result.rowCount === 1) {

                res.status(200).send("Deleted")
            } else {
                res.status(400).send("Id not found")
            }
        } else {
            res.status(400).send(err)
        }
    })
})


app.listen(5000, () => {
    console.log("Localhost is Running");
})