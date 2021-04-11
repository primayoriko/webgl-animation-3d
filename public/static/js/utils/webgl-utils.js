export function createShader(gl, type, source){
  const shader = gl.createShader(type);
  if (!shader) {
    throw new Error("Error on creating shader!");
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}

export function createProgram(gl, vertexSource, fragmentSource) {
  const program = gl.createProgram();
  if (!program) {
    throw new Error("Error on creating program!");
  }
  const vertShad = createShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragShad = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  gl.attachShader(program, vertShad);
  gl.attachShader(program, fragShad);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    alert(
      `Unable to initialize the shader program: ${gl.getProgramInfoLog(program)}
       Vertex: ${gl.getShaderInfoLog(vertShad)}
       Fragment: ${gl.getShaderInfoLog(fragShad)}
      `
    );
  }
  return program;
}