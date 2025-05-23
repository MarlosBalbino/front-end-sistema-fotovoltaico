"use client"

import { useEffect, useState } from 'react';
import { VscColorMode } from 'react-icons/vsc';
import { IoMdArrowDropdown } from 'react-icons/io';
import style from './style.module.css';

// Definindo tipos
type Theme = {
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  7: string;
  text: string;
  background: string;
  primaryGradient: string;
  secondaryGradient: string;
};

type ThemeCollection = {
  [key: string]: Theme;
};

const themes: ThemeCollection = {
  light: {
    1: '#8884d8',       // Roxo principal
    2: '#82ca9d',       // Verde principal
    3: '#6a66c4',       // Roxo escuro
    4: '#6dbb8c',       // Verde escuro
    5: '#f8f9fa',       // Fundo claro (usado em cards)
    6: '#ffffff',       // Branco puro
    7: '#2c3e50',       // Texto escuro
    background: '#fafafa', // Fundo da página
    text: '#2c3e50',      // Texto principal
    primaryGradient: 'linear-gradient(90deg, #8884d8, #82ca9d)',
    secondaryGradient: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
  },
  dark: {
    1: '#9d9ae8',       // Roxo claro
    2: '#95d5b2',       // Verde claro
    3: '#7a76d4',       // Roxo médio
    4: '#6dbb8c',       // Verde médio
    5: '#2d3748',       // Fundo escuro para cards
    6: '#1a202c',       // Preto azulado
    7: '#e2e8f0',       // Texto claro
    background: '#1a202c', // Fundo escuro
    text: '#e2e8f0',       // Texto claro
    primaryGradient: 'linear-gradient(90deg, #6a66c4, #4d9f72)',
    secondaryGradient: 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)'
  }
};

export default function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState<string>('light');
  const [showThemeBar, setShowThemeBar] = useState<boolean>(false);

  const applyTheme = (themeName: string): void => {
    if (typeof window !== 'undefined') {
      const theme = themes[themeName];
      if (!theme) return;

      // Aplicar cores básicas
      Object.keys(theme).forEach(key => {
        if (key !== 'primaryGradient' && key !== 'secondaryGradient') {
          document.documentElement.style.setProperty(
            `--color-${key}`,
            theme[key as keyof Theme]
          );
        }
      });

      // Aplicar gradientes como variáveis CSS
      document.documentElement.style.setProperty(
        '--primary-gradient',
        theme.primaryGradient
      );
      document.documentElement.style.setProperty(
        '--secondary-gradient',
        theme.secondaryGradient
      );
      
      document.documentElement.setAttribute('data-theme', themeName);
      localStorage.setItem('theme', themeName);
      setCurrentTheme(themeName);
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
  };

  return (
    <div className={style.main_container}>
      <IoMdArrowDropdown 
        className={style.icon} 
        onClick={() => setShowThemeBar(!showThemeBar)} 
        size={25}
        aria-label="Mostrar temas"
      />

      <VscColorMode 
        className={style.icon} 
        onClick={toggleTheme}
        size={25}
        aria-label={`Alternar para tema ${currentTheme === 'light' ? 'escuro' : 'claro'}`}
      />
      
      <div className={showThemeBar ? style.buttons_container : style.buttons_container_hide}>
        {Object.keys(themes).map(theme => (
          <button 
            className={style.buttons}
            key={theme}
            onClick={() => applyTheme(theme)}
            aria-pressed={currentTheme === theme}
            style={{
              background: themes[theme].background,
              color: themes[theme].text,
              border: `2px solid ${themes[theme][1]}`
            }}
          >
            {theme.charAt(0).toUpperCase() + theme.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}