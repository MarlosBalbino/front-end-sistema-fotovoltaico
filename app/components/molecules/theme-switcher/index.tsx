"use client"

import { useEffect, useState } from 'react';
import { VscColorMode } from 'react-icons/vsc';

import { styleText } from 'util';
import style from './style.module.css';
import { IoMdArrowDropdown } from 'react-icons/io';

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
};

type ThemeCollection = {
  [key: string]: Theme;
};

const themes: ThemeCollection = {

  light: {
    1: '#0070f3',
    2: '#007bff',
    3: '#0056b3',
    4: '#3498DB',
    5: '#e6f4ff',
    6: '#ffffff',
    7: '#ffffff',
    background: '#f9f9f9',
    text: '#000000',
  },
  light_green: {
    1: '#3a9e60',
    2: '#59b37b',
    3: '#82ca9d',
    4: '#82ca9d',
    5: '#bce3cb',
    6: '#ffffff',
    7: '#ffffff',
    background: '#f9f9f9',
    text: '#000000',
  },
  dark: {
    1:'#04aa6d',
    2:'#1abc9c',
    3:'#0f7561',
    4:'#1abc9c',
    5:'#282a36',
    6:'#2c3e50',
    7:'#282a36',
    background: '#2c3e50',
    text:'#dddddd'
  } 
};

export default function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState<string>('light');
  const [showThemeBar, setShowThemeBar] = useState<boolean>(false)

  const applyTheme = (themeName: string): void => {
    if (typeof window !== 'undefined') {
      const theme = themes[themeName];
      if (!theme) return;

      Object.keys(theme).forEach(key => {
        document.documentElement.style.setProperty(
          `--color-${key}`,
          theme[key as keyof Theme]
        );
      });
      
      document.documentElement.setAttribute('data-theme', themeName);
      localStorage.setItem('theme', themeName);
      setCurrentTheme(themeName);
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
  }, []);

  return (
    <div className={style.main_container}>

      <IoMdArrowDropdown className={style.icon} onClick={() => setShowThemeBar(!showThemeBar)} size={25}/>

      <VscColorMode className={style.icon} onClick={() => applyTheme(currentTheme === 'light' ? 'dark': 'light')} size={25}/>
      
      <div className={showThemeBar ? style.buttons_container: style.buttons_container_hide}>
        {Object.keys(themes).map(theme => (
          <button className={style.buttons}
            key={theme}
            onClick={() => applyTheme(theme)}
            aria-pressed={currentTheme === theme}
          >
            {theme.charAt(0).toUpperCase() + theme.slice(1)}
          </button>
        ))}
      </div>
      
    </div>
  );
}