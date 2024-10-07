'use client';

import React, { FormEvent } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Input, Button } from '@nextui-org/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Login() {
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const jsonData = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(apiUrl + 'user/login', {
        method: 'POST',
        body: JSON.stringify(jsonData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      localStorage.setItem('access_token', result.data.access_token);
      toast.success(result.message);
      router.push('/');
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        toast.error(error.message ?? 'Error');
      } else {
        toast.error('An error occurred');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6">
        <CardHeader className="flex justify-center pb-6">
          <h1 className="text-2xl font-bold">Login</h1>
        </CardHeader>
        <CardBody className="flex flex-col gap-6">
          <Input name="email" label="Email" placeholder="Enter your email" type="email" />
          <Input name="password" label="Password" placeholder="Enter your password" type="password" />
        </CardBody>
        <CardFooter className="flex flex-col items-center gap-4 pt-6">
          <Button type="submit" color="primary" className="w-full">
            Log In
          </Button>
          <div className="text-center text-sm">
            {"Don't have an account? "}
            <Link href="/register" color="primary" className="hover:text-primary">
              Register here
            </Link>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}
