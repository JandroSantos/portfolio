import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { CHARACTERS } from '@/data/characters';
import { PROJECTS, type Project } from '@/data/content';
import Section from './Section';

const builder = CHARACTERS[1];

export default function ProjectsSection() {
  return (
    <Section id="projects" character={builder} eyebrow="02 — Lo que construyo" title="Projects">
      <div className="relative mx-auto max-w-5xl">
        {PROJECTS.map((project, i) => (
          <ProjectCard key={project.number} project={project} index={i} total={PROJECTS.length} />
        ))}
      </div>
    </Section>
  );
}

function ProjectCard({
  project,
  index,
  total,
}: {
  project: Project;
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start start'],
  });

  // Cards behind shrink slightly so the stack reads as depth.
  const targetScale = 1 - (total - 1 - index) * 0.04;
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, targetScale]);

  return (
    <div
      ref={ref}
      className="sticky mb-6"
      style={{ top: `calc(14vh + ${index * 22}px)` }}
    >
      <motion.article
        style={{ scale }}
        className="overflow-hidden rounded-[28px] border p-6 sm:rounded-[40px] sm:p-9"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      >
        <div
          className="absolute inset-0 -z-10 rounded-[28px] sm:rounded-[40px]"
          style={{
            background: `color-mix(in srgb, ${builder.world.bg} 16%, #0c0c0c)`,
            border: `1.5px solid color-mix(in srgb, ${builder.world.bg} 40%, transparent)`,
          }}
        />
        {/* Top row */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4 sm:gap-6">
            <span
              className="font-display text-[clamp(3rem,9vw,7rem)] leading-none"
              style={{ color: builder.world.bg }}
            >
              {project.number}
            </span>
            <div className="pt-1 sm:pt-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-bone-dim">
                {project.category}
              </p>
              <h3 className="mt-1 font-display text-[clamp(1.4rem,4vw,2.6rem)] uppercase leading-tight text-bone">
                {project.name}
              </h3>
            </div>
          </div>

          <a
            href={project.href}
            data-cursor="hover"
            data-cursor-label="Ver"
            className="group flex h-12 w-12 shrink-0 items-center justify-center rounded-full border transition-colors sm:h-14 sm:w-14"
            style={{ borderColor: builder.world.bg, color: builder.world.bg }}
          >
            <ArrowUpRight
              size={22}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </div>

        {/* Description + stack */}
        <div className="mt-6 grid gap-5 sm:mt-8 sm:grid-cols-[1.6fr_1fr] sm:gap-8">
          <p className="text-balance text-base leading-relaxed text-bone-dim sm:text-lg">
            {project.description}
          </p>
          <div className="flex flex-wrap content-start gap-2">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-full px-3 py-1.5 font-mono text-xs uppercase tracking-wider"
                style={{
                  background: `color-mix(in srgb, ${builder.world.bg} 18%, transparent)`,
                  color: builder.world.panel,
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </motion.article>
    </div>
  );
}
