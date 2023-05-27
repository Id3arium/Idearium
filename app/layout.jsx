'use client'
import './globals.css'
import ForceGraph3D from "@/components/ForceGraph3DWrapper.js";
import IdeaCompositionArea from "@/components/IdeaCompositionArea.js"

// export default function RootLayout({ children, } : { children: React.ReactNode }) {
export default function RootLayout({ children }) {
  return (
    <html lang="en">
        {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
        */}
        <head />
        <body >
            <ForceGraph3D id='ForceGraph3D'/>
            {children}
        </body>
    </html>
  )
}

			

