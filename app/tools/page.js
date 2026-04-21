import DesignMount from "../components/DesignMount";

export const metadata = { title: "Aleko Tools" };

export default function Page() {
  return (
    <DesignMount
      scripts={[
        "/design/shared.jsx",
        "/design/tools.jsx",
      ]}
    />
  );
}
