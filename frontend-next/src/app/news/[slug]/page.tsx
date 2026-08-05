import { StubPage } from "@/components/stub-page";

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <StubPage
      title={`Статья: ${slug}`}
      note="Полный текст новости появится после подключения бэкенда."
    />
  );
}
