import { useRevealOnView } from '../hooks/useRevealOnView';
import styles from './ComplexityStatement.module.css';

export const ComplexityStatement = () => {
  const { ref: sectionRef, isVisible } = useRevealOnView<HTMLDivElement>({
    threshold: 0.50,
  });

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${isVisible ? styles.visible : ''}`}
    >
      <div className={styles.inner}>
        <blockquote className={styles.quoteBlock}>
          <span className={styles.quoteMark} aria-hidden="true">“</span>
          
          <div className={styles.quoteText}>
            <div className={styles.quoteLineWrapper}>
              <p className={styles.quoteLine}>Fools ignore complexity.</p>
            </div>
            <div className={styles.quoteLineWrapper}>
              <p className={styles.quoteLine}>Pragmatists suffer it.</p>
            </div>
            <div className={styles.quoteLineWrapper}>
              <p className={styles.quoteLine}>Some can avoid it.</p>
            </div>
            <div className={styles.quoteLineWrapper}>
              <p className={styles.quoteLine}>Geniuses remove it.</p>
            </div>
            <cite className={styles.author}>— Alan J. Perlis</cite>
          </div>
        </blockquote>

        <p className={styles.description}>
          <strong>Fullstack development</strong> and <strong>offensive security</strong> across the same surface: web applications built from frontend to backend, then tested against real systems to uncover weaknesses before they can be exploited.
        </p>
      </div>
    </section>
  );
};
