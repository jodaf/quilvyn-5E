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

function X5E() {
  TalDorei();
  Tasha();
  Zelda();
}

/*
 * This module loads the rules from the Tal'Dorei Campaign Setting rule book.
 * The TalDorei function contains methods that load rules for particular parts
 * of the rules; deityRules for the pantheon, magicRules for spells, etc. These
 * member methods can be called independently in order to use a subset of the
 * rules. Similarly, the constant fields of TalDorei (DEITIES, PATHS, etc.)
 * can be manipulated to modify the choices.
 */
function TalDorei() {

  if(window.SRD5E == null) {
    alert('The TalDorei module requires use of the SRD5E module');
    return;
  }

  TalDorei.identityRules(
    SRD5E.rules, TalDorei.BACKGROUNDS, TalDorei.CLASSES, TalDorei.DEITIES,
    TalDorei.PATHS, TalDorei.RACES
  );
  TalDorei.magicRules(SRD5E.rules, TalDorei.SPELLS_ADDED);
  TalDorei.talentRules(
    SRD5E.rules, TalDorei.FEATS, TalDorei.FEATURES, TalDorei.LANGUAGES,
    TalDorei.TOOLS
  );

}

TalDorei.BACKGROUNDS = {
  'Ashari':
    'Equipment=' +
      '"Traveler\'s Clothes","Hunting Gear","Staff","10 GP" ' +
    'Features=' +
      '"1:Skill Proficiency (Nature/Choose 1 from Arcana, Survival)",' +
      '"1:Tool Proficiency (Herbalism Kit)",' +
      '"1:Elemental Harmony" ' +
    'Languages=any',
  'Clasp Member':
    'Equipment=' +
      '"Dark Hooded Clothing","10 GP" ' +
    'Features=' +
      '"1:Skill Proficiency (Deception/Choose 1 from Sleight Of Hand, Stealth)",' +
      '"1:Tool Proficiency (Choose 1 from Disguise Kit, Forgery Kit, Thieves\' Tools)",' +
      '"1:A Favor In Turn","1:Thieves\' Cant"',
  'Lyceum Student':
    'Equipment=' +
      '"Fine Clothes","Student Uniform","Writing Kit","10 GP" ' +
    'Features=' +
      '"1:Skill Proficiency (Choose 2 from Arcana, History, Persuasion)",' +
      '"1:Student Privilege" ' +
    'Languages=any,any',
  'Recovered Cultist':
    'Equipment=' +
      '"Vestments","Holy Symbol","Common Clothes","15 GP" ' +
    'Features=' +
      '"1:Skill Proficiency (Deception/Religion)",' +
      '"1:Wicked Awareness" ' +
    'Languages=any'
};
TalDorei.CLASSES = {
};
TalDorei.DEITIES = {
  'TD-Asmodeus':'Alignment=LE Domain=Blood,Trickery',
  'TD-Avandra':'Alignment=CG Domain=Nature,Trickery',
  'TD-Bahamut':'Alignment=LG Domain=Life,War',
  'TD-Bane':'Alignment=LE Domain=War',
  'TD-Corellon':'Alignment=CG Domain=Arcana,Light',
  'TD-Erathis':'Alignment=LN Domain=Knowledge',
  'TD-Gruumsh':'Alignment=CE Domain=Tempest,War',
  'TD-Ioun':'Alignment=N Domain=Arcana,Knowledge',
  'TD-Kord':'Alignment=CN Domain=Tempest,War',
  'TD-Lolth':'Alignment=CE Domain=Knowledge,Trickery',
  'TD-Melora':'Alignment=N Domain=Nature,Tempest',
  'TD-Moradin':'Alignment=LG Domain=Knowledge,War',
  'TD-Pelor':'Alignment=NG Domain=Life,Light',
  'TD-Sarenrae':'Alignment=NG Domain=Life,Light',
  'TD-Sehanine':'Alignment=CG Domain=Trickery',
  'TD-Tharizdun':'Alignment=CE Domain=Death,Trickery',
  'TD-The Raven Queen':'Alignment=LN Domain=Blood,Death,Life',
  'TD-Tiamat':'Alignment=LE Domain=Trickery,War',
  'TD-Torog':'Alignment=NE Domain=Blood,Death',
  'TD-Zehir':'Alignment=CE Domain=Blood,Trickery'
};
TalDorei.FEATS = {
  'Cruel':
    'Type=General',
  'Dual-Focused':
    'Type=General Require="casterLevel >= 1"',
  'Flash Recall':
    'Type=General Require="casterLevel >= 1"',
  'Gambler':
    'Type=General',
  'Mending Affinity':
    'Type=General',
  'Mystic Conflux':
    'Type=General',
  'Rapid Drinker':
    'Type=General',
  'Spelldriver':
    'Type=General Require="level >= 8"',
  'Thrown Arms Master':
    'Type=General'
};
TalDorei.FEATURES = {
  'A Favor In Turn':
    'Section=skill ' +
    'Note="Ask 20-word favor of contact in return for future favor"',
  'Arcane Exemplar Form':
    'Section=magic ' +
    'Note="Discharge 6 runes for 40\' Fly, +2 spell save and resistance, regain HP from casting for 3 rd"',
  'Ashari':
    'Section=feature ' +
    'Note="Ask 20-word favor of contact in return for future favor"',
  'Blood Puppet':
    'Section=magic ' +
    'Note="R60\' Channel Divinity to force target to move half speed and attack (Con neg)"',
  'Bloodletting Focus':
    'Section=magic Note="+2 necrotic damage on harming spells"',
  'Crimson Bond':
    'Section=magic ' +
    'Note="Focus in 2 oz target blood to learn distance, direction, health for 1 hr, share sight or sound for %V rd (Con neg + 2d6 HP to self)"',
  'Cruel':
    'Section=feature,combat,skill ' +
    'Note="%V cruelty points/long rest",' +
         '"Spend 1 cruelty point for +1d6 damage, regain 1d6 HP on critical",' +
         '"Spend 1 cruelty point for Intimidation Adv"',
  'Debilitating Barrage':
    'Section=combat ' +
    'Note="Spend 3 ki after triple hit for foe DisAdv next attack, vulnerability to damage type for 1 min (Con neg)"',
  'Demolishing Might':
    'Section=combat Note="x2 damage vs. objects, +1d8 HP constructs"',
  'Dual-Focused':
    'Section=magic ' +
    'Note="Concentrate on two spells simultaneously (Con to maintain)"',
  'Elemental Harmony':
    'Section=magic Note="Minor <i>Prestidigitation</i> effects"',
  'Essence Runes':
    'Section=magic Note="Spending Sorcery Points charges %V runes"',
  'Extract Aspects':
    'Section=combat ' +
    'Note="Spend 1 ki after double hit to gain info about foe (Con neg)"',
  'Extort Truth':
    'Section=combat ' +
    'Note="Spend 2 ki after double hit prevent foe lying for 1 min (Cha neg)"',
  'Flash Recall':'Section=magic Note="Swap prepared spell 1/short rest"',
  'Gambler':
    'Section=ability,feature,skill ' +
    'Note="+1 Charisma",' +
         '"Reroll Carousing result",' +
         '"Tool Proficiency(Choose 2 from any Game)/Adv Deception (games)/' +
          'Adv Persuasion (games)"',
  'Glyphs Of Aegis':
    'Section=magic Note="Discharge runes to negate 1d6 damage each"',
  'Manifest Inscriptions':
    'Section=magic Note="R15\' Discharge 1 rune to reveal hidden glyphs"',
  'Mending Affinity':
    'Section=ability,combat ' +
    'Note="+1 Constitution",' +
         '"+%V HP from healer\'s kit or potion"',
  'Mind Of Mercury':
    'Section=combat,save ' +
    'Note="Spend %V ki for %V extra reactions",' +
         '"Spend 1 ki for Investigation Adv"',
  'Mystic Conflux':
    'Section=skill,magic ' +
    'Note="Adv Arcana to id magic",' +
         '"Attune 4 items"',
  'Mystical Erudition':
    'Section=skill ' +
    'Note="Spend 1 ki for Adv Arcana, History, and Religion/+%V Language Count"',
  'Preternatural Counter':'Section=combat Note="AOO after foe miss"',
  'Rapid Drinker':
    'Section=combat,save ' +
    'Note="Quaff as bonus action",' +
         '"Adv ingestion saves"',
  'Runic Light':
    'Section=feature ' +
    'Note="5 charged runes give 5\' bright light, 5\' dim light"',
  'Runic Torrent':
    'Section=magic ' +
    'Note="Discharge spell level runes to overcome target resistance and immunity"',
  'Sanguine Recall':
    'Section=magic Note="Self %Vd6 HP to recover %V spell levels 1/long rest"',
  'Sigilic Augmentation':
    'Section=magic ' +
    'Note="Discharge rune for Adv on Str, Dex, or Con check for 1 tn"',
  'Spelldriver':'Section=magic Note="Cast multiple spells (1 level 3+)/tn"',
  'Stance Of The Mountain':
    'Section=combat Note="Immune knocked prone during rage"',
  'Student Privilege':
    'Section=skill Note="Access to school tools and crafting materials"',
  'Transfer Glyph':
    'Section=magic Note="Touch transfers Glyph Of Aegis for 1 hr"',
  'Thrown Arms Master':
    'Section=ability,combat ' +
    'Note="+1 abilityBoosts",' +
         '"Throw any weapon, +20 throw range, light weapon returns after miss"',
  'Thunderous Blows':
    'Section=combat ' +
    'Note="Successful attack pushes foe 5\', may follow (DC %V Str neg)"',
  'Unstoppable':
    'Section=combat Note="Immune slow, fright, paralysis, stun during rage"',
  'Vascular Corruption Aura':
    'Section=combat Note="R30\' Foes entering range 2d6 HP for 1 min 1/dy"',
  'Wicked Awareness':'Section=skill Note="Adv checks to uncover cult activity"'
};
TalDorei.LANGUAGES = {
};
TalDorei.PATHS = {
  'Blood Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Bloodletting Focus","2:Blood Puppet","5:Runic Light",' +
      '"6:Crimson Bond","8:Sanguine Recall","17:Vascular Corruption Aura" ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'Blood1:1=2,' +
      'Blood2:3=2,' +
      'Blood3:5=2,' +
      'Blood4:7=2,' +
      'Blood5:9=2',
  'Path Of The Juggernaut':
    'Group=Barbarian ' +
    'Level=levels.Barbarian ' +
    'Features=' +
      '"3:Stance Of The Mountain","3:Thunderous Blows","6:Demolishing Might","10:Overwhelming Cleave",14:Unstoppable',
  'Runechild Bloodline':
    'Group=Sorcerer ' +
    'Level=levels.Sorcerer ' +
    'Features=' +
      '"1:Essence Runes","1:Glyphs Of Aegis","6:Manifest Inscriptions",' +
      '"6:Sigilic Augmentation","14:Runic Torrent","18:Arcane Exemplar Form"',
  'Way Of The Cobalt Soul':
    'Group=Monk ' +
    'Level=levels.Monk ' +
    'Features=' +
      '"3:Mystical Erudition","3:Extract Aspects","6:Extort Truth",' +
      '"6:Mind Of Mercury","11:Preternatural Counter","17:Debilitating Barrage"'
};
TalDorei.RACES = {
};
TalDorei.SPELLS_ADDED = {
  'Crown Of Madness':'Level=Blood2',
  'Blight':'Level=Blood4',
  'Dominate Person':'Level=Blood5',
  'Haste':'Level=Blood3',
  'Hold Monster':'Level=Blood5',
  'Ray Of Enfeeblement':'Level=Blood2',
  'Ray Of Sickness':'Level=Blood1',
  'Sleep':'Level=Blood1',
  'Slow':'Level=Blood3',
  'Stoneskin':'Level=Blood4'
};
TalDorei.TOOLS = {
};

/* Defines rules related to basic character identity. */
TalDorei.identityRules = function(
  rules, backgrounds, classes, deities, paths, races
) {

  QuilvynUtils.checkAttrTable
    (backgrounds, ['Equipment', 'Features', 'Languages']);
  QuilvynUtils.checkAttrTable
    (classes, ['Require', 'HitDie', 'Features', 'Selectables', 'Languages', 'CasterLevelArcane', 'CasterLevelDivine', 'SpellAbility', 'SpellSlots', 'Spells']);
  QuilvynUtils.checkAttrTable(deities, ['Alignment', 'Domain', 'Sphere']);
  QuilvynUtils.checkAttrTable
    (paths, ['Features', 'Selectables', 'Group', 'Level', 'SpellAbility', 'SpellSlots', 'Spells']);
  QuilvynUtils.checkAttrTable
    (races, ['Require', 'Features', 'Selectables', 'Languages', 'SpellAbility', 'SpellSlots', 'Spells']);

  for(var background in backgrounds) {
    rules.choiceRules(rules, 'Background', background, backgrounds[background]);
  }
  for(var clas in classes) {
    delete rules.choices['levels'][clas];
    rules.choiceRules
      (rules, 'Class', clas, SRD5E.CLASSES[clas] + classes[clas]);
  }
  for(var deity in deities) {
    rules.choiceRules(rules, 'Deity', deity, deities[deity]);
  }
  for(var path in paths) {
    rules.choiceRules(rules, 'Path', path, paths[path]);
    TalDorei.pathRulesExtra(rules, path);
  }
  for(var race in races) {
    rules.choiceRules(rules, 'Race', race, races[race]);
  }

};

/* Defines rules related to magic use. */
TalDorei.magicRules = function(rules, spells) {
  QuilvynUtils.checkAttrTable(spells, ['School', 'Level', 'Description']);
  for(var s in spells) {
    rules.choiceRules
      (rules, 'Spell', s, (SRD5E.SPELLS[s]||PHB5E.SPELLS[s]) + ' ' + spells[s]);
  }
};

/* Defines rules related to character aptitudes. */
TalDorei.talentRules = function(rules, feats, features, languages, tools) {

  QuilvynUtils.checkAttrTable(feats, ['Require', 'Imply', 'Type']);
  QuilvynUtils.checkAttrTable(features, ['Section', 'Note']);

  for(var feat in feats) {
    rules.choiceRules(rules, 'Feat', feat, feats[feat]);
  }
  for(var feature in features) {
    rules.choiceRules(rules, 'Feature', feature, features[feature]);
  }
  for(var language in languages) {
    rules.choiceRules(rules, 'Language', language, languages[language]);
  }
  for(var tool in tools) {
    rules.choiceRules(rules, 'Tool', tool, tools[tool]);
  }

};

/*
 * Defines in #rules# the rules associated with feat #name# that cannot be
 * derived directly from the attributes passed to featRules.
 */
TalDorei.featRulesExtra = function(rules, name) {
  if(name == 'Cruel') {
    rules.defineRule('featureNotes.cruel', 'proficiencyBonus', '=', null);
  } else if(name == 'Mending Affinity') {
    rules.defineRule
      ('combatNotes.mendingAffinity', 'proficiencyBonus', '=', null);
  }
};

/*
 * Defines in #rules# the rules associated with path #name# that cannot be
 * derived directly from the attributes passed to pathRules.
 */
TalDorei.pathRulesExtra = function(rules, name) {
  if(name == 'Blood Domain') {
    rules.defineRule
      ('magicNotes.crimsonBond', 'wisdomModifier', '=', 'Math.max(source, 1)');
    rules.defineRule('magicNotes.sanguineRecall',
      'levels.Cleric', '=', 'Math.floor(source / 2)'
    );
    QuilvynRules.featureListRules(
      rules, ['deityDomains =~ \'Blood\' ? 1:Blood Domain'], 'Cleric',
      'levels.Cleric', true
    );
  } else if(name == 'Path Of The Juggernaut') {
    rules.defineRule('combatNotes.thunderousBlows',
      'strengthModifier', '=', '8 + source',
      'proficiencyBonus', '+', null
    );
    QuilvynRules.featureListRules(
      rules, ['3:Path Of The Juggernaut'], 'Barbarian', 'levels.Barbarian',
      true
    );
  } else if(name == 'Runechild Bloodline') {
    rules.defineRule('magicNotes.essenceRunes', 'levels.Sorcerer', '=', null);
    QuilvynRules.featureListRules(
      rules, ['3:Runechild Bloodline'], 'Sorcerer', 'levels.Sorcerer', true
    );
  } else if(name == 'Way Of The Cobalt Soul') {
    rules.defineRule('combatNotes.mindOfMercury',
      'intelligenceModifier', '=', 'Math.max(source, 1)'
    );
    rules.defineRule('skillNotes.mysticalErudition',
      'levels.Monk', '=', 'source >= 17 ? 3 : source >= 11 ? 2 : 1'
    );
    QuilvynRules.featureListRules(
      rules, ['3:Way Of The Cobalt Soul'], 'Monk', 'levels.Monk', true
    );
  }
};

/*
 * This module loads the rules from Fifth Edition Tasha's Cauldron of
 * Everything. The Tasha function contains methods that load rules for
 * particular parts of the rules; raceRules for character races, magicRules for
 * spells, etc. These member methods can be called independently in order to use
 * a subset of XGTE. Similarly, the constant fields of Tasha (FEATS,
 * BACKGROUNDS, etc.) can be manipulated to modify the choices.
 */
function Tasha() {

  if(window.SRD5E == null) {
    alert('The Tasha module requires use of the SRD5E module');
    return;
  }

  Tasha.identityRules(
    SRD5E.rules, Tasha.BACKGROUNDS, Tasha.CLASS_SELECTABLES, Tasha.DEITIES,
    Tasha.PATHS, Tasha.RACES
  );
  Tasha.magicRules(SRD5E.rules, Tasha.SPELLS_ADDED);
  Tasha.talentRules(
    SRD5E.rules, Tasha.FEATS, Tasha.FEATURES, Tasha.LANGUAGES, Tasha.TOOLS
  );

}

Tasha.CLASS_SELECTABLES = {
  'Barbarian':
    ['3:Path Of The Beast', '3:Path Of Wild Magic'],
  'Bard':
    ['3:College Of Creation', '3:College Of Eloquence'],
  'Cleric':
    ['1:Order Domain', '1:Peace Domain', '1:Twilight Domain'],
  'Druid':
    ['2:Circle Of Spores', '2:Circle Of Stars', '2:Circle Of Wildfire'],
  'Fighter':
    ['3:Psi Warrior Archetype', '3:Rune Knight Archetype'],
  'Monk':
    ['3:Way Of The Astral Self', '3:Way Of Mercy'],
  'Paladin':
    ['3:Oath Of Glory', '3:Oath Of The Watchers'],
  'Ranger':
    ['3:Fey Wanderer Archetype', '3:Swarmkeeper Archetype'],
  'Rogue':
    ['3:Phantom Archetype', '3:Soul Knife Archetype'],
  'Sorcerer':
    ['1:Aberrant Mind Origin', '1:Clockwork Soul Origin'],
  'Warlock':
    ['1:Fathomless Patron', '1:The Genie Patron'],
  'Wizard':
    ['2:Bladesinger Tradition', '2:Order Of Scribes Tradition']
};
Tasha.DEITIES = {
};
Tasha.FEATS = {
};
Tasha.FEATURES = {
  'Infectious Inspiration':
    'Section=magic ' +
    'Note="R60\' Reaction to grant extra bardic inspiration after successful use %V/long rest"',
  'Silver Tongue':
    'Section=skill Note="Min 10 roll on Deception and Persuasion"',
  'Unfailing Inspiration':
    'Section=magic Note="Inspiration die kept after failed use"',
  'Universal Speech':
    'Section=magic Note="R60\' %V targets understand self for 1 hr 1/long rest"',
  'Unsettling Words':
    'Section=magic ' +
    'Note="R60\' Target subtract Bardic Inspiration roll from next save"'
};
Tasha.LANGUAGES = {
};
Tasha.PATHS = {
  'College Of Eloquence':
    'Group=Bard Level=levels.Bard ' +
    'Features=' +
      '"3:Silver Tongue","3:Unsettling Words","6:Unfailing Inspiration",' +
      '"6:Universal Speech","14:Infectious Inspiration"'
};
Tasha.RACES = {
};
Tasha.SPELLS_ADDED = {
};
Tasha.TOOLS = {
};

/* Defines rules related to basic character identity. */
Tasha.identityRules = function(
  rules, backgrounds, classSelectables, deities, paths, races
) {

  QuilvynUtils.checkAttrTable
    (backgrounds, ['Equipment', 'Features', 'Languages']);
  QuilvynUtils.checkAttrTable(deities, ['Alignment', 'Domain', 'Sphere']);
  QuilvynUtils.checkAttrTable
    (paths, ['Features', 'Selectables', 'Group', 'Level', 'SpellAbility', 'SpellSlots', 'Spells']);
  QuilvynUtils.checkAttrTable
    (races, ['Require', 'Features', 'Selectables', 'Languages', 'SpellAbility', 'SpellSlots', 'Spells']);

  for(var background in backgrounds) {
    rules.choiceRules(rules, 'Background', background, backgrounds[background]);
  }
  for(var clas in classSelectables) {
    SRD5E.featureListRules
      (rules, classSelectables[clas], clas, 'levels.' + clas, true);
  }
  for(var deity in deities) {
    rules.choiceRules(rules, 'Deity', deity, deities[deity]);
  }
  for(var path in paths) {
    rules.choiceRules(rules, 'Path', path, paths[path]);
  }
  for(var race in races) {
    rules.choiceRules(rules, 'Race', race, races[race]);
    Tasha.raceRulesExtra(rules, race);
  }

};

/* Defines rules related to magic use. */
Tasha.magicRules = function(rules, spells) {
  QuilvynUtils.checkAttrTable(spells, ['School', 'Level', 'Description']);
  for(var s in spells) {
    rules.choiceRules
      (rules, 'Spell', s, (SRD5E.SPELLS[s]||PHB5E.SPELLS[s]) + ' ' + spells[s]);
  }
};

/* Defines the rules related to character classes. */
Tasha.pathRulesExtra = function(rules, name) {

  if(name == 'College Of Eloquence') {
    rules.defineRule('magicNotes.infectiousInspiration',
      'charismaModifier', '=', 'Math.max(source, 1)'
    );
    rules.defineRule('magicNotes.universalSpeech',
      'charismaModifier', '=', 'Math.max(source, 1)'
    );
    QuilvynRules.featureListRules(
      rules, ['3:College Of Eloquence'], 'Bard', 'levels.Bard', true
    );
  }

};

/* Defines rules related to character aptitudes. */
Tasha.talentRules = function(rules, feats, features, languages, tools) {

  QuilvynUtils.checkAttrTable(feats, ['Require', 'Imply', 'Type']);
  QuilvynUtils.checkAttrTable(features, ['Section', 'Note']);

  for(var feat in feats) {
    rules.choiceRules(rules, 'Feat', feat, feats[feat]);
  }
  for(var feature in features) {
    rules.choiceRules(rules, 'Feature', feature, features[feature]);
  }
  for(var language in languages) {
    rules.choiceRules(rules, 'Language', language, languages[language]);
  }
  for(var tool in tools) {
    rules.choiceRules(rules, 'Tool', tool, tools[tool]);
  }

};

/*
 * Defines in #rules# the rules associated with race #name# that cannot be
 * derived directly from the attributes passed to raceRules.
 */
Tasha.raceRulesExtra = function(rules, name) {
  if(name == 'Rito Zora') {
    rules.defineRule('abilityNotes.ritoWings',
      'level', '=', 'source < 3 ? null : source < 5 ? (source + " rd") : source < 7 ? (source + " min") : ""'
    );
    rules.defineRule('featureNotes.holdBreath',
      'constitutionModifier', '=', 'Math.max(10 * source, 5)'
    );
  }
};

/*
 * This module loads the rules for the Prisoner of Zelda adaptation for 5E.
 * The Zelda function contains methods that load rules for particular parts of
 * the rules; raceRules for character races, magicRules for spells, etc. These
 * member methods can be called independently in order to use a subset of Zelda.
 *  Similarly, the constant fields of Zelda (FEATS, BACKGROUNDS, etc.) can be
 * manipulated to modify the choices.
 */
function Zelda() {

  if(window.SRD5E == null) {
    alert('The Zelda module requires use of the SRD5E module');
    return;
  }

  Zelda.identityRules(
    SRD5E.rules, Zelda.BACKGROUNDS, Zelda.CLASSES, Zelda.DEITIES, Zelda.PATHS,
    Zelda.RACES
  );
  Zelda.magicRules(SRD5E.rules, Zelda.SPELLS_ADDED);
  Zelda.talentRules(
    SRD5E.rules, Zelda.FEATS, Zelda.FEATURES, Zelda.LANGUAGES, Zelda.TOOLS
  );

}

Zelda.FEATURES = {
  'Hold Breath':
    'Section=feature Note="Hold breath underwater %V min"',
  'Know Direction':
    'Section=feature,magic ' +
    'Note="Always know north",' +
         '"<i>Find The Path</i> 1/long rest"',
  'Rito Wings':
    'Section=ability,skill ' +
    'Note="Fly 60\' %V",' +
         '"+20\' long jumps, +10\' high jumps"',
  'Rito Zora Ability Adjustment':
    'Section=ability Note="+2 Constitution/+1 Dexterity"',
  'Water Adaptation':
    'Section=skill Note="Adv Survival in aquatic environments"'
};
Zelda.LANGUAGES = {
  'Hylian':'',
  'Rito':'',
  'Zora':''
};
Zelda.RACES = {
  'Rito Zora':
    'Features=' +
      '"1:Rito Zora Ability Adjustment","1:Hold Breath","1:Know Direction",' +
      '"1:Water Adaptation","3:Rito Wings" ' +
    'Languages=Hylian,Zora ' +
    'SpellAbility=charisma'
};

/* Defines rules related to basic character identity. */
Zelda.identityRules = function(
  rules, backgrounds, classes, deities, paths, races
) {

  QuilvynUtils.checkAttrTable
    (backgrounds, ['Equipment', 'Features', 'Languages']);
  QuilvynUtils.checkAttrTable
    (classes, ['Require', 'HitDie', 'Features', 'Selectables', 'Languages', 'CasterLevelArcane', 'CasterLevelDivine', 'SpellAbility', 'SpellSlots', 'Spells']);
  QuilvynUtils.checkAttrTable(deities, ['Alignment', 'Domain', 'Sphere']);
  QuilvynUtils.checkAttrTable
    (paths, ['Features', 'Selectables', 'Group', 'Level', 'SpellAbility', 'SpellSlots', 'Spells']);
  QuilvynUtils.checkAttrTable
    (races, ['Require', 'Features', 'Selectables', 'Languages', 'SpellAbility', 'SpellSlots', 'Spells']);

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
    Zelda.raceRulesExtra(rules, race);
  }

};

/* Defines rules related to magic use. */
Zelda.magicRules = function(rules, spells) {
  QuilvynUtils.checkAttrTable(spells, ['School', 'Level', 'Description']);
  for(var s in spells) {
    rules.choiceRules
      (rules, 'Spell', s, (SRD5E.SPELLS[s]||PHB5E.SPELLS[s]) + ' ' + spells[s]);
  }
};

/* Defines rules related to character aptitudes. */
Zelda.talentRules = function(rules, feats, features, languages, tools) {

  QuilvynUtils.checkAttrTable(feats, ['Require', 'Imply', 'Type']);
  QuilvynUtils.checkAttrTable(features, ['Section', 'Note']);

  for(var feat in feats) {
    rules.choiceRules(rules, 'Feat', feat, feats[feat]);
  }
  for(var feature in features) {
    rules.choiceRules(rules, 'Feature', feature, features[feature]);
  }
  for(var language in languages) {
    rules.choiceRules(rules, 'Language', language, languages[language]);
  }
  for(var tool in tools) {
    rules.choiceRules(rules, 'Tool', tool, tools[tool]);
  }

};

/*
 * Defines in #rules# the rules associated with race #name# that cannot be
 * derived directly from the attributes passed to raceRules.
 */
Zelda.raceRulesExtra = function(rules, name) {
  if(name == 'Rito Zora') {
    rules.defineRule('abilityNotes.ritoWings',
      'level', '=', 'source < 3 ? null : source < 5 ? (source + " rd") : source < 7 ? (source + " min") : ""'
    );
    rules.defineRule('featureNotes.holdBreath',
      'constitutionModifier', '=', 'Math.max(10 * source, 5)'
    );
  }
};
