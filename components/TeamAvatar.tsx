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
}: {
  member: TeamMember;
  lang: Lang;
  /** Rendered size in pixels. The image is requested at twice this. */
  size: number;
  className?: string;
  rounded?: string;
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

  return (
    <span
      aria-hidden="true"
      style={{ fontSize: Math.round(size * 0.36) }}
      className={`flex flex-shrink-0 items-center justify-center bg-brand-600 font-display font-extrabold tracking-display text-white ${rounded} ${className}`}
    >
      {member.name.slice(0, 2).toUpperCase()}
    </span>
  );
}
