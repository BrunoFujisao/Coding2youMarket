import { useNavigate, useLocation } from "react-router-dom";

export default function BottomNavigation() {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        {
            label: "Início",
            path: "/home",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9,22 9,12 15,12 15,22" />
                </svg>
            ),
        },
        {
            label: "Carrinho",
            path: "/carrinho",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
            ),
        },
        {
            label: "Dashboard",
            path: "/dashboard",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                </svg>
            ),
        },
        {
            label: "Perfil",
            path: "/perfil",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                </svg>
            ),
        },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav style={styles.bottomNav}>
            {navItems.map((item) => (
                <div
                    key={item.path}
                    style={{
                        ...styles.navItem,
                        ...(isActive(item.path) ? styles.navItemActive : {}),
                    }}
                    onClick={() => navigate(item.path)}
                >
                    <div
                        style={{
                            ...styles.navIcon,
                            ...(isActive(item.path) ? styles.navIconActive : {}),
                        }}
                    >
                        {item.icon}
                    </div>
                    <span
                        style={{
                            ...styles.navLabel,
                            ...(isActive(item.path) ? styles.navLabelActive : {}),
                        }}
                    >
                        {item.label}
                    </span>
                </div>
            ))}
        </nav>
    );
}

const styles = {
    bottomNav: {
        position: "fixed",
        bottom: "16px",
        left: "16px",
        right: "16px",
        height: "70px",
        backgroundColor: "#FFFFFF",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
        borderRadius: "35px",
        zIndex: 1000,
    },
    navItem: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "4px",
        cursor: "pointer",
        padding: "8px 16px",
        transition: "all 0.2s ease",
    },
    navItemActive: {},
    navIcon: {
        width: "24px",
        height: "24px",
        color: "#999999",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    navIconActive: {
        color: "#2F6B4F",
    },
    navLabel: {
        fontSize: "11px",
        color: "#999999",
        fontWeight: "500",
    },
    navLabelActive: {
        color: "#2F6B4F",
        fontWeight: "600",
    },
};

