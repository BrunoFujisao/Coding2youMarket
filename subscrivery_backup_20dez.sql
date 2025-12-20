--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

-- Started on 2025-12-20 20:27:45

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 224 (class 1259 OID 41945)
-- Name: carrinho_itens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.carrinho_itens (
    id integer NOT NULL,
    usuarioid integer,
    produtoid integer,
    quantidade integer NOT NULL,
    observacao text
);


ALTER TABLE public.carrinho_itens OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 41944)
-- Name: carrinho_itens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.carrinho_itens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.carrinho_itens_id_seq OWNER TO postgres;

--
-- TOC entry 4928 (class 0 OID 0)
-- Dependencies: 223
-- Name: carrinho_itens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.carrinho_itens_id_seq OWNED BY public.carrinho_itens.id;


--
-- TOC entry 228 (class 1259 OID 42016)
-- Name: cartoes_credito; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cartoes_credito (
    id integer NOT NULL,
    usuarioid integer,
    tokencartao character varying(255) NOT NULL,
    bandeira character varying(50),
    ultimos4digitos character varying(4),
    nomeimpresso character varying(255),
    principal boolean DEFAULT false,
    isdebito boolean DEFAULT false
);


ALTER TABLE public.cartoes_credito OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 42015)
-- Name: cartoes_credito_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cartoes_credito_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cartoes_credito_id_seq OWNER TO postgres;

--
-- TOC entry 4929 (class 0 OID 0)
-- Dependencies: 227
-- Name: cartoes_credito_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cartoes_credito_id_seq OWNED BY public.cartoes_credito.id;


--
-- TOC entry 234 (class 1259 OID 42076)
-- Name: club_market; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.club_market (
    id integer NOT NULL,
    usuarioid integer,
    datainicio timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(20),
    valormensal numeric(10,2) DEFAULT 19.90,
    CONSTRAINT club_market_status_check CHECK (((status)::text = ANY ((ARRAY['ativa'::character varying, 'cancelada'::character varying, 'suspensa'::character varying])::text[])))
);


ALTER TABLE public.club_market OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 42075)
-- Name: club_market_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.club_market_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.club_market_id_seq OWNER TO postgres;

--
-- TOC entry 4930 (class 0 OID 0)
-- Dependencies: 233
-- Name: club_market_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.club_market_id_seq OWNED BY public.club_market.id;


--
-- TOC entry 222 (class 1259 OID 41916)
-- Name: enderecos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.enderecos (
    id integer NOT NULL,
    usuarioid integer,
    cep character varying(8),
    rua character varying(255),
    numero character varying(10),
    complemento character varying(100),
    bairro character varying(100),
    cidade character varying(100),
    estado character varying(2),
    apelido character varying(50),
    principal boolean DEFAULT false
);


ALTER TABLE public.enderecos OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 41915)
-- Name: enderecos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.enderecos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.enderecos_id_seq OWNER TO postgres;

--
-- TOC entry 4931 (class 0 OID 0)
-- Dependencies: 221
-- Name: enderecos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.enderecos_id_seq OWNED BY public.enderecos.id;


--
-- TOC entry 232 (class 1259 OID 42055)
-- Name: entregas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.entregas (
    id integer NOT NULL,
    pedidoid integer,
    enderecoid integer,
    dataentrega timestamp without time zone,
    status character varying(30),
    problemaestoque boolean DEFAULT false,
    observacoes text,
    dataconfirmacao timestamp without time zone,
    CONSTRAINT entregas_status_check CHECK (((status)::text = ANY ((ARRAY['agendada'::character varying, 'preparando'::character varying, 'em_rota'::character varying, 'entregue'::character varying, 'falhou'::character varying])::text[])))
);


ALTER TABLE public.entregas OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 42054)
-- Name: entregas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.entregas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.entregas_id_seq OWNER TO postgres;

--
-- TOC entry 4932 (class 0 OID 0)
-- Dependencies: 231
-- Name: entregas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.entregas_id_seq OWNED BY public.entregas.id;


--
-- TOC entry 230 (class 1259 OID 42032)
-- Name: pagamentos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pagamentos (
    id integer NOT NULL,
    pedidoid integer,
    usuarioid integer,
    cartaoid integer,
    valor numeric(10,2) NOT NULL,
    status character varying(30),
    transacaoid character varying(255),
    datapagamento timestamp without time zone,
    datavencimento timestamp without time zone,
    CONSTRAINT pagamentos_status_check CHECK (((status)::text = ANY ((ARRAY['pendente'::character varying, 'aprovado'::character varying, 'recusado'::character varying, 'estornado'::character varying])::text[])))
);


ALTER TABLE public.pagamentos OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 42031)
-- Name: pagamentos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pagamentos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pagamentos_id_seq OWNER TO postgres;

--
-- TOC entry 4933 (class 0 OID 0)
-- Dependencies: 229
-- Name: pagamentos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pagamentos_id_seq OWNED BY public.pagamentos.id;


--
-- TOC entry 236 (class 1259 OID 42093)
-- Name: pedido_itens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pedido_itens (
    id integer NOT NULL,
    pedidoid integer,
    produtoid integer,
    quantidade integer NOT NULL,
    precounitario numeric(10,2) NOT NULL,
    produtosubstituto integer
);


ALTER TABLE public.pedido_itens OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 42092)
-- Name: pedido_itens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pedido_itens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pedido_itens_id_seq OWNER TO postgres;

--
-- TOC entry 4934 (class 0 OID 0)
-- Dependencies: 235
-- Name: pedido_itens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pedido_itens_id_seq OWNED BY public.pedido_itens.id;


--
-- TOC entry 226 (class 1259 OID 41964)
-- Name: pedidos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pedidos (
    id integer NOT NULL,
    usuarioid integer,
    enderecoid integer,
    frequencia character varying(20),
    diaentrega integer,
    valortotal numeric(10,2),
    valorfrete numeric(10,2) DEFAULT 15.00,
    descontoclub numeric(10,2) DEFAULT 0,
    valorfinal numeric(10,2),
    status character varying(30) DEFAULT 'ativa'::character varying,
    datainicio timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    dataproximaentrega timestamp without time zone,
    dataproximacobranca timestamp without time zone,
    datacancelamento timestamp without time zone,
    CONSTRAINT pedidos_frequencia_check CHECK (((frequencia)::text = ANY ((ARRAY['semanal'::character varying, 'quinzenal'::character varying, 'mensal'::character varying])::text[]))),
    CONSTRAINT pedidos_status_check CHECK (((status)::text = ANY ((ARRAY['ativa'::character varying, 'pausada'::character varying, 'cancelada'::character varying, 'pendente_estoque'::character varying])::text[])))
);


ALTER TABLE public.pedidos OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 41963)
-- Name: pedidos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pedidos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pedidos_id_seq OWNER TO postgres;

--
-- TOC entry 4935 (class 0 OID 0)
-- Dependencies: 225
-- Name: pedidos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pedidos_id_seq OWNED BY public.pedidos.id;


--
-- TOC entry 220 (class 1259 OID 41904)
-- Name: produtos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.produtos (
    id_produto integer NOT NULL,
    nome character varying(255) NOT NULL,
    descricao text,
    categoria character varying(100),
    preco numeric(10,2) NOT NULL,
    unidade character varying(50),
    imagem character varying(500),
    estoque integer DEFAULT 0,
    estoqueminimo integer DEFAULT 10,
    ativo boolean DEFAULT true
);


ALTER TABLE public.produtos OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 41903)
-- Name: produtos_id_produto_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.produtos_id_produto_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.produtos_id_produto_seq OWNER TO postgres;

--
-- TOC entry 4936 (class 0 OID 0)
-- Dependencies: 219
-- Name: produtos_id_produto_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.produtos_id_produto_seq OWNED BY public.produtos.id_produto;


--
-- TOC entry 218 (class 1259 OID 41888)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nome character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    cpf character varying(11) NOT NULL,
    telefone character varying(15),
    senha character varying(255) NOT NULL,
    clubmember boolean DEFAULT false,
    datacadastroclub timestamp without time zone,
    datacadastro timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    ativo boolean DEFAULT true
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 41887)
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO postgres;

--
-- TOC entry 4937 (class 0 OID 0)
-- Dependencies: 217
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- TOC entry 4696 (class 2604 OID 41948)
-- Name: carrinho_itens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carrinho_itens ALTER COLUMN id SET DEFAULT nextval('public.carrinho_itens_id_seq'::regclass);


--
-- TOC entry 4702 (class 2604 OID 42019)
-- Name: cartoes_credito id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cartoes_credito ALTER COLUMN id SET DEFAULT nextval('public.cartoes_credito_id_seq'::regclass);


--
-- TOC entry 4708 (class 2604 OID 42079)
-- Name: club_market id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_market ALTER COLUMN id SET DEFAULT nextval('public.club_market_id_seq'::regclass);


--
-- TOC entry 4694 (class 2604 OID 41919)
-- Name: enderecos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enderecos ALTER COLUMN id SET DEFAULT nextval('public.enderecos_id_seq'::regclass);


--
-- TOC entry 4706 (class 2604 OID 42058)
-- Name: entregas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.entregas ALTER COLUMN id SET DEFAULT nextval('public.entregas_id_seq'::regclass);


--
-- TOC entry 4705 (class 2604 OID 42035)
-- Name: pagamentos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagamentos ALTER COLUMN id SET DEFAULT nextval('public.pagamentos_id_seq'::regclass);


--
-- TOC entry 4711 (class 2604 OID 42096)
-- Name: pedido_itens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedido_itens ALTER COLUMN id SET DEFAULT nextval('public.pedido_itens_id_seq'::regclass);


--
-- TOC entry 4697 (class 2604 OID 41967)
-- Name: pedidos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedidos ALTER COLUMN id SET DEFAULT nextval('public.pedidos_id_seq'::regclass);


--
-- TOC entry 4690 (class 2604 OID 41907)
-- Name: produtos id_produto; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produtos ALTER COLUMN id_produto SET DEFAULT nextval('public.produtos_id_produto_seq'::regclass);


--
-- TOC entry 4686 (class 2604 OID 41891)
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- TOC entry 4910 (class 0 OID 41945)
-- Dependencies: 224
-- Data for Name: carrinho_itens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.carrinho_itens (id, usuarioid, produtoid, quantidade, observacao) FROM stdin;
1	1	1	2	Sem sal
2	1	2	3	Produto fresco
\.


--
-- TOC entry 4914 (class 0 OID 42016)
-- Dependencies: 228
-- Data for Name: cartoes_credito; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cartoes_credito (id, usuarioid, tokencartao, bandeira, ultimos4digitos, nomeimpresso, principal, isdebito) FROM stdin;
1	1	tok_test_123456	Visa	1234	JOAO TESTE	t	f
2	1	tok_teste_simulado_12345	Visa	4242	JOAO SILVA	t	f
\.


--
-- TOC entry 4920 (class 0 OID 42076)
-- Dependencies: 234
-- Data for Name: club_market; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.club_market (id, usuarioid, datainicio, status, valormensal) FROM stdin;
1	1	2025-12-18 21:59:54.267731	ativa	19.90
\.


--
-- TOC entry 4908 (class 0 OID 41916)
-- Dependencies: 222
-- Data for Name: enderecos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.enderecos (id, usuarioid, cep, rua, numero, complemento, bairro, cidade, estado, apelido, principal) FROM stdin;
1	1	01310100	Av Paulista	2000	Apto 202	Bela Vista	São Paulo	SP	\N	\N
\.


--
-- TOC entry 4918 (class 0 OID 42055)
-- Dependencies: 232
-- Data for Name: entregas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.entregas (id, pedidoid, enderecoid, dataentrega, status, problemaestoque, observacoes, dataconfirmacao) FROM stdin;
3	2	1	2025-01-15 00:00:00	agendada	f	\N	\N
\.


--
-- TOC entry 4916 (class 0 OID 42032)
-- Dependencies: 230
-- Data for Name: pagamentos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pagamentos (id, pedidoid, usuarioid, cartaoid, valor, status, transacaoid, datapagamento, datavencimento) FROM stdin;
\.


--
-- TOC entry 4922 (class 0 OID 42093)
-- Dependencies: 236
-- Data for Name: pedido_itens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pedido_itens (id, pedidoid, produtoid, quantidade, precounitario, produtosubstituto) FROM stdin;
\.


--
-- TOC entry 4912 (class 0 OID 41964)
-- Dependencies: 226
-- Data for Name: pedidos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pedidos (id, usuarioid, enderecoid, frequencia, diaentrega, valortotal, valorfrete, descontoclub, valorfinal, status, datainicio, dataproximaentrega, dataproximacobranca, datacancelamento) FROM stdin;
2	1	1	semanal	15	180.00	15.00	0.00	165.00	ativa	2025-12-18 21:56:36.58572	2025-01-15 00:00:00	2025-01-10 00:00:00	\N
\.


--
-- TOC entry 4906 (class 0 OID 41904)
-- Dependencies: 220
-- Data for Name: produtos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.produtos (id_produto, nome, descricao, categoria, preco, unidade, imagem, estoque, estoqueminimo, ativo) FROM stdin;
1	Arroz 5kg	Arroz branco tipo 1	Grãos	25.90	pacote	https://via.placeholder.com/150	0	10	t
2	Feijão Preto 1kg	Feijão tipo 1	Grãos	8.50	pacote	https://via.placeholder.com/150	0	10	t
3	Arroz Branco 5kg	Arroz branco tipo 1, grãos longos e soltos	Mercearia	25.90	\N	https://via.placeholder.com/300x300?text=Arroz	100	10	t
4	Feijão Preto 1kg	Feijão preto premium, embalagem a vácuo	Mercearia	8.50	\N	https://via.placeholder.com/300x300?text=Feijão	150	10	t
5	Macarrão Espaguete 500g	Massa sêmola com ovos, espaguete nº 8	Mercearia	4.20	\N	https://via.placeholder.com/300x300?text=Macarrão	200	10	t
6	Óleo de Soja 900ml	Óleo de soja refinado 100% puro	Mercearia	6.80	\N	https://via.placeholder.com/300x300?text=Óleo	120	10	t
7	Açúcar Cristal 1kg	Açúcar cristal refinado	Mercearia	5.30	\N	https://via.placeholder.com/300x300?text=Açúcar	180	10	t
8	Café Torrado 500g	Café torrado e moído tradicional	Mercearia	15.90	\N	https://via.placeholder.com/300x300?text=Café	80	10	t
9	Farinha de Trigo 1kg	Farinha de trigo especial sem fermento	Mercearia	5.70	\N	https://via.placeholder.com/300x300?text=Farinha	140	10	t
10	Sal Refinado 1kg	Sal refinado iodado	Mercearia	2.90	\N	https://via.placeholder.com/300x300?text=Sal	200	10	t
11	Molho de Tomate 340g	Molho de tomate tradicional	Mercearia	3.50	\N	https://via.placeholder.com/300x300?text=Molho	160	10	t
12	Biscoito Cream Cracker 200g	Biscoito cream cracker tradicional	Mercearia	3.80	\N	https://via.placeholder.com/300x300?text=Biscoito	100	10	t
13	Refrigerante Cola 2L	Refrigerante sabor cola, garrafa pet 2L	Bebidas	7.50	\N	https://via.placeholder.com/300x300?text=Refrigerante	90	10	t
14	Suco de Laranja 1L	Suco integral de laranja 100% natural	Bebidas	9.90	\N	https://via.placeholder.com/300x300?text=Suco	70	10	t
15	Água Mineral 1.5L	Água mineral natural sem gás	Bebidas	2.50	\N	https://via.placeholder.com/300x300?text=Água	250	10	t
16	Leite Integral 1L	Leite integral UHT longa vida	Bebidas	5.20	\N	https://via.placeholder.com/300x300?text=Leite	120	10	t
17	Chá Mate 1L	Chá mate natural gelado	Bebidas	4.80	\N	https://via.placeholder.com/300x300?text=Chá	80	10	t
18	Energético 250ml	Bebida energética com cafeína	Bebidas	8.90	\N	https://via.placeholder.com/300x300?text=Energético	60	10	t
19	Cerveja Lata 350ml	Cerveja pilsen lata gelada	Bebidas	3.50	\N	https://via.placeholder.com/300x300?text=Cerveja	200	10	t
20	Iogurte Natural 170g	Iogurte natural desnatado	Bebidas	2.80	\N	https://via.placeholder.com/300x300?text=Iogurte	100	10	t
21	Detergente Neutro 500ml	Detergente líquido concentrado neutro	Limpeza	2.30	\N	https://via.placeholder.com/300x300?text=Detergente	180	10	t
22	Sabão em Pó 1kg	Sabão em pó para roupas coloridas e brancas	Limpeza	12.90	\N	https://via.placeholder.com/300x300?text=Sabão	90	10	t
23	Água Sanitária 1L	Água sanitária bactericida e alvejante	Limpeza	4.50	\N	https://via.placeholder.com/300x300?text=Água+Sanitária	150	10	t
24	Esponja Multiuso	Esponja dupla face para limpeza geral	Limpeza	1.90	\N	https://via.placeholder.com/300x300?text=Esponja	200	10	t
25	Desinfetante 500ml	Desinfetante perfumado para pisos	Limpeza	5.80	\N	https://via.placeholder.com/300x300?text=Desinfetante	120	10	t
26	Amaciante 2L	Amaciante concentrado para roupas	Limpeza	11.50	\N	https://via.placeholder.com/300x300?text=Amaciante	70	10	t
27	Shampoo 400ml	Shampoo hidratante para todos os tipos de cabelo	Higiene	14.90	\N	https://via.placeholder.com/300x300?text=Shampoo	80	10	t
28	Condicionador 400ml	Condicionador hidratante para cabelos secos	Higiene	14.90	\N	https://via.placeholder.com/300x300?text=Condicionador	80	10	t
29	Sabonete 90g	Sabonete em barra glicerinado	Higiene	2.50	\N	https://via.placeholder.com/300x300?text=Sabonete	250	10	t
30	Creme Dental 90g	Creme dental com flúor proteção anticáries	Higiene	5.40	\N	https://via.placeholder.com/300x300?text=Creme+Dental	160	10	t
31	Papel Higiênico 4 rolos	Papel higiênico folha dupla neutro	Higiene	8.90	\N	https://via.placeholder.com/300x300?text=Papel	140	10	t
32	Desodorante 150ml	Desodorante aerosol 48h de proteção	Higiene	12.50	\N	https://via.placeholder.com/300x300?text=Desodorante	100	10	t
\.


--
-- TOC entry 4904 (class 0 OID 41888)
-- Dependencies: 218
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id, nome, email, cpf, telefone, senha, clubmember, datacadastroclub, datacadastro, ativo) FROM stdin;
1	João Teste	joao@teste.com	12345678900	11999999999	123456	t	\N	2025-12-18 21:29:46.1809	t
2	Bruno Fujisao	brunofujisao2018@gmail.com	12345678901	11987654321	123456	f	\N	2025-12-20 20:18:20.055754	t
\.


--
-- TOC entry 4938 (class 0 OID 0)
-- Dependencies: 223
-- Name: carrinho_itens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.carrinho_itens_id_seq', 2, true);


--
-- TOC entry 4939 (class 0 OID 0)
-- Dependencies: 227
-- Name: cartoes_credito_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cartoes_credito_id_seq', 2, true);


--
-- TOC entry 4940 (class 0 OID 0)
-- Dependencies: 233
-- Name: club_market_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.club_market_id_seq', 3, true);


--
-- TOC entry 4941 (class 0 OID 0)
-- Dependencies: 221
-- Name: enderecos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.enderecos_id_seq', 1, true);


--
-- TOC entry 4942 (class 0 OID 0)
-- Dependencies: 231
-- Name: entregas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.entregas_id_seq', 3, true);


--
-- TOC entry 4943 (class 0 OID 0)
-- Dependencies: 229
-- Name: pagamentos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pagamentos_id_seq', 1, false);


--
-- TOC entry 4944 (class 0 OID 0)
-- Dependencies: 235
-- Name: pedido_itens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pedido_itens_id_seq', 1, false);


--
-- TOC entry 4945 (class 0 OID 0)
-- Dependencies: 225
-- Name: pedidos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pedidos_id_seq', 2, true);


--
-- TOC entry 4946 (class 0 OID 0)
-- Dependencies: 219
-- Name: produtos_id_produto_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.produtos_id_produto_seq', 32, true);


--
-- TOC entry 4947 (class 0 OID 0)
-- Dependencies: 217
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 2, true);


--
-- TOC entry 4728 (class 2606 OID 41952)
-- Name: carrinho_itens carrinho_itens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carrinho_itens
    ADD CONSTRAINT carrinho_itens_pkey PRIMARY KEY (id);


--
-- TOC entry 4732 (class 2606 OID 42025)
-- Name: cartoes_credito cartoes_credito_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cartoes_credito
    ADD CONSTRAINT cartoes_credito_pkey PRIMARY KEY (id);


--
-- TOC entry 4738 (class 2606 OID 42084)
-- Name: club_market club_market_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_market
    ADD CONSTRAINT club_market_pkey PRIMARY KEY (id);


--
-- TOC entry 4740 (class 2606 OID 42086)
-- Name: club_market club_market_usuarioid_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_market
    ADD CONSTRAINT club_market_usuarioid_key UNIQUE (usuarioid);


--
-- TOC entry 4726 (class 2606 OID 41924)
-- Name: enderecos enderecos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enderecos
    ADD CONSTRAINT enderecos_pkey PRIMARY KEY (id);


--
-- TOC entry 4736 (class 2606 OID 42064)
-- Name: entregas entregas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.entregas
    ADD CONSTRAINT entregas_pkey PRIMARY KEY (id);


--
-- TOC entry 4734 (class 2606 OID 42038)
-- Name: pagamentos pagamentos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagamentos
    ADD CONSTRAINT pagamentos_pkey PRIMARY KEY (id);


--
-- TOC entry 4742 (class 2606 OID 42098)
-- Name: pedido_itens pedido_itens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedido_itens
    ADD CONSTRAINT pedido_itens_pkey PRIMARY KEY (id);


--
-- TOC entry 4730 (class 2606 OID 41975)
-- Name: pedidos pedidos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedidos
    ADD CONSTRAINT pedidos_pkey PRIMARY KEY (id);


--
-- TOC entry 4724 (class 2606 OID 41914)
-- Name: produtos produtos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produtos
    ADD CONSTRAINT produtos_pkey PRIMARY KEY (id_produto);


--
-- TOC entry 4718 (class 2606 OID 41902)
-- Name: usuarios usuarios_cpf_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_cpf_key UNIQUE (cpf);


--
-- TOC entry 4720 (class 2606 OID 41900)
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- TOC entry 4722 (class 2606 OID 41898)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- TOC entry 4744 (class 2606 OID 41958)
-- Name: carrinho_itens carrinho_itens_produtoid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carrinho_itens
    ADD CONSTRAINT carrinho_itens_produtoid_fkey FOREIGN KEY (produtoid) REFERENCES public.produtos(id_produto) ON DELETE CASCADE;


--
-- TOC entry 4745 (class 2606 OID 41953)
-- Name: carrinho_itens carrinho_itens_usuarioid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carrinho_itens
    ADD CONSTRAINT carrinho_itens_usuarioid_fkey FOREIGN KEY (usuarioid) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 4748 (class 2606 OID 42026)
-- Name: cartoes_credito cartoes_credito_usuarioid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cartoes_credito
    ADD CONSTRAINT cartoes_credito_usuarioid_fkey FOREIGN KEY (usuarioid) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 4754 (class 2606 OID 42087)
-- Name: club_market club_market_usuarioid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_market
    ADD CONSTRAINT club_market_usuarioid_fkey FOREIGN KEY (usuarioid) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 4743 (class 2606 OID 41925)
-- Name: enderecos enderecos_usuarioid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enderecos
    ADD CONSTRAINT enderecos_usuarioid_fkey FOREIGN KEY (usuarioid) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 4752 (class 2606 OID 42070)
-- Name: entregas entregas_enderecoid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.entregas
    ADD CONSTRAINT entregas_enderecoid_fkey FOREIGN KEY (enderecoid) REFERENCES public.enderecos(id);


--
-- TOC entry 4753 (class 2606 OID 42065)
-- Name: entregas entregas_pedidoid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.entregas
    ADD CONSTRAINT entregas_pedidoid_fkey FOREIGN KEY (pedidoid) REFERENCES public.pedidos(id);


--
-- TOC entry 4749 (class 2606 OID 42049)
-- Name: pagamentos pagamentos_cartaoid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagamentos
    ADD CONSTRAINT pagamentos_cartaoid_fkey FOREIGN KEY (cartaoid) REFERENCES public.cartoes_credito(id);


--
-- TOC entry 4750 (class 2606 OID 42039)
-- Name: pagamentos pagamentos_pedidoid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagamentos
    ADD CONSTRAINT pagamentos_pedidoid_fkey FOREIGN KEY (pedidoid) REFERENCES public.pedidos(id);


--
-- TOC entry 4751 (class 2606 OID 42044)
-- Name: pagamentos pagamentos_usuarioid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagamentos
    ADD CONSTRAINT pagamentos_usuarioid_fkey FOREIGN KEY (usuarioid) REFERENCES public.usuarios(id);


--
-- TOC entry 4755 (class 2606 OID 42099)
-- Name: pedido_itens pedido_itens_pedidoid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedido_itens
    ADD CONSTRAINT pedido_itens_pedidoid_fkey FOREIGN KEY (pedidoid) REFERENCES public.pedidos(id) ON DELETE CASCADE;


--
-- TOC entry 4756 (class 2606 OID 42104)
-- Name: pedido_itens pedido_itens_produtoid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedido_itens
    ADD CONSTRAINT pedido_itens_produtoid_fkey FOREIGN KEY (produtoid) REFERENCES public.produtos(id_produto);


--
-- TOC entry 4757 (class 2606 OID 42109)
-- Name: pedido_itens pedido_itens_produtosubstituto_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedido_itens
    ADD CONSTRAINT pedido_itens_produtosubstituto_fkey FOREIGN KEY (produtosubstituto) REFERENCES public.produtos(id_produto);


--
-- TOC entry 4746 (class 2606 OID 41981)
-- Name: pedidos pedidos_enderecoid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedidos
    ADD CONSTRAINT pedidos_enderecoid_fkey FOREIGN KEY (enderecoid) REFERENCES public.enderecos(id);


--
-- TOC entry 4747 (class 2606 OID 41976)
-- Name: pedidos pedidos_usuarioid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedidos
    ADD CONSTRAINT pedidos_usuarioid_fkey FOREIGN KEY (usuarioid) REFERENCES public.usuarios(id) ON DELETE CASCADE;


-- Completed on 2025-12-20 20:27:46

--
-- PostgreSQL database dump complete
--

