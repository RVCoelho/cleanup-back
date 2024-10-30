const { db } = require('../firebaseConfig');
const { addUsuario } = require('./usuario');

// Função para adicionar um cliente (que também é um usuário)
async function addCliente(userID, nome, email) {
  try {
    // Primeiro adicionamos o usuário base
    await addUsuario(userID, nome, email);

    // Depois adicionamos o documento de cliente como subdocumento do usuário
    await db.collection('Usuarios').doc(userID).collection('Roles').doc('Cliente').set({
      clienteID: userID
    });
    
    console.log('Cliente adicionado com sucesso');
  } catch (error) {
    console.error('Erro ao adicionar cliente:', error);
  }
}

module.exports = { addCliente };