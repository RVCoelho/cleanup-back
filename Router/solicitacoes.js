const express = require('express');
const router = express.Router();
const { db } = require('../firebaseConfig'); 

// Endpoint para buscar solicitações
router.get('/solicitacoes', async (req, res) => {
    try {
        const snapshot = await db.collection('Solicitacoes').get();
        const solicitacoes = snapshot.docs.map(doc => ({
            id: doc.id, // Adiciona o ID do documento
            area: doc.data().area,
            data: doc.data().data,
            idCliente: doc.data().idCliente,
            idPrestador: doc.data().idPrestador,
            idServico: doc.data().idServico,
            tipo: doc.data().tipo,
            valor: doc.data().valor
        }));
        res.json(solicitacoes);
    } catch (error) {
        console.error('Erro ao buscar solicitações:', error);
        res.status(500).send('Erro ao buscar solicitações');
    }
});

router.patch('/aceitar', async (req, res) => {
    const { idServico } = req.body;

    try {
        // Procurando um documento na coleção 'Solicitacoes' onde o campo 'idServico' seja igual ao valor passado
        const solicitacoesSnapshot = await db.collection('Solicitacoes')
            .where('idServico', '==', idServico)
            .limit(1) // Limita a busca a um único resultado, pois queremos apenas um documento
            .get();

        if (!solicitacoesSnapshot.empty) {
            // Obtendo o primeiro documento que corresponde à consulta
            const solicitacaoDoc = solicitacoesSnapshot.docs[0];
            const solicitacaoRef = solicitacaoDoc.ref;

            // Atualizando o campo 'idPrestador' para 1
            await solicitacaoRef.update({ idPrestador: 1 });

            // Incluindo o campo atualizado no objeto de resposta
            const updatedSolicitacao = { id: solicitacaoDoc.id, ...solicitacaoDoc.data(), idPrestador: 1 };

            return res.status(200).json({ message: 'Solicitação aceita com sucesso.', solicitacao: updatedSolicitacao });
        } else {
            // Caso não encontre o documento, retorna um erro 404
            console.log('Solicitação não encontrada para o ID:', idServico); // Log adicional
            return res.status(404).json({ message: 'Solicitação não encontrada.' });
        }
    } catch (error) {
        // Captura e loga quaisquer erros
        console.error('Erro ao aceitar solicitação:', error);
        return res.status(500).json({ message: 'Erro ao aceitar solicitação', error: error.message });
    }
});

router.patch('/recusar', async (req, res) => {
    const { idServico } = req.body;

    try {
        // Procurando um documento na coleção 'Solicitacoes' onde o campo 'idServico' seja igual ao valor passado
        const solicitacoesSnapshot = await db.collection('Solicitacoes')
            .where('idServico', '==', idServico)
            .limit(1) // Limita a busca a um único resultado
            .get();

        if (!solicitacoesSnapshot.empty) {
            // Obtendo o primeiro documento que corresponde à consulta
            const solicitacaoDoc = solicitacoesSnapshot.docs[0];
            const solicitacaoRef = solicitacaoDoc.ref;

            // Atualizando o campo 'idPrestador' para 2 para indicar recusa
            await solicitacaoRef.update({ idPrestador: 2 });

            // Incluindo o campo atualizado no objeto de resposta
            const updatedSolicitacao = { id: solicitacaoDoc.id, ...solicitacaoDoc.data(), idPrestador: 2 };

            return res.status(200).json({ message: 'Solicitação recusada com sucesso.', solicitacao: updatedSolicitacao });
        } else {
            // Caso não encontre o documento, retorna um erro 404
            console.log('Solicitação não encontrada para o ID:', idServico);
            return res.status(404).json({ message: 'Solicitação não encontrada.' });
        }
    } catch (error) {
        // Captura e loga quaisquer erros
        console.error('Erro ao recusar solicitação:', error);
        return res.status(500).json({ message: 'Erro ao recusar solicitação', error: error.message });
    }
});

module.exports = router;