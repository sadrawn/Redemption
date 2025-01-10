const { createTable, db } = require('./database/database')
const bcrypt = require('bcrypt');
createTable();

const fs = require('fs');
const path = require('path');

const dirpath = path.join(__dirname , './public/images');


if(!fs.existsSync(dirpath)){
    fs.mkdirSync(dirpath);
    console.log("image directory created successfully");
}
else{
    console.log("image directory aleady exists.");
}