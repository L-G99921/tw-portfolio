import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "api/powerbox-api",
    },
    {
      type: "category",
      label: "Customer",
      items: [
        {
          type: "doc",
          id: "api/customer-login",
          label: "Log in a customer",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/sync-customer",
          label: "Sync a customer",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Hardware",
      items: [
        {
          type: "doc",
          id: "api/bind-device",
          label: "Bind or unbind a device",
          className: "api-method post",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
