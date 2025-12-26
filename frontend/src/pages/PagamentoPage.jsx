import { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import Header from '../components/Header';
import CVVModal from '../components/cvvmodal';
import { meusCartoes, deletarCartao } from '../api/cartaoAPI';
import { verMeuCarrinho, limparCarrinho } from '../api/carrinhoAPI';
import { criarPedido } from '../api/pedidosAPI';
import { initMercadoPago, tokenizarCartao, detectarBandeira, formatarNumeroCartao, formatarValidade } from '../services/mercadoPagoService';

const API_URL = 'https://coding2youmarket-production.up.railway.app/api';
const MP_PUBLIC_KEY = import.meta.env.VITE_MP_PUBLIC_KEY;

export default function PagamentoPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [cartoes, setCartoes] = useState([]);
    const [cartaoAtivo, setCartaoAtivo] = useState(0);
    const [adicionandoCartao, setAdicionandoCartao] = useState(false);
    const [salvandoCartao, setSalvandoCartao] = useState(false);
    const [processandoPagamento, setProcessandoPagamento] = useState(false);
    const [loading, setLoading] = useState(true);
    const [resumo, setResumo] = useState(null);
    const [mostrarCVVModal, setMostrarCVVModal] = useState(false);
    const [novoCartao, setNovoCartao] = useState({
        numero: '',
        nome: '',
        validade: '',
        cvv: '',
        cpf: ''
    });
    const dadosCompra = location.state || {};
    useEffect(() => {
        initMercadoPago(MP_PUBLIC_KEY);
        carregarCartoes();
        calcularResumo();
    }, []);
    const carregarCartoes = async () => {
        try {
            const { success, cartoes: cartoesBackend } = await meusCartoes();
            if (success && cartoesBackend.length > 0) {
                setCartoes(cartoesBackend);
            }
        } catch (error) {
            console.error('Erro ao carregar cartões:', error);
            toast.error('Erro ao carregar cartões');
        } finally {
            setLoading(false);
        }
    };

    const calcularResumo = async () => {
        try {
            // Se for compra Club, usar valor fixo
            if (dadosCompra.tipoCompra === 'club') {
                const valorClub = dadosCompra.valorClub || 39.90;
                setResumo({
                    subtotal: valorClub,
                    descontoClub: 0,
                    frete: 0, // Club não tem frete
                    total: valorClub
                });
                return;
            }

            // Compra normal - calcular carrinho
            const carrinho = await verMeuCarrinho();
            if (!carrinho || carrinho.length === 0) {
                setResumo({
                    subtotal: 0,
                    descontoClub: 0,
                    frete: 0,
                    total: 0
                });
                return;
            }
            const subtotal = carrinho.reduce((acc, item) => {
                const preco = item.produto?.preco || 0;
                const quantidade = item.quantidade || 0;
                return acc + (preco * quantidade);
            }, 0);
            const descontoClub = 0;
            const frete = subtotal > 0 ? 10.23 : 0;
            const total = subtotal - descontoClub + frete;
            setResumo({ subtotal, descontoClub, frete, total });
        } catch (error) {
            console.error('Erro ao calcular resumo:', error);
            setResumo({ subtotal: 0, descontoClub: 0, frete: 0, total: 0 });
        }
    };

    const handleProximoCartao = () => {
        setCartaoAtivo((prev) => (prev + 1) % cartoes.length);
    };

    const handleCartaoAnterior = () => {
        setCartaoAtivo((prev) => (prev - 1 + cartoes.length) % cartoes.length);
    };

    const handleAdicionarCartao = async () => {
        if (!novoCartao.numero || !novoCartao.nome || !novoCartao.validade || !novoCartao.cvv) {
            toast.error('Preencha todos os campos do cartão');
            return;
        }
        setSalvandoCartao(true);
        const loadingToast = toast.loading('Salvando cartão...');
        try {
            const tokenResult = await tokenizarCartao(novoCartao);
            if (!tokenResult.success) {
                toast.error(tokenResult.message, { id: loadingToast });
                setSalvandoCartao(false);
                return;
            }

            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/pagamentos/salvar-cartao`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: tokenResult.token,
                    bandeira: tokenResult.bandeira, // ✅ USA A BANDEIRA DO MP!
                    ultimos4digitos: tokenResult.ultimos4Digitos, // ✅ USA OS 4 DÍGITOS DO MP!
                    nomeImpresso: novoCartao.nome,
                    principal: cartoes.length === 0
                })
            });
            const data = await response.json();
            if (data.success) {
                toast.success('Cartão adicionado com sucesso!', { id: loadingToast });
                await carregarCartoes();
                setAdicionandoCartao(false);
                setNovoCartao({ numero: '', nome: '', validade: '', cvv: '', cpf: '' });
            } else {
                toast.error(data.message || 'Erro ao adicionar cartão', { id: loadingToast });
            }
        } catch (error) {
            console.error('Erro ao adicionar cartão:', error);
            toast.error('Erro ao adicionar cartão. Tente novamente.', { id: loadingToast });
        } finally {
            setSalvandoCartao(false);
        }
    };


    const handleDeletarCartao = async (cartaoId) => {
        // Toast com confirmação bonita ao invés de confirm()
        toast((t) => (
            <div className="flex flex-col gap-3">
                <p className="font-medium">Tem certeza que deseja excluir este cartão?</p>
                <div className="flex gap-2">
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);
                            const loadingToast = toast.loading('Removendo cartão...');
                            try {
                                const response = await deletarCartao(cartaoId);

                                if (response.success) {
                                    toast.success('Cartão removido com sucesso!', { id: loadingToast });

                                    // Atualiza lista IMEDIATAMENTE removendo o cartão
                                    const novosCartoes = cartoes.filter(c => c.id !== cartaoId);
                                    setCartoes(novosCartoes);

                                    // Ajusta índice ativo
                                    if (novosCartoes.length === 0) {
                                        // Sem cartões, reseta
                                        setCartaoAtivo(0);
                                    } else if (cartaoAtivo >= novosCartoes.length) {
                                        // Índice fora do range, vai pro último
                                        setCartaoAtivo(novosCartoes.length - 1);
                                    }
                                } else {
                                    toast.error(response.message || 'Erro ao remover cartão', { id: loadingToast });
                                }
                            } catch (error) {
                                console.error('Erro ao deletar cartão:', error);
                                toast.error('Erro ao remover cartão', { id: loadingToast });
                            }
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
                    >
                        Excluir
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        ), { duration: 10000 });
    };


    const handleContinuar = () => {
        if (cartoes.length === 0) {
            toast.error('Adicione um cartão para continuar');
            return;
        }
        if (!resumo || resumo.total === 0) {
            toast.error('Carrinho vazio. Adicione produtos para continuar.');
            return;
        }
        // Abrir modal CVV
        setMostrarCVVModal(true);
    };
    const handleConfirmarCVV = async (cvv) => {
        setMostrarCVVModal(false);
        setProcessandoPagamento(true);
        const loadingToast = toast.loading('Processando pagamento...');
        try {
            const token = localStorage.getItem('token');
            const userStr = localStorage.getItem('user');

            // Validação robusta do user
            let user = {};
            if (userStr && userStr !== 'undefined' && userStr !== 'null') {
                try {
                    user = JSON.parse(userStr);
                } catch (e) {
                    console.error('Erro ao fazer parse do user:', e);
                    user = {};
                }
            }

            const cartaoSelecionado = cartoes[cartaoAtivo];
            const dadosPagamento = {
                token: cartaoSelecionado.tokencartao,
                transactionAmount: parseFloat(resumo.total.toFixed(2)), // Garantir número com ponto
                installments: 1,
                description: `Pedido Subscrivery - ${dadosCompra.tipo || 'assinatura'}`,
                paymentMethodId: cartaoSelecionado.bandeira?.toLowerCase() || 'master',
                email: user.email || user.Email,
                securityCode: cvv
            };

            const response = await fetch(`${API_URL}/pagamentos/processar`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosPagamento)
            });

            const data = await response.json();
            if (data.success && data.pagamento.status === 'approved') {
                toast.success('Pagamento aprovado!', { id: loadingToast });

                // Criar pedido após pagamento aprovado
                try {
                    // Se for Club Market, criar pedido especial
                    if (dadosCompra.tipoCompra === 'club') {
                        const pedidoClubData = {
                            enderecoId: 1, // Placeholder
                            frequencia: 'club', // Tipo especial
                            diaEntrega: null,
                            valorTotal: dadosCompra.valorClub,
                            valorFinal: dadosCompra.valorClub,
                            dataProximaEntrega: null,
                            dataProximaCobranca: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 dias
                        };

                        const pedidoClubResponse = await criarPedido(pedidoClubData);

                        if (pedidoClubResponse.success) {
                            toast.success('🎉 Parabéns! Você agora está participando do Club Market!', {
                                id: loadingToast,
                                duration: 5000
                            });
                            navigate('/confirmacao', {
                                state: {
                                    pagamento: data.pagamento,
                                    pedido: pedidoClubResponse.pedido,
                                    isClub: true,
                                    planoClub: dadosCompra.planoClub
                                }
                            });
                        } else {
                            toast.error('Erro ao ativar Club Market');
                        }
                        return;
                    }

                    // Compra normal - validar carrinho
                    const carrinho = await verMeuCarrinho();

                    if (!carrinho || carrinho.length === 0) {
                        toast.error('Carrinho vazio!');
                        return;
                    }

                    // Pegar endereço e frequência do localStorage/state
                    const enderecoId = dadosCompra.enderecoId || 1; // TODO: Pegar do fluxo real
                    const frequencia = dadosCompra.frequencia || 'unica'; // 'unica' = compra única
                    const diaEntrega = dadosCompra.diaEntrega || new Date().getDate();

                    // Calcular datas baseado na frequência
                    const diasParaProximaEntrega = frequencia === 'semanal' ? 7 : 30;
                    const dataProximaEntrega = new Date(Date.now() + diasParaProximaEntrega * 24 * 60 * 60 * 1000);
                    const dataProximaCobranca = new Date(dataProximaEntrega.getTime() - 24 * 60 * 60 * 1000); // 1 dia antes

                    // Criar pedido
                    const pedidoData = {
                        enderecoId,
                        frequencia,
                        diaEntrega,
                        valorTotal: resumo.subtotal,
                        valorFinal: resumo.total,
                        dataProximaEntrega: dataProximaEntrega.toISOString(),
                        dataProximaCobranca: dataProximaCobranca.toISOString()
                    };

                    const pedidoResponse = await criarPedido(pedidoData);

                    if (pedidoResponse.success) {
                        // Limpar carrinho após criar pedido
                        await limparCarrinho();

                        // Notificação personalizada para Club
                        if (dadosCompra.tipoCompra === 'club') {
                            toast.success('🎉 Parabéns! Você agora está participando do Club Market!', { id: loadingToast, duration: 5000 });
                        } else {
                            toast.success('Pedido criado com sucesso!');
                        }

                        navigate('/confirmacao', {
                            state: {
                                pagamento: data.pagamento,
                                pedido: pedidoResponse.pedido
                            }
                        });
                    } else {
                        toast.error('Erro ao criar pedido. Entre em contato com suporte.');
                        navigate('/confirmacao', { state: { pagamento: data.pagamento } });
                    }
                } catch (pedidoError) {
                    console.error('Erro ao criar pedido:', pedidoError);
                    toast.error('Pagamento aprovado, mas erro ao criar pedido. Entre em contato com suporte.');
                    navigate('/confirmacao', { state: { pagamento: data.pagamento } });
                }
            } else {
                toast.error(`Pagamento ${data.pagamento?.status || 'recusado'}. ${data.pagamento?.statusDetail || ''}`, {
                    id: loadingToast,
                    duration: 5000
                });
            }
        } catch (error) {
            console.error('Erro ao processar pagamento:', error);
            toast.error('Erro ao processar pagamento.', { id: loadingToast });
        } finally {
            setProcessandoPagamento(false);
        }
    };
    const formatarCartaoDisplay = (cartao) => {
        const ultimos4 = cartao.ultimos4digitos || '****';
        return `•••• •••• •••• ${ultimos4}`;
    };
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando...</p>
                </div>
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <Header />
            <div className="relative h-48 md:h-56 w-full mb-8 overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200"
                    alt="Pagamento"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                <div className="relative z-10 h-full container mx-auto px-4 md:px-8 flex items-center max-w-7xl pt-20">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/20 rounded-full mr-4">
                        <ArrowLeft className="text-white" size={24} />
                    </button>
                    <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">Pagamento</h1>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gray-50 rounded-t-3xl"></div>
            </div>
            <main className="container mx-auto px-4 md:px-8 max-w-5xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        {cartoes.length > 0 && (
                            <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
                                <div className="relative">
                                    <div className="w-full aspect-[1.586] bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden">
                                        <div className="w-12 h-10 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-lg mb-6"></div>
                                        <p className="text-xl md:text-2xl font-mono tracking-wider mb-6">
                                            {formatarCartaoDisplay(cartoes[cartaoAtivo])}
                                        </p>
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-xs text-gray-400 mb-1">Nome</p>
                                                <p className="font-semibold">{cartoes[cartaoAtivo].nomeimpresso}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-400 mb-1">Bandeira</p>
                                                <p className="font-semibold">{cartoes[cartaoAtivo].bandeira}</p>
                                            </div>
                                        </div>
                                        <div className="absolute top-6 right-6">
                                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                                <CreditCard size={24} />
                                            </div>
                                        </div>
                                        <div className="absolute top-6 right-20 text-2xl">📡</div>
                                    </div>

                                    {/* Botão Deletar Cartão - Sempre visível */}
                                    <button
                                        onClick={() => handleDeletarCartao(cartoes[cartaoAtivo].id)}
                                        className="mt-3 w-full py-2 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-all flex items-center justify-center gap-2 border border-red-200"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Remover este cartão
                                    </button>

                                    {cartoes.length > 1 && (
                                        <div className="flex justify-center gap-2 mt-4">
                                            <button onClick={handleCartaoAnterior} className="p-2 hover:bg-gray-100 rounded-full">
                                                <ChevronLeft size={20} />
                                            </button>
                                            <div className="flex gap-2 items-center">
                                                {cartoes.map((_, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={`h-2 rounded-full transition-all ${idx === cartaoAtivo ? 'w-8 bg-gray-900' : 'w-2 bg-gray-300'}`}
                                                    />
                                                ))}
                                            </div>
                                            <button onClick={handleProximoCartao} className="p-2 hover:bg-gray-100 rounded-full">
                                                <ChevronRight size={20} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        <button
                            onClick={() => setAdicionandoCartao(!adicionandoCartao)}
                            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 font-medium hover:border-green-500 hover:text-green-600 transition-all flex items-center justify-center gap-2 mb-6"
                        >
                            <Plus size={20} />
                            Adicionar cartão
                        </button>
                        {adicionandoCartao && (
                            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
                                <h3 className="font-bold text-gray-800 mb-4">Adicionar cartão</h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Número do cartão</label>
                                    <input
                                        type="text"
                                        placeholder="1234 1234 1234 1234"
                                        maxLength="19"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                        value={novoCartao.numero}
                                        onChange={(e) => setNovoCartao({ ...novoCartao, numero: formatarNumeroCartao(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome (como no cartão)</label>
                                    <input
                                        type="text"
                                        placeholder="NOME COMPLETO"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none uppercase"
                                        value={novoCartao.nome}
                                        onChange={(e) => setNovoCartao({ ...novoCartao, nome: e.target.value.toUpperCase() })}
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Validade</label>
                                        <input
                                            type="text"
                                            placeholder="MM/AA"
                                            maxLength="5"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                            value={novoCartao.validade}
                                            onChange={(e) => setNovoCartao({ ...novoCartao, validade: formatarValidade(e.target.value) })}
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                                        <input
                                            type="text"
                                            placeholder="123"
                                            maxLength="4"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                            value={novoCartao.cvv}
                                            onChange={(e) => setNovoCartao({ ...novoCartao, cvv: e.target.value.replace(/\D/g, '') })}
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">CPF</label>
                                        <input
                                            type="text"
                                            placeholder="CPF"
                                            maxLength="14"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-xs"
                                            value={novoCartao.cpf}
                                            onChange={(e) => setNovoCartao({ ...novoCartao, cpf: e.target.value.replace(/\D/g, '') })}
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={handleAdicionarCartao}
                                    disabled={salvandoCartao}
                                    className={`w-full py-3 rounded-full font-semibold text-white transition-all shadow-lg ${salvandoCartao ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 active:scale-95'
                                        }`}
                                >
                                    {salvandoCartao ? 'Salvando...' : 'Salvar Cartão'}
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="hidden md:block">
                        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                            <h3 className="font-bold text-gray-800 mb-4">Resumo do pedido</h3>
                            {resumo && (
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>R$ {resumo.subtotal.toFixed(2).replace('.', ',')}</span>
                                    </div>
                                    <div className="flex justify-between text-green-600">
                                        <span>Desconto Clube+</span>
                                        <span>- R$ {resumo.descontoClub.toFixed(2).replace('.', ',')}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Frete</span>
                                        <span>R$ {resumo.frete.toFixed(2).replace('.', ',')}</span>
                                    </div>
                                    <div className="h-px bg-gray-200"></div>
                                    <div className="flex justify-between text-lg font-bold text-gray-800">
                                        <span>Total</span>
                                        <span className="text-green-700">R$ {resumo.total.toFixed(2).replace('.', ',')}</span>
                                    </div>
                                </div>
                            )}
                            <button
                                onClick={handleContinuar}
                                disabled={processandoPagamento}
                                className={`w-full py-3 rounded-full font-semibold text-white transition-all shadow-lg ${processandoPagamento ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-gray-800 active:scale-95'
                                    }`}
                            >
                                {processandoPagamento ? 'Processando...' : 'Continuar'}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg z-40">
                    <button
                        onClick={handleContinuar}
                        disabled={processandoPagamento}
                        className={`w-full py-3 rounded-full font-semibold text-white transition-all shadow-lg ${processandoPagamento ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-gray-800 active:scale-95'
                            }`}
                    >
                        {processandoPagamento ? 'Processando...' : `Continuar - R$ ${resumo?.total.toFixed(2).replace('.', ',') || '0,00'}`}
                    </button>
                </div>
            </main>
            <CVVModal
                isOpen={mostrarCVVModal}
                onClose={() => setMostrarCVVModal(false)}
                onConfirm={handleConfirmarCVV}
            />
        </div>
    );
}