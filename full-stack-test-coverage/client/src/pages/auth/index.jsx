import Background from "../../assets/new26.png";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { SIGNUP_ROUTE } from "@/lib/constants";
import apiClient from "@/lib/api-client";

const Auth = () => {
  // State variables for capturing user input and feedback messages
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async () => {
    try {
      // Sends the email and password to the signup route
      const response = await apiClient.post(
        SIGNUP_ROUTE,
        {
          email,
          password,
        },
        { withCredentials: true },
      );

      // If the server responds with status 201, update the message state to show success
      if (response.status === 201) {
        setMessage("Signup successful!");
      } else {
        // Explicitly handle the false branch
        setMessage("Signup did not succeed");
      }
    } catch (error) {
      setMessage("Signup failed. Please try again.");
      console.log(error);
    }
  };

  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center">
      <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
        <div className="flex flex-col gap-10 items-center justify-center">
          <div className="flex items-center justify-center flex-col">
            <div className="flex items-center justify-center">
              <h1 className="text-5xl md:text-6xl font-bold">Welcome</h1>
            </div>
          </div>
          <div className="flex items-center justify-center w-full ">
            <div className="w-3/4 flex flex-col gap-5">
              <Input
                placeholder="Email"
                type="email"
                className="rounded-full p-6"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="Password"
                type="password"
                className="rounded-full p-6"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Input
                placeholder="Confirm Password"
                type="password"
                className="rounded-full p-6"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button className="rounded-full p-6" onClick={handleSignup}>
                Signup
              </Button>
              {message && (
                <p className="text-center mt-4 font-semibold">{message}</p>
              )}
            </div>
          </div>
        </div>
        <div className="hidden xl:flex justify-center items-center ">
          <img src={Background} className="h-[500px] " />
        </div>
      </div>
    </div>
  );
};

export default Auth;
