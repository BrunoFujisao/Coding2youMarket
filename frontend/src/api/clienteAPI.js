const BASE_URL = "http://localhost:3000";

export const buscarClientePorId = async (clienteId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${BASE_URL}/api/clientes/${clienteId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erro ao buscar cliente");
    }

    return data.usuario; 

  } catch (error) {
    console.error("Erro ao buscar cliente:", error.message);
    return null;
  }
};
