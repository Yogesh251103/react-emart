import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import { countAtom } from "../../atoms/sampleAtom";

export default function AdminSidebar() {
  const [count,setCount] = useRecoilState(countAtom)
  return (
    <aside className="w-[30%] bg-amber-200 h-screen">
      <h3>Admin Panel</h3>
      <ul>
        <li>
          <h2>Count: {count}</h2>
          <button onClick={() => setCount(count + 1)}>Increment</button>
          <button onClick={() => setCount(count - 1)}>Decrement</button>
        </li>
        <li>
          <Link to="/admin/users">Manage Users</Link>
        </li>
      </ul>
    </aside>
  );
}
