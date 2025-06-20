// import Sidebar from "../../components/admin/SideBar"
import Tablee from "../../components/admin/Table"
const Home = () => {
  return (
    <div style={{
        display: "flex",
        justifyContent: "center", // horizontally center
        alignItems: "center",     // vertically center
        height: "100vh",          // fill the full screen
        backgroundColor: "#f5f5f5", // optional soft background
      }}>
      <div style={{ width: "80%", maxWidth: "1000px" }}>
      <Tablee/>
      </div>
      

    </div>
  )
}

export default Home
