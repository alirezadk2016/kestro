import { ReactNode } from "react";

export default function PageHeader({
  title,
  description,
}: {
  title: string;
  description: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-balance font-display text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-[1.03] tracking-display text-paper">
        {title}
      </h1>
      <p className="mt-6 max-w-2xl text-base leading-7 sm:leading-8 text-paper/65 sm:text-lg">{description}</p>
    </div>
  );
}
