import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { PackageNameProvider } from "~/providers/package-name";
import { ThemeProvider } from "~/providers/theme";
import "./global.css";
import { Header } from "~/components/header";

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
