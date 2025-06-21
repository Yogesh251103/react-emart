import { authAtom } from "../../atoms/sampleAtom";
import { useRecoilState } from "recoil";
import useAxios from "../../hooks/useAxios/useAxios";
import { useNavigate } from "react-router-dom";
function Login() {
  const navigate = useNavigate();
  const [auth, setAuth] = useRecoilState(authAtom);
  const { error, fetchData } = useAxios();
  const handleLogin = async (e, role) => {
    e.preventDefault();
    const response = await fetchData({
      url: "/auth/login",
      method: "POST",
      data: {
        username: auth.userName,
        password: auth.password,
      },
    });
    console.log(response);
    if (response && response.accessToken) {
      const token = response.accessToken;

      if (role === "admin") {
        localStorage.setItem("adminToken", token);
        setAuth((prev) => ({
          ...prev,
          isLoggedIn: true,
          tokenAdmin: token,
        }));
        navigate("/admin")
      } else {
        localStorage.setItem("vendorToken", token);
        setAuth((prev) => ({
          ...prev,
          isLoggedIn: true,
          tokenVendor: token,
        }));
        navigate("/")
      }
      alert(`Login successful as ${role.toUpperCase()}`);
    } else if (error) {
      alert(error.message || "Login failed");
    }
  };
  return (
    <div className="flex bg-[#FF4C4B] w-full h-screen justify-center items-center ">
      <div className="bg-[#EAEBED] w-[400px] p-6 rounded-2xl shadow-lg text-white">
        <h3 className="text-3xl font-bold text-center mb-4 text-black">
          Emart Grocery Shop
        </h3>
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Enter Your Username"
            onChange={(e) =>
              setAuth((prev) => ({ ...prev, userName: e.target.value }))
            }
            required
            className="p-2 rounded-md border-2 border-gray-300 text-black placeholder-gray-500"
          />
          <input
            type="password"
            placeholder="Enter Your Password"
            onChange={(e) =>
              setAuth((prev) => ({ ...prev, password: e.target.value }))
            }
            required
            className="p-2 rounded-md border-2 border-gray-300 text-black placeholder-gray-500"
          />
          <button
            onClick={(e) => handleLogin(e,"admin")}
            className="bg-white text-[#FF4C4B] font-semibold py-2 rounded-md hover:bg-gray-200 transition"
          >
            Login As Admin
          </button>
          <button
            onClick={(e) => handleLogin(e,"vendor")}
            className="bg-white text-[#FF4C4B] font-semibold py-2 rounded-md hover:bg-gray-200 transition"
          >
            Login As Vendor
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
