import DesignMount from "../components/DesignMount";

export const metadata = {
  title: "Affiliates — Aleko Tools",
  description: "Earn a cut by promoting Aleko Tools.",
};

export default function Page() {
  return (
    <DesignMount
      scripts={[
        "/design/shared.jsx",
        "/design/affiliates.jsx",
      ]}
    />
  );
}
