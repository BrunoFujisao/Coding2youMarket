const express = require("express");
const router = express.Router();
const { insertPagamentoMercadoPago } = require("../Model/DAO/pagamentoDao");
const auth = require("../Middleware/authJWTMid");
const { MercadoPagoConfig, Payment } = require('mercadopago');

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN
});

// ✅ PAGAMENTO DIRETO COM TOKEN (sem salvar cartão)
router.post("/pagamentos/processar-direto", auth, async (req, res) => {
    try {
        const usuarioId = req.usuario.id;
        const {
            token,
            transactionAmount,
            installments,
            description,
            paymentMethodId
        } = req.body;

        if (!token || !transactionAmount) {
            return res.status(400).json({
                success: false,
                message: "Token e valor são obrigatórios"
            });
        }

        console.log('💳 Processando pagamento direto...');
        console.log('Token:', token ? 'Presente' : 'Ausente');
        console.log('Valor:', transactionAmount);

        const paymentClient = new Payment(client);

        const payment = await paymentClient.create({
            body: {
                transaction_amount: Number(transactionAmount),
                token: token,
                description: description || "Pedido Subscrivery",
                installments: installments || 1,
                payment_method_id: paymentMethodId || "visa",
                payer: {
                    email: req.usuario.email || `user${usuarioId}@subscrivery.com`
                }
            }
        });

        console.log('✅ Pagamento criado:', payment.id, 'Status:', payment.status);

        // Salvar no banco
        await insertPagamentoMercadoPago({
            usuarioId,
            cartaoId: null, // Sem cartão salvo
            valor: transactionAmount,
            status: payment.status,
            transacaoId: payment.id.toString()
        });

        return res.status(201).json({
            success: true,
            status: payment.status,
            statusDetail: payment.status_detail,
            mercadoPagoId: payment.id,
            message: payment.status === 'approved' ? 'Pagamento aprovado!' : 'Pagamento em processamento'
        });

    } catch (error) {
        console.error("❌ Erro ao processar pagamento:", error);

        return res.status(500).json({
            success: false,
            message: "Erro ao processar pagamento",
            details: error.cause?.[0]?.description || error.message
        });
    }
});

module.exports = router;
