import { useQuery } from "@tanstack/react-query";
import { FaHome, FaSearch, FaUser } from "react-icons/fa";
import { GrArticle } from "react-icons/gr";
import { IoNotifications } from "react-icons/io5";
import { Link } from "react-router-dom";

const BottomNavbar = () => {
   const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  return (
    <div className="fixed bottom-0 w-full bg-white text-black flex justify-around items-center py-3 z-50 sm:hidden shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)]">
      <Link
        to={`/`}
        className="flex flex-col items-center text-sm hover:text-blue-400"
      >
        <FaHome size={20} />
        Home
      </Link>
      <Link
        to={`/search`}
        className="flex flex-col items-center text-sm hover:text-blue-400"
      >
        <FaSearch size={20} />
        Search
      </Link>
      <Link
        to="/articles"
        className="flex flex-col items-center text-sm hover:text-blue-400"
      >
        <GrArticle size={20} />
        Article
      </Link>
      <Link
        to="/notifications"
        className="flex flex-col items-center text-sm hover:text-blue-400"
      >
        <IoNotifications size={20} />
        Notification
      </Link>
      <Link
        to={`/profile/${authUser?.username}`}
        className="flex flex-col items-center text-sm hover:text-blue-400 mr-6"
      >
        <FaUser size={20} />
        Profile
      </Link>
    </div>
  );
};

export default BottomNavbar;
