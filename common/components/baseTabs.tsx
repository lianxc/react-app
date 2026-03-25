import React, { useState, ReactNode } from 'react';
import './baseTabs.css';

export interface TabItem {
  key: string;
  label: string;
  disabled?: boolean;
  children: ReactNode;
}

export interface BaseTabsProps {
  items: TabItem[];
  defaultActiveKey?: string;
  activeKey?: string;
  onChange?: (key: string) => void;
  className?: string;
  style?: React.CSSProperties;
  tabPosition?: 'top' | 'bottom';
}

const BaseTabs: React.FC<BaseTabsProps> = ({
  items,
  defaultActiveKey,
  activeKey: controlledActiveKey,
  onChange,
  className = '',
  style,
  tabPosition = 'top',
}) => {
  const [internalActiveKey, setInternalActiveKey] = useState<string>(
    defaultActiveKey || items[0]?.key || ''
  );

  const isControlled = controlledActiveKey !== undefined;
  const currentActiveKey = isControlled ? controlledActiveKey : internalActiveKey;

  const handleTabClick = (key: string, disabled?: boolean) => {
    if (disabled) return;
    if (!isControlled) {
      setInternalActiveKey(key);
    }
    onChange?.(key);
  };

  const activeTab = items.find((item) => item.key === currentActiveKey);

  const tabsContent = (
    <div className="base-tabs-nav">
      {items.map((item) => (
        <div
          key={item.key}
          className={`base-tabs-tab ${
            item.key === currentActiveKey ? 'base-tabs-tab-active' : ''
          } ${item.disabled ? 'base-tabs-tab-disabled' : ''}`}
          onClick={() => handleTabClick(item.key, item.disabled)}
        >
          {item.label}
        </div>
      ))}
    </div>
  );

  return (
    <div className={`base-tabs ${className}`} style={style}>
      {tabPosition === 'top' && tabsContent}
      <div className="base-tabs-content">
        {activeTab && (
          <div
            key={activeTab.key}
            className="base-tabs-panel"
          >
            {activeTab.children}
          </div>
        )}
      </div>
      {tabPosition === 'bottom' && tabsContent}
    </div>
  );
};

export default BaseTabs;

