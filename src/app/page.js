import Link from "next/link";
import { Header } from "./_components/header";
import { Form } from "./_components/form";

export default function Home() {
  return (
    <div className="h-[600px] text-amber-50">
      <Header/>
      <div className="h-[400px] flex justify-center ">
        <main className="h-auto w-full flex flex-col justify-center items-center bg-blue-500">
          <h1 className="text-5xl text-white font-bold">DOIFS <span className="text-blue-300">Search</span></h1>
          <Form/>
          
        </main>
      </div>


      <footer className="">
       Esse é um footer
      </footer>
    </div>
  );
}
