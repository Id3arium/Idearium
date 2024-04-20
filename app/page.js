"use client";
import ForceGraph3D from "@/components/graph/ForceGraph3DWrapper.js";

import { ClerkProvider, SignedIn, SignedOut, useUser, SignIn, SignOutButton} from "@clerk/nextjs";
import { dark } from "@clerk/themes";

import { SignedInPage } from "./SignedInPage";
export default function Home() {  
    return (
        <ClerkProvider>
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
                                    // colorText: "#FF0000",
                                    // colorTextSecondary: "#FF0000",
                                    colorWarning: "#FF0000",
                                },
                            }}
                        ></SignIn>
                    </div>
                </div>
            </SignedOut>
            <SignedIn>
                <SignedInPage />
            </SignedIn>
        </ClerkProvider>
    );
}

