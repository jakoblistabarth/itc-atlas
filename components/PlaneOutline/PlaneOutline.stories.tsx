import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Meta, StoryObj } from "@storybook/react";
import PlaneOutline from ".";

const meta = {
  title: "Shapes/PlaneOutline",
  component: PlaneOutline,
  args: {
    color: "red",
    lineWidth: 1,
    side: 5,
  },
  argTypes: {
    color: { control: { type: "color" } },
  },
  decorators: [
    (Story) => {
      return (
        <div style={{ width: "100%", height: "500px" }}>
          <Canvas
            orthographic
            camera={{ position: [0, 0, 20], zoom: 100 }}
            shadows
          >
            <axesHelper />
            <Story />
            <OrbitControls enablePan={false} />
          </Canvas>
        </div>
      );
    },
  ],
} satisfies Meta<typeof PlaneOutline>;
export default meta;
type Story = StoryObj<typeof meta>;

export const SquarePlane: Story = {};

export const PlaneWithStrongOutline: Story = {
  args: {
    lineWidth: 5,
    color: "blue",
  },
};
