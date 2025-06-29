import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { outletStock } from "@/atoms/vendor-profile";
import useAxios from "@/hooks/useAxios/useAxios";
import { useSnackbar } from "@/contexts/SnackbarContexts";
import { Spin } from "antd";
import Barcode from "react-barcode";

function OutletStock() {
  const [stock, setStock] = useRecoilState(outletStock);
  const { fetchData, loading } = useAxios();
  const showSnackBar = useSnackbar();
  const token = localStorage.getItem("vendorToken");

  const fetchOutletStocks = async () => {
    try {
      const response = await fetchData({
        method: "GET",
        url: "/vendor/outlet/stock",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response) {
        setStock({
          loaded: true,
          data: response,
        });
      }
    } catch (err) {
      showSnackBar("Failed to fetch outlet stock", "error");
    }
  };

  useEffect(() => {
    if (!stock.loaded) {
      fetchOutletStocks();
    }
  }, [stock.loaded]);

 return (
  <div className="p-4 sm:p-6">
    <h1 className="text-xl sm:text-2xl font-bold text-[#8a0000] mb-6">
      Outlet Inventory
    </h1>

    {loading ? (
      <div className="flex justify-center items-center min-h-[200px]">
        <Spin size="large" />
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stock.data?.map((item, index) => {
          const product = item.productDTO;
          const outlet = item.outletDTO;
          return (
            <div
              key={index}
              className="border border-gray-300 rounded-lg shadow p-4 flex flex-col items-center text-center bg-white"
            >
              <img
                src={product.image || "/default-product.png"}
                alt={product.name}
                className="w-24 sm:w-32 h-24 sm:h-32 object-cover rounded-md mb-4"
                onError={(e) => (e.target.src = "/default-product.png")}
              />

              <h2 className="text-base sm:text-lg font-semibold">{product.name}</h2>
              <p className="text-sm text-gray-600 italic mt-1 line-clamp-2">
                {product.description}
              </p>

              <p className="mt-2 font-medium text-sm sm:text-base">
                ₹{product.price.toFixed(2)} {product.currency}
              </p>

              <div className="w-full mt-3">
                <Barcode value={product.id} className="mx-auto w-full max-w-xs" />
              </div>

              <div className="mt-4 text-sm text-left w-full space-y-1">
                <p className="flex justify-between">
                  <strong>Category:</strong> <span>{product.category}</span>
                </p>
                <p className="flex justify-between">
                  <strong>Stock:</strong> <span>{item.quantity} {product.unit.toUpperCase()}</span>
                </p>
                <p className="flex justify-between">
                  <strong>Outlet:</strong> <span>{outlet.name}</span>
                </p>
                <p className="flex flex-col sm:flex-row sm:justify-between">
                  <strong>Address:</strong>{" "}
                  <span className="text-gray-700 sm:text-right">{outlet.address}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

}

export default OutletStock;
