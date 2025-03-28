import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";

export function generateSeed(i?: number) {
  const mnemonic = generateMnemonic(256);
  const mnemonicArray = mnemonic.split(" ");
  console.log("mnemonicArray", mnemonicArray);

  const seed = mnemonicToSeedSync(mnemonic);

  if (i === undefined) {
    i = Math.floor(Math.random() * 10);
  }

  const path = `m/44'/501'/${i}'/0'`; // Derivation path for Solana
  const derivedSeed = derivePath(path, seed.toString("hex")).key;

  // Correct way to generate a keypair
  const keypair = Keypair.fromSeed(derivedSeed);
  const privateKey = Buffer.from(keypair.secretKey).toString("hex");
  const publicKey = keypair.publicKey.toBase58();

  return {
    mnemonicArray,
    privateKey,
    publicKey,
  };
}
