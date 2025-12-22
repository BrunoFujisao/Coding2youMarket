import { useState } from 'react';
import { validarCodigoRecuperacao } from '../api/auth'; 

export function TelaValidacaoCodigo({ emailUsuario }) {
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

  const handleValidar = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensagem({ tipo: '', texto: '' });


    const resultado = await validarCodigoRecuperacao(emailUsuario, codigo);

    if (resultado.success) {
      setMensagem({ tipo: 'sucesso', texto: resultado.message });
      // navigate('/redefinir-senha');
    } else {
      setMensagem({ tipo: 'erro', texto: resultado.message });
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-xl font-bold">Verifique seu E-mail</h2>
      <p className="text-gray-600 mb-4">Enviamos um código para {emailUsuario}</p>

      <form onSubmit={handleValidar} className="w-full max-w-sm">
        <input
          type="text"
          placeholder="Digite o código"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          className="w-full p-2 border rounded mb-3 text-center tracking-widest"
          maxLength={6}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-2 rounded text-white ${
            loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Validando...' : 'Validar Código'}
        </button>
      </form>

      {mensagem.texto && (
        <p className={`mt-4 ${mensagem.tipo === 'erro' ? 'text-red-500' : 'text-green-500'}`}>
          {mensagem.texto}
        </p>
      )}
    </div>
  );
}