import React, { useState, useEffect, useRef } from 'react';
import { CountDown } from 'react-vant';
import { useTranslation } from 'react-i18next';
import styles from './index.module.scss';

interface CouponItemInfo {
  return_rate: number;
  max_return_diamonds: number;
  min_diamonds_valid: number;
  max_diamonds_valid: number;
  channel_type: number;
  channel_alias_list: string[];
  count_down_seconds: number;
  coupon_id?: string;
  selected?: boolean;
}

interface CouponItemProps {
  itemInfo: CouponItemInfo;
  type?: string;
  onClick?: () => void;
  onUpdateList?: () => void;
}

const CouponItem: React.FC<CouponItemProps> = ({
  itemInfo,
  type = '',
  onClick,
  onUpdateList
}) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const countDownRef = useRef<{ reset: () => void }>(null);

  useEffect(() => {
    if (countDownRef.current) {
      countDownRef.current.reset();
    }
  }, [itemInfo]);

  const getChannelTypeText = () => {
    if (itemInfo.channel_type === 0) {
      return t('coupon10'); // 全部渠道
    } else if (itemInfo.channel_type === 1 && itemInfo.channel_alias_list.length) {
      return itemInfo.channel_alias_list.join('/');
    } else if (itemInfo.channel_type === 2) {
      return t('coupon11'); // 部分渠道
    }
    return '';
  };

  const handleFinish = () => {
    if (onUpdateList) {
      onUpdateList();
    }
  };

  const renderTimeData = (timeData: any) => {
    const { days, hours, minutes, seconds } = timeData;
    return (
      <>
        {days}d:{hours}h:{minutes}m
        {!days && !hours && !minutes && <>:{seconds}s</>}
      </>
    );
  };

  return (
    <div
      className={`${styles.couponItemBox} ${
        itemInfo.return_rate <= 15 ? styles.blue : styles.red
      } ${type === 'selection' ? styles.selection : ''} ${
        itemInfo.selected ? styles.selected : ''
      }`}
      onClick={onClick}
    >
      <div className={styles.card}>
        <span className={styles.arinb}>
          <b>+{itemInfo.return_rate}</b>%
        </span>
      </div>
      <div className={styles.mainInfo}>
        <p className={styles.rebate}>
          {t('coupon06')}: <b className={styles.arinb}>{itemInfo.return_rate}%</b>
        </p>
        <p className={styles.diamond}>
          {t('coupon07')}: {itemInfo.max_return_diamonds}{' '}
          <span className={styles.d}></span>
        </p>
        {type === 'selection' && (
          <>
            <p className={styles.diamond}>
              {t('coupon08')}: {itemInfo.min_diamonds_valid}-{itemInfo.max_diamonds_valid}{' '}
              <span className={styles.d}></span>
            </p>
            <p className={styles.diamond}>
              {t('coupon09')}: {getChannelTypeText()}
            </p>
          </>
        )}
        <div className={styles.residueTime}>
          <img src="/assets/img/icon-time.png" alt="" />
          <CountDown
            ref={countDownRef as any}
            className={styles.time}
            time={itemInfo.count_down_seconds * 1000}
            onFinish={handleFinish}
          >
            {renderTimeData}
          </CountDown>
        </div>
        {type !== 'selection' && (
          <>
            <div className={styles.line}></div>
            <div className={`${styles.content} ${expanded ? styles.open : ''}`}>
              <p className={styles.diamond}>
                {t('coupon08')}: {itemInfo.min_diamonds_valid}-{itemInfo.max_diamonds_valid}{' '}
                <span className={styles.d}></span>
              </p>
              <p className={styles.diamond}>{t('coupon09')}: {getChannelTypeText()}</p>
            </div>
            <div
              className={`${styles.expanded} ${expanded ? styles.open : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
            >
              <span>{expanded ? t('coupon13') : t('coupon12')}</span>
              <span className={styles.icon}></span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CouponItem;