import BotaoVerde from "../components/botaoVerde";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  return (
    <div style={styles.container}>

      {/* LADO ESQUERDO */}
      <div style={styles.left}>
        <div style={styles.form}>

          <span style={styles.logo}>☕ Subscrivery</span>

          <h1 style={styles.title}>Faça Login</h1>

          <p style={styles.subtitle}>
            Ainda não possui uma conta? <a href="#" style={styles.link}>Criar Conta</a>
          </p>

          <label style={styles.label}>E-mail</label>
          <input
            type="email"
            placeholder="example@gmail.com"
            style={styles.input}
          />

          <label style={styles.label}>Senha</label>
          <input
            type="password"
            placeholder="******"
            style={styles.input}
          />

          <div style={styles.row}>
            <label style={styles.checkbox}>
              <input type="checkbox" /> Lembre-se de mim
            </label>
            <a href="#" style={styles.link}>Esqueceu a senha?</a>
          </div>

          <BotaoVerde mensagem="Fazer Login" />

          <div style={styles.divider}>ou</div>

          <button style={styles.googleBtn}>
                <FcGoogle size={18} />
                Continuar com o Google
        </button>

        </div>
      </div>

      {/* LADO DIREITO */}
      <div style={styles.right}>
        <div style={styles.support}>🎧 Suporte</div>
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
    fontFamily: "Inter, sans-serif"
  },

  left: {
    flex: 1,
    backgroundColor: "#2B2B2B",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#FFFFFF"
  },

  form: {
    width: "100%",
    maxWidth: "420px",
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },

  right: {
    flex: 1,
    backgroundColor: "#2F6B4F",
    color: "#fff",
    padding: "60px",
    position: "relative",
    display: "flex",
    alignItems: "center"
  },

  logo: {
    fontWeight: "600",
    marginBottom: "30px",
    color: "#2F6B4F"
  },

  title: {
    fontSize: "28px",
    marginBottom: "5px"
  },

  subtitle: {
    fontSize: "13px",
    color: "#AAA"
  },

  link: {
    color: "#4DAA8C",
    textDecoration: "none"
  },

  label: {
    fontSize: "12px",
    marginTop: "10px",
    color: "#CCC"
  },

  input: {
    height: "42px",
    borderRadius: "8px",
    border: "1px solid #555",
    backgroundColor: "#2B2B2B",
    color: "#fff",
    padding: "0 12px",
    outline: "none"
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "12px",
    margin: "8px 0",
    color: "#CCC"
  },

  checkbox: {
    display: "flex",
    alignItems: "center",
    gap: "6px"
  },

  divider: {
    textAlign: "center",
    margin: "15px 0",
    fontSize: "12px",
    color: "#999"
  },

  googleBtn: {
    height: "42px",
    borderRadius: "8px",
    border: "none",
    background: "#FFFFFF",
    color: "#333",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontWeight: "500"
  },

  support: {
    position: "absolute",
    top: "30px",
    right: "40px",
    fontSize: "14px",
    opacity: 0.9
  },

  heroText: {
    fontSize: "42px",
    fontWeight: "700",
    lineHeight: "1.2"
  }
};
