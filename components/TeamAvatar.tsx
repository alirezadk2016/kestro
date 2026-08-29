import Image from "next/image";
import type { TeamMember } from "@/lib/company";
import type { Lang } from "@/lib/i18n";

/**
 * A person's picture, or a monogram until there is one worth showing.
 *
 * Three pages put a face next to a name, so the fallback lives here rather
 * than three times over. The monogram is the same mark as the one in the
 * header, which makes an empty slot read as a decision rather than a missing
 * file.
 */
export default function TeamAvatar({
  member,
  lang,
  size,
  className = "",
  rounded = "rounded-full",
  tone = "solid",
}: {
  member: TeamMember;
  lang: Lang;
  /** Rendered size in pixels. The image is requested at twice this. */
  size: number;
  className?: string;
  rounded?: string;
  /**
   * How loud the monogram is when there is no photograph yet. "solid" is a
   * filled brand tile, which is what a dark band needs to show anything at
   * all; "quiet" is a tint with the letters in brand, for light cards where
   * two filled squares would read as two colour swatches rather than two
   * people.
   */
  tone?: "solid" | "quiet";
}) {
  if (member.photo) {
    return (
      <Image
        src={member.photo}
        alt={`${member.name}, ${member.role[lang]}`}
        width={size * 2}
        height={size * 2}
        className={`flex-shrink-0 object-cover object-top ${rounded} ${className}`}
      />
    );
  }

  /* Initials of the name as it is written: two words give one letter each,
     one word gives its first two. "Ismail Masoumabadi" reads IM, not IS. */
  const parts = member.name.split(/\s+/).filter(Boolean);
  const monogram = (
    parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : member.name.slice(0, 2)
  ).toUpperCase();

  return (
    <span
      aria-hidden="true"
      style={{ fontSize: Math.round(size * 0.36) }}
      className={`flex flex-shrink-0 items-center justify-center font-display font-extrabold tracking-display ${
        tone === "quiet"
          ? "bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-200"
          : "bg-brand-600 text-white"
      } ${rounded} ${className}`}
    >
      {monogram}
    </span>
  );
}
