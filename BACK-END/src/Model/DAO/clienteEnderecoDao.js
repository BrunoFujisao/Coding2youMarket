const pool = require('../../Config/Db/mysqlConnect');

class ClienteEndereco {
  constructor(id, usuarioId, enderecoId, ativo, principal, dataVinculo, dataDesvinculo) {
    this.id = id;
    this.usuarioId = usuarioId;
    this.enderecoId = enderecoId;
    this.ativo = ativo;
    this.principal = principal;
    this.dataVinculo = dataVinculo;
    this.dataDesvinculo = dataDesvinculo;
  }
}

//CREATE
async function insertClienteEndereco({
  usuarioId,
  enderecoId,
  principal = false
}) {
  if (!usuarioId || !enderecoId) {
    console.error('Falha ao vincular endereço: dados obrigatórios ausentes.');
    return false;
  }

  const { rows } = await pool.query(
    `
    INSERT INTO clienteEndereco (
      usuarioId,
      enderecoId,
      ativo,
      principal,
      dataVinculo
    )
    VALUES ($1,$2,true,$3,NOW())
    RETURNING *
    `,
    [usuarioId, enderecoId, principal]
  );

  return rows[0];
}

//READ
async function getClientesEnderecos() {
  const { rows } = await pool.query(
    'SELECT * FROM clienteEndereco ORDER BY id DESC'
  );
  return rows;
}

//READ ENDEREÇOS ATIVOS USER
async function getEnderecosPorUsuario(usuarioId) {
  if (!usuarioId) return false;

  const { rows } = await pool.query(
    `
    SELECT *
    FROM clienteEndereco
    WHERE usuarioId = $1
      AND ativo = true
    ORDER BY principal DESC, id DESC
    `,
    [usuarioId]
  );

  return rows;
}

//READ POR ID
async function getClienteEnderecoPorId(id) {
  if (!id) return false;

  const { rows } = await pool.query(
    'SELECT * FROM clienteEndereco WHERE id = $1',
    [id]
  );

  return rows[0];
}

//UPDATE

// Define endereço principal
async function setEnderecoPrincipal(id, usuarioId) {
  if (!id || !usuarioId) return false;

  // Remove principal dos outros
  await pool.query(
    `
    UPDATE clienteEndereco
    SET principal = false
    WHERE usuarioId = $1
    `,
    [usuarioId]
  );

  const { rows } = await pool.query(
    `
    UPDATE clienteEndereco
    SET principal = true
    WHERE id = $1
      AND usuarioId = $2
      AND ativo = true
    RETURNING *
    `,
    [id, usuarioId]
  );

  return rows[0] || false;
}

//SOFT DELETE
async function desvincularEndereco(id) {
  if (!id) return false;

  const { rows } = await pool.query(
    `
    UPDATE clienteEndereco
    SET
      ativo = false,
      principal = false,
      dataDesvinculo = NOW()
    WHERE id = $1
      AND ativo = true
    RETURNING *
    `,
    [id]
  );

  return rows[0] || false;
}

//HARD DELETE
async function deleteClienteEndereco(id) {
  if (!id) return false;

  const { rowCount } = await pool.query(
    'DELETE FROM clienteEndereco WHERE id = $1',
    [id]
  );

  return rowCount > 0;
}

//EXPORTS
module.exports = {
  ClienteEndereco, insertClienteEndereco, getClientesEnderecos, getEnderecosPorUsuario, getClienteEnderecoPorId,
  setEnderecoPrincipal, desvincularEndereco, deleteClienteEndereco
};
