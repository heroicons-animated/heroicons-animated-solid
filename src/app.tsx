import { Router } from "@solidjs/router";
import { clientOnly } from "@solidjs/start";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { PackageNameProvider } from "~/providers/package-name";
import { ThemeProvider } from "~/providers/theme";
import "./global.css";

const Header = clientOnly(() =>
  import("~/components/header").then((m) => ({ default: m.Header }))
);

export default function App() {
  return (
    <Router
      root={(props) => (
        <ThemeProvider>
          <PackageNameProvider>
            <Header />
            <Suspense>{props.children}</Suspense>
          </PackageNameProvider>
        </ThemeProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
