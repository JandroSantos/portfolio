import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { CHARACTERS } from '@/data/characters';
import { useLanguage } from '@/hooks/useLanguage';
import Section from './Section';

// Import project images
import mcpServerImg from '@/assets/projects/mcp_server.png';
import aiDashboardImg from '@/assets/projects/ai_dashboard.png';
import webExperienceImg from '@/assets/projects/web_experience.png';

const builder = CHARACTERS[1];
const PROJECT_IMAGES = [mcpServerImg, aiDashboardImg, webExperienceImg];

type ProjectItem = {
  number: string;
  name: string;
  category: string;
  description: string;
  stack: string[];
};

export default function ProjectsSection() {
  const { d } = useLanguage();
  const p = d.projects;

  return (
    <Section id="projects" character={builder} eyebrow={p.eyebrow} title={p.title} className="relative">
      {/* Background ambient light orb */}
      <div
        className="ambient-blur-orb -right-36 -top-36 h-96 w-96"
        style={{
          background: `radial-gradient(circle, ${builder.world.bg} 0%, transparent 70%)`,
          opacity: 0.15,
        }}
      />
      <div
        className="ambient-blur-orb -left-36 -bottom-36 h-96 w-96"
        style={{
          background: `radial-gradient(circle, ${builder.world.deep} 0%, transparent 70%)`,
          opacity: 0.1,
        }}
      />

      <div className="relative mx-auto max-w-5xl z-10">
        {p.items.map((project, i) => (
          <ProjectCard
            key={project.number}
            project={project}
            index={i}
            total={p.items.length}
            viewLabel={p.view}
            image={PROJECT_IMAGES[i] || mcpServerImg}
          />
        ))}
      </div>
    </Section>
  );
}

function ProjectCard({
  project,
  viewLabel,
  image,
}: {
  project: ProjectItem;
  index: number;
  total: number;
  viewLabel: string;
  image: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div ref={ref} className="mb-16 last:mb-0">
      <motion.article
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="glass-panel relative overflow-hidden rounded-[28px] p-6 sm:rounded-[40px] sm:p-9"
      >
        {/* Ambient glow inside the card matching active world color */}
        <div
          className="absolute inset-0 -z-10 rounded-[28px] sm:rounded-[40px] opacity-[0.08]"
          style={{
            background: `radial-gradient(100% 100% at 85% 0%, ${builder.world.bg} 0%, transparent 100%)`,
          }}
        />

        {/* Dynamic layout: Text columns + Visual mockups */}
        <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr] lg:gap-10 items-center">
          
          {/* Left Side: Info & Stack */}
          <div className="flex flex-col h-full justify-between gap-5">
            <div>
              <div className="flex items-start gap-4 sm:gap-6">
                <span
                  className="font-display text-[clamp(2.5rem,7vw,4.5rem)] leading-none transition-colors duration-700"
                  style={{ color: builder.world.bg }}
                >
                  {project.number}
                </span>
                <div className="pt-0.5 sm:pt-2">
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone-dim">
                    {project.category}
                  </p>
                  <h3 className="mt-1 font-display text-[clamp(1.3rem,3.5vw,2.2rem)] uppercase leading-tight text-bone">
                    {project.name}
                  </h3>
                </div>
              </div>

              <p className="mt-5 text-balance text-sm leading-relaxed text-bone-dim sm:text-[15px]">
                {project.description}
              </p>
            </div>

            {/* Stack Tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors duration-700"
                  style={{
                    background: `color-mix(in srgb, ${builder.world.bg} 15%, transparent)`,
                    color: builder.world.panel,
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Right Side: Mockup Image Container with Zoom effect */}
          <div className="relative group/mockup overflow-hidden rounded-2xl border border-white/5 bg-black/30 aspect-[16/10] flex items-center justify-center">
            {/* Soft backdrop glow inside the mockup frame */}
            <div
              className="absolute left-1/2 top-1/2 -z-10 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[40px] opacity-[0.15]"
              style={{ background: builder.world.bg }}
            />
            <img
              src={image}
              alt={project.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/mockup:scale-105"
              loading="lazy"
            />
            
            {/* Floating button */}
            <a
              href="#"
              data-cursor="hover"
              data-cursor-label={viewLabel}
              className="absolute bottom-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border bg-black/60 backdrop-blur-md transition-all duration-300 hover:scale-110"
              style={{ borderColor: builder.world.bg, color: builder.world.bg }}
            >
              <ArrowUpRight size={18} />
            </a>
          </div>
          
        </div>
      </motion.article>
    </div>
  );
}

