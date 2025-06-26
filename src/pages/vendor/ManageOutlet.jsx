import React from "react";
import OutletStock from "@/components/vendor/OutletStock";
import IncomingSupply from "@/components/vendor/IncomingSupply";

function ManageOutlet() {
  return (
    <div>
      <OutletStock />
      <IncomingSupply />
    </div>
  );
}

export default ManageOutlet;
