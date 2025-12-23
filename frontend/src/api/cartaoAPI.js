import { getToken } from './auth';
const BASE_URL = "http://localhost:3000/";


const getAuthHeaders = () => {
    const token = getToken();
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
};

export const meusCartoes = async () => {
    const response = await fetch(`${BASE_URL}api/cartoes/meus`, {
        headers: getAuthHeaders()  // Token JWT no header
    });
    return response.json().cartoes;
};


// Adicionar cartão (com token do Mercado Pago)
export const adicionarCartao = async (dadosCartao) => {
    try {

        const response = await fetch(`${BASE_URL}cartoes`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(dadosCartao)
        });

        if (!response.ok) throw new Error(await response.text());

        const json = await response.json();

        return json;
    } catch (error) {
        console.error("Erro ao adicionar cartão:", error);
        return { success: false, message: error.message };
    }
};

//Editar cartão
export const editarCartao = async (id, nomeImpresso, principal) => {
    try {
        const response = await fetch(`${BASE_URL}cartoes/${id}`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify({ nomeImpresso, principal })
        });

        const json = await response.json();
        if (!response.ok) {
            return { success: false, message: json?.message || "Erro ao editar" };
        }

        return json;
    } catch (error) {
        console.error("Erro ao editar cartão:", error);
        return { success: false, message: "Erro interno ao editar." };
    }
};

// DELETE - Remover cartão
export const deletarCartao = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}cartoes/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders()
        });

        const json = await response.json();

        if (!response.ok) {
            return { success: false, message: json.message };
        }

        return json;
    } catch (error) {
        console.error("Erro ao deletar cartão:", error);
        return { success: false, message: "Erro interno ao deletar." };
    }
};

