Shader "Custom/Contour 1" {
	Properties {
	    _MainTex("MainTex",2D) = "white"{}
	    _CoLor("color",Color) = (1,1,1,1)//调整边框颜色
	}
	SubShader {
	
	//通过两次渲染
	// 第一次渲染通过向相机偏移来来渲染：
	//1，通过 Offset 来实现偏移
	//第二次渲染没有发生偏移，普通的光照渲染：
	//1，顶点函数获取灯光方向，视角方向，法线方向
	//2，片段函数进行光照运算
	//边框的形成：
	//边框是第二次渲染时没有覆盖掉的第一次渲染的部分
	
		pass{//第一次的偏移渲染
		Tags{"LightMode" = "Always"}
		
		Cull Front
		ZWrite On
		Offset -3,-1//偏移，靠近摄像机,渲染边框
		CGPROGRAM
		#pragma vertex vert
		#pragma fragment frag
		#include "UnityCG.cginc"
		
		float4 _CoLor;
		struct v2f {
			float4 pos:SV_POSITION;
		};

		v2f vert (appdata_full v) {
			v2f o;
			o.pos = mul(UNITY_MATRIX_MVP,v.vertex);
			return o;
		}
		float4 frag(v2f i):COLOR
		{
			return _CoLor;
		}
		ENDCG
		}
		
		
		pass{//不偏移的渲染
		Tags{"LightMode" = "ForwardBase"}
		Cull Back
		ZWrite On
		CGPROGRAM
		#pragma vertex vert
		#pragma fragment frag
		#include "UnityCG.cginc"
		float4 _LightColor0;
		sampler2D _MainTex;
		float4 _MainTex_ST;
		struct v2f {
			float4 pos:SV_POSITION;
			float2 uv:TEXCOORD0;
			float3 lightDir:TEXCOORD1;
			float3 viewDir:TEXCOORD2;
			float3 normal:TEXCOORD3;
		};

		v2f vert (appdata_full v) {//.2
			v2f o;
			o.pos = mul(UNITY_MATRIX_MVP,v.vertex);
			o.uv = TRANSFORM_TEX(v.texcoord,_MainTex);
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
            //光照运算
			float4 c = tex2D(_MainTex,i.uv);
			float3 hvec = (i.viewDir+i.lightDir)/2;
			float spec = max(0,dot(hvec,i.normal));
			spec = pow(spec,32)*16;
			float diff = max(0,dot(i.normal,i.lightDir));
            //最终的计算
			c = c * _LightColor0 * (diff+spec) + UNITY_LIGHTMODEL_AMBIENT * c;//高光 +漫反射+环境光
			return c * 2;
		}
		ENDCG
		}//end of pass .2
	} 
	FallBack "Diffuse"
}
