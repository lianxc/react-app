import { Button } from 'antd-mobile'

function AntdComponent() {
  return (
    <Button 
      color='primary'  // 'primary' | 'success' | 'danger' | 'warning'
      onClick={() => alert('点击了按钮')}
    >
      主要按钮
    </Button>
  )
}

export default AntdComponent;