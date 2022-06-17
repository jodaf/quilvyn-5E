/*
Copyright 2021, James J. Hayes

This program is free software; you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation; either version 2 of the License, or (at your option) any later
version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with
this program; if not, write to the Free Software Foundation, Inc., 59 Temple
Place, Suite 330, Boston, MA 02111-1307 USA.
*/

/* jshint esversion: 6 */
/* jshint forin: false */
/* globals ObjectViewer, Quilvyn, QuilvynRules, QuilvynUtils, SRD35 */
"use strict";

/*
 * This module loads the rules from the System Reference Document v5. The SRD5E
 * function contains methods that load rules for particular parts of the SRD:
 * raceRules for character races, magicRules for spells, etc. These member
 * methods can be called independently in order to use a subset of the SRD v5
 * rules. Similarly, the constant fields of SRD5E (ALIGNMENTS, FEATS, etc.) can
 * be manipulated to modify the choices.
 */
function SRD5E() {

  var rules = new QuilvynRules('SRD 5E', SRD5E.VERSION);
  SRD5E.rules = rules;

  rules.defineChoice('choices', SRD5E.CHOICES);
  rules.choiceEditorElements = SRD5E.choiceEditorElements;
  rules.choiceRules = SRD5E.choiceRules;
  rules.editorElements = SRD5E.initialEditorElements();
  rules.getFormats = SRD5E.getFormats;
  rules.makeValid = SRD5E.makeValid;
  rules.randomizeOneAttribute = SRD5E.randomizeOneAttribute;
  rules.defineChoice('random', SRD5E.RANDOMIZABLE_ATTRIBUTES);
  rules.ruleNotes = SRD5E.ruleNotes;

  SRD5E.createViewers(rules, SRD5E.VIEWERS);
  rules.defineChoice('extras',
    'feats', 'featCount', 'sanityNotes', 'selectableFeatureCount',
    'validationNotes'
  );
  rules.defineChoice('preset',
    'background:Background,select-one,backgrounds',
    'race:Race,select-one,races', 'levels:Class Levels,bag,levels');

  SRD5E.abilityRules(rules);
  SRD5E.combatRules(rules, SRD5E.ARMORS, SRD5E.SHIELDS, SRD5E.WEAPONS);
  SRD5E.magicRules(rules, SRD5E.SCHOOLS, SRD5E.SPELLS);
  SRD5E.identityRules(
    rules, SRD5E.ALIGNMENTS, SRD5E.BACKGROUNDS, SRD5E.CLASSES, SRD5E.DEITIES,
    SRD5E.PATHS, SRD5E.RACES
  );
  SRD5E.talentRules
    (rules, SRD5E.FEATS, SRD5E.FEATURES, SRD5E.GOODIES, SRD5E.LANGUAGES,
     SRD5E.SKILLS, SRD5E.TOOLS);

  Quilvyn.addRuleSet(rules);

}

SRD5E.VERSION = '2.3.3.3';

/* List of choices that can be expanded by house rules. */
SRD5E.CHOICES = [
  'Armor', 'Background', 'Class', 'Deity', 'Feat', 'Feature', 'Goody',
  'Language', 'Path', 'Race', 'School', 'Shield', 'Skill', 'Spell', 'Tool',
  'Weapon'
];
/*
 * List of items handled by randomizeOneAttribute method. The order handles
 * dependencies among attributes when generating random characters.
 */
SRD5E.RANDOMIZABLE_ATTRIBUTES = [
  'abilities',
  'charisma', 'constitution', 'dexterity', 'intelligence', 'strength', 'wisdom',
  'name', 'race', 'gender', 'alignment', 'background', 'deity', 'levels',
  'selectableFeatures', 'feats', 'skills', 'languages', 'hitPoints', 'armor',
  'weapons', 'shield', 'spells', 'tools', 'boosts'
];
SRD5E.VIEWERS = ['Collected Notes', 'Compact', 'Standard'];

SRD5E.ABILITIES = {
  'Charisma':'',
  'Constitution':'',
  'Dexterity':'',
  'Intelligence':'',
  'Strength':'',
  'Wisdom':''
};
SRD5E.ALIGNMENTS = {
  'Chaotic Evil':'',
  'Chaotic Good':'',
  'Chaotic Neutral':'',
  'Neutral Evil':'',
  'Neutral Good':'',
  'Neutral':'',
  'Lawful Evil':'',
  'Lawful Good':'',
  'Lawful Neutral':''
};
SRD5E.ARMORS = {
  'None':'AC=0 Dex=10 Weight=0',
  'Padded':'AC=1 Bulky=Y Dex=10 Weight=1',
  'Leather':'AC=1 Dex=10 Weight=1',
  'Studded Leather':'AC=2 Dex=10 Weight=1',
  'Hide':'AC=2 Dex=2 Weight=2',
  'Chain Shirt':'AC=3 Dex=2 Weight=2',
  'Scale Mail':'AC=4 Bulky=Y Dex=2 Weight=2',
  'Breastplate':'AC=4 Dex=2 Weight=2',
  'Half Plate':'AC=5 Bulky=Y Dex=2 Weight=2',
  'Ring Mail':'AC=4 Bulky=Y Dex=0 Weight=3',
  'Chain Mail':'AC=6 Bulky=Y Dex=0 Str=13 Weight=3',
  'Splint':'AC=7 Bulky=Y Dex=0 Str=15 Weight=3',
  'Plate':'AC=8 Bulky=Y Dex=0 Str=15 Weight=3'
};
SRD5E.BACKGROUNDS = {
  'Acolyte':
    'Equipment=' +
      '"Holy Symbol","Prayer Book",Incense,Vestments,Clothing,"15 GP" ' +
    'Features=' +
      '"1:Skill Proficiency (Insight/Religion)",' +
      '"1:Languages (Choose 2 from any)",' +
      '"1:Shelter Of The Faithful" ' +
    'Languages=any,any'
};
SRD5E.CLASSES = {
  'Barbarian':
    'HitDie=d12 ' +
    'Features=' +
      '"1:Armor Proficiency (Medium/Shield)",' +
      '"1:Save Proficiency (Constitution/Strength)",' +
      '"1:Skill Proficiency (Choose 2 from Animal Handling, Athletics, Intimidation, Nature, Perception, Survival)",' +
      '"1:Weapon Proficiency (Martial)",' +
      '"1:Barbarian Unarmored Defense",1:Rage,"2:Danger Sense",' +
      '"2:Reckless Attack","5:Extra Attack",' +
      '"armorWeight < 3 ? 5:Fast Movement",' +
      '"7:Feral Instinct","9:Brutal Critical","11:Relentless Rage",' +
      '"15:Persistent Rage","18:Indomitable Might","20:Primal Champion" ' +
    'Selectables=' +
      '"3:Path Of The Berserker:Primal Path",' +
      '"3:Path Of The Totem Warrior (Bear):Primal Path",' +
      '"3:Path Of The Totem Warrior (Eagle):Primal Path",' +
      '"3:Path Of The Totem Warrior (Wolf):Primal Path"',
  'Bard':
    'HitDie=d8 ' +
    'Features=' +
      '"1:Armor Proficiency (Light)",' +
      '"1:Save Proficiency (Charisma/Dexterity)",' +
      '"1:Skill Proficiency (Choose 3 from any)",' +
      '"1:Tool Proficiency (Choose 3 from any Music)",' +
      '"1:Weapon Proficiency (Simple/Hand Crossbow/Longsword/Rapier/Shortsword)",' +
      '"1:Bardic Inspiration","1:Ritual Casting",1:Spellcasting,' +
      '"2:Jack Of All Trades","2:Song Of Rest","3:Bard Expertise",' +
      '"5:Font Of Inspiration",6:Countercharm,"10:Magical Secrets",' +
      '"20:Superior Inspiration" ' +
    'Selectables=' +
      '"3:College Of Lore:Bard College" ' +
    'CasterLevelArcane=levels.Bard ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'B0:1=2;4=3;10=4,' +
      'B1:1=2;2=3;3=4,' +
      'B2:3=2;4=3,' +
      'B3:5=2;6=3,' +
      'B4:7=1;8=2;9=3,' +
      'B5:9=1;10=2;18=3,' +
      'B6:11=1;19=2,' +
      'B7:13=1;20=2,' +
      'B8:15=1,' +
      'B9:17=1',
  'Cleric':
    'HitDie=d8 ' +
    'Features=' +
      '"1:Armor Proficiency (Medium/Shield)",' +
      '"1:Save Proficiency (Charisma/Wisdom)",' +
      '"1:Skill Proficiency (Choose 2 from History, Insight, Medicine, Persuasion, Religion)",' +
      '"1:Weapon Proficiency (Simple)",' +
      '"1:Ritual Casting",1:Spellcasting,"2:Channel Divinity",' +
      '"2:Turn Undead","5:Destroy Undead","10:Divine Intervention" ' +
    'Selectables=' +
      '"deityDomains =~ \'Life\' ? 1:Life Domain:Divine Domain" ' +
    'CasterLevelDivine=levels.Cleric ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'C0:1=3;4=4;10=5,' +
      'C1:1=2;2=3;3=4,' +
      'C2:3=2;4=3,' +
      'C3:5=2;6=3,' +
      'C4:7=1;8=2;9=3,' +
      'C5:9=1;10=2;18=3,' +
      'C6:11=1;19=2,' +
      'C7:13=1;20=2,' +
      'C8:15=1,' +
      'C9:17=1',
  'Druid':
    'HitDie=d8 ' +
    'Features=' +
      '"1:Armor Proficiency (Medium/Shield)",' +
      '"1:Save Proficiency (Intelligence/Wisdom)",' +
      '"1:Skill Proficiency (Choose 2 from Arcana, Animal Handling, Insight, Medicine, Nature, Perception, Religion, Survival)",' +
      '"1:Tool Proficiency (Herbalism Kit)",' +
      '"1:Weapon Proficiency (Club/Dagger/Dart/Javelin/Mace/Quarterstaff/Scimitar/Sickle/Sling/Spear)",' +
      '"1:Tool Proficiency (Herbalism Kit)",' +
      '1:Druidic,"1:Ritual Casting",1:Spellcasting,"2:Wild Shape",' +
      '"18:Druid Timeless Body","18:Beast Spells",20:Archdruid ' +
    'Selectables=' +
      '"2:Circle Of The Land (Arctic):Druid Circle",' +
      '"2:Circle Of The Land (Coast):Druid Circle",' +
      '"2:Circle Of The Land (Desert):Druid Circle",' +
      '"2:Circle Of The Land (Forest):Druid Circle",' +
      '"2:Circle Of The Land (Grassland):Druid Circle",' +
      '"2:Circle Of The Land (Mountain):Druid Circle",' +
      '"2:Circle Of The Land (Swamp):Druid Circle" ' +
    'CasterLevelDivine=levels.Druid ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'D0:1=2;4=3;10=4,' +
      'D1:1=2;2=3;3=4,' +
      'D2:3=2;4=3,' +
      'D3:5=2;6=3,' +
      'D4:7=1;8=2;9=3,' +
      'D5:9=1;10=2;18=3,' +
      'D6:11=1;19=2,' +
      'D7:13=1;20=2,' +
      'D8:15=1,' +
      'D9:17=1',
  'Fighter':
    'HitDie=d10 ' +
    'Features=' +
      '"1:Armor Proficiency (Heavy/Shield)",' +
      '"1:Save Proficiency (Constitution/Strength)",' +
      '"1:Skill Proficiency (Choose 2 from Acrobatics, Animal Handling, Athletics, History, Insight, Intimidation, Perception, Survival)",' +
      '"1:Weapon Proficiency (Martial)",' +
      '"1:Second Wind","2:Action Surge","5:Extra Attack",9:Indomitable ' +
    'Selectables=' +
      '"1:Fighting Style (Archery):Fighting Style",' +
      '"1:Fighting Style (Defense):Fighting Style",' +
      '"1:Fighting Style (Dueling):Fighting Style",' +
      '"1:Fighting Style (Great Weapon Fighting):Fighting Style",' +
      '"1:Fighting Style (Protection):Fighting Style",' +
      '"1:Fighting Style (Two-Weapon Fighting):Fighting Style",' +
      '"3:Champion:Martial Archetype"',
  'Monk':
    'HitDie=d8 ' +
    'Features=' +
      '"1:Save Proficiency (Dexterity/Strength)",' +
      '"1:Skill Proficiency (Choose 2 from Acrobatics, Athletics, History, Insight, Religion, Stealth)",' +
      '"1:Tool Proficiency (Choose 1 from any Artisan, any Music)",' +
      '"1:Weapon Proficiency (Simple/Shortsword)",' +
      '"1:Martial Arts","1:Monk Bonus Attack","1:Monk Unarmored Defense",' +
      '"2:Flurry Of Blows","2:Ki","2:Patient Defense","2:Step Of The Wind",' +
      '"2:Unarmored Movement","3:Deflect Missiles","4:Slow Fall",' +
      '"5:Extra Attack","5:Stunning Strike","6:Ki-Empowered Strikes",' +
      '7:Evasion,"7:Stillness Of Mind","9:Improved Unarmored Movement",' +
      '"10:Purity Of Body","13:Tongue Of The Sun And Moon","14:Diamond Soul",' +
      '"15:Monk Timeless Body","18:Empty Body","20:Perfect Self" ' +
    'Selectables=' +
      '"3:Way Of The Open Hand:Monastic Tradition" ' +
    'CasterLevelDivine=levels.Monk ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'M0:30=0', // Dummy slot, since all Monk spells come from features
  'Paladin':
    'HitDie=d10 ' +
    'Features=' +
      '"1:Armor Proficiency (Heavy/Shield)",' +
      '"1:Save Proficiency (Charisma/Wisdom)",' +
      '"1:Skill Proficiency (Choose 2 from Athletics, Insight, Intimidation, Medicine, Persuasion, Religion)",' +
      '"1:Weapon Proficiency (Martial)",' +
      '"1:Divine Sense","1:Lay On Hands","2:Divine Smite",2:Spellcasting,' +
      '"3:Channel Divinity","3:Divine Health","5:Extra Attack",' +
      '"6:Aura Of Protection","10:Aura Of Courage",' +
      '"11:Improved Divine Smite","14:Cleansing Touch" ' +
    'Selectables=' +
      '"2:Fighting Style (Defense):Fighting Style",' +
      '"2:Fighting Style (Dueling):Fighting Style",' +
      '"2:Fighting Style (Great Weapon Fighting):Fighting Style",' +
      '"2:Fighting Style (Protection):Fighting Style",' +
      '"3:Oath Of Devotion:Sacred Oath" ' +
    'CasterLevelDivine=levels.Paladin ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'P1:2=2;3=3;5=4,' +
      'P2:5=2;7=3,' +
      'P3:9=2;11=3,' +
      'P4:13=1;15=2;17=3,' +
      'P5:17=1;19=2',
  'Ranger':
    'HitDie=d10 ' +
    'Features=' +
      '"1:Armor Proficiency (Medium/Shield)",' +
      '"1:Save Proficiency (Dexterity/Strength)",' +
      '"1:Skill Proficiency (Choose 3 from Animal Handling, Athletics, Insight, Investigation, Nature, Perception, Stealth, Survival)",' +
      '"1:Weapon Proficiency (Martial)",' +
      '"1:Favored Enemy","1:Natural Explorer",2:Spellcasting,' +
      '"3:Primeval Awareness","5:Extra Attack","8:Land\'s Stride",' +
      '"10:Hide In Plain Sight","14:Vanish","18:Feral Senses",' +
      '"20:Foe Slayer" ' +
    'Selectables=' +
      '"2:Fighting Style (Archery):Fighting Style",' +
      '"2:Fighting Style (Defense):Fighting Style",' +
      '"2:Fighting Style (Dueling):Fighting Style",' +
      '"2:Fighting Style (Two-Weapon Fighting):Fighting Style",' +
      '"3:Hunter:Ranger Archetype",' +
      '"3:Colossus Slayer:Hunter Technique",' +
      '"3:Giant Killer:Hunter Technique",' +
      '"3:Horde Breaker:Hunter Technique",' +
      '"7:Escape The Horde:Hunter Technique",' +
      '"7:Multiattack Defense:Hunter Technique",' +
      '"7:Steel Will:Hunter Technique",' +
      '"11:Volley:Hunter Technique",' +
      '"11:Whirlwind Attack:Hunter Technique",' +
      '"15:Evasion:Hunter Technique",' +
      '"15:Stand Against The Tide:Hunter Technique",' +
      '"15:Uncanny Dodge:Hunter Technique" ' +
    'CasterLevelDivine=levels.Ranger ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'R1:2=2;3=3;5=4,' +
      'R2:5=2;7=3,' +
      'R3:9=2;11=3,' +
      'R4:13=1;15=2;17=3,' +
      'R5:17=1;19=2',
  'Rogue':
    'HitDie=d8 ' +
    'Features=' +
      '"1:Armor Proficiency (Light)",' +
      '"1:Save Proficiency (Dexterity/Intelligence)",' +
      '"1:Skill Proficiency (Choose 4 from Acrobatics, Athletics, Deception, Insight, Intimidation, Investigation, Perception, Performance, Persuasion, Sleight Of Hand, Stealth)",' +
      '"1:Tool Proficiency (Thieves\' Tools)",' +
      '"1:Weapon Proficiency (Simple/Hand Crossbow/Longsword/Rapier/Shortsword)",' +
      '"1:Tool Proficiency (Thieves\' Tools)",' +
      '"1:Rogue Expertise","1:Sneak Attack","1:Thieves\' Cant",' +
      '"2:Cunning Action","5:Uncanny Dodge",7:Evasion,"11:Reliable Talent",' +
      '14:Blindsense,"15:Slippery Mind",18:Elusive,"20:Stroke Of Luck" ' +
    'Selectables=' +
      '"3:Thief:Roguish Archetype"',
  'Sorcerer':
    'HitDie=d6 ' +
    'Features=' +
      '"1:Save Proficiency (Charisma/Constitution)",' +
      '"1:Skill Proficiency (Choose 2 from Arcana, Deception, Insight, Intimidation, Persuasion, Religion)",' +
      '"1:Weapon Proficiency (Dagger/Dart/Sling/Quarterstaff/Light Crossbow)",' +
      '1:Spellcasting,"2:Font Of Magic","2:Flexible Casting",' +
      '"20:Sorcerous Restoration" ' +
    'Selectables=' +
      '"1:Draconic Bloodline:Sorcerous Origin",' +
      '"3:Careful Spell:Metamagic","3:Distant Spell:Metamagic",' +
      '"3:Empowered Spell:Metamagic","3:Extended Spell:Metamagic",' +
      '"3:Heightened Spell:Metamagic","3:Quickened Spell:Metamagic",' +
      '"3:Subtle Spell:Metamagic","3:Twinned Spell:Metamagic" ' +
    'CasterLevelArcane=levels.Sorcerer ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'S0:1=4;4=5;10=6,' +
      'S1:1=2;2=3;3=4,' +
      'S2:3=2;4=3,' +
      'S3:5=2;6=3,' +
      'S4:7=1;8=2;9=3,' +
      'S5:9=1;10=2;18=3,' +
      'S6:11=1;19=2,' +
      'S7:13=1;20=2,' +
      'S8:15=1,' +
      'S9:17=1',
  'Warlock':
    'HitDie=d8 ' +
    'Features=' +
      '"1:Armor Proficiency (Light)",' +
      '"1:Save Proficiency (Charisma/Wisdom)",' +
      '"1:Skill Proficiency (Choose 2 from Arcana, Deception, History, Intimidation, Investigation, Nature, Religion)",' +
      '"1:Weapon Proficiency (Simple)",' +
      '"1:Pact Magic","2:Eldritch Invocations","11:Mystic Arcanum",' +
      '"20:Eldritch Master" ' +
    'Selectables=' +
      '"1:The Fiend:Otherworldly Patron",' +
      '"3:Pact Of The Blade:Pact Boon","3:Pact Of The Chain:Pact Boon",' +
      '"3:Pact Of The Tome:Pact Boon",' +
      '"2:Agonizing Blast:Eldritch Invocation",' +
      '"2:Armor Of Shadows:Eldritch Invocation",' +
      '"2:Beast Speech:Eldritch Invocation",' +
      '"2:Beguiling Influence:Eldritch Invocation",' +
      '"2:Devil\'s Sight:Eldritch Invocation",' +
      '"2:Eldritch Sight:Eldritch Invocation",' +
      '"2:Eldritch Spear:Eldritch Invocation",' +
      '"2:Eyes Of The Rune Keeper:Eldritch Invocation",' +
      '"2:Fiendish Vigor:Eldritch Invocation",' +
      '"2:Gaze Of Two Minds:Eldritch Invocation",' +
      '"2:Mask Of Many Faces:Eldritch Invocation",' +
      '"2:Misty Visions:Eldritch Invocation",' +
      '"2:Repelling Blast:Eldritch Invocation",' +
      '"2:Thief Of Five Fates:Eldritch Invocation",' +
      '"5:Mire The Mind:Eldritch Invocation",' +
      '"5:One With Shadows:Eldritch Invocation",' +
      '"5:Sign Of Ill Omen:Eldritch Invocation",' +
      '"7:Bewitching Whispers:Eldritch Invocation",' +
      '"7:Dreadful Word:Eldritch Invocation",' +
      '"7:Sculptor Of Flesh:Eldritch Invocation",' +
      '"9:Ascendant Step:Eldritch Invocation",' +
      '"9:Minions Of Chaos:Eldritch Invocation",' +
      '"9:Otherworldly Leap:Eldritch Invocation",' +
      '"9:Whispers Of The Grave:Eldritch Invocation",' +
      '"15:Master Of Myriad Forms:Eldritch Invocation",' +
      '"15:Visions Of Distant Realms:Eldritch Invocation",' +
      '"15:Witch Sight:Eldritch Invocation",' +
      '"features.Pact Of The Tome ? 2:Book Of Ancient Secrets",' +
      '"features.Pact Of The Chain ? 15:Chains Of Carceri",' +
      '"features.Pact Of The Blade ? 12:Lifedrinker",' +
      '"features.Pact Of The Blade ? 5:Thirsting Blade",' +
      '"features.Pact Of The Chain ? 2:Voice Of The Chain Master" ' +
    'CasterLevelArcane=levels.Warlock ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'K0:1=2;4=3;10=4,' +
      'K1:1=1;2=2;3=null,' +
      'K2:3=2;5=null,' +
      'K3:5=2;7=null,' +
      'K4:7=2;9=null,' +
      'K5:9=2;11=3;17=4',
  'Wizard':
    'HitDie=d6 ' +
    'Features=' +
      '"1:Save Proficiency (Intelligence/Wisdom)",' +
      '"1:Skill Proficiency (Choose 2 from Arcana, History, Insight, Investigation, Medicine, Religion)",' +
      '"1:Weapon Proficiency (Dagger/Dart/Light Crossbow/Quarterstaff/Sling)",' +
      '"1:Arcane Recovery","1:Ritual Casting",1:Spellcasting,' +
      '"18:Spell Mastery","20:Signature Spells" ' +
    'Selectables=' +
      '"2:School Of Evocation:Arcane Tradition" ' +
    'CasterLevelArcane=levels.Wizard ' +
    'SpellAbility=intelligence ' +
    'SpellSlots=' +
      'W0:1=3;4=4;10=5,' +
      'W1:1=2;2=3;3=4,' +
      'W2:3=2;4=3,' +
      'W3:5=2;6=3,' +
      'W4:7=1;8=2;9=3,' +
      'W5:9=1;10=2;18=3,' +
      'W6:11=1;19=2,' +
      'W7:13=1;20=2,' +
      'W8:15=1,' +
      'W9:17=1',
};
SRD5E.FEATS = {
  'Ability Boost':'',
  'Grappler':'Require="strength >= 13"'
};
SRD5E.FEATURES = {
  // Background
  'Shelter Of The Faithful':
    'Section=feature Note="Receive aid from associated temple"',
  // Class
  'Action Surge':'Section=combat Note="Take an extra action %V/short rest"',
  'Additional Fighting Style':
    'Section=combat Note="Select second Fighting Style"',
  'Additional Magical Secrets':
    'Section=magic Note="Learn 2 additional spells from any class"',
  'Agonizing Blast':
    'Section=magic Note="<i>Eldritch Blast</i> inflicts +%V HP"',
  'Arcane Recovery':
    'Section=magic Note="Short rest recovers %V spell slot levels 1/dy"',
  'Archdruid':'Section=magic Note="Unlimited Wild Shape"',
  'Armor Of Shadows':
    'Section=magic Note="Cast <i>Mage Armor</i> on self at will"',
  'Ascendant Step':'Section=magic Note="Cast <i>Levitate</i> on self at will"',
  'Aura Of Courage':
    'Section=save Note="R%V\' Gives self and allies immunity to fright"',
  'Aura Of Devotion':
    'Section=save Note="R%V\' Gives self and allies immunity to charm"',
  'Aura Of Protection':
    'Section=save Note="R%V\' Gives self and allies +%1 saves"',
  'Barbarian Unarmored Defense':'Section=combat Note="+%1 AC in no armor"',
  'Bard Expertise':'Section=skill Note="Dbl proficiency on %V chosen skills"',
  'Bardic Inspiration':
    'Section=magic ' +
    'Note="R60\' Give +1d%V bonus to ability, attack, or saving throw w/in 10 min %1/%2 rest"',
  'Beast Speech':'Section=magic Note="Cast <i>Speak With Animals</i> at will"',
  'Beast Spells':'Section=magic Note="Cast spells during Wild Shape"',
  'Beguiling Influence':
    'Section=skill Note="Skill Proficiency (Deception/Persuasion)"',
  'Bewitching Whispers':
    'Section=magic ' +
    'Note="Use Warlock spell slot to cast <i>Compulsion</i> 1/long rest"',
  'Blessed Healer':
    'Section=magic ' +
    'Note="Self regains 2 + spell level HP from casting healing spells"',
  'Blindsense':
    'Section=skill ' +
    'Note="R10\' Know location of hidden and invisible creatures"',
  'Book Of Ancient Secrets':
    'Section=magic Note="Inscribe spell rituals in <i>Book Of Shadows</i>"',
  'Brutal Critical':'Section=combat Note="Add %V dice to crit damage"',
  'Careful Spell':
    'Section=magic ' +
    'Note="Spend 1 Sorcery Point to protect %V creature(s) from self spell"',
  'Chains Of Carceri':
    'Section=magic ' +
    'Note="Cast <i>Hold Monster</i> on celestial, elemental, or fiend 1/long rest"',
  'Channel Divinity':'Section=feature Note="Use effect %V/short rest"',
  'Cleansing Touch':
    'Section=magic ' +
    'Note="Touch dispels spell effect on willing creature %V/long rest"',
  'Colossus Slayer':'Section=combat Note="+1d8 HP vs. damaged foe 1/rd"',
  'Countercharm':
    'Section=magic ' +
    'Note="R30\' Performance gives friendly listeners Adv on saves vs. charm and fright for 1 rd"',
  'Cunning Action':'Section=combat Note="Bonus Dash, Disengage, or Hide 1/rd"',
  'Cutting Words':
    'Section=combat ' +
    'Note="R60\' Use Reaction to subtract Bardic Inspiration die from foe roll"',
  'Danger Sense':'Section=save Note="Adv on Dex checks vs. visible dangers"',
  "Dark One's Blessing":
    'Section=combat Note="Gain %1 HP when foe drops to 0 HP"',
  "Dark One's Own Luck":
    'Section=feature Note="Add 1d10 to ability or save 1/short rest"',
  "Devil's Sight":'Section=feature Note="R120\' See normally in darkness"',
  'Deflect Missiles':
    'Section=combat Note="Use Reaction to reduce missile damage by 1d10+%V"',
  'Destroy Undead':'Section=combat Note="Turning destroys undead up to CR %V"',
  'Diamond Soul':
    'Section=save Note="Proficient all saves, spend 1 Ki Point to re-roll"',
  'Disciple Of Life':
    'Section=magic Note="Healing spells restore additional 2 + spell level HP"',
  'Distant Spell':
    'Section=magic ' +
    'Note="Spend 1 Sorcery Point to dbl spell range or touch at 30\'"',
  'Divine Health':'Section=save Note="Immune to disease"',
  'Divine Intervention':'Section=magic Note="%V% chance of deity help 1/wk"',
  'Divine Sense':
    'Section=magic ' +
    'Note="R60\' Know location of celestials, fiends, and undead for 1 rd %V/long rest"',
  'Divine Smite':
    'Section=combat ' +
    'Note="Spend spell slot for +(spell level + 1)d8 HP radiant melee weapon damage"',
  'Divine Strike':'Section=combat Note="Weapon inflicts +%Vd8 HP %1 1/rd"',
  'Draconic Presence':
    'Section=magic ' +
    'Note="R60\' Spend 5 Sorcery Points for aura that charms or frightens (DC %V Wis neg) for conc or 1 min"',
  'Draconic Resilience':'Section=combat Note="+%V HP/unarmored AC %1"',
  'Dragon Ancestor':
    'Section=skill ' +
    'Note="Fluent in Draconic, dbl proficiency on Cha checks w/dragons"',
  'Dragon Wings':'Section=ability Note="%{speed}\' fly speed"',
  'Dreadful Word':
    'Section=magic ' +
    'Note="Use Warlock spell slot to cast <i>Confusion</i> 1/long rest"',
  'Druid Bonus Cantrip':'Section=magic Note="Additional Druid cantrip"',
  'Druid Timeless Body':'Section=feature Note="Age at 1/10 rate"',
  'Druidic':'Section=skill Note="Speak secret language known only by druids"',
  'Eldritch Invocations':'Section=magic Note="Select %V"',
  'Eldritch Master':
    'Section=magic Note="Regain spells from patron 1/long rest"',
  'Eldritch Sight':'Section=magic Note="Cast <i>Detect Magic</i> at will"',
  'Eldritch Spear':'Section=magic Note="R300\' <i>Eldritch Blast</i>"',
  'Elemental Affinity':
    'Section=magic,save ' +
    'Note="+%V HP ancestry type damage on spells",' +
         '"Spend 1 Sorcery Point for 1 hr resistance to ancestry type damage"',
  'Elusive':'Section=combat Note="Foe attacks never have Adv"',
  'Empowered Evocation':'Section=magic Note="+%V HP evocation spell damage"',
  'Empowered Spell':
    'Section=magic ' +
    'Note="Spend 1 Sorcery Point to re-roll %V spell damage dice"',
  'Empty Body':
    'Section=magic ' +
    'Note="Spend 4 Ki Points for 1 min invisibility w/resistance to all damage but force, 8 Ki Points for <i>Astral Projection</i>"',
  'Escape The Horde':'Section=combat Note="Foe Disadv on OA"',
  'Evasion':'Section=save Note="Dex save yields no damage instead of half"',
  'Evocation Savant':
    'Section=magic Note="Copy evocation spells into spellbook for half cost"',
  'Extended Spell':
    'Section=magic Note="Spend 1 sorcery point to dbl spell duration"',
  'Extra Attack':'Section=combat Note="+%V Attacks Per Round"',
  'Eyes Of The Rune Keeper':'Section=feature Note="Read all writing"',
  'Fast Hands':
    'Section=combat ' +
    'Note="Use Cunning Action for Sleight Of Hand check, to disarm a trap, open a lock, or Use An Object"',
  'Fast Movement':'Section=ability Note="+10 Speed (heavy armor neg)"',
  'Favored Enemy':
    'Section=skill ' +
    'Note="Adv on Survival to track, Adv on Intelligence to recall info about, and learn the language of %V chosen creature types"',
  'Feral Instinct':
    'Section=combat Note="Adv on Initiative, rage and then act when surprised"',
  'Feral Senses':
    'Section=combat,skill ' +
    'Note="No Disadv vs. invisible foe","R30\' Aware of invisible creatures"',
  'Fiendish Resilience':
    'Section=save ' +
    'Note="Gain resistance to chosen damage type from non-magical and non-silver weapons until next short rest"',
  'Fiendish Vigor':
    'Section=magic Note="Cast <i>False Life</i> on self at will"',
  'Fighting Style (Archery)':'Section=combat Note="+2 ranged attacks"',
  'Fighting Style (Defense)':'Section=combat Note="+1 AC in armor"',
  'Fighting Style (Dueling)':
    'Section=combat Note="+2 damage with single, one-handed weapon"',
  'Fighting Style (Great Weapon Fighting)':
    'Section=combat Note="May re-roll 1s and 2s on two-handed weapon damage"',
  'Fighting Style (Protection)':
    'Section=combat ' +
    'Note="Use Reaction to impose attack Disadv on adjacent foe attacking ally"',
  'Fighting Style (Two-Weapon Fighting)':
    'Section=combat Note="Add ability modifier to second attack damage"',
  'Flexible Casting':
    'Section=magic Note="Convert Sorcery Points to and from spell slots"',
  'Flurry Of Blows':
    'Section=combat Note="Spend 1 Ki Point for 2 additional unarmed strikes"',
  'Foe Slayer':
    'Section=combat Note="+%V attack or damage vs. favored enemy 1/rd"',
  'Font Of Inspiration':
    'Section=magic Note="Refresh Bardic Inspiration after short rest"',
  'Font Of Magic':'Section=magic Note="Use %V Sorcery Points/long rest"',
  'Frenzy':
    'Section=combat ' +
    'Note="Bonus attack each rd during rage, exhausted afterwards"',
  'Gaze Of Two Minds':
    'Section=magic ' +
    'Note="Self perceive through willing touched senses for 1 rd"',
  'Giant Killer':
    'Section=combat ' +
    'Note="Use Reaction to attack adjacent Large or larger foe after miss"',
  'Heightened Spell':
    'Section=magic ' +
    'Note="Spend 3 Sorcery Points for target Disadv on spell save"',
  'Hide In Plain Sight':
    'Section=skill Note="+10 Stealth to hide using prepared camouflage"',
  'Holy Nimbus':
    'Section=magic,save ' +
    'Note="Emit 30\' bright light that inflicts 10 HP radiant to foes for 1 min 1/long rest",' +
         '"Adv on saves vs. spells by fiends and undead for 1 min 1/long rest"',
  'Horde Breaker':
    'Section=combat Note="Second attack on different adjacent foe"',
  'Hurl Through Hell':
    'Section=combat ' +
    'Note="Inflict 10d10 HP psychic on struck foe 1/long rest"',
  'Improved Critical':'Section=combat Note="Crit on natural 19"',
  'Improved Divine Smite':'Section=combat Note="+1d8 HP radiant melee damage"',
  'Improved Unarmored Movement':
    'Section=ability Note="Move across vertical surfaces and liquids"',
  'Indomitable Might':
    'Section=ability Note="Use Str score instead of roll for Str check"',
  'Indomitable':'Section=save Note="May re-roll failed save %V/long rest"',
  'Intimidating Presence':
    'Section=feature ' +
    'Note="R30\' Target creature frightened (DC %V Will neg) for 1 rd"',
  'Jack Of All Trades':
    'Section=ability Note="+%V non-proficient ability checks"',
  'Ki':'Section=feature Note="Use %V Ki Points/short rest"',
  'Ki-Empowered Strikes':
    'Section=combat Note="Unarmed attacks count as magical"',
  "Land's Stride":
    'Section=ability,save ' +
    'Note="Move normally through difficult terrain and nonmagical plants",' +
         '"Adv on saves vs. impeding plants"',
  'Lay On Hands':
    'Section=magic ' +
    'Note="Heal %V HP/long rest, use 5 HP worth to cure disease or poison"',
  'Life Bonus Proficiency':'Section=combat Note="Armor Proficiency (Heavy)"',
  'Lifedrinker':'Section=combat Note="Pact weapon inflicts +%V HP necrotic"',
  'Lore Bonus Proficiencies':
    'Section=skill Note="Skill Proficiency (Choose 3 from any)"',
  'Magical Secrets':
    'Section=magic Note="Learn %V additional spells from any class"',
  'Martial Arts':
    'Section=combat ' +
    'Note="When unarmored, gain +%1 attack and damage with monk weapons, raise damage die to 1d%V, and gain Monk Bonus Attack"',
  'Mask Of Many Faces':'Section=magic Note="Cast <i>Disguise Self</i> at will"',
  'Master Of Myriad Forms':
    'Section=magic Note="Cast <i>Alter Self</i> at will"',
  'Mindless Rage':
    'Section=save Note="Immunity to charm and fright during rage"',
  'Minions Of Chaos':
    'Section=magic ' +
    'Note="Use Warlock spell slot to cast <i>Conjure Elemental</i> 1/long rest"',
  'Mire The Mind':
    'Section=magic ' +
    'Note="Use Warlock spell slot to cast <i>Slow</i> 1/long rest"',
  'Misty Visions':'Section=magic Note="Cast <i>Silent Image</i> at will"',
  'Monk Bonus Attack':
    'Section=combat Note="Bonus unarmed strike after monk weapon attack"',
  'Monk Timeless Body':
    'Section=feature Note="No debility from aging, need no food or water"',
  'Monk Unarmored Defense':'Section=combat Note="+%1 AC in no armor"',
  'Multiattack Defense':
    'Section=combat Note="+4 AC on additional foe attacks after hit"',
  'Mystic Arcanum':'Section=magic Note="Use %V spells 1/long rest"',
  'Natural Explorer':
    'Section=skill ' +
    'Note="Gain dbl Int and Wis Proficiency, move normally through difficult terrain, never become lost, remain always alert, stealth alone at full speed, locate dbl food, and gain extra info from tracking in %V chosen terrain types"',
  'Natural Recovery':
    'Section=magic ' +
    'Note="Recover %V spell slot levels during short rest 1/long rest"',
  "Nature's Sanctuary":
    'Section=combat ' +
    'Note="Beasts and plants cannot attack self (DC %V Will neg)"',
  "Nature's Ward":
    'Section=save ' +
    'Note="Immunity to disease, poison, and elemental and fey charm and fright"',
  'One With Shadows':'Section=magic Note="Invisible in dim light until action"',
  'Open Hand Technique':
    'Section=combat ' +
    'Note="On Flurry of Blows hit, choice of knock prone (DC %V Dex neg), push 15\' (DC %V Str neg), or deny foe Reaction for 1 rd"',
  'Otherworldly Leap':'Section=magic Note="Cast <i>Jump</i> on self at will"',
  'Overchannel':
    'Section=magic ' +
    'Note="Evocation spell up to level 5 inflicts maximum damage, self takes 2+d12 HP necrotic damage after first time/long rest"',
  'Pact Of The Blade':'Section=magic Note="Create magic weapon"',
  'Pact Of The Chain':
    'Section=magic ' +
    'Note="Know <i>Find Familiar</i>, forego one attack for familiar attack"',
  'Pact Of The Tome':
    'Section=magic Note="Gain <i>Book Of Shadows</i> w/3 cantrips"',
  'Patient Defense':'Section=combat Note="Spend 1 Ki Point for bonus Dodge"',
  'Peerless Skill':
    'Section=ability Note="Add Bardic Inspiration die to ability check"',
  'Perfect Self':'Section=combat Note="Minimum 4 Ki Points after initiative"',
  'Persistent Rage':
    'Section=combat Note="Continue raging when unengaged w/foe"',
  'Potent Cantrip':
    'Section=magic Note="Target takes half damage on cantrip save"',
  'Preserve Life':
    'Section=magic ' +
    'Note="R30\' Channel Divinity restores %V HP among targets, up to half max HP each"',
  'Primal Champion':'Section=ability Note="+4 Strength/+4 Constitution"',
  'Primeval Awareness':
    'Section=magic ' +
    'Note="Use spell slot to sense creatures in 1 mile (favored terrain 6 miles) for 1 min/spell level"',
  'Purity Of Body':'Section=save Note="Immune to disease and poison"',
  'Purity Of Spirit':
    'Section=magic ' +
    'Note="Continuous <i>Protection From Evil And Good</i> on self"',
  'Quickened Spell':
    'Section=magic Note="Spend 2 Sorcery Points to cast spell as bonus action"',
  'Quivering Palm':
    'Section=combat ' +
    'Note="Spend 3 Ki Points to reduce foe to 0 HP w/in %1 dy after unarmed hit (DC %V Con suffer 10d10 HP necrotic)"',
  'Rage':
    'Section=ability,combat,feature,magic,save ' +
    'Note=' +
      '"Adv on Str checks",' +
      '"+%V melee damage",' +
      '"Rage advantages for 1 min %V/long rest (heavy armor neg)",' +
      '"Cannot cast or concentrate during rage",' +
       '"Adv on Str saves, resistance to bludgeoning, piercing, and slashing damage"',
  'Reckless Attack':
    'Section=combat ' +
    'Note="Trade Adv on melee Str attacks for foe Adv on all attacks"',
  'Relentless Rage':
    'Section=combat Note="DC 10+ Con to keep 1 HP when brought to 0 HP"',
  'Reliable Talent':
    'Section=ability Note="Minimum 10 on proficient ability rolls"',
  'Remarkable Athlete':
    'Section=ability,skill ' +
    'Note="+%V non-proficient Str, Dex, and Con checks",' +
         '"+%V\' running jump"',
  'Repelling Blast':
    'Section=magic Note="<i>Eldritch Blast</i> pushes target 10\'"',
  'Retaliation':
    'Section=combat ' +
    'Note="Use Reaction to make melee attack after taking damage"',
  'Ritual Casting':'Section=magic Note="Cast known spell as ritual"',
  'Rogue Expertise':
    'Section=skill Note="Dbl proficiency on %V skills or Thieves\' Tools"',
  'Sacred Weapon':
    'Section=combat ' +
    'Note="Channel Divinity gives weapon +%V attack and 20\' light for 1 min"',
  'Sculpt Spells':
    'Section=magic ' +
    'Note="Protect spell level + 1 targets from self evocation spell effects"',
  'Sculptor Of Flesh':
    'Section=magic ' +
    'Note="Use Warlock spell slot to cast <i>Polymorph</i> 1/long rest"',
  'Second Wind':'Section=combat Note="Regain 1d10+%V HP 1/short rest"',
  'Second-Story Work':
    'Section=ability,skill Note="Climb at full speed","+%V\' running jump"',
  'Sign Of Ill Omen':
    'Section=magic ' +
    'Note="Use Warlock spell slot to cast <i>Bestow Curse</i> 1/long rest"',
  'Signature Spells':
    'Section=magic Note="Cast 2 chosen W3 spells 1/short rest"',
  'Slippery Mind':'Section=save Note="Save Proficiency (Wisdom)"',
  'Slow Fall':'Section=ability Note="Use Reaction for -%V HP falling damage"',
  'Sneak Attack':
    'Section=combat Note="+%Vd6 damage on attacks w/Adv or shared threat"',
  'Song Of Rest':
    'Section=magic Note="Friendly listeners regain +1d%V HP after short rest"',
  'Sorcerous Restoration':
    'Section=magic Note="Regain 4 Sorcery Points/short rest"',
  'Spell Mastery':
    'Section=magic Note="Cast chosen W1 spell and W2 spell at will"',
  'Stand Against The Tide':
    'Section=combat ' +
    'Note="Use Reaction to redirect foe melee miss to another creature"',
  'Steel Will':'Section=save Note="Adv on saves vs. fright"',
  'Step Of The Wind':
    'Section=combat ' +
    'Note="Spend 1 Ki Point for bonus Disengage or Dash and dbl jump"',
  'Stillness Of Mind':'Section=save Note="End self charm and fright at will"',
  'Stroke Of Luck':
    'Section=ability,combat ' +
    'Note="Automatic 20 ability check 1/short rest",' +
         '"Change miss into hit 1/short rest"',
  'Stunning Strike':
    'Section=combat ' +
    'Note="Spend 1 Ki Point to stun foe after hit (DC %V Con neg) for 1 rd"',
  'Subtle Spell':
    'Section=magic ' +
    'Note="Spend 1 Sorcery Point to cast w/out somatic or verbal components"',
  'Superior Critical':'Section=combat Note="Crit on natural 18"',
  'Superior Inspiration':
    'Section=combat Note="Minimum 1 Bardic Inspiration after initiative"',
  'Supreme Healing':'Section=magic Note="Healing spells yield max HP"',
  'Supreme Sneak':
    'Section=skill Note="Adv on Stealth when moving at half speed"',
  'Survivor':
    'Section=combat Note="Regain %V HP each rd when between 1 and %1 HP"',
  'Thief Of Five Fates':
    'Section=magic ' +
    'Note="Use Warlock spell slot to cast <i>Bane</i> 1/long rest"',
  "Thieves' Cant":'Section=skill Note="Signs and symbols known only by rogues"',
  "Thief's Reflexes":
    'Section=combat Note="First round extra tn at -10 Initiative"',
  'Thirsting Blade':'Section=combat Note="2 attacks/rd w/pact blade"',
  'Tongue Of The Sun And Moon':
    'Section=feature Note="Communicate in any language"',
  'Tranquility':
    'Section=magic ' +
    'Note="Self <i>Sanctuary</i> until next long rest (DC %V Wis neg)"',
  'Turn The Unholy':
    'Section=magic ' +
    'Note="R30\' Channel Divinity makes fiends and undead flee (DC %V Wis neg) for 1 min"',
  'Turn Undead':
    'Section=combat ' +
    'Note="R30\' Channel Divinity makes undead flee (DC %V Wis neg) for 1 min"',
  'Twinned Spell':
    'Section=magic ' +
    'Note="Spend spell level Sorcery Points to add second target"',
  'Unarmored Movement':'Section=ability Note="+%V speed in no armor"',
  'Uncanny Dodge':'Section=combat Note="Use Reaction for half damage"',
  'Use Magic Device':
    'Section=skill Note="Use otherwise restricted magic devices"',
  'Vanish':
    'Section=skill Note="Hide as bonus action, untrackable nonmagically"',
  'Visions Of Distant Realms':
    'Section=magic Note="Cast <i>Arcane Eye</i> at will"',
  'Voice Of The Chain Master':
    'Section=feature Note="Perceive and speak through familiar"',
  'Volley':
    'Section=combat Note="Ranged attack any number of foes in 10\' radius"',
  'Whirlwind Attack':
    'Section=combat Note="Melee attack any number of adjacent foes"',
  'Whispers Of The Grave':
    'Section=magic Note="Cast <i>Speak With Dead</i> at will"',
  'Wholeness Of Body':'Section=feature Note="Regain %V HP 1/long rest"',
  'Wild Shape':
    'Section=magic ' +
    'Note="Transform into CR %1%2 creature for %3 hr %4/short rest"',
  'Witch Sight':
    'Section=feature Note="R30\' See true forms"',
  // Feat
  'Ability Boost':'Section=ability Note="Ability Boost (Choose %V from any)"',
  'Grappler':
    'Section=combat ' +
    // Note: grapple larger foes benefit removed by errata
    'Note="Adv on attacks on grappled foe; additional grapple to pin"',
  // Race
  "Artificer's Lore":
    'Section=skill ' +
    'Note="Dbl History proficiency regarding magic, alchemical, and tech objects"',
  'Brave':
    'Section=save Note="Adv on saves vs. fright"',
  'Darkvision':
    'Section=feature Note="R60\' See one light level better"',
  'Dragonborn Ability Adjustment':
    'Section=ability Note="+2 Strength/+1 Charisma"',
  'Dragonborn Breath Weapon':
    'Section=combat Note="%1 inflicts %Vd6 HP %2 (DC %3 %4 half)"',
  'Dragonborn Damage Resistance':
    'Section=save Note="Resistance to %V damage"',
  'Dwarven Combat Training':
    'Section=combat ' +
    'Note="Weapon Proficiency (Battleaxe/Handaxe/Light Hammer/Warhammer)"',
  'Dwarven Resilience':
    'Section=save Note="Adv on saves vs. poison, resistance to poison damage"',
  'Dwarven Toughness':
    'Section=combat Note="+%V HP"',
  'Elf Cantrip':'Section=magic Note="Learn 1 Wizard cantrip"',
  'Elf Weapon Training':
    'Section=combat ' +
    'Note="Weapon Proficiency (Longbow/Longsword/Shortbow/Shortsword)"',
  'Fey Ancestry':
    'Section=save Note="Adv on saves vs. charm, immunity to sleep"',
  'Gnome Cunning':
    'Section=save Note="Adv on Cha, Int, and Wis saves vs. magic"',
  'Half-Elf Ability Adjustment':
    'Section=ability Note="+2 Charisma/Ability Boost (Choose 2 from any)"',
  'Half-Orc Ability Adjustment':
    'Section=ability Note="+2 Strength/+1 Constitution"',
  'Halfling Nimbleness':
    'Section=ability Note="Move through space occupied by larger creature"',
  'Hellish Resistance':
    'Section=save Note="Resistance to fire damage"',
  'High Elf Ability Adjustment':
    'Section=ability Note="+2 Dexterity/+1 Intelligence"',
  'Hill Dwarf Ability Adjustment':
    'Section=ability Note="+2 Constitution/+1 Wisdom"',
  'Human Ability Adjustment':
    'Section=ability ' +
    'Note="+1 Charisma/+1 Constitution/+1 Dexterity/+1 Intelligence/+1 Strength/+1 Wisdom"',
  'Infernal Legacy':'Section=magic Note="Know <i>Thaumaturgy</i> cantrip%1"',
  'Keen Senses':'Section=skill Note="Skill Proficiency (Perception)"',
  'Lightfoot Halfling Ability Adjustment':
    'Section=ability Note="+2 Dexterity/+1 Charisma"',
  'Lucky Halfling':
    'Section=feature ' +
    'Note="May re-roll 1s on attack, ability, and saving throws"',
  'Menacing':
    'Section=skill Note="Skill Proficiency (Intimidation)"',
  'Naturally Stealthy':
    'Section=skill Note="Hide behind a larger creature"',
  'Relentless Endurance':
    'Section=combat Note="Keep 1 HP when brought to 0 HP 1/long rest"',
  'Rock Gnome Ability Adjustment':
    'Section=ability Note="+2 Intelligence/+1 Constitution"',
  'Savage Attacks':
    'Section=combat Note="Add 1 die to melee crit damage"',
  'Skill Versatility':
    'Section=skill Note="Skill Proficiency (Choose 2 from any)"',
  'Slow':
    'Section=ability Note="-5 Speed"',
  'Small':
    'Section=combat Note="Disadv on attacks w/heavy weapons"',
  'Steady':
    'Section=ability Note="No speed penalty in heavy armor"',
  'Stonecunning':
    'Section=skill Note="Dbl proficiency on stonework History checks"',
  'Tiefling Ability Adjustment':
    'Section=ability Note="+2 Charisma/+1 Intelligence"',
  'Tinker':
    'Section=feature,skill ' +
    'Note="Tool Proficiency (Tinker\'s Tools)","Use Tinker\'s Tools to create tiny clockwork device in 1 hr"',
  'Trance':
    'Section=feature Note="4 hr meditation gives benefit of 8 hr sleep"',
  // Sanity, Validation and Miscellaneous
  'Bulky Armor':
    'Section=skill Note="Disadv on Stealth"',
  'Nonproficient Armor':
    'Section=sanity Note="Disadv on Dex and Str rolls, cannot cast spells"',
  'Two-Handed Weapon With Shield':
    'Section=validation Note="Shields cannot be used with two-handed weapons"'
};
SRD5E.GOODIES = {
  'Armor':
    'Pattern="([-+]\\d).*(?:armor(?:\\s+class)?|AC)|(?:armor(?:\\s+class)?|AC)\\s+([-+]\\d)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=armorClass ' +
    'Section=combat Note="%V Armor Class"',
  'Charisma':
    'Pattern="([-+]\\d)\\s+cha(?:risma)?|cha(?:risma)?\\s+([-+]\\d)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=charisma ' +
    'Section=ability Note="%V Charisma"',
  'Charisma Proficiency':
    'Pattern="cha(?:risma)?\\s+proficiency" ' +
    'Effect=set ' +
    'Attribute=saveProficiency.Charisma ' +
    'Section=save Note="Proficiency in Charisma saves"',
  'Constitution':
    'Pattern="([-+]\\d)\\s+con(?:stitution)?|con(?:stitution)?\\s+([-+]\\d)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=constitution ' +
    'Section=ability Note="%V Constitution"',
  'Constitution Proficiency':
    'Pattern="con(?:stitution)?\\s+proficiency" ' +
    'Effect=set ' +
    'Attribute=saveProficiency.Constitution ' +
    'Section=save Note="Proficiency in Constitution saves"',
  'Dexterity':
    'Pattern="([-+]\\d)\\s+dex(?:terity)?|dex(?:terity)?\\s+([-+]\\d)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=dexterity ' +
    'Section=ability Note="%V Dexterity"',
  'Dexterity Proficiency':
    'Pattern="dex(?:terity)?\\s+proficiency" ' +
    'Effect=set ' +
    'Attribute=saveProficiency.Dexterity ' +
    'Section=save Note="Proficiency in Dexterity saves"',
  'Feat Count':
    'Pattern="([-+]\\d)\\s+feat|feat\\s+([-+]\\d)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=featCount.General ' +
    'Section=feature Note="%V General Feat"',
  'Heavy Armor Proficiency':
    'Pattern="heavy\\s+armor\\s+proficiency" ' +
    'Effect=set ' +
    'Attribute=armorProficiency.Heavy ' +
    'Section=combat Note="Proficiency in all heavy armor"',
  'Initiative':
    'Pattern="([-+]\\d)\\s+initiative|initiative\\s+([-+]\\d)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=initiative ' +
    'Section=combat Note="%V Initiative"',
  'Intelligence':
    'Pattern="([-+]\\d)\\s+int(?:elligence)?|int(?:elligence)?\\s+([-+]\\d)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=intelligence ' +
    'Section=ability Note="%V Intelligence"',
  'Intelligence Proficiency':
    'Pattern="int(?:elligence)?\\s+proficiency" ' +
    'Effect=set ' +
    'Attribute=saveProficiency.Intelligence ' +
    'Section=save Note="Proficiency in Intelligence saves"',
  'Light Armor Proficiency':
    'Pattern="light\\s+armor\\s+proficiency" ' +
    'Effect=set ' +
    'Attribute=armorProficiency.Light ' +
    'Section=combat Note="Proficiency in all light armor"',
  'Martial Weapon Proficiency':
    'Pattern="martial\\s+weapon\\s+proficiency" ' +
    'Effect=set ' +
    'Attribute=weaponProficiency.Martial ' +
    'Section=combat Note="Proficiency in all martial weapons"',
  'Medium Armor Proficiency':
    'Pattern="medium\\s+armor\\s+proficiency" ' +
    'Effect=set ' +
    'Attribute=armorProficiency.Medium ' +
    'Section=combat Note="Proficiency in all medium armor"',
  'Protection':
    'Pattern="([-+]\\d).*protection|protection\\s+([-+]\\d)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=armorClass ' +
    'Section=combat Note="%V Armor Class"',
  'Shield':
    'Pattern="([-+]\\d).*\\s+shield|shield\\s+([-+]\\d)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=armorClass ' +
    'Section=combat Note="%V Armor Class"',
  'Shield Proficiency':
    'Pattern="shield\\s+proficiency" ' +
    'Effect=set ' +
    'Attribute=armorProficiency.Shield ' +
    'Section=combat Note="Proficiency in shield use"',
  'Simple Weapon Proficiency':
    'Pattern="simple\\s+weapon\\s+proficiency" ' +
    'Effect=set ' +
    'Attribute=weaponProficiency.Simple ' +
    'Section=combat Note="Proficiency in all simple weapons"',
  'Speed':
    'Pattern="([-+]\\d).*\\s+speed|speed\\s+([-+]\\d)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=speed ' +
    'Section=ability Note="%V Speed"',
  'Strength':
    'Pattern="([-+]\\d)\\s+str(?:ength)?|str(?:ength)?\\s+([-+]\\d)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=strength ' +
    'Section=ability Note="%V Strength"',
  'Strength Proficiency':
    'Pattern="str(?:ength)?\\s+proficiency" ' +
    'Effect=set ' +
    'Attribute=saveProficiency.Strength ' +
    'Section=save Note="Proficiency in Strength saves"',
  'Wisdom':
    'Pattern="([-+]\\d)\\s+wis(?:dom)?|wis(?:dom)?\\s+([-+]\\d)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=wisdom ' +
    'Section=ability Note="%V Wisdom"',
  'Wisdom Proficiency':
    'Pattern="wis(?:dom)?\\s+proficiency" ' +
    'Effect=set ' +
    'Attribute=saveProficiency.Wisdom ' +
    'Section=save Note="Proficiency in Wisdom saves"'
};
SRD5E.LANGUAGES = {
  'Abyssal':'',
  'Celestial':'',
  'Common':'',
  'Deep Speech':'',
  'Draconic':'',
  'Dwarvish':'',
  'Elvish':'',
  'Giant':'',
  'Gnomish':'',
  'Goblin':'',
  'Halfling':'',
  'Infernal':'',
  'Orc':'',
  'Primordial':'',
  'Sylvan':'',
  'Undercommon':''
};
SRD5E.PATHS = {
  'Champion':
    'Group=Fighter ' +
    'Level=levels.Fighter ' +
    'Features=' +
      '"3:Improved Critical","7:Remarkable Athlete","7:Remarkable Athlete",' +
      '"10:Additional Fighting Style","15:Superior Critical",18:Survivor',
  'Circle Of The Land (Arctic)':
    'Group=Druid ' +
    'Level=levels.Druid ' +
    'Features=' +
      '"2:Druid Bonus Cantrip","2:Natural Recovery","6:Land\'s Stride",' +
      '"10:Nature\'s Ward","14:Nature\'s Sanctuary" ' +
    'Spells=' +
      '"3:Hold Person,Spike Growth",' +
      '"5:Sleet Storm,Slow",' +
      '"7:Freedom Of Movement,Ice Storm",' +
      '"9:Commune With Nature,Cone Of Cold"',
  'Circle Of The Land (Coast)':
    'Group=Druid ' +
    'Level=levels.Druid ' +
    'Features=' +
      '"2:Druid Bonus Cantrip","2:Natural Recovery","6:Land\'s Stride",' +
      '"10:Nature\'s Ward","14:Nature\'s Sanctuary" ' +
    'Spells=' +
      '"3:Mirror Image,Misty Step",' +
      '"5:Water Breathing,Water Walk",' +
      '"7:Control Water,Freedom Of Movement",' +
      '"9:Conjure Elemental,Scrying"',
  'Circle Of The Land (Desert)':
    'Group=Druid ' +
    'Level=levels.Druid ' +
    'Features=' +
      '"2:Druid Bonus Cantrip","2:Natural Recovery","6:Land\'s Stride",' +
      '"10:Nature\'s Ward","14:Nature\'s Sanctuary" ' +
    'Spells=' +
      '"3:Blur,Silence",' +
      '"5:Create Food And Water,Protection From Energy",' +
      '"7:Blight,Hallucinatory Terrain",' +
      '"9:Insect Plague,Wall Of Stone"',
  'Circle Of The Land (Forest)':
    'Group=Druid ' +
    'Level=levels.Druid ' +
    'Features=' +
      '"2:Druid Bonus Cantrip","2:Natural Recovery","6:Land\'s Stride",' +
      '"10:Nature\'s Ward","14:Nature\'s Sanctuary" ' +
    'Spells=' +
      '"3:Barkskin,Spider Climb",' +
      '"5:Call Lightning,Plant Growth",' +
      '"7:Divination,Freedom Of Movement",' +
      '"9:Commune With Nature,Tree Stride"',
  'Circle Of The Land (Grassland)':
    'Group=Druid ' +
    'Level=levels.Druid ' +
    'Features=' +
      '"2:Druid Bonus Cantrip","2:Natural Recovery","6:Land\'s Stride",' +
      '"10:Nature\'s Ward","14:Nature\'s Sanctuary" ' +
    'Spells=' +
      '"3:Invisibility,Pass Without Trace",' +
      '"5:Daylight,Haste",' +
      '"7:Divination,Freedom Of Movement",' +
      '"9:Dream,Insect Plague"',
  'Circle Of The Land (Mountain)':
    'Group=Druid ' +
    'Level=levels.Druid ' +
    'Features=' +
      '"2:Druid Bonus Cantrip","2:Natural Recovery","6:Land\'s Stride",' +
      '"10:Nature\'s Ward","14:Nature\'s Sanctuary" ' +
    'Spells=' +
      '"3:Spider Climb,Spike Growth",' +
      '"5:Lightning Bolt,Meld Into Stone",' +
      '"7:Stone Shape,Stoneskin",' +
      '"9:Passwall,Wall Of Stone"',
  'Circle Of The Land (Swamp)':
    'Group=Druid ' +
    'Level=levels.Druid ' +
    'Features=' +
      '"2:Druid Bonus Cantrip","2:Natural Recovery","6:Land\'s Stride",' +
      '"10:Nature\'s Ward","14:Nature\'s Sanctuary" ' +
    'Spells=' +
      '"3:Acid Arrow,Darkness",' +
      '"5:Water Walk,Stinking Cloud",' +
      '"7:Freedom Of Movement,Locate Creature",' +
      '"9:Insect Plague,Scrying"',
  'College Of Lore':
    'Group=Bard ' +
    'Level=levels.Bard ' +
    'Features=' +
      '"3:Cutting Words","3:Lore Bonus Proficiencies",' +
      '"6:Additional Magical Secrets","14:Peerless Skill"',
  'Draconic Bloodline':
    'Group=Sorcerer ' +
    'Level=levels.Sorcerer ' +
    'Features=' +
      '"1:Draconic Resilience","1:Dragon Ancestor","6:Elemental Affinity",' +
      '"14:Dragon Wings","18:Draconic Presence"',
  'Life Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Disciple Of Life","1:Life Bonus Proficiency","2:Preserve Life",' +
      '"6:Blessed Healer","8:Divine Strike","17:Supreme Healing" ' +
    'Spells=' +
      '"1:Bless,Cure Wounds",' +
      '"3:Lesser Restoration,Spiritual Weapon",' +
      '"5:Beacon Of Hope,Revivify",' +
      '"7:Death Ward,Guardian Of Faith",' +
      '"9:Mass Cure Wounds,Raise Dead"',
  'Oath Of Devotion':
    'Group=Paladin ' +
    'Level=levels.Paladin ' +
    'Features=' +
      '"3:Sacred Weapon","3:Turn The Unholy","7:Aura Of Devotion",' +
      '"15:Purity Of Spirit","20:Holy Nimbus" ' +
    'Spells=' +
      '"3:Protection From Evil And Good,Sanctuary",' +
      '"5:Lesser Restoration,Zone Of Truth",' +
      '"9:Beacon Of Hope,Dispel Magic",' +
      '"13:Freedom Of Movement,Guardian Of Faith",' +
      '"17:Commune,Flame Strike"',
  'Path Of The Berserker':
    'Group=Barbarian ' +
    'Level=levels.Barbarian ' +
    'Features=' +
      '3:Frenzy,"6:Mindless Rage","10:Intimidating Presence",14:Retaliation',
  'School Of Evocation':
    'Group=Wizard ' +
    'Level=levels.Wizard ' +
    'Features=' +
      '"2:Evocation Savant","2:Sculpt Spells","6:Potent Cantrip",' +
      '"10:Empowered Evocation","14:Overchannel"',
  'The Fiend':
    'Group=Warlock ' +
    'Level=levels.Warlock ' +
    'Features=' +
      '"1:Dark One\'s Blessing","6:Dark One\'s Own Luck",' +
      '"10:Fiendish Resilience","14:Hurl Through Hell"',
  'Thief':
    'Group=Rogue ' +
    'Level=levels.Rogue ' +
    'Features=' +
      '"3:Fast Hands","3:Second-Story Work","9:Supreme Sneak",' +
      '"13:Use Magic Device","17:Thief\'s Reflexes"',
  'Way Of The Open Hand':
    'Group=Monk ' +
    'Level=levels.Monk ' +
    'Features=' +
      '"3:Open Hand Technique","6:Wholeness Of Body",11:Tranquility,' +
      '"17:Quivering Palm"'
};
SRD5E.RACES = {
  'Dragonborn':
    'Features=' +
      '"1:Dragonborn Ability Adjustment","1:Dragonborn Breath Weapon",' +
      '"1:Dragonborn Damage Resistance" ' +
    'Selectables=' +
      '"1:Black Draconic Ancestry","1:Blue Draconic Ancestry",' +
      '"1:Brass Draconic Ancestry","1:Bronze Draconic Ancestry",' +
      '"1:Copper Draconic Ancestry","1:Gold Draconic Ancestry",' +
      '"1:Green Draconic Ancestry","1:Red Draconic Ancestry",' +
      '"1:Silver Draconic Ancestry","1:White Draconic Ancestry" ' +
    'Languages=Common,Draconic',
  'Hill Dwarf':
    'Features=' +
      '"1:Tool Proficiency (Choose 1 from Brewer\'s Supplies, Mason\'s Tools, Smith\'s Tools)",' +
      '1:Darkvision,"1:Dwarven Combat Training","1:Dwarven Resilience",' +
      '"1:Dwarven Toughness","1:Hill Dwarf Ability Adjustment",1:Slow,' +
      '1:Steady,1:Stonecunning ' +
    'Languages=Common,Dwarvish',
  'High Elf':
    'Features=' +
      '1:Darkvision,"1:Elf Weapon Training","1:Elf Cantrip","1:Fey Ancestry",' +
      '"1:High Elf Ability Adjustment","1:Keen Senses",1:Trance ' +
    'Languages=Common,Elvish,any',
  'Rock Gnome':
    'Features=' +
      '"1:Artificer\'s Lore",1:Darkvision,"1:Gnome Cunning",' +
      '"1:Rock Gnome Ability Adjustment",1:Slow,1:Small,1:Tinker ' +
    'Languages=Common,Gnomish',
  'Half-Elf':
    'Features=' +
      '1:Darkvision,"1:Fey Ancestry","1:Half-Elf Ability Adjustment",' +
      '"1:Skill Versatility" ' +
    'Languages=Common,Elvish,any',
  'Half-Orc':
    'Features=' +
      '1:Darkvision,"1:Half-Orc Ability Adjustment",1:Menacing,' +
      '"1:Relentless Endurance","1:Savage Attacks" ' +
    'Languages=Common,Orc',
  'Lightfoot Halfling':
    'Features=' +
      '1:Brave,"1:Halfling Nimbleness",' +
      '"1:Lightfoot Halfling Ability Adjustment","1:Lucky Halfling",' +
      '"1:Naturally Stealthy",1:Slow,1:Small ' +
    'Languages=Common,Halfling',
  'Human':
    'Features=' +
      '"1:Human Ability Adjustment" ' +
      'Languages=Common,any',
  'Tiefling':
    'Features=' +
      '1:Darkvision,"1:Hellish Resistance","1:Infernal Legacy",' +
      '"1:Tiefling Ability Adjustment" ' +
    'Languages=Common,Infernal'
};
SRD5E.SCHOOLS = {
  'Abjuration':'',
  'Conjuration':'',
  'Divination':'',
  'Enchantment':'',
  'Evocation':'',
  'Illusion':'',
  'Necromancy':'',
  'Transmutation':''
};
SRD5E.SHIELDS = {
  'None':'AC=0',
  'Shield':'AC=2'
};
SRD5E.SKILLS = {
  'Acrobatics':'Ability=dexterity',
  'Animal Handling':'Ability=wisdom',
  'Arcana':'Ability=intelligence',
  'Athletics':'Ability=strength',
  'Deception':'Ability=charisma',
  'History':'Ability=intelligence',
  'Insight':'Ability=wisdom',
  'Intimidation':'Ability=charisma',
  'Investigation':'Ability=intelligence',
  'Medicine':'Ability=wisdom',
  'Nature':'Ability=intelligence',
  'Perception':'Ability=wisdom',
  'Performance':'Ability=charisma',
  'Persuasion':'Ability=charisma',
  'Religion':'Ability=intelligence',
  'Sleight Of Hand':'Ability=dexterity',
  'Stealth':'Ability=dexterity',
  'Survival':'Ability=wisdom'
};
// Note that spellRules replaces ?level? and ?modifier? in the spell
// descriptions with the appropriate caster level and ability modifer.
SRD5E.SPELLS = {

  'Acid Arrow':
    'School=Evocation ' +
    'Level=W2 ' +
    'Description="R90\' Ranged spell inflicts 4d4 HP acid, 2d4 HP next rd (miss half 1st rd, 0 HP 2nd)"',
  'Acid Splash':
    'School=Conjuration ' +
    'Level=S0,W0 ' +
    'Description="R60\' Ranged touch inflicts %{(level+7)//6}d6 HP acid (Dex neg)"',
  'Aid':
    'School=Abjuration ' +
    'Level=C2,P2 ' +
    'Description="R30\' 3 targets gain +5 temporary HP for 8 hr"',
  'Alarm':
    'School=Abjuration ' +
    'Level=R1,W1 ' +
    'Description="R30\' Entry into 20\' cu triggers audible or mental alarm for 8 hr"',
  'Alter Self':
    'School=Transmutation ' +
    'Level=S2,W2 ' +
    'Description="Self becomes aquatic, looks different, or gains natural weapons for conc or 1 hr"',
  'Animal Friendship':
    'School=Enchantment ' +
    'Level=B1,D1,R1 ' +
    'Description="R30\' Target beast convinced of good intent (Wis neg) for 1 dy"',
  'Animal Messenger':
    'School=Enchantment ' +
    'Level=B2,D2,R2 ' +
    'Description="R30\' Tiny beast target moves to deliver 25-word message to person described for 1 dy"',
  'Animal Shapes':
    'School=Transmutation ' +
    'Level=D8 ' +
    'Description="R30\' Willing targets become up to large, CR 4 creatures for conc or 1 dy"',
  'Animate Dead':
    'School=Necromancy ' +
    'Level=C3,W3 ' +
    'Description="R10\' Bones or corpse becomes skeleton or zombie, obeys R60\' self commands for 1 dy"',
  'Animate Objects':
    'School=Transmutation ' +
    'Level=B5,S5,W5 ' +
    'Description="R120\' 10 small, 5 medium, 2 large, or 1 huge objects obey R500\' commands for conc or 1 min"',
  'Antilife Shell':
    'School=Abjuration ' +
    'Level=D5 ' +
    'Description="10\' radius prevents creature passage for conc or 1 hr"',
  'Antimagic Field':
    'School=Abjuration ' +
    'Level=C8,W8 ' +
    'Description="10\' radius suppresses magic for conc or 1 hr"',
  'Antipathy/Sympathy':
    'School=Enchantment ' +
    'Level=D8,W8 ' +
    'Description="R60\' Target object repels or attracts specified creatures for 10 dy"',
  'Arcane Eye':
    'School=Divination ' +
    'Level=W4 ' +
    'Description="R30\' Self sees through remote invisible eye w/darkvision that moves 30\'/rd for conc or 1 hr"',
  'Arcane Hand':
    'School=Evocation ' +
    'Level=W5 ' +
    'Description="R120\' Large hand (AC 20, Str 26, Dex 10) can punch (inflicts 4d8 HP force), push 5\', grapple (inflicts 2d6+%{?modifier?} bludgeoning), and block for conc or 1 min"',
  'Arcane Lock':
    'School=Abjuration ' +
    'Level=W2 ' +
    'Description="Touched barrier becomes passable only by designated creatures"',
  "Arcanist's Magic Aura":
    'School=Illusion ' +
    'Level=W2 ' +
    'Description="Target reports false divinations for 1 dy"',
  'Astral Projection':
    'School=Necromancy ' +
    'Level=C9,K9,W9 ' +
    'Description="R10\' Self and 8 willing targets project to astral plane"',
  'Augury':
    'School=Divination ' +
    'Level=C2 ' +
    'Description="Self learns weal or woe outcome of act up to 30 min in the future"',
  'Awaken':
    'School=Transmutation ' +
    'Level=B5,D5 ' +
    'Description="Touched beast or plant gains Intelligence 10, speech, and movement and becomes friendly for 30 dy"',

  'Bane':
    'School=Enchantment ' +
    'Level=B1,C1 ' +
    'Description="R30\' 3 targets suffer -1d4 on attacks and saving throws (Cha neg) for conc or 1 min"',
  'Banishment':
    'School=Abjuration ' +
    'Level=C4,K4,P4,S4,W4 ' +
    'Description="R60\' Banishes target to home or demiplane (Cha neg) for conc or 1 min"',
  'Barkskin':
    'School=Transmutation ' +
    'Level=D2,R2 ' +
    'Description="Touched gains AC 16 for conc or 1 hr"',
  'Beacon Of Hope':
    'School=Abjuration ' +
    'Level=C3 ' +
    'Description="R30\' Targets gain Adv on Wis and death saves and maximum HP from healing for conc or 1 min"',
  'Bestow Curse':
    'School=Necromancy ' +
    'Level=B3,C3,W3 ' +
    'Description="Touched suffers choice of Disadv on specified ability rolls, Disadv on attacks on self, require Wis save to take any action, or +1d8 HP necrotic from self attacks (Wis neg) for conc or 1 min"',
  'Black Tentacles':
    'School=Conjuration ' +
    'Level=W4 ' +
    'Description="R90\' 20\' sq inflicts 3d6 HP bludgeoning and restrains (Dex neg, Str or Dex breaks free) for conc or 1 min"',
  'Blade Barrier':
    'School=Evocation ' +
    'Level=C6 ' +
    'Description="R90\' 100\'x20\'x5\' blade wall provides 3/4 cover and inflicts 6d10 HP slashing (Dex half) for conc or 10 min"',
  'Bless':
    'School=Enchantment ' +
    'Level=C1,P1 ' +
    'Description="R30\' 3 targets gain +1d4 on attacks and saving throws for conc or 1 min"',
  'Blight':
    'School=Necromancy ' +
    'Level=D4,K4,S4,W4 ' +
    'Description="R30\' target suffers 8d8 HP necrotic (Con half (plant Disadv, 64 HP on fail))"',
  'Blindness/Deafness':
    'School=Necromancy ' +
    'Level=B2,C2,"K2 [The Fiend]",S2,W2 ' +
    'Description="R30\' Inflicts choice of blindness or deafness on target (Con neg) for 1 min"',
  'Blink':
    'School=Transmutation ' +
    'Level=S3,W3 ' +
    'Description="Self becomes ethereal 50% of time for 1 min"',
  'Blur':
    'School=Illusion ' +
    'Level=S2,W2 ' +
    'Description="Foes suffer Disadv on self attacks for conc or 1 min"',
  'Branding Smite':
    'School=Evocation ' +
    'Level=P2 ' +
    'Description="Self attack inflicts +2d6 HP radiant and lights target for conc or 1 min"',
  'Burning Hands':
    'School=Evocation ' +
    'Level="K1 [The Fiend]",S1,W1 ' +
    'Description="15\' cone inflicts 3d6 HP fire (Dex half)"',

  'Call Lightning':
    'School=Conjuration ' +
    'Level=D3 ' +
    'Description="R120\' Bolt inflicts 3d10 HP lightning (Dex half) in 5\' radius 1/rd for conc or 10 min"',
  'Calm Emotions':
    'School=Enchantment ' +
    'Level=B2,C2 ' +
    'Description="R60\' 20\' radius suppresses charm and fright or hostility (Cha neg) for conc or 1 min"',
  'Chain Lightning':
    'School=Evocation ' +
    'Level=S6,W6 ' +
    'Description="R150\' 4 targets in 30\' radius suffer 10d8 HP lightning (Dex half)"',
  'Charm Person':
    'School=Enchantment ' +
    'Level=B1,D1,K1,S1,W1 ' +
    'Description="R30\' Target regards you as a friend (Wis neg) for 1 hr or until harmed"',
  'Chill Touch':
    'School=Necromancy ' +
    'Level=K0,S0,W0 ' +
    'Description="R120\' Ranged spell inflicts %{(level+7)//6}d8 HP necrotic, undead also suffer Disadv on self attack for 1 rd"',
  'Circle Of Death':
    'School=Necromancy ' +
    'Level=K6,S6,W6 ' +
    'Description="R150\' 60\' radius inflicts 8d6 HP necrotic (Con half)"',
  'Clairvoyance':
    'School=Divination ' +
    'Level=B3,C3,S3,W3 ' +
    'Description="R1 mile Self sees or hears remotely through invisible sensor for conc or 10 min"',
  'Clone':
    'School=Necromancy ' +
    'Level=W8 ' +
    'Description="Grows backup body for touched target"',
  'Cloudkill':
    'School=Conjuration ' +
    'Level=S5,W5 ' +
    'Description="R120\' 20\' radius inflicts 5d8 HP poison (Con half), moves away 10\'/rd for conc or 10 min"',
  'Color Spray':
    'School=Illusion ' +
    'Level=S1,W1 ' +
    'Description="15\' cone blinds 6d10 HP of targets for 1 rd"',
  'Command':
    'School=Enchantment ' +
    'Level=C1,"K1 [The Fiend]",P1 ' +
    'Description="R60\' Target obeys self one-word command (Wis neg)"',
  'Commune':
    'School=Divination ' +
    'Level=C5 ' +
    'Description="Deity answers 3 yes/no questions"',
  'Commune With Nature':
    'School=Divination ' +
    'Level=D5,R5 ' +
    'Description="Self gains 3 facts about nature w/in 3 miles (300\' underground)"',
  'Comprehend Languages':
    'School=Divination ' +
    'Level=B1,K1,S1,W1 ' +
    'Description="Self understands all languages for 1 hr"',
  'Compulsion':
    'School=Enchantment ' +
    'Level=B4 ' +
    'Description="R30\' Self controls target movement (Wis neg) for conc or 1 min"',
  'Cone Of Cold':
    'School=Evocation ' +
    'Level=S5,W5 ' +
    'Description="60\' cone inflicts 8d8 HP cold (Con half)"',
  'Confusion':
    'School=Enchantment ' +
    'Level=B4,D4,S4,W4 ' +
    'Description="R90\' Creatures in 10\' radius randomly 10% wander/50% do nothing/20% attack adjacent/20% act normally (Wis neg) for conc or 1 min"',
  'Conjure Animals':
    'School=Conjuration ' +
    'Level=D3,R3 ' +
    'Description="R60\' Summons obedient fey creatures for conc or 1 hr"',
  'Conjure Celestial':
    'School=Conjuration ' +
    'Level=C7 ' +
    'Description="R90\' Summons obedient celestial for conc or 1 hr"',
  'Conjure Elemental':
    'School=Conjuration ' +
    'Level=D5,W5 ' +
    'Description="R90\' Summons obedient environment-appropriate elemental for conc or 1 hr"',
  'Conjure Fey':
    'School=Conjuration ' +
    'Level=D6,K6 ' +
    'Description="R90\' Summons obedient fey for conc or 1 hr"',
  'Conjure Minor Elementals':
    'School=Conjuration ' +
    'Level=D4,W4 ' +
    'Description="R90\' Summons obedient elementals for conc or 1 hr"',
  'Conjure Woodland Beings':
    'School=Conjuration ' +
    'Level=D4,R4 ' +
    'Description="R60\' Summons obedient fey creatures for conc or 1 hr"',
  'Contact Other Plane':
    'School=Divination ' +
    'Level=K5,W5 ' +
    'Description="Self contact w/extraplanar being inflicts 6d6 HP psychic and insanity until long rest (DC 15 Int neg and receive 5 one-word answers)"',
  'Contagion':
    'School=Necromancy ' +
    'Level=C5,D5 ' +
    'Description="Touched poisoned, diseased for 7 dy after failing 3 Con saves (3 successes neg)"',
  'Contingency':
    'School=Evocation ' +
    'Level=W6 ' +
    'Description="Sets trigger for level 5 self spell for 10 dy"',
  'Continual Flame':
    'School=Evocation ' +
    'Level=C2,W2 ' +
    'Description="Touched emits heatless torch flame"',
  'Control Water':
    'School=Transmutation ' +
    'Level=C4,D4,W4 ' +
    'Description="R300\' 100\' water rises 20\', parts, redirects, or whirlpools for conc or 10 min"',
  'Control Weather':
    'School=Transmutation ' +
    'Level=C8,D8,W8 ' +
    'Description="Modifies seasonal weather in 5 mile radius for conc or 8 hr"',
  'Counterspell':
    'School=Abjuration ' +
    'Level=K3,S3,W3 ' +
    'Description="R60\' Negates foe casting up to spell level 3, DC 10 + spell level for higher"',
  'Create Food And Water':
    'School=Conjuration ' +
    'Level=C3,P3 ' +
    'Description="R30\' Creates 45 lb of food and 30 gallons of water"',
  'Create Or Destroy Water':
    'School=Transmutation ' +
    'Level=C1,D1 ' +
    'Description="R30\' Creates or destroys 10 gallons of water or 30\' fog"',
  'Create Undead':
    'School=Necromancy ' +
    'Level=C6,K6,W6 ' +
    'Description="R10\' 3 corpses become ghouls that obey self for 1 dy"',
  'Creation':
    'School=Illusion ' +
    'Level=S5,W5 ' +
    'Description="R30\' Creates 5\' cu of false matter lasting up to 1 dy"',
  'Cure Wounds':
    'School=Evocation ' +
    'Level=B1,C1,D1,P1,R1 ' +
    'Description="Touched regains 1d8+%{?modifier?} HP"',

  'Dancing Lights':
    'School=Evocation ' +
    'Level=B0,S0,W0 ' +
    'Description="R120\' 4 torch lights move 60\' for conc or 1 min"',
  'Darkness':
    'School=Evocation ' +
    'Level=K2,S2,W2 ' +
    'Description="R60\' Target centers 15\' radius lightless area for conc or 10 min"',
  'Darkvision':
    'School=Transmutation ' +
    'Level=D2,R2,S2,W2 ' +
    'Description="Touched sees 60\' in dark for 8 hr"',
  'Daylight':
    'School=Evocation ' +
    'Level=C3,D3,P3,R3,S3 ' +
    'Description="R60\' Target centers 60\' radius bright light for 1 hr"',
  'Death Ward':
    'School=Abjuration ' +
    'Level=C4,P4 ' +
    'Description="Touched keeps 1 HP when next reduced to 0 HP for 8 hrs"',
  'Delayed Blast Fireball':
    'School=Evocation ' +
    'Level=S7,W7 ' +
    'Description="R150\' 20\' radius inflicts 12d6 HP fire (Dex half) within conc or 1 min"',
  'Demiplane':
    'School=Conjuration ' +
    'Level=K8,W8 ' +
    'Description="R60\' Door leads to 30\' cu extradimensional room for 1 hr"',
  'Detect Evil And Good':
    'School=Divination ' +
    'Level=C1,P1 ' +
    'Description="R30\' Self senses aligned outsider, consecration, and desecration for conc or 10 min"',
  'Detect Magic':
    'School=Divination ' +
    'Level=B1,C1,D1,P1,R1,S1,W1 ' +
    'Description="R30\' Self senses magic auras for conc or 10 min"',
  'Detect Poison And Disease':
    'School=Divination ' +
    'Level=C1,D1,P1,R1 ' +
    'Description="R30\' Self senses poison for conc or 10 min"',
  'Detect Thoughts':
    'School=Divination ' +
    'Level=B2,S2,W2 ' +
    'Description="R30\' Self senses target thoughts for conc or 1 min"',
  'Dimension Door':
    'School=Conjuration ' +
    'Level=B4,K4,S4,W4 ' +
    'Description="Self and 1 other willing creature teleport up to 500\'"',
  'Disguise Self':
    'School=Illusion ' +
    'Level=B1,S1,W1 ' +
    'Description="Self clothing and body appear different for 1 hr"',
  'Disintegrate':
    'School=Transmutation ' +
    'Level=S6,W6 ' +
    'Description="R60\' Target suffers 10d6+40 HP force, dusts if reduced to 0 HP (Dex neg)"',
  'Dispel Evil And Good':
    'School=Abjuration ' +
    'Level=C5,P5 ' +
    'Description="Inflicts Disadv on self attacks by outsider foes for conc or 1 min; touch breaks enchantment; spell attack dismisses (Cha neg)"',
  'Dispel Magic':
    'School=Abjuration ' +
    'Level=B3,C3,D3,K3,P3,S3,W3 ' +
    'Description="R120\' Ends spell effects up to spell level 3 on target, higher levels require DC 10 + spell level check"',
  'Divination':
    'School=Divination ' +
    'Level=C4 ' +
    'Description="Self gains truthful answer about event up to 7 dy in the future"',
  'Divine Favor':
    'School=Evocation ' +
    'Level=P1 ' +
    'Description="Self weapons inflict +1d4 HP radiant for conc or 1 min"',
  'Divine Word':
    'School=Evocation ' +
    'Level=C7 ' +
    'Description="R30\' Kills (up to 20 HP), stuns (up to 30 HP), blinds (up to 40 HP), and deafens (up to 50 HP) targets (Cha neg)"',
  'Dominate Beast':
    'School=Enchantment ' +
    'Level=D4,S4 ' +
    'Description="R60\' Target obeys self telepathic commands (Wis neg) for conc or 1 min"',
  'Dominate Monster':
    'School=Enchantment ' +
    'Level=B8,K8,S8,W8 ' +
    'Description="R60\' Target obeys self telepathic commands (Wis neg) for conc or 1 hr"',
  'Dominate Person':
    'School=Enchantment ' +
    'Level=B5,S5,W5 ' +
    'Description="R60\' Target obeys self telepathic commands (Wis neg) for conc or 1 min"',
  'Dream':
    'School=Illusion ' +
    'Level=B5,K5,W5 ' +
    'Description="Touched communicates via dreams of known target"',
  'Druidcraft':
    'School=Transmutation ' +
    'Level=D0 ' +
    'Description="R30\' Self predicts 1 dy weather, blooms plant, creates minor sensory effect, or lights or snuffs small fire"',

  'Earthquake':
    'School=Evocation ' +
    'Level=C8,D8,S8 ' +
    'Description="R500\' 100\' radius opens fissures and damages structures"',
  'Eldritch Blast':
    'School=Evocation ' +
    'Level=K0 ' +
    'Description="R120\' Ranged spell creates %{(level+7)//6} rays that inflict 1d10 HP force each"',
  'Enhance Ability':
    'School=Transmutation ' +
    'Level=B2,C2,D2,S2 ' +
    'Description="Touched gains Adv on chosen ability checks for 1 hr; Con also adds +2d6 temporary HP, Str dbl load, and Dex no damage from 20\' fall"',
  'Enlarge/Reduce':
    'School=Transmutation ' +
    'Level=S2,W2 ' +
    'Description="R30\' Target becomes dbl (Adv on Str, +1d4 weapon damage) or half (Disadv on Str, -1d4 weapon damage) size for conc or 1 min"',
  'Entangle':
    'School=Conjuration ' +
    'Level=D1 ' +
    'Description="R90\' Growth ensnares creatures in 20\' sq (Str neg) for conc or 1 min"',
  'Enthrall':
    'School=Enchantment ' +
    'Level=B2,K2 ' +
    'Description="R60\' Target suffers Disadv on Perception to notice others (Wis neg) for 1 min"',
  'Etherealness':
    'School=Transmutation ' +
    'Level=B7,C7,K7,S7,W7 ' +
    'Description="Self enters Ethereal Plane for up to 8 hr"',
  'Expeditious Retreat':
    'School=Transmutation ' +
    'Level=K1,S1,W1 ' +
    'Description="Self gains bonus Dash for conc or 10 min"',
  'Eyebite':
    'School=Necromancy ' +
    'Level=B6,K6,S6,W6 ' +
    'Description="R60\' Sleeps, panics, or sickens (Disadv on attack and ability rolls) 1 target/rd for conc or 1 min"',

  'Fabricate':
    'School=Transmutation ' +
    'Level=W4 ' +
    'Description="R120\' Creates product from raw materials"',
  'Faerie Fire':
    'School=Evocation ' +
    'Level=B1,D1 ' +
    'Description="R60\' Objects in 20\' cu glow (foe Adv on attacks) (Dex neg) for conc or 1 min"',
  'Faithful Hound':
    'School=Conjuration ' +
    'Level=W4 ' +
    'Description="R30\' Invisible watchdog barks at intruders in 30\', attacks (+%{intelligenceModifier+proficiencyBonus} 4d8 HP piercing) in 5\' for 8 hr"',
  'False Life':
    'School=Necromancy ' +
    'Level=S1,W1 ' +
    'Description="Self gains 1d4+4 temporary HP for 1 hr"',
  'Fear':
    'School=Illusion ' +
    'Level=B3,K3,S3,W3 ' +
    'Description="Creatures in 30\' cone flee (Wis neg) for conc or 1 min"',
  'Feather Fall':
    'School=Transmutation ' +
    'Level=B1,S1,W1 ' +
    'Description="R60\' 5 falling targets slow to 60\'/rd for 1 min"',
  'Feeblemind':
    'School=Enchantment ' +
    'Level=B8,D8,K8,W8 ' +
    'Description="R150\' Target suffers 4d6 HP psychic, and Cha and Int drop to 1 (Int damage only)"',
  'Find Familiar':
    'School=Conjuration ' +
    'Level=W1 ' +
    'Description="R10\' Self gains service from summoned spirit in animal form"',
  'Find Steed':
    'School=Conjuration ' +
    'Level=P2 ' +
    'Description="R30\' Summons loyal steed"',
  'Find The Path':
    'School=Divination ' +
    'Level=B6,C6,D6 ' +
    'Description="Self knows shortest path to destination for conc or 1 dy"',
  'Find Traps':
    'School=Divination ' +
    'Level=C2,D2,R2 ' +
    'Description="R120\' Self senses presence of traps"',
  'Finger Of Death':
    'School=Necromancy ' +
    'Level=K7,S7,W7 ' +
    'Description="R60\' Target suffers 7d8+30 HP necrotic (Con half), becomes obedient zombie if killed"',
  'Fire Bolt':
    'School=Evocation ' +
    'Level=S0,W0 ' +
    'Description="R120\' Ranged spell inflicts 1d10 HP fire"',
  'Fire Shield':
    'School=Evocation ' +
    'Level="K4 [The Fiend]",W4 ' +
    'Description="Self gains resistance to heat or cold damage, successful melee attacker suffers 2d8 HP fire or cold for 10 min"',
  'Fire Storm':
    'School=Evocation ' +
    'Level=C7,D7,S7 ' +
    'Description="R150\' 10 10\' cu inflicts 7d10 HP fire (Dex half)"',
  'Fireball':
    'School=Evocation ' +
    'Level="K3 [The Fiend]",S3,W3 ' +
    'Description="R150\' 20\' radius inflicts 8d6 HP fire (Dex half)"',
  'Flame Blade':
    'School=Evocation ' +
    'Level=D2 ' +
    'Description="Self wields flaming blade that inflicts 3d6 HP fire and lights 10\' radius"',
  'Flame Strike':
    'School=Evocation ' +
    'Level=C5,"K5 [The Fiend]" ' +
    'Description="R60\' 10\' radius inflicts 4d6 HP fire and 4d6 HP radiant (Dex half)"',
  'Flaming Sphere':
    'School=Conjuration ' +
    'Level=D2,W2 ' +
    'Description="R60\' 5\' diameter sphere inflicts 2d6 HP fire (Dex half), moves 30\'/rd for conc or 1 min"',
  'Flesh To Stone':
    'School=Transmutation ' +
    'Level=K6,W6 ' +
    'Description="R60\' Target restrained, then petrified after 3 failed Con saves (Con x3 neg) for conc or 1 min"',
  'Floating Disk':
    'School=Conjuration ' +
    'Level=W1 ' +
    'Description="R30\' 3\'-diameter x 1 inch thick force disk follows, holds 500 lbs at 3\' for 1 hr"',
  'Fly':
    'School=Transmutation ' +
    'Level=K3,S3,W3 ' +
    'Description="Touched gains 60\' fly speed for conc or 10 min"',
  'Fog Cloud':
    'School=Conjuration ' +
    'Level=D1,R1,S1,W1 ' +
    'Description="R120\' 20\' radius obscures vision for conc or 1 hr"',
  'Forbiddance':
    'School=Abjuration ' +
    'Level=C6 ' +
    'Description="Touched 40000\' sq bars teleport and portals, inflicts 5d10 HP radiant or necrotic on transit to chosen type for 1 dy"',
  'Forcecage':
    'School=Evocation ' +
    'Level=B7,K7,W7 ' +
    'Description="R100\' Creates 20\' barred cube or 10\' solid box for 1 hr"',
  'Foresight':
    'School=Divination ' +
    'Level=B9,D9,K9,W9 ' +
    'Description="Touched gains immunity to surprise and Adv on attack, ability, and saving throws, foes suffer Disadv on attacks for 8 hr"',
  'Freedom Of Movement':
    'School=Abjuration ' +
    'Level=B4,C4,D4,R4 ' +
    'Description="Touched gains immunity to impediments for 1 hr"',
  'Freezing Sphere':
    'School=Evocation ' +
    'Level=W6 ' +
    'Description="R300\' 60\' radius inflicts 10d6 HP cold (Con half), freezes water for 1 min"',

  'Gaseous Form':
    'School=Transmutation ' +
    'Level=K3,S3,W3 ' +
    'Description="Touched creature becomes gaseous for conc or 1 hr"',
  'Gate':
    'School=Conjuration ' +
    'Level=C9,S9,W9 ' +
    'Description="R60\' Opens circular portal to another plane for conc or 1 min"',
  'Geas':
    'School=Enchantment ' +
    'Level=B5,C5,D5,P5,W5 ' +
    'Description="R60\' Target obeys command (Wis neg) for 30 dy"',
  'Gentle Repose':
    'School=Necromancy ' +
    'Level=C2,W2 ' +
    'Description="Touched corpse becomes immune to decay and animation for 10 dy"',
  'Giant Insect':
    'School=Transmutation ' +
    'Level=D4 ' +
    'Description="R30\' 10 centipedes, 5 wasps, 3 spiders, or 1 scorpion become giant and obeys self commands for conc or 10 min"',
  'Glibness':
    'School=Transmutation ' +
    'Level=B8,K8 ' +
    'Description="Self can take 15 on Cha checks and always detects as truthful for 1 hr"',
  'Globe Of Invulnerability':
    'School=Abjuration ' +
    'Level=S6,W6 ' +
    'Description="10\' radius gives immunity to spells up to level 5"',
  'Glyph Of Warding':
    'School=Abjuration ' +
    'Level=B3,C3,W3 ' +
    'Description="20\' radius inflicts 5d8 HP acid, cold, fire, lightning, or thunder (Dex half) or spell up to level 3 when triggered"',
  'Goodberry':
    'School=Transmutation ' +
    'Level=D1,R1 ' +
    'Description="10 berries each heal 1 HP and provide food for 1 dy"',
  'Grease':
    'School=Conjuration ' +
    'Level=W1 ' +
    'Description="R60\' Creatures in 10\' sq fall (Dex neg) for 1 min"',
  'Greater Invisibility':
    'School=Illusion ' +
    'Level=B4,S4,W4 ' +
    'Description="Touched becomes invisible for conc or 1 min"',
  'Greater Restoration':
    'School=Abjuration ' +
    'Level=B5,C5,D5 ' +
    'Description="Touched becomes unexhausted, uncharmed, unpetrified, or uncursed or regains ability or HP"',
  'Guardian Of Faith':
    'School=Conjuration ' +
    'Level=C4 ' +
    'Description="R30\' 10\' radius inflicts 20 HP radiant to hostile creatures (Dex half) for 8 hr or 60 HP"',
  'Guards And Wards':
    'School=Abjuration ' +
    'Level=B6,W6 ' +
    'Description="Multiple magic effects protect 2500\' sq area for 1 dy"',
  'Guidance':
    'School=Divination ' +
    'Level=C0,D0 ' +
    'Description="Touched gains +1d4 on 1 ability check w/in conc or 1 min"',
  'Guiding Bolt':
    'School=Evocation ' +
    'Level=C1 ' +
    'Description="R120\' Ranged spell inflicts 4d6 HP radiant, lights target (Adv on next foe attack) for 1 rd"',
  'Gust Of Wind':
    'School=Evocation ' +
    'Level=D2,S2,W2 ' +
    'Description="60\'x10\' wind pushes 15\' (Str neg), inflicts half movement for conc or 1 min"',

  'Hallow':
    'School=Evocation ' +
    'Level=C5,"K5 [The Fiend]" ' +
    'Description="60\' radius becomes warded against outsiders and evokes boon effect"',
  'Hallucinatory Terrain':
    'School=Illusion ' +
    'Level=B4,D4,K4,W4 ' +
    'Description="R300\' Creates 150\' cu terrain illusion (Investigation disbelieve) for 1 dy"',
  'Harm':
    'School=Necromancy ' +
    'Level=C6 ' +
    'Description="R60\' Target suffers 14d6 HP necrotic (Con half) and equal maximum HP reduction for 1 hr"',
  'Haste':
    'School=Transmutation ' +
    'Level=S3,W3 ' +
    'Description="R30\' Willing target gains dbl Speed, +2 AC, Adv on Dex, and bonus action for conc or 1 min"',
  'Heal':
    'School=Evocation ' +
    'Level=C6,D6 ' +
    'Description="R60\' Target regains 70 HP and becomes unblinded, undeafened, and undiseased"',
  'Healing Word':
    'School=Evocation ' +
    'Level=B1,C1,D1 ' +
    'Description="R60\' Target regains 1d4+%{?modifier?} HP"',
  'Heat Metal':
    'School=Transmutation ' +
    'Level=B2,D2 ' +
    'Description="R60\' Touching target metal causes 2d8 HP fire for conc or 1 min"',
  'Hellish Rebuke':
    'School=Evocation ' +
    'Level=K1 ' +
    'Description="R60\' Use Reaction to inflict 2d10 HP fire on successful attacker (Dex half)"',
  "Heroes' Feast":
    'School=Conjuration ' +
    'Level=C6,D6 ' +
    'Description="R30\' 12 diners undiseased and unpoisoned and gain immunity to poison and fright, Adv on Wis checks, and +2d10 HP for 1 dy"',
  'Heroism':
    'School=Enchantment ' +
    'Level=B1,P1 ' +
    'Description="Touched gains immunity to fright and +%{?modifier?} temporary HP each rd for conc or 1 min"',
  'Hideous Laughter':
    'School=Enchantment ' +
    'Level=B1,W1 ' +
    'Description="R30\' Target ROFL (Wis neg) for conc or 1 min"',
  'Hold Monster':
    'School=Enchantment ' +
    'Level=B5,K5,S5,W5 ' +
    'Description="R90\' Immobilizes target (Wis neg) for conc or 1 min"',
  'Hold Person':
    'School=Enchantment ' +
    'Level=B2,C2,D2,K2,S2,W2 ' +
    'Description="R60\' Immobilizes target (Wis neg) for conc or 1 min"',
  'Holy Aura':
    'School=Abjuration ' +
    'Level=C8 ' +
    'Description="30\' radius targets gain Adv on saves and blind fiends and undead with melee hit (Con neg); foes suffer Disadv on attacks"',
  "Hunter's Mark":
    'School=Divination ' +
    'Level=R1 ' +
    'Description="R90\' Self gains Adv on Perception and Wisdom to locate target and +1d6 HP damage on weapon attacks for conc or 1 hr"',
  'Hypnotic Pattern':
    'School=Illusion ' +
    'Level=B3,K3,S3,W3 ' +
    'Description="R120\' creatures in 30\' cu charmed (Wis neg) for conc or 1 min"',

  'Ice Storm':
    'School=Evocation ' +
    'Level=D4,S4,W4 ' +
    'Description="R300\' 20\' radius inflicts 2d8 bludgeoning and 4d6 HP cold (Dex half)"',
  'Identify':
    'School=Divination ' +
    'Level=B1,W1 ' +
    'Description="Self determines magic properties or spells affecting touched"',
  'Illusory Script':
    'School=Illusion ' +
    'Level=B1,K1,W1 ' +
    'Description="Self writing becomes legible only to specified creatures for 10 dy"',
  'Imprisonment':
    'School=Abjuration ' +
    'Level=K9,W9 ' +
    'Description="R30\' Restrains target in chosen prison (Wis neg)"',
  'Incendiary Cloud':
    'School=Conjuration ' +
    'Level=S8,W8 ' +
    'Description="R150\' 20\' radius inflicts 10d8 HP fire (Dex half), moves away 10\'/rd for conc or 1 min"',
  'Inflict Wounds':
    'School=Necromancy ' +
    'Level=C1 ' +
    'Description="Touched suffers 3d10 HP necrotic"',
  'Insect Plague':
    'School=Conjuration ' +
    'Level=C5,D5,S5 ' +
    'Description="R300\' 20\' radius inflicts 4d10 HP piercing (Con half) for conc or 10 min"',
  'Instant Summons':
    'School=Conjuration ' +
    'Level=W6 ' +
    'Description="Prepared 10 lb item appears in self hand"',
  'Invisibility':
    'School=Illusion ' +
    'Level=B2,K2,S2,W2 ' +
    'Description="Touched becomes invisible for conc or 1 hr or until attacks or casts"',
  'Irresistible Dance':
    'School=Enchantment ' +
    'Level=B6,W6 ' +
    'Description="R30\' Target dances (Disadv on Dex and attack, foes Adv on attacks) (Wis neg) for conc or 1 min"',

  'Jump':
    'School=Transmutation ' +
    'Level=D1,R1,S1,W1 ' +
    'Description="Touched gains triple jump distance for 1 min"',

  'Knock':
    'School=Transmutation ' +
    'Level=B2,S2,W2 ' +
    'Description="R60\' Unlocks, unsticks, or unbars target"',

  'Legend Lore':
    'School=Divination ' +
    'Level=B5,C5,W5 ' +
    'Description="Self learns info about named person, place, or object"',
  'Lesser Restoration':
    'School=Abjuration ' +
    'Level=B2,C2,D2,P2,R2 ' +
    'Description="Touched becomes unblinded, undeafened, undiseased, unparalyzed, or unpoisoned"',
  'Levitate':
    'School=Transmutation ' +
    'Level=S2,W2 ' +
    'Description="R60\' Target floats (Con neg) for conc or 10 min"',
  'Light':
    'School=Evocation ' +
    'Level=B0,C0,S0,W0 ' +
    'Description="Touched object lights 20\' radius (Dex neg) for 1 hr"',
  'Lightning Bolt':
    'School=Evocation ' +
    'Level=S3,W3 ' +
    'Description="100\'x5\' line inflicts 8d6 HP lightning (Dex half)"',
  'Locate Animals Or Plants':
    'School=Divination ' +
    'Level=B2,D2,R2 ' +
    'Description="Self learns location of named beast or plant w/in 5 mile"',
  'Locate Creature':
    'School=Divination ' +
    'Level=B4,C4,D4,P4,R4,W4 ' +
    'Description="Self learns location of named creature or species w/in 1000\' for conc or 1 hr"',
  'Locate Object':
    'School=Divination ' +
    'Level=B2,C2,D2,P2,R2,W2 ' +
    'Description="Self learns location of named object or type w/in 1000\' for conc or 10 min"',
  'Longstrider':
    'School=Transmutation ' +
    'Level=B1,D1,R1,W1 ' +
    'Description="Touched gains +10\' Speed for 1 hr"',

  'Mage Armor':
    'School=Abjuration ' +
    'Level=S1,W1 ' +
    'Description="Touched gains AC 13 + DexMod in no armor for 8 hr"',
  'Mage Hand':
    'School=Conjuration ' +
    'Level=B0,K0,S0,W0 ' +
    'Description="R30\' Spectral hand performs minor tasks moving up to 10 lb for 1 min"',
  'Magic Circle':
    'School=Abjuration ' +
    'Level=C3,K3,P3,W3 ' +
    'Description="R10\' 10\' circle prevents passage and inflicts DisAdv on attacks by specified creature type for 1 hr"',
  'Magic Jar':
    'School=Necromancy ' +
    'Level=W6 ' +
    'Description="R100\' Self possesses creature body and traps soul (Cha neg)"',
  'Magic Missile':
    'School=Evocation ' +
    'Level=S1,W1 ' +
    'Description="R120\' 3 darts inflict 1d4+1 HP force each"',
  'Magic Mouth':
    'School=Illusion ' +
    'Level=B2,W2 ' +
    'Description="R30\' Object speaks 25-word message when triggered"',
  'Magic Weapon':
    'School=Transmutation ' +
    'Level=P2,W2 ' +
    'Description="Touched weapon gains +1 magic bonus for conc or 1 hr"',
  'Magnificent Mansion':
    'School=Conjuration ' +
    'Level=B7,W7 ' +
    'Description="R300\' Creates extradimensional dwelling for 1 dy"',
  'Major Image':
    'School=Illusion ' +
    'Level=B3,K3,S3,W3 ' +
    'Description="R120\' Creates 20\' cu sight, sound, and touch illusion for conc or 10 min"',
  'Mass Cure Wounds':
    'School=Evocation ' + // from errata
    'Level=B5,C5,D5 ' +
    'Description="R60\' 6 targets in 30\' radius regain 3d8 + %{?modifier?} HP"',
  'Mass Heal':
    'School=Evocation ' + // from errata
    'Level=C9 ' +
    'Description="R60\' Targets regain 700 HP total and become unblinded, undeafened, and undiseased"',
  'Mass Healing Word':
    'School=Evocation ' +
    'Level=C3 ' +
    'Description="R60\' 6 targets regain 1d4 + %{?modifier?} HP"',
  'Mass Suggestion':
    'School=Enchantment ' +
    'Level=B6,K6,S6,W6 ' +
    'Description="R60\' 12 targets follow self suggestion (Wis neg)"',
  'Maze':
    'School=Conjuration ' +
    'Level=W8 ' +
    'Description="R60\' Target sent to labyrinthine demiplane (DC 20 Int escapes) for conc or 10 min"',
  'Meld Into Stone':
    'School=Transmutation ' +
    'Level=C3,D3 ' +
    'Description="Self step into rock for 8 hr"',
  'Mending':
    'School=Transmutation ' +
    'Level=B0,C0,D0,S0,W0 ' +
    'Description="Touch repairs small tear"',
  'Message':
    'School=Transmutation ' +
    'Level=B0,S0,W0 ' +
    'Description="R120\' Self and target have whispered conversation for 1 rd"',
  'Meteor Swarm':
    'School=Evocation ' +
    'Level=S9,W9 ' +
    'Description="R1 mile 40\' radius inflicts 20d6 HP fire and 20d6 HP bludgeoning (Dex half)"',
  'Mind Blank':
    'School=Abjuration ' +
    'Level=B8,W8 ' +
    'Description="Touched gains immunity to psychic damage, thought reading, and charm for 1 dy"',
  'Minor Illusion':
    'School=Illusion ' +
    'Level=B0,K0,S0,W0 ' +
    'Description="R30\' Creates sound of 1 creature or 5\' cu image (Investigation disbelieve) for 1 min"',
  'Mirage Arcane':
    'School=Illusion ' +
    'Level=B7,D7,W7 ' +
    'Description="Creates 1 mile sq illusionary terrain for 10 dy"',
  'Mirror Image':
    'School=Illusion ' +
    'Level=K2,S2,W2 ' +
    'Description="3 self duplicates draw attacks (AC %{10+dexterityModifier}) for 1 min"',
  'Mislead':
    'School=Illusion ' +
    'Level=B5,W5 ' +
    'Description="Makes self invisible and creates illusory duplicate for conc or 1 hr"',
  'Misty Step':
    'School=Conjuration ' +
    'Level=K2,S2,W2 ' +
    'Description="Self teleports 30\'"',
  'Modify Memory':
    'School=Enchantment ' +
    'Level=B5,W5 ' +
    'Description="R30\' Changes target memory of event in past dy (Wis neg)"',
  'Moonbeam':
    'School=Evocation ' +
    'Level=D2 ' +
    'Description="R120\' 5\' radius inflicts 2d10 HP radiant (Con half) for conc or 1 min"',
  'Move Earth':
    'School=Transmutation ' +
    'Level=D6,S6,W6 ' +
    'Description="R120\' Reshapes 40\' cu of earth for conc or 2 hr"',

  'Nondetection':
    'School=Abjuration ' +
    'Level=B3,R3,W3 ' +
    'Description="Touched gains immunity to divination for 8 hr"',

  'Pass Without Trace':
    'School=Abjuration ' +
    'Level=D2,R2 ' +
    'Description="Targets in 30\' radius gain +10 Stealth and become untrackable for conc or 1 hr"',
  'Passwall':
    'School=Transmutation ' +
    'Level=W5 ' +
    'Description="R30\' Creates 5\'x8\'x20\' passage through wood, plaster, or stone for 1 hr"',
  'Phantasmal Killer':
    'School=Illusion ' +
    'Level=W4 ' +
    'Description="R120\' Target perceives personal horror that frightens and inflicts 4d10 HP psychic/rd (Wis neg) for conc or 1 min"',
  'Phantom Steed':
    'School=Illusion ' +
    'Level=W3 ' +
    'Description="R30\' Self or target rides 100\'/rd (13 MPH) for 1 hr"',
  'Planar Ally':
    'School=Conjuration ' +
    'Level=C6 ' +
    'Description="R60\' Self bargain for service from outsider"',
  'Planar Binding':
    'School=Abjuration ' +
    'Level=B5,C5,D5,W5 ' +
    'Description="R60\' Binds outsider to service (Cha neg) for 1 dy"',
  'Plane Shift':
    'School=Conjuration ' +
    'Level=C7,D7,K7,S7,W7 ' +
    'Description="Target or self and 8 willing others travel to another plane (Cha neg)"',
  'Plant Growth':
    'School=Transmutation ' +
    'Level=B3,D3,R3 ' +
    'Description="R150\' Overgrows 100\' radius or enriches 1/2 mile radius for 1 yr"',
  'Poison Spray':
    'School=Conjuration ' +
    'Level=D0,K0,S0,W0 ' +
    'Description="R10\' Target suffers %{(level+7)//6}d12 HP poison (Con neg)"',
  'Polymorph':
    'School=Transmutation ' +
    'Level=B4,D4,S4,W4 ' +
    'Description="R60\' Transforms target creature (Wis neg) for conc or 1 hr or until reduced to 0 HP"',
  'Power Word Kill':
    'School=Enchantment ' +
    'Level=B9,K9,S9,W9 ' +
    'Description="R60\' Slays target with at most 100 HP"',
  'Power Word Stun':
    'School=Enchantment ' +
    'Level=B8,K8,S8,W8 ' +
    'Description="R60\' Stuns target with at most 150 HP (Con neg)"',
  'Prayer Of Healing':
    'School=Evocation ' +
    'Level=C2 ' +
    'Description="R60\' 6 targets regain 2d8 + %{?modifier?} HP"',
  'Prestidigitation':
    'School=Transmutation ' +
    'Level=B0,K0,S0,W0 ' +
    'Description="R10\' Self performs minor magic effects for 1 hr"',
  'Prismatic Spray':
    'School=Evocation ' +
    'Level=S7,W7 ' +
    'Description="R60\' cone inflicts 10d6 HP fire, acid, lightning, poison, or cold (Dex half), restrains (Dex neg) and then turns to stone (3 Con before 3 fails neg), or blinds (Dex neg) followed by banishing to another plane (Wis neg)"',
  'Prismatic Wall':
    'School=Abjuration ' +
    'Level=W9 ' +
    'Description="R60\' 90\'x30\' area blinds w/in 20\' for 1 min (Con neg); passers suffer 10d6 HP each fire, acid, lightning, poison, and cold (Dex half), restraint (Dex neg) and then turning to stone (3 Con before 3 fails neg), and blindness (Dex neg) followed by banishment to another plane (Wis neg)"',
  'Private Sanctum':
    'School=Abjuration ' +
    'Level=W4 ' +
    'Description="R120\' Protects 100\' sq from sound, vision, divination, teleportation, and planar travel for 1 dy"',
  'Produce Flame':
    'School=Conjuration ' +
    'Level=D0 ' +
    'Description="Lights 10\' radius for 10 min, self can make ranged spell attack inflicting %{(level+7)//6}d8 HP"',
  'Programmed Illusion':
    'School=Illusion ' +
    'Level=B6,W6 ' +
    'Description="R120\' Creates 30\' cu illusion when triggered (Investigation disbelieve)"',
  'Project Image':
    'School=Illusion ' +
    'Level=B7,W7 ' +
    'Description="R500 miles Self sees and hears through illusory double for conc or 1 dy"',
  'Protection From Energy':
    'School=Abjuration ' +
    'Level=C3,D3,R3,S3,W3 ' +
    'Description="Touched gains resistance to acid, cold, fire, lightning, or thunder damage for conc or 1 hr"',
  'Protection From Evil And Good':
    'School=Abjuration ' +
    'Level=C1,K1,P1,W1 ' +
    'Description="Willing touched gains immunity to charm, fright, and possession from aberrations, celestials, elementals, fey, fiends, and undead, and those creatures suffer Disadv on attack on touched"',
  'Protection From Poison':
    'School=Abjuration ' +
    'Level=C2,D2,P2,R2 ' +
    'Description="Touched unpoisoned and gains Adv on saves vs. poison and resistance to poison damage for 1 hr"',
  'Purify Food And Drink':
    'School=Transmutation ' +
    'Level=C1,D1,P1 ' +
    'Description="R10\' Food and drink in 5\' radius freed of poison and disease"',

  'Raise Dead':
    'School=Necromancy ' +
    'Level=B5,C5,P5 ' +
    'Description="Restores touched 10-day-old corpse to life"',
  'Ray Of Enfeeblement':
    'School=Necromancy ' +
    'Level=K2,W2 ' +
    'Description="R60\' Ranged spell inflicts half damage on Str weapons (Con neg) for conc or 1 min"',
  'Ray Of Frost':
    'School=Evocation ' +
    'Level=S0,W0 ' +
    'Description="R60\' Ranged spell inflicts %{(level+7)//6}d8 HP cold and -10\' Speed for 1 rd"',
  'Regenerate':
    'School=Transmutation ' +
    'Level=B7,C7,D7 ' +
    'Description="Touched regains 4d8+15 HP and 1 HP/min for 1 hr, reattaches or regrows severed parts"',
  'Reincarnate':
    'School=Transmutation ' +
    'Level=D5 ' +
    'Description="Touched resurrected in new body"',
  'Remove Curse':
    'School=Abjuration ' +
    'Level=C3,K3,P3,W3 ' +
    'Description="Frees touched from all curses"',
  'Resilient Sphere':
    'School=Evocation ' +
    'Level=W4 ' +
    'Description="R30\' Traps target in impervious sphere (Dex neg) for conc or 1 min"',
  'Resistance':
    'School=Abjuration ' +
    'Level=C0,D0 ' +
    'Description="Touched gains +1d4 on 1 save w/in conc or 1 min"',
  'Resurrection':
    'School=Necromancy ' +
    'Level=B7,C7 ' +
    'Description="Restores touched 100-year-old corpse to life"',
  'Reverse Gravity':
    'School=Transmutation ' +
    'Level=D7,S7,W7 ' +
    'Description="R50\' Items in 50\' radius fall upward for conc or 1 min"',
  'Revivify':
    'School=Necromancy ' + // from errata
    'Level=C3,P3 ' +
    'Description="Restores touched 1-minute-old corpse to life w/1 HP"',
  'Rope Trick':
    'School=Transmutation ' +
    'Level=W2 ' +
    'Description="Touched rope leads to extradimensional space for 8 creatures for 1 hr"',

  'Sacred Flame':
    'School=Evocation ' +
    'Level=C0 ' +
    'Description="R60\' Target suffers %{(level+7)//6}d8 HP radiant (Dex neg)"',
  'Sanctuary':
    'School=Abjuration ' +
    'Level=C1 ' +
    'Description="R30\' Foes of target attack another (Wis neg) for 1 min"',
  'Scorching Ray':
    'School=Evocation ' +
    'Level="K2 [The Fiend]",S2,W2 ' +
    'Description="R120\' 3 ranged attacks inflict 2d6 HP fire each"',
  'Scrying':
    'School=Divination ' +
    'Level=B5,C5,D5,K5,W5 ' +
    'Description="Self sees and hears chosen target (Wis neg) for conc or 10 min"',
  'Secret Chest':
    'School=Conjuration ' +
    'Level=W4 ' +
    'Description="Touched chest moves to and from Ethereal Plane for 60+ days"',
  'See Invisibility':
    'School=Divination ' +
    'Level=B2,S2,W2 ' +
    'Description="Self sees invisible and ethereal items for 1 hr"',
  'Seeming':
    'School=Illusion ' +
    'Level=B5,S5,W5 ' +
    'Description="R30\' Changes appearance of targets (Cha neg) for 8 hr"',
  'Sending':
    'School=Evocation ' +
    'Level=B3,C3,W3 ' +
    'Description="Self exchanges 25-word message with known target"',
  'Sequester':
    'School=Transmutation ' +
    'Level=W7 ' +
    'Description="Touched becomes hidden and enters suspended animation until released by trigger"',
  'Shapechange':
    'School=Transmutation ' +
    'Level=D9,W9 ' +
    'Description="Self polymorphs for conc or 1 hr or until reduced to 0 HP"',
  'Shatter':
    'School=Evocation ' +
    'Level=B2,K2,S2,W2 ' +
    'Description="R60\' 10\' radius inflicts 3d8 HP thunder (Con half)"',
  'Shield':
    'School=Abjuration ' +
    'Level=S1,W1 ' +
    'Description="Use Reaction to gain +5 AC and immunity to <i>Magic Missile</i> for 1 rd"',
  'Shield Of Faith':
    'School=Abjuration ' +
    'Level=C1,P1 ' +
    'Description="R60\' Target gains +2 AC for conc or 10 min"',
  'Shillelagh':
    'School=Transmutation ' +
    'Level=D0 ' +
    'Description="Touched club gains +%{proficiencyBonus+wisdomModifier} attacks, inflicts 1d8 HP for 1 min"',
  'Shocking Grasp':
    'School=Evocation ' +
    'Level=S0,W0 ' +
    'Description="Touched suffers %{(level+7)//6}d8 HP lightning"',
  'Silence':
    'School=Illusion ' +
    'Level=B2,C2,R2 ' +
    'Description="R120\' 20\' radius blocks sound for conc or 10 min"',
  'Silent Image':
    'School=Illusion ' +
    'Level=B1,S1,W1 ' +
    'Description="R60\' Creates 15\' cu illusion (Investigation neg) for conc or 10 min"',
  'Simulacrum':
    'School=Illusion ' +
    'Level=W7 ' +
    'Description="Creates from snow a friendly duplicate creature w/half the HP of original"',
  'Sleep':
    'School=Enchantment ' +
    'Level=B1,S1,W1 ' +
    'Description="R90\' 20\' radius sleeps up to 5d8 HP of creatures, weakest first"',
  'Sleet Storm':
    'School=Conjuration ' +
    'Level=D3,S3,W3 ' +
    'Description="R150\' 40\' radius causes falls (Dex neg)"',
  'Slow':
    'School=Transmutation ' +
    'Level=S3,W3 ' +
    'Description="R120\' 6 targets in 40\' cu suffer half Speed, -2 AC and Dex saves, and 1 action/rd (Wis neg) for conc or 1 min"',
  'Spare The Dying':
    'School=Necromancy ' +
    'Level=C0 ' +
    'Description="Touched creature becomes stable"',
  'Speak With Animals':
    'School=Divination ' +
    'Level=B1,D1,R1 ' +
    'Description="Self talks to animals for 10 min"',
  'Speak With Dead':
    'School=Necromancy ' +
    'Level=B3,C3 ' +
    'Description="Self asks corpse 5 questions"',
  'Speak With Plants':
    'School=Transmutation ' +
    'Level=B3,D3,R3 ' +
    'Description="Self talks to plants for 10 min"',
  'Spider Climb':
    'School=Transmutation ' +
    'Level=K2,S2,W2 ' +
    'Description="Touched crawls on walls and ceilings for conc or 1 hr"',
  'Spike Growth':
    'School=Transmutation ' +
    'Level=D2,R2 ' +
    'Description="R150\' 20\' radius inflicts 2d4 HP piercing and 5\' Speed for conc or 10 min"',
  'Spirit Guardians':
    'School=Conjuration ' +
    'Level=C3 ' +
    'Description="15\' radius inflicts 3d8 HP necrotic or radiant and half Speed (Wis half, no slowing)"',
  'Spiritual Weapon':
    'School=Evocation ' +
    'Level=C2 ' +
    'Description="R60\' Spectral weapon inflicts 1d8 + %{?modifier?} HP and moves 20\' for 1 min"',
  'Stinking Cloud':
    'School=Conjuration ' +
    'Level=B3,"K3 [The Fiend]",S3,W3 ' +
    'Description="R90\' 20\' radius causes retching for conc or 1 min"',
  'Stone Shape':
    'School=Transmutation ' +
    'Level=C4,D4,W4 ' +
    'Description="Reshapes touched medium-sized stone"',
  'Stoneskin':
    'School=Abjuration ' +
    'Level=D4,R4,S4,W4 ' +
    'Description="Touched gains resistance to bludgeoning, piercing, and slashing damage for conc or 1 hr"',
  'Storm Of Vengeance':
    'School=Conjuration ' +
    'Level=D9 ' +
    'Description="RSight 360\' radius inflicts 2d6 HP thunder and deafness (Con neg), then 1d6 HP acid, then 10d6 HP lightning (Dex half), then 2d6 HP bludgeoning, then 1d6 cold for conc or 1 min"',
  'Suggestion':
    'School=Enchantment ' +
    'Level=B2,K2,S2,W2 ' +
    'Description="R30\' Target follows reasonable suggestion (Wis neg) for conc or 8 hr"',
  'Sunbeam':
    'School=Evocation ' +
    'Level=D6,S6,W6 ' +
    'Description="60\' line inflicts 6d8 HP radiant and blindness for 1 rd (Con half, no blindness) for conc or 1 min"',
  'Sunburst':
    'School=Evocation ' +
    'Level=D8,S8,W8 ' +
    'Description="60\' radius inflicts 12d6 HP radius and blindness (Con half, no blindness) for 1 min"',
  'Symbol':
    'School=Abjuration ' +
    'Level=B7,C7,W7 ' +
    'Description="Inscribes touched w/permanent glyph that invokes magic effects"',

  'Telekinesis':
    'School=Transmutation ' +
    'Level=S5,W5 ' +
    'Description="R60\' Moves 1000 lb 30\'/rd (Str neg) for conc or 10 min"',
  'Telepathic Bond':
    'School=Divination ' +
    'Level=W5 ' +
    'Description="R30\' 8 targets communicate mentally for 1 hr"',
  'Teleport':
    'School=Conjuration ' +
    'Level=B7,S7,W7 ' +
    'Description="R10\' Object or self and 8 allies teleport any distance"',
  'Teleportation Circle':
    'School=Conjuration ' +
    'Level=B5,S5,W5 ' +
    'Description="R10\' Creates permanent portal to similar circle"',
  'Thaumaturgy':
    'School=Transmutation ' +
    'Level=C0 ' +
    'Description="R30\' Creates minor magic effects for 1 min"',
  'Thunderwave':
    'School=Evocation ' +
    'Level=B1,D1,S1,W1 ' +
    'Description="15\' cu inflicts 2d8 HP thunder and pushes 10\' (Con half, no push)"',
  'Time Stop':
    'School=Transmutation ' +
    'Level=S9,W9 ' +
    'Description="Self gains extra 1d4 + 1 turns, ends if another affected"',
  'Tiny Hut':
    'School=Evocation ' +
    'Level=B3,W3 ' +
    'Description="Creates 10\' radius dome impassable by objects and spells for 8 hr"',
  'Tongues':
    'School=Divination ' +
    'Level=B3,C3,K3,S3,W3 ' +
    'Description="Touched understands and speaks any language for 1 hr"',
  'Transport Via Plants':
    'School=Conjuration ' +
    'Level=D6 ' +
    'Description="Creates teleportation door between two plants for 1 rd"',
  'Tree Stride':
    'School=Conjuration ' +
    'Level=D5,R5 ' +
    'Description="Self teleports between like trees 1/rd for conc or 1 min"',
  'True Polymorph':
    'School=Transmutation ' +
    'Level=B9,K9,W9 ' +
    'Description="R30\' Transforms target creature or object (Wis neg) for conc or 1 hr or until reduced to 0 HP"',
  'True Resurrection':
    'School=Necromancy ' +
    'Level=C9,D9 ' +
    'Description="Restores touched or named 200-year-old corpse to life"',
  'True Seeing':
    'School=Divination ' +
    'Level=B6,C6,K6,S6,W6 ' +
    'Description="Touched gains 120\' truesight, sees magically concealed doors, and can see into Ethereal Plane for 1 hr"',
  'True Strike':
    'School=Divination ' +
    'Level=B0,K0,S0,W0 ' +
    'Description="R30\' Self gains Adv on next attack on target w/in 1 rd"',

  'Unseen Servant':
    'School=Conjuration ' +
    'Level=B1,K1,W1 ' +
    'Description="R60\' Invisible force performs simple tasks for 1 hr"',

  'Vampiric Touch':
    'School=Necromancy ' +
    'Level=K3,W3 ' +
    'Description="Touched suffers 3d6 HP and self regains half for conc or 1 min"',
  'Vicious Mockery':
    'School=Enchantment ' +
    'Level=B0 ' +
    'Description="R60\' Target suffers %{(level+7)//6}d4 HP psychic and Disadv on attack (Wis neg) for 1 rd"',

  'Wall Of Fire':
    'School=Evocation ' +
    'Level=D4,"K4 [The Fiend]",S4,W4 ' +
    'Description="R120\' 60\'x20\' wall inflicts 5d8 HP fire (Dex half) for conc or 1 min"',
  'Wall Of Force':
    'School=Evocation ' +
    'Level=W5 ' +
    'Description="R120\' Creates 10 10\'x10\' panels that are impassable by objects for conc or 10 min"',
  'Wall Of Ice':
    'School=Evocation ' +
    'Level=W6 ' +
    'Description="R120\' Creates 10 10\'x10\' panels for conc or 10 min"',
  'Wall Of Stone':
    'School=Evocation ' +
    'Level=D5,S5,W5 ' +
    'Description="R120\' Creates 10 10\'x10\' panels for conc or 10 min"',
  'Wall Of Thorns':
    'School=Conjuration ' +
    'Level=D6 ' +
    'Description="R120\' 60\'x10\' wall inflicts 7d8 HP piercing (Dex half) for conc or 10 min"',
  'Warding Bond':
    'School=Abjuration ' +
    'Level=C2 ' +
    'Description="Touched gains +1 AC and saves and resistance to all damage while within 60\' of self, self shares damage to touched for 1 hr"',
  'Water Breathing':
    'School=Transmutation ' +
    'Level=D3,R3,S3,W3 ' +
    'Description="R30\' 10 targets can breathe underwater for 1 dy"',
  'Water Walk':
    'School=Transmutation ' +
    'Level=C3,D3,R3,S3 ' +
    'Description="R30\' 10 targets can traverse liquid for 1 hr"',
  'Web':
    'School=Conjuration ' +
    'Level=S2,W2 ' +
    'Description="R60\' 20\' cu restrains creatures (Dex neg, Str frees) for conc or 1 hr"',
  'Weird':
    'School=Illusion ' +
    'Level=W9 ' +
    'Description="R120\' Targets perceive personal horrors that frighten and inflict 4d10 HP psychic/rd (Wis neg) for conc or 1 min"',
  'Wind Walk':
    'School=Transmutation ' +
    'Level=D6 ' +
    'Description="R30\' Self and 10 others become gaseous, can fly 300\'/rd for 8 hr"',
  'Wind Wall':
    'School=Evocation ' +
    'Level=D3,R3 ' +
    'Description="R120\' 50\'x15\' area inflicts 3d8 HP blugeoning (Str half) for conc or 1 min"',
  'Wish':
    'School=Conjuration ' +
    'Level=S9,W9 ' +
    'Description="Alters reality with few limits"',
  'Word Of Recall':
    'School=Conjuration ' +
    'Level=C6 ' +
    'Description="R5\' Self and 5 others teleport to prepared location"',

  'Zone Of Truth':
    'School=Enchantment ' +
    'Level=B2,C2,P2 ' +
    'Description="R60\' Creatures in 15\' radius cannot lie (Cha neg) for 10 min"'

};
SRD5E.TOOLS = {
  "Alchemist's Supplies":'Type=Artisan',
  "Brewer's Supplies":'Type=Artisan',
  "Calligrapher's Supplies":'Type=Artisan',
  "Carpenter's Tools":'Type=Artisan',
  "Cobbler's Tools":'Type=Artisan',
  "Cook's Utensils":'Type=Artisan',
  "Glassblower's Tools":'Type=Artisan',
  "Jeweler's Tools":'Type=Artisan',
  "Leatherworker's Tools":'Type=Artisan',
  "Mason's Tools":'Type=Artisan',
  "Painter's Supplies":'Type=Artisan',
  "Potter's Tools":'Type=Artisan',
  "Smith's Tools":'Type=Artisan',
  "Tinker's Tools":'Type=Artisan',
  "Weaver's Tools":'Type=Artisan',
  "Woodcarver's Tools":'Type=Artisan',
  'Disguise Kit':'Type=General',
  'Forgery Kit':'Type=General',
  'Dice Set':'Type=Game',
  'Dragonchess Set':'Type=Game',
  'Playing Card Set':'Type=Game',
  'Three-Dragon Ante Set':'Type=Game',
  'Herbalism Kit':'Type=General',
  'Bagpipes':'Type=Music',
  'Drum':'Type=Music',
  'Dulcimer':'Type=Music',
  'Flute':'Type=Music',
  'Lute':'Type=Music',
  'Lyre':'Type=Music',
  'Horn':'Type=Music',
  'Pan Flute':'Type=Music',
  'Shawm':'Type=Music',
  'Viol':'Type=Music',
  "Navigator's Tools":'Type=General',
  "Poisoner's Kit":'Type=General',
  "Thieves' Tools":'Type=General',
  'Vehicles (Land)':'Type=General',
  'Vehicles (Water)':'Type=General'
};
SRD5E.WEAPONS = {
  'Battleaxe':'Category=2 Property=Ve Damage=d8',
  'Blowgun':'Category=2 Property=R Damage=d1 Range=25/100',
  'Club':'Category=1 Property=Li Damage=d4',
  'Dagger':'Category=1 Property=Li,Fi Damage=d4 Range=20/60',
  'Dart':'Category=1 Property=R,Fi Damage=d4 Range=20/60',
  'Flail':'Category=2 Property=1h Damage=d8',
  'Glaive':'Category=2 Property=2h,He Damage=d10',
  'Greataxe':'Category=2 Property=2h,He Damage=d12',
  'Greatclub':'Category=1 Property=2h Damage=d8',
  'Greatsword':'Category=2 Property=2h,He Damage=2d6',
  'Halberd':'Category=2 Property=2h,He Damage=d10',
  'Hand Crossbow':'Category=2 Property=R Damage=d6 Range=30/120',
  'Handaxe':'Category=1 Property=Li Damage=d6 Range=20/60',
  'Heavy Crossbow':'Category=2 Property=R Damage=d10 Range=100/400',
  'Javelin':'Category=1 Property=1h Damage=d6 Range=30/120',
  'Lance':'Category=2 Property=1h Damage=d12',
  'Light Crossbow':'Category=1 Property=R Damage=d8 Range=80/320',
  'Light Hammer':'Category=1 Property=Li Damage=d4 Range=20/60',
  'Longbow':'Category=2 Property=R Damage=d8 Range=150/600',
  'Longsword':'Category=2 Property=Ve Damage=d8',
  'Mace':'Category=1 Property=1h Damage=d6',
  'Maul':'Category=2 Property=2h Damage=2d6',
  'Morningstar':'Category=2 Property=1h,He Damage=d8',
  'Net':'Category=2 Property=R Damage=d0 Range=5/15',
  'Pike':'Category=2 Property=2h Damage=d10',
  'Quarterstaff':'Category=1 Property=Ve Damage=d6',
  'Rapier':'Category=2 Property=1h,Fi Damage=d8',
  'Scimitar':'Category=2 Property=Li,Fi Damage=d6',
  'Shortbow':'Category=1 Property=R Damage=d6 Range=80/320',
  'Shortsword':'Category=2 Property=Li,Fi Damage=d6',
  'Sickle':'Category=1 Property=Li Damage=d4',
  'Sling':'Category=1 Property=R Damage=d4 Range=30/120',
  'Spear':'Category=1 Property=Ve Damage=d6 Range=20/60',
  'Trident':'Category=2 Property=Ve Damage=d6 Range=20/60',
  'Unarmed':'Category=0 Property=Un Damage=d1',
  'War Pick':'Category=2 Property=1h Damage=d8',
  'Warhammer':'Category=2 Property=Ve Damage=d8',
  'Whip':'Category=2 Property=1h,Fi Damage=d4'
};
SRD5E.DEITIES = {
  // Allow clerics w/no deity to have a domain
  'None':'Domain=' + QuilvynUtils.getKeys(SRD5E.PATHS).filter(x => x.match(/Domain$/)).map(x => x.replace(' Domain', '')).join(','),
  // Celtic
  'Celtic-The Daghdha':'Alignment=CG Domain=Nature,Trickery',
  'Celtic-Arawn':'Alignment=NE Domain=Life,Death',
  'Celtic-Belenus':'Alignment=NG Domain=Light',
  'Celtic-Briantia':'Alignment=NG Domain=Life',
  'Celtic-Diancecht':'Alignment=LG Domain=Life',
  'Celtic-Dunatis':'Alignment=N Domain=Nature',
  'Celtic-Goibhniu':'Alignment=NG Domain=Knowledge,Life',
  'Celtic-Lugh':'Alignment=CN Domain=Knowledge,Life',
  'Celtic-Manannan Mac Lir':'Alignment=LN Domain=Nature,Tempest',
  'Celtic-Math Mathonwy':'Alignment=NE Domain=Knowledge',
  'Celtic-Morrigan':'Alignment=CE Domain=War',
  'Celtic-Nuada':'Alignment=N Domain=War',
  'Celtic-Oghma':'Alignment=NG Domain=Knowledge',
  'Celtic-Silvanus':'Alignment=N Domain=Nature',
  // Greek
  'Greek-Zeus':'Alignment=N Domain=Tempest',
  'Greek-Aphrodite':'Alignment=CG Domain=Light',
  'Greek-Apollo':'Alignment=CG Domain=Knowledge,Life,Light',
  'Greek-Ares':'Alignment=CE Domain=War',
  'Greek-Artemis':'Alignment=NG Domain=Life,Nature',
  'Greek-Athena':'Alignment=LG Domain=Knowledge,War',
  'Greek-Demeter':'Alignment=NG Domain=Life',
  'Greek-Dionysus':'Alignment=CN Domain=Life',
  'Greek-Hades':'Alignment=LE Domain=Death',
  'Greek-Hecate':'Alignment=CE Domain=Knowledge,Trickery',
  'Greek-Hephaestus':'Alignment=NG Domain=Knowledge',
  'Greek-Hera':'Alignment=CN Domain=Trickery',
  'Greek-Hercules':'Alignment=CG Domain=Tempest,War',
  'Greek-Hermes':'Alignment=CG Domain=Trickery',
  'Greek-Hestia':'Alignment=NG Domain=Life',
  'Greek-Nike':'Alignment=LN Domain=War',
  'Greek-Pan':'Alignment=CN Domain=Nature',
  'Greek-Poseidon':'Alignment=CN Domain=Tempest',
  'Greek-Tyche':'Alignment=N Domain=Trickery',
  // Egyptian
  'Egyptian-Re-Horakhty':'Alignment=LG Domain=Life,Light',
  'Egyptian-Anubis':'Alignment=LN Domain=Death',
  'Egyptian-Apep':'Alignment=NE Domain=Trickery',
  'Egyptian-Bast':'Alignment=CG Domain=War',
  'Egyptian-Bes':'Alignment=CN Domain=Trickery',
  'Egyptian-Hathor':'Alignment=NG Domain=Life,Light',
  'Egyptian-Imhotep':'Alignment=NG Domain=Knowledge',
  'Egyptian-Isis':'Alignment=NG Domain=Knowledge,Life',
  'Egyptian-Nephthys':'Alignment=CG Domain=Death',
  'Egyptian-Osiris':'Alignment=LG Domain=Life,Nature',
  'Egyptian-Ptah':'Alignment=LN Domain=Knowledge',
  'Egyptian-Set':'Alignment=CE Domain=Death,Tempest,Trickery',
  'Egyptian-Sobek':'Alignment=LE Domain=Nature,Tempest',
  'Egyptian-Thoth':'Alignment=N Domain=Knowledge',
  // Norse
  'Norse-Odin':'Alignment=NG Domain=Knowledge,War',
  'Norse-Aegir':'Alignment=NE Domain=Tempest',
  'Norse-Balder':'Alignment=NG Domain=Life,Light',
  'Norse-Forseti':'Alignment=N Domain=Light',
  'Norse-Frey':'Alignment=NG Domain=Life,Light',
  'Norse-Freya':'Alignment=NG Domain=Life',
  'Norse-Frigga':'Alignment=N Domain=Life,Light',
  'Norse-Heimdall':'Alignment=LG Domain=Light,War',
  'Norse-Hel':'Alignment=NE Domain=Death',
  'Norse-Hermod':'Alignment=CN Domain=Trickery',
  'Norse-Loki':'Alignment=CE Domain=Trickery',
  'Norse-Njord':'Alignment=NG Domain=Nature,Tempest',
  'Norse-Odor':'Alignment=CG Domain=Light',
  'Norse-Sif':'Alignment=CG Domain=War',
  'Norse-Skadi':'Alignment=N Domain=Nature',
  'Norse-Surtur':'Alignment=LE Domain=War',
  'Norse-Thor':'Alignment=CG Domain=Tempest,War',
  'Norse-Thrym':'Alignment=CE Domain=War',
  'Norse-Tyr':'Alignment=LN Domain=Knowledge,War',
  'Norse-Uller':'Alignment=CN Domain=Nature'
};

SRD5E.LEVELS_EXPERIENCE = [
  0, 0.3, 0.9, 2.7, 6.5, 14, 23, 34, 48, 64,
  85, 100, 120, 140, 165, 195, 225, 265, 305, 355, 1000
];
// Extended from SRD5E weapons table based on SRD35 damage for large creatures
SRD5E.VERSATILE_WEAPON_DAMAGE = {
  '1d0':'1d0', '1d1':'1d1', '1d2':'1d3', '1d3':'1d4', '1d4':'1d6', '1d6':'1d8',
  '1d8':'1d10', '1d10':'1d12', '1d12':'3d6', '2d4':'2d6', '2d6':'3d6',
  '2d8':'3d8', '2d10':'4d8'
};

/* Defines the rules related to character abilities. */
SRD5E.abilityRules = function(rules) {

  for(var ability in SRD5E.ABILITIES) {
    ability = ability.toLowerCase();
    rules.defineChoice('notes', ability + ':%V (%1)');
    rules.defineRule
      (ability + 'Modifier', ability, '=', 'Math.floor((source - 10) / 2)');
    rules.defineRule(ability + '.1', ability + 'Modifier', '=', null);
    rules.defineRule(ability, '', 'v', '20');
  }
  rules.defineRule('carry', 'strength', '=', 'source * 15');
  rules.defineRule('lift', 'strength', '=', 'source * 30');
  rules.defineRule('speed',
    '', '=', '30',
    'abilityNotes.armorSpeedAdjustment', '+', null
  );

};

/* Defines the rules related to combat. */
SRD5E.combatRules = function(rules, armors, shields, weapons) {

  QuilvynUtils.checkAttrTable
    (armors, ['AC', 'Bulky', 'Dex', 'Str', 'Weight']);
  QuilvynUtils.checkAttrTable(shields, ['AC']);
  QuilvynUtils.checkAttrTable
    (weapons, ['Category', 'Damage', 'Property', 'Range']);

  for(var armor in armors) {
    rules.choiceRules(rules, 'Armor', armor, armors[armor]);
  }
  for(var shield in shields) {
    rules.choiceRules(rules, 'Shield', shield, shields[shield]);
  }
  for(var weapon in weapons) {
    var pattern = weapon.replace(/  */g, '\\s+');
    var prefix =
      weapon.charAt(0).toLowerCase() + weapon.substring(1).replaceAll(' ', '');
    rules.choiceRules(rules, 'Goody', weapon,
      // To avoid triggering additional weapons with a common suffix (e.g.,
      // "* punching dagger +2" also makes regular dagger +2), require that
      // weapon goodies with a trailing value have no preceding word or be
      // enclosed in parentheses.
      'Pattern="([-+]\\d)\\s+' + pattern + '|(?:^\\W*|\\()' + pattern + '\\s+([-+]\\d)" ' +
      'Effect=add ' +
      'Attribute=' + prefix + 'AttackModifier,' + prefix + 'DamageModifier ' +
      'Value="$1 || $2" ' +
      'Section=combat Note="%V Attack and damage"'
    );
    rules.choiceRules(rules, 'Goody', weapon + ' Proficiency',
      'Pattern="' + pattern + '\\s+proficiency" ' +
      'Effect=set ' +
      'Attribute="weaponProficiency.' + weapon + '" ' +
      'Section=combat Note="Proficiency in ' + weapon + '"'
    );
    rules.choiceRules(rules, 'Weapon', weapon, weapons[weapon]);
  }

  rules.defineRule('abilityNotes.armorSpeedAdjustment',
    'armorStrShortfall', '=', 'source > 0 ? -10 : null'
  );
  rules.defineRule
    ('armorClass', 'combatNotes.dexterityArmorClassAdjustment', '+', null);
  rules.defineRule('armorStrShortfall',
    'armorStrRequirement', '=', null,
    'strength', '+', '-source'
  );
  rules.defineRule('attacksPerRound', '', '=', '1');
  rules.defineRule('betterAttackAdjustment',
    'combatNotes.dexterityAttackAdjustment', '=', null,
    'combatNotes.strengthAttackAdjustment', '^', null
  );
  rules.defineRule('betterDamageAdjustment',
    'combatNotes.dexterityDamageAdjustment', '=', null,
    'combatNotes.strengthDamageAdjustment', '^', null
  );
  rules.defineRule('combatNotes.constitutionHitPointsAdjustment',
    'constitutionModifier', '=', null,
    'level', '*', null
  );
  rules.defineRule('combatNotes.dexterityArmorClassAdjustment',
    'dexterityModifier', '=', null,
    'armorWeight', '*', 'source == 3 ? 0 : null'
  );
  rules.defineRule
    ('combatNotes.dexterityAttackAdjustment', 'dexterityModifier', '=', null);
  rules.defineRule
    ('combatNotes.dexterityDamageAdjustment', 'dexterityModifier', '=', null);
  rules.defineRule
    ('combatNotes.strengthAttackAdjustment', 'strengthModifier', '=', null);
  rules.defineRule
    ('combatNotes.strengthDamageAdjustment', 'strengthModifier', '=', null);
  rules.defineRule('features.Nonproficient Armor',
    // Modify heavy so that Prof (Light+Medium) doesn't suffice for heavy armor
    'armorWeight', '=', 'source == 3 ? 4 : source',
    'armorProficiency.Light', '+', '-1',
    'armorProficiency.Medium', '+', '-2',
    'armorProficiency.Heavy', '+', '-4',
    '', '^', '0'
  );
  rules.defineRule('features.Two-Handed Weapon With Shield',
    'shield', '?', 'source != "None"'
  );
  rules.defineRule
    ('hitPoints', 'combatNotes.constitutionHitPointsAdjustment', '+', null);
  rules.defineRule('initiative', 'dexterityModifier', '=', null);
  rules.defineRule('weapons.Unarmed', '', '=', '1');

  for(var ability in SRD5E.ABILITIES) {
    rules.defineRule('saveBonus.' + ability,
      'saveProficiency.' + ability, '?', null,
      'proficiencyBonus', '=', null
    );
    rules.defineRule('save.' + ability,
      ability.toLowerCase() + 'Modifier', '=', null,
      'saveBonus.' + ability, '+', null
    );
  }

  QuilvynRules.validAllocationRules
    (rules, 'armorProficiency', 'armorChoiceCount', 'Sum "^armorsChosen\\."');
  QuilvynRules.validAllocationRules
    (rules, 'weaponProficiency', 'weaponChoiceCount', 'Sum "^weaponsChosen\\."');

};

/* Defines rules related to basic character identity. */
SRD5E.identityRules = function(
  rules, alignments, backgrounds, classes, deities, paths, races
) {

  QuilvynUtils.checkAttrTable(alignments, []);
  QuilvynUtils.checkAttrTable
    (backgrounds, ['Equipment', 'Features', 'Languages']);
  QuilvynUtils.checkAttrTable
    (classes, ['Require', 'HitDie', 'Features', 'Selectables', 'Languages', 'CasterLevelArcane', 'CasterLevelDivine', 'SpellAbility', 'SpellSlots', 'Spells']);
  QuilvynUtils.checkAttrTable(deities, ['Alignment', 'Domain', 'Sphere']);
  QuilvynUtils.checkAttrTable
    (paths, ['Features', 'Selectables', 'Group', 'Level', 'SpellAbility', 'SpellSlots', 'Spells']);
  QuilvynUtils.checkAttrTable
    (races, ['Require', 'Features', 'Selectables', 'Languages', 'SpellAbility', 'SpellSlots', 'Spells']);

  for(var alignment in alignments) {
    rules.choiceRules(rules, 'Alignment', alignment, alignments[alignment]);
  }
  for(var background in backgrounds) {
    rules.choiceRules(rules, 'Background', background, backgrounds[background]);
  }
  for(var clas in classes) {
    rules.choiceRules(rules, 'Class', clas, classes[clas]);
  }
  for(var deity in deities) {
    rules.choiceRules(rules, 'Deity', deity, deities[deity]);
  }
  for(var path in paths) {
    rules.choiceRules(rules, 'Path', path, paths[path]);
  }
  for(var race in races) {
    rules.choiceRules(rules, 'Race', race, races[race]);
  }

  rules.defineRule('casterLevel',
    'casterLevelArcane', '+=', null,
    'casterLevelDivine', '+=', null
  );
  rules.defineRule
    ('experienceNeeded', 'level', '=', 'SRD5E.LEVELS_EXPERIENCE[source] * 1000');
  rules.defineRule('level',
    'experience', '=', 'SRD5E.LEVELS_EXPERIENCE.findIndex(item => item * 1000 > source)'
  );
  QuilvynRules.validAllocationRules
    (rules, 'level', 'level', 'Sum "^levels\\."');

};

/* Defines rules related to magic use. */
SRD5E.magicRules = function(rules, schools, spells) {

  QuilvynUtils.checkAttrTable(schools, ['Features']);
  QuilvynUtils.checkAttrTable
    (spells, ['School', 'Group', 'Level', 'Description']);

  for(var school in schools) {
    rules.choiceRules(rules, 'School', school, schools[school]);
  }
  for(var spell in spells) {
    rules.choiceRules(rules, 'Spell', spell, spells[spell]);
  }

};

/* Defines rules related to character aptitudes. */
SRD5E.talentRules = function(
  rules, feats, features, goodies, languages, skills, tools
) {

  QuilvynUtils.checkAttrTable(feats, ['Require', 'Imply', 'Type']);
  QuilvynUtils.checkAttrTable(features, ['Section', 'Note']);
  QuilvynUtils.checkAttrTable(languages, []);
  QuilvynUtils.checkAttrTable(skills, ['Ability', 'Class']);
  QuilvynUtils.checkAttrTable(tools, ['Type']);

  for(var feat in feats) {
    rules.choiceRules(rules, 'Feat', feat, feats[feat]);
  }
  for(var feature in features) {
    rules.choiceRules(rules, 'Feature', feature, features[feature]);
  }
  for(var goody in goodies) {
    rules.choiceRules(rules, 'Goody', goody, goodies[goody]);
  }
  for(var language in languages) {
    rules.choiceRules(rules, 'Language', language, languages[language]);
  }
  for(var skill in skills) {
    rules.choiceRules(rules, 'Skill', skill, skills[skill]);
    rules.choiceRules(rules, 'Goody', skill,
      'Pattern="([-+]\\d).*\\s+' + skill + '\\s+Skill|' + skill + '\\s+skill\\s+([-+]\\d)"' +
      'Effect=add ' +
      'Value="$1 || $2" ' +
      'Attribute="skills.' + skill + '" ' +
      'Section=skill Note="%V ' + skill + '"'
    );
    rules.choiceRules(rules, 'Goody', skill + ' Proficiency',
      'Pattern="' + skill + '\\s+proficiency" ' +
      'Effect=set ' +
      'Attribute="skillProficiency.' + skill + '" ' +
      'Section=skill Note="Proficiency in ' + skill + '"'
    );
  }
  for(var tool in tools) {
    rules.choiceRules(rules, 'Tool', tool, tools[tool]);
    rules.choiceRules(rules, 'Goody', tool + ' Proficiency',
      'Pattern="' + tool + '\\s+proficiency" ' +
      'Effect=set ' +
      'Attribute="toolProficiency.' + tool + '" ' +
      'Section=skill Note="Proficiency in ' + tool + '"'
    );
  }

  QuilvynRules.validAllocationRules
    (rules, 'feat', 'Sum "^featCount\\."', 'Sum "^feats\\."');
  QuilvynRules.validAllocationRules
    (rules, 'language', 'languageCount', 'Sum "^languages\\."');
  QuilvynRules.validAllocationRules
    (rules, 'selectableFeature', 'Sum "^selectableFeatureCount\\."', 'Sum "^selectableFeatures\\."');
  QuilvynRules.validAllocationRules
    (rules, 'skillProficiency', 'skillChoiceCount', 'Sum "^skillsChosen\\."');
  QuilvynRules.validAllocationRules
    (rules, 'toolProficiency', 'toolChoiceCount', 'Sum "^toolsChosen\\."');

};

/*
 * Adds #name# as a possible user #type# choice and parses #attrs# to add rules
 * related to selecting that choice.
 */
SRD5E.choiceRules = function(rules, type, name, attrs) {
  if(type == 'Alignment')
    SRD5E.alignmentRules(rules, name);
  else if(type == 'Background')
    SRD5E.backgroundRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Equipment'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Languages')
    );
  else if(type == 'Armor') {
    var bulky = QuilvynUtils.getAttrValue(attrs, 'Bulky');
    SRD5E.armorRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'AC'),
      bulky == 'y' || bulky == 'Y',
      QuilvynUtils.getAttrValue(attrs, 'Dex'),
      QuilvynUtils.getAttrValue(attrs, 'Str'),
      QuilvynUtils.getAttrValue(attrs, 'Weight')
    );
  } else if(type == 'Class') {
    SRD5E.classRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValue(attrs, 'HitDie'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Selectables'),
      QuilvynUtils.getAttrValueArray(attrs, 'Languages'),
      QuilvynUtils.getAttrValue(attrs, 'CasterLevelArcane'),
      QuilvynUtils.getAttrValue(attrs, 'CasterLevelDivine'),
      QuilvynUtils.getAttrValue(attrs, 'SpellAbility'),
      QuilvynUtils.getAttrValueArray(attrs, 'SpellSlots')
    );
    SRD5E.classRulesExtra(rules, name);
  } else if(type == 'Deity')
    SRD5E.deityRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Alignment'),
      QuilvynUtils.getAttrValueArray(attrs, 'Domain'),
      QuilvynUtils.getAttrValue(attrs, 'Sphere')
    );
  else if(type == 'Feat') {
    SRD5E.featRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Imply'),
      QuilvynUtils.getAttrValueArray(attrs, 'Type')
    );
    SRD5E.featRulesExtra(rules, name);
  } else if(type == 'Feature')
    SRD5E.featureRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Section'),
      QuilvynUtils.getAttrValueArray(attrs, 'Note')
    );
  else if(type == 'Goody')
    SRD5E.goodyRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Pattern'),
      QuilvynUtils.getAttrValue(attrs, 'Effect'),
      QuilvynUtils.getAttrValue(attrs, 'Value'),
      QuilvynUtils.getAttrValueArray(attrs, 'Attribute'),
      QuilvynUtils.getAttrValueArray(attrs, 'Section'),
      QuilvynUtils.getAttrValueArray(attrs, 'Note')
    );
  else if(type == 'Language')
    SRD5E.languageRules(rules, name);
  else if(type == 'Path') {
    SRD5E.pathRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Group'),
      QuilvynUtils.getAttrValue(attrs, 'Level'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Selectables'),
      QuilvynUtils.getAttrValue(attrs, 'SpellAbility'),
      QuilvynUtils.getAttrValueArray(attrs, 'SpellSlots'),
      QuilvynUtils.getAttrValueArray(attrs, 'Spells')
    );
    SRD5E.pathRulesExtra(rules, name);
  } else if(type == 'Race') {
    SRD5E.raceRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Selectables'),
      QuilvynUtils.getAttrValueArray(attrs, 'Languages'),
      QuilvynUtils.getAttrValue(attrs, 'SpellAbility'),
      QuilvynUtils.getAttrValueArray(attrs, 'SpellSlots')
    );
    SRD5E.raceRulesExtra(rules, name);
  } else if(type == 'School')
    SRD5E.schoolRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Features')
    );
  else if(type == 'Shield')
    SRD5E.shieldRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'AC')
    );
  else if(type == 'Skill')
    SRD5E.skillRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Ability'),
      QuilvynUtils.getAttrValueArray(attrs, 'Class')
    );
  else if(type == 'Spell') {
    var description = QuilvynUtils.getAttrValue(attrs, 'Description');
    var groupLevels = QuilvynUtils.getAttrValueArray(attrs, 'Level');
    var school = QuilvynUtils.getAttrValue(attrs, 'School');
    var schoolAbbr = school.substring(0, 4);
    for(var i = 0; i < groupLevels.length; i++) {
      var matchInfo = groupLevels[i].match(/^(\D+)(\d+)(\s\[.*\])?$/);
      if(!matchInfo) {
        console.log('Bad level "' + groupLevels[i] + '" for spell ' + name);
        continue;
      }
      var group = matchInfo[1];
      var level = matchInfo[2] * 1;
      var path = matchInfo[3] || '';
      var fullName = name + '(' + group + level + path + ' ' + schoolAbbr + ')';
      // TODO indicate domain spells in attributes?
      var domainSpell = SRD5E.PATHS[group + ' Domain'] != null;
      SRD5E.spellRules
        (rules, fullName, school, group, level, description, domainSpell);
      rules.addChoice('spells', fullName, attrs);
    }
  } else if(type == 'Tool')
    SRD5E.toolRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Type')
    );
  else if(type == 'Weapon')
    SRD5E.weaponRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Category'),
      QuilvynUtils.getAttrValueArray(attrs, 'Property'),
      QuilvynUtils.getAttrValue(attrs, 'Damage'),
      QuilvynUtils.getAttrValue(attrs, 'Range')
    );
  else {
    console.log('Unknown choice type "' + type + '"');
    return;
  }
  if(type != 'Feature' && type != 'Path' && type != 'Spell') {
    type = type == 'Class' ? 'levels' :
    type = type == 'Deity' ? 'deities' :
    (type.charAt(0).toLowerCase() + type.substring(1).replaceAll(' ', '') + 's');
    rules.addChoice(type, name, attrs);
  }
};

/* Defines in #rules# the rules associated with alignment #name#. */
SRD5E.alignmentRules = function(rules, name) {
  if(!name) {
    console.log('Empty alignment name');
    return;
  }
  // No rules pertain to alignment
};

/*
 * Defines in #rules# the rules associated with armor #name#, which adds #ac#
 * to the character's armor class, requires a #weight# proficiency level to use
 * effectively, allows a maximum dex bonus to ac of #maxDex#, requires (if
 * specified) a strength of #minStr# to avoid a speed penalty, and is considered
 * bulky armor if #bulky# is true.
 */
SRD5E.armorRules = function(rules, name, ac, bulky, maxDex, minStr, weight) {

  if(!name) {
    console.log('Empty armor name');
    return;
  }
  if(typeof ac != 'number') {
    console.log('Bad ac "' + ac + '" for armor ' + name);
    return;
  }
  if(bulky != null && typeof bulky != 'boolean') {
    console.log('Bad bulky "' + bulky + '" for skill ' + name);
  }
  if(typeof maxDex != 'number') {
    console.log('Bad max dex "' + maxDex + '" for armor ' + name);
    return;
  }
  if(minStr != null && typeof minStr != 'number') {
    console.log('Bad min str "' + minStr + '" for armor ' + name);
    return;
  }
  if(weight == null ||
     !(weight + '').match(/^([0-3]|none|light|medium|heavy)$/i)) {
    console.log('Bad weight "' + weight + '" for armor ' + name);
    return;
  }

  if((weight + '').match(/^[0-3]$/))
    ; // empty
  else if(weight.match(/^none$/i))
    weight = 0;
  else if(weight.match(/^light$/i))
    weight = 1;
  else if(weight.match(/^medium$/i))
    weight = 2;
  else if(weight.match(/^heavy$/i))
    weight = 3;

  if(rules.armorStats == null) {
    rules.armorStats = {
      ac:{},
      bulky:{},
      dex:{},
      str:{},
      weight:{}
    };
  }
  rules.armorStats.ac[name] = ac;
  rules.armorStats.bulky[name] = bulky;
  rules.armorStats.dex[name] = maxDex;
  rules.armorStats.str[name] = minStr;
  rules.armorStats.weight[name] = weight;

  rules.defineRule('armorClass',
    '', '=', '10',
    'armor', '+', QuilvynUtils.dictLit(rules.armorStats.ac) + '[source]'
  );
  rules.defineRule('armorStrRequirement',
    'armor', '=', QuilvynUtils.dictLit(rules.armorStats.minStr) + '[source]'
  );
  rules.defineRule('armorWeight',
    'armor', '=', QuilvynUtils.dictLit(rules.armorStats.weight) + '[source]'
  );
  rules.defineRule('combatNotes.dexterityArmorClassAdjustment',
    'armor', 'v', QuilvynUtils.dictLit(rules.armorStats.dex) + '[source]'
  );
  rules.defineRule('skillNotes.bulkyArmor',
    'armor', '=', QuilvynUtils.dictLit(rules.armorStats.bulky) + '[source]'
  );

};

/*
 * Defines in #rules# the rules associated with background #name#, which grants
 * the equipment, features, and languages listed in #equipment#, #features#,
 * and #languages#.
 */
SRD5E.backgroundRules = function(rules, name, equipment, features, languages) {

  var prefix =
    name.substring(0, 1).toLowerCase() + name.substring(1).replaceAll(' ', '');
  var backgroundLevel = prefix + 'Level';

  rules.defineRule(backgroundLevel,
    'background', '?', 'source == "' + name + '"',
    'level', '=', null
  );

  SRD5E.featureListRules(rules, features, name, backgroundLevel, false);
  rules.defineSheetElement(name + ' Features', 'Feats+', null, '; ');
  rules.defineChoice('extras', prefix + 'Features');

  if(languages.length > 0) {
    rules.defineRule('languageCount', backgroundLevel, '+', languages.length);
    for(var i = 0; i < languages.length; i++) {
      if(languages[i] != 'any')
        rules.defineRule
          ('languages.' + languages[i], backgroundLevel, '=', '1');
    }
  }

  // TBD Do anything with equipment?

};

/*
 * Defines in #rules# the rules associated with class #name#, which has the list
 * of hard prerequisites #requires#. The class grants #hitDie# (format [n]'d'n)
 * additional hit points with each level advance. #features# and #selectables#
 * list the fixed and selectable features acquired as the character advances in
 * class level, and #languages# lists any automatic languages for the class.
 * #casterLevelArcane# and #casterLevelDivine#, if specified, give the
 * Javascript expression for determining the caster level for the class; these
 * can incorporate a class level attribute (e.g., 'levels.Cleric') or the
 * character level attribute 'level'. #spellAbility#, if specified, names the
 * ability for computing spell difficulty class. #spellSlots# lists the
 * number of spells per level per day that the class can cast, and #spells#
 * lists spells defined by the class. #spellDict# is the dictionary of all
 * spells used to look up individual spell attributes.
 */
SRD5E.classRules = function(
  rules, name, requires, hitDie, features, selectables, languages,
  casterLevelArcane, casterLevelDivine, spellAbility, spellSlots
) {

  if(!name) {
    console.log('Empty class name');
    return;
  }
  if(!Array.isArray(requires)) {
    console.log('Bad requires list "' + requires + '" for class ' + name);
    return;
  }
  if(!(hitDie + '').match(/^(\d+)?d\d+$/)) {
    console.log('Bad hitDie "' + hitDie + '" for class ' + name);
    return;
  }
  if(!Array.isArray(features)) {
    console.log('Bad features list "' + features + '" for class ' + name);
    return;
  }
  if(!Array.isArray(selectables)) {
    console.log('Bad selectables list "' + selectables + '" for class ' + name);
    return;
  }
  if(!Array.isArray(languages)) {
    console.log('Bad languages list "' + languages + '" for class ' + name);
    return;
  }
  if(spellAbility) {
    spellAbility = spellAbility.toLowerCase();
    if(!(spellAbility.charAt(0).toUpperCase() + spellAbility.substring(1) in SRD5E.ABILITIES)) {
      console.log('Bad spell ability "' + spellAbility + '" for class ' + name);
      return;
    }
  }
  if(!Array.isArray(spellSlots)) {
    console.log('Bad spellSlots list "' + spellSlots + '" for class ' + name);
    return;
  }

  var classLevel = 'levels.' + name;
  var i;
  var prefix =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');

  if(requires.length > 0)
    QuilvynRules.prerequisiteRules
      (rules, 'validation', prefix + 'Class', classLevel, requires);

  SRD5E.featureListRules(rules, features, name, classLevel, false);
  SRD5E.featureListRules(rules, selectables, name, classLevel, true);
  rules.defineSheetElement(name + ' Features', 'Feats+', null, '; ');
  rules.defineChoice('extras', prefix + 'Features');

  if(languages.length > 0) {
    rules.defineRule('languageCount', classLevel, '+', languages.length);
    for(i = 0; i < languages.length; i++) {
      if(languages[i] != 'any')
        rules.defineRule('languages.' + languages[i], classLevel, '=', '1');
    }
  }

  rules.defineRule('featCount.General',
    'levels.' + name, '+=', 'Math.min(Math.floor(source / 4), 5)'
  );
  rules.defineRule('proficiencyBonus',
    'levels.' + name, '=', 'Math.floor((source + 7) / 4)'
  );

  if(spellSlots.length > 0) {

    var casterLevelExpr = casterLevelArcane || casterLevelDivine || classLevel;
    if(casterLevelExpr.match(new RegExp('\\b' + classLevel + '\\b', 'i'))) {
      rules.defineRule('casterLevels.' + name,
        classLevel, '=', casterLevelExpr.replace(new RegExp('\\b' + classLevel + '\\b', 'gi'), 'source')
      );
    } else {
      rules.defineRule('casterLevels.' + name,
        classLevel, '?', null,
        'level', '=', casterLevelExpr.replace(new RegExp('\\blevel\\b', 'gi'), 'source')
      );
    }
    if(casterLevelArcane)
      rules.defineRule('casterLevelArcane', 'casterLevels.' + name, '+=', null);
    if(casterLevelDivine)
      rules.defineRule('casterLevelDivine', 'casterLevels.' + name, '+=', null);

    QuilvynRules.spellSlotRules(rules, 'casterLevels.' + name, spellSlots);

    for(i = 0; i < spellSlots.length; i++) {
      var matchInfo = spellSlots[i].match(/^(\D+)\d:/);
      if(!matchInfo) {
        console.log('Bad format for spell slot "' + spellSlots[i] + '"');
        continue;
      }
      var spellType = matchInfo[1];
      if(spellType != name)
        rules.defineRule
          ('casterLevels.' + spellType, 'casterLevels.' + name, '^=', null);
      rules.defineRule('spellAttackModifier.' + spellType,
        'casterLevels.' + spellType, '?', null,
        spellAbility + 'Modifier', '=', null,
        'proficiencyBonus', '+', null
      );
      rules.defineRule('spellDifficultyClass.' + spellType,
        'casterLevels.' + spellType, '?', null,
        spellAbility + 'Modifier', '=', '8 + source',
        'proficiencyBonus', '+', null
      );
      rules.defineRule('spellCasterLevel.' + spellType,
        'casterLevels.' + spellType, '=', null
      );
      rules.defineRule('spellModifier.' + spellType,
        'casterLevels.' + spellType, '?', null,
        spellAbility + 'Modifier', '=', null
      );
    }

  }

};

/*
 * Defines in #rules# the rules associated with class #name# that cannot be
 * derived directly from the attributes passed to classRules.
 */
SRD5E.classRulesExtra = function(rules, name) {

  var classLevel = 'levels.' + name;

  if(name == 'Barbarian') {

    rules.defineRule('armorClass',
      'combatNotes.barbarianUnarmoredDefense.2', '+', null
    );
    rules.defineRule('combatNotes.brutalCritical',
      classLevel, '=', 'Math.floor((source - 5) / 4)'
    );
    // Show Unarmored Defense note even if armor != None or conMod == 0
    rules.defineRule('combatNotes.barbarianUnarmoredDefense.1',
      'combatNotes.barbarianUnarmoredDefense', '?', null,
      'constitutionModifier', '=', null
    );
    rules.defineRule('combatNotes.barbarianUnarmoredDefense.2',
      'combatNotes.barbarianUnarmoredDefense', '?', null,
      'armor', '?', 'source == "None"',
      'combatNotes.barbarianUnarmoredDefense.1', '=', null
    );
    rules.defineRule
      ('combatNotes.extraAttack', classLevel, '+=', 'source<5 ? null : 1');
    rules.defineRule('combatNotes.rage',
      classLevel, '+=', 'source<9 ? 2 : source<16 ? 3 : 4'
    );
    rules.defineRule('featureNotes.intimidatingPresence',
      'charismaModifier', '=', 'source + 8',
      'proficiencyBonus', '+', null
    );
    rules.defineRule('featureNotes.rage',
      classLevel, '+=', 'source<3 ? 2 : source<6 ? 3 : source<12 ? 4 : source<17 ? 5 : source<20 ? 6 : "unlimited"'
    );
    rules.defineRule('selectableFeatureCount.Barbarian (Primal Path)',
      classLevel, '=', 'source<3 ? null : 1'
    );
    rules.defineRule('speed', 'abilityNotes.fastMovement', '+', '10');

  } else if(name == 'Bard') {

    rules.defineRule('abilityNotes.jackOfAllTrades',
      'proficiencyBonus', '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('bardicInspirationDie',
      classLevel, '=', 'source<20 ? 6 + Math.floor(source / 5) * 2 : 12'
    );
    rules.defineRule
      ('magicNotes.bardicInspiration', 'bardicInspirationDie', '=', null);
    rules.defineRule('magicNotes.bardicInspiration.1',
      'charismaModifier', '=', 'Math.max(source, 1)'
    );
    rules.defineRule('magicNotes.bardicInspiration.2',
      classLevel, '=', '"long"',
      'magicNotes.fontOfInspiration', '=', '"short"'
    );
    rules.defineRule('magicNotes.magicalSecrets',
      classLevel, '=', '2 * Math.floor((source - 6) / 4)'
    );
    rules.defineRule('magicNotes.songOfRest',
      classLevel, '=', '6 + (source>=9 ? 2 * Math.floor((source-5)/4) : 0)'
    );
    rules.defineRule('selectableFeatureCount.Bard (Bard College)',
      classLevel, '=', 'source<3 ? null : 1'
    );
    rules.defineRule
      ('skillNotes.bardExpertise', classLevel, '=', 'source<10 ? 2 : 4');
    // Magical Secrets feature allows choosing non-Bard spells; here we set the
    // caster level and modifier for any variable efffects. Note inclusion of
    // 'A' spells for Artificer class from supplements.
    rules.defineRule('spellCasterLevel.Magical Secrets',
      'features.Magical Secrets', '=', '0',
      'features.Additional Magical Secrets', '=', '0',
      'casterLevels.Bard', '+', null
    );
    rules.defineRule('spellModifier.Magical Secrets',
      'spellCasterLevel.Magical Secrets', '?', null,
      'charismaModifier', '=', null
    );
    ['A', 'C', 'D', 'K', 'S', 'W'].forEach((spellType) => {
      rules.defineRule('spellCasterLevel.' + spellType,
        'spellCasterLevel.Magical Secrets', '=', null
      );
      rules.defineRule('spellModifier.' + spellType,
        'spellModifier.Magical Secrets', '='. null
      );
    });

  } else if(name == 'Cleric') {

    rules.defineRule('combatNotes.destroyUndead',
      classLevel, '=', 'source < 8 ? 0.5 : Math.min(Math.floor((source-5)/3),4)'
    );
    rules.defineRule('combatNotes.turnUndead',
      'wisdomModifier', '=', 'source + 8',
      'proficiencyBonus', '+', null
    );
    rules.defineRule('featureNotes.channelDivinity',
      classLevel, '=', 'source<6 ? 1: source<18 ? 2 : 3'
    );
    rules.defineRule('magicNotes.divineIntervention',
      classLevel, '=', 'source<20 ? source : 100'
    );
    rules.defineRule('magicNotes.preserveLife', classLevel, '=', '5 * source');
    rules.defineRule
      ('selectableFeatureCount.Cleric (Divine Domain)', classLevel, '=', '1');

  } else if(name == 'Druid') {

    rules.defineRule("combatNotes.nature'sSanctuary",
      'wisdomModifier', '=', 'source + 8',
      'proficiencyBonus', '+', null
    );
    rules.defineRule
      ('magicNotes.naturalRecovery', classLevel, '=', 'Math.floor(source / 2)');
    rules.defineRule('magicNotes.wildShape.1',
      classLevel, '=', 'source<4 ? "1/4" : source<8 ? "1/2" : "1"'
    );
    rules.defineRule('magicNotes.wildShape.2',
      classLevel, '=', 'source<4 ? " (land only)" : source<8 ? " (non-flying)" : ""'
    );
    rules.defineRule
      ('magicNotes.wildShape.3', classLevel, '=', 'Math.floor(source /2)');
    rules.defineRule('magicNotes.wildShape.4',
      classLevel, '=', '2',
      'magicNotes.archdruid', '=', '"unlimited"'
    );
    rules.defineRule('selectableFeatureCount.Druid (Druid Circle)',
      classLevel, '=', 'source<2 ? null : 1'
    );
    rules.defineRule
      ('spellSlots.D0', 'magicNotes.druidBonusCantrip', '+=', '1');

  } else if(name == 'Fighter') {

    rules.defineRule('abilityNotes.remarkableAthlete',
      'proficiencyBonus', '=', 'Math.ceil(source / 2)'
    );
    rules.defineRule
      ('attackBonus.Ranged', 'combatNotes.fightingStyle(Archery)', '+=', '2');
    rules.defineRule
      ('combatNotes.actionSurge', classLevel, '=', 'source<17 ? 1 : 2');
    // Show Fighting Style (Defense) note even if armor == None
    rules.defineRule('combatNotes.fightingStyle(Defense).1',
      'combatNotes.fightingStyle(Defense)', '?', null,
      'armor', '=', 'source == "None" ? null : 1'
    );
    rules.defineRule('combatNotes.extraAttack',
      classLevel, '+=', 'source<5 ? null : source<11 ? 1 : source<20 ? 2 : 3'
    );
    rules.defineRule('combatNotes.secondWind', classLevel, '=', null);
    rules.defineRule
      ('combatNotes.survivor', 'constitutionModifier', '=', '5 + source');
    rules.defineRule
      ('combatNotes.survivor.1', 'hitPoints', '=', 'Math.floor(source / 2)');
    rules.defineRule('featCount.General', 'fighterFeatBonus', '+', null);
    rules.defineRule('fighterFeatBonus',
      classLevel, '=', 'source<6 ? null : source<14 ? 1 : 2'
    );
    rules.defineRule('saveNotes.indomitable',
      classLevel, '=', 'source<13 ? 1 : source<17 ? 2 : 3'
    );
    rules.defineRule('selectableFeatureCount.Fighter (Fighting Style)',
      classLevel, '=', '1',
      'combatNotes.additionalFightingStyle', '+', '1'
    );
    rules.defineRule('selectableFeatureCount.Fighter (Martial Archetype)',
      classLevel, '=', 'source<3 ? null : 1'
    );
    rules.defineRule
      ('skillNotes.remarkableAthlete', 'strengthModifier', '=', null);

  } else if(name == 'Monk') {

    rules.defineRule('abilityNotes.improvedUnarmoredMovement',
      'armor', '?', 'source == "None"',
      'shield', '?', 'source == "None"'
    );
    rules.defineRule('abilityNotes.slowFall', classLevel, '=', 'source * 5');
    // Show Unarmored Movement note properly even if armor != "None"
    rules.defineRule('abilityNotes.unarmoredMovement',
      classLevel, '=', 'Math.floor((source + 6) / 4) * 5'
    );
    rules.defineRule('abilityNotes.unarmoredMovement.1',
      'armor', '?', 'source == "None"',
      'shield', '?', 'source == "None"',
      'abilityNotes.unarmoredMovement', '=', null
    );
    rules.defineRule
      ('armorClass', 'combatNotes.monkUnarmoredDefense.2', '+', null);
    rules.defineRule('combatNotes.deflectMissiles',
      classLevel, '=', null,
      'dexterityModifier', '+', null
    );
    rules.defineRule
      ('combatNotes.extraAttack', classLevel, '+=', 'source<5 ? null : 1');
    rules.defineRule('combatNotes.martialArts',
      classLevel, '=', '4 + Math.floor((source + 1)/ 6) * 2'
    );
    rules.defineRule('combatNotes.martialArts.1',
      'monkFeatures.Martial Arts', '?', null,
      'dexterityModifier', '=', 'source',
      'strengthModifier', '+', '-source',
      '', '^', '0'
    );
    // Show Unarmored Defense note even if armor != None or wisMod = 0
    rules.defineRule('combatNotes.monkUnarmoredDefense.1',
      'combatNotes.monkUnarmoredDefense', '?', null,
      'wisdomModifier', '=', null
    );
    rules.defineRule('combatNotes.monkUnarmoredDefense.2',
      'combatNotes.monkUnarmoredDefense', '?', null,
      'armor', '?', 'source == "None"',
      'combatNotes.monkUnarmoredDefense.1', '=', null
    );
    rules.defineRule('combatNotes.openHandTechnique', 'kiSaveDC', '=', null);
    rules.defineRule('combatNotes.quiveringPalm', 'kiSaveDC', '=', null);
    rules.defineRule('combatNotes.quiveringPalm.1',
      'features.Quivering Palm', '?', null,
      classLevel, '=', null
    );
    rules.defineRule('combatNotes.stunningStrike', 'kiSaveDC', '=', null);
    rules.defineRule('featureNotes.ki', classLevel, '=', null);
    rules.defineRule
      ('featureNotes.wholenessOfBody', classLevel, '=', 'source*3');
    rules.defineRule('kiSaveDC',
      'monkFeatures.Ki', '?', null,
      'proficiencyBonus', '=', '8 + source',
      'wisdomModifier', '+', null
    );
    rules.defineRule('magicNotes.tranquility', 'kiSaveDC', '=', null);
    rules.defineRule('monkMeleeAttackBonus',
      'armor', '?', 'source == "None"',
      'combatNotes.martialArts.1', '=', null
    );
    rules.defineRule('monkMeleeDamageBonus',
      'armor', '?', 'source == "None"',
      'combatNotes.martialArts.1', '=', null
    );
    rules.defineRule('monkMeleeDieBonus',
      'armor', '?', 'source == "None"',
      'combatNotes.martialArts', '=', '"1d" + source'
    );
    for(var ability in SRD5E.ABILITIES) {
      rules.defineRule
        ('saveProficiency.' + ability, 'saveNotes.diamondSoul', '=', '1');
    }
    rules.defineRule('selectableFeatureCount.Monk (Monastic Tradition)',
      classLevel, '=', 'source<3 ? null : 1'
    );
    rules.defineRule('speed', 'abilityNotes.unarmoredMovement.1', '+', null);
    SRD5E.featureSpells(rules, 'Tranquility', 'M', null, ['Sanctuary']);
    SRD5E.featureSpells(rules, 'Empty Body', 'M', null, ['Astral Projection']);
    rules.defineRule('spellCasterLevel.M', 'levels.Monk', '=', null);
    rules.defineRule('spellModifier.M', 'wisdomModifier', '=', null);
    rules.defineRule('casterLevels.M', 'spellCasterLevel.M', '^=', null);

  } else if(name == 'Paladin') {

    rules.defineRule
      ('armorClass', 'combatNotes.fightingStyle(Defense).1', '+', null);
    // Show Fighting Style (Defense) note even if armor == None
    rules.defineRule('combatNotes.fightingStyle(Defense).1',
      'combatNotes.fightingStyle(Defense)', '?', null,
      'armor', '=', 'source == "None" ? null : 1'
    );
    rules.defineRule
      ('combatNotes.extraAttack', classLevel, '+=', 'source<5 ? null : 1');
    rules.defineRule('combatNotes.sacredWeapon',
      'charismaModifier', '=', 'Math.max(source, 1)'
    );
    rules.defineRule('featureNotes.channelDivinity', classLevel, '=', '1');
    rules.defineRule('magicNotes.cleansingTouch',
      'charismaModifier', '=', 'Math.max(source, 1)'
    );
    rules.defineRule
      ('magicNotes.divineSense', 'charismaModifier', '=', 'source+1');
    rules.defineRule
      ('magicNotes.turnTheUnholy', 'spellDifficultyClass.P', '=', null);
    rules.defineRule('magicNotes.layOnHands', classLevel, '=', 'source*5');
    rules.defineRule
      ('saveNotes.auraOfCourage', classLevel, '=', 'source<18 ? 10 : 30');
    rules.defineRule
      ('saveNotes.auraOfDevotion', classLevel, '=', 'source<18 ? 10 : 30');
    rules.defineRule
      ('saveNotes.auraOfProtection', classLevel, '=', 'source<18 ? 10 : 30');
    rules.defineRule('saveNotes.auraOfProtection.1',
      'charismaModifier', '=', 'Math.max(source, 1)'
    );
    rules.defineRule('selectableFeatureCount.Paladin (Fighting Style)',
      classLevel, '=', 'source<2 ? null : 1'
    );
    rules.defineRule('selectableFeatureCount.Paladin (Sacred Oath)',
      classLevel, '=', 'source<3 ? null : 1'
    );

  } else if(name == 'Ranger') {

    rules.defineRule
      ('armorClass', 'combatNotes.fightingStyle(Defense).1', '+', null);
    // Show Fighting Style (Defense) note even if armor == None
    rules.defineRule('combatNotes.fightingStyle(Defense).1',
      'combatNotes.fightingStyle(Defense)', '?', null,
      'armor', '=', 'source == "None" ? null : 1'
    );
    rules.defineRule
      ('combatNotes.extraAttack', classLevel, '+=', 'source<5 ? null : 1');
    rules.defineRule
      ('attackBonus.Ranged', 'combatNotes.fightingStyle(Archery)', '+=', '2');
    rules.defineRule('skillNotes.favoredEnemy',
      classLevel, '=', 'source<6 ? 1 : source<14 ? 2 : 3'
    );
    rules.defineRule('combatNotes.foeSlayer', 'wisdomModifier', '=', null);
    rules.defineRule('selectableFeatureCount.Ranger (Fighting Style)',
      classLevel, '=', 'source<2 ? null : 1'
    );
    rules.defineRule('selectableFeatureCount.Ranger (Hunter Technique)',
      'rangerFeatures.Hunter', '?', null,
      classLevel, '=', 'source<7 ? 1 : source<11 ? 2 : source<15 ? 3 : 4'
    );
    rules.defineRule('selectableFeatureCount.Ranger (Ranger Archetype)',
      classLevel, '=', 'source<3 ? null : 1'
    );
    rules.defineRule('skillNotes.naturalExplorer',
      classLevel, '=', 'source<6 ? 1 : source<10 ? 2 : 3'
    );

  } else if(name == 'Rogue') {

    rules.defineRule('combatNotes.sneakAttack',
      classLevel, '=', 'Math.floor((source + 1) / 2)'
    );
    rules.defineRule('featCount.General', 'rogueFeatBonus', '+', null);
    rules.defineRule('rogueFeatBonus', classLevel, '=', 'source<10 ? null : 1');
    rules.defineRule('selectableFeatureCount.Rogue (Roguish Archetype)',
      classLevel, '=', 'source<3 ? null : 1'
    );
    rules.defineRule
      ('skillNotes.rogueExpertise', classLevel, '=', 'source<6 ? 2 : 4');
    rules.defineRule
      ('skillNotes.second-StoryWork', 'dexterityModifier', '=', null);

  } else if(name == 'Sorcerer') {

    rules.defineRule('magicNotes.carefulSpell',
      'charismaModifier', '=', 'Math.max(source, 1)'
    );
    rules.defineRule
      ('magicNotes.draconicPresence', 'spellDifficultyClass.S', '=', null);
    rules.defineRule('magicNotes.empoweredSpell',
      'charismaModifier', '=', 'Math.max(source, 1)'
    );
    rules.defineRule('magicNotes.fontOfMagic', classLevel, '=', null);
    rules.defineRule('selectableFeatureCount.Sorcerer (Metamagic)',
      classLevel, '=', 'source<3 ? null : source<10 ? 2 : source<17 ? 3 : 4'
    );
    rules.defineRule('selectableFeatureCount.Sorcerer (Sorcerous Origin)',
      classLevel, '=', 'source<3 ? null : 1'
    );

    rules.defineRule
      ('armorClass', 'combatNotes.draconicResilience.2', '^', null);
    rules.defineRule('combatNotes.draconicResilience', classLevel, '=', null);
    rules.defineRule('combatNotes.draconicResilience.1',
      'combatNotes.draconicResilience', '?', null,
      'dexterityModifier', '=', 'source + 13'
    );
    rules.defineRule('combatNotes.draconicResilience.2',
      'armor', '?', 'source == "None"',
      'combatNotes.draconicResilience.1', '=', null
    );
    rules.defineRule('languageCount', 'skillNotes.dragonAncestor', '+', '1');
    rules.defineRule('languages.Draconic', 'skillNotes.dragonAncestor', '=', '1');
    rules.defineRule
      ('magicNotes.elementalAffinity', 'charismaModifier', '=', null);

  } else if(name == 'Warlock') {

    rules.defineRule("combatNotes.darkOne'sBlessing.1",
      "warlockFeatures.Dark One's Blessing", '?', null,
      'charismaModifier', '=', null,
      classLevel, '+', null,
      '', '^', '1'
    );
    rules.defineRule('combatNotes.lifedrinker',
      'charismaModifier', '=', 'Math.max(source, 1)'
    );
    rules.defineRule
      ('magicNotes.agonizingBlast', 'charismaModifier', '=', null);
    rules.defineRule('magicNotes.eldritchInvocations',
      classLevel, '=', 'source==2 ? 2 : source<9 ? Math.floor((source + 1) / 2) : Math.floor((source + 6) / 3)'
    );
    rules.defineRule('magicNotes.mysticArcanum',
      classLevel, '=', 'source<13 ? "K6" : source<15 ? "K6, K7" : source<17 ? "K6, K7, K8" : "K6, K7, K8, K9"'
    );
    rules.defineRule('selectableFeatureCount.Warlock (Eldritch Invocation)',
      'magicNotes.eldritchInvocations', '=', null
    );
    rules.defineRule('selectableFeatureCount.Warlock (Otherworldly Patron)',
      classLevel, '=', '1'
    );
    rules.defineRule('selectableFeatureCount.Warlock (Pact Boon)',
      classLevel, '=', 'source<3 ? null : 1'
    );
    SRD5E.featureSpells(rules, 'Armor Of Shadows', 'K', null, ['Mage Armor']);
    SRD5E.featureSpells
      (rules, 'Beast Speech', 'K', null, ['Speak With Animals']);
    SRD5E.featureSpells(rules, 'Eldritch Sight', 'K', null, ['Detect Magic']);
    SRD5E.featureSpells(rules, 'Fiendish Vigor', 'K', null, ['False Life']);
    SRD5E.featureSpells
      (rules, 'Mask Of Many Faces', 'K', null, ['Disguise Self']);
    SRD5E.featureSpells(rules, 'Misty Visions', 'K', null, ['Silent Image']);
    SRD5E.featureSpells(rules, 'Otherworldly Leap', 'K', null, ['Jump']);
    SRD5E.featureSpells
      (rules, 'Pact Of The Chain', 'K', null, ['Find Familiar']);
    SRD5E.featureSpells(rules, 'Thief Of Five Fates', 'K', null, ['Bane']);
    SRD5E.featureSpells
      (rules, 'Master Of Myriad Forms', 'K', null, ['Alter Self']);
    SRD5E.featureSpells(rules, 'Ascendant Step', 'K', null, ['Levitate']);
    SRD5E.featureSpells(rules, 'Mire The Mind', 'K', null, ['Slow']);
    SRD5E.featureSpells(rules, 'Sign Of Ill Omen', 'K', null, ['Bestow Curse']);
    SRD5E.featureSpells
      (rules, 'Whispers Of The Grave', 'K', null, ['Speak With Dead']);
    SRD5E.featureSpells
      (rules, 'Bewitching Whispers', 'K', null, ['Compulsion']);
    SRD5E.featureSpells(rules, 'Dreadful Word', 'K', null, ['Confusion']);
    SRD5E.featureSpells(rules, 'Sculptor Of Flesh', 'K', null, ['Polymorph']);
    SRD5E.featureSpells
      (rules, 'Visions Of Distant Realms', 'K', null, ['Arcane Eye']);
    SRD5E.featureSpells
      (rules, 'Chains Of Carceri', 'K', null, ['Hold Monster']);
    SRD5E.featureSpells
      (rules, 'Minions Of Chaos', 'K', null, ['Conjure Elemental']);

  } else if(name == 'Wizard') {

    rules.defineRule
      ('magicNotes.arcaneRecovery', classLevel, '=', 'Math.ceil(source / 2)');
    rules.defineRule('magicNotes.empoweredEvocation',
      'intelligenceModifier', '=', null
    );
    rules.defineRule('selectableFeatureCount.Wizard (Arcane Tradition)',
      classLevel, '=', 'source<2 ? null : 1'
    );

  }

};

/*
 * Defines in #rules# the rules associated with deity #name#. #alignment# gives
 * the deity's alignment, #domains# the associated domains, and #sphere# any
 * sphere of influence.
 */
SRD5E.deityRules = function(rules, name, alignment, domains, sphere) {

  if(!name) {
    console.log('Empty deity name');
    return;
  }
  if(name != 'None' &&
     !((alignment + '') in SRD5E.ALIGNMENTS) &&
     !(alignment+'').match(/^(N|[LNC]G|[LNC]E|[LC]N)$/i)) {
    console.log('Bad alignment "' + alignment + '" for deity ' + name);
    return;
  }
  if(alignment && alignment.length > 2)
    alignment = alignment.split(' ').map(x => x.charAt(0)).join('');
  if(!Array.isArray(domains)) {
    console.log('Bad domains list "' + domains + '" for deity ' + name);
    return;
  }

  if(rules.deityStats == null) {
    rules.deityStats = {
      alignment:{},
      domains:{},
      sphere:{}
    };
  }

  rules.deityStats.alignment[name] = alignment;
  rules.deityStats.domains[name] = domains.join('/');
  rules.deityStats.sphere[name] = sphere;

  rules.defineRule('deityAlignment',
    'deity', '=', QuilvynUtils.dictLit(rules.deityStats.alignment) + '[source]'
  );
  rules.defineRule('deityDomains',
    'deity', '=', QuilvynUtils.dictLit(rules.deityStats.domains) + '[source]'
  );
  rules.defineRule('deitySphere',
    'deity', '=', QuilvynUtils.dictLit(rules.deityStats.sphere) + '[source]'
  );

};

/*
 * Defines in #rules# the rules associated with feat #name#. #require# and
 * #implies# list any hard and soft prerequisites for the feat, and #types#
 * lists the categories of the feat.
 */
SRD5E.featRules = function(rules, name, requires, implies, types) {

  if(!name) {
    console.log('Empty feat name');
    return;
  }
  if(!Array.isArray(requires)) {
    console.log('Bad requires list "' + requires + '" for feat ' + name);
    return;
  }
  if(!Array.isArray(implies)) {
    console.log('Bad implies list "' + implies + '" for feat ' + name);
    return;
  }
  if(!Array.isArray(types)) {
    console.log('Bad types list "' + types + '" for feat ' + name);
    return;
  }

  var prefix =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');

  if(requires.length > 0)
    QuilvynRules.prerequisiteRules
      (rules, 'validation', prefix + 'Feat', 'feats.' + name, requires);
  if(implies.length > 0)
    QuilvynRules.prerequisiteRules
      (rules, 'sanity', prefix + 'Feat', 'feats.' + name, implies);
  rules.defineRule('features.' + name, 'feats.' + name, '=', null);
  for(var i = 0; i < types.length; i++) {
    if(types[i] != 'General')
      rules.defineRule('sum' + types[i] + 'Feats', 'feats.' + name, '+=', null);
  }

};

/*
 * Defines in #rules# the rules associated with feat #name# that cannot be
 * derived directly from the attributes passed to featRules.
 */
SRD5E.featRulesExtra = function(rules, name) {
  if(name == 'Ability Boost') {
    rules.defineChoice('notes', 'abilityNotes.abilityBoosts:%V to distribute');
    rules.defineRule
      ('abilityNotes.abilityBoost', 'feats.Ability Boost', '=', null);
    rules.defineRule
      ('abilityNotes.abilityBoosts', 'abilityBoostChoiceCount', '=', null);
  }
};

/*
 * Defines in #rules# the rules associated with feature #name#. #sections# lists
 * the sections of the notes related to the feature and #notes# the note texts;
 * the two must have the same number of elements.
 */
SRD5E.featureRules = function(rules, name, sections, notes) {
  // TBD Move out of SRD35
  SRD35.featureRules(rules, name, sections, notes);
  for(var i = 0; i < notes.length; i++) {
    var note =
      sections[i] + 'Notes.' + name.charAt(0).toLowerCase() +
      name.substring(1).replaceAll(' ', '');
    var matchInfo =
      notes[i].match(/^([A-Z]\w*)\sProficiency\s\((([^\(]|\([^\)]*\))*)\)$/);
    if(matchInfo) {
      var group = matchInfo[1].toLowerCase();
      matchInfo[2].split('/').forEach(affected => {
        matchInfo = affected.match(/^Choose\s(\d+)/);
        if(matchInfo)
          rules.defineRule(group + 'ChoiceCount', note, '+=', matchInfo[1]);
        else
          rules.defineRule(group + 'Proficiency.' + affected, note, '=', '1');
      });
    }
    matchInfo = notes[i].match(/Ability Boost \((.*)\)/ig);
    if(matchInfo) {
      var totalBoosts = 0;
      var addSource = false;
      matchInfo.forEach(matched => {
        matched.split('/').forEach(boosted => {
          var choices = boosted.match(/Choose (\d+|%V)/i);
          if(!choices)
            rules.defineRule(boosted.toLowerCase(), note, '+', '1');
          else if(choices[1].startsWith('%'))
            addSource = true;
          else
            totalBoosts += choices[1] - 0;
        });
      });
      rules.defineRule('abilityBoostChoiceCount',
        note, '+=', totalBoosts + (addSource ? ' + source' : '')
      );
    }
  }
};

/*
 * Defines in #rules# the rules to grant the spells listed in #spellList# when
 * feature #feature# is acquired. #spellType# contains the spell group (e.g.,
 * 'B' for Bard, 'C' for Cleric, etc.). Each element of #spellList# has the
 * format "[min level:]spell name[,spell name...]". If min level is provided,
 * the spells listed in that element are not acquired until the character's
 * value of #levelAttr# reaches that level.
 */
SRD5E.featureSpells = function(rules, feature, spellType, levelAttr, spellList){

  var allSpells = rules.getChoices('spells');

  for(var i = 0; i < spellList.length; i++) {
    var spellNames = spellList[i];
    var minLevel = null;
    if(spellNames.match(/^\d+:/)) {
      minLevel = spellNames.split(':')[0] - 0;
      spellNames = spellNames.split(':')[1];
    }
    spellNames = spellNames.split(',');
    for(var j = 0; j < spellNames.length; j++) {
      var spellName = spellNames[j];
      var spell = QuilvynUtils.getKeys(allSpells, '^' + spellName + '\\(')[0];
      if(!spell) {
        console.log('Unknown spell "' + spellName + '" for feature ' + feature);
        return;
      }
      var spellAttrs = allSpells[spell];
      var spellDescription =
        QuilvynUtils.getAttrValue(spellAttrs, 'Description');
      var spellLevel =
        QuilvynUtils.getAttrValue(spellAttrs, 'Level').match(/\d/)[0] - 0;
      var spellSchool = QuilvynUtils.getAttrValue(spellAttrs, 'School');
      var fullName = spellName + '(' + spellType + spellLevel + ' [' + feature + '] ' + spellSchool.substring(0, 4) + ')';
      SRD5E.spellRules(
        rules, fullName, spellSchool, spellType, spellLevel, spellDescription, false
      );
      rules.defineRule('spells.' + fullName, 'features.' + feature, '=', '1');
      if(minLevel)
        rules.defineRule
          ('spells.' + fullName, levelAttr, '?', 'source>=' + minLevel);
    }
  }

};

/*
 * Defines in #rules# the rules associated with goody #name#, triggered by
 * a starred line in the character notes that matches #pattern#. #effect#
 * specifies the effect of the goody on each attribute in list #attributes#.
 * This is one of "increment" (adds #value# to the attribute), "set" (replaces
 * the value of the attribute by #value#), "lower" (decreases the value to
 * #value#), or "raise" (increases the value to #value#). #value#, if null,
 * defaults to 1; occurrences of $1, $2, ... in #value# reference capture
 * groups in #pattern#. #sections# and #notes# list the note sections
 * ("attribute", "combat", "companion", "feature", "magic", "save", or "skill")
 * and formats that show the effects of the goody on the character sheet.
 */
SRD5E.goodyRules = function(
  rules, name, pattern, effect, value, attributes, sections, notes
) {
  QuilvynRules.goodyRules
    (rules, name, pattern, effect, value, attributes, sections, notes);
};

/* Defines in #rules# the rules associated with language #name#. */
SRD5E.languageRules = function(rules, name) {
  if(!name) {
    console.log('Empty language name');
    return;
  }
  // No rules pertain to language
};

/*
 * Defines in #rules# the rules associated with path #name#, which is a
 * selection for characters belonging to #group# and tracks path level via
 * #levelAttr#. The path grants the features listed in #features#. If the path
 * grants spell slots, #spellAbility# names the ability for computing spell
 * difficulty class, and #spellSlots# lists the number of spells per level per
 * day granted.
 */
SRD5E.pathRules = function(
  rules, name, group, levelAttr, features, selectables, spellAbility,
  spellSlots, spells
) {

  if(!name) {
    console.log('Empty path name');
    return;
  }
  if(!group) {
    console.log('Bad group "' + group + '" for path ' + name);
    return;
  }
  if(!(levelAttr + '').startsWith('level')) {
    console.log('Bad level "' + levelAttr + '" for path ' + name);
    return;
  }
  if(!Array.isArray(features)) {
    console.log('Bad features list "' + features + '" for path ' + name);
    return;
  }
  if(!Array.isArray(selectables)) {
    console.log('Bad selectables list "' + selectables + '" for path ' + name);
    return;
  }
  if(spellAbility) {
    spellAbility = spellAbility.toLowerCase();
    if(!(spellAbility.charAt(0).toUpperCase() + spellAbility.substring(1) in SRD5E.ABILITIES)) {
      console.log('Bad spell ability "' + spellAbility + '" for class ' + name);
      return;
    }
  }

  var pathLevel =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '') + 'Level';

  rules.defineRule(pathLevel,
    'features.' + name, '?', null,
    levelAttr, '=', null
  );

  SRD5E.featureListRules(rules, features, group, pathLevel, false);
  SRD5E.featureListRules(rules, selectables, group, pathLevel, true);

  if(spellSlots.length > 0) {

    rules.defineRule('casterLevels.' + name, pathLevel, '=', null);
    QuilvynRules.spellSlotRules(rules, 'casterLevels.' + name, spellSlots);

    for(var i = 0; i < spellSlots.length; i++) {
      var matchInfo = spellSlots[i].match(/^(\D+)\d:/);
      if(!matchInfo) {
        console.log('Bad format for spell slot "' + spellSlots[i] + '"');
        continue;
      }
      var spellType = matchInfo[1];
      if(spellType != name)
        rules.defineRule
          ('casterLevels.' + spellType, 'casterLevels.' + name, '^=', null);
      rules.defineRule('spellAttackModifier.' + spellType,
        'casterLevels.' + spellType, '?', null,
        spellAbility + 'Modifier', '=', null,
        'proficiencyBonus', '+', null
      );
      rules.defineRule('spellDifficultyClass.' + spellType,
        'casterLevels.' + spellType, '?', null,
        spellAbility + 'Modifier', '=', '8 + source',
        'proficiencyBonus', '+', null
      );
      rules.defineRule('spellCasterLevel.' + spellType,
        'casterLevels.' + spellType, '=', null
      );
      rules.defineRule('spellModifier.' + spellType,
        'casterLevels.' + spellType, '?', null,
        spellAbility + 'Modifier', '=', null
      );
    }
  }

  if(spells.length > 0) {
    SRD5E.featureSpells
      (rules, name, group == 'Warlock' ? 'K' : group.charAt(0), pathLevel,
       spells);
  }

};

/*
 * Defines in #rules# the rules associated with path #name# that cannot be
 * derived directly from the attributes passed to pathRules.
 */
SRD5E.pathRulesExtra = function(rules, name) {

  var pathLevel =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '') +
    'Level';

  if(name == 'Life Domain') {
    rules.defineRule
      ('combatNotes.divineStrike', pathLevel, '=', 'source<14 ? 1 : 2');
    rules.defineRule('combatNotes.divineStrike.1', pathLevel, '=', '"radiant"');
  }

};

/*
 * Defines in #rules# the rules associated with race #name#, which has the list
 * of hard prerequisites #requires#. #features# and #selectables# list
 * associated features and #languages# any automatic languages. If the race
 * grants spell slots, #spellAbility# names the ability for computing spell
 * difficulty class, and #spellSlots# lists the number of spells per level per
 * day granted.
 */
SRD5E.raceRules = function(
  rules, name, requires, features, selectables, languages, spellAbility,
  spellSlots
) {

  if(!name) {
    console.log('Empty race name');
    return;
  }
  if(!Array.isArray(requires)) {
    console.log('Bad requires list "' + requires + '" for race ' + name);
    return;
  }
  if(!Array.isArray(features)) {
    console.log('Bad features list "' + features + '" for race ' + name);
    return;
  }
  if(!Array.isArray(selectables)) {
    console.log('Bad selectables list "' + selectables + '" for race ' + name);
    return;
  }
  if(!Array.isArray(languages)) {
    console.log('Bad languages list "' + languages + '" for race ' + name);
    return;
  }
  if(spellAbility) {
    spellAbility = spellAbility.toLowerCase();
    if(!(spellAbility.charAt(0).toUpperCase() + spellAbility.substring(1) in SRD5E.ABILITIES)) {
      console.log('Bad spell ability "' + spellAbility + '" for class ' + name);
      return;
    }
  }
  if(!Array.isArray(spellSlots)) {
    console.log('Bad spellSlots list "' + spellSlots + '" for race ' + name);
    return;
  }

  var i;
  var matchInfo;
  var prefix =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');
  var raceLevel = prefix + 'Level';

  rules.defineRule(raceLevel,
    'race', '?', 'source == "' + name + '"',
    'level', '=', null
  );

  if(requires.length > 0)
    QuilvynRules.prerequisiteRules
      (rules, 'validation', prefix + 'Race', raceLevel, requires);

  SRD5E.featureListRules(rules, features, name, raceLevel, false);
  SRD5E.featureListRules(rules, selectables, name, raceLevel, true);
  rules.defineSheetElement(name + ' Features', 'Feats+', null, '; ');
  rules.defineChoice('extras', prefix + 'Features');

  if(languages.length > 0) {
    rules.defineRule('languageCount', raceLevel, '=', languages.length);
    for(i = 0; i < languages.length; i++) {
      if(languages[i] != 'any')
        rules.defineRule('languages.' + languages[i], raceLevel, '=', '1');
    }
  }

  if(spellSlots.length > 0) {

    rules.defineRule('casterLevels.' + name, raceLevel, '=', null);
    QuilvynRules.spellSlotRules(rules, 'casterLevels.' + name, spellSlots);

    for(i = 0; i < spellSlots.length; i++) {
      matchInfo = spellSlots[i].match(/^(\D+)\d:/);
      if(!matchInfo) {
        console.log('Bad format for spell slot "' + spellSlots[i] + '"');
        continue;
      }
      var spellType = matchInfo[1];
      if(spellType != name)
        rules.defineRule
          ('casterLevels.' + spellType, 'casterLevels.' + name, '^=', null);
      rules.defineRule('spellAttackModifier.' + spellType,
        'casterLevels.' + spellType, '?', null,
        spellAbility + 'Modifier', '=', null,
        'proficiencyBonus', '+', null
      );
      rules.defineRule('spellDifficultyClass.' + spellType,
        'casterLevels.' + spellType, '?', null,
        spellAbility + 'Modifier', '=', '8 + source',
        'proficiencyBonus', '+', null
      );
      rules.defineRule('spellCasterLevel.' + spellType,
        'casterLevels.' + spellType, '=', null
      );
      rules.defineRule('spellModifier.' + spellType,
        'casterLevels.' + spellType, '?', null,
        spellAbility + 'Modifier', '=', null
      );
    }
  }

};

/*
 * Defines in #rules# the rules associated with race #name# that cannot be
 * derived directly from the attributes passed to raceRules.
 */
SRD5E.raceRulesExtra = function(rules, name) {

  if(name == 'Dragonborn') {
    rules.defineRule('combatNotes.dragonbornBreathWeapon',
      'level', '=', 'Math.floor((source + 9) / 5)'
    );
    rules.defineRule('combatNotes.dragonbornBreathWeapon.1',
      'features.Dragonborn Breath Weapon', '?', null,
      '', '=', '"5\'x30\' line"',
      'features.Gold Draconic Ancestry', '=', '"15\' cone"',
      'features.Green Draconic Ancestry', '=', '"15\' cone"',
      'features.Red Draconic Ancestry', '=', '"15\' cone"',
      'features.Silver Draconic Ancestry', '=', '"15\' cone"',
      'features.White Draconic Ancestry', '=', '"15\' cone"'
    );
    rules.defineRule('combatNotes.dragonbornBreathWeapon.2',
      'features.Dragonborn Breath Weapon', '?', null,
      '', '=', '"fire"',
      'features.Black Draconic Ancestry', '=', '"acid"',
      'features.Blue Draconic Ancestry', '=', '"lightning"',
      'features.Bronze Draconic Ancestry', '=', '"lightning"',
      'features.Copper Draconic Ancestry', '=', '"acid"',
      'features.Green Draconic Ancestry', '=', '"poison"',
      'features.Silver Draconic Ancestry', '=', '"cold"',
      'features.White Draconic Ancestry', '=', '"cold"'
    );
    rules.defineRule('combatNotes.dragonbornBreathWeapon.3',
      'features.Dragonborn Breath Weapon', '?', null,
      'constitutionModifier', '=', '8 + source',
      'proficiencyBonus', '+', null
    );
    rules.defineRule('combatNotes.dragonbornBreathWeapon.4',
      'combatNotes.dragonbornBreathWeapon.2', '=', 'source.match(/cold|poison/) ? "Con" : "Dex"'
    );
    rules.defineRule('saveNotes.dragonbornDamageResistance',
      'combatNotes.dragonbornBreathWeapon.2', '=', null
    );
    rules.defineRule('selectableFeatureCount.Dragonborn',
      'race', '=', 'source == "Dragonborn" ? 1 : null'
    );
  } else if(name.match(/Dwarf/)) {
    rules.defineRule
      ('abilityNotes.armorSpeedAdjustment', 'abilityNotes.steady', '^', '0');
    rules.defineRule('combatNotes.dwarvenToughness', 'level', '=', null);
  } else if(name == 'High Elf') {
    rules.defineRule('casterLevels.W', 'magicNotes.elfCantrip', '^=', '1');
    rules.defineRule('spellSlots.W0', 'magicNotes.elfCantrip', '+=', '1');
  } else if(name == 'Tiefling') {
    rules.defineRule('magicNotes.infernalLegacy.1',
      'features.Infernal Legacy', '?', null,
      'level', '=',
        'source<3 ? "" : ' +
        'source<5 ? ", cast <i>Hellish Rebuke</i> 1/long rest" : ' +
        '", cast <i>Hellish Rebuke</i> and <i>Darkness</i> 1/long rest"'
    );
    SRD5E.featureSpells(rules, 'Infernal Legacy', 'K', 'level',
      ['Thaumaturgy',
       '3:Hellish Rebuke',
       '5:Darkness']
    );
    rules.defineRule('spellCasterLevel.Infernal Legacy',
      'features.Infernal Legacy', '?', null,
      'level', '=', null
    );
    rules.defineRule('casterLevels.K',
      'spellCasterLevel.Infernal Legacy', '^=', null
    );
  }

};

/*
 * Defines in #rules# the rules associated with magic school #name#, which
 * grants the list of #features#.
 */
SRD5E.schoolRules = function(rules, name) {
  if(!name) {
    console.log('Empty school name');
    return;
  }
  // No rules pertain to schools
};

/*
 * Defines in #rules# the rules associated with shield #name#, which adds #ac#
 * to the character's armor class.
 */
SRD5E.shieldRules = function(rules, name, ac) {

  if(!name) {
    console.log('Empty shield name');
    return;
  }
  if(typeof ac != 'number') {
    console.log('Bad ac "' + ac + '" for shield ' + name);
    return;
  }

  if(rules.shieldStats == null) {
    rules.shieldStats = {
      ac:{},
    };
  }
  rules.shieldStats.ac[name] = ac;

  rules.defineRule
    ('armorClass', 'shield', '+', QuilvynUtils.dictLit(rules.shieldStats.ac) + '[source]');

};

/*
 * Defines in #rules# the rules associated with skill #name#, associated with
 * #ability# (one of 'strength', 'intelligence', etc.).
 * #classes# lists any classes that are proficient in this skill.
 */
SRD5E.skillRules = function(rules, name, ability, classes) {

  if(!name) {
    console.log('Empty skill name');
    return;
  }
  if(ability) {
    ability = ability.toLowerCase();
    if(!(ability.charAt(0).toUpperCase() + ability.substring(1) in SRD5E.ABILITIES)) {
      console.log('Bad ability "' + ability + '" for skill ' + name);
      return;
    }
  }
  if(!Array.isArray(classes)) {
    console.log('Bad classes list "' + classes + '" for skill ' + name);
    return;
  }

  for(var i = 0; i < classes.length; i++) {
    rules.defineRule
      ('skillProficiency.' + name, 'levels.' + classes[i], '=', '1');
  }
  rules.defineRule('skillProficiency.' + name,
    'skillsChosen.' + name, '=', 'source ? 1 : null'
  );
  rules.defineRule('skillBonus.' + name,
    'skillProficiency.' + name, '?', null,
    'proficiencyBonus', '=', null
  );
  rules.defineChoice
      ('notes', 'skills.' + name + ':(' + ability.substring(0, 3) + ') %V');
  rules.defineRule('skills.' + name,
    ability + 'Modifier', '=', null,
    'skillBonus.' + name, '+', null
  );

};

/*
 * Defines in #rules# the rules associated with spell #name#, which is from
 * magic school #school#. #casterGroup# and #level# are used to compute any
 * saving throw value required by the spell. #description# is a verbose
 * description of the spell's effects.
 */
SRD5E.spellRules = function(
  rules, name, school, casterGroup, level, description, domainSpell
) {

  if(!name) {
    console.log('Empty spell name');
    return;
  }
  if(school && !(school in rules.getChoices('schools'))) {
    console.log('Bad school "' + school + '" for spell ' + name);
    return;
  }
  if(!casterGroup.match(/^[A-Z][A-Za-z]*$/)) {
    console.log('Bad caster group "' + casterGroup + '" for spell ' + name);
    return;
  }
  if(typeof level != 'number') {
    console.log('Bad level "' + level + '" for spell ' + name);
    return;
  }
  if(!description)
    description = '';

  description =
    description.replaceAll('?level?', 'spellCasterLevel.' + casterGroup)
               .replaceAll('?modifier?', 'spellModifier.' + casterGroup);
  rules.defineChoice('notes', 'spells.' + name + ':' + description);

};

/* Defines in #rules# the rules associated with tool #name# of type #type#. */
SRD5E.toolRules = function(rules, name, type) {
  if(!name) {
    console.log('Empty tool name');
    return;
  }
  rules.defineRule('toolProficiency.' + name,
    'toolsChosen.' + name, '=', 'source ? 1 : null'
  );
};

/*
 * Defines in #rules# the rules associated with weapon #name#, which requires a
 * #category# proficiency level to use effectively and has weapon properties
 * #properties#. The weapon does #damage# HP on a successful attack. If
 * specified, the weapon can be used as a ranged weapon with a range increment
 * of #range# feet.
 */
SRD5E.weaponRules = function(rules, name, category, properties, damage, range) {

  if(!name) {
    console.log('Bad name for weapon  "' + name + '"');
    return;
  }
  if(category == null ||
     !(category + '').match(/^([0-2]|unarmed|simple|martial)$/i)) {
    console.log('Bad category "' + category + '" for weapon ' + name);
    return;
  }
  if(!Array.isArray(properties)) {
    console.log('Bad properties list "' + properties + '" for weapon ' + name);
    return;
  }
  var matchInfo = (damage + '').match(/^(((\d*d)?\d+)([\-+]\d+)?)$/);
  if(!matchInfo) {
    console.log('Bad damage "' + damage + '" for weapon ' + name);
    return;
  }
  if(range && !(range + '').match(/^\d+\/\d+$/)) {
    console.log('Bad range "' + range + '" for weapon ' + name);
  }

  if((category + '').match(/^[0-2]$/))
    ; // empty
  else if(category.match(/^unarmed$/i))
    category = 0;
  else if(category.match(/^simple$/i))
    category = 1;
  else if(category.match(/^martial$/i))
    category = 2;

  var isFinessed = properties.includes('finesse') || properties.includes('Fi');
  var isRanged = properties.includes('ranged') || properties.includes('R');
  var is2h = properties.includes('two-handed') || properties.includes('2h');
  var isMonk = name == 'Shortsword' || 
               (category <= 1 && !is2h &&
                !(properties.includes('heavy') || properties.includes('He')));

  damage = matchInfo[1];
  var weaponName = 'weapons.' + name;
  var format = '%V (%1 %2%3' + (range ? " R%4" : '') + ')';

  if(damage.startsWith('d'))
    damage = '1' + damage;

  rules.defineChoice('notes',
    weaponName + ':' + format,
    'sanityNotes.nonproficientWeaponPenalty.' + name + ':%V attack'
  );

  if(category > 0) {
    rules.defineRule('sanityNotes.nonproficientWeaponPenalty.' + name,
      weaponName, '?', null,
      'proficiencyBonus', '=', '-source',
      'weaponProficiency.Martial', '^', '0',
      'weaponProficiency.' + name, '^', '0'
    );
    if(category == 1) {
      rules.defineRule('sanityNotes.nonproficientWeaponPenalty.' + name,
        'weaponProficiency.Simple', '^', '0'
      );
    }
  }
  rules.defineRule('weaponProficiencyBonus.' + name,
    weaponName, '?', null,
    'proficiencyBonus', '=', null,
    'sanityNotes.nonproficientWeaponPenalty.' + name, 'v', 'source == 0 ? null : 0'
  );
  rules.defineRule('attackBonus.' + name,
    weaponName, '=', '0',
    isFinessed ? 'betterAttackAdjustment' :
      isRanged ? 'combatNotes.dexterityAttackAdjustment' :
                 'combatNotes.strengthAttackAdjustment', '+', null,
    isRanged ? 'attackBonus.Ranged' : 'attackBonus.Melee', '+', null,
    'weaponProficiencyBonus.' + name, '+', null,
    'weaponAttackAdjustment.' + name, '+', null
  );
  rules.defineRule('damageBonus.' + name,
    weaponName, '=', '0',
    isFinessed ? 'betterDamageAdjustment' :
      isRanged ? 'combatNotes.dexterityDamageAdjustment' :
                 'combatNotes.strengthDamageAdjustment', '+', null,
    'weaponDamageAdjustment.' + name, '+', null
  );
  if(!range) {
    rules.defineRule('attackBonus.' + name, 'monkMeleeAttackBonus', '+', null);
    rules.defineRule('damageBonus.' + name, 'monkMeleeDamageBonus', '+', null);
  }

  rules.defineRule(weaponName + '.1',
    'attackBonus.' + name, '=', 'source >= 0 ? "+" + source : source'
  );
  rules.defineRule(weaponName + '.2', weaponName, '=', '"' + damage + '"');
  if(properties.includes('Ve') || properties.includes('versatile'))
    rules.defineRule(weaponName + '.2',
      'shield', '=', 'source == "None" ? SRD5E.VERSATILE_WEAPON_DAMAGE["' + damage + '"] : null'
    );
  rules.defineRule(weaponName + '.3',
    'damageBonus.' + name, '=', 'source > 0 ? "+" + source : source == 0 ? "" : source'
  );
  if(range) {
    rules.defineRule('range.' + name, weaponName, '=', '"' + range + '"');
    // TODO Any need for weaponRangeAdjustment.name?
    rules.defineRule(weaponName + '.4', 'range.' + name, '=', null);
  }
  if(is2h)
    rules.defineRule
      ('features.Two-Handed Weapon With Shield', weaponName, '=', '1');

  rules.defineRule('weaponProficiency.' + name,
    'weaponsChosen.' + name, '=', 'source ? 1 : null'
  );
  if(isMonk)
    rules.defineRule(weaponName + '.2', 'monkMeleeDieBonus', '^', null);

};

/*
 * Defines in #rules# the rules associated with with the list #features#. Rules
 * add each feature to #setName# if the value of #levelAttr# is at least equal
 * to the value required for the feature. If #selectable# is true, the user is
 * allowed to select these features for the character, rather than having them
 * assigned automatically.
 */
SRD5E.featureListRules = function(
  rules, features, setName, levelAttr, selectable
) {
  QuilvynRules.featureListRules
    (rules, features, setName, levelAttr, selectable);
  setName = setName.charAt(0).toLowerCase() + setName.substring(1).replaceAll(' ', '') + 'Features';
  for(var i = 0; i < features.length; i++) {
    var feature = features[i].replace(/^(.*\?\s*)?\d+:/, '');
    var matchInfo = feature.match(/([A-Z]\w*)\sProficiency\s\((.*)\)$/);
    if(!matchInfo)
      continue;
    var group = matchInfo[1].toLowerCase();
    var elements = matchInfo[2].split('/');
    for(var j = 0; j < elements.length; j++) {
      matchInfo = elements[j].match(/^Choose\s+(\d+)\s+from/i);
      if(matchInfo) {
        rules.defineRule
          (group + 'ChoiceCount', setName + '.' + feature, '+=', matchInfo[1]);
      } else {
        rules.defineRule(group + 'Proficiency.' + elements[j],
          setName + '.' + feature, '=', '1'
        );
      }
    }
  }
};

/*
 * Returns the dictionary of attribute formats associated with character sheet
 * format #viewer# in #rules#.
 */
SRD5E.getFormats = function(rules, viewer) {
  var format;
  var formats = rules.getChoices('notes');
  var result = {};
  var matchInfo;
  if(viewer == 'Collected Notes') {
    for(format in formats) {
      result[format] = formats[format];
      if((matchInfo = format.match(/Notes\.(.*)$/)) != null) {
        var feature = matchInfo[1];
        feature = feature.charAt(0).toUpperCase() + feature.substring(1).replace(/([A-Z(])/g, ' $1');
        formats['features.' + feature] = formats[format];
      }
    }
  } else if(viewer == 'Compact') {
    for(format in formats) {
      if(!format.startsWith('spells.'))
        result[format] = formats[format];
    }
  } else {
    result = formats;
  }
  return result;
};

/* Returns an ObjectViewer loaded with the default character sheet format. */
SRD5E.createViewers = function(rules, viewers) {
  for(var i = 0; i < viewers.length; i++) {
    var name = viewers[i];
    var viewer = new ObjectViewer();
    if(name == 'Compact') {
      viewer.addElements(
        {name: '_top', separator: '\n'},
          {name: 'Section 1', within: '_top', separator: '; '},
            {name: 'Identity', within: 'Section 1', format: '%V',
             separator: ''},
              {name: 'Name', within: 'Identity', format: '<b>%V</b>'},
              {name: 'Gender', within: 'Identity', format: ' -- <b>%V</b>'},
              {name: 'Race', within: 'Identity', format: ' <b>%V</b>'},
              {name: 'Levels', within: 'Identity', format: ' <b>%V</b>',
               separator: '/'},
            {name: 'Hit Points', within: 'Section 1', format: '<b>HP</b> %V'},
            {name: 'Initiative', within: 'Section 1', format: '<b>Initiative</b> %V'},
            {name: 'Speed', within: 'Section 1', format: '<b>Speed</b> %V'},
            {name: 'Armor Class', within: 'Section 1', format: '<b>AC</b> %V'},
            {name: 'Weapons', within: 'Section 1', format: '<b>%N</b> %V',
             separator: '/'},
            {name: 'Alignment', within: 'Section 1', format: '<b>Ali</b> %V'},
            {name: 'Save', within: 'Section 1', separator: '/'},
            {name: 'Resistance', within: 'Section 1', separator: '/'},
            {name: 'Abilities', within: 'Section 1',
             format: '<b>Str/Int/Wis/Dex/Con/Cha</b> %V', separator: '/'},
              {name: 'Strength', within: 'Abilities', format: '%V'},
              {name: 'Dexterity', within: 'Abilities', format: '%V'},
              {name: 'Constitution', within: 'Abilities', format: '%V'},
              {name: 'Intelligence', within: 'Abilities', format: '%V'},
              {name: 'Wisdom', within: 'Abilities', format: '%V'},
              {name: 'Charisma', within: 'Abilities', format: '%V'},
          {name: 'Section 2', within: '_top', separator: '; '},
            {name: 'Skill Modifier', within: 'Section 2', separator: '/'},
            {name: 'Feats', within: 'Section 2', separator: '/'},
            {name: 'Languages', within: 'Section 2', separator: '/'},
            {name: 'Spells', within: 'Section 2', separator: '/'},
            {name: 'Spell Difficulty Class', within: 'Section 2',
             separator: '/'},
            {name: 'Domains', within: 'Section 2', separator: '/'},
            {name: 'Notes', within: 'Section 2'},
            {name: 'Hidden Notes', within: 'Section 2', format: '%V'}
      );
    } else if(name == 'Collected Notes' || name == 'Standard') {
      var innerSep = null;
      var listSep = '; ';
      var noteSep = listSep;
      noteSep = '\n';
      var outerSep = name == '\n';
      viewer.addElements(
        {name: '_top', borders: 1, separator: '\n'},
        {name: 'Header', within: '_top', separator: ''},
          {name: 'Image Url', within: 'Header', format: '<img src="%V" alt="No Image" style="height:75px; vertical-align:middle"/>&nbsp;&nbsp;'},
          {name: 'Name', within: 'Header', format: '<b>%V</b> &mdash;'},
          {name: 'Gender', within: 'Header', format: ' <b>%V</b>'},
          {name: 'Race', within: 'Header', format: ' <b>%V</b>'},
          {name: 'Levels', within: 'Header', format: ' <b>%V</b>',
           separator: '/'},
        {name: 'Attributes', within: '_top', separator: outerSep},
          {name: 'Abilities', within: 'Attributes', separator: innerSep},
            {name: 'Strength', within: 'Abilities'},
            {name: 'Dexterity', within: 'Abilities'},
            {name: 'Constitution', within: 'Abilities'},
            {name: 'Intelligence', within: 'Abilities'},
            {name: 'Wisdom', within: 'Abilities'},
            {name: 'Charisma', within: 'Abilities'},
          {name: 'Description', within: 'Attributes', separator: innerSep},
            {name: 'Background', within: 'Description'},
            {name: 'Alignment', within: 'Description'},
            {name: 'DeityInfo', within: 'Description', separator: ''},
              {name: 'Deity', within: 'DeityInfo'},
              {name: 'Deity Alignment', within: 'DeityInfo', format:' (%V)'},
            {name: 'Origin', within: 'Description'},
            {name: 'Player', within: 'Description'},
          {name: 'AbilityStats', within: 'Attributes', separator: innerSep},
            {name: 'ExperienceInfo', within: 'AbilityStats', separator: ''},
              {name: 'Experience', within: 'ExperienceInfo'},
              {name: 'Experience Needed', within: 'ExperienceInfo',
               format: '/%V'},
            {name: 'Level', within: 'AbilityStats'},
            {name: 'Speed', within: 'AbilityStats'},
            {name: 'LoadInfo', within: 'AbilityStats', separator: ''},
              {name: 'Carry', within: 'LoadInfo',
               format: '<b>Carry/Lift:</b> %V'},
              {name: 'Lift', within: 'LoadInfo', format: '/%V'}
      );
      if(name != 'Collected Notes') {
        viewer.addElements(
          {name: 'Ability Notes', within: 'Attributes', separator: noteSep}
        );
      }
      viewer.addElements(
        {name: 'FeaturesAndSkills', within: '_top', separator: outerSep,
         format: '<b>Features/Skills</b><br/>%V'},
          {name: 'Proficiency Bonus', within: 'FeaturesAndSkills'},
          {name: 'FeaturePart', within: 'FeaturesAndSkills', separator: '\n'},
            {name: 'FeatStats', within: 'FeaturePart', separator: innerSep},
              {name: 'Feat Count', within: 'FeatStats', separator: listSep},
              {name: 'Selectable Feature Count', within: 'FeatStats',
               separator: listSep},
            {name: 'FeatLists', within: 'FeaturePart', separator: innerSep},
              {name: 'FeatList', within: 'FeatLists', separator: ''},
                {name: 'Feats', within: 'FeatLists', separator: listSep}
      );
      if(name != 'Collected Notes') {
        viewer.addElements(
            {name: 'Feature Notes', within: 'FeaturePart', separator: noteSep}
        );
      }
      viewer.addElements(
          {name: 'Skill Proficiency', within: 'FeaturesAndSkills', separator: listSep},
          {name: 'Skills', within: 'FeaturesAndSkills', columns: '3LE', separator: null},
          {name: 'Tool Proficiency', within: 'FeaturesAndSkills', separator: listSep},
          {name: 'Languages', within: 'FeaturesAndSkills', separator: listSep}
      );
      if(name != 'Collected Notes') {
        viewer.addElements(
            {name: 'Skill Notes', within: 'FeaturesAndSkills', separator:noteSep}
        );
      }
      viewer.addElements(
        {name: 'Combat', within: '_top', separator: outerSep,
         format: '<b>Combat</b><br/>%V'},
          {name: 'CombatPart', within: 'Combat', separator: '\n'},
            {name: 'CombatStats', within: 'CombatPart', separator: innerSep},
              {name: 'Hit Points', within: 'CombatStats'},
              {name: 'Initiative', within: 'CombatStats'},
              {name: 'Armor Class', within: 'CombatStats'},
              {name: 'Attacks Per Round', within: 'CombatStats'},
            {name: 'CombatProfs', within: 'CombatPart', separator: innerSep},
              {name: 'Armor Proficiency', within: 'CombatProfs', separator: listSep},
              {name: 'Weapon Proficiency', within: 'CombatProfs', separator: listSep},
            {name: 'Gear', within: 'CombatPart', separator: innerSep},
              {name: 'Armor', within: 'Gear'},
              {name: 'Shield', within: 'Gear'},
              {name: 'Weapons', within: 'Gear', separator: listSep}
      );
      if(name != 'Collected Notes') {
        viewer.addElements(
            {name: 'Combat Notes', within: 'CombatPart', separator: noteSep}
        );
      }
      viewer.addElements(
          {name: 'SavePart', within: 'Combat', separator: '\n'},
            {name: 'Save Proficiency', within: 'SavePart', separator: listSep},
            {name: 'Save', within: 'SavePart', separator: listSep}
      );
      if(name != 'Collected Notes') {
        viewer.addElements(
            {name: 'Save Notes', within: 'SavePart', separator: noteSep}
        );
      }
      viewer.addElements(
        {name: 'Magic', within: '_top', separator: outerSep,
         format: '<b>Magic</b><br/>%V'},
          {name: 'SpellPart', within: 'Magic', separator: '\n'},
            {name: 'SpellStats', within: 'SpellPart', separator: innerSep},
              {name: 'Spells Known', within: 'SpellStats', separator: listSep},
              {name: 'Spell Slots', within: 'SpellStats', separator:listSep},
              {name: 'Spell Attack Modifier', within: 'SpellStats',
               format: '<b>Attack</b>: %V', separator: listSep},
              {name: 'Spell Difficulty Class', within: 'SpellStats',
               format: '<b>Spell DC</b>: %V', separator: listSep},
          {name: 'Spells', within: 'Magic', columns: '1L', separator: null}
      );
      if(name != 'Collected Notes') {
        viewer.addElements(
          {name: 'Magic Notes', within: 'Magic', separator: noteSep}
        );
      }
      viewer.addElements(
        {name: 'Notes Area', within: '_top', separator: outerSep,
         format: '<b>Notes</b><br/>%V'},
          {name: 'NotesPart', within: 'Notes Area', separator: '\n'}
      );
      if(name == 'Collected Notes') {
        viewer.addElements(
          {name: 'AllNotes', within: 'NotesPart', separator: '\n', columns: "1L"},
            {name: 'Ability Notes', within: 'AllNotes', separator: null, columns: "1L", format: "%V"},
            {name: 'Feature Notes', within: 'AllNotes', separator: null, columns: "1L", format: "%V"},
            {name: 'Skill Notes', within: 'AllNotes', separator: null, columns: "1L", format: "%V"},
            {name: 'Combat Notes', within: 'AllNotes', separator: null, columns: "1L", format: "%V"},
            {name: 'Save Notes', within: 'AllNotes', separator: null, columns: "1L", format: "%V"},
            {name: 'Magic Notes', within: 'AllNotes', separator: null, columns: "1L", format: "%V"}
        );
      }
      viewer.addElements(
            {name: 'Notes', within: 'NotesPart', format: '%V'},
            {name: 'Hidden Notes', within: 'NotesPart', format: '%V'},
          {name: 'ValidationPart', within: 'Notes Area', separator: '\n'},
            {name: 'Sanity Notes', within: 'ValidationPart', separator:noteSep},
            {name: 'Validation Notes', within: 'ValidationPart',
             separator: noteSep}
      );
    } else
      continue;
    rules.defineViewer(name, viewer);
  }
};

/*
 * Returns the list of editing elements needed by #choiceRules# to add a #type#
 * item to #rules#.
 */
SRD5E.choiceEditorElements = function(rules, type) {
  var result = [];
  var sections =
    ['ability', 'combat', 'companion', 'feature', 'magic', 'skill'];
  var zeroToTen = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  if(type == 'Alignment')
    result.push(
      // empty
    );
  else if(type == 'Armor') {
    var tenToEighteen = [10, 11, 12, 13, 14, 15, 16, 17, 18];
    result.push(
      ['AC', 'AC Bonus', 'select-one', [0, 1, 2, 3, 4, 5]],
      ['Bulky', 'Bulky', 'checkbox', ['']],
      ['Dex', 'Max Dex', 'select-one', zeroToTen],
      ['Str', 'Min Str', 'select-one', tenToEighteen],
      ['Weight', 'Weight', 'select-one', ['None', 'Light', 'Medium', 'Heavy']]
    );
  } else if(type == 'Background') {
    result.push(
      ['Equipment', 'Equipment', 'text', [40]],
      ['Features', 'Features', 'text', [40]],
      ['Languages', 'Languages', 'text', [40]]
    );
  } else if(type == 'Class') {
    result.push(
      ['Require', 'Prerequisites', 'text', [40]],
      ['HitDie', 'Hit Die', 'select-one', ['d4', 'd6', 'd8', 'd10', 'd12']],
      ['Features', 'Features', 'text', [40]],
      ['Selectables', 'Selectable Features', 'text', [40]],
      ['Languages', 'Languages', 'text', [30]],
      ['CasterLevelArcane', 'Arcane Level', 'text', [10]],
      ['CasterLevelDivine', 'Divine Level', 'text', [10]],
      ['SpellAbility', 'Spell Ability', 'select-one', ['charisma', 'constitution', 'dexterity', 'intelligence', 'strength', 'wisdom']],
      ['SpellSlots', 'Spells Slots', 'text', [40]],
      ['Spells', 'Spells', 'text', [40]]
    );
  } else if(type == 'Deity')
    result.push(
      ['Alignment', 'Alignment', 'select-one', QuilvynUtils.getKeys(rules.getChoices('alignments'))],
      ['Domain', 'Domains', 'text', [30]],
      ['Sphere', 'Sphere', 'text', [15]]
    );
  else if(type == 'Feat')
    result.push(
      ['Require', 'Prerequisites', 'text', [40]],
      ['Imply', 'Implies', 'text', [40]],
      ['Type', 'Types', 'text', [20]]
    );
  else if(type == 'Feature') {
    result.push(
      ['Section', 'Section', 'select-one', sections],
      ['Note', 'Note', 'text', [60]]
    );
  } else if(type == 'Goody') {
    var effects = ['add', 'lower', 'raise', 'set'];
    result.push(
      ['Pattern', 'Pattern', 'text', [40]],
      ['Effect', 'Effect', 'select-one', effects],
      ['Value', 'Value', 'text', [20]],
      ['Section', 'Section', 'select-one', sections],
      ['Note', 'Note', 'text', [60]]
    );
  } else if(type == 'Language')
    result.push(
      // empty
    );
  else if(type == 'Path')
    result.push(
      ['Group', 'Group', 'text', [15]],
      ['Level', 'Level', 'text', [15]],
      ['Features', 'Features', 'text', [40]],
      ['Selectables', 'Features', 'text', [40]],
      ['SpellAbility', 'Spell Ability', 'select-one', ['charisma', 'constitution', 'dexterity', 'intelligence', 'strength', 'wisdom']],
      ['SpellSlots', 'Spells Slots', 'text', [40]],
      ['Spells', 'Spells', 'text', [40]]
    );
  else if(type == 'Race')
    result.push(
      ['Require', 'Prerequisites', 'text', [40]],
      ['Features', 'Features', 'text', [60]],
      ['Selectables', 'Selectables', 'text', [60]],
      ['Languages', 'Languages', 'text', [30]],
      ['SpellAbility', 'Spell Ability', 'select-one', ['charisma', 'constitution', 'dexterity', 'intelligence', 'strength', 'wisdom']],
      ['SpellSlots', 'Spells Slots', 'text', [40]],
      ['Spells', 'Spells', 'text', [80]]
    );
  else if(type == 'School')
    result.push(
      ['Features', 'Features', 'text', [40]]
    );
  else if(type == 'Shield')
    result.push(
      ['AC', 'Armor Class', 'select-one', [1, 2, 3, 4, 5]]
    );
  else if(type == 'Skill')
    result.push(
      ['Ability', 'Ability', 'select-one', ['charisma', 'constitution', 'dexterity', 'intelligence', 'strength', 'wisdom']],
      ['Class', 'Class Skill', 'text', [30]]
    );
  else if(type == 'Spell') {
    var zeroToNine = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    result.push(
      ['School', 'School', 'select-one', QuilvynUtils.getKeys(rules.getChoices('schools'))],
      ['Group', 'Caster Group', 'text', [15]],
      ['Level', 'Level', 'select-one', zeroToNine],
      ['Description', 'Description', 'text', [60]]
    );
  } else if(type == 'Tool')
    result.push(
      ['Type', 'Type', 'text', [20]]
    );
  else if(type == 'Weapon') {
    var zeroToOneFifty =
     [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150];
    result.push(
      ['Category', 'Category', 'select-one', ['Simple', 'Martial']],
      ['Property', 'Property', 'select-one', ['Unarmed', 'Light', 'One-Handed', 'Two-Handed', 'Ranged']],
      ['Damage', 'Damage', 'select-one', QuilvynUtils.getKeys(SRD5E.VERSATILE_WEAPON_DAMAGE)],
      ['Range', 'Range in Feet', 'select-one', zeroToOneFifty]
    );
  }
  return result;
};

/* Returns the elements in a basic 5E character editor. */
SRD5E.initialEditorElements = function() {
  var abilityChoices = [
    3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18
  ];
  var editorElements = [
    ['name', 'Name', 'text', [20]],
    ['imageUrl', 'Image URL', 'text', [20]],
    ['strength', 'Strength', 'select-one', abilityChoices],
    ['dexterity', 'Dexterity', 'select-one', abilityChoices],
    ['constitution', 'Constitution', 'select-one', abilityChoices],
    ['intelligence', 'Intelligence', 'select-one', abilityChoices],
    ['wisdom', 'Wisdom', 'select-one', abilityChoices],
    ['charisma', 'Charisma', 'select-one', abilityChoices],
    ['gender', 'Gender', 'text', [10]],
    ['race', 'Race', 'select-one', 'races'],
    ['levels', 'Class Levels', 'bag', 'levels'],
    ['background', 'Background', 'select-one', 'backgrounds'],
    ['alignment', 'Alignment', 'select-one', 'alignments'],
    ['deity', 'Deity', 'select-one', 'deities'],
    ['origin', 'Origin', 'text', [20]],
    ['player', 'Player', 'text', [20]],
    ['experience', 'Experience', 'text', [8, '(\\+?\\d+)']],
    ['feats', 'Feats', 'setbag', 'feats'],
    ['selectableFeatures', 'Selectable Features', 'set', 'selectableFeatures'],
    ['skillsChosen', 'Skills', 'set', 'skills'],
    ['toolsChosen', 'Tools', 'set', 'tools'],
    ['languages', 'Languages', 'set', 'languages'],
    ['hitPoints', 'Hit Points', 'text', [4, '(\\+?\\d+)']],
    ['armor', 'Armor', 'select-one', 'armors'],
    ['shield', 'Shield', 'select-one', 'shields'],
    ['weapons', 'Weapons', 'setbag', 'weapons'],
    ['weaponsChosen', 'Proficiency', 'set', 'weapons'],
    ['spells', 'Spells', 'fset', 'spells'],
    ['notes', 'Notes', 'textarea', [40,10]],
    ['hiddenNotes', 'Hidden Notes', 'textarea', [40,10]]
  ];
  return editorElements;
};

/* Returns a random name for a character of race #race#. */
SRD5E.randomName = function(race) {

  /* Return a random character from #string#. */
  function randomChar(string) {
    return string.charAt(QuilvynUtils.random(0, string.length - 1));
  }

  if(race == null)
    race = 'Human';
  else if(race.match(/Dragonborn/))
    race = 'Dragonborn';
  else if(race == 'Half-Elf')
    race = QuilvynUtils.random(0, 99) < 50 ? 'Elf' : 'Human';
  else if(race.match(/Dwarf/))
    race = 'Dwarf';
  else if(race.match(/Elf/))
    race = 'Elf';
  else if(race.match(/Gnome/))
    race = 'Gnome';
  else if(race.match(/Halfling/))
    race = 'Halfling';
  else if(race.match(/Orc/))
    race = 'Orc';
  else if(race.match(/Tiefling/))
    race = 'Tiefling';
  else
    race = 'Human';

  var clusters = {
    B:'lr', C:'hlr', D:'r', F:'lr', G:'lnr', K:'lnr', P:'lr', S:'chklt', T:'hr',
    W:'h',
    c:'hkt', l:'cfkmnptv', m: 'p', n:'cgkt', r: 'fv', s: 'kpt', t: 'h'
  };
  var consonants = {
    'Dragonborn':'bcdfghjklmnprstvwz', 'Dwarf':'dgkmnprst', 'Elf':'fhlmnpqswy',
    'Gnome':'bdghjlmnprstw', 'Halfling':'bdfghlmnprst',
    'Human': 'bcdfghjklmnprstvwz', 'Orc': 'dgjkprtvxz',
    'Tiefling': 'bcdfghjklmnprstvwz'
  }[race];
  var endConsonant = '';
  var leading = 'ghjqvwy';
  var vowels = {
    'Dragonborn':'aeiou', 'Dwarf':'aeiou', 'Elf':'aeioy', 'Gnome':'aeiou',
    'Halfling':'aeiou', 'Human':'aeiou', 'Orc':'aou', 'Tiefling':'aeiou'
  }[race];
  var diphthongs = {a:'wy', e:'aei', o: 'aiouy', u: 'ae'};
  var syllables = QuilvynUtils.random(0, 99);
  syllables = syllables < 50 ? 2 :
              syllables < 75 ? 3 :
              syllables < 90 ? 4 :
              syllables < 95 ? 5 :
              syllables < 99 ? 6 : 7;
  var result = '';
  var vowel;

  for(var i = 0; i < syllables; i++) {
    if(QuilvynUtils.random(0, 99) <= 80) {
      endConsonant = randomChar(consonants).toUpperCase();
      if(clusters[endConsonant] != null && QuilvynUtils.random(0, 99) < 15)
        endConsonant += randomChar(clusters[endConsonant]);
      result += endConsonant;
      if(endConsonant == 'Q')
        result += 'u';
    }
    else if(endConsonant.length == 1 && QuilvynUtils.random(0, 99) < 10) {
      result += endConsonant;
      endConsonant += endConsonant;
    }
    vowel = randomChar(vowels);
    if(endConsonant.length > 0 && diphthongs[vowel] != null &&
       QuilvynUtils.random(0, 99) < 15)
      vowel += randomChar(diphthongs[vowel]);
    result += vowel;
    endConsonant = '';
    if(QuilvynUtils.random(0, 99) <= 60) {
      while(leading.indexOf((endConsonant = randomChar(consonants))) >= 0)
        ; /* empty */
      if(clusters[endConsonant] != null && QuilvynUtils.random(0, 99) < 15)
        endConsonant += randomChar(clusters[endConsonant]);
      result += endConsonant;
    }
  }
  return result.substring(0, 1).toUpperCase() +
         result.substring(1).toLowerCase();

};

/* Sets #attributes#'s #attribute# attribute to a random value. */
SRD5E.randomizeOneAttribute = function(attributes, attribute) {

  /*
   * Randomly selects #howMany# elements of the array #choices#, prepends
   * #prefix# to each, and sets those attributes in #attributes# to #value#.
   */
  function pickAttrs(attributes, prefix, choices, howMany, value) {
    var remaining = [].concat(choices);
    for(var i = 0; i < howMany && remaining.length > 0; i++) {
      var which = QuilvynUtils.random(0, remaining.length - 1);
      attributes[prefix + remaining[which]] = value;
      remaining = remaining.slice(0, which).concat(remaining.slice(which + 1));
    }
  }

  var attr;
  var attrs;
  var choices;
  var count;
  var howMany;
  var i,j,k;
  var matchInfo;
  var notes;
  var pat;
  var pieces;
  var type;
  var which;

  if(attribute == 'armor') {
    var armors = this.getChoices('armors');
    attrs = this.applyRules(attributes);
    choices = [];
    for(attr in armors) {
      var weight = QuilvynUtils.getAttrValue(armors[attr], 'Weight');
      if(weight == null)
        weight = 0;
      else if((weight + '').match(/light/i))
        weight = 1;
      else if((weight + '').match(/medium/i))
        weight = 2;
      else if((weight + '').match(/heavy/i))
        weight = 3;
      if(weight == 0 ||
         attrs['armorProficiency.Heavy'] ||
         weight <= 2 && attrs['armorProficiency.Medium'] ||
         weight == 1 && attrs['armorProficiency.Light'] ||
         attrs['armorProficiency.' + attr])
        choices.push(attr);
    }
    attributes['armor'] = choices[QuilvynUtils.random(0, choices.length - 1)];
  } else if(attribute == 'boosts') {
    attrs = this.applyRules(attributes);
    notes = this.getChoices('notes');
    howMany = attrs.abilityBoostChoiceCount || 0;
    var potentialBoosts = {};
    for(attr in SRD5E.ABILITIES)
      potentialBoosts[attr.toLowerCase()] = 0;
    potentialBoosts.any = 0;
    for(attr in attrs) {
      if(!notes[attr] ||
         (matchInfo = notes[attr].match(/Ability Boost \((.*)\)/gi)) == null)
        continue;
      matchInfo.forEach(matched => {
        matched.split('/').forEach(boosted => {
          var choices = boosted.match(/Choose (\d+) from (.*)/i);
          if(choices) {
            choices[2].split(/\s*,\s*/).forEach(choice => {
              potentialBoosts[choice.toLowerCase()] += choices[1] - 0;
            });
          }
        });
      });
    }
    for(attr in SRD5E.ABILITIES)
      potentialBoosts[attr.toLowerCase()] += potentialBoosts.any;
    delete potentialBoosts.any;
    matchInfo =
      (attributes.notes || '').match(/ability\s+boost[:\s]+\+\d+\s+\w+(\s*;\s*\+\d+\s+\w+)*/gi);
    if(matchInfo) {
      matchInfo.forEach(boosted => {
        boosted.match(/\d+\s+\w+/g).forEach(boost => {
          var amountAndAbility = boost.match(/(\d+)\s+(\w+)/);
          howMany -= amountAndAbility[1];
          potentialBoosts[amountAndAbility[2]] -= amountAndAbility[1];
        });
      });
    }
    if(howMany > 0) {
      attributes.notes = (attributes.notes ? attributes.notes + '\n' : '') +
      '* Ability Boost:';
      while(howMany > 0) {
        attr = QuilvynUtils.randomKey(SRD5E.ABILITIES).toLowerCase();
        if(potentialBoosts[attr.toLowerCase() <= 0])
          continue;
        attributes.notes += ' +1 ' + attr + ';';
        potentialBoosts[attr.toLowerCase()]--;
        howMany--;
      }
    }
  } else if(attribute == 'deity') {
    /* Pick a deity that's no more than one alignment position removed. */
    var aliInfo = attributes.alignment.match(/^([CLN]).*\s([GEN])/);
    var aliPat;
    if(aliInfo == null) /* Neutral character */
      aliPat = 'N[EG]?|[CL]N';
    else if(aliInfo[1] == 'N') /* NG or NE */
      aliPat = 'N|[CLN]' + aliInfo[2];
    else if(aliInfo[2] == 'N') /* CN or LN */
      aliPat = 'N|' + aliInfo[1] + '[GNE]';
    else /* [LC]G or [LC]E */
      aliPat = aliInfo[1] + '[N' + aliInfo[2] + ']|N' + aliInfo[2];
    choices = [];
    var deities = this.getChoices('deities');
    for(attr in deities) {
      if(deities[attr].match('=' + aliPat + '\\b'))
        choices.push(attr);
    }
    if(choices.length > 0)
      attributes.deity = choices[QuilvynUtils.random(0, choices.length - 1)];
  } else if(attribute == 'feats' || attribute == 'selectableFeatures') {
    var debug = [];
    attribute = attribute == 'feats' ? 'feat' : 'selectableFeature';
    var countPrefix = attribute + 'Count.';
    var prefix = attribute + 's';
    var suffix = attribute.charAt(0).toUpperCase() + attribute.substring(1);
    var toAllocateByType = {};
    attrs = this.applyRules(attributes);
    for(attr in attrs) {
      if(attr.startsWith(countPrefix)) {
        toAllocateByType[attr.replace(countPrefix, '')] = attrs[attr];
      }
    }
    var availableChoices = {};
    var allChoices = this.getChoices(prefix);
    for(attr in allChoices) {
      var types = QuilvynUtils.getAttrValueArray(allChoices[attr], 'Type');
      if(types.indexOf('General') < 0)
        types.push('General');
      if(attrs[prefix + '.' + attr] != null) {
        for(i = 0; i < types.length; i++) {
          var t = types[i];
          if(toAllocateByType[t] != null && toAllocateByType[t] > 0) {
            debug.push(prefix + '.' + attr + ' reduces ' + t + ' feats from ' + toAllocateByType[t]);
            toAllocateByType[t]--;
            break;
          }
        }
      } else if(attrs['features.' + attr] == null) {
        availableChoices[attr] = types;
      }
    }
    for(attr in toAllocateByType) {
      var availableChoicesInType = {};
      for(var a in availableChoices) {
        if(attr == 'General' || availableChoices[a].includes(attr))
          availableChoicesInType[a] = '';
      }
      howMany = toAllocateByType[attr];
      debug.push('Choose ' + howMany + ' ' + attr + ' ' + prefix);
      while(howMany > 0 &&
            (choices=QuilvynUtils.getKeys(availableChoicesInType)).length > 0) {
        debug.push(
          'Pick ' + howMany + ' from ' +
          QuilvynUtils.getKeys(availableChoicesInType).length
        );
        var pick;
        var picks = {};
        pickAttrs(picks, '', choices, howMany, 1);
        debug.push('From ' + QuilvynUtils.getKeys(picks).join(", ") + ' reject');
        for(pick in picks) {
          attributes[prefix + '.' + pick] = 1;
          delete availableChoicesInType[pick];
        }
        var validate = this.applyRules(attributes);
        for(pick in picks) {
          var name = pick.charAt(0).toLowerCase() +
                     pick.substring(1).replaceAll(' ', '').
                     replace(/\(/g, '\\(').replace(/\)/g, '\\)');
          if(QuilvynUtils.sumMatching
               (validate,
                new RegExp('^(sanity|validation)Notes.'+name+suffix)) != 0) {
            delete attributes[prefix + '.' + pick];
            debug[debug.length - 1] += ' ' + name;
          } else {
            howMany--;
            delete availableChoices[pick];
          }
        }
      }
      debug.push('xxxxxxx');
    }
    if(window.DEBUG) {
      notes = attributes.notes;
      attributes.notes =
        (notes != null ? attributes.notes + '\n' : '') + debug.join('\n');
    }
  } else if(attribute == 'gender') {
    attributes['gender'] = QuilvynUtils.random(0, 99) < 50 ? 'Female' : 'Male';
  } else if(attribute == 'hitPoints') {
    attributes.hitPoints = 0;
    for(var clas in this.getChoices('levels')) {
      if((attr = attributes['levels.' + clas]) == null)
        continue;
      matchInfo = this.getChoices('levels')[clas].match(/^((\d+)?d)?(\d+)$/);
      var number = matchInfo == null || matchInfo[2] == null ||
                   matchInfo[2] == '' ? 1 : matchInfo[2];
      var sides = matchInfo == null || matchInfo[3] == null ||
                  matchInfo[3] == '' ? 6 : matchInfo[3];
      attributes.hitPoints += number * sides;
      while(--attr > 0)
        attributes.hitPoints += QuilvynUtils.random(number, number * sides);
    }
  } else if(attribute == 'languages') {
    attrs = this.applyRules(attributes);
    howMany = attrs.languageCount;
    choices = [];
    for(attr in this.getChoices('languages')) {
      if(attrs['languages.' + attr])
        howMany--;
      else
        choices.push(attr);
    }
    pickAttrs(attributes, 'languages.', choices, howMany, 1);
  } else if(attribute == 'levels') {
    var assignedLevels = QuilvynUtils.sumMatching(attributes, /^levels\./);
    if(!attributes.level) {
      if(assignedLevels > 0)
        attributes.level = assignedLevels;
      else if(attributes.experience)
        attributes.level =
          Math.floor((1 + Math.sqrt(1 + attributes.experience/125)) / 2);
      else
        // Random 1..8 with each value half as likely as the previous one.
        attributes.level =
          9 - Math.floor(Math.log(QuilvynUtils.random(2, 511)) / Math.log(2));
    }
    var max = SRD5E.LEVELS_EXPERIENCE[attributes.level] * 1000 - 1;
    var min = SRD5E.LEVELS_EXPERIENCE[attributes.level - 1] * 1000;
    if(!attributes.experience || attributes.experience < min)
      attributes.experience = QuilvynUtils.random(min, max);
    choices = QuilvynUtils.getKeys(this.getChoices('levels'));
    if(assignedLevels == 0) {
      var classesToChoose =
        attributes.level == 1 || QuilvynUtils.random(1,10) < 9 ? 1 : 2;
      // Find choices that are valid or can be made so
      while(classesToChoose > 0) {
        which = 'levels.' + choices[QuilvynUtils.random(0,choices.length-1)];
        attributes[which] = 1;
        if(QuilvynUtils.sumMatching(this.applyRules(attributes),
             /^validationNotes.*(BaseAttack|CasterLevel|Spells)/) == 0) {
          assignedLevels++;
          classesToChoose--;
        } else {
          delete attributes[which];
        }
      }
    }
    while(assignedLevels < attributes.level) {
      which = 'levels.' + choices[QuilvynUtils.random(0,choices.length-1)];
      while(!attributes[which]) {
        which = 'levels.' + choices[QuilvynUtils.random(0,choices.length-1)];
      }
      attributes[which]++;
      assignedLevels++;
    }
    delete attributes.level;
  } else if(attribute == 'name') {
    attributes['name'] = SRD5E.randomName(attributes['race']);
  } else if(attribute == 'shield') {
    attrs = this.applyRules(attributes);
    choices = [];
    for(attr in this.getChoices('shields')) {
      if(attr == 'None' ||
         attrs['armorProficiency.Shield'] ||
         attrs['armorProficiency.' + attr]) {
        choices.push(attr);
      }
    }
    attributes['shield'] = choices[QuilvynUtils.random(0, choices.length - 1)];
  } else if(attribute == 'skills' || attribute == 'tools') {
    attrs = this.applyRules(attributes);
    count = 0;
    var group = this.getChoices(attribute);
    pat = new RegExp('^features.' + attribute.replace(/s$/, '') + ' Proficiency \\((.*)\\)$', 'i');
    for(attr in attrs) {
      if((matchInfo = attr.match(pat)) == null ||
         !matchInfo[1].match(/\bChoose\b/i))
        continue;
      pieces = matchInfo[1].split('/');
      for(i = 0; i < pieces.length; i++) {
        matchInfo = pieces[i].match(/^Choose\s+(\d+)\s+from\s+(.*)$/i);
        if(!matchInfo)
          continue;
        count = matchInfo[1] * 1;
        if(matchInfo[2].match(/^any$/i)) {
          choices = QuilvynUtils.getKeys(group);
        } else {
          choices = matchInfo[2].split(/\s*,\s*/);
          for(j = choices.length - 1; j >= 0; j--) {
            if(choices[j].match(/^any\s+/i)) {
              type = choices[j].replace(/^any\s+/, '');
              for(var item in group) {
                if(group[item].includes(type))
                  choices.push(item);
              }
              choices.splice(j, 1);
            }
          }
        }
        for(k = choices.length - 1; k >= 0; k--) {
          if(!attrs[attribute + 'Chosen.' + choices[k]])
            continue;
          count--;
          choices.splice(k, 1);
        }
      }
      pickAttrs(attributes, attribute + 'Chosen.', choices, count, 1);
    }
    pickAttrs(
      attributes, attribute + 'Chosen.', QuilvynUtils.getKeys(group),
      attrs[attribute.replace(/s$/, '') + 'ChoiceCount'] -
      QuilvynUtils.sumMatching(attributes, '^' + attribute + 'Chosen'), 1
    );
  } else if(attribute == 'spells') {
    var availableSpellsByGroupAndLevel = {};
    var groupAndLevel;
    attrs = this.applyRules(attributes);
    for(attr in this.getChoices('spells')) {
      groupAndLevel = attr.split('(')[1].split(' ')[0];
      if(availableSpellsByGroupAndLevel[groupAndLevel] == null)
        availableSpellsByGroupAndLevel[groupAndLevel] = [];
      availableSpellsByGroupAndLevel[groupAndLevel].push(attr);
    }
    for(attr in attrs) {
      if((matchInfo = attr.match(/^spellSlots\.(.*)/)) == null)
        continue;
      groupAndLevel = matchInfo[1];
      howMany = attrs[attr];
      choices = availableSpellsByGroupAndLevel[groupAndLevel];
      if(choices != null) {
        choices = choices.filter(
          x => !x.includes('[') || attrs['features.' + x.replace(/^.*\[|\].*$/g, '')] != null
        );
        var slots = attrs['spellSlots.' + groupAndLevel];
        if(slots != null && slots < howMany) {
          howMany = slots;
        }
        pickAttrs
          (attributes, 'spells.', choices, howMany -
           QuilvynUtils.sumMatching(attributes, '^spells\\..*[(]' + groupAndLevel + '[^0]'), 1);
      }
    }
  } else if(attribute == 'weapons') {
    notes = this.getChoices('notes');
    var weapons = this.getChoices('weapons');
    attrs = this.applyRules(attributes);
    pat = /Weapon Proficiency \((([^\(]|\([^\)]*\))*)\)$/i;
    for(attr in attrs) {
      if((matchInfo = attr.match(pat)) == null && notes[attr] != null)
        matchInfo = notes[attr].match(pat);
      if(matchInfo == null || !matchInfo[1].match(/\bChoose\b/i))
        continue;
      pieces = matchInfo[1].split('/');
      for(i = 0; i < pieces.length; i++) {
        matchInfo = pieces[i].match(/^Choose\s+(\d+)\s+from\s+(.*)$/i);
        if(!matchInfo)
          continue;
        count = matchInfo[1] * 1;
        if(matchInfo[2].match(/^any$/i)) {
          choices = QuilvynUtils.getKeys(weapons);
        } else {
          choices = matchInfo[2].split(/\s*,\s*/);
          for(j = choices.length - 1; j >= 0; j--) {
            if(choices[j].match(/^any\s+/i)) {
              type = choices[j].replace(/^any\s+/, '');
              type = type.match(/simple/i) ? /category=(1|simple)/i :
                     type.match(/martial/i) ? /category=(2|martial)/i :
                     type.match(/light/i) ? /light|\bli\b/i :
                     type.match(/one-handed/i) ? /one-handed|\b1h\b/i :
                     type.match(/two-handed/i) ? /one-handed|\b2h\b/i :
                     type.match(/versatile/i) ? /versatile|\bve\b/i :
                     type.match(/heavy/i) ? /heavy|\bhe\b/i : /./;
              for(var weapon in weapons) {
                if(weapons[weapon].match(type))
                  choices.push(weapon);
              }
              choices.splice(j, 1);
            }
          }
        }
        for(k = choices.length - 1; k >= 0; k--) {
          if(!attrs['weaponsChosen.' + choices[k]])
            continue;
          count--;
          choices.splice(k, 1);
        }
      }
      pickAttrs(attributes, 'weaponsChosen.', choices, count, 1);
    }
    choices = [];
    for(attr in weapons) {
      var category = QuilvynUtils.getAttrValue(weapons[attr], 'Category');
      if(category == null)
        category = 0;
      else if((category + '').match(/simple/i))
        category = 1;
      else if((category + '').match(/martial/i))
        category = 2;
      if(category == 0 ||
         attrs['weaponProficiency.Martial'] ||
         category == 1 && attrs['weaponProficiency.Simple'] ||
         attrs['weaponProficiency.' + attr]) {
        choices.push(attr);
      }
    }
    pickAttrs(attributes, 'weapons.', choices,
              3 - QuilvynUtils.sumMatching(attributes, /^weapons\./), 1);
  } else if(attribute == 'abilities' ||
            attribute.charAt(0).toUpperCase() + attribute.substring(1) in SRD5E.ABILITIES) {
    for(attr in SRD5E.ABILITIES) {
      attr = attr.toLowerCase();
      if(attr != attribute && attribute != 'abilities')
        continue;
      var rolls = [];
      for(i = 0; i < 4; i++)
        rolls.push(QuilvynUtils.random(1, 6));
      rolls.sort();
      attributes[attr] = rolls[1] + rolls[2] + rolls[3];
    }
  } else if(this.getChoices(attribute + 's') != null) {
    attributes[attribute] =
      QuilvynUtils.randomKey(this.getChoices(attribute + 's'));
  }

};

/* Fixes as many validation errors in #attributes# as possible. */
SRD5E.makeValid = function(attributes) {

  var attributesChanged = {};
  var debug = [];
  var index;
  var notes = this.getChoices('notes');
  var possibilities;

  // If 8 passes don't get rid of all repairable problems, give up
  for(var pass = 0; pass < 8; pass++) {

    var applied = this.applyRules(attributes);
    var fixedThisPass = 0;

    // Try to fix each sanity/validation note w/a non-zero value
    for(var attr in applied) {

      var matchInfo =
        attr.match(/^(sanity|validation)Notes\.(.*)([A-Z][a-z]+)/);
      var attrValue = applied[attr];

      if(matchInfo == null || !attrValue || notes[attr] == null) {
        continue;
      }

      var problemSource = matchInfo[2];
      var problemCategory = matchInfo[3].substring(0, 1).toLowerCase() +
                            matchInfo[3].substring(1).replaceAll(' ', '');
      var requirements =
        notes[attr].replace(/^(Implies|Requires)\s/, '').split(/\s*\/\s*/);

      for(var i = 0; i < requirements.length; i++) {

        // Find a random requirement choice w/the format "name [op value]"
        var choices = requirements[i].split(/\s*\|\|\s*/);
        while(choices.length > 0) {
          index = QuilvynUtils.random(0, choices.length - 1);
          matchInfo = choices[index].match(/^([^<>!=]+)(([<>!=~]+)(.*))?/);
          if(matchInfo != null) {
            break;
          }
          choices = choices.slice(0, index).concat(choices.slice(index + 1));
        }
        if(matchInfo == null) {
          continue;
        }

        var toFixCombiner = null;
        var toFixName = matchInfo[1].replace(/\s+$/, '');
        var toFixOp = matchInfo[3] == null ? '>=' : matchInfo[3];
        var toFixValue =
          matchInfo[4] == null ? 1 : matchInfo[4].replace(/^\s+/, '');
        if(toFixName.match(/^(Max|Sum)/)) {
          toFixCombiner = toFixName.substring(0, 3);
          toFixName = toFixName.substring(4).replace(/^\s+/, '');
        }
        var toFixAttr = toFixName.substring(0, 1).toLowerCase() +
                        toFixName.substring(1).replaceAll(' ', '');

        // See if this attr has a set of choices (e.g., race) or a category
        // attribute (e.g., a feat)
        choices = this.getChoices(toFixAttr + 's');
        if(choices == null) {
           choices = this.getChoices(problemCategory);
        }
        if(choices != null) {
          // Find the set of choices that satisfy the requirement
          var target =
            this.getChoices(problemCategory) == null ? toFixValue : toFixName;
          possibilities = [];
          for(var choice in choices) {
            if((toFixOp.match(/[^!]=/) && choice == target) ||
               (toFixOp == '!=' && choice != target) ||
               (toFixCombiner != null && choice.indexOf(target) == 0) ||
               (toFixOp == '=~' && choice.match(new RegExp(target))) ||
               (toFixOp == '!~' && !choice.match(new RegExp(target)))) {
              possibilities.push(choice);
            }
          }
          if(possibilities.length == 0) {
            continue; // No fix possible
          }
          if(target == toFixName) {
            toFixAttr =
              problemCategory + '.' +
              possibilities[QuilvynUtils.random(0, possibilities.length - 1)];
          } else {
            toFixValue =
              possibilities[QuilvynUtils.random(0, possibilities.length - 1)];
          }
        }
        if((choices != null || attributes[toFixAttr] != null) &&
           attributesChanged[toFixAttr] == null) {
          // Directly-fixable problem
          debug.push(
            attr + " '" + toFixAttr + "': '" + attributes[toFixAttr] +
            "' => '" + toFixValue + "'"
          );
          if(toFixValue == 0) {
            delete attributes[toFixAttr];
          } else {
            attributes[toFixAttr] = toFixValue;
          }
          attributesChanged[toFixAttr] = toFixValue;
          fixedThisPass++;
        } else if(problemCategory == 'total' && attrValue > 0 &&
                  (choices = this.getChoices(problemSource)) != null) {
          // Too many items allocated in a category
          possibilities = [];
          for(var k in attributes) {
            if(k.match('^' + problemSource + '\\.') &&
               attributesChanged[k] == null) {
               possibilities.push(k);
            }
          }
          while(possibilities.length > 0 && attrValue > 0) {
            index = QuilvynUtils.random(0, possibilities.length - 1);
            toFixAttr = possibilities[index];
            possibilities =
              possibilities.slice(0,index).concat(possibilities.slice(index+1));
            var current = attributes[toFixAttr];
            toFixValue = current > attrValue ? current - attrValue : 0;
            debug.push(
              attr + " '" + toFixAttr + "': '" + attributes[toFixAttr] +
              "' => '" + toFixValue + "'"
            );
            if(toFixValue == 0) {
              delete attributes[toFixAttr];
            } else {
              attributes[toFixAttr] = toFixValue;
            }
            attrValue -= current - toFixValue;
            // Don't do this: attributesChanged[toFixAttr] = toFixValue;
            fixedThisPass++;
          }
        } else if(problemCategory == 'total' && attrValue < 0 &&
                  (choices = this.getChoices(problemSource)) != null) {
          // Too few items allocated in a category
          this.randomizeOneAttribute(attributes, problemSource);
          debug.push(attr + ' Allocate additional ' + problemSource);
          fixedThisPass++;
        } else if(attr.match(/validationNotes.abilityModifier(Sum|Minimum)/)) {
          // Special cases
          var abilities = {
            'charisma':'', 'constitution':'', 'dexterity':'',
            'intelligence':'', 'strength':'', 'wisdom':''
          };
          if(attr == 'validationNotes.abilityModifierMinimum') {
            toFixAttr = QuilvynUtils.randomKey(abilities);
            toFixValue = 14;
            debug.push(
              attr + " '" + toFixAttr + "': '" + attributes[toFixAttr] +
              "' => '" + toFixValue + "'"
            );
            attributes[toFixAttr] = toFixValue;
            // Don't do this: attributesChanged[toFixAttr] = toFixValue;
            fixedThisPass++;
          } else {
            for(toFixAttr in abilities) {
              if(applied[toFixAttr + 'Modifier'] <= 0) {
                toFixValue = attributes[toFixAttr] + 2;
                debug.push(
                  attr + " '" + toFixAttr + "': '" + attributes[toFixAttr] +
                  "' => '" + toFixValue + "'"
                );
                attributes[toFixAttr] = toFixValue;
                // Don't do this: attributesChanged[toFixAttr] = toFixValue;
                fixedThisPass++;
              }
            }
          }
        }

      }

    }

    debug.push('-----');
    if(fixedThisPass == 0) {
      break;
    }

  }

  if(window.DEBUG)
    attributes.notes =
      (attributes.notes ? attributes.notes + '\n' : '') + debug.join('\n');

};

/* Returns HTML body content for user notes associated with this rule set. */
SRD5E.ruleNotes = function() {
  return '' +
    '<h2>SRD5E Quilvyn Module Notes</h2>\n' +
    'SRD5E Quilvyn Module Version ' + SRD5E.VERSION + '\n' +
    '<h3>Usage Notes</h3>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '    To allow feats to be taken instead of Ability Score Improvements,\n' +
    '    the latter is presented as a new feat, named Ability Boost, that.\n' +
    '    can be taken multiple times.\n' +
    '  </li><li>\n' +
    '    Quilvyn presents sub-race choices (e.g., Lightfoot Halfling)\n' +
    '    as separate races in the editor Race menu.\n' +
    '  </li>\n' +
    '</ul>\n' +
    '\n' +
    '<h3>Limitations</h3>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '    Quilvyn does not generate background traits, ideals, bonds, flaws,\n' +
    '    or equipment. These items can be entered in the Notes section.\n' +
    '  </li><li>\n' +
    '    Quilvyn does not describe the effects of spells cast at higher\n' +
    '    than minimum level.\n' +
    '  </li>\n' +
    '</ul>\n' +
    '\n' +
    '<h3>Known Bugs</h3>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '    Quilvyn does not test multiclass ability prerequisites, and Quilvyn\n'+
    '    gives multiclass characters the complete set of proficiencies for\n' +
    '    each class.\n' +
    '  </li>\n' +
    '</ul>\n' +
    '<h3>Copyrights and Licensing</h3>\n' +
    '<p>\n' +
    'System Reference Document material is Open Game Content released by ' +
    'Wizards of the Coast under the Open Game License. ' +
    'System Reference Document 5.1 Copyright 2016, Wizards of the Coast, ' +
    'Inc.; Authors Mike Mearls, Jeremy Crawford, Chris Perkins, Rodney ' +
    'Thompson, Peter Lee, James Wyatt, Robert J. Schwalb, Bruce R. Cordell, ' +
    'Chris Sims, and Steve Townshend, based on original material by E. Gary ' +
    'Gygax and Dave Arneson.\n' +
    '</p><p>\n' +
    'Open Game License v 1.0a Copyright 2000, Wizards of the Coast, LLC. You ' +
    'should have received a copy of the Open Game License with this program; ' +
    'if not, you can obtain one from ' +
    'https://media.wizards.com/2016/downloads/SRD-OGL_V1.1.pdf. ' +
    '<a href="plugins/ogl-srd5e.txt">Click here</a> to see the license.<br/>\n'+
    '</p><p>\n' +
    'Quilvyn is not approved or endorsed by Wizards of the Coast. Portions ' +
    'of the materials used are property of Wizards of the Coast. ©Wizards of ' +
    'the Coast LLC.\n' +
    '</p>\n';
};
