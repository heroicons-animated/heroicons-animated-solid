import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { Header } from "~/components/header";
import { PackageNameProvider } from "~/providers/package-name";
import { ThemeProvider } from "~/providers/theme";
import "./global.css";

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
