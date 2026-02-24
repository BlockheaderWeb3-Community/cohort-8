import Image from "next/image";
import { Header } from "./components/header";
import Section from "./components/section";

export default function Home() {
  return (
    
    <div className=" p-10">
         <div className=""><Header/></div>
         <div><Section/></div>
    </div>
        
        
  );
}
