import { Meta, StoryObj } from "@storybook/react";

import CountryCodeBadge from "./";

const meta = {
  title: "UI/CountryCodeBadge",
  component: CountryCodeBadge,
  args: {
    isoAlpha3Code: "NLD",
  },
  parameters: {
    mockData: [
      {
        url: "https://localhost:3000/api/data/country/NLD",
        method: "GET",
        status: 200,
        response: {
          data: {
            nameEn: "Netherlands",
          },
        },
      },
    ],
  },
} satisfies Meta<typeof CountryCodeBadge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultCountryCodeBadge: Story = {};
