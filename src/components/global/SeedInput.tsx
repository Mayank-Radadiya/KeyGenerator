"use client";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, TrashIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import axios from "axios";

interface SeedOutputProps {
  secretKey: string;
  publicKey: string;
}
[];

export default function SeedInput() {
  const [seed, setSeed] = useState<string[] | null>([]);
  const id = useId();
  const [walletCount, setWalletCount] = useState<number>(1);
  const [key, setKey] = useState<SeedOutputProps[] | null>([]);

  // Generate a more wallet
  const handleSecretKeyPrivateKey = async () => {
    const data = await axios.post("/api/getSeed", {
      i: walletCount,
      typeOfWallet: "solana",
    });

    const { privateKey, publicKey } = data.data;
    setKey([
      ...(key || []),
      {
        secretKey: privateKey,
        publicKey: publicKey,
      },
    ]);
    toast.success("Secret key generated");
    setWalletCount(walletCount + 1);
  };

  const handleGenerateSeed = async () => {
    const data = await axios.post("/api/getSeed", {
      i: walletCount,
      typeOfWallet: "solana",
    });
    const { mnemonicArray } = data.data;
    setWalletCount(walletCount + 1);
    setSeed(mnemonicArray);
    handleSecretKeyPrivateKey();
    toast.success("Seed generated");
  };

  const handleClearSeed = () => {
    setSeed(null);
    toast.success("Seed cleared");
  };

  const copySeed = () => {
    const allSeed = seed?.join(" ");
    navigator.clipboard.writeText(allSeed || "");
    toast.success("Seed copied to clipboard");
  };

  return (
    <>
      {seed && seed.length > 0 ? (
        <div>
          <div className="space-y-4">
            <Accordion
              type="single"
              collapsible
              className="w-full space-y-2 border p-4 "
              defaultValue="3"
            >
              <AccordionItem value="1">
                <AccordionTrigger className="text-xl font-semibold hover:opacity-80 outline-none">
                  Your secret seed
                </AccordionTrigger>
                <AccordionContent>
                  <div className="gap-2 grid grid-cols-6">
                    {seed.map((word, index) => (
                      <Button
                        variant="outline"
                        key={index}
                        className="p-6 text-[15px] font-semibold"
                      >
                        {word}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    onClick={copySeed}
                    className="text-sm text-muted-foreground mt-4 flex items-center gap-2"
                  >
                    <Copy /> Copy{" "}
                  </Button>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="flex items-center justify-end mt-8 gap-x-5">
            <Button onClick={handleSecretKeyPrivateKey}>Add More Wallet</Button>

            <Button variant="destructive" onClick={handleClearSeed}>
              <TrashIcon
                className="-ms-1 opacity-60 "
                size={16}
                aria-hidden="true"
              />
              Clear Wallet
            </Button>
          </div>

          {key && key.length > 0 && (
            <>
              {key.map((item, index) => (
                <div key={index}>
                  <p className="w-full border p-2 text-sm font-mono mt-8 rounded">
                    <strong>Public Key:</strong> {item.publicKey}
                  </p>
                  <p className="w-full border p-2 text-sm font-mono rounded mt-2">
                    <strong>Secret Key:</strong> {item.secretKey}
                  </p>
                </div>
              ))}
            </>
          )}
        </div>
      ) : (
        <div className="mt-2">
          <Label htmlFor={id} className="text-sm">
            Enter your master seed
          </Label>
          <div className="flex gap-4 mt-2">
            <Input
              id={id}
              className="flex-1 h-12 text-[17px]"
              placeholder="car, cat, apple ... (or generate a new one)"
              type="text"
            />
            <Button onClick={handleGenerateSeed} className="h-12">
              Generate Wallet
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
