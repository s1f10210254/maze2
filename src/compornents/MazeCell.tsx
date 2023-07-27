import styles from './MazeCell.module.css';

import { StartGoal } from './StartGoal';

export const MazeCell = ({
  cell,
  isHuman,
  arrowRotation,
  isStart,
  isGoal,
}: {
  cell: number;
  isHuman: boolean;
  arrowRotation: number;
  isStart: boolean;
  isGoal: boolean;
}) => {
  return (
    <div className={styles.cell}>
      {cell === 1 && <div className={styles.pillar} />}
      {isHuman && (
        <div className={styles.position}>
          <div className={styles.arrow} style={{ transform: `rotate(${arrowRotation}deg)` }} />
        </div>
      )}
      <StartGoal isStart={isStart} isGoal={isGoal} />
    </div>
  );
};
