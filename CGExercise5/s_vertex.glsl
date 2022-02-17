precision mediump float;

attribute vec4 a_position;
attribute vec4 a_color;
attribute vec4 a_normal;

attribute vec2 a_texcoords;

uniform float u_time;
uniform mat4 u_matrix;
uniform vec4 u_color;


varying vec4 col;
varying vec2 v_tex;
    
void main() {
    //gl_Position = a_position;
    gl_Position = u_matrix * a_position;
    col = u_color + a_color;
    v_tex = a_texcoords;
}