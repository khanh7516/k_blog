'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

interface CommentButtonProps {
  count: number;
}

export default function CommentButton({ count }: CommentButtonProps) {
  return (
    <button className="flex items-center hover:text-blue-500 transition">
      <MessageCircle className="w-5 h-5 mr-1" strokeWidth={1.8} />
      <span className="text-sm">{count}</span>
    </button>
  );
}
