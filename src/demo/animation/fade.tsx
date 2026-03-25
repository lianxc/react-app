import React, { useState, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import './fade.css';

const Fade = () => {
  const [showBox, setShowBox] = useState(true);
  const nodeRef = useRef(null);

  return (
    <div>
      <button onClick={() => setShowBox(!showBox)}>Toggle Box</button>
      <CSSTransition
        nodeRef={nodeRef}
        in={showBox}
        timeout={300}
        unmountOnExit
        classNames={{
          enter: 'my-fade-enter',
          enterActive: 'my-fade-enter-active',
          exit: 'my-fade-exit',
          exitActive: 'my-fade-exit-active',
          appear: 'my-fade-appear',
          appearActive: 'my-fade-appear-active'
        }}
        appear={true} // 首次渲染也有动画
        onEnter={() => console.log('开始进入')}
        onEntering={() => console.log('进入中')}
        onEntered={() => console.log('进入完成')}
        onExit={() => console.log('开始退出')}
        onExiting={() => console.log('退出中')}
        onExited={() => console.log('退出完成')}
        onEnded={() => console.log('动画结束')}
      >
        <div className="box" ref={nodeRef}>
          我是一个会淡入淡出的盒子
        </div>
      </CSSTransition>
    </div>
  )
}

export default Fade;