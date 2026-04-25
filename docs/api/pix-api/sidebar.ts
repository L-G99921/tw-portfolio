import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "api/pix-api/instant-payments-api-pix-sample",
    },
    {
      type: "category",
      label: "Charges",
      items: [
        {
          type: "doc",
          id: "api/pix-api/create-charge",
          label: "Create an immediate charge",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "api/pix-api/get-charge",
          label: "Retrieve a charge",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/pix-api/update-charge",
          label: "Update a charge",
          className: "api-method patch",
        },
      ],
    },
    {
      type: "category",
      label: "Received payments",
      items: [
        {
          type: "doc",
          id: "api/pix-api/get-received-pix",
          label: "Retrieve a received PIX",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Webhooks",
      items: [
        {
          type: "doc",
          id: "api/pix-api/register-webhook",
          label: "Register a webhook for a PIX key",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "api/pix-api/get-webhook",
          label: "Retrieve the webhook for a PIX key",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/pix-api/delete-webhook",
          label: "Remove the webhook for a PIX key",
          className: "api-method delete",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
