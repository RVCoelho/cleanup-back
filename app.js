// app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./Router/autenticar'); 
const checkRoutes = require('./Router/checkEmail'); 
const serviceRoutes = require('./Router/dispoService'); 
const orderRoutes = require('./Router/solicitacoes'); 


const app = express();

// Configuração
app.use(cors()); 
app.use(bodyParser.json()); 

// Usar rotas de autenticação
app.use('/auth', authRoutes);
app.use('/check', checkRoutes);
app.use('/service', serviceRoutes);
app.use('/order', orderRoutes);

module.exports = app; // Exporta a instância do aplicativo