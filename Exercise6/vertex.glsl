precision mediump float;

attribute vec4 a_position;
attribute vec4 a_positionOfSurface;
attribute vec4 a_normal;

attribute vec4 a_light;

attribute vec2 a_texcoords;

uniform float u_time;
uniform mat4 u_mvp;
uniform mat4 u_wco;
uniform vec3 u_light;


varying vec2 v_tex;
varying float bright;

uniform vec3 u_surface;
    
void main() {
  

     vec4 normal = normalize(a_normal);
     float light = dot(normal, a_position);
    
    bright += 0.15 * light   ; //DS Add diffuse lighting calculation here
    gl_Position = u_mvp * a_position  ;
    v_tex = a_texcoords ;
}