'use client';

import React, { useState } from 'react';
import NavigationBar from '../../../../components/NavigationBar';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Image from 'next/image';

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
      toast.error('Silakan login terlebih dahulu!');
      return router.push('/login');
    }

    try {
      const response = await fetch(apiUrl + 'carts/' + item.id, {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + localStorage.access_token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: count }),
      });

      toast.success((response as any).message ?? 'Barang berhasil ditambahkan');
    } catch (error: any) {
      console.log(error);
      toast.error(error.message ?? 'Error add to cart');
    }
  };

  const handleIncreaseCount = () => setCount(count + 1);

  const handleDecreaseCount = () => {
    if (count <= 1) return;
    setCount(count - 1);
  };

  return (
    <>
      <NavigationBar />
      <main className="container mx-auto px-12 py-8 flex gap-10 h-screen items-start">
        {/* <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:flex-shrink-0">
              <img src={item.imgUrl} alt={item.name} className="h-48 w-full object-cover md:h-full md:w-48" />
            </div>
            <div className="p-8">
              <h1 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                {item.name}
              </h1>
              <p className="mt-2 text-3xl text-gray-500">Rp {item.price}</p>
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
        </div> */}

        {/* BARU */}
        <div>
          <img src={item.imgUrl} alt={item.name} className="rounded-md w-[240px] xl:w-[348px]" />
        </div>

        <div className="flex-1">
          <h1 className="font-bold text-xl">{item.name}</h1>
          <h2 className="mt-2 font-bold text-3xl">{'Rp' + item.price}</h2>
          <div className="mt-5">
            <p className="text-primary font-semibold">Detail</p>
            <p>{item.description}</p>
          </div>
        </div>

        <div className="w-1/5 p-3 rounded-md border flex flex-col items-start">
          <p className="font-bold">Atur Jumlah</p>

          <div className="my-5 flex gap-2 border rounded-md px-1 py-1">
            <button
              disabled={count <= 1}
              className={`${count <= 1 ? 'hover:cursor-not-allowed' : 'hover:bg-slate-100'} px-2 rounded`}
              onClick={handleDecreaseCount}
            >
              -
            </button>
            <p className="px-1">{count}</p>
            <button className="hover:bg-slate-100 px-2 rounded" onClick={handleIncreaseCount}>
              +
            </button>
          </div>

          <button className="w-full bg-primary py-1 text-white rounded-md" onClick={handleAddToCart}>
            + Keranjang
          </button>
        </div>
      </main>
    </>
  );
}
