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
 * This module loads the rules from the Fifth Edition Sword Coast Adventurer's
 * Guide. The SwordCoast function contains methods that load rules for
 * particular parts of the rules; raceRules for character races, magicRules
 * for spells, etc. These member methods can be called independently in order
 * to use a subset of the rules.  Similarly, the constant fields of SwordCoast
 * (BACKGROUNDS, PATHS, etc.) can be manipulated to modify the choices.
 */
function SwordCoast() {

  if(window.PHB5E == null) {
    alert('The SwordCoast module requires use of the PHB5E module');
    return;
  }

  var rules = new QuilvynRules('Sword Coast', SwordCoast.VERSION);
  SwordCoast.rules = rules;

  rules.defineChoice('choices', SRD5E.CHOICES);
  rules.choiceEditorElements = SRD5E.choiceEditorElements;
  rules.choiceRules = SwordCoast.choiceRules;
  rules.editorElements = SRD5E.initialEditorElements();
  rules.getFormats = SRD5E.getFormats;
  rules.getPlugins = SwordCoast.getPlugins;
  rules.makeValid = SRD5E.makeValid;
  rules.randomizeOneAttribute = SRD5E.randomizeOneAttribute;
  rules.defineChoice('random', SRD5E.RANDOMIZABLE_ATTRIBUTES);
  rules.ruleNotes = SwordCoast.ruleNotes;

  SRD5E.createViewers(rules, SRD5E.VIEWERS);
  rules.defineChoice('extras',
    'feats', 'featCount', 'sanityNotes', 'selectableFeatureCount',
    'validationNotes'
  );
  rules.defineChoice('preset',
    'background:Background,select-one,backgrounds',
    'race:Race,select-one,races', 'levels:Class Levels,bag,levels');

  SwordCoast.BACKGROUNDS =
    Object.assign({}, PHB5E.BACKGROUNDS, SwordCoast.BACKGROUNDS_ADDED);
  SwordCoast.CLASSES = Object.assign({}, PHB5E.CLASSES);
  for(var c in SwordCoast.CLASSES_SELECTABLES_ADDED) {
    SwordCoast.CLASSES[c] =
      SwordCoast.CLASSES[c].replace('Selectables=', 'Selectables=' + SwordCoast.CLASSES_SELECTABLES_ADDED[c] + ',');
  }
  SwordCoast.FEATS = Object.assign({}, PHB5E.FEATS, SwordCoast.FEATS_ADDED);
  SwordCoast.FEATURES =
    Object.assign({}, PHB5E.FEATURES, SwordCoast.FEATURES_ADDED);
  SwordCoast.PATHS = Object.assign({}, PHB5E.PATHS, SwordCoast.PATHS_ADDED);
  SwordCoast.RACES = Object.assign({}, PHB5E.RACES, SwordCoast.RACES_ADDED);
  for(var r in SwordCoast.RACES_RENAMED) {
    for(var i = 0; i < SwordCoast.RACES_RENAMED[r].length; i++) {
      var newName = SwordCoast.RACES_RENAMED[r][i];
      SwordCoast.RACES[newName] = PHB5E.RACES[r].replaceAll(r, newName);
    }
    delete SwordCoast.RACES[r];
  }
  SwordCoast.SPELLS = Object.assign({}, PHB5E.SPELLS, SwordCoast.SPELLS_ADDED);
  for(var s in SwordCoast.SPELLS_LEVELS_ADDED) {
    SwordCoast.SPELLS[s] =
      SwordCoast.SPELLS[s].replace('Level=', 'Level=' + SwordCoast.SPELLS_LEVELS_ADDED[s] + ',');
  }
  SwordCoast.TOOLS = Object.assign({}, SRD5E.TOOLS, SwordCoast.TOOLS_ADDED);

  SRD5E.abilityRules(rules);
  SRD5E.combatRules(rules, SRD5E.ARMORS, SRD5E.SHIELDS, SRD5E.WEAPONS);
  SRD5E.magicRules(rules, SRD5E.SCHOOLS, SwordCoast.SPELLS);
  SRD5E.identityRules(
    rules, SRD5E.ALIGNMENTS, SwordCoast.BACKGROUNDS, SwordCoast.CLASSES,
    SwordCoast.DEITIES, SwordCoast.PATHS, SwordCoast.RACES
  );
  SRD5E.talentRules
    (rules, SwordCoast.FEATS, SwordCoast.FEATURES, SRD5E.GOODIES,
     SRD5E.LANGUAGES, SRD5E.SKILLS, SwordCoast.TOOLS);

  if(window.Xanathar != null)
    Xanathar('Xanathar', rules);
  if(window.Volo != null) {
    if(Volo.CHARACTER_RACES_IN_PLAY)
      Volo('Character', rules);
    if(Volo.MONSTROUS_RACES_IN_PLAY)
      Volo('Monstrous', rules);
  }

  Quilvyn.addRuleSet(rules);

}

SwordCoast.VERSION = '2.2.1.0';

SwordCoast.BACKGROUNDS_ADDED = {
  'City Watch':
    'Equipment=' +
      '"Uniform",Horn,"Manacles","10 GP" ' +
    'Features=' +
      '"1:Skill Proficiency (Choose 1 from Athletics, Investigation/Insight)",'+
      '"1:Language (Choose 2 from any)",' +
      '"1:Watcher\'s Eye" ' +
    'Languages=any,any',
  'Clan Crafter':
    'Equipment=' +
      '"Artisan\'s Tools","Maker\'s Mark Chisel","Traveler\'s Clothes",' +
      '"15 GP" ' +
    'Features=' +
      '"1:Skill Proficiency (History/Insight)",' +
      '"1:Tool Proficiency (Choose 1 from any Artisan)",' +
      '"1:Language (Choose 1 from any)",' +
      '"1:Respect Of The Stout Folk" ' +
    'Languages=any',
  'Cloistered Scholar':
    'Equipment=' +
      '"Scholar\'s Robes","Writing Kit","Borrowed Book","10 GP" ' +
    'Features=' +
      '"1:Skill Proficiency (History/Choose 1 from Arcana, Nature, Religion)",' +
      '"1:Language (Choose 2 from any)",' +
      '"1:Library Access" ' +
    'Languages=any,any',
  'Courtier':
    'Equipment=' +
      '"Fine Clothes","5 GP" ' +
    'Features=' +
      '"1:Skill Proficiency (Insight/Persuasion)",' +
      '"1:Language (Choose 2 from any)",' +
      '"1:Court Functionary" ' +
    'Languages=any,any',
  'Faction Agent':
    'Equipment=' +
      '"Faction Badge","Faction Book","Common Clothes","15 GP" ' +
    'Features=' +
      '"1:Skill Proficiency (Insight/Choose 1 from any)",' +
      '"1:Language (Choose 2 from any)",' +
      '"1:Safe Haven" ' +
    'Languages=any,any',
  'Far Traveler':
    'Equipment=' +
      '"Traveler\'s Clothes","Musical Instrument or Gaming Set",' +
      'Maps,"15 GP" ' +
    'Features=' +
      '"1:Skill Proficiency (Insight/Perception)",' +
      '"1:Tool Proficiency (Choose 1 from any Game, any Music)",' +
      '"1:Language (Choose 1 from any)",' +
      '"1:All Eyes On You" ' +
    'Languages=any',
  'Inheritor':
    'Equipment=' +
      '"Inheritance","Traveler\'s Clothes",Tool,"15 GP" ' +
    'Features=' +
      '"1:Skill Proficiency (Survival/Choose 1 from Arcana, History, Religion)",' +
      '"1:Tool Proficiency (Choose 1 from any Game, any Music)",' +
      '"1:Language (Choose 1 from any)",' +
      '"1:Inheritance" ' +
    'Languages=any',
  'Knight Of The Order':
    'Equipment=' +
      '"Traveler\'s Clothes",Signet,"10 GP" ' +
    'Features=' +
      '"1:Skill Proficiency (Persuasion/Choose 1 from Arcana, History, Nature, Religion)",' +
      '"1:Tool Proficiency (Choose 1 from any Game, any Music)",' +
      '"1:Language (Choose 1 from any)",' +
      '"1:Knightly Regard" ' +
    'Languages=any',
  'Mercenary Veteran':
    'Equipment=' +
      'Uniform,Insignia,"Gaming Set","10 GP" ' +
    'Features=' +
      '"1:Skill Proficiency (Athletics/Perception)",' +
      '"1:Tool Proficiency (Vehicles (Land)/Choose 1 from any Game)",' +
      '"1:Mercenary Life"',
  'Urban Bounty Hunter':
    'Equipment=' +
      'Clothes,"20 GP" ' +
    'Features=' +
      '"1:Skill Proficiency (Choose 2 from Deception, Insight, Persuasion, Stealth)",' +
      '"1:Tool Proficiency (Choose 2 from any Game, any Music, Thieves\' Tools)",' +
      '"1:Language (Choose 1 from any)",' +
      '"1:Ear To The Ground"',
  'Uthgardt Tribe Memver':
    'Equipment=' +
      '"Hunting Map","Totem or tatoos","Traveler\'s Clothes","10 GP" ' +
    'Features=' +
      '"1:Skill Proficiency (Athletics/Survival)",' +
      '"1:Tool Proficiency (Choose 1 from any Game, any Artisan)",' +
      '"1:Language (Choose 1 from any)",' +
      '"1:Uthgardt Heritage" ' +
    'Languages=any',
  'Waterdhavian Noble':
    'Equipment=' +
      '"Fine Clothes","Signet Ring","Scroll Of Pedigree",' +
      '"Skin Of Fine Wine","20 GP" ' +
    'Features=' +
      '"1:Skill Proficiency (History/Persuasion)",' +
      '"1:Tool Proficiency (Choose 1 from any Game, any Music)",' +
      '"1:Language (Choose 1 from any)",' +
      '"1:Kept In Style" ' +
    'Languages=any'
};
SwordCoast.CLASSES_SELECTABLES_ADDED = {
  'Barbarian':
    '"race =~ \'Dwarf\' ? 3:Path Of The Battlerager:Primal Path",' +
    '"3:Path Of The Totem Warrior (Elk):Primal Path",' +
    '"3:Path Of The Totem Warrior (Tiger):Primal Path"',
  'Cleric':
    '"deityDomains =~ \'Arcana\' ? 1:Arcana Domain:Divine Domain"',
  'Fighter':
    '"3:Purple Dragon Knight:Martial Archetype"',
  'Monk':
    '"3:Way Of The Long Death:Monastic Tradition",' +
    '"3:Way Of The Sun Soul:Monastic Tradition"', // also Xanathar
  'Paladin':
    '"3:Oath Of The Crown:Sacred Oath"',
  'Rogue':
    '"3:Mastermind:Roguish Archetype",' + // also Xanathar
    '"3:Swashbuckler:Roguish Archetype"', // also Xanathar
  'Sorcerer':
    '"1:Storm Sorcery:Sorcerous Origin"', // also Xanathar
  'Warlock':
    '"1:The Undying:Otherworldly Patron"',
  'Wizard':
    '"race =~ \'Elf\' ? 2:Bladesinging:Arcane Tradition"'
};
SwordCoast.DEITIES = {
  'Akadi':'Alignment=N Domain=Tempest',
  'Amaunator':'Alignment=LN Domain=Life,Light',
  'Asmodeus':'Alignment=LE Domain=Knowledge,Trickery',
  'Auril':'Alignment=NE Domain=Nature,Tempest',
  'Azuth':'Alignment=LN Domain=Arcana,Knowledge',
  'Bane':'Alignment=LE Domain=War',
  'Beshaba':'Alignment=CE Domain=Trickery',
  'Bhaal':'Alignment=NE Domain=Death',
  'Chauntea':'Alignment=NG Domain=Life',
  'Cyric':'Alignment=CE Domain=Trickery',
  'Deneir':'Alignment=NG Domain=Arcana,Writing',
  'Eldath':'Alignment=NG Domain=Life,Nature',
  'Gond':'Alignment=N Domain=knowledge',
  'Grumbar':'Alignment=N Domain=Knowledge',
  'Gwaeron Windstrom':'Alignment=NG Domain=Knowledge,Nature',
  'Helm':'Alignment=LN Domain=Life,Light',
  'Hoar':'Alignment=LN Domain=War',
  'Ilmater':'Alignment=LG Domain=Life',
  'Istishia':'Alignment=N Domain=Tempest',
  'Jergal':'Alignment=LN Domain=Knowledge,Death',
  'Kelemvor':'Alignment=LN Domain=Death',
  'Kossuth':'Alignment=N Domain=Light',
  'Lathander':'Alignment=NG Domain=Life,Light',
  'Leira':'Alignment=CN Domain=Trickery',
  'Lliira':'Alignment=CG Domain=Life',
  'Loviatar':'Alignment=LE Domain=Death',
  'Malar':'Alignment=CE Domain=Nature',
  'Mask':'Alignment=CN Domain=Trickery',
  'Mielikki':'Alignment=NG Domain=Nature',
  'Milil':'Alignment=NG Domain=Light',
  'Mystra':'Alignment=NG Domain=Arcana,Knowledge',
  'Oghma':'Alignment=N Domain=Knowledge',
  'The Red Knight':'Alignment=LN Domain=War',
  'Savras':'Alignment=CG Domain=Knowledge,Life',
  'Selune':'Alignment=CG Domain=Knowledge,Life',
  'Shar':'Alignment=NE Domain=Death,Trickery',
  'Silvanus':'Alignment=N Domain=Nature',
  'Sun':'Alignment=CG Domain=Life,Light',
  'Talona':'Alignment=CE Domain=Death',
  'Talos':'Alignment=CE Domain=Tempest',
  'Tempus':'Alignment=N Domain=War',
  'Torm':'Alignment=LG Domain=War',
  'Tymora':'Alignment=CG Domain=Trickery',
  'Tyr':'Alignment=LG Domain=War',
  'Umberlee':'Alignment=CE Domain=Tempest',
  'Valkur':'Alignment=CG Domain=Tempest,War',
  'Waukeen':'Alignment=N Domain=Knowledge,Trickery'
};
SwordCoast.FEATS_ADDED = {
  'Svirfneblin Magic':'Require="race == \'Deep Gnome\'" Type=General'
};
SwordCoast.FEATURES_ADDED = {

  // Backgrounds
  'All Eyes On You':'Section=feature Note="Curiosity and interest from locals"',
  'Court Functionary':
    'Section=feature ' +
    'Note="Knowledge of government bureaucracy, access to records"',
  'Ear To The Ground':
    'Section=feature Note="Information contacts in every city"',
  'Inheritance':'Section=feature Note="Special item or knowledge from family"',
  'Kept In Style':'Section=feature Note="-2 GP/day expenses"',
  'Knightly Regard':
    'Section=feature Note="Assistance from fellows and supporters"',
  'Library Access':
    'Section=feature ' +
    'Note="Knowledge of cloister bureaucracy, broad access to libraries"',
  'Mercenary Life':
    'Section=feature Note="Knowledge of mercenary companies and customs"',
  'Respect Of The Stout Folk':
    'Section=feature Note="Free accommodations from Dwarves"',
  'Safe Haven':'Section=feature Note="Contacts w/access to safe house"',
  'Uthgardt Heritage':
    'Section=feature Note="Dbl food from foraging, assistance from tribes"',
  "Watcher's Eye":
    'Section=feature Note="Easily find local watch and criminal dens"',

  // Feats
  'Svirfneblin Magic':
    'Section=magic ' +
    'Note="Self <i>Nondetection</i> at will, <i>Blindness/Deafness</i>, <i>Blur</i>, and <i>Disguise Self</i> 1/long rest"',

  // Paths
  'Among The Dead':
    'Section=combat,magic,save ' +
    'Note=' +
      '"Undead attacks diverted to others (DC %V Wis neg)",' +
      '"Learn <i>Spare The Dying</i>",' +
      '"Adv vs. disease"',
  'Arcane Abjuration':
    'Section=combat Note="R30\' Action to turn celestial, elemental, fey, or fiend for 1 min"',
  'Arcane Abjuration (Banishment)':
    'Section=combat Note="Turned creature up to CR %V banished for 1 min"',
  'Arcane Initiate':
    'Section=magic,skill ' +
    'Note="Learn two W0 spells","Skill Proficiency (Arcana)"',
  'Arcane Mastery':
    'Section=magic Note="Add 1 each W6, W7, W8, and W9 as domain spells"',
  'Aspect Of The Elk':
    'Section=ability Note="R60\' Self and 10 allies dbl speed"',
  'Aspect Of The Tiger':
    'Section=skill ' +
    'Note="Skill Proficiency (Choose 2 from Athletics, Acrobatics, Stealth, Survival)"',
  'Battlerager Armor':
    'Section=combat ' +
    'Note="Bonus spike attack 1d4+%1 HP piercing damage during rage, 3 HP from grapple"',
  'Battlerager Charge':'Section=combat Note="Bonus dash during rage"',
  'Bladesong':
    'Section=ability,combat,magic,skill ' +
    'Note=' +
      '"+10 Speed in light or no armor for 1 min 2/short rest",' +
      '"+%V AC in light or no armor for 1 min 2/short rest",' +
      '"+%V Concentration in light or no armor to retain spell for 1 min 2/short rest",' +
      '"Adv Acrobatics in light or no armor for 1 min 2/short rest"',
  'Bulwark':
    'Section=combat ' +
    'Note="R60\' Indomitable use on Int, Wis, or Cha roll provides ally w/reroll"',
  'Champion Challenge':
    'Section=combat ' +
    'Note="R30\' Channel Divinity forces targets to stay w/in 30\' of self (DC %V Wis neg)"',
  'Defy Death':
    'Section=combat,magic ' +
    'Note=' +
      '"Successful death saving throw restores 1d8+%V HP",' +
      '"<i>Spare The Dying</i> restores 1d8+%V HP"',
  'Divine Allegiance':'Section=combat Note="R5\' Shift ally\'s damage to self"',
  'Elegant Maneuver':
    'Section=skill Note="Bonus action for Adv next Acrobatics or Athletics"',
  'Elk Totem Spirit':
    'Section=ability ' +
    'Note="+15 Speed during rage when not wearing heavy armor"',
  'Elk Totemic Attunement':
    'Section=combat ' +
    'Note="Charge knocks down foe for 1d12+%V HP bludgeoning damage (DC %1 Str neg)"',
  'Exalted Champion':
    'Section=combat,save ' +
    'Note=' +
      '"Resistance non-magical bludgeoning, piercing, and slashing",' +
      '"R30\' Self and allies Adv Death, Wisdom"',
  'Extra Attack':
    'Section=combat Note="+%V Attacks Per Round"',
  'Fancy Footwork':
    'Section=combat ' +
    'Note="Struck foe cannot make opportunity attacks against you for 1 tn"',
  'Heart Of The Storm':
    'Section=magic,save ' +
    'Note="R10\' %V HP lightning/thunder damage when casting lightning/thunder spell",' +
         '"Resistance to lightning and thunder damage"',
  'Hour Of Reaping':
    'Section=combat ' +
    'Note="R30\' All who can see self frightened (DC %V Wis neg)"',
  'Indestructible Life':
    'Section=combat ' +
    'Note="Bonus action to regain 1d8+%V HP, reattach severed parts 1/short rest"',
  'Insightful Manipulator':
    'Section=feature ' +
    'Note="Learn 2 of relative Cha, Int, Wis, and levels of target after 1 min study"',
  'Inspiring Surge':
    'Section=combat Note="R60\' Action Surge gives bonus attack to %V ally"',
  'Master Duelist':'Section=combat Note="Reroll miss with Adv 1/short rest"',
  'Master Of Intrigue':
    'Section=skill ' +
    'Note="Mimic accent and speech patters after listening 1 min"',
  'Master Of Tactics':'Section=combat Note="R30\' Help as bonus action"',
  'Mastery Of Death':
    'Section=combat ' +
    'Note="Spend 1 Ki Point to remain at 1 HP when brought to 0 HP"',
  'Misdirection':
    'Section=combat ' +
    'Note="Redirect attack on self to creature providing self cover"',
  'Panache':
    'Section=skill ' +
    'Note="Persuasion vs. Insight gives hostile target Disadv attacks on others, charms non-hostile for 1 min"',
  'Radiant Sun Bolt':
    'Section=combat ' +
    'Note="R30\' Ranged touch +%V 1d%1+%2 HP radiant damage 1/tn, spend 1 Ki for 2/tn"',
  'Rakish Audacity':
    'Section=combat ' +
    'Note="+%1 Initiative, use Sneak Attack w/out Adv vs. solo foe"',
  'Rallying Cry':
    'Section=combat Note="R60\' Second Wind restores %V HP to 3 allies"',
  'Reckless Abandon':
    'Section=combat Note="%V temporary HP from Reckless Attack during rage"',
  'Royal Envoy':
    'Section=feature,skill ' +
    'Note=' +
      '"Dbl Prof on Persuasion",' +
      '"Skill Proficiency (Choose 1 from Animal Handling, Insight, Intimidation, Persuasion)"',
  'Searing Arc Strike':
    'Section=magic ' +
    'Note="Spend 2-%V Ki to cast <i>Burning Hands</i> after attack"',
  'Searing Sunburst':
    'Section=magic ' +
    'Note="R150\' 20\' burst 2d6 HP radiant damage (DC %V Con neg), spend 1-3 Ki for +2d6 HP ea"',
  'Song Of Defense':
    'Section=magic Note="Expend spell slot to reduce damage by 5x slot level"',
  'Song Of Victory':'Section=combat Note="+%V damage for 1 min 2/short rest"',
  'Soul Of Deceit':
    'Section=save ' +
    'Note="Immunity to telepathy, Deception vs. Insight to present false thoughts, immunity to truth compulsion"',
  'Spell Breaker':
    'Section=magic Note="Healing spell ends spell of equal or lesser level"',
  'Spiked Retribution':
    'Section=combat ' +
    'Note="Successful melee attacker takes 3 HP piercing damage during rage"',
  'Storm Guide':
    'Section=magic ' +
    'Note="Stop rain in 20\' radius or direct winds in 100\' radius for 1 tn"',
  "Storm's Fury":
    'Section=combat ' +
    'Note="Successful attacker takes %V HP lightning damage and pushed 20\' (DC %1 Str neg push)"',
  'Sun Shield':
    'Section=combat,magic ' +
    'Note="%V HP radiant damage to foe when hit w/melee attack",' +
         '"30\' bright light, 30\' dim at will"',
  'Tempestuous Magic':
    'Section=magic Note="Fly 10\' before or after casting spell level 1+"',
  'Tiger Totem Spirit':
    'Section=feature Note="+10\' long jump, +3\' high jump during rage"',
  'Tiger Totemic Attunement':
    'Section=combat Note="Bonus melee attack after 20\' charge"',
  'Touch Of Death':
    'Section=combat Note="R5\' Taking foe to 0 HP gives self %V temporary HP"',
  'Touch Of The Long Death':
    'Section=combat ' +
    'Note="R5\' Spend 1-10 Ki Points to touch for 2d10 HP necrotic damage per (DC %V Con half)"',
  'Training In War And Song':
    'Section=combat,skill ' +
    'Note=' +
      '"Armor Proficiency (Light)/Weapon Proficiency (Choose 1 from any)",' +
      '"Skill Proficiency (Performance)"',
  'Turn The Tide':
    'Section=magic ' +
    'Note="R30\' Channel Divinity restores 1d6+%V HP to targets w/fewer than half HP"',
  'Undying Nature':
    'Section=feature ' +
    'Note="Require no breath, food, water, or sleep, age at 1/10 rate"',
  'Unyielding Spirit':'Section=save Note="Adv vs. paralysis and stunning"',
  'Wind Soul':
    'Section=ability,magic,save ' +
    'Note="60\' Fly",' +
         '"R30\' Self and %V others fly 30\' for 1 hr 1/long rest",' +
         '"Immunity to lightning and thunder damage"',
  'Wind Speaker':'Section=skill Note="Speak Primordial and dialects"',

  // Races
  'Deep Gnome Ability Adjustment':
    'Section=ability Note="+1 Dexterity/+2 Intelligence"',
  'Duergar Magic':
    'Section=magic Note="<i>Enlarge/Reduce</i>%1 on self 1/long rest"',
  'Duergar Resilience':
    'Section=save Note="Adv vs. illusions, charm, and paralysis"',
  'Gold Dwarf Ability Adjustment':
    'Section=ability Note="+2 Constitution/+1 Wisdom"',
  'Gray Dwarf Ability Adjustment':
    'Section=ability Note="+2 Constitution/+1 Strength"',
  'Moon Elf Ability Adjustment':
    'Section=ability Note="+2 Dexterity/+1 Intelligence"',
  'Shield Dwarf Ability Adjustment':
    'Section=ability Note="+2 Constitution/+2 Strength"',
  'Stone Camouflage':
    'Section=Skill Note="Adv Stealth (rocky terrain)"',
  'Strongheart Halfling Ability Adjustment':
    'Section=ability Note="+2 Dexterity/+1 Constitution"',
  'Strongheart Halfling Resilience':
    'Section=save Note="Adv and resistance to poison damage"',
  'Sun Elf Ability Adjustment':
    'Section=ability Note="+2 Dexterity/+1 Intelligence"'

};
SwordCoast.PATHS_ADDED = {
  'Arcana Domain':
    'Group=Cleric Level=levels.Cleric ' +
    'Features=' +
      '"1:Skill Proficiency (Arcana)",' +
      '"1:Arcane Initiate","2:Arcane Abjuration",' +
      '"5:Arcane Abjuration (Banishment)","6:Spell Breaker",' +
      '"8:Potent Spellcasting","17:Arcane Mastery" ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'Arcana1:1=2,' +
      'Arcana2:3=2,' +
      'Arcana3:5=2,' +
      'Arcana4:7=2,' +
      'Arcana5:9=2',
  'Bladesinging':
    'Group=Wizard Level=levels.Wizard ' +
    'Features=' +
      '"2:Training In War And Song","2:Bladesong","6:Extra Attack",' +
      '"10:Song Of Defense","14:Song Of Victory"',
  'Mastermind':
    'Group=Rogue Level=levels.Rogue ' +
    'Features=' +
      '"3:Tool Proficiency (Disguise Kit/Forgery Kit/Choose 1 from any Game)",' +
      '"3:Master Of Intrigue","3:Master Of Tactics",' +
      '"9:Insightful Manipulator","13:Misdirection","17:Soul Of Deceit"',
  'Oath Of The Crown':
    'Group=Paladin Level=levels.Paladin ' +
    'Features=' +
      '"3:Champion Challenge","3:Turn The Tide","7:Divine Allegiance",' +
      '"15:Unyielding Spirit","20:Exalted Champion" ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Crown1:3=2,' +
      'Crown2:5=2,' +
      'Crown3:9=2,' +
      'Crown4:13=2,' +
      'Crown5:17=2',
  'Path Of The Battlerager':
    'Group=Barbarian Level=levels.Barbarian ' +
    'Features=' +
      '"3:Battlerager Armor","6:Reckless Abandon","10:Battlerager Charge",' +
      '"14:Spiked Retribution"',
  'Path Of The Totem Warrior (Elk)':
    'Group=Barbarian Level=levels.Barbarian ' +
    'Features=' +
      '"3:Spirit Seeker","3:Elk Totem Spirit","6:Aspect Of The Elk",' +
      '"10:Spirit Walker","14:Elk Totemic Attunement"',
  'Path Of The Totem Warrior (Tiger)':
    'Group=Barbarian Level=levels.Barbarian ' +
    'Features=' +
      '"3:Spirit Seeker","3:Tiger Totem Spirit","6:Aspect Of The Tiger",' +
      '"10:Spirit Walker","14:Tiger Totemic Attunement"',
  'Purple Dragon Knight':
    'Group=Fighter Level=levels.Fighter ' +
    'Features=' +
      '"3:Rallying Cry","7:Royal Envoy","10:Inspiring Surge","15:Bulwark"',
  'Storm Sorcery':
    'Group=Sorcerer Level=levels.Sorcerer ' +
    'Features=' +
      '"1:Wind Speaker","1:Tempestuous Magic","6:Heart Of The Storm",' +
      '"6:Storm Guide","14:Storm\'s Fury","18:Wind Soul"',
  'Swashbuckler':
    'Group=Rogue Level=levels.Rogue ' +
    'Features=' +
      '"3:Fancy Footwork","3:Rakish Audacity","9:Panache",' +
      '"13:Elegant Maneuver","17:Master Duelist"',
  'The Undying':
    'Group=Warlock Level=levels.Warlock ' +
    'Features=' +
      '"1:Among The Dead","6:Defy Death","10:Undying Nature",' +
      '"14:Indestructible Life"',
  'Way Of The Long Death':
    'Group=Monk Level=levels.Monk ' +
    'Features=' +
      '"3:Touch Of Death","6:Hour Of Reaping","11:Mastery Of Death",' +
      '"17:Touch Of The Long Death"',
  'Way Of The Sun Soul':
    'Group=Monk Level=levels.Monk ' +
    'Features=' +
      '"3:Radiant Sun Bolt","6:Searing Arc Strike","11:Searing Sunburst",' +
      '"17:Sun Shield"'
};
SwordCoast.RACES_ADDED = {
  'Deep Gnome':
    'Features=' +
      '"1:Gnome Cunning","1:Deep Gnome Ability Adjustment",1:Slow,1:Small,' +
      '"1:Stone Camouflage","1:Superior Darkvision" ' +
    'Languages=Common,Gnomish,Undercommon',
  'Gray Dwarf':
    'Features=' +
      '"1:Weapon Proficiency (Battleaxe/Handaxe/Light Hammer/Warhammer)",' +
      '"1:Tool Proficiency (Choose 1 from Brewer\'s Supplies, Mason\'s Tools, Smith\'s Tools)",' +
      '"1:Duergar Resilience","1:Dwarven Resilience",' +
      '"1:Gray Dwarf Ability Adjustment",1:Slow,1:Steady,1:Stonecunning,' +
      '"1:Sunlight Sensitivity","1:Superior Darkvision","3:Duergar Magic" ' +
    'Languages=Common,Dwarvish,Undercommon'
};
SwordCoast.RACES_RENAMED = {
  'Hill Dwarf':['Gold Dwarf'],
  'High Elf':['Moon Elf', 'Sun Elf'],
  'Mountain Dwarf':['Shield Dwarf'],
  'Stout Halfling':['Strongheart Halfling']
};
SwordCoast.SPELLS_ADDED = {
  'Booming Blade':
    'School=Evocation ' +
    'Level=K0,S0,W0 ' +
    'Description="Struck foe +${Math.floor((lvl+1)/6)}d8 HP damage and takes ${Math.floor((lvl+1)/6)+1}d8 HP thunder damage on move for 1 tn"',
  'Green-Flame Blade':
    'School=Evocation ' +
    'Level=K0,S0,W0 ' +
    'Description="Struck foe +%Vd8 HP damage, R5\' foe takes ${Math.floor((lvl+1)/6)}d8+%{charismaModifier>?intelligenceModifier} HP fire damage"',
  'Lightning Lure':
    'School=Evocation ' +
    'Level=K0,S0,W0 ' +
    'Description="R15\' Target pulled 10\', takes ${Math.floor((lvl+5)/6)}d8 HP lightning damage (Str neg)"',
  'Sword Burst':
    'School=Conjuration ' +
    'Level=K0,S0,W0 ' +
    'Description="R5\' Spectral blades ${Math.floor((lvl+5)/6)}d6 HP force damage (Dex neg)"'
};
SwordCoast.SPELLS_LEVELS_ADDED = {
  'Arcane Eye':'Arcana4',
  'Aura Of Life':'K4',
  'Aura Of Vitality':'Crown3',
  'Banishment':'Crown4',
  'Blindness/Deafness':'K2',
  'Circle Of Power':'Crown5',
  'Command':'Crown1',
  'Compelled Duel':'Crown1',
  'Contagion':'K5',
  'Death Ward':'K4',
  'Detect Magic':'Arcana1',
  'Dispel Magic':'Arcana3',
  'False Life':'K1',
  'Feign Death':'K3',
  'Geas':'Crown5',
  'Guardian Of Faith':'Crown4',
  'Legend Lore':'K5',
  "Leomund's Secret Chest":'Arcana4',
  'Magic Circle':'Arcana3',
  'Magic Missile':'Arcana1',
  'Magic Weapon':'Arcana2',
  "Nystul's Magic Aura":'Arcana2',
  'Planar Binding':'Arcana5',
  'Ray Of Sickness':'K1',
  'Silence':'K2',
  'Speak With Dead':'K3',
  'Spirit Guardians':'Crown3',
  'Teleportation Circle':'Arcana5',
  'Warding Bond':'Crown2',
  'Zone Of Truth':'Crown2'
};
SwordCoast.TOOLS_ADDED = {
  'Birdpipes':'Type=Music',
  'Glaur':'Type=Music',
  'Hand Drum':'Type=Music',
  'Longhorn':'Type=Music',
  // In SRD5E 'Shawm':'Type=Music',
  'Songhorn':'Type=Music',
  'Tantan':'Type=Music',
  'Thelarr':'Type=Music',
  'Tocken':'Type=Music',
  'Wargong':'Type=Music',
  'Yarting':'Type=Music',
  'Zulkoon':'Type=Music'
};

/*
 * Adds #name# as a possible user #type# choice and parses #attrs# to add rules
 * related to selecting that choice.
 */
SwordCoast.choiceRules = function(rules, type, name, attrs) {
  PHB5E.choiceRules(rules, type, name, attrs);
  if(type == 'Path')
    SwordCoast.pathRulesExtra(rules, name);
  else if(type == 'Race')
    SwordCoast.raceRulesExtra(rules, name);
};

/*
 * Defines in #rules# the rules associated with path #name# that cannot be
 * derived directly from the attributes passed to pathRules.
 */
SwordCoast.pathRulesExtra = function(rules, name) {

  var pathLevel =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '') +
    'Level';

  if(name == 'Arcana Domain') {
    rules.defineRule('combatNotes.arcaneAbjuration(Banishment)',
      pathLevel, '=', 'source<8 ? "1/2" : Math.floor((source - 5) / 3)'
    );
  } else if(name == 'Bladesinging') {
    rules.defineRule('combatNotes.bladesong',
      'intelligenceModifier', '=', 'Math.max(source, 1)'
    );
    rules.defineRule('combatNotes.songOfVictory',
      'intelligenceModifier', '=', 'Math.max(source, 1)'
    );
    rules.defineRule('combatNotes.extraAttack', pathLevel, '+=', '1');
    rules.defineRule('magicNotes.bladesong',
      'intelligenceModifier', '=', 'Math.max(source, 1)'
    );
  } else if(name == 'Mastermind') {
    // Copied from Xanathar
    rules.defineRule('languageCount', 'features.Master Of Intrigue', '+', '2');
  } else if(name == 'Oath Of The Crown') {
    rules.defineRule('combatNotes.championChallenge',
      'spellDifficultyClass.Crown', '=', null
    );
    rules.defineRule('magicNotes.turnTheTide',
      'charismaModifier', '=', 'Math.max(source, 1)'
    );
  } else if(name == 'Path Of The Battlerager') {
    rules.defineRule('combatNotes.battleragerArmor.1',
      'features.Battlerager Armor', '?', null,
      'strengthModifier', '=', null
    );
    rules.defineRule('combatNotes.recklessAbandon',
      'constitutionModifier', '=', 'Math.max(source, 1)'
    );
  } else if(name == 'Path Of The Totem Warrior (Elk)') {
    rules.defineRule
      ('combatNotes.elkTotemicAttunement', 'strengthModifier', '=', null);
    rules.defineRule('combatNotes.elkTotemicAttunement.1',
      'features.Elk Totemic Attunement', '?', null,
      'strengthModifier', '=', '8 + source',
      'proficiencyBonus', '+', null
    );
  } else if(name == 'Purple Dragon Knight') {
    rules.defineRule
      ('combatNotes.inspiringSurge', pathLevel, '=', 'source>=18 ? 2 : 1');
    rules.defineRule('combatNotes.rallyingCry', pathLevel, '=', null);
  } else if(name == 'Storm Sorcery') {
    // Copied from Xanathar
    rules.defineRule("combatNotes.storm'sFury", pathLevel, '=', null);
    rules.defineRule("combatNotes.storm'sFury.1",
      "features.Storm's Fury", '?', null,
      'spellDifficultyClass.S', '=', null
    );
    rules.defineRule('languageCount', 'skillNotes.windSpeaker', '+=', '5');
    rules.defineRule('languages.Aquan', 'skillNotes.windSpeaker', '=', '1');
    rules.defineRule('languages.Auran', 'skillNotes.windSpeaker', '=', '1');
    rules.defineRule('languages.Ignan', 'skillNotes.windSpeaker', '=', '1');
    rules.defineRule
      ('languages.Primordial', 'skillNotes.windSpeaker', '=', '1');
    rules.defineRule('languages.Terran', 'skillNotes.windSpeaker', '=', '1');
    rules.defineRule
      ('magicNotes.heartOfTheStorm', pathLevel, '=', 'Math.floor(source / 2)');
    rules.defineRule
      ('magicNotes.windSoul', 'charismaModifier', '=', '3 + source');
  } else if(name == 'Swashbuckler') {
    // Copied from Xanathar
    rules.defineRule('combatNotes.rakishAudacity.1',
      'features.Rakish Audacity', '?', null,
      'charismaModifier', '=', null
    );
  } else if(name == 'The Undying') {
    rules.defineRule
      ('combatNotes.amongTheDead', 'spellDifficultyClass.K', '=', null);
    rules.defineRule('combatNotes.defyDeath',
      'constitutionModifier', '=', 'Math.max(source, 1)'
    );
    rules.defineRule('combatNotes.indestructibleLife', pathLevel, '=', null);
    rules.defineRule('magicNotes.defyDeath',
      'constitutionModifier', '=', 'Math.max(source, 1)'
    );
  } else if(name == 'Way Of The Long Death') {
    rules.defineRule('combatNotes.hourOfReaping', 'kiSaveDC', '=', null);
    rules.defineRule('combatNotes.touchOfDeath',
      pathLevel, '=', null,
      'wisdomModifier', '+', null,
      '', '^', '1'
    );
    rules.defineRule('combatNotes.touchOfTheLongDeath', 'kiSaveDC', '=', null);
  } else if(name == 'Way Of The Sun Soul') {
    // Copied from Xanathar
    rules.defineRule('combatNotes.radiantSunBolt',
      'proficiencyBonus', '=', null,
      'dexterityModifier', '+', null
    );
    rules.defineRule('combatNotes.radiantSunBolt.1',
      'features.Radiant Sun Bolt', '?', null,
      'combatNotes.martialArts', '=', null
    );
    rules.defineRule('combatNotes.radiantSunBolt.2',
      'features.Radiant Sun Bolt', '?', null,
      'dexterityModifier', '=', null
    );
    rules.defineRule
      ('combatNotes.sunShield', 'wisdomModifier', '=', 'source + 5');
    rules.defineRule
      ('magicNotes.searingArcStrike', pathLevel, '=', 'Math.floor(source / 2)');
    rules.defineRule('magicNotes.searingSunburst', 'kiSaveDC', '=', null);
  }

};

/*
 * Defines in #rules# the rules associated with path #name# that cannot be
 * derived directly from the attributes passed to raceRules.
 */
SwordCoast.raceRulesExtra = function(rules, name) {

  var raceLevel =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '') +
    'Level';

  if(name == 'Gray Dwarf') {
    rules.defineRule('magicNotes.duergarMagic.1',
      'features.Duergar Magic', '?', null,
      raceLevel, '=', 'source>=5 ? ", <i>Invisibility</i>" : ""'
    );

  }

};

/* Returns an array of plugins upon which this one depends. */
SwordCoast.getPlugins = function() {
  var result = [PHB5E, SRD5E];
  if(window.Volo != null &&
     (Volo.CHARACTER_RACES_IN_PLAY || Volo.MONSTROUS_RACES_IN_PLAY))
    result.unshift(Volo);
  if(window.Xanathar != null &&
     QuilvynUtils.getKeys(PHB5E.rules.getChoices('selectableFeatures'), /Forge Domain/).length > 0)
    result.unshift(Xanathar);
  return result;
};

/* Returns HTML body content for user notes associated with this rule set. */
SwordCoast.ruleNotes = function() {
  return '' +
    '<h2>Sword Coast Quilvyn Plugin Notes</h2>\n' +
    'Sword Coast Quilvyn Plugin Version ' + SwordCoast.VERSION + '\n' +
    '<p>\n' +
    'Quilvyn\'s Sword Coast rule set is unofficial Fan Content permitted ' +
    'under Wizards of the Coast\'s ' +
    '<a href="https://company.wizards.com/en/legal/fancontentpolicy">Fan Content Policy</a>.\n' +
    '</p><p>\n' +
    'Quilvyn is not approved or endorsed by Wizards of the Coast. Portions ' +
    'of the materials used are property of Wizards of the Coast. ©Wizards of ' +
    'the Coast LLC.\n' +
    '</p><p>\n' +
    'Sword Coast Adventurer\'s Guide © 2015 Wizards of the Coast LLC.\n' +
    '</p><p>\n' +
    'Dungeons & Dragons Player\'s Handbook © 2014 Wizards of the Coast LLC.\n' +
    '<p>\n' +
    'There are no known bugs, limitations, or usage notes specific to the Sword Coast plugin\n' +
    '</p>\n';
};
