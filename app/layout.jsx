'use client'
export default function RootLayout({ children }) {
  
  return (
    <html lang="en">
        {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
        */}
        <head />
        <body >
            {/* <React.Suspense fallback={<div>Loading 3D Graph...</div>}>
                <ForceGraph3D id='ForceGraph3D'/>
            </React.Suspense> */}
            {children}
        </body>
    </html>
  )
}

			

