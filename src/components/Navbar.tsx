"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Trophy, Users, MapPin, Newspaper, Star, Phone, LogIn, Camera, Award } from "lucide-react";

const navLinks = [
  { href: "/il-tour", label: "Il Tour", icon: Star },
  { href: "/tappe", label: "Tappe", icon: MapPin },
  { href: "/classifica", label: "Classifica", icon: Trophy },
  { href: "/squadre", label: "Squadre", icon: Users },
  { href: "/finals", label: "The Finals", icon: Trophy },
  { href: "/mvp", label: "MVP", icon: Award },
  { href: "/news", label: "News", icon: Newspaper },
  { href: "/gallery", label: "Gallery", icon: Camera },
  { href: "/sponsor", label: "Sponsor", icon: Star },
  { href: "/contatti", label: "Contatti", icon: Phone },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl">🏀</span>
            <div className="flex flex-col leading-none">
              <span className="font-[family-name:var(--font-bebas)] text-xl tracking-wider text-primary group-hover:text-gold transition-colors">
                ROMAGNA SUMMER
              </span>
              <span className="font-[family-name:var(--font-bebas)] text-sm tracking-widest text-foreground/80">
                HOOPS TOUR
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm text-muted hover:text-primary transition-colors rounded-lg hover:bg-surface"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              className="ml-3 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary-dark transition-colors flex items-center gap-2"
            >
              <LogIn size={16} />
              Accedi
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-surface border-t border-border">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 px-4 py-3 text-muted hover:text-primary hover:bg-surface-light rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Icon size={18} />
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/login"
              className="flex items-center gap-3 px-4 py-3 mt-2 bg-primary text-white rounded-lg font-semibold"
              onClick={() => setIsOpen(false)}
            >
              <LogIn size={18} />
              Accedi / Registrati
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
