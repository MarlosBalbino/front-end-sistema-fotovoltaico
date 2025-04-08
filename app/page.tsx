'use client'

import Link from "next/link";
import style from "./style.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    router.push("/pages/home");
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("userData", JSON.stringify({ name, email }));
    router.push("/result");
  };

  return (
    <div className={style.main_container}></div>
  );
}

// return (
//   <div className={style.main_container}>      
    
//     <div className={style.sub_container}>          
//       <form onSubmit={handleSubmit}>
//         <input type="text" placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} />
//         <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
//         <button type="submit">Enviar</button>
//       </form>
//     </div>  
// </div>
// )