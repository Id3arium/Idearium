import { Links, LiveReload, Meta, Outlet, Scripts } from "@remix-run/react";
import { ClerkApp } from "@clerk/remix";

export const meta = () => ({
  charset: "utf-8",
  title: "Idearium",
  viewport: "width=device-width,initial-scale=1",
});

function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default ClerkApp(App); 