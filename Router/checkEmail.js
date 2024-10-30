const express = require('express');
const router = express.Router();
const { admin, db, auth } = require('../firebaseConfig'); // Importa admin, db e auth corretamente

// Rota para verificar se o email existe
// Rota para verificar email
router.post('/checkEmail', async (req, res) => {
    const email = req.body.email;

    if (!email) {
        return res.status(400).json({ message: "Email não fornecido." });
    }

    try {
        const querySnapshot = await db.collection("Cliente").where("email", "==", email).get();

        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const providerName = userDoc.data().nome; // Obtém o nome do prestador
            const userId = userDoc.id; // Obtém o userId do Firestore
            return res.json({ exists: true, name: providerName, userId });
        } else {
            return res.json({ exists: false });
        }
    } catch (err) {
        console.error("Erro ao verificar email:", err);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
});

// Rota para login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email ou senha não fornecidos." });
    }

    try {
        // Autentica o usuário pelo email e obtém o userId
        const userCredential = await auth.getUserByEmail(email);
        const userId = userCredential.uid; // Obtém o userId (uid do Firebase Authentication)

        // Note que a validação de senha deve ser feita pelo lado do cliente

        return res.json({ success: true, userId });
    } catch (err) {
        console.error("Erro ao fazer login:", err);
        return res.status(401).json({ message: "Email ou senha inválidos." });
    }
});


module.exports = router;