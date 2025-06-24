import { authAtom } from "../../atoms/sampleAtom";
import { useRecoilState } from "recoil";
import useAxios from "../../hooks/useAxios/useAxios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useSnackbar } from "../../contexts/SnackbarContexts";

function Login() {
  const navigate = useNavigate();
  const [auth, setAuth] = useRecoilState(authAtom);
  const { error, fetchData, loading } = useAxios();
  const showSnackBar = useSnackbar();

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

      if (!response || !response.accessToken) {
        showSnackBar("Login Failed, Invalid Credentials", "error");
        return;
      }

      const token = response.accessToken;
      const decodedToken = jwtDecode(token);

      if (decodedToken.role === "ROLE_ADMIN") {
        localStorage.setItem("adminToken", token);
        setAuth((prev) => ({
          ...prev,
          isLoggedIn: true,
          tokenAdmin: token,
        }));
        navigate("/admin");
        showSnackBar("You are logged in Admin", "success");
      } else {
        showSnackBar("Access Denied , Not an Admin", "error");
        setAuth((prev) => ({
          ...prev,
          userName: "",
          password: "",
        }));
      }
    } catch (err) {
      showSnackBar("Login failed due to network/server error", "error");
      console.error("Login error:", err);
      setAuth((prev) => ({
        ...prev,
        userName: "",
        password: "",
      }));
    }
  };

  return (
    <div className="flex bg-gradient-to-br from-brown to-dark-red w-full h-screen justify-center items-center">
      <div className="bg-grey w-[400px] p-6 rounded-2xl shadow-lg text-white">
        <h3 className="text-2xl text-dark-red font-black text-center mb-3">
          Emart Grocery Shop
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
            onChange={(e) =>
              setAuth((prev) => ({ ...prev, password: e.target.value }))
            }
            value={auth.password}
            required
            className="p-2 focus:outline-none rounded-md border-2 border-gray-300 focus:border-dark-red text-black placeholder-gray-500"
          />
          <button
            type="submit"
            disabled={loading}
            className={`bg-dark-red hover:bg-light-red focus:outline-none focus:border-light-red text-white cursor-pointer rounded-md font-semibold py-2 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login As Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
