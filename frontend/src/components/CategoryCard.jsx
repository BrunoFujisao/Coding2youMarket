import { categoriasImagens } from '../assets/imagens';

const IMAGENS_CATEGORIAS = categoriasImagens;

export default function CategoryCard({ nome, ativo, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`flex-shrink-0 flex flex-col items-center gap-2 transition-transform hover:scale-105 ${ativo ? 'scale-110' : ''
                }`}
        >
            <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 transition-all ${ativo ? 'border-verde-salvia shadow-lg' : 'border-white shadow-md hover:border-verde-salvia-200'
                }`}>
                <img
                    src={IMAGENS_CATEGORIAS[nome] || 'https://via.placeholder.com/100?text=' + nome}
                    alt={nome}
                    className="w-full h-full object-cover"
                />
            </div>
            <span className={`font-semibold text-sm ${ativo ? 'text-verde-petroleo' : 'text-gray-700'
                }`}>
                {nome}
            </span>
        </button>
    );
}
