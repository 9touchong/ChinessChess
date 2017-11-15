/**历史纪录相关类
 * history_record 实例化代表一条操作记录
 */
class history_record{
    public ActFaction : string;  //行动方 "r"或“b”
    public MovePieceId : string;
    public FromX : number;
    public FromY : number;
    //public ToX : number;
    //public ToY : number;
    public DiePieceId : string;
}