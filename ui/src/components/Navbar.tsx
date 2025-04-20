import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { IconLibraryPlus } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

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
      name: "Learn",
      link: "/app/learn",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <Navbar>
      {/* Desktop Navigation */}
      <NavBody>
        <NavbarLogo />
        <NavItems items={navItems} />
        <div className="flex items-center gap-4">
          <NavbarButton
            className="flex text-white bg-primary items-center justify-center rounded-2xl"
            href="/app/publish"
          >
            <IconLibraryPlus className="w-4 h-4 mr-2 " />
            Publish Agent
          </NavbarButton>
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
            <NavbarButton
              onClick={() => setIsMobileMenuOpen(false)}
              href="/app/publish"
              className="w-full text-white bg-primary flex items-center items-center justify-center text-lg rounded-2xl"
            >
              <IconLibraryPlus className="w-4 h-4 mr-2" />
              Publish Agent
            </NavbarButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
