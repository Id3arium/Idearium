import { ClientOnly } from "remix-utils";
import { lazy, Suspense } from "react";

const ForceGraph3D = lazy(() => import("./ForceGraph_3D"));

export default function ForceGraph3DWrapper(props) {
  return (
    <ClientOnly fallback={<div>Loading 3D Graph...</div>}>
      {() => (
        <Suspense fallback={<div>Loading 3D Graph...</div>}>
          <ForceGraph3D {...props} />
        </Suspense>
      )}
    </ClientOnly>
  );
} 