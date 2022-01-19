import express from "express";
import connMysql from "../config/db_config";
import crypto from 'crypto';

export async function CreateMessageEncrypted(req, res) {
  try {
    //id_sender e o id_recipient do public_key_communication.
    const { id_sender, id_recipient, message } = req.body;
    
    const searchIdSender = "SELECT * FROM public_key_communication WHERE id_sender = ? AND id_recipient = ?";
    const searchPrivateKey = "SELECT * FROM client WHERE id = ?";
    const senderMessageEncrypted = "INSERT INTO message (id_sender, id_recipient, message, signature) VALUES (?, ?, ?, ?)";
    
    await connMysql.query(searchIdSender, [id_recipient, id_sender], async (err, rows) => {
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
      
      await connMysql.query(searchPrivateKey, [id_sender], async (err, rowsTwo) => {
        const signature = crypto.sign("sha256", Buffer.from(messageEncryptedBase64), {
          key: rowsTwo[0].private_key,
          padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
          passphrase: "top secret"
        })

        const sign = signature.toString(`base64`);

        await connMysql.query(senderMessageEncrypted, [
          id_sender,
          id_recipient,
          messageEncryptedBase64,
          sign
        ]);

        const isVerified = crypto.verify(
          "sha256",
          Buffer.from(messageEncryptedBase64),
          {
            key: rowsTwo[0].public_key,
            padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
          },
          signature
        )

        console.log(`112 `, isVerified)
      });

      return res.status(200).json({ message: 'mensagem enviada' });
    });
  } catch (error) {
    return res.status(400).json({ messsage: error });
  }
}

export async function ReadMessageDecrypted(req, res) {
  try {
    const { id_message } = req.body;

    const searchMessage = "SELECT * FROM message WHERE id = ?";
    const searchPrivateKey = "SELECT * FROM client WHERE id = ?";

    await connMysql.query(searchMessage, [id_message], async (err, rows) => {
      await connMysql.query(searchPrivateKey, [rows[0].id_recipient], async (err, rowsTwo) => {
        // const readMessageDecrypted = crypto.privateDecrypt(
        //   {
        //     key: rowsTwo[0].private_key,
        //     padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        //     oaepHash: "sha256",
        //     passphrase: "top secret",
        //   },
        //   Buffer.from(rows[0].message)
        // );
  
        // console.log("decrypted data: ", readMessageDecrypted.toString());
          
        // const message = readMessageDecrypted.toString();
        
        
        // const isVerified = crypto.verify(
        //   "sha256",
        //   Buffer.from(rows[0].message),
        //   {
        //     key: rowsTwo[0].public_key,
        //     padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
        //   },
        //   rows[0].sign
        // )

        // console.log(`112 `, isVerified)

        return res.status(200).json({ message: message });
      });
    });

  } catch (error) {
    return res.status(400).json({ message: error });
  }
}