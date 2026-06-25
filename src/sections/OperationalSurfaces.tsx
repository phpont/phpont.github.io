import { useRevealOnView } from '../hooks/useRevealOnView';
import styles from './OperationalSurfaces.module.css';

export const OperationalSurfaces = () => {
  const { ref: sectionRef, isVisible } = useRevealOnView<HTMLDivElement>({
    threshold: 0.52,
  });

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${isVisible ? styles.visible : ''}`}
    >
      <div className={styles.inner}>
        <div className={styles.thesis}>
          <p>I move between</p>
          <p>building systems</p>
          <p>and breaking assumptions.</p>
        </div>

        <div className={styles.divider} aria-hidden="true" />

        <div className={styles.surfaceList}>
          <article className={styles.surfaceItem}>
            <h3>Fullstack Engineering</h3>
            <p>
              Production web systems across frontend, backend, authentication,
              data modeling, integrations, dashboards, and automation.
            </p>
          </article>

          <article className={styles.surfaceItem}>
            <h3>Offensive Security Research</h3>
            <p>
              Real application testing focused on access control flaws, business
              logic abuse, exposed APIs, weak assumptions, and exploitable behavior.
            </p>
          </article>

          <article className={styles.surfaceItem}>
            <h3>Hardening & Remediation</h3>
            <p>
              Findings translated into stronger boundaries, safer flows, clearer
              validation, better architecture, and systems that are easier to trust.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};
