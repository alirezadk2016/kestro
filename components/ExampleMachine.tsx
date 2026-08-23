import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Container from "./Container";
import { getModel } from "@/lib/models";

/*
 * A concrete machine on the front page. We do not hold stock, so this is
 * framed as an example of what we source — the point is to show what a
 * business-class laptop actually is, not to sell this one.
 */
const highlights = [
  "Erhvervsserie – ikke en forbrugermodel",
  "RAM og SSD kan skiftes",
  "Dansk eller norsk tastatur",
  "Windows installeret og klar",
];

export default function ExampleMachine() {
  const model = getModel("lenovo-thinkpad-t480");
  if (!model?.images) return null;

  const image = model.images[0];

  return (
    <section className="py-14 sm:py-20 lg:py-24">
      <Container>
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <Image
              src={image.src}
              alt={image.alt}
              width={1179}
              height={1115}
              className="h-full w-full object-contain p-4 sm:p-8"
              sizes="(max-width: 1024px) 92vw, 560px"
            />
          </div>

          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-brand-600">
              Et konkret eksempel
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {model.name}
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
              Sådan ser en typisk maskine ud, når vi skaffer bærbare til en virksomhed: en
              erhvervsmodel, der kan repareres og opgraderes, med nordisk tastatur og Windows
              installeret. Vi har den ikke på lager – vi finder den, når I har brug for den.
            </p>

            <ul className="mt-6 flex flex-wrap gap-2">
              {highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="rounded-full border border-slate-300 bg-white px-4 py-1.5 text-sm text-slate-700"
                >
                  {highlight}
                </li>
              ))}
            </ul>

            <Link
              href={`/modeller/${model.slug}`}
              className="mt-8 inline-flex min-h-[44px] items-center gap-2 text-base font-semibold text-brand-700 transition hover:text-brand-800"
            >
              Se specifikationer og flere billeder
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
