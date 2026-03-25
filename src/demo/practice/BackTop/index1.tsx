import React, { useEffect, useState } from "react";
import defaultImg from './img/btn-top.png';
import style from './backtop.module.scss';
import { pxToRem } from "COMMON/utils";

interface BackTopProps {
  width?: number | string;
  height?: number | string;
  posRight?: number | string;
  posBottom?: number | string;
  img?: string;
}

function toTop() {
  let nowScrollTop = getScrollTop();
  const perScrollHeight = Math.ceil(nowScrollTop / 10);
  let timer: any = null;

  const toTarget = function toTarget() {
    document.body.scrollTop = nowScrollTop;
    document.documentElement.scrollTop = nowScrollTop;
    if (nowScrollTop > 0) {
      nowScrollTop = Math.max(0, nowScrollTop - perScrollHeight);
      timer = window.requestAnimationFrame(toTarget);
    } else {
      window.cancelAnimationFrame(timer);
    }
  };
  window.requestAnimationFrame(toTarget);
}

function getScrollTop() {
  return document.body.scrollTop || document.documentElement.scrollTop;
}

const BackTop: React.FC<BackTopProps> = ({
  width = 79,
  height = 82,
  posRight = 20,
  posBottom = 20,
  img = defaultImg
}) => {
  const [ isShowBtnTop, setIsShowBtnTop ] = useState(false);
  const [styles] = useState({
    width: typeof width === 'number' ? pxToRem(width) : width,
    height: typeof height === 'number' ? pxToRem(height) : height,
    backgroundImage: `url(${img})`,
    right: typeof posRight === 'number' ? pxToRem(posRight) : posRight,
    bottom: typeof posBottom === 'number' ? pxToRem(posBottom) : posBottom
  });
  const displayStyle = { display: isShowBtnTop ? 'block' : 'none' };

  let scrollListener = () => {};

  function bindScroll() {
    scrollListener = () => {
      const scrollTop = getScrollTop();
      setIsShowBtnTop(!!(scrollTop >= 100));
    };

    window.addEventListener('scroll', scrollListener, false);
  }

  useEffect(() => {
    bindScroll();
    return () => {
      window.removeEventListener('scroll', scrollListener, false);
    };
  }, []);

  return (
    <div className={style['btn-top']} style={{ ...displayStyle, ...styles }} onClick={toTop}></div>
  );
};

export default BackTop;
