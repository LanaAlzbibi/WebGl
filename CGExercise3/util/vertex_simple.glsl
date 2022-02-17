attribute vec4 a_col;
attribute vec4 a_position;

varying vec4 v_col;

void main() {
    // gl_Position is a special variable a vertex shader
    // is responsible for setting
    gl_Position = vec4(a_position.xyz,1.0);
    v_col = a_col;
}