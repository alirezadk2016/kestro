import Link from "next/link";
import Container from "./Container";

const navLinks = [
  { href: "/", label: "Forside" },
  { href: "/ydelser", label: "Ydelser" },
  { href: "/om-os", label: "Om os" },
  { href: "/kontakt", label: "Kontakt" },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <Container className="py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-600 text-sm">K</span>
              Kestro
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
              Kestro klargør renoveret erhvervshardware fra Sydeuropa til det nordiske marked og leverer
              kvalitetstestede computere til danske og norske virksomheder.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Navigation</h3>
            <ul className="mt-4 space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Kontakt</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
              <li>
                <a href="mailto:info@kestro.dk" className="transition hover:text-white">
                  info@kestro.dk
                </a>
              </li>
              <li>Danmark &amp; Norge</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-6 text-sm text-slate-500 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Kestro. Alle rettigheder forbeholdes.</p>
          <p>CVR: XXXXXXXX</p>
        </div>
      </Container>
    </footer>
  );
}
