import express from "express";
import connMysql from "../config/db_config";

export async function SendPublicKey(req, res) {
  try {
    const { id_remetente, id_destinatario } = req.body;

    const searchPublicKey = "SELECT * FROM client WHERE id = ?";

    const infor = await connMysql.query(searchPublicKey, [id_remetente]);

    console.log(infor.length)

    return res.status(200).json({ message: "Chave publica enviada" });
  } catch (error) {
    return res.status(400).json({ message: "Não existe nenhum correspondente" });
  }
}