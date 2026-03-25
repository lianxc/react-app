import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Toast } from 'react-vant';
import { useTranslation } from 'react-i18next';
import nativeApi from '@bigo/nativeapi-helloyo';
import { deeplink } from '../assets/helloyo/js/client';
import { CountDown } from 'react-vant';
import { eventBus } from '../CouponPopup';
import _throttle from 'lodash/throttle';
import styles from './index.module.scss';

interface PackageItem {
  productId: string;
  diamond: number;
  firstRechargeDiamond?: number;
  extraDiamond?: number;
  coin?: number;
  fromClient?: boolean;
  gp?: boolean;
  huawei?: boolean;
  promotion?: boolean;
  productTag?: string;
  giftIcon?: string;
  currency?: string;
  amount?: string;
  price?: string;
  mainChannel?: string;
  subChannel?: string;
  isSupportCoupon?: number;
}

interface CouponInfo {
  show?: boolean;
  couponId?: string;
  rebate?: number;
  rebateRate?: number;
  validityPeriod?: number;
}

interface PackageProps {
  halfPage?: boolean;
  isFirstCharge?: boolean;
  channelTag?: string;
  list: PackageItem[];
  onUpdateDiamondsInfo?: () => void;
}

const Package: React.FC<PackageProps> = ({
  halfPage = false,
  isFirstCharge = false,
  channelTag = '',
  list = [],
  onUpdateDiamondsInfo
}) => {
  const { t } = useTranslation();
  const [pidCouponsMap, setPidCouponsMap] = useState<Record<string, CouponInfo>>({});
  const countDownRefs = useRef<Record<string, React.RefObject<any>>>({});

  // Initialize refs for each product
  useEffect(() => {
    list.forEach(item => {
      if (!countDownRefs.current[item.productId]) {
        countDownRefs.current[item.productId] = React.createRef();
      }
    });
  }, [list]);

  const updateList = useCallback(() => {
    if (!list.length) return;

    const { mainChannel = '', subChannel = '', isSupportCoupon = 0 } = list[0];
    const pidDiamonds: Record<string, number> = {};

    list.forEach(v => {
      pidDiamonds[v.productId] = v.diamond;
    });

    getCouponByProduct(mainChannel, subChannel, pidDiamonds, isSupportCoupon);
  }, [list]);

  const getCouponByProduct = async (
    mainChannel: string,
    subChannel: string,
    pidDiamonds: Record<string, number>,
    isSupportCoupon: number
  ) => {
    try {
      // API call to get available coupons by product
      // const res = await unsafeWebRpcBatchGetAvailableCouponByProduct({
      //   seqid: Math.ceil(Date.now() / 1000),
      //   appid: 66,
      //   main_channel: mainChannel,
      //   sub_channel: subChannel,
      //   pid_diamonds_map: pidDiamonds
      // });

      // For now, using mock data
      const res = {
        pid_coupons_map: {
          [Object.keys(pidDiamonds)[0]]: {
            max_coupon_info: {
              coupon_id: '123',
              return_rate: 10,
              count_down_seconds: 3600
            }
          }
        }
      };

      const map = res.pid_coupons_map || {};
      const newPidCouponsMap: Record<string, CouponInfo> = {};

      Object.keys(map).forEach(k => {
        const obj: CouponInfo = { show: false };
        // 华为渠道不显示
        let canShow = true;

        const isHuaWei = false; // Placeholder for Huawei check
        if (isHuaWei) {
          canShow = false;
        }

        const isIosOrder = false; // Placeholder for iOS order check
        const isGoogle = false; // Placeholder for Google check

        // 苹果支付和谷歌支付，isSupportCoupon=1才可展示返利券
        if ((isIosOrder || isGoogle) && !isSupportCoupon) {
          canShow = false;
        }

        if (canShow && map[k].max_coupon_info?.coupon_id) {
          obj.show = true;
          obj.couponId = map[k].max_coupon_info.coupon_id;
          obj.rebate = Math.floor((map[k].max_coupon_info.return_rate * pidDiamonds[k]) / 100);
          obj.rebateRate = map[k].max_coupon_info.return_rate;
          obj.validityPeriod = map[k].max_coupon_info.count_down_seconds;
        }

        newPidCouponsMap[k] = obj;

        // Reset countdown timers
        if (countDownRefs.current[k] && countDownRefs.current[k].current) {
          setTimeout(() => {
            if (countDownRefs.current[k] && countDownRefs.current[k].current) {
              countDownRefs.current[k].current.reset();
            }
          }, 0);
        }
      });

      setPidCouponsMap(newPidCouponsMap);
    } catch (error) {
      console.error('Error getting coupons by product:', error);
    }
  };

  const createOrder = (item: PackageItem) => {
    // 是否带充值返利券
    if (pidCouponsMap[item.productId]?.couponId) {
      item.couponId = pidCouponsMap[item.productId].couponId;
    } else {
      (item as any).couponId = '';
    }

    if (item.gp) {
      purchaseGoogleSku(item);
    } else if (item.huawei) {
      purchaseHuaWeiSku(item);
    } else {
      createOrderFn(item);
    }
  };

  const createOrderFn = async (item: PackageItem) => {
    let locationObj: any = {};
    try {
      const getLocInfoRes = await nativeApi.getLocInfo();
      console.log('getLocInfoRes', getLocInfoRes);
      const location = JSON.parse(getLocInfoRes.data[0]) && JSON.parse(getLocInfoRes.data[0]).location;
      locationObj = {
        ip: location.ip,
        code_sys: location.code_sys,
        lon: location.lon,
        lat: location.lat
      };
    } catch (error) {
      console.log(error);
    }

    // 技术指标上报
    // googleAnnosytics('createOrderAction', item);

    try {
      // API call to create order
      // const res = await createOrder({
      //   ...item,
      //   location: JSON.stringify(locationObj)
      // });

      // For now, using mock data
      const res = { payUrl: 'https://example.com/payment' };

      // 技术指标上报
      // googleAnnosytics('createOrderSuccess', item);

      const payUrl = res.payUrl;

      // 半屏则打开一个新的webview
      if (halfPage) {
        window.location.href = deeplink.webpage(payUrl);
      } else {
        window.location.href = payUrl;
      }
    } catch (err: any) {
      // 技术指标上报
      // googleAnnosytics('createOrderError', { ...item, code: err?.data?.code || err?.name });
    }

    // 上次使用类别套餐打点
    if (channelTag === 'last_used') {
      // googleAnnosytics('clickLastUsedPkg');
    }
  };

  const purchaseGoogleSkuFn = async (item: PackageItem) => {
    // googleAnnosytics('purchaseGoogleSkuAction', item);

    try {
      const res = await nativeApi.purchaseGoogleSku({
        sku: {
          productId: item.productId,
          couponId: (item as any).couponId || ''
        }
      });

      console.log('purchaseGoogleSku res', res);
      if (res.sku_id && res.sku_id === item.productId) {
        Toast.show(t('pay_success'));
        const wt = false ? 500 : 30000; // Placeholder for iOS check
        setTimeout(() => {
          if (onUpdateDiamondsInfo) {
            onUpdateDiamondsInfo();
          }
          updateList();
        }, wt);
        // googleAnnosytics('purchaseGoogleSkuSuccess', { ...item, ...res });
      }
    } catch (err: any) {
      console.log('purchaseGoogleSku err', err);
      if (err.code) {
        const df = t('pay_fail');
        let msg = t(`pay_code_${err.code}`);
        msg = msg.indexOf('pay_code_') || !msg ? `${err.code} ${df}` : msg;
        Toast.show(msg);
      }
      // googleAnnosytics('purchaseGoogleSkuError', { ...item, ...err });
    }
  };

  const purchaseHuaWeiSku = async (item: PackageItem) => {
    // googleAnnosytics('purchaseHuaWeiSkuAction', item);

    try {
      const res = await nativeApi.purchaseHuaWeiSku({
        sku: {
          productId: item.productId
        }
      });

      console.log('purchaseHuaWeiSku res', res);
      if (res.sku_id && res.sku_id === item.productId) {
        Toast.show(t('pay_success'));
        const wt = false ? 500 : 30000; // Placeholder for iOS check
        setTimeout(() => {
          if (onUpdateDiamondsInfo) {
            onUpdateDiamondsInfo();
          }
        }, wt);
        // googleAnnosytics('purchaseHuaWeiSkuSuccess', item);
      }
    } catch (err: any) {
      console.log('purchaseHuaWeiSku err', err);
      if (err.code) {
        const df = t('pay_fail');
        let msg = t(`huawei_code_${err.code}`);
        msg = msg.indexOf('huawei_code_') || !msg ? `${err.code} ${df}` : msg;
        Toast.show(msg);
      }
      // googleAnnosytics('purchaseHuaWeiSkuError', { ...item, ...err });
    }
  };

  // Throttle the Google purchase function
  const purchaseGoogleSku = useCallback(_throttle(purchaseGoogleSkuFn, 2000), []);

  const renderTimeData = (timeData: any) => {
    const { days, hours, minutes, seconds } = timeData;
    return (
      <>
        {days}d:{hours}h:{minutes}m
        {!days && !hours && !minutes && <>:{seconds}s</>}
      </>
    );
  };

  useEffect(() => {
    if (list.length) {
      updateList();
    }
  }, [list, updateList]);

  useEffect(() => {
    const handleUpdateCouponSelected = (opt: any) => {
      if (pidCouponsMap[opt.productId]) {
        const newPidCouponsMap = { ...pidCouponsMap };
        newPidCouponsMap[opt.productId].couponId = opt.couponId || '';

        if (opt.couponId) {
          newPidCouponsMap[opt.productId].rebate = opt.rebate;
          newPidCouponsMap[opt.productId].rebateRate = opt.rebateRate;
          newPidCouponsMap[opt.productId].validityPeriod = opt.validityPeriod;

          // Reset countdown timers
          if (countDownRefs.current[opt.productId] && countDownRefs.current[opt.productId].current) {
            setTimeout(() => {
              if (countDownRefs.current[opt.productId] && countDownRefs.current[opt.productId].current) {
                countDownRefs.current[opt.productId].current.reset();
              }
            }, 0);
          }
        }

        setPidCouponsMap(newPidCouponsMap);
      }
    };

    eventBus.on('update-coupon-selected', handleUpdateCouponSelected);

    return () => {
      eventBus.off('update-coupon-selected', handleUpdateCouponSelected);
    };
  }, [pidCouponsMap]);

  return (
    <ul className={styles.packageList}>
      {list.map((item, index) => (
        <li key={index}>
          <div
            className={`${styles.listRow} ${item.fromClient ? styles.gp : ''}`}
            onClick={() => createOrder(item)}
          >
            {item.fromClient && item.promotion && (
              <img className={styles.gpPromotion} src="/assets/img/promotion.png" alt="" />
            )}
            {item.productTag && <p className={`${styles.comMarkTag} ${styles.pkgTag}`}>{item.productTag}</p>}
            <img className={styles.diamond} src="/assets/img/diamond-s.png" alt="" />
            <span className={styles.num}>{item.diamond}</span>
            <div className={styles.info}>
              {isFirstCharge && item.firstRechargeDiamond && (
                <p>
                  <span>+</span>
                  <span className={styles.pkgIcon}></span>
                  <span className={styles.pkgNum}>{item.firstRechargeDiamond} ({t('first')})</span>
                </p>
              )}
              {item.extraDiamond && (
                <p>
                  <span>+</span>
                  <span className={styles.pkgIcon}></span>
                  <span className={styles.pkgNum}>{item.extraDiamond} ({t('extra')})</span>
                </p>
              )}
              {item.coin && (
                <p>
                  <span>+</span>
                  <span className={`${styles.pkgIcon} ${styles.coin}`}></span>
                  <span className={`${styles.pkgNum} ${!item.fromClient ? styles.coin : ''}`}>{item.coin}</span>
                </p>
              )}
            </div>
            {!item.fromClient ? (
              <div className={styles.price}>
                <span className={`icon ${item.giftIcon}`}></span> {item.currency} {item.amount}
              </div>
            ) : (
              <div className={`${styles.price} ${styles.gp}`}>
                {item.price}
              </div>
            )}
          </div>
          {/* 返利券 */}
          {pidCouponsMap[item.productId]?.show && (
            <div
              className={styles.rabateBox}
              onClick={() => eventBus.emit('show-coupon', item, pidCouponsMap[item.productId])}
            >
              <img className={styles.rabateIcon} src="/assets/img/icon-coupon.png" alt="" />
              <span className={styles.rabateGap}></span>
              {/* 用户选择 */}
              {pidCouponsMap[item.productId].couponId ? (
                <div className={styles.rabateFlex}>
                  <span>+</span>
                  <span className={styles.pkgIcon}></span>
                  <span
                    className={styles.pkgNum}
                    dangerouslySetInnerHTML={{
                      __html: t('coupon14', {
                        X: `<span class="arinb">${pidCouponsMap[item.productId].rebateRate}%</span>`
                      })
                    }}
                  />
                </div>
              ) : (
                <div className={styles.rabateFlex}>{t('coupon15')}</div>
              )}
              {/* 倒计时 */}
              {pidCouponsMap[item.productId].couponId && (
                <div className={styles.residueTime}>
                  <img src="/assets/img/icon-time.png" alt="" />
                  <CountDown
                    ref={countDownRefs.current[item.productId] as any}
                    className={styles.time}
                    time={(pidCouponsMap[item.productId].validityPeriod || 0) * 1000}
                    onFinish={updateList}
                  >
                    {renderTimeData}
                  </CountDown>
                </div>
              )}
              <img className={styles.rabateArr} src="/assets/img/arr.png" alt="" />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default Package;