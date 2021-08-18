const express = require('express')
const port = 5000
const mysql = require('mysql');
var bodyParser = require('body-parser')
const app = express()

// Cors Fix
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
// in latest body-parser use like below.
app.use(bodyParser.urlencoded({
	extended: true
}));

// Mysql Connection add db details here
const con = mysql.createConnection({
	host: "localhost",					
	user: "root",
	password: "",
	database: "react",
});

// Root Endpoint
app.get('/', (req, res) => {
	con.connect(function(err) {
		con.query("SELECT * FROM users", function(err, result, fields) {
			if(err) throw err;
			res.status(200).json({
				data: result
			})
		});
	});
});

// addUser Endpoint
app.post('/addUser', (req, res) => {
	const body = req.body;
	var username = body.username;
	var designation = body.designation;
	var id = body.row_id;
	var time = Math.floor(Date.now() / 1000);
	if(typeof id !== undefined && id != null && id != '') {
		// Insert
		con.query("update users set username='" + username + "' , designation='" + designation + "' where id=" + id + "", function(err, result, fields) {
			if(err) throw err;
			res.status(200).json({
				data: 'done'
			})
		});
	} else {
		// Insert
		con.query("insert into users(username,designation,cdate,mdate)values('" + username + "','" + designation + "','" + time + "','" + time + "')", function(err, result, fields) {
			if(err) throw err;
			res.status(200).json({
				data: 'done'
			})
		});
	}
});

// deleteUser Endpoint
app.post('/deleteUser', (req, res) => {
	const body = req.body;
	var id = body.id;
	con.connect(function(err) {
		con.query("delete from users where id=" + id + "", function(err, result, fields) {
			if(err) throw err;
			res.status(200).json({
				data: 'done'
			})
		});
	});
});

app.listen(port, () => {
	console.log(`app listening at http://localhost:${port}`)
});