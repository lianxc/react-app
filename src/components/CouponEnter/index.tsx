import React, { useState, useEffect } from 'react';
import { useNavigate } from 'wouter';
import { useTranslation } from 'react-i18next';
import styles from './index.module.scss';

const CouponEnter: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [num, setNum] = useState(0);
  const [max, setMax] = useState(0);

  useEffect(() => {
    const fetchCouponNum = async () => {
      try {
        // API call to get coupon numbers
        // const res = await unsafeWebRpcGetCouponNum({
        //   seqid: Math.ceil(Date.now() / 1000),
        //   appid: 66
        // });

        // For now, using mock data
        const res = {
          all_max_return_diamonds: 5000,
          coupon_num: 3
        };

        setMax(res.all_max_return_diamonds || 0);
        setNum(res.coupon_num || 0);

        if (res.coupon_num > 0) {
          // Exposure tracking
          // googleAnnosytics('hasCoupon', { num: res.coupon_num });
        }
      } catch (error) {
        console.error('Error fetching coupon numbers:', error);
      }
    };

    fetchCouponNum();
  }, []);

  if (!num) {
    return null;
  }

  const handleClick = () => {
    navigate('/couponList');
  };

  return (
    <div className={styles.couponEnterBox} onClick={handleClick}>
      <img className={styles.img} src="/assets/img/coupon-enter.png" alt="" />
      <p className={styles.name}>{t('coupon01')}</p>
      <p className={styles.num}>{t('coupon02', { X: num })}</p>
      <img className={styles.arr} src="/assets/img/arr.png" alt="" />
      <span
        className={`${styles.comMarkTag} ${styles.max}`}
        dangerouslySetInnerHTML={{
          __html: t('coupon03', { X: `<span></span>${max}` })
        }}
      />
    </div>
  );
};

export default CouponEnter;