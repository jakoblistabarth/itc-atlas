import { ComponentMeta, ComponentStory } from "@storybook/react";
import { geoBertin1953 } from "d3-geo-projection";
import Graticules from "../components/map/Graticules";
import MapLayout from "../components/map/layout/MapLayout";
import MapLayoutBody from "../components/map/layout/MapLayoutBody";
import themes from "../lib/styles/themes";
import projections, {
  getProjectionNames,
} from "../lib/utilities/getProjections";

export default {
  title: "Map Layers/Graticules",
  component: Graticules,
  argTypes: {
    theme: {
      options: Array.from(themes.keys()),
      mapping: Object.fromEntries(themes),
      control: {
        type: "select",
      },
    },
    projection: {
      options: getProjectionNames(),
      mapping: projections,
      control: {
        type: "select",
      },
    },
  },
  decorators: [
    (Story) => (
      <MapLayout
        projection={defaultArgs.projection}
        bounds={defaultArgs.bounds}
      >
        <MapLayoutBody bounds={defaultArgs.bounds}>
          <Story />
        </MapLayoutBody>
      </MapLayout>
    ),
  ],
} as ComponentMeta<typeof Graticules>;

const defaultArgs = {
  bounds: {
    width: 1000,
  },
  projection: geoBertin1953(),
};

const Template: ComponentStory<typeof Graticules> = (args) => {
  return <Graticules {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  projection: geoBertin1953(),
};
