import { useCallback, useEffect, useState } from 'react';
import styles from './index.module.css';

const Home = () => {
  const initialMaze = Array.from({ length: 31 }, () => Array(31).fill(0));
  const [maze, setMaze] = useState<number[][]>(initialMaze);

  const initialHuman = {
    x: 0,
    y: 0,
    front: [1, 0],
  };
  const [human, setHuman] = useState(initialHuman);

  const directions = [
    //上右下左
    [0, 1], //下
    [1, 0], //右
    [0, -1], //上
    [-1, 0], //左
  ];

  const mazeGeneration_Odd = () => {
    // setMaze(initialMaze);
    const startCells: number[][] = [];

    for (let x = 0; x < maze.length; x++) {
      for (let y = 0; y < maze[x].length; y++) {
        if (x % 2 === 1 && y % 2 === 1) {
          startCells.push([y, x]);
        }
      }
    }
    console.log('xy座標奇数マスを1にする↓');
    console.table(maze);
    return startCells;
  };

  const generation = () => {
    // const updatedMaze = JSON.parse(JSON.stringify(initialMaze));
    const startCells = mazeGeneration_Odd();

    const updatedMaze = JSON.parse(JSON.stringify(initialMaze));

    for (const startCell of startCells) {
      const [y, x] = startCell;

      // ランダムな方向を選択
      const randomDirectionIndex = Math.floor(Math.random() * 4);
      const randomDirection = directions[randomDirectionIndex];
      const [dy, dx] = randomDirection;
      // 選択した方向のセルが迷路の範囲内であれば、そのセルの値を1に変更
      const newX = x + dx;
      const newY = y + dy;
      updatedMaze[newY][newX] = 1;
      updatedMaze[y][x] = 1;
    }

    setMaze(updatedMaze);
    setHuman(initialHuman);
    setSearching(false);

    console.log('迷路盤↓');
    console.table(maze);
    console.log('front');
    console.log(human);
  };
  // 新しい関数：次の座標を計算する関数
  const calculateNextLeftPosition = (x: number, y: number, front: number[]) => {
    const [dx, dy] = front;
    let newFront = [0, 0];
    let newX = x;
    let newY = y;

    // 現在の向きを左に90度変更
    if (dx === 1) {
      newFront = [dy, dx];
    } else if (dy === 1) {
      newFront = [-dy, dx];
    } else if (dx === -1) {
      newFront = [dy, dx];
    } else if (dy === -1) {
      newFront = [-dy, dx];
    }

    // 新しい座標を計算
    newX = x + newFront[0];
    newY = y + newFront[1];

    return { newX, newY, newFront };
  };

  // LeftMove 関数
  const LeftMove = useCallback(() => {
    const { x, y, front } = human;
    const { newX, newY, newFront } = calculateNextLeftPosition(x, y, front);

    setHuman({ x: newX, y: newY, front: newFront });
  }, [human]);

  const goMove = useCallback(() => {
    const { x, y, front } = human;
    const [dx, dy] = front;

    // 現在の座標の前方に進む座標を計算
    const nextX = x + dx;
    const nextY = y + dy;

    setHuman({ ...human, x: nextX, y: nextY });
  }, [human]);

  const turnright = useCallback(() => {
    const { front } = human;
    const [dx, dy] = front;

    // 現在の向きを右に90度変更
    let newFront: number[] = [0, 0];
    if (dy === -1) {
      newFront = [dy, dx];
    } else if (dx === -1) {
      newFront = [dy, -dx];
    } else if (dy === 1) {
      newFront = [dy, dx];
    } else if (dx === 1) {
      newFront = [dy, -dx];
    }

    setHuman({ ...human, front: newFront });
  }, [human]);

  // moveHuman 関数
  const moveHuman = useCallback(() => {
    const { x, y, front } = human;
    const { newX, newY } = calculateNextLeftPosition(x, y, front);

    if (x === maze.length - 1 && y === maze[0].length - 1) {
      alert('goal!');
      setSearching(false);
      return;
    }

    const goX = x + front[0];
    const goY = y + front[1];

    if (
      newX >= 0 &&
      newX < maze.length &&
      newY >= 0 &&
      newY < maze[0].length &&
      maze[newX][newY] === 0
    ) {
      LeftMove();
      console.log('leftmove実行');
    } else if (
      goX >= 0 &&
      goX < maze.length &&
      goY >= 0 &&
      goY < maze[0].length &&
      maze[goX][goY] === 0
    ) {
      goMove();
      console.log('goMove実行');
    } else {
      turnright();
      console.log('turnright実行');
    }
  }, [maze, human, LeftMove, goMove, turnright]);

  // 矢印の向きを計算する関数
  const getArrowRotation = (dx: number, dy: number): number => {
    if (dx === 1 && dy === 0) {
      // 下向き
      return 270;
    } else if (dx === 0 && dy === -1) {
      // 左向き
      return 0;
    } else if (dx === -1 && dy === 0) {
      // 上向き
      return 90;
    } else if (dx === 0 && dy === 1) {
      // 右向き
      return 180;
    }
    return 0;
  };

  const [searching, setSearching] = useState(false); // 探索中かどうかの状態を追加

  // useEffectを使用して探索を実行し、結果を反映
  useEffect(() => {
    if (searching) {
      const interval = setInterval(() => {
        moveHuman();
        if (human.x === maze.length - 1 && human.y === maze[0].length - 1) {
          setSearching(false);
        }
      }, 50);
      return () => {
        clearInterval(interval);
      };
    }
  }, [searching, human.x, human.y, maze, moveHuman]);

  return (
    <div className={styles.container}>
      <h1>迷路ゲーム</h1>
      <div className={styles.top}>
        <button className={styles.generationbu} onClick={generation}>
          生成
        </button>
        <button className={styles.humanbu} onClick={moveHuman}>
          探索
        </button>

        <button className={styles.flowbu} onClick={() => setSearching(true)}>
          auto探索
        </button>
      </div>
      <div className={styles.maze}>
        {maze.map((row, x) =>
          row.map((cell, y) => (
            <div className={styles.cell} key={`${x}-${y}`}>
              {cell === 1 && <div className={styles.pillar} />}
              {human.x === x && human.y === y && (
                <div className={styles.position} key={`${human.x}-${human.y}`}>
                  <div
                    className={styles.arrow}
                    style={{
                      transform: `rotate(${getArrowRotation(human.front[0], human.front[1])}deg)`,
                    }}
                    key={`${human.x}-${human.y}`}
                  />
                </div>
              )}
              {x === 0 && y === 0 && (
                <div className={styles.start}>
                  start
                  <br />
                  <br />
                </div>
              )}
              {x === maze.length - 1 && y === maze[0].length - 1 && (
                <div className={styles.goal}>
                  <br />
                  goal
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
