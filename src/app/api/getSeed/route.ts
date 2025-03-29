import { Keypair } from "@solana/web3.js";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  // get number of wallet and which type of wallet
  const { i, typeOfWallet } = body;

  // Generate a mnemonic => "xyz" , "abc", ...
  const mnemonic = generateMnemonic(256);
  const mnemonicArray = mnemonic.split(" ");

  // convert mnemonic to seed => "xyz" => 0x1234567890abcdef...
  const seed = mnemonicToSeedSync(mnemonic);

  // define all path for wallet
  const pathDerivation = [
    {
      name: "solana",
      path: `m/44'/501'/${i}'/0'`, // Derivation path for Solana
    },
    {
      name: "ethereum",
      path: `m/44'/60'/${i}'/0'`, // Derivation path for Ethereum
    },
    {
      name: "bitcoin",
      path: `m/44'/0'/${i}'/0'`, // Derivation path for Bitcoin
    },
  ];

  // get the path based  on wallet type.
  const selectedPath = pathDerivation.find(
    (path) => path.name === typeOfWallet
  );
  // check if the path is valid
  if (!selectedPath) {
    throw new Error("Invalid wallet type");
  }

  const derivedSeed = derivePath(selectedPath?.path, seed.toString("hex")).key;
  // Correct way to generate a keypair
  const keypair = Keypair.fromSeed(derivedSeed);
  const privateKey = Buffer.from(keypair.secretKey).toString("hex");
  const publicKey = keypair.publicKey.toBase58();

  return NextResponse.json({
    mnemonicArray,
    privateKey,
    publicKey,
  });
}
