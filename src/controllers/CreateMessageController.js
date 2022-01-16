import express from "express";
import connMysql from "../config/db_config";
import * as crypto from 'crypto';

export async function CreateMessage(req, res) {
  try {
    //id_sender e o id_recipient do public_key_communication.
    const { id_sender, id_recipient, message } = req.body;
    
    const searchIdSender = "SELECT * FROM public_key_communication WHERE id_sender = ? AND id_recipient = ?";
    const searchPrivateKey = "SELECT * FROM client WHERE id = ?";
    
    await connMysql.query(searchIdSender, [id_recipient, id_sender], (err, rows) => {
      const messageEncrypted = crypto.publicEncrypt(
        {
          key: rows[0].public_key_sender,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: "sha256",
        },
        Buffer.from(message)
      );

      connMysql.query(searchPrivateKey, [id_sender], (err, rowsTwo) => {
        console.log(rowsTwo.length);
        console.log(rowsTwo)
        console.log(rowsTwo[0].private_key)
        const signature = crypto.sign("sha256", Buffer.from(message), {
          key: rowsTwo[0].private_key,
          padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
        });

        console.log('3', signature.toString("base64"));
      });

      // console.log('1', messageEncrypted);
      // console.log('2', messageEncrypted.toString("base64"));
      
      return res.status(200).json({ message: 'oi' });
    });
  } catch (error) {
    return res.status(400).json({ messsage: error });
  }
}