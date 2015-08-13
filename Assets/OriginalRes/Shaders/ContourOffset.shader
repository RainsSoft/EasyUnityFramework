Shader "Custom/Contour1" {
	Properties {
		_MainTex ("Albedo (RGB)", 2D) = "white" {}
		_COlor("Color",Color)=(0,0,0,0)
		_Wide("wide",Range(0,0.1)) = 0
		_Depth("Depth",Range(0,0.2)) = 0
		_Factor("Factor",Range(0,1)) = 0
		
	}
	SubShader {
	
	//通过两次渲染
	//第一次渲染：
	//1，顶点函数中对投影空间中的顶点在xy轴进行拉伸
	//2，在片段函数中输出颜色
	//第二次渲染没有发生偏移，普通的光照渲染：
	//1，顶点函数获取灯光方向，视角方向，法线方向
	//2，片段函数进行光照运算
	//边框的形成：
	//边框是第二次渲染时没有覆盖掉的第一次渲染的部分
	
	
		Tags {"RenderType"="Opaque"}
		LOD 200
		
		Pass{//第一次拉伸渲染
		Cull back
		CGPROGRAM
		#pragma vertex vert
		#pragma fragment frag
		#include "UnityCG.cginc"
		#pragma target 3.0

		
		float _Wide;
		float4 _COlor;
		float _Depth;
		float _Factor;

		struct Input {
		    float4 pos:SV_POSITION;
		};

		Input vert(appdata_base v)
		{
			Input o;
	    	o.pos = mul(UNITY_MATRIX_MVP,v.vertex);
	    	//顶点拉伸
		    float3 dir = normalize(v.vertex.xyz);
			float3 dir2 = v.normal;
			dir = lerp(dir,dir2,_Factor);
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
		//输出颜色
			return _COlor;
		}
		ENDCG
	} 
	    
		
	
	pass{//覆盖渲染
		Tags{"LightMode"="ForwardBase"}
		ZTest LEqual
		CGPROGRAM
		#pragma vertex vert
		#pragma fragment frag
		#include "UnityCG.cginc"
		float4 _LightColor0;
		sampler2D _MainTex;
		float4 _MainTex_ST;
		float _Wide;
		float4 _COlor;
		
		struct v2f {
			float4 pos:SV_POSITION;
			float2 uv:TEXCOORD0;
			float3 lightDir:TEXCOORD1;
			float3 viewDir:TEXCOORD2;
			float3 normal:TEXCOORD3;
			float4 vertex:TEXCOORD4;
		};

		v2f vert (appdata_full v) {
			v2f o;
			o.pos = mul(UNITY_MATRIX_MVP,v.vertex);
			o.uv = TRANSFORM_TEX(v.texcoord,_MainTex);
			o.vertex = v.vertex;
			//计算灯光方向，视角方向，法线方向
			o.lightDir = ObjSpaceLightDir(v.vertex);
			o.viewDir = ObjSpaceViewDir(v.vertex);
			o.normal = v.normal;
			return o;
		}
		
		float4 frag(v2f i):COLOR
		{
			i.lightDir = normalize(i.lightDir);
			i.viewDir = normalize(i.viewDir);
			i.normal = normalize(i.normal);
			float4 c = tex2D(_MainTex,i.uv);
			//光照运算
			float3 hvec = (i.viewDir+i.lightDir) / 2;
			float spec = max(0,dot(hvec,i.normal));
			spec = pow(spec,32) * 16;
			float diff = max(0,dot(i.normal,i.lightDir));
			//最终的计算
			c = c*_LightColor0 * ( diff + spec ) + UNITY_LIGHTMODEL_AMBIENT * c;//高光+漫反射+环境光
			return c;
		}
		ENDCG
		}
		
	}
	
    FallBack "Diffuse"
}
