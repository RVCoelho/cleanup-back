// server.js
const app = require('./app'); // Importa a configuração do aplicativo
const PORT = 3000;

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});