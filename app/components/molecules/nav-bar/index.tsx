
import Link from 'next/link'
import style from './style.module.css'
import { LinkItem, SfLogo, SolarLogo } from '@atoms'
import { RandomWalkMode, ThemeSwitcher } from '@molecules'
import { VscColorMode } from "react-icons/vsc";

export default function NavBar(){

  return(
    <div style={{backgroundColor: 'var(--color-background)', display: 'flex', flexDirection: 'row', justifyContent: 'center', position: 'fixed', height: '80px', width: '100%', zIndex: '50', boxShadow: '2px 2px 2px grey'}}>   
      <div className={style.logo}>
        <SolarLogo size={80}/>
      </div>      
      <div className={style.nav_buttons}>
        <div className={style.main_buttons}>
            <LinkItem link={'/pages/home'} label={'INÍCIO'}></LinkItem>
            <LinkItem link={'/pages/page-1'} label={'DIMENSIONAMENTO'}></LinkItem>
            <LinkItem link={'/pages/page-2'} label={'SIMULAÇÃO'}></LinkItem>
            <LinkItem link={'/pages/page-3'} label={'CURVA CARACTERÍSTICA'}></LinkItem>
            <LinkItem link={'/pages/page-4'} label={'PARAMETROS E POTÊNCIA'}></LinkItem>
        </div>
        <div className={style.secnd_buttons}>
          <LinkItem link={'/pages/page-5'} label={'SOBRE'}></LinkItem>
          
          <ThemeSwitcher /> 
        </div>  
      </div>
    </div>  
)}