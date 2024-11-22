import {getTodosPosts, criarPost, atulizarPost} from "../models/postsModel.js";
import fs from "fs";
import gerarDescricaoComGemini from "../services/geminiService.js";

export async function listarPosts(req, res) {
    // Chama a função que obtém todos os posts do banco de dados
    const posts = await getTodosPosts();
    // Envia os posts como resposta com status HTTP 200 (OK)
    res.status(200).json(posts);
}

// Função para criar um novo post com base nos dados enviados no corpo da requisição
export async function postarNovoPost(req, res) {
    // Obtém os dados do novo post a partir do corpo da requisição
    const novoPost = req.body;
    try {
        // Chama a função criarPost para salvar o novo post no banco de dados
        const postCriado = await criarPost(novoPost);
        // Retorna uma resposta de sucesso com o post criado
        res.status(200).json(postCriado);
    } catch (erro) {
        // Exibe o erro no console para depuração
        console.error(erro.message);
        // Retorna uma resposta de erro com status 500 e mensagem padrão
        res.status(500).json({ "Erro": "Falha na requisição" });
    }
}

// Função para fazer upload de uma imagem e associá-la a um novo post
export async function uploadImagem(req, res) {
    // Cria um objeto de post inicial com informações padrão e o nome do arquivo enviado
    const novoPost = {
        descricao: "",
        imgUrl: req.file.originalname,
        alt: ""
    };

    try {
        // Salva o novo post no banco de dados e obtém os dados do post criado
        const postCriado = await criarPost(novoPost);
        // Define o caminho atualizado para salvar a imagem com base no ID do post criado
        const imagemAtualizada = `uploads/${postCriado.insertedId}.png`;
        // Renomeia o arquivo enviado para o novo caminho definido
        fs.renameSync(req.file.path, imagemAtualizada);
        // Retorna uma resposta de sucesso com os dados do post criado
        res.status(200).json(postCriado);
    } catch (erro) {
        // Exibe o erro no console para depuração
        console.error(erro.message);
        // Retorna uma resposta de erro com status 500 e mensagem padrão
        res.status(500).json({ "Erro": "Falha na requisição" });
    }
}

export async function atulizarNovoPost(req, res) {
    const id = req.params.id;
    const urlImagem = `http://localhost:3000/${id}.png`
    const post = {
        imgUrl: urlImagem,
        descricao: req.body.descricao,
        alt: req.body.alt
    }
    try {
        const imgBuffer = fs.readFileSync(`uploads/${id}.png`)
        const descricao = await gerarDescricaoComGemini(imgBuffer)
        const post = {
            imgUrl: urlImagem,
            descricao: descricao,
            alt: req.body.alt
        }
        const postCriado = await atulizarPost(id, post);

        res.status(200).json(postCriado);
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({ "Erro": "Falha na requisição" });
    }
}