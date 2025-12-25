const express = require("express");
const router = express.Router();
const { salvarCartaoTokenizado, getCustomerIdPorUsuario } = require("../Model/DAO/cartaoDao");
const { insertPagamento, insertPagamentoMercadoPago, getPagamentos, getPagamentoPorId, getPagamentosPorUsuario, updateStatusPagamento } = require("../Model/DAO/pagamentoDao");
const { getClubMarketPorUsuario, updateStatusClubMarket } = require('../Model/DAO/clubMarketDao');
const { updateClubMember } = require('../Model/DAO/clienteDao');
const auth = require("../Middleware/authJWTMid");
const { MercadoPagoConfig, Payment, PreApproval, Customer, CustomerCard } = require('mercadopago');
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
});

let card;

router.post("/pagamentos/webhook", async (req, res) => {
  try {
    const { action, data } = req.body;

    if (!action || !data?.id) {
      return res.status(400).send("Evento inválido");
    }

    // PAGAMENTO ÚNICO
    if (action === "payment.updated") {
      const paymentClient = new Payment(client);
      const payment = await paymentClient.get({ id: data.id });

      if (payment.status === "approved") {
        await updateStatusPagamentoPorTransacao(payment.id.toString(), "aprovado");
      }
    }

    // ASSINATURA
    if (
      action === "subscription_preapproval.updated" ||
      action === "subscription_authorized_payment"
    ) {
      const preApprovalClient = new PreApproval(client);
      const preapproval = await preApprovalClient.get({ id: data.id });

      if (preapproval.status === "authorized" && preapproval.external_reference) {
        const usuarioId = parseInt(
          preapproval.external_reference.replace("club_", "")
        );

        if (!isNaN(usuarioId)) {
          const clube = await getClubMarketPorUsuario(usuarioId);
          if (clube) {
            await updateStatusClubMarket(clube.id, "ativa");
            await updateClubMember(usuarioId, true);
          }
        }
      }
    }

    return res.status(200).send("OK");
  } catch (error) {
    console.error("❌ Webhook erro:", error);
    return res.status(500).send("Erro");
  }
});

// READ TODOS
router.get("/pagamentos", auth, async (req, res) => {
  try {
    const pagamentos = await getPagamentos();
    return res.json({ success: true, pagamentos });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/pagamentos/meus", auth, async (req, res) => {
  try {
    const pagamentos = await getPagamentosPorUsuario(req.usuario.id);
    return res.json({ success: true, pagamentos: pagamentos || [] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// READ MEUS
router.get("/pagamentos/meus", auth, async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const pagamentos = await getPagamentosPorUsuario(usuarioId);
    return res.json({ success: true, pagamentos: pagamentos || [] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});
// READ POR ID
router.get("/pagamentos/:id", auth, async (req, res) => {
  try {
    const pagamento = await getPagamentoPorId(req.params.id);
    if (!pagamento) {
      return res.status(404).json({ message: "Pagamento não encontrado" });
    }
    if (pagamento.usuarioid !== req.usuario.id) {
      return res.status(403).json({ message: "Acesso negado" });
    }
    return res.json({ success: true, pagamento });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// CREATE
router.post("/pagamentos", auth, async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { cartaoId, valor } = req.body;
    const pagamento = await insertPagamento(usuarioId, cartaoId, valor);
    return res.status(201).json({
      success: true,
      message: "Pagamento criado",
      pagamento
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// UPDATE STATUS
router.put("/pagamentos/:id/status", auth, async (req, res) => {
  const { status } = req.body;
  const pagamento = await updateStatusPagamento(req.params.id, status);
  return res.json({ success: true, pagamento });
});

// SALVAR CARTÃO COM CUSTOMER (SAVED CARD)
router.post("/pagamentos/salvar-cartao", auth, async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { token, bandeira, ultimos4digitos, nomeImpresso, principal } = req.body;
    const user = req.usuario;
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token do cartão é obrigatório"
      });
    }
    console.log('📝 Salvando cartão para usuário:', usuarioId);
    const customerClient = new Customer(client);
    const cardClient = new CustomerCard(client);
    let customerId = await getCustomerIdPorUsuario(usuarioId);
    // 1️⃣ VALIDAR SE CUSTOMER DO BANCO EXISTE NO MP
    if (customerId) {
      console.log('🔍 Validando customer do banco:', customerId);
      try {
        await customerClient.get({ id: customerId });
        console.log('✅ Customer do banco é válido');
      } catch (err) {
        console.warn('⚠️ Customer do banco não existe no MP, recriando...');
        customerId = null;
      }
    }
    // 2️⃣ SE NÃO TEM OU É INVÁLIDO, BUSCAR/CRIAR
    if (!customerId) {
      console.log('🔍 Buscando customer por email:', user.email);

      try {
        const { results } = await customerClient.search({
          options: {
            filters: {
              email: user.email
            }
          }
        });
        if (results && results.length > 0) {
          customerId = results[0].id;
          console.log('♻️ Customer encontrado:', customerId);
        } else {
          console.log('🆕 Criando novo customer...');
          const newCustomer = await customerClient.create({
            body: {
              email: user.email,
              first_name: user.nome?.split(' ')[0] || 'Cliente',
              last_name: user.nome?.split(' ').slice(1).join(' ') || 'Subscrivery'
            }
          });
          customerId = newCustomer.id;
          console.log('✅ Customer criado:', customerId);
        }
      } catch (searchError) {
        console.error('❌ Erro ao buscar/criar customer:', searchError);
        return res.status(500).json({
          success: false,
          message: "Não foi possível criar customer",
          details: searchError.message
        });
      }
    }
    // 3️⃣ CRIAR CARTÃO (PROTEGIDO COM TRY/CATCH)
    console.log('💳 Criando cartão no customer:', customerId);
    let card;

    try {
      card = await cardClient.create({
        customer_id: customerId,
        body: { token }
      });
      console.log('✅ Card criado:', card.id);
    } catch (mpError) {
      console.error('❌ Erro MP ao criar cartão:', {
        message: mpError.message,
        status: mpError.status,
        cause: mpError.cause
      });
      return res.status(400).json({
        success: false,
        message: "Não foi possível salvar o cartão",
        details: mpError.message
      });
    }
    // 4️⃣ SALVAR NO BANCO
    const cartaoSalvo = await salvarCartaoTokenizado({
      usuarioId,
      customerId,
      cardId: card.id,
      tokenCartao: token,
      bandeira: bandeira || "master",
      ultimos4Digitos: ultimos4digitos || "****",
      nomeImpresso: nomeImpresso || "",
      principal: principal || false,
      isDebito: false
    });
    console.log('✅ Salvo no banco:', cartaoSalvo.id);
    return res.status(201).json({
      success: true,
      message: "Cartão salvo com sucesso",
      cartao: cartaoSalvo
    });
  } catch (error) {
    console.error('❌ Erro geral:', error);

    // SEMPRE RETORNAR RESPOSTA (evita SIGTERM)
    return res.status(500).json({
      success: false,
      message: "Erro ao salvar cartão",
      error: error.message
    });
  }
});

// PROCESSAR PAGAMENTO COM SAVED CARD
router.post("/pagamentos/processar", auth, async (req, res) => {
  try {
    const {
      cartaoId,
      customerId,
      cardId,
      transactionAmount,
      installments,
      description,
      paymentMethodId
    } = req.body;

    if (!customerId || !cardId || !transactionAmount) {
      return res.status(400).json({ message: "Dados incompletos" });
    }

    const paymentClient = new Payment(client);

    const payment = await paymentClient.create({
      body: {
        transaction_amount: parseFloat(transactionAmount),
        installments: installments || 1,
        description: description || "Pagamento Subscrivery",
        payment_method_id: paymentMethodId,
        card_id: cardId,
        payer: { id: customerId }
      }
    });

    const pagamentoSalvo = await insertPagamentoMercadoPago({
      usuarioId: req.usuario.id,
      cartaoId,
      valor: transactionAmount,
      status: payment.status,
      transacaoId: payment.id.toString()
    });

    return res.status(201).json({
      success: true,
      pagamento: pagamentoSalvo
    });
  } catch (error) {
    console.error("Erro pagamento:", error);
    return res.status(500).json({ message: "Erro ao processar pagamento" });
  }
});

// CRIAR ASSINATURA
router.post("/pagamentos/criar-assinatura", auth, async (req, res) => {
  try {
    const { email, valor, frequency, frequencyType } = req.body;

    const preApprovalClient = new PreApproval(client);

    const preapproval = await preApprovalClient.create({
      body: {
        reason: "Assinatura Subscrivery",
        payer_email: email,
        external_reference: `club_${req.usuario.id}`,
        auto_recurring: {
          frequency,
          frequency_type: frequencyType,
          transaction_amount: parseFloat(valor),
          currency_id: "BRL"
        },
        back_url: "https://seusite.com/assinatura/confirmada",
        status: "pending"
      }
    });

    return res.status(201).json({
      success: true,
      initPoint: preapproval.init_point
    });
  } catch (error) {
    console.error("Erro assinatura:", error);
    return res.status(500).json({ message: "Erro ao criar assinatura" });
  }
});

module.exports = router;