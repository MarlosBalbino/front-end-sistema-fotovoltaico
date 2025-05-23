'use client';
import { useRouter } from 'next/navigation';
// Feather Icons (estilo mais fino)
import { FiArrowRight } from 'react-icons/fi'; // Importando o ícone de seta

// Material Icons
import { MdArrowForward } from 'react-icons/md';

// Font Awesome
import { FaArrowRight } from 'react-icons/fa';

// Hero Icons
import { HiArrowRight } from 'react-icons/hi';

import style from './style.module.css';

interface ButtonProps {
  label: string;
  link: string;
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
  iconOption?: 'fiArrowRight' | 'mdArrowForward' | 'faArrowRight' | 'hiArrowRight';
}

const arrows = {
  'fiArrowRight': < FiArrowRight/>,
  'mdArrowForward': <MdArrowForward/>,
  'faArrowRight': <FaArrowRight/>,
  'hiArrowRight': <HiArrowRight/>
}

// É possível seter um icone personalizado ou selecionar uma das opções de icones listados em "arrows".
// O icone personalizado terá prioridade. Então se um icone personalizado for setado (em icon), mesmo que aja uma oção
// escolhida em "iconOption" apenas o icone personalizado será mostrado.
 
const SimpleButton: React.FC<ButtonProps> = ({ 
  label, 
  link, 
  variant = 'primary', 
  size = 'medium',
  iconOption,
  icon // = <FiArrowRight /> // icone personalizado
}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(link);
  };

  const buttonClass = [
    style.button,
    variant === 'secondary' ? style.secondary : '',
    size !== 'medium' ? style[size] : '',
    icon || iconOption ? style.with_icon : ''
  ].join(' ');

  return (
    <button onClick={handleClick} className={buttonClass}>
      {label}
      {!icon && iconOption && <span className={style.icon}>{arrows[iconOption]}</span>}
      {icon && <span className={style.icon}>{icon}</span>}
    </button>
  );
};

export default SimpleButton;