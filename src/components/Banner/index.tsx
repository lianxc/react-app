import React, { useState, useEffect } from 'react';
import { Swipe, SwipeItem } from 'react-vant';
import { useTranslation } from 'react-i18next';
import nativeApi from '@bigo/nativeapi-helloyo';
import utils from '../utils';
import { deeplink, getUaInfo } from '../assets/helloyo/js/client';
import styles from './index.module.scss';

interface BannerItem {
  banner_id: string;
  banner_img_url: string;
  banner_gft_url: string;
  banner_jump_url: string;
  screen: number;
}

interface BannerProps {
  isFirstCharge?: boolean;
  halfPage?: boolean;
  onlyGoogle?: boolean;
}

const { appVersionCode } = getUaInfo();

const ua = window.navigator.userAgent;

let androidChannel = ua.toLocaleLowerCase().match(/\bchannel\/(.+?)\b/);
androidChannel = androidChannel && androidChannel[1] ? androidChannel[1] : '';

let iosVcode = ua.toLocaleLowerCase().match(/\bvcode\/(.+?)\b/);
iosVcode = iosVcode && iosVcode[1] ? iosVcode[1] : '';

const isIos = utils.isIos();

const firstChargeBannerId = 10000; // banner_id = 10000 固定是首充banner

const Banner: React.FC<BannerProps> = ({
  isFirstCharge = false,
  halfPage = false,
  onlyGoogle = true
}) => {
  const { t } = useTranslation();
  const [list, setList] = useState<BannerItem[]>([]);
  const [filterList, setFilterList] = useState<BannerItem[]>([]);

  useEffect(() => {
    const fetchBannerList = async () => {
      try {
        // API call to get banner list
        // const res = await unsafeWebGetBannerCfg({
        //   os_type: isIos ? 2 : 1,
        //   channel: isIos ? 'AppStore' : androidChannel,
        //   version: isIos ? iosVcode : appVersionCode
        // });

        // For now, using mock data
        const res = {
          banner_cfgs: [
            {
              banner_id: '10000',
              banner_img_url: 'https://example.com/banner1.jpg',
              banner_gft_url: 'https://example.com/banner1_gft.jpg',
              banner_jump_url: 'https://example.com/jump1',
              screen: 1
            },
            {
              banner_id: '10001',
              banner_img_url: 'https://example.com/banner2.jpg',
              banner_gft_url: 'https://example.com/banner2_gft.jpg',
              banner_jump_url: 'https://example.com/jump2',
              screen: 0
            }
          ]
        };

        // 所有的banner
        setList(res.banner_cfgs || []);

        // 如果不满足三方支付，除首充banner外，常规的活动banner要过滤
        setFilterList((res.banner_cfgs || []).filter(v => +v.banner_id === firstChargeBannerId));
      } catch (error) {
        console.error('Error fetching banner list:', error);
      }
    };

    fetchBannerList();
  }, []);

  const goPage = (item: BannerItem) => {
    if (+item.banner_id === firstChargeBannerId) {
      // 首充banner
      goFirstChargeNew();
    } else if (+item.screen === 1) {
      // 半屏打开
      openBottomWebViewDialog(blockHost(item.banner_jump_url), +item.banner_id);
    } else {
      // 其他默认全屏
      openFullPage(blockHost(item.banner_jump_url));
    }
  };

  const blockHost = (url: string): string => {
    // Placeholder for blockHost function
    return url;
  };

  const openFullPage = (url: string) => {
    // 半屏则打开一个新的webview
    if (halfPage) {
      // 这里用全屏的方式去打开展示
      window.location.href = deeplink.webEncode(url);
    } else {
      window.location.href = url;
    }
  };

  const goFirstCharge = () => {
    window.location.href = `https://${window.location.host}/live/helloyo/app-10479/index.html`;
  };

  const goFirstChargeNew = () => {
    const url = `https://${window.location.host}/live/helloyo/app-21934/index.html?from=recharge`;
    openBottomWebViewDialog(url, firstChargeBannerId);
  };

  const openBottomWebViewDialog = (url: string, bannerId = 0) => {
    nativeApi.canIUse('openBottomWebViewDialog').then((canIUse) => {
      if (canIUse) {
        nativeApi.openBottomWebViewDialog({
          ratio: bannerId === firstChargeBannerId ? 1 : 0.75,
          url,
          tag: `tag${bannerId}`
        }).catch(() => {
          openFullPage(url);
        });
      } else {
        openFullPage(url);
      }
    }).catch(() => {
      openFullPage(url);
    });
  };

  const displayList = !isIos && onlyGoogle ? filterList : list;

  return (
    <div className={`${styles.bannerBox} ${halfPage ? styles.half : ''}`}>
      <Swipe className={styles.swipeList} autoplay={3000} indicator="white">
        {displayList.map((item, index) => (
          <SwipeItem key={index} onClick={() => goPage(item)}>
            <img
              src={blockHost(+item.banner_id === firstChargeBannerId ? item.banner_img_url : item.banner_gft_url)}
              alt=""
            />
          </SwipeItem>
        ))}
      </Swipe>
      {isFirstCharge && <p className={styles.pkgTip}>{t('pkgTip')}</p>}
    </div>
  );
};

export default Banner;