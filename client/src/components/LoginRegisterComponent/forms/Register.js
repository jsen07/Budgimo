import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { registerMutation } from "../../../utils/mutations/mutations";
import HowToRegIcon from "@mui/icons-material/HowToReg";

const RegisterForm = ({ handleToggle }) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [err, setErr] = useState("");

  const [register, { loading }] = useMutation(registerMutation);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleRepeatPasswordChange = (e) => {
    setRepeatPassword(e.target.value);
  };

  const validateForm = () => {
    setErr("");

    for (const key in formData) {
      if (!formData[key].trim()) {
        switch (key) {
          case "email":
            setErr("E-mail is required!");
            break;
          case "first_name":
            setErr("First name is required!");
            break;
          case "last_name":
            setErr("Last name is required!");
            break;
          case "password":
            setErr("Password is required!");
            break;
          default:
            setErr("This field is required!");
        }
        return false;
      }
    }

    if (password !== repeatPassword) {
      setErr("Passwords do not match");
      return false;
    }

    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) {
      return;
    }
    try {
      const { data } = await register({
        variables: { userData: formData, password: password },
      });

      if (data && data.register) {
        handleToggle();
      }
    } catch (err) {
      console.log("Registration error:", err);

      if (err.graphQLErrors?.length > 0) {
        setErr(err.graphQLErrors[0].message);
      } else {
        setErr("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="w-full h-screen flex justify-start items-center flex-col  px-2 sm:pr-4 md:h-3/4 md:items-start md:pl-4 md:py-10 lg:pl-10 lg:pr-5">
      <h1 className="font-hero font-semibold text-[50px] tracking-wider mt-10 sm:pl-4 md:mt-2 md:mb-2 mb-5 text-teal-600">
        {" "}
        Budgimo{" "}
      </h1>
      <h1 className="font-sans font-semibold text-[34px] tracking-wide my-5 sm:pl-4">
        {" "}
        Register{" "}
      </h1>
      <h2 className="font-figtreen text-sm tracking-wide mb-10 sm:pl-4">
        {" "}
        Create your account. It's free and only takes a minute.{" "}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="border-box flex flex-col h-auto w-full sm:w-3/4 md:w-full md:items-end xl:w-full 2xl:w-2/3"
      >
        <div id="row-1" className="flex flex-row w-full p-2 mb-2">
          <div className="w-1/2 p-1 relative">
            {/* <h2 className='p-1'> First Name</h2> */}
            <label
              for="first_name"
              className="absolute top-[0px] left-[10px] bg-white px-2 text-xs"
            >
              {" "}
              First name
            </label>
            <input
              className="w-full mt-1 p-2 text-sm border-2 border-black placeholder-gray-500 placeholder-opacity-50 focus:outline-none focus:border-b-4 focus:border-teal-500 transition-all"
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
            />
          </div>
          <div className="w-1/2 p-1 relative">
            {/* <h2> Last Name</h2> */}
            <label
              for="last_name"
              className="absolute top-[0px] left-[10px] bg-white px-2 text-xs"
            >
              {" "}
              Last name{" "}
            </label>
            <input
              className="w-full mt-1 p-2 text-sm border-2 border-black placeholder-gray-500 placeholder-opacity-50 focus:outline-none focus:border-b-4 focus:border-teal-500 transition"
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
            />
          </div>
        </div>
        <div id="row-2" className="flex flex-col w-full p-2 mb-2">
          <div className="w-full p-1 mb-2 relative">
            <label
              for="email"
              className="absolute top-[0px] left-[10px] bg-white px-2 text-xs"
            >
              {" "}
              E-mail
            </label>
            <input
              className="w-full mt-1 p-2 text-sm border-2 border-black placeholder-gray-500 placeholder-opacity-50 focus:outline-none focus:border-b-4 focus:border-teal-500 transition"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="w-full p-1 mb-1 relative">
            <label
              for="password"
              className="absolute top-[0px] left-[10px] bg-white px-2 text-xs"
            >
              {" "}
              Password{" "}
            </label>
            <input
              className="w-full mt-1 p-2 text-sm border-2 border-black placeholder-gray-500 placeholder-opacity-50 focus:outline-none focus:border-b-4 focus:border-teal-500 transition"
              type="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>

          <div className="w-full p-1 mb-1 relative">
            <label
              for="Repeat-password"
              className="absolute top-[0px] left-[10px] bg-white px-2 text-xs"
            >
              Repeat password{" "}
            </label>
            <input
              className="w-full mt-1 p-2 text-sm border-2 border-black placeholder-gray-500 placeholder-opacity-50 focus:outline-none focus:border-b-4 focus:border-teal-500 transition"
              type="password"
              name="repeat-password"
              onChange={handleRepeatPasswordChange}
            />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center md:w-full  md:pl-4 md:flex-row gap-2 sm:flex-row">
          {err && <p className="text-red-600 md:self-center"> {err} </p>}
          <button
            type="submit"
            disabled={loading}
            className="border w-full px-3 py-2 mr-3 rounded-md bg-teal-400 text-black flex items-center justify-center ml-auto hover:scale-95 transition sm:max-w-[150px]"
          >
            <HowToRegIcon className="mr-1" />
            Register
          </button>
        </div>
      </form>

      <div className="flex flex-row w-2/3 items-center justify-center h-full md:w-full md:mt-10 md:mt-0 md:h-auto 2xl:w-2/3">
        <p className="mr-1 text-sm"> Already have an account?</p>
        <p
          onClick={() => handleToggle()}
          className="underline cursor-pointer text-sm hover:scale-95 transition hover:no-underline"
        >
          {" "}
          Login
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
