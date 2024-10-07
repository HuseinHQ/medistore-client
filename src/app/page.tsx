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
      <main className="my-10 container mx-auto px-12">
        <div className="gap-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
          {data?.data?.map((item, index) => (
            <Card
              className="group"
              shadow="sm"
              key={index}
              isPressable
              onPress={() => router.push('/items/' + item.id)}
            >
              <CardBody className="overflow-visible p-0">
                <Image
                  radius="lg"
                  width="100%"
                  alt={item.name}
                  className="w-full object-cover h-[140px] transition-transform duration-300 group-hover:scale-110"
                  src={item.imgUrl}
                />
              </CardBody>
              <CardFooter className="text-small">
                <div>
                  <p className="text-left">{item.name}</p>
                  <p className="text-left font-bold">{'Rp' + item.price}</p>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}
