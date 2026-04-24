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
          id: "api/sync-customer",
          label: "Customer Synchronization",
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
          label: "Hardware Binding",
          className: "api-method post",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
