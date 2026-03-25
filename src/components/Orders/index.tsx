import React, { useState } from 'react';
import { Popup } from 'react-vant';
import { Toast } from 'react-vant';
import { useTranslation } from 'react-i18next';
import nativeApi from '@bigo/nativeapi-helloyo';
import Avatar from '../base/Avatar';
import styles from './index.module.scss';

export enum OrderStatus {
  pending = 'pending',
  success = 'success',
  refund = 'refund',
  failed = 'failed'
}

interface UserInfo {
  avatar: string;
  nickName: string;
  helloid: string;
}

interface OrderParams {
  channelImg?: string;
  channelShowName?: string;
  diamonds: number;
  couponDiamonds: number;
  golds?: number;
  orderStatus: OrderStatus;
  userInfo?: UserInfo;
  activityDiamondOrder?: boolean;
  amount?: number;
  currency?: string;
  createTime: number;
  orderId: string;
  mainChannel?: string;
  subChannel?: string;
}

interface OrdersProps {
  orderStatusEnum?: Record<string, string>;
}

const Orders: React.FC<OrdersProps> = ({
  orderStatusEnum = {}
}) => {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const [params, setParams] = useState<OrderParams>({
    diamonds: 0,
    couponDiamonds: 0,
    orderStatus: OrderStatus.pending,
    createTime: 0,
    orderId: ''
  });

  // Helper function to check if it's iOS order
  const isIosOrder = (orderParams: OrderParams) => {
    // Placeholder for iOS order check
    return false;
  };

  const isIos = () => {
    // Placeholder for iOS check
    return false;
  };

  const dateFormat = (timestamp: number, format: string) => {
    // Placeholder for date formatting
    return new Date(timestamp).toLocaleString();
  };

  const goIndex = () => {
    // googleAnnosytics('clickAgain');
    if (params.mainChannel && params.subChannel) {
      window.location.href = `/?channel=${params.mainChannel};${params.subChannel}`;
    }
  };

  const copyFn = (val: string) => {
    nativeApi.Clipboard({
      mode: 'writeText',
      textValue: val
    }).then((ret: any) => {
      console.log('Clipboard成功返回：', ret);
      Toast.show(t('copy_success'));
    }).catch((err: any) => {
      Toast.show(t('copy_error'));
      console.log('Clipboard失败返回：', err);
    });
  };

  const open = (orderParams: OrderParams) => {
    setParams(orderParams);
    setShow(true);
  };

  const close = () => {
    setShow(false);
  };

  return (
    <>
      <Popup
        visible={show}
        position="bottom"
        round
      >
        <div className={styles.detailsBox}>
          <header className={styles.title}>
            {t('order_detail')}
          </header>
          <article>
            {/* 渠道logo和名称 如果是ios固定 其他用返回的 */}
            <div className={`${styles.row} ${styles.logoName}`}>
              {isIosOrder(params) ? (
                <>
                  <img src="/assets/img/apple.png" alt="" />
                  <p>{t('apple_pay')}</p>
                </>
              ) : params.activityDiamondOrder ? (
                <>
                  <img src="/assets/img/act-diamond.png" alt="" />
                  <p>{t('activityDiamond')}</p>
                </>
              ) : (
                <>
                  <img src={params.channelImg || ''} alt="" />
                  <p>{params.channelShowName}</p>
                </>
              )}
            </div>
            {/* 钻石 */}
            <div className={`${styles.row} ${styles.diamond}`}>
              <p>
                {params.orderStatus === OrderStatus.success && '+'}
                {params.couponDiamonds > 0 ? params.diamonds + params.couponDiamonds : params.diamonds}
              </p>
              <img src="/assets/img/diamond-s.png" alt="" />
            </div>
            {/* 订单状态 */}
            <p className={styles.statusTips}>
              {t(`status_${params.orderStatus}`)}
            </p>
            {/* 充值用户 */}
            {params.userInfo && (
              <div className={styles.userBox}>
                <p>{t('order_account')}</p>
                <div className={`${styles.row} ${styles.user}`}>
                  <Avatar img={params.userInfo.avatar} />
                  <p>{params.userInfo.nickName}</p>
                  <span>ID:{params.userInfo.helloid}</span>
                </div>
              </div>
            )}
            {/* 钻石和货币 */}
            {!params.activityDiamondOrder && (
              <div className={styles.priceBox}>
                <div className={styles.row}>
                  <p className={styles.flex}>{t('order_diamond')}</p>
                  {params.orderStatus === OrderStatus.pending ? (
                    <span>{t('waiting_posting')}</span>
                  ) : params.orderStatus === OrderStatus.refund ? (
                    <span>0</span>
                  ) : (
                    <>
                      <b>{params.couponDiamonds > 0 ? params.diamonds + params.couponDiamonds : params.diamonds}</b>
                      {' '}
                      <img src="/assets/img/diamond-s.png" alt="" />
                    </>
                  )}
                </div>
                {/* 返利钻石 */}
                {params.couponDiamonds && params.orderStatus === OrderStatus.success && (
                  <div className={styles.row}>
                    <p className={styles.flex}>{t('coupon18')}</p>
                    <b>{params.couponDiamonds}</b>
                    {' '}
                    <img src="/assets/img/diamond-s.png" alt="" />
                  </div>
                )}
                {params.golds && params.orderStatus === OrderStatus.success && (
                  <div className={styles.row}>
                    <p className={styles.flex}>{t('order_coin')}</p>
                    <b>{params.golds}</b>
                    {' '}
                    <img src="/assets/img/coin.png" alt="" />
                  </div>
                )}
                {params.orderStatus === OrderStatus.refund && (
                  <div className={styles.row}>
                    <p className={styles.flex}>{t('refund_amount')}</p>
                    <b>{params.amount} {params.currency}</b>
                  </div>
                )}
              </div>
            )}
            {/* 订单其他信息 */}
            <div className={styles.infoBox}>
              <div className={styles.row}>
                <p className={styles.flex}>{params.activityDiamondOrder ? t('activityDiamondTime') : t('order_status')}</p>
                <p>{t(`status_${params.orderStatus}`)}</p>
              </div>
              <div className={styles.row}>
                <p className={styles.flex}>
                  {params.activityDiamondOrder ? t('activityDiamondTime') : t('order_time')}
                </p>
                <p>{dateFormat(params.createTime * 1000, 'yyyy-MM-dd hh:mm:ss')}</p>
              </div>
              {!params.activityDiamondOrder && (
                <div className={styles.row}>
                  <p className={styles.flex}>{t('order_num')}</p>
                  <p>{params.orderId}</p>
                  <img
                    className={styles.copy}
                    src="/assets/img/copy.png"
                    alt=""
                    onClick={() => copyFn(params.orderId)}
                  />
                </div>
              )}
            </div>
          </article>
          {/* 再来一单 仅安卓有 */}
          {!isIos() && !params.activityDiamondOrder && (
            <footer className={styles.btnBox}>
              <a onClick={goIndex}>{t('again')}</a>
            </footer>
          )}
        </div>
      </Popup>
    </>
  );
};

export default Orders;