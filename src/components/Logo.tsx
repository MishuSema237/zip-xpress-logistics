import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface LogoProps {
  className?: string;
  variant?: 'icon' | 'full';
  theme?: 'light' | 'dark';
}

const Logo: React.FC<LogoProps> = ({ className = '', variant = 'full', theme: themeOverride }) => {
  const { isDarkMode } = useTheme();

  // Use the provided theme prop if available, otherwise fallback to the current app theme
  const effectiveTheme = themeOverride || (isDarkMode ? 'dark' : 'light');

  const logoSrc = variant === 'icon'
    ? '/ZipXpressLogoIcon.png'
    : (effectiveTheme === 'dark'
      ? '/ZipXpressLogoWithNameDarkMode.png'
      : '/ZipXpressLogoWithNameLightMode.png');

  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={logoSrc}
        alt="Zip Xpress"
        className="h-12 w-auto object-contain"
      />
    </div>
  );
};

export default Logo;