import Link from 'next/link'
import style from './style.module.css'
import { FooterLinkItem, LinkItem } from '../../atoms'

export default function Footer(){

  return(
    <footer style={{height: '200px', display: 'flex', gap: '5rem',justifyContent: 'center', alignItems: 'center', 
      zIndex: '50', backgroundColor: '#e0dede',
      boxShadow: '5px 5px'
    }}>
      <FooterLinkItem link={''} label={'Documentação'}></FooterLinkItem>
      <FooterLinkItem link={''} label={'Artigos'}></FooterLinkItem>
      <FooterLinkItem link={''} label={'Colaborações'}></FooterLinkItem>
      <FooterLinkItem link={''} label={'Banco de dados'}></FooterLinkItem>
    </footer>
  )}