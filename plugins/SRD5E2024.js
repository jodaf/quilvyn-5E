/*
Copyright 2026, James J. Hayes

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
/* globals Quilvyn, QuilvynRules, QuilvynUtils, SRD5E */
"use strict";

/*
 * This module loads the rules from the System Reference Document v5.2.1.
 * The SRD5E function contains methods that load rules for particular parts of
 * the SRD: speciesRules for character species, magicRules for spells, etc.
 * These member methods can be called independently in order to use a subset of
 * the SRD v5.2.1 rules. Similarly, the constant fields of SRD5E2024
 * (BACKGROUNDS, FEATS, etc.) can be manipulated to modify the choices.
 */
function SRD5E2024() {

  if(window.SRD5E == null) {
    alert('The SRD5E2024 module requires use of the SRD5E module');
    return;
  }

  let rules = new QuilvynRules('SRD 5.5E', SRD5E2024.VERSION);
  SRD5E2024.rules = rules;
  rules.plugin = SRD5E2024;

  rules.defineChoice('choices', SRD5E2024.CHOICES);
  rules.choiceEditorElements = SRD5E2024.choiceEditorElements;
  rules.choiceRules = SRD5E2024.choiceRules;
  rules.removeChoice = SRD5E2024.removeChoice;
  rules.editorElements = SRD5E2024.initialEditorElements();
  rules.getFormats = SRD5E2024.getFormats;
  rules.getPlugins = SRD5E2024.getPlugins;
  rules.makeValid = SRD5E2024.makeValid;
  rules.randomizeOneAttribute = SRD5E2024.randomizeOneAttribute;
  rules.defineChoice('random', SRD5E2024.RANDOMIZABLE_ATTRIBUTES);
  rules.getChoices = SRD5E2024.getChoices;
  rules.ruleNotes = SRD5E2024.ruleNotes;

  SRD5E2024.createViewers(rules, SRD5E.VIEWERS);
  rules.defineChoice('extras',
    'feats', 'featCount', 'sanityNotes', 'selectableFeatureCount',
    'validationNotes'
  );
  rules.defineChoice('preset',
    'background:Background,select-one,backgrounds',
    'species:Species,select-one,species', 'levels:Class Levels,bag,levels'
  );

  SRD5E2024.abilityRules(rules, SRD5E2024.ABILITIES);
  SRD5E2024.combatRules
    (rules, SRD5E2024.ARMORS, SRD5E2024.SHIELDS, SRD5E2024.WEAPONS);
  SRD5E2024.magicRules(rules, SRD5E2024.SCHOOLS, SRD5E2024.SPELLS);
  SRD5E2024.identityRules(
    rules, SRD5E2024.ALIGNMENTS, SRD5E2024.BACKGROUNDS, SRD5E2024.CLASSES,
    SRD5E2024.DEITIES, SRD5E2024.SPECIES
  );
  SRD5E2024.talentRules
    (rules, SRD5E2024.FEATS, SRD5E2024.FEATURES, SRD5E2024.GOODIES,
     SRD5E2024.LANGUAGES, SRD5E2024.SKILLS, SRD5E2024.TOOLS);

  Quilvyn.addRuleSet(rules);

}

SRD5E2024.CHOICES = SRD5E.CHOICES.map(x => x.replace('Race', 'Species'));
SRD5E2024.RANDOMIZABLE_ATTRIBUTES = [].concat(SRD5E.RANDOMIZABLE_ATTRIBUTES);
SRD5E2024.VERSION = '2.4.1.0';
SRD5E2024.VIEWERS = [].concat(SRD5E.VIEWERS);

SRD5E2024.ABILITIES = Object.assign({}, SRD5E.ABILITIES);
SRD5E2024.ALIGNMENTS = Object.assign({}, SRD5E.ALIGNMENTS);
SRD5E2024.ARMORS = Object.assign({}, SRD5E.ARMORS);
SRD5E2024.BACKGROUNDS = {
  'Acolyte':
    'Equipment=' +
      '"Calligrapher\'s Supplies","Book (Prayers)","Holy Symbol",' +
      '"10 Sheets Of Parchment","Robe","8 GP" ' +
    'Features=' +
      '"1:Ability Boost (Choose 3 from Intelligence, Wisdom, Charisma)",' +
      '"1:Skill Proficiency (Insight; Religion)",' +
      '"1:Tool Proficiency (Calligrapher\'s Supplies)",' +
      '"1:Magic Initiate (Cleric)"',
  'Criminal':
    'Equipment=' +
      '"2 Daggers","Thieves\' Tools","Crowbar","2 Pouches",' +
      '"Traveler\'s Clothes","16 GP" ' +
    'Features=' +
      '"1:Ability Boost (Choose 3 from Dexterity, Constitution, Intelligence)",' +
      '"1:Skill Proficiency (Sleight Of Hand; Stealth)",' +
      '"1:Tool Proficiency (Thieves\' Tools)",' +
      '"1:Alert"',
  'Sage':
    'Equipment=' +
      '"Quarterstaff","Calligrapher\'s Supplies","Book (History)",' +
      '"8 Sheets Of Parchment","Robe","8 GP" ' +
    'Features=' +
      '"1:Ability Boost (Choose 3 from Constitution, Intelligence, Wisdom)",' +
      '"1:Skill Proficiency (Arcana; History)",' +
      '"1:Tool Proficiency (Calligrapher\'s Supplies)",' +
      '"1:Magic Initiate (Wizard)"',
  'Soldier':
    'Equipment=' +
      '"Spear","Shortbow","20 Arrows","Gaming Set","Healer\'s Kit","Quiver",' +
      '"Traveler\'s Clothes","14 GP" ' +
    'Features=' +
      '"1:Ability Boost (Choose 3 from Strength, Dexterity, Constitution)",' +
      '"1:Skill Proficiency (Athletics; Intimidation)",' +
      '"1:Tool Proficiency (Choose 1 from any Gaming Set)",' +
      '"1:Savage Attacker"'
};
SRD5E2024.CLASSES = {
  'Barbarian':
    'HitDie=d12 ' +
    'Features=' +
      '"1:Armor Training (Light; Medium; Shield)",' +
      '"1:Save Proficiency (Strength; Constitution)",' +
      '"1:Skill Proficiency (Choose 2 from Animal Handling, Athletics, Intimidation, Nature, Perception, Survival)",' +
      '"1:Weapon Proficiency (Simple Weapons; Martial Weapons)",' +
      '"1:Rage","1:Unarmored Defense","1:Weapon Mastery","2:Danger Sense",' +
      '"2:Reckless Attack","3:Barbarian Subclass","3:Primal Knowledge",' +
      '"5:Extra Attack","5:Fast Movement","7:Feral Instinct",' +
      '"7:Instinctive Pounce","9:Brutal Strike","11:Relentless Rage",' +
      '"13:Improved Brutal Strike","15:Persistent Rage",' +
      '"18:Indomitable Might","19:Epic Boon","20:Primal Champion",' +
      '"features.Path Of The Berserker ? 3:Frenzy",' +
      '"features.Path Of The Berserker ? 6:Mindless Rage",' +
      '"features.Path Of The Berserker ? 10:Retaliation",' +
      '"features.Path Of The Berserker ? 14:Intimidating Presence" ' +
    'Selectables=' +
      '"3:Path Of The Berserker:Barbarian Subclass" ' +
    'SpellAbility=Wisdom ' +
    'MulticlassPrerequisite="strength >= 13"',
  'Bard':
    'HitDie=d8 ' +
    'Features=' +
      '"1:Armor Training (Light)",' +
      '"1:Weapon Proficiency (Simple Weapons)",' +
      '"1:Tool Proficiency (Choose 3 from any Musical Instrument)",' +
      '"1:Save Proficiency (Dexterity; Charisma)",' +
      '"1:Skill Proficiency (Choose 3 from any)",' +
      '"1:Bardic Inspiration","1:Spellcasting","2:Expertise",' +
      '"2:Jack Of All Trades","3:Bard Subclass","5:Font Of Inspiration",' +
      '"7:Countercharm","10:Magical Secrets",' +
      '"18:Superior Inspiration","19:Epic Boon","20:Words Of Creation",' +
      '"features.College Of Lore ? 3:Bonus Proficiencies (College Of Lore)",' +
      '"features.College Of Lore ? 3:Cutting Words",' +
      '"features.College Of Lore ? 6:Magical Discoveries",' +
      '"features.College Of Lore ? 14:Peerless Skill" ' +
    'Selectables=' +
      '"3:College Of Lore:Bard Subclass" ' +
    'SpellAbility=Charisma ' +
    'SpellsAvailable=' +
      'B0:2@1;3@4;4@10,' +
      'B:4@1;5@2;6@3;7@4;9@5;10@6;11@7;12@8;14@9;15@10;16@11;17@13;18@15;19@17;20@18;21@19;22@20 ' +
    'SpellSlots=' +
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
      '"1:Armor Training (Light; Medium; Shield)",' +
      '"1:Weapon Proficiency (Simple Weapons)",' +
      '"1:Save Proficiency (Wisdom; Charisma)",' +
      '"1:Skill Proficiency (Choose 2 from History, Insight, Medicine, Persuasion, Religion)",' +
      '"1:Spellcasting","1:Divine Order","2:Channel Divinity",' +
      '"2:Divine Spark","2:Turn Undead","3:Cleric Subclass","5:Sear Undead",' +
      '"7:Blessed Strikes","10:Divine Intervention",' +
      '"14:Improved Blessed Strikes","19:Epic Boon",' +
      '"20:Greater Divine Intervention",' +
      '"features.Life Domain ? 3:Disciple Of Life",' +
      '"features.Life Domain ? 3:Life Domain Spells",' +
      '"features.Life Domain ? 3:Preserve Life",' +
      '"features.Life Domain ? 6:Blessed Healer",' +
      '"features.Life Domain ? 17:Supreme Healing" ' +
    'Selectables=' +
      '"1:Protector:Divine Order",' +
      '"1:Thaumaturge:Divine Order",' +
      // Note: 5.5 removed the requirement that selected domain matches deity's
      '"1:Life Domain:Cleric Subclass",' +
      '"7:Divine Strike:Blessed Strikes",' +
      '"7:Potent Spellcasting:Blessed Strikes" ' +
    'SpellAbility=Wisdom ' +
    'SpellsAvailable=' +
      'C0:3@1;4@4;5@10,' +
      'C:4@1;5@2;6@3;7@4;9@5;10@6;11@7;12@8;14@9;15@10;16@11;17@13;18@15;19@17;20@18;21@19;22@20 ' +
    'SpellSlots=' +
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
      '"1:Armor Training (Light; Shield)",' +
      '"1:Weapon Proficiency (Simple Weapons)",' +
      '"1:Tool Proficiency (Herbalism Kit)",' +
      '"1:Save Proficiency (Intelligence; Wisdom)",' +
      '"1:Skill Proficiency (Choose 2 from Animal Handling, Arcana, Insight, Medicine, Nature, Perception, Religion, Survival)",' +
      '"1:Druidic","1:Spellcasting","1:Primal Order","2:Wild Shape",' +
      '"2:Wild Companion","3:Druid Subclass","5:Wild Resurgence",' +
      '"7:Elemental Fury","15:Improved Elemental Fury","18:Beast Spells",' +
      '"19:Epic Boon","20:Archdruid",' +
      '"features.Circle Of The Land ? 3:Circle Of The Land Spells",' +
      '"features.Circle Of The Land ? 3:Land\'s Aid",' +
      '"features.Circle Of The Land ? 6:Natural Recovery",' +
      '"features.Circle Of The Land ? 10:Nature\'s Ward",' +
      '"features.Circle Of The Land ? 14:Nature\'s Sanctuary" ' +
    'Selectables=' +
      '"1:Magician:Primal Order",' +
      '"1:Warden:Primal Order",' +
      '"3:Circle Of The Land:Druid Subclass",' +
      '"7:Potent Spellcasting:Elemental Fury",' +
      '"7:Primal Strike:Elemental Fury" ' +
    'SpellAbility=Wisdom ' +
    'SpellsAvailable=' +
      'D0:2@1;3@4;4@10,' +
      'D:4@1;5@2;6@3;7@4;9@5;10@6;11@7;12@8;14@9;15@10;16@11;17@13;18@15;19@17;20@18;21@19;22@20 ' +
    'SpellSlots=' +
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
      '"1:Fighter Primary Ability",' +
      '"1:Armor Training (Light; Medium; Heavy; Shield)",' +
      '"1:Weapon Proficiency (Simple Weapons; Martial Weapons)",' +
      '"1:Save Proficiency (Strength; Constitution)",' +
      '"1:Skill Proficiency (Choose 2 from Acrobatics, Animal Handling, Athletics, History, Insight, Intimidation, Persuasion; Perception, Survival)",' +
      '"1:Fighting Style","1:Second Wind","1:Weapon Mastery",' +
      '"2:Action Surge","2:Tactical Mind","3:Fighter Subclass",' +
      '"5:Extra Attack","5:Tactical Shift","9:Indomitable",' +
      '"9:Tactical Master","11:Two Extra Attacks","13:Studied Attacks",' +
      '"19:Epic Boon","20:Three Extra Attacks",' +
      '"features.Champion ? 3:Improved Critical",' +
      '"features.Champion ? 3:Remarkable Athlete",' +
      '"features.Champion ? 7:Additional Fighting Style",' +
      '"features.Champion ? 10:Heroic Warrior",' +
      '"features.Champion ? 15:Superior Critical",' +
      '"features.Champion ? 18:Survivor" ' +
    'Selectables=' +
      '"1:Strength:Fighter Primary Ability",' +
      '"1:Dexterity:Fighter Primary Ability",' +
      '"3:Champion:Fighter Subclass" ' +
    'SpellAbility=Intelligence ' +
    'MulticlassPrerequisite="strength >= 13 || dexterity >= 13"',
  'Monk':
    'HitDie=d8 ' +
    'Features=' +
      '"1:Weapon Proficiency (Simple Weapons; Light Weapons)",' +
      '"1:Tool Proficiency (Choose 1 from any Artisan\'s Tools, any Musical Instrument)",' +
      '"1:Save Proficiency (Strength; Dexterity)",' +
      '"1:Skill Proficiency (Choose 2 from Acrobatics, Athletics, History, Insight, Religion, Stealth)",' +
      '"1:Martial Arts","1:Unarmored Defense","2:Monk\'s Focus",' +
      '"2:Unarmored Movement","Uncanny Metabolism","3:Deflect Attacks",' +
      '"3:Monk Subclass","4:Slow Fall","5:Extra Attack","5:Stunning Strike",' +
      '"6:Empowered Strikes","7:Evasion","7:Stillness Of Mind",' +
      '"9:Acrobatic Movement","10:Heightened Focus","10:Self-Restoration",' +
      '"13:Deflect Energy","14:Disciplined Survivor","15:Perfect Focus",' +
      '"18:Superior Defense","19:Epic Boon","20:Body And Mind",' +
      '"features.Warrior Of The Open Hand ? 3:Open Hand Technique",' +
      '"features.Warrior Of The Open Hand ? 6:Wholeness Of Body",' +
      '"features.Warrior Of The Open Hand ? 11:Fleet Step",' +
      '"features.Warrior Of The Open Hand ? 17:Quivering Palm" ' +
    'Selectables=' +
      '"3:Warrior Of The Open Hand:Monk Subclass" ' +
    'SpellAbility=Wisdom ' +
    'MulticlassPrerequisite="dexterity >= 13","wisdom >= 13"',
  'Paladin':
    'HitDie=d10 ' +
    'Features=' +
      '"1:Armor Training (Light; Medium; Heavy; Shield)",' +
      '"1:Weapon Proficiency (Simple Weapons; Martial Weapons)",' +
      '"1:Save Proficiency (Wisdom; Charisma)",' +
      '"1:Skill Proficiency (Choose 2 from Athletics, Insight, Intimidation, Medicine, Persuasion, Religion)",' +
      '"1:Lay On Hands","1:Spellcasting","1:Weapon Mastery",' +
      '"2:Paladin Fighting Style","2:Paladin\'s Smite","3:Channel Divinity",' +
      '"3:Divine Sense","3:Paladin Subclass","5:Extra Attack",' +
      '"5:Faithful Steed","6:Aura Of Protection","9:Abjure Foes",' +
      '"10:Aura Of Courage","11:Radiant Strikes","14:Restoring Touch",' +
      '"18:Aura Expansion","19:Epic Boon",' +
      '"features.Oath Of Devotion ? 3:Oath Of Devotion Spells",' +
      '"features.Oath Of Devotion ? 3:Sacred Weapon",' +
      '"features.Oath Of Devotion ? 7:Aura Of Devotion",' +
      '"features.Oath Of Devotion ? 15:Smite Of Protection",' +
      '"features.Oath Of Devotion ? 20:Holy Nimbus" ' +
    'Selectables=' +
      '"2:Blessed Warrior:Paladin Fighting Style",' +
      '"2:Fighting Style:Paladin Fighting Style",' +
      '"3:Oath Of Devotion:Paladin Subclass" ' +
    'SpellAbility=Charisma ' +
    'SpellsAvailable=' +
      'P:2@1;3@2;4@3;5@4;6@5;7@7;9@9;10@11;11@13;12@15;14@17;15@19 ' +
    'SpellSlots=' +
      'P1:2@1;3@3;4@5,' +
      'P2:2@5;3@7,' +
      'P3:2@9;3@11,' +
      'P4:1@13;2@15;3@17,' +
      'P5:1@17;2@19 ' +
    'MulticlassPrerequisite="strength >= 13","charisma >= 13"',
  'Ranger':
    'HitDie=d10 ' +
    'Features=' +
      '"1:Armor Training (Light; Medium; Shield)",' +
      '"1:Weapon Proficiency (Simple Weapons; Martial Weapons)",' +
      '"1:Save Proficiency (Strength; Dexterity)",' +
      '"1:Skill Proficiency (Choose 3 from Animal Handling, Athletics, Insight, Investigation, Nature, Perception, Stealth, Survival)",' +
      '"1:Favored Enemy","1:Spellcasting","1:Weapon Mastery",' +
      '"2:Deft Explorer","2:Ranger Fighting Style","3:Ranger Subclass",' +
      '"5:Extra Attack","6:Roving","9:Expertise","10:Tireless",' +
      '"13:Relentless Hunter","14:Nature\'s Veil","17:Precise Hunter",' +
      '"18:Feral Senses","19:Epic Boon","20:Foe Slayer",' +
      '"features.Hunter ? 3:Hunter\'s Lore",' +
      '"features.Hunter ? 3:Hunter\'s Prey",' +
      '"features.Hunter ? 7:Defensive Tactics",' +
      '"features.Hunter ? 11:Superior Hunter\'s Prey",' +
      '"features.Hunter ? 15:Superior Hunter\'s Defense" ' +
    'Selectables=' +
      '"2:Druidic Warrior:Ranger Fighting Style",' +
      '"2:Fighting Style:Ranger Fighting Style",' +
      '"3:Hunter:Ranger Subclass",' +
      '"features.Hunter ? 11:Volley:Multiattack",' +
      '"features.Hunter ? 11:Whirlwind Attack:Multiattack",' +
      '"features.Hunter ? 15:Evasion:Superior Hunter\'s Defense",' +
      '"features.Hunter ? 15:Stand Against The Tide:Superior Hunter\'s Defense",' +
      '"features.Hunter ? 15:Uncanny Dodge:Superior Hunter\'s Defense" ' +
    'SpellAbility=Wisdom ' +
    'SpellsAvailable=' +
      'R:2@1;3@2;4@3;5@4;6@5;7@7;9@9;10@11;11@13;12@15;14@17;15@19 ' +
    'SpellSlots=' +
      'R1:2@1;3@3;4@5,' +
      'R2:2@5;3@7,' +
      'R3:2@9;3@11,' +
      'R4:1@13;2@15;3@17,' +
      'R5:1@17;2@19 ' +
    'MulticlassPrerequisite="dexterity >= 13","wisdom >= 13"',
  'Rogue':
    'HitDie=d8 ' +
    'Features=' +
      '"1:Armor Training (Light)",' +
      '"1:Weapon Proficiency (Simple Weapons; Finesse Weapons; Light Weapons)",' +
      '"1:Tool Proficiency (Thieves\' Tools)",' +
      '"1:Save Proficiency (Dexterity; Intelligence)",' +
      '"1:Skill Proficiency (Choose 4 from Acrobatics, Athletics, Deception, Insight, Intimidation, Investigation, Perception, Persuasion, Sleight Of Hand, Stealth)",' +
      '"1:Expertise","1:Sneak Attack","1:Thieves\' Cant",' +
      '"1:Weapon Mastery","2:Cunning Action","3:Rogue Subclass",' +
      '"3:Steady Aim","5:Cunning Strike","5:Uncanny Dodge","7:Evasion",' +
      '"7:Reliable Talent","11:Improved Cunning Strike","14:Devious Strikes",' +
      '"15:Slippery Mind","18:Elusive","19:Epic Boon","20:Stroke Of Luck",' +
      '"features.Thief ? 3:Fast Hands",' +
      '"features.Thief ? 3:Second-Story Work",' +
      '"features.Thief ? 9:Supreme Sneak",' +
      '"features.Thief ? 13:Use Magic Device",' +
      '"features.Thief ? 17:Thief\'s Reflexes" ' +
    'Selectables=' +
      '"3:Thief:Rogue Subclass" ' +
    'SpellAbility=Intelligence ' +
    'MulticlassPrerequisite="dexterity >= 13"',
  'Sorcerer':
    'HitDie=d6 ' +
    'Features=' +
      '"1:Weapon Proficiency (Simple Weapons)",' +
      '"1:Save Proficiency (Constitution; Charisma)",' +
      '"1:Skill Proficiency (Choose 2 from Arcana, Deception, Insight, Intimidation, Persuasion, Religion)",' +
      '"1:Spellcasting","1:Innate Sorcery","2:Font Of Magic","2:Metamagic",' +
      '"3:Sorcerer Subclass","5:Sorcerous Restoration","7:Sorcery Incarnate",' +
      '"19:Epic Boon","20:Arcane Apotheosis",' +
      '"features.Draconic Sorcery ? 3:Draconic Resilience",' +
      '"features.Draconic Sorcery ? 3:Draconic Spells",' +
      '"features.Draconic Sorcery ? 6:Elemental Affinity",' +
      '"features.Draconic Sorcery ? 14:Dragon Wings",' +
      '"features.Draconic Sorcery ? 18:Dragon Companion" ' +
    'Selectables=' +
      '"1:Draconic Sorcery:Sorcerer Subclass",' +
      '"2:Careful Spell:Metamagic","2:Distant Spell:Metamagic",' +
      '"2:Empowered Spell:Metamagic","2:Extended Spell:Metamagic",' +
      '"2:Heightened Spell:Metamagic","2:Quickened Spell:Metamagic",' +
      '"2:Seeking Spell:Metamagic","2:Subtle Spell:Metamagic",' +
      '"2:Transmuted Spell:Metamagic","2:Twinned Spell:Metamagic" ' +
    'SpellAbility=Charisma ' +
    'SpellsAvailable=' +
      'S0:4@1;5@4;6@10,' +
      'S:2@1;4@2;6@3;7@4;9@5;10@6;11@7;12@8;14@9;15@10;16@11;17@13;18@15;19@17;20@18;21@19;22@20 ' +
    'SpellSlots=' +
      'S1:2@1;3@2;4@3,' +
      'S2:2@3;3@4,' +
      'S3:2@5;3@6,' +
      'S4:1@7;2@8;3@9,' +
      'S5:1@9;2@10,' +
      'S6:1@11,' +
      'S7:1@13,' +
      'S8:1@15,' +
      'S9:1@17 ' +
    'MulticlassPrerequisite="charisma >= 13"',
  'Warlock':
    'HitDie=d8 ' +
    'Features=' +
      '"1:Armor Training (Light)",' +
      '"1:Weapon Proficiency (Simple Weapons)",' +
      '"1:Save Proficiency (Wisdom; Charisma)",' +
      '"1:Skill Proficiency (Choose 2 from Arcana, Deception, History, Intimidation, Investigation, Nature, Religion)",' +
      '"1:Eldritch Invocations","1:Pact Magic",' +
      '"2:Magical Cunning","3:Warlock Subclass","9:Contact Patron",' +
      '"11:Mystic Arcanum","19:Epic Boon","20:Eldritch Master",' +
      '"features.Fiend Patron ? 3:Dark One\'s Blessing",' +
      '"features.Fiend Patron ? 3:Fiend Spells",' +
      '"features.Fiend Patron ? 6:Dark One\'s Own Luck",' +
      '"features.Fiend Patron ? 10:Fiendish Resilience",' +
      '"features.Fiend Patron ? 14:Hurl Through Hell" ' +
    'Selectables=' +
      '"1:Fiend Patron:Warlock Subclass",' +
      '"2:Agonizing Blast:Eldritch Invocation",' +
      '"1:Armor Of Shadows:Eldritch Invocation",' +
      '"5:Ascendant Step:Eldritch Invocation",' +
      '"2:Devil\'s Sight:Eldritch Invocation",' +
      '"12:Devouring Blade:Eldritch Invocation",' +
      '"1:Eldritch Mind:Eldritch Invocation",' +
      '"5:Eldritch Smite:Eldritch Invocation",' +
      '"2:Eldritch Spear:Eldritch Invocation",' +
      '"2:Fiendish Vigor:Eldritch Invocation",' +
      '"5:Gaze Of Two Minds:Eldritch Invocation",' +
      '"5:Gift Of The Depths:Eldritch Invocation",' +
      '"9:Gift Of The Protectors:Eldritch Invocation",' +
      '"5:Investment Of The Chain Master:Eldritch Invocation",' +
      '"2:Lessons Of The First Ones:Eldritch Invocation",' +
      '"9:Lifedrinker:Eldritch Invocation",' +
      '"2:Mask Of Many Faces:Eldritch Invocation",' +
      '"5:Master Of Myriad Forms:Eldritch Invocation",' +
      '"2:Misty Visions:Eldritch Invocation",' +
      '"5:One With Shadows:Eldritch Invocation",' +
      '"2:Otherworldly Leap:Eldritch Invocation",' +
      '"1:Pact Of The Blade:Eldritch Invocation",' +
      '"1:Pact Of The Chain:Eldritch Invocation",' +
      '"1:Pact Of The Tome:Eldritch Invocation",' +
      '"2:Repelling Blast:Eldritch Invocation",' +
      '"5:Thirsting Blade:Eldritch Invocation",' +
      '"9:Visions Of Distant Realms:Eldritch Invocation",' +
      '"7:Whispers Of The Grave:Eldritch Invocation",' +
      '"15:Witch Sight:Eldritch Invocation" ' +
    'SpellAbility=Charisma ' +
    'SpellsAvailable=' +
      'K0:2@1;3@4;4@10,' +
      'K:2@1;3@2;4@3;5@4;6@5;7@6;8@7;9@8;10@9;11@11;12@13;13@15;14@17;15@19 ' +
    'SpellSlots=' +
      'K1:1@1;2@2,' +
      'K2:2@3,' +
      'K3:2@5,' +
      'K4:2@7,' +
      'K5:2@9;3@11;4@17 ' +
    'MulticlassPrerequisite="charisma >= 13"',
  'Wizard':
    'HitDie=d6 ' +
    'Features=' +
      '"1:Weapon Proficiency (Simple Weapons)",' +
      '"1:Save Proficiency (Intelligence; Wisdom)",' +
      '"1:Skill Proficiency (Choose 2 from Arcana, History, Insight, Investigation, Medicine, Nature, Religion)",' +
      '"1:Spellcasting","1:Ritual Adept","1:Arcane Recovery","2:Scholar",' +
      '"3:Wizard Subclass","5:Memorize Spell","18:Spell Mastery",' +
      '"19:Epic Boon","20:Signature Spells",' +
      '"features.Evoker ? 3:Evocation Savant",' +
      '"features.Evoker ? 3:Potent Cantrip",' +
      '"features.Evoker ? 6:Sculpt Spells",' +
      '"features.Evoker ? 10:Empowered Evocation",' +
      '"features.Evoker ? 14:Overchannel" ' +
    'Selectables=' +
      '"2:Evoker:Wizard Subclass" ' +
    'SpellAbility=Intelligence ' +
    'SpellsAvailable=' +
      'W0:3@1;4@4;5@10,' +
      'W:4@1;5@2;6@3;7@4;9@5;10@6;11@7;12@8;14@9;15@10;16@11;17@13;18@14;19@15;21@16;22@17;23@18;24@19;25@20 ' +
    'SpellSlots=' +
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
SRD5E2024.DEITIES = {
  'None':''
};
SRD5E2024.FEATS = {
  'Alert':'Category=Origin',
  'Magic Initiate (Cleric)':'Category=Origin',
  'Magic Initiate (Druid)':'Category=Origin',
  'Magic Initiate (Wizard)':'Category=Origin',
  'Savage Attacker':'Category=Origin',
  'Skilled':'Category=Origin',
  'Ability Score Improvement':'Category=General Require="level >= 4"',
  'Grappler':'Category=General Require="level >= 4","strength >= 13"',
  'Archery':'Category="Fighting Style" Require="features.Fighting Style"',
  'Defense':'Category="Fighting Style" Require="features.Fighting Style"',
  'Great Weapon Fighting':
    'Category="Fighting Style" Require="features.Fighting Style"',
  'Two-Weapon Fighting':
    'Category="Fighting Style" Require="features.Fighting Style"',
  'Boon Of Combat Prowess':'Category="Epic Boon" Require="level >= 19"',
  'Boon Of Dimensional Travel':'Category="Epic Boon" Require="level >= 19"',
  'Boon Of Fate':'Category="Epic Boon" Require="level >= 19"',
  'Boon Of Irresistible Offense (Dexterity)':
    'Category="Epic Boon" Require="level >= 19"',
  'Boon Of Irresistible Offense (Strength)':
    'Category="Epic Boon" Require="level >= 19"',
  'Boon Of Spell Recall':
    'Category="Epic Boon" Require="level >= 19","features.Spellcasting"',
  'Boon Of The Night Spirit':'Category="Epic Boon" Require="level >= 19"',
  'Boon Of Truesight':'Category="Epic Boon" Require="level >= 19"'
};
SRD5E2024.FEATURES = {

  // Class

  // Barbarian
  'Barbarian Subclass':SRD5E.FEATURES['Primal Path'],
  'Brutal Strike':
    'Section=combat ' +
    'Note="Can forego Reckless Attack advantage on a Strength-based attack to inflict +%{levels.Barbarian<17?1:2}d10 HP weapon damage and %{levels.Barbarian<17?\'a choice\':\'2 choices\'} of: %{combatNotes.improvedBrutalStrike?\\"disadvantage on the target\'s next save and loss of opportunity attacks until the start of the next turn; a +5 bonus to the next attack on the target before the start of the next turn; \\":\'\'}a 15\' push, optionally moving with the target; -15 Speed until the start of the next turn"',
  'Danger Sense':
    SRD5E.FEATURES['Danger Sense']
    .replace('vs. visible dangers', 'saves'),
  'Epic Boon':'Section=feature Note="+1 Epic Boon Feat"',
  'Extra Attack':SRD5E.FEATURES['Extra Attack'],
  'Fast Movement':SRD5E.FEATURES['Fast Movement'],
  'Feral Instinct':
    SRD5E.FEATURES['Feral Instinct']
    .replace(/\/[^"]*/, ''),
  'Improved Brutal Strike':
    'Section=combat Note="Has increased Brutal Strike effects"',
  'Indomitable Might':SRD5E.FEATURES['Indomitable Might'],
  'Instinctive Pounce':
    'Section=combat Note="Can move %{speed//2}\' when entering rage"',
  'Persistent Rage':
    SRD5E.FEATURES['Persistent Rage']
    .replace('Can', 'Can recover all uses of Rage during initiative once per long rest and can'),
  'Primal Champion':SRD5E.FEATURES['Primal Champion'],
  'Primal Knowledge':
    'Section=skill,skill ' +
    'Note=' +
      '"Skill Proficiency (Choose 1 from Animal Handling, Athletics, Intimidation, Nature, Perception, Survival)",' +
      '"Can use Strength for Acrobatics, Intimidation, Perception, Stealth, and Survival during rage"',
  'Rage':
    SRD5E.FEATURES.Rage
    .replace(' melee', '')
    .replace('1 min', '1 rd (attacking, forcing a save, or using a bonus action each rd extends the rage for up to 10 min)')
    .replace('unlimited', '6')
    .replace('long rest', 'long rest; regains 1 use after a short rest')
    .replace('negates the benefits', 'ends the rage'),
  'Reckless Attack':
    SRD5E.FEATURES['Reckless Attack']
    .replace('melee ', ''),
  'Relentless Rage':
    SRD5E.FEATURES['Relentless Rage']
    .replace('1 hit point', '%{levels.Barbarian*2} hit points'),
  'Unarmored Defense':SRD5E.FEATURES['Unarmored Defense'],
  // Note: the kinds of weapons allowed by Weapon Mastery differ by class:
  // Fighter: simple or martial
  // Barbarian: simple or martial melee
  // Paladin, Ranger, Rogue: proficient
  // Since Barbarians and Fighters have proficiency in simple and martial
  // weapons, these are equivalent except for the Barbarian melee limitation.
  // Could use %1, filled in by classRulesExtra, but that seems overly complex
  // and more difficult to get right when multiclassing
  'Weapon Mastery':
    'Section=combat '+
    'Note="Can use the mastery properties of %V chosen kinds of proficient%{level==levels.Barbarian?\' melee\':\'\'} weapons"',
  // Berserker
  'Frenzy':
    // changed effects
    'Section=combat ' +
    'Note="First attack during Reckless Attack inflicts +%{levels.Barbarian<9?2:levels.Barbarian<16?3:4}d6 HP"',
  'Intimidating Presence':
    // changed effects
    'Section=combat ' +
    'Note="R30\' Can use a bonus action to inflict frightened (DC %{8+strengthModifier+proficiencyBonus} Wisdom negates; additional saves each rd end) on targets for 1 min once per long rest; can expend uses of Rage for additional uses"',
  'Mindless Rage':SRD5E.FEATURES['Mindless Rage'],
  'Retaliation':SRD5E.FEATURES.Retaliation,

  // Bard
  'Bard Subclass':SRD5E.FEATURES['Bard College'],
  'Bardic Inspiration':
    SRD5E.FEATURES['Bardic Inspiration']
    .replace('10 min', '1 hr'),
  'Countercharm':
    'Section=combat ' +
    // changed effects
    'Note="R30\' Can use a reaction to give a target a reroll with advantage on a save vs. charmed or frightened"',
  // Epic Boon as above
  'Expertise':
    // changed effects
    'Section=skill Note="Has expertise with %V chosen proficient skills"',
  'Font Of Inspiration':
    'Section=combat,magic ' +
    // changed effects
    'Note=' +
      '"Bardic Inspiration refreshes after a short rest",' +
      '"Can expend a spell slot to regain 1 Bardic Inspiration use"',
  'Jack Of All Trades':
    // changed effects
    'Section=skill Note="+%V on non-proficient skill checks"',
  'Magical Secrets':
    SRD5E.FEATURES['Magical Secrets']
    .replace(/learn.*spells/, 'learn spells')
    .replace('any class', 'the Cleric, Druid, and Wizard spell lists'),
  'Spellcasting':
    SRD5E.FEATURES.Spellcasting
    .replace('magicNotes.spellcasting.1', '1'),
  'Superior Inspiration':
    SRD5E.FEATURES['Superior Inspiration']
    .replace('1 use', '2 uses'),
  'Words Of Creation':
    'Section=magic ' +
    'Note="Knows the <i>Power Word Heal</i> and <i>Power Word Kill</i> spells; can target 2 creatures within 10\' of each other when casting them" ' +
    'Spells="Power Word Heal","Power Word Kill"',
  // College Of Lore
  'Bonus Proficiencies (College Of Lore)':
    SRD5E.FEATURES['Bonus Proficiencies (College Of Lore)'],
  'Cutting Words':SRD5E.FEATURES['Cutting Words'],
  'Magical Discoveries':
    SRD5E.FEATURES['Additional Magical Secrets']
    .replace('any class', 'the Cleric, Druid, and Wizard spell lists'),
  'Peerless Skill':
    // changed effects
    'Section=ability,combat ' +
    'Note=' +
      '"Can add a Bardic Inspiration die to a failed ability check; does not expend a use on failure",' +
      '"Can add a Bardic Inspiration die to a failed attack; does not expend a use on failure"',

  // Cleric
  'Blessed Strikes':'Section=feature Note="1 selection"',
  'Channel Divinity':
    'Section=magic ' +
    // changed effects
    'Note="Can use a Channel Divinity effect %{magicNotes.channelDivinity.1} times per long rest; regains 1 use after a short rest"',
  'Cleric Subclass':SRD5E.FEATURES['Divine Domain'],
  'Divine Intervention':
    'Section=magic ' +
    // changed effects
    'Note="Can cast a level 5 Cleric spell without using a spell slot or material components once per long rest"',
  'Divine Order':'Section=feature Note="1 selection"',
  'Divine Spark':
    'Section=combat ' +
    'Note="R30\' Can use Channel Divinity to restore %Vd8 hit points or to inflict %Vd8 HP of a choice of necrotic or radiant (save Constitution half)"',
  'Divine Strike':
    SRD5E.FEATURES['Divine Strike']
    .replace('%{divineStrikeDamageType}', 'of a choice of necrotic or radiant'),
  // Epic Boon as above
  'Greater Divine Intervention':
    'Section=magic ' +
    'Note="Can use Divine Intervention to cast <i>Wish</i>; requires 2d4 long rests before using Divine Intervention again" ' +
    'Spells=Wish',
  'Improved Blessed Strikes':
    'Section=combat,magic ' +
    'Note=' +
      '"Has increased Divine Strike effects",' +
      '"Has increased Potent Spellcasting effects"', 
  'Potent Spellcasting':
    'Section=magic ' +
    'Note="%{levels.Cleric?\'Cleric\':\'Druid\'} cantrips inflict +%{wisdomModifier} HP%{magicNotes.improvedBlessedStrikes?\' and give \'+(wisdomModifier*2)+\\" temporary hit points to a target within 60\'\\":\'\'}%{magicNotes.improvedElementalFury?\\", and those with a range of 10\' or more can be cast at 300\'\\":\'\'}"',
  'Protector':
    'Section=combat ' +
    'Note="Armor Training (Heavy)/Weapon Proficiency (Martial Weapons)"',
  'Sear Undead':
    'Section=combat ' +
    'Note="Successful Turn Undead also inflicts %{wisdomModifier>?1}d8 HP radiant"',
  'Thaumaturge':
    'Section=magic,skill ' +
    'Note=' +
      '"Knows +1 Cleric cantrip",' +
      '"+%V Arcana/+%V Religion"',
  'Turn Undead':SRD5E.FEATURES['Turn Undead'],
  // Life Domain
  'Blessed Healer':
    SRD5E.FEATURES['Blessed Healer']
    .replace('Casting', 'Using a spell slot to cast'),
  'Disciple Of Life':
    SRD5E.FEATURES['Disciple Of Life']
    .replace('Casting', 'Using a spell slot to cast'),
  'Life Domain Spells':
    // changed effects
    'Spells=' +
      '"3:Aid","3:Bless","3:Cure Wounds","3:Lesser Restoration",' +
      '"5:Mass Healing Word","5:Revivify",' +
      '"7:Aura Of Life","7:Death Ward",' +
      '"9:Greater Restoration","9:Mass Cure Wounds"',
  'Preserve Life':SRD5E.FEATURES['Preserve Life'],
  'Supreme Healing':SRD5E.FEATURES['Supreme Healing'],

  // Druid
  'Archdruid':
    // changed effects
    'Section=feature ' +
    'Note="Has the Evergreen Wild Shape, Nature Magician, and Longevity features"',
  'Beast Spells':SRD5E.FEATURES['Beast Spells'],
  'Druidic':
    // changed effects
    'Section=skill ' +
    'Note="Language (Druidic)" ' +
    'Spells="Speak With Animals"',
  'Druid Subclass':SRD5E.FEATURES['Druid Circle'],
  'Elemental Fury':'Section=feature Note="1 selection"',
  // Epic Boon as above
  'Evergreen Wild Shape':
    'Section=combat ' +
    'Note="Has at least 1 use of Wild Shape available after initiative"',
  'Improved Elemental Fury':
    'Section=combat,magic ' +
    'Note=' +
      '"Has increased Primal Strike effects",' +
      '"Has increased Potent Spellcasting effects"',
  'Longevity':'Section=feature Note="Ages at 1/10 normal rate"',
  'Magician':
    'Section=magic,skill ' +
    'Note=' +
      '"Knows +1 Druid cantrip",' +
      '"+%{wisdomModifier>?1} Arcana/+%{wisdomModifier>?1} Nature"',
  'Nature Magician':
    'Section=magic ' +
    'Note=' +
      '"Can convert Wild Shape uses into a spell slot, expending a use for each 2 spell levels, once per long rest"',
  // Potent Spellcasting as above
  'Primal Order':'Section=feature Note="1 selection"',
  'Primal Strike':
    'Section=combat ' +
    'Note="Weapon attacks and attacks during Wild Shape inflict +%{combatNotes.improvedElementalFury?2:1}d8 HP of a choice of cold, fire, lightning, or thunder once per turn"',
  // Spellcasting as above
  'Warden':
    'Section=combat ' +
    'Note="Armor Training (Medium)/Weapon Proficiency (Martial Weapons)"',
  'Wild Companion':
    'Section=magic ' +
    'Note="Can expend a spell slot or a use of Wild Shape to summon a Fey familiar using <i>Find Familiar</i>; the familiar remains present until the next long rest" ' +
    'Spells="Find Familiar"',
  'Wild Resurgence':
    'Section=magic ' +
    'Note="Can expend a Wild Shape use to gain a level 1 spell slot once per long rest and expend a spell slot to gain a Wild Shape use"',
  'Wild Shape':
    'Section=magic ' +
    // changed effects
    'Note="Can use a bonus action to transform into a CR %V%{levels.Druid<8?\' (non-flying)\':\'\'} creature with %1 temporary hit points for %{levels.Druid//2} hr %{levels.Druid<6?2:levels.Druid<17?3:4} times per long rest; regains 1 use after a short rest"',
  // Circle Of The Land
  'Arid Land':
    'Spells=' +
      '"3:Blur","3:Burning Hands","3:Fire Bolt",' +
      '"5:Fireball",' +
      '"7:Blight",' +
      '"9:Wall Of Stone"',
  'Polar Land':
    'Spells=' +
      '"3:Fog Cloud","3:Hold Person","3:Ray Of Frost",' +
      '"5:Sleet Storm",' +
      '"7:Ice Storm",' +
      '"9:Cone Of Cold"',
  'Temperate Land':
    'Spells=' +
      '"3:Misty Step","3:Shocking Grasp","3:Sleep",' +
      '"5:Lightning Bolt",' +
      '"7:Freedom Of Movement",' +
      '"9:Tree Stride"',
  'Tropical Land':
    'Spells=' +
      '"3:Acid Splash","3:Ray Of Sickness","3:Web",' +
      '"5:Stinking Cloud",' +
      '"7:Polymorph",' +
      '"9:Insect Plague"',
  'Circle Of The Land Spells':
    'Section=magic,magic ' +
    'Note=' +
      '"Has the Arid Land, Polar Land, Temperate Land, and Tropical Land features",' +
      '"Can choose spells from 1 type of land to have prepared after a long rest"',
  "Land's Aid":
    'Section=magic ' +
    'Note="R60\' Can expend a Wild Shape use to inflict %{levels.Druid<10?2:levels.Druid<14?3:4}d6 HP necrotic to targets in a 10\' radius; an additional target regains an equal number of hit points"',
  'Natural Recovery':
    SRD5E.FEATURES['Natural Recovery']
    .replace('recover', 'cast 1 Druid spell without using a spell slot and recover'),
  "Nature's Sanctuary":
    'Section=combat ' +
    // changed effects
    'Note="R120\' Creates a 15\' cube of spectral vines and trees that gives allies Nature\'s Ward resistance, and gives self and allies 1/2 cover, for 1 min; can use a bonus action each rd to move it 60\'"',
  "Nature's Ward":
    'Section=save ' +
    // changed effects
    'Note="Has immunity to poisoned and resistance to fire, cold, lightning, or poison depending on whether Circle Spells are currently taken from Arid, Polar, Temperate, or Tropical Land"',

  // Fighter
  'Action Surge':
    SRD5E.FEATURES['Action Surge']
    .replace('action', 'non-magic action'),
  // Epic Boon as above
  // Extra Attack as above
  'Fighter Primary Ability':'Section=feature Note="1 selection"',
  'Fighter Subclass':SRD5E.FEATURES['Martial Archetype'],
  'Fighting Style':'Section=feature Note="+1 Fighting Style Feat"',
  'Indomitable':
    SRD5E.FEATURES.Indomitable
    .replace('failed save', 'failed save, adding a +%{levels.Fighter} bonus,'),
  'Second Wind':
    'Section=combat ' +
    // changed effects
    'Note="Can use a bonus action to regain 1d10+%{levels.Fighter} hit points %V times per long rest; regains 1 use after a short rest"',
  'Studied Attacks':
    'Section=combat ' +
    'Note="Missed attack gives advantage on the next attack on the same target before the end of the next turn"',
  'Tactical Master':
    'Section=combat Note="Can use a mastery weapon to Push, Sap, or Slow"',
  'Tactical Mind':
     'Section=ability ' +
     'Note="Can add 1d10 to a failed ability check, expending a use of Second Wind if the result is a success"',
  'Tactical Shift':
    'Section=combat ' +
    'Note="Using Second Wind allows moving %{speed//2}\' without provoking opportunity attacks"',
   'Three Extra Attacks':
     'Section=combat Note="Has increased Extra Attack effects"',
   'Two Extra Attacks':
     'Section=combat Note="Has increased Extra Attack effects"',
  // Weapon Mastery as above
  // Champion
  'Additional Fighting Style':'Section=feature Note="+1 Fighting Style Feat"',
  'Defy Death':
    'Section=save ' +
    'Note="Has advantage on death saves, and a roll of 18-19 on a death save gives the benefits of a 20"',
  'Heroic Rally':
    'Section=combat ' +
    'Note=' +
      '"Regains %{constitutionModifier+5} hit points each rd when between 1 and %{hitPoints//2} hit points"',
  'Heroic Warrior':
    'Section=combat ' +
    'Note="Can give self Heroic Inspiration at the start of each turn"',
  'Improved Critical':SRD5E.FEATURES['Improved Critical'],
  'Remarkable Athlete':
    // changed effects
    'Section=combat,skill ' +
    'Note=' +
      '"Has advantage on initiative and can move %{speed//2}\' after scoring a critical hit without provoking opportunity attacks",' +
      '"Has advantage on Athletics"',
  'Superior Critical':SRD5E.FEATURES['Superior Critical'],
  'Survivor':
    // changed effects
    'Section=combat Note="Has the Defy Death and Heroic Rally features"',

  // Monk
  'Acrobatic Movement':
    'Section=ability ' +
    'Note="Can move across vertical surfaces and liquids when unarmored and not using a shield"',
  'Body And Mind':'Section=ability Note="+4 Dexterity/+4 Wisdom"',
  'Deflect Attacks':
    SRD5E.FEATURES['Deflect Missiles']
    .replace(' missile', "%{combatNotes.deflectEnergy?'':' bludgeoning, piercing, or slashing'}")
    .replace('ki point', 'focus point')
    .replace('make an immediate attack with the missile', 'redirect 2d%{combatNotes.martialArts}+%{dexterityModifier} HP (save DC %{monkSaveDC} Dexterity negates) to an adjacent creature, or to a creature within 60\' if the damage came from a ranged attack'),
  'Deflect Energy':
    'Section=combat Note="Has increased Deflect Attacks effects"',
  'Disciplined Survivor':
    SRD5E.FEATURES['Diamond Soul']
    .replace('ki point', 'focus point'),
  // Epic Boon as above
  // Extra Attack as above
  'Empowered Strikes':
    'Section=combat Note="Can inflict force damage with unarmed strikes"',
  'Evasion':SRD5E.FEATURES.Evasion,
  'Flurry Of Blows':
    SRD5E.FEATURES['Flurry Of Blows']
    .replace('ki point', 'focus point')
    .replace('2 unarmed', '%{combatNotes.heightenedFocus?3:2} unarmed'),
  'Heightened Focus':
    'Section=combat ' +
    'Note="Has increased Flurry Of Blows, Patient Defense, and Step Of The Wind effects"',
  'Martial Arts':
    SRD5E.FEATURES['Martial Arts']
    .replace('after attacking', ' and can use Dexterity instead of Strength to Grapple and Shove'),
  'Monk Subclass':SRD5E.FEATURES['Monastic Tradition'],
  "Monk's Focus":
    'Section=combat,combat ' +
    'Note=' +
      '"Has the Flurry Of Blows, Patient Defense, and Step Of The Wind features",' +
      '"Can use %{levels.Monk} focus points per short rest"',
  'Patient Defense':
    'Section=combat ' +
    // changed effects
    'Note="Can use a bonus action to Disengage, optionally spending 1 focus point to Dodge%{combatNotes.heightenedFocus?\' and to gain 2d\'+combatNotes.martialArts+\' temporary hit points\':\'\'}"',
  'Perfect Focus':
    SRD5E.FEATURES['Perfect Self']
    .replace('ki', 'focus'),
  'Self-Restoration':
    'Section=save ' +
    'Note="Can end a charmed, frightened, or poisoned condition affecting self at the end of each turn, and does not suffer exhaustion from lack of food or drink"',
  'Slow Fall':SRD5E.FEATURES['Slow Fall'],
  'Step Of The Wind':
    'Section=combat ' +
    // changed effects
    'Note="Can use a bonus action to Dash, optionally spending 1 focus point to Disengage and to double jump distance%{combatNotes.heightenedFocus?\'; can bring along 1 willing Large creature when moving without provoking opportunity attacks\':\'\'}"',
  'Stillness Of Mind':SRD5E.FEATURES['Stillness Of Mind'],
  'Stunning Strike':
    SRD5E.FEATURES['Stunning Strike']
    .replace('ki point', 'focus point')
    .replace('negates', 'inflicts half Speed and advantage on the next foe attack')
    .replace('end of', 'start of'),
  'Superior Defense':
    'Section=save ' +
    'Note="Can spend 3 focus points to gain resistance to non-force damage for 1 min"',
  'Unarmored Movement':
    // changed effects
    'Section=ability Note="+%{(levels.Monk+6)//4*5} Speed in no armor"',
  // Unarmored Defense as above
  'Uncanny Metabolism':
    'Section=combat ' +
    'Note="Can regain all focus points and 1d%{combatNotes.martialArts}+%{levels.Monk} hit points during initiative once per long rest"',
  // Warrior Of The Open Hand
  'Fleet Step':
    'Section=combat ' +
    'Note="Can use Step Of The Wind immediately after another bonus action"',
  'Open Hand Technique':
    SRD5E.FEATURES['Open Hand Technique']
    .replace('reactions until the end of the', "opportunity attacks until the start of the target's"),
  'Quivering Palm':
    'Section=combat ' +
    // changed effects
    'Note="Can spend 4 focus points after a successful unarmed attack to inflict 10d12 HP force (save DC %{monkSaveDC} Constitution half) at any time within %{levels.Monk} days"',
  'Wholeness Of Body':
    SRD5E.FEATURES['Wholeness Of Body']
    .replace('action', 'bonus action')
    .replace('%{levels.Monk*3}', '1d%{combatNotes.martialArts}+%{wisdomModifier}')
    .replace('once', "%{wisdomModifier>1?wisdomModifier+\' times\':\'once\'}"),

  // Paladin
  'Abjure Foes':
    'Section=combat ' +
    'Note="R60\' Can use Channel Divinity to frighten %{charismaModifier>1?charismaModifier+\' targets\':\'1 target\'} (save DC %{spellDifficultyClass.P} Wisdom negates), limiting %{charismaModifier>1?\'them\':\'it\'} to one move or action each turn, for 1 min or until damaged"',
  'Aura Expansion':'Section=save Note="Has increased Aura effects"',
  'Aura Of Courage':SRD5E.FEATURES['Aura Of Courage'],
  'Aura Of Protection':SRD5E.FEATURES['Aura Of Protection'],
  'Blessed Warrior':
    'Section=magic ' +
    'Note="Knows 2 Cleric cantrips; can replace 1 of them when gaining a Paladin level"',
  // Channel Divinity as above
  'Divine Sense':
    'Section=skill ' +
    // changed effects
    'Note="R60\' Can use Channel Divinity to sense the location and type of celestials, fiends, undead, consecration, and desecration for 10 min"',
  // Epic Boon as above
  // Extra Attack as above
  'Faithful Steed':
    'Section=magic ' +
    'Note="Can cast <i>Find Steed</i> without expending a spell slot once per long rest" ' +
    'Spells="Find Steed"',
  // Fighting Style as above
  'Lay On Hands':
    SRD5E.FEATURES['Lay On Hands']
    .replace('heal', 'use bonus actions to heal')
    .replace('cure a disease or neutralize a poison', 'remove a poisoned condition'),
  'Paladin Fighting Style':'Section=feature Note="1 selection"',
  "Paladin's Smite":
    'Section=magic ' +
    'Note="Can cast <i>Divine Smite</i> without expending a spell slot once per long rest" ' +
    'Spells="Divine Smite"',
  'Paladin Subclass':SRD5E.FEATURES['Sacred Oath'],
  'Radiant Strikes':SRD5E.FEATURES['Improved Divine Smite'],
  'Restoring Touch':
    'Section=magic ' +
    'Note="Can use 5 hit points\' worth of Lay On Hands to remove a blinded, charmed, deafened, frightened, paralyzed, or stunned condition"',
  // Spellcasting as above
  // Weapon Mastery as above
  // Oath Of Devotion
  'Aura Of Devotion':SRD5E.FEATURES['Aura Of Devotion'],
  'Holy Nimbus':
    SRD5E.FEATURES['Holy Nimbus']
    .replace('emit', 'use a bonus action to emit')
    .replace('1 min', '10 min')
    .replace('spells by ', '')
    .replace('long rest', 'long rest; can expend level 5 spell slots for additional uses')
    .replace('10 HP', '%{charismaModifier+proficiencyBonus} HP'),
  'Oath Of Devotion Spells':
    'Spells=' +
      '"3:Protection From Evil And Good","3:Shield Of Faith",' +
      '"5:Aid","5:Zone Of Truth",' +
      '"9:Beacon Of Hope","9:Dispel Magic",' +
      '"13:Freedom Of Movement","13:Guardian Of Faith",' +
      '"17:Commune","17:Flame Strike"',
  'Sacred Weapon':
    SRD5E.FEATURES['Sacred Weapon']
    .replace('1 min', '10 min')
    .replace('attack and', 'attack, normal or radiant damage, and'),
  'Smite Of Protection':
    'Section=combat ' +
    'Note="R%{levels.Paladin<18?10:30}\' Divine Smite gives self and allies 1/2 cover until the start of the next turn"',

  // Ranger
  'Deft Explorer':
    'Section=skill ' +
    'Note="Language (Choose 2 from any)/Has expertise with 1 chosen proficient skill"',
  'Druidic Warrior':
    'Section=magic ' +
    'Note="Knows 2 Druid cantrips; can replace 1 of them when gaining a Ranger level"',
  // Expertise as above
  'Favored Enemy':
    'Section=magic ' +
    // changed effects
    'Note="Can cast <i>Hunter\'s Mark</i> without expending a spell slot %{(levels.Ranger+7)//4} times per long rest" ' +
    'Spells="Hunter\'s Mark"',
  // Epic Boon as above
  // Extra Attack as above
  'Feral Senses':
    // changed effects
    'Section=skill Note="Has 30\' Blindsight"',
  'Foe Slayer':
    // changed effects
    'Section=magic Note="Has increased Hunter\'s Mark effects"',
  "Nature's Veil":
    'Section=combat ' +
    'Note="Can use a bonus action to become invisible until the end of the next turn %{wisdomModifier>1?wisdomModifier+\' times\':\'once\'} per long rest"',
  'Precise Hunter':
    'Section=combat ' +
    'Note="Has advantage on attacks vs. <i>Hunter\'s Mark</i> target"',
  'Ranger Fighting Style':'Section=feature Note="1 selection"',
  'Ranger Subclass':SRD5E.FEATURES['Ranger Archetype'],
  'Roving':
    'Section=ability,ability ' +
    'Note=' +
      '"+10 Speed; heavy armor negates",' +
      '"Has %{speed}\' climb and swim Speeds"',
  'Relentless Hunter':
    'Section=magic ' +
    'Note="Damage does not break concentration on <i>Hunter\'s Mark</i>"',
  // Spellcasting as above
  'Tireless':
    'Section=combat,save ' +
    'Note=' +
      '"Can use an action to gain 1d8+%{wisdomModifier>?1} temporary hit points %{wisdomModifier>1?wisdomModifier+\' times\':\'once\'} per long rest",' +
      '"Exhaustion level decreases by 1 after a short rest"',
  // Weapon Mastery as above
  // Hunter
  'Colossus Slayer':SRD5E.FEATURES['Colossus Slayer'],
  'Defensive Tactics':
   'Section=combat,combat ' +
   // changed effects
   'Note=' +
     '"Has the Escape The Horde and Multiattack Defense features",' +
     '"Can choose Escape The Horde or Multiattack Defense to be active after each rest"',
  'Escape The Horde':SRD5E.FEATURES['Escape The Horde'],
  'Horde Breaker':SRD5E.FEATURES['Horde Breaker'],
  "Hunter's Lore":
    'Section=combat ' +
    'Note="Knows any immunities, resistances, or vulnerabilities of a <i>Hunter\'s Mark</i> target"',
  "Hunter's Prey":
   'Section=combat,combat ' +
   // changed effects
   'Note=' +
     '"Has the Colossus Slayer and Horde Breaker features",' +
     '"Can choose to have Colossus Slayer or Horde Breaker active after each rest"',
  'Multiattack Defense':
    'Section=combat ' +
    // changed effects
    'Note="Successful attackers suffer disadvantage on additional attacks on self in the same turn"',
  "Superior Hunter's Prey":
    'Section=combat ' +
    'Note="Can inflict <i>Hunter\'s Mark</i> damage to a second creature within 30\' of the target once per turn"',
  "Superior Hunter's Defense":
    'Section=save ' +
    'Note="Can use a reaction upon taking damage to gain resistance to that type of damage until the end of the current turn"',

  // Rogue
  'Cunning Action':SRD5E.FEATURES['Cunning Action'],
  'Cunning Strike':
    'Section=combat ' +
    'Note="Can reduce Sneak Attack damage to inflict %{combatNotes.improvedCunningStrike?\'2 choices of\':\'a choice of\'}: %{combatNotes.deviousStrikes?\\"limitation to 1 action or move on the target\'s next turn (save Constitution negates) (reduces damage by 2d6 HP), unconsciousness (save Constitution negates; additional saves each rd end) for 1 min (reduces damage by 6d6 HP), blindness until the end of the target\'s next turn (save Dexterity negates) (reduces damage by 3d6), \\":\'\'}poisoned (save Constitution negates; additional saves each rd end) for 1 min (reduces damage by 1d6 HP), prone (save Dexterity negates; Huge and larger targets are unaffected) (reduces damage by 1d6 HP), or to move %{speed//2}\' after attacking without provoking opportunity attacks (reduces damage by 1d6 HP)"',
  'Devious Strikes':
    'Section=combat Note="Has increased Cunning Strike effects"',
  'Elusive':SRD5E.FEATURES.Elusive,
  // Epic Boon as above
  // Evasion as above
  // Expertise as above
  'Improved Cunning Strike':
    'Section=combat Note="Has increased Cunning Strike effects"',
  'Reliable Talent':
    // changed effects
    'Section=skill ' +
    'Note="Scores at least a 10 on proficient skill and tool check rolls"',
  'Rogue Subclass':SRD5E.FEATURES['Roguish Archetype'],
  'Slippery Mind':
    SRD5E.FEATURES['Slippery Mind']
    .replace('Wisdom', 'Charisma; Wisdom'),
  'Sneak Attack':SRD5E.FEATURES['Sneak Attack'],
  'Steady Aim':
    'Section=combat ' +
    'Note="Can use a bonus action%{combatNotes.infiltrationExpertise?\'\':\' and forego moving\'} to gain advantage on the next attack in the same turn"',
  'Stroke Of Luck':
    // changed effects
    'Section=ability ' +
    'Note="Can change a failed ability check roll to a 20 once per short rest"',
  "Thieves' Cant":
    // Changed effects
    'Section=skill Note="Language (Thieves\' Cant; Choose 1 from any)"',
  'Uncanny Dodge':SRD5E.FEATURES['Uncanny Dodge'],
  // Weapon Mastery as above
  // Thief
  'Fast Hands':
    'Section=combat ' +
    // changed effects
    'Note="Can use a bonus action to disarm a trap, open a lock, pick a pocket, or take a Utilize action"',
  'Second-Story Work':
    'Section=ability,skill ' +
    'Note=' +
      // changed effects
      '"Has a %{speed}\' climb Speed",' +
      '"+%{dexterity-strength}\' running jump distance"',
  'Supreme Sneak':
    'Section=combat ' +
    // changed effects
    'Note="Can use Cunning Strike to attack while invisible from hiding without becoming visible; reduces the damage by 1d6 HP"',
  "Thief's Reflexes":SRD5E.FEATURES["Thief's Reflexes"],
  'Use Magic Device':
    'Section=skill ' +
    // changed effects
    'Note="Has a 1 in 6 chance of using a magic item without expending a charge and can attune 4 magic items, use cantrip and level 1 spell scrolls reliably, and use a higher-level spell scroll with a successful DC 10 + spell level Arcana check"',

  // Sorcerer
  'Arcane Apotheosis':
    'Section=magic ' +
    'Note="While using Innate Sorcery, can use 1 Metamagic option each turn without spending Sorcery Points"',
  // Epic Boon as above
  'Font Of Magic':
    'Section=magic ' +
    // changed effects
    'Note="Can use %V Sorcery Points per long rest, convert spell slots to Sorcery Points, and use a bonus action to convert Sorcery Points to a spell slot"',
  'Innate Sorcery':
    'Section=magic ' +
    'Note="Can use a bonus action to gain +1 spell DC and advantage on spell attacks for 1 min 2 times per long rest"',
  'Metamagic':SRD5E.FEATURES.Metamagic,
  'Sorcerer Subclass':SRD5E.FEATURES['Sorcerous Origin'],
  'Sorcerous Restoration':
    SRD5E.FEATURES['Sorcerous Restoration']
    .replace('4', '%{levels.Sorcerer//2}')
    .replace('Points', 'Points once per long rest'),
  'Sorcery Incarnate':
    'Section=magic ' +
    'Note="Can spend 2 Sorcery Points for additional uses of Innate Sorcery, and can use 2 Metamagic options on each spell"',
  // Spellcasting as above
  // Metamagic
  'Careful Spell':
    SRD5E.FEATURES['Careful Spell']
    .replace('successful save', 'successful save and no damage instead of half'),
  'Distant Spell':SRD5E.FEATURES['Distant Spell'],
  'Empowered Spell':SRD5E.FEATURES['Empowered Spell'],
  'Extended Spell':
    SRD5E.FEATURES['Extended Spell']
    .replace('maximum', 'maximum, and to gain advantage on any concentration saves'),
  'Heightened Spell':
    SRD5E.FEATURES['Heightened Spell']
    .replace('3', '2')
    .replace('initial save', 'saves'),
  'Quickened Spell':SRD5E.FEATURES['Quickened Spell'],
  'Seeking Spell':
    'Section=magic ' +
    'Note="Can spend 1 Sorcery Point to reroll a failed spell attack"',
  'Subtle Spell':
    SRD5E.FEATURES['Subtle Spell']
    .replace('somatic', 'somatic, material,'),
  'Transmuted Spell':
    'Section=magic ' +
    'Note="Can spend 1 Sorcery Point to change the damage type of an acid, cold, fire, lightning, poison, or thunder spell to a different type from that list"',
  'Twinned Spell':
    'Section=magic ' +
    // changed effects
    'Note="Can spend 1 Sorcery Point to increase a spell\'s level by 1 so that it affects a second target"',
  // Draconic Sorcery
  'Draconic Resilience':
    SRD5E.FEATURES['Draconic Resilience']
    .replace('3', '%{charismaModifier}'),
  'Draconic Spells':
    'Spells=' +
      '"3:Alter Self","3:Chromatic Orb","3:Command","3:Dragon\'s Breath",' +
      '"5:Fear","5:Fly",' +
      '"7:Arcane Eye","7:Charm Monster",' +
      '"9:Legend Lore","9:Summon Dragon"',
  'Dragon Companion':
    'Section=magic ' +
    'Note="Can cast <i>Summon Dragon</i> without material components once per long rest and can make its duration 1 min instead of concentration" ' +
    'Spells="Summon Dragon"',
  'Dragon Wings':
    'Section=ability ' +
    // changed effects
    'Note="Can use a bonus action to gain a 60\' fly Speed for 1 hr once per long rest; can expend 3 sorcery points for additional uses"',
  'Elemental Affinity':
    'Section=magic,save ' +
    // changed effects
    'Note=' +
      '"Spells that deal a choice of acid, cold, fire, lightning, or poison inflict +%{charismaModifier} HP",' +
      '"Has resistance to a choice of acid, cold, fire, lightning, or poison"',

  // Warlock
  'Contact Patron':
    'Section=magic ' +
    'Note="Can use <i>Contact Other Plane</i> to contact patron once per long rest" ' +
    'Spells="Contact Other Plane"',
  'Eldritch Invocations':'Section=magic Note="%V selections"',
  'Eldritch Master':
    // changed effects
    'Section=magic Note="Has increased Magical Cunning effects"',
  // Epic Boon as above
  'Magical Cunning':
    'Section=magic ' +
    'Note="Can use a 1 min process to regain %{magicNotes.eldritchMaster?\'all\':levels.Warlock>10?2:1} Pact Magic spell slot%{levels.Warlock>10?\'s\':\'\'} once per long rest"',
  'Mystic Arcanum':SRD5E.FEATURES['Mystic Arcanum'],
  'Pact Magic':
    'Section=magic ' +
    // changed effects
    'Note="Can cast spells from the Warlock spell list and cast spells marked with [R] using a ritual"',
  'Warlock Subclass':SRD5E.FEATURES['Otherworldly Patron'],
  // Eldritch Invocations
  'Agonizing Blast':
    SRD5E.FEATURES['Agonizing Blast']
    .replace('<i>Eldritch Blast</i> inflicts', "%{$$'features.Agonizing Blast'>1?$$'features.Agonizing Blast'+' chosen Warlock cantrips inflict':'Chosen Warlock cantrip inflicts'}"),
  'Armor Of Shadows':SRD5E.FEATURES['Armor Of Shadows'],
  'Ascendant Step':SRD5E.FEATURES['Ascendant Step'],
  "Devil's Sight":SRD5E.FEATURES["Devil's Sight"],
  'Devouring Blade':
    'Section=combat Note="Has increased Thirsting Blade effects"',
  'Eldritch Mind': // ref Tasha
    'Section=save ' +
    'Note="Has advantage on Constitution saves to maintain concentration"',
  'Eldritch Smite':
    'Section=combat Note="Can spend a spell slot upon a pact weapon hit to inflict +1d8 HP force plus +1d8 HP force per spell level and to inflict prone on a Huge or smaller target"',
  'Eldritch Spear':
    // changed effects
    'Section=magic ' +
    'Note="Increases the range of %{$\'features.Eldritch Spear\'>1?$\'features.Eldritch Spear\'+\' chosen ranged Warlock cantrips\':\'a chosen ranged Warlock cantrip\'} by %{30*levels.Warlock}\'"',
  'Fiendish Vigor':
    SRD5E.FEATURES['Fiendish Vigor']
    .replace('at will', 'at will, gaining the maximum possible temporary hit points'),
  'Gaze Of Two Minds':
    SRD5E.FEATURES['Gaze Of Two Minds']
    .replace('humanoid', "humanoid, and cast spells through it when within 60',"),
  'Gift Of The Depths':
    'Section=ability,magic ' +
    'Note=' +
      '"Has a %{speed}\' swim Speed and can breathe water",' +
      '"Can cast <i>Water Breathing</i> once per long rest" ' +
    'Spells="Water Breathing"',
  'Gift Of The Protectors': // ref Tasha
    'Section=magic ' +
    'Note="A creature who has written its name in the Book Of Shadows retains 1 hit point when reduced to 0 hit points once per long rest"',
  'Investment Of The Chain Master': // modified from Tasha
    'Section=magic ' +
    'Note="Familiar gains a 40\' fly or swim Speed, can inflict a choice of necrotic or radiant damage, and inflicts DC %{spellDifficultyClass.K} saves; self can use a bonus action to command it to attack and a reaction to give it resistance to damage"',
  'Lessons Of The First Ones':'Section=feature Note="+%V Origin Feat"',
  'Lifedrinker':
    'Section=combat ' +
    // changed effects
    'Note="Can inflict +1d6 HP of a choice of necrotic, psychic, or radiant with a pact weapon, plus expend a Hit Point Die to regain hit points, once per turn"',
  'Mask Of Many Faces':SRD5E.FEATURES['Mask Of Many Faces'],
  'Master Of Myriad Forms':SRD5E.FEATURES['Master Of Myriad Forms'],
  'Misty Visions':SRD5E.FEATURES['Misty Visions'],
  'One With Shadows':
    'Section=magic ' +
    // changed effects
    'Note="Can cast <i>Invisibility</i> on self in dim light at will" ' +
    'Spells=Invisibility',
  'Otherworldly Leap':SRD5E.FEATURES['Otherworldly Leap'],
  'Pact Of The Blade':
    'Section=magic ' +
    // changed effects
    'Note="Can use a bonus action to create a bonded simple or martial pact weapon or to bond with a touched magic weapon and gain proficiency with it; it can be used as a spellcasting focus, and its Charisma-based attacks inflict a choice of necrotic, psychic, radiant, or normal weapon damage; moving 5\' away from the weapon for 1 min ends the bond"',
  'Pact Of The Chain':
    SRD5E.FEATURES['Pact Of The Chain']
    .replace('as a ritual', 'without expending a spell slot'),
  'Pact Of The Tome':
    SRD5E.FEATURES['Pact Of The Tome']
   .replace('cantrips', 'cantrips and 2 chosen level 1 rituals'),
  'Repelling Blast':
    SRD5E.FEATURES['Repelling Blast']
    .replace('push', 'push on a Large or smaller target')
    .replace('<i>Eldritch Blast</i>', "attack using %{$$'features.Repelling Blast'>1?$$'features.Repelling Blast'+' chosen Warlock cantrips':'a chosen Warlock cantrip'}"),
  'Thirsting Blade':
    SRD5E.FEATURES['Thirsting Blade']
    .replace('2', '%{combatNotes.devouringBlade?3:2}'),
  'Visions Of Distant Realms':SRD5E.FEATURES['Visions Of Distant Realms'],
  'Whispers Of The Grave':SRD5E.FEATURES['Whispers Of The Grave'],
  'Witch Sight':
    // changed effects
    'Section=skill Note="Has 30\' Truesight"',
  // Fiend Patron
  "Dark One's Blessing":
    SRD5E.FEATURES["Dark One's Blessing"]
    .replace('temporary hit points', 'temporary hit points; others reducing a foe within 10\' to 0 hit points gives the same benefit'),
  'Fiend Spells':
    'Spells=' +
      '"3:Burning Hands","3:Command","3:Scorching Ray","3:Suggestion",' +
      '"5:Fireball","5:Stinking Cloud",' +
      '"7:Fire Shield","7:Wall Of Fire",' +
      '"9:Geas","9:Insect Plague"',
  "Dark One's Own Luck":
    SRD5E.FEATURES["Dark One's Own Luck"]
    .replace('once per short', "%{charismaModifier>1?charismaModifier+' times':'once'} per long"),
  'Fiendish Resilience':
    SRD5E.FEATURES['Fiendish Resilience']
    .replace('damage', 'non-force damage')
    .replace(' from anything other than magical or silver weapons', ''),
  'Hurl Through Hell':
    SRD5E.FEATURES['Hurl Through Hell']
    .replace('10d10', '8d10')
    .replace('fiends', 'save Charisma negates; fiends')
    .replace('long rest', 'long rest; can expend spell slots for additional uses'),

  // Wizard
  'Arcane Recovery':SRD5E.FEATURES['Arcane Recovery'],
  'Memorize Spell':
    'Section=magic ' +
    'Note="Can replace a prepared spell at the end of a short rest"',
  'Ritual Adept':
    'Section=magic ' +
    'Note="Can cast spells marked with [R] as rituals without preparation"',
  'Scholar':
    'Section=skill ' +
    'Note="+%{proficiencyBonus} in a choice of proficient Arcana, History, Investigation, Medicine, Nature, or Religion"',
  'Signature Spells':SRD5E.FEATURES['Signature Spells'],
  'Spell Mastery':
    SRD5E.FEATURES['Spell Mastery']
    .replace('the choices', 'one choice')
    .replace('8 hr or study', 'a long rest'),
  // Spellcasting as above
  'Wizard Subclass':SRD5E.FEATURES['Arcane Tradition'],
  // Evoker
  'Empowered Evocation':SRD5E.FEATURES['Empowered Evocation'],
  'Evocation Savant':
    'Section=magic ' +
    // changed effects
    'Note="Can copy %{spellSlots.W9?9:spellSlots.W8?8:spellSlots.W7?7:spellSlots.W6?6:spellSlots.W5?5:spellSlots.W4?4:spellSlots.W3?3:2} evocation spells into spellbook for free"',
  'Overchannel':SRD5E.FEATURES.Overchannel,
  'Potent Cantrip':
    SRD5E.FEATURES['Potent Cantrip']
    .replace('successful save', 'miss or successful save'),
  'Sculpt Spells':SRD5E.FEATURES['Sculpt Spells'],

  // Species
  'Small':
    'Section=combat Note="Has disadvantage on attacks with heavy weapons"',

  // Dragonborn
  'Breath Weapon':
    'Section=combat ' +
    // changed effects
    'Note="Choice of a 15\' cone or a 5\'x30\' line inflicts %{(level+7)//6}d10 HP %{breathWeaponEnergy} (save DC %{8+constitutionModifier+proficiencyBonus} Dexterity half) %{proficiencyBonus} times per long rest"',
  'Damage Resistance':
    'Section=save Note="Has resistance to %{breathWeaponEnergy}"',
  'Darkvision':'Section=feature Note="R%V\' Sees one light level better"',
  'Draconic Ancestry':'Section=feature Note="1 selection"',
  'Draconic Flight':
    'Section=ability ' +
    'Note="Can use a bonus action to gain a %{speed}\' fly Speed for 10 min once per long rest"',

  // Dwarf
  // Darkvision as above
  'Dwarven Resilience':
    SRD5E.FEATURES['Dwarven Resilience']
    .replace('poison', 'poisoned'),
  'Dwarven Toughness':SRD5E.FEATURES['Dwarven Toughness'],
  'Stonecunning':
    // changed effects
    'Section=skill ' +
    'Note="Can use a bonus action to gain 60\' Tremorsense for 10 min %{proficiencyBonus} times per long rest"',

  // Elf
  // Darkvision as above
  'Drow':
    'Section=feature,magic ' +
    'Note=' +
      '"Has increased Darkvision effects",' +
      '"Knows the <i>Dancing Lights</i> cantrip%{level>2?\' and can cast <i>Faerie Fire</i>\'+(level>4?\' and <i>Darkness</i>\':\'\')+\' once per long rest\':\'\'}" ' +
    'Spells="Dancing Lights","3:Faerie Fire","5:Darkness"',
  'Elf Spellcasting Ability':'Section=feature Note="1 selection"',
  'Elven Lineage':'Section=feature Note="1 selection"',
  'Fey Ancestry':
    // changed effects
    'Section=save Note="Has advantage vs. charmed"',
  'High Elf':
    'Section=magic ' +
    'Note=' +
      '"Knows the <i>Prestidigitation</i> cantrip%{level>2?\' and can cast <i>Detect Magic</i>\'+(level>4?\' and <i>Misty Step</i>\':\'\')+\' once per long rest\':\'\'}" ' +
    'Spells=Prestidigitation,"3:Detect Magic","5:Misty Step"',
  'Keen Senses':
    // changed effects
    'Section=skill ' +
    'Note="Skill Proficiency (Choose 1 from Insight, Perception, or Survival)"',
  'Trance':
    SRD5E.FEATURES.Trance
    .replace('8 hr sleep', 'a long rest'),
  'Wood Elf':
    'Section=Ability,magic ' +
    'Note=' +
      '"+5 Speed",' +
      '"Knows the <i>Druidcraft</i> cantrip%{level>2?\' and can cast <i>Longstrider</i>\'+(level>4?\' and <i>Pass Without Trace</i>\':\'\')+\' once per long rest\':\'\'}" ' +
    'Spells="Druidcraft","3:Longstrider","5:Pass Without Trace"',

  // Gnome
  // Darkvision as above
  'Forest Gnome':
    'Section=magic ' +
    'Note="Knows the <i>Minor Illusion</i> cantrip and can cast <i>Speak With Animals</i> %{proficiencyBonus} times per long rest" ' +
    'Spells="Minor Illusion","Speak With Animals"',
  'Gnomish Cunning':
    SRD5E.FEATURES['Gnome Cunning']
    .replace(' vs. magic', ''),
  'Gnomish Lineage':'Section=feature Note="1 selection"',
  'Rock Gnome':
    'Section=magic ' +
    'Note="Knows the <i>Mending</i> and <i>Prestidigitation</i> cantrips and can spend 10 min and use <i>Prestidigitation</i> to create a Tiny clockwork device that lasts 8 hr" ' +
    'Spells="Mending","Prestidigitation"',

  // Goliath
  'Cloud Giant':'Section=combat Note="Has the Cloud\'s Jaunt feature"',
  "Cloud's Jaunt":
    'Section=combat ' +
    'Note="Can use a bonus action to teleport 30\' %{proficiencyBonus} times per long rest"',
  'Fire Giant':'Section=combat Note="Has the Fire\'s Burn feature"',
  "Fire's Burn":
    'Section=combat ' +
    'Note="Can inflict +1d10 HP fire with an attack %{proficiencyBonus} times per long rest"',
  'Frost Giant':'Section=combat Note="Has the Frost\'s Chill feature"',
  "Frost's Chill":
    'Section=combat ' +
    'Note="Can inflict +1d6 HP cold and -10 Speed until the start of the next turn with an attack %{proficiencyBonus} times per long rest"',
  'Giant Ancestry':'Section=feature Note="1 selection"',
  'Hill Giant':'Section=combat Note="Has the Hill\'s Tumble feature"',
  "Hill's Tumble":
    'Section=combat ' +
    'Note="Can inflict prone on a Large or smaller target with an attack %{proficiencyBonus} times per long rest"',
  'Large Form':
    'Section=ability ' +
    'Note="Can use a bonus action to become Large for 10 min, gaining advantage on Strength checks and +10 Speed, once per long rest"',
  'Powerful Build':
    'Section=ability,combat ' +
    'Note=' +
      '"x2 Carry/x2 Lift",' +
      '"Has advantage on checks to break a grapple"',
  'Stone Giant':'Section=combat Note="Has the Stone\'s Endurance feature"',
  "Stone's Endurance":
    'Section=combat ' +
    'Note="Can use a reaction to reduce damage taken by 1d12+%{constitutionModifier} HP %{proficiencyBonus} times per long rest"',
  'Storm Giant':'Section=combat Note="Has the Storm\'s Thunder feature"',
  "Storm's Thunder":
    'Section=combat ' +
    'Note="Can use a reaction in response to damage from a foe within 60\' to inflict 1d8 HP thunder on it %{proficiencyBonus} times per long rest"',

  // Halfling
  'Brave':SRD5E.FEATURES.Brave,
  'Halfling Nimbleness':SRD5E.FEATURES['Halfling Nimbleness'],
  'Luck':SRD5E.FEATURES['Lucky (Halfling)'],
  'Naturally Stealthy':SRD5E.FEATURES['Naturally Stealthy'],

  // Human
  'Resourceful':
    'Section=feature Note="Gains Heroic Inspiration at the end of a long rest"',
  'Skillful':'Section=skill Note="Skill Proficiency (Choose 1 from any)"',
  'Versatile':'Section=feature Note="+1 Origin Feat"',

  // Orc
  'Adrenaline Rush':
    'Section=combat ' +
    'Note="Can use a bonus action to Dash and gain %{proficiencyBonus} temporary hit points %{proficiencyBonus} times per short rest"',
  // Darkvision as above
  'Relentless Endurance':SRD5E.FEATURES['Relentless Endurance'],

  // Tiefling
  'Abyssal':
    'Section=magic,save ' +
    'Note=' +
      '"Knows the <i>Poison Spray</i> cantrip%{level>2?\' and can cast <i>Ray Of Sickness</i>\'+(level>4?\' and <i>Hold Person</i>\':\'\')+\' once per long rest\':\'\'}",' +
      '"Has resistance to poison" ' +
    'Spells="Poison Spray","3:Ray Of Sickness","5:Hold Person"',
  'Chthonic':
    'Section=magic,save ' +
    'Note=' +
      '"Knows the <i>Chill Touch</i> cantrip%{level>2?\' and can cast <i>False Life</i>\'+(level>4?\' and <i>Ray Of Enfeeblement</i>\':\'\')+\' once per long rest\':\'\'}",' +
      '"Has resistance to necrotic" ' +
    'Spells="Chill Touch","3:False Life","5:Ray Of Enfeeblement"',
  // Darkvision as above
  'Fiendish Legacy':'Section=feature Note="1 selection"',
  'Infernal':
    'Section=magic,save ' +
    'Note=' +
      '"Knows the <i>Fire Bolt</i> cantrip%{level>2?\' and can cast <i>Hellish Rebuke</i>\'+(level>4?\' and <i>Darkness</i>\':\'\')+\' once per long rest\':\'\'}",' +
      '"Has resistance to fire" ' +
    'Spells="Fire Bolt","3:Hellish Rebuke","5:Darkness"',
  'Otherworldly Presence':
    'Section=magic ' +
    'Note="Knows the <i>Thaumaturgy</i> cantrip" ' +
    'Spells=Thaumaturgy',

  // Feats
  'Alert':
    'Section=combat,combat ' +
    'Note=' +
      '"+%{proficiencyBonus} Initiative",' +
      '"Can swap initiatives with a willing ally"',
  'Magic Initiate (Cleric)': // ref PHB5E
    'Section=magic ' +
    'Note="Knows 2 Cleric cantrips and can cast a chosen C1 spell once per long rest"',
  'Magic Initiate (Druid)': // ref PHB5E
    'Section=magic ' +
    'Note="Knows 2 Druid cantrips and can cast a chosen D1 spell once per long rest"',
  'Magic Initiate (Wizard)': // ref PHB5E
    'Section=magic ' +
    'Note="Knows 2 Wizard cantrips and can cast a chosen W1 spell once per long rest"',
  'Savage Attacker':
    'Section=combat Note="Can use the better of 2 damage rolls once per turn"',
  'Skilled':
    'Section=skill ' +
    'Note="Skill Proficiency or Tool Proficiency (Choose %V from any)"',
  'Ability Score Improvement':SRD5E.FEATURES['Ability Score Improvement'],
  'Grappler':
    // changed effects
    'Section=ability,combat ' +
    'Note=' +
      '"Ability Boost (Choose 1 from Strength, Dexterity)",' +
      '"Can both Damage and Grapple with an unarmed strike once per turn, has advantage on attacks on a grappled foe, and can move at full speed with a grappled foe of %{size} size or smaller"',
  'Archery':SRD5E.FEATURES['Fighting Style (Archery)'],
  'Defense':SRD5E.FEATURES['Fighting Style (Defense)'],
  'Great Weapon Fighting':
    // changed effects
    'Section=combat ' +
    'Note="Can treat 1s and 2s as 3s on two-handed weapon damage"',
  'Two-Weapon Fighting':SRD5E.FEATURES['Fighting Style (Two-Weapon Fighting)'],
  'Boon Of Combat Prowess':
    'Section=ability,combat ' +
    'Note=' +
      '"Ability Boost (Choose 1 from any)",' +
      '"Can treat an attack miss as a hit once per turn"',
  'Boon Of Dimensional Travel':
    'Section=ability,combat ' +
    'Note=' +
      '"Ability Boost (Choose 1 from any)",' +
      '"Can teleport 30\' after attacking or casting"',
  'Boon Of Fate':
    'Section=ability,combat ' +
    'Note=' +
      '"Ability Boost (Choose 1 from any)",' +
      '"R60\' Can modify a d20 roll by 2d4 once per initiative or rest"',
  'Boon Of Irresistible Offense (Dexterity)':
    'Section=ability,combat ' +
    'Note=' +
      '"Ability Boost (Dexterity)",' +
      '"Bludgeoning, piercing, and slashing damage ignores resistance, and natural 20 hits inflict +%{dexterity} damage"',
  'Boon Of Irresistible Offense (Strength)':
    'Section=ability,combat ' +
    'Note=' +
      '"Ability Boost (Strength)",' +
      '"Bludgeoning, piercing, and slashing damage ignores resistance, and natural 20 hits inflict +%{strength} damage"',
  'Boon Of Spell Recall':
    'Section=ability,magic ' +
    'Note=' +
      '"Ability Boost (Choose 1 from Intelligence, Wisdom, Charisma)",' +
      '"Casting a level 1-4 spell does not use a spell slot if a d4 roll equals the spell level"',
  'Boon Of The Night Spirit':
    'Section=ability,combat,save ' +
    'Note=' +
      '"Ability Boost (Choose 1 from any)",' +
      '"Can use a bonus action to become invisible in dim or no light; taking an action, bonus action, or reaction ends",' +
      '"In dim or no light, has resistance to all damage other than psychic and radiant"',
  'Boon Of Truesight':
    'Section=ability,skill ' +
    'Note=' +
      '"Ability Boost (Choose 1 from any)",' +
      '"Has 60\' Truesight"',

  // Sanity, Validation and Miscellaneous
  'Bulky Armor':SRD5E.FEATURES['Bulky Armor']

};
SRD5E2024.GOODIES = Object.assign({}, SRD5E.GOODIES);
SRD5E2024.LANGUAGES = {
  // Standard
  'Common':'',
  'Common Sign Language':'',
  'Draconic':'',
  'Dwarvish':'',
  'Elvish':'',
  'Giant':'',
  'Gnomish':'',
  'Goblin':'',
  'Halfling':'',
  'Orc':'',
  // Rare
  'Abyssal':'',
  'Celestial':'',
  'Deep Speech':'',
  'Druidic':'',
  'Infernal':'',
  'Primordial':'',
  'Sylvan':'',
  "Thieves' Cant":'',
  'Undercommon':''
};
SRD5E2024.SPECIES = {
  'Dragonborn':
    'Size=Medium ' +
    'Speed=30 ' +
    'Features=' +
      '"1:Draconic Ancestry","1:Breath Weapon","1:Damage Resistance",' +
      '"1:Darkvision","5:Draconic Flight" ' +
    'Selectables=' +
      '"1:Black Dragon:Draconic Ancestry",' +
      '"1:Blue Dragon:Draconic Ancestry",' +
      '"1:Brass Dragon:Draconic Ancestry",' +
      '"1:Bronze Dragon:Draconic Ancestry",'+
      '"1:Copper Dragon:Draconic Ancestry",' +
      '"1:Gold Dragon:Draconic Ancestry",' +
      '"1:Green Dragon:Draconic Ancestry",' +
      '"1:Red Dragon:Draconic Ancestry",' +
      '"1:Silver Dragon:Draconic Ancestry",' +
      '"1:White Dragon:Draconic Ancestry"',
  'Dwarf':
    'Size=Medium ' +
    'Speed=30 ' +
    'Features=' +
      '"1:Darkvision","1:Dwarven Resilience","1:Dwarven Toughness",' +
      '"1:Stonecunning"',
  'Elf':
    'Size=Medium ' +
    'Speed=30 ' +
    'Features=' +
      '"1:Darkvision","1:Elf Spellcasting Ability","1:Elven Lineage",' +
      '"1:Fey Ancestry","1:Keen Senses","1:Trance" ' +
    'Selectables=' +
      '"1:Charisma:Elf Spellcasting Ability",' +
      '"1:Intelligence:Elf Spellcasting Ability",' +
      '"1:Wisdom:Elf Spellcasting Ability",' +
      '"1:Drow:Elven Lineage",' +
      '"1:High Elf:Elven Lineage",' +
      '"1:Wood Elf:Elven Lineage"',
  'Gnome':
    'Size=Small ' +
    'Speed=30 ' +
    'Features=' +
      '"1:Darkvision","1:Gnome Spellcasting Ability","1:Gnomish Cunning",' +
      '"1:Gnomish Lineage" ' +
    'Selectables=' +
      '"1:Charisma:Gnome Spellcasting Ability",' +
      '"1:Intelligence:Gnome Spellcasting Ability",' +
      '"1:Wisdom:Gnome Spellcasting Ability",' +
      '"1:Forest Gnome:Gnomish Lineage",' +
      '"1:Rock Gnome:Gnomish Lineage"',
  'Goliath':
    'Size=Medium ' +
    'Speed=35 ' +
    'Features=' +
      '"1:Giant Ancestry","1:Powerful Build","5:Large Form" ' +
    'Selectables=' +
      '"1:Cloud Giant:Giant Ancestry",' +
      '"1:Fire Giant:Giant Ancestry",' +
      '"1:Frost Giant:Giant Ancestry",' +
      '"1:Hill Giant:Giant Ancestry",' +
      '"1:Stone Giant:Giant Ancestry",' +
      '"1:Storm Giant:Giant Ancestry"',
  'Halfling':
    'Size=Small ' +
    'Speed=30 ' +
    'Features=' +
      '"1:Brave","1:Halfling Nimbleness","1:Luck","1:Naturally Stealthy"',
  'Human':
    'Size=Medium ' +
    'Speed=30 ' +
    'Features=' +
      '"1:Resourceful","1:Skillful","1:Versatile"',
  'Orc':
    'Size=Medium ' +
    'Speed=30 ' +
    'Features=' +
      '"1:Adrenaline Rush","1:Darkvision","1:Relentless Endurance"',
  'Tiefling':
    'Size=Medium ' +
    'Speed=30 ' +
    'Features=' +
      '"1:Darkvision","1:Fiendish Legacy","1:Otherworldly Presence",' +
      '"1:Tiefling Spellcasting Ability" ' +
    'Selectables=' +
      '"1:Charisma:Tiefling Spellcasting Ability",' +
      '"1:Intelligence:Tiefling Spellcasting Ability",' +
      '"1:Wisdom:Tiefling Spellcasting Ability",' +
      '"1:Abyssal:Fiendish Legacy",' +
      '"1:Chthonic:Fiendish Legacy",' +
      '"1:Infernal:Fiendish Legacy"'
};
SRD5E2024.SCHOOLS = Object.assign({}, SRD5E.SCHOOLS);
SRD5E2024.SHIELDS = Object.assign({}, SRD5E.SHIELDS);
SRD5E2024.SKILLS = Object.assign({}, SRD5E.SKILLS);
// Note that spellRules replaces lvl and mdf in the spell descriptions with the
// appropriate caster level and ability modifier.
SRD5E2024.SPELLS = {

  'Acid Arrow':SRD5E.SPELLS['Acid Arrow'],
  'Acid Splash':
    SRD5E.SPELLS['Acid Splash']
    .replace('Conjuration', 'Evocation')
    .replace('on a single target or 2 adjacent targets', 'in a 5\' radius'),
  'Aid':
    SRD5E.SPELLS.Aid
    .replace('C2,P2', 'B2,C2,D2,P2,R2'),
  'Alarm':SRD5E.SPELLS.Alarm,
  'Alter Self':
    SRD5E.SPELLS['Alter Self']
    .replace('magic natural', 'natural')
    .replaceAll('strengthModifier+1', 'mdf'),
  'Animal Friendship':
    SRD5E.SPELLS['Animal Friendship'] + ' ' +
    'Description=' +
      '"R30\' Charms a target beast (save Wisdom negates) for 24 hr or until harmed"',
  'Animal Messenger':
    SRD5E.SPELLS['Animal Messenger']
    .replace('recipient', 'recipient (save Charisma negates; CR greater than 0 automatically succeeds)'),
  'Animal Shapes':
    SRD5E.SPELLS['Animal Shapes'] + ' ' +
    'Description=' +
      '"R30\' Willing targets become CR 4, Large or smaller beasts, gaining temporary hit points appropriate to the beasts, for 24 hr or until ended by each target"',
  'Animate Dead':SRD5E.SPELLS['Animate Dead'],
  'Animate Objects':
    SRD5E.SPELLS['Animate Objects']
    .replace(/10 Tiny.*objects/, '%{mdf} Medium (10 hit points; Armor Class 15; +%{mdf} attack inflicts 1d4+3 force), %{mdf//2} Large (20 hit points; Armor Class 15; +%{mdf} attack inflicts 2d6+%{mdf+3} HP), or %{mdf//3} Huge (40 hit points, Armor Class 15; +%{mdf} attack inflicts 2d12+%{mdf+3} HP) objects') + ' ' +
    'AtHigherLevels=' +
      '"Medium objects inflict +1d4 HP, Large +1d6 HP, or Huge +1d12 HP"',
  'Antilife Shell':SRD5E.SPELLS['Antilife Shell'],
  'Antimagic Field':SRD5E.SPELLS['Antimagic Field'],
  'Antipathy/Sympathy':
    SRD5E.SPELLS['Antipathy/Sympathy']
    .replace('D8,W8', 'B8,D8,W8')
    .replace(/, object.*repels or attracts/, ' or object charms or frightens')
    .replaceAll('within 60', 'within 120'),
  'Arcane Eye':SRD5E.SPELLS['Arcane Eye'],
  'Arcane Hand':
    SRD5E.SPELLS['Arcane Hand']
    .replace('W5', 'S5,W5')
    .replace('; Strength 26; Dexterity 10', '')
    .replace('4d8', '5d8')
    .replace('DC 26 Athletics', 'Strength')
    .replace('inflicting 2d6', 'inflicting 4d6'),
  'Arcane Lock':SRD5E.SPELLS['Arcane Lock'],
  'Arcane Sword':
    SRD5E.SPELLS['Arcane Sword']
    .replace("60'", "90'")
    .replace('3d10', '4d12+%{mdf}')
    .replace('20', '30'),
  "Arcanist's Magic Aura":SRD5E.SPELLS["Arcanist's Magic Aura"],
  'Astral Projection':SRD5E.SPELLS['Astral Projection'],
  'Augury':
    SRD5E.SPELLS.Augury
    .replace('C2', 'C2,D2,W2'),
  'Aura Of Life': // ref PHB5E
    'School=Abjuration ' +
    'Level=C4,P4 ' +
    'Description=' +
      '"30\' radius gives allies resistance to necrotic damage and immunity to maximum hit point reduction, and raises those with 0 hit points to 1 hit point, for concentration up to 10 min"',
  'Awaken':SRD5E.SPELLS.Awaken,

  'Bane':
    SRD5E.SPELLS.Bane
    .replace('B1,C1', 'B1,C1,K1'),
  'Banishment':
    SRD5E.SPELLS.Banishment
    .replace("60'", "30'"),
  'Barkskin':
    SRD5E.SPELLS.Barkskin
    .replace('16', '17')
    .replace('concentration up to ', ''),
  'Beacon Of Hope':SRD5E.SPELLS['Beacon Of Hope'],
  'Befuddlement': // new
    'School=Enchantment ' +
    'Level=B8,D8,K8,W8 ' +
    'Description=' +
      '"R150\' Target suffers 10d6 HP psychic and loss of spells and Magic actions (save Intelligence half HP only; additional saves every 30 days end)"',
  'Bestow Curse':
    SRD5E.SPELLS['Bestow Curse']
    .replace('any action', 'any action other than Dodge'),
  'Black Tentacles':
    SRD5E.SPELLS['Black Tentacles']
    .replace('Dexterity', 'Strength')
    .replace('Strength or Dexterity', 'Athletics'),
  'Blade Barrier':
    SRD5E.SPELLS['Blade Barrier']
    .replace('slashing', 'force'),
  'Bless':SRD5E.SPELLS.Bless,
  'Blight':
    SRD5E.SPELLS.Blight
    .replace(/has disadvantage.*failure/, 'automatically fails'),
  'Blindness/Deafness':
    SRD5E.SPELLS['Blindness/Deafness']
    .replace('Necromancy', 'Transmutation')
    .replace("30'", "120'"),
  'Blink':SRD5E.SPELLS.Blink,
  'Blur':SRD5E.SPELLS.Blur,
  // Branding Smite deleted
  'Burning Hands':SRD5E.SPELLS['Burning Hands'],

  'Call Lightning':SRD5E.SPELLS['Call Lightning'],
  'Calm Emotions':SRD5E.SPELLS['Calm Emotions'],
  'Chain Lightning':SRD5E.SPELLS['Chain Lightning'],
  'Charm Monster': // new
    SRD5E.SPELLS['Charm Person']
    .replace('B1,D1,K1,S1,W1', 'B4,D4,K4,S4,W4')
    .replace('humanoid ', ''),
  'Charm Person':SRD5E.SPELLS['Charm Person'],
  'Chill Touch':
    SRD5E.SPELLS['Chill Touch']
    .replace("R120' Ranged spell", 'Touch')
    .replace('d8', 'd10')
    .replace('start', 'end')
    .replace(/;[^"]*/, ''),
  'Chromatic Orb': // ref PHB5E
    'School=Evocation ' +
    'Level=S1,W1 ' +
    'AtHigherLevels="inflicts +1d8 HP and can leap +1 times" ' +
    'Description=' +
      '"R90\' Ranged spell inflicts 3d8 HP of a choice of acid, cold, fire, lightning, poison, or thunder; rolling the same number on 2 damage dice indicates that the spell leaps to attack another target within 30\' of the first"',
  'Circle Of Death':
    SRD5E.SPELLS['Circle Of Death']
    .replaceAll('d6', 'd8'),
  'Clairvoyance':SRD5E.SPELLS.Clairvoyance,
  'Clone':SRD5E.SPELLS.Clone,
  'Cloudkill':SRD5E.SPELLS.Cloudkill,
  'Color Spray': // changed
    'School=Illusion ' +
    'Level=B1,S1,W1 ' +
    'Description="15\' cone blinds (save Constitution negates) until the end of the next turn"',
  'Command':
    SRD5E.SPELLS.Command
    .replace('C1,"K1 [The Fiend]",P1', 'B1,C1,"K1 [The Fiend]",P1'),
  'Commune':SRD5E.SPELLS.Commune,
  'Commune With Nature':SRD5E.SPELLS['Commune With Nature'],
  'Comprehend Languages':SRD5E.SPELLS['Comprehend Languages'],
  'Compulsion':SRD5E.SPELLS.Compulsion,
  'Cone Of Cold':
    SRD5E.SPELLS['Cone Of Cold']
    .replace('S5,W5', 'D5,S5,W5'),
  'Confusion':
    SRD5E.SPELLS.Confusion
    .replace('reactions', 'reactions and bonus actions'),
  'Conjure Animals':
    SRD5E.SPELLS['Conjure Animals'] + ' ' +
    'AtHigherLevels="inflicts +1d10 HP" ' +
    'Description=' +
      '"R60\' 10\' radius inflicts 3d10 HP slashing (save Dexterity negates), and 5\' radius gives self advantage on Strength saves, for concentration up to 10 min; can be moved 30\' each turn"',
  'Conjure Celestial':
    SRD5E.SPELLS['Conjure Celestial'] + ' ' +
    'AtHigherLevels="restores or inflicts +1d12 hit points" ' +
    'Description=' +
       '"R90\' 10\' radius either restores 4d12+%{mdf} hit points or inflicts 6d12 HP radiant (save Dexterity half) on each target for concentration up to 10 min; can be moved 30\' each turn"',
  'Conjure Elemental':
    SRD5E.SPELLS['Conjure Elemental'] + ' ' +
    'AtHigherLevels="inflicts +1d8 HP" ' +
    'Description=' +
       '"R60\' 5\' radius restrains a target and inflicts 8d8 HP of a choice of lightning, thunder, fire, or cold (save Dexterity negates), inflicting an additional 4d8 HP each rd until a successful Dexterity save, for concentration up to 10 min"',
  'Conjure Fey':
    SRD5E.SPELLS['Conjure Fey'] + ' ' +
    'Level=D6 ' +
    'AtHigherLevels="inflicts +1d12 HP" ' +
    'Description=' +
      '"R60\' Melee spell attacks by a summoned spirit inflict 3d12+%{mdf} HP psychic and frightened until the start of the next turn for concentration up to 10 min; can be moved 30\' each turn as a bonus action"',
  'Conjure Minor Elementals':
    SRD5E.SPELLS['Conjure Minor Elementals'] + ' ' +
    'AtHigherLevels="inflicts +1d8 HP" ' +
    'Description=' +
      '"Self attacks within 15\' inflict +2d8 HP of a choice of acid, cold, fire, or lightning for concentration up to 10 min"',
  'Conjure Woodland Beings':
    SRD5E.SPELLS['Conjure Woodland Beings'] + ' ' +
    'AtHigherLevels="inflicts +1d8 HP" ' +
    'Description=' +
      '"10\' emanation inflicts 5d8 HP force (save Wisdom half) and allows self to use a bonus action to Disengage for concentration up to 10 min"',
  'Contact Other Plane':
    SRD5E.SPELLS['Contact Other Plane']
    .replace('insanity', 'incapacitated'),
  'Contagion':
    SRD5E.SPELLS.Contagion + ' ' +
    'Description=' +
      '"Touch inflicts 11d8 HP necrotic, poisoned, and disadvantage on chosen ability saves (save Constitution negates; subsequent saves each turn either end after three successes or extend to 7 days after 3 failures; other effects that would end poisoned require a successful Constitution save to succeed)"',
  'Contingency':
    SRD5E.SPELLS.Contingency
    .replace('Evocation', 'Abjuration'),
  'Continual Flame':
    SRD5E.SPELLS['Continual Flame']
    .replace('C2,W2', 'C2,D2,W2'),
  'Control Water':SRD5E.SPELLS['Control Water'],
  'Control Weather':SRD5E.SPELLS['Control Weather'],
  'Counterspell':
    SRD5E.SPELLS.Counterspell + ' ' +
    'AtHigherLevels="" ' +
    'Description="R60\' Negates foe casting (save Constitution negates)"',
  'Create Food And Water':SRD5E.SPELLS['Create Food And Water'],
  'Create Or Destroy Water':SRD5E.SPELLS['Create Or Destroy Water'],
  'Create Undead':SRD5E.SPELLS['Create Undead'],
  'Creation':
    SRD5E.SPELLS.Creation
    .replace('1 day', '24 hr'),
  'Cure Wounds':
    SRD5E.SPELLS['Cure Wounds']
    .replace('Evocation', 'Abjuration')
    .replaceAll('1d8', '2d8'),

  'Dancing Lights':SRD5E.SPELLS['Dancing Lights'],
  'Darkness':SRD5E.SPELLS.Darkness,
  'Darkvision':
    SRD5E.SPELLS.Darkvision
    .replace("60'", "150'"),
  'Daylight':SRD5E.SPELLS.Daylight,
  'Death Ward':SRD5E.SPELLS['Death Ward'],
  'Delayed Blast Fireball':SRD5E.SPELLS['Delayed Blast Fireball'],
  'Demiplane':
    SRD5E.SPELLS.Demiplane
    .replace('K8,W8', 'K8,S8,W8'),
  'Detect Evil And Good':
    SRD5E.SPELLS['Detect Evil And Good']
    .replace('consecration, and desecration', 'and <i>Hallow</i> effects')
    .replace("3' of wood or dirt, 1' of", "1' of wood, dirt, or"),
  'Detect Magic':
    SRD5E.SPELLS['Detect Magic']
    .replace('B1,C1,D1,P1,R1,S1,W1','B1,C1,D1,K1,P1,R1,S1,W1')
    .replace("3' of wood or dirt, 1' of", "1' of wood, dirt, or"),
  'Detect Poison And Disease':
    SRD5E.SPELLS['Detect Poison And Disease']
    .replace('diseases', 'magical contagions')
    .replace("3' of wood or dirt, 1' of", "1' of wood, dirt, or"),
  'Detect Thoughts':
    SRD5E.SPELLS['Detect Thoughts']
    .replace('contested Intelligence attempts', 'Arcana checks')
    .replace("2' of rock, 2", "1' of stone, dirt, or wood, 1"),
  'Dimension Door':SRD5E.SPELLS['Dimension Door'],
  'Disguise Self':SRD5E.SPELLS['Disguise Self'],
  'Disintegrate':SRD5E.SPELLS.Disintegrate,
  'Dispel Evil And Good':SRD5E.SPELLS['Dispel Evil And Good'],
  'Dispel Magic':
    SRD5E.SPELLS['Dispel Magic']
    .replace('B3,C3,D3,K3,P3,S3,W3', 'B3,C3,D3,K3,P3,R3,S3,W3'),
  'Dissonant Whispers': // ref PHB5E
    'School=Enchantment ' +
    'Level=B1 ' +
    'AtHigherLevels="inflicts +1d6 HP" ' +
    'Description=' +
      '"R60\' Inflicts 3d6 HP psychic and forces the target to use its reaction to flee (save Wisdom half HP only)"',
  'Divination':
    SRD5E.SPELLS.Divination
    .replace('C4', 'C4,D4,W4'),
  'Divine Favor':
    SRD5E.SPELLS['Divine Favor']
    .replace('Evocation', 'Transmutation')
    .replace('concentration up to ', ''),
  'Divine Smite': // new
    'School=Evocation ' +
    'Level=P1 ' +
    'AtHigherLevels="inflicts +1d8 HP" ' +
    'Description="Cast as a bonus action after hitting a target, causes the attack inflict +2d8 HP radiant, or +3d8 HP radiant on a fiend or undead"',
  'Divine Word':SRD5E.SPELLS['Divine Word'],
  'Dominate Beast':
    SRD5E.SPELLS['Dominate Beast']
    .replace('D4,S4', 'D4,R4,S4'),
  'Dominate Monster':SRD5E.SPELLS['Dominate Monster'],
  'Dominate Person':SRD5E.SPELLS['Dominate Person'],
  "Dragon's Breath": // new
    'School=Transmutation ' +
    'Level=S2,W2 ' +
    'AtHigherLevels="inflicts +1d6 HP" ' +
    'Description="Touched can use a Magic action to inflict 3d6 HP of a choice of acid, cold, fire, lightning, or poison (save Dexterity half) in a 15\' cone for concentration up to 1 min"',
  'Dream':SRD5E.SPELLS.Dream,
  'Druidcraft':SRD5E.SPELLS.Druidcraft,

  'Earthquake':
    SRD5E.SPELLS.Earthquake
    .replace('Evocation', 'Transmutation')
    .replace('Constitution', 'Dexterity'),
  'Eldritch Blast':
    SRD5E.SPELLS['Eldritch Blast']
    .replace('300', '120'),
  'Elementalism': // new
    'School=Transmutation ' +
    'Level=D0,S0,W0 ' +
    'Description="R30\' Moves air or dust in a 5\' cube, creates smoke or mist in a 5\' cube for 1 min, or sculpts a 1\' cube of dirt, sand, fire, smoke, mist, or water for 1 hr"',
  'Enhance Ability':
    SRD5E.SPELLS['Enhance Ability']
    .replace('B2,C2,D2,S2', 'B2,C2,D2,R2,S2,W2')
    .replace(/; Constitution[^"]*/, ''),
  'Enlarge/Reduce':
    SRD5E.SPELLS['Enlarge/Reduce']
    .replace('S2,W2', 'B2,D2,S2,W2')
    .replaceAll('weapon', 'weapon and unarmed'),
  'Ensnaring Strike': // ref PHB5E
    'School=Conjuration ' +
    'Level=R1 ' +
    'AtHigherLevels="inflicts +1d6 HP" ' +
    'Description=' +
      '"Cast as a bonus action after hitting a target, restrains the foe (save Strength negates; Large creatures have advantage on the save) and inflicts 1d6 HP per rd piercing (save Athletics each rd end) for concentration up to 1 min"',
  'Entangle':
    SRD5E.SPELLS.Entangle
    .replace('D1', 'D1,R1')
    .replace('additional', 'additional Athletics'),
  'Enthrall':
    SRD5E.SPELLS.Enthrall + ' ' +
    'Description=' +
      '"R60\' Target suffers -10 Perception (save Wisdom negates; targets in battle automatically succeed) for concentration up to 1 min"',
  'Etherealness':
    SRD5E.SPELLS.Etherealness
    .replace('Transmutation', 'Conjuration'),
  'Expeditious Retreat':SRD5E.SPELLS['Expeditious Retreat'],
  'Eyebite':
    SRD5E.SPELLS.Eyebite
    .replace('sickened (disadvantage on attack and ability rolls)', 'poisoned'),

  'Fabricate':SRD5E.SPELLS.Fabricate,
  'Faerie Fire':SRD5E.SPELLS['Faerie Fire'],
  'Faithful Hound':
    SRD5E.SPELLS['Faithful Hound']
    .replace('%{mdf+proficiencyBonus} ', '')
    .replace(/ with a.*inflicts/, ', inflicting')
    .replace('HP piercing', 'HP force (Dexterity negates)'),
  'False Life':
    SRD5E.SPELLS['False Life']
    .replace('1d4', '2d4')
    .replace(' for 1 hr', ''),
  'Fear':SRD5E.SPELLS.Fear,
  'Feather Fall':SRD5E.SPELLS['Feather Fall'],
  // Feeblemind deleted
  'Find Familiar':SRD5E.SPELLS['Find Familiar'],
  'Find Steed':
    SRD5E.SPELLS['Find Steed']
    .replace('can understand at least 1 language', "Armor Class 12, 25 hit points, and 60' Speed, regains an equal number of hit points from magical healing applied to self when within 5', makes a +%{mdf} attack that inflicts 1d8+2 HP of radiant, psychic, or necrotic, depending on spirit type, can use a bonus action to frighten within 60', teleport 60', or heal 2d8+2 hit points within 5', depending on spirit type") + ' ' +
    'AtHigherLevels="increases the Armor Class by 1, hit points by 10, damage by 1, and healing by 1; level 4 also gives a 60\' fly Speed"',
  'Find The Path':SRD5E.SPELLS['Find The Path'],
  'Find Traps':SRD5E.SPELLS['Find Traps'],
  'Finger Of Death':SRD5E.SPELLS['Finger Of Death'],
  'Fireball':SRD5E.SPELLS.Fireball,
  'Fire Bolt':SRD5E.SPELLS['Fire Bolt'],
  'Fire Shield':
    SRD5E.SPELLS['Fire Shield']
    .replace('"K4 [The Fiend]",W4','D4,"K4 [The Fiend]",S4,W4'),
  'Fire Storm':SRD5E.SPELLS['Fire Storm'],
  'Flame Blade':
    SRD5E.SPELLS['Flame Blade']
    .replace('D2', 'D2,S2')
    .replace('3d6', '3d6+%{mdf}')
    .replace(' per 2 levels', ''),
  'Flame Strike':
    SRD5E.SPELLS['Flame Strike']
    .replaceAll('4d6', '5d6')
    .replace('of a choice of fire or radiant', 'fire and radiant'),
  'Flaming Sphere':
    SRD5E.SPELLS['Flaming Sphere']
    .replace('D2,W2', 'D2,S2,W2'),
  'Flesh To Stone':
    SRD5E.SPELLS['Flesh To Stone']
    .replace('K6,W6', 'D6,S6,W6'),
  'Floating Disk':SRD5E.SPELLS['Floating Disk'],
  'Fly':SRD5E.SPELLS.Fly,
  'Fog Cloud':SRD5E.SPELLS['Fog Cloud'],
  'Forbiddance':
    SRD5E.SPELLS.Forbiddance
    .replace('celestials', 'aberrations, celestials'),
  'Forcecage':
    SRD5E.SPELLS.Forcecage
    .replace('1 hr', 'concentration up to 1 hr'),
  'Foresight':
    SRD5E.SPELLS.Foresight
    .replace('immunity to surprise and ', ''),
  'Freedom Of Movement':
    SRD5E.SPELLS['Freedom Of Movement']
    .replace('and can', "and a %{speed}' swim Speed and can") + ' ' +
    'AtHigherLevels="affects +1 target"',
  'Freezing Sphere':
    SRD5E.SPELLS['Freezing Sphere']
    .replace('W6', 'S6,W6'),

  'Gaseous Form':
    SRD5E.SPELLS['Gaseous Form']
    .replace('nonmagical damage', 'bludgeoning, piercing, and slashing') + ' ' +
    'AtHigherLevels="affects +1 target"',
  'Gate':
    SRD5E.SPELLS.Gate
    .replace('C9,S9,W9', 'C9,K9,S9,W9'),
  'Geas':
    SRD5E.SPELLS.Geas
    .replace('1 year', '365 days'),
  'Gentle Repose':
    SRD5E.SPELLS['Gentle Repose']
    .replace('C2,W2', 'C2,P2,W2'),
  'Giant Insect':
    SRD5E.SPELLS['Giant Insect']
    .replace('Transmutation', 'Conjuration') + ' ' +
    'AtHigherLevels="increases the Armor Class by 1, hit points by 10, number of attacks by 1 per 2 levels, piercing damage by 1, and spider\'s bludgeoning damage by 1" ' +
    'Description=' +
      '"R60\' Summons a choice of an obedient giant centipede, spider, or wasp for concentration up to 10 min; it has Armor Class 15, 30 hit points, a 40\' Speed, understanding of self languages, and 2 +%{mdf} attacks per rd that inflict 1d6+7 HP piercing and 1d4 HP poison; centipedes also have a R10\' attack that inflicts poisoned for 1 rd, spiders a range 60\' attack that inflicts 1d10+7 bludgeoning and loss of movement for 1 rd, and wasps a 40\' fly Speed"',
  'Glibness':
    SRD5E.SPELLS.Glibness
    .replace('Transmutation', 'Enchantment'),
  'Globe Of Invulnerability':SRD5E.SPELLS['Globe Of Invulnerability'],
  'Glyph Of Warding':SRD5E.SPELLS['Glyph Of Warding'],
  'Goodberry':
    SRD5E.SPELLS.Goodberry
    .replace('Transmutation', 'Conjuration'),
  'Grease':
    SRD5E.SPELLS.Grease
    .replace('W1', 'S1,W1'),
  'Greater Invisibility':SRD5E.SPELLS['Greater Invisibility'],
  'Greater Restoration':
    SRD5E.SPELLS['Greater Restoration']
    .replace('B5,C5,D5', 'B5,C5,D5,P5,R5'),
  'Guardian Of Faith':SRD5E.SPELLS['Guardian Of Faith'],
  'Guards And Wards':SRD5E.SPELLS['Guards And Wards'],
  'Guidance':
    SRD5E.SPELLS.Guidance + ' ' +
    'Description=' +
      '"Touched gains +1d4 on a choice of skill for concentration up to 1 min"',
  'Guiding Bolt':SRD5E.SPELLS['Guiding Bolt'],
  'Gust Of Wind':
    SRD5E.SPELLS['Gust Of Wind']
    .replace('D2,S2,W2', 'D2,R2,S2,W2'),

  'Hallow':
    SRD5E.SPELLS.Hallow
    .replace('celestials', 'aberrations, celestials')
    .replace(' (save Charisma negates)', ''),
  'Hallucinatory Terrain':SRD5E.SPELLS['Hallucinatory Terrain'],
  'Harm':
    SRD5E.SPELLS.Harm
    .replace(' for 1 hr', ''),
  'Haste':SRD5E.SPELLS.Haste,
  'Heal':
    SRD5E.SPELLS.Heal
    .replace('Evocation', 'Abjuration')
    .replace('diseased', 'poisoned'),
  'Healing Word':
    SRD5E.SPELLS['Healing Word']
    .replace('Evocation', 'Abjuration')
    .replaceAll('1d4', '2d4'),
  'Heat Metal':SRD5E.SPELLS['Heat Metal'],
  'Hellish Rebuke':SRD5E.SPELLS['Hellish Rebuke'],
  "Heroes' Feast":
    SRD5E.SPELLS["Heroes' Feast"]
    .replace('C6,D6', 'B6,C6,D6')
    .replace(/recover.*Wisdom/, 'gain resistance to poison, immunity to becoming poisoned and frightened'),
  'Heroism':SRD5E.SPELLS.Heroism,
  'Hex': // ref PHB5E
    'School=Enchantment ' +
    'Level=K1 ' +
    'AtHigherLevels="extends the duration to 4, 8, or 24 hr at level 2, 3 or 5" ' +
    'Description=' +
      '"R90\' Self attacks on the target inflict +1d6 HP necrotic, and the target has disadvantage on a chosen ability, for concentration up to 1 hr"',
  'Hideous Laughter':
    SRD5E.SPELLS['Hideous Laughter']
    .replace('B1,W1', 'B1,K1,W1') + ' ' +
    'AtHigherLevels="affects +1 target"',
  'Hold Monster':SRD5E.SPELLS['Hold Monster'],
  'Hold Person':SRD5E.SPELLS['Hold Person'],
  'Holy Aura':
    SRD5E.SPELLS['Holy Aura']
    .replace('negates)', 'negates) until the end of its next turn'),
  "Hunter's Mark":
    SRD5E.SPELLS["Hunter's Mark"]
    .replace('1d6', '1d%{magicNotes.foeSlayer?10:6}')
    .replace('weapon damage', 'force'),
  'Hypnotic Pattern':SRD5E.SPELLS['Hypnotic Pattern'],

  'Ice Knife': // ref Xanathar
    'School=Conjuration ' +
    'Level=D1,S1,W1 ' +
    'AtHigherLevels="inflicts +1d6 HP cold" ' +
    'Description=' +
      '"R60\' Ranged spell inflicts 1d10 HP piercing on a hit and 2d6 HP cold in a 5\' radius (save Dexterity negates cold)"',
  'Ice Storm':
    SRD5E.SPELLS['Ice Storm']
    .replaceAll('d8', 'd10'),
  'Identify':SRD5E.SPELLS.Identify,
  'Illusory Script':SRD5E.SPELLS['Illusory Script'],
  'Imprisonment':
    SRD5E.SPELLS.Imprisonment
    .replace('permanently', 'and gives the target 24 hr immunity'),
  'Incendiary Cloud':
    SRD5E.SPELLS['Incendiary Cloud']
    .replace('S8,W8', 'D8,S8,W8'),
  'Inflict Wounds':
    SRD5E.SPELLS['Inflict Wounds']
    .replace('3d10 HP necrotic', '2d10 HP necrotic (save Constitution half)'),
  'Insect Plague':SRD5E.SPELLS['Insect Plague'],
  'Instant Summons':SRD5E.SPELLS['Instant Summons'],
  'Invisibility':
    SRD5E.SPELLS.Invisibility
    .replace('attacking', 'attacking, inflicting damage,'),
  'Irresistible Dance':
    SRD5E.SPELLS['Irresistible Dance']
    .replace('each rd after the first ends', 'ends after 1 rd; additional saves each rd end'),

  'Jump':
    SRD5E.SPELLS.Jump
    .replace('gains triple jump distance', "can jump 30' after a 10' move"),

  'Knock':SRD5E.SPELLS.Knock,

  'Legend Lore':SRD5E.SPELLS['Legend Lore'],
  'Lesser Restoration':SRD5E.SPELLS['Lesser Restoration'],
  'Levitate':SRD5E.SPELLS.Levitate,
  'Light':
    SRD5E.SPELLS.Light
    .replace('object', 'unattended object')
    .replace(' (save Dexterity negates)', ''),
  'Lightning Bolt':
    SRD5E.SPELLS['Lightning Bolt']
    .replace(' and ignites unattended flammable objects', ''),
  'Locate Animals Or Plants':SRD5E.SPELLS['Locate Animals Or Plants'],
  'Locate Creature':
    SRD5E.SPELLS['Locate Creature']
    .replace('running water', 'lead'),
  'Locate Object':SRD5E.SPELLS['Locate Object'],
  'Longstrider':SRD5E.SPELLS.Longstrider,

  'Mage Armor':SRD5E.SPELLS['Mage Armor'],
  'Mage Hand':SRD5E.SPELLS['Mage Hand'],
  'Magic Circle':
    SRD5E.SPELLS['Magic Circle']
    .replace('celestials', 'celestials, elementals'),
  'Magic Jar':SRD5E.SPELLS['Magic Jar'],
  'Magic Missile':SRD5E.SPELLS['Magic Missile'],
  'Magic Mouth':SRD5E.SPELLS['Magic Mouth'],
  'Magic Weapon':
    SRD5E.SPELLS['Magic Weapon']
    .replace('P2,W2', 'P2,R2,S2,W2')
    .replace('level 4', 'level 3')
    .replace('concentration up to ', ''),
  'Magnificent Mansion':SRD5E.SPELLS['Magnificent Mansion'],
  'Major Image':
    SRD5E.SPELLS['Major Image']
    .replace('level 6', 'level 4'),
  'Mass Cure Wounds':
    SRD5E.SPELLS['Mass Cure Wounds']
    .replace('Evocation', 'Abjuration')
    .replace('3d8', '5d8'),
  'Mass Heal':
    SRD5E.SPELLS['Mass Heal']
    .replace('Evocation', 'Abjuration')
    .replace('diseased', 'poisoned'),
  'Mass Healing Word':
    SRD5E.SPELLS['Mass Healing Word']
    .replace('Evocation', 'Abjuration')
    .replace('C3', 'B3,C3')
    .replace('regain 1d4', 'regain 2d4'),
  'Mass Suggestion':
    SRD5E.SPELLS['Mass Suggestion']
    .replace('B6,K6,S6,W6', 'B6,S6,W6'),
  'Maze':
    SRD5E.SPELLS.Maze
    .replace('Intelligence', 'Investigation')
    .replace('; minotaurs and goristro demons automatically succeed', ''),
  'Meld Into Stone':
    SRD5E.SPELLS['Meld Into Stone']
    .replace('C3,D3', 'C3,D3,R3')
    .replace('bludgeoning', 'force'),
  'Mending':SRD5E.SPELLS.Mending,
  'Message':
    SRD5E.SPELLS.Message
    .replace('B0,S0,W0', 'B0,D0,S0,W0')
    .replace('3\' of wood, 1\' of stone, 1\\" of metal,', "1' of wood, stone, or metal"),
  'Meteor Swarm':SRD5E.SPELLS['Meteor Swarm'],
  'Mind Blank':SRD5E.SPELLS['Mind Blank'],
  'Mind Spike': // new
    'School=Divination ' +
    'Level=K2,S2,W2 ' +
    'AtHigherLevels="inflicts +1d8 HP" ' +
    'Description="R120\' Inflicts 3d8 HP psychic and reveals the target\'s location for concentration up to 1 hr (save Wisdom half HP only)"',
  'Minor Illusion':SRD5E.SPELLS['Minor Illusion'],
  'Mirage Arcane':SRD5E.SPELLS['Mirage Arcane'],
  'Mirror Image':
    SRD5E.SPELLS['Mirror Image']
    .replace('K2,S2,W2', 'B2,K2,S2,W2')
    .replace(/with Armor Class.*allow/, 'allow')
    .replace('with an 11, 8, or 6 on a d20 while 1, 2, or 3 duplicates remain', 'with a 3 or higher on a d6 for each remaining duplicate'),
  'Mislead':
    SRD5E.SPELLS.Mislead
    .replace('B5,W5', 'B5,K5,W5')
    .replace('attacking', 'attacking, inflicting damage,'),
  'Misty Step':SRD5E.SPELLS['Misty Step'],
  'Modify Memory':SRD5E.SPELLS['Modify Memory'],
  'Moonbeam':
    SRD5E.SPELLS.Moonbeam
    .replace('have disadvantage and ', ''),
  'Move Earth':SRD5E.SPELLS['Move Earth'],

  'Nondetection':SRD5E.SPELLS.Nondetection,

  'Pass Without Trace':SRD5E.SPELLS['Pass Without Trace'],
  'Passwall':SRD5E.SPELLS.Passwall,
  'Phantasmal Force': // ref PHB5E
    'School=Illusion ' +
    // Spell description shows B2,S2,W2, but not on the spell lists?
    'Level=B2,"K2 [The Archfey]","K2 [The Great Old One]",S2,W2 ' +
    'Description=' +
      '"R60\' Target perceives an illusion (save Intelligence negates; Investigation ends) that can inflict 2d8 HP psychic per rd for concentration up to 1 min"',
  'Phantasmal Killer':
    SRD5E.SPELLS['Phantasmal Killer']
    .replace('W4', 'B4,W4')
    .replace('negates', 'half initial HP only')
    .replace('frightened', 'disadvantage on attacks and ability checks'),
  'Phantom Steed':SRD5E.SPELLS['Phantom Steed'],
  'Planar Ally':SRD5E.SPELLS['Planar Ally'],
  'Planar Binding':
    SRD5E.SPELLS['Planar Binding']
    .replace('B5,C5,D5,W5', 'B5,C5,D5,K5,W5'),
  'Plane Shift':
    SRD5E.SPELLS['Plane Shift']
    .replace('Target (save Charisma negates) or self', 'Self'),
  'Plant Growth':
    SRD5E.SPELLS['Plant Growth']
    .replace('1 year', '365 days'),
  'Poison Spray':
    SRD5E.SPELLS['Poison Spray']
    .replace('Conjuration', 'Necromancy') + ' ' +
    'Description="R30\' Ranged spell inflicts %{(level+7)//6}d12 HP poison"',
  'Polymorph':
    SRD5E.SPELLS.Polymorph
    .replace('beast', 'beast, with temporary hit points appropriate to the beast,')
    .replace('; shapechangers automatically succeed', '')
    .replace('0 hit points', '0 temporary hit points'),
  'Power Word Heal': // ref PHB5E
    'School=Enchantment ' +
    'Level=B9,C9 ' +
    'Description=' +
      '"R60\' Target regains all hit points, recovers from charmed, frightened, paralyzed, poisoned, and stunned, and can use a reaction to stand from prone"',
  'Power Word Kill':
    SRD5E.SPELLS['Power Word Kill']
    .replace('are unaffected', 'suffer 12d12 HP psychic'),
  'Power Word Stun':
    SRD5E.SPELLS['Power Word Stun']
    .replace('unaffected', 'have Speed 0 until the start of the next turn'),
  'Prayer Of Healing':
    SRD5E.SPELLS['Prayer Of Healing']
    .replace('C2', 'C2,P2') + ' ' +
    'Description=' +
      '"R30\' 5 targets gain the benefits of a short rest and regain 2d8 hit points after 10 min of casting; additional castings have no effect on a target until it completes a long rest"',
  'Prestidigitation':SRD5E.SPELLS.Prestidigitation,
  'Prismatic Spray':
    SRD5E.SPELLS['Prismatic Spray']
    .replace('S7,W7', 'B7,S7,W7')
    .replace('10d6', '12d6'),
  'Prismatic Wall':
    SRD5E.SPELLS['Prismatic Wall']
    .replace('W9', 'B9,W9')
    .replace('10d6', '12d6'),
  'Private Sanctum':
    SRD5E.SPELLS['Private Sanctum']
    .replace('1 year', '365 days'),
  'Produce Flame':
    SRD5E.SPELLS['Produce Flame']
    .replace("R30'", "R60'")
    .replace('spell attack', 'spell attack each rd')
    .replace(' and ends the spell', ''),
  'Programmed Illusion':SRD5E.SPELLS['Programmed Illusion'],
  'Project Image':SRD5E.SPELLS['Project Image'],
  'Protection From Energy':SRD5E.SPELLS['Protection From Energy'],
  'Protection From Evil And Good':
    SRD5E.SPELLS['Protection From Evil And Good']
    .replace('C1,K1,P1,W1', 'C1,D1,K1,P1,W1'),
  'Protection From Poison':
    SRD5E.SPELLS['Protection From Poison']
    .replace('1 poison', 'the poisoned condition'),
  'Purify Food And Drink':SRD5E.SPELLS['Purify Food And Drink'],

  'Raise Dead':
    SRD5E.SPELLS['Raise Dead']
    .replace('nonmagical diseases and ', ''),
  'Ray Of Enfeeblement':
    SRD5E.SPELLS['Ray Of Enfeeblement'] + ' ' +
    'Description=' +
      '"R60\' Ranged spell inflicts disadvantage on Strength checks and -1d8 damage with Strength weapons (save Constitution disadvantage on the first attack before the start of the next turn only; additional saves each rd ends) for concentration up to 1 min"',
  'Ray Of Frost':SRD5E.SPELLS['Ray Of Frost'],
  'Ray Of Sickness': // ref PHB5E
    'School=Necromancy ' +
    'Level=S1,W1 ' +
    'AtHigherLevels="inflicts +1d8 HP" ' +
    'Description=' +
      '"R60\' Ranged spell inflicts 2d8 HP poison and poisoned until the end of the next turn",',
  'Regenerate':
    SRD5E.SPELLS.Regenerate
    .replace('reattaches or ', ''),
  'Reincarnate':
    SRD5E.SPELLS.Reincarnate
    .replace('Transmutation', 'Necromancy'),
  'Remove Curse':SRD5E.SPELLS['Remove Curse'],
  'Resilient Sphere':
    SRD5E.SPELLS['Resilient Sphere']
    .replace('Evocation', 'Abjuration'),
  'Resistance':
    SRD5E.SPELLS.Resistance + ' ' +
    'Description=' +
      '"Touched reduces by 1d4 HP any damage taken from a choice of acid, bludgeoning, cold, fire, lightning, necrotic, piercing, poison, radiant, slashing, or thunder for concentration up to 1 min"',
  'Resurrection':
    SRD5E.SPELLS.Resurrection
    .replace('nonmagical diseases, ', '')
    .replace('1 year', '365 days'),
  'Reverse Gravity':SRD5E.SPELLS['Reverse Gravity'],
  'Revivify':
    SRD5E.SPELLS.Revivify
    .replace('C3,P3', 'C3,D3,P3,R3'),
  'Rope Trick':SRD5E.SPELLS['Rope Trick'],

  'Sacred Flame':
    SRD5E.SPELLS['Sacred Flame']
    .replace('cover', '1/2 and 3/4 cover'),
  'Sanctuary':
    SRD5E.SPELLS.Sanctuary
    .replace('attacking', 'attacking, inflicting damage, or casting'),
  'Scorching Ray':SRD5E.SPELLS['Scorching Ray'],
  'Scrying':SRD5E.SPELLS.Scrying,
  'Searing Smite': // ref PHB5E
    'School=Evocation ' +
    'Level=P1 ' +
    'AtHigherLevels="inflicts +1d6 HP initial and per rd" ' +
    'Description=' +
      '"Cast as a bonus action after a successful self melee attack, inflicts +1d6 HP fire, plus 1d6 HP fire per rd (save Constitution ends) for 1 min"',
  'Secret Chest':SRD5E.SPELLS['Secret Chest'],
  'See Invisibility':SRD5E.SPELLS['See Invisibility'],
  'Seeming':SRD5E.SPELLS.Seeming,
  'Sending':SRD5E.SPELLS.Sending,
  'Sequester':SRD5E.SPELLS.Sequester,
  'Shapechange':
    SRD5E.SPELLS.Shapechange
    .replace('gaining the hit points and hit dice of that', 'initially gaining temporary hit points of the first')
    .replace(' or until reduced to 0 hit points', ''),
  'Shatter':
    SRD5E.SPELLS.Shatter
    .replace('B2,K2,S2,W2', 'B2,S2,W2')
    .replace('inorganic creatures', 'constructs'),
  'Shield':SRD5E.SPELLS.Shield,
  'Shield Of Faith':SRD5E.SPELLS['Shield Of Faith'],
  'Shillelagh':
    SRD5E.SPELLS.Shillelagh + ' ' +
    'Description=' +
      '"Held club gains +%{proficiencyBonus+mdf} attacks that inflict %{level<5?\'1d8\':level<11?\'1d10\':level<17?\'1d12\':\'2d6\'}+%{mdf} HP of a choice of force or weapon damage for 1 min"',
  'Shining Smite': // new
    'School=Transmutation ' +
    'Level=P2 ' +
    'AtHigherLevels="inflicts +1d6 HP" ' +
    'Description=' +
      '"Cast as a bonus action after a successful self melee attack, inflicts +2d6 HP radiant and causes the target to emit a 5\' bright light, negating invisibility and giving its foes advantage on attacks, for concentration up to 1 min"',
  'Shocking Grasp':
    SRD5E.SPELLS['Shocking Grasp']
    .replace('reactions', 'opportunity attacks'),
  'Silence':SRD5E.SPELLS.Silence,
  'Silent Image':SRD5E.SPELLS['Silent Image'],
  'Simulacrum':SRD5E.SPELLS.Simulacrum,
  'Sleep':
    SRD5E.SPELLS.Sleep + ' ' +
    'AtHigherLevels="" ' +
    'Description=' +
      '"R60\' Each target in a 5\' radius becomes incapacitated (save Wisdom negates) until the end of its next turn, then unconscious (save Wisdom negates) for concentration up to 1 min (damage or shaking awakens)"',
  'Sleet Storm':
    SRD5E.SPELLS['Sleet Storm']
    .replace("40'", "20'"),
  'Slow':
    SRD5E.SPELLS.Slow
    .replace('S3,W3', 'B3,S3,W3')
    .replace('50% chance of a 1-rd delay on spell effects', '25% chance of somatic spell failure'),
  'Sorcerous Burst': // new
    'School=Evocation ' +
    'Level=S0 ' +
    'Description=' +
      '"R120\' Ranged spell inflicts %{(level+7)//6}d8 HP of a choice of acid, cold, fire, lightning, poison, psychic, or thunder; rolled 8s on the damage each inflict +1d8 HP, to a maximum of +%{mdf}d8 HP"',
  'Spare The Dying':
    SRD5E.SPELLS['Spare The Dying']
    .replace('C0', 'C0,D0')
    .replace('Touched', "R%{level<5?15:level<11?30:level<17?60:120}' Target"),
  'Speak With Animals':
    SRD5E.SPELLS['Speak With Animals']
    .replace('B1,D1,R1', 'B1,D1,K1,R1'),
  'Speak With Dead':
    SRD5E.SPELLS['Speak With Dead']
    .replace('B3,C3', 'B3,C3,W3'),
  'Speak With Plants':SRD5E.SPELLS['Speak With Plants'],
  'Spider Climb':
    SRD5E.SPELLS['Spider Climb'] + ' ' +
    'AtHigherLevels="affects +1 target"',
  'Spike Growth':SRD5E.SPELLS['Spike Growth'],
  'Spirit Guardians':SRD5E.SPELLS['Spirit Guardians'],
  'Spiritual Weapon':
    SRD5E.SPELLS['Spiritual Weapon']
    .replace('for 1 min', 'for concentration up to 1 min')
    .replace(' per 2 levels', ''),
  'Starry Wisp': // new
    'School=Evocation ' +
    'Level=B0,D0 ' +
    'Description=' +
      '"R60\' Ranged spell inflicts %{(level+7)//6}d8 HP radiant and a dim glow until the end of the next turn"',
  'Stinking Cloud':
    SRD5E.SPELLS['Stinking Cloud']
    .replace('loss', 'poisoned and loss'),
  'Stone Shape':SRD5E.SPELLS['Stone Shape'],
  'Stoneskin':
    SRD5E.SPELLS.Stoneskin
    .replace('Abjuration', 'Transmutation'),
  'Storm Of Vengeance':
    SRD5E.SPELLS['Storm Of Vengeance']
    .replace('sight', '1 mile')
    .replace('360', '300')
    .replace('1d6', '4d6'),
  'Suggestion':SRD5E.SPELLS.Suggestion,
  'Summon Dragon': // new
    'School=Conjuration ' +
    'Level=W5 ' +
    'AtHigherLevels="increases the Armor Class by 1, hit points by 10, number of attacks by 1 per 2 levels, and piercing damage by 1" ' +
    'Description=' +
      '"R60\' Summons an obedient draconic spirit for concentration up to 1 hr; it has Armor Class 19, 50 hit points, 30\' Speed, 60\' fly Speed, 30\' swim Speed, 2 attacks per rd that inflict 1d6 + 9 HP piercing, a breath weapon that inflicts 2d6 HP of a choice of acid, cold, fire, lightning, or poison in a 30\' cone, and resistance to the same damage type; self also gains this resistance"',
  'Sunbeam':
    SRD5E.SPELLS.Sunbeam
    .replace('D6,S6,W6', 'C6,D6,S6,W6'),
  'Sunburst':
    SRD5E.SPELLS.Sunburst
    .replace('D8,S8,W8', 'C8,D8,S8,W8'),
  'Symbol':
    SRD5E.SPELLS.Symbol
    .replace('B7,C7,W7', 'B7,C7,D7,W7')
    .replace(/overwhelmed.*incapacitated/, 'incapacitated')
    .replace('Constitution negates', 'Wisdom negates'),

  'Telekinesis':
    SRD5E.SPELLS.Telekinesis
    .replace('1000 lb ', ''),
  'Telepathic Bond':
    SRD5E.SPELLS['Telepathic Bond']
    .replace('W5', 'B5,W5'),
  'Teleport':
    SRD5E.SPELLS.Teleport
    .replace("10' cube", 'Large or smaller'),
  'Teleportation Circle':
    SRD5E.SPELLS['Teleportation Circle']
    .replace('B5,S5,W5', 'B5,K5,S5,W5')
    .replace('1 year', '365 days'),
  'Thaumaturgy':SRD5E.SPELLS.Thaumaturgy,
  'Thunderwave':SRD5E.SPELLS.Thunderwave,
  'Time Stop':SRD5E.SPELLS['Time Stop'],
  'Tiny Hut':
    SRD5E.SPELLS['Tiny Hut']
    .replace('spells', 'spells up to level 3'),
  'Tongues':SRD5E.SPELLS.Tongues,
  'Transport Via Plants':
    SRD5E.SPELLS['Transport Via Plants']
    .replace('1 rd', '1 min'),
  'Tree Stride':SRD5E.SPELLS['Tree Stride'],
  'True Polymorph':
    SRD5E.SPELLS['True Polymorph']
    .replace(' or until reduced to 0 hit points', ''),
  'True Seeing':
    SRD5E.SPELLS['True Seeing']
    .replace(/truesight.*for 1 hr/, 'truesight for 1 hr'),
  'True Resurrection':SRD5E.SPELLS['True Resurrection'],
  'True Strike':
    SRD5E.SPELLS['True Strike'] + ' ' +
    'Description=' +
      '"Proficient weapon attack made simultaneously with casting has a +%{proficiencyBonus+mdf} attack bonus and inflicts%{level<5?\'\':level<11?\' +1d6 HP of\':level<17?\' +2d6 HP of\':\' +3d6 HP of\'} a choice of radiant or normal weapon damage"',
  'Tsunami': // ref PHB5E
    'School=Conjuration ' +
    'Level=D8 ' +
    'Description=' +
      '"R1 mile 300\'x300\'x50\' wall of water inflicts 5d10 HP bludgeoning (save Strength half); it moves away 50\' per rd, reducing its height by 50\' and its damage by 1d10 HP each rd, for concentration up to 6 rd"',

  'Unseen Servant':SRD5E.SPELLS['Unseen Servant'],

  'Vampiric Touch':
    SRD5E.SPELLS['Vampiric Touch']
    .replace('K3,W3', 'K3,S3,W3'),
  'Vicious Mockery':
    SRD5E.SPELLS['Vicious Mockery']
    .replaceAll('d4', 'd6'),
  'Vitriolic Sphere': // ref Xanathar
    'School=Evocation ' +
    'Level=S4,W4 ' +
    'AtHigherLevels="inflicts +2d4 HP initial" ' +
    'Description=' +
      '"R150\' 20\' radius inflicts 10d4 HP acid, then 5d4 HP acid at the end of each affected creature\'s next turn (save Dexterity half initial HP only)"',

  'Wall Of Fire':SRD5E.SPELLS['Wall Of Fire'],
  'Wall Of Force':SRD5E.SPELLS['Wall Of Force'],
  'Wall Of Ice':SRD5E.SPELLS['Wall Of Ice'],
  'Wall Of Stone':SRD5E.SPELLS['Wall Of Stone'],
  'Wall Of Thorns':SRD5E.SPELLS['Wall Of Thorns'],
  'Warding Bond':
    SRD5E.SPELLS['Warding Bond']
    .replace('C2', 'C2,P2'),
  'Water Walk':SRD5E.SPELLS['Water Walk'],
  'Water Breathing':SRD5E.SPELLS['Water Breathing'],
  'Web':
    SRD5E.SPELLS.Web
    .replace('Strength', 'Athletics'),
  'Weird':
    SRD5E.SPELLS.Weird
    .replace('W9', 'K9,W9')
    .replace('4d10 HP psychic', '10d10 HP psychic (save Wisdom half HP only), then 5d10 HP psychic'),
  'Wind Walk':
    SRD5E.SPELLS['Wind Walk']
    .replace('nonmagical weapons', 'bludgeoning, piercing, and slashing')
    .replace('incapacitation', 'stunned'),
  'Wind Wall':
    SRD5E.SPELLS['Wind Wall']
    .replace('3d8', '4d8'),
  'Wish':SRD5E.SPELLS.Wish,
  'Word Of Recall':SRD5E.SPELLS['Word Of Recall'],

  'Zone Of Truth':SRD5E.SPELLS['Zone Of Truth']

};
SRD5E2024.TOOLS = {
  "Alchemist's Supplies":
    SRD5E.TOOLS["Alchemist's Supplies"] + ' Ability=Intelligence',
  "Brewer's Supplies":
    SRD5E.TOOLS["Brewer's Supplies"] + ' Ability=Intelligence',
  "Calligrapher's Supplies":
    SRD5E.TOOLS["Calligrapher's Supplies"] + ' Ability=Dexterity',
  "Carpenter's Tools":SRD5E.TOOLS["Carpenter's Tools"] + ' Ability=Strength',
  "Cartographer's Tools":
    SRD5E.TOOLS["Cartographer's Tools"] + ' Ability=Wisdom',
  "Cobbler's Tools":SRD5E.TOOLS["Cobbler's Tools"] + ' Ability=Dexterity',
  "Cook's Utensils":SRD5E.TOOLS["Cook's Utensils"] + ' Ability=Wisdom',
  "Glassblower's Tools":
    SRD5E.TOOLS["Glassblower's Tools"] + ' Ability=Intelligence',
  "Jeweler's Tools":SRD5E.TOOLS["Jeweler's Tools"] + ' Ability=Intelligence',
  "Leatherworker's Tools":
    SRD5E.TOOLS["Leatherworker's Tools"] + ' Ability=Dexterity',
  "Mason's Tools":SRD5E.TOOLS["Mason's Tools"] + ' Ability=Strength',
  "Painter's Supplies":SRD5E.TOOLS["Painter's Supplies"] + ' Ability=Wisdom',
  "Potter's Tools":SRD5E.TOOLS["Potter's Tools"] + ' Ability=Intelligence',
  "Smith's Tools":SRD5E.TOOLS["Smith's Tools"] + ' Ability=Strength',
  "Tinker's Tools":SRD5E.TOOLS["Tinker's Tools"] + ' Ability=Dexterity',
  "Weaver's Tools":SRD5E.TOOLS["Weaver's Tools"] + ' Ability=Dexterity',
  "Woodcarver's Tools":SRD5E.TOOLS["Woodcarver's Tools"] + ' Ability=Dexterity',
  'Disguise Kit':SRD5E.TOOLS['Disguise Kit'] + ' Ability=Charisma',
  'Forgery Kit':SRD5E.TOOLS['Forgery Kit'] + ' Ability=Dexterity',
  'Dice Set':SRD5E.TOOLS['Dice Set'] + ' Ability=Wisdom',
  'Dragonchess Set':'Category="Gaming Set" Cost=1 Weight=0.5 Ability=Wisdom',
  'Playing Card Set':SRD5E.TOOLS['Playing Card Set'] + ' Ability=Wisdom',
  'Three-Dragon Ante Set':
    'Category="Gaming Set" Cost=1 Weight=0 Ability=Wisdom',
  'Herbalism Kit':SRD5E.TOOLS['Herbalism Kit'] + ' Ability=Intelligence',
  'Bagpipes':SRD5E.TOOLS.Bagpipes + ' Ability=Charisma',
  'Drum':SRD5E.TOOLS.Drum + ' Ability=Charisma',
  'Dulcimer':SRD5E.TOOLS.Dulcimer + ' Ability=Charisma',
  'Flute':SRD5E.TOOLS.Flute + ' Ability=Charisma',
  'Horn':SRD5E.TOOLS.Horn + ' Ability=Charisma',
  'Lute':SRD5E.TOOLS.Lute + ' Ability=Charisma',
  'Lyre':SRD5E.TOOLS.Lyre + ' Ability=Charisma',
  'Pan Flute':SRD5E.TOOLS['Pan Flute'] + ' Ability=Charisma',
  'Shawm':SRD5E.TOOLS.Shawm + ' Ability=Charisma',
  'Viol':SRD5E.TOOLS.Viol + ' Ability=Charisma',
  "Navigator's Tools":SRD5E.TOOLS["Navigator's Tools"] + ' Ability=Wisdom',
  "Poisoner's Kit":SRD5E.TOOLS["Poisoner's Kit"] + ' Ability=Intelligence',
  "Thieves' Tools":SRD5E.TOOLS["Thieves' Tools"] + ' Ability=Dexterity'
  // Vehicle (Land) and Vehicle (Water) have been dropped
};
SRD5E2024.WEAPONS = {

  'Club':SRD5E.WEAPONS.Club + ' Mastery=Slow',
  'Dagger':SRD5E.WEAPONS.Dagger + ' Mastery=Nick',
  'Greatclub':SRD5E.WEAPONS.Greatclub + ' Mastery=Push',
  'Handaxe':SRD5E.WEAPONS.Handaxe + ' Mastery=Vex',
  'Javelin':SRD5E.WEAPONS.Javelin + ' Mastery=Slow',
  'Light Hammer':SRD5E.WEAPONS['Light Hammer'] + ' Mastery=Nick',
  'Mace':SRD5E.WEAPONS.Mace + ' Mastery=Sap',
  'Quarterstaff':SRD5E.WEAPONS.Quarterstaff + ' Mastery=Topple',
  'Sickle':SRD5E.WEAPONS.Sickle + ' Mastery=Nick',
  'Spear':SRD5E.WEAPONS.Spear + ' Mastery=Sap',

  'Dart':SRD5E.WEAPONS.Dart + ' Mastery=Vex',
  'Light Crossbow':SRD5E.WEAPONS['Light Crossbow'] + ' Mastery=Slow',
  'Shortbow':SRD5E.WEAPONS.Shortbow + ' Mastery=Vex',
  'Sling':SRD5E.WEAPONS.Sling + ' Mastery=Slow',

  'Battleaxe':SRD5E.WEAPONS.Battleaxe + ' Mastery=Topple',
  'Flail':SRD5E.WEAPONS.Flail + ' Mastery=Sap',
  'Glaive':SRD5E.WEAPONS.Glaive + ' Mastery=Graze',
  'Greataxe':SRD5E.WEAPONS.Greataxe + ' Mastery=Cleave',
  'Greatsword':SRD5E.WEAPONS.Greatsword + ' Mastery=Graze',
  'Halberd':SRD5E.WEAPONS.Halberd + ' Mastery=Cleave',
  'Lance':
    SRD5E.WEAPONS.Lance
    .replace('d12', 'd10')
    .replace('Special', 'Two-Handed') + ' Mastery=Topple',
  'Longsword':SRD5E.WEAPONS.Longsword + ' Mastery=Sap',
  'Maul':SRD5E.WEAPONS.Maul + ' Mastery=Topple',
  'Morningstar':SRD5E.WEAPONS.Morningstar + ' Mastery=Sap',
  'Pike':SRD5E.WEAPONS.Pike + ' Mastery=Push',
  'Rapier':SRD5E.WEAPONS.Rapier + ' Mastery=Vex',
  'Scimitar':SRD5E.WEAPONS.Scimitar + ' Mastery=Nick',
  'Shortsword':SRD5E.WEAPONS.Scimitar + ' Mastery=Vex',
  'Trident':
    SRD5E.WEAPONS.Trident
    .replace('d8', 'd10')
    .replace('d6', 'd8') + ' Mastery=Topple',
  'Warhammer':SRD5E.WEAPONS.Warhammer + ' Weight=5 Mastery=Push',
  'War Pick':
    SRD5E.WEAPONS['War Pick'] + ' Property="Versatile (1d10)" Mastery=Sap',
  'Whip':SRD5E.WEAPONS.Whip + ' Mastery=Slow',

  'Blowgun':SRD5E.WEAPONS.Blowgun + ' Mastery=Vex',
  'Hand Crossbow':SRD5E.WEAPONS['Hand Crossbow'] + ' Mastery=Vex',
  'Heavy Crossbow':SRD5E.WEAPONS['Heavy Crossbow'] + ' Mastery=Push',
  'Longbow':SRD5E.WEAPONS.Longbow + ' Mastery=Slow',
  'Musket':
    'Category="Martial Ranged" Property=Ammunition,Loading,Two-Handed ' +
    'Damage="1d12 P" Range=40/120 Mastery=Slow',
  'Pistol':
    'Category="Martial Ranged" Property=Ammunition,Loading Damage="1d10 P"' +
    'Range=30/90 Mastery=Vex'

};

/* Defines the rules related to character abilities. */
SRD5E2024.abilityRules = function(rules, abilities) {
  SRD5E.abilityRules(rules, abilities);
};

/* Defines the rules related to combat. */
SRD5E2024.combatRules = function(rules, armors, shields, weapons) {
  SRD5E.combatRules(rules, armors, shields, weapons);
};

/* Defines rules related to basic character identity. */
SRD5E2024.identityRules = function(
  rules, alignments, backgrounds, classes, deities, species
) {
  // languages are no longer species-based
  rules.defineRule('languages.Common', '', '=', '1');
  rules.defineRule('languageChoiceCount', '', '=', '2');
  // Easiest way to make sure SRD5E rules that apply to race are applied
  rules.defineRule('race', 'species', '=', null);
  SRD5E.identityRules
    (rules, alignments, backgrounds, classes, deities, {}, species);
};

/* Defines rules related to magic use. */
SRD5E2024.magicRules = function(rules, schools, spells) {
  SRD5E.magicRules(rules, schools, spells);
};

/* Defines rules related to character aptitudes. */
SRD5E2024.talentRules = function(
  rules, feats, features, goodies, languages, skills, tools
) {
  SRD5E.talentRules(rules, feats, features, goodies, languages, skills, tools);
};

/*
 * Adds #name# as a possible user #type# choice and parses #attrs# to add rules
 * related to selecting that choice.
 */
SRD5E2024.choiceRules = function(rules, type, name, attrs) {
  if(type == 'Alignment')
    SRD5E2024.alignmentRules(rules, name);
  else if(type == 'Armor') {
    let bulky = QuilvynUtils.getAttrValue(attrs, 'Bulky');
    SRD5E2024.armorRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Category'),
      QuilvynUtils.getAttrValue(attrs, 'AC'),
      bulky && !(bulky+'').match(/(^n|false)$/i),
      QuilvynUtils.getAttrValue(attrs, 'Dex'),
      QuilvynUtils.getAttrValue(attrs, 'Str'),
      QuilvynUtils.getAttrValue(attrs, 'Cost'),
      QuilvynUtils.getAttrValue(attrs, 'Weight')
    );
  } else if(type == 'Background')
    SRD5E2024.backgroundRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Equipment'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features')
    );
  else if(type == 'Background Feature')
    SRD5E2024.backgroundFeatureRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Background'),
      QuilvynUtils.getAttrValue(attrs, 'Level'),
      QuilvynUtils.getAttrValueArray(attrs, 'Replace')
    );
  else if(type == 'Class') {
    SRD5E2024.classRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValue(attrs, 'HitDie'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Selectables'),
      QuilvynUtils.getAttrValue(attrs, 'SpellAbility'),
      QuilvynUtils.getAttrValueArray(attrs, 'SpellsAvailable'),
      QuilvynUtils.getAttrValueArray(attrs, 'SpellSlots'),
      QuilvynUtils.getAttrValueArray(attrs, 'MulticlassPrerequisite')
    );
    SRD5E2024.classRulesExtra(rules, name);
  } else if(type == 'Class Feature')
    SRD5E2024.classFeatureRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValue(attrs, 'Class'),
      QuilvynUtils.getAttrValue(attrs, 'Level'),
      QuilvynUtils.getAttrValue(attrs, 'Selectable'),
      QuilvynUtils.getAttrValueArray(attrs, 'Replace')
    );
  else if(type == 'Deity')
    SRD5E2024.deityRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Alignment'),
      QuilvynUtils.getAttrValueArray(attrs, 'Domain')
    );
  else if(type == 'Feat') {
    SRD5E2024.featRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Imply'),
      QuilvynUtils.getAttrValueArray(attrs, 'Category')
    );
    SRD5E2024.featRulesExtra(rules, name);
  } else if(type == 'Feature')
    SRD5E2024.featureRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Section'),
      QuilvynUtils.getAttrValueArray(attrs, 'Note'),
      QuilvynUtils.getAttrValueArray(attrs, 'Spells'),
      QuilvynUtils.getAttrValue(attrs, 'SpellAbility')
    );
  else if(type == 'Goody')
    SRD5E2024.goodyRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Pattern'),
      QuilvynUtils.getAttrValue(attrs, 'Effect'),
      QuilvynUtils.getAttrValue(attrs, 'Value'),
      QuilvynUtils.getAttrValueArray(attrs, 'Attribute'),
      QuilvynUtils.getAttrValueArray(attrs, 'Section'),
      QuilvynUtils.getAttrValueArray(attrs, 'Note')
    );
  else if(type == 'Language')
    SRD5E2024.languageRules(rules, name);
  else if(type == 'School')
    SRD5E2024.schoolRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Features')
    );
  else if(type == 'Shield')
    SRD5E2024.shieldRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'AC'),
      QuilvynUtils.getAttrValue(attrs, 'Cost'),
      QuilvynUtils.getAttrValue(attrs, 'Weight')
    );
  else if(type == 'Skill')
    SRD5E2024.skillRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Ability'),
      QuilvynUtils.getAttrValueArray(attrs, 'Class')
    );
  else if(type == 'Species' || type == 'Race') {
    SRD5E2024.speciesRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Selectables'),
      QuilvynUtils.getAttrValue(attrs, 'Size'),
      QuilvynUtils.getAttrValue(attrs, 'Speed')
    );
    SRD5E2024.speciesRulesExtra(rules, name);
  } else if(type == 'Species Feature' || type == 'Race Feature')
    SRD5E2024.speciesFeatureRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValue(attrs, 'Species'),
      QuilvynUtils.getAttrValue(attrs, 'Level'),
      QuilvynUtils.getAttrValue(attrs, 'Selectable'),
      QuilvynUtils.getAttrValueArray(attrs, 'Replace')
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
      SRD5E2024.spellRules(
        rules, fullName, school, group, level, ritual, description, higher
      );
      rules.addChoice('spells', fullName, attrs);
    }
  } else if(type == 'Tool')
    SRD5E.toolRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Category'),
      QuilvynUtils.getAttrValue(attrs, 'Cost'),
      QuilvynUtils.getAttrValue(attrs, 'Weight'),
      QuilvynUtils.getAttrValue(attrs, 'Ability')
    );
  else if(type == 'Weapon') {
    let category = QuilvynUtils.getAttrValue(attrs, 'Category');
    let properties = QuilvynUtils.getAttrValueArray(attrs, 'Property');
    let isMonkWeapon =
      category == 'Unarmed' || category.includes('Simple') ||
      properties.includes('Light');
    SRD5E2024.weaponRules(rules, name,
      category,
      properties,
      QuilvynUtils.getAttrValue(attrs, 'Damage'),
      QuilvynUtils.getAttrValue(attrs, 'Range'),
      QuilvynUtils.getAttrValue(attrs, 'Cost'),
      QuilvynUtils.getAttrValue(attrs, 'Weight'),
      isMonkWeapon,
      QuilvynUtils.getAttrValue(attrs, 'Mastery')
    );
  } else {
    console.log('Unknown choice type "' + type + '"');
    return;
  }
  if(type == 'Skill' || type == 'Tool')
    rules.addChoice('skillsAndTools', name, attrs);
  if(type != 'Spell') {
    type = type == 'Class' ? 'levels' :
           type == 'Race' || type == 'Species' ? 'species' :
    (type.charAt(0).toLowerCase() + type.substring(1).replaceAll(' ', '') + 's');
    rules.addChoice(type, name, attrs);
  }
};

/* Defines in #rules# the rules associated with alignment #name#. */
SRD5E2024.alignmentRules = function(rules, name) {
  SRD5E.alignmentRules(rules, name);
  // No changes needed to SRD5E
};

/*
 * Defines in #rules# the rules associated with armor #name#, which requires a
 * #category# proficiency level to use effectively, adds #ac# to the
 * character's armor class, allows a maximum dex bonus to ac of #maxDex#,
 * requires (if specified) a strength of #minStr# to avoid a speed penalty,
 * is considered bulky armor if #bulky# is true, costs #cost# gold pieces and
 * weighs #weight# lbs.
 */
SRD5E2024.armorRules = function(
  rules, name, category, ac, bulky, maxDex, minStr, cost, weight
) {
  SRD5E.armorRules
    (rules, name, category, ac, bulky, maxDex, minStr, cost, weight);
  // No changes needed to SRD5E
};

/*
 * Defines in #rules# the rules associated with background #name#, which grants
 * the equipment and features listed in #equipment# and #features#.
 */
SRD5E2024.backgroundRules = function(rules, name, equipment, features) {
  SRD5E.backgroundRules(rules, name, equipment, features);
  // No changes needed to SRD5E
};

/*
 * Defines in #rules# the rules required to give feature #name# to background
 * #backgroundName#. #replace# lists any background features that this new one
 * replaces.
 */
SRD5E2024.backgroundFeatureRules = function(
  rules, name, backgroundName, level, replace
) {
  SRD5E.backgroundFeatureRules(rules, name, backgroundName, level, replace);
  // No changes needed to SRD5E
};

/*
 * Defines in #rules# the rules associated with class #name#, which has the list
 * of hard prerequisites #requires#. The class grants #hitDie# (format [n]'d'n)
 * additional hit points with each level advance. #features# and #selectables#
 * list the fixed and selectable features acquired as the character advances in
 * class level. #spellAbility# names the ability for computing spell difficulty
 * class, #spellsAvailable# lists the number of spells known or prepared and
 * #spellSlots# lists the number of spells per level per day that the class can
 * cast. #multiclassPrerequisite# specifies any prerequisites for adding the
 * class to an existing character of another class.
 */
SRD5E2024.classRules = function(
  rules, name, requires, hitDie, features, selectables, spellAbility,
  spellsAvailable, spellSlots, multiclassPrerequisite
) {
  SRD5E.classRules
    (rules, name, requires, hitDie, features, selectables, spellAbility,
     spellsAvailable, spellSlots, multiclassPrerequisite);
  // No changes needed to SRD5E
};

/*
 * Defines in #rules# the rules associated with class #name# that cannot be
 * derived directly from the attributes passed to classRules.
 */
SRD5E2024.classRulesExtra = function(rules, name) {

  let classLevel = 'levels.' + name;

  if(name == 'Barbarian') {

    rules.defineRule('abilityNotes.fastMovement.1',
      'abilityNotes.fastMovement', '?', null,
      'armorCategory', '=', 'source != "Heavy" ? 10 : null'
    );
    rules.defineRule('armorClass', 'combatNotes.unarmoredDefense.1', '+', null);
    rules.defineRule
      ('combatNotes.extraAttack', classLevel, '^=', 'source<5 ? null : 2');
    rules.defineRule('combatNotes.unarmoredDefense',
      'combatNotes.unarmoredDefense.2', '^=', null
    );
    rules.defineRule('combatNotes.unarmoredDefense.1',
      'armor', '?', 'source == "None"',
      'combatNotes.unarmoredDefense', '=', null
    );
    rules.defineRule('combatNotes.unarmoredDefense.2',
      'barbarianFeatures.Unarmored Defense', '?', null,
      'constitutionModifier', '=', null
    );
    rules.defineRule('combatNotes.weaponMastery',
      classLevel, '+=', 'source<4 ? 2 : source<10 ? 3 : 4'
    );
    rules.defineRule('selectableFeatureCount.Barbarian (Barbarian Subclass)',
      'featureNotes.barbarianSubclass', '=', '1'
    );
    rules.defineRule('speed', 'abilityNotes.fastMovement.1', '+', null);

  } else if(name == 'Bard') {

    rules.defineRule('bardicInspirationDie',
      classLevel, '=', 'source<20 ? 6 + Math.floor(source / 5) * 2 : 12'
    );
    rules.defineRule('expertiseCount', 'skillNotes.expertise', '+=', null);
    rules.defineRule('selectableFeatureCount.Bard (Bard Subclass)',
      'featureNotes.bardSubclass', '=', '1'
    );
    rules.defineRule
      ('skillNotes.expertise', classLevel, '+=', 'source<10 ? 2 : 4');
    rules.defineRule('skillNotes.jackOfAllTrades',
      'proficiencyBonus', '=', 'Math.floor(source / 2)'
    );

  } else if(name == 'Cleric') {

    rules.defineRule('combatNotes.divineSpark',
      'levels.Cleric', '=', 'source<7 ? 1 : source<13 ? 2 : source<18 ? 3 : 4'
    );
    rules.defineRule('combatNotes.improvedBlessedStrikes',
      'clericFeatures.Blessed Strikes', '?', null
    );
    rules.defineRule('magicNotes.channelDivinity.1',
      'features.Channel Divinity', '?', null,
      'levels.Cleric', '+=', 'source<6 ? 2 : source<18 ? 3 : 4'
    );
    rules.defineRule('magicNotes.improvedBlessedStrikes',
      'clericFeatures.Potent Spellcasting', '?', null
    );
    rules.defineRule('selectableFeatureCount.Cleric (Blessed Strikes)',
      'featureNotes.blessedStrikes', '=', '1'
    );
    rules.defineRule('selectableFeatureCount.Cleric (Cleric Subclass)',
      'featureNotes.clericSubclass', '=', '1'
    );
    rules.defineRule('selectableFeatureCount.Cleric (Divine Order)',
      'featureNotes.divineOrder', '=', '1'
    );
    rules.defineRule
      ('skillNotes.thaumaturge', 'wisdomModifier', '=', 'Math.max(source, 1)');
    rules.defineRule('spellsAvailable.C0', 'magicNotes.thaumaturge', '+', '1');

  } else if(name == 'Druid') {

    rules.defineRule('combatNotes.improvedElementalFury',
      'druidFeatures.Primal Strike', '?', null
    );
    rules.defineRule('magicNotes.improvedElementalFury',
      'druidFeatures.Potent Spellcasting', '?', null
    );
    rules.defineRule('magicNotes.wildShape',
      classLevel, '=', 'source<4 ? "1/4" : source<8 ? "1/2" : "1"'
    );
    rules.defineRule('magicNotes.wildShape.1', classLevel, '=', null);
    rules.defineRule('selectableFeatureCount.Druid (Druid Subclass)',
      'featureNotes.druidSubclass', '=', '1'
    );
    rules.defineRule('selectableFeatureCount.Druid (Elemental Fury)',
      'featureNotes.elementalFury', '=', '1'
    );
    rules.defineRule('selectableFeatureCount.Druid (Primal Order)',
      'featureNotes.primalOrder', '=', '1'
    );
    rules.defineRule('spellsAvailable.D0', 'magicNotes.magician', '+', '1');

  } else if(name == 'Fighter') {

    rules.defineRule('combatNotes.extraAttack',
      classLevel, '^=', 'source<5 ? null : 2',
      'combatNotes.twoExtraAttacks', '^', '3',
      'combatNotes.threeExtraAttacks', '^', '4'
    );
    rules.defineRule('combatNotes.secondWind',
      classLevel, '+=', 'source<4 ? 2 : source<10 ? 3 : 4'
    );
    rules.defineRule('combatNotes.weaponMastery',
      classLevel, '+=', 'Math.floor((source + 20) / 6)'
    );
    rules.defineRule('featCount.General',
      classLevel, '+=', 'Math.min(Math.floor(source / 4), 5) + (source<6 ? 0 : source<14 ? 1 : 2)'
    );
    rules.defineRule('selectableFeatureCount.Fighter (Fighter Primary Ability)',
      'featureNotes.fighterPrimaryAbility', '=', '1'
    );
    rules.defineRule('selectableFeatureCount.Fighter (Fighter Subclass)',
      'featureNotes.fighterSubclass', '=', '1'
    );

  } else if(name == 'Monk') {

    rules.defineRule('abilityNotes.unarmoredMovement.1',
      'abilityNotes.unarmoredMovement', '?', null,
      'armor', '?', 'source == "None"',
      'shield', '?', 'source == "None"',
      classLevel, '=', 'Math.floor((source + 6) / 4) * 5'
    );
    rules.defineRule('armorClass', 'combatNotes.unarmoredDefense.1', '+', null);
    rules.defineRule
      ('combatNotes.extraAttack', classLevel, '^=', 'source<5 ? null : 2');
    rules.defineRule('combatNotes.martialArts',
      classLevel, '=', '6 + Math.floor((source + 1)/ 6) * 2'
    );
    rules.defineRule('combatNotes.martialArts.1',
      'monkFeatures.Martial Arts', '?', null,
      'dexterityModifier', '=', 'source',
      'strengthModifier', '+', '-source',
      '', '^', '0'
    );
    rules.defineRule('combatNotes.unarmoredDefense',
      'combatNotes.unarmoredDefense.3', '^=', null
    );
    rules.defineRule('combatNotes.unarmoredDefense.1',
      'armor', '?', 'source == "None"',
      'combatNotes.unarmoredDefense', '=', null
    );
    rules.defineRule('combatNotes.unarmoredDefense.3',
      'monkFeatures.Unarmored Defense', '?', null,
      'wisdomModifier', '=', null
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
    rules.defineRule('monkSaveDC',
      "monkFeatures.Monk's Focus", '?', null,
      'proficiencyBonus', '=', '8 + source',
      'wisdomModifier', '+', null
    );
    for(let a in SRD5E.ABILITIES) {
      rules.defineRule
        ('saveProficiency.' + a, 'saveNotes.disciplinedSurvivor', '=', '1');
    }
    rules.defineRule('selectableFeatureCount.Monk (Monk Subclass)',
      'featureNotes.monkSubclass', '=', '1'
    );
    rules.defineRule('speed', 'abilityNotes.unarmoredMovement.1', '+', null);

  } else if(name == 'Paladin') {

    rules.defineRule('combatNotes.weaponMastery', classLevel, '+=', '2');
    rules.defineRule
      ('combatNotes.extraAttack', classLevel, '^=', 'source<5 ? null : 2');
    rules.defineRule('magicNotes.channelDivinity.1',
      'levels.Paladin', '+=', 'source<3 ? null : source<11 ? 2 : 3'
    );
    for(let a in SRD5E.ABILITIES)
      rules.defineRule('save.' + a, 'saveNotes.auraOfProtection', '+', '2');
    rules.defineRule('selectableFeatureCount.Paladin (Paladin Fighting Style)',
      'featureNotes.paladinFightingStyle', '=', '1'
    );
    rules.defineRule('selectableFeatureCount.Paladin (Paladin Subclass)',
      'featureNotes.paladinSubclass', '=', '1'
    );
    rules.defineRule
      ('spellsAvailable.C0', 'magicNotes.blessedWarrior', '+=', '2');

  } else if(name == 'Ranger') {

    rules.defineRule('abilityNotes.roving.1',
      'abilityNotes.roving', '?', null,
      'armorCategory', '=', 'source=="Heavy" ? null : 10'
    );
    rules.defineRule
      ('combatNotes.extraAttack', classLevel, '^=', 'source<5 ? null : 2');
    rules.defineRule('combatNotes.weaponMastery', classLevel, '+=', '2');
    rules.defineRule('expertiseCount',
      'skillNotes.deftExplorer', '+=', '1',
      'skillNotes.expertise', '+=', null
    );
    rules.defineRule('features.Colossus Slayer',
      "combatNotes.hunter'sPrey", '=', '1'
    );
    rules.defineRule('features.Escape The Horde',
      'combatNotes.defensiveTactics', '=', '1'
    );
    rules.defineRule('features.Horde Breaker',
      "combatNotes.hunter'sPrey", '=', '1'
    );
    rules.defineRule('features.Multiattack Defense',
      'combatNotes.defensiveTactics', '=', '1'
    );
    rules.defineRule('selectableFeatureCount.Ranger (Ranger Fighting Style)',
      'featureNotes.rangerFightingStyle', '=', '1'
    );
    rules.defineRule('selectableFeatureCount.Ranger (Ranger Subclass)',
      'featureNotes.rangerSubclass', '=', '1'
    );
    rules.defineRule
      ('skillNotes.expertise', classLevel, '+=', 'source<9 ? null : 2');
    rules.defineRule('speed', 'abilityNotes.roving.1', '+', null);
    rules.defineRule
      ('spellsAvailable.D0', 'magicNotes.druidicWarrior', '+=', '2');

  } else if(name == 'Rogue') {

    rules.defineRule('combatNotes.weaponMastery', classLevel, '+=', '2');
    rules.defineRule('expertiseCount', 'skillNotes.expertise', '+=', null);
    rules.defineRule('featCount.General',
      classLevel, '+=', 'Math.min(Math.floor(source / 4), 5) + (source<10 ? 0 : 1)'
    );
    rules.defineRule('selectableFeatureCount.Rogue (Rogue Subclass)',
      'featureNotes.rogueSubclass', '=', '1'
    );
    rules.defineRule
      ('skillNotes.expertise', classLevel, '+=', 'source<6 ? 2 : 4');

  } else if(name == 'Sorcerer') {

    rules.defineRule
      ('armorClass', 'combatNotes.draconicResilience.2', '+', null);
    rules.defineRule('combatNotes.draconicResilience.2',
      'armor', '?', 'source == "None"',
      'features.Draconic Resilience', '?', null,
      'charismaModifier', '=', null
    );
    rules.defineRule('featureNotes.metamagic',
      classLevel, '=', 'source<10 ? 2 : source<17 ? 3 : 4'
    );
    rules.defineRule('magicNotes.fontOfMagic', classLevel, '=', null);
    rules.defineRule('selectableFeatureCount.Sorcerer (Metamagic)',
      'featureNotes.metamagic', '=', null
    );
    rules.defineRule('selectableFeatureCount.Sorcerer (Sorcerer Subclass)',
      'featureNotes.sorcererSubclass', '=', '1'
    );

  } else if(name == 'Warlock') {

    rules.defineRule('featureNotes.lessonsOfTheFirstOnes',
      'warlockFeatures.Lessons Of The First Ones', '=', null
    );
    rules.defineRule('magicNotes.eldritchInvocations',
      classLevel, '=', 'source==1 ? 1 : source<5 ? 3 : source<7 ? 5 : source<9 ? 6 : Math.floor((source + 12) / 3)'
    );
    rules.defineRule('selectableFeatureCount.Warlock (Eldritch Invocation)',
      'magicNotes.eldritchInvocations', '=', null
    );
    rules.defineRule('selectableFeatureCount.Warlock (Pact Boon)',
      'featureNotes.pactBoon', '=', '1'
    );
    rules.defineRule('selectableFeatureCount.Warlock (Warlock Subclass)',
      'featureNotes.warlockSubclass', '=', '1'
    );
    rules.defineRule('maxKSlot',
      'casterLevels.K', '=', 'Math.min(Math.floor((source + 1) / 2), 5)'
    );
    [1, 2, 3, 4].forEach(sl => {
      rules.defineRule('spellSlots.K' + sl, 'maxKSlot', '?', 'source == ' + sl);
    });

  } else if(name == 'Wizard') {

    rules.defineRule('selectableFeatureCount.Wizard (Wizard Subclass)',
      'featureNotes.wizardSubclass', '=', '1'
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
SRD5E2024.classFeatureRules = function(
  rules, name, require, className, level, selectable, replace
) {
  SRD5E.classFeatureRules
    (rules, name, require, className, level, selectable, replace);
  // No changes needed to SRD5E
};

/*
 * Defines in #rules# the rules associated with deity #name#. #alignment# gives
 * the deity's alignment and #domains# the associated domains.
 */
SRD5E2024.deityRules = function(rules, name, alignment, domains) {
  SRD5E.deityRules(rules, name, alignment, domains);
  // No changes needed to SRD5E
};

/*
 * Defines in #rules# the rules associated with feat #name#. #require# and
 * #implies# list any hard and soft prerequisites for the feat, and
 * #categories# lists the categories to which the feat belongs.
 */
SRD5E2024.featRules = function(rules, name, requires, implies, categories) {
  SRD5E.featRules(rules, name, requires, implies, categories);
  // No changes needed to SRD5E
};

/*
 * Defines in #rules# the rules associated with feat #name# that cannot be
 * derived directly from the attributes passed to featRules.
 */
SRD5E2024.featRulesExtra = function(rules, name) {
  if(name == 'Ability Score Improvement') {
    rules.defineRule('abilityNotes.abilityScoreImprovement',
      'feats.Ability Score Improvement', '+=', 'source * 2'
    );
    rules.defineRule('abilityBoostChoiceCount',
      'abilityNotes.abilityScoreImprovement', '+=', null
    );
  } else if(name == 'Defense') {
    rules.defineRule('armorClass', 'combatNotes.defense.1', '+', null);
    rules.defineRule('combatNotes.defense.1',
      'combatNotes.defense', '?', null,
      'armorCategory', '=', 'source == "None" ? null : 1'
    );
  } else if(name.match(/^Magic Initiate \(.*\)$/)) {
    let c = name.replace('Magic Initiate (', '').replace(')', '');
    let spellChar = c == 'Warlock' ? 'K' : c.charAt(0);
    rules.defineRule
      ('casterLevels.' + spellChar, 'features.' + name, '^=', '1');
    rules.defineRule
      ('spellsAvailable.' + spellChar + '0', 'features.' + name, '+=', '2');
    rules.defineRule
      ('spellsAvailable.' + spellChar, 'features.' + name, '+=', '1');
  } else if(name == 'Skilled') {
    rules.defineRule('skillNotes.skilled', 'feats.Skilled', '=', 'source * 3');
    // Since the proficiencies from Skilled can be applied to either skills or
    // tools, we no longer have a fixed allocation for either. Instead, the
    // choice count for each represents a minimum allocation, and the sum of
    // the two, plus the value of skillNotes.skilled, is a fixed allocation
    // that can be tested.
    rules.defineRule
      ('validationNotes.skillProficiencyAllocation', 'feats.Skilled', 'v', '0');
    rules.defineRule
      ('validationNotes.toolProficiencyAllocation', 'feats.Skilled', 'v', '0');
    rules.defineRule('skillAndToolChoiceCount',
      'skillChoiceCount', '+=', null,
      'toolChoiceCount', '+=', null,
      'skillNotes.skilled', '+=', null
    );
    QuilvynRules.validAllocationRules
      (rules, 'skillAndToolProficiency', 'skillAndToolChoiceCount', 'Sum "^skillsChosen\\.|toolsChosen\\."');
  }
};

/*
 * Defines in #rules# the rules associated with feature #name#. #sections# lists
 * the sections of the notes related to the feature and #notes# the note texts;
 * the two must have the same number of elements.
 */
SRD5E2024.featureRules = function(
  rules, name, sections, notes, spells, spellAbility
) {
  SRD5E.featureRules(rules, name, sections, notes, spells, spellAbility);
  // No changes needed to SRD5E
};

/*
 * Defines in #rules# the rules to grant the spells listed in #spellList# when
 * feature #feature# is acquired. #spellType# contains the spell group (e.g.,
 * 'B' for Bard, 'C' for Cleric, etc.). Each element of #spellList# has the
 * format "[min level:]spell name[,spell name...]". If min level is provided,
 * the spells listed in that element are not acquired until the character's
 * value of #levelAttr# reaches that level.
 */
SRD5E2024.featureSpells = function(rules, feature, spellType, levelAttr, spellList){
  SRD5E.featureSpells(rules, feature, spellType, levelAttr, spellList);
  // No changes needed to SRD5E
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
SRD5E2024.goodyRules = function(
  rules, name, pattern, effect, value, attributes, sections, notes
) {
  SRD5E.goodyRules
    (rules, name, pattern, effect, value, attributes, sections, notes);
  // No changes needed to SRD5E
};

/* Defines in #rules# the rules associated with language #name#. */
SRD5E2024.languageRules = function(rules, name) {
  SRD5E.languageRules(rules, name);
  // No changes needed to SRD5E
};

/*
 * Defines in #rules# the rules associated with magic school #name#, which
 * grants the list of #features#.
 */
SRD5E2024.schoolRules = function(rules, name) {
  SRD5E.schoolRules(rules, name);
  // No changes needed to SRD5E
};

/*
 * Defines in #rules# the rules associated with species #name#, which has the
 * list of hard prerequisites #requires#. #features# and #selectables# list
 * associated features, #size# gives the racial size and #speed# gives the
 * racial speed.
 */
SRD5E2024.speciesRules = function(
  rules, name, requires, features, selectables, size, speed
) {
  SRD5E.raceRules(rules, name, requires, features, selectables, size, speed);
  // No changes needed to SRD5E
};

/*
 * Defines in #rules# the rules associated with species #name# that cannot be
 * derived directly from the attributes passed to speciesRules.
 */
SRD5E2024.speciesRulesExtra = function(rules, name) {

  let speciesLevel =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '') + 'Level';

  rules.defineRule('featureNotes.darkvision', '', '=', '60');

  if(name == 'Dragonborn') {
    rules.defineRule('breathWeaponEnergy',
      'features.Breath Weapon', '=', '"fire"',
      'features.Black Dragon', '=', '"acid"',
      'features.Blue Dragon', '=', '"lightning"',
      'features.Bronze Dragon', '=', '"lightning"',
      'features.Copper Dragon', '=', '"acid"',
      'features.Green Dragon', '=', '"poison"',
      'features.Silver Dragon', '=', '"cold"',
      'features.White Dragon', '=', '"cold"'
    );
    rules.defineRule('selectableFeatureCount.Dragonborn (Draconic Ancestry)',
      'featureNotes.draconicAncestry', '=', '1'
    );
  } else if(name.match(/Dwarf/)) {
    rules.defineRule('featureNotes.darkvision', speciesLevel, '^=', '120');
  } else if(name.match(/Elf/)) {
    rules.defineRule('casterLevels.Elf', speciesLevel, '=', null);
    rules.defineRule
      ('featureNotes.darkvision', 'featureNotes.drow', '^=', '120');
    rules.defineRule('selectableFeatureCount.Elf (Elf Spellcasting Ability)',
      'featureNotes.elfSpellcastingAbility', '=', '1'
    );
    rules.defineRule('selectableFeatureCount.Elf (Elven Lineage)',
      'featureNotes.elvenLineage', '=', '1'
    );
    rules.defineChoice('notes', 'spellAttackModifier.Elf:%S');
    rules.defineRule('spellAttackModifier.Elf',
      'spellModifier.Elf', '=', null,
      'proficiencyBonus', '+', null
    );
    rules.defineRule('spellDifficultyClass.Elf',
      'spellAttackModifier.Elf', '=', 'source + 8'
    );
    rules.defineRule('spellModifier.Elf',
      'charismaModifier', '+', 'null', // recomputation trigger
      'intelligenceModifier', '+', 'null', // recomputation trigger
      'wisdomModifier', '+', 'null', // recomputation trigger
      'elfFeatures.Charisma', '=', 'dict.charismaModifier',
      'elfFeatures.Intelligence', '=', 'dict.intelligenceModifier',
      'elfFeatures.Wisdom', '=', 'dict.wisdomModifier'
    );
  } else if(name.match(/Gnome/)) {
    rules.defineRule('casterLevels.Gnome', speciesLevel, '=', null);
    rules.defineRule('selectableFeatureCount.Gnome (Gnomish Lineage)',
      'featureNotes.gnomishLineage', '=', '1'
    );
    rules.defineChoice('notes', 'spellAttackModifier.Gnome:%S');
    rules.defineRule('spellAttackModifier.Gnome',
      'spellModifier.Gnome', '=', null,
      'proficiencyBonus', '+', null
    );
    rules.defineRule('spellDifficultyClass.Gnome',
      'spellAttackModifier.Gnome', '=', 'source + 8'
    );
    rules.defineRule('spellModifier.Gnome',
      'charismaModifier', '+', 'null', // recomputation trigger
      'intelligenceModifier', '+', 'null', // recomputation trigger
      'wisdomModifier', '+', 'null', // recomputation trigger
      'gnomeFeatures.Charisma', '=', 'dict.charismaModifier',
      'gnomeFeatures.Intelligence', '=', 'dict.intelligenceModifier',
      'gnomeFeatures.Wisdom', '=', 'dict.wisdomModifier'
    );
  } else if(name.match(/Goliath/)) {
    rules.defineRule('selectableFeatureCount.Goliath (Giant Ancestry)',
      'featureNotes.giantAncestry', '=', '1'
    );
  } else if(name.match(/Orc/)) {
    rules.defineRule('featureNotes.darkvision', speciesLevel, '^=', '120');
  } else if(name.match(/Tiefling/)) {
    rules.defineRule('selectableFeatureCount.Tiefling (Fiendish Legacy)',
      'featureNotes.fiendishLegacy', '=', '1'
    );
    rules.defineChoice('notes', 'spellAttackModifier.Tiefling:%S');
    rules.defineRule('spellAttackModifier.Tiefling',
      'spellModifier.Tiefling', '=', null,
      'proficiencyBonus', '+', null
    );
    rules.defineRule('spellDifficultyClass.Tiefling',
      'spellAttackModifier.Tiefling', '=', 'source + 8'
    );
    rules.defineRule('spellModifier.Tiefling',
      'charismaModifier', '+', 'null', // recomputation trigger
      'intelligenceModifier', '+', 'null', // recomputation trigger
      'wisdomModifier', '+', 'null', // recomputation trigger
      'tieflingFeatures.Charisma', '=', 'dict.charismaModifier',
      'tieflingFeatures.Intelligence', '=', 'dict.intelligenceModifier',
      'tieflingFeatures.Wisdom', '=', 'dict.wisdomModifier'
    );
  }

};

/*
 * Defines in #rules# the rules required to give feature #name# to species
 * #speciesName# at level #level#. #selectable# gives the category if this
 * feature is selectable; it is otherwise null. #require# lists any hard
 * prerequisites for the feature, and #replace# lists any species features that
 * this new one replaces.
 */
SRD5E2024.speciesFeatureRules = function(
  rules, name, require, raceName, level, selectable, replace
) {
  SRD5E.raceFeatureRules
    (rules, name, require, raceName, level, selectable, replace);
  // No changes needed to SRD5E
};

/*
 * Defines in #rules# the rules associated with shield #name#, which adds #ac#
 * to the character's armor class, costs #cost# gp, and weighs #weight# lbs.
 */
SRD5E2024.shieldRules = function(rules, name, ac, cost, weight) {
  SRD5E.shieldRules(rules, name, ac, cost, weight);
  // No changes needed to SRD5E
};

/*
 * Defines in #rules# the rules associated with skill #name#, associated with
 * #ability# (one of 'strength', 'intelligence', etc.). #classes# lists any
 * classes that are proficient in this skill.
 */
SRD5E2024.skillRules = function(rules, name, ability, classes) {
  SRD5E.skillRules(rules, name, ability, classes);
  rules.defineRule('jackOfAllTrades.' + name,
    'skillBonus.' + name, '?', '!source',
    'skillNotes.jackOfAllTrades', '=', null
  );
  rules.defineRule('skills.' + name, 'jackOfAllTrades.' + name, '+', null);
};

/*
 * Defines in #rules# the rules associated with spell #name#, which is from
 * magic school #school#. #casterGroup# and #level# are used to compute any
 * saving throw value required by the spell. #ritual# indicates whether or not
 * the spell can be cast using a ritual. #description# is a verbose description
 * of the spell's effects. #higher#, if supplied, describes the effects of
 * casting the spell using a higher-level spell slot.
 */
SRD5E2024.spellRules = function(
  rules, name, school, casterGroup, level, ritual, description, higher
) {
  SRD5E.spellRules
    (rules, name, school, casterGroup, level, ritual, description, higher);
  // No changes needed to SRD5E
};

/*
 * Defines in #rules# the rules associated with tool #name# that belongs to
 * category #category#, costs #cost# gp, weighs #weight# lbs, and (optionally)
 * uses #ability# for checks.
 */
SRD5E2024.toolRules = function(rules, name, category, cost, weight, ability) {
  SRD5E.toolRules(rules, name, category, cost, weight, ability);
  // No changes needed to SRD5E
};

/*
 * Defines in #rules# the rules associated with weapon #name#, which requires a
 * #category# proficiency level to use effectively and has weapon properties
 * #properties#. The weapon does #damage# HP on a successful attack. If
 * specified, the weapon can be used as a ranged weapon with a range increment
 * of #range# feet. The weapon costs #cost# gp and weighs #weight# lbs; both
 * of these may be decimals. The #isMonkWeapon# boolean indicates whether or
 * not this weapon benefits from the Monk's Martial Arts feature. #mastery#
 * specifies the mastery property of the weapon.
 */
SRD5E2024.weaponRules = function(
  rules, name, category, properties, damage, range, cost, weight, isMonkWeapon,
  mastery
) {
  SRD5E.weaponRules(
    rules, name, category, properties, damage, range, cost, weight, isMonkWeapon
  );
  if(mastery != null) {
    // add mastery to weapon format
    let weaponName = 'weapons.' + name;
    let format = rules.getChoices('notes')[weaponName];
    delete rules.choices.notes[weaponName];
    rules.defineChoice('notes',
      weaponName + ':' + format.replace(')', '; ' + mastery + ')')
    );
  }
  // Handle property-based proficiency new to the 2024 rules. Could easily
  // generalize this to additional properties, but presently no class or other
  // feature gives global proficiency for any of these weapon properties:
  // Ammunition,Loading,Heavy,Reach,Thrown,Two-Handed,Versatile (ndn)
  // Also note that all characters are proficient in Unarmed, and all classes
  // give at least Simple Weapon proficiency, so there's no need to add tests
  // for those.
  if(!category.match(/unarmed|simple/i)) {
    ['Finesse', 'Light'].forEach(p => {
      if(properties.includes(p)) {
        rules.defineRule('sanityNotes.nonproficientWeaponPenalty.' + name,
          'weaponProficiency.' + p + ' Weapons', '^', '0'
        );
      }
    });
  }
};

SRD5E2024.spellsAvailableRules = SRD5E.spellsAvailableRules;

/* Returns an ObjectViewer loaded with the default character sheet format. */
SRD5E2024.createViewers = function(rules, viewers) {
  SRD5E.createViewers(rules, viewers);
  viewers.forEach(v => {
    let viewer = rules.getViewer(v);
    if(viewer) {
      viewer.elements.forEach(e => {
        if(e.name == 'Armor Proficiency')
          e.format = '<b>Armor Training</b>: %V';
      });
    }
  });
};

/*
 * Returns the list of editing elements needed by #choiceRules# to add a #type#
 * item to #rules#.
 */
SRD5E2024.choiceEditorElements = function(rules, type) {
  return SRD5E.choiceEditorElements(rules, type.replace('Species', 'Race'));
};

/* Returns the elements in a basic 5E character editor. */
SRD5E2024.initialEditorElements = function() {
  let result = [].concat(SRD5E.initialEditorElements());
  result.forEach(x => {
    if(x[0] == 'race') {
      x[0] = 'species';
      x[1] = 'Species';
      x[3] = 'species';
    }
  });
  return result;
};

/* Sets #attributes#'s #attribute# attribute to a random value. */
SRD5E2024.randomizeOneAttribute = function(attributes, attribute) {
  SRD5E.randomizeOneAttribute.apply(this, [attributes, attribute]);
  // Handle allocations for Skilled feat when randomizing tools because tools
  // appears after skills in RANDOMIZABLE_ATTRIBUTES
  if(attribute == 'tools' && attributes['feats.Skilled']) {
    let attrs = this.applyRules(attributes);
    let skillAndToolChoiceCount =
      (attrs.skillChoiceCount || 0) +
      (attrs.toolChoiceCount || 0) +
      attrs['skillNotes.skilled'];
    for(let a in attributes) {
      if(a.startsWith('skillsChosen.') || a.startsWith('toolsChosen.'))
        skillAndToolChoiceCount--;
    }
    if(skillAndToolChoiceCount > 0) {
      let skills = this.getChoices('skills');
      let tools = this.getChoices('tools');
      let skillsAndTools = Object.keys(skills).concat(Object.keys(tools));
      while(skillAndToolChoiceCount > 0 && skillsAndTools.length > 0) {
        let choice = QuilvynUtils.randomElement(skillsAndTools);
        skillsAndTools = skillsAndTools.filter(x => x != choice);
        if(!('skillsChosen.' + choice in attributes) &&
           !('toolsChosen.' + choice in attributes)) {
          attributes[(choice in skills ? 'skills' : 'tools') + 'Chosen.' + choice] = 1;
          skillAndToolChoiceCount--;
        }
      }
    }
  }
};

/*
 * Returns an object that contains all the choices for #name# previously
 * defined for this rule set via addChoice.
 */
SRD5E2024.getChoices = function(name) {
  return SRD5E.getChoices.apply(this, [name]);
};

/*
 * Returns the dictionary of attribute formats associated with character sheet
 * format #viewer# in #rules#.
 */
SRD5E2024.getFormats = function(rules, viewer) {
  return SRD5E.getFormats(rules, viewer);
};

/* Returns an array of plugins upon which this one depends. */
SRD5E2024.getPlugins = function() {
  let result = [SRD5E];
  return result;
};

/*
 * Removes #name# from the set of user #type# choices, reversing the effects of
 * choiceRules.
 */
SRD5E2024.removeChoice = function(rules, type, name) {
  return SRD5E.removeChoice(rules, type, name);
};

/* Fixes as many validation errors in #attributes# as possible. */
SRD5E2024.makeValid = function(attributes) {
  return SRD5E.makeValid(attributes);
};

/* Returns HTML body content for user notes associated with this rule set. */
SRD5E2024.ruleNotes = function() {
  return '' +
    '<h2>SRD5.5E Quilvyn Module Notes</h2>\n' +
    'SRD5.5E Quilvyn Module Version ' + SRD5E2024.VERSION + '\n' +
    '<h3>Usage Notes</h3>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '  Discussion of adding different types of homebrew options to the' +
    '  SRD5.5E rule set can be found in <a href="plugins/homebrew-srd5e.html">SRD5E Homebrew Examples</a>.\n' +
    '  </li>\n' +
    '</ul>\n' +
    '\n' +
    '<h3>Copyrights and Licensing</h3>\n' +
    '<p>\n' +
    'This work includes material from the System Reference Document 5.2.1 ' +
    '(“SRD 5.2.1”) by Wizards of the Coast LLC, available at ' +
    'https://www.dndbeyond.com/srd. The SRD 5.2.1 is licensed under the ' +
    'Creative Commons Attribution 4.0 International License, available at ' +
    'https://creativecommons.org/licenses/by/4.0/legalcode\n' +
    '</p><p>\n' +
    'Quilvyn is not approved or endorsed by Wizards of the Coast. Portions ' +
    'of the materials used are property of Wizards of the Coast. ©Wizards of ' +
    'the Coast LLC.\n' +
    '</p>\n';
};
