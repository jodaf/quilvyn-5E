/*
Copyright 2025, James J. Hayes

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
/* globals Expr, ObjectViewer, PHB5E, Quilvyn, QuilvynRules, QuilvynUtils */
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

  let rules = new QuilvynRules('SRD 5E', SRD5E.VERSION);
  SRD5E.rules = rules;
  rules.plugin = SRD5E;

  rules.defineChoice('choices', SRD5E.CHOICES);
  rules.choiceEditorElements = SRD5E.choiceEditorElements;
  rules.choiceRules = SRD5E.choiceRules;
  rules.removeChoice = SRD5E.removeChoice;
  rules.editorElements = SRD5E.initialEditorElements();
  rules.getFormats = SRD5E.getFormats;
  rules.makeValid = SRD5E.makeValid;
  rules.randomizeOneAttribute = SRD5E.randomizeOneAttribute;
  rules.defineChoice('random', SRD5E.RANDOMIZABLE_ATTRIBUTES);
  rules.getChoices = SRD5E.getChoices;
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

SRD5E.VERSION = '2.4.2.0';

/* List of choices that can be expanded by house rules. */
// Note: Left Goody out of this list for now because inclusion would require
// documenting how to construct regular expressions.
SRD5E.CHOICES = [
  'Armor', 'Background', 'Background Feature', 'Class', 'Class Feature',
  'Deity', 'Feat', 'Feature', 'Language', 'Race', 'Race Feature', 'School',
  'Skill', 'Spell', 'Tool', 'Weapon'
];
/*
 * List of items handled by randomizeOneAttribute method. The order handles
 * dependencies among attributes when generating random characters.
 */
SRD5E.RANDOMIZABLE_ATTRIBUTES = [
  'abilities', 'charisma', 'constitution', 'dexterity', 'intelligence',
  'strength', 'wisdom', 'name', 'race', 'gender', 'alignment', 'background',
  'deity', 'levels', 'selectableFeatures', 'feats', 'skills', 'languages',
  'hitPoints', 'armor', 'shield', 'weapons', 'spells', 'tools', 'abilityBoosts'
];
SRD5E.VIEWERS = ['Collected Notes', 'Compact', 'Standard', 'Stat Block'];

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
  'None':'AC=0 Dex=10 Weight=None',
  'Padded':'AC=1 Bulky=true Dex=10 Weight=Light',
  'Leather':'AC=1 Dex=10 Weight=Light',
  'Studded Leather':'AC=2 Dex=10 Weight=Light',
  'Hide':'AC=2 Dex=2 Weight=Medium',
  'Chain Shirt':'AC=3 Dex=2 Weight=Medium',
  'Scale Mail':'AC=4 Bulky=true Dex=2 Weight=Medium',
  'Breastplate':'AC=4 Dex=2 Weight=Medium',
  'Half Plate':'AC=5 Bulky=true Dex=2 Weight=Medium',
  'Ring Mail':'AC=4 Bulky=true Dex=0 Weight=Heavy',
  'Chain Mail':'AC=6 Bulky=true Dex=0 Str=13 Weight=Heavy',
  'Splint':'AC=7 Bulky=true Dex=0 Str=15 Weight=Heavy',
  'Plate':'AC=8 Bulky=true Dex=0 Str=15 Weight=Heavy'
};
SRD5E.BACKGROUNDS = {
  'Acolyte':
    'Equipment=' +
      '"Holy Symbol","Prayer Book",Incense,Vestments,Clothing,"15 GP" ' +
    'Features=' +
      '"1:Skill Proficiency (Insight; Religion)",' +
      '"1:Language (Choose 2 from any)",' +
      '"1:Shelter Of The Faithful"'
};
SRD5E.CLASSES = {
  'Barbarian':
    'HitDie=d12 ' +
    'Features=' +
      '"1:Armor Proficiency (Light; Medium; Shield)",' +
      '"1:Save Proficiency (Strength; Constitution)",' +
      '"1:Skill Proficiency (Choose 2 from Animal Handling, Athletics, Intimidation, Nature, Perception, Survival)",' +
      '"1:Weapon Proficiency (Simple Weapons; Martial Weapons)",' +
      '"1:Rage","1:Unarmored Defense (Barbarian)","2:Reckless Attack",' +
      '"2:Danger Sense","3:Primal Path","5:Extra Attack","5:Fast Movement",' +
      '"7:Feral Instinct","9:Brutal Critical","11:Relentless Rage",' +
      '"15:Persistent Rage","18:Indomitable Might","20:Primal Champion",' +
      '"features.Path Of The Berserker ? 3:Frenzy",' +
      '"features.Path Of The Berserker ? 6:Mindless Rage",' +
      '"features.Path Of The Berserker ? 10:Intimidating Presence",' +
      '"features.Path Of The Berserker ? 14:Retaliation" ' +
    'Selectables=' +
      '"3:Path Of The Berserker:Primal Path" ' +
    'SpellAbility=Wisdom ' +
    'MulticlassPrerequisite="strength >= 13"',
  'Bard':
    'HitDie=d8 ' +
    'Features=' +
      '"1:Armor Proficiency (Light)",' +
      '"1:Weapon Proficiency (Simple Weapons; Hand Crossbow; Longsword; Rapier; Shortsword)",' +
      '"1:Tool Proficiency (Choose 3 from any Musical)",' +
      '"1:Save Proficiency (Dexterity; Charisma)",' +
      '"1:Skill Proficiency (Choose 3 from any)",' +
      '"1:Spellcasting","1:Bardic Inspiration","2:Jack Of All Trades",' +
      '"2:Song Of Rest","3:Bard College","3:Expertise (Bard)",' +
      '"5:Font Of Inspiration","6:Countercharm","10:Magical Secrets",' +
      '"20:Superior Inspiration",' +
      '"features.College Of Lore ? 3:Bonus Proficiencies (College Of Lore)",' +
      '"features.College Of Lore ? 3:Cutting Words",' +
      '"features.College Of Lore ? 6:Additional Magical Secrets",' +
      '"features.College Of Lore ? 14:Peerless Skill" ' +
    'Selectables=' +
      '"3:College Of Lore:Bard College" ' +
    'SpellAbility=Charisma ' +
    'SpellSlots=' +
      'B0:2@1;3@4;4@10,' +
      'B1:2@1;3@2;4@3,' +
      'B2:2@3;3@4,' +
      'B3:2@5;3@6,' +
      'B4:1@7;2@8;3@9,' +
      'B5:1@9;2@10;3@18,' +
      'B6:1@11;2@19,' +
      'B7:1@13;2@20,' +
      'B8:1@15,' +
      'B9:1@17 ' +
    'MulticlassPrerequisite="charisma >= 13"',
  'Cleric':
    'HitDie=d8 ' +
    'Features=' +
      '"1:Armor Proficiency (Light; Medium; Shield)",' +
      '"1:Weapon Proficiency (Simple Weapons)",' +
      '"1:Save Proficiency (Wisdom; Charisma)",' +
      '"1:Skill Proficiency (Choose 2 from History, Insight, Medicine, Persuasion, Religion)",' +
      '"1:Spellcasting","1:Divine Domain","2:Channel Divinity",' +
      '"2:Turn Undead","5:Destroy Undead","10:Divine Intervention",' +
      '"features.Life Domain ? 1:Bonus Proficiency (Life Domain)",' +
      '"features.Life Domain ? 1:Disciple Of Life",' +
      '"features.Life Domain ? 2:Preserve Life",' +
      '"features.Life Domain ? 6:Blessed Healer",' +
      '"clericHasDivineStrike ? 8:Divine Strike",' +
      '"features.Life Domain ? 17:Supreme Healing" ' +
    'Selectables=' +
      '"deityDomains =~ \'Life\' ? 1:Life Domain:Divine Domain" ' +
    'SpellAbility=Wisdom ' +
    'SpellSlots=' +
      'C0:3@1;4@4;5@10,' +
      'C1:2@1;3@2;4@3,' +
      'C2:2@3;3@4,' +
      'C3:2@5;3@6,' +
      'C4:1@7;2@8;3@9,' +
      'C5:1@9;2@10;3@18,' +
      'C6:1@11;2@19,' +
      'C7:1@13;2@20,' +
      'C8:1@15,' +
      'C9:1@17 ' +
    'MulticlassPrerequisite="wisdom >= 13"',
  'Druid':
    'HitDie=d8 ' +
    'Features=' +
      '"1:Armor Proficiency (Light; Medium; Shield)",' +
      '"1:Weapon Proficiency (Club; Dagger; Dart; Javelin; Mace; Quarterstaff; Scimitar; Sickle; Sling; Spear)",' +
      '"1:Tool Proficiency (Herbalism Kit)",' +
      '"1:Save Proficiency (Intelligence; Wisdom)",' +
      '"1:Skill Proficiency (Choose 2 from Arcana, Animal Handling, Insight, Medicine, Nature, Perception, Religion, Survival)",' +
      '"1:Druidic","1:Spellcasting","2:Wild Shape","2:Druid Circle",' +
      '"18:Timeless Body (Druid)","18:Beast Spells","20:Archdruid",' +
      '"features.Circle Of The Land ? 2:Bonus Cantrip (Circle Of The Land)",' +
      '"features.Circle Of The Land ? 2:Natural Recovery",' +
      '"features.Circle Of The Land ? 3:Circle Spells",' +
      '"features.Circle Of The Land ? 6:Land\'s Stride",' +
      '"features.Circle Of The Land ? 10:Nature\'s Ward",' +
      '"features.Circle Of The Land ? 14:Nature\'s Sanctuary" ' +
    'Selectables=' +
      '"2:Circle Of The Land (Arctic):Druid Circle",' +
      '"2:Circle Of The Land (Coast):Druid Circle",' +
      '"2:Circle Of The Land (Desert):Druid Circle",' +
      '"2:Circle Of The Land (Forest):Druid Circle",' +
      '"2:Circle Of The Land (Grassland):Druid Circle",' +
      '"2:Circle Of The Land (Mountain):Druid Circle",' +
      '"2:Circle Of The Land (Swamp):Druid Circle" ' +
    'SpellAbility=Wisdom ' +
    'SpellSlots=' +
      'D0:2@1;3@4;4@10,' +
      'D1:2@1;3@2;4@3,' +
      'D2:2@3;3@4,' +
      'D3:2@5;3@6,' +
      'D4:1@7;2@8;3@9,' +
      'D5:1@9;2@10;3@18,' +
      'D6:1@11;2@19,' +
      'D7:1@13;2@20,' +
      'D8:1@15,' +
      'D9:1@17 ' +
    'MulticlassPrerequisite="wisdom >= 13"',
 'Fighter':
    'HitDie=d10 ' +
    'Features=' +
      '"1:Armor Proficiency (Light; Heavy; Shield)",' +
      '"1:Weapon Proficiency (Simple Weapons; Martial Weapons)",' +
      '"1:Save Proficiency (Strength; Constitution)",' +
      '"1:Skill Proficiency (Choose 2 from Acrobatics, Animal Handling, Athletics, History, Insight, Intimidation, Perception, Survival)",' +
      '"1:Fighting Style","1:Second Wind","2:Action Surge",' +
      '"3:Martial Archetype","5:Extra Attack",9:Indomitable,' +
      '"features.Champion ? 3:Improved Critical",' +
      '"features.Champion ? 7:Remarkable Athlete",' +
      '"features.Champion ? 10:Additional Fighting Style",' +
      '"features.Champion ? 15:Superior Critical",' +
      '"features.Champion ? 18:Survivor" ' +
    'Selectables=' +
      '"1:Fighting Style (Archery):Fighting Style",' +
      '"1:Fighting Style (Defense):Fighting Style",' +
      '"1:Fighting Style (Dueling):Fighting Style",' +
      '"1:Fighting Style (Great Weapon Fighting):Fighting Style",' +
      '"1:Fighting Style (Protection):Fighting Style",' +
      '"1:Fighting Style (Two-Weapon Fighting):Fighting Style",' +
      '"3:Champion:Martial Archetype" ' +
    'SpellAbility=Intelligence ' +
    'MulticlassPrerequisite="strength >= 13 || dexterity >= 13"',
  'Monk':
    'HitDie=d8 ' +
    'Features=' +
      '"1:Weapon Proficiency (Simple Weapons; Shortsword)",' +
      '"1:Tool Proficiency (Choose 1 from any Artisan, any Musical)",' +
      '"1:Save Proficiency (Strength; Dexterity)",' +
      '"1:Skill Proficiency (Choose 2 from Acrobatics, Athletics, History, Insight, Religion, Stealth)",' +
      '"1:Unarmored Defense (Monk)","1:Martial Arts","2:Ki",' +
      '"2:Flurry Of Blows","2:Patient Defense","2:Step Of The Wind",' +
      '"2:Unarmored Movement","3:Monastic Tradition","3:Deflect Missiles",' +
      '"4:Slow Fall","5:Extra Attack","5:Stunning Strike",' +
      '"6:Ki-Empowered Strikes","7:Evasion","7:Stillness Of Mind",' +
      '"10:Purity Of Body","13:Tongue Of The Sun And Moon","14:Diamond Soul",' +
      '"15:Timeless Body (Monk)","18:Empty Body","20:Perfect Self",' +
      '"features.Way Of The Open Hand ? 3:Open Hand Technique",' +
      '"features.Way Of The Open Hand ? 6:Wholeness Of Body",' +
      '"features.Way Of The Open Hand ? 11:Tranquility",' +
      '"features.Way Of The Open Hand ? 17:Quivering Palm" ' +
    'Selectables=' +
      '"3:Way Of The Open Hand:Monastic Tradition" ' +
    'SpellAbility=Wisdom ' +
    'MulticlassPrerequisite="dexterity >= 13","wisdom >= 13"',
  'Paladin':
    'HitDie=d10 ' +
    'Features=' +
      '"1:Armor Proficiency (Light; Heavy; Shield)",' +
      '"1:Weapon Proficiency (Simple Weapons; Martial Weapons)",' +
      '"1:Save Proficiency (Wisdom; Charisma)",' +
      '"1:Skill Proficiency (Choose 2 from Athletics, Insight, Intimidation, Medicine, Persuasion, Religion)",' +
      '"1:Divine Sense","1:Lay On Hands","2:Fighting Style","2:Spellcasting",' +
      '"2:Divine Smite","3:Divine Health","3:Sacred Oath",' +
      '"3:Channel Divinity","5:Extra Attack","6:Aura Of Protection",' +
      '"10:Aura Of Courage","11:Improved Divine Smite","14:Cleansing Touch",' +
      '"features.Oath Of Devotion ? 3:Sacred Weapon",' +
      '"features.Oath Of Devotion ? 3:Turn The Unholy",' +
      '"features.Oath Of Devotion ? 7:Aura Of Devotion",' +
      '"features.Oath Of Devotion ? 15:Purity Of Spirit",' +
      '"features.Oath Of Devotion ? 20:Holy Nimbus" ' +
    'Selectables=' +
      '"2:Fighting Style (Defense):Fighting Style",' +
      '"2:Fighting Style (Dueling):Fighting Style",' +
      '"2:Fighting Style (Great Weapon Fighting):Fighting Style",' +
      '"2:Fighting Style (Protection):Fighting Style",' +
      '"3:Oath Of Devotion:Sacred Oath" ' +
    'SpellAbility=Charisma ' +
    'SpellSlots=' +
      'P1:2@2;3@3;4@5,' +
      'P2:2@5;3@7,' +
      'P3:2@9;3@11,' +
      'P4:1@13;2@15;3@17,' +
      'P5:1@17;2@19 ' +
    'MulticlassPrerequisite="strength >= 13","charisma >= 13"',
  'Ranger':
    'HitDie=d10 ' +
    'Features=' +
      '"1:Armor Proficiency (Light; Medium; Shield)",' +
      '"1:Weapon Proficiency (Simple Weapons; Martial Weapons)",' +
      '"1:Save Proficiency (Strength; Dexterity)",' +
      '"1:Skill Proficiency (Choose 3 from Animal Handling, Athletics, Insight, Investigation, Nature, Perception, Stealth, Survival)",' +
      '"1:Favored Enemy","1:Natural Explorer","1:Fighting Style",' +
      '"2:Spellcasting","3:Ranger Archetype","3:Primeval Awareness",' +
      '"5:Extra Attack","8:Land\'s Stride","10:Hide In Plain Sight",' +
      '"14:Vanish","18:Feral Senses","20:Foe Slayer",' +
      '"features.Hunter ? 3:Hunter\'s Prey",' +
      '"features.Hunter ? 7:Defensive Tactics",' +
      '"features.Hunter ? 11:Multiattack",' +
      '"features.Hunter ? 15:Superior Hunter\'s Defense" ' +
    'Selectables=' +
      '"2:Fighting Style (Archery):Fighting Style",' +
      '"2:Fighting Style (Defense):Fighting Style",' +
      '"2:Fighting Style (Dueling):Fighting Style",' +
      '"2:Fighting Style (Two-Weapon Fighting):Fighting Style",' +
      '"3:Hunter:Ranger Archetype",' +
      '"features.Hunter ? 3:Colossus Slayer:Hunter\'s Prey",' +
      '"features.Hunter ? 3:Giant Killer:Hunter\'s Prey",' +
      '"features.Hunter ? 3:Horde Breaker:Hunter\'s Prey",' +
      '"features.Hunter ? 7:Escape The Horde:Defensive Tactics",' +
      '"features.Hunter ? 7:Multiattack Defense:Defensive Tactics",' +
      '"features.Hunter ? 7:Steel Will:Defensive Tactics",' +
      '"features.Hunter ? 11:Volley:Multiattack",' +
      '"features.Hunter ? 11:Whirlwind Attack:Multiattack",' +
      '"features.Hunter ? 15:Evasion:Superior Hunter\'s Defense",' +
      '"features.Hunter ? 15:Stand Against The Tide:Superior Hunter\'s Defense",' +
      '"features.Hunter ? 15:Uncanny Dodge:Superior Hunter\'s Defense" ' +
    'SpellAbility=Wisdom ' +
    'SpellSlots=' +
      'R1:2@2;3@3;4@5,' +
      'R2:2@5;3@7,' +
      'R3:2@9;3@11,' +
      'R4:1@13;2@15;3@17,' +
      'R5:1@17;2@19 ' +
    'MulticlassPrerequisite="dexterity >= 13","wisdom >= 13"',
  'Rogue':
    'HitDie=d8 ' +
    'Features=' +
      '"1:Armor Proficiency (Light)",' +
      '"1:Weapon Proficiency (Simple Weapons; Hand Crossbow; Longsword; Rapier; Shortsword)",' +
      '"1:Tool Proficiency (Thieves\' Tools)",' +
      '"1:Save Proficiency (Dexterity; Intelligence)",' +
      '"1:Skill Proficiency (Choose 4 from Acrobatics, Athletics, Deception, Insight, Intimidation, Investigation, Perception, Performance, Persuasion, Sleight Of Hand, Stealth)",' +
      '"1:Expertise (Rogue)","1:Sneak Attack","1:Thieves\' Cant",' +
      '"2:Cunning Action","3:Roguish Archetype","5:Uncanny Dodge",' +
      '"7:Evasion","11:Reliable Talent","14:Blindsense","15:Slippery Mind",' +
      '"18:Elusive","20:Stroke Of Luck",' +
      '"features.Thief ? 3:Fast Hands",' +
      '"features.Thief ? 3:Second-Story Work",' +
      '"features.Thief ? 9:Supreme Sneak",' +
      '"features.Thief ? 13:Use Magic Device",' +
      '"features.Thief ? 17:Thief\'s Reflexes" ' +
    'Selectables=' +
      '"3:Thief:Roguish Archetype" ' +
    'SpellAbility=Intelligence ' +
    'MulticlassPrerequisite="dexterity >= 13"',
  'Sorcerer':
    'HitDie=d6 ' +
    'Features=' +
      '"1:Weapon Proficiency (Dagger; Dart; Sling; Quarterstaff; Light Crossbow)",' +
      '"1:Save Proficiency (Constitution; Charisma)",' +
      '"1:Skill Proficiency (Choose 2 from Arcana, Deception, Insight, Intimidation, Persuasion, Religion)",' +
      '"1:Spellcasting","1:Sorcerous Origin","2:Font Of Magic","3:Metamagic",' +
      '"20:Sorcerous Restoration",' +
      '"features.Draconic Bloodline ? 1:Draconic Resilience",' +
      '"features.Draconic Bloodline ? 6:Elemental Affinity",' +
      '"features.Draconic Bloodline ? 14:Dragon Wings",' +
      '"features.Draconic Bloodline ? 18:Draconic Presence" ' +
    'Selectables=' +
      '"1:Draconic Bloodline (Black):Sorcerous Origin",' +
      '"1:Draconic Bloodline (Blue):Sorcerous Origin",' +
      '"1:Draconic Bloodline (Brass):Sorcerous Origin",' +
      '"1:Draconic Bloodline (Bronze):Sorcerous Origin",' +
      '"1:Draconic Bloodline (Copper):Sorcerous Origin",' +
      '"1:Draconic Bloodline (Gold):Sorcerous Origin",' +
      '"1:Draconic Bloodline (Green):Sorcerous Origin",' +
      '"1:Draconic Bloodline (Red):Sorcerous Origin",' +
      '"1:Draconic Bloodline (Silver):Sorcerous Origin",' +
      '"1:Draconic Bloodline (White):Sorcerous Origin",' +
      '"3:Careful Spell:Metamagic","3:Distant Spell:Metamagic",' +
      '"3:Empowered Spell:Metamagic","3:Extended Spell:Metamagic",' +
      '"3:Heightened Spell:Metamagic","3:Quickened Spell:Metamagic",' +
      '"3:Subtle Spell:Metamagic","3:Twinned Spell:Metamagic" ' +
    'SpellAbility=Charisma ' +
    'SpellSlots=' +
      'S0:4@1;5@4;6@10,' +
      'S1:2@1;3@2;4@3,' +
      'S2:2@3;3@4,' +
      'S3:2@5;3@6,' +
      'S4:1@7;2@8;3@9,' +
      'S5:1@9;2@10;3@18,' +
      'S6:1@11;2@19,' +
      'S7:1@13;2@20,' +
      'S8:1@15,' +
      'S9:1@17 ' +
    'MulticlassPrerequisite="charisma >= 13"',
  'Warlock':
    'HitDie=d8 ' +
    'Features=' +
      '"1:Armor Proficiency (Light)",' +
      '"1:Weapon Proficiency (Simple Weapons)",' +
      '"1:Save Proficiency (Wisdom; Charisma)",' +
      '"1:Skill Proficiency (Choose 2 from Arcana, Deception, History, Intimidation, Investigation, Nature, Religion)",' +
      '"1:Otherworldly Patron","1:Pact Magic","2:Eldritch Invocations",' +
      '"3:Pact Boon","11:Mystic Arcanum","20:Eldritch Master",' +
      '"features.The Fiend ? 1:Dark One\'s Blessing",' +
      '"features.The Fiend ? 6:Dark One\'s Own Luck",' +
      '"features.The Fiend ? 10:Fiendish Resilience",' +
      '"features.The Fiend ? 14:Hurl Through Hell" ' +
    'Selectables=' +
      '"1:The Fiend:Otherworldly Patron",' +
      '"3:Pact Of The Blade:Pact Boon",' +
      '"3:Pact Of The Chain:Pact Boon",' +
      '"3:Pact Of The Tome:Pact Boon",' +
      '"spells.Eldritch Blast(K0 Evoc) ? 2:Agonizing Blast:Eldritch Invocation",' +
      '"2:Armor Of Shadows:Eldritch Invocation",' +
      '"2:Beast Speech:Eldritch Invocation",' +
      '"2:Beguiling Influence:Eldritch Invocation",' +
      '"features.Pact Of The Tome ? 2:Book Of Ancient Secrets",' +
      '"2:Devil\'s Sight:Eldritch Invocation",' +
      '"2:Eldritch Sight:Eldritch Invocation",' +
      '"spells.Eldritch Blast(K0 Evoc) ? 2:Eldritch Spear:Eldritch Invocation",' +
      '"2:Eyes Of The Rune Keeper:Eldritch Invocation",' +
      '"2:Fiendish Vigor:Eldritch Invocation",' +
      '"2:Gaze Of Two Minds:Eldritch Invocation",' +
      '"2:Mask Of Many Faces:Eldritch Invocation",' +
      '"2:Misty Visions:Eldritch Invocation",' +
      '"spells.Eldritch Blast(K0 Evoc) ? 2:Repelling Blast:Eldritch Invocation",' +
      '"2:Thief Of Five Fates:Eldritch Invocation",' +
      '"features.Pact Of The Chain ? 2:Voice Of The Chain Master",' +
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
      '"features.Pact Of The Blade ? 12:Lifedrinker",' +
      '"features.Pact Of The Chain ? 15:Chains Of Carceri",' +
      '"15:Master Of Myriad Forms:Eldritch Invocation",' +
      '"features.Pact Of The Blade ? 5:Thirsting Blade",' +
      '"15:Visions Of Distant Realms:Eldritch Invocation",' +
      '"15:Witch Sight:Eldritch Invocation" ' +
    'SpellAbility=Charisma ' +
    'SpellSlots=' +
      'K0:2@1;3@4;4@10,' +
      'K1:1@1;2@2,' +
      'K2:2@3,' +
      'K3:2@5,' +
      'K4:2@7,' +
      'K5:2@9;3@11;4@17 ' +
    'MulticlassPrerequisite="charisma >= 13"',
  'Wizard':
    'HitDie=d6 ' +
    'Features=' +
      '"1:Weapon Proficiency (Dagger; Dart; Light Crossbow; Quarterstaff; Sling)",' +
      '"1:Save Proficiency (Intelligence; Wisdom)",' +
      '"1:Skill Proficiency (Choose 2 from Arcana, History, Insight, Investigation, Medicine, Religion)",' +
      '"1:Spellcasting","1:Arcane Recovery","2:Arcane Tradition",' +
      '"18:Spell Mastery","20:Signature Spells",' +
      '"features.School Of Evocation ? 2:Evocation Savant",' +
      '"features.School Of Evocation ? 2:Sculpt Spells",' +
      '"features.School Of Evocation ? 6:Potent Cantrip",' +
      '"features.School Of Evocation ? 10:Empowered Evocation",' +
      '"features.School Of Evocation ? 14:Overchannel" ' +
    'Selectables=' +
      '"2:School Of Evocation:Arcane Tradition" ' +
    'SpellAbility=Intelligence ' +
    'SpellSlots=' +
      'W0:3@1;4@4;5@10,' +
      'W1:2@1;3@2;4@3,' +
      'W2:2@3;3@4,' +
      'W3:2@5;3@6,' +
      'W4:1@7;2@8;3@9,' +
      'W5:1@9;2@10;3@18,' +
      'W6:1@11;2@19,' +
      'W7:1@13;2@20,' +
      'W8:1@15,' +
      'W9:1@17 ' +
    'MulticlassPrerequisite="intelligence >= 13"'
};
SRD5E.FEATS = {
  'Ability Boost':'',
  'Grappler':'Require="strength >= 13"'
};
SRD5E.FEATURES = {

  // Race
  'Small':
    'Section=combat Note="Has disadvantage on attacks with heavy weapons"',

  // Dwarf
  'Darkvision':'Section=feature Note="R60\' Sees one light level better"',
  'Dwarf Ability Adjustment':'Section=ability Note="+2 Constitution"',
  'Dwarven Combat Training':
    'Section=combat ' +
    // errata replaces Throwing Hammer with Light Hammer
    'Note="Weapon Proficiency (Battleaxe; Handaxe; Light Hammer; Warhammer)"',
  'Dwarven Resilience':
    'Section=save ' +
    'Note="Has advantage vs. poison and resistance to poison damage"',
  'Steady':'Section=ability Note="Suffers no speed penalty in heavy armor"',
  'Stonecunning':
    'Section=skill ' +
    'Note="+%{proficiencyBonus*(skillProficiency.History?1:2)} History (stonework)"',
  // Hill Dwarf
  'Dwarven Toughness':'Section=combat Note="+%{level} Hit Points"',
  'Hill Dwarf Ability Adjustment':'Section=ability Note="+1 Wisdom"',

  // Elf
  // Darkvision as above
  'Elf Ability Adjustment':'Section=ability Note="+2 Dexterity"',
  'Fey Ancestry':
    'Section=save Note="Has advantage vs. charm and immunity to magical sleep"',
  'Keen Senses':'Section=skill Note="Skill Proficiency (Perception)"',
  'Trance':
    'Section=feature Note="4 hr meditation gives the benefits of 8 hr sleep"',
  // High Elf
  'Cantrip (High Elf)':'Section=magic Note="Knows 1 Wizard cantrip"',
  'Elf Weapon Training':
    'Section=combat ' +
    'Note="Weapon Proficiency (Longbow; Longsword; Shortbow; Shortsword)"',
  'Extra Language':'Section=skill Note="Language (Choose 1 from any)"',
  'High Elf Ability Adjustment':'Section=ability Note="+1 Intelligence"',

  // Halfling
  'Brave':'Section=save Note="Has advantage vs. fright"',
  'Halfling Ability Adjustment':'Section=ability Note="+2 Dexterity"',
  'Halfling Nimbleness':
    'Section=ability ' +
    'Note="Can move through a space occupied by a larger creature"',
  'Lucky (Halfling)':
    'Section=feature ' +
    'Note="Can reroll 1s on attack, ability, and saving throws"',
  // Lightfoot Halfling
  'Lightfoot Halfling Ability Adjustment':'Section=ability Note="+1 Charisma"',
  'Naturally Stealthy':'Section=skill Note="Can hide behind a larger creature"',

  // Human
  'Human Ability Adjustment':
    'Section=ability ' +
    'Note="+1 Charisma/+1 Constitution/+1 Dexterity/+1 Intelligence/+1 Strength/+1 Wisdom"',

  // Dragonborn
  'Breath Weapon':
    'Section=combat Note="%{breathWeaponShape} inflicts %{(level+9)//5}d6 HP %{breathWeaponEnergy} (DC %{8+constitutionModifier+proficiencyBonus} %{breathWeaponEnergy=~\'cold|poison\'?\'Constitution\':\'Dexterity\'} half)"',
  'Damage Resistance':
    'Section=save Note="Has resistance to %{breathWeaponEnergy} damage"',
  'Draconic Ancestry':'Section=feature Note="1 selection"',
  'Dragonborn Ability Adjustment':
    'Section=ability Note="+2 Strength/+1 Charisma"',

  // Gnome
  // Darkvision as above
  'Gnome Ability Adjustment':'Section=ability Note="+2 Intelligence"',
  'Gnome Cunning':
    'Section=save ' +
    'Note="Has advantage on Charisma, Intelligence, and Wisdom vs. magic"',
  // Rock Gnome
  "Artificer's Lore":
    'Section=skill ' +
    'Note="+%{proficiencyBonus*(skillProficiency.History?1:2)} History (magic, alchemical, and technological objects)"',
  'Rock Gnome Ability Adjustment':'Section=ability Note="+1 Constitution"',
  'Tinker':
    'Section=feature,skill ' +
    'Note=' +
      '"Tool Proficiency (Tinker\'s Tools)",' +
      '"Can use Tinker\'s Tools to create a tiny clockwork device in 1 hr"',

  // Half-Elf
  'Half-Elf Ability Adjustment':
    'Section=ability Note="+2 Charisma/Ability Boost (Choose 2 from any)"',
  // Darkvision as above
  // Fey Ancestry as above
  'Skill Versatility':
    'Section=skill Note="Skill Proficiency (Choose 2 from any)"',

  // Half-Orc
  // Darkvision as above
  'Half-Orc Ability Adjustment':
    'Section=ability Note="+2 Strength/+1 Constitution"',
  'Menacing':'Section=skill Note="Skill Proficiency (Intimidation)"',
  'Relentless Endurance':
    'Section=combat Note="Can retain 1 hit point when brought to 0 hit points once per long rest"',
  'Savage Attacks':
    'Section=combat ' +
    'Note="Melee critical hits inflict 1 additional die of damage"',

  // Tiefling
  // Darkvision as above
  'Tiefling Ability Adjustment':
    'Section=ability Note="+2 Charisma/+1 Intelligence"',
  'Hellish Resistance':
    'Section=save Note="Has resistance to fire damage"',
  'Infernal Legacy':
    'Section=magic ' +
    // errata replaces once per day with once per long rest
    'Note="Knows the <i>Thaumaturgy</i> cantrip%{level<3?\'\':level<5?\' and can cast <i>Hellish Rebuke</i> once per long rest\':\' and can cast <i>Hellish Rebuke</i> and <i>Darkness</i> once per long rest\'}" ' +
    'Spells=Thaumaturgy,"3:Hellish Rebuke",5:Darkness ' +
    'SpellAbility=Charisma',

  // Class

  // Barbarian
  'Brutal Critical':
    'Section=combat ' +
    'Note="Melee critical hits inflict %{(levels.Barbarian-5)//4} additional %{levels.Barbarian<13?\'die\':\'dice\'} of damage"',
  'Danger Sense':
    'Section=save Note="Has advantage on Dexterity vs. visible dangers"',
  'Extra Attack':'Section=combat Note="+%V Attacks Per Round"',
  'Fast Movement':'Section=ability Note="+10 Speed; heavy armor negates"',
  'Feral Instinct':
    'Section=combat ' +
    'Note="Has advantage on initiative/Can rage and then act when surprised"',
  'Indomitable Might':
    'Section=ability Note="Scores a minimum of %{strength} on Strength checks"',
  'Persistent Rage':
    'Section=combat Note="Can continue raging when unengaged with any foe"',
  'Primal Champion':'Section=ability Note="+4 Strength/+4 Constitution"',
  'Primal Path':'Section=feature Note="1 selection"',
  'Rage':
    'Section=ability,combat,feature,magic,save ' +
    'Note=' +
      '"Has advantage on Strength checks during rage",' +
      '"+%{levels.Barbarian<9?2:levels.Barbarian<16?3:4} damage with Strength melee weapons during rage",' +
      '"Can use rage features for 1 min %{levels.Barbarian<3?2:levels.Barbarian<6?3:levels.Barbarian<12?4:levels.Barbarian<17?5:levels.Barbarian<20?6:\'unlimited\'} times per long rest; heavy armor negates benefits",' +
      '"Cannot cast or concentrate on spells during rage",' +
      '"Has advantage on Strength saves and resistance to bludgeoning, piercing, and slashing damage during rage"',
  'Reckless Attack':
    'Section=combat ' +
    'Note="During rage, can suffer foe advantage on attacks to gain advantage on Strength melee attacks for 1 rd"',
  'Relentless Rage':
    'Section=save ' +
    'Note="Can make a DC 10 Constitution save to retain 1 hit point when brought to 0 hit points; each use adds 5 to the DC until a short rest"',
  'Unarmored Defense (Barbarian)':
    'Section=combat Note="+%{constitutionModifier} Armor Class in no armor"',
  // Berserker
  'Frenzy':
    'Section=combat ' +
    'Note="Can use a bonus action to attack with a melee weapon each rd during rage; suffers 1 level of exhaustion after rage"',
  'Intimidating Presence':
    'Section=feature ' +
    'Note="R30\' Can use an action to inflict frightened on a target (DC %{charismaModifier+8+proficiencyBonus} Wisdom neg) and additional actions to extend each rd; ends if the target moves out of sight or more than 60\' away"',
  'Mindless Rage':'Section=save Note="Immune to charm and fright during rage"',
  'Retaliation':
    'Section=combat ' +
    'Note="Can use a reaction to make a melee attack on a successful attacker"',

  // Bard
  'Bard College':'Section=feature Note="1 selection"',
  'Bardic Inspiration':
    'Section=feature ' +
    'Note="R60\' Can use a bonus action to give an ally a +1d%{bardicInspirationDie} bonus on an ability, attack, or saving throw within 10 min %{charismaModifier>1?charismaModifier + \' times\':\'once\'} per %{featureNotes.fontOfInspiration?\'short\':\'long\'} rest"',
  'Countercharm':
    'Section=magic ' +
    'Note="R30\' Performance gives friendly listeners advantage on saves vs. charm and fright for 1 rd"',
  'Expertise (Bard)':
    'Section=skill ' +
    'Note="+%{proficiencyBonus} on %{levels.Bard<10?2:4} chosen proficient skills"',
  'Font Of Inspiration':
    'Section=feature Note="Bardic Inspiration refreshes after a short rest"',
  'Jack Of All Trades':
    'Section=ability ' +
    'Note="+%{proficiencyBonus//2} on non-proficient ability checks"',
  'Magical Secrets':
    'Section=magic ' +
    'Note="Can learn %{(levels.Bard-6)//4*2} additional spells from any class"',
  'Song Of Rest':
    'Section=magic ' +
    // errata specifies spending Hit Dice
    'Note="Friendly listeners regain +1d%{levels.Bard>=9?6+(levels.Bard-5)//4*2:6} hit points from spending Hit Dice after a short rest"',
  'Spellcasting':
    'Section=magic ' +
    'Note="Can cast spells from the %V spell list%{magicNotes.spellcasting.1?\' and cast spells marked with [R] using a ritual\':\'\'}"',
  'Superior Inspiration':
    'Section=combat ' +
    'Note="Has a minimum of 1 use of Bardic Inspiration available after initiative"',
  // College Of Lore
  'Additional Magical Secrets':
    'Section=magic Note="Can learn 2 additional spells from any class"',
  'Bonus Proficiencies (College Of Lore)':
    'Section=skill Note="Skill Proficiency (Choose 3 from any)"',
  'Cutting Words':
    'Section=combat ' +
    'Note="R60\' Can use a reaction to subtract a Bardic Inspiration die from a foe roll"',
  'Peerless Skill':
    'Section=ability ' +
    'Note="Can add a Bardic Inspiration die to a self ability check"',

  // Cleric
  'Channel Divinity':
    'Section=feature ' +
    'Note="Can use a Channel Divinity effect %{featureNotes.channelDivinity.1>1 ? featureNotes.channelDivinity.1 + \' times\': \'once\'} per short rest"',
  'Destroy Undead':
    'Section=combat ' +
    'Note="Turning destroys undead up to CR %{levels.Cleric>=8?(levels.Cleric-5)//3<?4:0.5}"',
  'Divine Domain':'Section=feature Note="1 selection"',
  'Divine Intervention':
    'Section=magic ' +
    'Note="Has a %{levels.Cleric<20?levels.Cleric:100}% chance to gain help from %{deity} once per week"',
  'Life Domain':
    'Spells=' +
      '"1:Bless","1:Cure Wounds",' +
      '"3:Lesser Restoration","3:Spiritual Weapon",' +
      '"5:Beacon Of Hope","5:Revivify",' +
      '"7:Death Ward","7:Guardian Of Faith",' +
      '"9:Mass Cure Wounds","9:Raise Dead"',
  // Spellcasting as above
  'Supreme Healing':
    'Section=magic ' +
    'Note="Healing spells restore the maximum possible hit points"',
  'Turn Undead':
    'Section=combat ' +
    'Note="R30\' Can use Channel Divinity to make undead flee (DC %{spellDifficultyClass.C} Wisdom neg) for 1 min"',
  // Life Domain
  'Blessed Healer':
    'Section=magic ' +
    'Note="Casting a healing spell restores 2 + spell level hit points to self"',
  'Bonus Proficiency (Life Domain)':
    'Section=combat Note="Armor Proficiency (Heavy)"',
  'Disciple Of Life':
    'Section=magic ' +
    'Note="Casting a healing spell restores an additional 2 + spell level hit points"',
  'Divine Strike':
    'Section=combat ' +
    'Note="Weapon inflicts +%{levels.Cleric<14?1:2}d8 HP %{divineStrikeDamageType} once per rd"',
  'Preserve Life':
    'Section=magic ' +
    'Note="R30\' Can use Channel Divinity to restore %{levels.Cleric*5} hit points among targets, up to half maximum hit points each"',

  // Druid
  'Archdruid':
    'Section=magic,magic ' +
    'Note=' +
      '"Can use Wild Shape at will",' +
      '"Casting spells requires no verbal, somatic, or cost-free material components"',
  'Beast Spells':'Section=magic Note="Can cast spells during Wild Shape"',
  'Druid Circle':'Section=feature Note="1 selection"',
  'Druidic':
    'Section=skill Note="Speaks a secret language known only by druids"',
  // Spellcasting as above
  'Timeless Body (Druid)':'Section=feature Note="Ages at 1/10 normal rate"',
  'Wild Shape':
    'Section=magic ' +
    'Note="Can transform into a CR %V%{levels.Druid<4?\' (land only)\':levels.Druid<8?\' (non-flying)\':\'\'} creature for %{levels.Druid//2} hr %{magicNotes.archdruid?\'unlimited\':2} times per short rest"',
  // Circle Of The Land
  'Bonus Cantrip (Circle Of The Land)':
    'Section=magic Note="Knows an additional Druid cantrip"',
  'Circle Of The Land (Arctic)':
    'Spells=' +
      '"3:Hold Person","3:Spike Growth",' +
      '"5:Sleet Storm","5:Slow",' +
      '"7:Freedom Of Movement","7:Ice Storm",' +
      '"9:Commune With Nature","9:Cone Of Cold"',
  'Circle Of The Land (Coast)':
    'Spells=' +
      '"3:Mirror Image","3:Misty Step",' +
      '"5:Water Breathing","5:Water Walk",' +
      '"7:Control Water","7:Freedom Of Movement",' +
      '"9:Conjure Elemental","9:Scrying"',
  'Circle Of The Land (Desert)':
    'Spells=' +
      '"3:Blur","3:Silence",' +
      '"5:Create Food And Water","5:Protection From Energy",' +
      '"7:Blight","7:Hallucinatory Terrain",' +
      '"9:Insect Plague","9:Wall Of Stone"',
  'Circle Of The Land (Forest)':
    'Spells=' +
      '"3:Barkskin","3:Spider Climb",' +
      '"5:Call Lightning","5:Plant Growth",' +
      '"7:Divination","7:Freedom Of Movement",' +
      '"9:Commune With Nature","9:Tree Stride"',
  'Circle Of The Land (Grassland)':
    'Spells=' +
      '"3:Invisibility","3:Pass Without Trace",' +
      '"5:Daylight","5:Haste",' +
      '"7:Divination","7:Freedom Of Movement",' +
      '"9:Dream","9:Insect Plague"',
  'Circle Of The Land (Mountain)':
    'Spells=' +
      '"3:Spider Climb","3:Spike Growth",' +
      '"5:Lightning Bolt","5:Meld Into Stone",' +
      '"7:Stone Shape","7:Stoneskin",' +
      '"9:Passwall","9:Wall Of Stone"',
  'Circle Of The Land (Swamp)':
    'Spells=' +
      '"3:Acid Arrow","3:Darkness",' +
      '"5:Water Walk","5:Stinking Cloud",' +
      '"7:Freedom Of Movement","7:Locate Creature",' +
      '"9:Insect Plague","9:Scrying"',
  'Circle Spells':'Section=magic Note="Has access to terrain-specific spells"',
  "Land's Stride":
    'Section=ability,save ' +
    'Note=' +
      '"Can move normally through difficult terrain and nonmagical plants",' +
      '"Has advantage vs. impeding plants"',
  'Natural Recovery':
    'Section=magic ' +
    'Note="Can recover %{(levels.Druid+1)//2} spell slot levels (level 6 maximum) during a short rest once per long rest"',
  "Nature's Sanctuary":
    'Section=combat ' +
    'Note="Beasts and plants cannot attack self (DC %{wisdomModifier+8+proficiencyBonus} Wisdom neg for 24 hr)"',
  "Nature's Ward":
    'Section=save ' +
    'Note="Has immunity to disease, poison, and elemental and fey charm and fright"',

  // Fighter
  'Action Surge':
    'Section=combat ' +
    'Note="Can take an extra action %{levels.Fighter<17?\'once\':\'twice\'} per short rest"',
  // Extra Attack as above
  'Fighting Style':
    'Section=feature ' +
    'Note="%V selection%{featureNotes.fightingStyle>1?\'s\':\'\'}"',
  'Fighting Style (Archery)':'Section=combat Note="+2 ranged attacks"',
  'Fighting Style (Defense)':'Section=combat Note="+1 Armor Class in armor"',
  'Fighting Style (Dueling)':
    'Section=combat Note="+2 damage with a single, one-handed melee weapon"',
  'Fighting Style (Great Weapon Fighting)':
    'Section=combat Note="Can reroll 1s and 2s on two-handed weapon damage"',
  'Fighting Style (Protection)':
    'Section=combat ' +
    'Note="Can use a reaction and a shield to inflict disadvantage on attacks targeting an adjacent creature"',
  'Fighting Style (Two-Weapon Fighting)':
    'Section=combat Note="Adds ability modifier to second attack damage"',
  'Indomitable':
    'Section=save ' +
    'Note="Can reroll a failed save %{levels.Fighter<13?\'once\':level.Fighter<17?\'twice\':\'3 times\'} per long rest"',
  'Martial Archetype':'Section=feature Note="1 selection"',
  'Second Wind':
    'Section=combat ' +
    'Note="Can use a bonus action to regain 1d10+%{levels.Fighter} hit points once per short rest"',
  // Champion
  'Additional Fighting Style':
    'Section=feature Note="Can select a second Fighting Style"',
  'Improved Critical':
    'Section=combat Note="Scores a critical hit on a natural 19"',
  'Remarkable Athlete':
    'Section=ability,skill ' +
    'Note=' +
      '"+%{proficiencyBonus//2} on non-proficient Strength, Dexterity, and Constitution checks",' +
      '"+%{strengthModifier}\' running jump distance"',
  'Superior Critical':
    'Section=combat Note="Scores a critical hit on a natural 18"',
  'Survivor':
    'Section=combat ' +
    'Note="Regains %{constitutionModifier+5} hit points each rd when between 1 and %{hitPoints//2} hit points"',

  // Monk
  'Deflect Missiles':
    'Section=combat ' +
    'Note="Can use a reaction to reduce missile damage by 1d10+%{levels.Monk+dexterityModifier} HP; reducing it to 0 hit points allows spending 1 Ki Point to make an immediate attack"',
  'Diamond Soul':
    'Section=save,save ' +
    'Note=' +
      '"Proficient on all saves",' +
      '"Can spend 1 Ki Point to reroll a save"',
  'Empty Body':
    'Section=magic ' +
    'Note="Can spend 4 Ki Points to become invisible and gain resistance to all damage other than force for 1 min/Can spend 8 Ki Points to cast <i>Astral Projection</i> on self" ' +
    'Spells="Astral Projection"',
  'Evasion':
    'Section=save ' +
    'Note="Successful Dexterity saves yield no damage instead of half, and failures yield half damage"',
  // Extra Attack as above
  'Flurry Of Blows':
    'Section=combat ' +
    'Note="Can spend 1 Ki Point to make 2 unarmed strikes as a bonus action"',
  'Ki':'Section=feature Note="Can use %{levels.Monk} Ki Points per short rest"',
  'Ki-Empowered Strikes':
    'Section=combat Note="Unarmed attacks count as magical"',
  'Martial Arts':
    'Section=combat,combat ' +
    'Note=' +
      '"When unarmored, gains +%1 attack and damage with monk weapons and raises damage die to 1d%V",' +
      '"When unarmored, can use a bonus action to make an unarmed strike after a monk weapon attack"',
  'Monastic Tradition':'Section=feature Note="1 selection"',
  'Patient Defense':
    'Section=combat Note="Can spend 1 Ki Point to Dodge as a bonus action"',
  'Perfect Self':
    'Section=combat ' +
    'Note="Has a minimum of 4 Ki Points available after initiative"',
  'Purity Of Body':'Section=save Note="Has immunity to disease and poison"',
  'Slow Fall':
    'Section=ability ' +
    'Note="Can use a reaction to reduce falling damage by %{levels.Monk*5} HP"',
  'Step Of The Wind':
    'Section=combat ' +
    'Note="Can spend 1 Ki Point to double jump distance and to Disengage or Dash as a bonus action"',
  'Stillness Of Mind':
    'Section=save ' +
    'Note="Can use an action to end charm or fright affecting self"',
  'Stunning Strike':
    'Section=combat ' +
    'Note="Can spend 1 Ki Point after a successful attack to stun the target (DC %{kiSaveDC} Constitution neg) for 1 rd"',
  'Timeless Body (Monk)':
    'Section=feature ' +
    'Note="Suffers no debility from aging and needs no food or water"',
  'Tongue Of The Sun And Moon':
    'Section=feature Note="Can communicate in any language"',
  'Unarmored Defense (Monk)':
    'Section=combat Note="+%{wisdomModifier} Armor Class in no armor"',
  'Unarmored Movement':
    'Section=ability,ability ' +
    'Note=' +
      '"+%{(levels.Monk+6)//4*5} Speed in no armor",' +
      '"Can move across vertical surfaces and liquids"',
  // Way Of The Open Hand
  'Open Hand Technique':
    'Section=combat ' +
    'Note="Can use Flurry of Blows to inflict a choice of knocked prone (DC %{kiSaveDC} Dexterity neg), a 15\' push (DC %{kiSaveDC} Strength neg), or loss of reactions for 1 rd"',
  'Quivering Palm':
    'Section=combat ' +
    'Note="Can spend 3 Ki Points after a successful unarmed attack to reduce a foe to 0 hit points at any time within %{levels.Monk} days (DC %{kiSaveDC} Constitution inflicts 10d10 HP necrotic)"',
  'Tranquility':
    'Section=magic ' +
    'Note="Can gain <i>Sanctuary</i> effects between long rests (DC %{kiSaveDC} Wisdom neg)" ' +
    'Spells=Sanctuary',
  'Wholeness Of Body':
    'Section=feature Note="Can use an action to regain %{levels.Monk*3} hit points once per long rest"',

  // Paladin
  'Aura Of Courage':
    'Section=save ' +
    'Note="R%{levels.Paladin<18?10:30}\' Self and allies have immunity to fright"',
  'Aura Of Protection':
    'Section=save ' +
    'Note="R%{levels.Paladin<18?10:30}\' Self and allies +%{charismaModifier>?1} all saves"',
  // Channel Divinity as above
  'Cleansing Touch':
    'Section=magic ' +
    'Note="Can dispel a spell effect on a touched willing creature %{charismaModifier>1?charismaModifier+\' times\':\'once\'} per long rest"',
  'Divine Health':'Section=save Note="Has immunity to disease"',
  'Divine Sense':
    'Section=magic ' +
    'Note="R60\' Can discern the location of celestials, fiends, and undead for 1 rd %{charismaModifier!=0?(charismaModifier+1)+\' times\':\'once\'} per long rest"',
  'Divine Smite':
    'Section=combat ' +
    'Note="Can spend a spell slot after a successful melee attack to inflict +(slot level + 1)d8 HP radiant (maximum 5d8 HP; +1d8 HP vs. undead and fiends)"',
  // Extra Attack as above
  // Fighting Style as above
  'Improved Divine Smite':
    'Section=combat Note="Melee attacks inflict +1d8 HP radiant"',
  'Lay On Hands':
    'Section=magic ' +
    'Note="Can heal %{levels.Paladin*5} hit points per long rest and can use 5 hit points\' worth to cure disease or poison"',
  'Sacred Oath':'Section=feature Note="1 selection"',
  // Spellcasting as above
  // Oath Of Devotion
  'Aura Of Devotion':
    'Section=save ' +
    'Note="R%{levels.Paladin<18?10:30}\' Self and allies have immunity to charm"',
  'Holy Nimbus':
    'Section=combat,save ' +
    'Note=' +
      '"Emits a 30\' bright light that inflicts 10 HP radiant to foes for 1 min once per long rest",' +
      '"Gives advantage on saves vs. spells by fiends and undead for 1 min once per long rest"',
  'Oath Of Devotion':
    'Spells=' +
      '"3:Protection From Evil And Good","3:Sanctuary",' +
      '"5:Lesser Restoration","5:Zone Of Truth",' +
      '"9:Beacon Of Hope","9:Dispel Magic",' +
      '"13:Freedom Of Movement","13:Guardian Of Faith",' +
      '"17:Commune","17:Flame Strike"',
  'Purity Of Spirit':
    'Section=magic ' +
    'Note="Has a continuous <i>Protection From Evil And Good</i> effect" ' +
    'Spells="Protection From Evil And Good"',
  'Sacred Weapon':
    'Section=combat ' +
    'Note="Can use Channel Divinity to give a weapon +%{charismaModifier>?1} attack and 20\' bright light for 1 min"',
  'Turn The Unholy':
    'Section=combat ' +
    'Note="R30\' Can use Channel Divinity to make fiends and undead flee (DC %{spellDifficultyClass.P} Wisdom neg) for 1 min"',

  // Ranger
  // Extra Attack as above
  'Favored Enemy':
    'Section=skill ' +
    'Note="Has advantage on Survival to track and on Intelligence to recall info about %{levels.Ranger<6?1:levels.Ranger<14?2:3} chosen creature types, and can learn any languages they speak"',
  'Feral Senses':
    'Section=combat,skill ' +
    'Note=' +
      '"Suffers no disadvantage vs. an invisible foe",' +
      '"R30\' Can locate invisible creatures"',
  // Fighting Style as above
  'Foe Slayer':
    'Section=combat ' +
    'Note="Can gain a choice of +%{wisdomModifier} attack or damage vs. a favored enemy once per rd"',
  'Hide In Plain Sight':
    'Section=skill ' +
    'Note="+10 Stealth to hide using prepared camouflage; moving or taking an action or reaction ends"',
  // Land's Stride as above
  'Natural Explorer':
    'Section=skill ' +
    'Note="Doubles Proficiency on Intelligence and Wisdom skills, moves normally through difficult terrain, never becomes lost, always remains alert, can stealth alone at full speed, locates double food, and gains extra info from tracking in %{levels.Ranger<6?1:levels.Ranger<10?2:3} chosen terrain types"',
  'Primeval Awareness':
    'Section=magic ' +
    'Note="Can spend a spell slot to sense creatures in a 1 mile radius, or in a 6 mile radius of favored terrain, for 1 min per slot level"',
  'Ranger Archetype':'Section=feature Note="1 selection"',
  // Spellcasting as above
  'Vanish':
    'Section=skill Note="Can hide as a bonus action/Untrackable nonmagically"',
  // Hunter
  'Colossus Slayer':
    'Section=combat ' +
    'Note="Can inflict +1d8 HP damage vs. an already-injured foe once per rd"',
  'Defensive Tactics':'Section=feature Note="1 selection"',
  'Escape The Horde':
    'Section=combat ' +
    'Note="Foes have disadvantage on opportunity attacks targeting self"',
  // Evasion as above
  'Giant Killer':
    'Section=combat ' +
    'Note="Can use a reaction to attack an adjacent Large or larger foe after it misses self"',
  'Horde Breaker':
    'Section=combat ' +
    'Note="Can make a second attack on a different adjacent foe once per rd"',
  "Hunter's Prey":'Section=feature Note="1 selection"',
  'Multiattack':'Section=feature Note="1 selection"',
  'Multiattack Defense':
    'Section=combat ' +
    'Note="After a successful foe attack, gains +4 Armor Class vs. additional attacks from the same foe in same rd"',
  'Stand Against The Tide':
    'Section=combat ' +
    'Note="Can use a reaction to redirect a foe melee miss to another creature"',
  'Steel Will':'Section=save Note="Has advantage vs. fright"',
  "Superior Hunter's Defense":'Section=feature Note="1 selection"',
  'Uncanny Dodge':
    'Section=combat ' +
    'Note="Can use a reaction to reduce damage taken from an attack by half"',
  'Volley':
    'Section=combat ' +
    'Note="Can make a ranged attack on any number of foes in a 10\' radius"',
  'Whirlwind Attack':
    'Section=combat ' +
    'Note="Can make a melee attack on any number of adjacent foes"',

  // Rogue
  'Blindsense':
    'Section=skill ' +
    'Note="R10\' Knows the location of hidden and invisible creatures"',
  'Cunning Action':
    'Section=combat ' +
    'Note="Can use a bonus action to Dash, Disengage, or Hide once per rd"',
  'Elusive':'Section=combat Note="Attacks on self never have advantage"',
  // Evasion as above
  'Expertise (Rogue)':
    'Section=skill ' +
    'Note="+%{proficiencyBonus} on %{levels.Rogue<6?2:4} chosen proficient skills or Thieves\' Tools"',
  'Reliable Talent':
    'Section=ability Note="Scores at least a 10 on proficient ability rolls"',
  'Roguish Archetype':'Section=feature Note="1 selection"',
  'Slippery Mind':'Section=save Note="Save Proficiency (Wisdom)"',
  'Sneak Attack':
    'Section=combat ' +
    'Note="+%{(levels.Rogue+1)//2}d6 damage on attacks with advantage or on a foe threatened by another adjacent creature"',
  'Stroke Of Luck':
    'Section=combat ' +
    'Note="Can change a miss into a hit or take an automatic 20 on an ability check once per short rest"',
  "Thieves' Cant":
    'Section=skill Note="Understands jargon and signs known only by rogues"',
  // Uncanny Dodge as above
  // Thief
  'Fast Hands':
    'Section=combat ' +
    'Note="Can use the Cunning Action bonus action to use Sleight Of Hand, disarm a trap, open a lock, or Use An Object"',
  'Second-Story Work':
    'Section=ability,skill ' +
    'Note=' +
      '"Can climb at full speed",' +
      '"+%{dexterityModifier}\' running jump distance"',
  'Supreme Sneak':
    'Section=skill Note="Has advantage on Stealth when moving at half speed"',
  "Thief's Reflexes":
    'Section=combat ' +
    'Note="Can take an second turn during the first combat round at initiative - 10"',
  'Use Magic Device':
    'Section=skill ' +
    'Note="Ignores class, race, and level restrictions on magic device use"',

  // Sorcerer
  'Careful Spell':
    'Section=magic ' +
    'Note="Can spend 1 Sorcery Point to give %{charismaModifier>?1} creatures a successful save on a self spell"',
  'Distant Spell':
    'Section=magic ' +
    'Note="Can spend 1 Sorcery Point to double the range of a spell or to give a touch spell a 30\' range"',
  'Empowered Spell':
    'Section=magic ' +
    'Note="Can spend 1 Sorcery Point to reroll %{charismaModifier>?1} spell damage dice"',
  'Extended Spell':
    'Section=magic ' +
    'Note="Can spend 1 Sorcery Point to double the duration of a spell, up to 24 hr maximum"',
  'Font Of Magic':
    'Section=magic ' +
    'Note="Can use %V Sorcery Points per long rest/Can use a bonus action to convert between Sorcery Points and spell slots"',
  'Heightened Spell':
    'Section=magic ' +
    'Note="Can spend 3 Sorcery Points to inflict target disadvantage on the initial save vs. a self spell"',
  'Metamagic':'Section=feature Note="%V selections"',
  'Quickened Spell':
    'Section=magic ' +
    'Note="Can spend 2 Sorcery Points to cast a 1-action spell as bonus action"',
  'Sorcerous Origin':'Section=feature Note="1 selection"',
  'Sorcerous Restoration':
    'Section=magic Note="Taking a short rest restores 4 Sorcery Points"',
  // Spellcasting as above
  'Subtle Spell':
    'Section=magic ' +
    'Note="Can spend 1 Sorcery Point to cast a spell without somatic or verbal components"',
  'Twinned Spell':
    'Section=magic ' +
    'Note="Can spend Sorcery Points equal to the level of a spell to add a second target"',
  // Draconic Bloodline
  'Draconic Bloodline':
    'Section=skill,skill ' +
    'Note=' +
      '"Language (Draconic)",' +
      '"+%{proficiencyBonus} on Charisma checks with dragons"',
  'Draconic Presence':
    'Section=magic ' +
    'Note="R60\' Can spend 5 Sorcery Points to gain an aura that inflicts a choice of charm or fright (DC %{spellDifficultyClass.S} Wisdom neg for 24 hr) for concentration up to 1 min"',
  'Draconic Resilience':
    'Section=combat ' +
    'Note="+%{levels.Sorcerer} Hit Points/Armor Class %{dexterityModifier+13} in no armor"',
  'Dragon Wings':
    'Section=ability ' +
    'Note="Can use a bonus action to gain a %{speed}\' fly Speed"',
  'Elemental Affinity':
    'Section=magic,save ' +
    'Note=' +
      '"Spells that deal %{draconicDamage} damage inflict +%{charismaModifier} HP",' +
      '"Can spend 1 Sorcery Point to gain resistance to %{draconicDamage} for 1 hr"',

  // Warlock
  'Eldritch Invocations':'Section=magic Note="%V selections"',
  'Eldritch Master':
    'Section=magic Note="Can recover expended spell slots once per long rest"',
  'Otherworldly Patron':'Section=feature Note="1 selection"',
  'Mystic Arcanum':
    'Section=magic ' +
    'Note="Can cast %{levels.Warlock>12?\'chosen K6\'+(levels.Warlock<15?\' and K7\':levels.Warlock<17?\', K7, and K8\':\', K7, K8, and K9\')+\' spells\':\'a chosen K6 spell\'} without using a spell slot once per long rest"',
  'Pact Boon':'Section=feature Note="1 selection"',
  'Pact Magic':
    'Section=magic Note="Can cast spells from the warlock spell list"',
  'Pact Of The Blade':
    'Section=magic ' +
    'Note="Can use an action to conjure a magic weapon or use a 1 hr ritual to make a magic weapon summonable"',
  'Pact Of The Chain':
    'Section=combat,magic ' +
    'Note=' +
      // errata specifies that the attack is a reaction
      '"Can forego one attack to allow familiar to attack as a reaction",' +
      '"Can cast <i>Find Familiar</i> as a ritual" ' +
    'Spells="Find Familiar"',
  'Pact Of The Tome':
    'Section=magic ' +
    'Note="Has a <i>Book Of Shadows</i> containing 3 chosen cantrips from any spell lists that can be cast at will"',
  // The Fiend
  "Dark One's Blessing":
    'Section=combat ' +
    'Note="Reducing a foe to 0 hit points gives self %{(levels.Warlock+charismaModifier)>?1} temporary hit points"',
  "Dark One's Own Luck":
    'Section=feature ' +
    'Note="Can add 1d10 to an ability or save roll once per short rest"',
  'Fiendish Resilience':
    'Section=save ' +
    'Note="At the end of a rest, can gain resistance to a chosen damage type from non-magical and non-silver weapons"',
  'Hurl Through Hell':
    'Section=combat ' +
    'Note="After a successful attack, can inflict 10d10 HP psychic and cause the target to disappear for 1 rd once per long rest"',
  // Eldritch Invocations
  'Agonizing Blast':
    'Section=magic ' +
    'Note="<i>Eldritch Blast</i> inflicts +%{charismaModifier} HP"',
  'Armor Of Shadows':
    'Section=magic ' +
    'Note="Can cast <i>Mage Armor</i> on self at will" ' +
    'Spells="Mage Armor"',
  'Ascendant Step':
    'Section=magic ' +
    'Note="Can cast <i>Levitate</i> on self at will" ' +
    'Spells=Levitate',
  'Beast Speech':
    'Section=magic ' +
    'Note="Can cast <i>Speak With Animals</i> at will" ' +
    'Spells="Speak With Animals"',
  'Beguiling Influence':
    'Section=skill Note="Skill Proficiency (Deception; Persuasion)"',
  'Bewitching Whispers':
    'Section=magic ' +
    'Note="Can use a Warlock spell slot to cast <i>Compulsion</i> once per long rest" ' +
    'Spells=Compulsion',
  'Book Of Ancient Secrets':
    'Section=magic ' +
    'Note="Has 2 1st-level spell rituals inscribed in a <i>Book Of Shadows</i> and can inscribe additional rituals"',
  'Chains Of Carceri':
    'Section=magic ' +
    'Note="Can cast <i>Hold Monster</i> at will on celestials, elementals, and fiends once per long rest per creature" ' +
    'Spells="Hold Monster"',
  "Devil's Sight":'Section=feature Note="R120\' Sees normally in darkness"',
  'Dreadful Word':
    'Section=magic ' +
    'Note="Can use a Warlock spell slot to cast <i>Confusion</i> once per long rest" ' +
    'Spells=Confusion',
  'Eldritch Sight':
    'Section=magic ' +
    'Note="Can cast <i>Detect Magic</i> at will" ' +
    'Spells="Detect Magic"',
  'Eldritch Spear':
    'Section=magic Note="Increases <i>Eldritch Blast</i> range to 300\'"',
  'Eyes Of The Rune Keeper':'Section=feature Note="Can read all writing"',
  'Fiendish Vigor':
    'Section=magic ' +
    'Note="Can cast <i>False Life</i> on self at will" ' +
    'Spells="False Life"',
  'Gaze Of Two Minds':
    'Section=magic ' +
    'Note="Touch allows self to perceive through the senses of a willing humanoid while maintained"',
  'Lifedrinker':
    'Section=combat ' +
    'Note="Pact weapon inflicts +%{charismaModifier>?1} HP necrotic"',
  'Mask Of Many Faces':
    'Section=magic ' +
    'Note="Can cast <i>Disguise Self</i> at will" ' +
    'Spells="Disguise Self"',
  'Master Of Myriad Forms':
    'Section=magic ' +
    'Note="Can cast <i>Alter Self</i> at will" ' +
    'Spells="Alter Self"',
  'Minions Of Chaos':
    'Section=magic ' +
    'Note="Can use a Warlock spell slot to cast <i>Conjure Elemental</i> once per long rest" ' +
    'Spells="Conjure Elemental"',
  'Mire The Mind':
    'Section=magic ' +
    'Note="Can use a Warlock spell slot to cast <i>Slow</i> once per long rest" ' +
    'Spells=Slow',
  'Misty Visions':
    'Section=magic ' +
    'Note="Can cast <i>Silent Image</i> at will" ' +
    'Spells="Silent Image"',
  'One With Shadows':
    'Section=magic ' +
    'Note="Can become invisible in dim light; moving or taking an action or reaction ends"',
  'Otherworldly Leap':
    'Section=magic ' +
    'Note="Can cast <i>Jump</i> on self at will" ' +
    'Spells=Jump',
  'Repelling Blast':
    'Section=magic Note="Can inflict a 10\' push with a successful <i>Eldritch Blast</i>"',
  'Sculptor Of Flesh':
    'Section=magic ' +
    'Note="Can use a Warlock spell slot to cast <i>Polymorph</i> once per long rest" ' +
    'Spells=Polymorph',
  'Sign Of Ill Omen':
    'Section=magic ' +
    'Note="Can use a Warlock spell slot to cast <i>Bestow Curse</i> once per long rest" ' +
    'Spells="Bestow Curse"',
  'Thief Of Five Fates':
    'Section=magic ' +
    'Note="Can use a warlock spell slot to cast <i>Bane</i> once per long rest" ' +
    'Spells=Bane',
  'Thirsting Blade':
    'Section=combat Note="Attack action with a pact blade allows 2 attacks"',
  'Visions Of Distant Realms':
    'Section=magic ' +
    'Note="Can cast <i>Arcane Eye</i> at will" ' +
    'Spells="Arcane Eye"',
  'Voice Of The Chain Master':
    'Section=feature ' +
    'Note="Can perceive and speak through familiar and communicate telepathically with it"',
  'Whispers Of The Grave':
    'Section=magic ' +
    'Note="Can cast <i>Speak With Dead</i> at will" ' +
    'Spells="Speak With Dead"',
  'Witch Sight':'Section=feature Note="R30\' Sees true forms"',

  // Wizard
  'Arcane Recovery':
    'Section=magic ' +
    'Note="Can recover %{(levels.Wizard+1)//2} spell slot levels (level 6 maximum) during a short rest once per long rest"',
  'Arcane Tradition':'Section=feature Note="1 selection"',
  'Signature Spells':
    'Section=magic ' +
    'Note="Can cast 2 chosen W3 spells without spending a spell slot once per short rest"',
  'Spell Mastery':
    'Section=magic ' +
    'Note="Can cast a chosen W1 spell and a chosen W2 spell at will and spend 8 hr to change the choices"',
  // School Of Evocation
  'Empowered Evocation':
    'Section=magic Note="+%{intelligenceModifier} HP evocation spell damage"',
  'Evocation Savant':
    'Section=magic ' +
    'Note="Can copy evocation spells into spellbook for half cost"',
  'Overchannel':
    'Section=magic ' +
    'Note="Can inflict maximum damage from evocation spells up to level 5; doing so also inflicts 2d12+ HP necrotic damage per spell level on self for each use after the first until a long rest"',
  'Potent Cantrip':
    'Section=magic Note="Cantrips inflict half HP on a successful save"',
  'Sculpt Spells':
    'Section=magic ' +
    'Note="Can give spell level + 1 creatures a successful save and no damage instead of half on a self spell"',

  // Backgrounds
  'Shelter Of The Faithful':
    'Section=feature ' +
    'Note="Can receive aid from temples of %{deity} and fellow believers"',

  // Feats
  'Ability Boost':'Section=ability Note="Ability Boost (Choose %V from any)"',
  'Grappler':
    'Section=combat ' +
    // errata removes grapple larger foes benefit
    'Note="Has advantage on attacks on a grappled foe and can restrain a grappled foe with an additional successful grapple"',

  // Sanity, Validation and Miscellaneous
  'Bulky Armor':'Section=skill Note="Has disadvantage on Stealth"',
  'Nonproficient Armor':
    'Section=sanity ' +
    'Note="Has disadvantage on Dexterity and Strength rolls and cannot cast spells"',
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
    'Attribute="weaponProficiency.Martial Weapons" ' +
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
    'Attribute="weaponProficiency.Simple Weapons"' +
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
// Paths are deprecated, with features absorbed into the class specs
SRD5E.PATHS = {
};
SRD5E.RACES = {
  'Hill Dwarf':
    'Size=Medium ' +
    'Speed=25 ' +
    'Features=' +
      '"1:Dwarf Ability Adjustment","1:Steady","1:Darkvision",' +
      '"1:Dwarven Resilience","1:Dwarven Combat Training",' +
      '"1:Tool Proficiency (Choose 1 from Brewer\'s Supplies, Mason\'s Tools, Smith\'s Tools)",' +
      '"1:Stonecunning","1:Language (Common; Dwarvish)",' +
      '"1:Hill Dwarf Ability Adjustment","1:Dwarven Toughness"',
  'High Elf':
    'Size=Medium ' +
    'Speed=30 ' +
    'Features=' +
      '"1:Elf Ability Adjustment",' +
      '"1:Darkvision","1:Keen Senses","1:Fey Ancestry","1:Trance",' +
      '"1:Language (Common; Elvish)",' +
      '"1:High Elf Ability Adjustment","1:Elf Weapon Training",' +
      '"1:Cantrip (High Elf)","1:Extra Language"',
  'Lightfoot Halfling':
    'Size=Small ' +
    'Speed=25 ' +
    'Features=' +
      '"1:Halfling Ability Adjustment",' +
      '"1:Lucky (Halfling)","1:Brave","1:Halfling Nimbleness",' +
      '"1:Language (Common; Halfling)",' +
      '"1:Lightfoot Halfling Ability Adjustment","1:Naturally Stealthy"',
  'Human':
    'Size=Medium ' +
    'Speed=30 ' +
    'Features=' +
      '"1:Human Ability Adjustment",' +
      '"1:Language (Common; Choose 1 from any)"',
  'Dragonborn':
    'Size=Medium ' +
    'Speed=30 ' +
    'Features=' +
      '"1:Dragonborn Ability Adjustment","1:Draconic Ancestry",' +
      '"1:Breath Weapon","1:Damage Resistance",' +
      '"1:Language (Common; Draconic)" ' +
    'Selectables=' +
      '"1:Black Dragon Ancestry:Draconic Ancestry",' +
      '"1:Blue Dragon Ancestry:Draconic Ancestry",' +
      '"1:Brass Dragon Ancestry:Draconic Ancestry",' +
      '"1:Bronze Dragon Ancestry:Draconic Ancestry",'+
      '"1:Copper Dragon Ancestry:Draconic Ancestry",' +
      '"1:Gold Dragon Ancestry:Draconic Ancestry",' +
      '"1:Green Dragon Ancestry:Draconic Ancestry",' +
      '"1:Red Dragon Ancestry:Draconic Ancestry",' +
      '"1:Silver Dragon Ancestry:Draconic Ancestry",' +
      '"1:White Dragon Ancestry:Draconic Ancestry"',
  'Rock Gnome':
    'Size=Small ' +
    'Speed=25 ' +
    'Features=' +
      '"1:Gnome Ability Adjustment","1:Darkvision","1:Gnome Cunning",' +
      '"1:Language (Common; Gnomish)",' +
      '"1:Rock Gnome Ability Adjustment","1:Artificer\'s Lore","1:Tinker"',
  'Half-Elf':
    'Size=Medium ' +
    'Speed=30 ' +
    'Features=' +
      '"1:Half-Elf Ability Adjustment","1:Darkvision","1:Fey Ancestry",' +
      '"1:Skill Versatility",' +
      '"1:Language (Common; Elvish; Choose 1 from any)"',
  'Half-Orc':
    'Size=Medium ' +
    'Speed=30 ' +
    'Features=' +
      '"1:Half-Orc Ability Adjustment","1:Darkvision","1:Menacing",' +
      '"1:Relentless Endurance","1:Savage Attacks","1:Language (Common; Orc)"',
  'Tiefling':
    'Size=Medium ' +
    'Speed=30 ' +
    'Features=' +
      '"1:Tiefling Ability Adjustment",' +
      '"1:Darkvision","1:Hellish Resistance","1:Infernal Legacy",' +
      '"1:Language (Common; Infernal)"'
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
  'Acrobatics':'Ability=Dexterity',
  'Animal Handling':'Ability=Wisdom',
  'Arcana':'Ability=Intelligence',
  'Athletics':'Ability=Strength',
  'Deception':'Ability=Charisma',
  'History':'Ability=Intelligence',
  'Insight':'Ability=Wisdom',
  'Intimidation':'Ability=Charisma',
  'Investigation':'Ability=Intelligence',
  'Medicine':'Ability=Wisdom',
  'Nature':'Ability=Intelligence',
  'Perception':'Ability=Wisdom',
  'Performance':'Ability=Charisma',
  'Persuasion':'Ability=Charisma',
  'Religion':'Ability=Intelligence',
  'Sleight Of Hand':'Ability=Dexterity',
  'Stealth':'Ability=Dexterity',
  'Survival':'Ability=Wisdom'
};
// Note that spellRules replaces lvl and mdf in the spell descriptions with the
// appropriate caster level and ability modifier.
SRD5E.SPELLS = {

  'Acid Arrow':
    'School=Evocation ' +
    'Level=W2 ' +
    'AtHigherLevels="inflicts +1d4 HP initial and secondary" ' +
    'Description=' +
      '"R90\' Ranged spell inflicts 4d4 HP acid, plus 2d4 HP next rd (miss half initial HP only)"',
  'Acid Splash':
    'School=Conjuration ' +
    'Level=S0,W0 ' +
    'Description=' +
      '"R60\' Inflicts %{(level+7)//6}d6 HP acid (save Dexterity neg) on a single target or 2 adjacent targets"',
  'Aid':
    'School=Abjuration ' +
    'Level=C2,P2 ' +
    'AtHigherLevels="gives +5 temporary hit points" ' +
    'Description="R30\' 3 targets gain +5 hit points for 8 hr"',
  'Alarm':
    'School=Abjuration ' +
    'Level=R1,W1 ' +
    'Ritual=true ' +
    'Description=' +
      '"R30\' Entry into a 20\' cube by a non-designated Tiny or larger creature triggers an audible or mental alarm for 8 hr"',
  'Alter Self':
    'School=Transmutation ' +
    'Level=S2,W2 ' +
    'Description=' +
      '"Self becomes aquatic, changes appearance, or gains magic natural weapons with +1 attack and 1d6+ HP damage, for concentration up to 1 hr"',
  'Animal Friendship':
    'School=Enchantment ' +
    'Level=B1,D1,R1 ' +
    'AtHigherLevels="affects +1 target" ' +
    'Description=' +
      '"R30\' Target beast becomes convinced of self harmlessness (save Wisdom neg; Intelligence 4 or higher immune) for 1 day or until harmed"',
  'Animal Messenger':
    'School=Enchantment ' +
    'Level=B2,D2,R2 ' +
    'Ritual=true ' +
    'AtHigherLevels="extends the duration +2 days" ' +
    'Description=' +
      '"R30\' Tiny beast target moves to deliver a 25-word message to a described recipient for 1 day"',
  'Animal Shapes':
    'School=Transmutation ' +
    'Level=D8 ' +
    'Description=' +
      '"R30\' Willing targets become CR 4, Large or smaller beasts for concentration up to 1 day or until reduced to 0 hit points"',
  'Animate Dead':
    'School=Necromancy ' +
    'Level=C3,W3 ' +
    'AtHigherLevels="animates +2 undead" ' +
    'Description=' +
      '"R10\' Bones or the corpse of a Medium or Small creature becomes a skeleton or zombie that obeys commands when within 60\' for 1 day"',
  'Animate Objects':
    'School=Transmutation ' +
    'Level=B5,S5,W5 ' +
    'AtHigherLevels="animates +2 objects" ' +
    'Description=' +
      '"R120\' 10 small, 5 medium, 2 large, or 1 huge objects obey mental commands when within 500\' for concentration up to 1 min"',
  'Antilife Shell':
    'School=Abjuration ' +
    'Level=D5 ' +
    'Description=' +
      '"10\' radius prevents passage of living creatures for concentration up to 1 hr"',
  'Antimagic Field':
    'School=Abjuration ' +
    'Level=C8,W8 ' +
    'Description="10\' radius suppresses magic for concentration up to 1 hr"',
  'Antipathy/Sympathy':
    'School=Enchantment ' +
    'Level=D8,W8 ' +
    'Description=' +
      '"R60\' Target object or 200\' cubic area repels or attracts specified creatures for 10 day"',
  'Arcane Eye':
    'School=Divination ' +
    'Level=W4 ' +
    'Description=' +
      '"R30\' Self sees with darkvision through a remote invisible eye that can move 30\' per rd for concentration up to 1 hr"',
  'Arcane Hand':
    'School=Evocation ' +
    'Level=W5 ' +
    'AtHigherLevels="inflicts +2d8 HP force and +2d6 HP bludgeoning" ' +
    'Description=' +
      '"R120\' Large force hand (Armor Class 20, %{hitPoints} hit points, Strength 26, Dexterity 10) can move 60\' per rd and can punch (inflicts 4d8 HP force), push 5\' (save DC 26 Athletics neg), grapple (may crush, inflicting 2d6+%{mdf} HP bludgeoning), and block for concentration up to 1 min"',
  'Arcane Lock':
    'School=Abjuration ' +
    'Level=W2 ' +
    'Description=' +
      '"Touched barrier opens only for designated creatures or a specified password; <i>Knock</i> suppresses the effects for 10 min"',
  'Arcane Sword':
    'School=Evocation ' +
    'Level=B7,W7 ' +
    'Description=' +
      '"R60\' Creates a force weapon that inflicts 3d10 HP force and can move 20\' per rd for concentration up to 1 min"',
  "Arcanist's Magic Aura":
    'School=Illusion ' +
    'Level=W2 ' +
    'Description=' +
      '"Divinations on willing target report false information for 24 hr"',
  'Astral Projection':
    'School=Necromancy ' +
    'Level=C9,K9,W9 ' +
    'Description="R10\' Self and 8 willing targets project to astral plane"',
  'Augury':
    'School=Divination ' +
    'Level=C2 ' +
    'Ritual=true ' +
    'Description=' +
      '"Reveals the weal or woe outcome of a proposed act up to 30 min in the future"',
  'Awaken':
    'School=Transmutation ' +
    'Level=B5,D5 ' +
    'Description=' +
      '"Touched beast or plant gains Intelligence 10, speech, and movement and becomes charmed for 30 days or until harmed"',

  'Bane':
    'School=Enchantment ' +
    'Level=B1,C1 ' +
    'AtHigherLevels="affects +1 target" ' +
    'Description=' +
      '"R30\' 3 targets suffer -1d4 on attacks and saving throws (save Charisma neg) for concentration up to 1 min"',
  'Banishment':
    'School=Abjuration ' +
    'Level=C4,K4,P4,S4,W4 ' +
    'AtHigherLevels="affects +1 target" ' +
    'Description=' +
      '"R60\' Banishes target to its home plane or a demiplane (save Charisma neg) for concentration up to 1 min"',
  'Barkskin':
    'School=Transmutation ' +
    'Level=D2,R2 ' +
    'Description="Willing touched gains AC 16 for concentration up to 1 hr"',
  'Beacon Of Hope':
    'School=Abjuration ' +
    'Level=C3 ' +
    'Description=' +
      '"R30\' Targets gain advantage on Wisdom and death saves and regain maximum hit points from healing for concentration up to 1 min"',
  'Bestow Curse':
    'School=Necromancy ' +
    'Level=B3,C3,W3 ' +
    'AtHigherLevels="extends the duration to concentration up to 10 min, 8 hr, 24 hr, or permanently at level 4, 5, 7, or 9" ' +
    'Description=' +
      '"Touched suffers a choice of disadvantage on specified ability rolls, disadvantage on attacks on self, requiring a successful Wisdom save to take any action, or +1d8 HP necrotic from self attacks (save Wisdom neg) for concentration up to 1 min"',
  'Black Tentacles':
    'School=Conjuration ' +
    'Level=W4 ' +
    'Description=' +
      '"R90\' 20\' sq inflicts 3d6 HP bludgeoning and restrains (save Dexterity neg, Strength or Dexterity breaks free) for concentration up to 1 min"',
  'Blade Barrier':
    'School=Evocation ' +
    'Level=C6 ' +
    'Description=' +
      '"R90\' Creates a 100\'x20\'x5\' blade wall or a 60\'x20\'x5\' blade ring that provides 3/4 cover and inflicts 6d10 HP slashing (save Dexterity half) for concentration up to 10 min"',
  'Bless':
    'School=Enchantment ' +
    'Level=C1,P1 ' +
    'AtHigherLevels="affects +1 target" ' +
    'Description=' +
      '"R30\' 3 targets gain +1d4 on attacks and saving throws for concentration up to 1 min"',
  'Blight':
    'School=Necromancy ' +
    'Level=D4,K4,S4,W4 ' +
    'AtHigherLevels="inflicts +1d8 HP" ' +
    'Description=' +
      '"R30\' Inflicts 8d8 HP necrotic (save Constitution half; plant target has disadvantage on the save and suffers maximum damage on failure)"',
  'Blindness/Deafness':
    'School=Necromancy ' +
    'Level=B2,C2,"K2 [The Fiend]",S2,W2 ' +
    'AtHigherLevels="affects +1 target" ' +
    'Description=' +
      '"R30\' Inflicts a choice of blindness or deafness (save Constitution ends) for 1 min"',
  'Blink':
    'School=Transmutation ' +
    'Level=S3,W3 ' +
    'Description=' +
      '"Self has a 50% chance of becoming ethereal at the end each turn, returning to a spot within 10\' at the start of the next turn, for 1 min"',
  'Blur':
    'School=Illusion ' +
    'Level=S2,W2 ' +
    'Description=' +
      '"Foes suffer disadvantage when using sight to attack self for concentration up to 1 min"',
  'Branding Smite':
    'School=Evocation ' +
    'Level=P2 ' +
    'AtHigherLevels="inflicts +1d6 HP" ' +
    'Description=' +
      '"Next successful self weapon attack inflicts +2d6 HP radiant and lights the target for concentration up to 1 min"',
  'Burning Hands':
    'School=Evocation ' +
    'Level="K1 [The Fiend]",S1,W1 ' +
    'AtHigherLevels="inflicts +1d6 HP" ' +
    'Description="15\' cone inflicts 3d6 HP fire (save Dexterity half)"',

  'Call Lightning':
    'School=Conjuration ' +
    'Level=D3 ' +
    'AtHigherLevels="inflicts +1d10 HP" ' +
    'Description=' +
      '"R120\' 5\' radius inflicts 3d10 HP lightning (save Dexterity half; +1d10 HP if using a natural storm) once per rd for concentration up to 10 min"',
  'Calm Emotions':
    'School=Enchantment ' +
    'Level=B2,C2 ' +
    'Description=' +
      '"R60\' 20\' radius suppresses a choice of charm and fright or hostility (save Charisma neg) for concentration up to 1 min"',
  'Chain Lightning':
    'School=Evocation ' +
    'Level=S6,W6 ' +
    'AtHigherLevels="affects +1 target" ' +
    'Description=' +
      '"R150\' Inflicts 10d8 HP lightning (save Dexterity half) on 4 targets in a 30\' radius "',
  'Charm Person':
    'School=Enchantment ' +
    'Level=B1,D1,K1,S1,W1 ' +
    'AtHigherLevels="affects +1 target" ' +
    'Description=' +
      '"R30\' Target regards self as a friend (save Wisdom neg) for 1 hr or until harmed"',
  'Chill Touch':
    'School=Necromancy ' +
    'Level=K0,S0,W0 ' +
    'Description=' +
      '"R120\' Ranged spell inflicts %{(level+7)//6}d8 HP necrotic and target cannot regain hit points for 1 rd; undead also suffer disadvantage vs. self attack for 1 rd"',
  'Circle Of Death':
    'School=Necromancy ' +
    'Level=K6,S6,W6 ' +
    'AtHigherLevels="inflicts +2d6 HP" ' +
    'Description=' +
      '"R150\' 60\' radius inflicts 8d6 HP necrotic (save Constitution half)"',
  'Clairvoyance':
    'School=Divination ' +
    'Level=B3,C3,S3,W3 ' +
    'Description=' +
      '"R1 mile Self can see or hear through an invisible sensor for concentration up to 10 min"',
  'Clone':
    'School=Necromancy ' +
    'Level=W8 ' +
    'Description="120-day process grows a backup body for the touched target"',
  'Cloudkill':
    'School=Conjuration ' +
    'Level=S5,W5 ' +
    'AtHigherLevels="inflicts +1d8 HP" ' +
    'Description=' +
      '"R120\' 20\' radius inflicts 5d8 HP poison (save Constitution half) and moves away 10\' per rd for concentration up to 10 min"',
  'Color Spray':
    'School=Illusion ' +
    'Level=S1,W1 ' +
    'AtHigherLevels="affects +2d10 HP of targets" ' +
    'Description="15\' cone blinds 6d10 HP of targets for 1 rd"',
  'Command':
    'School=Enchantment ' +
    'Level=C1,"K1 [The Fiend]",P1 ' +
    'AtHigherLevels="affects +1 target" ' +
    'Description=' +
      '"R60\' Target obeys a one-word command from self (save Wisdom neg) for 1 rd"',
  'Commune':
    'School=Divination ' +
    'Level=C5 ' +
    'Ritual=true ' +
    'Description="Deity answers 3 yes/no questions; additional uses before a long rest add a 25% chance of failure"',
  'Commune With Nature':
    'School=Divination ' +
    'Level=D5,R5 ' +
    'Ritual=true ' +
    'Description=' +
      '"Reveals 3 facts about nature within 3 miles, or within 300\' when underground"',
  'Comprehend Languages':
    'School=Divination ' +
    'Level=B1,K1,S1,W1 ' +
    'Ritual=true ' +
    'Description="Self understands all languages for 1 hr"',
  'Compulsion':
    'School=Enchantment ' +
    'Level=B4 ' +
    'Description=' +
      '"R30\' Self controls target movement direction (save Wisdom ends) for concentration up to 1 min"',
  'Cone Of Cold':
    'School=Evocation ' +
    'Level=S5,W5 ' +
    'AtHigherLevels="inflicts +1d8 HP" ' +
    'Description="60\' cone inflicts 8d8 HP cold (save Constitution half)"',
  'Confusion':
    'School=Enchantment ' +
    'Level=B4,D4,S4,W4 ' +
    'AtHigherLevels="increases the radius by 5\'" ' +
    'Description=' +
      '"R90\' Creatures in a 10\' radius randomly: 10% wander; 50% do nothing; 20% attack an adjacent creature; 20% act normally (save Wisdom neg) for concentration up to 1 min"',
  'Conjure Animals':
    'School=Conjuration ' +
    'Level=D3,R3 ' +
    'AtHigherLevels="doubles, triples, or quadruples the number of animals at level 5, 7, or 9" ' +
    'Description=' +
      '"R60\' Summons a choice of 1, 2, 4, or 8 obedient CR 2, 1, half, or quarter fey spirits in beast form for concentration up to 1 hr"',
  'Conjure Celestial':
    'School=Conjuration ' +
    'Level=C7 ' +
    'AtHigherLevels="increases the CR to 5 at level 9" ' +
    'Description=' +
       '"R90\' Summons an obedient CR 4 celestial for concentration up to 1 hr"',
  'Conjure Elemental':
    'School=Conjuration ' +
    'Level=D5,W5 ' +
    'AtHigherLevels="increases the CR by 1" ' +
    'Description=' +
       '"R90\' Summons an obedient environment-appropriate CR 5 elemental for 1 hr; loss of concentration makes it hostile"',
  'Conjure Fey':
    'School=Conjuration ' +
    'Level=D6,K6 ' +
    'AtHigherLevels="increases the CR by 1" ' +
    'Description=' +
      '"R90\' Summons an obedient CR 6 fey for 1 hr; loss of concentration makes it hostile"',
  'Conjure Minor Elementals':
    'School=Conjuration ' +
    'Level=D4,W4 ' +
    'AtHigherLevels="doubles or triples the number of elementals at level 6 or 8" ' +
    'Description=' +
      '"R90\' Summons a choice of 1, 2, 4, or 8 obedient CR 2, 1, half, or quarter elementals for concentration up to 1 hr"',
  'Conjure Woodland Beings':
    'School=Conjuration ' +
    'Level=D4,R4 ' +
    'AtHigherLevels="doubles or triples the number of creatures at level 6 or 8" ' +
    'Description=' +
      '"R60\' Summons a choice of 1, 2, 4, or 8 obedient CR 2, 1, half, or quarter fey creatures for concentration up to 1 hr"',
  'Contact Other Plane':
    'School=Divination ' +
    'Level=K5,W5 ' +
    'Ritual=true ' +
    'Description=' +
      '"Contact with an extraplanar being inflicts 6d6 HP psychic and insanity on self until a long rest (save DC 15 Intelligence neg and gives 5 one-word answers)"',
  'Contagion':
    'School=Necromancy ' +
    'Level=C5,D5 ' +
    // errata changes description
    'Description=' +
      '"Touched suffers poisoned (save Constitution each turn; 3 successes ends, and 3 failures inflict a choice of disease for 7 days)"',
  'Contingency':
    'School=Evocation ' +
    'Level=W6 ' +
    'Description=' +
      '"Sets a trigger for a spell of level 5 or lower to affect self within 10 days"',
  'Continual Flame':
    'School=Evocation ' +
    'Level=C2,W2 ' +
    'Description="Touched emits a heatless torch flame"',
  'Control Water':
    'School=Transmutation ' +
    'Level=C4,D4,W4 ' +
    'Description=' +
      '"R300\' Water in a 100\' cube rises 20\', parts, redirects, or whirlpools for concentration up to 10 min"',
  'Control Weather':
    'School=Transmutation ' +
    'Level=C8,D8,W8 ' +
    'Description=' +
      '"Modifies seasonal weather in a 5 mile radius for concentration up to 8 hr"',
  'Counterspell':
    'School=Abjuration ' +
    'Level=K3,S3,W3 ' +
    'AtHigherLevels="negates any spell of equal or lesser level" ' +
    'Description=' +
      '"R60\' Negates foe casting up to spell level 3; successful DC 10 + spell level negates a higher-level spell"',
  'Create Food And Water':
    'School=Conjuration ' +
    'Level=C3,P3 ' +
    'Description="R30\' Creates 45 lb of food and 30 gallons of water"',
  'Create Or Destroy Water':
    'School=Transmutation ' +
    'Level=C1,D1 ' +
    'AtHigherLevels="affects +10 gallons or a +5\' cube" ' +
    'Description=' +
      '"R30\' Creates or destroys 10 gallons of water or fog in a 30\' cube"',
  'Create Undead':
    'School=Necromancy ' +
    'Level=C6,K6,W6 ' +
    'AtHigherLevels=' +
      '"creates 4 ghouls; 5 ghouls, 2 ghasts, or 2 wights; or 6 ghouls, 3 ghasts, 3 wights, or 2 mummies at level 7, 8, or 9" ' +
    'Description="R10\' 3 corpses become ghouls that obey commands within 120\' for 1 day"',
  'Creation':
    'School=Illusion ' +
    'Level=S5,W5 ' +
    'AtHigherLevels="creates a +5\' cube" ' +
    'Description="R30\' Creates a 5\' cube of false matter lasting up to 1 day"',
  'Cure Wounds':
    'School=Evocation ' +
    'Level=B1,C1,D1,P1,R1 ' +
    'AtHigherLevels="restores +1d8 HP" ' +
    'Description="Touched regains 1d8+%{mdf} hit points"',

  'Dancing Lights':
    'School=Evocation ' +
    'Level=B0,S0,W0 ' +
    'Description=' +
      '"R120\' 4 torch lights dimly light a 10\' radius and can move 60\' per rd for concentration up to 1 min"',
  'Darkness':
    'School=Evocation ' +
    'Level=K2,S2,W2 ' +
    'Description=' +
      '"R60\' Target centers a 15\' radius lightless area for concentration up to 10 min"',
  'Darkvision':
    'School=Transmutation ' +
    'Level=D2,R2,S2,W2 ' +
    'Description="Willing touched sees 60\' in darkness for 8 hr"',
  'Daylight':
    'School=Evocation ' +
    'Level=C3,D3,P3,R3,S3 ' +
    'Description="R60\' Target centers a 60\' radius bright light for 1 hr"',
  'Death Ward':
    'School=Abjuration ' +
    'Level=C4,P4 ' +
    'Description="Touched retains 1 HP when next reduced to 0 HP or survives next death effect within 8 hrs"',
  'Delayed Blast Fireball':
    'School=Evocation ' +
    'Level=S7,W7 ' +
    'AtHigherLevels="inflicts +1d6 HP" ' +
    'Description=' +
      '"R150\' 20\' radius inflicts 12d6 HP fire + 1d6 HP fire per rd delayed (save Dexterity half) within concentration up to 1 min"',
  'Demiplane':
    'School=Conjuration ' +
    'Level=K8,W8 ' +
    'Description="R60\' Creates a door that leads to a 30\'x30\'x30\' extradimensional room for 1 hr"',
  'Detect Evil And Good':
    'School=Divination ' +
    'Level=C1,P1 ' +
    'Description=' +
      '"R30\' Reveals aberrations, celestials, elementals, feys, fiends, undead, consecration, and desecration for concentration up to 10 min"',
  'Detect Magic':
    'School=Divination ' +
    'Level=B1,C1,D1,P1,R1,S1,W1 ' +
    'Ritual=true ' +
    'Description=' +
      '"R30\' Reveals magic auras and their schools for concentration up to 10 min"',
  'Detect Poison And Disease':
    'School=Divination ' +
    'Level=C1,D1,P1,R1 ' +
    'Ritual=true ' +
    'Description=' +
      '"R30\' Reveals poison, poisonous creatures, and diseases for concentration up to 10 min"',
  'Detect Thoughts':
    'School=Divination ' +
    'Level=B2,S2,W2 ' +
    'Description=' +
      '"R30\' Reveals targets\' surface thoughts and allows probing deeper (save Wisdom ends) for concentration up to 1 min"',
  'Dimension Door':
    'School=Conjuration ' +
    'Level=B4,K4,S4,W4 ' +
    'Description="Teleports self and 1 adjacent willing creature up to 500\'"',
  'Disguise Self':
    'School=Illusion ' +
    'Level=B1,S1,W1 ' +
    'Description=' +
      '"Changes the appearance of self body and clothing for 1 hr; physical investigates detects the illusion"',
  'Disintegrate':
    'School=Transmutation ' +
    'Level=S6,W6 ' +
    'AtHigherLevels="inflicts +3d6 HP" ' +
    'Description=' +
      '"R60\' Inflicts 10d6+40 HP force and turns the target to dust if reduced to 0 HP (save Dexterity neg), or disintegrates a Large or smaller object or magical force"',
  'Dispel Evil And Good':
    'School=Abjuration ' +
    'Level=C5,P5 ' +
    'Description=' +
      '"Celestials, elementals, fey, fiends, and undead suffer disadvantage on attacks vs. self for concentration up to 1 min, a successful spell attack returns them to their home plane (save Charisma neg), and a touch also ends an enchantment, fright, or possession by them"',
  'Dispel Magic':
    'School=Abjuration ' +
    'Level=B3,C3,D3,K3,P3,S3,W3 ' +
    'AtHigherLevels="ends any spell of equal or lesser level" ' +
    'Description=' +
      '"R120\' Ends the effects on the target of a spell up to level 3, and successful DC 10 + spell level checks end each higher-level spell"',
  'Divination':
    'School=Divination ' +
    'Level=C4 ' +
    'Ritual=true ' +
    'Description=' +
      '"Answers a question about an event up to 7 days in the future; additional uses before a long rest add a 25% chance of failure"',
  'Divine Favor':
    'School=Evocation ' +
    'Level=P1 ' +
    'Description="Self weapons inflict +1d4 HP radiant for concentration up to 1 min"',
  'Divine Word':
    'School=Evocation ' +
    'Level=C7 ' +
    'Description=' +
      '"R30\' Inflicts death on targets with up to 20 HP, stunned on those with up to 30 HP, blinded on those with up to 40 HP, and deafened on those with up to 50 HP, and forces them to return to their home planes (save Charisma neg)"',
  'Dominate Beast':
    'School=Enchantment ' +
    'Level=D4,S4 ' +
    'AtHigherLevels="extends the duration to 10 min, 1 hr, or 8 hr at level 5, 6, or 7" ' +
    'Description=' +
      '"R60\' Target beast obeys telepathic commands (save Wisdom neg; damage allows another save) for concentration up to 1 min"',
  'Dominate Monster':
    'School=Enchantment ' +
    'Level=B8,K8,S8,W8 ' +
    'AtHigherLevels="extends the duration to 8 hr" ' +
    'Description=' +
      '"R60\' Target creature obeys telepathic commands (save Wisdom neg; damage allows another save) for concentration up to 1 hr"',
  'Dominate Person':
    'School=Enchantment ' +
    'Level=B5,S5,W5 ' +
    'AtHigherLevels="extends the duration to 10 min, 1 hr, or 8 hr at level 6, 7, or 8" ' +
    'Description=' +
      '"R60\' Target humanoid obeys telepathic commands (save Wisdom neg; damage allows another save) for concentration up to 1 min"',
  'Dream':
    'School=Illusion ' +
    'Level=B5,K5,W5 ' +
    'Description=' +
      '"Touched controls the dreams of a known target for 8 hr and can inflict 3d6 HP psychic (save Wisdom neg)"',
  'Druidcraft':
    'School=Transmutation ' +
    'Level=D0 ' +
    'Description=' +
      '"R30\' Predicts 24 hr weather, causes a plant to bloom, creates a minor sensory effect, or lights or snuffs a small fire"',

  'Earthquake':
    'School=Evocation ' +
    'Level=C8,D8,S8 ' +
    'Description=' +
      '"R500\' 100\' radius opens fissures, damages structures, breaks concentration (save Constitution neg), and knocks prone (save Dexterity neg) for concentration up to 1 min"',
  'Eldritch Blast':
    'School=Evocation ' +
    'Level=K0 ' +
    'Description=' +
      '"R%{$\'features.Eldritch Spear\'?300:120}\' Ranged spell creates %{(level+7)//6} rays that inflict 1d10 HP force each"',
  'Enhance Ability':
    'School=Transmutation ' +
    'Level=B2,C2,D2,S2 ' +
    'AtHigherLevels="affects +1 target" ' +
    'Description=' +
      '"Touched gains advantage on chosen ability checks for concentration up to 1 hr; Constitution also gives 2d6 temporary HP, Strength doubles carrying capacity, and Dexterity negates damage from a 20\' fall"',
  'Enlarge/Reduce':
    'School=Transmutation ' +
    'Level=S2,W2 ' +
    'Description=' +
      '"R30\' Target increases a size category, gaining advantage on Strength checks and  +1d4 HP weapon damage, or decreases a size category, suffering disadvantage on Strength checks and -1d4 HP weapon damage (save Constitution neg), for concentration up to 1 min; can instead target an unattended object"',
  'Entangle':
    'School=Conjuration ' +
    'Level=D1 ' +
    'Description=' +
      '"R90\' 20\' sq ensnares creatures (save Strength neg) for concentration up to 1 min"',
  'Enthrall':
    'School=Enchantment ' +
    'Level=B2,K2 ' +
    'Description=' +
      '"R60\' Target suffers disadvantage on Perception to notice others (save Wisdom neg) for 1 min"',
  'Etherealness':
    'School=Transmutation ' +
    'Level=B7,C7,K7,S7,W7 ' +
    'AtHigherLevels="affects +2 or +5 targets at level 8 or 9" ' +
    'Description="Self enters Ethereal Plane for up to 8 hr"',
  'Expeditious Retreat':
    'School=Transmutation ' +
    'Level=K1,S1,W1 ' +
    'Description=' +
      '"Self gains a bonus Dash once per rd for concentration up to 10 min"',
  'Eyebite':
    'School=Necromancy ' +
    'Level=B6,K6,S6,W6 ' +
    'Description=' +
      '"R60\' Inflicts a choice of sleep, panic, or sickened (disadvantage on attack and ability rolls) on 1 target per rd (save Wisdom neg) for concentration up to 1 min"',

  'Fabricate':
    'School=Transmutation ' +
    'Level=W4 ' +
    'Description=' +
      '"R120\' Reshapes raw material into a 10\' cube product, or a 5\' cube product of stone or metal"',
  'Faerie Fire':
    'School=Evocation ' +
    'Level=B1,D1 ' +
    'Description=' +
      '"R60\' Objects in a 20\' cube glow, giving foes advantage on attacks (save Dexterity neg), for concentration up to 1 min"',
  'Faithful Hound':
    'School=Conjuration ' +
    'Level=W4 ' +
    'Description=' +
      '"R30\' Creates an invisible watchdog that barks at Small or larger intruders within 30\' and attacks those within 5\' (password neg) with a +%{mdf+proficiencyBonus} bite that inflicts 4d8 HP piercing for 8 hr"',
  'False Life':
    'School=Necromancy ' +
    'Level=S1,W1 ' +
    'AtHigherLevels="gives +5 temporary hit points" ' +
    'Description="Self gains 1d4+4 temporary hit points for 1 hr"',
  'Fear':
    'School=Illusion ' +
    'Level=B3,K3,S3,W3 ' +
    'Description="Creatures in a 30\' cone flee (save Wisdom ends) for concentration up to 1 min"',
  'Feather Fall':
    'School=Transmutation ' +
    'Level=B1,S1,W1 ' +
    'Description="R60\' 5 falling targets slow to 60\' per rd for 1 min"',
  'Feeblemind':
    'School=Enchantment ' +
    'Level=B8,D8,K8,W8 ' +
    'Description=' +
      '"R150\' Target suffers 4d6 HP psychic and reduction of Charisma and Intelligence to 1 (save Intelligence inflicts HP only; failure allows additional saves every 30 days)"',
  'Find Familiar':
    'School=Conjuration ' +
    'Level=W1 ' +
    'Ritual=true ' +
    'Description=' +
      '"R10\' Self gains the service of a summoned spirit in animal form that can deliver touch attacks when within 100\'"',
  'Find Steed':
    'School=Conjuration ' +
    'Level=P2 ' +
    'Description=' +
      '"R10\' Self gains the service of a summoned spirit in steed form"',
  'Find The Path':
    'School=Divination ' +
    'Level=B6,C6,D6 ' +
    'Description=' +
      '"Reveals the shortest path to a specified destination for concentration up to 1 day"',
  'Find Traps':
    'School=Divination ' +
    'Level=C2,D2,R2 ' +
    'Description="R120\' Reveals the presence of traps"',
  'Finger Of Death':
    'School=Necromancy ' +
    'Level=K7,S7,W7 ' +
    'Description=' +
      '"R60\' Target suffers 7d8+30 HP necrotic (save Constitution half) and becomes an obedient zombie if killed"',
  'Fire Bolt':
    'School=Evocation ' +
    'Level=S0,W0 ' +
    'Description=' +
      '"R120\' Ranged spell inflicts %{(level+7)//6}d10 HP fire or ignites an unattended flammable target"',
  'Fire Shield':
    'School=Evocation ' +
    'Level="K4 [The Fiend]",W4 ' +
    'Description=' +
      '"Self gains resistance to heat or cold damage, and a successful adjacent attacker suffers 2d8 HP fire or cold for 10 min"',
  'Fire Storm':
    'School=Evocation ' +
    'Level=C7,D7,S7 ' +
    'Description=' +
      '"R150\' 10 connected 10\' cubes inflict 7d10 HP fire (save Dexterity half) and ignite unattended flammable objects"',
  'Fireball':
    'School=Evocation ' +
    'Level="K3 [The Fiend]",S3,W3 ' +
    'AtHigherLevels="inflicts +1d6 HP" ' +
    'Description=' +
      '"R150\' 20\' radius inflicts 8d6 HP fire (save Dexterity half)"',
  'Flame Blade':
    'School=Evocation ' +
    'Level=D2 ' +
    'AtHigherLevels="inflicts +1d6 HP per 2 levels" ' +
    'Description=' +
      '"Self wields a flaming blade that inflicts 3d6 HP fire and lights a 10\' radius for concentration up to 10 min"',
  'Flame Strike':
    'School=Evocation ' +
    'Level=C5,"K5 [The Fiend]" ' +
    'AtHigherLevels="inflicts +1d6 HP of a choice of fire or radiant" ' +
    'Description=' +
      '"R60\' 10\' radius inflicts 4d6 HP fire and 4d6 HP radiant (save Dexterity half)"',
  'Flaming Sphere':
    'School=Conjuration ' +
    'Level=D2,W2 ' +
    'AtHigherLevels="inflicts +1d6 HP" ' +
    'Description=' +
      '"R60\' 5\' sphere lights a 20\' radius, inflicts 2d6 HP fire (save Dexterity half), ignites unattended flammable objects, and can move 30\' per rd for concentration up to 1 min"',
  'Flesh To Stone':
    'School=Transmutation ' +
    'Level=K6,W6 ' +
    'Description=' +
      '"R60\' Target becomes restrained (save Constitution neg), then petrified after 3 failed Constitution saves (3 successes neg) for concentration; the effects become permanent after 1 min"',
  'Floating Disk':
    'School=Conjuration ' +
    'Level=W1 ' +
    'Ritual=true ' +
    'Description=' +
      '"R30\' 3\' x 1\\" force disk floats 3\' above ground 20\' behind self, holding 500 lbs for 1 hr"',
  'Fly':
    'School=Transmutation ' +
    'Level=K3,S3,W3 ' +
    'AtHigherLevels="affects +1 target" ' +
    'Description="Touched gains 60\' fly speed for concentration up to 10 min"',
  'Fog Cloud':
    'School=Conjuration ' +
    'Level=D1,R1,S1,W1 ' +
    'AtHigherLevels="increases the radius by 20\'" ' +
    'Description="R120\' 20\' radius obscures vision for concentration up to 1 hr"',
  'Forbiddance':
    'School=Abjuration ' +
    'Level=C6 ' +
    'Ritual=true ' +
    'Description=' +
      '"Touched 40000 sq ft bars teleport and portals; entry inflicts 5d10 HP of a choice of radiant or necrotic to one or more choices of celestials, fey, fiends, or undead for 1 day; casting daily for 30 days makes the effects permanent"',
  'Forcecage':
    'School=Evocation ' +
    'Level=B7,K7,W7 ' +
    'Description=' +
      '"R100\' Creates a choice of a 20\' barred force cube or a 10\' solid force box for 1 hr"',
  'Foresight':
    'School=Divination ' +
    'Level=B9,D9,K9,W9 ' +
    'Description=' +
      '"Touched gains immunity to surprise and advantage on attack, ability, and saving throws, and foes suffer disadvantage on attacks, for 8 hr"',
  'Freedom Of Movement':
    'School=Abjuration ' +
    'Level=B4,C4,D4,R4 ' +
    'Description=' +
      '"Touched gains immunity to movement impediments and can escape from restraints for 1 hr"',
  'Freezing Sphere':
    'School=Evocation ' +
    'Level=W6 ' +
    'AtHigherLevels="inflicts +1d6 HP" ' +
    'Description=' +
      '"R300\' 60\' radius inflicts 10d6 HP cold (save Constitution half) and freezes water for 1 min"',

  'Gaseous Form':
    'School=Transmutation ' +
    'Level=K3,S3,W3 ' +
    'Description=' +
      '"Touched creature becomes gaseous, gaining a 10\' fly Speed and advantage on Strength, Dexterity, and Constitution saves, for concentration up to 1 hr"',
  'Gate':
    'School=Conjuration ' +
    'Level=C9,S9,W9 ' +
    'Description=' +
      '"R60\' Opens a circular portal to another plane for concentration up to 1 min; can be used to bring a creature from another plane"',
  'Geas':
    'School=Enchantment ' +
    'Level=B5,C5,D5,P5,W5 ' +
    'AtHigherLevels="extends the duration to 1 yr or permanently at level 7 or 9" ' +
    'Description=' +
      '"R60\' Target obeys self instructions (save Wisdom neg) for 30 days"',
  'Gentle Repose':
    'School=Necromancy ' +
    'Level=C2,W2 ' +
    'Ritual=true ' +
    'Description=' +
      '"Touched corpse becomes immune to decay and animation for 10 days"',
  'Giant Insect':
    'School=Transmutation ' +
    'Level=D4 ' +
    'Description=' +
      '"R30\' 10 centipedes, 5 wasps, 3 spiders, or 1 scorpion become giant and obey commands for concentration up to 10 min"',
  'Glibness':
    'School=Transmutation ' +
    'Level=B8,K8 ' +
    'Description=' +
      '"Self can take 15 on Charisma checks and always detects as truthful for 1 hr"',
  'Globe Of Invulnerability':
    'School=Abjuration ' +
    'Level=S6,W6 ' +
    'AtHigherLevels="increases the level of spells blocked by 1" ' +
    'Description=' +
      '"10\' radius blocks spells up to level 5 for concentration up to 1 min"',
  'Glyph Of Warding':
    'School=Abjuration ' +
    'Level=B3,C3,W3 ' +
    'AtHigherLevels="inflicts +1d8 HP or increases the level of the triggered spell by 1" ' +
    'Description=' +
      '"20\' radius inflicts 5d8 HP of a choice of acid, cold, fire, lightning, or thunder (save Dexterity half) or a spell of up to level 3 when triggered"',
  'Goodberry':
    'School=Transmutation ' +
    'Level=D1,R1 ' +
    'Description=' +
      '"Creates 10 berries that each heal 1 HP and provide food for 1 day"',
  'Grease':
    'School=Conjuration ' +
    'Level=W1 ' +
    'Description=' +
      '"R60\' 10\' sq becomes difficult terrain and causes creatures to fall prone (save Dexterity neg) for 1 min"',
  'Greater Invisibility':
    'School=Illusion ' +
    'Level=B4,S4,W4 ' +
    'Description="Touched becomes invisible for concentration up to 1 min"',
  'Greater Restoration':
    'School=Abjuration ' +
    'Level=B5,C5,D5 ' +
    'Description=' +
      '"Touched recovers from exhausted, charmed, petrified, cursed, or ability damage or regains hit point maximum"',
  'Guardian Of Faith':
    'School=Conjuration ' +
    'Level=C4 ' +
    'Description=' +
       '"R30\' 10\' radius inflicts 20 HP radiant to hostile creatures (save Dexterity half) for 8 hr or 60 HP inflicted"',
  'Guards And Wards':
    'School=Abjuration ' +
    'Level=B6,W6 ' +
    'Description="Multiple magic effects protect 2500 sq ft for 1 day"',
  'Guidance':
    'School=Divination ' +
    'Level=C0,D0 ' +
    'Description=' +
      '"Touched gains +1d4 on 1 ability check within concentration up to 1 min"',
  'Guiding Bolt':
    'School=Evocation ' +
    'Level=C1 ' +
    'AtHigherLevels="inflicts +1d6 HP" ' +
    'Description=' +
      '"R120\' Ranged spell inflicts 4d6 HP radiant and gives advantage on the next attack on the target within 1 rd"',
  'Gust Of Wind':
    'School=Evocation ' +
    'Level=D2,S2,W2 ' +
    'Description=' +
      '"60\'x10\' wind pushes 15\' (save Strength neg), inflicts half movement, and has a 50% chance of extinguishing flames for concentration up to 1 min"',

  'Hallow':
    'School=Evocation ' +
    'Level=C5,"K5 [The Fiend]" ' +
    'Description=' +
      '"60\' radius becomes warded against celestials, elementals, fey, fiends, and undead and their effects and evokes a boon effect"',
  'Hallucinatory Terrain':
    'School=Illusion ' +
    'Level=B4,D4,K4,W4 ' +
    'Description=' +
      '"R300\' Creates a 150\' cube terrain illusion (Investigation detects) for 1 day"',
  'Harm':
    'School=Necromancy ' +
    'Level=C6 ' +
    'Description=' +
      '"R60\' Target suffers 14d6 HP necrotic and an equal maximum hit point reduction for 1 hr (save Constitution half HP only)"',
  'Haste':
    'School=Transmutation ' +
    'Level=S3,W3 ' +
    'Description=' +
      '"R30\' Willing target gains double Speed, +2 AC, advantage on Dexterity, and an additional action for concentration up to 1 min and suffers 1 rd of lethargy afterward"',
  'Heal':
    'School=Evocation ' +
    'Level=C6,D6 ' +
    'AtHigherLevels="restores +10 hit points" ' +
    'Description=' +
      '"R60\' Target regains 70 hit points and recovers from blinded, deafened, and diseased"',
  'Healing Word':
    'School=Evocation ' +
    'Level=B1,C1,D1 ' +
    'AtHigherLevels="restores +1d4 hit points" ' +
    'Description="R60\' Target regains 1d4+%{mdf} hit points"',
  'Heat Metal':
    'School=Transmutation ' +
    'Level=B2,D2 ' +
    'AtHigherLevels="inflicts +1d8 HP" ' +
    'Description=' +
      '"R60\' Touching the target metal inflicts 2d8 HP fire, plus attack and ability disadvantage if the the target is worn or held (save Constitution allows dropping), for concentration up to 1 min"',
  'Hellish Rebuke':
    'School=Evocation ' +
    'Level=K1 ' +
    'AtHigherLevels="inflicts +1d10 HP" ' +
    'Description=' +
      '"R60\' Cast as a reaction, inflicts 2d10 HP fire on a successful attacker (save Dexterity half)"',
  "Heroes' Feast":
    'School=Conjuration ' +
    'Level=C6,D6 ' +
    // errata changes description
    'Description=' +
      '"R30\' 12 diners recover from disease and poison and gain immunity to poison and fright, advantage on Wisdom, and +2d10 hit points and maximum hit points for 24 hr"',
  'Heroism':
    'School=Enchantment ' +
    'Level=B1,P1 ' +
    'AtHigherLevels="affects +1 target" ' +
    'Description=' +
      '"Touched gains immunity to fright and +%{mdf} temporary hit points each rd for concentration up to 1 min"',
  'Hideous Laughter':
    'School=Enchantment ' +
    'Level=B1,W1 ' +
    'Description="R30\' Inflicts ROFL (save Wisdom ends) for concentration up to 1 min"',
  'Hold Monster':
    'School=Enchantment ' +
    'Level=B5,K5,S5,W5 ' +
    'AtHigherLevels="affects +1 target" ' +
    'Description=' +
      '"R90\' Immobilizes the target creature (save Wisdom ends) for concentration up to 1 min"',
  'Hold Person':
    'School=Enchantment ' +
    'Level=B2,C2,D2,K2,S2,W2 ' +
    'AtHigherLevels="affects +1 target" ' +
    'Description=' +
      '"R60\' Immobilizes the target humanoid (save Wisdom ends) for concentration up to 1 min"',
  'Holy Aura':
    'School=Abjuration ' +
    'Level=C8 ' +
    'Description=' +
      '"Targets in a 30\' radius gain advantage on saves, inflict disadvantage on attackers, and blind successful fiend and undead melee attackers (save Constitution neg) for concentration up to 1 min"',
  "Hunter's Mark":
    'School=Divination ' +
    'Level=R1 ' +
    'AtHigherLevels="extends duration to 8/24 hr at level 3/5" ' +
    'Description=' +
      '"R90\' Self gains +1d6 HP weapon damage to the target and advantage on Perception and Wisdom to locate it for concentration up to 1 hr"',
  'Hypnotic Pattern':
    'School=Illusion ' +
    'Level=B3,K3,S3,W3 ' +
    'Description=' +
      '"R120\' Creatures in a 30\' cube become incapacitated (save Wisdom neg) for concentration up to 1 min; taking damage ends the effects"',

  'Ice Storm':
    'School=Evocation ' +
    'Level=D4,S4,W4 ' +
    'AtHigherLevels="inflicts +1d8 HP bludgeoning" ' +
    'Description=' +
      '"R300\' 20\' radius inflicts 2d8 HP bludgeoning and 4d6 HP cold (save Dexterity half) and becomes difficult terrain for 1 rd"',
  'Identify':
    'School=Divination ' +
    'Level=B1,W1 ' +
    'Ritual=true ' +
    'Description="Reveals the magic properties or spells affecting touched"',
  'Illusory Script':
    'School=Illusion ' +
    'Level=B1,K1,W1 ' +
    'Ritual=true ' +
    'Description=' +
      '"Self writing on target material becomes legible only to specified creatures for 10 days"',
  'Imprisonment':
    'School=Abjuration ' +
    'Level=K9,W9 ' +
    'Description=' +
      '"R30\' Restrains the target in a chosen type of prison (save Wisdom neg)"',
  'Incendiary Cloud':
    'School=Conjuration ' +
    'Level=S8,W8 ' +
    'Description=' +
      '"R150\' 20\' radius inflicts 10d8 HP fire (save Dexterity half), obscures, and moves away 10\' per rd for concentration up to 1 min"',
  'Inflict Wounds':
    'School=Necromancy ' +
    'Level=C1 ' +
    'AtHigherLevels="inflicts +1d10 HP" ' +
    'Description="Touch inflicts 3d10 HP necrotic"',
  'Insect Plague':
    'School=Conjuration ' +
    'Level=C5,D5,S5 ' +
    'AtHigherLevels="inflicts +1d10 HP" ' +
    'Description=' +
      '"R300\' 20\' radius inflicts 4d10 HP piercing (save Constitution half) for concentration up to 10 min"',
  'Instant Summons':
    'School=Conjuration ' +
    'Level=W6 ' +
    'Ritual=true ' +
    'Description=' +
      '"Prepares a 10 lb item to teleport to self when desired; if the item is held when summoned, the spell instead reveals the possessor"',
  'Invisibility':
    'School=Illusion ' +
    'Level=B2,K2,S2,W2 ' +
    'AtHigherLevels="affects +1 target" ' +
    'Description=' +
      '"Touched becomes invisible for concentration up to 1 hr; target attacking or casting ends"',
  'Irresistible Dance':
    'School=Enchantment ' +
    'Level=B6,W6 ' +
    'Description=' +
      '"R30\' Target suffers disadvantage on Dexterity and attacks, and foes gain advantage on attacks (save Wisdom ends), for concentration up to 1 min"',

  'Jump':
    'School=Transmutation ' +
    'Level=D1,R1,S1,W1 ' +
    'Description="Touched gains triple jump distance for 1 min"',

  'Knock':
    'School=Transmutation ' +
    'Level=B2,S2,W2 ' +
    'Description=' +
      '"R60\' Unlocks, unsticks, or unbars the target or suppresses <i>Arcane Lock</i> for 10 min"',

  'Legend Lore':
    'School=Divination ' +
    'Level=B5,C5,W5 ' +
    'Description="Reveals info about a specified person, place, or object"',
  'Lesser Restoration':
    'School=Abjuration ' +
    'Level=B2,C2,D2,P2,R2 ' +
    'Description=' +
      '"Touched recovers from a choice of blindness, deafness, disease, paralysis, or poison"',
  'Levitate':
    'School=Transmutation ' +
    'Level=S2,W2 ' +
    'Description=' +
      '"R60\' Target floats (save Constitution neg) and can be moved up or down 20\' each rd for concentration up to 10 min"',
  'Light':
    'School=Evocation ' +
    'Level=B0,C0,S0,W0 ' +
    'Description=' +
      '"Touched object lights a 20\' radius (save Dexterity neg) for 1 hr"',
  'Lightning Bolt':
    'School=Evocation ' +
    'Level=S3,W3 ' +
    'AtHigherLevels="inflicts +1d6 HP" ' +
    'Description="100\'x5\' line inflicts 8d6 HP lightning (save Dexterity half) and ignites unattended flammable objects"',
  'Locate Animals Or Plants':
    'School=Divination ' +
    'Level=B2,D2,R2 ' +
    'Ritual=true ' +
    'Description=' +
      '"Reveals the location within 5 miles of a specified kind of beast or plant"',
  'Locate Creature':
    'School=Divination ' +
    'Level=B4,C4,D4,P4,R4,W4 ' +
    'Description=' +
      '"Reveals the location of a specified creature or species within 1000\' for concentration up to 1 hr; running water blocks"',
  'Locate Object':
    'School=Divination ' +
    'Level=B2,C2,D2,P2,R2,W2 ' +
    'Description=' +
      '"Reveals the location of a specified object or type within 1000\' for concentration up to 10 min; lead blocks"',
  'Longstrider':
    'School=Transmutation ' +
    'Level=B1,D1,R1,W1 ' +
    'AtHigherLevels="affects +1 target" ' +
    'Description="Touched gains +10\' Speed for 1 hr"',

  'Mage Armor':
    'School=Abjuration ' +
    'Level=S1,W1 ' +
    'Description=' +
      '"Willing, unarmored touched gains AC 13 + Dexterity modifier for 8 hr; the spell ends if the target dons armor"',
  'Mage Hand':
    'School=Conjuration ' +
    'Level=B0,K0,S0,W0 ' +
    'Description=' +
      '"R30\' Spectral hand performs minor tasks, moving up to 10 lb, for 1 min"',
  'Magic Circle':
    'School=Abjuration ' +
    'Level=C3,K3,P3,W3 ' +
    'AtHigherLevels="extends duration +1 hr" ' +
    'Description=' +
      '"R10\' 10\' radius prevents a choice of physical entry or exit (save Charisma allows magical transit), inflicts disadvantage on attacks, and negates charm, fright, and possession by one or more choices of celestials, fey, fiends, or undead for 1 hr"',
  'Magic Jar':
    'School=Necromancy ' +
    'Level=W6 ' +
    'Description=' +
      '"R100\' Moves self soul to a prepared jar from which it can possess a target\'s body and trap its soul in the jar (save Charisma neg)"',
  'Magic Missile':
    'School=Evocation ' +
    'Level=S1,W1 ' +
    'AtHigherLevels="creates +1 dart" ' +
    'Description="R120\' 3 darts inflict 1d4+1 HP force each"',
  'Magic Mouth':
    'School=Illusion ' +
    'Level=B2,W2 ' +
    'Ritual=true ' +
    'Description="R30\' Target object speaks a 25-word message when triggered"',
  'Magic Weapon':
    'School=Transmutation ' +
    'Level=P2,W2 ' +
    'AtHigherLevels="gives a +2 or +3 bonus at level 4 or 6" ' +
    'Description="Gives touched weapon a +1 magic bonus for concentration up to 1 hr"',
  'Magnificent Mansion':
    'School=Conjuration ' +
    'Level=B7,W7 ' +
    'Description=' +
      '"R300\' Self and designated creatures can enter an extradimensional dwelling containing provisions for 100 people for 1 day"',
  'Major Image':
    'School=Illusion ' +
    'Level=B3,K3,S3,W3 ' +
    'AtHigherLevels="extends the duration to permanent at level 6" ' +
    'Description=' +
      '"R120\' Creates a 20\' cube sight, sound, and touch illusion (Investigation detects) for concentration up to 10 min"',
  'Mass Cure Wounds':
    'School=Evocation ' + // from errata
    'Level=B5,C5,D5 ' +
    'AtHigherLevels="restores +1d8 HP" ' +
    'Description="R60\' 6 targets in a 30\' radius regain 3d8+%{mdf} HP"',
  'Mass Heal':
    'School=Evocation ' + // from errata
    'Level=C9 ' +
    'Description=' +
      '"R60\' Targets regain 700 HP total and recover from blindness, deafness, and disease"',
  'Mass Healing Word':
    'School=Evocation ' +
    'Level=C3 ' +
    'AtHigherLevels="restores +1d4 HP" ' +
    'Description="R60\' 6 targets regain 1d4+%{mdf} HP"',
  'Mass Suggestion':
    'School=Enchantment ' +
    'Level=B6,K6,S6,W6 ' +
    'AtHigherLevels="extends the duration to 10, 30, or 366 days at level 7, 8, or 9" ' +
    'Description=' +
      '"R60\' 12 targets follow a reasonable suggestion (save Wisdom neg) for 1 day"',
  'Maze':
    'School=Conjuration ' +
    'Level=W8 ' +
    'Description=' +
      '"R60\' Sends the target to a labyrinthine demiplane (DC 20 Intelligence escapes; minotaurs and goristro demons automatically succeed) for concentration up to 10 min"',
  'Meld Into Stone':
    'School=Transmutation ' +
    'Level=C3,D3 ' +
    'Ritual=true ' +
    'Description=' +
      '"Self steps into rock, losing sight and muffling hearing but allowing casting spells on self, for up to 8 hr"',
  'Mending':
    'School=Transmutation ' +
    'Level=B0,C0,D0,S0,W0 ' +
    'Description="Touch repairs a break or tear up to 1 ft"',
  'Message':
    'School=Transmutation ' +
    'Level=B0,S0,W0 ' +
    'Description=' +
      '"R120\' Self and target can hold a whispered conversation for 1 rd"',
  'Meteor Swarm':
    'School=Evocation ' +
    'Level=S9,W9 ' +
    'Description=' +
      '"R1 mile 4 40\' radius areas each inflict 20d6 HP fire and 20d6 HP bludgeoning (save Dexterity half) and ignite unattended flammable objects"',
  'Mind Blank':
    'School=Abjuration ' +
    'Level=B8,W8 ' +
    'Description=' +
      '"Touched gains immunity to psychic damage, emotion and thought detection, divination, and charm for 1 day"',
  'Minor Illusion':
    'School=Illusion ' +
    'Level=B0,K0,S0,W0 ' +
    'Description=' +
      '"R30\' Creates the sound of 1 creature or a 5\' cube image (Investigation detects) for 1 min"',
  'Mirage Arcane':
    'School=Illusion ' +
    'Level=B7,D7,W7 ' +
    'Description="Creates 1 mile sq of illusionary terrain for 10 days"',
  'Mirror Image':
    'School=Illusion ' +
    'Level=K2,S2,W2 ' +
    'Description=' +
      '"3 duplicates (AC %{10+dexterityModifier}; damage destroys) allow misdirecting attacks on self with a 6, 8, or 11 on a d20 with 3, 2, or 1 remaining duplicate for 1 min"',
  'Mislead':
    'School=Illusion ' +
    'Level=B5,W5 ' +
    'Description=' +
      '"Makes self invisible and creates an illusory duplicate that can move %{speed*2}\' and share senses for concentration up to 1 hr; attacking or casting ends"',
  'Misty Step':
    'School=Conjuration ' +
    'Level=K2,S2,W2 ' +
    'Description="Teleports self 30\'"',
  'Modify Memory':
    'School=Enchantment ' +
    'Level=B5,W5 ' +
    'AtHigherLevels=' +
      '"changes the memory of an event from the past 7, 30, 365, unlimited days at level 6, 7, 8, or 9" ' +
    'Description=' +
      '"R30\' Changes the target\'s memory of an event from the past 24 hr (save Wisdom neg)"',
  'Moonbeam':
    'School=Evocation ' +
    'Level=D2 ' +
    'AtHigherLevels="inflicts +1d10 HP" ' +
    'Description=' +
      '"R120\' 5\' radius inflicts 2d10 HP radiant (save Constitution half; shapechangers have disadvantage and revert form on failure) and can move 60\' per rd for concentration up to 1 min"',
  'Move Earth':
    'School=Transmutation ' +
    'Level=D6,S6,W6 ' +
    'Description=' +
      '"R120\' Reshapes a 40\' cube of earth each 10 minutes for concentration up to 2 hr"',

  'Nondetection':
    'School=Abjuration ' +
    'Level=B3,R3,W3 ' +
    'Description=' +
      '"Willing touched or touched object gains immunity to divination for 8 hr"',

  'Pass Without Trace':
    'School=Abjuration ' +
    'Level=D2,R2 ' +
    'Description=' +
      '"Targets in a 30\' radius gain +10 Stealth and become trackable only by magic for concentration up to 1 hr"',
  'Passwall':
    'School=Transmutation ' +
    'Level=W5 ' +
    'Description=' +
      '"R30\' Creates a 5\'x8\'x20\' passage through wood, plaster, or stone for 1 hr"',
  'Phantasmal Killer':
    'School=Illusion ' +
    'Level=W4 ' +
    'AtHigherLevels="inflicts +1d10 HP" ' +
    'Description=' +
      '"R120\' Target perceives a personal horror (save Wisdom neg) that frightens and inflicts 4d10 HP psychic per rd (save Wisdom ends) for concentration up to 1 min"',
  'Phantom Steed':
    'School=Illusion ' +
    'Level=W3 ' +
    'Ritual=true ' +
    'Description=' +
      '"R30\' Conjures a mount that can be ridden by a designated creature 100\' per rd (13 MPH) for 1 hr or until damaged"',
  'Planar Ally':
    'School=Conjuration ' +
    'Level=C6 ' +
    'Description="R60\' Bargains for service from an otherworldly entity"',
  'Planar Binding':
    'School=Abjuration ' +
    'Level=B5,C5,D5,W5 ' +
    'AtHigherLevels="extends the duration to 10, 30, 180, or 366 days at level 6, 7, 8, or 9" ' +
    'Description=' +
      '"R60\' Binds a celestial, elemental, fey, or fiend to service (save Charisma neg) for 1 day"',
  'Plane Shift':
    'School=Conjuration ' +
    'Level=C7,D7,K7,S7,W7 ' +
    'Description=' +
      '"Target (save Charisma neg) or self and 8 willing others travel to another plane"',
  'Plant Growth':
    'School=Transmutation ' +
    'Level=B3,D3,R3 ' +
    'Description=' +
      '"R150\' Causes plants in a 100\' radius to overgrow or enriches a 1/2 mile radius for 1 year"',
  'Poison Spray':
    'School=Conjuration ' +
    'Level=D0,K0,S0,W0 ' +
    'Description=' +
      '"R10\' Inflicts %{(level+7)//6}d12 HP poison (save Constitution neg)"',
  'Polymorph':
    'School=Transmutation ' +
    'Level=B4,D4,S4,W4 ' +
    'Description=' +
      '"R60\' Transforms target creature (save Wisdom neg; shapechangers automatically succeed) for concentration up to 1 hr or until reduced to 0 HP"',
  'Power Word Kill':
    'School=Enchantment ' +
    'Level=B9,K9,S9,W9 ' +
    'Description=' +
      '"R60\' Kills a target with up to 100 hit points; others are unaffected"',
  'Power Word Stun':
    'School=Enchantment ' +
    'Level=B8,K8,S8,W8 ' +
    'Description=' +
      '"R60\' Stuns a target with up to 150 HP (save Constitution ends); others are unaffected"',
  'Prayer Of Healing':
    'School=Evocation ' +
    'Level=C2 ' +
    'AtHigherLevels="restores +1d8 hit points" ' +
    'Description="R30\' 6 targets regain 2d8+%{mdf} hit points"',
  'Prestidigitation':
    'School=Transmutation ' +
    'Level=B0,K0,S0,W0 ' +
    'Description="R10\' Creates minor magic effects for 1 hr"',
  'Prismatic Spray':
    'School=Evocation ' +
    'Level=S7,W7 ' +
    'Description=' +
      '"60\' cone randomly inflicts one of: 10d6 HP fire, acid, lightning, poison, or cold (save Dexterity half); restrained (save Dexterity neg) and petrified after 3 failed Constitution saves (3 successes neg); blinded (save Dexterity neg) and banished to another plane (save Wisdom neg)"',
  'Prismatic Wall':
    'School=Abjuration ' +
    'Level=W9 ' +
    'Description=' +
      '"R60\' 90\'x30\' area blinds within 20\' for 1 min (save Constitution neg); creatures passing through suffer 10d6 HP each fire, acid, lightning, poison, and cold (save Dexterity half), restraint (save Dexterity neg) and petrification after 3 failed Constitution saves (3 successes neg), and blindness (save Dexterity neg) and banishment to another plane (save Wisdom neg)"',
  'Private Sanctum':
    'School=Abjuration ' +
    'Level=W4 ' +
    'AtHigherLevels="increases area by 100\'" ' +
    'Description=' +
      '"R120\' Protects up to 100\' sq from choices of sound, vision, divination, teleportation, and planar travel for 1 day; casting daily for 1 year makes the effects permanent"',
  'Produce Flame':
    'School=Conjuration ' +
    'Level=D0 ' +
    'Description=' +
      '"Lights a 10\' radius for 10 min; use for a ranged spell attack that inflicts %{(level+7)//6}d8 HP ends the spell"',
  'Programmed Illusion':
    'School=Illusion ' +
    'Level=B6,W6 ' +
    'Description=' +
      '"R120\' Creates a 30\' cube illusion when triggered (Investigation detects)"',
  'Project Image':
    'School=Illusion ' +
    'Level=B7,W7 ' +
    'Description=' +
      '"R500 miles Self can see, hear, and speak through an illusory double (Investigation detects) created in a familiar place for concentration up to 1 day"',
  'Protection From Energy':
    'School=Abjuration ' +
    'Level=C3,D3,R3,S3,W3 ' +
    'Description="Touched gains resistance to a choice of acid, cold, fire, lightning, or thunder damage for concentration up to 1 hr"',
  'Protection From Evil And Good':
    'School=Abjuration ' +
    'Level=C1,K1,P1,W1 ' +
    'Description=' +
      '"Willing touched gains immunity to charm, fright, and possession from aberrations, celestials, elementals, fey, fiends, and undead and advantage on saves vs. existing conditions for concentration up to 10 min; those creatures also suffer disadvantage on attacks on the target"',
  'Protection From Poison':
    'School=Abjuration ' +
    'Level=C2,D2,P2,R2 ' +
    'Description=' +
      '"Touched recovers from 1 poison and gains advantage on saves vs. poison and resistance to poison damage for 1 hr"',
  'Purify Food And Drink':
    'School=Transmutation ' +
    'Level=C1,D1,P1 ' +
    'Ritual=true ' +
    'Description=' +
      '"R10\' Removes poison and disease from nonmagical food and drink in a 5\' radius"',

  'Raise Dead':
    'School=Necromancy ' +
    'Level=B5,C5,P5 ' +
    'Description=' +
      '"Restores life with 1 hit point to and removes nonmagical diseases and poisons from a willing touched 10-day-old corpse; target suffers -4 attacks, saves, and ability checks, reduced by 1 for each long rest"',
  'Ray Of Enfeeblement':
    'School=Necromancy ' +
    'Level=K2,W2 ' +
    'Description=' +
      '"R60\' Ranged spell inflicts half damage with Strength weapons (save Constitution ends) for concentration up to 1 min"',
  'Ray Of Frost':
    'School=Evocation ' +
    'Level=S0,W0 ' +
    'Description=' +
      '"R60\' Ranged spell inflicts %{(level+7)//6}d8 HP cold and -10\' Speed for 1 rd"',
  'Regenerate':
    'School=Transmutation ' +
    'Level=B7,C7,D7 ' +
    'Description=' +
      '"Touched regains 4d8+15 HP, plus 1 HP per rd for 1 hr, and reattaches or regrows severed parts after 2 min"',
  'Reincarnate':
    'School=Transmutation ' +
    'Level=D5 ' +
    'Description=' +
      '"Resurrects the willing soul of a touched corpse in a new body"',
  'Remove Curse':
    'School=Abjuration ' +
    'Level=C3,K3,P3,W3 ' +
    'Description="Frees touched creature from all curses or breaks the attunement to a touched cursed object"',
  'Resilient Sphere':
    'School=Evocation ' +
    'Level=W4 ' +
    'Description=' +
      '"R30\' Traps the target in an impervious sphere (save Dexterity neg) for concentration up to 1 min"',
  'Resistance':
    'School=Abjuration ' +
    'Level=C0,D0 ' +
    'Description=' +
      '"Touched gains +1d4 on 1 save within concentration up to 1 min"',
  'Resurrection':
    'School=Necromancy ' +
    'Level=B7,C7 ' +
    'Description=' +
      '"Restores life with full hit points to and removes nonmagical diseases and poisons from a willing touched 100-year-old corpse; target suffers -4 attacks, saves, and ability checks, reduced by 1 for each long rest"',
  'Reverse Gravity':
    'School=Transmutation ' +
    'Level=D7,S7,W7 ' +
    'Description=' +
      '"R100\' Items in a 50\' radius fall upward for concentration up to 1 min"',
  'Revivify':
    // errata changes school to Necromancy
    'School=Necromancy ' +
    'Level=C3,P3 ' +
    'Description=' +
      '"Restores life and 1 hit point to a touched 1-minute-old corpse"',
  'Rope Trick':
    'School=Transmutation ' +
    'Level=W2 ' +
    'Description=' +
      '"Touched rope leads to an extradimensional space with room for 8 creatures for 1 hr"',

  'Sacred Flame':
    'School=Evocation ' +
    'Level=C0 ' +
    'Description=' +
      '"R60\' Inflicts %{(level+7)//6}d8 HP radiant (save Dexterity neg)"',
  'Sanctuary':
    'School=Abjuration ' +
    'Level=C1 ' +
    'Description=' +
      '"R30\' Foes of the target cannot attack it (save Wisdom neg) for 1 min; target attacking ends"',
  'Scorching Ray':
    'School=Evocation ' +
    'Level="K2 [The Fiend]",S2,W2 ' +
    'AtHigherLevels="gives +1 ranged attack" ' +
    'Description="R120\' 3 ranged attacks inflict 2d6 HP fire each"',
  'Scrying':
    'School=Divination ' +
    'Level=B5,C5,D5,K5,W5 ' +
    'Description=' +
      '"Self sees and hears a chosen target (save Wisdom, modified by degree of familiarity, neg for 24 hr) for concentration up to 10 min"',
  'Secret Chest':
    'School=Conjuration ' +
    'Level=W4 ' +
    'Description=' +
      '"Self can move a touched 12 cubic ft chest to and from the Ethereal Plane for 60+ days"',
  'See Invisibility':
    'School=Divination ' +
    'Level=B2,S2,W2 ' +
    'Description=' +
      '"Reveals invisible and ethereal creatures and objects for 1 hr"',
  'Seeming':
    'School=Illusion ' +
    'Level=B5,S5,W5 ' +
    'Description=' +
      '"R30\' Changes the appearance of targets (save Charisma neg; Investigation detects) for 8 hr"',
  'Sending':
    'School=Evocation ' +
    'Level=B3,C3,W3 ' +
    'Description="Self can exchange 25-word messages with a familiar target"',
  'Sequester':
    'School=Transmutation ' +
    'Level=W7 ' +
    'Description=' +
      '"Touched object or willing creature becomes hidden and enters suspended animation until a specified trigger"',
  'Shapechange':
    'School=Transmutation ' +
    'Level=D9,W9 ' +
    'Description=' +
      '"Polymorphs self into a familiar living creature of equal or lesser CR for concentration up to 1 hr or until reduced to 0 HP"',
  'Shatter':
    'School=Evocation ' +
    'Level=B2,K2,S2,W2 ' +
    'AtHigherLevels="inflicts +1d8 HP" ' +
    'Description=' +
      '"R60\' 10\' radius inflicts 3d8 HP thunder (save Constitution half; inorganic creatures have disadvantage)"',
  'Shield':
    'School=Abjuration ' +
    'Level=S1,W1 ' +
    'Description=' +
      '"Reaction gives +5 AC and immunity to <i>Magic Missile</i> until the next turn"',
  'Shield Of Faith':
    'School=Abjuration ' +
    'Level=C1,P1 ' +
    'Description="R60\' Target gains +2 AC for concentration up to 10 min"',
  'Shillelagh':
    'School=Transmutation ' +
    'Level=D0 ' +
    'Description=' +
      '"Held club inflicts +%{proficiencyBonus+mdf} magical attacks and 1d8+%{mdf} HP damage for 1 min"',
  'Shocking Grasp':
    'School=Evocation ' +
    'Level=S0,W0 ' +
    'Description=' +
      '"Touched suffers %{(level+7)//6}d8 HP lightning and loss of reactions until its next turn"',
  'Silence':
    'School=Illusion ' +
    'Level=B2,C2,R2 ' +
    'Ritual=true ' +
    'Description=' +
      '"R120\' 20\' radius blocks sound for concentration up to 10 min"',
  'Silent Image':
    'School=Illusion ' +
    'Level=B1,S1,W1 ' +
    'Description=' +
      '"R60\' Creates a 15\' cube movable illusion (Investigation detects) for concentration up to 10 min"',
  'Simulacrum':
    'School=Illusion ' +
    'Level=W7 ' +
    'Description=' +
      '"Uses snow to create an obedient copy of a target creature with half its hit points"',
  'Sleep':
    'School=Enchantment ' +
    'Level=B1,S1,W1 ' +
    'AtHigherLevels="affects +2d8 hit points of creatures" ' +
    'Description=' +
      '"R90\' 20\' radius puts to sleep 5d8 hit points of creatures, starting with those with the least hit points, for 1 min (damage or shaking wakens)"',
  'Sleet Storm':
    'School=Conjuration ' +
    'Level=D3,S3,W3 ' +
    'Description=' +
      '"R150\' 40\' radius douses flames and inflicts difficult terrain and falling prone (save Dexterity neg) for concentration up to 1 min"',
  'Slow':
    'School=Transmutation ' +
    'Level=S3,W3 ' +
    'Description=' +
      '"R120\' 6 targets in a 40\' cube suffer half Speed, -2 AC and Dexterity saves, loss of reactions, and no more than 1 action per rd (save Wisdom ends) for concentration up to 1 min"',
  'Spare The Dying':
    'School=Necromancy ' +
    'Level=C0 ' +
    'Description="Touched dying creature becomes stable"',
  'Speak With Animals':
    'School=Divination ' +
    'Level=B1,D1,R1 ' +
    'Ritual=true ' +
    'Description="Self can talk with animals for 10 min"',
  'Speak With Dead':
    'School=Necromancy ' +
    'Level=B3,C3 ' +
    'Description=' +
      '"R10\' Self can ask a corpse 5 questions; the corpse is then immune for 10 days "',
  'Speak With Plants':
    'School=Transmutation ' +
    'Level=B3,D3,R3 ' +
    'Description="Self can talk with and command plants for 10 min"',
  'Spider Climb':
    'School=Transmutation ' +
    'Level=K2,S2,W2 ' +
    'Description=' +
      '"Touched can crawl on walls and ceilings for concentration up to 1 hr"',
  'Spike Growth':
    'School=Transmutation ' +
    'Level=D2,R2 ' +
    'Description=' +
      '"R150\' 20\' radius becomes difficult terrain and inflicts 2d4 HP per 5\' movement for concentration up to 10 min"',
  'Spirit Guardians':
    'School=Conjuration ' +
    'Level=C3 ' +
    'AtHigherLevels="inflicts +1d8 HP" ' +
    'Description=' +
      '"15\' radius inflicts on foes 3d8 HP necrotic or radiant (save Wisdom half) and half Speed for concentration up to 10 min"',
  'Spiritual Weapon':
    'School=Evocation ' +
    'Level=C2 ' +
    'AtHigherLevels="inflicts +1d8 HP per 2 levels" ' +
    'Description=' +
      '"R60\' Creates a spectral weapon that inflicts 1d8+%{mdf} HP and can move 20\' and attack as a bonus action for 1 min"',
  'Stinking Cloud':
    'School=Conjuration ' +
    'Level=B3,"K3 [The Fiend]",S3,W3 ' +
    'Description=' +
      '"R90\' 20\' radius inflicts loss of actions (save Constitution neg) for concentration up to 1 min"',
  'Stone Shape':
    'School=Transmutation ' +
    'Level=C4,D4,W4 ' +
    'Description="Reshapes touched 5\' cube of stone"',
  'Stoneskin':
    'School=Abjuration ' +
    'Level=D4,R4,S4,W4 ' +
    'Description=' +
      '"Touched gains resistance to bludgeoning, piercing, and slashing damage for concentration up to 1 hr"',
  'Storm Of Vengeance':
    'School=Conjuration ' +
    'Level=D9 ' +
    'Description=' +
      '"360\' radius within sight inflicts 2d6 HP thunder and deafness (save Constitution neg), then 1d6 HP acid, then 10d6 HP lightning (6 targets; save Dexterity half), then 2d6 HP bludgeoning, then 1d6 cold per rd and no ranged attacks for concentration up to 1 min"',
  'Suggestion':
    'School=Enchantment ' +
    'Level=B2,K2,S2,W2 ' +
    'Description=' +
      '"R30\' Target follows a reasonable suggestion (save Wisdom neg) for concentration up to 8 hr"',
  'Sunbeam':
    'School=Evocation ' +
    'Level=D6,S6,W6 ' +
    'Description=' +
      '"60\' line inflicts 6d8 HP radiant and blindness for 1 rd (Constitution half HP only) for concentration up to 1 min"',
  'Sunburst':
    'School=Evocation ' +
    'Level=D8,S8,W8 ' +
    'Description=' +
      '"R150\' 60\' radius inflicts 12d6 HP and blindness (save Constitution half HP only; an additional save each turn ends blindness) for 1 min"',
  'Symbol':
    'School=Abjuration ' +
    'Level=B7,C7,W7 ' +
    'Description=' +
      '"Inscribes a touch object with a permanent glyph that, when triggered, inflicts a choice of harmful magic effect&mdash;10d10 HP necrotic (save Constitution half), arguing for 1 min (save Constitution neg), frightened and fleeing for 1 min (save Wisdom neg), overwhelmed with despair for 1 min (save Charisma neg), insane for 1 min (save Intelligence neg), incapacitated by pain for 1 min (save Constitution neg), asleep for 10 min or until shaken or harmed (save Wisdom neg), or stunned for 1 min (save Wisdom neg)"',

  'Telekinesis':
    'School=Transmutation ' +
    'Level=S5,W5 ' +
    'Description=' +
      '"R60\' Self can mentally move a 1000 lb object 30\' per rd (save Strength neg) for concentration up to 10 min"',
  'Telepathic Bond':
    'School=Divination ' +
    'Level=W5 ' +
    'Ritual=true ' +
    'Description="R30\' 8 willing targets can communicate mentally for 1 hr"',
  'Teleport':
    'School=Conjuration ' +
    'Level=B7,S7,W7 ' +
    'Description=' +
      '"R10\' Teleports an unattended object or self and 8 allies any distance; greater familiarity with the destination improves the accuracy"',
  'Teleportation Circle':
    'School=Conjuration ' +
    'Level=B5,S5,W5 ' +
    'Description=' +
      '"R10\' Creates a portal that provides a link to similar circles for 1 rd"',
  'Thaumaturgy':
    'School=Transmutation ' +
    'Level=C0 ' +
    'Description="R30\' Creates minor magic effects&mdash;a booming voice, modification of flames, harmless tremors, an illusory sound, movement of a door or window, or a change in eye appearance&mdash;for 1 min"',
  'Thunderwave':
    'School=Evocation ' +
    'Level=B1,D1,S1,W1 ' +
    'AtHigherLevels="inflicts +1d8 HP" ' +
    'Description=' +
      '"15\' cube inflicts 2d8 HP thunder and pushes 10\' (save Constitution half HP only)"',
  'Time Stop':
    'School=Transmutation ' +
    'Level=S9,W9 ' +
    'Description=' +
      '"Self can take 1d4+1 turns while no time passes for others; affecting another creature or moving more than 1000\' away ends"',
  'Tiny Hut':
    'School=Evocation ' +
    'Level=B3,W3 ' +
    'Ritual=true ' +
    'Description=' +
      '"Creates a 10\' radius dome, impassable by objects and spells, for 8 hr"',
  'Tongues':
    'School=Divination ' +
    'Level=B3,C3,K3,S3,W3 ' +
    'Description=' +
      '"Touched understands any language and is universally understood for 1 hr"',
  'Transport Via Plants':
    'School=Conjuration ' +
    'Level=D6 ' +
    'Description=' +
      '"R10\' Allows teleportation from a large plant target to another for 1 rd"',
  'Tree Stride':
    'School=Conjuration ' +
    'Level=D5,R5 ' +
    'Description=' +
      '"Self may teleport 500\' between like trees once per rd for concentration up to 1 min"',
  'True Polymorph':
    'School=Transmutation ' +
    'Level=B9,K9,W9 ' +
    'Description=' +
      '"R30\' Transforms the target creature (save Wisdom neg) or object for concentration up to 1 hr or until reduced to 0 HP; concentrating for a full hr makes the change permanent"',
  'True Resurrection':
    'School=Necromancy ' +
    'Level=C9,D9 ' +
    'Description=' +
      '"Restores life and full hit points to and removes all diseases, poisons, wounds, and curses from a willing touched or named 200-year-old corpse"',
  'True Seeing':
    'School=Divination ' +
    'Level=B6,C6,K6,S6,W6 ' +
    'Description=' +
      '"Touched gains 120\' truesight, sees magically concealed doors, and can see into the Ethereal Plane for 1 hr"',
  'True Strike':
    'School=Divination ' +
    'Level=B0,K0,S0,W0 ' +
    'Description=' +
      '"R30\' Self gains advantage on the next attack on the target within 1 rd"',

  'Unseen Servant':
    'School=Conjuration ' +
    'Level=B1,K1,W1 ' +
    'Ritual=true ' +
    'Description=' +
      '"R60\' Invisible force with AC 10, 1 hit point, and Strength 2 can move 15\' per rd and performs simple tasks for 1 hr or until damaged"',

  'Vampiric Touch':
    'School=Necromancy ' +
    'Level=K3,W3 ' +
    'AtHigherLevels="inflicts +1d6 HP" ' +
    'Description=' +
      '"Touch inflicts 3d6 HP, and self regains half as many, for concentration up to 1 min"',
  'Vicious Mockery':
    'School=Enchantment ' +
    'Level=B0 ' +
    'Description=' +
      '"R60\' Inflicts %{(level+7)//6}d4 HP psychic and disadvantage on next attack (save Wisdom neg) for 1 rd"',

  'Wall Of Fire':
    'School=Evocation ' +
    'Level=D4,"K4 [The Fiend]",S4,W4 ' +
    'AtHigherLevels="inflicts +1d8 HP" ' +
    'Description=' +
      '"R120\' Creates a 60\'x20\'x1\' wall or a 20\'x20\'x1\' ring that inflicts 5d8 HP fire (save Dexterity half) within 10\' of a chosen side for concentration up to 1 min"',
  'Wall Of Force':
    'School=Evocation ' +
    'Level=W5 ' +
    'Description=' +
      '"R120\' Creates 10 10\'x10\' impassable force panels for concentration up to 10 min"',
  'Wall Of Ice':
    'School=Evocation ' +
    'Level=W6 ' +
    'AtHigherLevels="inflicts +2d6 HP initially, +1d6 HP to passers" ' +
    'Description=' +
      '"R120\' Creates 10 10\'x10\'x1\' panels, with AC 12 and 30 HP each, that inflict 10d6 HP cold (save Dexterity half) initially and, if broken, 5d6 HP cold to creatures passing through (save Constitution half) for concentration up to 10 min"',
  'Wall Of Stone':
    'School=Evocation ' +
    'Level=D5,S5,W5 ' +
    'Description=' +
      '"R120\' Creates 10 10\'x10\'x6\\" or 10\'x20\'x3\\" panels for concentration up to 10 min"',
  'Wall Of Thorns':
    'School=Conjuration ' +
    'Level=D6 ' +
    'AtHigherLevels="inflicts +1d8 HP" ' +
    'Description=' +
      '"R120\' Creates a 60\'x10\'x5\' wall or a 20\'x20\'x5\' ring that inflicts 7d8 HP piercing (save Dexterity half) initially, plus half Speed and 7d8 HP slashing to creatures passing through (save Dexterity half) for concentration up to 10 min"',
  'Warding Bond':
    'School=Abjuration ' +
    'Level=C2 ' +
    'Description=' +
      '"Touched gains +1 AC, +1 saves, and resistance to all damage while within 60\' of self, and any damage to the target also affects self, for 1 hr"',
  'Water Breathing':
    'School=Transmutation ' +
    'Level=D3,R3,S3,W3 ' +
    'Ritual=true ' +
    'Description="R30\' 10 targets can breathe underwater for 24 hr"',
  'Water Walk':
    'School=Transmutation ' +
    'Level=C3,D3,R3,S3 ' +
    'Ritual=true ' +
    'Description="R30\' 10 targets can traverse liquids for 1 hr"',
  'Web':
    'School=Conjuration ' +
    'Level=S2,W2 ' +
    'Description=' +
      '"R60\' 20\' cube restrains creatures (save Dexterity neg and Strength frees) for concentration up to 1 hr; burning the web inflicts 2d4 HP fire"',
  'Weird':
    'School=Illusion ' +
    'Level=W9 ' +
    'Description=' +
      '"R120\' 30\' radius inflicts frightened and 4d10 HP psychic each rd (save Wisdom ends) for concentration up to 1 min"',
  'Wind Walk':
    'School=Transmutation ' +
    'Level=D6 ' +
    'Description=' +
      '"R30\' Self and 10 others can become gaseous, gaining a 300\' per rd fly Speed and resistance to nonmagical weapons, at will for 8 hr; converting to or from gas requires 1 min of incapacitation"',
  'Wind Wall':
    'School=Evocation ' +
    'Level=D3,R3 ' +
    'Description=' +
      '"R120\' Creates a 50\'x15\'x1\' area that inflicts 3d8 HP bludgeoning (save Strength half) and deflects lightweight creatures and objects for concentration up to 1 min"',
  'Wish':
    'School=Conjuration ' +
    'Level=S9,W9 ' +
    'Description="Alters reality with few limits"',
  'Word Of Recall':
    'School=Conjuration ' +
    'Level=C6 ' +
    'Description=' +
      '"R5\' Teleports self and 5 others to a prepared location"',

  'Zone Of Truth':
    'School=Enchantment ' +
    'Level=B2,C2,P2 ' +
    'Description=' +
      '"R60\' Creatures in a 15\' radius cannot lie (save Charisma neg) for 10 min"'

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
  'Dice Set':'Type=Gaming',
  'Dragonchess Set':'Type=Gaming',
  'Playing Card Set':'Type=Gaming',
  'Three-Dragon Ante Set':'Type=Gaming',
  'Herbalism Kit':'Type=General',
  'Bagpipes':'Type=Musical',
  'Drum':'Type=Musical',
  'Dulcimer':'Type=Musical',
  'Flute':'Type=Musical',
  'Lute':'Type=Musical',
  'Lyre':'Type=Musical',
  'Horn':'Type=Musical',
  'Pan Flute':'Type=Musical',
  'Shawm':'Type=Musical',
  'Viol':'Type=Musical',
  "Navigator's Tools":'Type=General',
  "Poisoner's Kit":'Type=General',
  "Thieves' Tools":'Type=General',
  'Vehicles (Land)':'Type=General',
  'Vehicles (Water)':'Type=General'
};
SRD5E.WEAPONS = {

  'Club':'Category="Simple Melee" Property=Light Damage=1d4',
  'Dagger':
    'Category="Simple Melee" Property=Light,Finesse,Thrown Damage=1d4 ' +
    'Range=20/60',
  'Greatclub':'Category="Simple Melee" Property=Two-Handed Damage=1d8',
  'Handaxe':
    'Category="Simple Melee" Property=Light,Thrown Damage=1d6 Range=20/60',
  'Javelin':
    'Category="Simple Melee" Property=Light,Thrown Damage=1d6 Range=30/120',
  'Light Hammer':
    'Category="Simple Melee" Property=Light,Thrown Damage=1d4 Range=20/60',
  'Mace':'Category="Simple Melee" Damage=1d6',
  'Quarterstaff':'Category="Simple Melee" Property=Versatile Damage=1d6',
  'Sickle':'Category="Simple Melee" Property=Light Damage=1d4',
  'Spear':'Category="Simple Melee" Property=Versatile Damage=1d6 Range=20/60',
  // errata removes Unarmed Strike

  'Light Crossbow':
    'Category="Simple Ranged" Property=Ammunition,Loading,Two-Handed ' +
    'Damage=1d8 Range=80/320',
  'Dart':
    'Category="Simple Ranged" Property=Finesse,Thrown Damage=1d4 Range=20/60',
  'Shortbow':
    'Category="Simple Ranged" Property=Ammunition,Two-Handed Damage=1d6 ' +
    'Range=80/320',
  'Sling':
    'Category="Simple Ranged" Property=Ammunition Damage=1d4 Range=30/120',

  'Battleaxe':'Category="Martial Melee" Property=Versatile Damage=1d8',
  'Flail':'Category="Martial Melee" Damage=1d8',
  'Glaive':
    'Category="Martial Melee" Property=Heavy,Reach,Two-Handed Damage=1d10',
  'Greataxe':'Category="Martial Melee" Property=Heavy,Two-Handed Damage=1d12',
  'Greatsword':'Category="Martial Melee" Property=Heavy,Two-Handed Damage=2d6',
  'Halberd':
    'Category="Martial Melee" Property=Heavy,Reach,Two-Handed Damage=1d10',
  'Lance':'Category="Martial Melee" Property=Reach,Special Damage=1d12',
  'Longsword':'Category="Martial Melee" Property=Versatile Damage=1d8',
  'Maul':'Category="Martial Melee" Property=Heavy,Two-Handed Damage=2d6',
  'Morningstar':'Category="Martial Melee" Damage=1d8',
  'Pike':'Category="Martial Melee" Property=Heavy,Reach,Two-Handed Damage=1d10',
  'Rapier':'Category="Martial Melee" Property=Finesse Damage=1d8',
  'Scimitar':'Category="Martial Melee" Property=Finesse,Light Damage=1d6',
  'Shortsword':'Category="Martial Melee" Property=Finesse,Light Damage=1d6',
  'Trident':
    'Category="Martial Melee" Property=Thrown,Versatile Damage=1d6 Range=20/60',
  'War Pick':'Category="Martial Melee" Damage=1d8',
  'Warhammer':'Category="Martial Melee" Property=Versatile Damage=1d8',
  'Whip':'Category="Martial Melee" Property=Finesse,Reach Damage=1d4',

  'Blowgun':
    'Category="Martial Ranged" Property=Ammunition,Loading Damage=1 ' +
    'Range=25/100',
  'Hand Crossbow':
    'Category="Martial Ranged" Property=Ammunition,Light,Loading Damage=1d6 ' +
    'Range=30/120',
  'Heavy Crossbow':
    'Category="Martial Ranged" Property=Ammunition,Heavy,Loading,Two-Handed ' +
    'Damage=1d10 Range=100/400',
  'Longbow':
    'Category="Martial Ranged" Property=Ammunition,Heavy,Two-Handed ' +
    'Damage=1d8 Range=150/600',
  'Net':
    'Category="Martial Ranged" Property=Special,Thrown Damage=None Range=5/15'

};
SRD5E.DEITIES = {
  'None':'',
  // Celtic
  'Celtic-The Daghdha':'Alignment="Chaotic Good" Domain=Nature,Trickery',
  'Celtic-Arawn':'Alignment="Neutral Evil" Domain=Life,Death',
  'Celtic-Belenus':'Alignment="Neutral Good" Domain=Light',
  'Celtic-Briantia':'Alignment="Neutral Good" Domain=Life',
  'Celtic-Diancecht':'Alignment="Lawful Good" Domain=Life',
  'Celtic-Dunatis':'Alignment=Neutral Domain=Nature',
  'Celtic-Goibhniu':'Alignment="Neutral Good" Domain=Knowledge,Life',
  'Celtic-Lugh':'Alignment="Chaotic Neutral" Domain=Knowledge,Life',
  'Celtic-Manannan Mac Lir':'Alignment="Lawful Neutral" Domain=Nature,Tempest',
  'Celtic-Math Mathonwy':'Alignment="Neutral Evil" Domain=Knowledge',
  'Celtic-Morrigan':'Alignment="Chaotic Evil" Domain=War',
  'Celtic-Nuada':'Alignment=Neutral Domain=War',
  'Celtic-Oghma':'Alignment="Neutral Good" Domain=Knowledge',
  'Celtic-Silvanus':'Alignment=Neutral Domain=Nature',
  // Greek
  'Greek-Zeus':'Alignment=Neutral Domain=Tempest',
  'Greek-Aphrodite':'Alignment="Chaotic Good" Domain=Light',
  'Greek-Apollo':'Alignment="Chaotic Good" Domain=Knowledge,Life,Light',
  'Greek-Ares':'Alignment="Chaotic Evil" Domain=War',
  'Greek-Artemis':'Alignment="Neutral Good" Domain=Life,Nature',
  'Greek-Athena':'Alignment="Lawful Good" Domain=Knowledge,War',
  'Greek-Demeter':'Alignment="Neutral Good" Domain=Life',
  'Greek-Dionysus':'Alignment="Chaotic Neutral" Domain=Life',
  'Greek-Hades':'Alignment="Lawful Evil" Domain=Death',
  'Greek-Hecate':'Alignment="Chaotic Evil" Domain=Knowledge,Trickery',
  'Greek-Hephaestus':'Alignment="Neutral Good" Domain=Knowledge',
  'Greek-Hera':'Alignment="Chaotic Neutral" Domain=Trickery',
  'Greek-Hercules':'Alignment="Chaotic Good" Domain=Tempest,War',
  'Greek-Hermes':'Alignment="Chaotic Good" Domain=Trickery',
  'Greek-Hestia':'Alignment="Neutral Good" Domain=Life',
  'Greek-Nike':'Alignment="Lawful Neutral" Domain=War',
  'Greek-Pan':'Alignment="Chaotic Neutral" Domain=Nature',
  'Greek-Poseidon':'Alignment="Chaotic Neutral" Domain=Tempest',
  'Greek-Tyche':'Alignment=Neutral Domain=Trickery',
  // Egyptian
  'Egyptian-Re-Horakhty':'Alignment="Lawful Good" Domain=Life,Light',
  'Egyptian-Anubis':'Alignment="Lawful Neutral" Domain=Death',
  'Egyptian-Apep':'Alignment="Neutral Evil" Domain=Trickery',
  'Egyptian-Bast':'Alignment="Chaotic Good" Domain=War',
  'Egyptian-Bes':'Alignment="Chaotic Neutral" Domain=Trickery',
  'Egyptian-Hathor':'Alignment="Neutral Good" Domain=Life,Light',
  'Egyptian-Imhotep':'Alignment="Neutral Good" Domain=Knowledge',
  'Egyptian-Isis':'Alignment="Neutral Good" Domain=Knowledge,Life',
  'Egyptian-Nephthys':'Alignment="Chaotic Good" Domain=Death',
  'Egyptian-Osiris':'Alignment="Lawful Good" Domain=Life,Nature',
  'Egyptian-Ptah':'Alignment="Lawful Neutral" Domain=Knowledge',
  'Egyptian-Set':'Alignment="Chaotic Evil" Domain=Death,Tempest,Trickery',
  'Egyptian-Sobek':'Alignment="Lawful Evil" Domain=Nature,Tempest',
  'Egyptian-Thoth':'Alignment=Neutral Domain=Knowledge',
  // Norse
  'Norse-Odin':'Alignment="Neutral Good" Domain=Knowledge,War',
  'Norse-Aegir':'Alignment="Neutral Evil" Domain=Tempest',
  'Norse-Balder':'Alignment="Neutral Good" Domain=Life,Light',
  'Norse-Forseti':'Alignment=Neutral Domain=Light',
  'Norse-Frey':'Alignment="Neutral Good" Domain=Life,Light',
  'Norse-Freya':'Alignment="Neutral Good" Domain=Life',
  'Norse-Frigga':'Alignment=Neutral Domain=Life,Light',
  'Norse-Heimdall':'Alignment="Lawful Good" Domain=Light,War',
  'Norse-Hel':'Alignment="Neutral Evil" Domain=Death',
  'Norse-Hermod':'Alignment="Chaotic Neutral" Domain=Trickery',
  'Norse-Loki':'Alignment="Chaotic Evil" Domain=Trickery',
  'Norse-Njord':'Alignment="Neutral Good" Domain=Nature,Tempest',
  'Norse-Odor':'Alignment="Chaotic Good" Domain=Light',
  'Norse-Sif':'Alignment="Chaotic Good" Domain=War',
  'Norse-Skadi':'Alignment=Neutral Domain=Nature',
  'Norse-Surtur':'Alignment="Lawful Evil" Domain=War',
  'Norse-Thor':'Alignment="Chaotic Good" Domain=Tempest,War',
  'Norse-Thrym':'Alignment="Chaotic Evil" Domain=War',
  'Norse-Tyr':'Alignment="Lawful Neutral" Domain=Knowledge,War',
  'Norse-Uller':'Alignment="Chaotic Neutral" Domain=Nature'
};

SRD5E.LEVELS_EXPERIENCE = [
  0, 0.3, 0.9, 2.7, 6.5, 14, 23, 34, 48, 64,
  85, 100, 120, 140, 165, 195, 225, 265, 305, 355, 1000
];
// Extended from SRD5E weapons table based on SRD35 damage for large creatures
SRD5E.VERSATILE_WEAPON_DAMAGE = {
  'None':'None', '1':'1', '1d2':'1d3', '1d3':'1d4', '1d4':'1d6', '1d6':'1d8',
  '1d8':'1d10', '1d10':'1d12', '1d12':'3d6', '2d4':'2d6', '2d6':'3d6',
  '2d8':'3d8', '2d10':'4d8'
};

/* Defines the rules related to character abilities. */
SRD5E.abilityRules = function(rules) {

  for(let ability in SRD5E.ABILITIES) {
    ability = ability.toLowerCase();
    rules.defineChoice('notes', ability + ':%V (%1)');
    rules.defineRule
      (ability + 'Modifier', ability, '=', 'Math.floor((source - 10) / 2)');
    rules.defineRule(ability + '.1', ability + 'Modifier', '=', null);
    rules.defineRule(ability,
      'abilityBoosts.' + ability.charAt(0).toUpperCase() + ability.substring(1), '+', null
    );
  }
  rules.defineRule('carry', 'strength', '=', 'source * 15');
  rules.defineRule('lift', 'strength', '=', 'source * 30');
  rules.defineRule('speed',
    '', '=', '30',
    'abilityNotes.armorSpeedAdjustment', '+', null
  );
  QuilvynRules.validAllocationRules
    (rules, 'abilityBoost', 'abilityBoostChoiceCount', 'Sum "^abilityBoosts\\."');

};

/* Defines the rules related to combat. */
SRD5E.combatRules = function(rules, armors, shields, weapons) {

  QuilvynUtils.checkAttrTable
    (armors, ['AC', 'Bulky', 'Dex', 'Str', 'Weight']);
  QuilvynUtils.checkAttrTable(shields, ['AC']);
  QuilvynUtils.checkAttrTable
    (weapons, ['Category', 'Damage', 'Property', 'Range']);

  for(let armor in armors) {
    rules.choiceRules(rules, 'Armor', armor, armors[armor]);
  }
  for(let shield in shields) {
    rules.choiceRules(rules, 'Shield', shield, shields[shield]);
  }
  for(let weapon in weapons) {
    let pattern = weapon.replace(/  */g, '\\s+');
    let prefix =
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
  rules.defineRule('hitPoints',
    'combatNotes.constitutionHitPointsAdjustment', '+', null,
    // errata specifies a minimum in the case of low constitution
    'level', '^', null
  );
  rules.defineRule('initiative', 'dexterityModifier', '=', null);
  SRD5E.weaponRules(rules, 'Unarmed', 'Unarmed', [], '1', null);
  rules.defineRule('weapons.Unarmed', '', '=', '1');

  for(let ability in SRD5E.ABILITIES) {
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
    (backgrounds, ['Equipment', 'Features']);
  QuilvynUtils.checkAttrTable
    (classes, ['Require', 'HitDie', 'Features', 'Selectables', 'SpellAbility', 'SpellSlots', 'MulticlassPrerequisite']);
  QuilvynUtils.checkAttrTable(deities, ['Alignment', 'Domain']);
  QuilvynUtils.checkAttrTable
    (paths, ['Features', 'Selectables', 'Group', 'Level', 'SpellAbility', 'SpellSlots', 'Spells']);
  QuilvynUtils.checkAttrTable
    (races, ['Require', 'Features', 'Selectables', 'Size', 'Speed']);

  for(let alignment in alignments) {
    rules.choiceRules(rules, 'Alignment', alignment, alignments[alignment]);
  }
  for(let background in backgrounds) {
    rules.choiceRules(rules, 'Background', background, backgrounds[background]);
  }
  for(let clas in classes) {
    rules.choiceRules(rules, 'Class', clas, classes[clas]);
  }
  for(let deity in deities) {
    rules.choiceRules(rules, 'Deity', deity, deities[deity]);
  }
  for(let path in paths) {
    rules.choiceRules(rules, 'Path', path, paths[path]);
  }
  for(let race in races) {
    rules.choiceRules(rules, 'Race', race, races[race]);
  }

  rules.defineRule('casterLevel',
    'casterLevelArcane', '+=', null,
    'casterLevelDivine', '+=', null
  );
  rules.defineRule
    ('experienceNeeded', 'level', '=', 'SRD5E.LEVELS_EXPERIENCE[source]*1000');
  rules.defineRule('features.Small', 'size', '=', 'source=="Small" ? 1 : null');
  rules.defineRule('level',
    'experience', '=', 'SRD5E.LEVELS_EXPERIENCE.findIndex(item => item * 1000 > source)'
  );
  QuilvynRules.validAllocationRules(rules, 'level', 'level', 'levelsAllocated');
  rules.defineChoice
    ('notes', 'validationNotes.multiclassRequirements:Requires meeting the multiclass requirements for %V additional chosen class%{validationNotes.multiclassRequirements>1?\'es\':\'\'}');
  rules.defineRule('validationNotes.multiclassRequirements',
    'classCount', '=', 'source>1 ? source - 1 : null',
    'multiclassPrerequisitesMet', '+', '-source',
    '', '^', '0'
  );

};

/* Defines rules related to magic use. */
SRD5E.magicRules = function(rules, schools, spells) {

  QuilvynUtils.checkAttrTable(schools, ['Features']);
  QuilvynUtils.checkAttrTable(spells, [
    'School', 'Group', 'Level', 'Ritual', 'Description', 'AtHigherLevels'
  ]);

  for(let school in schools) {
    rules.choiceRules(rules, 'School', school, schools[school]);
  }
  for(let spell in spells) {
    rules.choiceRules(rules, 'Spell', spell, spells[spell]);
  }

};

/* Defines rules related to character aptitudes. */
SRD5E.talentRules = function(
  rules, feats, features, goodies, languages, skills, tools
) {

  QuilvynUtils.checkAttrTable(feats, ['Require', 'Imply', 'Type']);
  QuilvynUtils.checkAttrTable
    (features, ['Section', 'Note', 'Spells', 'SpellAbility']);
  QuilvynUtils.checkAttrTable(languages, []);
  QuilvynUtils.checkAttrTable(skills, ['Ability', 'Class']);
  QuilvynUtils.checkAttrTable(tools, ['Type']);

  for(let feat in feats) {
    rules.choiceRules(rules, 'Feat', feat, feats[feat]);
  }
  for(let feature in features) {
    rules.choiceRules(rules, 'Feature', feature, features[feature]);
  }
  for(let goody in goodies) {
    rules.choiceRules(rules, 'Goody', goody, goodies[goody]);
  }
  for(let language in languages) {
    rules.choiceRules(rules, 'Language', language, languages[language]);
  }
  for(let skill in skills) {
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
  for(let tool in tools) {
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
    (rules, 'language', 'languageChoiceCount', 'Sum "^languagesChosen\\."');
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
  else if(type == 'Armor') {
    let bulky = QuilvynUtils.getAttrValue(attrs, 'Bulky');
    SRD5E.armorRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'AC'),
      bulky && !(bulky+'').match(/(^n|false)$/i),
      QuilvynUtils.getAttrValue(attrs, 'Dex'),
      QuilvynUtils.getAttrValue(attrs, 'Str'),
      QuilvynUtils.getAttrValue(attrs, 'Weight')
    );
  } else if(type == 'Background')
    SRD5E.backgroundRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Equipment'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features')
    );
  else if(type == 'Background Feature')
    SRD5E.backgroundFeatureRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Background'),
      QuilvynUtils.getAttrValue(attrs, 'Level'),
      QuilvynUtils.getAttrValueArray(attrs, 'Replace')
    );
  else if(type == 'Class') {
    SRD5E.classRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValue(attrs, 'HitDie'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Selectables'),
      QuilvynUtils.getAttrValue(attrs, 'SpellAbility'),
      QuilvynUtils.getAttrValueArray(attrs, 'SpellSlots'),
      QuilvynUtils.getAttrValueArray(attrs, 'MulticlassPrerequisite')
    );
    SRD5E.classRulesExtra(rules, name);
  } else if(type == 'Class Feature')
    SRD5E.classFeatureRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValue(attrs, 'Class'),
      QuilvynUtils.getAttrValue(attrs, 'Level'),
      QuilvynUtils.getAttrValue(attrs, 'Selectable'),
      QuilvynUtils.getAttrValueArray(attrs, 'Replace')
    );
  else if(type == 'Deity')
    SRD5E.deityRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Alignment'),
      QuilvynUtils.getAttrValueArray(attrs, 'Domain')
    );
  else if(type == 'Feat') {
    SRD5E.featRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Imply')
    );
    SRD5E.featRulesExtra(rules, name);
  } else if(type == 'Feature')
    SRD5E.featureRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Section'),
      QuilvynUtils.getAttrValueArray(attrs, 'Note'),
      QuilvynUtils.getAttrValueArray(attrs, 'Spells'),
      QuilvynUtils.getAttrValue(attrs, 'SpellAbility')
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
  else if(type == 'Path')
    SRD5E.pathRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Group'),
      QuilvynUtils.getAttrValue(attrs, 'Level'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Selectables'),
      QuilvynUtils.getAttrValue(attrs, 'SpellAbility'),
      QuilvynUtils.getAttrValueArray(attrs, 'SpellSlots'),
      QuilvynUtils.getAttrValueArray(attrs, 'Spells')
    );
  else if(type == 'Race') {
    SRD5E.raceRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Selectables'),
      QuilvynUtils.getAttrValue(attrs, 'Size'),
      QuilvynUtils.getAttrValue(attrs, 'Speed')
    );
    SRD5E.raceRulesExtra(rules, name);
  } else if(type == 'Race Feature')
    SRD5E.raceFeatureRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValue(attrs, 'Race'),
      QuilvynUtils.getAttrValue(attrs, 'Level'),
      QuilvynUtils.getAttrValue(attrs, 'Selectable'),
      QuilvynUtils.getAttrValueArray(attrs, 'Replace')
    );
  else if(type == 'School')
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
    let description = QuilvynUtils.getAttrValue(attrs, 'Description');
    let groupLevels = QuilvynUtils.getAttrValueArray(attrs, 'Level');
    let higher = QuilvynUtils.getAttrValue(attrs, 'AtHigherLevels');
    let ritual = QuilvynUtils.getAttrValue(attrs, 'Ritual');
    ritual = ritual && !(ritual+'').match(/(^n|false)$/i);
    let school = QuilvynUtils.getAttrValue(attrs, 'School');
    let schoolAbbr = school.substring(0, 4);
    for(let i = 0; i < groupLevels.length; i++) {
      let matchInfo = groupLevels[i].match(/^(\D+)(\d+)(\s\[.*\])?$/);
      if(!matchInfo) {
        console.log('Bad level "' + groupLevels[i] + '" for spell ' + name);
        continue;
      }
      let group = matchInfo[1];
      let level = matchInfo[2] * 1;
      let path = matchInfo[3] || '';
      let fullName = name + '(' + group + level + path + ' ' + schoolAbbr + ')';
      SRD5E.spellRules(
        rules, fullName, school, group, level, ritual, description, higher
      );
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
  if(type != 'Spell') {
    type = type == 'Class' ? 'levels' :
    (type.charAt(0).toLowerCase() + type.substring(1).replaceAll(' ', '') + 's');
    rules.addChoice(type, name, attrs);
  }
};

/*
 * Removes #name# from the set of user #type# choices, reversing the effects of
 * choiceRules.
 */
SRD5E.removeChoice = function(rules, type, name) {
  let group =
    type.charAt(0).toLowerCase() + type.substring(1).replaceAll(' ', '') + 's';
  let choices = rules.getChoices(group);
  if(!choices)
    return;
  let currentAttrs = choices[name];
  if(currentAttrs) {
    delete choices[name];
    // Q defines no way to delete rules outright; instead, we override with a
    // noop all rules that have the removed choice as their source
    if(type.match(/^(Armor|Deity|Shield)$/)) {
      // Remove this item from rules' cached item stats ...
      let stats = rules[type.toLowerCase() + 'Stats'];
      if(stats) {
        for(let s in stats)
          delete stats[s][name];
      }
      // ... and force a recomputation of associated rules
      let first = Object.keys(choices)[0];
      if(first)
        rules.choiceRules(rules, type, first, choices[first]);
    } else if(type.match(/^(Background|Class|Race)$/)) {
      let prefix =
        name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');
      let level = type == 'Class' ? 'levels.' + name : (prefix + 'Level');
      let targets = rules.allTargets(level);
      targets.forEach(x => {
        rules.defineRule(x, level, '=', 'null');
      });
    } else if(type.match(/^(Background|Class|Race) Feature/)) {
      let base = QuilvynUtils.getAttrValue(currentAttrs, 'Background') ||
                 QuilvynUtils.getAttrValue(currentAttrs, 'Class') ||
                 QuilvynUtils.getAttrValue(currentAttrs, 'Race');
      let prefix =
        base.charAt(0).toLowerCase() + base.substring(1).replaceAll(' ', '');
      let source =
        QuilvynUtils.getAttrValue(currentAttrs, 'Selectable') != null ?
          'selectableFeatures.' + base + ' - ' + name :
        type.includes('Class') ? 'levels.' + base : (prefix + 'Level');
      rules.defineRule(prefix + 'Features.' + name, source, '=', 'null');
    } else {
      let source =
        type.charAt(0).toLowerCase() + type.substring(1).replaceAll(' ', '') +
        (type.match(/^(Feat|Feature|Skill)$/) ? 's' : '') +
        '.' + name;
      let targets = rules.allTargets(source);
      targets.forEach(x => {
        rules.defineRule(x, source, '=', 'null');
      });
      targets = rules.allTargets(group + 'Chosen.' + name);
      targets.forEach(x => {
        rules.defineRule(x, group + 'Chosen.' + name, '=', 'null');
      });
      let sources = rules.allSources(source);
      sources.forEach(x => {
        rules.defineRule(source, x, '=', 'null');
      });
      delete rules.getChoices('notes')[group + '.' + name];
    }
  } else if(type == 'Spell') {
    let notes = rules.getChoices('notes');
    QuilvynUtils.getKeys(choices, '^' + name + '\\(').forEach(s => {
      currentAttrs = choices[s];
      delete choices[s];
      delete notes['spells.' + s];
    });
  }
  // If this choice overloaded a plugin-defined one (e.g., a homebrew Fighter
  // class), restore the plugin version
  let constantName = type.toUpperCase().replaceAll(' ', '_') + 'S';
  let plugins = rules.getPlugins();
  if(rules.plugin)
    plugins.push(rules.plugin);
  for(let i = 0; i < plugins.length; i++) {
    let p = plugins[i];
    if(p[constantName] &&
       name in p[constantName] &&
       p[constantName][name] != currentAttrs) {
      rules.choiceRules(rules, type, name, p[constantName][name]);
      break;
    }
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
    console.log('Bad bulky "' + bulky + '" for armor ' + name);
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
     !(weight + '').match(/^(none|light|medium|heavy)$/i)) {
    console.log('Bad weight "' + weight + '" for armor ' + name);
    return;
  }

  if(weight.match(/^none$/i))
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
 * the equipment and features listed in #equipment# and #features#.
 */
SRD5E.backgroundRules = function(rules, name, equipment, features) {

  if(!name) {
    console.log('Empty background name');
    return;
  }
  if(!Array.isArray(equipment)) {
    console.log('Bad equipment list "' + equipment + '" for background ' + name);
    return;
  }
  if(!Array.isArray(features)) {
    console.log('Bad features list "' + features + '" for background ' + name);
    return;
  }

  let prefix =
    name.substring(0, 1).toLowerCase() + name.substring(1).replaceAll(' ', '');
  let backgroundLevel = prefix + 'Level';

  rules.defineRule(backgroundLevel,
    'background', '?', 'source == "' + name + '"',
    'level', '=', null
  );

  SRD5E.featureListRules(rules, features, name, backgroundLevel, false);
  rules.defineSheetElement(name + ' Features', 'Feats+', null, '; ');
  rules.defineChoice('extras', prefix + 'Features');

  // TODO Do anything with equipment?

};

/*
 * Defines in #rules# the rules required to give feature #name# to background
 * #backgroundName#. #replace# lists any background features that this new one
 * replaces.
 */
SRD5E.backgroundFeatureRules = function(
  rules, name, backgroundName, level, replace
) {

  if(!name) {
    console.log('Empty background feature name');
    return;
  }
  if(!(backgroundName in rules.getChoices('backgrounds'))) {
    console.log('Bad background "' + backgroundName + '" for background feature ' + name);
    return;
  }
  if(typeof level != 'number') {
    console.log('Bad level "' + level + '" for background feature ' + name);
    return;
  }
  if(!Array.isArray(replace)) {
    console.log('Bad replace list "' + replace + '" for background feature ' + name);
    return;
  }

  let featureSpec = level + ':' + name;
  let prefix =
    backgroundName.charAt(0).toLowerCase() + backgroundName.substring(1).replaceAll(' ', '');
  let backgroundLevel = prefix + 'Level';
  QuilvynRules.featureListRules
    (rules, [featureSpec], backgroundName, backgroundLevel, false);
  replace.forEach(f => {
    let hasVar = 'has' + f.replaceAll(' ', '');
    rules.defineRule(prefix + 'Features.' + f, hasVar, '?', 'source==1');
    rules.defineRule(hasVar,
      'features.' + backgroundName, '=', '1',
      prefix + 'Features.' + name, '=', '0'
    );
  });

};

/*
 * Defines in #rules# the rules associated with class #name#, which has the list
 * of hard prerequisites #requires#. The class grants #hitDie# (format [n]'d'n)
 * additional hit points with each level advance. #features# and #selectables#
 * list the fixed and selectable features acquired as the character advances in
 * class level. #spellAbility# names the ability for computing spell difficulty
 * class, and #spellSlots# lists the number of spells per level per day that
 * the class can cast. #multiclassPrerequisite# specifies any prerequisites
 * for adding the class to an existing character of another class.
 */
SRD5E.classRules = function(
  rules, name, requires, hitDie, features, selectables, spellAbility,
  spellSlots, multiclassPrerequisite
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
  spellAbility = (spellAbility + '').toLowerCase();
  if(!(spellAbility.charAt(0).toUpperCase() + spellAbility.substring(1) in SRD5E.ABILITIES)) {
    console.log('Bad spell ability "' + spellAbility + '" for class ' + name);
    return;
  }
  if(!Array.isArray(spellSlots)) {
    console.log('Bad spellSlots list "' + spellSlots + '" for class ' + name);
    return;
  }
  if(!Array.isArray(multiclassPrerequisite)) {
    console.log('Bad multiclass prerequisite list "' + multiclassPrerequisite + '" for class ' + name);
    return;
  }

  let classLevel = 'levels.' + name;
  let i;
  let prefix =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');

  if(requires.length > 0)
    QuilvynRules.prerequisiteRules
      (rules, 'validation', prefix + 'Class', classLevel, requires);

  SRD5E.featureListRules(rules, features, name, classLevel, false);
  SRD5E.featureListRules(rules, selectables, name, classLevel, true);
  rules.defineSheetElement(name + ' Features', 'Feats+', null, '; ');
  rules.defineChoice('extras', prefix + 'Features');

  rules.defineRule('classCount', classLevel, '+=', '1');
  rules.defineRule('featCount.General',
    'levels.' + name, '+=', 'Math.min(Math.floor(source / 4), 5)'
  );
  rules.defineRule('levelsAllocated', classLevel, '+=', null);
  rules.defineRule('proficiencyBonus',
    'levels.' + name, '=', 'Math.floor((source + 7) / 4)'
  );

  rules.defineRule
    ('casterLevel' + (spellAbility=='wisdom' ? 'Divine' : 'Arcane'), classLevel, '+=', null);
  rules.defineRule('casterLevels.' + name, classLevel, '^=', null);
  rules.defineRule('spellModifier.' + name,
    'casterLevels.' + name, '?', null,
    spellAbility + 'Modifier', '=', null
  );

  if(spellSlots.length > 0) {

    QuilvynRules.spellSlotRules(rules, classLevel, spellSlots);

    for(i = 0; i < spellSlots.length; i++) {
      let matchInfo = spellSlots[i].match(/^(\D+)\d:/);
      if(!matchInfo) {
        console.log('Bad format for spell slot "' + spellSlots[i] + '"');
        continue;
      }
      let spellType = matchInfo[1];
      rules.defineRule('casterLevels.' + spellType, classLevel, '^=', null);
      rules.defineRule('spellModifier.' + spellType,
        'casterLevels.' + spellType, '?', null,
        spellAbility + 'Modifier', '=', null
      );
      rules.defineRule('spellAttackModifier.' + spellType,
        'spellModifier.' + spellType, '=', null,
        'proficiencyBonus', '+', null
      );
      rules.defineRule('spellDifficultyClass.' + spellType,
        'spellAttackModifier.' + spellType, '=', '8 + source'
      );
    }

    rules.defineRule('magicNotes.spellcasting',
      classLevel, '=', '"' + name.toLowerCase() + '"'
    );

  }

  if(multiclassPrerequisite.length > 0) {
    QuilvynRules.prerequisiteRules(rules,
      'test', prefix + 'Multiclass', classLevel, multiclassPrerequisite
    );
    rules.defineRule('multiclassPrerequisitesMet',
      'testNotes.' + prefix + 'Multiclass', '+=', 'source==0 ? 1 : null'
    );
  }

};

/*
 * Defines in #rules# the rules associated with class #name# that cannot be
 * derived directly from the attributes passed to classRules.
 */
SRD5E.classRulesExtra = function(rules, name) {

  let classLevel = 'levels.' + name;

  if(name == 'Barbarian') {

    rules.defineRule('abilityNotes.fastMovement.1',
      'abilityNotes.fastMovement', '?', null,
      'armorWeight', '=', 'source < 3 ? 10 : null'
    );
    rules.defineRule('armorClass',
      'combatNotes.unarmoredDefense(Barbarian).1', '+', null
    );
    rules.defineRule
      ('combatNotes.extraAttack', classLevel, '+=', 'source<5 ? null : 1');
    rules.defineRule('combatNotes.unarmoredDefense(Barbarian).1',
      'combatNotes.unarmoredDefense(Barbarian)', '?', null,
      'armor', '?', 'source == "None"',
      'constitutionModifier', '=', null
    );
    rules.defineRule('selectableFeatureCount.Barbarian (Primal Path)',
      'featureNotes.primalPath', '=', '1'
    );
    rules.defineRule('speed', 'abilityNotes.fastMovement.1', '+', null);

  } else if(name == 'Bard') {

    rules.defineRule('bardicInspirationDie',
      classLevel, '=', 'source<20 ? 6 + Math.floor(source / 5) * 2 : 12'
    );
    rules.defineRule('featureNotes.bardicInspiration',
      'featureNotes.fontOfInspiration', '+', 'null' // italics
    );
    rules.defineRule('magicNotes.spellcasting.1', classLevel, '=', '1');
    rules.defineRule('selectableFeatureCount.Bard (Bard College)',
      'featureNotes.bardCollege', '=', '1'
    );

  } else if(name == 'Cleric') {

    rules.defineRule('clericHasDivineStrike', 'features.Life Domain', '=', '1');
    rules.defineRule('featureNotes.channelDivinity.1',
      'features.Channel Divinity', '?', null,
      'levels.Cleric', '+=', 'source<6 ? 1 : source<18 ? 2 : 3'
    );
    rules.defineRule('magicNotes.spellcasting.1', classLevel, '=', '1');
    rules.defineRule('selectableFeatureCount.Cleric (Divine Domain)',
      'featureNotes.divineDomain', '=', '1'
    );
    rules.defineRule('divineStrikeDamageType',
      'features.Divine Strike', '?', null,
      'features.Life Domain', '=', '"radiant"'
    );
    for(let s in rules.getChoices('selectableFeatures')) {
      if(s.match(/Cleric - .* Domain/)) {
        let domain = s.replace('Cleric - ', '').replace(' Domain', '');
        // Clerics w/no deity don't need to match deity domain
        rules.defineRule('validationNotes.cleric-' + domain.replaceAll(' ', '') + 'DomainSelectableFeature',
          'deity', '+', 'source == "None" ? 1 : null'
        );
      }
    }

  } else if(name == 'Druid') {

    rules.defineRule('magicNotes.spellcasting.1', classLevel, '=', '1');
    rules.defineRule('magicNotes.wildShape',
      classLevel, '=', 'source<4 ? "1/4" : source<8 ? "1/2" : "1"',
      'magicNotes.archdruid', '+', 'null' // Italics noop
    );
    rules.defineRule('selectableFeatureCount.Druid (Druid Circle)',
      'featureNotes.druidCircle', '=', '1'
    );
    rules.defineRule
      ('spellSlots.D0', 'magicNotes.bonusCantrip(CircleOfTheLand)', '+=', '1');
    for(let s in rules.getChoices('selectableFeatures')) {
      if(s.match(/Druid - Circle Of The Land/)) {
        let circle = s.replace('Druid - ', '');
        rules.defineRule
          ('features.Circle Of The Land', 'features.' + circle, '=', '1');
      }
    }

  } else if(name == 'Fighter') {

    rules.defineRule
      ('attackBonus.Ranged', 'combatNotes.fightingStyle(Archery)', '+=', '2');
    // Show Fighting Style (Defense) note even if armor == None
    rules.defineRule('combatNotes.fightingStyle(Defense).1',
      'combatNotes.fightingStyle(Defense)', '?', null,
      'armor', '=', 'source == "None" ? null : 1'
    );
    rules.defineRule('combatNotes.extraAttack',
      classLevel, '+=', 'source<5 ? null : source<11 ? 1 : source<20 ? 2 : 3'
    );
    rules.defineRule('featCount.General', 'fighterFeatBonus', '+', null);
    rules.defineRule('featureNotes.fightingStyle',
      'fighterFeatures.Fighting Style', '+=', '1',
      'featureNotes.additionalFightingStyle', '+', '1'
    );
    rules.defineRule('fighterFeatBonus',
      classLevel, '=', 'source<6 ? null : source<14 ? 1 : 2'
    );
    rules.defineRule('selectableFeatureCount.Fighter (Fighting Style)',
      'fighterFeatures.Fighting Style', '?', null,
      'featureNotes.fightingStyle', '+=', '1',
      'featureNotes.additionalFightingStyle', '+', '1'
    );
    rules.defineRule('selectableFeatureCount.Fighter (Martial Archetype)',
      'featureNotes.martialArchetype', '=', '1'
    );

  } else if(name == 'Monk') {

    rules.defineRule('abilityNotes.unarmoredMovement.1',
      'abilityNotes.unarmoredMovement', '?', null,
      'armor', '?', 'source == "None"',
      'shield', '?', 'source == "None"',
      classLevel, '=', 'Math.floor((source + 6) / 4) * 5'
    );
    rules.defineRule('abilityNotes.unarmoredMovement-1',
      'armor', '?', 'source == "None"',
      'shield', '?', 'source == "None"',
      classLevel, '?', 'source >= 9'
    );
    rules.defineRule
      ('armorClass', 'combatNotes.unarmoredDefense(Monk).1', '+', null);
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
    rules.defineRule('combatNotes.unarmoredDefense(Monk).1',
      'combatNotes.unarmoredDefense(Monk)', '?', null,
      'armor', '?', 'source == "None"',
      'wisdomModifier', '=', null
    );
    rules.defineRule('kiSaveDC',
      'monkFeatures.Ki', '?', null,
      'proficiencyBonus', '=', '8 + source',
      'wisdomModifier', '+', null
    );
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
    for(let ability in SRD5E.ABILITIES) {
      rules.defineRule
        ('saveProficiency.' + ability, 'saveNotes.diamondSoul', '=', '1');
    }
    rules.defineRule('selectableFeatureCount.Monk (Monastic Tradition)',
      'featureNotes.monasticTradition', '=', '1'
    );
    rules.defineRule('speed', 'abilityNotes.unarmoredMovement.1', '+', null);

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
    rules.defineRule('featureNotes.channelDivinity.1',
      'levels.Paladin', '+=', 'source<3 ? null : 1'
    );
    rules.defineRule('featureNotes.fightingStyle',
      'paladinFeatures.Fighting Style', '+=', '1'
    );
    rules.defineRule('selectableFeatureCount.Paladin (Fighting Style)',
      'paladinFeatures.Fighting Style', '?', null,
      'featureNotes.fightingStyle', '=', '1'
    );
    rules.defineRule('selectableFeatureCount.Paladin (Sacred Oath)',
      'featureNotes.sacredOath', '=', '1'
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
    rules.defineRule('featureNotes.fightingStyle',
      'rangerFeatures.Fighting Style', '+=', '1'
    );
    rules.defineRule('selectableFeatureCount.Ranger (Defensive Tactics)',
      'featureNotes.defensiveTactics', '=', '1'
    );
    rules.defineRule('selectableFeatureCount.Ranger (Fighting Style)',
      'rangerFeatures.Fighting Style', '?', null,
      'featureNotes.fightingStyle', '=', '1'
    );
    rules.defineRule("selectableFeatureCount.Ranger (Hunter's Prey)",
      "featureNotes.hunter'sPrey", '=', '1'
    );
    rules.defineRule('selectableFeatureCount.Ranger (Multiattack)',
      'featureNotes.multiattack', '=', '1'
    );
    rules.defineRule('selectableFeatureCount.Ranger (Ranger Archetype)',
      'featureNotes.rangerArchetype', '=', '1'
    );
    rules.defineRule("selectableFeatureCount.Ranger (Superior Hunter's Defense)",
      "featureNotes.superiorHunter'sDefense", '=', '1'
    );

  } else if(name == 'Rogue') {

    rules.defineRule('featCount.General', 'rogueFeatBonus', '+', null);
    rules.defineRule('rogueFeatBonus', classLevel, '=', 'source<10 ? null : 1');
    rules.defineRule('selectableFeatureCount.Rogue (Roguish Archetype)',
      'featureNotes.roguishArchetype', '=', '1'
    );

  } else if(name == 'Sorcerer') {

    let allSelectables = rules.getChoices('selectableFeatures');
    let origins =
      Object.keys(allSelectables).filter(x => allSelectables[x].includes('Sorcerous Origin')).map(x => x.replace('Sorcerer - ', ''));
    origins.forEach(o => {
      if(o.includes('(')) {
        let originGroup = o.replace(/\s*\(.*/, '');
        rules.defineRule('features.' + originGroup, 'features.' + o, '=', '1');
      }
    });
    rules.defineRule('draconicDamage',
      'features.Draconic Bloodline', '=', '"fire"',
      'features.Draconic Bloodline (Black)', '=', '"acid"',
      'features.Draconic Bloodline (Blue)', '=', '"lightning"',
      'features.Draconic Bloodline (Bronze)', '=', '"lightning"',
      'features.Draconic Bloodline (Copper)', '=', '"acid"',
      'features.Draconic Bloodline (Green)', '=', '"poison"',
      'features.Draconic Bloodline (Silver)', '=', '"cold"',
      'features.Draconic Bloodline (White)', '=', '"cold"'
    );
    rules.defineRule('featureNotes.metamagic',
      classLevel, '=', 'source<10 ? 2 : source<17 ? 3 : 4'
    );
    rules.defineRule('magicNotes.fontOfMagic', classLevel, '=', null);
    rules.defineRule('selectableFeatureCount.Sorcerer (Metamagic)',
      'featureNotes.metamagic', '=', null
    );
    rules.defineRule('selectableFeatureCount.Sorcerer (Sorcerous Origin)',
      'featureNotes.sorcerousOrigin', '=', '1'
    );

    rules.defineRule
      ('armorClass', 'combatNotes.draconicResilience.2', '^', null);
    rules.defineRule('combatNotes.draconicResilience.2',
      'features.Draconic Resilience', '?', null,
      'armor', '?', 'source == "None"',
      'dexterityModifier', '=', 'source + 13'
    );

  } else if(name == 'Warlock') {

    rules.defineRule('magicNotes.eldritchInvocations',
      classLevel, '=', 'source==2 ? 2 : source<9 ? Math.floor((source + 1) / 2) : Math.floor((source + 6) / 3)'
    );
    rules.defineRule('selectableFeatureCount.Warlock (Eldritch Invocation)',
      'magicNotes.eldritchInvocations', '=', null
    );
    rules.defineRule('selectableFeatureCount.Warlock (Otherworldly Patron)',
      'featureNotes.otherworldlyPatron', '=', '1'
    );
    rules.defineRule('selectableFeatureCount.Warlock (Pact Boon)',
      'featureNotes.pactBoon', '=', '1'
    );
    rules.defineRule('spells.Eldritch Blast (K0 Evoc)',
      'magicNotes.eldritchSpear', '=', 'null' // italics
    );
    rules.defineRule('maxKSlot',
      'casterLevels.K', '=', 'Math.min(Math.floor((source + 1) / 2), 5)'
    );
    [1, 2, 3, 4].forEach(sl => {
      rules.defineRule('spellSlots.K' + sl, 'maxKSlot', '?', 'source == ' + sl);
    });

  } else if(name == 'Wizard') {

    rules.defineRule('magicNotes.spellcasting.1', classLevel, '=', '1');
    rules.defineRule('selectableFeatureCount.Wizard (Arcane Tradition)',
      'featureNotes.arcaneTradition', '=', '1'
    );

  }

};

/*
 * Defines in #rules# the rules required to give feature #name# to class
 * #className# at level #level#. #selectable# gives the category if this feature
 * is selectable; it is otherwise null. #require# lists any hard prerequisites
 * for the feature, and #replace# lists any class features that this new one
 * replaces.
 */
SRD5E.classFeatureRules = function(
  rules, name, require, className, level, selectable, replace
) {

  if(!name) {
    console.log('Empty class feature name');
    return;
  }
  if(!Array.isArray(require)) {
    console.log('Bad require list "' + require + '" for class feature ' + name);
    return;
  }
  if(!(className in rules.getChoices('levels'))) {
    console.log('Bad class "' + className + '" for class feature ' + name);
    return;
  }
  if(typeof level != 'number') {
    console.log('Bad level "' + level + '" for class feature ' + name);
    return;
  }
  if(selectable && typeof selectable != 'string') {
    console.log('Bad selectable "' + selectable + '" for class feature ' + name);
    return;
  }
  if(!Array.isArray(replace)) {
    console.log('Bad replace list "' + replace + '" for class feature ' + name);
    return;
  }

  let classLevel = 'levels.' + className;
  let featureSpec = level + ':' + name;
  let prefix =
    className.charAt(0).toLowerCase() + className.substring(1).replaceAll(' ', '');
  if(selectable)
    featureSpec += ':' + selectable;
  if(require.length > 0)
    featureSpec = require.join('/') + ' ? ' + featureSpec;
  QuilvynRules.featureListRules
    (rules, [featureSpec], className, classLevel, selectable ? true : false);
  if(selectable) {
    let countVar =
      'selectableFeatureCount.' + className + ' (' + selectable + ')';
    if(!rules.getSources(countVar))
      rules.defineRule(countVar,
        classLevel, '=', level>1 ? 'source>=' + level + ' ? 1 : null' : '1'
      );
  }
  replace.forEach(f => {
    let hasVar = 'has' + f.replaceAll(' ', '');
    rules.defineRule(prefix + 'Features.' + f, hasVar, '?', 'source==1');
    rules.defineRule(hasVar,
      classLevel, '=', '1',
      prefix + 'Features.' + name, '=', '0'
    );
  });

};

/*
 * Defines in #rules# the rules associated with deity #name#. #alignment# gives
 * the deity's alignment and #domains# the associated domains.
 */
SRD5E.deityRules = function(rules, name, alignment, domains) {

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
      domains:{}
    };
  }

  rules.deityStats.alignment[name] = alignment;
  rules.deityStats.domains[name] = domains.join('/');

  rules.defineRule('deityAlignment',
    'deity', '=', QuilvynUtils.dictLit(rules.deityStats.alignment) + '[source]'
  );
  rules.defineRule('deityDomains',
    'deity', '=', QuilvynUtils.dictLit(rules.deityStats.domains) + '[source]'
  );

};

/*
 * Defines in #rules# the rules associated with feat #name#. #require# and
 * #implies# list any hard and soft prerequisites for the feat.
 */
SRD5E.featRules = function(rules, name, requires, implies) {

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

  let prefix =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');

  if(requires.length > 0)
    QuilvynRules.prerequisiteRules
      (rules, 'validation', prefix + 'Feat', 'feats.' + name, requires);
  if(implies.length > 0)
    QuilvynRules.prerequisiteRules
      (rules, 'sanity', prefix + 'Feat', 'feats.' + name, implies);
  rules.defineRule('features.' + name, 'feats.' + name, '=', null);

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
SRD5E.featureRules = function(
  rules, name, sections, notes, spells, spellAbility
) {

  if(!name) {
    console.log('Empty feature name');
    return;
  }
  if(!Array.isArray(sections)) {
    console.log('Bad sections list "' + sections + '" for feature ' + name);
    return;
  }
  if(!Array.isArray(notes)) {
    console.log('Bad notes list "' + notes + '" for feature ' + name);
    return;
  }
  if(sections.length != notes.length) {
    console.log(sections.length + ' sections, ' + notes.length + ' notes for feature ' + name);
    return;
  }
  // Backwards compatibility for modules that don't pass spells or spellAbility
  if(spellAbility == null)
    spellAbility = 'intelligence';
  if(spells == null)
    spells = [];
  spellAbility = (spellAbility+'').toLowerCase();
  if(!(spellAbility.charAt(0).toUpperCase() + spellAbility.substring(1) in SRD5E.ABILITIES)) {
    console.log
      ('Bad spell ability "' + spellAbility + '" for feature ' + name);
    return;
  }
  if(!Array.isArray(spells)) {
    console.log('Bad spells list "' + spells + '" for feature ' + name);
    return;
  }

  notes = notes.map(x => QuilvynRules.wrapVarsContainingSpace(x));

  let matchInfo;
  let prefix =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');

  for(let i = 0; i < sections.length; i++) {

    let section = sections[i].toLowerCase();
    let effects = notes[i];
    let maxSubnote =
      effects.includes('%1') ? +effects.match(/%\d/g).sort().pop().replace('%'):
      effects.includes('%V') ? 0 : -1;
    let note = section + 'Notes.' + prefix;
    let priorInSection =
      sections.slice(0, i).filter(x => x.toLowerCase() == section.toLowerCase()).length;
    if(priorInSection > 0)
      note += '-' + priorInSection;

    rules.defineChoice('notes', note + ':' + effects);
    rules.defineRule
      (note, 'features.' + name, effects.indexOf('%V') >= 0 ? '?' : '=', null);

    let addSource = false;

    while(effects.length > 0) {

      let m = effects.match(/^((%\{[^\}]*\}|\([^\)]*\)|[^\/])*)\/?(.*)$/);
      let effect = m[1];
      effects = m[3];

      matchInfo =
        effect.match(/([A-Z]\w*)\sProficiency\s\((([^\(]|\([^\)]*\))*)\)/);
      if(matchInfo) {
        let group = matchInfo[1].toLowerCase();
        matchInfo[2].split(/\/|;\s*/).forEach(affected => {
          matchInfo = affected.match(/^Choose\s(\d+|%V)/);
          if(!matchInfo)
            rules.defineRule(group + 'Proficiency.' + affected, note, '=', '1');
          else if(matchInfo[1].startsWith('%'))
            rules.defineRule(group + 'ChoiceCount', note, '+=', null);
          else
            rules.defineRule(group + 'ChoiceCount', note, '+=', matchInfo[1]);
        });
      }
      matchInfo = effect.match(/Ability Boost \((([^\(]|\([^\)]*\))*)\)/i);
      if(matchInfo) {
        let totalBoosts = 0;
        matchInfo[1].split(/\/|;\s*/).forEach(boosted => {
          matchInfo = boosted.match(/Choose (\d+|%V)/i);
          if(!matchInfo)
            rules.defineRule(boosted.toLowerCase(), note, '+', '1');
          else if(matchInfo[1].startsWith('%'))
            addSource = true;
          else
            totalBoosts += matchInfo[1] - 0;
        });
        rules.defineRule('abilityBoostChoiceCount',
          note, '+=', totalBoosts + (addSource ? ' + source' : '')
        );
      }
      matchInfo = effect.match(/Language \((([^\(]|\([^\)]*\))*)\)/i);
      if(matchInfo) {
        matchInfo[1].split(/\/|;\s*/).forEach(affected => {
          matchInfo = affected.match(/^Choose\s(\d+|%V)/);
          if(!matchInfo)
            rules.defineRule('languages.' + affected, note, '=', '1');
          else if(matchInfo[1].startsWith('%'))
            rules.defineRule('languageChoiceCount', note, '+=', null);
          else
            rules.defineRule('languageChoiceCount', note, '+=', matchInfo[1]);
        });
      }

      if((matchInfo = effect.match(/^([-+x](\d+(\.\d+)?|%[V1-9]|%\{[^\}]*\}))\s+(.*)$/)) != null) {

        let adjust = matchInfo[1];
        let adjusted = matchInfo[4];

        // Support +%{expr} by evaling expr for each id it contains
        if(adjust.match(/%{/) && !adjusted.match(/\b[a-z]/)) {
          let expression = adjust.substring(3, adjust.length - 1);
          let ids = new Expr(expression).identifiers();
          // TODO What if ids.length==0?
          let sn = ++maxSubnote;
          let target = sn>0 ? note + '.' + sn : note;
          rules.defineRule(target, 'features.' + name, '?', null);
          ids.forEach(id => {
            if(expression.trim() == id)
              rules.defineRule(target, id, '=', null);
            else
              rules.defineRule
                (target, id, '=', 'new Expr("' + expression + '").eval(dict)');
          });
          adjust = '%' + (sn==0 ? 'V' : sn);
          if(sn == 0)
            // Override '=' feature dependency rule created above
            rules.defineRule(note, 'features.' + name, '?', null);
        }

        let adjuster =
          adjust.match(/%\d/) ? note + '.' + adjust.replace(/.*%/, '') : note;
        let op = adjust.startsWith('x') ? '*' : '+';
        if(op == '*')
          adjust = adjust.substring(1);
        if(section == 'save' && adjusted.match(/^[A-Z]\w*$/)) {
          adjusted = 'save.' + adjusted;
        } else if(section == 'skill' &&
                  adjusted.match(/^[A-Z][a-z]*(\s[A-Z][a-z]*)*(\s\([A-Z][a-z]*(\s[A-Z][a-z]*)*\))?$/)) {
          adjusted = 'skills.' + adjusted;
        } else if(adjusted.match(/^[A-Z][a-z]*(\s[A-Z][a-z]*)*$/)) {
          adjusted = adjusted.charAt(0).toLowerCase() + adjusted.substring(1).replaceAll(' ', '');
        } else {
          continue;
        }
        rules.defineRule(adjusted,
          adjuster, op, !adjust.includes('%') ? adjust : adjust.startsWith('-') ? '-source' : 'source'
        );
        if(adjust == '%1' && !effect.includes(adjust))
          rules.defineRule(adjuster, note, '?', null);

      }

    }

  }

  if(spells.length > 0) {
    let levelAttr = 'level';
    let spellType = name.replaceAll(/[- ]/g, '');
    let sources =
      Object.assign({}, rules.getChoices('levels'), rules.getChoices('races'), rules.getChoices('backgrounds'));
    for(let s in sources) {
      let re = new RegExp('[,:"=]' + name.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&'));
      if(!sources[s].match(re))
        continue;
      spellType = s.replaceAll(/[- ]/g, '');
      let slot = QuilvynUtils.getAttrValue(sources[s], 'SpellSlots');
      if(slot) {
        // Spell feature for casting class. Reuse attack and DC values.
        levelAttr = 'levels.' + s;
        spellType = slot.replace(/\d.*/, '');
      } else {
        // Spell feature for non-casting class or for a race or background.
        // Display attack and DC values when this feature is acquired.
        // Only need to compute casterLevels and spellModifier for races and
        // backgrounds, since classRules computes these for classes.
        if(!(s in rules.getChoices('levels'))) {
          let sourceLevel =
            s.charAt(0).toLowerCase() + s.substring(1).replaceAll(' ', '') + 'Level';
          rules.defineRule('casterLevels.' + spellType, sourceLevel, '=', null);
          rules.defineRule('spellModifier.' + spellType,
            'casterLevels.' + spellType, '?', null,
            spellAbility + 'Modifier', '=', null
          );
        }
        rules.defineRule('spellAttackModifier.' + spellType,
          'features.' + name, '=', '0',
          'spellModifier.' + spellType, '+', null,
          'proficiencyBonus', '+', null
        );
        rules.defineRule('spellDifficultyClass.' + spellType,
          'spellAttackModifier.' + spellType, '=', '8 + source'
        );
      }
    }
    SRD5E.featureSpells(rules, name, spellType, levelAttr, spells);
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

  let allSpells = rules.getChoices('spells');

  for(let i = 0; i < spellList.length; i++) {
    let spellNames = spellList[i];
    let minLevel = null;
    if(spellNames.match(/^\d+:/)) {
      minLevel = spellNames.split(':')[0] - 0;
      spellNames = spellNames.split(':')[1];
    }
    spellNames = spellNames.split(',');
    for(let j = 0; j < spellNames.length; j++) {
      let spellName = spellNames[j];
      if(window.PHB5E && spellName in PHB5E.SPELLS_RENAMED)
        spellName = PHB5E.SPELLS_RENAMED[spellName];
      let spell = QuilvynUtils.getKeys(allSpells, '^' + spellName + '\\(')[0];
      if(!spell) {
        console.log('Unknown spell "' + spellName + '" for feature ' + feature);
        continue;
      }
      let spellAttrs = allSpells[spell];
      let spellDescription =
        QuilvynUtils.getAttrValue(spellAttrs, 'Description');
      let spellLevel =
        QuilvynUtils.getAttrValue(spellAttrs, 'Level').match(/\d/)[0] - 0;
      let spellRaise = QuilvynUtils.getAttrValue(spellAttrs, 'AtHigherLevels');
      let spellRitual = QuilvynUtils.getAttrValue(spellAttrs, 'Ritual');
      spellRitual = spellRitual && !(spellRitual+'').match(/(^n|false)$/i);
      let spellSchool = QuilvynUtils.getAttrValue(spellAttrs, 'School');
      let fullName = spellName + '(' + spellType + spellLevel + ' [' + feature + '] ' + spellSchool.substring(0, 4) + ')';
      SRD5E.spellRules(
        rules, fullName, spellSchool, spellType, spellLevel, spellRitual,
        spellDescription, spellRaise
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
  rules.defineRule
    ('languages.' + name, 'languagesChosen.' + name, '=', 'source ? 1 : null');
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

  let pathLevel =
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

    for(let i = 0; i < spellSlots.length; i++) {
      let matchInfo = spellSlots[i].match(/^(\D+)\d:/);
      if(!matchInfo) {
        console.log('Bad format for spell slot "' + spellSlots[i] + '"');
        continue;
      }
      let spellType = matchInfo[1];
      if(spellType != name)
        rules.defineRule
          ('casterLevels.' + spellType, 'casterLevels.' + name, '^=', null);
      rules.defineRule('spellModifier.' + spellType,
        'casterLevels.' + spellType, '?', null,
        spellAbility + 'Modifier', '=', null
      );
      rules.defineRule('spellAttackModifier.' + spellType,
        spellAbility + 'Modifier', '=', null,
        'proficiencyBonus', '+', null
      );
      rules.defineRule('spellDifficultyClass.' + spellType,
        'spellAttackModifier.' + spellType, '=', '8 + source'
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
 * Defines in #rules# the rules associated with race #name#, which has the list
 * of hard prerequisites #requires#. #features# and #selectables# list
 * associated features, #size# gives the racial size and #speed# gives the
 * racial speed.
 */
SRD5E.raceRules = function(
  rules, name, requires, features, selectables, size, speed)
{

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
  if(size == null) {
    // Backwards compatability
    size = features.filter(x => x.match(/^(\d+:)?Small$/)).length > 0 ? 'Small' : 'Medium';
  }
  if(!(size+'').match(/^(Large|Medium|Small)$/)) {
    console.log('Bad size "' + size + '" for race ' + name);
    return;
  }
  if(speed == null) {
    // Backwards compatability
    speed = features.filter(x => x.match(/^(\d+:)?Slow$/)).length > 0 ? 25 : 30;
  }
  if(typeof(speed) != 'number') {
    console.log('Bad speed "' + speed + '" for race ' + name);
    return;
  }

  let prefix =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');
  let raceLevel = prefix + 'Level';

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

  rules.defineRule('size', raceLevel, '=', '"' + size + '"');
  rules.defineRule('speed', raceLevel, '=', speed);

};

/*
 * Defines in #rules# the rules associated with race #name# that cannot be
 * derived directly from the attributes passed to raceRules.
 */
SRD5E.raceRulesExtra = function(rules, name) {

  if(name == 'Dragonborn') {
    rules.defineRule('breathWeaponEnergy',
      'features.Breath Weapon', '=', '"fire"',
      'features.Black Dragon Ancestry', '=', '"acid"',
      'features.Blue Dragon Ancestry', '=', '"lightning"',
      'features.Bronze Dragon Ancestry', '=', '"lightning"',
      'features.Copper Dragon Ancestry', '=', '"acid"',
      'features.Green Dragon Ancestry', '=', '"poison"',
      'features.Silver Dragon Ancestry', '=', '"cold"',
      'features.White Dragon Ancestry', '=', '"cold"'
    );
    rules.defineRule('breathWeaponShape',
      'features.Breath Weapon', '=', '"5\'x30\' line"',
      'features.Gold Dragon Ancestry', '=', '"15\' cone"',
      'features.Green Dragon Ancestry', '=', '"15\' cone"',
      'features.Red Dragon Ancestry', '=', '"15\' cone"',
      'features.Silver Dragon Ancestry', '=', '"15\' cone"',
      'features.White Dragon Ancestry', '=', '"15\' cone"'
    );
    rules.defineRule('selectableFeatureCount.Dragonborn (Draconic Ancestry)',
      'featureNotes.draconicAncestry', '=', '1'
    );
  } else if(name.match(/Dwarf/)) {
    rules.defineRule
      ('abilityNotes.armorSpeedAdjustment', 'abilityNotes.steady', '^', '0');
  } else if(name == 'High Elf') {
    rules.defineRule
      ('casterLevels.W', 'magicNotes.cantrip(HighElf)', '^=', '1');
    rules.defineRule('spellSlots.W0', 'magicNotes.cantrip(HighElf)', '+=', '1');
  }

};

/*
 * Defines in #rules# the rules required to give feature #name# to race
 * #raceName# at level #level#. #selectable# gives the category if this feature
 * is selectable; it is otherwise null. #require# lists any hard prerequisites
 * for the feature, and #replace# lists any race features that this new one
 * replaces.
 */
SRD5E.raceFeatureRules = function(
  rules, name, require, raceName, level, selectable, replace
) {

  if(!name) {
    console.log('Empty race feature name');
    return;
  }
  if(!Array.isArray(require)) {
    console.log('Bad require list "' + require + '" for race feature ' + name);
    return;
  }
  if(!(raceName in rules.getChoices('races'))) {
    console.log('Bad race "' + raceName + '" for race feature ' + name);
    return;
  }
  if(typeof level != 'number') {
    console.log('Bad level "' + level + '" for race feature ' + name);
    return;
  }
  if(selectable && typeof selectable != 'string') {
    console.log('Bad selectable "' + selectable + '" for race feature ' + name);
    return;
  }
  if(!Array.isArray(replace)) {
    console.log('Bad replace list "' + replace + '" for race feature ' + name);
    return;
  }

  let prefix =
    raceName.charAt(0).toLowerCase() + raceName.substring(1).replaceAll(' ','');
  let raceLevel = prefix + 'Level';
  let featureSpec = level + ':' + name;
  if(selectable)
    featureSpec += ':' + selectable;
  if(require.length > 0)
    featureSpec = require.join('/') + ' ? ' + featureSpec;
  QuilvynRules.featureListRules
    (rules, [featureSpec], raceName, raceLevel, selectable ? true : false);
  if(selectable) {
    let countVar =
      'selectableFeatureCount.' + raceName + ' (' + selectable + ')';
    if(!rules.getSources(countVar))
      rules.defineRule(countVar,
        raceLevel, '=', level>1 ? 'source>=' + level + ' ? 1 : null' : '1'
      );
  }
  replace.forEach(f => {
    let hasVar = 'has' + f.replaceAll(' ', '');
    rules.defineRule(prefix + 'Features.' + f, hasVar, '?', 'source==1');
    rules.defineRule(hasVar,
      raceLevel, '=', '1',
      prefix + 'Features.' + name, '=', '0'
    );
  });

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

  rules.defineRule('shieldACBonus',
    'shield', '=', QuilvynUtils.dictLit(rules.shieldStats.ac) + '[source]'
  );
  rules.defineRule('armorClass', 'shieldACBonus', '+', null);

};

/*
 * Defines in #rules# the rules associated with skill #name#, associated with
 * #ability# (one of 'strength', 'intelligence', etc.). #classes# lists any
 * classes that are proficient in this skill.
 */
SRD5E.skillRules = function(rules, name, ability, classes) {

  if(!name) {
    console.log('Empty skill name');
    return;
  }
  ability = (ability + '').toLowerCase();
  if(typeof ability != 'string' || !(ability.charAt(0).toUpperCase() + ability.substring(1) in SRD5E.ABILITIES)) {
    console.log('Bad ability "' + ability + '" for skill ' + name);
    return;
  }
  if(!Array.isArray(classes)) {
    console.log('Bad classes list "' + classes + '" for skill ' + name);
    return;
  }

  for(let i = 0; i < classes.length; i++) {
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
 * saving throw value required by the spell. #ritual# indicates whether or not
 * the spell can be cast using a ritual. #description# is a verbose description
 * of the spell's effects. #higher#, if supplied, describes the effects of
 * casting the spell using a higher-level spell slot.
 */
SRD5E.spellRules = function(
  rules, name, school, casterGroup, level, ritual, description, higher
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
    description.replaceAll('lvl', 'casterLevels.' + casterGroup)
               .replaceAll('mdf', 'spellModifier.' + casterGroup);
  if(higher)
    description += ' [+Level ' + higher + ']';
  if(ritual)
    description += ' [R]';
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
  if(typeof category != 'string' ||
     !category.match(/^unarmed|((simple|martial) (melee|ranged))$/i)) {
    console.log('Bad category "' + category + '" for weapon ' + name);
    return;
  }
  if(!Array.isArray(properties)) {
    console.log('Bad properties list "' + properties + '" for weapon ' + name);
    return;
  }
  let matchInfo = (damage + '').match(/^(((\d*d)?\d+)([\-+]\d+)?)$/);
  if(!matchInfo && damage != 'None') {
    console.log('Bad damage "' + damage + '" for weapon ' + name);
    return;
  }
  if(range && !(range + '').match(/^\d+\/\d+$/)) {
    console.log('Bad range "' + range + '" for weapon ' + name);
  }

  let is2h = properties.includes('Two-Handed');
  let isFinesse = properties.includes('Finesse');
  let isRanged = category.match(/ranged/i);
  let isSimple = category.match(/simple/i);
  let isMonk = category == 'Unarmed' || name == 'Shortsword' || 
               (isSimple && !is2h && !properties.includes('Heavy'));

  damage = matchInfo ? matchInfo[1] : damage;
  let weaponName = 'weapons.' + name;
  let format = '%V (%1 %2%3' + (range ? " R%4" : '') + ')';

  if(damage.startsWith('d'))
    damage = '1' + damage;

  rules.defineChoice('notes',
    weaponName + ':' + format,
    'sanityNotes.nonproficientWeaponPenalty.' + name + ':%V attack'
  );

  if(category != 'Unarmed') {
    rules.defineRule('sanityNotes.nonproficientWeaponPenalty.' + name,
      weaponName, '?', null,
      'proficiencyBonus', '=', '-source',
      'weaponProficiency.Martial Weapons', '^', '0',
      'weaponProficiency.' + name, '^', '0'
    );
    if(isSimple) {
      rules.defineRule('sanityNotes.nonproficientWeaponPenalty.' + name,
        'weaponProficiency.Simple Weapons', '^', '0'
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
    isFinesse ? 'betterAttackAdjustment' :
     isRanged ? 'combatNotes.dexterityAttackAdjustment' :
                'combatNotes.strengthAttackAdjustment', '+', null,
    isRanged ? 'attackBonus.Ranged' : 'attackBonus.Melee', '+', null,
    'weaponProficiencyBonus.' + name, '+', null,
    'weaponAttackAdjustment.' + name, '+', null
  );
  rules.defineRule('damageBonus.' + name,
    weaponName, '=', '0',
    isFinesse ? 'betterDamageAdjustment' :
     isRanged ? 'combatNotes.dexterityDamageAdjustment' :
                'combatNotes.strengthDamageAdjustment', '+', null,
    'weaponDamageAdjustment.' + name, '+', null
  );
  if(isMonk) {
    rules.defineRule('attackBonus.' + name, 'monkMeleeAttackBonus', '+', null);
    rules.defineRule('damageBonus.' + name, 'monkMeleeDamageBonus', '+', null);
  }

  rules.defineRule(weaponName + '.1',
    'attackBonus.' + name, '=', 'source >= 0 ? "+" + source : source'
  );
  rules.defineRule(weaponName + '.2',
    weaponName, '?', null,
    '', '=', '"' + damage + '"'
  );
  if(properties.includes('Versatile'))
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
  for(let i = 0; i < features.length; i++) {
    let feature = features[i].replace(/^(.*\?\s*)?\d+:/, '');
    let matchInfo = feature.match(/([A-Z]\w*)\sProficiency\s\((([^\(]|\([^\)]*\))*)\)$/);
    if(!matchInfo)
      matchInfo = feature.match(/(Language)\s\((([^\(]|\([^\)]*\))*)\)$/);
    if(!matchInfo)
      continue;
    let group = matchInfo[1].toLowerCase();
    let elements = matchInfo[2].split(/\/|;\s*/);
    for(let j = 0; j < elements.length; j++) {
      matchInfo = elements[j].match(/^Choose\s+(\d+)\s+from/i);
      if(matchInfo) {
        rules.defineRule
          (group + 'ChoiceCount', setName + '.' + feature, '+=', matchInfo[1]);
      } else if(group == 'language') {
        rules.defineRule
          ('languages.' + elements[j], setName + '.' + feature, '=', '1');
      } else {
        rules.defineRule(group + 'Proficiency.' + elements[j],
          setName + '.' + feature, '=', '1'
        );
      }
    }
  }
};

/*
 * Returns an object that contains all the choices for #name# previously
 * defined for this rule set via addChoice.
 */
SRD5E.getChoices = function(name) {
  return this.choices[name == 'classs' ? 'levels' : name];
};

/*
 * Returns the dictionary of attribute formats associated with character sheet
 * format #viewer# in #rules#.
 */
SRD5E.getFormats = function(rules, viewer) {
  let format;
  let formats = rules.getChoices('notes');
  let result = {};
  let matchInfo;
  if(viewer == 'Collected Notes') {
    for(format in formats) {
      result[format] = formats[format];
      if((matchInfo = format.match(/Notes\.(.*)$/)) != null) {
        let feature = matchInfo[1];
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
  for(let i = 0; i < viewers.length; i++) {
    let name = viewers[i];
    let viewer = new ObjectViewer();
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
      let innerSep = null;
      let listSep = '; ';
      let noteSep = listSep;
      noteSep = '\n';
      let outerSep = name == '\n';
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
            {name: 'Ability Boosts', within: 'AbilityStats', separator:listSep},
            {name: 'ExperienceInfo', within: 'AbilityStats', separator: ''},
              {name: 'Experience', within: 'ExperienceInfo'},
              {name: 'Experience Needed', within: 'ExperienceInfo',
               format: '/%V'},
            {name: 'Level', within: 'AbilityStats'},
            {name: 'Size', within: 'AbilityStats'},
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
              {name: 'Spell Points', within: 'SpellStats'},
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
  let abilities = QuilvynUtils.getKeys(SRD5E.ABILITIES).sort();
  let oneToTwenty = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
  ];
  let result = [];
  let zeroToTen = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  if(type == 'Armor') {
    let zeroToEighteen = [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18
    ];
    result.push(
      ['Weight', 'Weight', 'select-one', ['None', 'Light', 'Medium', 'Heavy']],
      ['AC', 'AC Bonus', 'select-one', zeroToTen],
      ['Dex', 'Max Dex', 'select-one', zeroToTen],
      ['Str', 'Min Str', 'select-one', zeroToEighteen],
      ['Bulky', 'Stealth Disadv', 'checkbox', ['']]
    );
  } else if(type == 'Background')
    result.push(
      ['Equipment', 'Equipment', 'text', [40]],
      ['Features', 'Features', 'text', [40]]
    );
  else if(type == 'Background Feature')
    result.push(
      ['Background', 'Background', 'select-one', QuilvynUtils.getKeys(rules.getChoices('backgrounds'))],
      ['Level', 'Level', 'select-one', oneToTwenty],
      ['Replace', 'Replace', 'text', [40]]
    );
  else if(type == 'Class')
    result.push(
      ['Require', 'Prerequisite', 'text', [40]],
      ['HitDie', 'Hit Die', 'select-one', ['d4', 'd6', 'd8', 'd10', 'd12']],
      ['Features', 'Features', 'text', [40]],
      ['Selectables', 'Selectable Features', 'text', [40]],
      ['SpellAbility', 'Spell Ability', 'select-one', abilities],
      ['SpellSlots', 'Spells Slots', 'text', [40]],
      ['MulticlassPrerequisite', 'Multiclass Prerequisite', 'text', [40]]
    );
  else if(type == 'Class Feature')
    result.push(
      ['Class', 'Class', 'select-one', QuilvynUtils.getKeys(rules.getChoices('levels'))],
      ['Level', 'Level', 'select-one', oneToTwenty],
      ['Selectable', 'Selectable Type', 'text', [20]],
      ['Require', 'Prerequisite', 'text', [40]],
      ['Replace', 'Replace', 'text', [40]]
    );
  else if(type == 'Deity')
    result.push(
      ['Alignment', 'Alignment', 'select-one', QuilvynUtils.getKeys(rules.getChoices('alignments'))],
      ['Domain', 'Domains', 'text', [30]]
    );
  else if(type == 'Feat')
    result.push(
      ['Require', 'Prerequisite', 'text', [40]],
      ['Imply', 'Implies', 'text', [40]]
    );
  else if(type == 'Feature') {
    result.push(
      ['Section', 'Section', 'text', [40]],
      ['Note', 'Note', 'text', [60]],
      ['Spells', 'Spells', 'text', [60]],
      ['SpellAbility', 'Spell Ability', 'select-one', abilities]
    );
  } else if(type == 'Language')
    result.push(
      // empty
    );
  else if(type == 'Race')
    result.push(
      ['Require', 'Prerequisite', 'text', [40]],
      ['Features', 'Features', 'text', [60]],
      ['Selectables', 'Selectables', 'text', [60]],
      ['Size', 'Size', 'select-one', ['Small', 'Medium', 'Large']],
      ['Speed', 'Speed', 'text', [3]]
    );
  else if(type == 'Race Feature')
    result.push(
      ['Race', 'Race', 'select-one', QuilvynUtils.getKeys(rules.getChoices('races'))],
      ['Level', 'Level', 'select-one', oneToTwenty],
      ['Selectable', 'Selectable Type', 'text', [20]],
      ['Require', 'Prerequisite', 'text', [40]],
      ['Replace', 'Replace', 'text', [40]]
    );
  else if(type == 'School')
    result.push(
      // empty
    );
  else if(type == 'Skill')
    result.push(
      ['Ability', 'Ability', 'select-one', abilities],
      ['Class', 'Proficient Classes', 'text', [30]]
    );
  else if(type == 'Spell') {
    result.push(
      ['School', 'School', 'select-one', QuilvynUtils.getKeys(rules.getChoices('schools'))],
      ['Level', 'Caster Group and Level', 'text', [15]],
      ['Description', 'Description', 'text', [60]],
      ['AtHigherLevels', 'At Higher Levels', 'text', [60]]
    );
  } else if(type == 'Tool') {
    let toolTypes = ['Artisan', 'Gaming', 'Musical', 'General'];
    result.push(
      ['Type', 'Type', 'select-one', toolTypes]
    );
  } else if(type == 'Weapon') {
    result.push(
      ['Category', 'Category', 'select-one', ['Unarmed', 'Simple Melee', 'Simple Ranged', 'Martial Melee', 'Martial Ranged']],
      ['Property', 'Property', 'text', [40]],
      ['Damage', 'Damage', 'select-one', QuilvynUtils.getKeys(SRD5E.VERSATILE_WEAPON_DAMAGE)],
      ['Range', 'Range', 'text', [10]]
    );
  }
  return result;
};

/* Returns the elements in a basic 5E character editor. */
SRD5E.initialEditorElements = function() {
  let abilityChoices = [
    3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18
  ];
  let editorElements = [
    ['name', 'Name', 'text', [20]],
    ['imageUrl', 'Image URL', 'text', [20]],
    ['strength', 'Strength', 'select-one', abilityChoices],
    ['dexterity', 'Dexterity', 'select-one', abilityChoices],
    ['constitution', 'Constitution', 'select-one', abilityChoices],
    ['intelligence', 'Intelligence', 'select-one', abilityChoices],
    ['wisdom', 'Wisdom', 'select-one', abilityChoices],
    ['charisma', 'Charisma', 'select-one', abilityChoices],
    ['abilityBoosts', 'Ability Boosts', 'setbag', QuilvynUtils.getKeys(SRD5E.ABILITIES)],
    ['gender', 'Gender', 'text', [10]],
    ['race', 'Race', 'select-one', 'races'],
    ['levels', 'Class Levels', 'bag', 'levels'],
    ['background', 'Background', 'select-one', 'backgrounds'],
    ['alignment', 'Alignment', 'select-one', 'alignments'],
    ['deity', 'Deity', 'select-one', 'deitys'],
    ['origin', 'Origin', 'text', [20]],
    ['player', 'Player', 'text', [20]],
    ['experience', 'Experience', 'text', [8, '(\\+?\\d+)']],
    ['feats', 'Feats', 'setbag', 'feats'],
    ['selectableFeatures', 'Selectable Features', 'set', 'selectableFeatures'],
    ['skillsChosen', 'Skills', 'set', 'skills'],
    ['toolsChosen', 'Tools', 'set', 'tools'],
    ['languagesChosen', 'Languages', 'set', 'languages'],
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

  let clusters = {
    B:'lr', C:'hlr', D:'r', F:'lr', G:'lnr', K:'lnr', P:'lr', S:'chklt', T:'hr',
    W:'h',
    c:'hkt', l:'cfkmnptv', m: 'p', n:'cgkt', r: 'fv', s: 'kpt', t: 'h'
  };
  let consonants = {
    'Dragonborn':'bcdfghjklmnprstvwz', 'Dwarf':'dgkmnprst', 'Elf':'fhlmnpqswy',
    'Gnome':'bdghjlmnprstw', 'Halfling':'bdfghlmnprst',
    'Human': 'bcdfghjklmnprstvwz', 'Orc': 'dgjkprtvxz',
    'Tiefling': 'bcdfghjklmnprstvwz'
  }[race];
  let endConsonant = '';
  let leading = 'ghjqvwy';
  let vowels = {
    'Dragonborn':'aeiou', 'Dwarf':'aeiou', 'Elf':'aeioy', 'Gnome':'aeiou',
    'Halfling':'aeiou', 'Human':'aeiou', 'Orc':'aou', 'Tiefling':'aeiou'
  }[race];
  let diphthongs = {a:'wy', e:'aei', o: 'aiouy', u: 'ae'};
  let syllables = QuilvynUtils.random(0, 99);
  syllables = syllables < 50 ? 2 :
              syllables < 75 ? 3 :
              syllables < 90 ? 4 :
              syllables < 95 ? 5 :
              syllables < 99 ? 6 : 7;
  let result = '';
  let vowel;

  for(let i = 0; i < syllables; i++) {
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
    let remaining = [].concat(choices);
    for(let i = 0; i < howMany && remaining.length > 0; i++) {
      let which = QuilvynUtils.random(0, remaining.length - 1);
      attributes[prefix + remaining[which]] = value;
      remaining = remaining.slice(0, which).concat(remaining.slice(which + 1));
    }
  }

  let attr;
  let attrs;
  let choices;
  let count;
  let howMany;
  let i,j,k;
  let matchInfo;
  let notes;
  let pat;
  let pieces;
  let type;
  let which;

  if(attribute == 'armor') {
    let armors = this.getChoices('armors');
    attrs = this.applyRules(attributes);
    choices = [];
    for(attr in armors) {
      let weight = QuilvynUtils.getAttrValue(armors[attr], 'Weight');
      if(weight == 0 ||
         attrs['armorProficiency.Heavy'] ||
         weight <= 2 && attrs['armorProficiency.Medium'] ||
         weight == 1 && attrs['armorProficiency.Light'] ||
         attrs['armorProficiency.' + attr])
        choices.push(attr);
    }
    attributes.armor = choices[QuilvynUtils.random(0, choices.length - 1)];
  } else if(attribute == 'abilityBoosts') {
    attrs = this.applyRules(attributes);
    notes = this.getChoices('notes');
    howMany = attrs.abilityBoostChoiceCount || 0;
    let potentialBoosts = {};
    for(attr in SRD5E.ABILITIES)
      potentialBoosts[attr] = 0;
    potentialBoosts.Any = 0;
    for(attr in attrs) {
      if(!notes[attr] ||
         (matchInfo = notes[attr].match(/Ability\s+Boost\s+\((.*)\)/gi))==null)
        continue;
      matchInfo.forEach(matched => {
        matched.split(/\/|;\s*/).forEach(boosted => {
          let choices = boosted.match(/Choose\s+(%V|\d+)\s+from\s+([^\)]*)/i);
          if(choices) {
            choices[2].split(/\s*,\s*/).forEach(choice => {
              let amount =
                !choices[1].startsWith('%') ? choices[1] - 0 : attrs[attr];
              potentialBoosts[choice.charAt(0).toUpperCase() + choice.substring(1).toLowerCase()] += amount;
            });
          }
        });
      });
    }
    for(attr in SRD5E.ABILITIES)
      potentialBoosts[attr] += potentialBoosts.Any;
    delete potentialBoosts.Any;
    for(attr in SRD5E.ABILITIES) {
      if(('abilityBoosts.' + attr) in attributes) {
        potentialBoosts[attr] -= attributes['abilityBoosts.' + attr];
        howMany -= attributes['abilityBoosts.' + attr];
      }
    }
    while(howMany > 0 && QuilvynUtils.sumMatching(potentialBoosts, /./) > 0) {
      attr = QuilvynUtils.randomKey(potentialBoosts);
      if(potentialBoosts[attr] <= 0)
        continue;
      if(!attributes['abilityBoosts.' + attr])
        attributes['abilityBoosts.' + attr] = 0;
      attributes['abilityBoosts.' + attr]++;
      potentialBoosts[attr]--;
      howMany--;
    }
  } else if(attribute == 'deity') {
    /* Pick a deity that's no more than one alignment position removed. */
    let aliInfo = attributes.alignment.match(/^([CLN]).*\s([GEN])/);
    let aliPat;
    if(aliInfo == null) /* Neutral character */
      aliPat = 'N[EG]?|[CL]N';
    else if(aliInfo[1] == 'N') /* NG or NE */
      aliPat = 'N|[CLN]' + aliInfo[2];
    else if(aliInfo[2] == 'N') /* CN or LN */
      aliPat = 'N|' + aliInfo[1] + '[GNE]';
    else /* [LC]G or [LC]E */
      aliPat = aliInfo[1] + '[N' + aliInfo[2] + ']|N' + aliInfo[2];
    choices = [];
    let deities = this.getChoices('deitys');
    for(attr in deities) {
      if(deities[attr].match('=' + aliPat + '\\b'))
        choices.push(attr);
    }
    if(choices.length > 0)
      attributes.deity = choices[QuilvynUtils.random(0, choices.length - 1)];
  } else if(attribute == 'feats' || attribute == 'selectableFeatures') {
    let debug = [];
    attribute = attribute == 'feats' ? 'feat' : 'selectableFeature';
    let countPrefix = attribute + 'Count.';
    let prefix = attribute + 's';
    let suffix = attribute.charAt(0).toUpperCase() + attribute.substring(1);
    let toAllocateByType = {};
    attrs = this.applyRules(attributes);
    for(attr in attrs) {
      if(attr.startsWith(countPrefix)) {
        toAllocateByType[attr.replace(countPrefix, '')] = attrs[attr];
      }
    }
    let availableChoices = {};
    let allChoices = this.getChoices(prefix);
    for(attr in allChoices) {
      let types = QuilvynUtils.getAttrValueArray(allChoices[attr], 'Type');
      if(types.indexOf('General') < 0)
        types.push('General');
      if(attrs[prefix + '.' + attr] != null) {
        for(i = 0; i < types.length; i++) {
          let t = types[i];
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
      let availableChoicesInType = {};
      for(let a in availableChoices) {
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
        let pick;
        let picks = {};
        pickAttrs(picks, '', choices, howMany, 1);
        debug.push('From ' + QuilvynUtils.getKeys(picks).join(", ") + ' reject');
        for(pick in picks) {
          attributes[prefix + '.' + pick] = 1;
          delete availableChoicesInType[pick];
        }
        let validate = this.applyRules(attributes);
        for(pick in picks) {
          let name = pick.charAt(0).toLowerCase() +
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
    attributes.gender = QuilvynUtils.random(0, 99) < 50 ? 'Female' : 'Male';
  } else if(attribute == 'hitPoints') {
    attributes.hitPoints = 0;
    for(let clas in this.getChoices('levels')) {
      if((attr = attributes['levels.' + clas]) == null)
        continue;
      matchInfo = this.getChoices('levels')[clas].match(/^((\d+)?d)?(\d+)$/);
      let number = matchInfo == null || matchInfo[2] == null ||
                   matchInfo[2] == '' ? 1 : matchInfo[2];
      let sides = matchInfo == null || matchInfo[3] == null ||
                  matchInfo[3] == '' ? 6 : matchInfo[3];
      attributes.hitPoints += number * sides;
      while(--attr > 0)
        attributes.hitPoints += QuilvynUtils.random(number, number * sides);
    }
  } else if(attribute == 'levels') {
    let assignedLevels = QuilvynUtils.sumMatching(attributes, /^levels\./);
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
    let max = SRD5E.LEVELS_EXPERIENCE[attributes.level] * 1000 - 1;
    let min = SRD5E.LEVELS_EXPERIENCE[attributes.level - 1] * 1000;
    if(!attributes.experience || attributes.experience < min)
      attributes.experience = QuilvynUtils.random(min, max);
    choices = QuilvynUtils.getKeys(this.getChoices('levels'));
    if(assignedLevels == 0) {
      let classesToChoose =
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
    attributes.name = SRD5E.randomName(attributes.race);
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
    attributes.shield = choices[QuilvynUtils.random(0, choices.length - 1)];
  } else if(attribute == 'languages' ||
            attribute == 'skills' ||
            attribute == 'tools') {
    notes = this.getChoices('notes');
    attrs = this.applyRules(attributes);
    howMany = attrs[attribute.replace(/s$/) + 'ChoiceCount'];
    count = 0;
    let group = this.getChoices(attribute);
    pat = new RegExp(attribute + '?(?: Proficiency)? \\((.*)\\)$', 'i');
    for(attr in attrs) {
      // Choice features can be duplicated in attrs; for example, the feature
      // note "Tool Proficiency (Disguise Kit/Choose 1 from any Musical)" shows as
      //
      // <path>Features.Tool Proficiency (Disguise Kit/Choose 1 from any Musical)
      // features.Tool Proficiency (Disguise Kit/Choose 1 from any Musical)
      // features.Tool Proficiency (Disguise Kit)
      // features.Tool Proficiency (Choose 1 from any Musical)
      //
      // By ignoring the ones that begin with 'features.', we ensure that we
      // don't choose too many proficiencies.
      matchInfo = attr.startsWith('features.') ? null : attr.match(pat);
      if(matchInfo == null && notes[attr] != null)
        matchInfo = notes[attr].match(pat);
      if(matchInfo == null || !matchInfo[1].match(/\bChoose\b/i))
        continue;
      pieces = matchInfo[1].split(/\/|;\s*/);
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
              for(let item in group) {
                if(group[item].includes(type))
                  choices.push(item);
              }
              choices.splice(j, 1);
            }
          }
        }
        // TODO: Problem here with multiple attributes that allow overlapping
        // choices, e.g., two attributes that allow "Choose 1 from any". Once
        // a choice is made for one attribute, that choice will decrement
        // count below for the other attribute, causing the code to fail to
        // make a choice. For now, this seems better than eliminating this loop
        // and predictably over-choosing.
        for(k = choices.length - 1; k >= 0; k--) {
          if(attributes[attribute + 'Chosen.' + choices[k]]) {
            count--;
            choices.splice(k, 1);
          } else if(attrs[attribute + '.' + choices[k]]) {
            choices.splice(k, 1);
          }
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
    let availableSpellsByGroupAndLevel = {};
    let groupAndLevel;
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
        let slots = attrs['spellSlots.' + groupAndLevel];
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
    let weapons = this.getChoices('weapons');
    attrs = this.applyRules(attributes);
    pat = /Weapon Proficiency \((([^\(]|\([^\)]*\))*)\)$/i;
    for(attr in attrs) {
      // See note for skills and tools, above
      matchInfo = attr.startsWith('features.') ? null : attr.match(pat);
      if(matchInfo == null && notes[attr] != null)
        matchInfo = notes[attr].match(pat);
      if(matchInfo == null || !matchInfo[1].match(/\bChoose\b/i))
        continue;
      pieces = matchInfo[1].split(/\/|;\s*/);
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
              type = type.match(/simple/i) ? /simple/i :
                     type.match(/martial/i) ? /martial/i :
                     type.match(/light/i) ? /light/i :
                     type.match(/two-handed/i) ? /two-handed/i :
                     type.match(/versatile/i) ? /versatile/i :
                     type.match(/heavy/i) ? /heavy/i : /./;
              for(let weapon in weapons) {
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
      let category = QuilvynUtils.getAttrValue(weapons[attr], 'Category');
      if(attrs['weaponProficiency.Martial Weapons'] ||
         category.match(/simple/i) && attrs['weaponProficiency.Simple Weapons'] ||
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
      let rolls = [];
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

  let attributesChanged = {};
  let debug = [];
  let index;
  let notes = this.getChoices('notes');
  let possibilities;

  // If 8 passes don't get rid of all repairable problems, give up
  for(let pass = 0; pass < 8; pass++) {

    let applied = this.applyRules(attributes);
    let fixedThisPass = 0;

    // Try to fix each sanity/validation note w/a non-zero value
    for(let attr in applied) {

      let matchInfo =
        attr.match(/^(sanity|validation)Notes\.(.*)([A-Z][a-z]+)/);
      let attrValue = applied[attr];

      if(matchInfo == null || !attrValue || notes[attr] == null) {
        continue;
      }

      let problemSource = matchInfo[2];
      let problemCategory = matchInfo[3].substring(0, 1).toLowerCase() +
                            matchInfo[3].substring(1).replaceAll(' ', '');
      let requirements =
        notes[attr].replace(/^(Implies|Requires)\s/, '').split(/\s*\/\s*/);

      for(let i = 0; i < requirements.length; i++) {

        // Find a random requirement choice w/the format "name [op value]"
        let choices = requirements[i].split(/\s*\|\|\s*/);
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

        let toFixCombiner = null;
        let toFixName = matchInfo[1].replace(/\s+$/, '');
        let toFixOp = matchInfo[3] == null ? '>=' : matchInfo[3];
        let toFixValue =
          matchInfo[4] == null ? 1 : matchInfo[4].replace(/^\s+/, '');
        if(toFixName.match(/^(Max|Sum)/)) {
          toFixCombiner = toFixName.substring(0, 3);
          toFixName = toFixName.substring(4).replace(/^\s+/, '');
        }
        let toFixAttr = toFixName.substring(0, 1).toLowerCase() +
                        toFixName.substring(1).replaceAll(' ', '');

        // See if this attr has a set of choices (e.g., race) or a category
        // attribute (e.g., a feat)
        choices = this.getChoices(toFixAttr + 's');
        if(choices == null) {
           choices = this.getChoices(problemCategory);
        }
        if(choices != null) {
          // Find the set of choices that satisfy the requirement
          let target =
            this.getChoices(problemCategory) == null ? toFixValue : toFixName;
          possibilities = [];
          for(let choice in choices) {
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
          for(let k in attributes) {
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
            let current = attributes[toFixAttr];
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
          let abilities = {
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
    '  To allow feats to be taken instead of Ability Score Improvements,' +
    '  the latter is presented as a new feat, named Ability Boost, that' +
    '  can be taken multiple times.\n' +
    '  </li><li>\n' +
    '  Quilvyn presents sub-race choices (e.g., Lightfoot Halfling)' +
    '  as separate races in the editor Race menu.\n' +
    '  </li><li>\n' +
    '  You can use homebrew spell definitions to support class features that' +
    "  allow characters to learn spells from other classes' spell lists. For" +
    '  example, if a Bard with the Magical Secrets feature learns' +
    '  <i>Bless</i>, you can define a homebrew B1 <i>Bless</i> spell.\n' +
    '  </li><li>\n' +
    '  Discussion of adding different types of homebrew options to the' +
    '  SRD5E rule set can be found in <a href="plugins/homebrew-srd5e.html">SRD5E Homebrew Examples</a>.\n' +
    '  </li>\n' +
    '</ul>\n' +
    '\n' +
    '<h3>Limitations</h3>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '  Quilvyn does not report background traits, ideals, bonds, flaws, or' +
    '  equipment. These items can be entered in the Notes section.\n' +
    '  </li>\n' +
    '</ul>\n' +
    '\n' +
    '<h3>Known Bugs</h3>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '  Quilvyn gives multiclass characters the complete set of proficiencies' +
    '  for each class.\n' +
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
