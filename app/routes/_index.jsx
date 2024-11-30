import { SignedIn, SignedOut, SignIn } from "@clerk/remix";
import { dark } from "@clerk/themes";
import ForceGraph3D from "~/components/graph/ForceGraph3DWrapper";
import { SignedInPage } from "~/components/SignedInPage";

export default function Index() {
  return (
    <>
      <SignedOut>
        <div className="relative w-screen h-screen">
          <ForceGraph3D id="ForceGraph3D" />
          <div className="absolute left-1/3 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <SignIn
              appearance={{
                baseTheme: dark,
                variables: {
                  colorPrimary: "#4000FF",
                  colorBackground: "#606060C0",
                  colorInputBackground: "#404040C0",
                  colorWarning: "#FF0000",
                },
              }}
            />
          </div>
        </div>
      </SignedOut>
      <SignedIn>
        <SignedInPage />
      </SignedIn>
    </>
  );
} 