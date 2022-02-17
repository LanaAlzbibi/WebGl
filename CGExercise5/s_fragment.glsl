precision mediump float;
uniform sampler2D u_tex;
uniform float u_time;

varying vec4 col;
varying vec2 v_tex;


void main() {
    gl_FragColor = col + texture2D(u_tex, v_tex);

}