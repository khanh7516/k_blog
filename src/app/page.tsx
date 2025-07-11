import PostFilter from "./components/post/PostFilter";
import PostList from "./components/post/PostList";

export default function Home() {
  return (
    <div className="flex gap-6 max-w-6xl mx-auto mt-8 px-4 pt-8">
      <div className="w-1/4 sticky top-16 h-fit">
        <PostFilter />
      </div>
      <div className="flex-1">
        <PostList />
      </div>
    </div>
  );
}