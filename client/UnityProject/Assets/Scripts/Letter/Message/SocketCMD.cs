public enum SocketMessageCMD
{
    MSG_NONE,
    MSG_TIMELAPSE = 1,

    MSG_LOGIN = 10,
    MSG_LOGOUT = 11,

    MSG_CHAT = 10001,

    MSG_ERROR = 65530,
    MSG_MAX = 65530 + 1,
}

public class SocketStatusCMD
{
    public const string Connect = "Connect";            //连接服务器
    public const string Exception = "Exception";            //异常掉线
    public const string Disconnect = "Disconnect";            //手动断线处理  
}
