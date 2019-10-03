// IMPORTS
// ============================================================================
const express = require('express');
const spdy = require('spdy');
const pjson = require('./package.json');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const session = require('express-session');
const logger = require('morgan');
const bcrypt = require('bcrypt');
const fs = require('fs');
const port = process.env.PORT || 3000;
const debug = require('debug')('kodebase');
const options = {
	'key': fs.readFileSync('ssl/localhost-privkey.pem'),
	'cert': fs.readFileSync('ssl/localhost-cert.pem')
};

// SERVER
// ============================================================================
const app = express();

// CONFIG
// ============================================================================
app.set('views', 'views');           // In which directory are views located
app.set('view engine', 'ejs');       // Which view engine to use
app.use(express.static('./public')); // Where are static files located

app.use(bodyParser.json());          // Accept JSON objects in requests
// Accept extended form elements in requests
app.use(bodyParser.urlencoded({
	'extended': true
}));

// Setup session handling
app.use(session({
	'resave': false,
	'saveUninitialized': true,
	'secret': 'really secret stuffs'
}));

app.use(logger('dev'));						// Setup console logging of route events

// Setup database connection
const db = mysql.createPool({
	'connectionLimit': 10,
	'host': process.env.DB_HOST,
	'user': process.env.DB_USER,
	'password': process.env.DB_PSWD,
	'database': process.env.DB_DTBS
});

// ROUTES
// ============================================================================
app.get('/', (req, res) => {
	res.render('page', { 'title': 'Birgers Bolcher!', 'content': `Gode og lækrer bolcher :-)` });
});

app.get('/opgave/2/1', (req, res) => {
	db.query(`SELECT * FROM birgers_bolcher.sweets`, (err, results) => {
		if (err) res.send(err);
		res.render('twopointone', {'title': `Opgave 2.1`, 'description': `Alle bolcher.`, 'results': results});
	})
});

app.get('/opgave/2/2', (req, res) => {
	db.query(`SELECT sweets.name FROM birgers_bolcher.sweets WHERE sweets.color LIKE "Rød"`, (err, results) => {
		if (err) res.send(err);
		res.render('name', {'title': `Opgave 2.2`, 'description': `Røde bolcher`, 'results': results});
	})
});

app.get('/opgave/2/3', (req, res) => {
	db.query(`SELECT sweets.name FROM birgers_bolcher.sweets WHERE sweets.color LIKE "Rød" OR sweets.color LIKE "Blå"`, (err, results) => {
		if (err) res.send(err);
		res.render('name', {'title': `Opgave 2.3`, 'description': `Røde og Blå bolcher`, 'results': results});
	})
});

app.get('/opgave/2/4', (req, res) => {
	db.query(`SELECT sweets.name FROM birgers_bolcher.sweets WHERE sweets.color NOT LIKE "Rød" ORDER BY sweets.name`, (err, results) => {
		if (err) res.send(err);
		res.render('name', {'title': `Opgave 2.4`, 'description': `Ikke Røde bolcher. Alfabetisk`, 'results': results});
	})
});

app.get('/opgave/2/5', (req, res) => {
	db.query(`SELECT sweets.name FROM birgers_bolcher.sweets WHERE sweets.name LIKE 'B%'`, (err, results) => {
		if (err) res.send(err);
		res.render('name', {'title': `Opgave 2.5`, 'description': `Bolcher der starter med B`, 'results': results});
	})
});

app.get('/opgave/2/6', (req, res) => {
	db.query(`SELECT sweets.name FROM birgers_bolcher.sweets WHERE sweets.name LIKE '%e%'`, (err, results) => {
		if (err) res.send(err);
		res.render('name', {'title': `Opgave 2.6`, 'description': `Bolcher der har mindst et E`, 'results': results});
	})
});

app.get('/opgave/2/7', (req, res) => {
	db.query(`SELECT sweets.name, sweets.weight FROM birgers_bolcher.sweets WHERE sweets.weight < 10 ORDER BY sweets.weight asc`, (err, results) => {
		if (err) res.send(err);
		res.render('nameWeight', {'title': `Opgave 2.7`, 'description': `Bolcher mindre end 10 gram, sorteret`, 'results': results});
	})
});

app.get('/opgave/2/8', (req, res) => {
	db.query(`SELECT sweets.name, sweets.weight FROM birgers_bolcher.sweets WHERE sweets.weight BETWEEN 10 AND 12 ORDER BY sweets.name, sweets.weight`, (err, results) => {
		if (err) res.send(err);
		res.render('nameWeight', {'title': `Opgave 2.8`, 'description': `Bolcher imellem 10 og 12 gram, sorteret alfabetisk og efter vægt`, 'results': results});
	})
});

app.get('/opgave/2/9', (req, res) => {
	db.query(`SELECT sweets.name, sweets.weight FROM birgers_bolcher.sweets ORDER BY sweets.weight desc LIMIT 3`, (err, results) => {
		if (err) res.send(err);
		res.render('nameWeight', {'title': `Opgave 2.9`, 'description': `De 3 tungeste bolcher.`, 'results': results});
	})
});

app.get('/opgave/2/10', (req, res) => {
	db.query(`SELECT * FROM birgers_bolcher.sweets ORDER BY RAND() LIMIT 1`, (err, results) => {
		if (err) res.send(err);
		res.render('twopointone', {'title': `Opgave 2.10`, 'description': `Et random bolche.`, 'results': results});
	})
});

app.get('/opgave/4/1', (req, res) => {
	db.query(`SELECT sweets.name, sweets.weight, sweets.color, sweets.raw_materials_price, sourness.name AS flavour_sourness, strenght.name AS flavour_strenght, type.name AS flavour_type
			FROM birgers_bolcher.sweets 
			INNER JOIN birgers_bolcher.sourness ON sweets.flavour_sourness = sourness.id 
			INNER JOIN birgers_bolcher.strenght ON sweets.flavour_strenght = strenght.id
			INNER JOIN birgers_bolcher.type ON sweets.flavour_type = type.id`, (err, results) => {
		if (err) res.send(err);
		res.render('twopointone', {'title': `Opgave 4.1`, 'description': `Alle bolcher med INNER JOIN.`, 'results': results});
	})
});

app.get('/opgave/4/2', (req, res) => {
	db.query(`SELECT sweets.name, sourness.name AS flavour_sourness, strenght.name AS flavour_strenght, type.name AS flavour_type FROM birgers_bolcher.sweets 
			INNER JOIN birgers_bolcher.sourness ON sweets.flavour_sourness = sourness.id 
			INNER JOIN birgers_bolcher.strenght ON sweets.flavour_strenght = strenght.id
			INNER JOIN birgers_bolcher.type ON sweets.flavour_type = type.id
			WHERE sweets.color LIKE "Rød"`, (err, results) => {
		if (err) res.send(err);
		res.render('namepoint4', {'title': `Opgave 4.2`, 'description': `Røde bolcher, med "inner join"`, 'results': results});
	})
});

app.get('/opgave/4/3', (req, res) => {
	db.query(`SELECT sweets.name, sourness.name AS flavour_sourness, strenght.name AS flavour_strenght, type.name AS flavour_type FROM birgers_bolcher.sweets 
			INNER JOIN birgers_bolcher.sourness ON sweets.flavour_sourness = sourness.id 
			INNER JOIN birgers_bolcher.strenght ON sweets.flavour_strenght = strenght.id
			INNER JOIN birgers_bolcher.type ON sweets.flavour_type = type.id
			WHERE sweets.color LIKE "Rød" OR sweets.color LIKE "Blå"`, (err, results) => {
		if (err) res.send(err);
		res.render('namepoint4', {'title': `Opgave 4.3`, 'description': `Røde og Blå bolcher, med "inner join"`, 'results': results});
	})
});

app.get('/opgave/4/4', (req, res) => {
	db.query(`SELECT sweets.name, sourness.name AS flavour_sourness, strenght.name AS flavour_strenght, type.name AS flavour_type FROM birgers_bolcher.sweets 
			INNER JOIN birgers_bolcher.sourness ON sweets.flavour_sourness = sourness.id 
			INNER JOIN birgers_bolcher.strenght ON sweets.flavour_strenght = strenght.id
			INNER JOIN birgers_bolcher.type ON sweets.flavour_type = type.id
			WHERE sweets.color NOT LIKE "Rød" ORDER BY sweets.name`, (err, results) => {
		if (err) res.send(err);
		res.render('namepoint4', {'title': `Opgave 4.4`, 'description': `Ikke Røde bolcher. Alfabetisk, med "inner join"`, 'results': results});
	})
});

app.get('/opgave/4/5', (req, res) => {
	db.query(`SELECT sweets.name, sourness.name AS flavour_sourness, strenght.name AS flavour_strenght, type.name AS flavour_type FROM birgers_bolcher.sweets 
			INNER JOIN birgers_bolcher.sourness ON sweets.flavour_sourness = sourness.id 
			INNER JOIN birgers_bolcher.strenght ON sweets.flavour_strenght = strenght.id
			INNER JOIN birgers_bolcher.type ON sweets.flavour_type = type.id
			WHERE sweets.name LIKE 'B%'`, (err, results) => {
		if (err) res.send(err);
		res.render('namepoint4', {'title': `Opgave 4.5`, 'description': `Bolcher der starter med B, med "inner join"`, 'results': results});
	})
});

app.get('/opgave/4/6', (req, res) => {
	db.query(`SELECT sweets.name, sourness.name AS flavour_sourness, strenght.name AS flavour_strenght, type.name AS flavour_type FROM birgers_bolcher.sweets 
			INNER JOIN birgers_bolcher.sourness ON sweets.flavour_sourness = sourness.id 
			INNER JOIN birgers_bolcher.strenght ON sweets.flavour_strenght = strenght.id
			INNER JOIN birgers_bolcher.type ON sweets.flavour_type = type.id
			WHERE sweets.name LIKE '%e%'`, (err, results) => {
		if (err) res.send(err);
		res.render('namepoint4', {'title': `Opgave 4.6`, 'description': `Bolcher der har mindst et E, med "inner join"`, 'results': results});
	})
});

app.get('/opgave/4/7', (req, res) => {
	db.query(`SELECT sweets.name, sweets.weight, sourness.name AS flavour_sourness, strenght.name AS flavour_strenght, type.name AS flavour_type FROM birgers_bolcher.sweets 
			INNER JOIN birgers_bolcher.sourness ON sweets.flavour_sourness = sourness.id 
			INNER JOIN birgers_bolcher.strenght ON sweets.flavour_strenght = strenght.id
			INNER JOIN birgers_bolcher.type ON sweets.flavour_type = type.id
			WHERE sweets.weight < 10 ORDER BY sweets.weight asc`, (err, results) => {
		if (err) res.send(err);
		res.render('nameWeightpoint4', {'title': `Opgave 4.7`, 'description': `Bolcher mindre end 10 gram, sorteret, med "inner join"`, 'results': results});
	})
});

app.get('/opgave/4/8', (req, res) => {
	db.query(`SELECT sweets.name, sweets.weight, sourness.name AS flavour_sourness, strenght.name AS flavour_strenght, type.name AS flavour_type FROM birgers_bolcher.sweets 
			INNER JOIN birgers_bolcher.sourness ON sweets.flavour_sourness = sourness.id 
			INNER JOIN birgers_bolcher.strenght ON sweets.flavour_strenght = strenght.id
			INNER JOIN birgers_bolcher.type ON sweets.flavour_type = type.id
			WHERE sweets.weight BETWEEN 10 AND 12 ORDER BY sweets.name, sweets.weight`, (err, results) => {
		if (err) res.send(err);
		res.render('nameWeightpoint4', {'title': `Opgave 4.8`, 'description': `Bolcher imellem 10 og 12 gram, sorteret alfabetisk og efter vægt, med "inner join"`, 'results': results});
	})
});

app.get('/opgave/4/9', (req, res) => {
	db.query(`SELECT sweets.name, sweets.weight, sourness.name AS flavour_sourness, strenght.name AS flavour_strenght, type.name AS flavour_type FROM birgers_bolcher.sweets 
			INNER JOIN birgers_bolcher.sourness ON sweets.flavour_sourness = sourness.id 
			INNER JOIN birgers_bolcher.strenght ON sweets.flavour_strenght = strenght.id
			INNER JOIN birgers_bolcher.type ON sweets.flavour_type = type.id
			ORDER BY sweets.weight desc LIMIT 3`, (err, results) => {
		if (err) res.send(err);
		res.render('nameWeightpoint4', {'title': `Opgave 4.9`, 'description': `De 3 tungeste bolcher, med "inner join".`, 'results': results});
	})
});

app.get('/opgave/4/10', (req, res) => {
	db.query(`SELECT sweets.name, sweets.weight, sweets.color, sweets.raw_materials_price, sourness.name AS flavour_sourness, strenght.name AS flavour_strenght, type.name AS flavour_type FROM birgers_bolcher.sweets 
			INNER JOIN birgers_bolcher.sourness ON sweets.flavour_sourness = sourness.id 
			INNER JOIN birgers_bolcher.strenght ON sweets.flavour_strenght = strenght.id
			INNER JOIN birgers_bolcher.type ON sweets.flavour_type = type.id
			ORDER BY RAND() LIMIT 1`, (err, results) => {
		if (err) res.send(err);
		res.render('twopointone', {'title': `Opgave 4.10`, 'description': `Et random bolche, med "inner join".`, 'results': results});
	})
});

app.get('/opgave/5/1', (req, res) => {
	db.query(`SELECT sweets.name, 10/sweets.weight*sweets.raw_materials_price*1.25 AS price_no_vat, 10/sweets.weight*sweets.raw_materials_price*1.25*1.25 AS price_vat 
			FROM birgers_bolcher.sweets`, (err, results) => {
		if (err) res.send(err);
		res.render('fivepointone', {'title': `Opgave 5.1`, 'description': `Prisliste med bolchenavn og kilopris henholdsvis med og uden moms.`, 'results': results});
	})
});

app.get('/opgave/6/1', (req, res) => {
	db.query(`SELECT sweets.name FROM birgers_bolcher.sweets WHERE sweets.color IN ('Rød', 'Blå')`, (err, results) => {
		if (err) res.send(err);
		res.render('name', {'title': `Opgave 6.1`, 'description': `Røde og Blå bolcher ved brug af IN`, 'results': results});
	})
});

app.get('/opgave/6/2', (req, res) => {
	db.query(`SELECT sweets.name FROM birgers_bolcher.sweets WHERE sweets.color NOT IN ('Rød') ORDER BY sweets.name`, (err, results) => {
		if (err) res.send(err);
		res.render('name', {'title': `Opgave 6.2`, 'description': `Ikke Røde bolcher. Alfabetisk, ved brug af NOT IN`, 'results': results});
	})
});

app.get('/opgave/6/3', (req, res) => {
	db.query(`SELECT COUNT(sweets.weight) AS number_of_sweets_15 FROM birgers_bolcher.sweets WHERE sweets.weight < 15`, (err, results) => {
		if (err) res.send(err);
		res.render('underFifteen', {'title': `Opgave 6.3`, 'description': `Udskriv hvor mange bolscher der vejer under 15 g.`, 'results': results});
	})
});

app.get('/opgave/6/4', (req, res) => {
	db.query(`SELECT COUNT(sweets.name) AS number_of_sweets FROM birgers_bolcher.sweets`, (err, results) => {
		if (err) res.send(err);
		res.render('totalSweets', {'title': `Opgave 6.4`, 'description': `Udskriv hvor mange forskellige forskellige bolcher der er i tabellen.`, 'results': results});
	})
});

app.get('/opgave/6/5', (req, res) => {
	db.query(`SELECT AVG(sweets.raw_materials_price) AS average_price FROM birgers_bolcher.sweets`, (err, results) => {
		if (err) res.send(err);
		res.render('price', {'title': `Opgave 6.5`, 'description': `Udskriv gennemsnitsprisen per bolche.`, 'results': results});
	})
});

app.get('/opgave/6/6', (req, res) => {
	db.query(`SELECT sweets.raw_materials_price, sweets.name FROM birgers_bolcher.sweets 
			WHERE sweets.raw_materials_price = (SELECT MIN(sweets.raw_materials_price) FROM birgers_bolcher.sweets) 
			OR sweets.raw_materials_price = (SELECT MAX(sweets.raw_materials_price) FROM birgers_bolcher.sweets)`, (err, results) => {
		if (err) res.send(err);
		res.render('sixpointsix', {'title': `Opgave 6.6`, 'description': `Udskriv navn og pris på det dyreste og billigste bolche.`, 'results': results});
	})
});

app.use((req, res) => {
	res.status(404);
	res.render('page', { 'title': '404: Not Found', 'content': error });
});

app.use((error, req, res, next) => {
	res.status(500);
	res.render('page', { 'title': '500: Internal Server Error', 'content': error });
});

// SERVER INIT
// ============================================================================
spdy.createServer(options, app).listen(port, () => {
	debug(
		`${pjson.name} v${pjson.version} is running on https://${process.env.SITE_HOST}:${port}`
	);
});
