const express = require('express');
const router = express.Router();

const { insertEntrega, getEntregas, getEntregaPorId, getEntregasPorPedido, editStatusEntrega, confirmarEntrega,
  registrarProblemaEstoque, deleteEntrega
} = require('../Model/DAO/entregaDao');


// READ - POR PEDIDO
router.get('/entregas/pedido/:pedidoId', async (req, res) => {
  try {
    const entregas = await getEntregasPorPedido(req.params.pedidoId);

    if (!entregas) {
      return res.status(404).json({ message: 'Nenhuma entrega encontrada' });
    }

    res.json(entregas);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar entregas do pedido' });
  }
});

// CREATE
router.post('/entregas', async (req, res) => {
  try {
    const {
      pedidoId,
      enderecoId,
      dataEntrega,
      status,
      problemaEstoque,
      observacoes
    } = req.body;

    const entrega = await insertEntrega(
      pedidoId,
      enderecoId,
      dataEntrega,
      status,
      problemaEstoque,
      observacoes
    );

    if (!entrega) {
      return res.status(400).json({ message: 'Erro ao criar entrega' });
    }

    res.status(201).json({ success: true, message: 'Criado!', entrega });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// READ - TODAS
router.get('/entregas', async (req, res) => {
  try {
    const entregas = await getEntregas();
    res.json(entregas);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar entregas' });
  }
});


// READ - POR ID
router.get('/entregas/:id', async (req, res) => {
  try {
    const entrega = await getEntregaPorId(req.params.id);

    if (!entrega) {
      return res.status(404).json({ message: 'Entrega não encontrada' });
    }

    res.json(entrega);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar entrega' });
  }
});

// UPDATE - STATUS
router.put('/entregas/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    const entrega = await editStatusEntrega(req.params.id, status);

    if (!entrega) {
      return res.status(400).json({ message: 'Erro ao atualizar status' });
    }

    res.json(entrega);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar status da entrega' });
  }
});

// UPDATE - CONFIRMAR ENTREGA
router.put('/entregas/:id/confirmar', async (req, res) => {
  try {
    const entrega = await confirmarEntrega(req.params.id);

    if (!entrega) {
      return res.status(400).json({ message: 'Erro ao confirmar entrega' });
    }

    res.json(entrega);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao confirmar entrega' });
  }
});

// UPDATE - PROBLEMA DE ESTOQUE
router.put('/entregas/:id/problema-estoque', async (req, res) => {
  try {
    const { observacoes } = req.body;

    const entrega = await registrarProblemaEstoque(
      req.params.id,
      observacoes
    );

    if (!entrega) {
      return res.status(400).json({ message: 'Erro ao registrar problema' });
    }

    res.json(entrega);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar problema de estoque' });
  }
});

// DELETE
router.delete('/entregas/:id', async (req, res) => {
  try {
    const sucesso = await deleteEntrega(req.params.id);

    if (!sucesso) {
      return res.status(404).json({ message: 'Entrega não encontrada' });
    }

    res.json({ message: 'Entrega removida com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover entrega' });
  }
});

module.exports = router;
