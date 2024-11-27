uniform float uTime;
uniform vec2 uResolution;

#define MAX_STEPS 100
#define MAX_DIST 100.0
#define SURFACE_DIST 0.01
#define M_PI 3.1415926535897932384626433832795

float sdSphere(vec3 p, float radius)
{
    return length(p) - radius;
}

float sdSphereMod(vec3 p, float radius, float m)
{
    p = mod(p, m)-vec3(m/2.0);
    return length(p) - radius;
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

void main()
{
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    uv -= 0.5;
    uv.x *= uResolution.x / uResolution.y;

    // Light Position
    vec3 lightPosition = rotateY3D(-M_PI / 5.0) * vec3(10.0, 10.0, 10.0);

    vec3 rayOrigin = vec3(0.0, 1.5, 4.0);

    vec3 lookAt = vec3(0.0);
    vec3 f = normalize(lookAt - rayOrigin);
    vec3 r = cross(vec3(0.0, 1.0, 0.0), f);
    vec3 u = cross(f, r);

    vec3 c = rayOrigin + f;
    vec3 i = c + uv.x * r + uv.y * u;
    vec3 rayDirection = i - rayOrigin;

    float distance = raymarch(rayOrigin, rayDirection);
    vec3 p = rayOrigin + rayDirection * distance;

    vec3 color = vec3(0.0);


    int material_type = 0;
    if(distance < MAX_DIST)
    {
        if (material_type == 0)
        {
            vec3 normal = getNormal(p);
            color = normal * 0.5 + 0.5;
        }
        else if (material_type == 1)
        {
            vec3 normal = getNormal(p);
            vec3 lightDirection = normalize(lightPosition - p);
            float diffuse = max(dot(normal, lightDirection), 0.0);
            float shadows = softShadows(p, lightDirection, 0.1, 5.0, 64.0);
            color = vec3(1.0) * diffuse * shadows;
        }
        else
        {
            color = vec3(1.0);
        }
    }
    gl_FragColor = vec4(color, 1.0);
}