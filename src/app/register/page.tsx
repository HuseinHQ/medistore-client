'use client';

import React, { FormEvent } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Input, Button } from '@nextui-org/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Register() {
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const jsonData = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(apiUrl + 'user/register', {
        method: 'POST',
        body: JSON.stringify(jsonData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const result = await response.json();
        throw { errors: result.data, message: result.message };
      }

      // const result = await response.json();
      router.push('/login');
    } catch (error) {
      // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'error' implicitly has an 'any' type.
      toast.error(error.message ?? 'Error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6">
        <CardHeader className="flex justify-center pb-6">
          <h1 className="text-2xl font-bold">Register</h1>
        </CardHeader>
        <CardBody className="flex flex-col gap-6">
          <Input name="email" label="Email" placeholder="Enter your email" type="email" />
          <Input name="password" label="Password" placeholder="Enter your password" type="password" />
          <div className="flex gap-2">
            <Input name="firstName" label="First Name" placeholder="First name" type="text" />
            <Input name="lastName" label="Last Name" placeholder="Last name" type="text" />
          </div>
          <Input name="phoneNumber" label="Phone Number" placeholder="Enter your phone number" type="number" />
        </CardBody>
        <CardFooter className="flex flex-col items-center gap-4 pt-6">
          <Button type="submit" color="primary" className="w-full">
            Register
          </Button>
          <div className="text-center text-sm">
            {'Already have an account? '}
            <Link href="/login" color="primary" className="hover:text-primary">
              Login here
            </Link>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}
