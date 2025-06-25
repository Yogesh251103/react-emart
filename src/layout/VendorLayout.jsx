import { Outlet } from "react-router-dom";
import VendorSidebar from "../components/vendor/Sidebar";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import useAxios from "@/hooks/useAxios/useAxios";
import { productsList } from "@/atoms/vendor-profile";

export default function VendorLayout() {
  const [products, setProducts] = useRecoilState(productsList);
  const { fetchData } = useAxios();
  const token = localStorage.getItem("vendorToken");

  const getAllProducts = async () => {
    try {
      const response = await fetchData({
        method: "GET",
        url: "/vendor/product",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response) {
        setProducts({
          loaded: true,
          data: response,
        });
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    if (!products.loaded) {
      getAllProducts();
    }
  }, [products]);

  return (
    <div className="w-screen flex overflow-x-hidden">
      <VendorSidebar />
      <main className="w-full h-screen overflow-y-scroll p-4">
        <Outlet />
      </main>
    </div>
  );
}
