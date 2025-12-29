# 🛒 Subscrivery

Uma solução completa para E-commerce com foco em Assinaturas Recorrentes.

O Subscrivery nasceu da necessidade de gerenciar não apenas vendas únicas, mas o ciclo de vida de clientes recorrentes. Ele resolve a complexidade de agendar entregas, processar pagamentos futuros automaticamente e manter o cliente informado, tudo através de uma interface moderna e intuitiva.

🌐 **Demo:** [subscrivery.vercel.app](https://subscrivery.vercel.app)

---

## 💡 O que este projeto resolve?

Diferente de e-commerces tradicionais, o foco aqui é a **frequência**. O sistema permite:

- **Flexibilidade:** O usuário decide se quer receber o produto uma vez, toda semana ou todo mês.
- **Automação:** Um motor de processamento (CRON) roda diariamente para identificar pedidos que precisam ser renovados, cria as novas ordens e processa o pagamento sem intervenção manual.
- **Segurança:** Integração robusta com Mercado Pago e autenticação via JWT com verificação por e-mail.

---

## 🛠 Tech Stack

Construído com tecnologias sólidas para garantir escalabilidade e manutenção.

### Back-end (A Lógica)
- **Node.js & Express:** API RESTful performática
- **PostgreSQL:** Banco relacional para garantir a integridade dos pedidos e transações financeiras
- **Node-Cron:** O coração do sistema de recorrência
- **Mercado Pago SDK:** Para processamento transparente de pagamentos
- **Resend:** Disparo de e-mails transacionais

### Front-end (A Experiência)
- **React + Vite:** SPA rápida e responsiva
- **Tailwind / CSS Puro:** Design customizado (Liquid Glass elements)
- **Mercado Pago Bricks:** Componentes de pagamento seguros e oficiais

---

## 🚀 Funcionalidades Principais

### Para o Cliente
- 🛍️ **Carrinho Inteligente:** Cálculo automático de descontos e gestão de frequência por item
- 💳 **Carteira Digital:** Salvar cartões para compras futuras (tokenização segura)
- 📦 **Rastreamento:** Acompanhamento de status e datas das próximas entregas recorrentes
- 🔒 **Segurança:** Login via código de verificação (OTP) no e-mail

### Para o Administrador
- 📊 **Dashboard:** Visão geral de vendas e métricas
- 📝 **Gestão Total:** CRUD de produtos, categorias e controle de estoque
- 🚚 **Controle de Pedidos:** Atualização de status e filtros avançados

---

## ⚙️ Bastidores: O Motor de Recorrência

Um dos maiores desafios deste projeto foi criar o sistema que gerencia as assinaturas automaticamente.

O sistema roda um **Job diário às 08:00 AM** que:

1. Busca assinaturas ativas com entrega agendada para hoje
2. Duplica o pedido original mantendo os itens e preferências
3. Atualiza a data da próxima entrega baseada na frequência escolhida (Semanal/Quinzenal/Mensal)
4. Dispara notificações por e-mail

<details>
<summary>🔍 <strong>Ver detalhes técnicos e Logs do CRON</strong> (Clique para expandir)</summary>

### Fluxo SQL Simplificado

```sql
SELECT * FROM pedidos 
WHERE dataproximaentrega::date = CURRENT_DATE
  AND status = 'ativa'
  AND frequencia IN ('semanal', 'quinzenal', 'mensal')
```

### Exemplo de Log de Execução

```
🚀 [CRON] Iniciando processamento...
📦 Encontrados 1 pedido(s) para processar
📝 Processando pedido #34 do usuário #19
   ✅ Novo pedido criado #39 (Cópia)
   ✅ Pedido original atualizado p/ 28/01/2026
   📧 Email enviado com sucesso
✅ [CRON] Concluído: 1 sucesso(s)
```

</details>

---

## 💻 Rodando Localmente

Siga os passos abaixo para ter o ambiente de desenvolvimento na sua máquina.

### Pré-requisitos
- Node.js 18+
- PostgreSQL
- Contas de desenvolvedor (Mercado Pago & Resend)

### 1. Backend

```bash
# Clone o repo
git clone https://github.com/BrunoFujisao/Coding2youMarket.git
cd Coding2youMarket/BACK-END

# Instale as dependências
npm install

# Configure as variáveis de ambiente (.env)
cp .env.example .env

# Rode as migrations
psql -U seu_user -d subscrivery -f database/schema.sql

# Start!
npm run dev
```

<details>
<summary>📄 <strong>Exemplo de .env (Backend)</strong></summary>

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/subscrivery
JWT_SECRET=segredo_super_secreto
MP_ACCESS_TOKEN=seu_token_mp
RESEND_API_KEY=sua_key_resend
PORT=3000
```

</details>

### 2. Frontend

```bash
cd ../frontend
npm install

# Configure o .env
# VITE_API_URL=http://localhost:3000/api
# VITE_MP_PUBLIC_KEY=sua_public_key_mp

npm run dev
```

---

## 🤝 Contribuição

Contribuições são muito bem-vindas! Se você tem uma ideia para melhorar o sistema de agendamento ou a interface:

1. Faça um **Fork** do projeto
2. Crie uma **Branch** para sua Feature (`git checkout -b feature/Incrível`)
3. Faça o **Commit** (`git commit -m 'Add some Incrível'`)
4. **Push** para a Branch (`git push origin feature/Incrível`)
5. Abra um **Pull Request**

---

## 📄 Licença

Este projeto está sob a licença MIT - veja o arquivo LICENSE para detalhes.

---

<div align="center">
  <sub>Desenvolvido com 💙 por <a href="https://github.com/BrunoFujisao">Kleber Grandolffi - Bruno Fujisao - Sarah</a></sub>
</div>