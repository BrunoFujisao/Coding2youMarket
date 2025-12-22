import { useNavigate } from "react-router-dom";
import BottomNavigation from "../components/BottomNavigation";

export default function PerfilPage() {
    const navigate = useNavigate();

    const menuItems = [
        { label: "Dados Pessoais", path: "/dados-pessoais" },
        { label: "Segurança e Privacidade", path: "/seguranca" },
        { label: "Formas de Pagamento", path: "/pagamento" },
        { label: "Suporte", path: "/suporte" },
        { label: "Configurações", path: "/configuracoes" },
    ];

    return (
        <div style={styles.container}>
            {/* Header com foto de perfil */}
            <div style={styles.header}>
                <div style={styles.profileImageContainer}>
                    <img
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face"
                        alt="Foto de perfil"
                        style={styles.profileImage}
                    />
                </div>
                <h1 style={styles.title}>Perfil</h1>
                <p style={styles.greeting}>Olá, Mariana!</p>
            </div>

            {/* Menu de opções */}
            <div style={styles.menuContainer}>
                {menuItems.map((item, index) => (
                    <div
                        key={index}
                        style={styles.menuItem}
                        onClick={() => navigate(item.path)}
                    >
                        <span style={styles.menuLabel}>{item.label}</span>
                        <span style={styles.arrow}>›</span>
                    </div>
                ))}

                {/* Deletar Conta */}
                <div style={styles.deleteItem}>
                    <span style={styles.deleteLabel}>Deletar Conta</span>
                    <span style={styles.deleteArrow}>›</span>
                </div>
            </div>

            {/* Bottom Navigation */}
            <BottomNavigation />
        </div>
    );
}

const styles = {
    container: {
        minHeight: "100vh",
        backgroundColor: "#F0F0F5",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Inter', sans-serif",
        paddingBottom: "100px",
    },
    header: {
        position: "relative",
        height: "280px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    profileImageContainer: {
        width: "120px",
        height: "120px",
        borderRadius: "60px",
        overflow: "hidden",
        marginBottom: "16px",
    },
    profileImage: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
    },
    title: {
        fontSize: "24px",
        fontWeight: "700",
        margin: 0,
        color: "#1A1A1A",
    },
    greeting: {
        fontSize: "14px",
        margin: "4px 0 0 0",
        color: "#666666",
    },
    menuContainer: {
        flex: 1,
        marginTop: "-20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        padding: "0 16px",
    },
    menuItem: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px 16px",
        backgroundColor: "#FFFFFF",
        borderRadius: "12px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        cursor: "pointer",
    },
    menuLabel: {
        fontSize: "14px",
        fontWeight: "500",
        color: "#1A1A1A",
        maxWidth: "75%",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
    deleteItem: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px 16px",
        backgroundColor: "#FFFFFF",
        borderRadius: "12px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        cursor: "pointer",
    },
    deleteLabel: {
        fontSize: "14px",
        fontWeight: "500",
        color: "#C0392B",
    },
    arrow: {
        fontSize: "18px",
        color: "#B0B0B0",
    },
    deleteArrow: {
        fontSize: "18px",
        color: "#C0392B",
    },
};

