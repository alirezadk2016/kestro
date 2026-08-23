import { ReactNode } from "react";

export default function PageHeader({ title, description }: { title: string; description: ReactNode }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">{title}</h1>
      <p className="mt-4 text-lg leading-7 text-slate-600">{description}</p>
    </div>
  );
}
