import { MazeCell } from '../compornents/MazeCell';
import { useGame } from '../hooks/useGame';
import styles from './index.module.css';

const Home = () => {
  const { maze, human, generationMazeBoard, moveHuman, setSearching, getArrowRotation } = useGame();

  return (
    <div className={styles.container}>
      <div className={styles.ti}>迷路ゲーム</div>
      <div className={styles.top}>
        <button className={styles.generationbu} onClick={generationMazeBoard}>
          生成
        </button>
        <button className={styles.humanbu} onClick={moveHuman}>
          探索
        </button>
        <button className={styles.flowbu} onClick={() => setSearching(true)}>
          auto探索
        </button>
        <div className={styles.space} />
      </div>
      <div className={styles.maze}>
        {maze.map((row, x) =>
          row.map((cell, y) => (
            <MazeCell
              key={`${x}-${y}`}
              cell={cell}
              isHuman={human.x === x && human.y === y}
              arrowRotation={getArrowRotation(human.front[0], human.front[1])}
              isStart={x === 0 && y === 0}
              isGoal={x === maze.length - 1 && y === maze[0].length - 1}
            />
          ))
        )}
      </div>
      <div className={styles.space} />
    </div>
  );
};

export default Home;
