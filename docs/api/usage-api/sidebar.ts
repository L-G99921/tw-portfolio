import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "api/usage-api/energygrid-usage-api",
    },
    {
      type: "category",
      label: "Customer",
      items: [
        {
          type: "doc",
          id: "api/usage-api/customer-login",
          label: "Log in a customer",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/usage-api/get-customer-info",
          label: "Get customer info",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/usage-api/get-budget",
          label: "Get the budget",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/usage-api/set-budget",
          label: "Set the budget",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/usage-api/get-home-profile",
          label: "Get the home profile",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/usage-api/update-home-profile",
          label: "Create a home profile",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Insights",
      items: [
        {
          type: "doc",
          id: "api/usage-api/get-dig-deeper",
          label: "Get the dig-deeper analysis",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/usage-api/get-main-uses-of-energy",
          label: "Get main uses of energy",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/usage-api/get-message-carousel",
          label: "Get message carousel items",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Similar Homes",
      items: [
        {
          type: "doc",
          id: "api/usage-api/get-similar-homes",
          label: "Compare with similar homes",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Usage",
      items: [
        {
          type: "doc",
          id: "api/usage-api/filter-usage",
          label: "Search usage data",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Metadata",
      items: [
        {
          type: "doc",
          id: "api/usage-api/get-thing-types",
          label: "List thing types",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/usage-api/get-thing-categories",
          label: "List thing categories",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/usage-api/get-granularity-types",
          label: "List granularity types",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/usage-api/get-property-types",
          label: "List property types",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/usage-api/get-metric-types",
          label: "List home profile metric types",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Rate Data",
      items: [
        {
          type: "doc",
          id: "api/usage-api/get-rate-groups",
          label: "List rate groups",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/usage-api/get-billing-cycle-dates",
          label: "Get billing cycle dates",
          className: "api-method get",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
