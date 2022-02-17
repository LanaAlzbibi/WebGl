function createShader(global, type, source) {
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

function disableAttribute(locationName) {
    var attributeLocation = gl.getAttribLocation(program, locationName);
    if (attributeLocation == -1) return; //Not found in shader!
    gl.disableVertexAttribArray(attributeLocation);
}

function activateAttribute(prim, name, acc) {
    let off = acc.bufferView.byteOffset || 0;
    let target = acc.bufferView.target || gl.ARRAY_BUFFER;
    let posRef = gl.getAttribLocation(program, name);
    if (posRef == -1) return;
    gl.bindBuffer(target, acc.bufferView.glBuffer); // DS Besonders
    gl.vertexAttribPointer(posRef, accTypeSize[acc.type], acc.componentType, false, acc.bufferView.byteStride, acc.byteOffset || 0);
    gl.enableVertexAttribArray(posRef);
}
function searchNode(node, name) {
    if (node.name == name) return node;
    if (node.children) for (let n of node.children) {
        let res = searchNode(n, name);
        if (res) return res;
    }
}
function searchScene(name) {
    let scene = gltf.scene;
    for (let n of scene.nodes) {
        let node = searchNode(n, name);
        if (node) return node;
    }
}

function initScene() {
    let scene = gltf.scene = gltf.scenes[gltf.scene];
    for (let i in scene.nodes) {
        scene.nodes[i] = gltf.nodes[scene.nodes[i]];
        initNode(scene.nodes[i]);
    }
}
function initNode(node) {
    if (node.mesh != undefined) {
        node.mesh = gltf.meshes[node.mesh];
        initMesh(node.mesh);
    }
    if (!node.matrix) {
        node.matrix = glMatrix.mat4.create();
        if (node.scale) {
            glMatrix.mat4.fromScaling(node.matrix, node.scale);
            //node.scale = undefined;
        }
        if (node.rotation) {
            let rotmatrix = glMatrix.mat4.fromQuat(glMatrix.mat4.create(), node.rotation);
            glMatrix.mat4.multiply(node.matrix, rotmatrix, node.matrix);
            //node.rotation = undefined;
        }
        if (node.translation) {
            let transmatrix = glMatrix.mat4.fromTranslation(glMatrix.mat4.create(), node.translation);
            glMatrix.mat4.multiply(node.matrix, transmatrix, node.matrix);
            //node.translation = undefined;
        }
    }

    //DS Add code to recursively add node children
    if (!node.children) return;

    for (let i in node.children) {
        node.children[i] = gltf.nodes[node.children[i]];
        initNode(node.children[i]);
    }
}
function initMesh(mesh) {
    for (let p of mesh.primitives) {
        initPrimitive(p);
    }
}
function initPrimitive(prim) {
    let acc = prim.indices = gltf.accessors[prim.indices];
    let view = acc.bufferView = initBufferView(acc.bufferView, gl.ELEMENT_ARRAY_BUFFER);
    let material = prim.material = gltf.materials[prim.material];
    if (material.pbrMetallicRoughness.baseColorTexture) {
        if (!material.pbrMetallicRoughness.baseColorTexture.index.source) {
            material.pbrMetallicRoughness.baseColorTexture.index = gltf.textures[material.pbrMetallicRoughness.baseColorTexture.index];
            material.pbrMetallicRoughness.baseColorTexture.index.source = gltf.images[material.pbrMetallicRoughness.baseColorTexture.index.source];
        }
        let image = material.pbrMetallicRoughness.baseColorTexture.index.source;
        gl.bindTexture(gl.TEXTURE_2D, image.glTex);

    }
    if (prim.attributes.POSITION != undefined) {
        prim.attributes.POSITION = gltf.accessors[prim.attributes.POSITION];
        initAttribute(prim.attributes.POSITION);
    }
    if (prim.attributes.NORMAL != undefined) {
        prim.attributes.NORMAL = gltf.accessors[prim.attributes.NORMAL];
        initAttribute(prim.attributes.NORMAL);
    }
    if (prim.attributes.COLOR_0 != undefined) {
        prim.attributes.COLOR_0 = gltf.accessors[prim.attributes.COLOR_0];
        initAttribute(prim.attributes.COLOR_0);
    }
    if (prim.attributes.TEXCOORD_0 != undefined) {
        prim.attributes.TEXCOORD_0 = gltf.accessors[prim.attributes.TEXCOORD_0];
        initAttribute(prim.attributes.TEXCOORD_0);
    }
}
function initBufferView(view, deftype) {
    //DS Besonders, bufferview 2 wurde mehrfach verwendet
    if (!Number.isInteger(view)) return view;
    view = gltf.bufferViews[view];
    let off = view.byteOffset || 0;
    if (!view.buffer.bdata) {
        view.buffer = gltf.buffers[view.buffer];
    }
    let target = view.target || deftype;
    let data = view.buffer.bdata.slice(off, off + view.byteLength);
    view.glBuffer = makeBuffer(gl, target, data);
    return view;
}
function initAttribute(acc) {
    acc.bufferView = initBufferView(acc.bufferView, gl.ARRAY_BUFFER);
}

function renderScene() {
    let scene = gltf.scene;
    for (let i in scene.nodes) {
        renderNode(scene.nodes[i], glMatrix.mat4.create());
    }
}
function renderNode(node, parentMatrix) {
    let worldmatrix;
    if (node.matrix) {
        worldmatrix = glMatrix.mat4.clone(node.matrix);
        if (node.updateMatrix) node.updateMatrix(worldmatrix);

    } else worldmatrix = glMatrix.mat4.create();

    glMatrix.mat4.multiply(worldmatrix, parentMatrix, worldmatrix);
    if (node.mesh) {
        renderMesh(node.mesh, worldmatrix);
    }
    //DS Add code to render children here
    if (!node.children) return;

    for (let c of node.children) {
        renderNode(c, worldmatrix);
    }
}
function renderMesh(mesh, matrix) {
    for (let p of mesh.primitives) {
        renderPrimitive(p, matrix);
    }
}
