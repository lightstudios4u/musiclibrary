import React from "react";
import UploadPage from "../components/UploadFile";

function page() {
  return (
    <div
      style={{
        padding: "20px",
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <UploadPage refreshSongs={() => setRefresh((prev) => !prev)} />
    </div>
  );
}

export default page;
