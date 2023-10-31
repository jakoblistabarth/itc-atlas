export const vertexShader = /* glsl */ `
attribute lowp float displacement;
out float elevation;

void main() {
  elevation = displacement;
}
`;

export const fragmentShader = /* glsl */ `
in lowp float elevation;

vec3 GetCol(
  in float elevation,
  in vec3 color1,
  in vec3 color2,
  in float min_domain,
  in float max_domain) {
    float p = (elevation-abs(min_domain))/(abs(max_domain)-abs(min_domain));
    vec3 col = mix(color1, color2, p);
    return col;
}

void main() {
  float h1 = 20.0;
  float h2 = 600.0;
  float h3 = 800.0;
  float h4 = 1300.0;
  float h5 = 1800.0;
  float h6 = 3000.0;
  float h7 = 3300.0;

  vec3 c1 = vec3(1,1,0.5); // yellow
  vec3 c2 = vec3(.4,.6,0.4); // lightgreen
  vec3 c3 = vec3(0.2,0.3,0.2); // darkgreen
  vec3 c4 = vec3(0.25,0.3,0.2); // browngreen
  vec3 c5 = vec3(0.2,0.2,0.1); // brown
  vec3 c6 = vec3(0.5,0.5,0.6); // bluegrey
  vec3 c7 = vec3(1,1,1); // white

  vec3 col;

  if (elevation < 0.25) {
    vec3 color1 = vec3(0.0, 0.0, 0.25);
    vec3 color2 = vec3(0.6, 0.8, 1.0);
    col = GetCol(elevation, color1, color2, -4.8, .25);
  }
  else if (elevation < h2) {
    col = GetCol(elevation, c1, c2, h1, h2);
  }
  else if (elevation < h3) {
    col = GetCol(elevation, c2, c3, h2, h3);
  }
  else if (elevation < h4) {
    col = GetCol(elevation, c3, c4, h3, h4);
  }
  else if (elevation < h5) {
    col = GetCol(elevation, c4, c5, h4, h5);
  }
  else if (elevation < h6) {
    col = GetCol(elevation, c5, c6, h5, h6);
  }
  else {
    col = GetCol(elevation, c6, c7, h6, h7);
  }

  csm_DiffuseColor = vec4(col, 1.0);
}
`;
