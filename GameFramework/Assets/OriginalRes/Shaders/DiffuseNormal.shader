Shader "Custom/DiffuseNormal"
{
	Properties
	{
		_MainTex("Base (RGB)", 2D) = "white" {}
		_BumpTex("Bump Texture", 2D) = "white" {}
	}

	SubShader
	{
		Tags{ "RenderType" = "Opaque" }
		LOD 300

		Pass
		{
			Tags{ "LightMode" = "ForwardBase" }

			Cull Back
			Lighting On
			CGPROGRAM

			#pragma vertex vert  
			#pragma fragment frag  
			
			#pragma multi_compile_fwdbase  
			
			#include "UnityCG.cginc"  
			#include "Lighting.cginc"  
			#include "AutoLight.cginc"  

			sampler _MainTex;
			sampler _BumpTex;

			float4 _MainTex_ST;
			float4 _BumpTex_ST;

			struct a2v
			{
				float4 vertex : POSITION;
				float3 normal : NORMAL;
				float4 texcoord : TEXCOORD0;
				float4 tangent : TANGENT;
			};

			struct v2f
			{
				float4 pos : POSITION;
				float2 uv : TEXCOORD0;
				float2 uv2 : TEXCOORD1;
				float3 lightDirection : TEXCOORD2;
				LIGHTING_COORDS(3, 4)
			};

			v2f vert(a2v v) 
			{
				v2f o;

				TANGENT_SPACE_ROTATION;
				o.lightDirection = mul(rotation, ObjSpaceLightDir(v.vertex));
				o.pos = mul(UNITY_MATRIX_MVP, v.vertex);
				o.uv = TRANSFORM_TEX(v.texcoord, _MainTex);
				o.uv2 = TRANSFORM_TEX(v.texcoord, _MainTex);

				TRANSFER_VERTEX_TO_FRAGMENT(o);
				return o;
			}

			float4 frag(v2f i) : COLOR
			{
				float4 c = tex2D(_MainTex, i.uv);
				float3 n = UnpackNormal(tex2D(_BumpTex, i.uv2));

				float3 lightColor = UNITY_LIGHTMODEL_AMBIENT.xyz;

				float atten = LIGHT_ATTENUATION(i);

				// Angle to the light  
				float diff = saturate(dot(n, normalize(i.lightDirection)));
				lightColor += _LightColor0.rgb * (diff * atten);

				c.rgb = lightColor * c.rgb;

				return c;
			}

			ENDCG
		}

		Pass
		{
			Tags{ "LightMode" = "ForwardAdd" }

			Cull Back
			Lighting On
			Blend One One
			CGPROGRAM

			#pragma vertex vert  
			#pragma fragment frag
			
			#pragma multi_compile_fwdadd  
			
			#include "UnityCG.cginc"  
			#include "Lighting.cginc"  
			#include "AutoLight.cginc"  

			sampler _MainTex;
			sampler _BumpTex;

			float4 _MainTex_ST;
			float4 _BumpTex_ST;

			struct a2v
			{
				float4 vertex : POSITION;
				float3 normal : NORMAL;
				float4 texcoord : TEXCOORD0;
				float4 tangent : TANGENT;
			};

			struct v2f
			{
				float4 pos : POSITION;
				float2 uv : TEXCOORD0;
				float2 uv2 : TEXCOORD1;
				float3 lightDirection : TEXCOORD2;
				LIGHTING_COORDS(3, 4)
			};

			v2f vert(a2v v)
			{
				v2f o;

				TANGENT_SPACE_ROTATION;
				o.lightDirection = mul(rotation, ObjSpaceLightDir(v.vertex));
				o.pos = mul(UNITY_MATRIX_MVP, v.vertex);
				o.uv = TRANSFORM_TEX(v.texcoord, _MainTex);
				o.uv2 = TRANSFORM_TEX(v.texcoord, _MainTex);

				TRANSFER_VERTEX_TO_FRAGMENT(o);
				return o;
			}

			float4 frag(v2f i) : COLOR
			{
				float4 c = tex2D(_MainTex, i.uv);
				float3 n = UnpackNormal(tex2D(_BumpTex, i.uv2));

				float3 lightColor = UNITY_LIGHTMODEL_AMBIENT.xyz;

				float atten = LIGHT_ATTENUATION(i);

				// Angle to the light  
				float diff = saturate(dot(n, normalize(i.lightDirection)));
				lightColor += _LightColor0.rgb * (diff * atten);

				c.rgb = lightColor * c.rgb;

				return c;
			}

			ENDCG
		}
	}

	FallBack "Diffuse"
}