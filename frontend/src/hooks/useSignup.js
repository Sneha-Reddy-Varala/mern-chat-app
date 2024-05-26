import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();
  const signup = async ({
    fullName,
    username,
    password,
    confirmPassword,
    gender,
  }) => {
    const success = handleInputErrors({
      fullName,
      username,
      password,
      confirmPassword,
      gender,
    });
    if (!success) return;
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          username,
          password,
          confirmPassword,
          gender,
        }),
      });
      const data = await res.json();
      console.log(data);
      if (data.error) {
        throw new Error(data.error);
      }
      //localerror
      localStorage.setItem("chat-user", JSON.stringify(data));
      //context
      setAuthUser(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return { loading, signup };
};

export default useSignup;

function handleInputErrors({
  fullName,
  username,
  password,
  confirmPassword,
  gender,
}) {
  const errors = [];
  if (!fullName) errors.push("Full name is required.");
  if (!username) errors.push("Username is required.");
  if (!password) errors.push("Password is required.");
  if (!confirmPassword) errors.push("Confirm password is required.");
  if (!gender) errors.push("Gender is required.");
  if (password && confirmPassword && password !== confirmPassword) {
    errors.push("Passwords do not match.");
  }
  if (password && password.length < 6) {
    errors.push("Password must be at least 6 characters.");
  }
  if (errors.length > 0) {
    errors.forEach((error) => toast.error(error));
    return false;
  }
  return true;
}
