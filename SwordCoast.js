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
 * This module loads the rules from Fifth Edition Sword Coast Adventurer's
 * Guide.  The SwordCoast function contains methods that load rules
 * for particular parts of the rules; raceRules for character races, magicRules
 * for spells, etc.  These member methods can be called independently in order
 * to use a subset of the 5E PHB.  Similarly, the constant fields of SwordCoast
 * (FEATS, BACKGROUNDS, etc.) can be manipulated to modify the choices.
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
  SwordCoast.SPELLS = Object.assign({}, PHB5E.SPELLS, SwordCoast.SPELLS_ADDED);
  for(var s in SwordCoast.SPELLS_LEVELS_ADDED) {
    SwordCoast.SPELLS[s] =
      SwordCoast.SPELLS[s].replace('Level=', 'Level=' + SwordCoast.SPELLS_LEVELS_ADDED[s] + ',');
  }

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
      '"1:Skill Proficiency (Athletics/Insight)",' +
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
  'All Eyes On You':
    'Section=feature Note="TODO"',
  'Court Functionary':
    'Section=feature Note="TODO"',
  'Ear To The Ground':
    'Section=feature Note="TODO"',
  'Inheritance':
    'Section=feature Note="TODO"',
  'Kept In Style':
    'Section=feature Note="TODO"',
  'Knightly Regard':
    'Section=feature Note="TODO"',
  'Library Access':
    'Section=feature Note="TODO"',
  'Mercenary Life':
    'Section=feature Note="TODO"',
  'Respect Of The Stout Folk':
    'Section=feature Note="TODO"',
  'Safe Haven':
    'Section=feature Note="TODO"',
  'Uthgardt Heritage':
    'Section=feature Note="TODO"',
  "Watcher's Eye":
    'Section=feature Note="TODO"',
  // Paths
  'Among The Dead':
    'Section=feature Note="TODO"',
  'Arcane Abjuration':
    'Section=feature Note="TODO"',
  'Arcane Initiate':
    'Section=feature Note="TODO"',
  'Arcane Mastery':
    'Section=feature Note="TODO"',
  'Aspect Of The Elk':
    'Section=ability Note="R60\' Self and 10 allies dbl speed"',
  'Aspect Of The Tiger':
    'Section=skill ' +
    'Note="Skill Proficiency (Choose 2 from Athletics, Acrobatics, Sstealth, Survival)"',
  'Battlerager Armor':
    'Section=feature Note="TODO"',
  'Battlerger Charge':
    'Section=feature Note="TODO"',
  'Bladesong':
    'Section=feature Note="TODO"',
  'Bulkwark':
    'Section=feature Note="TODO"',
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
    'Section=feature Note="TODO"',
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
    'Section=feature Note="TODO"',
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
    'Section=feature Note="TODO"',
  'Reckless Abandon':
    'Section=feature Note="TODO"',
  'Royal Envoy':
    'Section=feature Note="TODO"',
  'Searing Arc Strike':
    'Section=magic ' +
    'Note="Spend 2-%V Ki to cast <i>Burning Hands</i> after attack"',
  'Searing Sunburst':
    'Section=magic ' +
    'Note="R150\' 20\' burst 2d6 HP radiant damage (DC %V Con neg), spend 1-3 Ki for +2d6 HP ea"',
  'Song Of Defense':
    'Section=feature Note="TODO"',
  'Song Of Victory':
    'Section=feature Note="TODO"',
  'Soul Of Deceit':
    'Section=save ' +
    'Note="Immunity to telepathy, Deception vs. Insight to present false thoughts, immunity to truth compulsion"',
  'Spell Breaker':
    'Section=feature Note="TODO"',
  'Spiked Distribution':
    'Section=feature Note="TODO"',
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
  'Trainging In War And Song':
    'Section=feature Note="TODO"',
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
      '"1:Arcane Initiate","2:Arcane Abjuration","6:Spell Breaker",' +
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
      '"2:Trainging In War And Song","2:Bladesong","6:Extra Attack",' +
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
      '"14:Spiked Distribution"',
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

/*
 * Adds #name# as a possible user #type# choice and parses #attrs# to add rules
 * related to selecting that choice.
 */
SwordCoast.choiceRules = function(rules, type, name, attrs) {
  SRD5E.choiceRules(rules, type, name, attrs);
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

  if(name == 'Arcane Trickster') {

    rules.defineRule('magicNotes.spellThief',
      'intelligenceModifier', '=', '8 + source',
      'proficiencyBonus', '+', null
    );

  } else if(name == 'Assassin') {

    rules.defineRule('combatNotes.deathStrike',
      'dexterityModifier', '=', '8 + source',
      'proficiencyBonus', '+', null
    );

  } else if(name == 'Battle Master') {

    rules.defineRule('combatNotes.superiorityDice',
      pathLevel, '=', 'source<7 ? 4 : source<15 ? 5 : 6'
    );
    rules.defineRule('combatNotes.superiorityDice.1',
      'fighterFeatures.Superiority Dice', '?', null,
      pathLevel, '=', 'source<10 ? 8 : source<18 ? 10 : 12'
    );
    rules.defineRule('maxDexOrStrMod',
      'dexterityModifier', '=', null,
      'strengthModifier', '^', null
    );
    rules.defineRule('combatNotes.maneuvers',
      pathLevel, '=', 'source<7 ? 3 : source<10 ? 5 : source<15 ? 7 : 9'
    );
    rules.defineRule('combatNotes.maneuvers.1',
      'fighterFeatures.Battle Master', '?', null,
      'proficiencyBonus', '=', '8 + source',
      'maxDexOrStrMod', '+', null
    );
    rules.defineRule('combatNotes.parry', 'dexterityModifier', '=', null);
    rules.defineRule('combatNotes.rally', 'charismaModifier', '=', null);
    rules.defineRule('selectableFeatureCount.Fighter (Maneuver)',
      'combatNotes.maneuvers', '=', null
    );

  } else if(name == 'Circle Of The Moon') {

    rules.defineRule
      ('magicNotes.wildShape.1', 'magicNotes.circleForms', '=', null);
    rules.defineRule('magicNotes.circleForms',
      pathLevel, '=', 'source < 6 ? 1 : Math.floor(source / 3)'
    );

  } else if(name == 'College Of Valor') {

    rules.defineRule('bardExtraAttacks',
      'bardFeatures.Extra Attack', '?', null,
      pathLevel, '=', 'source<6 ? null : 1'
    );
    rules.defineRule('combatNotes.extraAttack', 'bardExtraAttacks', '+=', null);

  } else if(name == 'Eldritch Knight') {

    rules.defineRule('combatNotes.warMagic',
      pathLevel, '=', 'source<18 ? "cantrip" : "any spell"'
    );

  } else if(name == 'Knowledge Domain') {

    rules.defineRule
      ('magicNotes.potentSpellcasting', 'wisdomModifier', '=', null);
    rules.defineRule
      ('skillChoices.Arcana', 'skillNotes.blessingsOfKnowledge', '=', '1');
    rules.defineRule
      ('skillChoices.History', 'skillNotes.blessingsOfKnowledge', '=', '1');
    rules.defineRule
      ('skillChoices.Nature', 'skillNotes.blessingsOfKnowledge', '=', '1');
    rules.defineRule
      ('skillChoices.Religion', 'skillNotes.blessingsOfKnowledge', '=', '1');

  } else if(name == 'Light Domain') {

    rules.defineRule
      ('magicNotes.potentSpellcasting', 'wisdomModifier', '=', null);
    rules.defineRule('magicNotes.radianceOfTheDawn', pathLevel, '=', null);
    rules.defineRule
      ('magicNotes.wardingFlare', 'wisdomModifier', '=', 'Math.max(source, 1)');

  } else if(name == 'Nature Domain') {

    rules.defineRule
      ('skillChoices.Animal Handling', 'skillNotes.acolyteOfNature', '=', '1');
    rules.defineRule
      ('skillChoices.Nature', 'skillNotes.acolyteOfNature', '=', '1');
    rules.defineRule
      ('skillChoices.Survival', 'skillNotes.acolyteOfNature', '=', '1');

  } else if(name == 'Oath Of The Ancients') {

    rules.defineRule
      ('saveNotes.auraOfWarding', pathLevel, '=', 'source<18 ? 10 : 30');

  } else if(name == 'Path Of The Totem Warrior (Bear)') {

    rules.defineRule('carry', 'abilityNotes.aspectOfTheBear', '*', '2');
    rules.defineRule('lift', 'abilityNotes.aspectOfTheBear', '*', '2');

  } else if(name == 'School Of Abjuration') {

    rules.defineRule('magicNotes.arcaneWard',
      pathLevel, '=', 'source * 2',
      'intelligenceModifier', '+', null
    );

  } else if(name == 'School Of Divination') {

    rules.defineRule('magicNotes.portent', pathLevel, '=', 'source<14 ? 2 : 3');

  } else if(name == 'School Of Enchantment') {

    rules.defineRule('magicNotes.alterMemories',
      'charismaModifier', '=', 'Math.max(source + 1, 1)'
    );

  } else if(name == 'School Of Necromancy') {

    rules.defineRule('magicNotes.undeadThralls', pathLevel, '=', null);
    rules.defineRule
      ('magicNotes.undeadThralls.1', 'proficiencyBonus', '=', null);

  } else if(name == 'Tempest Domain') {

    rules.defineRule('combatNotes.wrathOfTheStorm',
      'wisdomModifier', '=', 'Math.max(source, 1)'
    );

  } else if(name == 'War Domain') {

    rules.defineRule
      ('combatNotes.warPriest', 'wisdomModifier', '=', 'Math.max(source, 1)');

  } else if(name == 'Way Of The Four Elements') {

    rules.defineRule('magicNotes.discipleOfTheElements',
      'monkFeatures.Way Of The Four Elements', '?', null,
      pathLevel, '=', 'Math.floor( (source + 4) / 5)'
    );
    rules.defineRule('selectableFeatureCount.Monk (Elemental Discipline)',
      'magicNotes.discipleOfTheElements', '=', null
    );

  }

};

/*
 * Defines in #rules# the rules associated with race #name# that cannot be
 * derived directly from the attributes passed to raceRules.
 */
SwordCoast.raceRulesExtra = function(rules, name) {
  if(name == 'Dark Elf') {
    rules.defineRule('magicNotes.drowMagic',
      'race', '?', 'source == "Dark Elf"',
      'level', '=',
        'source<3 ? "<i>Dancing Lights</i> cantrip" : ' +
        'source<5 ? "<i>Dancing Lights</i> cantrip, <i>Faerie Fire</i> 1/long rest" : ' +
        '"<i>Dancing Lights</i> cantrip, <i>Faerie Fire</i> 1/long rest, <i>Darkness</i> 1/long rest"'
    );
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
