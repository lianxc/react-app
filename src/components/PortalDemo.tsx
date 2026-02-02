import { useState } from 'react';
import { createPortal } from 'react-dom';
import './PortalDemo.css';

interface PortalDemoProps {
  demoName: string;
}
interface PopupWrapperProps {
  isOpen: boolean;
  handleClose: () => void;
}

// 挂载点
const PortalContainer = document.getElementById('portal-container');
// 弹窗组件
const PopupWrapper: React.FC<PopupWrapperProps> = ({ isOpen, handleClose }) => {
  if (!isOpen) return null;
  return (
    <div className="popup-wrapper">
      <button className="close-button" onClick={handleClose}>Close</button>
      <div className="popup-mask"></div>
      <div className="popup-content">
        <div className="popup-header">
          <h3>PopupHeader</h3>
        </div>
        <div className="popup-body">
          <h3>PopupBody</h3>
        </div>
        <div className="popup-footer">
          <h3>PopupFooter</h3>
        </div>
      </div>
    </div>
  );
};

const PortalDemo: React.FC<PortalDemoProps> = ({ demoName }) => {
  const [isOpen, setIsOpen] = useState(true);
  const handleClose = () => {
    setIsOpen(false);
  };
  const handleOpen = () => {
    setIsOpen(true);
  };

  return (
    <>
      <h3>{demoName}</h3>
      <button onClick={handleOpen}>Open</button>
      {PortalContainer ? createPortal(<PopupWrapper isOpen={isOpen} handleClose={handleClose} />, PortalContainer) : null}
    </>
  );
};

export default PortalDemo;