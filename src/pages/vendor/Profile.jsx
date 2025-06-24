import React from "react";
import { vendorUserDetails } from "@/atoms/vendor-profile";
import UserProfile from "@/components/UserProfile";
import { useRecoilState } from "recoil";

function Profile() {
  const token = localStorage.getItem("vendorToken");
  const [user, setUser] = useRecoilState(vendorUserDetails);

  return (
    <UserProfile
      title="Vendor Profile"
      token={token}
      user={user}
      setUser={setUser}
    />
  );
}

export default Profile;
