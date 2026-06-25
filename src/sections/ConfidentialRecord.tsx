import { useRevealOnView } from '../hooks/useRevealOnView';
import styles from './ConfidentialRecord.module.css';

export const ConfidentialRecord = () => {
  const { ref: sectionRef, isVisible } = useRevealOnView<HTMLDivElement>({
    threshold: 0.54,
  });

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${isVisible ? styles.visible : ''}`}
    >
      <div className={styles.inner}>
        <div className={styles.statement}>
          <header className={styles.header}>
            <h2>
              <span>Details protected</span>
              <span>by agreement.</span>
            </h2>
          </header>
          <p className={styles.lead}>
            Much of the work behind production systems and security reports cannot be
            shown publicly. Client systems, internal workflows, vulnerability details,
            and operational evidence remain protected by NDA, responsible disclosure,
            or private engagement boundaries.
          </p>
        </div>

        <div className={styles.recordRail}>
          <article className={styles.recordItem}>
            <span className={styles.index}>01</span>
            <div className={styles.recordCopy}>
              <h3>Production Scope</h3>
              <p>NDA-bound systems supporting high-volume business operations and business-critical workflows.</p>
            </div>
          </article>

          <article className={styles.recordItem}>
            <span className={styles.index}>02</span>
            <div className={styles.recordCopy}>
              <h3>Security Reports</h3>
              <p>Weaknesses documented and reported through authorized channels with reproducible evidence.</p>
            </div>
          </article>

          <article className={styles.recordItem}>
            <span className={styles.index}>03</span>
            <div className={styles.recordCopy}>
              <h3>Disclosure-Safe Research</h3>
              <p>Public material separated from private systems, clients, and vulnerable surfaces.</p>
            </div>
          </article>

          <article className={styles.recordItem}>
            <span className={styles.index}>04</span>
            <div className={styles.recordCopy}>
              <h3>Verification Tooling</h3>
              <p>Repeatable workflows for inspecting behavior, reproducing findings, and reducing ambiguity.</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};
