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

//Para adm - Listar todos os Club Markets 
export const listarClubMarkets = async () => {
    try {
        const response = await fetch(`${BASE_URL}club-market`, {
            method: "GET",
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error('Erro ao carregar assinaturas');

        const json = await response.json();

        return json.clubes;

    } catch (error) {
        console.error("Erro ao buscar Club Markets:", error);
        return [];
    }
};

//Para adm - Buscar por ID
export const buscarClubPorId = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}club-market/${id}`, {
            method: "GET",
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error('Assinatura não encontrada');

        const json = await response.json();

        return json.clube;
    } catch (error) {
        console.error("Erro ao buscar assinatura:", error);
        return null;
    }
};

//Para adm - Verificar status do Club Market do usuário
export const verificarStatus = async (usuarioId) => {
    try {
        const response = await fetch(`${BASE_URL}club-market/usuario/${usuarioId}`, {
            method: "GET",
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            if (response.status === 404) return null; // Não tem assinatura
            throw new Error('Erro ao verificar status');
        }

        const json = await response.json();

        return json.clube;

    } catch (error) {
        console.error("Erro ao verificar status:", error);
        return null;
    }
};

// POST - Aderir ao Club Market
export const aderir = async (usuarioId, valorMensal = 19.90) => {
    try {
        const response = await fetch(`${BASE_URL}club-market`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({ usuarioId, valorMensal })
        });

        if (!response.ok) throw new Error(await response.text());
        const json = await response.json();
        return json;

    } catch (error) {
        console.error("Erro ao aderir ao Club Market:", error);
        return { success: false, message: error.message };
    }
};

// PUT - Atualizar status
export const atualizarStatus = async (id, status) => {
    try {
        const response = await fetch(`${BASE_URL}club-market/${id}/status`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify({ status })
        });

        const json = await response.json();

        if (!response.ok) {
            return { success: false, message: json?.message || "Erro ao atualizar" };
        }

        return { success: true, message: json?.message, clube: json.clube };
    } catch (error) {
        console.error("Erro ao atualizar status:", error);
        return { success: false, message: "Erro interno ao atualizar." };
    }
};

// DELETE - Deletar assinatura (Admin)
export const deletarClub = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}club-market/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders()
        });

        const json = await response.json();

        if (!response.ok) {
            return { success: false, message: json.message };
        }

        return json;
    } catch (error) {
        console.error("Erro ao deletar assinatura:", error);
        return { success: false, message: "Erro interno ao deletar." };
    }
};

// Atalhos para ações comuns
export const cancelar = (id) => atualizarStatus(id, 'cancelada');
export const reativar = (id) => atualizarStatus(id, 'ativa');
export const suspender = (id) => atualizarStatus(id, 'suspensa');


// POST - Assinar um plano (passa apenas o ID do plano)
export const assinarPlano = async (planoId) => {
    try {
        const response = await fetch(`${BASE_URL}club-market/assinar/${planoId}`, {
            method: "POST",
            headers: getAuthHeaders()
        });

        const json = await response.json();

        if (!response.ok) {
            return { success: false, message: json.message || 'Erro ao assinar plano' };
        }

        return { success: true, message: json.message, usuario: json.usuario };

    } catch (error) {
        console.error("Erro ao assinar plano:", error);
        return { success: false, message: "Erro ao conectar com o servidor" };
    }
};


// POST - Cancelar assinatura do usuário logado
export const cancelarAssinatura = async () => {
    try {
        const response = await fetch(`${BASE_URL}club-market/cancelar-assinatura`, {
            method: "POST",
            headers: getAuthHeaders()
        });

        const json = await response.json();

        if (!response.ok) {
            return { success: false, message: json.message || 'Erro ao cancelar assinatura' };
        }

        return { success: true, message: json.message, usuario: json.usuario };

    } catch (error) {
        console.error("Erro ao cancelar assinatura:", error);
        return { success: false, message: "Erro ao conectar com o servidor" };
    }
};


// Buscar minha assinatura (usuário logado)
export const minhaAssinatura = async () => {
    try {
        const response = await fetch(`${BASE_URL}club-market/meu`, {
            method: "GET",
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            if (response.status === 404) return null;
            throw new Error('Erro ao buscar assinatura');
        }

        const json = await response.json();
        return json.clube;

    } catch (error) {
        console.error("Erro ao buscar minha assinatura:", error);
        return null;
    }
};