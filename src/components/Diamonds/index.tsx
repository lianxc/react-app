import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog } from 'react-vant';
import { sendCustomKeyReport } from '@bigo/nativeapi-helloyo';
import styles from './index.module.scss';

interface DiamondsInfo {
  diamond: number; // 普通钻石
  diamond_noble: number; // 贵族钻石
  diamond_noble_expired: number; // 贵族钻石（过期）
  diamond_total: number; // 总和
}

interface DiamondsProps {
  isFirstCharge?: boolean;
  halfPage?: boolean;
}

const Diamonds: React.FC<DiamondsProps> = ({
  isFirstCharge = false,
  halfPage = false
}) => {
  const { t } = useTranslation();
  const [diamondsInfo, setDiamondsInfo] = useState<DiamondsInfo>({
    diamond: 0,
    diamond_noble: 0,
    diamond_noble_expired: 0,
    diamond_total: 0
  });

  const diamondsInfoFn = async () => {
    try {
      // API call to get diamonds info
      // const res = await diamondsInfo();
      // setDiamondsInfo(res);

      // For now, using mock data
      const res: DiamondsInfo = {
        diamond: 1000,
        diamond_noble: 0,
        diamond_noble_expired: 0,
        diamond_total: 1000
      };

      setDiamondsInfo(res);

      // Monitor tracking
      sendCustomKeyReport({
        type: 'diamonds-success'
      });
    } catch (err: any) {
      sendCustomKeyReport({
        type: 'diamonds-error',
        extra: err.data || {}
      });
    }
  };

  useEffect(() => {
    sendCustomKeyReport({
      type: 'diamonds-info'
    });
    diamondsInfoFn();
  }, []);

  const handleNobleDiamondInfo = () => {
    Dialog.confirm({
      showCloseBtn: false,
      title: t('nobleDiamondTitle'),
      message: t('nobleDiamondDesc'),
      confirmBtnText: t('confirm')
    });
  };

  const handleFreezeDesc = () => {
    Dialog.confirm({
      showCloseBtn: false,
      message: t('freezeDesc'),
      confirmBtnText: t('confirm')
    });
  };

  if (halfPage) {
    return (
      <header className={`${styles.header} ${styles.halfHeader}`}>
        <div className={styles.halfTop}>
          <span>{t('title')}：</span>
          <b>{diamondsInfo.diamond_total - diamondsInfo.diamond_noble_expired}</b>
          <img src="/assets/img/diamond.png" alt="" />
        </div>
      </header>
    );
  }

  if (diamondsInfo.diamond_noble && diamondsInfo.diamond_noble > 0) {
    return (
      <header className={`${styles.header} ${styles.diamondsHeader}`}>
        <img src="/assets/img/diamond-v.png" alt="" />
        <span>{t('title')}</span>
        <p className={styles.diamond}>{diamondsInfo.diamond_total}</p>
        <p className={styles.noble}>
          {t('nobleDiamond')}
          <span>{diamondsInfo.diamond_noble}</span>
          <img
            src="/assets/img/qa.png"
            alt=""
            onClick={handleNobleDiamondInfo}
          />
        </p>
      </header>
    );
  }

  if (diamondsInfo.diamond_noble_expired && diamondsInfo.diamond_noble_expired > 0) {
    return (
      <header className={`${styles.header} ${styles.diamondsHeader}`}>
        <img src="/assets/img/diamond.png" alt="" />
        <span>{t('title')}</span>
        <p className={styles.diamond}>{diamondsInfo.diamond}</p>
        <p className={styles.noble}>
          {t('nobleDiamondTitle')}
          <span>{diamondsInfo.diamond_noble_expired}</span>
          <img
            src="/assets/img/qa.png"
            alt=""
            onClick={handleFreezeDesc}
          />
        </p>
        <span>{t('freezeTips')}</span>
      </header>
    );
  }

  return (
    <header className={`${styles.header} ${styles.diamondsHeader}`}>
      <img src="/assets/img/diamond.png" alt="" />
      <span>{t('title')}</span>
      <p className={styles.diamond}>{diamondsInfo.diamond}</p>
    </header>
  );
};

export default Diamonds;