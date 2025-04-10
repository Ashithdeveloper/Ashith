import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { baseUrl } from "../../constant/url";
import { toast } from "react-hot-toast"; // Assuming you’re using react-toastify
import { useQueryClient } from "@tanstack/react-query"; // Assuming you're using React Query
import ArticlesList from "./articlesList";


const Articles = () => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");

  const queryClient = useQueryClient(); // Required for updating cache with new article

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
        <button
          className="btn bg-blue-600 rounded-full  "
          onClick={() => document.getElementById("my_modal_1").showModal()}
        >
          <FaPlus />
        </button>
      </div>
      <div>
        <ArticlesList />

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
