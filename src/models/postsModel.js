import 'dotenv/config';
import { ObjectId } from "mongodb";
import conectarAoBanco from "../config/dbConfig.js";

// Aguarda a conexão com o banco de dados usando a string de conexão do ambiente
const conexao = await conectarAoBanco(process.env.STRING_CONEXAO);

// Função assíncrona que busca todos os posts da coleção 'posts' no banco de dados
export async function getTodosPosts() {
    // Acessa o banco de dados 'imersão-instabytes' usando a conexão existente
    const db = conexao.db("imersão-instabytes");    
    // Acessa a coleção 'posts' dentro do banco de dados
    const colecao = db.collection("posts");
    // Retorna todos os documentos da coleção como um array
    return colecao.find().toArray();
}

export async function criarPost(novoPost) {
    // Obtém a conexão com o banco de dados "imersão-instabytes"
    const db = conexao.db("imersão-instabytes");    
    // Acessa a coleção "posts" dentro do banco de dados
    const colecao = db.collection("posts");   
    // Insere o objeto 'novoPost' na coleção "posts" e retorna o resultado da operação
    return colecao.insertOne(novoPost);
}

export async function atulizarPost(id, novoPost){
    const db = conexao.db("imersão-instabytes");    
    const colecao = db.collection("posts");   
    const objId = ObjectId.createFromHexString(id);
    return colecao.updateOne({_id: new ObjectId(objId)}, {$set:novoPost})
}