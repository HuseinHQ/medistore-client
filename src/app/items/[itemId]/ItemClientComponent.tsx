'use client';

import React, { useState } from 'react';
import NavigationBar from '../../../../components/NavigationBar';
import { useRouter } from 'next/navigation';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface Item {
  id: string;
  name: string;
  price: number;
  description: string;
  imgUrl: string;
}

export default function ItemClientComponent({ item }: { item: Item }) {
  const [count, setCount] = useState(1);
  const router = useRouter();

  const handleAddToCart = async () => {
    if (!localStorage.access_token) {
      alert('Please login to add items to cart');
      router.push('/login');
    }

    try {
      const response = await fetch(apiUrl + 'carts/' + item.id, {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + localStorage.access_token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: count }),
      });
    } catch (error) {}
  };

  const handleIncreaseCount = () => setCount(count + 1);

  const handleDecreaseCount = () => {
    if (count <= 1) return;
    setCount(count - 1);
  };

  return (
    <>
      <NavigationBar />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:flex-shrink-0">
              <img src={item.imgUrl} alt={item.name} className="h-48 w-full object-cover md:h-full md:w-48" />
            </div>
            <div className="p-8">
              <h1 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                {item.name}
              </h1>
              <p className="mt-2 text-3xl text-gray-500">${item.price.toFixed(2)}</p>
              <p className="mt-4 text-lg text-gray-500">{item.description}</p>

              <div className="flex items-center gap-2 rounded">
                <button onClick={handleDecreaseCount} className="py-1.5 px-2 shadow">
                  -
                </button>
                <div className="p-1.5 text-center">{count}</div>
                <button onClick={handleIncreaseCount} className="py-1.5 px-2 shadow">
                  +
                </button>

                <button
                  onClick={handleAddToCart}
                  className="ms-5 transition-all bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
