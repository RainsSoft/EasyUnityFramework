//------------------------------------------------------------------------------------
// 普通 顶点色
//------------------------------------------------------------------------------------
struct appdata_t 
{
	float4 vertex : POSITION;
	half2  texcoord : TEXCOORD;
	fixed4 color : COLOR;
};

struct v2f 
{
	float4 vertex : SV_POSITION;
	half2  texcoord : TEXCOORD0;
	fixed4 color : COLOR;
};

uniform sampler2D 	_MainTex;
#if ETC1_TEXTURE_ON
uniform sampler2D	_MainTex_Alpha;
#endif
uniform half4 		_MainTex_ST;

v2f vert_vetexcol(appdata_t v)
{
	v2f o;
	o.vertex = mul(UNITY_MATRIX_MVP, v.vertex);
	o.texcoord = TRANSFORM_TEX(v.texcoord, _MainTex);
	o.color = v.color;
	return o;
}

fixed4 frag_vetexcol(v2f f) : COLOR
{
	return tex2D(_MainTex, f.texcoord) * f.color;
}

fixed4 frag_vetexcol_alphatex(v2f f) : COLOR
{
	fixed4 col = tex2D(_MainTex, f.texcoord);
	#if ETC1_TEXTURE_ON
	col.a = tex2D(_MainTex_Alpha, f.texcoord);
	#endif
	return col * f.color;
}

//-----------------------------------------------------------------------------------------------
// 透明渐变的Frag
//-----------------------------------------------------------------------------------------------
uniform half		_Alpha;

fixed4 frag_vetexcol_alpha(v2f f) : COLOR
{
	return tex2D(_MainTex, f.texcoord) * f.color * _Alpha;
}

//带透明通道贴图
fixed4 frag_vetexcol_alpha_alphatex(v2f f) : COLOR
{
	fixed4 col = tex2D(_MainTex, f.texcoord);
	#if ETC1_TEXTURE_ON
	col.a = tex2D(_MainTex_Alpha, f.texcoord);
	#endif
	return col * f.color * _Alpha;
}

//----------------------------------------------------------------------------------------------
// 带点光源的顶点色
//----------------------------------------------------------------------------------------------
struct appdata_t1
{
    float4 vertex       : POSITION;
    half2  texcoord     : TEXCOORD;
    fixed3 normal       : NORMAL;
    fixed4 color        : COLOR;
};

struct v2f1 
{
    float4 vertex       : SV_POSITION;
    half2  texcoord     : TEXCOORD0;
    fixed4 color        : COLOR0;
    fixed4 diffcolor    : COLOR1;
};

uniform fixed4      _PointLightingColor;
uniform float4      _PointLightingPosition;
uniform float       _PointLightingInstensity; 
uniform float       _PointLightingRangeRadius;

v2f1 vert_vetexcol_pointlight(appdata_t1 v)
{
    v2f1 o;

    o.vertex = mul(UNITY_MATRIX_MVP, v.vertex);
    o.texcoord = TRANSFORM_TEX(v.texcoord, _MainTex);
    
    float3 posW = mul( _Object2World, v.vertex ).xyz;
    fixed3 normalW  = normalize( mul((fixed3x3)_Object2World, v.normal ) );
    
    float3 lightVec = _PointLightingPosition.xyz - posW;
    float d = length(lightVec);
    lightVec /= d;

    fixed diff = saturate( dot(normalW, lightVec) );
    fixed att = saturate(1 - d/(_PointLightingRangeRadius*1.5));

    o.diffcolor = _PointLightingColor * att * diff;
    o.color = v.color;

    return o;
}

fixed4 frag_vetexcol_pointlight(v2f1 f) : COLOR
{
    fixed4 col = tex2D(_MainTex, f.texcoord) * f.color;
    col.rgb += _PointLightingInstensity * f.diffcolor.rgb;
    return col;
}

fixed4 frag_vetexcol_pointlight_alphatex(v2f1 f) : COLOR
{
	fixed4 col = tex2D(_MainTex, f.texcoord);
	#if ETC1_TEXTURE_ON
	col.a = tex2D(_MainTex_Alpha, f.texcoord);
    #endif

	col = col * f.color;
    col.rgb += _PointLightingInstensity * f.diffcolor.rgb;
    return col;
}

//----------------------------------------------------------------------------------
// 带UVAnim的顶点色
//----------------------------------------------------------------------------------





