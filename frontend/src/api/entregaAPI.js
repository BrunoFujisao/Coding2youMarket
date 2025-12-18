import { getToken } from './auth';
const BASE_URL = "http://localhost:3000/";

const getAuthHeaders = () => {
    const token = getToken();
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
};

// Para adm - Listar todas as entregas 
export const listarEntregas = async () => {
    try {
        const response = await fetch(`${BASE_URL}entregas`, {
            method: "GET",
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error('Erro ao carregar entregas');
        const json = await response.json();

        return json.entregas || json; // Flexível para diferentes formatos
    } catch (error) {
        console.error("Erro ao buscar entregas:", error);
        return [];
    }
};

// Buscar entrega por ID
export const buscarEntregaPorId = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}entregas/${id}`, {
            method: "GET",
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error('Entrega não encontrada');
        const json = await response.json();

        return json.entrega || json;
    } catch (error) {
        console.error("Erro ao buscar entrega:", error);
        return null;
    }
};

// Entregas de um pedido específico
export const entregasDoPedido = async (pedidoId) => {
    try {
        const response = await fetch(`${BASE_URL}entregas/pedido/${pedidoId}`, {
            method: "GET",
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            if (response.status === 404) return [];
            throw new Error('Erro ao carregar entregas');
        }
        const json = await response.json();

        return json.entregas || json;
    } catch (error) {
        console.error("Erro ao buscar entregas do pedido:", error);
        return [];
    }
};

// Criar entrega
export const criarEntrega = async (dadosEntrega) => {
    try {
        const response = await fetch(`${BASE_URL}entregas`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(dadosEntrega)
        });

        if (!response.ok) throw new Error(await response.text());
        const json = await response.json();

        return json;
    } catch (error) {
        console.error("Erro ao criar entrega:", error);
        return { success: false, message: error.message };
    }
};

// Atualizar status da entrega
export const atualizarStatus = async (id, status) => {
    try {
        const response = await fetch(`${BASE_URL}entregas/${id}/status`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify({ status })
        });

        if (!response.ok) throw new Error('Erro ao atualizar status');
        const json = await response.json();

        return json;
    } catch (error) {
        console.error("Erro ao atualizar status:", error);
        return { success: false, message: error.message };
    }
};

// Confirmar recebimento da entrega (Cliente)
export const confirmarRecebimento = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}entregas/${id}/confirmar`, {
            method: "PUT",
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error('Erro ao confirmar entrega');
        const json = await response.json();

        return json;
    } catch (error) {
        console.error("Erro ao confirmar entrega:", error);
        return { success: false, message: error.message };
    }
};

// Para adm - Registrar problema de estoque 
export const registrarProblema = async (id, observacoes) => {
    try {
        const response = await fetch(`${BASE_URL}entregas/${id}/problema-estoque`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify({ observacoes })
        });

        if (!response.ok) throw new Error('Erro ao registrar problema');
        const json = await response.json();

        return json;
    } catch (error) {
        console.error("Erro ao registrar problema:", error);
        return { success: false, message: error.message };
    }
};

// Para adm - Deletar entrega 
export const deletarEntrega = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}entregas/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error('Erro ao deletar entrega');
        const json = await response.json();

        return json;
    } catch (error) {
        console.error("Erro ao deletar entrega:", error);
        return { success: false, message: error.message };
    }
};

// Atalhos para status específicos
export const marcarComoEmRota = (id) => atualizarStatus(id, 'em_rota');
export const marcarComoPreparando = (id) => atualizarStatus(id, 'preparando');
export const marcarComoEntregue = (id) => atualizarStatus(id, 'entregue');
export const marcarComoFalhou = (id) => atualizarStatus(id, 'falhou');