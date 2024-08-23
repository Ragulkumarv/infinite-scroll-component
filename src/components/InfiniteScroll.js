import { useCallback, useEffect, useRef, useState } from "react";
import { API_Options, TMDB_IMG_Path } from "../utils/constants";

const InfiniteScroll = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);

  const fetchPosts = useCallback(async (page) => {
    const url = await fetch(
      `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page} +
      &region=IN`,
      API_Options
    );

    const resp = await url.json();

    const newPosts = resp?.results;

    setPosts((prev) => [...prev, ...newPosts]);

    if (newPosts?.length < 20) {
      setHasMore(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(page);
  }, [page, fetchPosts]);

  const handleObserver = (entries) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };

    const observer = new IntersectionObserver(handleObserver, options);

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [hasMore]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((item) => (
          <section
            key={item.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <img
              src={TMDB_IMG_Path + item.poster_path}
              alt={`${item.original_title} Poster`}
              className="w-full h-60 object-fill transform transition-transform duration-300 hover:scale-105 hover:cursor-pointer"
              loading="lazy"
            />
            <div className="p-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {item.original_title}
              </h2>
              <p className="text-sm text-gray-600 mt-1">{item.release_date}</p>
              <p className="mt-2 text-gray-700 line-clamp-3">{item.overview}</p>
            </div>
          </section>
        ))}
      </div>
      {hasMore && (
        <div
          ref={loader}
          className="text-center py-4 text-gray-600 animate-pulse"
        >
          Loading...
        </div>
      )}
    </div>
  );
};

export default InfiniteScroll;
