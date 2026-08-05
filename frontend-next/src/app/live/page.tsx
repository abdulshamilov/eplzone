import { StubPage } from "@/components/stub-page";

export const metadata = { title: "Live — EPL Zone" };

export default function LivePage() {
  return (
    <StubPage
      title="Live-матчи"
      note="Здесь появятся текущие матчи с live-счётом и событиями через WebSocket, как только будет готов бэкенд."
    />
  );
}
