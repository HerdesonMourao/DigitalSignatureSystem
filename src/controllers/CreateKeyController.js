import express from "express";
import { generateKeyPair } from "crypto";

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
      return res.status(200).json({ publicKey: publicKey, privateKey: privateKey });
    }
  );
}