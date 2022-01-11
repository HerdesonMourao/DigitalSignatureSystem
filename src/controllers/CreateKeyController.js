import express from "express";
import { generateKeyPair } from "crypto";
import connMysql from "../config/db_config";

export async function CreateKey(req, res) {
  generateKeyPair(
    "rsa",
    {
      modulusLength: 4096,
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
    },
    (err, publicKey, privateKey) => {

      const { name } = req.body;

      const register = "INSERT INTO client (name, public_key, private_key) VALUES (?,?,?)";

      const public_key = publicKey;
      const private_key = privateKey;
      
      connMysql.query(register, [
        name,
        public_key,
        private_key,
      ]);

      return res.status(200).json({ publicKey: publicKey, privateKey: privateKey });
    }
  );
}