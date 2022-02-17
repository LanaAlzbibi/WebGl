function createBox(gl, scale) {
    var v_shader=`
    precision mediump float;
    uniform mat4 u_trans;
    uniform vec4 u_color;
    attribute vec4 a_position;
    attribute vec4 a_color;

    varying vec4 col;
void main() {
    vec4 pp = vec4(a_position.xyz,1);
    pp = u_trans * pp;
    gl_Position = pp;
    col = vec4(0.5*a_color.xyz,1.) + u_color;
}`;
var f_shader = `
precision mediump float;

varying vec4 col;
void main() {
    gl_FragColor = col;
}`;
    // Link the two shaders into a program
    var boxprogram = createProgram(gl, v_shader, f_shader);

    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    //from -1 to 1
    const s = scale || 1.0;
    const positions = [
        // Front face
        -s, -s, s,
        s, -s, s,
        s, s, s,
        -s, s, s,
    
        // Back face
        -s, -s, -s,
        -s, s, -s,
        s, s, -s,
        s, -s, -s,
    
        // Top face
        -s, s, -s,
        -s, s, s,
        s, s, s,
        s, s, -s,
    
        // Bottom face
        -s, -s, -s,
        s, -s, -s,
        s, -s, s,
        -s, -s, s,
    
        // Right face
        s, -s, -s,
        s, s, -s,
        s, s, s,
        s, -s, s,
    
        // Left face
        -s, -s, -s,
        -s, -s, s,
        -s, s, s,
        -s, s, -s,
        ];
            // This array defines each face as two triangles, using the
            // indices into the vertex array to specify each triangle's
            // position.
    
        const indices = [
        0, 1, 2, 0, 2, 3, // front
        4, 5, 6, 4, 6, 7, // back
        8, 9, 10, 8, 10, 11, // top
        12, 13, 14, 12, 14, 15, // bottom
        16, 17, 18, 16, 18, 19, // right
        20, 21, 22, 20, 22, 23, // left
        ];
    
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

var colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

const colors = [
    0.0,  0.0,  1.0,  1.0,    // untere Fläche: blau
    0.0,  0.0,  1.0,  1.0,    // untere Fläche: blau
    0.0,  0.0,  1.0,  1.0,    // untere Fläche: blau
    0.0,  0.0,  1.0,  1.0,    // untere Fläche: blau
    1.0,  0.0,  0.0,  1.0,    // hintere Fläche: rot
    1.0,  0.0,  0.0,  1.0,    // hintere Fläche: rot
    1.0,  0.0,  0.0,  1.0,    // hintere Fläche: rot
    1.0,  0.0,  0.0,  1.0,    // hintere Fläche: rot
    0.0,  1.0,  0.0,  1.0,    // obere Fläche: grün
    0.0,  1.0,  0.0,  1.0,    // obere Fläche: grün
    0.0,  1.0,  0.0,  1.0,    // obere Fläche: grün
    0.0,  1.0,  0.0,  1.0,    // obere Fläche: grün
    1.0,  1.0,  1.0,  1.0,    // vordere Fläche: weiß
    1.0,  1.0,  1.0,  1.0,    // vordere Fläche: weiß
    1.0,  1.0,  1.0,  1.0,    // vordere Fläche: weiß
    1.0,  1.0,  1.0,  1.0,    // vordere Fläche: weiß
    1.0,  1.0,  0.0,  1.0,    // rechte Fläche: gelb
    1.0,  1.0,  0.0,  1.0,    // rechte Fläche: gelb
    1.0,  1.0,  0.0,  1.0,    // rechte Fläche: gelb
    1.0,  1.0,  0.0,  1.0,    // rechte Fläche: gelb
    1.0,  0.0,  1.0,  1.0,     // linke Fläche: violett
    1.0,  0.0,  1.0,  1.0,     // linke Fläche: violett
    1.0,  0.0,  1.0,  1.0,     // linke Fläche: violett
    1.0,  0.0,  1.0,  1.0     // linke Fläche: violett
  ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    // This array defines each face as two triangles, using the
    // indices into the vertex array to specify each triangle's
    // position.


    // Now send the element array to GL



    function render(matrix) {
        gl.useProgram(boxprogram);
        var positionAttributeLocation = gl.getAttribLocation(boxprogram, "a_position");
        var colorAttributeLocation = gl.getAttribLocation(boxprogram, "a_color");

        if(colorAttributeLocation != -1){
            gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
            gl.enableVertexAttribArray(colorAttributeLocation);    
            gl.vertexAttribPointer(
                colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);
            }

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        // Turn on the attribute
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.vertexAttribPointer(
            positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

        // // draw
        //  var primitiveType = gl.TRIANGLES;
        //  var offset = 0;
        //  var count = 36;
        //  gl.drawArrays(primitiveType, offset, count);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        if(matrix){
            var transUniformLocation = gl.getUniformLocation(boxprogram, "u_trans");
            gl.uniformMatrix4fv(transUniformLocation, false,matrix);
        
        }
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
        gl.disableVertexAttribArray(positionAttributeLocation);
        gl.disableVertexAttribArray(colorAttributeLocation);
    };

    function cleanup() {
        gl.deleteBuffer(positionBuffer);
        gl.deleteBuffer(colorBuffer);
        gl.deleteBuffer(indexBuffer);
    };

    return {
        positionBuffer,
        indexBuffer,
        render,
        cleanup,
        program: boxprogram
    }
}
