import { Button, Space, CenterPopup } from 'antd-mobile'
import { createBEM } from '@/utils/bem';
import { useState } from 'react';
import './index.scss'

export default function Antd() {
  const { b, e } = createBEM('antd');
  const [visible, setVisible] = useState(false);

  return (
    <div className={b()}>
      <Space wrap>
        <Button className={e('button1')} color='primary' fill='solid' onClick={() => setVisible(true)}>
          Solid
        </Button>
        <Button className={e('button2')} color='primary' fill='outline'>
          Outline
        </Button>
        <Button className={e('button3')} color='primary' fill='none'>
          None
        </Button>
      </Space>

      <CenterPopup
        visible={visible}
        showCloseButton
        onClose={() => {
          setVisible(false)
        }}
        onMaskClick={() => {
          setVisible(false)
        }}
      >
        <div className={e('popup-content')}>Hello</div>
      </CenterPopup>
    </div>
  )
}