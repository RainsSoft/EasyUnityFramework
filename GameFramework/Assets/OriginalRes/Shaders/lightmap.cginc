
//-------------------------------------------------------------------------------
// 普通的Lightmap，不带光照
//-------------------------------------------------------------------------------
struct appdata_t 
{
	float4 vertex 		: POSITION;
	half2  uv_main 		: TEXCOORD0;
	
	#ifdef CUSTOM_LIGHTMAP_ON
	half2  uv_lightmap 	: TExCOORD1;
	#endif
};

struct v2f_lightmap
{
	float4 vertex 		: SV_POSITION;
	half2  uv_main 		: TEXCOORD0;
	
	#ifdef CUSTOM_LIGHTMAP_ON
	half2  uv_lightmap 	: TExCOORD1;
	#endif
};

uniform sampler2D _MainTex;
#if ETC1_TEXTURE_ON
uniform sampler2D _MainTex_Alpha;
#endif

#ifdef CUSTOM_LIGHTMAP_ON
uniform sampler2D _LightMap;
#endif

half4 _MainTex_ST;

#ifdef CUSTOM_LIGHTMAP_ON
half4 _LightMap_ST;
#endif

v2f_lightmap vert_lightmap(appdata_t v)
{
	v2f_lightmap o;
	
	o.vertex = mul(UNITY_MATRIX_MVP, v.vertex);
	o.uv_main = TRANSFORM_TEX(v.uv_main, _MainTex);
	
	#ifdef CUSTOM_LIGHTMAP_ON
	o.uv_lightmap = TRANSFORM_TEX(v.uv_lightmap, _LightMap);
	#endif
	
	return o;
}

#ifdef CUSTOM_LIGHTMAP_ON
uniform half _BlendRatio;
#endif

fixed4 frag_lightmap (v2f_lightmap f) : COLOR
{
	fixed4 c = tex2D (_MainTex, f.uv_main);

	#ifdef CUSTOM_LIGHTMAP_ON
	c.rgb *= _BlendRatio;
	
	fixed3 l = tex2D(_LightMap, f.uv_lightmap).rgb;
	c.rgb *= l;
	#endif
	
	return c;
}

fixed4 frag_lightmap_alpha (v2f_lightmap f) : COLOR
{
	fixed4 c = tex2D (_MainTex, f.uv_main);
	#if ETC1_TEXTURE_ON
	c.a = tex2D (_MainTex_Alpha, f.uv_main);
	#endif

	#ifdef CUSTOM_LIGHTMAP_ON
	c.rgb *= _BlendRatio;
	
	fixed3 l = tex2D(_LightMap, f.uv_lightmap).rgb;
	c.rgb *= l;
	#endif
	
	return c;
}




//----------------------------------------------------------------------------------------
// 带点光源的Lightmap
//----------------------------------------------------------------------------------------
struct appdata_t1 
{
    float4 vertex       : POSITION;
    fixed3 normal       : NORMAL;
    half2  uv_main      : TEXCOORD0;
    
    #ifdef CUSTOM_LIGHTMAP_ON
    half2  uv_lightmap  : TExCOORD1;
    #endif
};

struct v2f_lightmap1
{
    float4 vertex       : SV_POSITION;
    half2  uv_main      : TEXCOORD0;
    
    #ifdef CUSTOM_LIGHTMAP_ON
    half2  uv_lightmap  : TEXCOORD1;
    #endif

    fixed4 color        : COLOR;
};

uniform fixed4 _PointLightingColor;
uniform float4 _PointLightingPosition;
uniform float  _PointLightingInstensity; 
uniform float  _PointLightingRangeRadius;

v2f_lightmap1 vert_lightmap_pointlight(appdata_t1 v)
{
	v2f_lightmap1 o;
	
	o.vertex = mul(UNITY_MATRIX_MVP, v.vertex);
	o.uv_main = v.uv_main;
	#ifdef CUSTOM_LIGHTMAP_ON
	o.uv_lightmap = v.uv_lightmap;
	
	float3 posW	= mul( _Object2World, v.vertex ).xyz;
	
	float3 lightVec = _PointLightingPosition.xyz - posW;
	float d = length(lightVec);
	
	fixed4 diffCol = _PointLightingColor * _PointLightingInstensity * 0.5;	//diff近似为0.5

	fixed att = saturate(1 - d/(_PointLightingRangeRadius*1.5));

	o.color = diffCol * att;
	#else
	o.color = UNITY_LIGHTMODEL_AMBIENT;
	#endif

	return o;
}

fixed4 frag_lightmap_pointlight (v2f_lightmap1 f) : COLOR
{
	fixed4 c = tex2D(_MainTex, f.uv_main);
	#ifdef CUSTOM_LIGHTMAP_ON 
	c.rgb += f.color.rgb;
	c.rgb *= _BlendRatio;
	fixed3 l = f.color.rgb + tex2D(_LightMap, f.uv_lightmap).rgb;
	c.rgb *= l;
	#else
	c *= f.color*2;
	#endif

	return c;
}

//带alpha通道贴图
fixed4 frag_lightmap_pointlight_alpha (v2f_lightmap1 f) : COLOR
{
	fixed4 c = tex2D(_MainTex, f.uv_main);
	#if ETC1_TEXTURE_ON
	c.a = tex2D(_MainTex_Alpha, f.uv_main);
	#endif
	#ifdef CUSTOM_LIGHTMAP_ON 
	c.rgb += f.color.rgb;
	c.rgb *= _BlendRatio;
	fixed3 l = f.color.rgb + tex2D(_LightMap, f.uv_lightmap).rgb;
	c.rgb *= l;
	#else
	c *= f.color*2;
	#endif

	return c;
}



//---------------------------------------------------------------------------------
// Diffuse光照的Lightmap
//---------------------------------------------------------------------------------
struct appdata_t2
{
	float4 vertex 		: POSITION;
	float3 normal		: NORMAL;
	half2  uv_main 		: TEXCOORD0;
	
	#ifdef CUSTOM_LIGHTMAP_ON
	half2  uv_lightmap 	: TExCOORD1;
	#endif
	
	fixed4 color 		: COLOR;
};

struct v2f_lightmap2
{
	float4 vertex 		: SV_POSITION;
	half2  uv_main 		: TEXCOORD0;
	
	#ifdef CUSTOM_LIGHTMAP_ON
	half2  uv_lightmap 	: TExCOORD1;
	#endif
	
	fixed3 color 		: COLOR;
};

fixed4 _LightColor0;

v2f_lightmap2 vert_lightmap_diffuse(appdata_t2 v)
{
	v2f_lightmap2 o;
	
	o.vertex = mul(UNITY_MATRIX_MVP, v.vertex);
	o.uv_main = TRANSFORM_TEX(v.uv_main, _MainTex);
	#ifdef CUSTOM_LIGHTMAP_ON
	o.uv_lightmap = TRANSFORM_TEX(v.uv_lightmap, _LightMap);
	#endif
	
	//fixed3 normalInView = normalize( mul((float3x3)UNITY_MATRIX_MV, v.normal) );
	fixed3 lightDirInView = normalize( ObjSpaceLightDir(v.vertex) );
	
	fixed diff = max(0, dot(v.normal, lightDirInView));
	
	o.color = UNITY_LIGHTMODEL_AMBIENT + clamp(_LightColor0 * diff, 0.0, 1.0);
	
	return o;
}

fixed4 frag_lightmap_diffuse (v2f_lightmap2 f) : COLOR
{
	fixed4 c = tex2D(_MainTex, f.uv_main);
	
	#ifdef CUSTOM_LIGHTMAP_ON
	c.rgb *= _BlendRatio;
	fixed3 l = tex2D(_LightMap, f.uv_lightmap).rgb;
	c.rgb *= l*f.color;
	#else
	c.rgb *= f.color;
	#endif
	
	return c;
}


