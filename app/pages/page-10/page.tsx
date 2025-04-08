'use client'

import { Plot } from "@organisms";
import { PointAnimator, RandomWalkMode } from "@molecules"
import { useEffect, useState } from "react";

import style from './style.module.css'

export default function ChartTest() {
 


  return (    
    <div className={style.main_container}>
   
      {/* <h1 className="text-center text-2xl font-bold mt-8">Animação do Ponto</h1> */}
      <RandomWalkMode/>

    </div>
  );
}