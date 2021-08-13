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

  if(rules == null)
    rules = PHB5E.rules
  Volo.identityRules(rules, Volo.RACES);
  Volo.talentRules(rules, Volo.FEATURES);

}

Volo.VERSION = '2.2.1.0';

Volo.FEATURES = {
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
  'Control Air And Water':'Section=magic Note="<i>Fog Cloud</i>%1 1/long rest"',
  'Cunning Artisan':'Section=skill Note="Craft shield or weapon from carcass"',
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
    'Note="R10\' Dark eyes and bony wings frighten (DC %1 neg), +%V HP necrotic 1/turn for 1 min"',
  'Natural Armor':'Section=combat Note="Minimum AC %V"',
  'Powerful Build':'Section=ability Note="x2 Carry/x2 Lift"',
  'Protector Aasimar Ability Adjustment':
    'Section=ability Note="+2 Charisma/+1 Wisdom"',
  'Radiant Consumption':
    'Section=combat ' +
    'Note="R10\' Light %1 damage, +%V HP radiant 1/turn for 1 min"',
  'Radiant Soul':
    'Section=ability,combat ' +
    'Note="30\' Fly for 1 min 1/long rest",' +
         '"+%V radiant damage 1/turn for 1 min 1/long rest"',
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
Volo.RACES = {
  'Fallen Aasimar':
    'Features=' +
      '"1:Celestial Resistance","1:Darkvision","1:Healing Hands",' +
      '"1:Fallen Aasimar Ability Adjustment","1:Light Bearer",' +
      '"3:Necrotic Shroud" ' +
    'Languages=Celestial,Common',
  'Firlbog':
    'Features=' +
      '"1:Firlbog Ability Adjustment","1:Firlbog Magic","1:Hidden Step",' +
      '"1:Powerful Build","Speech Of Beast And Leaf" ' +
    'Languages=Common,Elvish,Giant',
  'Lizardfolk':
    'Features=' +
      '"1:Bite","1:Cunning Artisan","1:Lizardfolk Ability Adjustment",' +
      '"1:Hold Breath","1:Hungry Jaws","1:Hunter\'s Lore","1:Natural Armor",' +
      '"1:Swimmer" ' +
    'Languages=Common,Draconic',
  'Goliath':
    'Features=' +
      '"1:Goliath Ability Adjustment","1:Mountain Born","1:Natural Athlete",' +
      '"1:Powerful Build","1:Stone\'s Endurance" ' +
    'Languages=Common,Giant',
  'Kenku':
    'Features=' +
      '"1:Expert Forgery","1:Kenku Ability Adjustment","1:Kenku Training",' +
      '"1:Mimicry" ' +
    'Languages=Auran,Common',
  'Protector Aasimar':
    'Features=' +
      '"1:Darkvision","1:Celestial Resistance","1:Healing Hands",' +
      '"1:Light Bearer","1:Protector Aasimar Ability Adjustment",' +
      '"3:Radiant Soul" ' +
    'Languages=Celestial,Common',
  'Scourge Aasimar':
    'Features=' +
      '"1:Darkvision","1:Celestial Resistance","1:Healing Hands",' +
      '"1:Light Bearer","1:Scourge Aasimar Ability Adjustment",' +
      '"3:Radiant Consumption" ' +
    'Languages=Celestial,Common',
  'Tabaxi':
    'Features=' +
      '"1:Cat\'s Claws","1:Cat\'s Talent","1:Darkvision","1:Feline Agility",' +
      '"1:Tabaxi Ability Adjustment" ' +
    'Languages=Common,any',
  'Triton':
    'Features=' +
      '"1:Amphibious","1:Control Air And Water","1:Emissary Of The Sea",' +
      '"1:Guardians Of The Depths","1:Swimmer","1:Triton Ability Adjustment" ' +
    'Languages=Common,Primordial'
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
    rules.defineRule('combatNotes.necroticShround.1',
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
    rules.defineRule('combatNotes.radiantSoul', 'level', '=', null);
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
    '\n' +
    '<p>\n' +
    'There are no known bugs, limitations, or usage notes specific to the Volo plugin\n' +
    '</p>\n';
};
