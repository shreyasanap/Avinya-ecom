import React, { useContext, useState } from "react";
import Logo from "./Logo";
import { GrSearch } from "react-icons/gr";
import { FaRegCircleUser } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import { setUserDetails } from "../store/userSlice";
import ROLE from "../common/role";
import Context from "../context";
import { MdKeyboardVoice } from "react-icons/md";



const Header = () => {
  const user = useSelector((state) => state?.user?.user);
  const dispatch = useDispatch();
  const [menuDisplay, setMenuDisplay] = useState(false);
  const context = useContext(Context);
  const navigate = useNavigate();
  const searchInput = useLocation();
  const URLSearch = new URLSearchParams(searchInput?.search);
  const searchQuery = URLSearch.getAll("q");
  const [search, setSearch] = useState(searchQuery);
  const [voiceSearchActive, setVoiceSearchActive] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const handleLogout = async () => {
    try {
      const fetchData = await fetch(SummaryApi.logout_user.url, {
        method: SummaryApi.logout_user.method,
        credentials: "include",
      });

      const data = await fetchData.json();

      if (data.success) {
        toast.success(data.message);
        dispatch(setUserDetails(null));
        navigate("/");
      }

      if (data.error) {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  const handleSearch = (value) => {
    setSearch(value);
  
    const categoriesToCheck = ["printer", "processor", "mobile","airpods","camera","earphones","refrigerator","trimmers"]; // Add the categories to check here
  
    // Check if the value contains any of the specified categories
    const categoryMatch = categoriesToCheck.find((category) =>
      value.toLowerCase().includes(category)
    );
  
    if (categoryMatch) {
      console.log(`Search includes '${categoryMatch}'`);
      navigate(`/search?q=${categoryMatch}`);
    } else if (value) {
      navigate(`/search?q=${value}`);
    } else {
      navigate("/search");
    }
  };
  

  const handleVoiceButtonClick = async () => {
    if (!voiceSearchActive) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        const chunks = [];
  
        recorder.addEventListener("dataavailable", (event) => {
          chunks.push(event.data);
        });
  
        recorder.addEventListener("stop", async () => {
          const blob = new Blob(chunks, { type: "audio/flac" });
          const reader = new FileReader();
  
          reader.onloadend = async () => {
            try {
              const base64Data = reader.result.split(",")[1];
  
              const raw = JSON.stringify({
                pipelineTasks: [
                  {
                    taskType: "asr",
                    config: {
                      language: { sourceLanguage: "gu" },
                      serviceId: "",
                      audioFormat: "flac",
                      samplingRate: 16000,
                    },
                  },
                  {
                    taskType: "translation",
                    config: {
                      language: { sourceLanguage: "gu", targetLanguage: "en" },
                      serviceId: "",
                    },
                  },
                ],
                inputData: { audio: [{ audioContent: base64Data }] },
              });
  
              console.log("Translation request:", raw);
  
              const response = await fetch(
                "https://dhruva-api.bhashini.gov.in/services/inference/pipeline",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: "yBpv8lLtPZh0CaJleMk2b8l0lzqAUVHSDdgx7rVNfYJn-6_wO9pv_YDqpOj2y5cx",
                  },
                  body: raw,
                }
              );
  
              if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to fetch data: ${response.status} ${response.statusText} - ${errorText}`);
              }
  
              const data = await response.json();
              console.log("Translation response:", data);
  
              const translatedText = data.pipelineResponse[1].output[0].target.toLowerCase();
  
              if(translatedText.includes("cart")){
                  navigate("/cart");

              }
              else {
                handleSearch(translatedText);
              }
            } catch (error) {
              console.error("Error processing translation:", error);
              toast.error("Failed to process translation");
            }
          };
  
          reader.readAsDataURL(blob);
        });
  
        recorder.start();
        setMediaRecorder(recorder);
        setVoiceSearchActive(true);
  
        setTimeout(() => {
          recorder.stop();
          setVoiceSearchActive(false);
        }, 5000); // Record for 5 seconds
      } catch (error) {
        console.error("Error recording voice:", error);
        toast.error("Failed to recognize voice");
      }
    } else {
      mediaRecorder.stop();
      setVoiceSearchActive(false);
    }
  };
  

  return (
    <>
    
    <header className="h-16 shadow-md bg-white fixed w-full z-40">
      <div className=" h-full container mx-auto flex items-center px-4 justify-between">
        <div className="">
          <Link to={"/"}>
            <Logo w={90} h={50} />
          </Link>
        </div>

        <div className="flex items-center">
          <MdKeyboardVoice
            className={`text-2xl text-black-500 cursor-pointer ${
              voiceSearchActive ? "active-mic" : ""
            }`}
            onClick={handleVoiceButtonClick}
          />
          <div className="flex items-center w-full max-w-lg border rounded-full focus-within:shadow pl-5">
            <input
              type="text"
              id="search-input"
              placeholder="Search here ......."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full outline-none"
              style={{ minWidth: "300px" }}
            />
            <div className="text-lg w-13 min-w-[50px] h-8 bg-blue-600 flex items-center justify-center rounded-r-full text-white">
              <GrSearch />
            </div>
            
          </div>
        </div>

        <div className="flex items-center gap-7">
          <div className="relative flex justify-center">
            {user?._id && (
              <div
                className="text-3xl cursor-pointer relative flex justify-center"
                onClick={() => setMenuDisplay((prev) => !prev)}
              >
                {user?.profilePic ? (
                  <img
                    src={user?.profilePic}
                    className="w-10 h-10 rounded-full"
                    alt={user?.name}
                  />
                ) : (
                  <FaRegCircleUser />
                )}
              </div>
            )}

            {menuDisplay && (
              <div className="absolute bg-white bottom-0 top-11 h-fit p-2 shadow-lg rounded">
                <nav>
                  {user?.role === ROLE.ADMIN && (
                    <Link
                      to={"/admin-panel/all-products"}
                      className="whitespace-nowrap hidden md:block hover:bg-slate-100 p-2"
                      onClick={() => setMenuDisplay((prev) => !prev)}
                    >
                      Admin Panel
                    </Link>
                  )}
                </nav>
              </div>
            )}
          </div>

          {user?._id && (
            <Link to={"/cart"} className="text-2xl relative">
              <span>
                <FaShoppingCart />
              </span>

              <div className="bg-blue-600 text-white w-5 h-5 rounded-full p-1 flex items-center justify-center absolute -top-2 -right-3">
                <p className="text-sm">{context?.cartProductCount}</p>
              </div>
            </Link>
          )}
          {/* {user?._id && (
            <Link to={"/spatial"} className="text-lg relative">
              <button>Metaverse</button>
            </Link>
          )}
          {user?._id && (
            <Link to={"/chatbot"} className="text-lg relative">
              <button className="bg-red-500 p-2 rounded-lg text-white">Chatbot</button>
            </Link>
          )}
           */}

          <div>
            {user?._id ? (
              <button
                onClick={handleLogout}
                className="px-3 py-1 rounded-full text-white bg-blue-600 hover:bg-blue-700"
              >
                Logout
              </button>
            ) : (
              <Link
                to={"/login"}
                className="px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
    </>
  );
};

export default Header;
