const express = require('express');
const router = express.Router();

const {insertClienteEndereco,getClientesEnderecos, getEnderecosPorUsuario, getClienteEnderecoPorId,
  setEnderecoPrincipal, desvincularEndereco, deleteClienteEndereco
} = require('../Model/DAO/clienteEnderecoDao');

//READ
router.get('/cliente-enderecos', async (req, res) => {
  try {
    const vinculos = await getClientesEnderecos();

    return res.status(200).json({
      success: true,
      vinculos
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar vínculos de endereço',
      error: error.message
    });
  }
});

//READ POR USER
router.get('/cliente-enderecos/usuario/:usuarioId', async (req, res) => {
  try {
    const usuarioId = Number(req.params.usuarioId);

    if (!usuarioId) {
      return res.status(400).json({
        success: false,
        message: 'ID do usuário inválido'
      });
    }

    const enderecos = await getEnderecosPorUsuario(usuarioId);

    if (!enderecos || enderecos.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Nenhum endereço ativo encontrado para este usuário'
      });
    }

    return res.status(200).json({
      success: true,
      enderecos
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar endereços do usuário',
      error: error.message
    });
  }
});

//READ POR ID
router.get('/cliente-enderecos/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID do vínculo inválido'
      });
    }

    const vinculo = await getClienteEnderecoPorId(id);

    if (!vinculo) {
      return res.status(404).json({
        success: false,
        message: 'Vínculo não encontrado'
      });
    }

    return res.status(200).json({
      success: true,
      vinculo
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar vínculo',
      error: error.message
    });
  }
});

//CREATE
router.post('/cliente-enderecos', async (req, res) => {
  try {
    const { usuarioId, enderecoId, principal } = req.body;

    if (!usuarioId || !enderecoId) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios não informados'
      });
    }

    const vinculo = await insertClienteEndereco({
      usuarioId,
      enderecoId,
      principal
    });

    return res.status(201).json({
      success: true,
      message: 'Endereço vinculado ao usuário com sucesso',
      vinculo
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erro ao vincular endereço',
      error: error.message
    });
  }
});

// UPDATE DEFINIR PRINCIPAL
router.put('/cliente-enderecos/:id/principal', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { usuarioId } = req.body;

    if (!id || !usuarioId) {
      return res.status(400).json({
        success: false,
        message: 'ID do vínculo ou usuário inválido'
      });
    }

    const atualizado = await setEnderecoPrincipal(id, usuarioId);

    if (!atualizado) {
      return res.status(404).json({
        success: false,
        message: 'Endereço não encontrado ou inativo'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Endereço definido como principal',
      endereco: atualizado
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erro ao definir endereço principal',
      error: error.message
    });
  }
});

// SOFT DELETE
router.patch('/cliente-enderecos/:id/desvincular', async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID do vínculo inválido'
      });
    }

    const desvinculado = await desvincularEndereco(id);

    if (!desvinculado) {
      return res.status(404).json({
        success: false,
        message: 'Endereço não encontrado ou já desvinculado'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Endereço desvinculado com sucesso',
      endereco: desvinculado
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erro ao desvincular endereço',
      error: error.message
    });
  }
});

// HARD DELETE
router.delete('/cliente-enderecos/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID inválido'
      });
    }

    const deletado = await deleteClienteEndereco(id);

    if (!deletado) {
      return res.status(404).json({
        success: false,
        message: 'Vínculo não encontrado'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Vínculo removido definitivamente'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erro ao remover vínculo',
      error: error.message
    });
  }
});

module.exports = router;
