import React, { useState, useCallback, useRef, useEffect } from 'react';
import './LotteryGrid.css';

export interface GridPrize {
  id: string | number;
  name: string;
  icon?: string;
  bgColor?: string;
}

export interface LotteryGridProps {
  prizes: GridPrize[];
  onResult?: (prize: GridPrize) => void;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

const LotteryGrid: React.FC<LotteryGridProps> = ({
  prizes,
  onResult,
  duration = 3000,
  className = '',
  style,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [isSpinning, setIsSpinning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>(0);
  const currentIndexRef = useRef<number>(0);

  // 确保奖品数量为8个（九宫格，中间是按钮）
  const gridPrizes = prizes.slice(0, 8);
  while (gridPrizes.length < 8) {
    gridPrizes.push({ id: `empty-${gridPrizes.length}`, name: '' });
  }

  // 九宫格路径（顺时针）
  const path = [0, 1, 2, 5, 8, 7, 6, 3];

  const start = useCallback((targetPrizeId?: string | number) => {
    if (isSpinning) return;

    setIsSpinning(true);
    const targetIndex = targetPrizeId
      ? gridPrizes.findIndex((p) => p.id === targetPrizeId)
      : Math.floor(Math.random() * gridPrizes.length);

    if (targetIndex === -1) {
      setIsSpinning(false);
      return;
    }

    // 找到目标在路径中的位置
    const targetPathIndex = path.indexOf(targetIndex);
    if (targetPathIndex === -1) {
      setIsSpinning(false);
      return;
    }

    // 计算需要转的圈数和最终位置
    const spins = 5; // 转5圈
    const totalSteps = spins * 8 + targetPathIndex;
    let currentStep = 0;
    currentIndexRef.current = 0;

    startTimeRef.current = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // 使用缓动函数
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const targetStep = Math.floor(totalSteps * easeOut);

      if (targetStep > currentStep) {
        currentStep = targetStep;
        const pathIndex = currentStep % 8;
        const gridIndex = path[pathIndex];
        setActiveIndex(gridIndex);
        currentIndexRef.current = gridIndex;
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // 确保停在目标位置
        setActiveIndex(targetIndex);
        setIsSpinning(false);
        const prize = gridPrizes[targetIndex];
        onResult?.(prize);
      }
    };

    animate();
  }, [isSpinning, gridPrizes, duration, onResult]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className={`lottery-grid ${className}`} style={style}>
      <div className="lottery-grid-container">
        {gridPrizes.map((prize, index) => (
          <div
            key={prize.id}
            className={`lottery-grid-item ${
              activeIndex === index ? 'lottery-grid-item-active' : ''
            }`}
            style={{ backgroundColor: prize.bgColor || '#fff' }}
          >
            {prize.icon ? (
              <img src={prize.icon} alt={prize.name} className="lottery-grid-icon" />
            ) : (
              <div className="lottery-grid-name">{prize.name}</div>
            )}
          </div>
        ))}
        <button
          className="lottery-grid-button"
          onClick={() => start()}
          disabled={isSpinning}
        >
          {isSpinning ? '抽奖中...' : '开始'}
        </button>
      </div>
    </div>
  );
};

export default LotteryGrid;

