// Mapeamento de imagens locais
import banner1 from './Banners - Subscrivery/banner 1.jpg';
import banner2 from './Banners - Subscrivery/banner 2.jpeg';
import banner3 from './Banners - Subscrivery/banner 3.png';

import categoriaBebidas from './Categorias - Subscrivery/bebidas.jpg';
import categoriaCarnes from './Categorias - Subscrivery/carnes.jpg';
import categoriaHortfruit from './Categorias - Subscrivery/hortfruit.jpg';
import categoriaLaticinios from './Categorias - Subscrivery/laticinios.jpg';
import categoriaMercearia from './Categorias - Subscrivery/mercearia.jpg';
import categoriaPadaria from './Categorias - Subscrivery/padaria2.jpg';

import maca from './maca.jpeg';
import banana from './bananaprata.webp';
import laranja from './laranja.webp';
import abacate from './abacate.jpg';
import abacaxi from './abacaxi.jpg';
import limao from './limao.webp';
import morango from './morango.jpg';
import pera from './pera.jpg';
import maracuja from './maracuja.webp';
import detergente from './detergente.webp';
import amaciante from './amaciante.webp';

export const banners = [banner1, banner2, banner3];

export const categoriasImagens = {
    'Bebidas': categoriaBebidas,
    'Carnes': categoriaCarnes,
    'Hortifruti': categoriaHortfruit,
    'Laticínios': categoriaLaticinios,
    'Mercearia': categoriaMercearia,
    'Padaria': categoriaPadaria
};

export const produtosImagens = {
    // Frutas/Hortifruti
    'maca': maca,
    'banana': banana,
    'laranja': laranja,
    'abacate': abacate,
    'abacaxi': abacaxi,
    'limao': limao,
    'morango': morango,
    'pera': pera,
    'maracuja': maracuja,

    // Limpeza
    'detergente': detergente,
    'amaciante': amaciante
};

// Função helper para buscar imagem do produto
export const getProdutoImagem = (nomeProduto) => {
    if (!nomeProduto) return null;

    const nomeNormalizado = nomeProduto.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove acentos
        .replace(/\s+/g, ''); // Remove espaços

    // Tenta encontrar por palavras-chave
    for (const [key, imagem] of Object.entries(produtosImagens)) {
        if (nomeNormalizado.includes(key)) {
            return imagem;
        }
    }

    return null; // Retorna null se não encontrar
};

export default {
    banners,
    categoriasImagens,
    produtosImagens,
    getProdutoImagem
};

