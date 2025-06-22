import { authAtom } from "../../atoms/sampleAtom";
import { useRecoilState } from "recoil";
import useAxios from "../../hooks/useAxios/useAxios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Login() {
  const navigate = useNavigate();
  const [auth, setAuth] = useRecoilState(authAtom);
  const { error, fetchData, loading } = useAxios(); // pulling loading from the hook

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
        alert("Login failed: Invalid credentials");
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
        alert("Login successful as Admin");
      } else {
        alert("Access denied: Not an Admin");
        setAuth((prev)=>({
        ...prev,
        userName: "",
        password: ""
      }))
      }
    } catch (err) {
      alert(err?.message || "Login failed due to network/server error");
      console.error("Login error:", err);
      setAuth((prev)=>({
        ...prev,
        userName: "",
        password: ""
      }))
    }
  };

  return (
    <div className="flex bg-[#FF4C4B] w-full h-screen justify-center items-center">
      <div className="bg-[#EAEBED] w-[400px] p-6 rounded-2xl shadow-lg text-white">
        <h3 className="text-3xl font-bold text-center mb-4 text-black">
          Emart Grocery Shop
        </h3>
        <form className="flex flex-col space-y-4" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Enter Your Username"
            onChange={(e) =>
              setAuth((prev) => ({ ...prev, userName: e.target.value }))
            }
            value={auth.userName}
            required
            className="p-2 rounded-md border-2 border-gray-300 text-black placeholder-gray-500"
          />
          <input
            type="password"
            placeholder="Enter Your Password"
            onChange={(e) =>
              setAuth((prev) => ({ ...prev, password: e.target.value }))
            }
            value={auth.password}
            required
            className="p-2 rounded-md border-2 border-gray-300 text-black placeholder-gray-500"
          />
          <button
            type="submit"
            disabled={loading}
            className={`bg-white text-[#FF4C4B] font-semibold py-2 rounded-md transition ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"
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
