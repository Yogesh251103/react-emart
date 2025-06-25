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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Outlet Inventory</h1>

      {loading ? (
        <Spin size="large" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stock.data?.map((item, index) => {
            const product = item.productDTO;
            const outlet = item.outletDTO;
            return (
              <div
                key={index}
                className="border-2 border-grey rounded-lg shadow-md p-4 flex flex-col items-center text-center"
              >
                <img
                  src={product.image || "/default-product.png"}
                  alt={product.name}
                  className="w-32 h-32 object-cover rounded-md mb-4"
                  onError={(e) => (e.target.src = "/default-product.png")}
                />
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-sm text-gray-600 italic">
                  {product.description}
                </p>
                <p className="mt-2 font-medium">
                  ₹{product.price.toFixed(2)} {product.currency}
                </p>
                <Barcode className="w-full h-fit" value={product.id} />
                <div className="mt-4 text-sm text-left w-full">
                  <p className="w-full flex justify-between items-center">
                    <strong>Category:</strong> {product.category}
                  </p>
                  <p className="w-full flex justify-between items-center">
                    <strong>Available stock:</strong> {item.quantity} Units
                  </p>
                  <p className="w-full flex justify-between items-center">
                    <strong>Outlet:</strong> {outlet.name}
                  </p>
                  <p className="w-full flex justify-between items-center">
                    <strong>Address:</strong> {outlet.address}
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
