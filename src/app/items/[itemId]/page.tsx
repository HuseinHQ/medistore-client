'use client';

import { useParams } from 'next/navigation';
import React from 'react';

export default function ItemDetail() {
  const { itemId } = useParams();
  return <p>{itemId}</p>;
}
