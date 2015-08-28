Shader "Custom/VertexLit"
{  
    Properties 
	{  
        _MainTex ("Base (RGB)", 2D) = "white" {}  
    }  

    SubShader
	{  
        Tags { "RenderType"="Opaque" }  
        LOD 300  
          
        Pass
		{  
            Tags { "LightMode" = "Vertex" }  
              
            Cull Back  
            Lighting On  
              
            CGPROGRAM  
              
            #pragma vertex vert  
            #pragma fragment frag  
              
            #include "UnityCG.cginc"  
              
            sampler _MainTex;  
            float4 _MainTex_ST;  
              
            struct a2v 
			{  
                float4 vertex : POSITION;  
                float3 normal : NORMAL;  
                float4 texcoord : TEXCOORD0;  
            };  
              
            struct v2f 
			{  
                float4 pos : POSITION;  
                float2 uv : TEXCOORD0;  
                float3 color : TEXCOORD1;  
            };  
              
            v2f vert(a2v v) 
			{  
                v2f o;
				o.pos = mul(UNITY_MATRIX_MVP, v.vertex);  
                o.uv = TRANSFORM_TEX(v.texcoord, _MainTex);  
                o.color = ShadeVertexLights(v.vertex, v.normal);  
                return o;  
            }  
              
            float4 frag(v2f i) : COLOR
			{  
                float4 c = tex2D(_MainTex, i.uv);  
                c.rgb = c.rgb * i.color;  
                return c;  
            }  
              
            ENDCG  
        }  
    }   

    FallBack "Diffuse"  
}  