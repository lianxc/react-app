import React, { useState } from 'react'
import Tabs from '../Tabs'
import Popup from '../Popup'
import Button from '../Button'
import TabBlock from '../TabBlock'
import BackTop from '../BackTop'
import BaseInput from '../BaseInput'
import Base from '../Base'
import boxNoTitle from "@/assets/img/common/box-has-title.png"
import boxMiddle from "@/assets/img/common/box-middle.png"
import boxBottom from "@/assets/img/common/box-bottom.png"
import styles from './index.module.scss'

interface AnnualProps {
  demoName: string
}

const Tab1: React.FC = () => {
  const [visible, setVisible] = useState(false)
  const [visible2, setVisible2] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [isComposing, setIsComposing] = useState(false)

  const handleInputChange = (value: string) => {
    console.log('value', value, typeof value)
    if (isComposing) {
      return
    }
    const isNumber = /^[0-9]*$/.test(value)
    const maxValue = 1000;
    if (!isNumber) {
      return
    }
    if (Number(value) > maxValue) {
      setInputValue(maxValue.toString());
    } else {
      setInputValue(value);
    }
  }

  const handleCompositionStart = () => {
    console.log('handleCompositionStart')
    setIsComposing(true)
  }
  const handleCompositionEnd = () => {
    console.log('handleCompositionEnd')
    setIsComposing(false)
    handleInputChange(inputValue)
  }

  return (
    <div styleName="tab1-wrapper">
      <BaseInput
        styleName="input-1"
        type="text"
        placeholder="Please enter your name"
        value={inputValue}
        onChange={handleInputChange}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
      />
      <BaseInput
        styleName="input-1"
        type="text"
        disabled={true}
        placeholder="Please enter your name"
        value={inputValue}
        onChange={handleInputChange}
      />
      <Button onClick={() => setVisible(true)}>Open Popup1</Button>
      <Button onClick={() => setVisible2(true)}>Open Popup2</Button>
      <Popup
        className="popup-1"
        visible={visible}
        destroyOnClose={false}
        onClose={() => setVisible(false)}
      >
        <div>Popup1</div>
      </Popup>

      <Popup
        className="popup-2"
        position="bottom"
        visible={visible2}
        destroyOnClose={true}
        onClose={() => setVisible2(false)}
      >
        <div>Popup2</div>
      </Popup>
    </div>
  )
}
const Tab2: React.FC = () => {
  return (
    <div styleName="tab2-wrapper">
      <TabBlock
        className={styles['tab2-block-main']}
        type="block"
        renderTitle={<div className={styles['tab2-block-title']}>Monthly</div>}
        topImg={boxNoTitle}
        centerImg={boxMiddle}
        endImg={boxBottom}
      >
        <div styleName="tab2-content">Tab2</div>
      </TabBlock>
    </div>
  )
}
const Tab3: React.FC = () => {
  return (
    <div styleName="tab3-wrapper">
      <Base />
    </div>
  )
}
const Annual = ({ demoName }: AnnualProps) => {
  const tabs = [
    {
      title: 'Annual',
      content: <Tab1 />
    },
    {
      title: 'Monthly',
      content: <Tab2 />
    },
    {
      title: 'base',
      content: <Tab3 />
    }
  ]

  return (
    <>
      <Tabs tabs={tabs} defaultActiveIndex={0} onChange={() => {}} />
      <BackTop />
    </>
  )
}

export default Annual