import {useState} from 'react'
import{useRouter} from 'next/navigation'
import {axiosInstance} from '@/config/axiosInstnace'
import {Question} from '@/components/Home/Quiz/Quiz'


interface handleLoad {
    isLoading:boolean;
    error: string | null;
}

const useAnalyseResult = (): [
    handleLoad, (question: Question[], id: string) => Promise<void>
] => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null);
    const router = useRouter()
    //hook for handling the logic of sending quiz responses for analysis    
    const analyseResult = async(question: Question[], id:string) => {
        setIsLoading(true)
        setError(null)
        try {//sends the questions array as user responses
            const body = {
                user_responses: question,
                _id: id
            }
            console.log("analyzing...")
            const response = await axiosInstance.post(`/api/assessment/analyze/${id}`, body)

            if(!response) {
                throw new Error('An error occurred. Please try again.')
            }
            console.log(response)
        } catch(err) {
            setError(err instanceof Error ? err.message : 'An error occured. Please try again')
        } finally {
            setIsLoading(false)
        }
    }
    return [{isLoading, error}, analyseResult]
}

export default useAnalyseResult