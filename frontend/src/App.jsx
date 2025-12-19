import BotaoVerde from "./components/botaoVerde";

function App() {
  function handleLogin() {
    alert("Login clicado");
  }

  return (
    <div style={{ maxWidth: "300px", margin: "100px auto" }}>
      <BotaoVerde
        mensagem="Fazer Login"
        onClick={handleLogin}
      />
    </div>
  );
}

export default App;
