import { useSnackbar } from '@/contexts/SnackbarContexts';
import useAxios from '@/hooks/useAxios/useAxios'
import React, { useEffect, useState } from 'react'

function VendorBot() {
  const { fetchData} = useAxios();
  const showSnackbar = useSnackbar();
  const [insights,setInsights] = useState([])
  const token = localStorage.getItem("vendorToken")
  useEffect(()=>{
    
  })
  const fetchInsights = async ()=> {
    try {
      const insightsRes = await fetchData({
        method: "GET",
        url: "/vendor/outlet/sale/insights",
        headers: {
          Authorization : `Bearer ${token}`
        }
      })
      if (insightsRes){
        console.log(insightsRes)
        // setInsightData(insightsRes)
        try {
          console.log("Fetched Data",insightsRes)
          const groqRes = await fetchData({
            method: "POST",
            url: `${import.meta.env.VITE_APP_GROQ_API}/groq`,
            data: insightsRes 
          })
          if(groqRes){
            console.log("Groq response",groqRes);
            setInsights(groqRes)
          }
        }
        catch(err){
          showSnackbar(err?.message || "Error fetching groq response",'error')
        }
      }
    } 
    catch (err) {
      showSnackbar(err?.message || "Error fetching insights", 'error')
    }
  }
  return (
    <div> 
      <button onClick={fetchInsights}>
        fetch insights
      </button>
    </div>
  )
}
export default VendorBot
