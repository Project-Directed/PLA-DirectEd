import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { axiosInstance } from '@/config/axiosInstnace'
import Cookies from 'js-cookie';
interface useTakeAssesmentResult {
    isLoading: boolean;
    error: string | null;
}

const useTakeAssesment = (): [
    useTakeAssesmentResult,
    (topic: string) => Promise<void>
] => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null)

    useEffect(() => {
        const storedToken = localStorage.getItem("app-user");
        if (storedToken) {
          try {
            const parsedData = JSON.parse(storedToken);
            const getToken = parsedData?.token || null;
            if (getToken) {
              setToken(getToken);
            } else {
              console.error("couldn't get token.");
            }
          } catch (error) {
            console.error("Error parsing data:", error);
          }
        } else {
          console.error("no token found");
        }
      }, []);
    //navigation from next
    const router = useRouter();
    //responsible for starting the assesment
    const takeAssesment = async (topic: string) => {
        setIsLoading(true);
        setError(null);
        const arrayToBeSent = [topic]
        try {
            // const token = localStorage.getItem('token');
            const body = {
                topics: arrayToBeSent,
                token: token
            }
            console.log(token)

            const response = await axiosInstance.post(`/api/assessment/create`, body);

            if (!response) {
                throw new Error('An error occurred. Please try again.');
            }
            //retrieves the data(assesment plans) from the api response
            const data = response.data;

            localStorage.setItem("user-plans", JSON.stringify(data.allUserPlans.plans));

            toast.success('Successfully started assesment!');
            router.push('/Plans');
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'An error occurred. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    }

    return [ {isLoading, error}, takeAssesment];
}

export default useTakeAssesment