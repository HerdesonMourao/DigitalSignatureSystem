import express from "express";
import connMysql from "../config/db_config";
import crypto from 'crypto';

export async function CreateMessageEncrypted(req, res) {
  try {
    //id_sender e o id_recipient do public_key_communication.
    const { id_sender, id_recipient, message } = req.body;
    
    const searchIdSender = "SELECT * FROM public_key_communication WHERE id_sender = ? AND id_recipient = ?";
    const searchPrivateKey = "SELECT * FROM client WHERE id = ?";
    
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
      
      await connMysql.query(searchPrivateKey, [id_sender], (err, rowsTwo) => {
        // const signature = crypto.sign("sha256", Buffer.from(message), {
        //   key: rowsTwo[0].private_key,
        //   padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
        // })

        // console.log('112 => ', signature.toString('base64'));

        let signer = crypto.createSign('RSA-SHA256');
        signer.update(message);
        console.log(signer.sign(rowsTwo[0].private_key, 'hex'));

        // console.log('1',signer);

        // let x = signer.write(message);
        // signer.end()
        // console.log('2',x)

        // let c = signer.sign(rowsTwo[0].private_key, 'base64');

        // console.log(c)
        // let a = rowsTwo[0].private_key;

        // let teste = signer.sign(a, 'base64');

        // console.log('2', teste)

        // let mode = crypto.RSA_PKCS1_SHA256;
        // let message = messageEncrypted;
        // let key = rowsTwo[0].private_key;

        // crypto.sign(mode, message, key, (err, signature) => {
        //   console.log('122 = ', signature)
        // })
      });

      //console.log('1', messageEncrypted);
      //console.log('2', messageEncrypted.toString("base64"));
      
      

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

    await connMysql.query(searchMessage, [id_message], (err, rows) => {
      console.log(rows)
      connMysql.query(searchPrivateKey, [rows[0].id_recipient], (err, rowsTwo) => {
        const readMessageDecrypted = crypto.privateDecrypt(
          {
            key: rowsTwo[0].private_key,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
          },
          rows[0].message,
        );

        console.log("decrypted data: ", readMessageDecrypted.toString());
        
        const message = readMessageDecrypted.toString();

        return res.status(200).json({ message: message });
      });
    });

  } catch (error) {
    return res.status(400).json({ message: error });
  }
}