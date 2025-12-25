// Inicializar Mercado Pago
let mp = null;

export const initMercadoPago = (publicKey) => {
    if (typeof window !== 'undefined' && window.MercadoPago) {
        mp = new window.MercadoPago(publicKey);
        console.log('✅ Mercado Pago inicializado com chave:', publicKey);
    } else {
        console.error('❌ SDK do Mercado Pago não encontrado!');
    }
};
// Tokenizar cartão
export const tokenizarCartao = async (dadosCartao) => {
    try {
        if (!mp) {
            throw new Error('Mercado Pago não inicializado');
        }
        console.group('🔐 Tokenizando Cartão');
        console.log('📋 Dados do cartão:', {
            numero: dadosCartao.numero,
            nome: dadosCartao.nome,
            validade: dadosCartao.validade,
            cvv: '***',
            cpf: dadosCartao.cpf
        });
        const numeroLimpo = dadosCartao.numero.replace(/\s/g, '');
        const bin = numeroLimpo.substring(0, 6);
        // 1️⃣ BUSCAR MÉTODO DE PAGAMENTO PELO BIN
        console.log('🔍 Buscando payment_method_id para BIN:', bin);

        const paymentMethods = await mp.getPaymentMethods({ bin });
        const paymentMethodId = paymentMethods.results[0]?.id || 'master';

        console.log('💳 payment_method_id encontrado:', paymentMethodId);
        // 2️⃣ CRIAR TOKEN DO CARTÃO
        const cardToken = await mp.createCardToken({
            cardNumber: numeroLimpo,
            cardholderName: dadosCartao.nome,
            cardExpirationMonth: dadosCartao.validade.split('/')[0],
            cardExpirationYear: '20' + dadosCartao.validade.split('/')[1],
            securityCode: dadosCartao.cvv,
            identificationType: 'CPF',
            identificationNumber: dadosCartao.cpf || '00000000000'
        });
        console.log('🎫 Token MP criado:', cardToken.id);
        console.log('🔢 Últimos 4 dígitos:', cardToken.last_four_digits);
        console.groupEnd();
        return {
            success: true,
            token: cardToken.id,
            bandeira: paymentMethodId, // ✅ AGORA VEM CORRETO!
            ultimos4Digitos: cardToken.last_four_digits,
            primeiroDigito: bin.charAt(0)
        };
    } catch (error) {
        console.error('❌ Erro ao tokenizar cartão:', error);
        console.groupEnd();
        return {
            success: false,
            message: error.message || 'Erro ao processar cartão'
        };
    }
};
// Detectar bandeira do cartão (FALLBACK)
export const detectarBandeira = (numero) => {
    const limpo = numero.replace(/\s/g, '');

    if (/^4/.test(limpo)) return 'visa';
    if (/^5[1-5]/.test(limpo)) return 'master';
    if (/^3[47]/.test(limpo)) return 'amex';
    if (/^6(?:011|5)/.test(limpo)) return 'discover';
    if (/^35/.test(limpo)) return 'jcb';

    return 'master';
};
// Formatar número do cartão
export const formatarNumeroCartao = (numero) => {
    return numero.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
};
// Formatar validade
export const formatarValidade = (validade) => {
    const limpo = validade.replace(/\D/g, '');
    if (limpo.length >= 2) {
        return limpo.slice(0, 2) + '/' + limpo.slice(2, 4);
    }
    return limpo;
};