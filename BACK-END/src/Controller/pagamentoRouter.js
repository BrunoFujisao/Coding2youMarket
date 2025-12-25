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

router.post("/pagamentos/webhook", async (req, res) => {
  res.status(200).send("OK");
  try {
    const { type, data } = req.body;
    if (type === "payment") {
      try {
        const paymentClient = new Payment(client);
        const payment = await paymentClient.get({ id: data.id });
        if (payment.status === "approved") {
          // Pagamento aprovado
        }
      } catch (error) {
        // Pagamento ainda não disponível
      }
    } else if (type === "subscription_preapproval" || type === "subscription_authorized_payment") {
      try {
        const preApprovalClient = new PreApproval(client);
        const preapproval = await preApprovalClient.get({ id: data.id });
        if (preapproval.status === "authorized") {
          if (preapproval.external_reference) {
            const usuarioId = parseInt(preapproval.external_reference.replace("club_", ""));
            if (!isNaN(usuarioId)) {
              const clube = await getClubMarketPorUsuario(usuarioId);
              if (clube) {
                await updateStatusClubMarket(clube.id, "ativa");
                await updateClubMember(usuarioId, true);
              }
            }
          }
        }
      } catch (error) {
        // Assinatura ainda não disponível
      }
    }
  } catch (error) {
    // Erro ao processar webhook
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
  console.log('🔍 [DEBUG] Iniciando salvar-cartao...');
  try {
    const usuarioId = req.usuario.id;
    const { token, bandeira, ultimos4digitos, nomeImpresso, principal } = req.body;
    const user = req.usuario;

    console.log('🔍 [DEBUG] Usuario ID:', usuarioId);
    console.log('🔍 [DEBUG] Body:', { token: token ? 'presente' : 'ausente', bandeira, ultimos4digitos });

    if (!token) {
      console.log('❌ [DEBUG] Token ausente');
      return res.status(400).json({
        success: false,
        message: "Token do cartão é obrigatório"
      });
    }

    console.log('🔍 [DEBUG] Criando customerClient...');
    const customerClient = new Customer(client);
    console.log('🔍 [DEBUG] Buscando customerId do banco...');
    let customerId = await getCustomerIdPorUsuario(usuarioId);
    console.log('🔍 [DEBUG] Customer ID do banco:', customerId);

    // Validar se o customer do banco existe no MP
    if (customerId) {
      try {
        console.log('🔍 [DEBUG] Validando customer no MP:', customerId);
        await customerClient.get({ id: customerId });
        console.log('✅ [DEBUG] Customer válido');
      } catch (error) {
        console.log('⚠️ [DEBUG] Customer inválido, será criado novo');
        customerId = null; // Forçar criação de um novo
      }
    }

    // Buscar/Criar customer
    if (!customerId) {
      console.log('🔍 [DEBUG] Buscando/criando customer...');
      try {
        console.log('🔍 [DEBUG] Buscando por email:', user.email);
        const { results } = await customerClient.search({
          options: {
            filters: {
              email: user.email
            }
          }
        });

        if (results && results.length > 0) {
          // ✅ VALIDAR SE O CUSTOMER DA BUSCA REALMENTE EXISTE
          const customerIdFromSearch = results[0].id;
          console.log('🔍 [DEBUG] Customer encontrado na busca:', customerIdFromSearch);
          console.log('🔍 [DEBUG] Validando se existe no MP...');

          try {
            await customerClient.get({ id: customerIdFromSearch });
            customerId = customerIdFromSearch;
            console.log('✅ [DEBUG] Customer validado:', customerId);
          } catch (validationError) {
            console.log('⚠️ [DEBUG] Customer da busca não existe mais, criando novo...');
            // Customer não existe, criar um novo
            const customer = await customerClient.create({
              body: {
                email: user.email,
                first_name: user.nome?.split(' ')[0] || 'Cliente',
                last_name: user.nome?.split(' ').slice(1).join(' ') || '',
                phone: {
                  area_code: user.telefone?.substring(0, 2) || '00',
                  number: user.telefone?.substring(2) || '000000000'
                },
                identification: {
                  type: 'CPF',
                  number: user.cpf || '00000000000'
                }
              }
            });
            customerId = customer.id;
            console.log('✅ [DEBUG] Novo customer criado:', customerId);
          }
        } else {
          console.log('🔍 [DEBUG] Nenhum customer encontrado, criando novo...');
          const customer = await customerClient.create({
            body: {
              email: user.email,
              first_name: user.nome?.split(' ')[0] || 'Cliente',
              last_name: user.nome?.split(' ').slice(1).join(' ') || '',
              phone: {
                area_code: user.telefone?.substring(0, 2) || '00',
                number: user.telefone?.substring(2) || '000000000'
              },
              identification: {
                type: 'CPF',
                number: user.cpf || '00000000000'
              }
            }
          });
          customerId = customer.id;
          console.log('✅ [DEBUG] Customer criado:', customerId);
        }
      } catch (error) {
        console.error('❌ [DEBUG] Erro ao buscar/criar customer:', error);
        if (error.cause?.[0]?.code === '101') {
          console.log('🔍 [DEBUG] Tratando erro 101...');
          const { results } = await customerClient.search({
            options: { filters: { email: user.email } }
          });
          if (results && results.length > 0) {
            customerId = results[0].id;
            console.log('✅ [DEBUG] Customer recuperado:', customerId);
          }
        } else {
          throw error;
        }
      }
    }

    // Salvar cartão
    console.log('🔍 [DEBUG] Criando card no MP...');
    const cardClient = new CustomerCard(client);

    const card = await cardClient.create({
      customer_id: customerId,
      body: { token }
    });
    console.log('✅ [DEBUG] Card criado:', card.id);

    // Salvar no banco
    console.log('🔍 [DEBUG] Salvando no banco...');
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
    console.log('✅ [DEBUG] Salvo no banco:', cartaoSalvo.id);

    return res.status(201).json({
      success: true,
      message: "Cartão salvo com sucesso",
      cartao: cartaoSalvo
    });
  } catch (error) {
    console.error('❌ [DEBUG] Erro geral:', error);
    console.error('❌ [DEBUG] Stack:', error.stack);
    return res.status(500).json({
      success: false,
      message: "Erro ao salvar cartão",
      error: error.message,
      details: error.cause || error.response?.data || 'Sem detalhes adicionais'
    });
  }
});

// PROCESSAR PAGAMENTO COM SAVED CARD
router.post("/pagamentos/processar", auth, async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const {
      cartaoId,
      customerId,
      cardId,
      transactionAmount,
      installments,
      description,
      paymentMethodId,
      email
    } = req.body;
    if ((!customerId || !cardId) || !transactionAmount || !email) {
      return res.status(400).json({
        success: false,
        message: "Dados incompletos (precisa de customerId e cardId)"
      });
    }
    const paymentClient = new Payment(client);
    const payment = await paymentClient.create({
      body: {
        transaction_amount: parseFloat(transactionAmount),
        description: description || "Pedido Subscrivery",
        installments: parseInt(installments) || 1,
        payment_method_id: paymentMethodId || "master",
        payer: {
          id: customerId,
          email: email
        }
      }
    });
    const pagamentoSalvo = await insertPagamentoMercadoPago({
      usuarioId,
      cartaoId: cartaoId || null,
      valor: transactionAmount,
      status: payment.status,
      transacaoId: payment.id.toString()
    });
    return res.status(201).json({
      success: true,
      message: "Pagamento processado",
      pagamento: {
        id: pagamentoSalvo.id,
        status: payment.status,
        statusDetail: payment.status_detail,
        mercadoPagoId: payment.id
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao processar pagamento",
      error: error.message
    });
  }
});
// CRIAR ASSINATURA
router.post("/pagamentos/criar-assinatura", auth, async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { email, autoRecurringAmount, frequency, frequencyType, reason, backUrl, cardId, customerId } = req.body;
    if (!email || !autoRecurringAmount || !frequency || !frequencyType) {
      return res.status(400).json({
        success: false,
        message: "Dados incompletos"
      });
    }
    const preApprovalClient = new PreApproval(client);
    const body = {
      reason: reason || "Assinatura Subscrivery",
      auto_recurring: {
        frequency: parseInt(frequency),
        frequency_type: frequencyType,
        transaction_amount: parseFloat(autoRecurringAmount),
        currency_id: "BRL"
      },
      payer_email: email,
      back_url: backUrl || "https://seusite.com/assinatura/confirmada",
      status: "pending"
    };
    // Se tem card ID, adicionar
    if (cardId && customerId) {
      body.card_token_id = cardId;
      body.payer_id = customerId;
    }
    const preapproval = await preApprovalClient.create({ body });
    return res.status(201).json({
      success: true,
      message: "Assinatura criada com sucesso",
      assinatura: {
        id: preapproval.id,
        initPoint: preapproval.init_point,
        status: preapproval.status
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao criar assinatura",
      error: error.message
    });
  }
});
module.exports = router;