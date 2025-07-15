'use client';

import React from 'react';
import { Heart } from 'lucide-react';

interface FavoriteButtonProps {
  count: number;
}

export default function FavoriteButton({ count }: FavoriteButtonProps) {
  return (
    <button className="flex items-center hover:text-pink-500 transition">
      <Heart className="w-5 h-5 mr-1" strokeWidth={1.8} />
      <span className="text-sm">{count}</span>
    </button>
  );
}
