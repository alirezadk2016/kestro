import Image from "next/image";
import { Phone, Mail } from "lucide-react";
import Container from "./Container";
import { team, company } from "@/lib/company";

export default function TeamSection() {
  return (
    <section className="border-y border-slate-200 bg-slate-50 py-12 sm:py-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-brand-600">
            Kontaktpersoner
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Hvem I taler med
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Hos os taler I med et menneske – ikke et sagsnummer.
          </p>
        </div>

        <div
          className={`mx-auto mt-10 grid grid-cols-1 gap-6 sm:mt-12 ${
            team.length === 1 ? "max-w-2xl" : "max-w-4xl md:grid-cols-2"
          }`}
        >
          {team.map((member) => (
            <div
              key={member.name}
              className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:flex-row sm:items-start sm:p-8 sm:text-left"
            >
              <Image
                src={member.photo}
                alt={`${member.name}, ${member.role} hos Kestro`}
                width={320}
                height={320}
                className="mx-auto h-36 w-36 flex-shrink-0 rounded-2xl object-cover sm:mx-0 sm:h-40 sm:w-40"
              />

              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-slate-900">{member.name}</h3>
                <p className="text-sm font-medium text-brand-700">{member.role}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{member.bio}</p>

                <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center">
                  <a
                    href={`tel:${member.phoneHref}`}
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    <Phone className="h-4 w-4 flex-shrink-0" strokeWidth={2} />
                    {member.phoneDisplay}
                  </a>
                  <a
                    href={`mailto:${member.email ?? company.email}`}
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-white"
                  >
                    <Mail className="h-4 w-4 flex-shrink-0 text-slate-400" strokeWidth={2} />
                    Skriv til os
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
