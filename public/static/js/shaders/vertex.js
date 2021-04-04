const vertex = `
attribute  vec4 vPosition;
attribute  vec2 vTextCord;
attribute  vec4 vColor;

varying vec4 fColor;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
//varying vec2 fTextCord;
void main()
{
  gl_Position = projectionMatrix * modelViewMatrix * vPosition;
  fColor = vColor;
  //  fTextCord = vTextCord;
}
`;

export default vertex;
