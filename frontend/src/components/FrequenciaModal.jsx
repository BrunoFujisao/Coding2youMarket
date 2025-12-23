import { X, Calendar } from 'lucide-react';
import { useState } from 'react';
export default function FrequenciaModal({ isOpen, onClose, onConfirmar }) {
    const [frequenciaSelecionada, setFrequenciaSelecionada] = useState('quinzenal');
    const [diaPreferencial, setDiaPreferencial] = useState('');
    const opcoes = [
        { value: 'semanal', label: 'Semanal', descricao: 'Entrega toda semana' },
        { value: 'quinzenal', label: 'Quinzenal', descricao: 'Entrega a cada 15 dias' },
        { value: 'mensal', label: 'Mensal', descricao: 'Entrega uma vez por mês' }
    ];
    const handleConfirmar = () => {
        onConfirmar({
            frequencia: frequenciaSelecionada,
            diaPreferencial: diaPreferencial || null
        });
    };
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 relative animate-fadeIn">
                
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X size={20} className="text-gray-500" />
                </button>
               
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Assinatura</h2>
                <p className="text-gray-600 text-sm mb-6">
                    Escolha a frequência de entrega que melhor se adapta à sua rotina
                </p>
                
                <div className="space-y-3 mb-6">
                    <h3 className="font-semibold text-gray-700 mb-3">Opções de frequência</h3>
                    {opcoes.map((opcao) => (
                        <label
                            key={opcao.value}
                            className={`
                flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all
                ${frequenciaSelecionada === opcao.value
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-gray-200 hover:border-green-300'
                                }
              `}
                        >
                            <input
                                type="radio"
                                name="frequencia"
                                value={opcao.value}
                                checked={frequenciaSelecionada === opcao.value}
                                onChange={(e) => setFrequenciaSelecionada(e.target.value)}
                                className="w-5 h-5 text-green-600 focus:ring-green-500"
                            />
                            <div className="flex-1">
                                <p className="font-semibold text-gray-800">{opcao.label}</p>
                                <p className="text-xs text-gray-500">{opcao.descricao}</p>
                            </div>
                        </label>
                    ))}
                </div>
                
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Dia preferencial <span className="text-gray-400 font-normal">(opcional)</span>
                    </label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="date"
                            value={diaPreferencial}
                            onChange={(e) => setDiaPreferencial(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        Selecione o dia que você prefere receber suas entregas
                    </p>
                </div>
               
                <button
                    onClick={handleConfirmar}
                    className="w-full py-3 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition-all shadow-lg active:scale-95"
                >
                    Continuar
                </button>
            </div>
        </div>
    );
}