Shader "Custom/Stroke" {
	Properties {
	    _MainTex("MainTex",2D) = "white"{}
	    _CoLor("color",Color) = (1,1,1,1)
		_Outline("Out line",range(0,0.1)) = 0.02
		_Outline2("Out line2",range(0,0.1)) = 0.02
		_Factor("Factor",range(0,1)) = 0.5
		_Factor2("Factor",range(0,1)) = 0.5
	}
	SubShader {
	
	//通过两次渲染
	//第一次渲染：
	//1，顶点函数中对投影空间中的顶点在xy轴进行拉伸
	//2，在片段函数中输出颜色
	//第二次渲染发生偏移的成都小于第一次，进行普通的光照渲染：
	//1，顶点函数获取灯光方向，视角方向，法线方向，顶点偏移
	//2，片段函数进行光照运算
	//边框的形成：
	//边框是第二次渲染时没有覆盖掉的第一次渲染的部分
	
		pass{//第一次的拉伸渲染
		Tags{"LightMode" = "Always"}
		
		Cull Front
		//ZWrite Off
		CGPROGRAM
		#pragma vertex vert
		#pragma fragment frag
		#include "UnityCG.cginc"
		float _Outline;
		float _Factor;
		float4 _CoLor;
		struct v2f {
			float4 pos:SV_POSITION;
		};

		v2f vert (appdata_full v) {
			v2f o;
			o.pos = mul(UNITY_MATRIX_MVP,v.vertex);
            //顶点偏移,渲染边框
			float3 dir = normalize(v.vertex.xyz);
			float3 dir2 = v.normal;
			dir = lerp(dir,dir2,_Factor);
			dir = mul ((float3x3)UNITY_MATRIX_IT_MV, dir);
			float2 offset = TransformViewToProjection(dir.xy);
			offset=normalize(offset);
			o.pos.xy += offset * o.pos.z *_Outline;
			return o;
		}
		float4 frag(v2f i):COLOR
		{
			return _CoLor;
		}
		ENDCG
		}//end of pass .1
		
		
		pass{//小于第一次拉伸的渲染
		Tags{"LightMode"="ForwardBase"}
		Cull Back
		//ZWrite On
		CGPROGRAM
		#pragma vertex vert
		#pragma fragment frag
		#include "UnityCG.cginc"
		float _Outline2;
		float _Factor2;
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
			//获取灯光方向，视角方向，法线方向
			o.lightDir = ObjSpaceLightDir(v.vertex);
			o.viewDir = ObjSpaceViewDir(v.vertex);
			o.normal = v.normal;
            //进行顶点偏移小于第一次偏移
			float3 dir = normalize(v.vertex.xyz);
			float3 dir2 = v.normal;
			dir = lerp(dir,dir2,_Factor2);
			dir = mul ((float3x3)UNITY_MATRIX_IT_MV, dir);
			float2 offset = TransformViewToProjection(dir.xy);
			offset = normalize(offset);
			o.pos.xy += offset * o.pos.z *_Outline2;
			return o;
		}
		float4 frag(v2f i):COLOR
		{
			i.lightDir = normalize(i.lightDir);
			i.viewDir = normalize(i.viewDir);
			i.normal = normalize(i.normal);
            //光照运算
			float4 c = tex2D(_MainTex,i.uv);
			float3 hvec =(i.viewDir+i.lightDir)/2;
			float spec = max(0,dot(hvec,i.normal));
			spec = pow(spec,32)*16;
			float diff = max(0,dot(i.normal,i.lightDir));
			//最终的计算
			c=c * _LightColor0 * (diff+spec) + UNITY_LIGHTMODEL_AMBIENT * c;//高光+漫反射+环境光
			return c * 2;
		}
		ENDCG
		}//end of pass .2
	} 
	FallBack "Diffuse"
}
