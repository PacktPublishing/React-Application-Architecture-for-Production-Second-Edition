export type SeoProps = {
  title: string;
  description: string;
};

export function Seo({ title, description }: SeoProps) {
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
    </>
  );
}
