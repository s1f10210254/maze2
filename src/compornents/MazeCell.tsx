import styles from './MazeCell.module.css';

export const MazeCell = ({
  cell,
  isHuman,
  arrowRotation,
}: {
  cell: number;
  isHuman: boolean;
  arrowRotation: number;
}) => {
  return (
    <div className={styles.cell}>
      {cell === 1 && <div className={styles.pillar} />}
      {isHuman && (
        <div className={styles.position}>
          <div className={styles.arrow} style={{ transform: `rotate(${arrowRotation}deg)` }} />
        </div>
      )}
    </div>
  );
};

/* {isHuman && <div className={styles.start}>start</div>}
//       {!isHuman && cell !== 1 && <div className={styles.goal}>goal</div>} */
