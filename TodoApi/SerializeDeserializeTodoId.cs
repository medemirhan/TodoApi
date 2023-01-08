namespace TodoApi.SerializeDeserializeTodoId;
public class SerializeDeserializeTodoId
{
    public static string Serialize(List<int> ids_int)
    {
        if(ids_int.Count == 0)
            throw new ArgumentOutOfRangeException("id list is empty.");

        string ids_str = "";
        foreach(int id in ids_int)
        {
            ids_str = ids_str + id.ToString() + ",";
        }
        ids_str = ids_str.Remove(ids_str.Length - 1);

        return ids_str;
    }
    public static List<int> Deserialize(string ids_str)
    {
        var listOfIds = ids_str.Split(',').ToList();
        List<int> ids_int = listOfIds.Select(int.Parse).ToList();
            
        return ids_int;
    }
}