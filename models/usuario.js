const { db } = require('../firebaseConfig');

// Função para adicionar um usuário
async function addUsuario(userID, nome, email) {
  try {
    await db.collection('Usuarios').doc(userID).set({ userID, nome, email });
    console.log('Usuário adicionado com sucesso');
  } catch (error) {
    console.error('Erro ao adicionar usuário:', error);
  }
}

module.exports = { addUsuario };