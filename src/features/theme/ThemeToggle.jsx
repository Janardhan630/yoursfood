import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { SunIcon, MoonIcon } from './ThemeIcons';

const LABEL = {
  dark: 'Dark theme active. Click to switch to light theme.',
  light: 'Light theme active. Click to switch to dark theme.',
};

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={LABEL[theme]}
      title={LABEL[theme]}
    >
      <span className="theme-toggle__icons">
        <SunIcon className={`theme-toggle__icon ${theme === 'light' ? 'is-active' : ''}`} />
        <MoonIcon className={`theme-toggle__icon ${theme === 'dark' ? 'is-active' : ''}`} />
      </span>
    </button>
  );
}
