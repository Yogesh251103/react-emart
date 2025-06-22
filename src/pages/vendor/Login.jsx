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
    if (!response || !response.accessToken) {
      showSnackBar("Login failed: Invalid credentials",'error')
      return;
    }
    const token = response.accessToken;
    const decodedToken = jwtDecode(token);
    if(decodedToken.role === "ROLE_VENDOR"){
      localStorage.setItem("vendorToken",token)
      setAuth((prev)=>({
        ...prev,
        isLoggedIn:true,
        tokenVendor: token,
      }));
      navigate("/");
      showSnackBar("Login successful as Vendor",'success')
    }else{
      showSnackBar("Access Denied: Not an Vendor",'error')
      setAuth((prev)=>({
        ...prev,
        userName: "",
        password: ""
      }))
    }
  } catch (err){
    showSnackBar(err?.message || "Login Faled Due to network/server Error",'error');
    console.error("Login Error",err);
    setAuth((prev)=>({
        ...prev,
        userName: "",
        password: ""
      }))
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
            value={auth.userName}
            required
            className="p-2 rounded-md border-2 border-gray-300 text-black placeholder-gray-500"
          />
          <input
            type="password"
            placeholder="Enter Your Password"
            value={auth.password}
            onChange={(e) =>
              setAuth((prev) => ({ ...prev, password: e.target.value }))
            }
            required
            className="p-2 rounded-md border-2 border-gray-300 text-black placeholder-gray-500"
          />
          <button
            onClick={handleLogin}
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
