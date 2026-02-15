import {
  ColorModeProvider,
  cookieStorageManager,
  cookieStorageManagerSSR,
} from "@kobalte/core";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { getRequestEvent, isServer } from "solid-js/web";
import { PackageNameProvider } from "~/providers/package-name";
import "./global.css";
import { Header } from "~/components/header";

function getColorModeStorageManager() {
  if (isServer) {
    const cookie = getRequestEvent()?.request.headers.get("cookie") ?? "";
    return cookieStorageManagerSSR(cookie);
  }
  return cookieStorageManager;
}

export default function App() {
  return (
    <Router
      root={(props) => (
        <ColorModeProvider
          initialColorMode="system"
          storageManager={getColorModeStorageManager()}
        >
          <PackageNameProvider>
            <Header />
            <Suspense>{props.children}</Suspense>
          </PackageNameProvider>
        </ColorModeProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
