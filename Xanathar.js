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
  'Barbarian':[
    '3:Path Of The Ancestral Guardian:Primal Path',
    '3:Path Of The Storm Herald:Primal Path',
    '3:Path Of The Zealot:Primal Path'
  ],
  'Bard':[
    '3:College Of Glamour:Bard College', '3:College Of Swords:Bard College',
    '3:College Of Whispers:Bard College'
  ],
  'Cleric':[
    'deityDomains =~ \'Forge\' ? 1:Forge Domain:Divine Domain',
    'deityDomains =~ \'Grave\' ? 1:Grave Domain:Divine Domain'
  ],
  'Druid':[
    '2:Circle Of Dreams:Druid Circle', '2:Circle Of The Shepherd:Druid Circle'
  ],
  'Fighter':[
    '3:Arcane Archer:Martial Archetype', '3:Cavalier:Martial Archetype',
    '3:Samurai:Martial Archetype',
    '3:Banishing Arrow:Arcane Shot', '3:Beguiling Arrow:Arcane Shot',
    '3:Bursting Arrow:Arcane Shot', '3:Enfeebling Arrow:Arcane Shot',
    '3:Grasping Arrow:Arcane Shot', '3:Piercing Arrow:Arcane Shot',
    '3:Seeking Arrow:Arcane Shot', '3:Shadow Arrow:Arcane Shot'
  ],
  'Monk':[
    '3:Way Of The Drunken Master:Monastic Tradition',
    '3:Way Of The Kensai:Monastic Tradition',
    '3:Way Of The Sun Soul:Monastic Tradition'
  ],
  'Paladin':[
    '3:Oath Of Conquest:Sacred Oath', '3:Oath Of Redemption:Sacred Oath'
  ],
  'Ranger':[
    '3:Gloom Stalker:Ranger Archetype', '3:Horizon Walker:Ranger Archetype',
    '3:Monster Slayer:Ranger Archetype'
  ],
  'Rogue':[
    '3:Inquisitive:Roguish Archetype', '3:Mastermind:Roguish Archetype',
    '3:Scout:Roguish Archetype', '3:Swashbuckler:Roguish Archetype'
  ],
  'Sorcerer':[
    '1:Divine Soul:Sorcerous Origin', '1:Shadow Magic:Sorcerous Origin',
    '1:Storm Sorcery:Sorcerous Origin'
  ],
  'Warlock':[
    '1:The Celestial:Otherworldly Patron', '1:The Hexblade:Otherworldly Patron',
    'features.Pact Of The Tome ? 1:Aspect Of The Moon:Eldritch Invocation',
    '5:Cloak Of Flies:Eldritch Invocation',
    'features.Pact Of The Blade ? 5:Eldritch Smite:Eldritch Invocation',
    '7:Ghostly Gaze:Eldritch Invocation',
    '5:Gift Of The Depths:Eldritch Invocation',
    'features.Pact Of The Chain ? 1:Gift Of The Ever-Living Ones:Eldritch Invocation',
    'spells.Eldritch Blast ? 1:Grasp Of Hadar:Eldritch Invocation',
    'features.Pact Of The Blade ? 1:Improved Pacdt Weapon:Eldritch Invocation',
    'spells.Eldritch Blast ? 1:Lance Of Lethargy:Eldritch Invocation',
    '5:Maddening Hex:Eldritch Invocation',
    '7:Relentless Hex:Eldritch Invocation',
    '15:Shroud Of Shadow:Eldritch Invocation',
    '5:Tomb Of Levistus:Eldritch Invocation',
    "7:Trickster's Escape:Eldritch Invocation"
  ],
  'Wizard':['2:War Magic:Arcane Tradition']
};
Xanathar.DEITIES = {
  'Celtic-Goibhniu':'Domain=Forge',
  'Dragonlance-Reorx':'Domain=Forge',
  'Eberron-Onatar':'Domain=Forge',
  'Eberron-The Undying Court':'Domain=Grave',
  'Egyptian-Anubis':'Domain=Grave',
  'Egyptian-Osiris':'Domain=Grave',
  'FR-Gond':'Domain=Forge',
  'FR-Kelemvor':'Domain=Grave',
  'Greek-Hades':'Domain=Grave',
  'Greek-Hephaestus':'Domain=Forge',
  'Greyhawk-Wee Jas':'Domain=Grave',
  'NH-Moradin':'Domain=Forge'
};
Xanathar.FEATS = {
};
Xanathar.FEATURES = {
  'Accursed Specter':
    'Section=combat ' +
    'Note="Raise slain humanoid as specter w/%V temporary HP, +%1 attack until long rest 1/long rest"',
  'Agile Parry':
    'Section=combat Note="+2 AC w/Kensei melee weapon after unarmed attack"',
  'Ambush Master':
    'Section=combat ' +
    'Note="Adv Initiative, allies Adv vs. foe struck first rd for 1 tn"',
  'Ancestral Protectors':
    'Section=combat ' +
    'Note="First target in rage hindered fighting others (Disadv attack, damage resistance) 1 tn"',
  'Arcane Archer Lore':
    'Section=magic ' +
    'Note="Know <i>Druidcraft</i> or <i>Prestidigitation</i> cantrip"',
  'Arcane Deflection':
    'Section=magic ' +
    'Note="Trade 1 tn non-cantrip casting for +2 AC or +4 save when hit"',
  'Arcane Shot':'Section=combat Note="Use 1 of %V effects 1/tn 2/short rest"',
  'Armor Of Hexes':
    'Section=combat Note="Self hits from Hexblade\'s Curse target miss 4/6"',
  "Artisan's Blessing":
    'Section=magic ' +
    'Note="Use Channel Divinity to craft up to 100 GP metal item in 1 hr"',
  'Aura Of Conquest':
    'Section=combat Note="R%V\' Frightened foes unable to move"',
  'Aura Of The Guardian':
    'Section=magic Note="R%V\' Transfer damage from another to self"',
  'Balm Of The Summer Court':
    'Section=magic ' +
    'Note="R120\' Distribute %Vd6 HP healing and %V temporary HP to targets 1/long rest"',
  'Banishing Arrow':
    'Section=combat ' +
    'Note="+%Vd6 HP force damage, send target to Feywild until next tn (DC %1 neg)"',
  'Beguiling Arrow':
    'Section=combat ' +
    'Note="+%Vd6 HP psychic damage, target charmed by R30\' ally (DC %V Wis neg)"',
  'Blade Flourish':
    'Section=combat Note="+10\' move and flourish during attack 1/tn"',
  'Blessing Of The Forge':
    'Section=magic ' +
    'Note="Touched weapon or armor +1 until long rest 1/long rest"',
  'Bonus Celestial Cantrips':
    'Section=magic Note="<i>Light</> and <i>Sacred Flame</i>"',
  'Born To The Saddle':
    'Section=skill ' +
    'Note="Adv falling off mount, no damage 10\' fall, dis/mount costs 5\' move"',
  'Bursting Arrow':'Section=combat Note="10\' diameter %Vd6 HP force damage"',
  'Celestial Radiance':
    'Section=save Note="Resistant to necrotic, radiant damage"',
  'Celestial Resilience':
    'Section=combat ' +
    'Note="Self %V temporary HP, 5 others %1 temporary HP/short rest"',
  'Circle Of Mortality':
    'Section=magic ' +
    'Note="Cure spells maximized for unconscious targets, R30\' <i>Spare The Dying</i> cantrip"',
  'Conquering Presence':
    'Section=magic ' +
    'Note="R30\' Channel Divinity to frighten for 1 min (Wis neg)"',
  'Consult The Spirits':
    'Section=magic ' +
    'Note="<i>Augury</i> or <i>Clairvoyance</i> via spirits 1/short rest"',
  'Defensive Flourish':
    'Section=combat ' +
    'Note="Spend 1 Bardic Inspiration for +d%V damage and AC for 1 tn"',
  'Deflecting Shroud':
    'Section=magic ' +
    'Note="R60\' Arcane Deflection strikes 3 targets with %V HP force damage"',
  'Deft Strike':
    'Section=combat Note="Spend 1 Ki for +%V damage with Kensei weapon"',
  'Detect Portal':'Section=magic Note="R1 mi Sense planar portal 1/long rest"',
  'Distant Strike':
    'Section=combat Note="Teleport 10\' beore attack, attack 3rd creature"',
  'Divine Fury':
    'Section=combat ' +
    'Note="First hit during each tn rage +1d6+%V HP necrotic or radiant"',
  'Divine Magic':'Section=magic Note="Access to Cleric spells"',
  'Dread Ambusher':
    'Section=combat Note="+%V Initiative/+10\' speed, additional weapon attack w/+1d8 damage"',
  "Drunkard's Luck":'Section=feature Note="Spend 2 Ki to cancel Disadv"',
  'Drunken Technique':
    'Section=combat Note="Disengage and +10\' move during Flurry Of Blows"',
  'Durable Magic':
    'Section=combat,save ' +
    'Note="+2 AC during spell conc","+2 saves during spell conc"',
  'Elegant Courtier':
    'Section=save,skill ' +
    // TODO Choice of Int, Cha if already has Wis
    'Note="Save Proficiency (Wisdom)","+%V Persuasion"',
  'Elegant Maneuver':
    'Section=skill Note="Bonus action for Adv next Acrobatics or Athletics"',
  'Emissary Of Peace':
    'Section=skill Note="Channel Energy for +5 Persuasion for 10 min"',
  'Emissary Of Redemption':
    'Section=combat ' +
    'Note="When not attacking, resistance to all damage, attacker takes half self damage"',
  'Empowered Healing':
    'Section=magic Note="R5\' Spend 1 Sorcery Point to reroll self or ally healing dice 1/tn"',
  'Enfeebling Arrow':
    'Section=combat ' +
    'Note="+%Vd6 HP necrotic damage, damage by target halved 1 tn (DC %V Con neg)"',
  'Enthralling Performance':
    'Section=magic ' +
    'Note="R60\' 1 min performance charms %V listeners for 1 hr (DC %1 Will neg) 1/short rest"',
  'Ethereal Step':'Section=magic Note="Ethereal for 1 tn 1/short rest"',
  'Ever-Ready Shot':'Section=combat Note="Min 1 Arcane Shot after Initiative"',
  'Eye For Detail':
    'Section=skill ' +
    'Note="Bonus Perception action to spot hidden item or Investigation to uncover clue"',
  'Eye For Weakness':
    'Section=combat ' +
    'Note="+3d6 Sneak Attack after successful Insightful Fighting"',
  'Eyes Of The Dark':
    'Section=feature,magic ' +
    'Note="120\' Darkvision",' +
         '"Cast <i>Darkness</i> using spell slot or 2 Sorcery Points"',
  'Eyes Of The Grave':
    'Section=magic Note="R60\' Detect undead for 1 tn %V/long rest"',
  'Faithful Summons':
    'Section=magic ' +
    'Note="4 creatures summoned for 1 hr when self incapacitated 1/long rest"',
  'Fanatical Focus':'Section=save Note="Reroll failed save 1/rage"',
  'Fancy Footwork':
    'Section=combat Note="Struck foe cannot make opportunity attacks for 1 tn"',
  'Favored By The Gods':
    'Section=feature Note="Add 2d4 to failed attack or save 1/short rest"',
  'Ferocious Charger':
    'Section=combat ' +
    'Note="Hit after 10\' move knocks prone 1/tn (DC %V Str neg)"',
  'Fighting Spirit':
    'Section=combat Note="Adv attack, %V temporary HP for 1 tn 3/long rest"',
  'Grasping Arrow':
    'Section=combat ' +
    'Note="+%V6 HP poison damage, target move -10\' + %Vd6 HP slashing damage for 1 min or successful DC %V Athletics check"',
  'Guardian Spirit':
    'Section=magic Note="Summoned creatures w/in Spirit Totem aura heal %V HP"',
  'Guided Strike':'Section=combat Note="Channel Divinity gives +10 attack"',
  'Heart Of The Storm':
    'Section=magic,save ' +
    'Note="R10\' Lightning/thunder damage when casting lightning/thunder spell",' +
         '"Resistance to lightning and thunder damage"',
  'Hearth Of Moonlight And Shadow':
    'Section=magic ' +
    'Note="30\' radius total cover, +5 Dex (Stealth) and Wis (Perception) during rest"',
  'Healing Light':
    'Section=magic Note="R60\' Heal %Vd6 HP/long rest, %1d6 per heal"',
  'Hex Warrior':
    'Section=combat Note="+%V attack and damage (Cha instead of Str) w/touched melee weapon 1/long rest"',
  "Hexblade's Curse":
    'Section=magic ' +
    'Note="R30\' +%V damage vs. target, crit on 19, regain %1 HP if target dies for 1 min 1/short rest"',
  'Hidden Paths':
    'Section=magic ' +
    'Note="Teleport self 60\', willing touched 30\' %V/long rest"',
  'Hold The Line':
    'Section=combat ' +
    'Note="R5\' Move provokes opportunity attack, hit negates move"',
  'Hound Of Ill Omen':
    'Section=combat Note="R120\' Spend 3 Sorcery Points to summon hound to attack target as dire wolf for 5 min"',
  "Hunter's Sense":
    'Section=combat ' +
    'Note="R60\' Sense target immunities, resistances, and vulnerabilities %V/long rest"',
  'Insightful Fighting':
    'Section=combat ' +
    'Note="Bonus Insight vs. foe Deception for sneak attack w/out Adv"',
  'Insightful Manipulator':
    'Section=feature ' +
    'Note="Learn 2 of relative Cha, Int, Wis, and levels of target after 1 min study"',
  'Intoxicated Frenzy':
    'Section=combat ' +
    'Note="3 extra Flurry Of Blows attacks if each attacks a different creature"',
  'Invincible Conqueror':
    'Section=combat ' +
    'Note="Resistance to all damage, extra attack, crit on 19 1/long rest"',
  // TODO Choice of Int, Cha if already has Wis
  'Iron Mind':'Section=save Note="Save Proficiency (Wisdom)"',
  'Keeper Of Souls':
    'Section=magic Note="R60\' Dying target yields HD HP to another 1/tn"',
  'Kensei Weapons':
    'Section=combat ' +
    'Note="Proficiency in chosen non-heavy melee and ranged weapons"',
  "Kensei's Shot":
    'Section=combat Note="+1d4 damage with ranged Kensei weapon"',
  'Magic Arrow':'Section=combat Note="Arrows count as magic weapons"',
  'Magic Kensei Weapons':'Section=combat Note="Kensei attacks are magical"',
  "Magic User's Nemesis":
    'Section=combat ' +
    'Note="R60\' Foil target teleport (DC %V Wis neg) 1/short rest"',
  'Mantle Of Inspiration':
    'Section=magic ' +
    'Note="R60\' Bardic Inspiration gives %1 targets %V temporary HP and immediate move w/out AOO"',
  'Mantle Of Majesty':
    'Section=magic Note="Cast <i>Command</i> 1/tn for 1 min 1/long rest"',
  'Mantle Of Whispers':
    'Section=magic ' +
    'Note="R30\' Capture dying person\'s shadow to use as disguise, Insight vs. +5 Deception to see through 1/short rest"',
  'Master Duelist':'Section=combat Note="Reroll miss with Adv 1/short rest"',
  'Master Of Hexes':
    'Section=magic Note="R30\' Redirect Hexblade\'s Curse when target dies"',
  'Master Of Intrigue':
    'Section=skill ' +
    'Note="Mimic accent and speech patters after listening 1 min"',
  'Master Of Tactics':'Section=combat Note="R30\' Help as bonus action"',
  "Master's Flourish":
    'Section=combat Note="Use d6 instead of Bardic Inspiration for flourish"',
  'Mighty Summoner':
    'Section=magic Note="Summoned creatures +2 HP/HD, attacks are magical"',
  'Misdirection':
    'Section=combat ' +
    'Note="Redirect attack on self to creature providing self cover"',
  'Mobile Flourish':
    'Section=combat ' +
    'Note="Use 1 Bardic Inspiration for +d%V damage and 5\'+d%V\' push"',
  'Otherworldly Wing':'Section=ability Note="30\' Fly"',
  'Panache':
    'Section=skill ' +
    'Note="Persuasion vs. Insight gives hostile target Disadv attacks on others, charms non-hostile for 1 min"',
  'Path To The Grave':
    'Section=magic ' +
    'Note="R30\' Use Channel Divinity to make target vulnerable to all attacks for 1 tn"',
  'Piercing Arrow':
    'Section=combat ' +
    'Note="+%Vd6 HP damage to targets in 30\'x1\' line (DC %V Dex half)"',
  'Planar Warror':
    'Section=combat ' +
    'Note="R30\' As bonus action, self damage to target become force damage, +%Vd6 HP damage"',
  'Power Surge':
    'Section=magic ' +
    'Note="Store magic from %V <i>Dispel Magic</i> and <i>Counterspell</i>, use for +%1 spell damage 1/tn"',
  'Protective Spirit':
    'Section=combat Note="Regain 1d6+%V HP at end of tn if below %1 HP"',
  'Psychic Blades':
    'Section=combat ' +
    'Note="Use 1 Bardic Inspiration for +%Vd6 HP psychic damage 1/tn"',
  'Radiant Soul':
    'Section=magic,save ' +
    'Note="+%V radiant and fire spell damage","Resistance to radiant damage"',
  'Radiant Sun Bolt':
    'Section=combat ' +
    'Note="R30\' Ranged touch +%V 1d%1+%2 HP radiant damage 1/tn, spend 1 Ki for 2/tn"',
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
  'Rakish Audacity':
    'Section=combat ' +
    'Note="+%V Initiative/Use Sneak Attack w/out Adv vs. solo foe"',
  'Rapid Strike':'Section=combat Note="Trade Attack Adv for extra attack 1/tn"',
  'Saint Of Forge And Fire':
    'Section=combat,save ' +
    'Note="Resistance to non-magical bludgeoning, piercing, and slashing damage in heavy armor",' +
         '"Immunity to fire damage"',
  'Scornful Rebuke':
    'Section=combat Note="Foes striking self take %V HP psychic damage"',
  'Searing Arc Strike':
    'Section=magic ' +
    'Note="Spend 2-%V Ki to cast <i>Burning Hands</i> after attack"',
  'Searing Sunburst':
    'Section=magic ' +
    'Note="R150\' 20\' burst 2d6 HP radiant damage (DC %V Con neg), spend 1-3 Ki for +2d6 HP ea"',
  'Searing Vengeance':
    'Section=combat ' +
    'Note="Recover %V HP and stand, R30\' 2d8+%1 radiant damage upon death saving throw 1/long rest"',
  'Seeking Arrow':
    'Section=combat ' +
    'Note="+%Vd6 HP force damage, ignore 3/4 cover and reveal target (DC %V Dex half and no reveal)"',
  "Sentinel At Death's Door":
    'Section=magic Note="R30\' Negate critical %V/long rest"',
  'Shadow Arrow':
    'Section=combat ' +
    'Note="+%Vd6 HP psychic damage, target vision impaired (DC %V Wis neg)"',
  'Shadow Lore':
    'Section=magic Note="R30\' Target obeys commands for 8 hr (DC %V Wis neg)"',
  'Shadow Walk':
    'Section=magic ' +
    'Note="Bonus action to teleport 120\' between dim or dark areas"',
  'Shadowy Dodge':'Section=combat Note="Reaction to impose Disadv on attacker"',
  'Sharpen The Blade':
    'Section=combat ' +
    'Note="Spend 1-3 Ki to gain equal bonus to Kensei weapon attack and damage"',
  'Shielding Storm':
    'Section=magic Note="R10\' Targets gain Storm Soul resistance"',
  'Skirmisher':
    'Section=combat Note="Reaction to move half speed when foe w/in 5\'"',
  'Slashing Flourish':
    'Section=combat ' +
    'Note="Use 1 Bardic Inspiration for +d%V HP damage to target and adjacent foe"',
  "Slayer's Counter":
    'Section=combat ' +
    'Note="Successful reaction attack on Slayer\'s Prey target yields self save"',
  "Slayer's Prey":
    'Section=combat ' +
    'Note="R60\' +1d6 HP damage to target w/1st attack each tn until short rest"',
  'Soul Of Deceit':
    'Section=save ' +
    'Note="Immunity to telepathy, Deception vs. Insight to present false thoughts, immunity to truth compulsion"',
  'Soul Of The Forge':
    'Section=combat,save ' +
    'Note="+1 AC in heavy armor","Resistance to fire damage"',
  'Spectral Defense':
    'Section=combat Note="Reaction upon damage for resistance"',
  'Speech Of The Woods':'Section=skill Note="Learn sylvan, speak w/beasts"',
  'Spirit Shield':
    'Section=combat Note="R30\' Reduce damage to ally by %Vd6"',
  'Spirit Totem (Bear)':
    'Section=magic ' +
    'Note="R60\' Targets in 30\' radius %V temporary HP, Adv Str for 1 min 1/short rest"',
  'Spirit Totem (Hawk)':
    'Section=magic ' +
    'Note="R60\' Targets in 30\' radius Adv attack and Wis (Perception) for 1 min 1/short rest"',
  'Spirit Totem (Unicorn)':
    'Section=magic ' +
    'Note="R60\' Allies Adv to detect creatures in 30\' for 1 min, targets heal %V HP 1/short rest"',
  "Stalker's Fury":'Section=combat Note="Reroll weapon miss 1/tn"',
  'Steady Eye':
    'Section=skill ' +
    'Note="Adv Perception and Investigation after moving half speed"',
  'Storm Guide':
    'Section=magic ' +
    'Note="Stop rain in 20\' or direct winds in 100\' radius for 1 tn"',
  "Storm's Fury":
    'Section=combat ' +
    'Note="Successful attacker takes %V HP lightning damage and pushed 20\' (DC %V Str neg push)"',
  'Strength Before Death':
    'Section=combat ' +
    'Note="At 0 HP delay unconsciousness and take extra tn 1/long rest"',
  'Strength Of The Grave':
    'Section=combat ' +
    'Note="DC 5+damage Cha to retain 1 HP when reduced to 0 by non-crit, non-radiant damage 1/long rest"',
  'Storm Aura (Desert)':
    'Section=magic Note="R10\' %V HP fire damage during rage"',
  'Storm Aura (Sea)':
    'Section=magic Note="R10\' Lightning %Vd6 HP (DC %1 Dex half)"',
  'Storm Aura (Tundra)':
    'Section=magic Note="R10\' Chosen targets %V temporary HP"',
  'Storm Soul (Desert)':
    'Section=magic,save ' +
    'Note="Touch lights unpossessed flammable object",' +
         '"Resistance to fire damage, unaffected by extreme heat"',
  'Storm Soul (Sea)':
    'Section=ability,feature,save ' +
    'Note="30\' Swim",' +
         '"Breathe underwater",' +
         '"Resistance to lightning damage"',
  'Storm Soul (Tundra)':
    'Section=magic,save ' +
    'Note="Touch freezes unoccupied 5\' cu water for 1 min",' +
         '"Resistance to cold damage, unaffected by extreme cold"',
  'Sudden Strike':'Section=combat Note="Bonus action for extra attack"',
  'Sun Shield':
    'Section=combat,magic ' +
    'Note="%V HP radiant damage when hit w/melee attack",' +
         '"30\' bright light, 30\' dim at will"',
  'Superior Mobility':'Section=ability Note="+10 Speed"',
  'Supernatural Defense':
    'Section=save Note="+1d6 saves vs. Slayer\'s Prey target"',
  'Survivalist':'Section=skill Note="Dbl prof in Nature and Survival"',
  'Tempestuous Magic':'Section=magic Note="Fly 10\' before casting spell"',
  'Tactical Wit':'Section=combat Note="+%V Initiative"',
  'Tipsy Sway (Leap To Your Feat':
    'Section=ability Note="Stand from prone costs 5\' movement"',
  'Tipsy Sway (Redirect Attack)':
    'Section=combat ' +
    'Note="Spend 1 Ki to redirect foe miss to adjacent creature"',
  'Tireless Spirit':
    'Section=combat Note="Min 1 Fighting Spirit after Initiative"',
  'Umbral Form':
    'Section=magic ' +
    'Note="Spend 6 Sorcery Points to become shadow (move through objects, immunity to non-force, non-radiant damage) for 1 min"',
  'Umbral Sight':
    'Section=feature Note="60\' Darkvision, invisible to darkvision"',
  'Unbreakable Majesty':
    'Section=magic Note="Foe cannot attack you (DC %V Cha neg)"',
  'Unearthly Recovery':
    'Section=combat Note="Regain %V HP when lower than %V 1/long rest"',
  'Unerring Accuracy':'Section=combat Note="Reroll monk weapon miss 1/tn"',
  'Unerring Eye':
    'Section=feature ' +
    'Note="R30\' Sense illusions and other deceptions %V/long rest"',
  'Unwavering Mark':
    'Section=combat ' +
    'Note="After melee hit, marked target Disadv attack other and provoke self bonus attack +%V HP damage for 1 tn %1/long rest"',
  'Vigilant Defender':
    'Section=combat Note="Opportunity attack on every other creature\'s tn"',
  'Warding Maneuver':
    'Section=combat ' +
    'Note="R5\' Add 1d8 to ally AC, fail gives damage resistance %V/long rest"',
  'Wind Speaker':'Section=skill Note="Speak Primordial and dialects"',
  'Vengeful Ancestors':
    'Section=combat ' +
    'Note="Damage prevented by Spirit Shield turned back on attacker"',
  'Walker In Dreams':
    'Section=magic Note="After short rest, cast <i>Dream</i>, <i>Scrying</i>, or <i>Teleportation Circle</i> connected to last long rest place 1/long rest"',
  'Warrior Of The Gods':
    'Section=feature ' +
    'Note="Life-restoring spell to self needs no material component"',
  'Way Of The Brush':
    'Section=skill ' +
    'Note="Proficiency in Calligrapher\'s or Painter\'s Supplies"',
  'Wind Soul':
    'Section=ability,magic,save ' +
    'Note="Fly 60\'",' +
         '"R30\' Self and %V others fly 30\' for 1 hr 1/long rest",' +
         '"Immunity to lightning and thunder damage"',
  'Words Of Terror':
    'Section=magic ' +
    'Note="1 min conversation frightens for 1 hr (DC %V Wisdom neg) 1/short rest"',
  'Zealous Presence':
    'Section=combat ' +
    'Note="R60\' Battle cry gives 10 targets Adv attack and save for 1 tn 1/long rest"'
};
Xanathar.LANGUAGES = {
};
Xanathar.PATHS = {
  'Arcane Archer':
    'Group=Fighter ' +
    'Level=levels.Fighter ' +
    'Features=' +
      '"3:Skill Proficiency (Choose 1 from Arcana, Nature)",' +
      '"3:Arcane Archer Lore","3:Arcane Shot","7:Curving Shot",' +
      '"7:Magic Arrow","15:Every-Ready Shot","18:Improved Shots"',
  'Cavalier':
    'Group=Fighter ' +
    'Level=levels.Fighter ' +
    'Features=' +
      // TODO choice of skill proficiency or language
      '"3:Skill Proficiency (Choose 1 from Animal Handling/History/Insight/Performance/Persuasion",' +
      '"3:Born To The Saddle","3:Unwavering Mark","7:Warding Maneuver",' +
      '"10:Hold The Line","15:Ferocious Charger","18:Vigilant Defender"',
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
  'Divine Soul':
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
  'Gloom Stalker':
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
  'Horizon Walker':
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
  'Inquisitive':
    'Group=Rogue Level=levels.Rogue ' +
    'Features=' +
      '"3:Ear For Deceiit","3:Eye For Detail","3:Insightful Fighting",' +
      '"9:Steady Eye","13:Unerring Eye","17:Eye For Weakness"',
  'Mastermind':
    'Group=Rogue Level=levels.Rogue ' +
    'Features=' +
      '"3:Tool Proficiency (Disguise Kit/Forgery Kit/Choose 1 from any game)",' +
      '"3:Master Of Intrigue","3:Master Of Tactics",' +
      '"9:Insightful Manipulator","13:Misdirection","17:Soul Of Deceit"',
  'Monster Slayer':
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
      '"3:Storm Aura (Desert):Storm Aura","3:Storm Aura (Sea):Storm Aura",' +
      '"3:Storm Aura (Tundra):Storm Aura"',
  'Path Of The Zealot':
    'Group=Barbarian Level=levels.Barbarian ' +
    'Features=' +
      '"3:Divine Fury","3:Warrior Of The Gods","6:Fanatical Focus",' +
      '"10:Zealous Presence","14:Rage Beyond Death"',
  'Samurai':
    'Group=Fighter ' +
    'Level=levels.Fighter ' +
    'Features=' +
      // TODO choice of skill proficiency or language
      '"3:Skill Proficiency (Choose 1 from History/Insight/Performance/Persuasion",' +
      '"3:Fighting Spirit","7:Elegant Courtier","10:Tireless Spirit",' +
      '"15:Rapid Strike","18:Strength Before Death"',
  'Scout':
    'Group=Rogue Level=levels.Rogue ' +
    'Features=' +
      '"3:Skill Proficiency (Nature/Survival)",' +
      '"3:Skirmisher","9:Superior Mobility","13:Ambush Master",' +
      '"17:Sudden Strike"',
  'Shadow Magic':
    'Group=Sorcerer Level=levels.Sorcerer ' +
    'Features=' +
      '"1:Eyes Of The Dark","1:Strength Of The Grave",' +
      '"6:Hound Of Ill Omen","14:Shadow Walk","18:Umbral Form"',
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
  'The Celestial':
    'Group=Warlock Level=levels.Warlock ' +
    'Features=' +
      '"1:Bonus Celestial Cantrips","1:Healing Light","6:Radiant Soul",' +
      '"10:Celestial Resilience","14:Searing Vengeance"',
  'The Hexblade':
    'Group=Warlock Level=levels.Warlock ' +
    'Features=' +
      '"1:Armor Proficiency (Medium/Shield)",' +
      '"1:Weapon Proficiency (Martial)",' +
      '"1:Hexblade\'s Curse","1:Hex Warrior","6:Accursed Specter",' +
      '"10:Armor Of Hexes","14:Master Of Hexes"',
  'War Magic':
    'Group=Wizard Level=levels.Wizard ' +
    'Features=' +
      '"2:Arcane Deflection","2:Tactical Wit","6:Power Surge",' +
      '"10:Durable Magic","14:Deflecting Shroud"',
  'Way Of The Drunken Master':
    'Group=Monk Level=levels.Monk ' +
    'Features=' +
      '"3:Skill Proficiency (Performance)",' +
      '"3:Tool Proficiency (Brewer\'s Supplies)",' +
      '"3:Drunken Technique","6:Tipsy Sway (Leap To Your Feet)",' +
      '"6:Tipsy Sway (Redirect Attack)","11:Drunkard\'s Luck",' +
      '"17:Intoxicated Frenzy"',
  'Way Of The Kensei':
    'Group=Monk Level=levels.Monk ' +
    'Features=' +
      '"3:Agile Parry","3:Kensei Weapons","3:Kensei\'s Shot",' +
      '"3:Way Of The Brush","6:Deft Strike","6:Magic Kensei Weapons",' +
      '"11:Sharpen The Blade","17:Unerring Accuracy"',
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
  'Banishing Smite':'Level=K5',
  'Banishment':'Level=Horizon4,Slayer4',
  'Bestow Curse':'Level=Conquest3',
  'Blight':'Level=Grave4',
  // Already a K3 spell 'Blink':'Level=K3',
  'Blur':'Level=K2',
  'Branding Smite':'Level=K2',
  'Calm Emotions':'Level=Redemption2',
  'Cloudkill':'Level=Conquest5',
  'Command':'Level=Conquest1',
  'Cone Of Cold':'Level=K5',
  'Counterspell':'Level=Redemption3',
  'Creation':'Level=Forge5',
  'Cure Wounds':'Level=K1',
  'Daylight':'Level=K3',
  'Death Ward':'Level=Grave4',
  'Disguise Self':'Level=Gloom1',
  'Dominate Beast':'Level=Conquest4',
  'Dominate Person':'Level=Conquest5',
  'Elemental Weapon':'Level=Forge3,K3',
  'Fabricate':'Level=Forge4',
  'False Life':'Level=Grave1',
  'Fear':'Level=Conquest3,Gloom3',
  // Already a K5 spell 'Flame Strike':'Level=K5',
  'Flaming Sphere':'Level=K2',
  'Gentle Repose':'Level=Grave2',
  'Greater Invisibility':'Level=Gloom4',
  'Greater Restoration':'Level=K5',
  'Guardian Of Faith':'Level=K4',
  'Guiding Bolt':'Level=K1',
  'Haste':'Level=Horizon3',
  'Heat Metal':'Level=Forge2',
  'Hold Monster':'Level=Redemption5,Slayer5',
  'Hold Person':'Level=Conquest2,Redemption2',
  'Hypnotic Pattern':'Level=Redemption3',
  'Identify':'Level=Forge1',
  'Lesser Restoration':'Level=K2',
  'Magic Circle':'Level=Slayer3',
  'Magic Weapon':'Level=Forge2',
  'Misty Step':'Level=Horizon2',
  'Phantasmal Killer':'Level=K4',
  'Protection From Energy':'Level=Forge3',
  'Protection From Evil And Good':'Level=Horizon1,Slayer1',
  'Raise Dead':'Level=Grave5',
  'Ray Of Enfeeblement':'Level=Grave2',
  'Resilient Sphere':'Level=Redemption4',
  'Revivify':'Level=K3,Grave3',
  'Rope Trick':'Level=Gloom2',
  'Sanctuary':'Level=Redemption1',
  'Shield':'Level=K1',
  'Sleep':'Level=Redemption1',
  'Searing Smite':'Level=Forge1',
  'Seeming':'Level=Gloom5',
  'Spiritual Weapon':'Level=Conquest2',
  'Staggering Smite':'Level=K4',
  'Stoneskin':'Level=Conquest4,Redemption4',
  'Teleportation Circle':'Level=Horizon5',
  'Vampiric Touch':'Level=Grave3',
  'Wall Of Fire':'Level=Forge4', // Already a K4 spell
  'Wall Of Force':'Level=Redemption5',
  'Wrathful Smite':'Level=K1',
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
  var allDeities = rules.getChoices('deities');
  for(var deity in deities) {
    if(deity in allDeities) {
      var attrs = allDeities[deity].replace('Domain=', 'Domain="' + QuilvynUtils.getAttrValue(deities[deity], 'Domain') + '",');
      delete allDeities[deity];
      rules.choiceRules(rules, 'Deity', deity, attrs);
    }
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
    if(!SRD5E.SPELLS[s] && !PHB5E.SPELLS[s]) {
      console.log('Unknown spell "' + s + '"');
      continue;
    }
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

  if(name == 'Arcane Archer') {
    rules.defineRule
      ('combatNotes.banishingArrow', pathLevel, '=', 'source>=18 ? "2" : "0"');
    rules.defineRule('combatNotes.banishingArrow.1',
      'proficiencyBonus', '=', '8 + source',
      'intelligenceModifier', '+', null
    );
    rules.defineRule
      ('combatNotes.beguilingArrow', pathLevel, '=', 'source>= 18 ? "4" : "2"');
    rules.defineRule('combatNotes.beguilingArrow.1',
      'proficiencyBonus', '=', '8 + source',
      'intelligenceModifier', '+', null
    );
    rules.defineRule
      ('combatNotes.burstingArrow', pathLevel, '=', 'source>= 18 ? "4" : "2"');
    rules.defineRule
      ('combatNotes.enfeeblingArrow', pathLevel, '=', 'source>=18 ? "4" : "2"');
    rules.defineRule('combatNotes.enfeeblingArrow.1',
      'proficiencyBonus', '=', '8 + source',
      'intelligenceModifier', '+', null
    );
    rules.defineRule
      ('combatNotes.graspingArrow', pathLevel, '=', 'source>=18 ? "4" : "2"');
    rules.defineRule('combatNotes.graspingArrow.1',
      'proficiencyBonus', '=', '8 + source',
      'intelligenceModifier', '+', null
    );
    rules.defineRule
      ('combatNotes.piercingArrow', pathLevel, '=', 'source>=18 ? "2" : "1"');
    rules.defineRule('combatNotes.piercingArrow.1',
      'proficiencyBonus', '=', '8 + source',
      'intelligenceModifier', '+', null
    );
    rules.defineRule
      ('combatNotes.seekingArrow', pathLevel, '=', 'source>=18 ? "2" : "1"');
    rules.defineRule('combatNotes.seekingArrow.1',
      'proficiencyBonus', '=', '8 + source',
      'intelligenceModifier', '+', null
    );
    rules.defineRule
      ('combatNotes.shadowArrow', pathLevel, '=', 'source>=18 ? "4" : "2"');
    rules.defineRule('combatNotes.shadowArrow.1',
      'proficiencyBonus', '=', '8 + source',
      'intelligenceModifier', '+', null
    );
    rules.defineRule('selectableFeatureCount.Fighter (Arcane Shot)',
      pathLevel, '=',
        'source>=18 ? 6 : source>=15 ? 5 : source>=10 ? 4 : source>=7 ? 3 : 2'
    );
  } else if(name == 'Cavalier') {
    rules.defineRule('combatNotes.ferociousCharger',
      'proficiencyBonus', '=', '8 + source',
      'strengthModifier', '+', null
    );
    rules.defineRule('combatNotes.unwaveringMark',
      pathLevel, '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('combatNotes.unwaveringMark.1',
      'features.Unwavering Mark', '?', null,
      'strengthModifier', '=', 'Math.max(source, 1)'
    );
    rules.defineRule('combatNotes.wardingManeuver',
      'constitutionModifier', '=', 'Math.max(source, 1)'
    );
  } else if(name == 'Circle Of Dreams') {
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
    rules.defineRule
      ('selectableFeatureCount.Bard (Fighting Style)', pathLevel, '=', '1');
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
  } else if(name == 'Gloom Stalker') {
    rules.defineRule('combatNotes.dreadAmbusher', 'wisdomModifier', '=', null);
    rules.defineRule('saveProficiency.Wisdom', 'saveNotes.ironMind', '=', '1');
  } else if(name == 'Grave Domain') {
    rules.defineRule('magicNotes.eyesOfTheGrave',
      'wisdomModifier', '=', 'Math.max(source, 1)'
    );
    rules.defineRule
      ('magicNotes.potentSpellcasting', 'wisdomModifier', '=', null);
    rules.defineRule("magicNotes.sentinelAtDeath'sDoor",
      'wisdomModifier', '=', 'Math.max(source, 1)'
    );
  } else if(name == 'Horizon Walker') {
    rules.defineRule
      ('combatNotes.planarWarrior', pathLevel, '=', 'source>=11 ? 2 : 1');
  } else if(name == 'Monster Slayer') {
    rules.defineRule("combatNotes.hunter'sSense", 'wisdomModifier', '=', null);
    rules.defineRule
      ("combatNotes.magicUser'sNemesis", 'spellDifficultyClass.R', '=', null);
  } else if(name == 'Inquisitive') {
    rules.defineRule('featureNotes.unerringEye',
      'wisdomModifier', '=', 'Math.max(source, 1)'
    );
  } else if(name == 'Mastermind') {
    rules.defineRule('languageCount', 'features.Master Of Intrigue', '+', '2');
  } else if(name == 'Oath Of Conquest') {
    rules.defineRule
      ('combatNotes.auraOfConquest', pathLevel, '=', 'source>=18 ? 30 : 10');
    rules.defineRule('combatNotes.scornfulRebuke',
      'charismaModifier', '=', 'Math.max(source, 1)'
    );
  } else if(name == 'Oath Of Redemption') {
    rules.defineRule('combatNotes.protectiveSpirit',
      pathLevel, '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('combatNotes.protectiveSpirit.1',
      'features.Protective Spirit', '?', null,
      'hitPoints', '=', 'Math.floor(source / 2)'
    );
  } else if(name == 'Otherworldly Patron') {
    rules.defineRule('magicNotes.healingLight', pathLevel, '=', 'source + 1');
    rules.defineRule('magicNotes.healingLight.1',
      'features.Healing Light', '?', null,
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
    rules.defineRule
      ('selectableFeatureCount.Barbarian (Storm Aura)', pathLevel, '=', '1');
    rules.defineRule('magicNotes.stormAura(Desert)',
      pathLevel, '=', 'Math.floor(source / 5) + 2'
    );
    rules.defineRule('magicNotes.stormAura(Sea)',
      pathLevel, '=', 'Math.max(Math.floor(source / 5), 1)'
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
  } else if(name == 'Samurai') {
    rules.defineRule('combatNotes.fightingSpirit',
      pathLevel, '=', 'source>=15 ? 15 : source>=10 ? 10 : 5'
    );
    rules.defineRule
      ('saveProficiency.Wisdom', 'saveNotes.elegantCourtier', '=', '1');
    rules.defineRule('skillNotes.elegantCourtier', 'wisdomModifier', '=', null);
  } else if(name == 'Storm Sorcery') {
    rules.defineRule('languages.Aquan', 'skillNotes.windSpeaker', '=', '1');
    rules.defineRule('languages.Auran', 'skillNotes.windSpeaker', '=', '1');
    rules.defineRule('languages.Ignan', 'skillNotes.windSpeaker', '=', '1');
    rules.defineRule('languages.Terran', 'skillNotes.windSpeaker', '=', '1');
  } else if(name == 'Swashbuckler') {
    rules.defineRule('combatNotes.rakishAudacity', 'wisdomModifier', '=', null);
  } else if(name == 'The Celestial') {
    rules.defineRule('combatNotes.searingVengeance',
      'hitPoints', '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('combatNotes.searingVengeance.1',
      'features.Searing Vengeance', '?', null,
      'charismaModifier', '=', null
    );
    rules.defineRule('magicNotes.radiantSoul', 'charismaModifier', '=', null);
    rules.defineRule('magicNotes.celestialResilience',
      pathLevel, '=', null,
      'charismaModifier', '+', null
    );
    rules.defineRule('magicNotes.celestialResilience.1',
      'features.Celestial Resilience', '?', null,
      pathLevel, '=', 'Math.floor(source / 2)',
      'charismaModifier', '+', null
    );
  } else if(name == 'The Hexblade') {
    rules.defineRule
      ('combatNotes.accursedSpecter', pathLevel, '=', 'Math.floor(source / 2)');
    rules.defineRule('combatNotes.accursedSpecter.1',
      'features.Accursed Specter', '?', null,
      'charismaModifier', '=', 'Math.max(source, 0)'
    );
    rules.defineRule('combatNotes.hexWarrior',
      'charismaModifier', '=', null,
      'strengthModifier', '+', '-source'
    );
    rules.defineRule
      ("magicNotes.hexblade'sCurse", 'proficiencyBonus', '=', null);
    rules.defineRule("magicNotes.hexblade'sCurse.1",
      pathLevel, '=', null,
      'charismaModifier', '+', null
    );
  } else if(name == 'War Magic') {
    rules.defineRule
      ('combatNotes.tacticalWit', 'intelligenceModifier', '=', null);
    rules.defineRule
      ('magicNotes.deflectingShroud', pathLevel, '=', 'Math.floor(source / 2)');
    rules.defineRule('magicNotes.powerSurge',
      'intelligenceModifer', '=', 'Math.max(source, 1)'
    );
  } else if(name == 'Way Of The Kensei') {
    rules.defineRule('combatNotes.deftStrike', 'monkMeleeDieBonus', '=', null);
    rules.defineRule('toolChoiceCount', 'skillNotes.wayOfTheBrush', '+=', '1');
    rules.defineRule
      ('weaponChoiceCount', 'combatNote.kenseiWeapons', '+=', '2');
  } else if(name == 'Way Of Sun Soul') {
    rules.defineRule('combatNotes.radiantSunBolt',
      'attackBonus.Ranged', '=', null,
      'proficiencyBonus', '+', null
    );
    rules.defineRule
      ('combatNotes.radiantSunBolt.1', 'combatNotes.martialArts', '=', null);
    rules.defineRule('combatNotes.radiantSunBolt.2',
      'features.Radiant Sun Bolt', '?', null,
      'dexterityModifier', '=', null
    );
    rules.defineRule
      ('combatNotes.sunShield', 'wisdomModifier', '=', 'source + 5');
    rules.defineRule('combatNotes.searingArcStrike',
      pathLevel, '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('combatNotes.searingSunburst', 'kiSaveDC', '=', null);
  }

};
