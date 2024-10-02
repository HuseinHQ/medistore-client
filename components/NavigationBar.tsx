'use client';

import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button } from '@nextui-org/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useEffect, useState } from 'react';

export default function NavigationBar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    window.dispatchEvent(new Event('localStorageChange'));
  };

  useEffect(() => {
    const checkAuth = () => {
      if (localStorage.getItem('access_token')) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };

    // Check authentication status on component mount
    checkAuth();

    // Listen for storage events (changes from other documents)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'access_token') {
        checkAuth();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Listen for custom events (changes within the same document)
    const handleCustomEvent = () => {
      checkAuth();
    };
    window.addEventListener('localStorageChange', handleCustomEvent);

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChange', handleCustomEvent);
    };
  }, []);

  return (
    <Navbar>
      <NavbarBrand onClick={() => router.push('/')}>
        <p className="font-bold text-inherit hover:cursor-pointer">Medistore</p>
      </NavbarBrand>
      <NavbarContent className="sm:flex gap-4" justify="center">
        <NavbarItem isActive={true}>
          <Link color="primary" href="/cart" aria-current="page">
            Cart
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        {isAuthenticated ? (
          <NavbarItem>
            <Button color="danger" onClick={handleLogout} variant="flat">
              Logout
            </Button>
          </NavbarItem>
        ) : (
          <>
            <NavbarItem>
              <Button as={Link} color="primary" href="/register" variant="flat">
                Register
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button as={Link} color="primary" href="/login" variant="flat">
                Login
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
}
