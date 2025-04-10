import React, { useEffect, useState } from "react";
import { baseUrl } from "../../constant/url";
import cover from "../../assets/cover.png";
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";

const ArticlesReads = () => {
  const { id } = useParams();
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchdata = async () => {
      const res = await fetch(`${baseUrl}/api/articles/${id}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setResults(data);
    };
    fetchdata();
  }, []);


  return (
    <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <FaArrowLeft
          className="w-4 h-4"
          onClick={() => navigate("/articles")}
        />
        <p className="font-bold"> Articles</p>
      </div>
      <div className="   grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 shadow-[0px_10px_1px_rgba(221,_221,_221,_1),_0_10px_20px_rgba(204,_204,_204,_1)]  ">
        <div className=" flex justify-center items-center mt-8 ">
          <img
            src={results.img || cover}
            alt=""
            className=" w-90 sm:w-120 shadow-[0_3px_10px_rgb(0,0,0,0.2)] px-9 py-9 "
          />
        </div>
        <div
          className="  mt-5 
          ml-2 sm:ml-12 md:ml-15
          mr-3 sm:mr-10 md:mr-16 
          w-[95%] sm:w-[90%] md:w-[80%]
          pl-2
          pr-3 
          break-words 
          mb-5 
          shadow-[0_3px_10px_rgb(0,0,0,0.2)] "
        >
          <h2 className="text-3xl mt-2"> Title : {results.title}</h2>
          <h2 className="text-3xl mt-2"> category : {results.category}</h2>
          {results.text && (
            <div className="text-2xl mt-5 space-y-4 leading-relaxed ">
              {results.text
                .replace(/\\n/g, "\n")
                .split("\n\n")
                .map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticlesReads;
