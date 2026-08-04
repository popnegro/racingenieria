import React from 'react';
import logo from '../assets/images/rac-brand.jpg';
import { Cpu, Bell, Moon, Sun, Menu } from 'lucide-react';

export default function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.dataset.theme = newTheme;
  };

  return (
    <header role="banner" className="bg-primary text-neutral-50 flex items-center justify-between h-16 px-4 md:px-6">
      {/* Mobile menu button */}
      <button
        aria-label="Open navigation"
        onClick={() => onMenuClick?.()}
        className="md:hidden p-2 rounded hover:bg-neutral-800 focus-visible:outline"
      >
        <Menu className="w-5 h-5 text-neutral-50" />
      </button>

      {/* Brand/logo */}
      <div className="flex items-center gap-2">
        <img src={logo} alt="RAC Logo" className="h-8 w-auto object-contain" />
        <span className="font-display text-lg">RAC Ingeniería</span>
      </div>

      {/* Placeholder for breadcrumb / search */}
      <nav aria-label="Breadcrumb" className="flex-1 mx-4">
        {/* Could be filled with <ol> breadcrumb items */}
      </nav>

      {/* Action icons */}
      <div className="flex items-center gap-4">
        <button
          aria-label="Toggle theme"
          onClick={toggleTheme}
          className="p-2 w-12 h-12 rounded hover:bg-neutral-800 focus-visible:outline flex items-center justify-center"
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
        <button aria-label="Notifications" className="p-2 w-12 h-12 rounded hover:bg-neutral-800 focus-visible:outline flex items-center justify-center">
          <Bell className="w-5 h-5" />
        </button>
        <button aria-label="User profile" className="p-2 w-12 h-12 rounded hover:bg-neutral-800 focus-visible:outline flex items-center justify-center">
          <Cpu className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
