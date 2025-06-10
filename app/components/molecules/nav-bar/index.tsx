'use client'

import Link from 'next/link'
import style from './style.module.css'
import { LinkItem, SolarLogo } from '@atoms'
import { ThemeSwitcher } from '@molecules'
import { FiMenu } from "react-icons/fi";
import { useState } from 'react';

export default function NavBar(){
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return(
    <div className={style.main_container}>   
      <div className={style.sub_container}>
        <div className={style.logo}>
          <SolarLogo size={80}/>
        </div>      
        
        <div className={style.nav_buttons}>
          <div className={style.main_buttons}>
            <LinkItem link={'/pages/home'} label={'INÍCIO'}/>
            <LinkItem link={'/pages/page-1'} label={'SIMULAÇÃO'}/>
            <LinkItem link={'/pages/page-2'} label={'DIMENSIONAMENTO'}/>
            <LinkItem link={'/pages/page-3'} label={'CURVA CARACTERÍSTICA'}/>
            <LinkItem link={'/pages/page-4'} label={'SOLUÇÃO DE CONTROLE'}/>
          </div>
          
          <div className={style.secnd_buttons}>
            <LinkItem link={'/pages/page-5'} label={'SOBRE'}/>
            <ThemeSwitcher />
            
            {/* Botão de menu mobile */}
            <button 
              className={style.mobileMenuButton}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <FiMenu size={24}/>
            </button>
          </div>  
        </div>
      </div>
      
      {/* Menu mobile */}
      {mobileMenuOpen && (
        <div className={style.mobileMenu}>
          <LinkItem link={'/pages/home'} label={'INÍCIO'}/>
          <LinkItem link={'/pages/page-1'} label={'DIMENSIONAMENTO'}/>
          <LinkItem link={'/pages/page-2'} label={'SIMULAÇÃO'}/>
          <LinkItem link={'/pages/page-3'} label={'CURVA CARACTERÍSTICA'}/>
          <LinkItem link={'/pages/page-4'} label={'PARÂMETROS'}/>
          <LinkItem link={'/pages/page-5'} label={'SOBRE'}/>
        </div>
      )}
      
      <div className={style.bottom_line}/>
    </div>  
  )
}