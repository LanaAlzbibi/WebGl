
async function readglTF(name) {
  let blob = await fetch(name).then(e => e.text());
  return JSON.parse(blob);
}

async function readglTFBin(name) {
  let blob = await fetch(name).then(e => e.arrayBuffer());
  return blob;
}


function output(indent, text) {
  let outi = "-";
  for (let i = 0; i < indent; i++)outi = "--" + outi;
  console.log(outi + text);
  let el = document.createElement("h" + (indent < 1 ? indent + 1 : 3));
  el.innerText = outi + text;
  document.body.append(el);
}
function createShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl, vertexShaderSource, fragmentShaderSource) {
  // create GLSL shaders, upload the GLSL source, compile the shaders
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}
