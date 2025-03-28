"use client";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateSeed } from "@/action/Seed";
import { Copy, TrashIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";

export default function SeedInput() {
  const [seed, setSeed] = useState<string[] | null>([]);
  const id = useId();
  const [walletCount, setWalletCount] = useState<number>(1);
  const [secretKey, setSecretKey] = useState<string | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);

  const handleSecretKeyPrivateKey = () => {
    const { publicKey, privateKey } = generateSeed(walletCount);
    setSecretKey(privateKey);
    setPublicKey(publicKey);
    toast.success("Secret key generated");
    setWalletCount(walletCount + 1);
  };

  const handleGenerateSeed = () => {
    const { mnemonicArray } = generateSeed();
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

          <p className="w-full border p-2 text-sm font-mono mt-8  rounded">
            <strong>Public Key:</strong> {publicKey || "Not generated yet"}
          </p>
          <p className="w-full border p-2 text-sm font-mono rounded mt-2">
            <strong>Secret Key:</strong> {secretKey || "Not generated yet"}
          </p>

          <Button
            variant="destructive"
            className="mt-8"
            onClick={handleClearSeed}
          >
            <TrashIcon
              className="-ms-1 opacity-60 "
              size={16}
              aria-hidden="true"
            />
            Clear Wallet
          </Button>
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
