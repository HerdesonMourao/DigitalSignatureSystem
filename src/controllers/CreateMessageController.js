import express from "express";
import connMysql from "../config/db_config";
import * as crypto from 'crypto';

export async function CreateMessageEncrypted(req, res) {
  try {
    //id_sender e o id_recipient do public_key_communication.
    const { id_sender, id_recipient, message } = req.body;
    
    const searchIdSender = "SELECT * FROM public_key_communication WHERE id_sender = ? AND id_recipient = ?";
    //const searchPrivateKey = "SELECT * FROM client WHERE id = ?";
    
    await connMysql.query(searchIdSender, [id_recipient, id_sender], (err, rows) => {
      //mensagem criptografada
      const messageEncrypted = crypto.publicEncrypt(
        {
          key: rows[0].public_key_sender,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: "sha256",
        },
        Buffer.from(message)
      );

      const messageEncryptedBase64 = messageEncrypted.toString('base64');
      
      // connMysql.query(searchPrivateKey, [id_sender], (err, rowsTwo) => {
      //   let signer = crypto.createSign('RSA-SHA256');

      //   console.log('1',signer);

      //   let x = signer.write(message);
      //   signer.end()
      //   console.log('2',x)

      //   let c = signer.sign(rowsTwo[0].private_key, 'base64');

      //   console.log(c)
      //   // let a = rowsTwo[0].private_key;

      //   // let teste = signer.sign(a, 'base64');

      //   // console.log('2', teste)
      // });

      // console.log('1', messageEncrypted);
      // console.log('2', messageEncrypted.toString("base64"));
      
      const senderMessageEncrypted = "INSERT INTO message (id_sender, id_recipient, message) VALUES (?, ?, ?)";

      connMysql.query(senderMessageEncrypted, [
        id_sender,
        id_recipient,
        messageEncryptedBase64
      ]);

      return res.status(200).json({ message: 'mensagem enviada' });
    });
  } catch (error) {
    return res.status(400).json({ messsage: error });
  }
}

export async function ReadMessageDecrypted(req, res) {
  try {
    const searchMessage = "SELECT * FROM message WHERE id = ?";
  } catch (error) {
    return res.status(400).json({ message: error });
  }
}