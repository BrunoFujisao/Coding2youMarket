const pool = require('../../Config/Db/db');

class ClubMarket {
  constructor(id, usuarioId, dataInicio, status, valorMensal) {
    this.id = id;
    this.usuarioId = usuarioId;
    this.dataInicio = dataInicio;
    this.status = status;
    this.valorMensal = valorMensal;
  }
}

//CREATE 
async function insertClubMarket({
  usuarioId,
  valorMensal = 19.90,
  status = 'ativa'
}) {
  if (!usuarioId) {
    console.error('Falha ao criar assinatura Club Market: usuarioId obrigatório.');
    return false;
  }

  const { rows } = await pool.query(
    `
    INSERT INTO club_market (
      usuarioId,
      status,
      valorMensal
    )
    VALUES ($1,$2,$3)
    RETURNING *
    `,
    [usuarioId, status, valorMensal]
  );

  return rows[0];
}

//READ
async function getClubMarkets() {
  const { rows } = await pool.query(
    'SELECT * FROM club_market ORDER BY id DESC'
  );
  return rows;
}

//READ POR USUARIO
async function getClubMarketPorUsuario(usuarioId) {
  if (!usuarioId) return false;

  const { rows } = await pool.query(
    `
    SELECT *
    FROM club_market
    WHERE usuarioId = $1
    LIMIT 1
    `,
    [usuarioId]
  );

  return rows[0];
}

//READ POR ID
async function getClubMarketPorId(id) {
  if (!id) return false;

  const { rows } = await pool.query(
    'SELECT * FROM club_market WHERE id = $1',
    [id]
  );

  return rows[0];
}

//UPDATE STATUS
async function updateStatusClubMarket(id, status) {
  const statusPermitidos = ['ativa', 'cancelada', 'suspensa'];

  if (!id || !statusPermitidos.includes(status)) return false;

  const { rows } = await pool.query(
    `
    UPDATE club_market
    SET status = $1
    WHERE id = $2
    RETURNING *
    `,
    [status, id]
  );

  return rows[0] || false;
}

//DELETE
async function deleteClubMarket(id) {
  if (!id) return false;

  const { rowCount } = await pool.query(
    'DELETE FROM club_market WHERE id = $1',
    [id]
  );

  return rowCount > 0;
}

//EXPORTS
module.exports = {
  ClubMarket, insertClubMarket, getClubMarkets, getClubMarketPorUsuario, getClubMarketPorId, updateStatusClubMarket, deleteClubMarket
};
