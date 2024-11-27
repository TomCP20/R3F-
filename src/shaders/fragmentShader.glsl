uniform float uTime;
uniform vec2 uResolution;

#define MAX_STEPS 100
#define MAX_DIST 200.0
#define SURFACE_DIST 0.01
#define M_PI 3.1415926535897932384626433832795

vec3 repeat(vec3 p, float m)
{
    return mod(p, m) - vec3(m / 2.0);
}

float sdSphere(vec3 p, float radius)
{
    return length(p) - radius;
}

float sdSphereMod(vec3 p, float radius, float m)
{
    return sdSphere(repeat(p, m), radius);
}

float sdBox(vec3 p, vec3 b)
{
    vec3 q = abs(p) - b;
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

float maxcomp(vec2 p)
{
    return max(p.x, p.y);
}

float sdCross(vec3 p)
{
    float da = maxcomp(abs(p.xy));
    float db = maxcomp(abs(p.yz));
    float dc = maxcomp(abs(p.zx));
    return min(da, min(db, dc)) - 1.0;
}

float sdMenger(vec3 p, int iterations)
{
    float d = sdBox(p, vec3(1.0));
    float s = 1.0;
    for(int m = 0; m < iterations; m++)
    {
        vec3 a = mod(p * s, 2.0) - 1.0;
        s *= 3.0;
        vec3 r = 1.0 - 3.0 * abs(a);

        float c = sdCross(r) / s;
        d = max(d, c);
    }
    return d;
}

mat3 rotateX3D(float angle)
{
    float s = sin(angle);
    float c = cos(angle);
    return mat3(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, s, c);
}

mat3 rotateY3D(float angle)
{
    float s = sin(angle);
    float c = cos(angle);
    return mat3(c, 0.0, s, 0.0, 1.0, 0.0, -s, 0.0, c);
}

mat3 rotateZ3D(float angle)
{
    float s = sin(angle);
    float c = cos(angle);
    return mat3(c, -s, 0.0, s, c, 0.0, 0.0, 0.0, 1.0);
}

float scene(vec3 p)
{
    //return sdMenger(p, 4);
    return sdSphereMod(p, 1.0, 5.0);
}

float raymarch(vec3 ro, vec3 rd)
{
    float dO = 0.0;
    vec3 color = vec3(0.0);

    for(int i = 0; i < MAX_STEPS; i++)
    {
        vec3 p = ro + rd * dO;
        float dS = scene(p);

        dO += dS;

        if(dO > MAX_DIST || dS < SURFACE_DIST)
        {
            break;
        }
    }
    return dO;
}

vec3 getNormal(vec3 p)
{
    vec2 e = vec2(.01, 0);

    vec3 n = scene(p) - vec3(scene(p - e.xyy), scene(p - e.yxy), scene(p - e.yyx));

    return normalize(n);
}

float softShadows(vec3 ro, vec3 rd, float mint, float maxt, float k)
{
    float resultingShadowColor = 1.0;
    float t = mint;
    for(int i = 0; i < 50 && t < maxt; i++)
    {
        float h = scene(ro + rd * t);
        if(h < 0.001)
            return 0.0;
        resultingShadowColor = min(resultingShadowColor, k * h / t);
        t += h;
    }
    return resultingShadowColor;
}

vec3 getLookAtDir(vec2 uv, vec3 rayOrigin, vec3 lookAt)
{
    vec3 f = normalize(lookAt - rayOrigin);
    vec3 r = cross(vec3(0.0, 1.0, 0.0), f);
    vec3 u = cross(f, r);
    vec3 c = rayOrigin + f;
    vec3 i = c + uv.x * r + uv.y * u;
    return i - rayOrigin;
}

void main()
{
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    uv -= 0.5;
    uv.x *= uResolution.x / uResolution.y;

    vec3 rayOrigin = vec3(-10.0 * uTime, 10.0 * sin(uTime), 0.0);

    //vec3 rayDirection = getLookAtDir(uv, rayOrigin, vec3(0.0));
    vec3 rayDirection = rotateY3D(uTime) * normalize(vec3(uv, -1.0));

    float distance = raymarch(rayOrigin, rayDirection);
    vec3 p = rayOrigin + rayDirection * distance;

    vec3 color = vec3(0.0);

    if(distance < MAX_DIST)
    {
        vec3 normal = getNormal(p);
        color = normal * 0.5 + 0.5;
    }
    gl_FragColor = vec4(color, 1.0);
}