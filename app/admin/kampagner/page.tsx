import Link from "next/link";
import CampaignBuilder from "@/components/admin/CampaignBuilder";
import { GrowthHeader, GrowthNav, GrowthPanel } from "@/components/admin/GrowthParts";
import styles from "@/components/admin/growth.module.css";
import { requireAdmin } from "@/lib/admin-auth";
import { models } from "@/lib/models";

export const dynamic = "force-dynamic";

export default async function CampaignPage() {
  await requireAdmin();
  return (
    <div className={styles.workspace}>
      <GrowthHeader
        title="Kampagnelinks"
        description="Giv hvert link en tydelig kilde, så du kan se, hvilke placeringer der sender besøg til Kestro."
      />
      <GrowthNav active="campaigns" />
      <GrowthPanel
        title="Ét link. Én kendt placering."
        description="Vælg en skabelon, navngiv kampagnen og kopiér linket. Der oprettes ingen annonce, og intet bliver offentliggjort automatisk."
      >
        <CampaignBuilder
          modelPaths={models.flatMap((model) => [
            `/modeller/${model.slug}`,
            `/en/models/${model.slug}`,
          ])}
        />
      </GrowthPanel>
      <div className={styles.panelGrid}>
        <GrowthPanel title="Brug samme kampagnenavn">
          <div className={styles.panelBody}>
            <p className={styles.sectionCopy}>
              Skift placeringen mellem fx bio og story, men behold kampagnenavnet. Så kan du
              sammenligne placeringerne i samme kampagne.
            </p>
            <Link href="/admin/trafik" className={styles.textLink}>
              Se kilder & kampagner →
            </Link>
          </div>
        </GrowthPanel>
        <GrowthPanel title="Søgeord kommer fra Google">
          <div className={styles.panelBody}>
            <p className={styles.sectionCopy}>
              Organiske søgninger ses i Search Console-rapporten. Et UTM-søgeord er kun det mærke,
              du selv har skrevet.
            </p>
            <Link href="/admin/seo" className={styles.textLink}>
              Åbn Google & SEO →
            </Link>
          </div>
        </GrowthPanel>
      </div>
      <noscript>
        <p className={styles.footerNote}>
          Linkbyggeren kræver JavaScript. De øvrige rapporter kan bruges uden.
        </p>
      </noscript>
    </div>
  );
}
