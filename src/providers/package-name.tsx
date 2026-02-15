import {
  createContext,
  createSignal,
  type ParentComponent,
  useContext,
} from "solid-js";
import { PACKAGE_MANAGER } from "~/constants";

type PackageManager = (typeof PACKAGE_MANAGER)[keyof typeof PACKAGE_MANAGER];

interface PackageNameContextType {
  packageName: () => PackageManager;
  setPackageName: (packageName: PackageManager) => void;
}

const PackageNameContext = createContext<PackageNameContextType>();

const PackageNameProvider: ParentComponent = (props) => {
  const [packageName, setPackageName] = createSignal<PackageManager>(
    PACKAGE_MANAGER.PNPM
  );

  return (
    <PackageNameContext.Provider value={{ packageName, setPackageName }}>
      {props.children}
    </PackageNameContext.Provider>
  );
};

const usePackageNameContext = () => {
  const ctx = useContext(PackageNameContext);
  if (!ctx) {
    throw new Error(
      "usePackageNameContext must be used within a PackageNameProvider"
    );
  }
  return ctx;
};

export { PackageNameProvider, usePackageNameContext };
