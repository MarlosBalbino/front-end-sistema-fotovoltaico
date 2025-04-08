import { NavBar, Footer } from '@molecules';
import style from './style.module.css'

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <section>
      <NavBar />
      <div className={style.main_container}>
        <div className={style.children}>
          {children}
        </div>
      </div>      
      <Footer/>
    </section>);
}