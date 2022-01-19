import express from "express";
import { generateKeyPairSync } from "crypto";
import connMysql from "../config/db_config";

export async function CreateKey(req, res) {
  try {
    const { name } = req.body;

    const {publicKey, privateKey} = generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
        cipher: "aes-256-cbc",
        passphrase: "top secret",
      },
    });
  
    const register = "INSERT INTO client (name, public_key, private_key) VALUES (?,?,?)";
  
    const data = await connMysql.query(register, [
      name,
      publicKey,
      privateKey,
    ]);

    return res.status(200).json({ publicKey: publicKey, privateKey: privateKey});
  } catch (error) {
    return res.status(400).json({ message: 'ocorreu um erro' });
  }
}