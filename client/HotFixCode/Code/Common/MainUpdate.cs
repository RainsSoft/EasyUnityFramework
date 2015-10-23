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
            DebugConsole.Log("APP Script system is runing ");
            Start();
        }

        void Start()
        {
            gate.PanelManager.PushPanel(LogicName.Sample);
        }

        void End()
        {
            DebugConsole.Log("APP Script system is end ");
        }

        void Update()
        {
        }

        void FixedUpdate()
        {
        }

        void LateUpdate()
        {
        }

    }
}
