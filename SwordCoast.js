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
  SwordCoast.FEATURES =
    Object.assign({}, PHB5E.FEATURES, SwordCoast.FEATURES_ADDED);
  SwordCoast.RACES = Object.assign({}, PHB5E.RACES);
  // TODO Modify race names?
  SwordCoast.SPELLS = Object.assign({}, PHB5E.SPELLS, SwordCoast.SPELLS_ADDED);
  for(var s in SwordCoast.SPELLS_LEVELS_ADDED) {
    SwordCoast.SPELLS[s] =
      SwordCoast.SPELLS[s].replace('Level=', 'Level=' + SwordCoast.SPELLS_LEVELS_ADDED[s] + ',');
  }
  SwordCoast.TOOLS = Object.assign({}, PHB5E.TOOLS, SwordCoast.TOOLS_ADDED);

  SRD5E.abilityRules(rules);
  SRD5E.combatRules(rules, SRD5E.ARMORS, SRD5E.SHIELDS, SRD5E.WEAPONS);
  SRD5E.magicRules(rules, SRD5E.SCHOOLS, SwordCoast.SPELLS);
  SRD5E.identityRules(
    rules, SRD5E.ALIGNMENTS, SwordCoast.BACKGROUNDS, SwordCoast.CLASSES,
    SwordCoast.DEITIES, SwordCoast.PATHS, PHB5E.RACES
  );
  SRD5E.talentRules
    (rules, PHB5E.FEATS, SwordCoast.FEATURES, SRD5E.GOODIES,
     SRD5E.LANGUAGES, SRD5E.SKILLS, SRD5E.TOOLS);

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
      '"1:Language (Choose 1 from any)",' +
      '"1:All Eyes On You" ' +
    'Languages=any',
  'Inheritor':
    'Equipment=' +
      '"Inheritance","Traveler\'s Clothes",Tool,"15 GP" ' +
    'Features=' +
      '"1:Skill Proficiency (Survival/Choose 1 from Arcana, History, Religion)",' +
      '"1:Language (Choose 1 from any)",' +
      '"1:Inheritance" ' +
    'Languages=any',
  'Knight Of The Order':
    'Equipment=' +
      '"Traveler\'s Clothes",Signet,"10 GP" ' +
    'Features=' +
      '"1:Skill Proficiency (Persuasion/Choose 1 from Arcana, History, Nature, Religion)",' +
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
SwordCoast.FEATURES_ADDED = {
  // Backgrounds
  'All Eyes On You':'Section=feature Note="Curiosity and interest from locals"',
  'Court Functionary':
    'Section=feature ' +
    'Note="Knowledge of government beauracracy, access to records"',
  'Ear To The Ground':
    'Section=feature Note="Information contacts in every city"',
  'Inheritance':'Section=feature Note="Special item or knowledge from family"',
  'Kept In Style':'Section=feature Note="-2 GP/day expenses"',
  'Knightly Regard':
    'Section=feature Note="Assistance from fellows and supporters"',
  'Library Access':
    'Section=feature ' +
    'Note="Knowledge of cloister beauracracy, broad access to libraries"',
  'Mercenary Life':
    'Section=feature Note="Knowledge of mercenary companies and customs"',
  'Respect Of The Stout Folk':
    'Section=feature Note="Free accommodations from Dwarves"',
  'Safe Haven':'Section=feature Note="Contacts w/access to safe house"',
  'Uthgardt Heritage':
    'Section=feature Note="Dbl food from foraging, assistance from tribes"',
  "Watcher's Eye":
    'Section=feature Note="Easily find local watch and criminal dens"',
  // Paths
  'Among The Dead':
    'Section=feature Note="TODO"',
  'Arcane Abjuration':
    'Section=combat Note="R30\' Action to turn celestial, elemental, fey, or fiend for 1 min"',
  'Arcane Abjuration (Banishment)':
    'Section=combat Note="Turned creature up to CR %V banished for 1 min"',
  'Arcane Initiate':
    'Section=magic,skill ' +
    'Note="Learn two W0 spells","Skill Proficiency (Arcana)"',
  'Arcane Mastery':
    'Section=magic Note="Add W6, W7, W8, and W9 as domain spells"',
  'Aspect Of The Elk':
    'Section=ability Note="R60\' Self and 10 allies dbl speed"',
  'Aspect Of The Tiger':
    'Section=skill ' +
    'Note="Skill Proficiency (Choose 2 from Athletics, Acrobatics, Sstealth, Survival)"',
  'Battlerager Armor':
    'Section=combat ' +
    'Note="Bonus spike attack 1d4+%1 HP piercing damage during rage, 3 HP from grapple"',
  'Battlerger Charge':'Section=combat Note="Bonus dash during rage"',
  'Bladesong':
    'Section=ability,combat,magic,skill ' +
    'Note=' +
      '"+10 Speed for 1 min 2/short rest",' +
      '"+%V AC for 1 min 2/short rest",' +
      '"+%V Concentration to retain spell for 1 min 2/short rest",' +
      '"Adv Acrobatics for 1 min 2/short rest"',
  'Bulkwark':
    'Section=combat Note="R60\' Indomitable use provides ally w/reroll"',
  'Champion Challenge':
    'Section=feature Note="TODO"',
  'Defy Death':
    'Section=feature Note="TODO"',
  'Divine Allegiance':
    'Section=feature Note="TODO"',
  'Elegant Maneuver':
    'Section=skill Note="Bonus action for Adv next Acrobatics or Athletics"',
  'Elk Totem Spirit':
    'Section=ability ' +
    'Note="+15\' Speed during rage when not wearing heavy armor"',
  'Elk Totemic Attunement':
    'Section=combat ' +
    'Note="Charge knocks down foe for 1d12+%V HP damage (DC %1 Str neg)"',
  'Exalted Champion':
    'Section=feature Note="TODO"',
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
    'Section=feature Note="TODO"',
  'Indestructible Life':
    'Section=feature Note="TODO"',
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
    'Section=feature Note="TODO"',
  'Misdirection':
    'Section=feature Note="TODO"',
  'Panache':
    'Section=skill ' +
    'Note="Persuasion vs. Insight gives hostile target Disadv attacks on others, charms non-hostile for 1 min"',
  'Potent Spellcasting':
    'Section=feature Note="TODO"',
  'Radiant Sun Bolt':
    'Section=combat ' +
    'Note="R30\' Ranged touch +%V 1d%1+%2 HP radiant damage 1/tn, spend 1 Ki for 2/tn"',
  'Rakish Audacity':
    'Section=combat ' +
    'Note="+%1 Initiative/Use Sneak Attack w/out Adv vs. solo foe"',
  'Rallying Cry':
    'Section=combat Note="R60\' Second Wind restores %V HP to 3 allies"',
  'Reckless Abandon':
    'Section=combat Note="%V temporary HP from Reckless Attack during rage"',
  'Royal Envoy':'Section=feature Note="Dbl Prof on Persuasion"',
  'Searing Arc Strike':
    'Section=magic ' +
    'Note="Spend 2-%V Ki to cast <i>Burning Hands</i> after attack"',
  'Searing Sunburst':
    'Section=magic ' +
    'Note="R150\' 20\' burst 2d6 HP radiant damage (DC %V Con neg), spend 1-3 Ki for +2d6 HP ea"',
  'Song Of Defense':
    'Section=magic Note="Expend spell slot to reduce damage by 5x slot level"',
  'Song Of Victory':
    'Section=combat Note="+%V HP damage for 1 min 2/short rest"',
  'Soul Of Deceit':
    'Section=save ' +
    'Note="Immunity to telepathy, Deception vs. Insight to present false thoughts, immunity to truth compulsion"',
  'Spell Breaker':
    'Section=magic Note="Healing spell ends spell of equal or lesser level"',
  'Spiked Retribution':
    'Section=combat ' +
    'Note="Successful attacker takes 3 HP piercing damage during rage"',
  'Spirit Seeker':
    'Section=feature Note="TODO"',
  'Spirit Seeker':
    'Section=feature Note="TODO"',
  'Spirit Walker':
    'Section=feature Note="TODO"',
  'Spirit Walker':
    'Section=feature Note="TODO"',
  'Storm Guide':
    'Section=magic ' +
    'Note="Stop rain in 20\' radius or direct winds in 100\' radius for 1 tn"',
  "Storm's Fury":
    'Section=combat ' +
    'Note="Successful attacker takes %V HP lightning damage and pushed 20\' (DC %1 Str neg push)"',
  'Sun Shield':
    'Section=combat,magic ' +
    'Note="%V HP radiant damage when hit w/melee attack",' +
         '"30\' bright light, 30\' dim at will"',
  'Tempestuous Magic':
    'Section=magic Note="Fly 10\' before or after casting spell level 1+"',
  'Tiger Totem Spirit':
    'Section=feature Note="+10\' long jump, +3\' high jump during rage"',
  'Tiger Totemic Attunement':
    'Section=combat Note="Bonus melee attack after 20\' charge"',
  'Touch Of Death':
    'Section=feature Note="TODO"',
  'Touch Of The Long Death':
    'Section=feature Note="TODO"',
  'Training In War And Song':
    'Section=combat,skill ' +
    'Note=' +
      '"Armor Proficiency (Light)/Weapon Proficiency (Choose 1 from any)",' +
      '"Skill Proficiency (Performance)"',
  'Turn The Tide':
    'Section=feature Note="TODO"',
  'Undying Nature':
    'Section=feature Note="TODO"',
  'Unyielding Spirit':
    'Section=feature Note="TODO"',
  'Wind Soul':
    'Section=ability,magic,save ' +
    'Note="60\' Fly",' +
         '"R30\' Self and %V others fly 30\' for 1 hr 1/long rest",' +
         '"Immunity to lightning and thunder damage"',
  'Wind Speaker':'Section=skill Note="Speak Primordial and dialects"'
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
      'Arcane1:1=2,' +
      'Arcane2:3=2,' +
      'Arcane3:5=2,' +
      'Arcane4:7=2,' +
      'Arcane5:9=2',
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
      '"3:Battlerager Armor","6:Reckless Abandon","10:Battlerger Charge",' +
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
      '"7:Skill Proficiency (Choose 1 from Persuasion, Animal Handling, Insight, Intimidation, Performance)",' +
      '"3:Rallying Cry","7:Royal Envoy","10:Inspiring Surge","15:Bulkwark"',
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
      '"3:Radiant Sun Bolt","6:Searing Arc Strike","11:Seearing Sunburst",' +
      '"17:Sun Shield"'
};
SwordCoast.PATHS = Object.assign({}, SRD5E.PATHS, SwordCoast.PATHS_ADDED);
SwordCoast.SPELLS_ADDED = {
  'Booming Blade':
    'School=Evocation ' +
    'Level=K0,S0,W0 ' +
    'Description="Struck foe +%Vd8 HP damage and takes %1d8 HP thunder damage on move for 1 tn"',
  'Green-Flame Blade':
    'School=Evocation ' +
    'Level=K0,S0,W0 ' +
    'Description="Struck foe +%Vd8 HP damage, R5\' foe takes %1d8+%2 HP fire damage"',
  'Lightning Lure':
    'School=Evocation ' +
    'Level=K0,S0,W0 ' +
    'Description="R15\' Target pulled 10\', takes %Vd8 HP lightning damage (Str neg)"',
  'Sword BUrst':
    'School=Conjuration ' +
    'Level=K0,S0,W0 ' +
    'Description="R5\' Spectral blades %Vd6 HP force damage (Dex neg)"'
};
SwordCoast.SPELLS_LEVELS_ADDED = {
  'Arcane Eye':'Arcana4',
  'Aura Of Vitality':'Crown3',
  'Banishment':'Crown4',
  'Circle Of Power':'Crown5',
  'Command':'Crown1',
  'Compelled Duel':'Crown1',
  'Detect Magic':'Arcana1',
  'Dispel Magic':'Arcana3',
  'Geas':'Crown5',
  'Guardian Of Faith':'Crown4',
  "Leomund's Secret Chest":'Arcana4',
  'Magic Circle':'Arcana3',
  'Magic Missile':'Arcana1',
  'Magic Weapon':'Arcana2',
  "Nystul's Magic Aura":'Arcana2',
  'Planar Binding':'Arcana5',
  'Spirit Guardians':'Crown3',
  'Teleportation Circle':'Arcana5',
  'Warding Bond':'Crown2',
  'Zone Of Truth':'Crown2'
};
SwordCoast.TOOLS_ADDED = {
  'Bird Pipes':'Type=Music',
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
  SRD5E.choiceRules(rules, type, name, attrs);
  if(type == 'Path')
    SwordCoast.pathRulesExtra(rules, name);
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
    rules.defineRule('magicNotes.arcaneAbjuration(Banishment)',
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
  } else if(name == 'Path Of The Battlerager') {
    rules.defineRule('combatNotes.battleragerArmor.1',
      'features.Battlerager Armor', '?', null,
      'strengthModifier', '=', null
    );
    rules.defineRule('combatNotes.recklessAbandon',
      'constitutionModifier', '=', 'Math.max(source, 1)'
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
      'wisdomModifier', '=', null
    );
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

/* Returns an array of plugins upon which this one depends. */
SwordCoast.getPlugins = function() {
  return [SRD5E];
};

/* Returns HTML body content for user notes associated with this rule set. */
SwordCoast.ruleNotes = function() {
  return '' +
    '<h2>D&D 5E Quilvyn Plugin Notes</h2>\n' +
    'D&D 5E Quilvyn Plugin Version ' + SwordCoast.VERSION + '\n' +
    '\n' +
    '<h3>Limitations</h3>\n' +
    '<p>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '    Quilvyn allows proficiencies from the PHB Skilled feat to be\n' +
    '    applied only to skills, rather than skills or tools.\n' +
    '  </li>\n' +
    '</ul>\n' +
    '</p>\n' +
    '\n' +
    '</p>\n';
};
