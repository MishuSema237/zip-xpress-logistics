import React from 'react';

const Logo: React.FC<{ className?: string; variant?: 'icon' | 'full' }> = ({ className = '', variant = 'full' }) => {
  const logoSrc = variant === 'icon' ? '/ZipXpressLogoIcon.png' : '/ZipXpressLogoWithoutName.png';

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