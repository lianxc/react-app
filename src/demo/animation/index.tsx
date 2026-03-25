import React from 'react';
import styles from './index.module.scss';

const Animation: React.FC = () => {
  return (
    <div className={styles.aniWrap}>
      <h1>Animation</h1>
      {/* 旋转小球 */}
      <div className={styles.ani1}>
        <div className={styles.ball}></div>
      </div>

      {/* 翻转卡片 */}
      <div className={styles.ani2}>
        <div className={styles.card}>
          <div className={styles.cardInner}>
            <div className={styles.cardFront}>正面</div>
            <div className={styles.cardBack}>背面</div>
          </div>
        </div>
      </div>

      {/* 抛物线 */}
      <div className={styles.ani3}>
        <div className={styles.ball}></div>
      </div>
    </div>
  );
}

export default Animation;