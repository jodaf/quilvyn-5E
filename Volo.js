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

/*jshint esversion: 6 */
"use strict";

/*
 * This module loads the rules from Fifth Edition Volo's Guide to Monsters. The
 * Volo function contains methods that load rules for particular parts of the
 * rules; these member methods can be called independently in order to use
 * a subset of Volo. Similarly, the constant fields of Volo (RACES, FEATURES,
 * etc.) can be manipulated to modify the choices.
 */
function Volo(edition, rules) {

  if(window.PHB5E == null) {
    alert('The Volo module requires use of the PHB5E module');
    return;
  }

  var monstrous = (edition + '').match(/monster|monstrous/i);
  var features = monstrous ? Volo.MONSTROUS_FEATURES : Volo.CHARACTER_FEATURES;
  var races = monstrous ? Volo.MONSTROUS_RACES : Volo.CHARACTER_RACES;
  if(rules == null)
    rules = PHB5E.rules
  Volo.identityRules(rules, races);
  Volo.talentRules(rules, features);
  if(monstrous)
    Volo.MONSTROUS_RACES_IN_PLAY = true;
  else
    Volo.CHARACTER_RACES_IN_PLAY = true;
}

Volo.VERSION = '2.2.1.0';

Volo.CHARACTER_FEATURES = {
  'Amphibious':'Section=feature Note="Breath air or water"',
  'Bite':
    'Section=combat ' +
    'Note="Bite attack for 1d6+%{strengthModifier} HP piercing damage"',
  "Cat's Claws":
    'Section=ability,combat ' +
    'Note=' +
      '"20\' climb",' +
      '"Claw attack for 1d4+%{strengthModifier} HP slashing damage"',
  "Cat's Talent":'Section=skill Note="Skill Proficiency (Perception/Stealth)"',
  'Celestial Resistance':
    'Section=save Note="Resistance to necrotic and radiant damage"',
  'Control Air And Water':'Section=magic Note="<i>Fog Cloud</i>%1 1/long rest"',
  'Cunning Artisan':
    'Section=skill ' +
    'Note="Craft shield or weapon from carcass during short rest"',
  'Emissary Of The Sea':
    'Section=skill Note="Speak to water-breathing creatures"',
  'Expert Forgery':'Section=skill Note="Adv forgery and duplication checks"',
  'Fallen Aasimar Ability Adjustment':
    'Section=ability Note="+2 Charisma/+1 Strength"',
  'Feline Agility':'Section=combat Note="Dbl speed move 1/skipped move"',
  'Firlbog Ability Adjustment':'Section=ability Note="+2 Wisdom/+1 Strength"',
  'Firlbog Magic':
    'Section=magic ' +
    'Note="<i>Detect Magic</i> and <i>Disguise Self</i> 1/short rest"',
  'Goliath Ability Adjustment':
    'Section=ability Note="+2 Strength/+1 Constitution"',
  'Guardians Of The Depths':
    'Section=save Note="Cold resistance, unaffected by water depth"',
  'Healing Hands':'Section=magic Note="Heal %V HP 1/long rest"',
  'Hidden Step':'Section=magic Note="Self invisible for 1 tn 1/short rest"',
  'Hold Breath':'Section=ability Note="Hold breath for 15 min"',
  'Hungry Jaws':
    'Section=combat ' +
    'Note="Bonus bite gives self %{constitutionModifier>?1} temporary HP on hit 1/short rest"',
  "Hunter's Lore":
    'Section=skill ' +
    'Note="Skill Proficiency (Choose 2 from Animal Handling, Nature, Perception, Stealth, Survival)"',
  'Kenku Ability Adjustment':'Section=ability Note="+2 Dexterity/+1 Wisdom"',
  'Kenku Training':
    'Section=skill ' +
    'Note="Skill Proficiency (Choose 2 from Acrobatics, Deception, Stealth, Sleight Of Hand)"',
  'Light Bearer':'Section=magic Note="Know <i>Light</i> cantrip"',
  'Lizardfolk Ability Adjustment':
    'Section=ability Note="+2 Constitution/+1 Wisdom"',
  'Mimicry':
    'Section=skill ' +
    'Note="Deception vs. Insight to fool others with mimicked sounds"',
  'Mountain Born':'Section=feature Note="Adapted to high elevation and cold"',
  'Natural Athlete':'Section=skill Note="Skill Proficiency (Athletics)"',
  'Necrotic Shroud':
    'Section=combat ' +
    'Note="R10\' Dark eyes and bony wings frighten (DC %1 neg), +%V HP necrotic 1/tn for 1 min 1/long rest"',
  'Natural Armor':'Section=combat Note="Minimum AC %V"',
  'Powerful Build':'Section=ability Note="x2 Carry/x2 Lift"',
  'Protector Aasimar Ability Adjustment':
    'Section=ability Note="+2 Charisma/+1 Wisdom"',
  'Radiant Consumption':
    'Section=combat ' +
    'Note="R10\' Light causes %1 HP radiant damage, +%V HP radiant 1/tn for 1 min"',
  'Radiant Soul (Aasimar)':
    'Section=ability,combat ' +
    'Note="30\' Fly for 1 min 1/long rest",' +
         '"+%V radiant damage 1/tn for 1 min 1/long rest"',
  'Scourge Aasimar Ability Adjustment':
    'Section=ability Note="+2 Charisma/+1 Constitution"',
  'Speech Of Beast And Leaf':
    'Section=skill Note="Speak to beasts and plants, Adv influence Cha checks"',
  "Stone's Endurance":
    'Section=combat ' +
    'Note="Reduce damage by 1d12+%{constitutionModifier} HP 1/short rest"',
  'Swimmer':'Section=ability Note="30\' swim"',
  'Tabaxi Ability Adjustment':'Section=ability Note="+2 Dexterity/+1 Charisma"',
  'Triton Ability Adjustment':
    'Section=ability Note="+1 Charisma/+1 Constitution/+1 Strength"'
};
Volo.CHARACTER_RACES = {
  'Fallen Aasimar':
    'Features=' +
      '"Celestial Resistance",Darkvision,"Healing Hands",' +
      '"Fallen Aasimar Ability Adjustment","Light Bearer",' +
      '"3:Necrotic Shroud" ' +
    'Languages=Celestial,Common',
  'Firlbog':
    'Features=' +
      '"Firlbog Ability Adjustment","Firlbog Magic","Hidden Step",' +
      '"Powerful Build","Speech Of Beast And Leaf" ' +
    'Languages=Common,Elvish,Giant',
  'Lizardfolk':
    'Features=' +
      'Bite,"Cunning Artisan","Lizardfolk Ability Adjustment","Hold Breath",' +
      '"Hungry Jaws","Hunter\'s Lore","Natural Armor",Swimmer ' +
    'Languages=Common,Draconic',
  'Goliath':
    'Features=' +
      '"Goliath Ability Adjustment","Mountain Born","Natural Athlete",' +
      '"Powerful Build","Stone\'s Endurance" ' +
    'Languages=Common,Giant',
  'Kenku':
    'Features=' +
      '"Expert Forgery","Kenku Ability Adjustment","Kenku Training",Mimicry ' +
    'Languages=Auran,Common',
  'Protector Aasimar':
    'Features=' +
      'Darkvision,"Celestial Resistance","Healing Hands","Light Bearer",' +
      '"Protector Aasimar Ability Adjustment","3:Radiant Soul (Aasimar)" ' +
    'Languages=Celestial,Common',
  'Scourge Aasimar':
    'Features=' +
      'Darkvision,"Celestial Resistance","Healing Hands","Light Bearer",' +
      '"Scourge Aasimar Ability Adjustment",' +
      '"3:Radiant Consumption" ' +
    'Languages=Celestial,Common',
  'Tabaxi':
    'Features=' +
      '"Cat\'s Claws","Cat\'s Talent",Darkvision,"Feline Agility",' +
      '"Tabaxi Ability Adjustment" ' +
    'Languages=Common,any',
  'Triton':
    'Features=' +
      'Amphibious,"Control Air And Water","Emissary Of The Sea",' +
      '"Guardians Of The Depths",Swimmer,"Triton Ability Adjustment" ' +
    'Languages=Common,Primordial'
};
Volo.MONSTROUS_FEATURES = {
  'Aggressive':'Section=combat Note="Bonus action to move toward foe"',
  'Bugbear Ability Adjustment':
    'Section=ability Note="+2 Strength/+1 Dexterity"',
  'Fury Of The Small':
    'Section=combat Note="+%{level} HP damage to larger creature 1/short rest"',
  'Goblin Ability Adjustment':
    'Section=ability Note="+2 Dexterity/+1 Constitution"',
  'Grovel, Cower, and Beg':
    'Section=feature ' +
    'Note="R10\' Distract foes (allies Adv attack) for 1 tn 1/short rest"',
  'Hobgoblin Ability Adjustment':
    'Section=ability Note="+2 Constitution/+1 Intelligence"',
  'Kobold Ability Adjustment':
    'Section=ability Note="+2 Dexterity/-2 Strength"',
  'Long-Limbed':'Section=combat Note="+5\' melee reach"',
  'Nimble Escape':'Section=combat Note="Bonus action to Disengage or Hide"',
  'Martial Training':
    'Section=combat ' +
    'Note="Armor Proficiency (Light)/Weapon Proficiency (Choose 2 from any)"',
  'Magic Resistance':
    'Section=save Note="Adv vs. spells and other magic effects"',
  'Orc Ability Adjustment':
    'Section=ability Note="+2 Strength/+1 Constitution/-2 Intelligence"',
  'Pack Tactics':'Section=combat Note="Adv attack when ally w/in 5\' of foe"',
  'Poison Immunity':'Section=save Note="Cannot be poisoned"',
  'Powerful Build':'Section=ability Note="x2 Carry/x2 Lift"',
  'Saving Face':
    'Section=feature Note="+1/ally w/in 30\' on failed roll 1/short rest"',
  'Sneaky':'Section=skill Note="Skill Proficiency (Stealth)"',
  'Surprise Attack':
    'Section=combat Note="+2d6 HP damage on first surprise hit"',
  'Yuan-Ti Ability Adjustment':
    'Section=ability Note="+2 Charisma/+1 Intelligence"'
};
Volo.MONSTROUS_RACES = {
  'Bugbear':
    'Features=' +
      '"Bugbear Ability Adjustment",Darkvision,Long-Limbed,"Powerful Build",' +
      'Sneaky,"Surprise Attack" ' +
    'Languages=Common,Goblin',
  'Goblin':
    'Features=' +
      'Darkvision,"Fury Of The Small","Goblin Ability Adjustment",' +
      '"Nimble Escape",Small ' +
    'Languages=Common,Goblin',
  'Hobgoblin':
    'Features=' +
      'Darkvision,"Hobgoblin Ability Adjustment","Martial Training",' +
      '"Saving Face" ' +
    'Languages=Common,Goblin',
  'Kobold':
    'Features=' +
      'Darkvision,"Grovel, Cower, and Beg","Kobold Ability Adjustment",' +
      '"Pack Tactics",Small,"Sunlight Sensitivity" ' +
    'Languages=Common,Draconic',
  'Orc':
    'Features=' +
      'Aggressive,Darkvision,Menacing,"Orc Ability Adjustment",' +
      '"Powerful Build" ' +
    'Languages=Common,Orc',
  'Yuan-Ti':
    'Features=' +
      'Darkvision,"Magic Resistance","Poison Immunity",' +
      '"Yuan-Ti Ability Adjustment" ' +
    'Languages=Common,Abyssal,Draconic',
};

/* Defines rules related to basic character identity. */
Volo.identityRules = function(rules, races) {
  SRD5E.identityRules(rules, {}, {}, {}, {}, {}, races);
  for(var r in races) {
    Volo.raceRulesExtra(rules, r);
  }
};

/* Defines rules related to character aptitudes. */
Volo.talentRules = function(rules, features) {
  SRD5E.talentRules(rules, {}, features, {}, {}, {}, {});
};

/*
 * Defines in #rules# the rules associated with race #name# that cannot be
 * derived directly from the attributes passed to raceRules.
 */
Volo.raceRulesExtra = function(rules, name) {
  if(name.match(/Aasimar/)) {
    rules.defineRule('magicNotes.healingHands', 'level', '=', null);
  }
  if(name == 'Fallen Aasimar') {
    rules.defineRule('combatNotes.necroticShroud', 'level', '=', null);
    rules.defineRule('combatNotes.necroticShroud.1',
      'charismaModifier', '=', '8 + source',
      'proficiencyBonus', '+', null
    );
  } else if(name == 'Lizardfolk') {
    rules.defineRule('armorClass', 'combatNotes.naturalArmor', '^', null);
    rules.defineRule('combatNotes.naturalArmor',
      'dexterityModifier', '=', '13 + source',
      'shield', '+', 'source=="None" ? 0 : 2'
    );
  } else if(name == 'Protector Aasimar') {
    rules.defineRule('combatNotes.radiantSoul(Aasimar)', 'level', '=', null);
  } else if(name == 'Scourge Aasimar') {
    rules.defineRule('combatNotes.radiantConsumption', 'level', '=', null);
    rules.defineRule('combatNotes.radiantConsumption.1',
      'level', '=', 'Math.ceil(source / 2)'
    );
  } else if(name == 'Triton') {
    rules.defineRule('magicNotes.controlAirAndWater.1',
      'tritonLevel', '=', 'source<3 ? "" : source<5 ? " w/<i>Gust Of Wind</i>" : " w/<i>Gust Of Wind</i> and <i>Wall Of Water</i>"'
    );
  }
};

/* Returns HTML body content for user notes associated with this rule set. */
Volo.ruleNotes = function() {
  return '' +
    '<h2>Volo Quilvyn Plugin Notes</h2>\n' +
    'Volo Quilvyn Plugin Version ' + Volo.VERSION + '\n' +
    '<p>\n' +
    'Quilvyn\'s Volo\'s Guide supplement is unofficial Fan Content permitted ' +
    'under Wizards of the Coast\'s ' +
    '<a href="https://company.wizards.com/en/legal/fancontentpolicy">Fan Content Policy</a>.\n' +
    '</p><p>\n' +
    'Quilvyn is not approved or endorsed by Wizards of the Coast. Portions ' +
    'of the materials used are property of Wizards of the Coast. ©Wizards of ' +
    'the Coast LLC.\n' +
    '</p><p>\n' +
    'Volo\'s Guide to Monsters © 2016 Wizards of the Coast LLC.\n' +
    '</p><p>\n' +
    'Dungeons & Dragons Player\'s Handbook © 2014 Wizards of the Coast LLC.\n' +
    '<p>\n' +
    '<p>\n' +
    'There are no known bugs, limitations, or usage notes specific to the Volo plugin\n' +
    '</p>\n';
};
