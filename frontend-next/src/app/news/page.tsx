import { StubPage } from "@/components/stub-page";

export const metadata = { title: "Новости — EPL Zone" };

export default function NewsPage() {
  return (
    <StubPage
      title="Новости"
      note="Лента новостей с фильтром по тегам (трансферы, травмы, аналитика) появится после подключения Django CMS."
    />
  );
}
