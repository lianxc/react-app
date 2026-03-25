import React, { useRef, useState, useCallback, useEffect } from 'react';
import './LotteryWheel.css';

export interface Prize {
  id: string | number;
  name: string;
  color?: string;
  bgColor?: string;
}

export interface LotteryWheelProps {
  prizes: Prize[];
  onResult?: (prize: Prize) => void;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

const LotteryWheel: React.FC<LotteryWheelProps> = ({
  prizes,
  onResult,
  duration = 3000,
  className = '',
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentAngle, setCurrentAngle] = useState(0);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>(0);

  const prizeCount = prizes.length;
  const anglePerPrize = (2 * Math.PI) / prizeCount;

  // 绘制转盘
  const drawWheel = useCallback((angle: number = 0) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制扇形
    prizes.forEach((prize, index) => {
      const startAngle = index * anglePerPrize + angle;
      const endAngle = (index + 1) * anglePerPrize + angle;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      ctx.fillStyle = prize.bgColor || (index % 2 === 0 ? '#ff6b6b' : '#4ecdc4');
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 绘制文字
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + anglePerPrize / 2);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = prize.color || '#fff';
      ctx.font = 'bold 14px Arial';
      ctx.fillText(prize.name, radius * 0.7, 0);
      ctx.restore();
    });

    // 绘制中心圆和指针
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.stroke();

    // 绘制指针
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - radius - 20);
    ctx.lineTo(centerX - 15, centerY - radius);
    ctx.lineTo(centerX + 15, centerY - radius);
    ctx.closePath();
    ctx.fillStyle = '#ff4757';
    ctx.fill();
  }, [prizes, anglePerPrize]);

  // 开始抽奖
  const start = useCallback((targetPrizeId?: string | number) => {
    if (isSpinning || prizeCount === 0) return;

    setIsSpinning(true);
    const startAngle = currentAngle;
    const targetIndex = targetPrizeId
      ? prizes.findIndex((p) => p.id === targetPrizeId)
      : Math.floor(Math.random() * prizeCount);

    if (targetIndex === -1) {
      setIsSpinning(false);
      return;
    }

    // 计算目标角度（转多圈 + 目标位置）
    const spins = 5; // 转5圈
    const targetAngle =
      startAngle +
      spins * 2 * Math.PI +
      (2 * Math.PI - (targetIndex * anglePerPrize + anglePerPrize / 2));

    startTimeRef.current = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // 使用缓动函数
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentAngle = startAngle + (targetAngle - startAngle) * easeOut;

      setCurrentAngle(currentAngle);
      drawWheel(currentAngle);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        const prize = prizes[targetIndex];
        onResult?.(prize);
      }
    };

    animate();
  }, [isSpinning, prizeCount, currentAngle, prizes, anglePerPrize, duration, drawWheel, onResult]);

  useEffect(() => {
    drawWheel(currentAngle);
  }, [drawWheel, currentAngle]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className={`lottery-wheel ${className}`} style={style}>
      <canvas
        ref={canvasRef}
        width={300}
        height={300}
        className="lottery-wheel-canvas"
      />
      <button
        className="lottery-wheel-button"
        onClick={() => start()}
        disabled={isSpinning}
      >
        {isSpinning ? '抽奖中...' : '开始抽奖'}
      </button>
    </div>
  );
};

// 暴露 start 方法
LotteryWheel.start = (targetPrizeId?: string | number) => {
  // 这个方法需要通过 ref 调用
};

export default LotteryWheel;

