import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { meusPedidos } from "../api/pedidosAPI";
import { getUsuarioId } from "../api/auth";

export default function MeusPedidosPage() {
    const navigate = useNavigate();
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const carregarPedidos = async () => {
            const usuarioId = getUsuarioId();
            if (!usuarioId) {
                navigate('/login');
                return;
            }
            const dados = await meusPedidos(usuarioId);
            setPedidos(dados || []);
            setLoading(false);
        };

        carregarPedidos();
    }, [navigate]);

    const getStatusColor = (status) => {
        const colors = {
            'ativa': 'bg-green-100 text-green-700 border-green-200',
            'pausada': 'bg-yellow-100 text-yellow-700 border-yellow-200',
            'cancelada': 'bg-red-100 text-red-700 border-red-200',
            'entregue': 'bg-blue-100 text-blue-700 border-blue-200',
            'pendente': 'bg-orange-100 text-orange-700 border-orange-200',
        };
        return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-700 border-gray-200';
    };

    const getStatusLabel = (status) => {
        const labels = {
            'ativa': 'Ativa',
            'pausada': 'Pausada',
            'cancelada': 'Cancelada',
            'entregue': 'Entregue',
            'pendente': 'Pendente',
        };
        return labels[status?.toLowerCase()] || status || 'Desconhecido';
    };

    const formatDate = (dateString) => {
        if (!dateString) return '—';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatCurrency = (value) => {
        if (!value && value !== 0) return 'R$ 0,00';
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <Header />

            {/* Hero Section */}
            <div className="relative h-64 md:h-80 w-full mb-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-green-500 to-emerald-600" />
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 h-full flex flex-col items-center justify-center pt-16">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 shadow-xl">
                        <span className="text-4xl">📦</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white drop-shadow-lg">Meus Pedidos</h1>
                    <p className="text-white/80 text-sm mt-2">
                        {loading ? "Carregando..." : `${pedidos.length} pedido(s) encontrado(s)`}
                    </p>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gray-50 rounded-t-3xl"></div>
            </div>

            {/* Main Content */}
            <main className="container mx-auto px-4 md:px-8 max-w-4xl -mt-4">
                {loading ? (
                    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                        <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-500">Carregando seus pedidos...</p>
                    </div>
                ) : pedidos.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-5xl">🛒</span>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Nenhum pedido encontrado</h2>
                        <p className="text-gray-500 mb-6">Você ainda não fez nenhum pedido.</p>
                        <button
                            onClick={() => navigate('/')}
                            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all shadow-lg hover:shadow-xl"
                        >
                            Explorar Produtos
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {pedidos.map((pedido, index) => (
                            <div
                                key={pedido.id || index}
                                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                            >
                                {/* Header do Card */}
                                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-5 py-4 border-b border-gray-200">
                                    <div className="flex flex-wrap justify-between items-center gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                                <span className="text-lg">📋</span>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Pedido</p>
                                                <p className="font-bold text-gray-800">#{pedido.id}</p>
                                            </div>
                                        </div>
                                        <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${getStatusColor(pedido.status)}`}>
                                            {getStatusLabel(pedido.status)}
                                        </span>
                                    </div>
                                </div>

                                {/* Body do Card */}
                                <div className="p-5">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Data do Pedido</p>
                                            <p className="font-semibold text-gray-800">{formatDate(pedido.dataPedido || pedido.createdAt)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Próxima Entrega</p>
                                            <p className="font-semibold text-gray-800">{formatDate(pedido.dataProximaEntrega)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Próxima Cobrança</p>
                                            <p className="font-semibold text-gray-800">{formatDate(pedido.dataProximaCobranca)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Valor Total</p>
                                            <p className="font-bold text-green-600 text-lg">{formatCurrency(pedido.valorTotal)}</p>
                                        </div>
                                    </div>

                                    {/* Itens do Pedido */}
                                    {pedido.itens && pedido.itens.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">Itens do Pedido</p>
                                            <div className="flex flex-wrap gap-2">
                                                {pedido.itens.slice(0, 5).map((item, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm text-gray-700"
                                                    >
                                                        {item.quantidade}x {item.nome || item.produto?.nome || `Item ${idx + 1}`}
                                                    </span>
                                                ))}
                                                {pedido.itens.length > 5 && (
                                                    <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                                                        +{pedido.itens.length - 5} itens
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Botão Voltar */}
                <div className="mt-8 text-center">
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-all shadow-md hover:shadow-lg"
                    >
                        ← Voltar ao Início
                    </button>
                </div>
            </main>
        </div>
    );
}
