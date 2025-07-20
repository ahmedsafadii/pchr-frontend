'use client';

import Image from 'next/image';
import { useLocale } from 'next-globe-gen';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
}

export default function Logo({ 
  width = 218, 
  height = 93, 
  className = '',
  alt = 'PCHR Logo'
}: LogoProps) {
  const locale = useLocale();
  const logoSrc = locale === 'ar' ? '/img/logo_ar.svg' : '/img/logo_en.svg';
  
  return (
    <Image
      src={logoSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority
    />
  );
} 