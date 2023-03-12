import './globals.css'

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
            <div>Layout.jsx</div>
            {children}
        </body>
    </html>
  )
}

			

