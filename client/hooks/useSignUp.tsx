import { useState } from "react";
import { config } from "@/config/config";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import axios from "axios";

interface UseAuthResult {
  isLoading: boolean;
  error: string | null;
}

const useSignUp = (): [
  UseAuthResult,
  (full_name: string, phone_number:string, username:string,email: string, password: string) => Promise<void>
] => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const signUp = async (full_name: string, phone_number:string, username:string,email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const body = {
        full_name, 
        phone_number,
        username,
        email,
        password
      }

      const response = await axios.post(`api/auth/signup`, body, {
        withCredentials: true,

      });

      if (!response) {
        throw new Error("An error occurred. Please try again.");
      }
      // If the request is successful, the response data is stored in data
      const data = response.data;
      sessionStorage.setItem('app-user', data.token)
      // if (!response.ok) {
      //   throw new Error(data.error || "An error occurred. Please try again.");
      // }

      localStorage.setItem("app-user", JSON.stringify(data));
      
      console.log("signup success")
      toast.success("Successfully signed up!");
      router.push("/Courses");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return [{ isLoading, error }, signUp];
};

export default useSignUp;
