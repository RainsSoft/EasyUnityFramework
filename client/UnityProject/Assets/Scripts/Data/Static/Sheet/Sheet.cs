using UnityEngine;
using System.Collections;
public class Sheet
{
	/// <summary>
	/// 宠物
	/// </summary>
	public static PetDataManager petdatamanager  {  get  { return PetDataManager.Instance; } }

	/// <summary>
	/// 宠物性格
	/// </summary>
	public static PetDispositionDataManager petdispositiondatamanager  {  get  { return PetDispositionDataManager.Instance; } }

	/// <summary>
	/// 宠物定位
	/// </summary>
	public static PetLocationDataManager petlocationdatamanager  {  get  { return PetLocationDataManager.Instance; } }

	/// <summary>
	/// 宠物品质
	/// </summary>
	public static PetQualityDataManager petqualitydatamanager  {  get  { return PetQualityDataManager.Instance; } }

	/// <summary>
	/// 宠物音效
	/// </summary>
	public static PetSoundDataManager petsounddatamanager  {  get  { return PetSoundDataManager.Instance; } }

	/// <summary>
	/// 计算值
	/// </summary>
	public static AttributeCountDataManager attributecountdatamanager  {  get  { return AttributeCountDataManager.Instance; } }

	/// <summary>
	/// 属性ID
	/// </summary>
	public static AttributeIdDataManager attributeiddatamanager  {  get  { return AttributeIdDataManager.Instance; } }

	/// <summary>
	/// 宠物基础属性
	/// </summary>
	public static PetBaseAttributeDataManager petbaseattributedatamanager  {  get  { return PetBaseAttributeDataManager.Instance; } }

	/// <summary>
	/// 属性对照表
	/// </summary>
	public static AttributeListDataManager attributelistdatamanager  {  get  { return AttributeListDataManager.Instance; } }

	/// <summary>
	/// 系别克制关系
	/// </summary>
	public static TypeImpactManager typeimpactmanager  {  get  { return TypeImpactManager.Instance; } }

	/// <summary>
	/// 技能
	/// </summary>
	public static SkillDataManager skilldatamanager  {  get  { return SkillDataManager.Instance; } }

	/// <summary>
	/// 效果
	/// </summary>
	public static SkillValueDataManager skillvaluedatamanager  {  get  { return SkillValueDataManager.Instance; } }

	/// <summary>
	/// BUFF
	/// </summary>
	public static BuffDataManager buffdatamanager  {  get  { return BuffDataManager.Instance; } }

	/// <summary>
	/// 怪物
	/// </summary>
	public static MonsterDataManager monsterdatamanager  {  get  { return MonsterDataManager.Instance; } }

	/// <summary>
	/// 关卡组
	/// </summary>
	public static MapsGroupDataManager mapsgroupdatamanager  {  get  { return MapsGroupDataManager.Instance; } }

	/// <summary>
	/// 怪物讨伐组
	/// </summary>
	public static MonsterChallengeGroupDataManager monsterchallengegroupdatamanager  {  get  { return MonsterChallengeGroupDataManager.Instance; } }

	/// <summary>
	/// 活动组
	/// </summary>
	public static ActivityGroupDataManager activitygroupdatamanager  {  get  { return ActivityGroupDataManager.Instance; } }

	/// <summary>
	/// 怪物属性
	/// </summary>
	public static MonsterAttributeDataManager monsterattributedatamanager  {  get  { return MonsterAttributeDataManager.Instance; } }

	/// <summary>
	/// 属性权重
	/// </summary>
	public static AttributeWeightDataManager attributeweightdatamanager  {  get  { return AttributeWeightDataManager.Instance; } }

	/// <summary>
	/// 怪物音效
	/// </summary>
	public static MonsterSoundDataManager monstersounddatamanager  {  get  { return MonsterSoundDataManager.Instance; } }

	/// <summary>
	/// 主角
	/// </summary>
	public static PlayerExpDataManager playerexpdatamanager  {  get  { return PlayerExpDataManager.Instance; } }

	/// <summary>
	/// 宠物
	/// </summary>
	public static PetExpDataManager petexpdatamanager  {  get  { return PetExpDataManager.Instance; } }

	/// <summary>
	/// 帮派
	/// </summary>
	public static SocietyExpDataManager societyexpdatamanager  {  get  { return SocietyExpDataManager.Instance; } }

	/// <summary>
	/// 宠物吸收经验
	/// </summary>
	public static PetAbsorbExpDataManager petabsorbexpdatamanager  {  get  { return PetAbsorbExpDataManager.Instance; } }

	/// <summary>
	/// 多语言
	/// </summary>
	public static LanguagesDataManager languagesdatamanager  {  get  { return LanguagesDataManager.Instance; } }

	/// <summary>
	/// 关卡
	/// </summary>
	public static MapsDataManager mapsdatamanager  {  get  { return MapsDataManager.Instance; } }

	/// <summary>
	/// 怪点
	/// </summary>
	public static SpawnDataManager spawndatamanager  {  get  { return SpawnDataManager.Instance; } }

	/// <summary>
	/// 怪物讨伐
	/// </summary>
	public static MonsterChallengeDataManager monsterchallengedatamanager  {  get  { return MonsterChallengeDataManager.Instance; } }

	/// <summary>
	/// 关卡目标
	/// </summary>
	public static MapTargetDataManager maptargetdatamanager  {  get  { return MapTargetDataManager.Instance; } }

	/// <summary>
	/// 关卡目标对应文字
	/// </summary>
	public static MapDescribeDataManager mapdescribedatamanager  {  get  { return MapDescribeDataManager.Instance; } }

	/// <summary>
	/// 壶中境
	/// </summary>
	public static ShakeMirrorDataManager shakemirrordatamanager  {  get  { return ShakeMirrorDataManager.Instance; } }

	/// <summary>
	/// 世界地图
	/// </summary>
	public static WorldMapDataManager worldmapdatamanager  {  get  { return WorldMapDataManager.Instance; } }

	/// <summary>
	/// 闯关奖励
	/// </summary>
	public static PassMapAwordDataManager passmapaworddatamanager  {  get  { return PassMapAwordDataManager.Instance; } }

	/// <summary>
	/// 主角
	/// </summary>
	public static PlayerApDataManager playerapdatamanager  {  get  { return PlayerApDataManager.Instance; } }

	/// <summary>
	/// 怪物
	/// </summary>
	public static TextMonterManager textmontermanager  {  get  { return TextMonterManager.Instance; } }

	/// <summary>
	/// 宠物
	/// </summary>
	public static TextPetManager textpetmanager  {  get  { return TextPetManager.Instance; } }

	/// <summary>
	/// 技能
	/// </summary>
	public static TextSkillManager textskillmanager  {  get  { return TextSkillManager.Instance; } }

	/// <summary>
	/// QTE
	/// </summary>
	public static TextQTEManager textqtemanager  {  get  { return TextQTEManager.Instance; } }

}
