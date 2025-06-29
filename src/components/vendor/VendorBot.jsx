import { useSnackbar } from '@/contexts/SnackbarContexts';
import useAxios from '@/hooks/useAxios/useAxios';
import React, { useEffect, useState } from 'react';

function VendorBot() {
  const { fetchData } = useAxios();
  const showSnackbar = useSnackbar();
  const [insights, setInsights] = useState({
    data: [],
    loaded: false,
  });

  const token = localStorage.getItem("vendorToken");

  useEffect(() => {
    if (!insights.loaded) {
      fetchInsights();
    }
  }, [insights.loaded]); // added dependency to avoid infinite loop

  const fetchInsights = async () => {
    try {
      const insightsRes = await fetchData({
        method: "GET",
        url: "/vendor/outlet/sale/insights",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (insightsRes) {
        try {
          const groqRes = await fetchData({
            method: "POST",
            url: `${import.meta.env.VITE_APP_GROQ_API}/groq`,
            data: insightsRes,
          });

          if (groqRes?.suggestions) {
            console.log("Groq response", groqRes);
            setInsights({
              data: groqRes.suggestions,
              loaded: true,
            });
          }
        } catch (err) {
          showSnackbar(err?.message || "Error fetching groq response", "error");
        }
      }
    } catch (err) {
      showSnackbar(err?.message || "Error fetching insights", "error");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Smart Suggestions</h1>
      {insights.data.length === 0 ? (
        <p className="text-gray-500">No suggestions available at the moment.</p>
      ) : (
        insights.data.map((item, index) => (
          <div
            key={index}
            className="mb-6 p-4 border border-gray-200 rounded-lg shadow-sm"
          >
            <h2 className="text-lg font-semibold mb-2">
              🧃 Product: {item.productName}
            </h2>
            <p
              className="whitespace-pre-wrap text-gray-800"
              dangerouslySetInnerHTML={{
                __html: item.suggestion.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br />"),
              }}
            ></p>
          </div>
        ))
      )}
    </div>
  );
}

export default VendorBot;
