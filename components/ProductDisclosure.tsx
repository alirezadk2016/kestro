import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import Container from "./Container";

/** Keep secondary buying guidance available without turning browsing into an article. */
export default function ProductDisclosure({
  enabled,
  id,
  title,
  children,
}: {
  enabled: boolean;
  id: string;
  title: string;
  children: ReactNode;
}) {
  if (!enabled) return <>{children}</>;
  return (
    <section className="py-3">
      <Container>
        <details id={id} className="plate group/catalogue px-5 sm:px-7">
          <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 py-5 [&::-webkit-details-marker]:hidden">
            <h2 className="text-lg font-bold leading-7 text-paper sm:text-xl">{title}</h2>
            <ChevronDown
              aria-hidden="true"
              size={20}
              strokeWidth={2}
              className="flex-none text-brand-300 transition-transform group-open/catalogue:rotate-180 motion-reduce:transition-none"
            />
          </summary>
          <div className="border-t border-white/10 [&>section]:border-0 [&>section]:bg-transparent [&>section]:py-6 [&>section>div]:!max-w-none [&>section>div]:!px-0">
            {children}
          </div>
        </details>
      </Container>
    </section>
  );
}
