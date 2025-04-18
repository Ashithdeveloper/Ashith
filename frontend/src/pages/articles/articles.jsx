import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { baseUrl } from "../../constant/url";
import { toast } from "react-hot-toast"; // Assuming you’re using react-toastify
import { useQueryClient } from "@tanstack/react-query"; // Assuming you're using React Query
import ArticlesList from "./articlesList";
import ArticleSearchResults from "./ArticleSearchResults";


const Articles = () => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [query, setQuery] = useState("");
 

  const queryClient = useQueryClient(); // Required for updating cache with new article

 const searcharticles = (e) =>{
     e.preventDefault(); 
 }
   
  const imageSubmit = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const addArticles = async () => {
    if (text && title && category) {
      try {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("category", category);
        formData.append("text", text);
        if (image) {
          formData.append("image", image);
        }

        const response = await fetch(`${baseUrl}/api/articles/create`, {
          method: "POST",
          credentials: "include",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to create post");
        }

        const newArticle = await response.json();

        // Clear inputs
        setImage(null);
        setText("");
        setTitle("");
        setCategory("");
        

        toast.success("Article created successfully");

        // Update React Query cache
        queryClient.setQueryData(["posts"], (oldPosts) => {
          if (!oldPosts) return [newArticle];
          return [newArticle, ...oldPosts];
        });
      } catch (error) {
        toast.error(error.message || "Failed to create post");
      }
    } else {
      toast.warn("Please fill in all fields");
    }
  };
  return (
    <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <p className="font-bold"> Articles</p>

        <form className="max-w-md mx-auto" onSubmit={searcharticles}>
          <label
            for="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Search
          </label>
          <div className="relative">
            <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                class="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="block w-full p-4 px-[90px] ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search title, category..."
              required
            />
            <button
              className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={() => {
                setQuery("");
              }}
            >
              {query.trim() !== "" ? "clear" : "Search"}
            </button>
          </div>
        </form>
      </div>
      <div>
        <button
          className="fixed bottom-19 right-5 sm:right-70 bg-blue-600 rounded-full p-4 text-white shadow-lg z-50"
          onClick={() => document.getElementById("my_modal_1").showModal()}
        >
          <FaPlus />
        </button>
        {query.trim() !== "" ? (
          <ArticleSearchResults query={query} />
        ) : (
          <ArticlesList />
        )}

        <dialog id="my_modal_1" className="modal">
          <div className="modal-box">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <input type="file" onChange={imageSubmit} />
            <h3 className="font-bold text-lg">Title</h3>
            <input
              type="text"
              className="flex-1 input border border-gray-700 rounded p-2 input-md"
              value={title}
              onClick={(e) => {
                // Reset the input so selecting the same file again still triggers onChange
                e.target.value = null;
              }}
              onChange={(e) => setTitle(e.target.value)}
            />
            <h3 className="font-bold text-lg">Category</h3>
            <input
              type="text"
              className="flex-1 input border border-gray-700 rounded p-2 input-md"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <h3 className="font-bold text-lg">Article content</h3>
            <textarea
              className="textarea w-full p-0 text-lg resize-none border border-gray-700 h-40"
              placeholder="What is happening?!"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <p className="py-4">Please add \n\n for breaking line Paragraph</p>
            <div className="modal-action">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn" onClick={addArticles}>
                  Add Article
                </button>
              </form>
            </div>
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default Articles;
