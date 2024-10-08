import React, { Suspense } from 'react';
import NavigationBar from '../../../components/NavigationBar';
import TransactionList from './TransactionList';

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      <main className="container mx-auto px-12 py-8 flex-grow flex flex-col">
        <h1 className="font-bold text-2xl">Daftar Transaksi</h1>
        <Suspense fallback={<p>Loading...</p>}>
          <TransactionList />
        </Suspense>
      </main>
    </div>
  );
}
