using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace HotFixCode
{
    class MainUpdate
    {

        void Init()
        {
            DebugConsole.Log("Inited  Script");

            Start();
        }

        void Start()
        {
            DebugConsole.Log("Start");
            gate.GetPanelManager().PushPanel(LogicName.Sample);
        }

        void End()
        {
            DebugConsole.Log("End");
        }

        void Update()
        {
            DebugConsole.Log("Update");
        }

        void FixedUpdate()
        {
            DebugConsole.Log("FixedUpdate");
        }

        void LateUpdate()
        {
            DebugConsole.Log("LateUpdate");
        }

    }
}
