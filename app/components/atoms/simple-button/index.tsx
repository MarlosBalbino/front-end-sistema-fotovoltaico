'use client';
import { useRouter } from 'next/navigation';
import style from './style.module.css';

interface ButtonProps {
  label: string;
  link: string;
}

const SimpleButton: React.FC<ButtonProps> = ({ label, link }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(link); // 👈 navegação client-side
  };

  return (
    <button onClick={handleClick} className={style.submit_button}>
      {label}
    </button>
  );
};

export default SimpleButton;