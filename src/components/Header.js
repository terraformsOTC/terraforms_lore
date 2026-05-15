'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

export default function Header() {
  const pathname = usePathname();
  const onBiomes = pathname.startsWith('/biomes');
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef(null);

  const navItems = [
    onBiomes
      ? { label: '[zones]', href: '/' }
      : { label: '[biomes]', href: '/biomes' },
    { label: '[estimator ↗]', href: 'https://terraformestimator.xyz', external: true },
    { label: '[mandala tool ↗]', href: 'https://terraformmandala.xyz', external: true },
    { label: '[tf explorer ↗]', href: 'https://terraformexplorer.xyz', external: true },
  ];

  useEffect(() => {
    if (!menuOpen) return;
    const onOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    const onEscape = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', onOutside);
    document.addEventListener('touchstart', onOutside);
    document.addEventListener('keydown', onEscape);
    return () => {
      document.removeEventListener('mousedown', onOutside);
      document.removeEventListener('touchstart', onOutside);
      document.removeEventListener('keydown', onEscape);
    };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const closeMenu = () => setMenuOpen(false);

  const renderLink = (item, className, closeOnNav) => (
    <a
      key={item.label}
      href={item.href}
      onClick={closeOnNav ? closeMenu : undefined}
      {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={className}
    >
      {item.label}
    </a>
  );

  return (
    <header ref={containerRef} className="z-10 px-6 py-4 md:py-6 md:mb-6 mb-3 sticky top-0 md:relative bg-primary">
      <nav className="flex flex-row justify-between items-center" style={{ minHeight: '36px' }}>
        <a href="/" className="text-lg">[terraform lore]</a>
        <div className="flex items-center gap-4 text-sm">
          <div className="hidden md:flex items-center gap-4 opacity-65">
            {navItems.map((item) => renderLink(item, '', false))}
          </div>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="md:hidden btn-text text-sm opacity-65 hover:opacity-100"
          >
            [{menuOpen ? 'close' : 'menu'}]
          </button>
        </div>
      </nav>
      {menuOpen && (
        <div
          className="md:hidden flex flex-col mt-4 pt-4 text-sm opacity-80"
          style={{ borderTop: '1px solid rgba(232, 232, 232, 0.12)' }}
        >
          {navItems.map((item) => renderLink(item, 'py-2', true))}
        </div>
      )}
    </header>
  );
}
