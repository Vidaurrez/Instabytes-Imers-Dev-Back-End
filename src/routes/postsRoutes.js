import express from "express";
import multer from "multer";
import cors from "cors";
import { listarPosts, postarNovoPost, uploadImagem, atulizarNovoPost} from "../controllers/postsControllers.js";

const corsOptions = {
    origin: "http://localhost:8000",
    optionsSuccessStatus: 200
}

// Configuração para fazer o upload necessário somente no OS windows
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})

const upload = multer({ dest: "./uploads" , storage})

const routes = (app) => {
    // Configura o express para interpretar requisições no formato JSON
    app.use(express.json());
    app.use(cors(corsOptions));
    // Rota para buscas todos os posts
    app.get("/posts", listarPosts);
    // Rota para criar um post
    app.post("/posts", postarNovoPost);
    // Rota para fazer upload das imagens
    app.post("/upload", upload.single("imagem"), uploadImagem);
    // Rota para atualizar um post
    app.put("/upload/:id", atulizarNovoPost);

}

export default routes;