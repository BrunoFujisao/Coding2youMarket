import { getToken } from './auth';
const BASE_URL = "http://localhost:3000/";

const getAuthHeaders = () => {
    const token = getToken();
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
};

//Para adm - Listar todos os pagamentos 
export const listarPagamentos = async () => {
    try {
        const response = await fetch(`${BASE_URL}pagamentos`, {
            method: "GET",
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error('Erro ao carregar pagamentos');

        const json = await response.json();

        return json.pagamentos;
    } catch (error) {
        console.error("Erro ao buscar pagamentos:", error);
        return [];
    }
};

//Buscar pagamento por ID
export const buscarPagamentoPorId = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}pagamentos/${id}`, {
            method: "GET",
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error('Pagamento não encontrado');

        const json = await response.json();

        return json.pagamento;
    } catch (error) {
        console.error("Erro ao buscar pagamento:", error);
        return null;
    }
};

// Histórico de pagamentos do usuário
export const meuHistorico = async (usuarioId) => {
    try {
        const response = await fetch(`${BASE_URL}pagamentos/usuario/${usuarioId}`, {
            method: "GET",
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            if (response.status === 404) return []; // Sem pagamentos
            throw new Error('Erro ao carregar histórico');
        }

        const json = await response.json();

        return json.pagamentos;
    } catch (error) {
        console.error("Erro ao buscar histórico:", error);
        return [];
    }
};

//Pagamentos de um pedido específico
export const pagamentosDoPedido = async (pedidoId) => {
    try {
        const response = await fetch(`${BASE_URL}pagamentos/pedido/${pedidoId}`, {
            method: "GET",
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            if (response.status === 404) return [];
            throw new Error('Erro ao carregar pagamentos do pedido');
        }

        const json = await response.json();

        return json.pagamentos;
    } catch (error) {
        console.error("Erro ao buscar pagamentos do pedido:", error);
        return [];
    }
};

//Criar pagamento (será integrado com Mercado Pago depois)
export const criarPagamento = async (dadosPagamento) => {
    try {
        const response = await fetch(`${BASE_URL}pagamentos`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(dadosPagamento)
        });

        if (!response.ok) throw new Error(await response.text());

        const json = await response.json();

        return json;
    } catch (error) {
        console.error("Erro ao criar pagamento:", error);
        return { success: false, message: error.message };
    }
};

//Atualizar status do pagamento
export const atualizarStatus = async (id, status) => {
    try {
        const response = await fetch(`${BASE_URL}pagamentos/${id}/status`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify({ status })
        });

        const json = await response.json();

        if (!response.ok) {
            return { success: false, message: json?.message || "Erro ao atualizar" };
        }

        return json;
    } catch (error) {
        console.error("Erro ao atualizar status:", error);
        return { success: false, message: "Erro interno ao atualizar." };
    }
};

// PATCH - Cancelar pagamento
export const cancelarPagamento = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}pagamentos/${id}/cancelar`, {
            method: "PATCH",
            headers: getAuthHeaders()
        });

        const json = await response.json();

        if (!response.ok) {
            return { success: false, message: json.message };
        }

        return json;
    } catch (error) {
        console.error("Erro ao cancelar pagamento:", error);
        return { success: false, message: "Erro interno ao cancelar." };
    }
};

// Atalhos para status específicos
export const aprovarPagamento = (id) => atualizarStatus(id, 'aprovado');
export const recusarPagamento = (id) => atualizarStatus(id, 'recusado');
export const estornarPagamento = (id) => atualizarStatus(id, 'estornado');