const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authJwt.middleware");

const {
  insertCarrinho,
  getCarrinhoPorUsuario,
  limparCarrinho,
  editCarrinho,
  deleteCarrinho
} = require("../Model/DAO/carrinhoDAO");

// 🔐 TODAS as rotas abaixo exigem login
router.use(auth);

// READ 
router.get("/carrinho", async (req, res) => {
  try {
    const usuarioId = req.usuario.userId;

    const carrinho = await getCarrinhoPorUsuario(usuarioId);

    return res.status(200).json(carrinho || []);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar carrinho",
      error: error.message
    });
  }
});

// CREATE 
router.post("/carrinho", async (req, res) => {
  try {
    const usuarioId = req.usuario.userId;
    const { produtoId, quantidade, observacao } = req.body;

    if (!produtoId || quantidade == null) {
      return res.status(400).json({
        success: false,
        message: "produtoId e quantidade são obrigatórios"
      });
    }

    const result = await insertCarrinho(
      usuarioId,
      produtoId,
      quantidade,
      observacao
    );

    return res.status(201).json({
      success: true,
      message: "Produto adicionado ao carrinho com sucesso!",
      carrinho: result
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao adicionar produto ao carrinho",
      error: error.message
    });
  }
});

// UPDATE
router.put("/carrinho/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { quantidade, observacao } = req.body;

    if (quantidade == null) {
      return res.status(400).json({
        success: false,
        message: "Quantidade é obrigatória"
      });
    }

    const result = await editCarrinho(id, quantidade, observacao);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Item do carrinho não encontrado"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Carrinho atualizado com sucesso!",
      carrinho: result
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao editar carrinho",
      error: error.message
    });
  }
});

// DELETE
router.delete("/carrinho/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const result = await deleteCarrinho(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Item do carrinho não encontrado"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Item removido do carrinho com sucesso!"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao excluir item do carrinho",
      error: error.message
    });
  }
});

// DELETE
router.delete("/carrinho/limpar", async (req, res) => {
  try {
    const usuarioId = req.usuario.userId;

    const result = await limparCarrinho(usuarioId);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Carrinho já está vazio"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Carrinho limpo com sucesso!"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao limpar carrinho",
      error: error.message
    });
  }
});

module.exports = router;
