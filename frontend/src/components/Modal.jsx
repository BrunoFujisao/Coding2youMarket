export default function Modal({ tipo, titulo, mensagem, onClose }) {
  if (!mensagem) return null;

  const isErro = tipo === "erro";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 text-center animate-fadeIn">
        
        <div className={`text-4xl mb-3 ${isErro ? "text-red-500" : "text-green-600"}`}>
          {isErro ? "❌" : "✅"}
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {titulo}
        </h2>

        <p className="text-sm text-gray-600 mb-6">
          {mensagem}
        </p>

        <button
          onClick={onClose}
          className={`w-full py-2 rounded-md font-semibold text-white transition ${
            isErro
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          OK
        </button>
      </div>
    </div>
  );
}
