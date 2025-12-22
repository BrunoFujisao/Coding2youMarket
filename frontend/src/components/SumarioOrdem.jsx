export default function SumarioOrdem({ resumo, onCriarAssinatura, loading }) {
    // Valores vêm do backend via API (função fictícia por enquanto)
    const subtotal = resumo?.subtotal || 0;
    const descontoClub = resumo?.descontoClub || 0;
    const frete = resumo?.frete || 0;
    const total = resumo?.total || 0;
    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Resumo</h2>
            {/* Detalhes do Pedido */}
            <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">
                        R$ {subtotal.toFixed(2).replace('.', ',')}
                    </span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Desconto Clube+</span>
                    <span className="font-semibold text-green-600">
                        - R$ {descontoClub.toFixed(2).replace('.', ',')}
                    </span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Frete</span>
                    <span className="font-semibold">
                        R$ {frete.toFixed(2).replace('.', ',')}
                    </span>
                </div>
                <div className="h-px bg-gray-200"></div>
                <div className="flex justify-between text-lg font-bold text-gray-800">
                    <span>Total</span>
                    <span className="text-green-700">
                        R$ {total.toFixed(2).replace('.', ',')}
                    </span>
                </div>
            </div>
            {/* Botão de Criar Assinatura */}
            <button
                onClick={onCriarAssinatura}
                disabled={loading || total === 0}
                className={`
          w-full py-3 rounded-full font-semibold text-white transition-all shadow-md
          ${loading || total === 0
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gray-900 hover:bg-gray-800 active:scale-95'
                    }
        `}
            >
                {loading ? 'Processando...' : 'Criar Assinatura'}
            </button>
            {/* Nota sobre Clube+ */}
            {descontoClub > 0 && (
                <p className="text-xs text-gray-500 mt-4 text-center">
                    Você economizou <span className="font-bold text-green-600">R$ {descontoClub.toFixed(2)}</span> com o Clube+
                </p>
            )}
        </div>
    );
}