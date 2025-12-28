import { getToken } from './auth';
const BASE_URL = "https://coding2youmarket-production.up.railway.app/api/";

// Headers com autenticação
const getAuthHeaders = () => {
    const token = getToken();
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
};

// Criar novo pedido
export const criarPedido = async (pedidoData) => {
    try {
        const response = await fetch(`${BASE_URL}pedidos`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(pedidoData)
        });

        const json = await response.json();

        if (!response.ok) {
            return { success: false, message: json.message || "Erro ao criar pedido" };
        }

        return { success: true, pedido: json.pedido, message: json.message };
    } catch (error) {
        console.error("Erro ao criar pedido:", error);
        return { success: false, message: "Erro interno ao criar pedido" };
    }
};

//Meus pedidos (do usuário logado)
export const meusPedidos = async () => {
    try {
        const response = await fetch(`${BASE_URL}pedidos/meus`, {
            method: "GET",
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            if (response.status === 404) return []; // Sem pedidos
            throw new Error('Erro ao carregar pedidos');
        }

        const json = await response.json();
        return json.pedidos;

    } catch (error) {
        console.error("Erro ao buscar meus pedidos:", error);
        return [];
    }
};

// Cancelar pedido
export const cancelarPedido = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}pedidos/${id}/cancelar`, {
            method: "PATCH",
            headers: getAuthHeaders()
        });

        const json = await response.json();

        if (!response.ok) {
            return { success: false, message: json.message || "Erro ao cancelar pedido" };
        }

        return { success: true, message: json.message };
    } catch (error) {
        console.error("Erro ao cancelar pedido:", error);
        return { success: false, message: "Erro interno ao cancelar pedido" };
    }
};

// Pausar pedido
export const pausarPedido = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}pedidos/${id}/pausar`, {
            method: "PATCH",
            headers: getAuthHeaders()
        });

        const json = await response.json();

        if (!response.ok) {
            return { success: false, message: json.message || "Erro ao pausar pedido" };
        }

        return { success: true, message: json.message };
    } catch (error) {
        console.error("Erro ao pausar pedido:", error);
        return { success: false, message: "Erro interno ao pausar pedido" };
    }
};

// Reativar pedido
export const reativarPedido = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}pedidos/${id}/reativar`, {
            method: "PATCH",
            headers: getAuthHeaders()
        });

        const json = await response.json();

        if (!response.ok) {
            return { success: false, message: json.message || "Erro ao reativar pedido" };
        }

        return { success: true, message: json.message };
    } catch (error) {
        console.error("Erro ao reativar pedido:", error);
        return { success: false, message: "Erro interno ao reativar pedido" };
    }
};
