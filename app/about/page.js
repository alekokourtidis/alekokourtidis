import DesignMount from "../components/DesignMount";

export const metadata = {
  title: "About — Aleko Tools",
  description:
    "I'm Aleko. I'm 17. I build small AI tools from my bedroom and people pay me for them.",
};

export default function Page() {
  return (
    <DesignMount
      scripts={[
        "/design/shared.jsx",
        "/design/about.jsx",
      ]}
    />
  );
}
