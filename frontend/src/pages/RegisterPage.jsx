import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BotaoVerde from "../components/botaoVerde";
import { FcGoogle } from "react-icons/fc";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { cadastrar } from "../api/auth";
import { validarCPF } from "../utils/validarCPF";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [verSenha, setVerSenha] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });
  const navigate = useNavigate();

  const handleCadastro = async () => {
    setErro("");
    setMensagem({ tipo: "", texto: "" }); // Limpa mensagens ao tentar novamente

    if (!nome || !email || !cpf || !telefone || !senha || !confirmarSenha) {
      setMensagem({ tipo: "erro", texto: "Preencha todos os campos." });
      return;
    }

    if (!validarCPF(cpf)) {
      setMensagem({ tipo: "erro", texto: "CPF inválido." });
      return;
    }

    if (senha !== confirmarSenha) {
      setMensagem({ tipo: "erro", texto: "As senhas não conferem." });
      return;
    }

    try {
      setLoading(true);
      const res = await cadastrar(nome, email, cpf, telefone, senha);

      if (res.success) {
        setMensagem({ tipo: "sucesso", texto: "Usuário cadastrado com sucesso!" });
        // Pequeno delay para o usuário ler a mensagem de sucesso
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setMensagem({ tipo: "erro", texto: res.message || "Erro ao realizar cadastro." });
      }

    } catch (error) {
      setErro(error?.message || "Erro ao cadastrar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.left}>
        <div style={styles.form}>
          <span style={styles.logo}>☕ Subscrivery</span>

          <h1 style={styles.title}>Cadastre-se</h1>

          <p style={styles.subtitle}>
            Já possui uma conta?{" "}
            <Link to="/" style={styles.link}>Fazer Login</Link>
          </p>

          {/* EXIBIÇÃO DE MENSAGENS (ERRO OU SUCESSO) */}
          {(mensagem.texto || erro) && (
            <p style={{ 
              color: mensagem.tipo === "sucesso" ? "#2F6B4F" : "red", 
              fontSize: "13px", 
              fontWeight: "600",
              textAlign: "center",
              backgroundColor: mensagem.tipo === "sucesso" ? "#E6FFFA" : "#FFF5F5",
              padding: "10px",
              borderRadius: "8px"
            }}>
              {mensagem.texto || erro}
            </p>
          )}

          <label style={styles.label}>Nome</label>
          <input
            type="text"
            style={styles.input}
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <label style={styles.label}>CPF</label>
          <input
            type="text"
            style={styles.input}
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            placeholder="000.000.000-00"
          />

          <label style={styles.label}>E-mail</label>
          <input
            type="email"
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label style={styles.label}>Celular</label>
          <input
            type="text"
            style={styles.input}
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="(DDD) 00000-0000"
          />

          <label style={styles.label}>Senha</label>
          <div style={styles.passwordWrapper}>
            <input
              type={verSenha ? "text" : "password"}
              style={styles.inputPassword}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            <div
              onClick={() => setVerSenha(!verSenha)}
              style={styles.eyeIcon}
            >
              {verSenha ? <LuEyeOff /> : <LuEye />}
            </div>
          </div>

          <label style={styles.label}>Confirme a Senha</label>
          <div style={styles.passwordWrapper}>
            <input
              type={verSenha ? "text" : "password"}
              style={styles.inputPassword}
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
            />
        
            <div
              onClick={() => setVerSenha(!verSenha)}
              style={styles.eyeIcon}
            >
              {verSenha ? <LuEyeOff /> : <LuEye />}
            </div>
          </div>

          <div style={{ marginTop: "10px" }}>
            <BotaoVerde
              mensagem={loading ? "Cadastrando..." : "Fazer Cadastro"}
              onClick={handleCadastro}
              disabled={loading}
            />
          </div>

          <div style={styles.divider}>
            <div style={styles.line}></div>
            <span style={{ padding: "0 10px" }}>ou</span>
            <div style={styles.line}></div>
          </div>

          <button style={styles.googleBtn}>
            <FcGoogle size={18} />
            Cadastrar com o Google
          </button>
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.blob}></div>
        <div style={styles.support}>🌐 <span>Suporte</span></div>
        <h2 style={styles.heroText}>
          O essencial,<br /> sempre em dia.
        </h2>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    fontFamily: "Inter, sans-serif",
  },
  left: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  form: {
    width: "100%",
    maxWidth: "400px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  logo: {
    fontWeight: "600",
    marginBottom: "20px",
    color: "#2F6B4F",
    fontSize: "18px",
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "4px",
    color: "#1A1A1A",
  },
  subtitle: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "20px",
  },
  link: {
    color: "#2F6B4F",
    textDecoration: "underline",
    fontWeight: "600",
  },
  label: {
    fontSize: "11px",
    marginTop: "8px",
    color: "#444",
    fontWeight: "500",
  },
  input: {
    height: "40px",
    borderRadius: "8px",
    border: "1px solid #E2E8F0",
    backgroundColor: "#F8FAFC",
    padding: "0 12px",
    outline: "none",
    fontSize: "14px",
    color: "#666",
  },
  passwordWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  inputPassword: {
    width: "100%",
    height: "40px",
    borderRadius: "8px",
    border: "1px solid #E2E8F0",
    backgroundColor: "#F8FAFC",
    padding: "0 40px 0 12px",
    outline: "none",
    fontSize: "14px",
    color: "#666",
  },
  eyeIcon: {
    position: "absolute",
    right: "12px",
    color: "#94A3B8",
    cursor: "pointer",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "20px 0",
    fontSize: "12px",
    color: "#94A3B8",
    textTransform: "uppercase",
  },
  line: {
    flex: 1,
    height: "1px",
    backgroundColor: "#E2E8F0",
  },
  googleBtn: {
    height: "48px",
    borderRadius: "24px",
    border: "1px solid #E2E8F0",
    background: "#F8FAFC",
    color: "#475569",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    fontWeight: "500",
    fontSize: "14px",
  },
  right: {
    flex: 1,
    position: "relative",
    backgroundColor: "#2F6B4F",
    display: "flex",
    alignItems: "center",
    padding: "80px",
  },
  support: {
    position: "absolute",
    top: "40px",
    right: "40px",
    color: "#FFFFFF",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    opacity: 0.9,
  },
  blob: {
    position: "absolute",
    top: "-10%",
    right: "-10%",
    width: "500px",
    height: "500px",
    background: "rgba(255, 255, 255, 0.08)",
    borderRadius: "50%",
    filter: "blur(60px)",
  },
  heroText: {
    fontSize: "64px",
    fontWeight: "800",
    lineHeight: "1.1",
    color: "#FFFFFF",
    maxWidth: "450px",
    zIndex: 1,
  },
};