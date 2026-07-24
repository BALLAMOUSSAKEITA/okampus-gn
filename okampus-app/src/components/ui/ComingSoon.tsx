import Link from "next/link";
import PageShell from "@/components/ui/PageShell";
import PageHeader from "@/components/ui/PageHeader";

type ComingSoonProps = {
  eyebrow: string;
  title: string;
  description: string;
  backHref?: string;
  backLabel?: string;
};

export default function ComingSoon({
  eyebrow,
  title,
  description,
  backHref = "/",
  backLabel = "Retour a l'accueil",
}: ComingSoonProps) {
  return (
    <PageShell narrow>
      <PageHeader eyebrow={eyebrow} title={title} description={description} centered />

      <div className="card p-10 md:p-14 text-center">
        <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-[#ffdf3d] text-[#121117] mb-6">
          Bientot disponible
        </span>
        <p className="text-[#4d4c5c] leading-relaxed max-w-md mx-auto">
          Cette fonctionnalite est en cours de preparation. Reviens bientot pour en profiter sur
          BacheliO.
        </p>
        <Link href={backHref} className="btn-secondary inline-flex mt-8 bg-white">
          {backLabel}
        </Link>
      </div>
    </PageShell>
  );
}
