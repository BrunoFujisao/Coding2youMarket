const express = require("express");
const router = express.Router();
//const authMiddleware = require('../middlewares/authMiddleware'); //depois alterar para middleware correto!!

const { insertCartaoCredito, getCartoesCredito, getCartoesPorUsuario, getCartaoById, editCartaoCredito, deleteCartaoCredito
} = require("../Model/DAO/cartaoDAO");

// Para adm - READ Todos 
router.get("/cartoes", async (req, res) => {
  try {
    const cartoes = await getCartoesCredito();
    return res.status(200).json({ success: true, cartoes });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar cartões",
      error: error.message
    });
  }
});

// READ - Por usuário
router.get("/cartoes/usuario/:usuarioId", async (req, res) => {
  try {
    const { usuarioId } = req.params;
    if (!usuarioId) {
      return res.status(400).json({
        success: false,
        message: "usuarioId é obrigatório"
      });
    }

    const cartoes = await getCartoesPorUsuario(usuarioId);

    if (!cartoes || cartoes.length === 0) {
      return res.status(200).json({ success: true, cartoes: [] });
    }

    return res.status(200).json({ success: true, cartoes });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar cartões",
      error: error.message
    });
  }
});

// READ - Por ID
router.get("/cartoes/:id", async (req, res) => {
  try {

    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID é obrigatório"
      });
    }

    const cartao = await getCartaoById(id);

    if (!cartao) {
      return res.status(404).json({
        success: false,
        message: "Cartão não encontrado"
      });
    }

    return res.status(200).json({ success: true, cartao });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar cartão",
      error: error.message
    });
  }
});

// CREATE (vem do frontend com token do Mercado Pago)
router.post("/cartoes", async (req, res) => {
  try {
    const { usuarioId, tokenCartao, bandeira, ultimos4Digitos, nomeImpresso, principal, isDebito } = req.body;

    if (!usuarioId || !tokenCartao || !bandeira || !ultimos4Digitos || !nomeImpresso) {
      return res.status(400).json({
        success: false,
        message: "Campos obrigatórios não informados"
      });
    }

    const cartao = await insertCartaoCredito(
      usuarioId,
      tokenCartao,
      bandeira,
      ultimos4Digitos,
      nomeImpresso,
      principal,
      isDebito
    );

    return res.status(201).json({
      success: true,
      message: "Cartão adicionado com sucesso",
      cartao
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao adicionar cartão",
      error: error.message
    });
  }
});

// UPDATE
router.put("/cartoes/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const { nomeImpresso, principal } = req.body;

    const cartao = await editCartaoCredito(id, nomeImpresso, principal);

    if (!cartao) {
      return res.status(404).json({
        success: false,
        message: "Cartão não encontrado"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cartão atualizado com sucesso",
      cartao
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao atualizar cartão",
      error: error.message
    });
  }
});

// DELETE
router.delete("/cartoes/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const deletado = await deleteCartaoCredito(id);

    if (!deletado) {
      return res.status(404).json({
        success: false,
        message: "Cartão não encontrado"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cartão removido com sucesso"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao remover cartão",
      error: error.message
    });
  }
});

//router.get("/cartoes/meus", authMiddleware, async (req, res) => {
//  const cartoes = await getCartoesPorUsuario(req.userId); // req.userId vem do token JWT
//  return res.json({ success: true, cartoes });
//});

module.exports = router;