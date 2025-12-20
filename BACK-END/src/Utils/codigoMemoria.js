
const codigos = {}; 

function salvarCodigo(email, codigo) {
  codigos[email] = {
    codigo,
    expiraEm: Date.now() + 10 * 60 * 1000 // 10 minutos
  };
}

function validarCodigo(email, codigoInformado) {
  const registro = codigos[email];

  if (!registro) return false;

  // expirado
  if (Date.now() > registro.expiraEm) {
    delete codigos[email];
    return false;
  }

  // código incorreto
  if (registro.codigo !== codigoInformado) {
    return false;
  }

  
  delete codigos[email];
  return true;
}

module.exports = {
  salvarCodigo, validarCodigo };
