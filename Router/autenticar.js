const express = require('express');
const router = express.Router();
const { admin, auth, db } = require('../firebaseConfig'); // Corrigido para usar db

// Função auxiliar para incrementar o contador de IDs
async function getNextUserId() {
  const counterDocRef = db.collection('Contagem').doc('counter'); // Alterado para usar db

  const counterDoc = await counterDocRef.get();
  if (!counterDoc.exists) {
    await counterDocRef.set({ lastId: 1 });
    return 1;
  } else {
    const lastId = counterDoc.data().lastId;
    const newId = lastId + 1;
    await counterDocRef.update({ lastId: newId });
    return newId;
  }
}

// Rota para registro de usuários
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userId = await getNextUserId();

    const userRecord = await auth.createUser({
      email,
      password,
    });

    // Verifique se o Firestore está definido
    if (!db) {
      console.error("Firestore is not initialized");
      return res.status(500).json({ success: false, message: 'Erro no servidor.' });
    }

    await db.collection('Cliente').doc(userId.toString()).set({ // Usar userId como string
      userId,
      name,
      email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({ success: true, message: 'Usuário registrado com sucesso', userId });
  } catch (error) {
    if (error.code === 'auth/email-already-exists') {
      return res.status(400).json({ success: false, message: 'O endereço de e-mail já está em uso. Tente outro.' });
    }
    
    return res.status(400).json({ success: false, message: error.message });
  }
});

// Rota de login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await auth.getUserByEmail(email);
    const token = await auth.createCustomToken(user.uid);

    res.json({ token });
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    } else {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
  }
});

module.exports = router;