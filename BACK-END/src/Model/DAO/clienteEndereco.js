const pool = require('../../Config/Db/db');
class UsuarioEndereco {
  constructor(id, usuario_id, endereco_id) {
    this.id = id;
    this.usuario_id = usuario_id;
    this.endereco_id = endereco_id;
  }
}

// CREATE 
async function vincularEndereco(usuario_id, endereco_id) {
  try {
    const result = await pool.query(
      `INSERT INTO cliente_endereco (usuario_id, endereco_id) 
       VALUES ($1, $2) 
       RETURNING *`,
      [usuario_id, endereco_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Erro ao vincular endereço:", error.message);
    throw error;
  }
}

// READ POR USER 
async function getVinculosPorUsuario(usuario_id) {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM cliente_endereco WHERE usuario_id = $1",
      [usuario_id]
    );
    return rows;
  } catch (error) {
    console.error("Erro ao buscar vínculos:", error.message);
    throw error;
  }
}

// DELETE 
async function desvincularEndereco(usuario_id, endereco_id) {
  try {
    const result = await pool.query(
      `DELETE FROM cliente_endereco
       WHERE usuario_id = $1 AND endereco_id = $2 
       RETURNING id`,
      [usuario_id, endereco_id]
    );
    return result.rows.length > 0;
  } catch (error) {
    console.error("Erro ao desvincular endereço:", error.message);
    throw error;
  }
}

module.exports = {
  UsuarioEndereco, vincularEndereco, getVinculosPorUsuario, desvincularEndereco
};