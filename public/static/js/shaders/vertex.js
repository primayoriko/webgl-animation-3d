const vertex = `
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

attribute vec4 vPosition;
attribute vec4 vColor;

attribute vec2 vTextCord;

varying vec4 fColor;

void main()
{
  gl_Position = projectionMatrix * modelViewMatrix * vPosition;
  fColor = vColor;
}
`;

export default vertex;
