import { forwardRef } from "react";
import { Abstract } from "lamina/vanilla";
import { LayerProps } from "lamina/types";
import { Node, extend } from "@react-three/fiber";

interface CustomLayerProps extends LayerProps {
  sideHalf?: number;
  zOffset?: number;
  yScale?:number;
}

class CustomLayer extends Abstract {
  // Define stuff as static properties!
  // Uniforms: Must begin with prefix "u_".
  // Assign them their default value.
  // Any uniforms here will automatically be set as properties on the class as setters and getters.
  // There are setters and getters will update the underlying uniforms.
  static u_sideHalf=0.0;
  static u_zOffset=0.0;
  static u_yScale=0.0;

  // Define your fragment shader just like you already do!
  // Only difference is, you must return the final color of this layer
  static fragmentShader = /*glsl*/ `
  varying vec3 v_Vertex;
  varying highp float v_height;
  varying vec2 v_XY;
  uniform highp float u_sideHalf;
  void main() {
    //Cold-humid regions
    float gradient[12]=float[12](-400.0,0.0,50.0,200.0,600.0,1000.0,2000.0,3000.0,4000.0,5000.0,6000.0,7000.0);
    vec3 Color;
    if(v_height<=(gradient[0]+gradient[1])/2.0){
       Color=vec3(112.0,147.0,141.0)/256.0;
    }
    if((gradient[0]+gradient[1])/2.0<v_height&&v_height<=(gradient[1]+gradient[2])/2.0){
       Color=vec3(120.0,159.0,152.0)/256.0;
    }
    if((gradient[1]+gradient[2])/2.0<v_height&&v_height<=(gradient[2]+gradient[3])/2.0){
      Color=vec3(130.0,165.0,159.0)/256.0;
    }
    if((gradient[2]+gradient[3])/2.0<v_height&&v_height<=(gradient[3]+gradient[4])/2.0){
      Color=vec3(145.0,177.0,171.0)/256.0;
    }
    if((gradient[3]+gradient[4])/2.0<v_height&&v_height<=(gradient[4]+gradient[5])/2.0){
      Color=vec3(180.0,192.0,180.0)/256.0;
    }
    if((gradient[4]+gradient[5])/2.0<v_height&&v_height<=(gradient[5]+gradient[6])/2.0){
      Color=vec3(212.0,201.0,180.0)/256.0;
    }
    if((gradient[5]+gradient[6])/2.0<v_height&&v_height<=(gradient[6]+gradient[7])/2.0){
      Color=vec3(212.0,184.0,163.0)/256.0;
    }
    if((gradient[6]+gradient[7])/2.0<v_height&&v_height<=(gradient[7]+gradient[8])/2.0){
      Color=vec3(212.0,193.0,179.0)/256.0;
    }
    if((gradient[7]+gradient[8])/2.0<v_height&&v_height<=(gradient[8]+gradient[9])/2.0){
      Color=vec3(212.0,207.0,204.0)/256.0;
    }
    if((gradient[8]+gradient[9])/2.0<v_height&&v_height<=(gradient[9]+gradient[10])/2.0){
      Color=vec3(220.0,220.0,220.0)/256.0;
    }
    if((gradient[9]+gradient[10])/2.0<v_height&&v_height<=(gradient[10]+gradient[11])/2.0){
      Color=vec3(235.0,235.0,237.0)/256.0;
    }
    if((gradient[10]+gradient[11])/2.0<v_height){
      Color=vec3(245.0,245.0,245.0)/256.0;
    }
    //Assign same color to 4 sides
    if ( v_XY.x == u_sideHalf || v_XY.x == -u_sideHalf || v_XY.y == u_sideHalf || v_XY.y == -u_sideHalf ) {
       Color=vec3(0.0,0.0,0.0);
    }
    //normal vector
     vec3 N = normalize( cross( dFdx( v_Vertex ), dFdy( v_Vertex ) ) );
    // arbitrary direction of the light
     const vec3 lightDir = vec3( 1., 0., -1. );
     vec3 L = normalize( lightDir );
     vec3 diffuse = Color * max( dot( N, -L) , 0.0 );
     vec4 f_FragColor = vec4(diffuse, 1.0 );
     return f_FragColor;
  }
  `;
  // Optionally Define a vertex shader!
  // Same rules as fragment shaders, except no blend modes.
  // Return a non-transformed vec3 position.
  static vertexShader = /*glsl*/ `
  attribute highp float displacement;
  varying vec3 v_Vertex;
  varying  float v_height;
  varying vec2 v_XY;
  uniform  float u_sideHalf;
  uniform  float u_zOffset;
  uniform  float u_yScale;
  void main() {
    vec3 p = position;
    if ( p.x < u_sideHalf && p.x > -u_sideHalf && p.y < u_sideHalf && p.y > -u_sideHalf) {
      p = p + vec3(0,0,u_zOffset + displacement * u_yScale);
    }
    v_height=displacement;
    v_Vertex = ( modelViewMatrix * vec4(p, 1. ) ).xyz;
    v_XY=p.xy;
    return p;
  }
  `;

  constructor(props?: CustomLayerProps) {
    super(CustomLayer, {
      name: "CustomLayer",
      ...props,
    });
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      customLayer_: Node<CustomLayer, typeof CustomLayer>;
    }
  }
}

extend({ CustomLayer_: CustomLayer });

const CustomLayerComponent = forwardRef<CustomLayer, CustomLayerProps>((props, ref) => {
  return <customLayer_ ref={ref} {...props} />;
}) as React.ForwardRefExoticComponent<
  CustomLayerProps & React.RefAttributes<CustomLayer>
>;

export default CustomLayerComponent;
