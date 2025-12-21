function validarCPF(cpf) {
  if (!cpf) return false;

  cpf = cpf.toString().replace(/\D/g, "");

  if (cpf.length !== 11) return false;

  if (/^(\d)\1{10}$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }

  let digito1 = (soma * 10) % 11;
  if (digito1 === 10) digito1 = 0;
  if (digito1 !== parseInt(cpf.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }

  let digito2 = (soma * 10) % 11;
  if (digito2 === 10) digito2 = 0;
  if (digito2 !== parseInt(cpf.charAt(10))) return false;

  return true;
}

module.exports = validarCPF;
