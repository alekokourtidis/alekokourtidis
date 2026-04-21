import DesignMount from "./components/DesignMount";

export const metadata = {
  title: "Aleko Tools — small, sharp AI tools",
  description:
    "AI-powered tools built by a 17-year-old solo developer. Essays, studying, health, security, and more.",
};

export default function Home() {
  return (
    <DesignMount
      scripts={[
        "/design/shared.jsx",
        "/design/demos.jsx",
        "/design/app.jsx",
      ]}
    />
  );
}
