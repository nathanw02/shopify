const express = require('express');
const app = express();
const fs = require('fs');

app.use(express.json());

var database = require('./database.json');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/api/inventory', (req, res) => {
    res.status(200).json(database);
});

app.post('/api/create', (req, res) => {
    let body = req.body;

    if(body.name == '' || body.quantity == '' || body.type == '') return res.status(400).json({error: 'Invalid request body'});

    if(isNaN(body.quantity)) return res.status(400).json({error: 'Invalid quantity'});

    let item = {
        quantity: body.quantity,
        type: body.type
    };

    database[body.name] = item;

    updateDB();
    res.status(200).json({message: 'Item successfully created'});

});

app.put('/api/edit', (req, res) => {
    let body = req.body;
    let name = body.name;
    let old = body.old;

    let item = {
        quantity: body.quantity,
        type: body.type
    };

    delete database[old];
    
    database[name] = item;

    updateDB();
    res.status(200).json({message: 'Item successfully updated'});

});

app.delete('/api/delete', (req, res) => {
    let id = req.body.id;
    delete database[id];

    updateDB();
    res.status(200).json({message: 'Item successfully deleted'});

});

app.use((req, res) => {
    res.status(404).json({error: 'Invalid request'});
});

app.listen(3000, () => {
    console.log('http://localhost:3000');
});

function updateDB() {
    fs.writeFileSync('database.json', JSON.stringify(database, null, '\t'));
}