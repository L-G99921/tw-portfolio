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
          label: "Login",
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
          label: "Returns budget response",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/usage-api/set-budget",
          label: "Sets customer budget based on object data",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/usage-api/get-home-profile",
          label: "Gets customer home profile for given customer and site.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/usage-api/update-home-profile",
          label: "Creates customer home profile for values in request.",
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
          label: "Gets 'dig deeper' analysis.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/usage-api/get-main-uses-of-energy",
          label: "Retrieves main uses of energy for Customer Site",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/usage-api/get-message-carousel",
          label: "Returns message carousel items for given customer and site.",
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
          label: "Returns similar homes response",
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
          label: "Main usage search action.",
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
          label: "Returns thing types",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/usage-api/get-thing-categories",
          label: "Returns thing categories",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/usage-api/get-granularity-types",
          label: "Returns granularity types",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/usage-api/get-property-types",
          label: "Returns thing property types",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/usage-api/get-metric-types",
          label: "Home Profile Metric types",
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
          label: "Returns rate groups.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/usage-api/get-billing-cycle-dates",
          label: "Billing Cycle dates",
          className: "api-method get",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
