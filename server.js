const inquirer = require('inquirer');
const express = require('express');
const app = express();

const PORT = 3001;
const HOST = 'localhost';
app.listen(PORT, HOST, () => {

const query = require('./db/query.sql');
const db = require('./db');