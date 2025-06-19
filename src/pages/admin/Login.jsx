import { useNavigate } from "react-router-dom"

const Login = () => {
  const navigate = useNavigate();
  return (
    <div className='w-screen h-screen grid place-items-center'>
        ADMIN LOGIN
      <div className='border-2 border-black p-5 flex flex-col items-center justify-start'>
        Username:
        <input type="text" name="username" className="border"/>
        Password:
        <input type="password" name="password" className="border"/>
        <input type="submit" onClick={()=>navigate("/admin")}/>
      </div>
    </div>
  )
}

export default Login
