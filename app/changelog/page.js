import DesignMount from "../components/DesignMount";

export const metadata = {
  title: "Changelog — Aleko Tools",
  description: "Every tool I've shipped, in order.",
};

export default function Page() {
  return (
    <DesignMount
      scripts={[
        "/design/shared.jsx",
        "/design/changelog.jsx",
      ]}
    />
  );
}
