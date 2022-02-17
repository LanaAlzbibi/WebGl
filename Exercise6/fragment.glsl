precision mediump float;
uniform sampler2D u_tex;
uniform float u_time;

varying float bright;
varying vec2 v_tex;


void main() {
    
    vec4 tex = texture2D(u_tex, v_tex);
    gl_FragColor = vec4( bright *  tex.rgb, tex.a ); //DS introduce "bright" here, do NOT modify alpha with bright!
    

}