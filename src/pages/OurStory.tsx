import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart, Globe, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

export const OurStory = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-40 pb-32">
      {/* Hero Section - The Monolith */}
      <section className="min-h-[70vh] flex flex-col justify-center items-center text-center px-6">
        <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 mb-10"
            >
          <div className="h-[1px] w-8 bg-charcoal/30 dark:bg-bone/30" />
          <span className="text-[10px] font-black tracking-[0.5em] uppercase text-charcoal/50 dark:text-bone/50">
            Origins of Atmosphere
          </span>
          <div className="h-[1px] w-8 bg-charcoal/30 dark:bg-bone/30" />
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-7xl md:text-9xl font-display font-bold tracking-tighter uppercase leading-[0.85] mb-12"
        >
          Curating <br />
          <span className="italic font-light opacity-50">Presence.</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-xl text-lg font-light text-muted-foreground leading-relaxed italic"
        >
          MISEL began with a simple vision: to curate environments that don't just fill space, but tell a story of silence, light, and timeless weight.
        </motion.div>
      </section>

      {/* Narrative Section 1 - The Frame */}
      <section className="container px-6 mx-auto grid lg:grid-cols-12 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-7 relative aspect-[16/9] lg:aspect-[4/5] overflow-hidden"
        >
          <img 
            src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=2067&auto=format&fit=crop" 
            alt="Atmospheric Design" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 border-[20px] border-bone dark:border-charcoal pointer-events-none" />
        </motion.div>

        <div className="lg:col-span-5 space-y-10 lg:pl-12">
          <span className="text-[10px] font-black tracking-[0.4em] uppercase text-gold">The Studio</span>
          <h2 className="text-4xl md:text-5xl font-display font-medium tracking-tight uppercase leading-none">The Beginning of <br />a Dream</h2>
          
          <div className="space-y-6 font-light text-muted-foreground text-lg leading-relaxed">
            <p>
              In the heart of a small studio, MISEL was born from the belief that our surroundings should be an extension of our soul. We started with sketches, shadows, and light—a dream to redefine how we interact with our sanctuary.
            </p>
            <p>
              Every material was hand-selected, every form meticulously considered. We weren't just making objects; we were building a sanctuary for those who value the language of atmosphere over the noise of the ephemeral.
            </p>
          </div>
        </div>
      </section>

      {/* Values Grid - The Archive */}
      <section className="border-y border-charcoal/10 dark:border-bone/10 py-32 px-6">
        <div className="container mx-auto">
          <div className="mb-24 flex flex-col md:flex-row justify-between items-end gap-10">
            <h2 className="text-5xl md:text-7xl font-display font-bold tracking-tighter uppercase leading-[0.9]">
              Our Core <br /> <span className="italic font-light opacity-50">Archive</span>
            </h2>
            <p className="text-muted-foreground font-light max-w-sm italic">
              The values that guide every MISEL creation from concept to presence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-0">
            {[
              {
                icon: "01",
                title: "Passion for Atmosphere",
                desc: "We pour our heart into every detail, ensuring each piece is a masterpiece of modern composition."
              },
              {
                icon: "02",
                title: "Conscious Curation",
                desc: "Our commitment to the home is as strong as our commitment to aesthetic. We source sustainably."
              },
              {
                icon: "03",
                title: "Timeless Presence",
                desc: "MISEL pieces are designed to last lifetimes, becoming heirlooms of your personal environment."
              }
            ].map((v, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="p-16 border-b md:border-b-0 md:border-r border-charcoal/10 dark:border-bone/10 last:border-r-0 group hover:bg-charcoal/[0.02] dark:hover:bg-bone/[0.02] transition-all"
              >
                <div className="text-3xl font-display font-light mb-12 opacity-20 group-hover:opacity-100 transition-opacity">
                  {v.icon}
                </div>
                <h3 className="text-2xl font-display font-medium tracking-tight mb-6 uppercase">{v.title}</h3>
                <p className="text-muted-foreground leading-relaxed font-light">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Narrative Section 2 - The Legacy */}
      <section className="container px-6 mx-auto grid lg:grid-cols-2 gap-24 items-center">
        <div className="space-y-12 order-2 lg:order-1">
          <h2 className="text-5xl font-display font-bold tracking-tighter uppercase leading-[0.9]">The Modern <br /> <span className="italic font-light opacity-50">Sanctuary</span></h2>
          <div className="space-y-8 font-light text-muted-foreground text-lg leading-relaxed">
            <p>
              Today, MISEL stands as a beacon for intentional living. From the minimalist lofts of Tokyo to the sun-drenched villas of the Mediterranean, our pieces resonate with those who dare to live beautifully. 
            </p>
            <p>
              Experience MISEL not just as decor, but as a badge of tranquility, a statement of mindful living, and a tribute to the art of the atmosphere.
            </p>
          </div>
          <blockquote className="pl-10 border-l border-gold italic text-2xl text-foreground font-light leading-relaxed">
            "Your environment is your legacy. Make it calm, make it timeless, make it MISEL."
          </blockquote>
        </div>
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="order-1 lg:order-2 relative aspect-square overflow-hidden"
        >
          <img 
            src="https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=2039&auto=format&fit=crop" 
            alt="Interior Legacy" 
            className="w-full h-full object-cover"
          />
        </motion.div>
      </section>

      {/* Call to Action - Minimalist */}
      <section className="container px-6 mx-auto text-center py-40 border-t border-charcoal/10 dark:border-bone/10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-display font-bold tracking-tighter uppercase mb-16"
        >
          Join the <br /> <span className="italic font-light opacity-50">Presence</span>
        </motion.h2>
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <Button 
            className="rounded-none bg-charcoal text-bone dark:bg-bone dark:text-charcoal px-16 h-20 font-bold tracking-widest uppercase transition-all duration-300 hover:scale-110"
            onClick={() => window.location.href = '/shop'}
          >
            Shop Collection
          </Button>
        </motion.div>
      </section>
    </div>
  );
};
