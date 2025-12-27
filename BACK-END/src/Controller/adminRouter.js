const express = require('express');
const router = express.Router();

const { getDashboardMetrics, getVendasUltimosDias, getTopProdutos } = require('../Model/DAO/adminDao');
const auth = require('../Middleware/authJWTMid');
const authAdmin = require('../Middleware/authAdminMid');

// Todas as rotas admin requerem autenticação E permissão de admin
router.use(auth);
router.use(authAdmin);

// ==================== DASHBOARD ====================

/**
 * GET /admin/dashboard
 * Retorna métricas principais do dashboard
 */
router.get('/admin/dashboard', async (req, res) => {
    try {
        const metrics = await getDashboardMetrics();

        return res.status(200).json({
            success: true,
            data: metrics
        });
    } catch (error) {
        console.error('Erro ao buscar métricas do dashboard:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro ao buscar métricas do dashboard',
            error: error.message
        });
    }
});

/**
 * GET /admin/vendas-ultimos-dias
 * Retorna vendas dos últimos N dias (default 7)
 */
router.get('/admin/vendas-ultimos-dias', async (req, res) => {
    try {
        const dias = parseInt(req.query.dias) || 7;
        const vendas = await getVendasUltimosDias(dias);

        return res.status(200).json({
            success: true,
            data: vendas
        });
    } catch (error) {
        console.error('Erro ao buscar vendas:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro ao buscar vendas',
            error: error.message
        });
    }
});

/**
 * GET /admin/top-produtos
 * Retorna top N produtos mais vendidos (default 5)
 */
router.get('/admin/top-produtos', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const produtos = await getTopProdutos(limit);

        return res.status(200).json({
            success: true,
            data: produtos
        });
    } catch (error) {
        console.error('Erro ao buscar top produtos:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro ao buscar top produtos',
            error: error.message
        });
    }
});

// ==================== PRODUTOS ====================

/**
 * GET /admin/produtos
 * Retorna todos os produtos com estoque
 */
router.get('/admin/produtos', async (req, res) => {
    try {
        const { getProdutosComEstoque } = require('../Model/DAO/adminDao');
        const produtos = await getProdutosComEstoque();

        return res.status(200).json({
            success: true,
            data: produtos
        });
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro ao buscar produtos',
            error: error.message
        });
    }
});

/**
 * PUT /admin/produtos/:id/estoque
 * Atualiza estoque de um produto
 */
router.put('/admin/produtos/:id/estoque', async (req, res) => {
    try {
        const { updateEstoqueProduto } = require('../Model/DAO/adminDao');
        const produtoId = parseInt(req.params.id);
        const { quantidade } = req.body;

        if (quantidade === undefined || quantidade < 0) {
            return res.status(400).json({
                success: false,
                message: 'Quantidade inválida'
            });
        }

        const estoque = await updateEstoqueProduto(produtoId, quantidade);

        return res.status(200).json({
            success: true,
            data: estoque
        });
    } catch (error) {
        console.error('Erro ao atualizar estoque:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro ao atualizar estoque',
            error: error.message
        });
    }
});

// ==================== PEDIDOS ====================

/**
 * GET /admin/pedidos
 * Retorna todos os pedidos
 */
router.get('/admin/pedidos', async (req, res) => {
    try {
        const { getAllPedidos } = require('../Model/DAO/adminDao');
        const pedidos = await getAllPedidos();

        return res.status(200).json({
            success: true,
            data: pedidos
        });
    } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro ao buscar pedidos',
            error: error.message
        });
    }
});

/**
 * PUT /admin/pedidos/:id/status
 * Atualiza status de um pedido
 */
router.put('/admin/pedidos/:id/status', async (req, res) => {
    try {
        const { updateStatusPedido } = require('../Model/DAO/adminDao');
        const pedidoId = parseInt(req.params.id);
        const { status } = req.body;

        const statusValidos = ['ativa', 'pausada', 'cancelada', 'pendente_estoque'];
        if (!statusValidos.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Status inválido'
            });
        }

        const pedido = await updateStatusPedido(pedidoId, status);

        if (!pedido) {
            return res.status(404).json({
                success: false,
                message: 'Pedido não encontrado'
            });
        }

        return res.status(200).json({
            success: true,
            data: pedido
        });
    } catch (error) {
        console.error('Erro ao atualizar status:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro ao atualizar status',
            error: error.message
        });
    }
});

/**
 * GET /admin/pedidos/:id
 * Retorna detalhes de um pedido
 */
router.get('/admin/pedidos/:id', async (req, res) => {
    try {
        const { getPedidoDetalhes } = require('../Model/DAO/adminDao');
        const pedidoId = parseInt(req.params.id);
        const pedido = await getPedidoDetalhes(pedidoId);

        if (!pedido) {
            return res.status(404).json({
                success: false,
                message: 'Pedido não encontrado'
            });
        }

        return res.status(200).json({
            success: true,
            data: pedido
        });
    } catch (error) {
        console.error('Erro ao buscar pedido:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro ao buscar pedido',
            error: error.message
        });
    }
});

// ==================== USUARIOS ====================

/**
 * GET /admin/usuarios
 * Retorna todos os usuários
 */
router.get('/admin/usuarios', async (req, res) => {
    try {
        const { getAllUsuarios } = require('../Model/DAO/adminDao');
        const usuarios = await getAllUsuarios();

        return res.status(200).json({
            success: true,
            data: usuarios
        });
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro ao buscar usuários',
            error: error.message
        });
    }
});

module.exports = router;
