import { useCallback, useEffect, useState } from 'react';

export const useGame = () => {
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
  const mazePillarGeneration_Odd = () => {
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

  const generationMazeBoard = () => {
    const startCells = mazePillarGeneration_Odd();

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

  //指定された座標が迷路の範囲内かつ壁でないかチェック
  const isMovable = (x: number, y: number, maze: number[][]) => {
    return x >= 0 && x < maze.length && y >= 0 && y < maze[0].length && maze[x][y] === 0;
  };
  // moveHuman 関数
  const moveHuman = useCallback(() => {
    const { x, y, front } = human;

    if (x === maze.length - 1 && y === maze[0].length - 1) {
      alert('goal!');
      setSearching(false);
      return;
    }
    const { newX, newY } = calculateNextLeftPosition(x, y, front);
    const goX = x + front[0];
    const goY = y + front[1];
    if (isMovable(newX, newY, maze)) {
      LeftMove();
      console.log('leftmove実行');
    } else if (isMovable(goX, goY, maze)) {
      goMove();
      console.log('goMove実行');
    } else {
      turnright();
      console.log('turnright実行');
    }
  }, [maze, human, LeftMove, goMove, turnright]);

  // 矢印の向きを計算する関数
  const getArrowRotation = (dx: number, dy: number): number => {
    // 矢印の向きをオブジェクトで管理
    const arrowDirections: { [key: string]: number } = {
      '1,0': 270, // 下向き
      '0,-1': 0, // 左向き
      '-1,0': 90, // 上向き
      '0,1': 180, // 右向き
    };
    // オブジェクトから矢印の向きを取得し、見つからない場合はデフォルト値 (0) を返す
    const key = `${dx},${dy}`;
    return arrowDirections[key] || 0;
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
      }, 25);
      return () => {
        clearInterval(interval);
      };
    }
  }, [searching, human.x, human.y, maze, moveHuman]);

  return { generationMazeBoard, moveHuman, setSearching, maze, getArrowRotation, human };
};
