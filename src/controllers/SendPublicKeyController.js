import express from "express";
import connMysql from "../config/db_config";

export async function SendPublicKey(req, res) {
  try {
    const { id_sender, id_recipient } = req.body;

    const searchPublicKey = "SELECT * FROM client WHERE id = ?";

    await connMysql.query(searchPublicKey, [id_sender], (err, rows) => {
      const public_key_sender = rows[0].public_key;

      const register = "INSERT INTO public_key_communication (id_sender, id_recipient, public_key_sender) VALUES (?,?,?)"

      connMysql.query(register, [
        id_sender,
        id_recipient,
        public_key_sender
      ]);

      return res.status(200).json({ message: "Chave publica enviada" });
    });
  } catch (error) {
    return res.status(400).json({ message: "Não existe nenhum correspondente" });
  }
}