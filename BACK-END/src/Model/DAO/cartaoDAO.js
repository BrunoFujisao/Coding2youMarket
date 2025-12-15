const pool = require('../../Config/Db/mysqlConnect');

class CartaoCredito {
  constructor(id, usuarioId, tokenCartao, bandeira, ultimos4Digitos, nomeImpresso, principal, isDebito) {

    this.id = id;
    this.usuarioId = usuarioId;
    this.tokenCartao = tokenCartao;
    this.bandeira = bandeira;
    this.ultimos4Digitos = ultimos4Digitos;
    this.nomeImpresso = nomeImpresso;
    this.principal = principal;
    this.isDebito = isDebito;
  }
}

//CREATE 

async function insertCartaoCredito(usuarioId, tokenCartao, bandeira, ultimos4Digitos, nomeImpresso, principal, isDebito) {

  if ( !usuarioId || !tokenCartao || !bandeira || !ultimos4Digitos || !nomeImpresso) {
    console.error("Falha ao inserir cartão: campos obrigatórios ausentes.");
    return false;
  }

  const result = await pool.query(
    `
    INSERT INTO cartao (
      usuarioId,
      tokenCartao,
      bandeira,
      ultimos4Digitos,
      nomeImpresso,
      principal,
      isDebito
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *
    `,
    [
      usuarioId, tokenCartao, bandeira, ultimos4Digitos, nomeImpresso, principal, isDebito
    ]
  );

  return result.rows[0];
}

// READ TODOS
async function getCartoesCredito() {
  const { rows } = await pool.query("SELECT * FROM cartao");
  return rows;
}

// READ POR USUÁRIO

async function getCartoesPorUsuario(usuarioId) {
  if (!usuarioId) {
    console.error("usuarioId não informado.");
    return false;
  }

  const { rows } = await pool.query(
    "SELECT * FROM cartao WHERE usuarioId = $1",
    [usuarioId]
  );

  return rows;
}

// UPDATE 

async function editCartaoCredito(
  id,
  bandeira,
  nomeImpresso,
  principal,
  isDebito
) {
  if (!id || !bandeira || !nomeImpresso) {
    console.error("Falha ao editar cartão: campos obrigatórios ausentes.");
    return false;
  }

  const result = await pool.query(
    `
    UPDATE cartao
    SET bandeira = $1,
        nomeImpresso = $2,
        principal = $3,
        isDebito = $4
    WHERE id = $5
    RETURNING *
    `,
    [bandeira, nomeImpresso, principal, isDebito, id]
  );

  if (result.rows.length === 0) return false;
  return result.rows[0];
}

// DELETE 

async function deleteCartaoCredito(id) {
  if (!id) {
    console.error("ID do cartão não informado.");
    return false;
  }

  const result = await pool.query(
    `
    DELETE FROM cartao
    WHERE id = $1
    RETURNING id
    `,
    [id]
  );

  return result.rows.length > 0;
}

// EXPORTS 

module.exports = {
  CartaoCredito, insertCartaoCredito, getCartoesCredito, getCartoesPorUsuario, editCartaoCredito,deleteCartaoCredito
};
