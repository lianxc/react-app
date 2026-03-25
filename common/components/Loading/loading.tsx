import React from 'react';
import style from './loading.module.scss';

interface LoadingProps {
  visible: boolean;
}

const Loading: React.FC<LoadingProps> = ({ visible }) => {
  if (!visible) return null;

  return (
    <div className={style.loading}>
      <svg
        width="40"
        height="40"
        viewBox="0 0 100 100"
      >
        <circle
          cx="50"
          cy="50"
          r="42"
        />
      </svg>
    </div>
  );
};

export default Loading;