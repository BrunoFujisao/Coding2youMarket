import React from 'react';

export default function NovoEnderecoModal() {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
    
        <div style={styles.header}>
          <button style={styles.backButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" /> /
            </svg>
          </button>
          <h2 style={styles.headerTitle}>Novo endereço</h2>
          <div style={{ width: 20 }}></div> 
        </div>

        <div style={styles.formContent}>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>CEP</label>
            <input style={styles.input} type="text" placeholder="222.222-000" />
          </div>

         
          <div style={styles.inputGroup}>
            <label style={styles.label}>Rua</label>
            <input style={styles.input} type="text" placeholder="Rua São José" />
          </div>

         
          <div style={styles.row}>
            <div style={{ ...styles.inputGroup, flex: 1, marginRight: '10px' }}>
              <label style={styles.label}>Número</label>
              <input style={styles.input} type="text" placeholder="1911" />
            </div>
            <div style={{ ...styles.inputGroup, flex: 2 }}>
              <label style={styles.label}>Bairro</label>
              <input style={styles.input} type="text" placeholder="Centro" />
            </div>
          </div>

          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Complemento</label>
            <input style={styles.input} type="text" placeholder="Perto do mercado Floripa" />
          </div>

         
          <div style={styles.inputGroup}>
            <label style={styles.label}>Cidade</label>
            <input style={styles.input} type="text" placeholder="Florianópolis" />
          </div>

         
          <div style={styles.row}>
            <div style={{ ...styles.inputGroup, flex: 1, marginRight: '10px' }}>
              <label style={styles.label}>UF</label>
              <input style={styles.input} type="text" placeholder="SC" />
            </div>
            <div style={{ ...styles.inputGroup, flex: 3 }}>
              <label style={styles.label}>Apelido</label>
              <input style={styles.input} type="text" placeholder="Casa, Trabalho..." />
            </div>
          </div>

          
          <button style={styles.submitButton}>
            Adicionar endereço
          </button>
        </div>
      </div>
    </div>
  );
}

// Estilos abaixo do return
const styles = {
  overlay: {
    width: '100%',
    minHeight: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Simula o fundo escurecido da imagem
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'sans-serif',
    padding: '20px',
  },
  modal: {
    backgroundColor: '#F8F9FA',
    width: '100%',
    maxWidth: '450px',
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px',
    borderBottom: '1px solid #E0E0E0',
  },
  headerTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    margin: 0,
  },
  backButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#333',
    padding: '5px',
  },
  formContent: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#444',
  },
  input: {
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid #FFF', // Borda branca conforme a imagem
    backgroundColor: '#FFF',
    fontSize: '14px',
    color: '#666',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    outline: 'none',
  },
  row: {
    display: 'flex',
    width: '100%',
  },
  submitButton: {
    backgroundColor: '#2D3337',
    color: '#FFF',
    border: 'none',
    padding: '16px',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'background-color 0.2s',
  },
};