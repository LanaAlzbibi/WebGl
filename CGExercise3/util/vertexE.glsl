attribute vec4 a_col;
attribute vec4 a_position;
varying vec4 v_col;
uniform float u_time;

void main() {
    // gl_Position is a special variable a vertex shader
    // is responsible for setting

   
    gl_Position = vec4(1.4*a_position.z*cos(u_time),1.4*a_position.y*cos(u_time),1.4*a_position.x*sin(u_time),1.0);
    v_col =  vec4(4.,6.,6.,1.0)*a_col;
    gl_PointSize = 1.0;


}