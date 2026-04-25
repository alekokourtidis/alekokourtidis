import DesignMount from "../components/DesignMount";

export const metadata = {
  title: "Community — Aleko Tools",
  description: "Where users hang out, share, and break things together.",
};

export default function Page() {
  return (
    <DesignMount
      scripts={[
        "/design/shared.jsx",
        "/design/community.jsx",
      ]}
    />
  );
}
