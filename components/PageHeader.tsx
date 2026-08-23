import { ReactNode } from "react";

export default function PageHeader({ title, description }: { title: string; description: ReactNode }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
        {title}
      </h1>
      <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">{description}</p>
    </div>
  );
}
