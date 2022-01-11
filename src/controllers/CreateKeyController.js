import express from "express";
import crypto from 'crypto';

export async function CreateKey(req, res) {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
  });

  return res.status(200).json({ publicKey, privateKey }); 
}