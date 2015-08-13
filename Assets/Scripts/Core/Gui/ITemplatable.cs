using UnityEngine;
using System.Collections;

public interface ITemplatable
{
    bool IsTemplate { get; set; }

    string TemplateName { get; set; }
}
