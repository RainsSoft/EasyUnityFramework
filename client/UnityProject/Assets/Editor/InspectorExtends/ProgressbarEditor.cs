using UnityEditor;
using System.Collections.Generic;
using System;

[CanEditMultipleObjects]
[CustomEditor(typeof(Progressbar), true)]
public class ProgressbarEditor : Editor
{
    Dictionary<string, SerializedProperty> serializedProperties = new Dictionary<string, SerializedProperty>();

    string[] properties = new string[]
    {
			"max",
            "speed",
			"indeterminateBar",
			"determinateBar",
            "textContent",
            "filler",
            "fillSlot",
            "indeterminateImage",

            "_value",
			"_type",
			"_direction",
            "_textType",
	};

    void OnEnable()
    {
        Array.ForEach(properties, x =>
        {
            var p = serializedObject.FindProperty(x);
            serializedProperties.Add(x, p);
        });
    }

    public override void OnInspectorGUI()
    {
        serializedObject.Update();
        EditorGUILayout.Space();

        EditorGUILayout.PropertyField(serializedProperties["max"]);
        EditorGUILayout.PropertyField(serializedProperties["_value"]);
        EditorGUILayout.PropertyField(serializedProperties["_type"]);

        EditorGUI.indentLevel++;
        if (serializedProperties["_type"].enumValueIndex == 0)
        {
            EditorGUILayout.PropertyField(serializedProperties["determinateBar"]);
            EditorGUILayout.PropertyField(serializedProperties["filler"]);
            EditorGUILayout.PropertyField(serializedProperties["fillSlot"]);
            EditorGUILayout.PropertyField(serializedProperties["textContent"]);
            EditorGUILayout.PropertyField(serializedProperties["_textType"]);
        }
        else
        {
            EditorGUILayout.PropertyField(serializedProperties["indeterminateBar"]);
            EditorGUILayout.PropertyField(serializedProperties["indeterminateImage"]);
        }
        EditorGUI.indentLevel--;

        EditorGUILayout.PropertyField(serializedProperties["_direction"]);
        EditorGUILayout.PropertyField(serializedProperties["speed"]);

        serializedObject.ApplyModifiedProperties();

        Array.ForEach(targets, x => ((Progressbar)x).Refresh());
    }
}
