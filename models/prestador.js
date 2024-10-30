const { db } = require('../firebaseConfig');
const { addUsuario } = require('./usuario');

// Função para adicionar um prestador (que também é um usuário)
async function addPrestador(userID, nome, email) {
  try {
    // Primeiro adicionamos o usuário base
    await addUsuario(userID, nome, email);

    // Depois adicionamos o documento de prestador como subdocumento do usuário
    await db.collection('Usuarios').doc(userID).collection('Roles').doc('Prestador').set({
      prestadorID: userID
    });
    
    console.log('Prestador adicionado com sucesso');
  } catch (error) {
    console.error('Erro ao adicionar prestador:', error);
  }
}

module.exports = { addPrestador };