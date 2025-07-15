import React from 'react';
import { Post } from '../../../types/post';
import { getCategoryColor } from '@/lib/utils';
import PostActions from './PostActions';

interface PostCardProps {
  post: Post;
  isLast?: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function PostCard({ post, isLast = false, isExpanded, onToggle }: PostCardProps) {
  return (
    <>
      <div className="p-4 rounded-lg hover:bg-gray-50 transition duration-300">
        <h2 className="text-xl font-semibold text-yellow-600">{post.title}</h2>

        <span className={`${getCategoryColor(post.category.name)} text-white text-sm px-2 py-0.5 rounded-full`}>
          #{post.category.name}
        </span>

        <div className="mt-2 text-sm text-gray-500">
          <span>By: {post.author.name}</span> ·{' '}
          <span>
            {new Date(post.createdAt).toLocaleString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}
          </span>
        </div>

        <p
          className={`text-gray-700 mt-2 transition-all duration-300 ${
            isExpanded ? '' : 'line-clamp-8'
          }`}
        >
          {post.content}
        </p>
        <button
          onClick={onToggle}
          className="text-sm text-blue-600 hover:underline mt-2 cursor-pointer"
        >
          {isExpanded ? 'Collapse' : 'Read more'}
        </button>

      </div>
      {!isLast && <hr className="border-gray-300 opacity-50 my-4" />}
      <PostActions
        favoriteCount={post.favoritesCount}
        commentCount={post.commentsCount}
      />
    </>
  );
}
