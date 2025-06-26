import { authAtom } from "../../atoms/sampleAtom";
import { useRecoilState } from "recoil";
import useAxios from "../../hooks/useAxios/useAxios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../../contexts/SnackbarContexts";
function Login() {
  const navigate = useNavigate();
  const showSnackBar = useSnackbar();
  const [auth, setAuth] = useRecoilState(authAtom);
  const { error, fetchData } = useAxios();
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetchData({
        url: "/auth/login",
        method: "POST",
        data: {
          username: auth.userName,
          password: auth.password,
        },
      });
      console.log(response);
      if (!response || !response.accessToken) {
        showSnackBar("Login failed: Invalid credentials", "error");
        return;
      }
      const token = response.accessToken;
      const decodedToken = jwtDecode(token);
      if (decodedToken.role === "ROLE_VENDOR") {
        localStorage.setItem("vendorToken", token);
        setAuth((prev) => ({
          ...prev,
          isLoggedIn: true,
          tokenVendor: token,
        }));
        navigate("/");
        showSnackBar("Login successful as Vendor", "success");
      } else {
        showSnackBar("Access Denied: Not an Vendor", "error");
        setAuth((prev) => ({
          ...prev,
          userName: "",
          password: "",
        }));
      }
    } catch (err) {
      showSnackBar(
        err?.message || "Login Faled Due to network/server Error",
        "error"
      );
      console.error("Login Error", err);
      setAuth((prev) => ({
        ...prev,
        userName: "",
        password: "",
      }));
    }
  };
  return (
    <div className="flex bg-gradient-to-br from-brown to-dark-red w-full h-screen justify-center items-center ">
      <div className="bg-grey w-[400px] p-6 rounded-2xl shadow-lg text-white">
        <h3 className="text-2xl text-dark-red font-black text-center mb-3">
          E-Mart Grocery Shop
        </h3>
        <p className="text-black text-center mb-4">
          Welcome to E-Mart Inventory Management. Please login using your
          credentials
        </p>
        <form className="flex flex-col space-y-4" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Enter Your Username"
            onChange={(e) =>
              setAuth((prev) => ({ ...prev, userName: e.target.value }))
            }
            value={auth.userName}
            required
            className="p-2 focus:outline-none rounded-md border-2 border-gray-300 focus:border-dark-red text-black placeholder-gray-500"
          />
          <input
            type="password"
            placeholder="Enter Your Password"
            value={auth.password}
            onChange={(e) =>
              setAuth((prev) => ({ ...prev, password: e.target.value }))
            }
            required
            className="p-2 focus:outline-none rounded-md border-2 border-gray-300 focus:border-dark-red text-black placeholder-gray-500"
          />
          <button
            type="submit"
            className="bg-dark-red hover:bg-light-red focus:outline-none focus:border-light-red text-white cursor-pointer rounded-md font-semibold py-2 rounded-mdtransition"
          >
            Login As Vendor
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
