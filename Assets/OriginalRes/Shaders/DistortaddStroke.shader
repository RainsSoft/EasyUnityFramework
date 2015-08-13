Shader "effect/distortadd_Frame" {
Properties {
	_TintColor ("Tint Color", Color) = (0.5,0.5,0.5,0.5)
	_NoiseTex ("Distort Texture (RG)", 2D) = "white" {}
	_MainTex ("Alpha (A)", 2D) = "white" {}
	_HeatTime  ("Heat Time", range (-1,1)) = 0
	_ForceX  ("Strength X", range (0,1)) = 0.1
	_ForceY  ("Strength Y", range (0,1)) = 0.1
	
	_COlor("Color",Color)=(0,0,0,0)
	_Wide("wide",Range(0,0.1)) = 0
	_Depth("Depth",Range(0,0.2)) = 0
	//_Factor("Factor",Range(0,1)) = 0
	_Back("Back",Color)=(0,0,0,0)
}



//Category {
//	Tags { "Queue"="Transparent" "RenderType"="Transparent" }
//	Blend SrcAlpha One
//	Cull Off Lighting Off ZWrite Off Fog { Color (0,0,0,0) }
//	BindChannels {
//		Bind "Color", color
//		Bind "Vertex", vertex
//		Bind "TexCoord", texcoord
//	}


	SubShader {
	//通过两次渲染
	//第一次渲染：
	//1，顶点函数中对投影空间中的顶点在xy轴进行拉伸
	//2，在片段函数中输出颜色
	//第二次渲染没有发生偏移，普通的光照渲染：
	//1，顶点函数获取UV坐标
	//2，对UV坐标进行偏移，读取贴图的颜色信息
	//边框的形成：
	//边框是第二次渲染时没有覆盖掉的第一次渲染的部分
	
	Tags { "Queue"="Geometry" "RenderType"="Opaque" }
	
	Pass{//拉伸渲染
	    Cull back
	    //Blend One One
		CGPROGRAM
		#pragma vertex vert
		#pragma fragment frag
		#include "UnityCG.cginc"
		#pragma target 3.0

		
		float _Wide;
		float4 _COlor;
		float _Depth;
		//float _Factor;//顶点向量与法相量的插值参数

		struct Input {
		    float4 pos:SV_POSITION;
		};

		
		Input vert(appdata_base v)
		{
			Input o;
	    	o.pos = mul(UNITY_MATRIX_MVP,v.vertex);
		    //float3 dir = normalize(v.vertex.xyz);
		    //顶点拉伸，渲染边框
			float3 dir = v.normal;
			//dir = lerp(dir,dir2,_Factor);
			dir = mul ((float3x3)UNITY_MATRIX_IT_MV, dir);
			float2 offset = TransformViewToProjection(dir.xy);
			offset = normalize(offset);
			o.pos.xy += offset*_Wide* o.pos.z;
			//微调深度值
			o.pos.z += _Depth;
		    return o;
		}
		
		float4 frag(Input o):COLOR 
		{
			return _COlor;
		}
		ENDCG
	} 
	
	
	
	Pass {//覆盖渲染
		Cull back
		//Blend One One
		//Blend one OneMinusSrcAlpha
		CGPROGRAM
		#pragma vertex vert
		#pragma fragment frag
		#pragma fragmentoption ARB_precision_hint_fastest
		#pragma multi_compile_particles
		#include "UnityCG.cginc"

		struct appdata_t {
			float4 vertex : POSITION;
			fixed4 color : COLOR;
			float2 texcoord: TEXCOORD0;
		};

		struct v2f {
			float4 vertex : POSITION;
			fixed4 color : COLOR;
			float2 uvmain : TEXCOORD1;
		};

		fixed4 _TintColor;
		fixed _ForceX;
		fixed _ForceY;
		fixed _HeatTime;
		float4 _MainTex_ST;
		float4 _NoiseTex_ST;
		sampler2D _NoiseTex;
		sampler2D _MainTex;
		float4 _Back;

		v2f vert (appdata_t v)
		{
			v2f o;
			o.vertex = mul(UNITY_MATRIX_MVP, v.vertex);
			o.color = v.color;
			//获取顶点的UV坐标
			o.uvmain = TRANSFORM_TEX( v.texcoord, _MainTex );
	
			return o;
		}

		fixed4 frag( v2f i ) : COLOR
		{
			//noise effect
			//对UV坐标进行偏移，读取贴图中对应的颜色信息
			fixed4 offsetColor1 = tex2D(_NoiseTex, i.uvmain + _Time.xz*_HeatTime);
		    fixed4 offsetColor2 = tex2D(_NoiseTex, i.uvmain + _Time.yx*_HeatTime);
			i.uvmain.x += ((offsetColor1.r + offsetColor2.r) - 1) * _ForceX;
			i.uvmain.y += ((offsetColor1.r + offsetColor2.r) - 1) * _ForceY;
			return 2.0f * i.color * _TintColor * tex2D( _MainTex, i.uvmain)*2+_Back*0.4;
		}
		ENDCG
	}
}
	// ------------------------------------------------------------------
	// Fallback for older cards and Unity non-Pro
	
//	SubShader {
//	
//		Blend DstColor Zero
//		Pass {
//			Name "BASE"
//			SetTexture [_MainTex] {	combine texture }
//		}
//	}
//}
}
