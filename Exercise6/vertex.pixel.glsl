precision mediump float;

attribute vec4 a_position;
attribute vec4 a_color;
attribute vec4 a_normal;

attribute vec2 a_texcoords;

uniform float u_time;
uniform mat4 u_mvp;
uniform mat4 u_wco;


varying vec2 v_tex;

void main() {
    gl_Position = u_mvp * a_position;
    v_tex = a_texcoords;
}