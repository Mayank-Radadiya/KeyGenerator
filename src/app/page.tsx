import Navbar from "@/components/global/Navbar";

export default function Home() {
  return (
    <>
      <main className="min-h-screen text-black dark:text-[#f7f7f7] p-5">
        <Navbar />
        <div className="flex flex-col  px-10 py-14  justify-start w-full">
          <h1 className="text-5xl">supports multiple blockchains</h1>
        </div>
      </main>
    </>
  );
}
