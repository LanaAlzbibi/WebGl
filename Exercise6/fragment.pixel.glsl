precision mediump float;
uniform sampler2D u_tex;

uniform float u_time;
uniform float u_diffuse;
uniform float u_specular;
uniform float u_ambient;
uniform vec3 u_light; // Light Position
uniform vec3 u_cam; // Camera Position

varying vec2 v_tex;
//DS more varying needed

vec4 phong(vec3 lightPos, vec3 surfacePos, vec3 surfaceNormal, vec4 lightColor, vec3 cameraPosition, vec3 surfaceColor){
    vec3 lightDir = lightPos - surfacePos;
    return dot(lightDir, surfaceNormal)*lightColor; // DS DO MORE HERE for full PHONG! + .... do not use LightColor like thiss;
  }

void main() {
    vec4 tex = texture2D(u_tex, v_tex);
    gl_FragColor = vec4(tex.rgb,1) ; //DS use phong result here
}