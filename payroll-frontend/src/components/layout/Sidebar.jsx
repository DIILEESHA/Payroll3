import { Layout, Menu, theme } from "antd";
import {
  DashboardOutlined,
  TeamOutlined,
  DollarOutlined,
  TransactionOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

const { Sider } = Layout;

const AppSidebar = ({ collapsed }) => {
  const location = useLocation();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const items = [
    {
      key: "1",
      icon: <DashboardOutlined />,
      label: <Link to="/">Dashboard</Link>,
    },
    {
      key: "2",
      icon: <TeamOutlined />,
      label: <Link to="/employees">Employees</Link>,
    },
    {
      key: "3",
      icon: <DollarOutlined />,
      label: <Link to="/payroll">Payroll</Link>,
    },
    {
      key: "4",
      icon: <TransactionOutlined />,
      label: <Link to="/finance">Finance</Link>,
    },
  ];

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={250}
      style={{
        background: colorBgContainer,
      }}
    >
      <div
        className="demo-logo-vertical"
        style={{
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          fontWeight: "bold",
        }}
      >
        {collapsed ? "PS" : "Payroll System"}
      </div>
      <Menu
        theme="light"
        mode="inline"
        selectedKeys={[
          items.find((item) => location.pathname === item.label.props.to)
            ?.key || "1",
        ]}
        items={items}
      />
    </Sider>
  );
};

export default AppSidebar;
