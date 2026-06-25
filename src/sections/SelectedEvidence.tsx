import { useRevealOnView } from '../hooks/useRevealOnView';
import styles from './SelectedEvidence.module.css';

export const SelectedEvidence = () => {
  const { ref: sectionRef, isVisible } = useRevealOnView<HTMLDivElement>({
    threshold: 0.52,
  });

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${isVisible ? styles.visible : ''}`}
    >
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2>
            <span>Systems that have</span>
            <span>met reality.</span>
          </h2>
        </header>

        <div className={styles.evidenceList}>
          <article className={styles.evidenceItem}>
            <span className={styles.index}>01</span>
            <h3>Production Systems</h3>
            <p>
              Operational software shaped around workflows, permissions, financial
              logic, integrations, inventory, HR, reporting, and automation.
            </p>
          </article>

          <article className={styles.evidenceItem}>
            <span className={styles.index}>02</span>
            <h3>Offensive Security Research</h3>
            <p>
              Authorized testing against real applications, focused on access
              control, exposed surfaces, business logic, recon, evidence, and
              responsible disclosure.
            </p>
          </article>

          <article className={styles.evidenceItem}>
            <span className={styles.index}>03</span>
            <h3>Validation & Automation</h3>
            <p>
              Scripts, probes, collectors, and local workflows built to turn
              complex behavior into something observable, repeatable, and verifiable.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

