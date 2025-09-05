'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-globe-gen';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
  href?: string;
}

export default function Logo({ 
  width = 218, 
  height = 93, 
  className = '',
  alt = 'PCHR Logo',
  href
}: LogoProps) {
  const locale = useLocale();
  const logoSrc = locale === 'ar' ? '/img/logo_ar.svg' : '/img/logo_en.svg';
  const logoHref = href || `/${locale}`;
  
  return (
    <Link href={logoHref} className="logo-link">
      <Image
        src={logoSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
        priority
      />
    </Link>
  );
} 