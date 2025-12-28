
const BASE_URL = "https://coding2youmarket-production.up.railway.app/api";

// Vincular um endereço existente ao usuário logado
export const vincularEndereco = async (enderecoId) => {
    try {
        const response = await fetch(`${BASE_URL}/vincular`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({ endereco_id: enderecoId })
        });

        const json = await response.json();
        if (!response.ok) return { success: false, message: json.error || "Erro ao vincular" };

        return { success: true, data: json.data };
    } catch (error) {
        console.error("Erro ao vincular endereço:", error);
        return { success: false, message: "Erro interno ao vincular." };
    }
};

// Listar vínculos de endereços do usuário logado
export const listarMeusVinculos = async () => {
    try {
        const response = await fetch(`${BASE_URL}/meus-enderecos`, {
            method: "GET",
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            if (response.status === 404) return [];
            throw new Error('Erro ao carregar vínculos');
        }

        return await response.json();
    } catch (error) {
        console.error("Erro ao buscar meus vínculos:", error);
        return [];
    }
};

// Remover o vínculo entre o usuário logado e um endereço
export const desvincularEndereco = async (enderecoId) => {
    try {
        const response = await fetch(`${BASE_URL}/desvincular`, {
            method: "DELETE",
            headers: getAuthHeaders(),
            body: JSON.stringify({ endereco_id: enderecoId })
        });

        const json = await response.json();
        if (!response.ok) return { success: false, message: json.error || "Erro ao desvincular" };

        return { success: true, message: json.message };
    } catch (error) {
        console.error("Erro ao desvincular endereço:", error);
        return { success: false, message: "Erro interno ao desvincular." };
    }
};
