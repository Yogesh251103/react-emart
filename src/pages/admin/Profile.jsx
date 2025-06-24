import React from "react";
import { adminUserDetails } from "@/atoms/admin-profile";
import UserProfile from "@/components/UserProfile";
import { useRecoilState, useRecoilValue } from "recoil";
import { authAtom } from "@/atoms/sampleAtom";

function Profile() {
  const token = useRecoilValue(authAtom);
  const [user, setUser] = useRecoilState(adminUserDetails);

  return (
    <UserProfile
      title="Admin Profile"
      token={token.tokenAdmin}
      user={user}
      setUser={setUser}
    />
  );
}

export default Profile;
