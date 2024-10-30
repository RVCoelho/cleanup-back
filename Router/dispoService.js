const express = require('express');
const router = express.Router();
const { db } = require('../firebaseConfig');


// Rota para buscar serviços
router.get('/services', async (req, res) => {
  try {
    const snapshot = await db.collection('Servicos').get();
    const services = snapshot.docs.map(doc => doc.data());
    res.json(services);
  } catch (error) {
    console.error("Erro ao buscar serviços:", error);
    res.status(500).json({ message: 'Erro ao buscar serviços' });
  }
});

// Rota para adicionar serviços
router.post('/services', async (req, res) => {
  const { name, providerId } = req.body;
  const serviceId = `${name}-${providerId}`;

  const serviceData = {
    id: serviceId,
    name,
    providerId
  };

  try {
    await db.collection('Servicos').doc(serviceId).set(serviceData);
    res.status(201).json(serviceData);
  } catch (error) {
    console.error("Erro ao salvar serviço:", error);
    res.status(500).json({ message: 'Erro ao salvar serviço' });
  }
});

// Rota para remover serviço
router.delete('/services/:providerId', async (req, res) => {
    const { providerId } = req.params;

    try {
        const serviceRef = db.collection('Servicos').doc(providerId);
        await serviceRef.delete();
        return res.status(200).json({ message: "Serviço removido com sucesso!" });
    } catch (error) {
        console.error("Erro ao remover serviço:", error);
        res.status(500).json({ message: "Erro interno ao remover serviço." });
    }
});

// Rota para adicionar disponibilidade
router.post('/availability', async (req, res) => {
  const { providerId, days, startTime, endTime } = req.body;

  const availabilityData = {
    providerId,
    days,
    startTime,
    endTime
  };

  try {
    await db.collection('Disponibilidade').doc(providerId).set(availabilityData);
    res.status(201).json(availabilityData);
  } catch (error) {
    console.error("Erro ao salvar disponibilidade:", error);
    res.status(500).json({ message: 'Erro ao salvar disponibilidade' });
  }
});

// Rota para buscar disponibilidade
router.get('/availability/:providerId', async (req, res) => {
  const { providerId } = req.params;
  try {
    const doc = await db.collection('Disponibilidade').doc(providerId).get();
    if (!doc.exists) {
      return res.status(404).json({ message: 'Disponibilidade não encontrada' });
    }
    res.json(doc.data());
  } catch (error) {
    console.error("Erro ao buscar disponibilidade:", error);
    res.status(500).json({ message: 'Erro ao buscar disponibilidade' });
  }
});

// Rota para remover disponibilidade
router.delete('/availability/:providerId', async (req, res) => {
  const { providerId } = req.params;
  try {
    const availabilityRef = db.collection('Disponibilidade').doc(providerId);
    const doc = await availabilityRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: 'Disponibilidade não encontrada' });
    }

    await availabilityRef.delete();
    res.status(204).send();
  } catch (error) {
    console.error("Erro ao remover disponibilidade:", error);
    res.status(500).json({ message: 'Erro ao remover disponibilidade' });
  }
});

module.exports = router;