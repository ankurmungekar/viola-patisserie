"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  CartIcon,
  ChevronDownIcon,
  CloseIcon,
  MenuIcon,
  SearchIcon,
  StoreIcon,
  UserIcon,
} from "@/components/icons";
import { mainNavLinks, siteConfig } from "@/lib/config/site";
import type { Category } from "@/types/category";

interface HeaderProps {
  categories: Category[];
  cartCount?: number;
}

export function Header({ categories, cartCount = 0 }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white">
      <div className="bg-viola-topbar">
        <div className="mx-auto flex h-10 max-w-[1440px] items-center justify-end gap-3 px-4 md:px-8 xl:px-[100px]">
          <StoreIcon />
          <p className="text-sm tracking-viola-wide text-viola-text">
            {siteConfig.topBarMessage}
            <span className="mx-3 hidden sm:inline" aria-hidden="true">
              |
            </span>
            <span className="hidden sm:inline">{siteConfig.phoneDisplay}</span>
          </p>
        </div>
      </div>

      <div className="border-b border-viola-border bg-white">
        <div className="mx-auto flex h-24 max-w-[1440px] items-center justify-between px-4 md:px-8 xl:px-[100px]">
          <Link href="/" className="shrink-0" aria-label={`${siteConfig.name} home`}>
            <Image
              src="/images/logo.svg"
              alt={siteConfig.name}
              width={130}
              height={93}
              priority
              className="h-[60px] w-auto md:h-[93px]"
            />
          </Link>

          <nav
            className="hidden items-center gap-8 lg:flex"
            aria-label="Main navigation"
          >
            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-1 text-sm uppercase tracking-viola text-viola-text"
                aria-expanded={collectionsOpen}
                aria-haspopup="true"
                onClick={() => setCollectionsOpen((open) => !open)}
                onBlur={() => setCollectionsOpen(false)}
              >
                Signature Collections
                <ChevronDownIcon />
              </button>
              {collectionsOpen ? (
                <ul className="absolute left-0 top-full z-10 mt-2 min-w-48 border border-viola-border bg-white py-2 shadow-sm">
                  {categories.map((category) => (
                    <li key={category.id}>
                      <Link
                        href={`/collections/${category.slug}`}
                        className="block px-4 py-2 text-sm tracking-viola-wide text-viola-text hover:bg-viola-topbar"
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            {mainNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm uppercase tracking-viola text-viola-text hover:text-viola-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4 md:gap-6">
            <Link
              href="/search"
              aria-label="Search"
              className="hidden text-viola-text hover:text-viola-primary sm:inline-flex"
            >
              <SearchIcon />
            </Link>
            <Link
              href="/account"
              aria-label="Account"
              className="hidden text-viola-text hover:text-viola-primary sm:inline-flex"
            >
              <UserIcon />
            </Link>
            <Link
              href="/cart"
              aria-label={`Cart with ${cartCount} items`}
              className="relative text-viola-text hover:text-viola-primary"
            >
              <CartIcon />
              {cartCount > 0 ? (
                <span className="absolute -right-2 -top-2 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-viola-accent px-1 text-[10px] font-medium text-white">
                  {cartCount}
                </span>
              ) : null}
            </Link>
            <button
              type="button"
              className="text-viola-text lg:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((open) => !open)}
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen ? (
        <nav
          className="border-b border-viola-border bg-white px-4 py-4 lg:hidden"
          aria-label="Mobile navigation"
        >
          <p className="mb-2 text-sm uppercase tracking-viola text-viola-accent">
            Signature Collections
          </p>
          <ul className="mb-4 space-y-2">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/collections/${category.slug}`}
                  className="block text-sm tracking-viola-wide text-viola-text"
                  onClick={() => setMobileOpen(false)}
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="space-y-3 border-t border-viola-border pt-4">
            {mainNavLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block text-sm uppercase tracking-viola text-viola-text"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
