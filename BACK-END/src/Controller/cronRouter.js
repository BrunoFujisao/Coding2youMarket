const express = require('express');
const router = express.Router();
const { processarEntregasRecorrentes } = require('../Services/cronService');
const auth = require('../Middleware/authJWTMid');

/**
 * Endpoint para teste manual do CRON
 * Útil para testar sem esperar o horário agendado
 * 
 * GET /api/cron/processar-agora
 */
router.get('/processar-agora', auth, async (req, res) => {
    try {
        console.log(`📍 [MANUAL] Processamento manual iniciado`);

        await processarEntregasRecorrentes();

        return res.status(200).json({
            success: true,
            message: 'Processamento de entregas recorrentes executado com sucesso!',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('❌ [MANUAL] Erro ao processar entregas:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro ao processar entregas recorrentes',
            error: error.message
        });
    }
});

/**
 * Endpoint para visualizar pedidos elegíveis hoje
 * Útil para debugar sem criar pedidos
 * 
 * GET /api/cron/verificar
 */
router.get('/verificar', auth, async (req, res) => {
    try {
        const pool = require('../Config/Db/db');

        const { rows: pedidos } = await pool.query(`
      SELECT 
        p.id,
        p.usuarioid,
        p.frequencia,
        p.status,
        p.dataproximaentrega,
        p.valortotal,
        COUNT(pi.id) as total_itens
      FROM pedidos p
      LEFT JOIN pedido_itens pi ON p.id = pi.pedidoid
      WHERE p.dataproximaentrega::date = CURRENT_DATE
        AND p.status = 'ativa'
        AND p.frequencia IN ('semanal', 'quinzenal', 'mensal')
      GROUP BY p.id
      ORDER BY p.id
    `);

        return res.status(200).json({
            success: true,
            message: `${pedidos.length} pedido(s) elegível(is) para hoje`,
            pedidos,
            data_verificada: new Date().toLocaleDateString('pt-BR')
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Erro ao verificar pedidos',
            error: error.message
        });
    }
});

module.exports = router;
