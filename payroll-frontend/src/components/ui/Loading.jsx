import { Spin } from 'antd';

const Loading = ({ tip = 'Loading...' }) => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh' 
  }}>
    <Spin tip={tip} size="large" />
  </div>
);

export default Loading;