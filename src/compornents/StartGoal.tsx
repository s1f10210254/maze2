import styles from './StartGoal.module.css';

export const StartGoal = ({ isStart, isGoal }: { isStart: boolean; isGoal: boolean }) => {
  return (
    <div>
      {isStart && (
        <div className={styles.start}>
          start
          <br />
          <br />
        </div>
      )}
      {isGoal && (
        <div className={styles.goal}>
          <br />
          goal
        </div>
      )}
    </div>
  );
};
