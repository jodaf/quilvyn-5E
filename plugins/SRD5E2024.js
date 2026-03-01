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
/* globals Expr, ObjectViewer, PHB5E, Quilvyn, QuilvynRules, QuilvynUtils */
"use strict";

/*
 * This module loads the rules from the System Reference Document v5.2.1.
 * The SRD5E function contains methods that load rules for particular parts of
 * the SRD: speciesRules for character species, magicRules for spells, etc.
 * These member methods can be called independently in order to use a subset of
 * the SRD v5.2.1 rules. Similarly, the constant fields of SRD5E2024
 * (ALIGNMENTS, FEATS, etc.) can be manipulated to modify the choices.
 */
function SRD5E2024() {

  if(window.SRD5E == null) {
    alert('The SRD5E2024 module requires use of the SRD5E module');
    return;
  }

  let rules = new QuilvynRules('SRD 5E 2024', SRD5E2024.VERSION);
  SRD5E2024.rules = rules;
  rules.plugin = SRD5E2024;

  rules.defineChoice('choices', SRD5E2024.CHOICES);
  rules.choiceEditorElements = SRD5E.choiceEditorElements;
  rules.choiceRules = SRD5E2024.choiceRules;
  rules.removeChoice = SRD5E.removeChoice;
  rules.editorElements = SRD5E2024.initialEditorElements();
  rules.getFormats = SRD5E.getFormats;
  rules.makeValid = SRD5E.makeValid;
  rules.randomizeOneAttribute = SRD5E2024.randomizeOneAttribute;
  rules.defineChoice('random', SRD5E.RANDOMIZABLE_ATTRIBUTES);
  rules.getChoices = SRD5E.getChoices;
  rules.ruleNotes = SRD5E2024.ruleNotes;

  SRD5E.createViewers(rules, SRD5E.VIEWERS);
  rules.defineChoice('extras',
    'feats', 'featCount', 'sanityNotes', 'selectableFeatureCount',
    'validationNotes'
  );
  rules.defineChoice('preset',
    'background:Background,select-one,backgrounds',
    'species:Species,select-one,species', 'levels:Class Levels,bag,levels'
  );

  SRD5E2024.abilityRules(rules, SRD5E.ABILITIES);
  SRD5E2024.combatRules
    (rules, SRD5E2024.ARMORS, SRD5E2024.SHIELDS, SRD5E2024.WEAPONS);
  SRD5E2024.magicRules(rules, SRD5E2024.SCHOOLS, SRD5E2024.SPELLS);
  SRD5E2024.identityRules(
    rules, SRD5E.ALIGNMENTS, SRD5E2024.BACKGROUNDS, SRD5E2024.CLASSES,
    SRD5E2024.DEITIES, SRD5E2024.SPECIES
  );
  SRD5E2024.talentRules
    (rules, SRD5E2024.FEATS, SRD5E2024.FEATURES, SRD5E2024.GOODIES,
     SRD5E2024.LANGUAGES, SRD5E2024.SKILLS, SRD5E2024.TOOLS);

  Quilvyn.addRuleSet(rules);

}

SRD5E2024.CHOICES = SRD5E.CHOICES.map(x => x.replace('Race', 'Species'));
SRD5E2024.VERSION = '2.4.1.0';

SRD5E2024.ARMORS = SRD5E.ARMORS;
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
      '"1:Skill Proficiency (Atheletics; Intimidation)",' +
      '"1:Tool Proficiency (Choose 1 from any Gaming)",' +
      '"1:Savage Attacker"'
};
SRD5E2024.CLASSES = {
  'Barbarian':
    'HitDie=d12 ' +
    'Features=' +
      '"1:Armor Proficiency (Light; Medium; Shield)",' +
      '"1:Save Proficiency (Strength; Constitution)",' +
      '"1:Skill Proficiency (Choose 2 from Animal Handling, Athletics, Intimidation, Nature, Perception, Survival)",' +
      '"1:Weapon Proficiency (Simple Weapons; Martial Weapons)",' +
      '"1:Rage","1:Unarmored Defense (Barbarian)","1:Weapon Mastery",' +
      '"2:Danger Sense","2:Reckless Attack","3:Barbarian Subclass",' +
      '"3:Primal Knowledge","5:Extra Attack","5:Fast Movement",' +
      '"7:Feral Instinct","7:Instinctive Pounce","9:Brutal Strike",' +
      '"11:Relentless Rage","13:Improved Brutal Strike","15:Persistent Rage",' +
      '"17:Improved Brutal Strike","18:Indomitable Might","19:Epic Boon",' +
      '"20:Primal Champion",' +
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
      '"1:Armor Proficiency (Light)",' +
      '"1:Weapon Proficiency (Simple Weapons)",' +
      '"1:Tool Proficiency (Choose 3 from any Musical)",' +
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
      '"1:Spellcasting","1:Divine Order","2:Channel Divinity",' +
      '"2:Divine Spark","2:Turn Undead","3:Cleric Subclass","5:Sear Undead",' +
      '"7:Blessed Strikes","10:Divine Intervention",' +
      '"14:Improved Blessed Strikes","19:Epic Boon",' +
      '"20:Greater Divine Intervention",' +
      '"features.Life Domain ? 3:Disciple Of Life",' +
      '"features.Life Domain ? 3:Preserve Life",' +
      '"features.Life Domain ? 6:Blessed Healer",' +
      '"features.Life Domain ? 17:Supreme Healing" ' +
    'Selectables=' +
      '"1:Protector:Divine Order",' +
      '"1:Thaumaturge:Divine Order",' +
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
      '"1:Armor Proficiency (Light; Shield)",' +
      '"1:Weapon Proficiency (Simple Weapons)",' +
      '"1:Tool Proficiency (Herbalism Kit)",' +
      '"1:Save Proficiency (Intelligence; Wisdom)",' +
      '"1:Skill Proficiency (Choose 2 from Animal Handling, Arcana, Insight, Medicine, Nature, Perception, Religion, Survival)",' +
      '"1:Druidic","1:Spellcasting","1:Primal Order","2:Wild Shape",' +
      '"2:Wild Companion","3:Druid Subclass","5:Wild Resurgence",' +
      '"7:Elemental Fury","15:Improved Elemental Fury","18:Beast Spells",' +
      '"19:Epic Boon","20:Archdruid",' +
      '"features.Circle Of The Land ? 3:Circle Of The Land Spells",' +
      '"features.Circle Of The Land ? 6:Natural Recovery",' +
      '"features.Circle Of The Land ? 10:Nature\'s Ward",' +
      '"features.Circle Of The Land ? 14:Nature\'s Sanctuary" ' +
    'Selectables=' +
      '"1:Magician:Primal Order",' +
      '"1:Warden:Primal Order",' +
      '"3:Circle Of The Land:Druid Subclass",' +
      '"7:Potent Spellcasting (Druid):Elemental Fury",' +
      '"7:Primal Srike:Elemental Fury" ' +
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
      '"1:Fighter Primary Ability",' +
      '"1:Armor Proficiency (Light; Medium; Heavy; Shield)",' +
      '"1:Weapon Proficiency (Simple Weapons; Martial Weapons)",' +
      '"1:Save Proficiency (Strength; Constitution)",' +
      '"1:Skill Proficiency (Choose 2 from Acrobatics, Animal Handling, Athletics, History, Insight, Intimidation, Persuasion; Perception, Survival)",' +
      '"1:Fighting Style","1:Second Wind","1:Weapon Mastery",' +
      '"2:Action Surge","3:Fighter Subclass","5:Extra Attack",' +
      '"5:Tactical Shift","9:Indomitable","9:Tactical Master",' +
      '"11:Two Extra Attacks","13:Studied Attacks","19:Epic Boon",' +
      '"20:Three Extra Attacks",' +
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
      '"1:Tool Proficiency (Choose 1 from any Artisan, any Musical)",' +
      '"1:Save Proficiency (Strength; Dexterity)",' +
      '"1:Skill Proficiency (Choose 2 from Acrobatics, Athletics, History, Insight, Religion, Stealth)",' +
      '"1:Martial Arts","1:Unarmored Defense (Monk)","2:Monk\'s Focus",' +
      '"2:Unarmored Movement","Uncanny Metabolism","3:Deflect Attacks",' +
      '"3:Monk Subclass","4:Slow Fall","5:Extra Attack","5:Stunning Strike",' +
      '"6:Empowered Strikes","7:Evasion","7:Stillness Of Mind",' +
      '"9:Acrobatic Movement","10:Heightened Focus","10:Self-Restoration",' +
      '"13:Deflect Energy Moon","14:Disciplined Survivor","15:Perfect Focus",' +
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
      '"1:Armor Proficiency (Light; Medium; Heavy; Shield)",' +
      '"1:Weapon Proficiency (Simple Weapons; Martial Weapons)",' +
      '"1:Save Proficiency (Wisdom; Charisma)",' +
      '"1:Skill Proficiency (Choose 2 from Athletics, Insight, Intimidation, Medicine, Persuasion, Religion)",' +
      '"1:Lay On Hands","1:Spellcasting","1:Weapon Mastery",' +
      '"2:Fighting Style","2:Paladin\'s Smite","3:Channel Divinity",' +
      '"3:Divine Sense","3:Paladin Subclass","5:Extra Attack",' +
      '"5:Faithful Steed","6:Aura Of Protection","9:Abjure Foes",' +
      '"10:Aura Of Courage","11:Radiant Strikes","14:Restoring Touch",' +
      '"18:Aura Expansion","19:Epic Boon",' +
      '"features.Oath Of Devotion ? 3:Sacred Weapon",' +
      '"features.Oath Of Devotion ? 7:Aura Of Devotion",' +
      '"features.Oath Of Devotion ? 15:Smite Of Protection",' +
      '"features.Oath Of Devotion ? 20:Holy Nimbus" ' +
    'Selectables=' +
      '"3:Oath Of Devotion:Paladin Subclass" ' +
    'SpellAbility=Charisma ' +
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
      '"1:Armor Proficiency (Light; Medium; Shield)",' +
      '"1:Weapon Proficiency (Simple Weapons; Martial Weapons)",' +
      '"1:Save Proficiency (Strength; Dexterity)",' +
      '"1:Skill Proficiency (Choose 3 from Animal Handling, Athletics, Insight, Investigation, Nature, Perception, Stealth, Survival)",' +
      '"1:Favored Enemy","1:Spellcasting","1:Weapon Mastery",' +
      '"2:Deft Explorer","2:Fighting Style","3:Ranger Subclass",' +
      '"5:Extra Attack","6:Roving","9:Expertise","10:Tireless",' +
      '"13:Relentless Hunter","14:Nature\'s Veil","17:Precise Hunter",' +
      '"18:Feral Senses","19:Epic Boon","20:Foe Slayer",' +
      '"features.Hunter ? 3:Hunter\'s Lore",' +
      '"features.Hunter ? 3:Hunter\'s Prey",' +
      '"features.Hunter ? 7:Defensive Tactics",' +
      '"features.Hunter ? 11:Superior Hunter\'s Prey",' +
      '"features.Hunter ? 15:Superior Hunter\'s Defense" ' +
    'Selectables=' +
      '"3:Hunter:Ranger Subclass",' +
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
      'R1:2@1;3@3;4@5,' +
      'R2:2@5;3@7,' +
      'R3:2@9;3@11,' +
      'R4:1@13;2@15;3@17,' +
      'R5:1@17;2@19 ' +
    'MulticlassPrerequisite="dexterity >= 13","wisdom >= 13"',
  'Rogue':
    'HitDie=d8 ' +
    'Features=' +
      '"1:Armor Proficiency (Light)",' +
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
      '"features.Draconic Bloodline ? 3:Draconic Resilience",' +
      '"features.Draconic Bloodline ? 3:Draconic Spells",' +
      '"features.Draconic Bloodline ? 6:Elemental Affinity",' +
      '"features.Draconic Bloodline ? 14:Dragon Wings",' +
      '"features.Draconic Bloodline ? 18:Dragon Companion" ' +
    'Selectables=' +
      '"1:Draconic Sorcery:Sorcerer Subclass",' +
      '"3:Careful Spell:Metamagic","3:Distant Spell:Metamagic",' +
      '"3:Empowered Spell:Metamagic","3:Extended Spell:Metamagic",' +
      '"3:Heightened Spell:Metamagic","3:Quickened Spell:Metamagic",' +
      '"3:Seeking Spell:Metamagic","3:Subtle Spell:Metamagic",' +
      '"3:Transmuted Spell","3:Twinned Spell:Metamagic" ' +
    'SpellAbility=Charisma ' +
    'SpellSlots=' +
      'S0:4@1;5@4;6@10,' +
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
      '"1:Armor Proficiency (Light)",' +
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
SRD5E2024.FEATS = {
  'Alert':'',
  'Magic Initiate (Cleric)':'',
  'Magic Initiate (Druid)':'',
  'Magic Initiate (Wizard)':'',
  'Savage Attacker':'',
  'Skilled':'',
  'Ability Score Increase':'',
  'Grappler':'Require="strength >= 13"',
  'Archery':'',
  'Defense':'',
  'Great Weapon Fighting':'',
  'Two-Weapon Fighting':'',
  'Boon Of Combat Prowess':'',
  'Boon Of Fate':'',
  'Boon Of Irresistible Offense':'',
  'Boon Of Spell Recall':'',
  'Boon Of The Night Spirit':'',
  'Boon Of Truesight':'',
};
SRD5E2024.FEATURES_CHANGED = {

  // Class

  // Barbarian
  'Barbarian Subclass':SRD5E.FEATURES['Primal Path'],
  'Brutal Strike':
    'Section=combat ' +
    'Note="Can forego advantage on a Strength-based attack to inflict +%{levels.Barbarian<17?1:2}d10 HP weapon damage and %{levels.Barbarian<17?\'a choice\':\'2 choices\'} of %{combatNotes.improvedBrutalStrike?\\"disadvantage on the target\'s next save and loss of opportunity attacks for 1 rd, a +5 bonus to the next attack on the target within 1 rd, \\":\'\'}a 15\' push, optionally moving with the target, or -15 Speed for 1 rd"',
  'Primal Knowledge':
    'Section=skill,skill ' +
    'Note=' +
      '"Skill Proficiency (Choose 1 from Animal Handling, Athletics, Intimidation, Nature, Perception, Survival)",' +
      '"Can use Strength for Acrobatics, Intimidation, Perception, Stealth, and Survival"',
  'Danger Sense':
    SRD5E.FEATURES['Danger Sense']
    .replace(' vs. visible dangers', ''),
  'Epic Boon':'Section=feature Note="+1 General Feat"',
  // Extra Attack as SRD5E
  // Fast Movement as SRD5E
  'Feral Instinct':
    SRD5E.FEATURES['Feral Instinct']
    .replace(/\/[^"]*/, ''),
  'Improved Brutal Strike':
    'Section=combat Note="Has increased Brutal Strike effects"',
  // Indomitable Might as SRD5E
  'Instinctive Pounce':
    'Section=combat Note="Can move %{speed//2}\' when entering rage"',
  'Persistent Rage':
    SRD5E.FEATURES['Persistent Rage']
    .replace('Can', 'Can recover all uses of Rage during initiative once per long rest, and can'),
  'Primal Champion':SRD5E.FEATURES['Primal Champion'],
  'Rage':
    SRD5E.FEATURES.Rage
    .replace('1 min', '10 min')
    .replace('unlimited', '6')
    .replace('long rest', 'long rest, regaining 1 use after a short rest'),
  // Reckless Attack as SRD5E
  'Relentless Rage':
    SRD5E.FEATURES['Relentless Rage']
    .replace('1 hit point', '%{levels.Barbarian*2} hit points'),
  // Unarmored Defense (Barbarian) as SRD5E
  // TODO
  'Weapon Mastery':
    'Section=combat '+
    'Note="Can use the mastery properties of %V chosen Simple or Martial Melee weapons"',
  // Berserker
  'Frenzy':
    // changed effects
    'Section=combat ' +
    'Note="Reckless Attack inflicts +%{levels.Barbarian<9?2:levels.Barbarian<16?3:4}d6 HP to the first target each turn"',
  'Intimidating Presence':
    // changed effects
    'Section=combat ' +
    'Note="Can use a bonus action to inflict fear (DC %{8+strengthModifier+proficiencyBonus} ends) on targets for 1 min once per long rest; can expend uses of Rage for additional uses"',
  // Mindless Rage as SRD5E
  // Retaliation as SRD5E

  // Bard
  'Bard Subclass':SRD5E.FEATURES['Bard College'],
  'Bardic Inspiration':
    SRD5E.FEATURES['Bardic Inspiration']
    .replace('10 min', '1 hr'),
  'Countercharm':
    'Section=combat ' +
    // changed effects
    'Note="R30\' Can use a reaction to give a target a reroll with advantage on a save vs. charm or fright"',
  // Epic Boon as above
  'Expertise':
    SRD5E.FEATURES['Expertise']
    .replace('10', '9'),
  'Font Of Inspiration':
    'Section=magic,magic ' +
    // chaned effects
    'Note=' +
      '"Bardic Inspiration refreshes after a short rest",' +
      '"Can expend a spell slot to regain 1 Bardic Inspiration use"',
  // Jack Of All Trades as SRD5E
  'Magical Secrets':
    SRD5E.FEATURES['Magical Secrets']
    .replace(/learn.*spells/, 'learn spells'),
  // Spellcasting as SRD5E
  'Superior Inspiration':
    SRD5E.FEATURES['Superior Inspiration']
    .replace('1 use', '2 uses'),
  'Words Of Creation':
    'Section=magic,magic ' +
    'Note=' +
      '"Knows the <i>Power Word Heal</i> and <i>Power Word Kill</i> spells",' +
      '"Can target 2 creatures within a 10\' radius with <i>Power Word Heal</i> and <i>Power Word Kill</i>" ' +
    'Spells="Power Word Heal","Power Word Kill"',
  // College Of Lore
  // Bonus Proficiencies (College Of Lore) as SRD5E
  // Cutting Words as SRD5E
  'Magical Discoveries':SRD5E.FEATURES['Additional Magical Secrets'],
  // Peerless Skill as SRD5E

  // Cleric
  'Channel Divinity':
    'Section=magic ' +
    // changed effects
    'Note="Can use a Channel Divinity effect %{magicNotes.channelDivinity.1} times per long rest; regains 1 use after a short rest"',
  'Cleric Subclass':SRD5E.FEATURES['Divine Domain'],
  'Divine Intervention':
    'Section=magic ' +
    // changed effects
    'Note="Can cast a level 5 Cleric spell without using a spell slot or material components once per long rest"',
  'Divine Spark':
    'Section=combat ' +
    'Note="R30\' Can use Channel Divinity to restore %Vd8 hit points or to inflict %Vd8 HP of a choice of necrotic or radiant (save Constitution half)"',
  // Divine Strike as SRD5E
  // Epic Boon as above
  'Greater Divine Intervention':
    'Section=magic ' +
    'Note="Can use Divine Intervention to cast <i>Wish</i>; requires 2d4 long rests before using Divine Intervention again" ' +
    'Spells=Wish',
  'Potent Spellcasting (Cleric)':
    'Section=magic,magic ' +
    'Note=' +
      '"Cleric cantrips inflict +%{wisdomModifier} HP",' +
      '"Damaging cantrips give %{wisdomModifier*2} temporary hit points to a target within 60\'"',
  'Protector':
    'Section=combat ' +
    'Note="Armor Proficiency (Heavy)/Weapon Proficiency (Martial Weapons)"',
  'Sear Undead':
    'Section=combat ' +
    'Note="Successful Turn Undead also inflicts %{wisdomModifier>?1}d8 HP radiant"',
  'Thaumaturge':
    'Section=magic,skill ' +
    'Note=' +
      '"Knows +1 Cleric cantrip",' +
      '"+%V Arcana/+%V Wisdom"',
  // Turn Undead as SRD5E
  // Life Domain
  // Blessed Healer as SRD5E
  // Disciple Of Life as SRD5E
  'Life Domain':
    // changed effects
    'Spells=' +
      '"3:Aid","3:Bless","3:Cure Wounds","3:Lesser Restoration",' +
      '"5:Mass Healing Word","5:Revivify",' +
      '"7:Aura Of Life","7:Death Ward",' +
      '"9:Mass Cure Wounds","9:Mass Cure Wounds"',
  // Preserve Life as SRD5E
  'Supreme Healer':
    'Section=magic ' +
    'Note="Healing spells restore the maximum possible hit points"',

  // Druid
  'Archdruid':
    // changed effects
    'Section=combat,feature,magic,magic ' +
    'Note=' +
      '"Has at least 1 use of Wild Shape available after initiative",' +
      '"Ages at 1/10 normal rate",' +
      '"Can use Wild Shape at will",' +
      '"Can convert Wild Shape uses into a spell slot, expending a use for each 2 spell levels"',
  // Beast Spells as SRD5E
  'Druidic':
    // changed effects
    'Section=magic,skill ' +
    'Note=' +
      '"Knows <i>Speak With Animals</i>",' +
      '"Speaks a secret language known only by druids" ' +
    'Spells="Speak With Animals"',
  'Druid Subclass':'Section=feature Note="1 selection"',
  'Elemental Fury':'Section=feature Note="1 selection"',
  // Epic Boon as above
  'Improved Elemental Fury':
    'Section=combat,magic ' +
    'Note=' +
      '"Has increased Elemental Fury effects",' +
      '"Has increased Elemental Fury effects"',
  'Magician':
    'Section=magic,skill ' +
    'Note=' +
      '"Knows +1 Druid cantrip",' +
      '"+%{wisdomModifier>?1} Arcana/+%{wisdomModifer>?1} Nature"',
  'Potent Spellcasting (Druid)':
    'Section=magic ' +
    'Note="Druid cantrips inflict +%{wisdomModifier} HP%{magicNotes.improvedElementalFury?\\" and gain +300 range\\":\'\'}"',
  'Primal Strike':
    'Section=combat ' +
    'Note="Attacks inflict +%{combatNotes.improvedElementalFury?2:1}d8 HP of a choice of cold, fire, lightning, or thunder once per turn"',
  // Spellcasting as above
  'Wild Companion':
    'Section=magic ' +
    'Note="Can expend a spell slot to cast <i>Find Familiar</i>; the summoned animal remains present until the next long rest" ' +
    'Spells="Find Familiar"',
  'Wild Resurgence':
    'Section=magic ' +
    'Note="Can expend a spell slot to gain a Wild Shape use, or expend a Wild Shape to give a level 1 spell slot once per long rest"',
  'Wild Shape':
    'Section=magic ' +
    // changed effects
    'Note="Can transform into a CR %V%{levels.Druid<8?\' (non-flying)\':\'\'} creature with %{levels.Druid} temporary hit points for %{levels.Druid//2} hr %{levels.Druid<6?2:levels.Druid<17?3:4} times per long rest; a short restores 1 use"',
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
  'Circle Of The Land':
    'Section=magic,magic ' +
    'Note=' +
      '"Has the Arid Land, Polar Land, Temparate Land, and Tropical Land features",' +
      '"Can choose spells from 1 type of land to have prepared after a long rest"',
  'Natural Recovery':
    SRD5E.FEATURES['Natural Recovery']
    .replace('recover', 'cast 1 Druid spell without using a spell slot and recover'),
  "Nature's Sanctuary":
    'Section=combat ' +
    // changed effects
    'Note="R120\' 15\' cube of spectral vines and trees can move 60\' as a bonus action and gives allies Nature\'s Ward resistance and self and allies half cover for 1 min"',
  "Nature's Ward":
    'Section=save ' +
    // changed effects
    'Note="Has immunity to poisoned and resistance to fire, cold, lightning or poison depending on whether Circle Spells are current taken from Arid, Polar, Temparate, or Tropical Land"',
  // TODO These SRD5E features raise errors in featureRules
  'Circle Of The Land (Arctic)':'Section=magic Note=""',
  'Circle Of The Land (Coast)':'Section=magic Note=""',
  'Circle Of The Land (Desert)':'Section=magic Note=""',
  'Circle Of The Land (Forest)':'Section=magic Note=""',
  'Circle Of The Land (Grassland)':'Section=magic Note=""',
  'Circle Of The Land (Mountain)':'Section=magic Note=""',
  'Circle Of The Land (Swamp)':'Section=magic Note=""',

  // Fighter
  // Action Surge as SRD5E
  // Epic Boon as above
  // Extra Attack as above
  'Fighter Subclass':'Section=feature Note="1 selection"',
  'Fighting Style':'Section=feature Note="+1 Fighting Style Feat"',
  // Indomitable as SRD5E
  'Second Wind':
    'Section=combat ' +
    // changed effects
    'Note="Can use a bonus action to regain 1d10+%{levels.Fighter} hit points %V times per long rest; can regin 1 use after a short rest"',
  'Studied Attacks':
    'Section=combat ' +
    'Note="Missed attack gives advantage on the next attack on the same target within 1 rd"',
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
  'Heroic Warrior':
    'Section=combat ' +
    'Note="Can give self Heroic Inspiration at the start of each turn"',
  // Improved Critical as SRD5E
  'Remarkable Athlete':
    // changed effects
    'Section=combat,skill ' +
    'Note=' +
      '"Has advantage on initiative and can move %{speed//2}\' after scoring a critical hit without provoking opportunity attacks",' +
      '"Has advantage on Athletics"',
  // Superior Critical as SRD5E
  'Survivor':
    // changed effects
    'Section=combat,save ' +
    'Note=' +
      '"Regains %{constitutionModifier+5} hit points each rd when between 1 and %{hitPoints//2} hit points",' +
      '"Has advantage on death saving throws, and a roll of 18-19 on one gains the benefits of a 20"',

  // Monk
  'Acrobatic Movement':
    'Section=ability ' +
    'Note="Can move across vertical surfaces and liquids when unarmored"',
  'Body And Mind':'Section=ability Note="+4 Dexterity/+4 Wisdom"',
  'Deflect Attacks':
    SRD5E.FEATURES['Deflect Missiles']
    .replace(' missile', "%{combatNotes.deflectEnergy?'':' suffered bludgeoning, piercing, or slashing'}")
    .replace('make an immediate attack', 'redirect 2d%{combatNotes.martialArts} HP to an adjacent creature (DC %{monkSaveDC} save Dexterity negates), or a creature within 60\' if the damage came from a ranged attack'),
  'Deflect Energy':
    'Section=combat Note="Has increased Deflect Attacks effects"',
  'Disciplined Survivor':SRD5E.FEATURES['Diamond Soul'],
  // Epic Boon as above
  // Extra Attack as above
  'Empowered Strikes':
    'Section=combat Note="Can inflict force damage with Unarmed Strikes"',
  // Evasion as SRD5E
  'Flurry Of Blows':
    SRD5E.FEATURES['Flurry Of Blows']
    .replace('ki point', 'focus point')
    .replace('2 unarmed', '%{combatNotes.heightenedFocus?3:2} unarmed'),
  'Heightened Focus':
    'Section=combat Note="Has increased Monk\'s Focus effects"',
  'Martial Arts':
    'Section=combat,combat ' +
    // changed effects
    'Note=' +
      '"Attacks inflict 1d%V when unarmored and wielding only monk weapons",' +
      '"When unarmored and wielding only monk weapons, can use a bonus action to make an Unarmed Strike and gains +%{dexterityModifier-strengthModifier>?0} (using Dexterity instead of Strength) on attacks, damage, grapples, and shoves"',
  'Monk Subclass':'Section=feature Note="1 selection"',
  "Monk's Focus":
    'Section=combat,feature ' +
    'Note=' +
      '"Has the Flurry Of Blows, Patient Defense, and Step Of The Wind features",' +
      '"Can use %{levels.Monk} focus points per short rest"',
  'Patient Defense':
    'Section=combat ' +
    // changed effects
    'Note="Can use a bonus action to Disengage, optionally spending 1 focus point to Dodge%{combatNotes.heightenedFous?\' and gain %2d{combatNotes.martialArts} temporary hit points\':\'\'}"',
  'Perfect Focus':
    SRD5E.FEATURES['Perfect Self']
    .replace('ki', 'focus'),
  'Self-Restoration':
    'Section=save ' +
    'Note="Can end a charmed, frightened, or poisoned condition affecting self at the end of each turn, and does not suffer exhaustion from lack of food or drink"',
  // Slow Fall as SRD5E
  'Step Of The Wind':
    'Section=combat ' +
    // changed effects
    'Note="Can use a bonus action to Dash, optionally spending 1 focus point to Disengage and to double jump distance%{combatNotes.heightenedFocus?\'; can bring along 1 Large creature when moving\':\'\'}"',
  'Stunning Strike':
    SRD5E.FEATURES['Stunning Strike']
    .replace('negates', 'inflicts half Speed'),
  'Superior Defense':
    'Section=save ' +
    'Note="Can spend 3 focus points to gain resistance to non-force damage for 1 min"',
  'Unarmored Movement':
    // changed effects
    'Section=ability Note="+%{(levels.Monk+6)//4*5} Speed in no armor"',
  // Unarmored Defense (Monk) as SRD5E
  'Uncanny Metabolism':
    'Section=combat ' +
    'Note="Can regain all focus points and 1d%{combatNotes.martialArts}+%{levels.Monk} hit points at initiative once per long rest"',
  // Warrior Of The Open Hand
  'Fleet Step':
    'Section=combat ' +
    'Note="Can use Step Of The Wind immediately after another bonus action"',
  // Open Hand Technique as SRD5E
  'Quivering Palm':
    'Section=combat ' +
    // changed effects
    'Note="Can spend 4 ki points after a successful unarmed attack to inflict 10d12 force (save DC %{kiSaveDC} Constitution half) at any time within %{levels.Monk} days"',
  'Wholeness Of Body':
    SRD5E.FEATURES['Wholeness Of Body']
    .replace('%{levels.Monk*3}', '1d%{combatNotes.martialArts}+%{wisdomModifier}')
    .replace('once', "%{wisdomModifier>1?wisdomModifier+\' times\':\'once\'}"),

  // Paladin
  'Abjure Foes':
    'Section=combat ' +
    'Note="R60\' Can use Channel Divinity to frighten targets (save Wisdom negates; taking damage ends) for 1 min"',
  'Aura Expansion':'Section=combat Note="Has increased Aura effects"',
  // Aura Of Courage as SRD5E
  // Aura Of Protection as SRD5E
  // Channel Divinity as above
  'Divine Sense':
    'Section=skill ' +
    // changed effects
    'Note="R60\' Can use Channel Divinity to sense the location of celestials, fiends, undead, consecration, and desecration for 10 min"',
  // Epic Boon as above
  // Extra Attack as above
  'Faithful Steed':
    'Section=magic Note="Can cast <i>Find Steed</i> once per long rest"',
  'Lay On Hands':
    SRD5E.FEATURES['Lay On Hands']
    .replace('disease or ', ''),
  // TODO: Blessed Warrior cantrips instead of the extra Fighting Style feat
  // Fighting Style as above
  "Paladin's Smite":
    'Section=magic Note="Can cast <i>Divine Smite</i> once per long rest"',
  'Paladin Subclass':'Section=feature Note="1 selection"',
  'Radiant Strikes':SRD5E.FEATURES['Improved Divine Smite'],
  'Restoring Touch':
    'Section=magic ' +
    'Note="Can use 5 hit points\' worth of Lay On Hands to remove blinded, charmed, deafened, frightened, paralyzed, and stunned conditions"',
  // Spellcasting as above
  // Weapon Mastery as above
  // Oath Of Devotion
  // Aura Of Devotion as SRD5E
  'Holy Nimbus':
    SRD5E.FEATURES['Holy Nimbus']
    .replaceAll('1 min', '10 min')
    .replace('spells by ', '')
    .replace('long rest', 'long rest; can spend level 5 spell slots for additional uses')
    .replace('10 HP', '%{charismaModifier+proficiencyBonus} HP'),
  'Oath Of Devotion':
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
    'Note="R{%levels.Paladin<18?10:30}\' using Divine Smite gives self and allies half cover"',

  // Ranger
  'Deft Explorer':
    'Section=skill,skill ' +
    'Note=' +
      '"Language (Choose 2 from any)",' +
      '"+%{proficiencyBonus} on a choice of proficient skill"',
  'Druidic Warrior':
    'Section=magic ' +
    'Note="Knows 2 Druid cantrips; can replace 1 of them when gaining a Ranger level"',
  // Expertise as above
  'Favored Enemy':
    'Section=magic ' +
    // changed effects
    'Note="Can cast <i>Hunter\'s Mark</i> %{(levels.Ranger+7)//4} times per long rest" ' +
    'Spells="Hunter\'s Mark"',
  // Epic Boon as above
  // Extra Attack as above
  'Feral Senses':
    // changed effects
    'Section=skill Note="Has 30\' blindsight"',
  // Fighting Style as above TODO or Druidic Warrior
  'Foe Slayer':
    'Section=magic Note="<i>Hunter\'s Mark</i> inflicts d10 damage"',
  "Nature's Veil":
    'Section=magic Note="Can become invisible until the end of the next turn %{wisdomModifier>1?wisdomModifier+\' times\':\'once\'} per long rest"',
  'Precise Hunter':
    'Section=combat ' +
    'Note="Has advantage on attacks vs. <i>Hunter\'s Mark</i> target"',
  'Ranger Subclass':'Section=feature Note="1 selection"',
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
      '"Can use an action to get 1d8+%{wisdomModifier>?1} temporary hit points %{wisdomModifier>1?wisdomModifier+\' times\':\'once\'} per short rest",' +
      '"Exhaustion level decreases by 1 after a short rest"',
  // Weapon Mastery as above
  // Hunter
  // Colossus Slayer as SRD5E
  'Defensive Tactics':
   'Section=combat ' +
   // changed effects
   'Note="Has the Escape The Horde and Multiattack Defense features; can choose 1 to be active after each rest"',
  // Escape The Horde as SRD5E
  // Horde Breaker as SRD5E
  "Hunter's Prey":
   'Section=combat ' +
   // changed effects
   'Note="Has the Colossus Slayer and Horde Breaker features; can choose 1 to be active after each rest"',
  'Multiattack Defense':
    'Section=combat ' +
    // changed effects
    'Note="Successful attackers suffer disadvantage on additional attacks on self in the same turn"',
  "Superior Hunter's Prey":
    'Section=combat ' +
    'Note="Can inflict <i>Hunter\'s Prey</i> damage to a second creature within 30\' of the target"',
  "Superior Hunter's Defense":
    'Section=save ' +
    'Note="Can use a reaction upon taking damage to gain resistance to that type of damage until the end of the current turn"',

  // Rogue
  // Cunning Action as SRD5E
  'Cunning Strike':
    'Section=combat ' +
    'Note="Can reduce Sneak Attack damage to inflict %{combatNotes.improvedCunningStrike?\'2 choices of\':\'a choice of\'}: %{combatNotes.deviousStrikes?\'limitation to 1 action or move on the target\'s next turn (reduces damage by 2d6 HP), unconsciousness (reduces damage by 6d6 HP) (save Constitition ends) for 1 min, blindness (reduces damage by 3d6) until the end of its next turn, \':\'\'}poisoned (reduces damage by 1d6 HP) (save Constitution ends) for 1 min, prone (reduces damage by 1d6 HP) (save Dexterity negates), or to move %{speed//2}\' without provoking opportunity attacks (reduces damage by 1d6 HP)"',
  'Devious Strikes':
    'Section=combat Note="Has increased Cunning Strike effects"',
  // Elusive as SRD5E
  // Epic Boon as above
  // Evasion as above
  // Expertise as above
  'Improved Cunning Strike':
    'Section=combat Note="Has increased Cunning Strike effects"',
  // Reliable Talent as SRD5E
  'Rogue Subclass':'Section=feature Note="1 selection"',
  'Slippery Mind':
    SRD5E.FEATURES['Slippery Mind']
    .replace('Wisdom', 'Charisma; Wisdom'),
  // Sneak Attack as SRD5E
  'Steady Aim':
    'Section=combat ' +
    'Note="Can forego move to gain advantage on the next attack in the same turn"',
  'Stroke Of Luck':
    'Section=combat ' +
    // changed effects
    'Note="Can take an automatic 20 on an ability check once per short rest"',
  "Thieves' Cant":
    SRD5E.FEATURES["Thieves' Cant"]
    .replace('skill', 'skill,skill')
    .replace('Note=', 'Note="Language (Choose 1 from any)",'),
  'Uncanny Dodge':
    'Section=combat ' +
    'Note="Can use a reaction to reduce the damage from a seen attacker by half"',
  // Weapon Mastery as above
  // Thief
  'Fast Hands':
    SRD5E.FEATURES['Fast Hands']
    .replace('use Sleight Of Hand, ', ''),
  'Second-Story Work':
    SRD5E.FEATURES['Second-Story Work']
    .replace('dexterityModifier', 'dexterityModifier-strengthModifier'),
  'Supreme Sneak':
    'Section=combat ' +
    // changed effects
    'Note="Can use Cunning Strike to attack while invisible from hiding without becoming visible"',
  // Thief's Reflexes as SRD5E
  'Use Magic Device':
    'Section=skill ' +
    // changed effects
    'Note="Can attune 4 magic items, use cantrip and level 1 spell scrolls reliably, and use higher-level spell scrolls with a successful DC 10 + spell level Arcana check"',

  // Sorcerer
  'Arcane Apotheosis':
    'Section=magic ' +
    'Note="While using Innate Sorcery, can use 1 Metamagic option each turn without spending Sorcery Points"',
  // Epic Boon as above
  // Font Of Magic as SRD5E
  'Innate Sorcery':
    'Section=magic ' +
    'Note="Can gain +1 spell DC and spell attacks for 1 min 2 times per long rest"',
  // Metamagic as SRD5E
  'Sorcerer Subclass':'Section=feature Note="1 selection"',
  'Sorcerous Restoration':
    SRD5E.FEATURES['Sorcerous Restoration']
    .replace('4', '%{level//2}'),
  'Sorcery Incarnate':
    'Section=magic ' +
    'Note="Can spend 2 Sorcery Points for additional uses of Innate Sorcery, and can use 2 Metamagic options on each spell"',
  // Spellcasting as above
  // Metamagic
  'Careful Spell':
    SRD5E.FEATURES['Careful Spell']
    .replace('successful save', 'successful save and no damage instead of half'),
  // Distant Spell as SRD5E
  // Empowered Spell as SRD5E
  'Extended Spell':
    SRD5E.FEATURES['Extended Spell']
    .replace('maximum', 'maximum, and to gain advantage on any concentration saves'),
  // Heightened Spell as SRD5E
  // Quickened Spell as SRD5E
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
  // Draconic Resilience as SRD5E
  'Draconic Spells':
    'Spells=' +
      '"3:Alter Self","3:Chromatic Orb","3:Command","3:Dragon\'s Breath",' +
      '"5:Fear","5:Fly",' +
      '"7:Arcane Eye","7:Charm Monster",' +
      '"9:Legend Lore","9:Summon Dragon"',
  'Dragon Companion':
    'Section=magic ' +
    'Note="Can cast <i>Summon Dragon</i> without material components once per long rest, and can make the duration 1 min instead of concentration" ' +
    'Spells="Summon Dragon"',
  'Dragon Wings':
    'Section=ability ' +
    // changed effects
    'Note="Can use a bonus action to gain a 60\' fly Speed for 1 hr once per long rest; can spend 3 sorcery points fro additional uses"',
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
    'Section=magic ' +
    // changed effects
    'Note="Magical Cunning restores all expended spell slots"',
  // Epic Boon as above
  'Magical Cunning':
    'Section=magic ' +
    'Note="Can use a 1 min process to regain a Pact Magic spell slot up to level %{(level+1)//2} once per long rest"',
  // Mystic ARcanum as SRD5E
  // Pact Magic as SRD5E
  'Warlock Subclass':'Section=feature Note="1 selection"',
  // Eldritch Invocations
  'Agonizing Blast':
    SRD5E.FEATURES['Agonizing Blast']
    .replace('<i>Eldritch Blast<i>', 'Chosen Warlock cantrip'),
  // Armor Of Shadows as SRD5E
  // Ascendant Step as SRD5E
  // Devil's Sight as SRD5E
  'Devouring Blade':
    'Section=combat Note="Has increased Thirsting Blade effects"',
  'Eldritch Mind': // ref Tasha
    'Section=magic ' +
    'Note="Has advantage on Constitution saves to maintain concentration"',
  'Eldritch Smite':
    'Section=combat Note="Can spend a spell slot to inflict +1d8 + 1d8 per spell level with a pact weapon, and to inflict prone on a Huge or smaller target"',
  'Eldritch Spear':
    // changed effects
    'Section=magic ' +
    'Note="Increases the range of a chosen Warlock cantrip to %{30*levels.Warlock}\'"',
  'Fiendish Vigor':
    SRD5E.FEATURES['Fiendish Vigor']
    .replace('at will', 'at will, gaining the maximum possible temporary hit points'),
  'Gaze Of Two Minds':
    SRD5E.FEATURES['Gaze Of Two Minds']
    .replace('humanoid', "humanoid, and cast spells through it when within 60'"),
  'Gift Of The Depths':
    'Section=ability,magic ' +
    'Note=' +
      '"Has a %{speed}\' swim Speed and can breathe water",' +
      '"Can cast <i>Water Breathing</i> once per long rest" ' +
    'Spells="Water Breathing"',
  'Gift Of The Protectors': // ref Tasha
    'Section=magic ' +
    'Note="Creatures who have written their names in the Book Of Shadows retain 1 hit point when reduced to 0 hit points once per long rest"',
  'Investment Of The Chain Master': // modified from Tasha
    'Section=magic ' +
    'Note="Familiar gains a 40\' fly or swim Speed, can inflict a choice of necrotic or radiant damage, and inflicts DC %{spellDifficultyClass.K} saves; self can use a bonus action to command it to attack and a reaction to give it resistance to damage"',
  'Lessons Of The First Ones':'Section=feature Note="+1 Origin Feat"',
  'Lifedrinker':
    'Section=combat ' +
    // changed effects
    'Note="Can inflict +1d6 HP of a choice of necrotic, psychic, or radiant damage, plus expend a Hit Point Die to regain hit points, once per turn"',
  // Mask Of Many Faces as SRD5E
  // Master Of Myriad Forms as SRD5E
  // Misty Visions as SRD5E
  'One With Shadows':
    'Section=magic ' +
    // changed effects
    'Note="Can cast Invisibility on self in dim light at will" ' +
    'Spells=Invisibility',
  // Otherworldly Leap as SRD5E
  'Pact Of The Blade':
    'Section=magic ' +
    // changed effects
    'Note="Can use a bonus action to create a bonded simple or martial pact weapon or to bond with a touched magic weapon, giving proficiency with it, use as a spellcasting focus, and Charisma-based attacks that inflcit a choice of necrotic, psychic, radiant, or normal damage type; moving 5\' away from the weapon for 1 min ends the bond"',
  'Pact Of The Chain':
    SRD5E.FEATURES['Pact Of The Chain']
    .replace(' as a ritual', ''),
  'Pact Of The Tome':
    SRD5E.FEATURES['Pact Of The Tome']
   .replace('cantrips and 2 level 1 rituals'),
  'Repelling Blast':
    SRD5E.FEATURES['Repelling Blast']
    .replace('<i>Eldritch Blast</i>', 'attack using a chosen Warlock cantrip'),
  'Thirsting Blade':
    SRD5E.FEATURES['Thirsting Blade']
    .replace('2', '%{magicNotes.devouringBlade?3:2}'),
  // Visions Of Distant Realms as SRD5E
  // Whispers Of The Grave as SRD5E
  // Witch Sight as SRD5E
  // Fiend Patron
  "Dark One's Blessing":
    SRD5E.FEATURES["Dark One's Blessing"]
    .replace('Reducing', "R10' Self or an ally reducing"),
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
    .replace(' from non-magical and non-silver weapons', ''),
  'Hurl Through Hell':
    SRD5E.FEATURES['Hurl Through Hell']
    .replace('10d10', '8d10')
    .replace('1 rd', '1 rd (save Charisma negates)')
    .replace('long rest', 'long rest; can expend spell slots for additional uses'),

  // Wizard
  // Arcane Recovery as SRD5E
  'Memorize Spell':
    'Section=magic ' +
    'Note="Can replace a prepared spell at the end of a short rest"',
  'Ritual Adept':
    'Section=magic Note="Can cast spells marked with [R] as rituals"',
  'Scholar':
    'Section=skill ' +
    'Note="+%{proficiencyBonus} in a choice of proficient Arcana, History, Investigation, Medicine, Nature, or Religion"',
  // Signature Spells as SRD5E
  'Spell Mastery':
    SRD5E.FEATURES['Spell Mastery']
    .replace('the choices', 'one choice')
    .replace('8 hr or study', 'a long rest'),
  // Spellcasting as above
  'Wizard Subclass':'Section=feature Note="1 selection"',
  // Evoker
  // Empowered Evocation as SRD5E
  'Evocation Savant':
    'Section=magic ' +
    // changed effects
    'Note="Can copy 1 evocation spell of each level into spellbook for free"',
  // Overchannel as SRD5E
  'Potent Cantrip':
    SRD5E.FEATURES['Potent Cantrip']
    .replace('successful save', 'miss or successful save'),
  // Sculpt Spells as SRD5E

  // Species
  'Small':
    'Section=combat Note="Has disadvantage on attacks with heavy weapons"',

  // Dragonborn
  'Breath Weapon':
    'Section=combat ' +
    'Note="Choice of a 15\' cone or a 30\' line inflicts %{(level+7)//6}d10 HP %{breathWeaponEnergy} (save DC %{8+constitutionModifier+proficiencyBonus} Constitution half) %{proficiencyBonus} times per long rest"',
  'Damage Resistance':
    'Section=save Note="Has resistance to %{breathWeaponEnergy} damage"',
  'Darkvision':'Section=feature Note="R%V\' Sees one light level better"',
  'Draconic Ancestry':'Section=feature Note="1 selection"',
  'Draconic Flight':
    'Section=ability ' +
    'Note="Can use a bonus action to gain a %{speed} fly Speed once per long rest"',

  // Dwarf
  // Darkvision as above
  // Dwarven Resilience as SRD5E
  // Dwarven Toughness as SRD5E
  'Stonecunning':
    // changed effects
    'Section=skill ' +
    'Note="Can use a bonus action to gain 60\' Tremorsense to 10 min %{proficiencyBonus} times per long rest"',

  // Elf
  // Darkvision as above
  'Drow':
    'Section=feature,magic ' +
    'Note=' +
      '"Has increased Darkvision effects",' +
      '"Knows the <i>Dancing Lights</i> cantrip%{level>2?\' and can cast <i>Faerie Fire</i>\'+(level>4?\' and <i>Darkness</i>\':\'\')+\' once per long rest\':\'\'}" ' +
    'Spells="Dancing Lights","3:Faerie Fire","5:Darkness"',
  'Elven Lineage':'Section=feature Note="1 selection"',
  'Fey Ancestry':
    // changed effects
    'Section=save Note="Has advantage vs. charm"',
  'Drow':
    'Section=magic ' +
    'Note=' +
      '"Knows 1 Wizard cantrip that can be changed after a long rest%{level>2?\' and can cast <i>Detect Magic</i>\'+(level>4?\' and <i>Misty Step</i>\':\'\')+\' once per long rest\':\'\'}" ' +
    'Spells="3:Detect Magic","5:Misty Step"',
  'Keen Senses':
    // changed effects
    'Section=skill ' +
    'Note="Skill Proficiency (Choose 1 from Insight, Perception, or Survival)"',
  // Trance as SRD5E
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
    'Section=magic,magic ' +
    'Note=' +
      '"Knows the <i>Mending</i> and <i>Prestidigitation</i> cantrips",' +
      '"Can use <i>Prestidigitation</i> to create a Tiny clockwork device in 10 min" ' +
    'Spells="Mending","Prestidigitation"',

  // Goliath
  "Cloud's Jaunt":
    'Section=combat Note="Can use a bonus action to teleport 30\'"',
  "Fires's Burn":
    'Section=combat Note="Can inflict +1d10 HP fire with an attack"',
  "Frost's Chill":
    'Section=combat ' +
    'Note="Can inflict +1d6 HP cold and -10 Speed for 1 rd with an attack"',
  'Giant Ancestry':'Section=feature Note="1 selection"',
  "Hill's Tumble":
    'Section=combat ' +
    'Note="Can inflict prone on a Large or smaller target with an attack"',
  'Powerful Build':
    'Section=ability,combat ' +
    'Note=' +
      '"x2 Carry/x2 Lift",' +
      '"Has advantage on checks to break a grapple"',
  "Stone's Endurance":
    'Section=combat ' +
    'Note="Can use a reaction to reduce damage taken by 1d12+%{constitutionModifier} HP"',
  "Storm's Thunder":
    'Section=combat ' +
    'Note="Can use a reaction in response to damage from a foe within 60\' to inflict 1d8 HP thunder on it"',

  // Halfling
  // Brave as SRD5E
  // Halfling Nimbleness as SRD5E
  'Luck':SRD5E.FEATURES['Lucky (Halfling)'],
  // Naturally Stealthy as SRD5E

  // Human
  'Resourceful':
    'Section=feature Note="Gains Heroic Inspiration at the end of a long rest"',
  'Skillful':'Section=skill Note="Skill Proficiency (Choose 1 from any)"',
  'Versatile':'Section=feature Note="+1 Origin Feat"',

  // Orc
  'Adrenaline Rush':
    'Section=combat ' +
    'Note="Can use a bonus action to Dash and gain %{proficiencyBonus} temporary it points %{proficiencyBonus} times per short rest"',
  // Darkvision as above
  // Relentless Endurance as SRD5E

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
SRD5E2024.FEATURES =
  Object.assign({}, SRD5E.FEATURES, SRD5E2024.FEATURES_CHANGED);
SRD5E2024.GOODIES = SRD5E.GOODIES;
SRD5E2024.LANGUAGES = {
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
SRD5E2024.SPECIES = {
  'Dragonborn':
    'Size=Medium ' +
    'Speed=30 ' +
    'Features=' +
      '"1:Draconic Ancestry","1:Breath Weapon","1:Damage Resistance",' +
      '"1:Darkvision","5:Draconic Flight" ' +
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
  'Dwarf':
    'Size=Medium ' +
    'Speed=30 ' +
    'Features=' +
      '"1:Darkvision","1:Dwarven Resilience","1:Dwarven Toughness"',
  'Elf':
    'Size=Medium ' +
    'Speed=30 ' +
    'Features=' +
      '"1:Darkvision","1:Elven Lineage","1:Fey Ancestry","1:Keen Senses",' +
      '"1:Trance" ' +
    'Selectables=' +
      '"1:Drow:Elven Lineage",' +
      '"1:High Elf:Elven Lineage",' +
      '"1:Wood Elf:Elven Lineage"',
  'Gnome':
    'Size=Small ' +
    'Speed=30 ' +
    'Features=' +
      '"1:Darkvision","1:Gnomish Cunning","1:Gnomish Lineage" ' +
    'Selectables=' +
      '"1:Forest Gnome:Gnomish Lineage",' +
      '"1:Rock Gnome:Gnomish Lineage"',
  'Goliath':
    'Size=Medium ' +
    'Speed=35 ' +
    'Features=' +
      '"1:Giant Ancestry","1:Powerful Build","5:Large Form",' +
      '"features.Cloud Giant ? 1:Cloud\'s Jaunt",' +
      '"features.Fire Giant ? 1:Fire\'s Burn",' +
      '"features.Frost Giant ? 1:Frost\'s Chill",' +
      '"features.Hill Giant ? 1:Hill\'s Tumble",' +
      '"features.Stone Giant ? 1:Stone\'s Endurance",' +
      '"features.Storm Giant ? 1:Storm\'s Thunder" ' +
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
      '"1:Darkvision","1:Fiendish Legacy","1:Otherworldly Presence" ' +
    'Selectables=' +
      '"1:Abyssal:Fiendish Legacy",' +
      '"1:Chthonic:Fiendish Legacy",' +
      '"1:Infernal:Fiendish Legacy"'
};
SRD5E2024.SCHOOLS = {
  'Abjuration':'',
  'Conjuration':'',
  'Divination':'',
  'Enchantment':'',
  'Evocation':'',
  'Illusion':'',
  'Necromancy':'',
  'Transmutation':''
};
SRD5E2024.SHIELDS = {
  'None':'AC=0',
  'Shield':'AC=2'
};
 SRD5E2024.SKILLS = {
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
SRD5E2024.SPELLS = {

  'Aura Of Life':
    'School=Abjuration ' +
    'Level=C4,P4 ' +
    'Description="TODO"',
  'Charm Monster':
    'School=Enchantment ' +
    'Level=B4,D4,K4,S4,W4 ' +
    'Description="TODO"',
  'Chromatic Orb':
    'School=Evocation ' +
    'Level=S1,W1 ' +
    'Description="TODO"',
  "Dragon's Breath":
    'School=Transmutation ' +
    'Level=S2,W2 ' +
    'Description="TODO"',
  'Power Word Heal':
    'School=Enchantment ' +
    'Level=B9,C9 ' +
    'Description="TODO"',
  'Ray Of Sickness':
    'School=Necromancy ' +
    'Level=S1,W1 ' +
    'AtHigherLevels="inflicts +1d8 HP" ' +
    'Description="R60\' Ranged spell inflicts 2d8 HP poison and poisoned for 1 rd"',
  'Summon Dragon':
    'School=Conjuration ' +
    'Level=W5 ' +
    'Description="TODO"',

  'Acid Arrow':
    'School=Evocation ' +
    'Level=W2 ' +
    'AtHigherLevels="inflicts +1d4 HP initial and secondary" ' +
    'Description=' +
      '"R90\' Ranged spell inflicts 4d4 HP acid, plus 2d4 HP the following rd (miss half initial HP only)"',
  'Acid Splash':
    'School=Conjuration ' +
    'Level=S0,W0 ' +
    'Description=' +
      '"R60\' Inflicts %{(level+7)//6}d6 HP acid (save Dexterity negates) on a single target or 2 adjacent targets"',
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
      '"R30\' Convinces target beast that self is harmless (save Wisdom negates; Intelligence 4 or higher immune) for 1 day or until harmed"',
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
      '"10\' radius prevents the passage of living creatures for concentration up to 1 hr"',
  'Antimagic Field':
    'School=Abjuration ' +
    'Level=C8,W8 ' +
    'Description="10\' radius suppresses magic for concentration up to 1 hr"',
  'Antipathy/Sympathy':
    'School=Enchantment ' +
    'Level=D8,W8 ' +
    'Description=' +
      '"R60\' Target object or 200\' cubic area repels or attracts specified creatures for 10 days"',
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
      '"R120\' Large force hand (Armor Class 20, %{hitPoints} hit points, Strength 26, Dexterity 10) can move 60\' per rd and can punch (inflicts 4d8 HP force), push 5\' (save DC 26 Athletics negates), grapple (may crush, inflicting 2d6+%{mdf} HP bludgeoning), and block for concentration up to 1 min"',
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
      '"Divinations on a willing target report false information for 24 hr"',
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
      '"R30\' 3 targets suffer -1d4 on attacks and saving throws (save Charisma negates) for concentration up to 1 min"',
  'Banishment':
    'School=Abjuration ' +
    'Level=C4,K4,P4,S4,W4 ' +
    'AtHigherLevels="affects +1 target" ' +
    'Description=' +
      '"R60\' Banishes the target to its home plane or a demiplane (save Charisma negates) for concentration up to 1 min"',
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
    'AtHigherLevels="extends the maximum duration to 10 min, 8 hr, 24 hr, or permanently at level 4, 5, 7, or 9" ' +
    'Description=' +
      '"Touched suffers a choice of disadvantage on specified ability rolls, disadvantage on attacks on self, requiring a successful Wisdom save to take any action, or +1d8 HP necrotic from self attacks (save Wisdom negates) for concentration up to 1 min"',
  'Black Tentacles':
    'School=Conjuration ' +
    'Level=W4 ' +
    'Description=' +
      '"R90\' 20\' sq inflicts 3d6 HP bludgeoning and restrains (save Dexterity negates, Strength or Dexterity breaks free) for concentration up to 1 min"',
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
      '"R60\' 20\' radius suppresses a choice of charm and fright or hostility (save Charisma negates) for concentration up to 1 min"',
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
      '"R30\' Target regards self as a friend (save Wisdom negates) for 1 hr or until harmed"',
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
      '"R60\' Target obeys a one-word command from self (save Wisdom negates) for 1 rd"',
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
      '"R90\' Creatures in a 10\' radius randomly: 10% wander; 50% do nothing; 20% attack an adjacent creature; 20% act normally (save Wisdom negates) for concentration up to 1 min"',
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
      '"Contact with an extraplanar being inflicts 6d6 HP psychic and insanity on self until a long rest (save DC 15 Intelligence negates and gives 5 one-word answers)"',
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
      '"R300\' Water in a 100\' cube rises 20\', parts, redirects, or forms a whirlpool for concentration up to 10 min"',
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
    'Description="Touched retains 1 HP when next reduced to 0 HP or survives the next death effect within 8 hrs"',
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
      '"Changes the appearance of self body and clothing for 1 hr; physical investigation detects the illusion"',
  'Disintegrate':
    'School=Transmutation ' +
    'Level=S6,W6 ' +
    'AtHigherLevels="inflicts +3d6 HP" ' +
    'Description=' +
      '"R60\' Inflicts 10d6+40 HP force and turns the target to dust if reduced to 0 HP (save Dexterity negates), or disintegrates a Large or smaller object or magical force"',
  'Dispel Evil And Good':
    'School=Abjuration ' +
    'Level=C5,P5 ' +
    'Description=' +
      '"Celestials, elementals, fey, fiends, and undead suffer disadvantage on attacks vs. self for concentration up to 1 min; a successful spell attack returns them to their home plane (save Charisma negates), and touch also ends their enchantment, fright, or possession on the creature touched"',
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
      '"R30\' Inflicts death on targets with up to 20 HP, stunned on those with up to 30 HP, blinded on those with up to 40 HP, and deafened on those with up to 50 HP, and forces them to return to their home planes (save Charisma negates)"',
  'Dominate Beast':
    'School=Enchantment ' +
    'Level=D4,S4 ' +
    'AtHigherLevels="extends the duration to 10 min, 1 hr, or 8 hr at level 5, 6, or 7" ' +
    'Description=' +
      '"R60\' Target beast obeys telepathic commands (save Wisdom negates; damage allows another save) for concentration up to 1 min"',
  'Dominate Monster':
    'School=Enchantment ' +
    'Level=B8,K8,S8,W8 ' +
    'AtHigherLevels="extends the duration to 8 hr" ' +
    'Description=' +
      '"R60\' Target creature obeys telepathic commands (save Wisdom negates; damage allows another save) for concentration up to 1 hr"',
  'Dominate Person':
    'School=Enchantment ' +
    'Level=B5,S5,W5 ' +
    'AtHigherLevels="extends the duration to 10 min, 1 hr, or 8 hr at level 6, 7, or 8" ' +
    'Description=' +
      '"R60\' Target humanoid obeys telepathic commands (save Wisdom negates; damage allows another save) for concentration up to 1 min"',
  'Dream':
    'School=Illusion ' +
    'Level=B5,K5,W5 ' +
    'Description=' +
      '"Touched controls the dreams of a known target for 8 hr and can inflict 3d6 HP psychic (save Wisdom negates)"',
  'Druidcraft':
    'School=Transmutation ' +
    'Level=D0 ' +
    'Description=' +
      '"R30\' Predicts 24 hr weather, causes a plant to bloom, creates a minor sensory effect, or lights or snuffs a small fire"',

  'Earthquake':
    'School=Evocation ' +
    'Level=C8,D8,S8 ' +
    'Description=' +
      '"R500\' 100\' radius opens fissures, damages structures, breaks concentration (save Constitution negates), and knocks prone (save Dexterity negates) for concentration up to 1 min"',
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
      '"R30\' Target increases a size category, gaining advantage on Strength checks and  +1d4 HP weapon damage, or decreases a size category, suffering disadvantage on Strength checks and -1d4 HP weapon damage (save Constitution negates), for concentration up to 1 min; can instead target an unattended object"',
  'Entangle':
    'School=Conjuration ' +
    'Level=D1 ' +
    'Description=' +
      '"R90\' 20\' sq ensnares creatures (save Strength negates) for concentration up to 1 min"',
  'Enthrall':
    'School=Enchantment ' +
    'Level=B2,K2 ' +
    'Description=' +
      '"R60\' Target suffers disadvantage on Perception to notice others (save Wisdom negates) for 1 min"',
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
      '"R60\' Inflicts a choice of sleep, panic, or sickened (disadvantage on attack and ability rolls) on 1 target per rd (save Wisdom negates) for concentration up to 1 min"',

  'Fabricate':
    'School=Transmutation ' +
    'Level=W4 ' +
    'Description=' +
      '"R120\' Reshapes raw material into a 10\' cube product, or a 5\' cube product of stone or metal"',
  'Faerie Fire':
    'School=Evocation ' +
    'Level=B1,D1 ' +
    'Description=' +
      '"R60\' Objects in a 20\' cube glow, giving foes advantage on attacks (save Dexterity negates), for concentration up to 1 min"',
  'Faithful Hound':
    'School=Conjuration ' +
    'Level=W4 ' +
    'Description=' +
      '"R30\' Creates an invisible watchdog that barks at Small or larger intruders within 30\' and attacks those within 5\' (password negates) with a +%{mdf+proficiencyBonus} bite that inflicts 4d8 HP piercing for 8 hr"',
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
      '"R150\' Target suffers 4d6 HP psychic and reduction of Charisma and Intelligence to 1 (save Intelligence HP only; failure allows additional saves every 30 days)"',
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
      '"Self gains resistance to a choice of heat or cold damage, and a successful adjacent attacker suffers 2d8 HP fire or cold for 10 min"',
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
      '"R60\' Target becomes restrained (save Constitution negates), then petrified after 3 failed Constitution saves (3 successes negates) for concentration; the effects become permanent after 1 min"',
  'Floating Disk':
    'School=Conjuration ' +
    'Level=W1 ' +
    'Ritual=true ' +
    'Description=' +
      '"R30\' 3\'x1\\" force disk floats 3\' above the ground 20\' behind self and holds 500 lbs for 1 hr"',
  'Fly':
    'School=Transmutation ' +
    'Level=K3,S3,W3 ' +
    'AtHigherLevels="affects +1 target" ' +
    'Description=' +
      '"Touched gains a 60\' fly speed for concentration up to 10 min"',
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
      '"R60\' Target obeys self instructions (save Wisdom negates) for 30 days"',
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
      '"20\' radius inflicts 5d8 HP of a choice of acid, cold, fire, lightning, or thunder (save Dexterity half), or a spell of up to level 3, when triggered"',
  'Goodberry':
    'School=Transmutation ' +
    'Level=D1,R1 ' +
    'Description=' +
      '"Creates 10 berries that each heal 1 HP and provide food for 1 day"',
  'Grease':
    'School=Conjuration ' +
    'Level=W1 ' +
    'Description=' +
      '"R60\' 10\' sq becomes difficult terrain and causes creatures to fall prone (save Dexterity negates) for 1 min"',
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
       '"R30\' 10\' radius inflicts 20 HP radiant to hostile creatures (save Dexterity half) for 8 hr or until 60 HP inflicted"',
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
      '"60\'x10\' wind pushes 15\' (save Strength negates), inflicts half movement, and has a 50% chance of extinguishing flames for concentration up to 1 min"',

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
      '"Targets in a 30\' radius gain advantage on saves, inflict disadvantage on attackers, and blind successful fiend and undead melee attackers (save Constitution negates) for concentration up to 1 min"',
  "Hunter's Mark":
    'School=Divination ' +
    'Level=R1 ' +
    'AtHigherLevels="extends the duration to 8 or 24 hr at level 3 or 5" ' +
    'Description=' +
      '"R90\' Self gains +1d6 HP weapon damage to the target and advantage on Perception and Wisdom to locate it for concentration up to 1 hr"',
  'Hypnotic Pattern':
    'School=Illusion ' +
    'Level=B3,K3,S3,W3 ' +
    'Description=' +
      '"R120\' Creatures in a 30\' cube become incapacitated (save Wisdom negates) for concentration up to 1 min; taking damage ends the effects"',

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
      '"R30\' Restrains the target in a chosen type of prison (save Wisdom negates)"',
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
      '"R30\' Target suffers disadvantage on Dexterity and attacks, and foes gain advantage on attacks, (save Wisdom ends) for concentration up to 1 min"',

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
      '"R60\' Target floats (save Constitution negates) and can be moved up or down 20\' each rd for concentration up to 10 min"',
  'Light':
    'School=Evocation ' +
    'Level=B0,C0,S0,W0 ' +
    'Description=' +
      '"Touched object lights a 20\' radius (save Dexterity negates) for 1 hr"',
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
    'AtHigherLevels="extends the duration +1 hr" ' +
    'Description=' +
      '"R10\' 10\' radius prevents a choice of physical entry or exit (save Charisma allows magical transit), inflicts disadvantage on attacks, and negates charm, fright, and possession by one or more choices of celestials, fey, fiends, or undead, for 1 hr"',
  'Magic Jar':
    'School=Necromancy ' +
    'Level=W6 ' +
    'Description=' +
      '"R100\' Moves self soul to a prepared jar from which it can possess a target\'s body and trap its soul in the jar (save Charisma negates)"',
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
      '"R60\' 12 targets follow a reasonable suggestion (save Wisdom negates) for 1 day"',
  'Maze':
    'School=Conjuration ' +
    'Level=W8 ' +
    'Description=' +
      '"R60\' Sends the target to a labyrinthine demiplane (save DC 20 Intelligence escapes; minotaurs and goristro demons automatically succeed) for concentration up to 10 min"',
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
      '"3 duplicates (AC %{10+dexterityModifier}; damage destroys) allow misdirecting attacks on self for 1 min with an 11, 8, or 6 on a d20 while 1, 2, or 3 duplicates remain"',
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
      '"changes the memory of an event from the past 7, 30, 365, or unlimited days at level 6, 7, 8, or 9" ' +
    'Description=' +
      '"R30\' Changes the target\'s memory of an event from the past 24 hr (save Wisdom negates)"',
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
      '"R120\' Target perceives a personal horror (save Wisdom negates) that frightens and inflicts 4d10 HP psychic per rd (save Wisdom ends) for concentration up to 1 min"',
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
      '"R60\' Binds a celestial, elemental, fey, or fiend to service (save Charisma negates) for 1 day"',
  'Plane Shift':
    'School=Conjuration ' +
    'Level=C7,D7,K7,S7,W7 ' +
    'Description=' +
      '"Target (save Charisma negates) or self and 8 willing others travel to another plane"',
  'Plant Growth':
    'School=Transmutation ' +
    'Level=B3,D3,R3 ' +
    'Description=' +
      '"R150\' Causes plants in a 100\' radius to overgrow or enriches a 1/2 mile radius for 1 year"',
  'Poison Spray':
    'School=Conjuration ' +
    'Level=D0,K0,S0,W0 ' +
    'Description=' +
      '"R10\' Inflicts %{(level+7)//6}d12 HP poison (save Constitution negates)"',
  'Polymorph':
    'School=Transmutation ' +
    'Level=B4,D4,S4,W4 ' +
    'Description=' +
      '"R60\' Transforms the target creature (save Wisdom negates; shapechangers automatically succeed) for concentration up to 1 hr or until reduced to 0 HP"',
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
      '"60\' cone randomly inflicts one of: 10d6 HP fire, acid, lightning, poison, or cold (save Dexterity half); restrained (save Dexterity negates) and petrified after 3 failed Constitution saves (3 successes negates); blinded (save Dexterity negates) and banished to another plane (save Wisdom negates)"',
  'Prismatic Wall':
    'School=Abjuration ' +
    'Level=W9 ' +
    'Description=' +
      '"R60\' 90\'x30\' area blinds within 20\' for 1 min (save Constitution negates); creatures passing through suffer 10d6 HP each fire, acid, lightning, poison, and cold (save Dexterity half), restraint (save Dexterity negates) and petrification after 3 failed Constitution saves (3 successes negates), and blindness (save Dexterity negates) and banishment to another plane (save Wisdom negates)"',
  'Private Sanctum':
    'School=Abjuration ' +
    'Level=W4 ' +
    'AtHigherLevels="increases the protected area by 100\'" ' +
    'Description=' +
      '"R120\' Protects up to 100\' sq from choices of sound, vision, divination, teleportation, and planar travel for 1 day; casting daily for 1 year makes the effects permanent"',
  'Produce Flame':
    'School=Conjuration ' +
    'Level=D0 ' +
    'Description=' +
      '"Lights a 10\' radius for 10 min; can be used for a ranged spell attack that inflicts %{(level+7)//6}d8 HP and ends the spell"',
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
    'Description="Frees a touched creature from all curses or breaks the attunement to a touched cursed object"',
  'Resilient Sphere':
    'School=Evocation ' +
    'Level=W4 ' +
    'Description=' +
      '"R30\' Traps the target in an impervious sphere (save Dexterity negates) for concentration up to 1 min"',
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
      '"R60\' Inflicts %{(level+7)//6}d8 HP radiant (save Dexterity negates)"',
  'Sanctuary':
    'School=Abjuration ' +
    'Level=C1 ' +
    'Description=' +
      '"R30\' Foes of the target cannot attack it (save Wisdom negates) for 1 min; target attacking ends"',
  'Scorching Ray':
    'School=Evocation ' +
    'Level="K2 [The Fiend]",S2,W2 ' +
    'AtHigherLevels="gives +1 ranged attack" ' +
    'Description="R120\' 3 ranged attacks inflict 2d6 HP fire each"',
  'Scrying':
    'School=Divination ' +
    'Level=B5,C5,D5,K5,W5 ' +
    'Description=' +
      '"Self sees and hears a chosen target (save Wisdom, modified by degree of familiarity, negates for 24 hr) for concentration up to 10 min"',
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
      '"R30\' Changes the appearance of targets (save Charisma negates; Investigation detects) for 8 hr"',
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
      '"R150\' 40\' radius douses flames and inflicts difficult terrain and falling prone (save Dexterity negates) for concentration up to 1 min"',
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
      '"R90\' 20\' radius inflicts loss of actions (save Constitution negates) for concentration up to 1 min"',
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
      '"360\' radius within sight inflicts 2d6 HP thunder and deafness (save Constitution negates), then 1d6 HP acid, then 10d6 HP lightning (6 targets; save Dexterity half), then 2d6 HP bludgeoning, then 1d6 cold per rd and no ranged attacks for concentration up to 1 min"',
  'Suggestion':
    'School=Enchantment ' +
    'Level=B2,K2,S2,W2 ' +
    'Description=' +
      '"R30\' Target follows a reasonable suggestion (save Wisdom negates) for concentration up to 8 hr"',
  'Sunbeam':
    'School=Evocation ' +
    'Level=D6,S6,W6 ' +
    'Description=' +
      '"60\' line inflicts 6d8 HP radiant and blindness for 1 rd (save Constitution half HP only) for concentration up to 1 min"',
  'Sunburst':
    'School=Evocation ' +
    'Level=D8,S8,W8 ' +
    'Description=' +
      '"R150\' 60\' radius inflicts 12d6 HP and blindness (save Constitution half HP only; an additional save each turn ends blindness) for 1 min"',
  'Symbol':
    'School=Abjuration ' +
    'Level=B7,C7,W7 ' +
    'Description=' +
      '"Inscribes a touch object with a permanent glyph that, when triggered, inflicts a choice of harmful magic effect&mdash;10d10 HP necrotic (save Constitution half), arguing for 1 min (save Constitution negates), frightened and fleeing for 1 min (save Wisdom negates), overwhelmed with despair for 1 min (save Charisma negates), insane for 1 min (save Intelligence negates), incapacitated by pain for 1 min (save Constitution negates), asleep for 10 min or until shaken or harmed (save Wisdom negates), or stunned for 1 min (save Wisdom negates)"',

  'Telekinesis':
    'School=Transmutation ' +
    'Level=S5,W5 ' +
    'Description=' +
      '"R60\' Self can mentally move a 1000 lb object 30\' per rd (save Strength negates) for concentration up to 10 min"',
  'Telepathic Bond':
    'School=Divination ' +
    'Level=W5 ' +
    'Ritual=true ' +
    'Description="R30\' 8 willing targets can communicate mentally for 1 hr"',
  'Teleport':
    'School=Conjuration ' +
    'Level=B7,S7,W7 ' +
    'Description=' +
      '"R10\' Teleports an unattended object or self and 8 allies any distance; greater familiarity with the destination improves accuracy"',
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
      '"R10\' Allows creatures to teleport from a large plant target to another for 1 rd"',
  'Tree Stride':
    'School=Conjuration ' +
    'Level=D5,R5 ' +
    'Description=' +
      '"Self may teleport 500\' between like trees once per rd for concentration up to 1 min"',
  'True Polymorph':
    'School=Transmutation ' +
    'Level=B9,K9,W9 ' +
    'Description=' +
      '"R30\' Transforms the target creature (save Wisdom negates) or object for concentration up to 1 hr or until reduced to 0 HP; concentrating for a full hr makes the change permanent"',
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
      '"R60\' Inflicts %{(level+7)//6}d4 HP psychic and disadvantage on the next attack (save Wisdom negates) for 1 rd"',

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
    'AtHigherLevels="inflicts +2d6 HP initially and +1d6 HP when passing" ' +
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
      '"R60\' 20\' cube restrains creatures (save Dexterity negates and Strength frees) for concentration up to 1 hr; burning the web inflicts 2d4 HP fire"',
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
    'Description=' +
      '"Mimics an 8th level spell or otherwise alters reality with few limits"',
  'Word Of Recall':
    'School=Conjuration ' +
    'Level=C6 ' +
    'Description=' +
      '"R5\' Teleports self and 5 others to a prepared location"',

  'Zone Of Truth':
    'School=Enchantment ' +
    'Level=B2,C2,P2 ' +
    'Description=' +
      '"R60\' Creatures in a 15\' radius cannot lie (save Charisma negates) for 10 min"'

};
SRD5E2024.TOOLS = {
  "Alchemist's Supplies":'Type=Artisan',
  "Brewer's Supplies":'Type=Artisan',
  "Calligrapher's Supplies":'Type=Artisan',
  "Carpenter's Tools":'Type=Artisan',
  "Cartographer's Tools":'Type=Artisan',
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
SRD5E2024.DEITIES = {
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

SRD5E2024.LEVELS_EXPERIENCE = [
  0, 0.3, 0.9, 2.7, 6.5, 14, 23, 34, 48, 64,
  85, 100, 120, 140, 165, 195, 225, 265, 305, 355, 1000
];
// Extended from SRD5E weapons table based on SRD35 damage for large creatures
SRD5E2024.VERSATILE_WEAPON_DAMAGE = {
  'None':'None', '1':'1', '1d2':'1d3', '1d3':'1d4', '1d4':'1d6', '1d6':'1d8',
  '1d8':'1d10', '1d10':'1d12', '1d12':'3d6', '2d4':'2d6', '2d6':'3d6',
  '2d8':'3d8', '2d10':'4d8'
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
  SRD5E.identityRules
    (rules, alignments, backgrounds, classes, deities, {}, species);
  rules.defineRule('race', 'species', '=', null);
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
      QuilvynUtils.getAttrValue(attrs, 'AC'),
      bulky && !(bulky+'').match(/(^n|false)$/i),
      QuilvynUtils.getAttrValue(attrs, 'Dex'),
      QuilvynUtils.getAttrValue(attrs, 'Str'),
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
      QuilvynUtils.getAttrValueArray(attrs, 'Imply')
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
      QuilvynUtils.getAttrValue(attrs, 'AC')
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
  } else if(type == 'Species Feature')
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
    SRD5E2024.toolRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Type')
    );
  else if(type == 'Weapon')
    SRD5E2024.weaponRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Category'),
      QuilvynUtils.getAttrValueArray(attrs, 'Property'),
      QuilvynUtils.getAttrValue(attrs, 'Damage'),
      QuilvynUtils.getAttrValue(attrs, 'Range'),
      QuilvynUtils.getAttrValue(attrs, 'Cost'),
      QuilvynUtils.getAttrValue(attrs, 'Weight'),
      QuilvynUtils.getAttrValue(attrs, 'Mastery')
    );
  else {
    console.log('Unknown choice type "' + type + '"');
    return;
  }
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
};

/*
 * Defines in #rules# the rules associated with armor #name#, which adds #ac#
 * to the character's armor class, requires a #weight# proficiency level to use
 * effectively, allows a maximum dex bonus to ac of #maxDex#, requires (if
 * specified) a strength of #minStr# to avoid a speed penalty, and is considered
 * bulky armor if #bulky# is true.
 */
SRD5E2024.armorRules = function(rules, name, ac, bulky, maxDex, minStr, weight) {
  SRD5E.armorRules(rules, name, ac, bulky, maxDex, minStr, weight);
};

/*
 * Defines in #rules# the rules associated with background #name#, which grants
 * the equipment and features listed in #equipment# and #features#.
 */
SRD5E2024.backgroundRules = function(rules, name, equipment, features) {
  SRD5E.backgroundRules(rules, name, equipment, features);
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
SRD5E2024.classRules = function(
  rules, name, requires, hitDie, features, selectables, spellAbility,
  spellSlots, multiclassPrerequisite
) {
  SRD5E.classRules
    (rules, name, requires, hitDie, features, selectables, spellAbility,
     spellSlots, multiclassPrerequisite);
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
    rules.defineRule('magicNotes.bardicInspiration',
      'magicNotes.fontOfInspiration', '+', 'null' // italics
    );
    rules.defineRule('magicNotes.spellcasting.1', classLevel, '=', '1');
    rules.defineRule('selectableFeatureCount.Bard (Bard Subclass)',
      'featureNotes.bardSubclass', '=', '1'
    );

  } else if(name == 'Cleric') {

    rules.defineRule('combatNotes.divineSpark',
      'levels.Cleric', '=', 'source<7 ? 1 : source<13 ? 2 : source<18 ? 3 : 4'
    );
    rules.defineRule('magicNotes.potentSpellcasting.1',
      'magicNotes.improvedBlessedStrikes', '?', null
    );
    rules.defineRule('magicNotes.spellcasting.1', classLevel, '=', '1');
    rules.defineRule('selectableFeatureCount.Cleric (Cleric Subclass)',
      'featureNotes.clericSubclass', '=', '1'
    );
    rules.defineRule
      ('skillNotes.thaumaturge', 'wisdomModifier', '=', 'Math.max(source, 1)');
    rules.defineRule('spellSlots.C0', 'magicNotes.thaumaturge', '+', '1');

    rules.defineRule('clericHasDivineStrike', 'features.Life Domain', '=', '1');
    rules.defineRule('magicNotes.channelDivinity.1',
      'features.Channel Divinity', '?', null,
      'levels.Cleric', '+=', 'source<6 ? 1 : source<18 ? 2 : 3'
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
      classLevel, '=', 'source<4 ? "1/4" : source<8 ? "1/2" : "1"'
    );
    rules.defineRule('selectableFeatureCount.Druid (Druid Subclass)',
      'featureNotes.druidSubclass', '=', '1'
    );
    rules.defineRule('selectableFeatureCount.Druid (Elemental Fury)',
      'featureNotes.elementalFury', '=', '1'
    );
    rules.defineRule('selectableFeatureCount.Druid (Primal Order)',
      'featureNotes.primalOrder', '=', '1'
    );

  } else if(name == 'Fighter') {

    rules.defineRule('combatNotes.extraAttack',
      classLevel, '+=', 'source<5 ? null : 1',
      'combatNotes.twoExtraAttacks', '+', '1',
      'combatNotes.threeExtraAttacks', '+', '1'
    );
    rules.defineRule('combatNotes.secondWind',
      classLevel, '+=', 'source<4 ? 2 : source<10 ? 3 : 4'
    );
    rules.defineRule('combatNotes.weaponMastery',
      classLevel, '+=', 'Math.floor((source + 20) / 6)'
    );
    rules.defineRule('featCount.General', 'fighterFeatBonus', '+', null);
    rules.defineRule('fighterFeatBonus',
      classLevel, '=', 'source<6 ? null : source<14 ? 1 : 2'
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
    rules.defineRule
      ('combatNotes.extraAttack', classLevel, '+=', 'source<5 ? null : 1');
    rules.defineRule('combatNotes.martialArts',
      classLevel, '=', '4 + Math.floor((source + 1)/ 6) * 2'
    );
    rules.defineRule
      ('armorClass', 'combatNotes.unarmoredDefense(Monk).1', '+', null);
    rules.defineRule('combatNotes.unarmoredDefense(Monk).1',
      'combatNotes.unarmoredDefense(Monk)', '?', null,
      'armor', '?', 'source == "None"',
      'wisdomModifier', '=', null
    );
    rules.defineRule('monkSaveDC',
      "monkFeatures.Monk'sFocus", '?', null,
      'proficiencyBonus', '=', '8 + source',
      'wisdomModifier', '+', null
    );
    for(let a in SRD5E.ABILITIES) {
      rules.defineRule
        ('saveProficiency.' + a, 'saveNotes.disciplinedSurvivo', '=', '1');
    }
    rules.defineRule('selectableFeatureCount.Monk (Monk Subclass)',
      'featureNotes.monkSubclass', '=', '1'
    );
    rules.defineRule('speed', 'abilityNotes.unarmoredMovement.1', '+', null);

  } else if(name == 'Paladin') {

    rules.defineRule('combatNotes.weaponMastery', classLevel, '+=', '2');
    rules.defineRule
      ('combatNotes.extraAttack', classLevel, '+=', 'source<5 ? null : 1');
    rules.defineRule('magicNotes.channelDivinity.1',
      'levels.Paladin', '+=', 'source<3 ? null : 2'
    );
    rules.defineRule('selectableFeatureCount.Paladin (Paladin Subclass)',
      'featureNotes.sacredOath', '=', '1'
    );

  } else if(name == 'Ranger') {

    rules.defineRule('abilityNotes.roving.1',
      'abilityNotes.roving', '?', null,
      'armorWeight', '=', 'source < 3 ? 10 : null'
    );
    rules.defineRule
      ('combatNotes.extraAttack', classLevel, '+=', 'source<5 ? null : 1');
    rules.defineRule('selectableFeatureCount.Ranger (Ranger Subclass)',
      'featureNotes.rangerSubclass', '=', '1'
    );
    rules.defineRule('speed', 'abilityNotes.roving.1', '+', null);

  } else if(name == 'Rogue') {

    rules.defineRule('selectableFeatureCount.Rogue (Rogue Subclass)',
      'featureNotes.rogueSubclass', '=', '1'
    );

  } else if(name == 'Sorcerer') {

    rules.defineRule
      ('armorClass', 'combatNotes.draconicResilience.2', '^', null);
    rules.defineRule('combatNotes.draconicResilience.2',
      'features.Draconic Resilience', '?', null,
      'armor', '?', 'source == "None"',
      'dexterityModifier', '=', 'source + 13'
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

    rules.defineRule('magicNotes.eldritchInvocations',
      classLevel, '=', 'source==1 ? 1 : source<5 ? 3 : source<9 ? Math.floor((source + 5) / 2) : Math.floor((source + 12) / 3)'
    );
    rules.defineRule('selectableFeatureCount.Warlock (Eldritch Invocation)',
      'magicNotes.eldritchInvocations', '=', null
    );
    rules.defineRule('selectableFeatureCount.Warlock (Warlock Subclass)',
      'featureNotes.warlockSubclass', '=', '1'
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
};

/*
 * Defines in #rules# the rules associated with deity #name#. #alignment# gives
 * the deity's alignment and #domains# the associated domains.
 */
SRD5E2024.deityRules = function(rules, name, alignment, domains) {
  SRD5E.deityRules(rules, name, alignment, domains);
};

/*
 * Defines in #rules# the rules associated with feat #name#. #require# and
 * #implies# list any hard and soft prerequisites for the feat.
 */
SRD5E2024.featRules = function(rules, name, requires, implies) {
  SRD5E.featRules(rules, name, requires, implies);
};

/*
 * Defines in #rules# the rules associated with feat #name# that cannot be
 * derived directly from the attributes passed to featRules.
 */
SRD5E2024.featRulesExtra = function(rules, name) {
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
SRD5E2024.featureRules = function(
  rules, name, sections, notes, spells, spellAbility
) {
  SRD5E.featureRules(rules, name, sections, notes, spells, spellAbility);
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
};

/* Defines in #rules# the rules associated with language #name#. */
SRD5E2024.languageRules = function(rules, name) {
  SRD5E.languageRules(rules, name);
};

/*
 * Defines in #rules# the rules associated with magic school #name#, which
 * grants the list of #features#.
 */
SRD5E2024.schoolRules = function(rules, name) {
  SRD5E.schoolRules(rules, name);
};

/*
 * Defines in #rules# the rules associated with species #name#, which has the
 * list of hard prerequisites #requires#. #features# and #selectables# list
 * associated features, #size# gives the racial size and #speed# gives the
 * racial speed.
 */
SRD5E2024.speciesRules = function(
  rules, name, requires, features, selectables, size, speed)
{
  SRD5E.raceRules(rules, name, requires, features, selectables, size, speed);
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
      'features.Black Dragon Ancestry', '=', '"acid"',
      'features.Blue Dragon Ancestry', '=', '"lightning"',
      'features.Bronze Dragon Ancestry', '=', '"lightning"',
      'features.Copper Dragon Ancestry', '=', '"acid"',
      'features.Green Dragon Ancestry', '=', '"poison"',
      'features.Silver Dragon Ancestry', '=', '"cold"',
      'features.White Dragon Ancestry', '=', '"cold"'
    );
    rules.defineRule('selectableFeatureCount.Dragonborn (Draconic Ancestry)',
      'featureNotes.draconicAncestry', '=', '1'
    );
  } else if(name.match(/Dwarf/)) {
    rules.defineRule('featureRules.darkvision', speciesLevel, '=', '120');
  } else if(name.match(/Elf/)) {
    rules.defineRule('selectableFeatureCount.Elf (Elven Lineage)',
      'featureNotes.elvenLineage', '=', '1'
    );
  } else if(name.match(/Gnome/)) {
    rules.defineRule('selectableFeatureCount.Gnome (Gnomish Lineage)',
      'featureNotes.gnomishLineage', '=', '1'
    );
  } else if(name.match(/Goliath/)) {
    rules.defineRule('selectableFeatureCount.Goliath (Giant Ancestry)',
      'featureNotes.giantAncestry', '=', '1'
    );
  } else if(name.match(/Orc/)) {
    rules.defineRule('featureRules.darkvision', speciesLevel, '=', '120');
  } else if(name.match(/Tiefling/)) {
    rules.defineRule('selectableFeatureCount.Tiefling (Fiendish Legacy)',
      'featureNotes.fiendishLegacy', '=', '1'
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
};

/*
 * Defines in #rules# the rules associated with shield #name#, which adds #ac#
 * to the character's armor class.
 */
SRD5E2024.shieldRules = function(rules, name, ac) {
  SRD5E.shieldRules(rules, name, ac);
};

/*
 * Defines in #rules# the rules associated with skill #name#, associated with
 * #ability# (one of 'strength', 'intelligence', etc.). #classes# lists any
 * classes that are proficient in this skill.
 */
SRD5E2024.skillRules = function(rules, name, ability, classes) {
  SRD5E.skillRules(rules, name, ability, classes);
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
};

/* Defines in #rules# the rules associated with tool #name# of type #type#. */
SRD5E2024.toolRules = function(rules, name, type) {
  SRD5E.toolRules(rules, name, type);
};

/*
 * Defines in #rules# the rules associated with weapon #name#, which requires a
 * #category# proficiency level to use effectively and has weapon properties
 * #properties#. The weapon does #damage# HP on a successful attack. If
 * specified, the weapon can be used as a ranged weapon with a range increment
 * of #range# feet.
 */
SRD5E2024.weaponRules = function(
  rules, name, category, properties, damage, range, cost, weight, mastery
) {
  SRD5E.weaponRules
    (rules, name, category, properties, damage, range, cost, weight);
  // TODO something with mastery?
};

/*
 * Defines in #rules# the rules associated with with the list #features#. Rules
 * add each feature to #setName# if the value of #levelAttr# is at least equal
 * to the value required for the feature. If #selectable# is true, the user is
 * allowed to select these features for the character, rather than having them
 * assigned automatically.
 */
SRD5E2024.featureListRules = function(
  rules, features, setName, levelAttr, selectable
) {
  SRD5E.featureListRules(rules, features, setName, levelAttr, selectable);
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
};

/* Returns HTML body content for user notes associated with this rule set. */
SRD5E2024.ruleNotes = function() {
  return '' +
    '<h2>SRD5E Quilvyn Module Notes</h2>\n' +
    'SRD5E Quilvyn Module Version ' + SRD5E2024.VERSION + '\n' +
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
