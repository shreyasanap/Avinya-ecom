import React, { useContext, useState } from "react";
import loginIcon from "../assets/login.png";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import SummaryApi from "../common";
import { toast } from 'react-toastify';
import Context from "../context";

const Login = () => {
  const [showPassword,setShowPassword] = useState(false)
  const [data,setData] = useState({
      email : "",
      password : ""
  })
  const navigate = useNavigate()
  const { fetchUserDetails, fetchUserAddToCart } = useContext(Context)

  const handleOnChange = (e) =>{
      const { name , value } = e.target

      setData((preve)=>{
          return{
              ...preve,
              [name] : value
          }
      })
  }


  const handleSubmit = async(e) =>{
      e.preventDefault()

      const dataResponse = await fetch(SummaryApi.signIn.url,{
          method : SummaryApi.signIn.method,
          credentials : 'include',
          headers : {
              "content-type" : "application/json"
          },
          body : JSON.stringify(data)
      })

      const dataApi = await dataResponse.json()

      if(dataApi.success){
          toast.success(dataApi.message)
          navigate('/')
          fetchUserDetails()
          fetchUserAddToCart()
      }

      if(dataApi.error){
          toast.error(dataApi.message)
      }

  }

  console.log("data login",data)
  return (
    <section id="login">
      <div className="mx-auto container p-5">
        <div className="bg-white p-4 w-full max-w-sm mx-auto">
          <div className="w-40 h-40 mx-auto">
            <img src={loginIcon} alt="" />
          </div>
          <form
            action=""
            className="flex flex-col gap-3"
            onSubmit={handleSubmit}
          >
            <div className="grid">
              <label htmlFor="" className="font-bold text-lg">
                Email :
              </label>
              <div className="bg-slate-200 p-2">
                <input
                  type="email"
                  placeholder="Enter Email"
                  name="email"
                  value={data.email}
                  onChange={handleOnChange}
                  className="w-full h-full outline-none bg-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="" className="font-bold text-lg">
                Password :{" "}
              </label>
              <div className="bg-slate-200 p-2 flex">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  value={data.password}
                  name="password"
                  onChange={handleOnChange}
                  className="w-full h-full outline-none bg-transparent"
                />
                <div
                  className="cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  <span>{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
                </div>
              </div>
              <Link
                to={"/forgot-password"}
                className="block mt-2 w-fit ml-auto hover:underline hover:text-blue-600"
              >
                Forgot Password
              </Link>
            </div>

            <button className="bg-blue-600 hover:bg-blue-800 mt-6  text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block">
              Login
            </button>
          </form>
          <p className="my-5">
            Don't have account?{" "}
            <Link
              to={"/sign-up"}
              className="text-red-600 hover:text-red-700 hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
