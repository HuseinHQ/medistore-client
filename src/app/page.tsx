'use client';

import React from 'react';
import NavigationBar from '../../components/NavigationBar';
import useFetch from '../../hooks/useFetch';
import { Card, CardBody, CardFooter, Image } from '@nextui-org/react';
import { Item } from '../../types/item';
import { useRouter } from 'next/navigation';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const { data } = useFetch<Item>(apiUrl + 'items');
  const router = useRouter();

  return (
    <>
      <NavigationBar />
      <main className="mt-10">
        <div className="container mx-auto gap-2 grid grid-cols-2 sm:grid-cols-4">
          {data?.data?.map((item, index) => (
            <Card shadow="sm" key={index} isPressable onPress={() => router.push('/items/' + item.id)}>
              <CardBody className="overflow-visible p-0">
                <Image
                  shadow="sm"
                  radius="lg"
                  width="100%"
                  alt={item.name}
                  className="w-full object-cover h-[140px]"
                  src={item.imgUrl}
                />
              </CardBody>
              <CardFooter className="text-small justify-between">
                <b>{item.name}</b>
                <p className="text-default-500">{item.price}</p>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}
