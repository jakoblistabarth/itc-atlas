import { Meta, StoryObj } from "@storybook/react";
import { Canvas } from "@react-three/fiber";

import Book from ".";
import { Environment, OrbitControls } from "@react-three/drei";

const meta = {
  title: "Shapes/Book",
  component: Book,
  args: {
    color: "red",
    title: "Lorem ipsum",
    active: false,
  },
  parameters: {
    controls: {
      include: ["color"],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "100%", height: "500px" }}>
        <Canvas shadows orthographic camera={{ zoom: 500 }}>
          <OrbitControls makeDefault />
          <Environment preset="apartment" />
          <Story />
        </Canvas>
      </div>
    ),
  ],
} satisfies Meta<typeof Book>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const ActiveBook: Story = {
  args: {
    active: true,
  },
};
