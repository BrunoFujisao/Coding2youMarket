// Middleware para verificar se o usuário é admin
const authAdmin = (req, res, next) => {
    try {
        // Verifica se o usuário está autenticado
        if (!req.usuario) {
            return res.status(401).json({
                success: false,
                message: 'Autenticação necessária'
            });
        }

        // Verifica se o usuário tem role de admin
        if (req.usuario.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Acesso negado. Apenas administradores podem acessar esta rota.'
            });
        }

        // Usuário é admin, pode prosseguir
        next();
    } catch (error) {
        console.error('Erro no middleware de admin:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro ao verificar permissões de admin',
            error: error.message
        });
    }
};

module.exports = authAdmin;
