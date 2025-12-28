import { Trash2, Plus, Minus } from 'lucide-react';
export default function ItemCarrinho({ item, onAtualizarQuantidade, onRemover }) {
    const handleIncrement = () => {
        onAtualizarQuantidade(item.id, item.quantidade + 1);
    };
    const handleDecrement = () => {
        if (item.quantidade > 1) {
            onAtualizarQuantidade(item.id, item.quantidade - 1);
        }
    };
    return (
        <div className="flex items-center gap-4 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
            {/* Imagem do Produto */}
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <img
                    src={item.produto?.imagemUrl || 'https://via.placeholder.com/100'}
                    alt={item.produto?.nome || 'Produto'}
                    className="w-full h-full object-cover"
                />
            </div>
            {/* Informações do Produto */}
            <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 text-sm md:text-base truncate">
                    {item.produto?.nome || 'Produto'}
                </h3>
                <p className="text-xs text-gray-500 mt-1">Em estoque</p>
                <p className="text-lg font-bold text-verde-petroleo mt-1">
                    R$ {(item.produto?.preco || 0).toFixed(2).replace('.', ',')}
                </p>
            </div>
            {/* Controles */}
            <div className="flex items-center gap-3">
                {/* Botão Remover */}
                <button
                    onClick={() => onRemover(item.id)}
                    className="p-2 hover:bg-red-50 rounded-full transition-colors text-gray-400 hover:text-red-600"
                    title="Remover item"
                >
                    <Trash2 size={18} />
                </button>
                {/* Seletor de Quantidade */}
                <div className="flex items-center bg-gray-100 rounded-full p-1 gap-1">
                    <button
                        onClick={handleDecrement}
                        className="w-7 h-7 flex items-center justify-center bg-white rounded-full shadow-sm text-gray-600 hover:text-verde-salvia-600 transition-colors"
                        disabled={item.quantidade === 1}
                    >
                        <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-medium text-gray-700">
                        {item.quantidade}
                    </span>
                    <button
                        onClick={handleIncrement}
                        className="w-7 h-7 flex items-center justify-center bg-white rounded-full shadow-sm text-gray-600 hover:text-verde-salvia-600 transition-colors"
                    >
                        <Plus size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}
