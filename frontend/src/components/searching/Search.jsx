import React, { useState } from "react";
import { baseUrl } from "../../constant/url";
import { Link } from "react-router-dom";
import { LuSearch } from "react-icons/lu";
const Search = () => {
     
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);

    const handlesearch = async (e) => {
      const q = e.target.value;
      setQuery(q);

      if (q.trim() === "") {
        setResults([]);
        return;
      }

      try {
          const res = await fetch(`${baseUrl}/api/users/search?q=${q}`, {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          });
               const data = await res.json();
          setResults(data)
            console.log(data)
      } catch (error) {
        console.log(error);
        console.error("Error fetching  users");
      }
    }
  return (
    <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <p className="font-bold hidden sm:block "> Search</p>
        <div className="text-3xl shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-full w-10 p-1  ">
          <LuSearch />
        </div>
        <div>
          <input
            className="input border border-gray-700 rounded-3xl  input-md w-[320px] sm:w-[250px]  sm:mr-80 shadow-[0_3px_10px_rgb(0,0,0,0.2)] border-none focus:shadow-[0px_10px_1px_rgba(221,_221,_221,_1),_0_10px_20px_rgba(204,_204,_204,_1)]"
            type="text"
            placeholder="search username....."
            onChange={handlesearch}
            value={query}
          />
        </div>
      </div>
      <div>
        {results.map((user) => (
          <li key={user._id} className="list-none ">
            <Link to={`/profile/${user.username}`}>
              <div className="flex gap-2 items-center ml-18 md:ml-19 mt-5 shadow-[0_3px_10px_rgb(0,0,0,0.2)] max-w-75 sm:max-w-140 pl-4 p-3 rounded-2xl  ">
                <div className="avatar">
                  <div className="w-8 rounded-full">
                    <img src={user.profileImg || "/avatar-placeholder.png"} />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold tracking-tight truncate w-28">
                    {user.fullName}
                  </span>
                  <span className="text-sm text-slate-500">
                    @{user.username}
                  </span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </div>
    </div>
  );
};

export default Search;
