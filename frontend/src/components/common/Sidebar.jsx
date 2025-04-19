import XSvg from "../svgs/X";
import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { baseUrl } from "../../constant/url";
import { IoSearchSharp } from "react-icons/io5";

import { GrArticle } from "react-icons/gr";
const Sidebar = () => {
  const queryClient = useQueryClient();
  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`${baseUrl}/api/auth/logout`, {
          method: "POST",
          credentials: "include",
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Logged out successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: () => {
      toast.error("Logout failed");
    },
  });
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  return (
    <div className="md:flex-[2_2_0] w-18 max-w-60 ml-5 hidden sm:block ">
      <div className="sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full">
        <Link to="/" className="flex justify-center md:justify-start h-25   ">
          <div className=" mt-5 font-bold text-4xl ml-1.5   rounded-2xl hidden lg:block mr-4 ">
            <img
              src="/knowverse.png"
              alt="Knowverse"
              className="max-w-40 shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-3xl "
            />
          </div>
        </Link>
        <ul className="flex flex-col gap-3 mt-19  shadow-[0px_10px_1px_rgba(221,_221,_221,_1),_0_10px_20px_rgba(204,_204,_204,_1)] p-6 pr-6 rounded-2xl ml-5  mr-5 ">
          <li className="flex justify-center md:justify-start">
            <Link
              to="/"
              className="flex gap-3 items-center hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] transition-all rounded-b-box duration-300 py-2 pl-4 pr-4 max-w-fit cursor-pointer"
            >
              <MdHomeFilled className="w-10 h-10" />
              <span className="text-lg hidden md:block">Home</span>
            </Link>
          </li>
          <li className="flex justify-center md:justify-start">
            <Link
              to="/search"
              className="flex gap-3 items-center hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] transition-all rounded-b-box duration-300 py-2 pl-4 pr-4 max-w-fit cursor-pointer"
            >
              <IoSearchSharp className="w-10 h-10" />
              <span className="text-lg hidden md:block">Search</span>
            </Link>
          </li>

          <li className="flex justify-center md:justify-start">
            <Link
              to="/articles"
              className="flex gap-3 items-center hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] transition-all rounded-b-box duration-300 py-2 pl-4 pr-4 max-w-fit cursor-pointer"
            >
              <GrArticle className="w-10 h-10" />
              <span className="text-lg hidden md:block">Articles</span>
            </Link>
          </li>

          <li className="flex justify-center md:justify-start">
            <Link
              to="/notifications"
              className="flex gap-3 items-center hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] transition-all rounded-box duration-300 py-2 pl-4 pr-4 max-w-fit cursor-pointer"
            >
              <IoNotifications className="w-8 h-8" />
              <span className="text-lg hidden md:block">Notifications</span>
            </Link>
          </li>

          <li className="flex justify-center md:justify-start">
            <Link
              to={`/profile/${authUser?.username}`}
              className="flex gap-3 items-center hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] transition-all rounded-box duration-300 py-2 pl-4 pr-4 max-w-fit cursor-pointer"
            >
              <FaUser className="w-8 h-8" />
              <span className="text-lg hidden md:block">Profile</span>
            </Link>
          </li>
        </ul>
        {authUser && (
          <Link
            to={`/profile/${authUser.username}`}
            className="mt-auto mb-10 flex gap-2 items-start transition-all duration-300  py-2 px-4 rounded-full"
          >
            <div className="avatar hidden md:inline-flex ">
              <div className="w-10 rounded-3xl   ">
                <img src={authUser?.profileImg || "/boy2.png"} />
              </div>
            </div>
            <div className="flex justify-between flex-1 shadow-[0px_10px_1px_rgba(221,_221,_221,_1),_0_10px_20px_rgba(204,_204,_204,_1)] p-2 rounded-2xl  ">
              <div className="hidden md:block">
                <p className="text-black font-bold text-sm w-20 truncate">
                  {authUser?.fullName}
                </p>
                <p className="text-slate-500 text-sm ">@{authUser?.username}</p>
              </div>
              <BiLogOut
                className="w-5 h-5 cursor-pointer fill-black"
                onClick={(e) => {
                  e.preventDefault();
                  logout();
                }}
              />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};
export default Sidebar;
