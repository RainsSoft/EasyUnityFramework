using UnityEngine;
using UnityEngine.EventSystems;
using System.Collections;
using System;

public class DraggableHandle : MonoBehaviour, IDragHandler 
{
	RectTransform drag;
	Canvas canvas;
	RectTransform canvasRect;

	public void Drag(RectTransform newDrag)
	{
		drag = newDrag;
		canvas = Util.FindCanvas(transform).GetComponent<Canvas>();
		canvasRect = canvas.GetComponent<RectTransform>();
	}

	public void OnDrag(PointerEventData eventData)
	{
		drag.localPosition += FixPosition(eventData.position) - FixPosition(eventData.position - eventData.delta);
	}

	Vector3 FixPosition(Vector3 screenPosition)
	{
		Vector3 result;
		var canvasSize = canvasRect.sizeDelta;
		Vector2 min = Vector2.zero;
		Vector2 max = canvasSize;

		var isOverlay = canvas.renderMode == RenderMode.ScreenSpaceOverlay;
		var noCamera = canvas.renderMode == RenderMode.ScreenSpaceCamera && canvas.worldCamera == null;
		if (isOverlay || noCamera)
		{
			result = screenPosition;
		}
		else
		{
			var ray = canvas.worldCamera.ScreenPointToRay(screenPosition);
			var plane = new Plane(canvasRect.forward, canvasRect.position);
			
			float distance;
			plane.Raycast(ray, out distance);

			result = canvasRect.InverseTransformPoint(ray.origin + (ray.direction * distance));
			
			min = - Vector2.Scale(max, canvasRect.pivot);
			max = canvasSize - min;
		}
		
		result.x = Mathf.Clamp(result.x, min.x, max.x);
		result.y = Mathf.Clamp(result.y, min.y, max.y);
		
		return result;
	}
}
