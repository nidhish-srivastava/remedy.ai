import { useEffect, useState } from "react"

const useFetchHook = (url) =>{
    const [data,setData] = useState(null)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    useEffect(()=>{
        const fetchData = async()=>{
        setLoading(true)
        try {
            const response = await fetch(url,{
                credentials : "include"
            });
            if(response.ok){
                const data = await response.json()
                setData(data.data)
                setLoading(false)
            }
        } catch (error) {
            setError(error);
            setLoading(false)
        }
        }
        fetchData();
    }, [url])
    
    return {data, loading, error}
}

export default useFetchHook;
