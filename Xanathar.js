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
 * This module loads the rules from Fifth Edition Xanathar's Guide to
 * Everything. The Xanathar function contains methods that load rules for
 * particular parts of the rules; raceRules for character races, magicRules for
 * spells, etc. These member methods can be called independently in order to use
 * a subset of XGTE. Similarly, the constant fields of Xanathar (FEATS,
 * BACKGROUNDS, etc.) can be manipulated to modify the choices.
 */
function Xanathar() {

  if(window.SRD5E == null) {
    alert('The Xanathar module requires use of the SRD5E module');
    return;
  }

  Xanathar.identityRules(
    SRD5E.rules, Xanathar.BACKGROUNDS, Xanathar.CLASS_SELECTABLES,
    Xanathar.DEITIES, Xanathar.PATHS, Xanathar.RACES
  );
  Xanathar.magicRules(SRD5E.rules, Xanathar.SPELLS_ADDED);
  Xanathar.talentRules(
    SRD5E.rules, Xanathar.FEATS, Xanathar.FEATURES, Xanathar.LANGUAGES,
    Xanathar.TOOLS
  );

}

Xanathar.BACKGROUNDS = {
};
Xanathar.CLASS_SELECTABLES = {
  'Barbarian':
    ['3:Path Of The Ancestral Guardian', '3:Path Of The Storm Herald',
     '3:Path Of The Zealot'],
  'Bard':
    ['3:College Of Glamour', '3:College Of Swords', '3:College Of Whispers'],
  'Cleric':
    ['1:Forge Domain', '1:Grave Domain'],
  'Druid':
    ['2:Circle Of Dreams', '2:Circle Of The Shepherd'],
  'Fighter':
    ['3:Arcane Archer Archetype', '3:Cavalier Archetype',
     '3:Samurai Archetype '],
  'Monk':
    ['3:Way Of The Drunken Master', '3:Way Of The Kensai',
     '3:Way Of The Sun Soul'],
  'Paladin':
    ['3:Oath Of Conquest', '3:Oath Of Redemption'],
  'Ranger':
    ['3:Gloom Stalker Archetype', '3:Horizon Walker Archetype',
     '3:Monster Slayer Archetype'],
  'Rogue':
    ['3:Inquisitive Archetype', '3:Mastermind Archetype', '3:Scout Archetype',
     '3:Swashbuckler Archetype'],
  'Sorcerer':
    ['1:Divine Soul Origin', '1:Shadow Magic Origin', '1:Storm Sorcery Origin'],
  'Warlock':
    ['1:The Celestial Patron', '1:The Hexblade Patron'],
  'Wizard':
    ['2:War Magic Tradition']
};
Xanathar.DEITIES = {
};
Xanathar.FEATS = {
};
Xanathar.FEATURES = {
  'Agile Parry':
    'Section=combat Note="+2 AC w/Kensei melee weapon after unarmed attack"',
  'Ancestral Protectors':
    'Section=combat ' +
    'Note="First target in rage hindered fighting others (Disadv attack, damage resistance)"',
  "Artisan's Blessing":
    'Section=magic Note="Craft up to 100 GP metal item in 1 hr"',
  'Aura Of Conquest':
    'Section=combat Note="R%V\' Frightened foes unable to move"',
  'Balm Of The Summer Court':
    'Section=magic ' +
    'Note="Distribute %Vd6 HP healing and %V temporary HP to targets 1/long rest"',
  'Blade Flourish':
    'Section=combat Note="+10\' move and flourish during attack 1/tn"',
  'Blessing Of The Forge':
    'Section=magic ' +
    'Note="Touched weapon or armor +1 until long rest 1/long rest"',
  'Celestial Radiance':
    'Section=save Note="Resistant necrotic, radiant damage"',
  'Circle Of Mortality':
    'Section=magic ' +
    'Note="Cure spells maximized for unconscious targets, <i>Spare the Dying</i> cantrip"',
  'Conquering Presence':
    'Section=magic ' +
    'Note="R30\' Channel Divinity to frighten for 1 min (Wis neg)"',
  'Consult The Spirits':
    'Section=magic ' +
    'Note="<i>Augury</i> or <i>Clairvoyance</i> via spirits 1/long rest"',
  'Defensive Flourish':
    'Section=combat ' +
    'Note="Spend 1 Bardic Inspiration for +%V HP damage and +%V AC for 1 tn"',
  'Deft Strike':
    'Section=combat Note="Spend 1 Ki for +%V damage with Kensei weapon"',
  'Divine Fury':
    'Section=combat ' +
    'Note="First hit during range +1d6+%V HP necrotic or radiant"',
  'Enthralling Performance':
    'Section=magic ' +
    'Note="1 min performance charms %V listeners for 1 hr (DC %1 Will neg) 1/long rest"',
  'Eyes Of The Grave':
    'Section=magic Note="R60\' Detect undead for 1 tn %V/long rest"',
  'Faithful Summons':
    'Section=magic ' +
    'Note="4 creatures summoned when self incapacitated for 1 hr 1/long rest"',
  'Fanatical Focus':'Section=save Note="Reroll failed save 1/rage"',
  'Guardian Spirit':
    'Section=magic Note="Summoned creatures w/in Spirit Totam aura heal %V HP"',
  'Guided Strike':
    'Section=combat Note="Channel Divinity gives +10 attack"',
  'Hearth Of Moonlight And Shadow':
    'Section=magic ' +
    'Note="30\' radius total cover, +5 Dex (Stealth) and Wis (Perception) during rest"',
  'Hidden Paths':
    'Section=magic ' +
    'Note="Teleport self 60\', willing touched 30\' %V/long rest"',
  'Invincible Conqueror':
    'Section=combat ' +
    'Note="Damage resistance, extra attack, crit on 19 1/long rest"',
  'Keeper Of Souls':
    'Section=magic Note="R60\' Dying target yields HD HP to another 1/tn"',
  "Kensei's Shot":
    'Section=combat Note="+1d4 damage with ranged Kensei weapon"',
  'Magic Kensei Weapons':
    'Section=combat Note="Kensei attacks are magical"',
  'Mantle Of Inspiration':
    'Section=magic ' +
    'Note="R60\' Bardic inspiration gives %1 targets %V temporary HP and immediate move w/out AOO"',
  'Mantle Of Majesty':
    'Section=magic Note="Cast <i>Command</i> 1/tn for 1 min 1/long rest"',
  'Mantle Of Whispers':
    'Section=magic ' +
    'Note="R30\' Capture dying person\'s shadow to use as disguise, Insight vs. +5 Deception to see through"',
  "Master's Flourish":
    'Section=combat Note="Use d6 instead of Bardic Inspiration for flourish"',
  'Mighty Summoner':
    'Section=magic Note="Summoned creatures +2 HP/HD and magical attacks"',
  'Mobile Flourish':
    'Section=combat ' +
    'Note="Use 1 Bardic Inspiration for +%V HP damage and 5\'+d%V\' push"',
  'Path To The Grave':
    'Section=magic Note="R30\' Target vulnerable to all attacks for 1 tn"',
  'Psychic Blades':
    'Section=combat ' +
    'Note="Use 1 Bardic Inspiration for +%Vd6 HP psychic damage 1/tn"',
  'Rage Beyond Death':
    'Section=combat Note="Remain conscious at 0 HP until rage ends"',
  'Raging Storm (Desert)':
    'Section=combat ' +
    'Note="Foe takes %V HP fire after melee hit (DC %1 Dex neg)"',
  'Raging Storm (Sea)':
    'Section=combat ' +
    'Note="Your hit knocks foe prone (DC %V Str neg)"',
  'Raging Storm (Tundra)':
    'Section=magic ' +
    'Note="Storm Aura prevents target movement for 1 tn (DC %V Str neg)"',
  'Saint Of Forge And Fire':
    'Section=combat,save ' +
    'Note="Resistance non-magical bludgeoning, piercing, slashing in heavy armor",' +
         '"Immunity fire"',
  'Scornful Rebuke':
    'Section=combat Note="Foes striking self take %V HP psychic damage"',
  "Sentinel At Death's Door":
    'Section=magic Note="R30\' Negate critical %V/long rest"',
  'Shadow Lore':
    'Section=magic Note="R30\' Target obeys commands for 8 hr (DC %V Wis neg)"',
  'Sharpen The Blade':
    'Section=combat ' +
    'Note="Spend 1-3 Ki to gain equal bonus to Kensei weapon attack and damage"',
  'Shielding Storm':
    'Section=magic Note="R10\' Targets gain Storm Soul resistance"',
  'Slashing Flourish':
    'Section=combat ' +
    'Note="Use 1 Bardic Inspiration for +%V HP damage to target and adjacent foe"',
  'Soul Of The Forge':
    'Section=combat,save ' +
    'Note="+1 AC in heavy armor","Resistance fire damage"',
  'Speech Of The Woods':'Section=skill Note="Learn sylvan, speak w/beasts"',
  'Spirit Shield':
    'Section=combat Note="R30\' Reduce damage to ally by %Vd6"',
  'Spirit Totem (Bear)':
    'Section=magic ' +
    'Note="R60\' Targets in 30\' radius %V temporary HP, Adv Str for 1/min 1/short rest"',
  'Spirit Totem (Hawk)':
    'Section=magic ' +
    'Note="R60\' Targets in 30\' radius Adv attack and Wis (Perception) for 1/min 1/short rest"',
  'Spirit Totem (Unicorn)':
    'Section=magic ' +
    'Note="R60\' Allies Adv to detect creatures in 30\' for 1/min, targets heal %V HP 1/short rest"',
  'Storm Aura (Desert)':
    'Section=magic Note="R10\' %V HP fire damage during rage"',
  'Storm Aura (Sea)':
    'Section=magic Note="R10\' Lightning %Vd6 HP (DC %1 Dex half)"',
  'Storm Aura (Tundra)':
    'Section=magic Note="R10\' Chosen targets %V tempoary HP"',
  'Storm Soul (Desert)':
    'Section=magic,save ' +
    'Note="Touch lights unpossessed flammable object",' +
         '"Resist fire, unaffected by extreme heat"',
  'Storm Soul (Sea)':
    'Section=ability,feature,save ' +
    'Note="30\' Swim",' +
         '"Breathe underwater",' +
         '"Resist lightning"',
  'Storm Soul (Tundra)':
    'Section=magic,save ' +
    'Note="Touch freezes unoccupied 5\' cu water",' +
         '"Resist cold, unaffected by extreme cold"',
  'Unbreakable Majesty':
    'Section=magic Note="Foe cannot attack you (DC %V Cha neg)"',
  'Unerring Accuracy':
    'Section=combat Note="Reroll monk weapon miss 1/turn"',
  'Vengeful Ancestors':
    'Section=combat ' +
    'Note="Damage prevented by Spirit Shield turned back on attacker"',
  'Walker In Dreams':
    'Section=magic Note="After short rest, cast <i>Dream</i>, <i>Scrying</i>, or <i>Teleportation Circle</i> connected to last long rest place 1/long rest"',
  'Warrior Of The Gods':
    'Section=feature ' +
    'Note="Life-restoring spell to self needs no material component"',
  'Words Of Terror':
    'Section=magic ' +
    'Note="1 min conversation frightens for 1 hr (DC %V Wisdom neg)"',
  'Zealous Presence':
    'Section=combat ' +
    'Note="R60\' Battle cry gives 10 targets Adv attack and save 1/long rest"'
};
Xanathar.LANGUAGES = {
};
Xanathar.PATHS = {
  'Arcane Archer Archetype':
    'Group=Fighter ' +
    'Level=levels.Fighter ' +
    'Features=' +
      '"3:Arcane Archer Lore","3:Arcane Shot","7:Curving Shot",' +
      '"7:Magic Arrow","15:Every-Ready Shot","18:Improved Shots"',
  'Cavalier Archetype':
    'Group=Fighter ' +
    'Level=levels.Fighter ' +
    'Features=' +
      '"3:Skill Proficiency (Choose 1 from Animal Handling/History/Insight/Performance/Persuasion",' +
      '"3:Born To The Saddle","3:Unwavering Mark","7:Warding Maneuver",' +
      '"7:Warding Maneuver","10:Hold The Line","15:Ferocious Charger",' +
      '"18:Vigilant Defender"',
  'Circle Of Dreams':
    'Group=Druid ' +
    'Level=levels.Druid ' +
    'Features=' +
      '"2:Balm Of The Summer Court","6:Hearth Of Moonlight And Shadow",' +
      '"10:Hidden Paths","14:Walker In Dreams"',
  'Circle Of The Shepherd':
    'Group=Druid ' +
    'Level=levels.Druid ' +
    'Features=' +
      '"2:Speech Of The Woods","2:Spirit Totem (Bear)",' +
      '"2:Spirit Totem (Hawk)","2:Spirit Totem (Unicorn)",' +
      '"6:Mighty Summoner","10:Guardian Spirit","14:Faithful Summons"',
  'College Of Glamour':
    'Group=Bard Level=levels.Bard ' +
    'Features=' +
      '"3:Enthralling Performance","3:Mantle Of Inspiration",' +
      '"6:Mantle Of Majesty","14:Unbreakable Majesty"',
  'College Of Swords':
    'Group=Bard Level=levels.Bard ' +
    'Features=' +
      '"3:Armor Proficiency (Medium)",' +
      '"3:Weapon Proficiency (Scimtar)",' +
      '"3:Blade Flourish","3:Defensive Flourish","3:Mobile Flourish",' +
      '"3:Slashing Flourish","6:Extra Attack","14:Master\'s Flourish" ' +
    'Selectables=' +
      '"3:Fighting Style (Dueling)","3:Fighting Style (Two-Weapon Fighting)"',
  'College Of Whispers':
    'Group=Bard Level=levels.Bard ' +
    'Features=' +
      '"3:Psychic Blades","3:Words Of Terror","6:Mantle Of Whispers",' +
      '"14:Shadow Lore"',
  'Divine Soul Origin':
    'Group=Sorcerer Level=levels.Sorcerer ' +
    'Features=' +
      '"1:Divine Magic","1:Favored By The Gods",' +
      '"6:Empowered Healing","14:Otherwordly Wings","18:Unearthly Discovery"',
  'Forge Domain':
    'Group=Cleric Level=levels.Cleric ' +
    'Features=' +
      '"1:Armor Proficiency (Heavy)",' +
      '"1:Tool Proficiency (Smith\'s Tools)",' +
      '"1:Blessing Of The Forge","2:Artisan\'s Blessing",' +
      '"6:Soul Of The Forge","8:Divine Strike","17:Saint Of Forge And Fire" ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'Forge1:1=2,' +
      'Forge2:3=2,' +
      'Forge3:5=2,' +
      'Forge4:7=2,' +
      'Forge5:9=2',
  'Gloom Stalker Archetype':
    'Group=Ranger ' +
    'Level=levels.Ranger ' +
    'Features=' +
      '"3:Dread Ambusher","3:Umbral Sight","7:Iron Mind",' +
      '"11:Stalker\'s Fury","15:Shadow Dodge" ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'Gloom1:3=1,' +
      'Gloom2:5=1,' +
      'Gloom3:9=1,' +
      'Gloom4:13=1,' +
      'Gloom5:17=1',
  'Grave Domain':
    'Group=Cleric Level=levels.Cleric ' +
    'Features=' +
      '"1:Circle Of Mortality","1:Eyes Of The Grave","2:Path To The Grave",' +
      '"6:Sentinel At Death\'s Door","8:Potent Spellcasting",' +
      '"17:Keeper Of Souls" ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'Grave1:1=2,' +
      'Grave2:3=2,' +
      'Grave3:5=2,' +
      'Grave4:7=2,' +
      'Grave5:9=2',
  'Horizon Walker Archetype':
    'Group=Ranger ' +
    'Level=levels.Ranger ' +
    'Features=' +
      '"3:Detect Portal","3:Planar Warrior","7:Ethereal Step",' +
      '"11:Distant Strike","15:Spectral Defense" ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'Horizon1:3=1,' +
      'Horizon2:5=1,' +
      'Horizon3:9=1,' +
      'Horizon4:13=1,' +
      'Horizon5:17=1',
  'Inquisitive Archetype':
    'Group=Rogue Level=levels.Rogue ' +
    'Features=' +
      '"3:Ear For Deceiit","3:Eye For Detail","3:Insightful Fighting",' +
      '"9:Steady Eye","13:Unerring Eye","17:Eye For Weakness"',
  'Mastermind Archetype':
    'Group=Rogue Level=levels.Rogue ' +
    'Features=' +
      '"3:Master Of Intrigue","3:Master Of Tactics",' +
      '"9:Insightful Manipulator","13:Misdirection","17:Soul Of Deceit"',
  'Monster Slayer Archetype':
    'Group=Ranger ' +
    'Level=levels.Ranger ' +
    'Features=' +
      '"3:Hunter\'s Sense","3:Slayer\'s Prey","7:Supernatural Defense",' +
      '"11:Magic User\'s Nemesis","15:Slayer\'s Counter" ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'Slayer1:3=1,' +
      'Slayer2:5=1,' +
      'Slayer3:9=1,' +
      'Slayer4:13=1,' +
      'Slayer5:17=1',
  'Oath Of Conquest':
    'Group=Paladin Level=levels.Paladin ' +
    'Features=' +
      '"3:Conquering Presence","3:Guided Strike","7:Aura Of Conquest",' +
      '"15:Scornful Rebuke","20:Invincible Conqueror" ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Conquest1:3=2,' +
      'Conquest2:5=2,' +
      'Conquest3:9=2,' +
      'Conquest4:13=2,' +
      'Conquest5:17=2',
  'Oath Of Redemption':
    'Group=Paladin Level=levels.Paladin ' +
    'Features=' +
      '"3:Emmisary Of Peace","3:Rebuke The Violent","7:Aura Of The Guardian",' +
      '"15:Protective Spirit","20:Emissary Of Redemption" ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Redemption1:3=2,' +
      'Redemption2:5=2,' +
      'Redemption3:9=2,' +
      'Redemption4:13=2,' +
      'Redemption5:17=2',
  'Path Of The Ancestral Guardian':
    'Group=Barbarian Level=levels.Barbarian ' +
    'Features=' +
      '"3:Ancestral Protectors","6:Spirit Shield","10:Consult The Spirits",' +
      '"14:Vengeful Ancestors"',
  'Path Of The Storm Herald':
    'Group=Barbarian Level=levels.Barbarian ' +
    'Features=' +
      '"features.Storm Aura (Desert) ? 6:Storm Soul (Desert)",' +
      '"features.Storm Aura (Sea) ? 6:Storm Soul (Sea)",' +
      '"features.Storm Aura (Tundra) ? 6:Storm Soul (Tundra)",' +
      '"10:Shielding Storm",' +
      '"features.Storm Aura (Desert) ? 14:Raging Storm (Desert)",' +
      '"features.Storm Aura (Sea) ? 14:Raging Storm (Sea)",' +
      '"features.Storm Aura (Tundra) ? 14:Raging Storm (Tundra)" ' +
    'Selectables=' +
      '"3:Storm Aura (Desert)","3:Storm Aura (Sea)","3:Storm Aura (Tundra)"',
  'Path Of The Zealot':
    'Group=Barbarian Level=levels.Barbarian ' +
    'Features=' +
      '"3:Divine Fury","3:Warrior Of The Gods","6:Fanatical Focus",' +
      '"10:Zealous Presence","14:Rage Beyond Death"',
  'Samurai Archetype':
    'Group=Fighter ' +
    'Level=levels.Fighter ' +
    'Features=' +
      '"3:Skill Proficiency (Choose 1 from History/Insight/Performance/Persuasion",' +
      '"3:Fighting Spirit","7:Elegant Courtier","10:Tireless Spirit",' +
      '"15:Rapid Strike","18:Strength Before Death"',
  'Shadow Magic Origin':
    'Group=Sorcerer Level=levels.Sorcerer ' +
    'Features=' +
      '"1:Eyes Of The Dark","1:Strength Of The Grave",' +
      '"6:Hound Of Ill Omen","14:Shadow Walk","18:Umbral Form"',
  'Storm Sorcery Origin':
    'Group=Sorcerer Level=levels.Sorcerer ' +
    'Features=' +
      '"1:Wind Speaker","1:Tempestuous Magic","6:Heart Of The Storm",' +
      '"6:Storm Guide","14:Storm\'s Fury","18:Wind Soul"',
  'Way Of The Drunken Master':
    'Group=Monk Level=levels.Monk ' +
    'Features=' +
      '"3:Skill Proficiency (Performance)",' +
      '"3:Tool Proficiency (Brewer\'s Supplies)",' +
      '"3:Drunken Technique","6:Tipsy Sway","11:Drunkard\'s Luck",' +
      '"17:Intoxicated Frenzy"',
  'Swashbuckler Archetype':
    'Group=Rogue Level=levels.Rogue ' +
    'Features=' +
      '"3:Fancy Footwork","3:Rakish Audacity","9:Panache",' +
      '"13:Elegant Maneuver","17:Master Duelist"',
  'The Celestial Patron':
    'Group=Warlock Level=levels.Warlock ' +
    'Features=' +
      '"1:Bonus Cantrips","1:Healing Light","6:Radiant Soul",' +
      '"10:Celestial Resilience","14:Searing Vengeance"',
  'The Hexblade':
    'Group=Warlock Level=levels.Warlock ' +
    'Features=' +
      '"1:Hexblade\'s Curse","1:Hex Warrior","6:Accursed Specter",' +
      '"10:Armor Of Hexes","14:Master Of Hexes"',
  'War Magic Tradition':
    'Group=Wizard Level=levels.Wizard ' +
    'Features=' +
      '"2:Arcane Deflection","2:Tactical Wit","6:Power Surge",' +
      '"10:Durable Magic","14:Deflecting Shroud"',
  'Way Of The Kensei':
    'Group=Monk Level=levels.Monk ' +
    'Features=' +
      '"3:Tool Proficiency (Choose 1 from Calligrapher\'s Supplies, Painter\'s Supplies)",' +
      '"3:Weapon Proficiency (Choose 2 from any)",' +
      '"3:Agile Parry","3:Kensei\'s Shot","6:Magic Kensei Weapons",' +
      '"6:Deft Strike","11:Sharpen The Blade","17:Unerring Accuracy"',
  'Way Of The Sun Soul':
    'Group=Monk Level=levels.Monk ' +
    'Features=' +
      '"3:Radiant Sun Bolt","6:Searing Arc Strike","11:Searing Sunburst",' +
      '"17:Sun Shield"'
};
Xanathar.RACES = {
};
Xanathar.SPELLS_ADDED = {
  'Animate Objects':'Level=Forge5',
  'Antilife Shell':'Level=Grave5',
  'Armor Of Agathys':'Level=Conquest1',
  'Bane':'Level=Grave1',
  'Banishment':'Level=Horizon4,Slayer4',
  'Bestow Curse':'Level=Conquest3',
  'Blight':'Level=Grave4',
  'Calm Emotions':'Level=Redemption2',
  'Cloudkill':'Level=Conquest5',
  'Command':'Level=Conquest1',
  'Counterspell':'Level=Redemption3',
  'Creation':'Level=Forge5',
  'Death Ward':'Level=Grave4',
  'Disguise Self':'Level=Gloom1',
  'Dominate Beast':'Level=Conquest4',
  'Dominate Person':'Level=Conquest5',
  'Elemental Weapon':'Level=Forge3',
  'Fabricate':'Level=Forge4',
  'False Life':'Level=Grave1',
  'Fear':'Level=Conquest3,Gloom3',
  'Gentle Repose':'Level=Grave2',
  'Greater Invisibility':'Level=Gloom4',
  'Haste':'Level=Horizon3',
  'Heat Metal':'Level=Forge2',
  'Hold Monster':'Level=Redemption5,Slayer5',
  'Hold Person':'Level=Conquest2,Redemption2',
  'Hypnotic Pattern':'Level=Redemption3',
  'Identify':'Level=Forge1',
  'Magic Circle':'Level=Slayer3',
  'Magic Weapon':'Level=Forge2',
  'Misty Step':'Level=Horizon2',
  'Protection From Energy':'Level=Forge3',
  'Protection From Evil And Good':'Level=Horizon1,Slayer1',
  'Raise Dead':'Level=Grave5',
  'Ray Of Enfeeblement':'Level=Grave2',
  'Resilient Sphere':'Level=Redemption4',
  'Revivify':'Level=Grave3',
  'Rope Trick':'Level=Gloom2',
  'Sanctuary':'Level=Redemption1',
  'Sleep':'Level=Redemption1',
  'Searing Smite':'Level=Forge1',
  'Seeming':'Level=Gloom5',
  'Spiritual Weapon':'Level=Conquest2',
  'Stoneskin':'Level=Conquest4,Redemption4',
  'Teleportation Circle':'Level=Horizon5',
  'Vampiric Touch':'Level=Grave3',
  'Wall Of Fire':'Level=Forge4',
  'Wall Of Force':'Level=Redemption5',
  'Zone Of Truth':'Level=Slayer2'
};
Xanathar.TOOLS = {
  'Harp':'Type=Music',
  'Rito Game Set':'Type=Game',
  'Voice':'Type=Music'
};

/* Defines rules related to basic character identity. */
Xanathar.identityRules = function(
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
    Xanathar.pathRulesExtra(rules, path);
  }
  for(var race in races) {
    rules.choiceRules(rules, 'Race', race, races[race]);
  }

};

/* Defines rules related to magic use. */
Xanathar.magicRules = function(rules, spells) {
  QuilvynUtils.checkAttrTable(spells, ['School', 'Level', 'Description']);
  for(var s in spells) {
    rules.choiceRules
      (rules, 'Spell', s, (SRD5E.SPELLS[s]||PHB5E.SPELLS[s]) + ' ' + spells[s]);
  }
};

/* Defines rules related to character aptitudes. */
Xanathar.talentRules = function(rules, feats, features, languages, tools) {

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

/* Defines the rules related to character classes. */
Xanathar.pathRulesExtra = function(rules, name) {

  var pathLevel =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '') +
    'Level';

  if(name == 'Circle Of Dreams') {
    rules.defineRule('magicNotes.balmOfTheSummerCourt', pathLevel, '=', null);
    rules.defineRule
      ('magicNotes.hiddenPaths', 'wisdomModifier', '=', 'Math.max(source, 1)');
  } else if(name == 'Circle Of The Shepherd') {
    rules.defineRule
      ('languages.Sylvan', pathLevel, '=', 'source>=2 ? 1 : null');
    rules.defineRule
      ('magicNotes.spiritTotem(Bear)', pathLevel, '=', '5 + source');
    rules.defineRule('magicNotes.spiritTotem(Unicorn)', pathLevel, '=', null);
    rules.defineRule
      ('magicNotes.guardianSpirit', pathLevel, '=', 'Math.floor(source / 2)');
  } else if(name == 'College Of Glamour') {
    rules.defineRule('magicNotes.enthrallingPerformance',
      'charismaModifier', '=', 'Math.max(source, 1)'
    );
    rules.defineRule('magicNotes.enthrallingPerformance.1',
      'features.Enthralling Performance', '?', null,
      'spellDifficultyClass.B', '=', null
    );
    rules.defineRule('magicNotes.mantleOfInspiration',
      pathLevel, '=', 'Math.min(Math.floor(source / 5) * 3 + 5, 14)'
    );
    rules.defineRule('magicNotes.mantleOfInspiration.1',
      'features.Mantle Of Inspiration', '?', null,
      'charismaModifier', '=', 'Math.max(source, 1)'
    );
    rules.defineRule
      ('magicNotes.unbreakableMajesty', 'spellDifficultyClass.B', '=', null);
  } else if(name == 'College Of Swords') {
    rules.defineRule
      ('combatNotes.defensiveFlourish', 'bardicInspirationDie', '=', null);
    rules.defineRule
      ('combatNotes.extraAttack', pathLevel, '+=', 'source>=6 ? 1 : null');
    rules.defineRule
      ('combatNotes.mobileFlourish', 'bardicInspirationDie', '=', null);
    rules.defineRule
      ('combatNotes.slashingFlourish', 'bardicInspirationDie', '=', null);
    rules.defineRule('selectableFeatureCount.Bard', pathLevel, '+', '1');
  } else if(name == 'College Of Whispers') {
    rules.defineRule('combatNotes.psychicBlades',
      pathLevel, '=', 'source>=15 ? 8 : source>=10 ? 5 : source>=5 ? 3 : 2'
    );
    rules.defineRule
      ('magicNotes.shadowLore', 'spellDifficultyClass.B', '=', null);
    rules.defineRule
      ('magicNotes.wordsOfTerror', 'spellDifficultyClass.B', '=', null);
  } else if(name == 'Forge Domain') {
    rules.defineRule('armorClass', 'combatNotes.soulOfTheForge.1', '+', null);
    // Show Soul Of The Forge note even when not in heavy harmor
    rules.defineRule('combatNotes.soulOfTheForge.1',
      'combatNotes.soulOfTheForge', '?', null,
      'armorWeight', '=', 'source == 3 ? 1 : null'
    );
  } else if(name == 'Grave Domain') {
    rules.defineRule('magicNotes.eyesOfTheGrave',
      'wisdomModifier', '=', 'Math.max(source, 1)'
    );
    rules.defineRule
      ('magicNotes.potentSpellcasting', 'wisdomModifier', '=', null);
    rules.defineRule("magicNotes.sentinelAtDeath'sDoor",
      'wisdomModifier', '=', 'Math.max(source, 1)'
    );
  } else if(name == 'Oath Of Conquest') {
    rules.defineRule
      ('combatNotes.auraOfConquest', pathLevel, '=', 'source>=18 ? 30 : 10');
    rules.defineRule('combatNotes.scornfulRebuke',
      'charismaModifier', '=', 'Math.max(source, 1)'
    );
  } else if(name == 'Path Of The Ancestral Guardian') {
    rules.defineRule('combatNotes.spiritShield',
      pathLevel, '=', 'source>=14 ? 4 : source>=10 ? 3 : 2'
    );
  } else if(name == 'Path Of The Storm Herald') {
    rules.defineRule('combatNotes.ragingStorm(Desert)',
      pathLevel, '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('combatNotes.ragingStorm(Desert).1',
      'proficiencyBonus', '=', '8 + source',
      'constitutionModifier', '+', null
    );
    rules.defineRule('combatNotes.ragingStorm(Sea)',
      'proficiencyBonus', '=', '8 + source',
      'constitutionModifier', '+', null
    );
    rules.defineRule('magicNotes.ragingStorm(Tundra)',
      'proficiencyBonus', '=', '8 + source',
      'constitutionModifier', '+', null
    );
    rules.defineRule('selectableFeatureCount.Barbarian', pathLevel, '+', '1');
    rules.defineRule('magicNotes.stormAura(Desert)',
      pathLevel, '=', 'Math.floor(source / 5) + 2'
    );
    rules.defineRule('magicNotes.stormAura(Sea)',
      pathLevel, '=', 'Math.floor(source / 5) + 1'
    );
    rules.defineRule('magicNotes.stormAura(Sea).1',
      'features.Storm Aura (Sea)', '?', null,
      'proficiencyBonus', '=', '8 + source',
      'constitutionModifier', '+', null
    );
    rules.defineRule('magicNotes.stormAura(Tundra)',
      pathLevel, '=', 'Math.floor(source / 5) + 2'
    );
  } else if(name == 'Path Of The Zealot') {
    rules.defineRule
      ('combatNotes.divineFury', pathLevel, '=', 'Math.floor(source / 2)');
  } else if(name == 'Way Of The Kensei') {
    rules.defineRule('combatNotes.deftStrike', 'monkMeleeDieBonus', '=', null);
  }

};
