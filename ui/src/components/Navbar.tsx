import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { WalletButton } from "./ui/wallet-button";

export default function AppNavbar() {
  const navItems = [
    {
      name: "Marketplace",
      link: "/app/marketplace",
    },
    {
      name: "Portfolio",
      link: "/app/portfolio",
    },
    {
      name: "Publish Agent",
      link: "/app/publish",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <Navbar className="md:items-center">
      {/* Desktop Navigation */}
      <NavBody className="md:items-center">
        <NavbarLogo />
        <NavItems items={navItems} />
        <div className="flex items-center gap-4">
          <WalletButton />
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          {navItems.map((item, idx) => (
            <Link
              key={`mobile-link-${idx}`}
              to={item.link}
              onClick={() => setIsMobileMenuOpen(false)}
              className="relative text-neutral-600 dark:text-neutral-300"
            >
              <span className="block">{item.name}</span>
            </Link>
          ))}
          <div className="flex w-full flex-col gap-4">
            <WalletButton />
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
