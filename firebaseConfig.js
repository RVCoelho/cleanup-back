const admin = require('firebase-admin');
const serviceAccount = require('./cleanupKey.json'); // Importa a chave do serviço

// Inicializa o Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://cleanup-e0297.firebaseio.com" // Substitua pelo seu database URL real
});

// Inicializa o Firestore e Auth
const db = admin.firestore(); // Usando o Firestore do Admin SDK
const auth = admin.auth(); // Usando a autenticação do Admin SDK

module.exports = { db, auth, admin }; // Exporta db e auth
