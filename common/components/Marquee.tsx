import React, { useRef, useEffect, useState, ReactNode } from 'react';
import './Marquee.css';

export interface MarqueeProps {
  text: string | string[];
  color?: string;
  fontSize?: string | number;
  lineCount?: number;
  speed?: number;
  direction?: 'left' | 'right';
  className?: string;
  style?: React.CSSProperties;
}

const Marquee: React.FC<MarqueeProps> = ({
  text,
  color = '#333',
  fontSize = 14,
  lineCount = 1,
  speed = 50,
  direction = 'left',
  className = '',
  style,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentWidth, setContentWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const animationRef = useRef<number>();
  const positionRef = useRef<number>(0);

  const texts = Array.isArray(text) ? text : [text];
  const displayTexts = Array(lineCount).fill(texts).flat().slice(0, lineCount);

  useEffect(() => {
    const updateSizes = () => {
      if (contentRef.current && containerRef.current) {
        setContentWidth(contentRef.current.scrollWidth);
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    updateSizes();
    window.addEventListener('resize', updateSizes);
    return () => window.removeEventListener('resize', updateSizes);
  }, [texts, lineCount]);

  useEffect(() => {
    if (contentWidth <= containerWidth) return;

    const animate = () => {
      if (!contentRef.current) return;

      if (direction === 'left') {
        positionRef.current -= 1;
        if (Math.abs(positionRef.current) >= contentWidth) {
          positionRef.current = 0;
        }
      } else {
        positionRef.current += 1;
        if (positionRef.current >= containerWidth) {
          positionRef.current = -contentWidth + containerWidth;
        }
      }

      contentRef.current.style.transform = `translateX(${positionRef.current}px)`;
      animationRef.current = requestAnimationFrame(animate);
    };

    const interval = setInterval(() => {
      animate();
    }, 1000 / speed);

    return () => {
      clearInterval(interval);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [contentWidth, containerWidth, direction, speed]);

  return (
    <div
      ref={containerRef}
      className={`marquee ${className}`}
      style={{
        fontSize: typeof fontSize === 'number' ? `${fontSize}px` : fontSize,
        color,
        ...style,
      }}
    >
      <div
        ref={contentRef}
        className="marquee-content"
        style={{
          display: 'flex',
          flexDirection: lineCount > 1 ? 'column' : 'row',
          gap: lineCount > 1 ? '8px' : '40px',
        }}
      >
        {displayTexts.map((text, index) => (
          <div key={index} className="marquee-item">
            {text}
          </div>
        ))}
        {/* 无缝滚动需要复制内容 */}
        {contentWidth > containerWidth &&
          displayTexts.map((text, index) => (
            <div key={`copy-${index}`} className="marquee-item">
              {text}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Marquee;

