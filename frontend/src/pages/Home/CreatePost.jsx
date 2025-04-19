import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { baseUrl } from "../../constant/url";

const CreatePost = () => {
  const [text, setText] = useState("");
  const [media, setMedia] = useState(null); // Renamed 'img' to 'media' to handle both image and video
  const mediaRef = useRef(null); // Ref for file input

  const { data: authUser, isLoading: authLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/api/auth/user`);
      if (!res.ok) throw new Error("Failed to fetch user data");
      return res.json();
    },
  });

  const queryClient = useQueryClient();

  const {
    mutate: createPost,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({ text, media }) => {
      const formData = new FormData();
      formData.append("text", text);
      if (media) formData.append("media", media); // Append media (image or video)

      const res = await fetch(`${baseUrl}/api/posts/create`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
    onSuccess: (newPost) => {
      setText("");
      setMedia(null);
      toast.success("Post created successfully");
      queryClient.setQueryData(["posts"], (oldPosts) => {
        if (!oldPosts) return [newPost];
        return [newPost, ...oldPosts];
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create post");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting Post:", { text, media });

    if (!text.trim() && !media) {
      toast.error("Post content cannot be empty!");
      return;
    }

    createPost({ text, media });
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    console.log("Selected File:", file);

    if (file) {
      setMedia(file);
      mediaRef.current.value = ""; // Reset the input file after selection
    }
  };

  const renderMediaPreview = () => {
    if (media) {
      const mediaUrl = URL.createObjectURL(media);
      const isVideo = media.type.startsWith("video/");

      if (isVideo) {
        return (
          <div className="relative w-72 mx-auto">
            <IoCloseSharp
              className="absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer"
              onClick={() => {
                setMedia(null);
                mediaRef.current.value = null;
              }}
            />
            <video
              src={mediaUrl}
              className="w-full mx-auto h-72 object-contain rounded"
              controls
              alt="Selected Video"
            />
          </div>
        );
      } else {
        return (
          <div className="relative w-72 mx-auto">
            <IoCloseSharp
              className="absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer"
              onClick={() => {
                setMedia(null);
                mediaRef.current.value = null;
              }}
            />
            <img
              src={mediaUrl}
              className="w-full mx-auto h-72 object-contain rounded"
              alt="Selected Image"
            />
          </div>
        );
      }
    }
  };

  return (
    <div className="flex p-4 items-start gap-4 border-b border-gray-700 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] mt-5 mx-2">
      <div className="avatar">
        <div className="w-8 rounded-full">
          {authLoading ? (
            <div className="skeleton w-8 h-8 rounded-full"></div>
          ) : (
            <img src={authUser?.profileImg || "/boy2.png"} alt="Profile" />
          )}
        </div>
      </div>
      <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
        <textarea
          className="textarea w-full p-0 text-lg resize-none border-none focus:outline-none border-gray-800"
          placeholder="What is happening?!"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {renderMediaPreview()}

        <div className="flex justify-between border-t py-2 border-t-gray-700 mr-13">
          <div className="flex gap-1 items-center">
            <CiImageOn
              className="fill-primary w-6 h-6 cursor-pointer"
              onClick={() => mediaRef.current.click()}
            />
            <BsEmojiSmileFill className="fill-primary w-5 h-5 cursor-pointer" />
          </div>
          <input
            type="file"
            accept="image/*,video/*" // Accept both images and videos
            hidden
            ref={mediaRef}
            onChange={handleMediaChange}
          />
          <button
            className="btn btn-primary rounded-full btn-sm text-white px-4"
            disabled={isPending}
          >
            {isPending ? "Posting..." : "Post"}
          </button>
        </div>

        {isError && <div className="text-red-500">{error.message}</div>}
      </form>
    </div>
  );
};

export default CreatePost;
