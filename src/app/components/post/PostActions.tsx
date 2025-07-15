'use client';

import React from 'react';
import FavoriteButton from './FavoriteButton';
import CommentButton from './CommentButton';

interface PostActionsProps {
  favoriteCount: number;
  commentCount: number;
}

export default function PostActions({ favoriteCount, commentCount }: PostActionsProps) {
  return (
    <div className="flex justify-end px-4 mt-1 mb-4 gap-6 text-gray-600">
      <FavoriteButton count={favoriteCount} />
      <CommentButton count={commentCount} />
    </div>
  );
}
