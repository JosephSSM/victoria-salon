import { playfairDisplay, manrope } from "@/lib/fonts";
import { SERVICES } from "@/lib/data";
import { getServiciosActivos } from "@/lib/services";
import { BRAND } from "@/lib/theme";
import Reveal from "./Reveal";

export default async function Services() {
  const servicios = await getServiciosActivos();

  return (
    <section id="servicios" className="relative py-24" style={{ background: BRAND.ivory }}>
      <div className="mx-auto max-w-3xl px-6">
        <Reveal className="mb-14 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: BRAND.gold }}>
            Nuestra carta
          </p>
          <h2 className={`${playfairDisplay.className} text-3xl sm:text-4xl`} style={{ color: BRAND.ink }}>
            Servicios pensados a tu medida
          </h2>
        </Reveal>

        <div className="flex flex-col">
          {SERVICES.map((category, i) => {
            const Icon = category.icon;
            const items = servicios.filter((s) => s.categoria === category.key);
            if (items.length === 0) return null;

            return (
              <Reveal key={category.key} delay={i * 0.08}>
                <div
                  className={`flex flex-col gap-4 py-8 sm:flex-row sm:items-start sm:justify-between ${i > 0 ? "border-t" : ""}`}
                  style={{ borderColor: `${BRAND.ink}1a` }}
                >
                  <div className="flex items-start gap-4 sm:w-2/5">
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                      style={{ background: `${BRAND.gold}1a` }}
                    >
                      <Icon size={18} color={BRAND.gold} />
                    </div>
                    <div>
                      <h3 className={`${playfairDisplay.className} text-xl`} style={{ color: BRAND.ink }}>
                        {category.label}
                      </h3>
                      <p className={`${manrope.className} mt-1 text-sm opacity-55`} style={{ color: BRAND.ink }}>
                        {category.description}
                      </p>
                    </div>
                  </div>

                  <ul className={`${manrope.className} flex flex-wrap gap-x-2 gap-y-2 sm:w-1/2 sm:justify-end`}>
                    {items.map((s) => (
                      <li
                        key={s.id}
                        className="rounded-full border px-3 py-1.5 text-xs font-medium"
                        style={{ borderColor: `${BRAND.ink}1f`, color: BRAND.ink }}
                      >
                        {s.nombre} · {s.duracion_minutos} min · {s.precio_euros}€
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
