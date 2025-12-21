const express = require('express');
const router = express.Router();
const usuarioEnderecoDao = require('../path/to/UsuarioEnderecoDao'); 
const auth = require('../middlewares/auth'); 

router.use(auth);

// CREATE
router.post('/vincular', async (req, res) => {
    
    const usuario_id = req.usuario.id; 
    const { endereco_id } = req.body;

    if (!endereco_id) {
        return res.status(400).json({ error: "O campo endereco_id é obrigatório." });
    }

    try {
        const vinculo = await usuarioEnderecoDao.vincularEndereco(usuario_id, endereco_id);
        res.status(201).json({
            message: "Endereço vinculado com sucesso!",
            data: vinculo
        });
    } catch (error) {
        res.status(500).json({ error: "Erro ao processar a vinculação." });
    }
});

// GET - Listar endereços do usuário logado
router.get('/meus-enderecos', async (req, res) => {
    const usuario_id = req.usuario.id; 

    try {
        const vinculos = await usuarioEnderecoDao.getVinculosPorUsuario(usuario_id);
        res.status(200).json(vinculos);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar seus endereços." });
    }
});

// DELETE - Remover vínculo
router.delete('/desvincular', async (req, res) => {
    const usuario_id = req.usuario.id;
    const { endereco_id } = req.body;

    if (!endereco_id) {
        return res.status(400).json({ error: "É necessário informar o endereco_id." });
    }

    try {
        const deletado = await usuarioEnderecoDao.desvincularEndereco(usuario_id, endereco_id);

        if (deletado) {
            res.status(200).json({ message: "Vínculo removido com sucesso." });
        } else {
            res.status(404).json({ error: "Vínculo não encontrado para este usuário." });
        }
    } catch (error) {
        res.status(500).json({ error: "Erro ao remover o vínculo." });
    }
});

module.exports = router;