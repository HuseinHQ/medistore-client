'use client';

import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button } from '@nextui-org/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaShoppingCart } from 'react-icons/fa';

export default function NavigationBar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    window.dispatchEvent(new Event('localStorageChange'));
  };

  const handleGotoCart = () => {
    if (!localStorage.access_token) {
      toast.error('You need to login to access cart');
      router.push('/login');
    } else {
      router.push('/cart');
    }
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
      <NavbarContent className="sm:flex gap-4" justify="center"></NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hover:cursor-pointer">
          <FaShoppingCart
            size={20}
            className="hover:cursor-pointer"
            onClick={handleGotoCart}
            color="primary"
            aria-current="page"
          />
        </NavbarItem>
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
