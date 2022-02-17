
async function readglTF(name) {
  let blob = await fetch(name).then(e => e.text());
  return JSON.parse(blob);
}

async function readglTFBin(name) {
  let blob = await fetch(name).then(e => e.arrayBuffer());
  return blob;
}

//from https://github.com/AnalyticalGraphicsInc/gltf-utilities
var dataUriRegex = /^data:(.*?)(;base64)?,(.*)$/;
function decodeDataUriText(isBase64, data) {
  var result = decodeURIComponent(data);
  if (isBase64) {
    return atob(result);
  }
  return result;
}

function decodeDataUriArrayBuffer(url) {
  var dataUriRegexResult = dataUriRegex.exec(url);
  var data = dataUriRegexResult[3];
  var byteString = decodeDataUriText(true, data);
  var buffer = new ArrayBuffer(byteString.length);
  var view = new Uint8Array(buffer);
  for (var i = 0; i < byteString.length; i++) {
    view[i] = byteString.charCodeAt(i);
  }
  return view.buffer;
}

function makeBuffer(gl, type, data) {
  var pBuffer = gl.createBuffer();
  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(type, pBuffer);
  gl.bufferData(type, data, gl.STATIC_DRAW);
  return pBuffer;
}

function makeTexture(gl,imgSrc, path) {
  if (imgSrc.glTex) return; //DS Already done
  var texture = gl.createTexture();
  imgSrc.glTex = texture;

  var img = new Image();
  img.crossOrigin = "";
  img.addEventListener('load', function () {
    imgSrc.width = img.width;
    imgSrc.height = img.height;

    gl.bindTexture(gl.TEXTURE_2D, imgSrc.glTex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.generateMipmap(gl.TEXTURE_2D);
  });
  img.src = path + imgSrc.uri;
  return imgSrc.glTex;
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
