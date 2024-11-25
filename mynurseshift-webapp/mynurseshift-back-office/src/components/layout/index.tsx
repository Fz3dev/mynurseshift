import React from "react";
import { Layout as AntdLayout } from "antd";
import { Header } from "./header";

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AntdLayout style={{ minHeight: "100vh" }}>
      <Header />
      <AntdLayout.Content
        style={{
          padding: "24px",
          minHeight: "calc(100vh - 64px)",
          backgroundColor: "#f5f5f5",
        }}
      >
        {children}
      </AntdLayout.Content>
    </AntdLayout>
  );
};
