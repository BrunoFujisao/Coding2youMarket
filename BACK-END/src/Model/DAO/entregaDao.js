const pool = require('../../Config/Db/db');

class Entrega {
  constructor( id, pedidoId, enderecoId, dataEntrega, status, problemaEstoque, observacoes, dataConfirmacao) {
    this.id = id;
    this.pedidoId = pedidoId;
    this.enderecoId = enderecoId;
    this.dataEntrega = dataEntrega;
    this.status = status;
    this.problemaEstoque = problemaEstoque;
    this.observacoes = observacoes;
    this.dataConfirmacao = dataConfirmacao;
  }
}

// CREATE
async function insertEntrega(
  pedidoId,
  enderecoId,
  dataEntrega,
  status,
  problemaEstoque,
  observacoes
) {
  if (!pedidoId || !enderecoId || !dataEntrega) {
    console.error("Falha ao inserir entrega: campos obrigatórios ausentes.");
    return false;
  }

  const result = await pool.query(
    `
    INSERT INTO entregas (
      pedidoid,
      enderecoid,
      dataentrega,
      status,
      problemaestoque,
      observacoes
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
    `,
    [
      pedidoId,
      enderecoId,
      dataEntrega,
      status || 'agendada',
      problemaEstoque || false,
      observacoes || null
    ]
  );

  return result.rows[0];
}

// READ - TODAS
async function getEntregas() {
  const { rows } = await pool.query("SELECT * FROM entregas");
  return rows;
}

// READ - POR ID
async function getEntregaPorId(id) {
  if (!id) {
    console.error("ID da entrega não informado.");
    return false;
  }

  const { rows } = await pool.query(
    "SELECT * FROM entregas WHERE id = $1",
    [id]
  );

  return rows[0] || false;
}

// READ - POR PEDIDO
async function getEntregasPorPedido(pedidoId) {
  if (!pedidoId) {
    console.error("pedidoId não informado.");
    return false;
  }

  const { rows } = await pool.query(
    "SELECT * FROM entregas WHERE pedidoid = $1",
    [pedidoId]
  );

  return rows;
}

// UPDATE - STATUS
async function editStatusEntrega(id, status) {
  if (!id || !status) {
    console.error("ID ou status não informado.");
    return false;
  }

  const result = await pool.query(
    `
    UPDATE entregas
    SET status = $1
    WHERE id = $2
    RETURNING *
    `,
    [status, id]
  );

  if (result.rows.length === 0) return false;
  return result.rows[0];
}

// UPDATE - CONFIRMAR ENTREGA
async function confirmarEntrega(id) {
  if (!id) {
    console.error("ID da entrega não informado.");
    return false;
  }

  const result = await pool.query(
    `
    UPDATE entregas
    SET 
      status = 'entregue',
      dataconfirmacao = NOW()
    WHERE id = $1
    RETURNING *
    `,
    [id]
  );

  if (result.rows.length === 0) return false;
  return result.rows[0];
}

// UPDATE - PROBLEMA DE ESTOQUE
async function registrarProblemaEstoque(id, observacoes) {
  if (!id) {
    console.error("ID da entrega não informado.");
    return false;
  }

  const result = await pool.query(
    `
    UPDATE entregas
    SET 
      problemaestoque = true,
      status = 'falhou',
      observacoes = $2
    WHERE id = $1
    RETURNING *
    `,
    [id, observacoes || null]
  );

  if (result.rows.length === 0) return false;
  return result.rows[0];
}

// DELETE
async function deleteEntrega(id) {
  if (!id) {
    console.error("ID da entrega não informado.");
    return false;
  }

  const result = await pool.query(
    `
    DELETE FROM entregas
    WHERE id = $1
    RETURNING id
    `,
    [id]
  );

  return result.rows.length > 0;
}

// EXPORTS
module.exports = {
  Entrega, insertEntrega, getEntregas, getEntregaPorId, getEntregasPorPedido, editStatusEntrega, confirmarEntrega,
  registrarProblemaEstoque, deleteEntrega
};
