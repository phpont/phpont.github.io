import { useRevealOnView } from '../hooks/useRevealOnView';
import styles from './ContactSection.module.css';

export const ContactSection = () => {
  const { ref: sectionRef, isVisible } = useRevealOnView<HTMLDivElement>({
    threshold: 0.54,
  });

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${isVisible ? styles.visible : ''}`}
    >
      <div className={styles.inner}>
        <div className={styles.content}>
          <header className={styles.header}>
            <h2>
              <span>Available for</span>
              <span>selected work.</span>
            </h2>
          </header>
          <p className={styles.description}>
            Fullstack engineering, offensive security research, and technical work around systems that need to be built, tested, or understood under real constraints.
          </p>
          <nav aria-label="Contact links" className={styles.links}>
            <a href="mailto:paulohponta@gmail.com" className={styles.link}>
              Email
            </a>
            <a
              href="https://github.com/phpont"
              target="_blank"
              rel="noreferrer"
              className={styles.link}
            >
              GitHub
            </a>
            <a
              href="https://hackerone.com/gudangsolto"
              target="_blank"
              rel="noreferrer"
              className={styles.link}
            >
              HackerOne
            </a>
            <a
              href="https://www.linkedin.com/in/paulo-pontarolo/"
              target="_blank"
              rel="noreferrer"
              className={styles.link}
            >
              LinkedIn
            </a>
          </nav>
        </div>
      </div>
    </section>
  );
};
