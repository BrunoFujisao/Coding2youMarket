const express = require("express");
const router = express.Router();

const { insertPedido, getPedidos, getPedidoPorId, getPedidosPorUsuario, getPedidosAtivos,
  updateStatusPedido, updateDatasPedido, updatePedido, deletePedido, cancelarPedido }
  = require("../Model/DAO/pedidoDao");

const auth = require("../Middleware/authJWTMid");

router.use(auth);

// READ TODOS ATIVOS
router.get("/pedidos/ativos", async (req, res) => {
  try {
    const pedidos = await getPedidosAtivos();
    return res.status(200).json({ success: true, pedidos });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar pedidos ativos",
      error: error.message
    });
  }
});


// READ POR PEDIDO DO USUARIO
router.get("/pedidos/meus", async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    const pedidos = await getPedidosPorUsuario(usuarioId);

    // ✅ Retornar array vazio ao invés de 404
    if (!pedidos || pedidos.length === 0) {
      return res.status(200).json({
        success: true,
        pedidos: []
      });
    }

    return res.status(200).json({ success: true, pedidos });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar pedidos do usuário",
      error: error.message
    });
  }
});


// READ TODOS
router.get("/pedidos", async (req, res) => {
  try {
    const pedidos = await getPedidos();
    return res.status(200).json({ success: true, pedidos });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar pedidos",
      error: error.message
    });
  }
});


// READ POR ID
router.get("/pedidos/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const usuarioId = req.usuario.id;

    const pedido = await getPedidoPorId(id);

    if (!pedido || pedido.usuarioId !== usuarioId) {
      return res.status(404).json({
        success: false,
        message: "Pedido não encontrado"
      });
    }

    return res.status(200).json({ success: true, pedido });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar pedido",
      error: error.message
    });
  }
});


// CREATE 
router.post("/pedidos", async (req, res) => {
  const pool = require("../Config/Db/db");
  const { getCarrinhoPorUsuario, limparCarrinho } = require("../Model/DAO/carrinhoDao");

  try {
    const usuarioId = req.usuario.id;

    const {
      enderecoId,
      frequencia,
      diaEntrega,
      valorTotal,
      valorFinal,
      dataProximaEntrega,
      dataProximaCobranca
    } = req.body;

    if (!enderecoId || valorTotal == null || valorFinal == null) {
      return res.status(400).json({
        success: false,
        message: "Campos obrigatórios não informados (enderecoId, valorTotal, valorFinal)"
      });
    }

    // 1️⃣ Buscar itens do carrinho do usuário
    console.log('🛒 Buscando carrinho do usuário:', usuarioId);
    const itensCarrinho = await getCarrinhoPorUsuario(usuarioId);

    if (!itensCarrinho || itensCarrinho.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Carrinho vazio. Adicione produtos antes de criar um pedido."
      });
    }

    console.log(`📦 ${itensCarrinho.length} itens no carrinho`);

    // 2️⃣ Verificar e diminuir estoque de cada produto
    for (const item of itensCarrinho) {
      const produtoId = item.produto.id;
      const quantidadeComprada = item.quantidade;
      const estoqueAtual = item.produto.estoque;

      console.log(`🔍 Produto ${produtoId}: Estoque=${estoqueAtual}, Comprando=${quantidadeComprada}`);

      // Verificar se há estoque suficiente
      if (estoqueAtual < quantidadeComprada) {
        return res.status(400).json({
          success: false,
          message: `Estoque insuficiente para ${item.produto.nome}. Disponível: ${estoqueAtual}, Solicitado: ${quantidadeComprada}`
        });
      }

      // Diminuir estoque
      const novoEstoque = estoqueAtual - quantidadeComprada;
      await pool.query(
        'UPDATE produtos SET estoque = $1 WHERE id_produto = $2',
        [novoEstoque, produtoId]
      );
      console.log(`✅ Estoque atualizado: ${estoqueAtual} → ${novoEstoque}`);
    }

    // 3️⃣ Criar o pedido
    const descontoClub = parseFloat(valorTotal) - parseFloat(valorFinal);

    const pedido = await insertPedido({
      usuarioId,
      enderecoId,
      frequencia,
      diaEntrega,
      valorTotal,
      valorFinal,
      descontoClub,
      dataProximaEntrega,
      dataProximaCobranca
    });

    if (!pedido) {
      return res.status(500).json({
        success: false,
        message: "Erro ao criar pedido no banco"
      });
    }

    console.log('✅ Pedido criado:', pedido.id);

    // 4️⃣ Vincular itens ao pedido na tabela pedido_itens
    for (const item of itensCarrinho) {
      await pool.query(
        `INSERT INTO pedido_itens (pedidoid, produtoid, quantidade, precounitario)
         VALUES ($1, $2, $3, $4)`,
        [pedido.id, item.produto.id, item.quantidade, item.produto.preco]
      );
    }
    console.log(`✅ ${itensCarrinho.length} itens vinculados ao pedido`);

    // 5️⃣ Limpar carrinho do usuário
    await limparCarrinho(usuarioId);
    console.log('✅ Carrinho limpo');

    return res.status(201).json({
      success: true,
      message: "Pedido criado com sucesso",
      pedido
    });
  } catch (error) {
    console.error('❌ Erro ao criar pedido:', error);
    return res.status(500).json({
      success: false,
      message: "Erro ao criar pedido",
      error: error.message
    });
  }
});


// UPDATE STATUS
router.put("/pedidos/:id/status", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    const statusPermitidos = ["ativa", "pausada", "cancelada", "pendente_estoque"];

    if (!statusPermitidos.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status inválido"
      });
    }

    const pedidoAtualizado = await updateStatusPedido(id, status);

    if (!pedidoAtualizado) {
      return res.status(404).json({
        success: false,
        message: "Pedido não encontrado"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Status atualizado",
      pedido: pedidoAtualizado
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao atualizar status",
      error: error.message
    });
  }
});


// UPDATE DATAS
router.put("/pedidos/:id/datas", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { dataProximaEntrega, dataProximaCobranca } = req.body;

    const pedidoAtualizado = await updateDatasPedido(
      id,
      dataProximaEntrega,
      dataProximaCobranca
    );

    if (!pedidoAtualizado) {
      return res.status(404).json({
        success: false,
        message: "Pedido não encontrado"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Datas atualizadas",
      pedido: pedidoAtualizado
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao atualizar datas",
      error: error.message
    });
  }
});


// SOFT DELETE 
router.patch("/pedidos/:id/cancelar", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const pedidoCancelado = await cancelarPedido(id);

    if (!pedidoCancelado) {
      return res.status(404).json({
        success: false,
        message: "Pedido não encontrado ou já cancelado"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Pedido cancelado",
      pedido: pedidoCancelado
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao cancelar pedido",
      error: error.message
    });
  }
});


// HARD DELETE
router.delete("/pedidos/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const deletado = await deletePedido(id);

    if (!deletado) {
      return res.status(404).json({
        success: false,
        message: "Pedido não encontrado"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Pedido removido definitivamente"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao deletar pedido",
      error: error.message
    });
  }
});

// PAUSAR ASSINATURA
router.patch("/pedidos/:id/pausar", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const usuarioId = req.usuario.id;
    const pedido = await getPedidoPorId(id);

    if (!pedido) {
      return res.status(404).json({
        success: false,
        message: "Pedido não encontrado"
      });
    }

    if (pedido.usuarioid !== usuarioId) {
      return res.status(403).json({
        success: false,
        message: "Acesso negado"
      });
    }

    if (pedido.status === "pausada") {
      return res.status(400).json({
        success: false,
        message: "Pedido já está pausado"
      });
    }

    if (pedido.status === "cancelada") {
      return res.status(400).json({
        success: false,
        message: "Não é possível pausar pedido cancelado"
      });
    }

    const pedidoAtualizado = await updateStatusPedido(id, "pausada");

    return res.status(200).json({
      success: true,
      message: "Pedido pausado com sucesso",
      pedido: pedidoAtualizado
    });

  } catch (error) {
    console.error("Erro ao pausar pedido:", error);
    return res.status(500).json({
      success: false,
      message: "Erro ao pausar pedido",
      error: error.message
    });
  }
});

// REATIVAR ASSINATURA
router.patch("/pedidos/:id/reativar", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const usuarioId = req.usuario.id;
    const pedido = await getPedidoPorId(id);

    if (!pedido) {
      return res.status(404).json({
        success: false,
        message: "Pedido não encontrado"
      });
    }

    if (pedido.usuarioid !== usuarioId) {
      return res.status(403).json({
        success: false,
        message: "Acesso negado"
      });
    }

    if (pedido.status === "ativa") {
      return res.status(400).json({
        success: false,
        message: "Pedido já está ativo"
      });
    }

    if (pedido.status === "cancelada") {
      return res.status(400).json({
        success: false,
        message: "Não é possível reativar pedido cancelado"
      });
    }

    const pedidoAtualizado = await updateStatusPedido(id, "ativa");

    return res.status(200).json({
      success: true,
      message: "Pedido reativado com sucesso",
      pedido: pedidoAtualizado
    });

  } catch (error) {
    console.error("Erro ao reativar pedido:", error);
    return res.status(500).json({
      success: false,
      message: "Erro ao reativar pedido",
      error: error.message
    });
  }
});

// EDITAR ASSINATURA
router.patch("/pedidos/:id/editar", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const usuarioId = req.usuario.id;
    const pedido = await getPedidoPorId(id);

    if (!pedido) {
      return res.status(404).json({
        success: false,
        message: "Pedido não encontrado"
      });
    }
    if (pedido.usuarioid !== usuarioId) {
      return res.status(403).json({
        success: false,
        message: "Acesso negado"
      });
    }

    if (pedido.status === "cancelada") {
      return res.status(400).json({
        success: false,
        message: "Não é possível editar, pedido cancelado"
      });
    }

    const { frequencia, diaEntrega, enderecoId, valorTotal, valorFinal, descontoClub } = req.body;

    if (!frequencia && !diaEntrega && !enderecoId && valorTotal == null && valorFinal == null && descontoClub == null) {
      return res.status(400).json({
        success: false,
        message: "Nenhum campo para atualizar"
      });
    }

    const pedidoAtualizado = await updatePedido(id, {
      frequencia: frequencia || pedido.frequencia,
      diaEntrega: diaEntrega || pedido.diaentrega,
      enderecoId: enderecoId || pedido.enderecoid,
      valorTotal: valorTotal !== undefined ? valorTotal : pedido.valortotal,
      valorFinal: valorFinal !== undefined ? valorFinal : pedido.valorfinal,
      descontoClub: descontoClub !== undefined ? descontoClub : pedido.descontoclub
    });

    return res.status(200).json({
      success: true,
      message: "Pedido editado com sucesso",
      pedido: pedidoAtualizado
    });

  } catch (error) {
    console.error("Erro ao editar pedido:", error);
    return res.status(500).json({
      success: false,
      message: "Erro ao editar pedido",
      error: error.message
    });
  }
});

module.exports = router;
