import dynamic from "next/dynamic";

const ForceGraph3D = dynamic(() => import("./ForceGraph_3D.js"), {
  ssr: false
});

export default ForceGraph3D;
