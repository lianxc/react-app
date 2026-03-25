import React, { useState, useEffect } from 'react';
import { Popup } from 'react-vant';
import { useTranslation } from 'react-i18next';
import { Toast } from 'react-vant';
import EventEmitter from 'eventemitter3';
import CouponItem from '../CouponItem';
import styles from './index.module.scss';

const eventBus = new EventEmitter();

interface CouponInfo {
  couponId?: string;
  rebate?: number;
  rebateRate?: number;
  validityPeriod?: number;
}

interface ShowCouponEvent {
  productId: string;
  diamond: number;
  mainChannel: string;
  subChannel: string;
}

const CouponPopup: React.FC = () => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [couponId, setCouponId] = useState('');
  const [reqEnd, setReqEnd] = useState(false);
  const [list, setList] = useState<any[]>([]);
  const [pid, setPid] = useState('');
  const [diamonds, setDiamonds] = useState(0);
  const [mainChannel, setMainChannel] = useState('');
  const [subChannel, setSubChannel] = useState('');

  const [showNew, setShowNew] = useState(false);
  const [maxReturnDiamonds, setMaxReturnDiamonds] = useState(0);
  const [newCouponNum, setNewCouponNum] = useState(0);

  const updateList = async () => {
    try {
      const obj: Record<string, number> = {};
      if (pid && diamonds) {
        obj[pid] = diamonds;
      }

      // API call to get available coupons by product
      // const res = await unsafeWebRpcBatchGetAvailableCouponByProduct({
      //   seqid: Math.ceil(Date.now() / 1000),
      //   appid: 66,
      //   main_channel: mainChannel,
      //   sub_channel: subChannel,
      //   pid_diamonds_map: obj
      // });

      // For now, using mock data
      const res = {
        pid_coupons_map: {
          [pid]: {
            available_coupons: [
              {
                coupon_id: '123',
                return_rate: 10,
                max_return_diamonds: 100,
                min_diamonds_valid: 10,
                max_diamonds_valid: 1000,
                channel_type: 0,
                channel_alias_list: [],
                count_down_seconds: 3600,
                selected: false
              }
            ],
            max_coupon_info: {
              coupon_id: '123',
              return_rate: 10,
              count_down_seconds: 3600
            }
          }
        }
      };

      let resultList = res?.pid_coupons_map[pid]?.available_coupons || [];
      resultList = resultList.map((v: any) => ({ ...v, selected: false }));
      setList(resultList);
      setReqEnd(true);

      // 更新列表时，如果用户有选择，且选择的券已经过期，则自动帮用户切换到最高返利券
      if (couponId && !resultList.find((v: any) => v.coupon_id === couponId)) {
        setCouponId(res?.pid_coupons_map[pid]?.max_coupon_info?.coupon_id || '');
      }

      // 匹配选项
      couponIdMate(resultList);
    } catch (error) {
      console.error('Error updating coupon list:', error);
    }
  };

  const couponIdMate = (currentList: any[]) => {
    const updatedList = currentList.map(item => ({
      ...item,
      selected: item.coupon_id === couponId
    }));
    setList(updatedList);
  };

  const chooseCouponFn = async (item?: any) => {
    const params: any = {
      productId: pid
    };

    if (item && item.coupon_id) {
      // 读取接口获取最新信息
      setCouponId(item.coupon_id);
      await updateList();

      const selectItem = list.find((v: any) => v.coupon_id === item.coupon_id);

      // 券已失效
      if (!selectItem) {
        Toast.show(t('coupon22'));
      } else {
        params.couponId = couponId;
        params.rebate = Math.floor((selectItem.return_rate * diamonds) / 100); // 返钻数（金额*比例）
        params.rebateRate = selectItem.return_rate; // 返钻比例
        params.validityPeriod = selectItem.count_down_seconds;

        // 传选项给套餐
        eventBus.emit('update-coupon-selected', params);

        // 上报
        // googleAnnosytics('couponSelected', params);

        // 关闭弹窗
        setShowModal(false);
      }
    } else {
      setCouponId('');
      params.couponId = '';

      // 匹配选项
      const updatedList = list.map(item => ({ ...item, selected: false }));
      setList(updatedList);

      // 传选项给套餐
      eventBus.emit('update-coupon-selected', params);

      // 上报
      // googleAnnosytics('couponSelected', params);

      // 关闭弹窗
      setShowModal(false);
    }
  };

  useEffect(() => {
    const handleShowCoupon = (opt: ShowCouponEvent, info: CouponInfo) => {
      setShowModal(true);
      setPid(opt.productId);
      setDiamonds(opt.diamond);
      setMainChannel(opt.mainChannel);
      setSubChannel(opt.subChannel);
      setCouponId(info.couponId || '');
      updateList();

      // 上报
      // googleAnnosytics('showCouponSelect', { ...opt, ...info });
    };

    eventBus.on('show-coupon', handleShowCoupon);

    return () => {
      eventBus.off('show-coupon', handleShowCoupon);
    };
  }, [mainChannel, subChannel, pid, diamonds, couponId]);

  useEffect(() => {
    // 查询有无新增的劵
    const fetchNewCoupons = async () => {
      try {
        // API call to get all new coupons
        // const res = await unsafeWebRpcGetAllNewCoupon({
        //   seqid: Math.ceil(Date.now() / 1000),
        //   appid: 66
        // });

        // For now, using mock data
        const res = {
          max_return_diamonds: 5000,
          new_coupon_list: [{ coupon_id: '456' }]
        };

        setMaxReturnDiamonds(res.max_return_diamonds || 0);
        setNewCouponNum((res.new_coupon_list || []).length);

        if (res.max_return_diamonds && res.new_coupon_list.length) {
          setShowNew(true);
          // 上报
          // googleAnnosytics('showNewCoupon');
        }
      } catch (error) {
        console.error('Error fetching new coupons:', error);
      }
    };

    fetchNewCoupons();
  }, []);

  return (
    <>
      <Popup
        visible={showModal}
        position="bottom"
        style={{ backgroundColor: 'transparent' }}
      >
        <div className={`${styles.couponSelectionBox} ${styles.couponPopupBox}`}>
          <p className={styles.title}>{t('coupon16')}</p>
          <div className={styles.couponContent}>
            <div
              className={styles.notSelect}
              onClick={() => chooseCouponFn()}
            >
              <span className={`${styles.icon} ${!couponId && reqEnd ? styles.selected : ''}`}></span>
              {t('coupon17')}
            </div>
            {list.map((item, index) => (
              <CouponItem
                key={index}
                itemInfo={item}
                onUpdateList={updateList}
                type="selection"
                onClick={() => chooseCouponFn(item)}
              />
            ))}
          </div>
        </div>
      </Popup>
      <Popup
        visible={showNew}
        closeOnClickOverlay={false}
        style={{ backgroundColor: 'transparent', overflowY: 'initial' }}
      >
        <div className={styles.couponNewBox}>
          <img className={styles.hd} src="/assets/img/coupon-new.png" alt="" />
          <p className={styles.title}>{t('coupon19')}</p>
          <p className={styles.text}>{t('coupon20', { X: newCouponNum })}</p>
          <div className={styles.dv}>
            <img src="/assets/img/diamond.png" alt="" />
            {maxReturnDiamonds}
          </div>
          <div
            className={styles.btn}
            onClick={() => setShowNew(false)}
          >
            {t('coupon21')}
          </div>
        </div>
      </Popup>
    </>
  );
};

export default CouponPopup;
export { eventBus };