/*
Copyright 2020, James J. Hayes

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
 * This module loads the rules from Fifth Edition Player's Handbook that are
 * not part of the 5E SRD.  The PHB5E function contains methods that load rules
 * for particular parts of the rules; raceRules for character races, magicRules
 * for spells, etc.  These member methods can be called independently in order
 * to use a subset of the 5E PHB.  Similarly, the constant fields of PHB5E
 * (FEATS, BACKGROUNDS, etc.) can be manipulated to modify the choices.
 */
function PHB5E() {

  if(window.SRD5E == null) {
    alert('The PHB5E module requires use of the SRD5E module');
    return;
  }

  Object.assign(SRD5E.SPELLS, PHB5E.SPELLS_ADDED);
  PHB5E.identityRules(
    SRD5E.rules, PHB5E.BACKGROUNDS, PHB5E.CLASSES, PHB5E.DEITIES, PHB5E.PATHS,
    PHB5E.RACES
  );
  PHB5E.talentRules(
    SRD5E.rules, PHB5E.FEATS, PHB5E.FEATURES
  );

}

PHB5E.BACKGROUNDS = {
  'Charlatan':
    'Equipment=' +
      '"Fine Clothes","Con Tools","Disguise Kit","15 GP" ' +
    'Features=' +
      '"1:Skill Proficiency (Deception/Sleight Of Hand)",' +
      '"1:Tool Proficiency (Disguise Kit/Forgery Kit)",' +
      '"1:False Identity"',
  'Criminal':
    'Equipment=' +
      'Crowbar,"Dark Clothes W/Hood","15 GP" ' +
    'Features=' +
      '"1:Skill Proficiency (Deception/Stealth)",' +
      '"1:Tool Proficiency (Theives\' Tools/any Game)",' +
      '"1:Criminal Contact"',
  'Entertainer':
    'Equipment=' +
      '"Admirer\'s Favor",Costume,"Musical Instrument","15 GP" ' +
    'Features=' +
      '"1:Skill Proficiency (Acrobatics/Performance)",' +
      '"1:Tool Proficiency (Disguise Kit/any Music)",' +
      '"1:By Popular Demand"',
  'Folk Hero':
    'Equipment=' +
      '"Artisan\'s Tools",Clothes,"Iron Pot",Shovel,"10 GP" ' +
    'Features=' +
      '"1:Skill Proficiency (Animal Handling/Survival)",' +
      '"1:Tool Proficiency (Vehicles (Land)/any Artisan)",' +
      '"1:Rustic Hospitality"',
  'Guild Artisan':
    'Equipment=' +
      '"Artisan\'s Tools","Introduction Letter","Traveler\'s Clothes","15 GP" '+
    'Features=' +
      '"1:Skill Proficiency (Insight/Persuasion)",' +
      '"1:Tool Proficiency (any Artisan)",' +
      '"1:Guild Membership" ' +
    'Languages=any',
  'Hermit':
    'Equipment=' +
      'Clothes,"Herbalism Kit","Scroll Case With Notes","Winter Blanket",' +
      '"5 GP" ' +
    'Features=' +
      '"1:Skill Proficiency (Medicine/Religion)",' +
      '"1:Tool Proficiency (Herbalism Kit)",' +
      '1:Discovery ' +
    'Languages=any',
  'Noble':
    'Equipment=' +
      '"Fine Clothes","Pedigree Scroll","Signet Ring","25 GP" ' +
    'Features=' +
      '"1:Skill Proficiency (History/Persuasion)",' +
      '"1:Tool Proficiency (any Game)",' +
      '"1:Position Of Priviledge" ' +
    'Languages=any',
  'Outlander':
    'Equipment=' +
      '"Animal Trophy","Hunting Trap",Staff,"Traveler\'s Clothes","10 GP" ' +
    'Features=' +
      '"1:Skill Proficiency (Athletics/Survival)",' +
      '"1:Tool Proficiency (any Music)",' +
      '1:Wanderer ' +
    'Languages=any',
  'Sage':
    'Equipment=' +
      '"Bottle Ink",Clothes,"Letter W/Unanswered Question","Quill",' +
      '"Small Knife","10 GP" ' +
    'Features=' +
      '"1:Skill Proficiency (Arcane/History)",' +
      '1:Researcher ' +
    'Languages=any,any',
  'Sailor':
    'Equipment=' +
      '"Belaying Pin",Clothes,"Lucky Charm","50\' Silk Rope","10 GP" ' +
    'Features=' +
      '"1:Skill Proficiency (Athletics/Perception)",' +
      '"1:Tool Proficiency (Navigator\'s Tools/Vehicles (Water))",' +
      '"1:Ship\'s Passage"',
  'Soldier':
    'Equipment=' +
      '"Battle Trophy","Clothes","Gambling Objects","Rank Insignia","10 GP" ' +
    'Features=' +
      '"1:Skill Proficiency (Athletics/Intimidation)",' +
      '"1:Tool Proficiency (Vehicles (Land)/any Game)",' +
      '"1:Military Rank"',
  'Urchin':
    'Equipment=' +
      '"City Map",Clothes,"Parent\'s Token","Pet Mouse","Small Knife","10 GP" '+
    'Features=' +
      '"1:Skill Proficiency (Sleight Of Hand/Stealth)",' +
      '"1:Tool Proficiency (Disguise Kit/Thieves\'s Tools)",' +
      '"1:City Secrets"'
};
PHB5E.CLASSES = {
  'Bard':
    'Selectables=' +
      '"3:College Of Valor" ' +
    'Spells=' +
      '"B0:Blade Ward;Friends",' +
      '"B1:Dissonant Whispers",' +
      '"B2:Cloud Of Daggers;Crown Of Madness;Phantasmal Force",' +
      '"B3:Feign Death",' +
      '"B7:Arcane Sword",' +
      '"B9:Power Word Heal"',
  'Cleric':
    'Selectables=' +
      '"1:Knowledge Domain",' +
      '"1:Light Domain",' +
      '"1:Nature Domain",' +
      '"1:Tempest Domain",' +
      '"1:Trickery Domain",' +
      '"1:War Domain" ' +
    'Spells=' +
      '"C3:Feign Death"',
  'Druid':
    'Selectables=' +
      '"2:Circle Of The Land (Underdark)",' +
      '"2:Circle Of The Moon" ' +
    'Spells=' +
      '"D0:Thorn Whip",' +
      '"D2:Beast Sense",' +
      '"D3:Feign Death",' +
      '"D4:Grasping Vine",' +
      '"D8:Tsunami"',
  'Fighter':
    'Selectables=' +
      '"3:Battle Master Archetype","3:Eldritch Knight Archetype",' +
      '"features.Maneuvers ? 3:Commander\'s Strike",' +
      '"features.Maneuvers ? 3:Disarming Attack",' +
      '"features.Maneuvers ? 3:Distracting Strike",' +
      '"features.Maneuvers ? 3:Evasive Footwork",' +
      '"features.Maneuvers ? 3:Feinting Attack",' +
      '"features.Maneuvers ? 3:Goading Attack",' +
      '"features.Maneuvers ? 3:Lunging Attack",' +
      '"features.Maneuvers ? 3:Maneuvering Attack",' +
      '"features.Maneuvers ? 3:Menacing Attack",' +
      '"features.Maneuvers ? 3:Parry",' +
      '"features.Maneuvers ? 3:Precision Attack",' +
      '"features.Maneuvers ? 3:Pushing Attack",' +
      '"features.Maneuvers ? 3:Rally",' +
      '"features.Maneuvers ? 3:Riposte",' +
      '"features.Maneuvers ? 3:Sweeping Attack",' +
      '"features.Maneuvers ? 3:Trip Attack"',
  'Monk':
    'Selectables=' +
      '"3:Way Of The Four Elements Tradition",' +
      '"3:Way Of The Shadow Tradition",'+
      '"features.Way Of The Four Elements Tradition ? 17:Breath Of Winter",' +
      '"features.Way Of The Four Elements Tradition ? 6:Clench Of The North Wind",' +
      '"features.Way Of The Four Elements Tradition ? 17:Eternal Mountain Defense",' +
      '"features.Way Of The Four Elements Tradition ? 3:Fangs Of The Fire Snake",' +
      '"features.Way Of The Four Elements Tradition ? 3:Fist Of Four Thunders",' +
      '"features.Way Of The Four Elements Tradition ? 3:Fist Of Unbroken Air",' +
      '"features.Way Of The Four Elements Tradition ? 11:Flames Of The Phoenix",' +
      '"features.Way Of The Four Elements Tradition ? 6:Gong Of The Summit",' +
      '"features.Way Of The Four Elements Tradition ? 11:Mist Stance",' +
      '"features.Way Of The Four Elements Tradition ? 11:Ride The Wind",' +
      '"features.Way Of The Four Elements Tradition ? 17:River Of Hungry Flame",' +
      '"features.Way Of The Four Elements Tradition ? 3:Rush Of The Gale Spirits",' +
      '"features.Way Of The Four Elements Tradition ? 3:Shape The Flowing River",' +
      '"features.Way Of The Four Elements Tradition ? 3:Sweeping Cinder Strike",' +
      '"features.Way Of The Four Elements Tradition ? 3:Water Whip",' +
      '"features.Way Of The Four Elements Tradition ? 17:Wave Of The Rolling Earth"',
  'Paladin':
    'Selectables=' +
      '"3:Oath Of The Ancients","3:Oath Of Vengeance" ' +
    'Spells=' +
      '"P1:Compelled Duel;Searing Smite;Thunderous Smite;Wrathful Smite",' +
      '"P3:Aura Of Vitality;Blinding Smite;Crusader\'s Mantle;Elemental Weapon",' +
      '"P4:Aura Of Life;Aura Of Purity;Staggering Smite",' +
      '"P5:Banishing Smite;Circle Of Power;Destructive Wave"',
  'Ranger':
    'Selectables=' +
      '"3:Beast Master Archetype" ' +
    'Spells=' +
      '"R1:Ensnaring Strike;Hail Of Thorns",' +
      '"R2:Beast Sense;Cordon Of Arrows",' +
      '"R3:Conjure Barrage;Lightning Arrow",' +
      '"R4:Grasping Vine",' +
      '"R5:Conjure Volley;Swift Quiver"',
  'Rogue':
    'Selectables=' +
      '"3:Arcane Trickster Archetype","3:Assassin Archetype"',
  'Sorcerer':
    'Selectables=' +
      '"1:Wild Magic" ' +
    'Spells=' +
      '"S0:Blade Ward;Friends",' +
      '"S1:Chromatic Orb;Ray Of Sickness;Witch Bolt",' +
      '"S2:Cloud Of Daggers;Crown Of Madness;Phantasmal Force",' +
      '"S6:Arcane Gate"',
  'Warlock':
    'Selectables=' +
      '"1:Archfey Patron","1:Great Old One Patron" ' +
    'Spells=' +
      '"K0:Blade Ward;Friends",' +
      '"K1:Armor Of Agathys;Arms Of Hadar;Hex;Witch Bolt",' +
      '"K2:Cloud Of Daggers;Crown Of Madness",' +
      '"K3:Hunger Of Hadar",' +
      '"K6:Arcane Gate",' +
      // Archfey Patron
      '"K1:Faerie Fire;Sleep",' +
      '"K2:Calm Emotions;Phantasmal Force",' +
      '"K3:Blink;Plant Growth",' +
      '"K4:Dominate Beast;Greater Invisibility",' +
      '"K5:Dominate Person;Seeming",' +
      // Great Old One Patron
      '"K1:Dissonant Whispers;Hideous Laughter",' +
      '"K2:Detect Thoughts;Phantasmal Force",' +
      '"K3:Clairvoyance;Sending",' +
      '"K4:Black Tentacles;Dominate Beast",' +
      '"K5:Dominate Person;Telekinesis"',
  'Wizard':
    'Selectables=' +
      '"2:Abjuration Tradition",' +
      '"2:Conjuration Tradition",' +
      '"2:Divination Tradition",' +
      '"2:Enchantment Tradition",' +
      '"2:Illusion Tradition",' +
      '"2:Necromancy Tradition",' +
      '"2:Transmutation Tradition" ' +
    'Spells=' +
      '"W0:Blade Ward;Friends",' +
      '"W2:Cloud Of Daggers;Crown Of Madness;Phantasmal Force",' +
      '"W1:Chromatic Orb;Ray Of Sickness;Witch Bolt",' +
      '"W3:Feign Death",' +
      '"W6:Arcane Gate",' +
      '"W7:Arcane Sword",' +
      '"W8:Telepathy"'
};
PHB5E.DEITIES = {
  // Forgotten Realms
  'FR-Auril':'Alignment=NE Domain=Nature,Tempest',
  'FR-Azuth':'Alignment=LN Domain=Knowledge',
  'FR-Bane':'Alignment=LE Domain=War',
  'FR-Beshaba':'Alignment=CE Domain=Trickery',
  'FR-Bhaal':'Alignment=NE Domain=Death',
  'FR-Chauntea':'Alignment=NG Domain=Life',
  'FR-Cyric':'Alignment=CE Domain=Trickery',
  'FR-Deneir':'Alignment=NG Domain=Knowledge',
  'FR-Eldath':'Alignment=NG Domain=Life,Nature',
  'FR-Gond':'Alignment=N Domain=Knowledge',
  'FR-Helm':'Alignment=LN Domain=Life,Light',
  'FR-Ilmater':'Alignment=LG Domain=Life',
  'FR-Kelemvor':'Alignment=LN Domain=Death',
  'FR-Lathander':'Alignment=NG Domain=Life,Light',
  'FR-Leira':'Alignment=CN Domain=Trickery',
  'FR-Lliira':'Alignment=CG Domain=Life',
  'FR-Loviatar':'Alignment=LE Domain=Death',
  'FR-Malar':'Alignment=CE Domain=Nature',
  'FR-Mask':'Alignment=CN Domain=Trickery',
  'FR-Mielikki':'Alignment=NG Domain=Nature',
  'FR-Milil':'Alignment=NG Domain=Light',
  'FR-Myrkul':'Alignment=NE Domain=Death',
  'FR-Mystra':'Alignment=NG Domain=Knowledge',
  'FR-Oghma':'Alignment=N Domain=Knowledge',
  'FR-Savras':'Alignment=LN Domain=Knowledge',
  'FR-Selune':'Alignment=CG Domain=Knowledge,Life',
  'FR-Shar':'Alignment=NE Domain=Death,Trickery',
  'FR-Silvanus':'Alignment=N Domain=Nature',
  'FR-Sune':'Alignment=CG Domain=Life,Light',
  'FR-Talona':'Alignment=CE Domain=Death',
  'FR-Talos':'Alignment=CE Domain=Tempest',
  'FR-Tempus':'Alignment=N Domain=War',
  'FR-Torm':'Alignment=LG Domain=War',
  'FR-Tymora':'Alignment=CG Domain=Trickery',
  'FR-Tyr':'Alignment=LG Domain=War',
  'FR-Umberlee':'Alignment=CE Domain=Tempest',
  'FR-Waukeen':'Alignment=N Domain=Knowledge,Trickery',
  // Greyhawk
  'Greyhawk-Beory':'Alignment=N Domain=Nature',
  'Greyhawk-Boccob':'Alignment=N Domain=Knowledge',
  'Greyhawk-Celestian':'Alignment=N Domain=Knowledge',
  'Greyhawk-Ehlonna':'Alignment=NG Domain=Life,Nature',
  'Greyhawk-Erythnul':'Alignment=CE Domain=War',
  'Greyhawk-Fharlanghn':'Alignment=NG Domain=Knowledge,Trickery',
  'Greyhawk-Heironeous':'Alignment=LG Domain=War',
  'Greyhawk-Hextor':'Alignment=LE Domain=War',
  'Greyhawk-Kord':'Alignment=CG Domain=Tempest,War',
  'Greyhawk-Incabulous':'Alignment=NE Domain=Death',
  'Greyhawk-Istus':'Alignment=N Domain=Knowledge',
  'Greyhawk-Iuz':'Alignment=CE Domain=Death',
  'Greyhawk-Nerull':'Alignment=NE Domain=Death',
  'Greyhawk-Obad-Hai':'Alignment=N Domain=Nature',
  'Greyhawk-Olidammara':'Alignment=CN Domain=Trickery',
  'Greyhawk-Pelor':'Alignment=NG Domain=Life,Light',
  'Greyhawk-Pholtus':'Alignment=LG Domain=Light',
  'Greyhawk-Ralishaz':'Alignment=CN Domain=Trickery',
  'Greyhawk-Rao':'Alignment=LG Domain=Knowledge',
  'Greyhawk-St. Cuthbert':'Alignment=LN Domain=Knowledge',
  'Greyhawk-Tharizdun':'Alignment=CE Domain=Trickery',
  'Greyhawk-Trithereon':'Alignment=CG Domain=War',
  'Greyhawk-Ulaa':'Alignment=LG Domain=Life,War',
  'Greyhawk-Vecna':'Alignment=NE Domain=Knowledge',
  'Greyhawk-Wee Jas':'Alignment=LN Domain=Death,Knowledge',
  // Nonhuman
  'NH-Bahamut (Dragon)':'Alignment=LG Domain=Life,War',
  'NH-Blibdoolpoolp (Kuo-Toa)':'Alignment=NE Domain=Death',
  'NH-Corellon Larethian (Elf)':'Alignment=CG Domain=Light',
  'NH-Deep Sashelas (Elf)':'Alignment=CG Domain=Nature,Tempest',
  'NH-Eadro (Merfolk)':'Alignment=N Domain=Nature,Tempest',
  'NH-Garl Glittergold (Gnome)':'Alignment=LG Domain=Trickery',
  'NH-Grolantor (Hill Giant)':'Alignment=CE Domain=War',
  'NH-Gruumsh (Orc)':'Alignment=CE Domain=Tempest,War',
  'NH-Hruggek (Bugbear)':'Alignment=CE Domain=War',
  'NH-Kurtulmak (Kobold)':'Alignment=LE Domain=War',
  'NH-Laogzed (Troglodyte)':'Alignment=CE Domain=Death',
  'NH-Lolth (Drow)':'Alignment=CE Domain=Trickery',
  'NH-Maglubiyet (Goblinoid)':'Alignment=LE Domain=War',
  'NH-Moradin (Dwarf)':'Alignment=LG Domain=Knowledge',
  'NH-Rillifane Rallathil (Elf)':'Alignment=CG Domain=Nature',
  'NH-Sehanine Moonbow (Elf)':'Alignment=CG Domain=Knowledge',
  'NH-Sekolah (Sahuagin)':'Alignment=LE Domain=Nature,Tempest',
  'NH-Semuanya (Lizardfolk)':'Alignment=N Domain=Life',
  'NH-Skerrit (Centaur)':'Alignment=N Domain=Knowledge',
  'NH-Skoraeus Stonebones (Stone Giant)':'Alignment=N Domain=Knowledge',
  'NH-Surtur (Fire Giant)':'Alignment=LE Domain=Knowledge,War',
  'NH-Thryn (Frost Giant)':'Alignment=CE Domain=War',
  'NH-Tiamat (Dragon)':'Alignment=LE Domain=Trickery',
  'NH-Yondalla (Halfling)':'Alignment=LG Domain=Life'
};
PHB5E.FEATS = {
  'Alert':
    '',
  'Athlete':
    '',
  'Actor':
    '',
  'Charger':
    '',
  'Crossbow Expert':
      'Implies=weapons.Hand Crossbow || weapons.Heavy Crossbow || weapons.Light Crossbow',
  'Defensive Duelist':
    'Require="dexterity >= 13"',
  'Dual Wielder':
    '',
  'Dungeon Delver':
    '',
  'Durable':
    '',
  'Elemental Adept (Acid)':
    'Requre="casterLevel >= 1"',
  'Elemental Adept (Cold)':
    'Requre="casterLevel >= 1"',
  'Elemental Adept (Fire)':
    'Requre="casterLevel >= 1"',
  'Elemental Adept (Lightning)':
    'Requre="casterLevel >= 1"',
  'Elemental Adept (Thunder)':
    'Requre="casterLevel >= 1"',
  'Great Weapon Master':
    '',
  'Healer':
    '',
  'Heavily Armored':
    'Require="features.Armor Proficiency (Medium)"',
  'Heavy Armor Master':
    'Require="features.Armor Proficiency (Heavy)"',
  'Inspiring Leader':
    'Require="charisma >= 13"',
  'Keen Mind':
    '',
  'Lightly Armored':
    '',
  'Linguist':
    '',
  'Lucky':
    '',
  'Mage Slayer':
    '',
  'Magic Initiate':
    '',
  'Martial Adept':
    '',
  'Medium Armor Master':
    'Require="Armor Proficiency (Medium)"',
  'Mobile':
    '',
  'Moderately Armored':
    'Require="Armor Proficiency (Light)"',
  'Mounted Combatant':
    '',
  'Observant':
    '',
  'Polearm Master':
    '',
  'Resilient':
    '',
  'Ritual Caster':
    'Require="intelligence >= 13 || wisdom >= 13"',
  'Savage Attacker':
    '',
  'Sentinel':
    '',
  'Sharpshooter':
    '',
  'Shield Master':
    'Implies="shield != \'None\'"',
  'Skilled':
    '',
  'Skulker':
    'Require="dexterity >= 13"',
  'Spell Sniper':
    'Require="casterLevel >= 1"',
  'Tavern Brawler':
    '',
  'Tough':
    '',
  'War Caster':
    'Require="casterLevel >= 1"',
  'Weapon Master':
    ''
};
PHB5E.FEATURES = {
  // Backgrounds
  'By Popular Demand':
    'Section=feature Note="Welcome, lodging for performing"',
  'City Secrets':
    'Section=feature Note="Dbl speed through hidden urban ways"',
  'Criminal Contact':
    'Section=feature Note="Liaison to criminal network"',
  'Discovery':
    'Section=feature Note="Knows unique truth"',
  'False Identity':
    'Section=feature Note="Documented 2nd ID, forgery skills"',
  'Guild Membership':
    'Section=feature Note="Aid from guild members"',
  'Military Rank':
    'Section=feature Note="Respect, deference from soldiers"',
  'Position Of Privilege':
    'Section=feature Note="Treated with respect, deference"',
  'Researcher':
    'Section=feature Note="Know who to ask about lore"',
  'Rustic Hospitality':
    'Section=feature Note="Aid from common folk"',
  "Ship's Passage":
    'Section=feature Note="Free passage for self, companions"',
  'Wanderer':
    'Section=feature Note="Excellent geography memory, forage for 6 people"',
  // Paths
  'Spirit Seeker':
    'Section=magic Note="Ritual <i>Beast Sense</i>, <i>Speak With Animals</i>"',
  'Bear Totem Spirit':
    'Section=combat Note="Resist non-psychic damage when raging"',
  'Eagle Totem Spirit':
    'Section=combat Note="Foes Disadv OA, Dash as bonus action when raging (heavy armor neg)"',
  'Wolf Totem Spirit':
    'Section=combat Note="Allies Adv attack vs. self adjacent foes when raging"',
  'Aspect Of The Bear':
    'Section=ability Note="Dbl load/lift, Adv push, pull, lift, break Str checks"',
  'Aspect Of The Eagle':
    'Section=skill Note="See clearly 1 mi, no dim light Perception Disadv"',
  'Aspect Of The Wolf':
    'Section=ability Note="Track at fast pace, stealth at normal pace"',
  'Spirit Walker':
    'Section=magic Note="Ritual <i>Commune With Nature</i>"',
  'Bear Totemic Attunement':
    'Section=combat Note="Adjacent foes Disadv attack others when self raging"',
  'Eagle Totemic Attunement':
    'Section=ability Note="Fly for short bursts when raging"',
  'Wolf Totemic Attunement':
    'Section=combat Note="Knock prone lg foe after melee hit when raging"',
  'Combat Inspiration':
    'Section=combat Note="Ally use Bardic Inspiration die to boost damage or AC"',
  'Battle Magic':
    'Section=combat Note="Bonus attack after casting spell"',
  'Blessings Of Knowledge':
    'Section=skill Note="+2 Languages Count/+2 Skill Choice Count"',
  'Knowledge Of The Ages':
    'Section=skill Note="Channel Divinity for Prof chosen skill or tool for 10 min"',
  'Read Thoughts':
    'Section=magic Note="R60\' Channel Divinity to read thoughts, <i>Suggestion</i> for 1 min (Wis neg)"',
  'Potent Spellcasting':
    'Section=magic Note="+%V Cleric cantrip damage"',
  'Visions Of The Past':
    'Section=magic Note="Meditate for visions about surroundings or held object"',
  'Light Cantrip':
    'Section=magic Note="Know <i>Light</i> cantrip"',
  'Warding Flare':
    'Section=magic Note="R30\' Reaction flare foe Disadv on current attack %V/long rest"',
  'Radiance Of The Dawn':
    'Section=magic Note="R30\' Channel Divinity to dispel magic darkness, 2d10+%V HP to foes (Con half)"',
  'Improved Flare':
    'Section=magic Note="Warding Flare protects allies"',
  'Potent Spellcasting':
    'Section=magic Note="+%V Cleric cantrip damage"',
  'Corona Of Light':
    'Section=magic Note="60\' light, foe Disadv on fire, radiant spells for 1 min"',
  'Acolyte Of Nature':
    'Section=magic Note="Additional Druid cantrip"',
  'Acolyte Of Nature':
    'Section=skill Note="+1 Skill Choice Count"',
  'Charm Animals And Plants':
    'Section=magic Note="R30\' Channel Divinity charms for 1 min (Wis neg)"',
  'Dampen Elements':
    'Section=magic Note="R30\' Reaction to grant resistance to acid, cold, fire, lightning, or thunder"',
  'Divine Strike':
    'Section=combat Note="+%Vd8 HP 1/turn"',
  'Master Of Nature':
    'Section=magic Note="Command charmed animals, plants"',
  'Wrath Of The Storm':'Section=combat Note="Reaction 2d8 HP (Dex half) %V/long rest"',
  'Destructive Wrath':'Section=magic Note="Channel Divinity for max thunder, lightning damage"',
  'Thunderbolt Strike':'Section=magic Note="Lightning damage pushes lg 10\'"',
  'Divine Strike':'Section=combat Note="+%Vd8 HP 1/turn"',
  'Stormborn':'Section=ability Note="Fly at full speed outdoors"',
  'Blessing Of The Trickster':'Section=magic Note="Touched Adv Stealth for 1 hr"',
  'Invoke Duplicity':'Section=magic Note="R30\' Illusionary duplicate for conc/1 min"',
  'Cloak Of The Trickster':'Section=magic Note="Channel Divinity for invisible 1 turn"',
  'Divine Strike':'Section=combat Note="+%Vd8 HP 1/turn"',
  'Improved Duplicity':'Section=magic Note="Four duplicates"',
  'War Priest':'Section=combat Note="Bonus attack %V/long rest"',
  'Guided Strike':'Section=combat Note="Channel Divinity for +10 attack"',
  "War God's Blessing":'Section=magic Note="R30\' Channel Divinity reaction for ally +10 attack"',
  'Divine Strike':'Section=combat Note="+%Vd8 HP 1/turn"',
  'Avatar Of Battle':'Section=combat Note="Resistance nonmagical bludgeon, pierce, slash"',
  'Combat Wild Shape':'Section=combat Note="Wild Shape as bonus action, use spell slot to regain (slot level)d8 HP"',
  'Circle Forms':'Section=magic Note="Increase Wild Shape CR to %V"',
  'Primal Strike':'Section=combat Note="Wild Shape attacks count as magical"',
  'Elemental Wild Shape':'Section=magic Note="Use 2 Wild Shape uses to become elemental"',
  'Thousand Forms':'Section=magic Note="<i>Alter Self</i> at will"',
  'Maneuvers':'Section=combat Note="Select %V Fighter maneuvers (DC %1)"',
  'Student Of War':'Section=skill Note="Artisan\'s Tools Prof"',
  'Superiority Dice':'Section=combat Note="%Vd%1/short rest"',
  'Know Your Enemy':'Section=combat Note="Know how foe compares to you after 1 min study"',
  'Relentless':'Section=combat Note="Min 1 superiority die after Init"',
  'Weapon Bond':'Section=combat Note="Immune disarm, summon weapon"',
  'War Magic':'Section=combat Note="Bonus attack after %V"',
  'Eldritch Strike':'Section=combat Note="Foe Disadv vs. your spells for 1 turn after you hit"',
  'Arcane Charge':'Section=magic Note="Action Surge to teleport 30\'"',
  "Commander's Strike":'Section=combat Note="Add Superiority die to delegated attack"',
  'Disarming Attack':'Section=combat Note="Add Superiority die to damage, foe drops item (Str neg)"',
  'Distracting Strike':'Section=combat Note="Add Superiority die to damage, ally Adv attack same foe for 1 turn"',
  'Evasive Footwork':'Section=combat Note="Add Superiority die to AC during move"',
  'Feinting Attack':'Section=combat Note="Adv next attack adjacent foe, add Superiority die to damage"',
  'Goading Attack':'Section=combat Note="Add Superiority die to damage, foe Disadv attack others for 1 turn (Wis neg)"',
  'Lunging Attack':'Section=combat Note="+5\' melee range, add Superiority die to damage"',
  'Maneuvering Attack':'Section=combat Note="Add Superiority die to damage, ally move half speed w/no OA"',
  'Menacing Attack':'Section=combat Note="Add Superiority die to damage, foe fright for 1 turn (Wis neg)"',
  'Parry':'Section=combat Note="Reduce damage from foe hit by Superiority die + %V"',
  'Precision Attack':'Section=combat Note="Add Superiority die to attack"',
  'Pushing Attack':'Section=combat Note="Add Superiority die to damage, foe pushed 15\' (Str neg)"',
  'Rally':'Section=combat Note="Chosen ally gains Superiority die + %V temp HP"',
  'Riposte':'Section=combat Note="Bonus attack after foe miss, add Superiority die to damage"',
  'Sweeping Attack:':'Section=ombat Note="After hit, Superiority die damage to second adjacent foe"',
  'Trip Attack':'Section=combat Note="Add Superiority die to damage, foe knocked prone (Str neg)"',
  'Breath Of Winter':'Section=magic Note="Spend 6 Ki to cast <i>Cone Of Cold</i>"',
  'Clench Of The North Wind':'Section=magic Note="Spend 3 Ki to cast <i>Hold Person</i>"',
  'Eternal Mountain Defense':'Section=magic Note="Spend 5 Ki to cast self <i>Stoneskin</i>"',
  'Fangs Of The Fire Snake':'Section=magic Note="Spend 1 Ki to have unarmed attack extend 10\', +1d10 HP fire"',
  'Fist Of Four Thunders':'Section=magic Note="Spend 2 Ki to cast <i>Thunderwave</i>"',
  'Fist Of Unbroken Air':'Section=magic Note="R30\' Spend 2 Ki to create air blast 3d10 HP, push 20\' and knock prone (Str half)"',
  'Flames Of The Phoenix':'Section=magic Note="Spend 4 Ki to cast <i>Fireball</i>"',
  'Gong Of The Summit':'Section=magic Note="Spend 3 Ki to cast <i>Shatter</i>"',
  'Mist Stance':'Section=magic Note="Spend 4 Ki to cast self <i>Gaseous Form</i>"',
  'Ride The Wind':'Section=magic Note="Spend 4 Ki to cast self <i>Fly</i>"',
  'River Of Hungry Flame':'Section=magic Note="Spend 5 Ki to cast <i>Wall Of Fire</i>"',
  'Rush Of The Gale Spirits':'Section=magic Note="Spend 2 Ki to cast <i>Gust Of Wind</i>"',
  'Shape The Flowing River':'Section=magic Note="R120\' Freeze, thaw, shape 30\'x30\' water"',
  'Sweeping Cinder Strike':'Section=magic Note="Spend 2 Ki to cast <i>Burning Hands</i>"',
  'Water Whip':'Section=magic Note="R30\' Spend 2 Ki to create water whip 3d10 HP, pull 25\' or knock prone (Str half)"',
  'Wave Of The Rolling Earth':'Section=magic Note="Spend 6 Ki to cast <i>Wall Of Stone</i>"',
  'Disciple Of The Elements':'Section=magic Note="%V elemental disciplines"',
  'Elemental Attunement':'Section=magic Note="Minor elemental manipulation"',
  'Shadow Arts':'Section=magic Note="<i>Minor Illusion</i> cantrip, spend 2 Ki to cast <i>Darkness</i>, i>Darkvision</i>, <i>Pass Without Trace</i>, <i>Silence</i>"',
  'Shadow Step':'Section=magic Note="Teleport 60\' between dim or unlit areas"',
  'Cloak Of Shadows':'Section=magic Note="Invisible in dim/unlit until attack or cast"',
  'Opportunist':'Section=combat Note="Attack adjacent foe after ally hits it"',
  "Nature's Wrath":'Section=magic Note="R10\' Channel Divinity for vines ensnare foe (Dex or Str neg)"',
  'Turn The Faithless':'Section=magic Note="R30\' Channel Divinity for fiends, fey flee for 1 min (Wis neg)"',
  'Aura Of Warding':'Section=save Note="R%V\' Self, allies resist spell damage"',
  'Undying Sentinel':'Section=combat Note="Keep 1 HP when brought to 0 1/long rest"',
  'Elder Champion':'Section=magic Note="Transform, regain 10 HP/turn, cast as bonus action, foes w/in 10\' save Disadv 1/long rest"',
  'Abjure Enemy':'Section=magic Note="R60\' Channel Divinity for target halted 1 min (Wis half)"',
  'Vow Of Enmity':'Section=combat Note="R10\' Channel Divinity for Adv attacks against target for 1 min"',
  'Relentless Avenger':'Section=combat Note="Move half speed after OA hit"',
  'Soul Of Vengeance':'Section=combat Note="Attack Vow Of Enmity target as reaction"',
  'Avenging Angel':'Section=magic Note="Fly 60\', 30\' foes fright (Wis neg) 1 hr/long rest"',
  "Ranger's Companion":'Section=feature Note="Companion beast obeys commands"',
  'Exceptional Training':'Section=feature Note="Companion can Dash, Disengage, Help instead of attack"',
  'Bestial Fury':'Section=feature Note="Companion 2 attacks/rd"',
  'Share Spells':'Section=feature Note="R30\' Self spell affects companion"',
  'Assassin Proficiencies':'Section=skill Note="Prof Disguise Kit/Prof Poisoner\'s Kit"',
  'Assassinate':'Section=combat Note="Adv when foe has not acted, crit on surprise hit"',
  'Infiltration Expertise':'Section=feature Note="Forge and adopt different identity"',
  'Impostor':'Section=feature Note="Unerring mimicry"',
  'Death Strike':'Section=combat Note="Dbl damage on surprise hit (DC %V Con neg)"',
  'Mage Hand Legerdemain':'Section=magic Note="Plant, retrieve, pick, disarm via invisible <i>Mage Hand</i>"',
  'Magical Ambush':'Section=magic Note="Foe Disadv spell save when self hidden"',
  'Versatile Trickster':'Section=magic Note="Distract foe (self Adv attacks) via <i>Mage Hand</i>"',
  'Spell Thief':'Section=magic Note="Foe spell negated, self cast w/in 8 hours (DC %V neg) 1/long rest"',
  'Wild Magic Surge':'Section=magic Note="5% chance of random magic effect"',
  'Tides Of Chaos':'Section=feature Note="Adv on attack, ability, or save 1/long rest (may cause surge)"',
  'Bend Luck':'Section=magic Note="Spend 2 Sorcery Points to add or subtract 1d4 from target roll"',
  'Controlled Chaos':'Section=magic Note="Re-roll wild magic surge effect"',
  'Spell Bombardment':'Section=magic Note="Add another die to max die 1/turn"',
  'Fey Presence':'Section=magic Note="R10\' All creatures charm or fright 1 turn (Wis neg) 1/short rest"',
  'Misty Escape':'Section=magic Note="After damage, teleport 60\' and become invisible 1 turn 1/short rest"',
  'Beguiling Defenses':'Section=save Note="Immune charm, reflect 1 min (Wis neg)"',
  'Dark Delirium':'Section=magic Note="R60\' Target charm or fright 1 min, then unaware surroundings (Wis neg) 1/long rest"',
  'Awakened Mind':'Section=feature Note="R30\' Telepathic communication"',
  'Entropic World':'Section=combat Note="Foe Disadv attack, miss gives you Adv next attack 1/short rest"',
  'Thought Shield':'Section=save Note="Immune telepathy, resist and reflect psychic damage"',
  'Create Thrall':'Section=magic Note="Touch charms incapacitated humanoid"',
  'Abjuration Savant':'Section=magic Note="Write abjuration spells for half cost"',
  'Arcane Ward':'Section=magic Note="Abjuration casting creates %V HP shield"',
  'Projected Ward':'Section=magic Note="R30\' Use Arcane Ward to protect others"',
  'Improved Abjuration':'Section=magic Note="Add Prof Bonus to abjuration ability checks"',
  'Spell Resistance':'Section=save Note="Adv and resistance to spell damage"',
  'Conjuration Savant':'Section=magic Note="Write conjuration spells for half cost"',
  'Minor Conjuration':'Section=magic Note="R10\' Create 3\' cu object for 1 hr"',
  'Benign Transposition':'Section=magic Note="R30\' Teleport or swap willing creature 1/long rest or cast"',
  'Focused Conjuration':'Section=magic Note="Damage cannot break conjuration concentration"',
  'Durable Summons':'Section=magic Note="Summoned creatures +30 HP"',
  'Divination Savant':'Section=magic Note="Write divination spells for half cost"',
  'Portent':'Section=magic Note="Replace self or other roll %V/long rest"',
  'Expert Divination':'Section=magic Note="Regain lower spell slot when cast divination spell"',
  'The Third Eye':'Section=magic Note="60\' Darkvision, 60\' Ethereal Sight, read any language, or 10\' see invisibility"',
  'Enchantment Savant':'Section=magic Note="Write enchantment spells for half cost"',
  'Hypnotic Gaze':'Section=magic Note="Daze adjacent creature 1/long rest (Wis neg)"',
  'Instinctive Charm':'Section=magic Note="Redirect self foe attack to closest creature 1/long rest (Wis neg)"',
  'Split Enchantment':'Section=magic Note="Add second target to charm spell"',
  'Alter Memories':'Section=magic Note="Target unaware charmed, forget %V hrs (Int neg)"',
  'Illusion Savant':'Section=magic Note="Write illusion spells for half cost"',
  'Improved Minor Illusion':'Section=magic Note="<i>Minor Illusion</i> with sound, image"',
  'Malleable Illusions':'Section=magic Note="Transform existing illusions"',
  'Illusory Self':'Section=magic Note="React causes foe miss 1/short rest"',
  'Illusory Reality':'Section=magic Note="Object in illusion real for 1 min"',
  'Necromancy Savant':'Section=magic Note="Write necromancy spells for half cost"',
  'Grim Harvest':'Section=magic Note="Regain 2x spell level (3x necromantic) when spell kills"',
  'Undead Thralls':'Section=magic Note="<i>Animate Dead</i> +1 corpse, +%V HP, +%1 damage"',
  'Inured To Undeath':'Section=save Note="Resist necrotic, immune max HP reduction"',
  'Command Undead':'Section=magic Note="R60\' Take control of undead target (Cha neg (Adv intelligent undead))"',
  'Transmutation Savant':'Section=magic Note="Write transmutation spells for half cost"',
  'Minor Alchemy':'Section=magic Note="Transform 1 cu\'/10 min for 1 hr"',
  "Transmuter's Stone":'Section=magic Note="Stone gives 60\' darkvision, +10 speed, Prof Con, or resist energy"',
  'Shapechanger':'Section=magic Note="Self <i>Polymorph</i> 1/short rest"',
  'Master Transmuter':'Section=magic Note="Destroy stone to transmute 5\' cu, remove curse, disease, and poison, <i>Raise Dead</i>, or restore youth"',
  // Feats
  'Actor':'Section=ability,skill Note="+1 Charisma","Mimic others\' speech or sounds, Adv Deception (Cha) and Performance (Cha) when impersonating"',
  'Alert':'Section=combat Note="+5 Initiative/foes no surprise or hidden Adv"',
  'Athlete':'Section=ability,skill Note="+1 Dexterity or Strength, climb full speed, stand uses 5\' move","Long jump, running high jump uses 5\' move"',
  'Charger':'Section=combat Note="Bonus attack +5 HP or 10\' push after Dash"',
  'Crossbow Expert':'Section=combat Note="Quick load, no Disadv on close shot, bonus hand crossbow shot after one-handed attack"',
  'Defensive Dualist':'Section=combat Note="React +%V AC when holding finesse weapon"',
  'Dual Wielder':'Section=combat Note="+1 AC w/two weapons, two-weapon fighting w/non-light weapons, draw two weapons at once"',
  'Dungeon Delver':'Section=save,skill Note="Adv vs. traps, resistance trap damage","Adv detect secret doors, search for traps at full speed"',
  'Durable':'Section=ability,combat Note="+1 Constitution","Min %V when regaining HP"',
  'Elemental Adept (Acid)':'Section=magic Note="Spells ignore acid resistance, treat 1s as 2s on damage die"',
  'Elemental Adept (Cold)':'Section=magic Note="Spells ignore cold resistance, treat 1s as 2s on damage die"',
  'Elemental Adept (Fire)':'Section=magic Note="Spells ignore fire resistance, treat 1s as 2s on damage die"',
  'Elemental Adept (Lightning)':'Section=magic Note="Spells ignore lightning resistance, treat 1s as 2s on damage die"',
  'Elemental Adept (Thunder)':'Section=magic Note="Spells ignore thunder resistance, treat 1s as 2s on damage die"',
  'Great Weapon Master':'Section=combat Note="Bonus attack after crit or foe to 0 HP, may trade -5 attack for +10 damage"',
  'Healer':'Section=feature Note="Stabilize via healer\'s kit restores 1 HP, healer\'s kit heals 1d6+4 HP 1/short rest"',
  'Heavily Armored':'Section=ability,skill Note="+1 Strength","Armor Proficiency (Heavy)"',
  'Heavy Armor Master':'Section=ability,combat Note="+1 Strength","Non-magical bludgeon, pierce, slash DR 3"',
  'Inspiring Leader':'Section=feature Note="R30\' 10-min speech give 6 allies %V HP"',
  'Keen Mind':'Section=ability,feature Note="+1 Intelligence","Know N, hours until sunrise and sunset, things seen or heard prior 30 days"',
  'Lightly Armored':'Section=ability,combat Note="+1 Dexterity or Strength","Armor Proficiency (Light)"',
  'Linguist':'Section=ability,feature,skill Note="+1 Intelligence","Create ciphers, DC %V Int to decode","+3 Language Count"',
  'Lucky':'Section=feature Note="Adv attack, ability, and save or foe Disadv attack 3/long rest"',
  'Mage Slayer':'Section=combat,save Note="React to attack adjacent caster, foe Disadv concentration","Adv vs. spells by adjacent foes"',
  'Magic Initiate':'Section=magic Note="2 cantrips, 1 1st-level/long rest"',
  'Martial Adept':'Section=combat Note="Two maneuvers (DC %V), 1 superiority die/long rest"',
  'Medium Armor Master':'Section=combat,skill Note="+1 AC","No Stealth check penalty in medium armor"',
  'Mobile':'Section=ability,combat Note="+10 Speed","Dash at full speed in difficult terrain, no OA from targeted foe"',
  'Moderately Armored':'Section=ability,combat Note="+1 Dexterity or Strength","Armor Proficiency (Medium)/Shield Proficiency"',
  'Mounted Combatant':'Section=combat Note="Adv unmounted foe smaller than mount, redirect attack on mount to self, mount takes no damage on Dex save, half on fail"',
  'Observant':'Section=ability,feature,skill Note="+1 Intelligence or Wisdom","Read lips","+5 passive Investigation and Perception"',
  'Polearm Master':'Section=combat Note="Bonus attack polearm butt (1d4 HP), OA when foe enters reach"',
  'Resilient':'Section=ability,save Note="+1 chosen ability","Prof saves in chosen ability"',
  'Ritual Caster':'Section=magic Note="Cast spells from ritual book"',
  'Savage Attacker':'Section=combat Note="Re-roll damage 1/turn"',
  'Sentinel':'Section=combat Note="Foe stuck by OA speed 0, OA on foe Disengage, react attack when adjacent foe targets other"',
  'Sharpshooter':'Section=combat Note="No Disadv long range, ignore 3/4 cover, take -5 attack for +10 damage"',
  'Shield Master':'Section=combat,save Note="Bonus 5\' Push","+2 Dex vs. targeted spell, save for no damage instead of half"',
  'Skilled':'Section=skill Note="Prof 3 skills or tools"',
  'Skulker':'Section=skill Note="Hide when lightly obscured, ranged miss does not reveal position, no Disadv on Perception in dim light"',
  'Spell Sniper':'Section=magic Note="Dbl attack spell range, ignore 3/4 cover, additional attack cantrip"',
  'Tavern Brawler':'Section=ability,combat Note="+1 Constitution or Strength","Prof improvised, bonus to grapple"',
  'Tough':'Section=combat Note="+%V HP"',
  'War Caster':'Section=combat Note=Adv concentration, cast when holding shield or weapon, cast as OA"',
  'Weapon Master':'Section=ability,combat Note="+1 Dexterity or Strength","Prof 4 weapons"',
  // Races
  'Mountain Dwarf Ability Adjustment':'Section=ability Note="+2 Constitution/+2 Strength"',
  'Wood Elf Ability Adjustment':'Section=ability Note="+2 Dexterity/+1 Wisdom"',
  'Fleet Of Foot':'Section=ability Note="+5 Speed"',
  'Mask Of The Wild':'Section=skill Note="Hide in light natural coverage"',
  'Dark Elf Ability Adjustment':'Section=ability Note="+2 Dexterity/+1 Charisma"',
  'Drow Magic':'Section=magic Note="<i>Dancing Lights</i> cantrip%V"',
  'Sunlight Sensitivity':'Section=combat,skill Note="Disadv attack in direct sunlight","Disadv sight Perception in direct sunlight"',
  'Superior Darkvision':'Section=feature Note="R120\' See one light level better"',
  'Stout Halfling Ability Adjustment':'Section=ability Note="+2 Dexterity/+1 Constitution"',
  'Stout Resilience':'Section=save Note="Adv vs. poison/Resistance vs. poison"',
  'Forest Gnome Ability Adjustment':'Section=ability Note="+2 Intelligence/+1 Dexterity"',
  'Natural Illusionist':'Section=magic Note="<i>Minor Illusion</i> cantrip"',
  'Speak With Small Beasts':'Section=feature Note="Simple communication with small animals"'
};
PHB5E.PATHS = {
  'Circle Of The Land (Underdark)':
    'Group=Druid Level=levels.Druid ' +
    'Features=' +
      '"2:Bonus Cantrip","2:Natural Recovery","6:Land\'s Stride",' +
      '"10:Nature\'s Ward","14:Nature\'s Sanctuary" ' +
    'Spells=' +
      '"3:Underdark1:Spider Climb;Web",' +
      '"5:Underdark2:Gaseous Form;Stinking Cloud",' +
      '"7:Underdark3:Greater Invisibility;Stone Shape",' +
      '"9:Underdark4:Cloudkill;Insect Plague"',
  'Circle Of The Moon':
    'Group=Druid Level=levels.Druid ' +
    'Features=' +
      '"2:Comat Wild Shape","2:Circle Forms","6:Primal Strike",' +
      '"10:Elemental Wild Shape","14:Thousand Forms"',
  'College Of Valor':
    'Group=Bard Level=levels.Bard ' +
    'Features=' +
      '"3:Armor Proficiency (Medium)","3:Shield Proficiency",' +
      '"3:Weapon Proficiency (Martial)",' +
      '"3:Bonus Skills","3:Combat Inspiration","6:Extra Attack",' +
      '"14:Battle Magic"',
  'Knowledge Domain':
    'Group=Cleric Level=levels.Cleric ' +
    'Features=' +
      '"1:Blessings Of Knowledge","2:Knowledge Of The Ages",' +
      '"6:Read Thoughts","8:Potent Spellcasting","17:Visions Of The Past" ' +
    'Spells=' +
      '"1:Knowledge1:Command;Identify",' +
      '"3:Knowledge2:Augury;Suggestion",' +
      '"5:Knowledge3:Nondetection;Speak With Dead",' +
      '"7:Knowledge4:Arcane Eye;Confusion",' +
      '"9:Knowledge5:Legend Lore;Scrying"',
  'Light Domain':
    'Group=Cleric Level=levels.Cleric ' +
    'Features=' +
      '"1:Light Cantrip","1:Warding Flare","2:Radiance Of The Dawn",' +
      '"6:Improved Flare","8:Potent Spellcasting","17:Corona Of Light" ' +
    'Spells=' +
      '"1:Light1:Burning Hands;Faerie Fire",' +
      '"3:Light2:Flaming Sphere;Scorching Ray",' +
      '"5:Light3:Daylight;Fireball",' +
      '"7:Light4:Guardian Of Faith;Wall Of Fire",' +
      '"9:Light5:Flame Strike;Scrying"',
  'Nature Domain':
    'Group=Cleric Level=levels.Cleric ' +
    'Features=' +
      '"1:Armor Proficiency (Heavy)",' +
      '"1:Acolyte Of Nature","2:Charm Animals And Plants","6:Dampen Elements",'+
      '"8:Divine Strike","17:Master Of Nature" ' +
    'Spells=' +
      '"1:Nature1:Animal Friendship;Speak With Animals",' +
      '"3:Nature2:Barkskin;Spike Growth",' +
      '"5:Nature3:Plant Growth;Wind Wall",' +
      '"7:Nature4:Dominate Beast;Grasping Vine",' +
      '"9:Nature5:Insect Plague;Tree Stride"',
  'Tempest Domain':
    'Group=Cleric Level=levels.Cleric ' +
    'Features=' +
      '"1:Armor Proficiency (Heavy)",' +
      '"1:Weapon Proficiency (Martial)",' +
      '"1:Wrath Of The Storm","2:Destructive Wrath","6:Thunderbolt Strike",' +
      '"8:Divine Strike",17:Stormborn ' +
    'Spells=' +
      '"1:Tempest1:Fog Cloud;Thunderwave",' +
      '"3:Tempest2:Gust Of Wind;Shatter",' +
      '"5:Tempest3:Call Lightning;Sleet Storm",' +
      '"7:Tempest4:Control Water;Ice Storm",' +
      '"9:Tempest5:Destructive Wave;Insect Plague"',
  'Trickery Domain':
    'Group=Cleric Level=levels.Cleric ' +
    'Features=' +
      '"1:Blessing Of The Trickster","2:Invoke Duplicity",' +
      '"6:Cloak Of The Trickster","8:Divine Strike","17:Improved Duplicity" ' +
    'Spells=' +
      '"1:Trickery1:Charm Person;Disguise Self",' +
      '"3:Trickery2:Mirror Image;Pass Without Trace",' +
      '"5:Trickery3:Blink;Dispel Magic",' +
      '"7:Trickery4:Dimension Door;Polymorph",' +
      '"9:Trickery5:Dominate Person;Modify Memory"',
  'War Domain':
    'Group=Cleric Level=levels.Cleric ' +
    'Features=' +
      '"1:Armor Proficiency (Heavy)",' +
      '"1:Weapon Proficiency (Martial)",' +
      '"1:War Priest","2:Guided Strike","6:War God\'s Blessing",' +
      '"8:Divine Strike","17:Avatar Of Battle" ' +
    'Spells=' +
      '"1:War1:Divine Favor;Shield Of Faith",' +
      '"3:War2:Magic Weapon;Spiritual Weapon",' +
      '"5:War3:Crusader\'s Mantle;Spirit Guardians",' +
      '"7:War4:Freedom Of Movement;Stoneskin",' +
      '"9:War5:Flame Strike;Hold Monster"',
  'Path Of The Totem Warrior (Bear)':
    'Group=Barbarian Level=levels.Barbarian ' +
    'Features=' +
      '"3:Spiritual Seeker","3:Bear Totem Spirit","6:Aspect Of The Bear",' +
      '"10:Spirit Walker","14:Bear Totemic Attunement"',
  'Path Of The Totem Warrior (Eagle)':
    'Group=Barbarian Level=levels.Barbarian ' +
    'Features=' +
      '"3:Spiritual Seeker","3:Eagle Totem Spirit","6:Aspect Of The Eagle",' +
      '"10:Spirit Walker","14:Eagle Totemic Attunement"',
  'Path Of The Totem Warrior (Wolf)':
    'Group=Barbarian Level=levels.Barbarian ' +
    'Features=' +
      '"3:Spiritual Seeker","3:Wolf Totem Spirit","6:Aspect Of The Wolf",' +
      '"10:Spirit Walker","14:Wolf Totemic Attunement"',
  'Battle Master Archetype':
    'Group=Fighter Level=levels.Fighter ' +
    'Features=' +
      '"3:Maneuvers","3:Student Of War","3:Superiority Dice",' +
      '"7:Know Your Enemy",15:Relentless',
  'Eldritch Knight Archetype':
    'Group=Fighter Level=levels.Fighter ' +
    'Features=' +
      '"3:Weapon Bond","7:War Magic","10:Eldritch Strike","15:Arcane Charge"',
  'Way Of The Four Elements Tradition':
    'Group=Monk Level=levels.Monk ' +
    'Features=' +
      '"3:Disciple Of The Elements","3:Elemental Attunement"',
  'Way Of The Shadow Tradition':
    'Group=Monk Level=levels.Monk ' +
    'Features=' +
      '"3:Shadow Arts","6:Shadow Step","11:Cloak Of Shadows",' +
      '17:Opportunist',
  'Oath Of The Ancients':
    'Group=Paladin Level=levels.Paladin ' +
    'Features=' +
      '"3:Nature\'s Wrath","3:Turn The Faithless","7:Aura Of Warding",' +
      '"15:Undying Sentinel","20:Elder Champion" ' +
    'Spells=' +
      '"3:Ancients1:Ensnaring Strike;Speak With Animals",' +
      '"5:Ancients2:Moonbeam;Misty Step",' +
      '"9:Ancients3:Plant Growth;Protection From Energy",' +
      '"13:Ancients4:Ice Storm;Stoneskin",' +
      '"17:Ancients5:Commune With Nature;Tree Stride"',
  'Oath Of Vengeance':
    'Group=Paladin Level=levels.Paladin ' +
    'Features=' +
      '"3:Abjure Enemy","3:Vow Of Enmity","7:Relentless Avenger",' +
      '"15:Soul Of Vengeance","20:Avenging Angel" ' +
    'Spells=' +
      '"3:Vengeance1:Bane;Hunter\'s Mark",' +
      '"5:Vengeance1:Hold Person;Misty Step",' +
      '"9:Vengeance1:Haste;Protection From Energy",' +
      '"13:Vengeance1:Banishment;Dimension Door",' +
      '"17:Vengeance1:Hold Monster;Scrying"',
  'Beast Master Archetype':
    'Group=Ranger Level=levels.Ranger ' +
    'Features=' +
      '"3:Ranger\'s Companion","7:Exceptional Training","11:Bestial Fury",' +
      '"15:Share Spells"',
  'Assassin Archetype':
    'Group=Rogue Level=levels.Rogue ' +
    'Features=' +
      '"3:Assassin Proficiencies",3:Assassinate,"9:Infiltration Expertise",' +
      '13:Impostor,"17:Death Strike"',
  'Arcane Trickster Archetype':
    'Group=Rogue Level=levels.Rogue ' +
    'Features=' +
      '3:Spellcasting,"3:Mage Hand Legerdemain","9:Magical Ambush",' +
      '"13:Versatile Trickster","17:Spell Thief"',
  'Wild Magic':
    'Group=Sorcerer Level=levels.Sorcerer ' +
    'Features=' +
      '"1:Wild Magic Surge","1:Tides Of Chaos","6:Bend Luck",' +
      '"14:Controlled Chaos","18:Spell Bombardment"',
  'Archfey Patron':
    'Group=Warlock Level=levels.Warlock ' +
    'Features=' +
      '"1:Fey Presence","6:Misty Escape","10:Beguiling Defenses",' +
      '"14:Dark Delirium"',
  'Great Old One Patron':
    'Group=Warlock Level=levels.Warlock ' +
    'Features=' +
        '"1:Awakened Mind","6:Entropic World","10:Thought Shield",' +
        '"14:Create Thrall"',
  'Abjuration Tradition':
    'Group=Wizard Level=levels.Wizard ' +
    'Features=' +
      '"2:Abjuration Savant","2:Arcane Ward","6:Projected Ward",' +
      '"10:Improved Abjuration","14:Spell Resistance"',
  'Conjuration Tradition':
    'Group=Wizard Level=levels.Wizard ' +
    'Features=' +
      '"2:Conjuration Savant","2:Minor Conjuration","6:Benign Transposition",' +
      '"10:Focused Conjuration","14:Durable Summons"',
  'Divination Tradition':
    'Group=Wizard Level=levels.Wizard ' +
    'Features=' +
      '"2:Divination Savant",2:Portent,"6:Expert Divination",' +
      '"10:The Third Eye"',
  'Enchantment Tradition':
    'Group=Wizard Level=levels.Wizard ' +
    'Features=' +
      '"2:Enchantment Savant","2:Hypnotic Gaze","6:Instinctive Charm",' +
      '"10:Split Enchantment","14:Alter Memories"',
  'Illusion Tradition':
    'Group=Wizard Level=levels.Wizard ' +
    'Features=' +
      '"2:Illusion Savant","2:Improved Minor Illusion",' +
      '"6:Malleable Illusions","10:Illusory Self","14:Illusory Reality"',
  'Necromancy Tradition':
    'Group=Wizard Level=levels.Wizard ' +
    'Features=' +
      '"2:Necromancy Savant","2:Grim Harvest","6:Undead Thralls",' +
      '"10:Inured To Undeath","14:Command Undead"',
  'Transmutation Tradition':
    'Group=Wizard Level=levels.Wizard ' +
    'Features=' +
      '"2:Transmutation Savant","2:Minor Alchemy","6:Transmuter\'s Stone",' +
      '10:Shapechanger,"14:Master Transmuter"'
};
PHB5E.RACES = {
  'Mountain Dwarf':
    'Features=' +
      '"1:Armor Proficiency (Medium)",' +
      '"1:Weapon Proficiency (Battleaxe/Handaxe/Light Hammer/Warhammer)",' +
      '"1:Tool Proficiency (1 of Brewer\'s Tools, Mason\'s Tools, Smith\'s Tools)",' +
      '1:Darkvision,"1:Hill Dwarf Ability Adjustment",' +
      '"1:Dwarven Armor Speed","1:Dwarven Resilience",1:Slow,1:Stonecunning ' +
    'Languages=Common,Dwarvish',
  'Dark Elf':
    'Features=' +
      '"1:Weapon Proficiency (Hand Crossbow/Rapier/Shortsword)",' +
      '"1:Dark Elf Ability Adjustment","1:Drow Magic","1:Fey Ancestry",' +
      '"1:Keen Senses",' +
      '"1:Superior Darkvision",1:Trance ' +
    'Languages=Common,Elvish',
  'Wood Elf':
    'Features=' +
      '"1:Weapon Proficiency (Longbow/Longsword/Shortbow/Shortsword)",' +
      '1:Darkvision,"1:Fey Ancestry","1:Fleet Of Foot","1:Keen Senses",' +
      '"1:Mask Of The Wild",1:Trance,"1:Wood Elf Ability Adjustment" ' +
    'Languages=Common,Elvish',
  'Forest Gnome':
    'Features=' +
      '1:Darkvision,"1:Gnome Cunning","1:Natural Illusionist",' +
      '"1:Rock Gnome Ability Adjustment",1:Slow,1:Small,' +
      '"1:Speak With Small Beasts" ' +
    'Languages=Common,Gnomish',
  'Stout Halfling':
    'Features=' +
      '1:Brave,"1:Halfling Luck","1:Halfling Nimbleness",1:Slow,1:Small,' +
      '"1:Stout Halfling Ability Adjustment","1:Stout Resilience" ' +
    'Languages=Common,Halfling',
};
PHB5E.SPELLS_ADDED = {
  'Arcane Gate':
    'School=Conjuration ' +
    'Description="R10\'/500\' Connect portal pair for conc/10 min"',
  'Armor Of Agathys':
    'School=Abjuration ' +
    'Description="Self frosted, +5 HP, 5 HP cold to successful attacker"',
  'Arms Of Hadar':
    'School=Conjuration ' +
    'Description="All in 10\' radius take 2d6 HP necrotic (Str half), no reactions until next turn"',
  'Aura Of Life':
    'School=Abjuration ' +
    'Description="Self 30\' radius gives resistance to necrotic damage, raise nonhostile 0 HP to 1 HP for conc/10 min"',
  'Aura Of Purity':
    'School=Abjuration ' +
    'Description="Self 30\' radius gives resist poison, no disease, Adv conditions for conc/10 min"',
  'Aura Of Vitality':
    'School=Evocation ' +
    'Description="Self 30\' radius heals 2d6 HP designated target 1/rd for conc/1 min"',
  'Banishing Smite':
    'School=Abjuration ' +
    'Description="Self attacks +5d10 HP force and banish to home/demiplane if lt 50 HP for conc/1 min"',
  'Beast Sense':
    'School=Divination ' +
    'Description="Self use touched beast\'s senses for conc/1 hr"',
  'Blade Ward':
    'School=Abjuration ' +
    'Description="Self resist bludgeon, pierce, slash damage for 1 rd"',
  'Blinding Smite':
    'School=Evocation ' +
    'Description="Self next attack +3d8 HP radiant and blind (Con neg) for conc/1 min"',
  'Chromatic Orb':
    'School=Evocation ' +
    'Description="R90\' 4 in hurled sphere 3d8 HP acid/poison/energy"',
  'Circle Of Power':
    'School=Abjuration ' +
    'Description="Allies in 30\' radius from self Adv save vs. magic, neg instead of half for conc/10 min"',
  'Cloud Of Daggers':
    'School=Conjuration ' +
    'Description="R60\' Spinning daggers in 5\' cu 4d4 HP slashing for conc/1 min"',
  'Compelled Duel':
    'School=Enchantment ' +
    'Description="R30\' Target attack only self w/Disadv for conc/1 min (Wis neg)"',
  'Conjure Barrage':
    'School=Conjuration ' +
    'Description="60\' weapon cone 3d8 HP (Dex half)"',
  'Conjure Volley':
    'School=Conjuration ' +
    'Description="R150\' 40\' radius weapon hail 8d8 HP (Dex half)"',
  'Cordon Of Arrows':
    'School=Transmutation ' +
    'Description="Four pieces of ammo attack 30\' 1d6 HP (Dex neg) for 8 hr"',
  'Crown Of Madness':
    'School=Enchantment ' +
    'Description="R120\' Direct charmed creature\'s attacks for conc/1 min (Wis neg)"',
  "Crusader's Mantle":
    'School=Evocation ' +
    'Description="30\' radius allies +1d4 damage for conc/1 min"',
  'Destructive Wave':
    'School=Evocation ' +
    'Description="Targets in 30\' radius 5d6 HP (Con half), prone (Con neg)"',
  'Dissonant Whispers':
    'School=Enchantment ' +
    'Description="R60\' Target 3d6 HP (Wis half), flee (Wis neg)"',
  'Elemental Weapon':
    'School=Transmutation ' +
    'Description="Touched weapon +1 attack, +1d4 damage for conc/1 hr"',
  'Ensnaring Strike':
    'School=Conjuration ' +
    'Description="Successful attack restrains foe, 1d6 HP/turn for conc/1 min (Str neg)"',
  'Feign Death':
    'School=Necromancy ' +
    'Description="Touched appears dead for 1 hr"',
  'Friends':
    'School=Enchantment ' +
    'Description="Self Adv Cha w/target for conc/1 min"',
  'Grasping Vine':
    'School=Conjuration ' +
    'Description="R30\' Vine pulls target 20\' for conc/1 min (Dex neg)"',
  'Hail Of Thorns':
    'School=Conjuration ' +
    'Description="Ranged hit followed by 5\' thorn rain 1d10 HP (Dex half)"',
  'Hex':
    'School=Enchantment ' +
    'Description="R90\' Self hits on target +1d6 HP, Disadv chosen ability for conc/1 hr"',
  'Hunger Of Hadar':
    'School=Conjuration ' +
    'Description="R150\' 20\' void 2d6 HP for conc/1 min"',
  'Lightning Arrow':
    'School=Transmutation ' +
    'Description="100\' bolt 8d6 HP (Dex half)"',
  'Phantasmal Force':
    'School=Illusion ' +
    'Description="R60\' target illusion 1d6 HP/rd (Int neg)"',
  'Power Word Heal':
    'School=Evocation ' +
    'Description="Touched regains all HP, uncharm, unfright, unparalyze, unstun"',
  'Ray Of Sickness':
    'School=Necromancy ' +
    'Description="R60\' Target 2d8 HP, poisoned 1 turn (Con not poisoned)",',
  'Searing Smite':
    'School=Evocation ' +
    'Description="Hit +1d6 HP, 1d6 HP/turn for conc/1 min (Con no per-turn damage)"',
  'Staggering Smite':
    'School=Evocation ' +
    'Description="Next hit +4d6 HP w/in conc/1 min"',
  'Swift Quiver':
    'School=Transmutation ' +
    'Description="Touched quiver endless ammo, dbl attack for conc/1 min"',
  'Telepathy':
    'School=Evocation ' +
    'Description="Mental communication with ally for 1 dy"',
  'Thorn Whip':
    'School=Transmutation ' +
    'Description="R30\' Vine attacks ${Math.floor((lvl+7)/6)}d6 HP, pulls 10\'"',
  'Thunderous Smite':
    'School=Evocation ' +
    'Description="Next hit 2d6 HP, push 10\' (Str no push)"',
  'Tsunami':
    'School=Conjuration ' +
    'Description="RSight 300\'x300\' wall of water 6d10 HP (Str half), moves away 50\'/turn for conc/6 rd"',
  'Witch Bolt':
    'School=Evocation ' +
    'Description="R30\' Target 1d12/turn for conc/1 min"',
  'Wrathful Smite':
    'School=Evocation ' +
    'Description="Next hit +1d6 HP, fright (Wis neg) for conc/1 min"',
};

/* Defines rules related to basic character identity. */
PHB5E.identityRules = function(
  rules, backgrounds, classes, deities, paths, races
) {

  QuilvynUtils.checkAttrTable
    (backgrounds, ['Equipment', 'Features', 'Languages', 'Proficiencies']);
  QuilvynUtils.checkAttrTable
    (classes, ['Require', 'HitDie', 'Features', 'Selectables', 'Proficiencies', 'Languages', 'CasterLevelArcane', 'CasterLevelDivine', 'SpellAbility', 'SpellSlots', 'Spells']);
  QuilvynUtils.checkAttrTable(deities, ['Alignment', 'Domain']);
  QuilvynUtils.checkAttrTable(paths, ['Features', 'Group', 'Level', 'Spells']);
  QuilvynUtils.checkAttrTable(races, ['Require', 'Features', 'Selectables', 'Languages', 'Proficiencies', 'SpellAbility', 'Spells']);

  for(var background in backgrounds) {
    rules.choiceRules(rules, 'Background', background, backgrounds[background]);
  }
  for(var clas in classes) {
    rules.choiceRules
      (rules, 'Class', clas, SRD5E.CLASSES[clas] + classes[clas]);
  }
  for(var deity in deities) {
    rules.choiceRules(rules, 'Deity', deity, deities[deity]);
  }
  for(var path in paths) {
    rules.choiceRules(rules, 'Path', path, paths[path]);
    PHB5E.pathRulesExtra(rules, path);
  }
  for(var race in races) {
    rules.choiceRules(rules, 'Race', race, races[race]);
  }

};

/* Defines rules related to character feats and features. */
PHB5E.talentRules = function(rules, feats, features) {

  for(var feat in feats) {
    rules.choiceRules(rules, 'Feat', feat, feats[feat]);
  }
  for(var feature in features) {
    rules.choiceRules(rules, 'Feature', feature, features[feature]);
  }

  for(var feat in feats) {
    rules.choiceRules(rules, 'Feat', feat, feats[feat]);
    PHB5E.featRulesExtra(rules, feat);
  }
  for(var feature in features) {
    rules.choiceRules(rules, 'Feature', feature, features[feature]);
  }

};

/* Defines the rules related to character classes. */
PHB5E.pathRulesExtra = function(rules, name) {

  if(name == 'Totem Warrior (Bear)') {

    rules.defineRule('carry', 'abilityNotes.aspectOfTheBear', '*', '2');
    rules.defineRule('lift', 'abilityNotes.aspectOfTheBear', '*', '2');

  } else if(name == 'College Of Valor') {

    rules.defineRule('bardExtraAttacks',
      'bardFeatures.Extra Attack', '?', null,
      'levels.Bard', '=', 'source < 6 ? null : 1'
    );
    rules.defineRule('combatNotes.extraAttack', 'bardExtraAttacks', '+=', null);

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
    rules.defineRule
      ('magicNotes.radianceOfTheDawn', 'levels.Cleric', '=', null);
    rules.defineRule
      ('magicNotes.wardingFlare', 'wisdomModifier', '=', 'Math.max(source, 1)');

  } else if(name == 'Nature Domain') {

    rules.defineRule
      ('skillChoices.Animal Handling', 'skillNotes.acolyteOfNature', '=', '1');
    rules.defineRule
      ('skillChoices.Nature', 'skillNotes.acolyteOfNature', '=', '1');
    rules.defineRule
      ('skillChoices.Survival', 'skillNotes.acolyteOfNature', '=', '1');

  } else if(name == 'Tempest Domain') {

    rules.defineRule('combatNotes.wrathOfTheStorm',
      'wisdomModifier', '=', 'Math.max(source, 1)'
    );

  } else if(name == 'War Domain') {

    rules.defineRule
      ('combatNotes.warPriest', 'wisdomModifier', '=', 'Math.max(source, 1)');

  } else if(name == 'Circle Of The Moon') {

    rules.defineRule
      ('magicNotes.wildShape.1', 'magicNotes.circleForms', '=', null);
    rules.defineRule('magicNotes.circleForms',
      'levels.Druid', '=', 'source < 6 ? 1 : Math.floor(source / 3)'
    );

  } else if(name == 'Battle Master Archetype') {

    rules.defineRule('toolChoiceCount', 'skillNotes.studentOfWar', '+=', '1');
    rules.defineRule
      ('toolChoices.Artisan', 'skillNotes.studentOfWar', '=', '1');
    rules.defineRule('combatNotes.superiorityDice',
      'levels.Fighter', '=', 'source < 7 ? 4 : source < 15 ? 5 : 6'
    );
    rules.defineRule('combatNotes.superiorityDice.1',
      'fighterFeatures.Superiority Dice', '?', null,
      'levels.Fighter', '=', 'source < 10 ? 8 : source < 18 ? 10 : 12'
    );
    rules.defineRule('maxDexOrStrMod',
      'dexterityModifier', '=', null,
      'strengthModifier', '^', null
    );
    rules.defineRule('combatNotes.maneuvers',
      'fighterFeatures.Battle Master Archetype', '?', null,
      'levels.Fighter', '=', 'source<7 ? 3 : source<10 ? 5 : source<15 ? 7 : 9'
    );
    rules.defineRule('combatNotes.maneuvers.1',
      'fighterFeatures.Battle Master Archetype', '?', null,
      'proficiencyBonus', '=', '8 + source',
      'maxDexOrStrMod', '+', null
    );
    rules.defineRule('combatNotes.parry', 'dexterityModifier', '=', null);
    rules.defineRule('combatNotes.rally', 'charismaModifier', '=', null);
    rules.defineRule
      ('selectableFeatureCount.Fighter', 'combatNotes.maneuvers', '+', null);

  } else if(name == 'Eldritch Knight Archetype') {

    rules.defineRule('combatNotes.warMagic',
      'levels.Fighter', '=', 'source < 18 ? "cantrip" : "spell"'
    );

/* TODO
      spellAbility = 'intelligence';
      spellsKnown = [
        'W0:3:2/10:3',
        'W:3:3/4:4/7:5/8:6/10:7/11:8/13:9/14:10/16:11/19:12/20:13',
      ];
      spellSlots = [
        'W1:3:2/4:3/7:4',
        'W2:7:2/10:3',
        'W3:13:2/16:3',
        'W4:19:1'
      ];
      rules.defineRule('casterLevels.Fi',
        'fighterFeatures.Eldritch Knight Archetype', '?', null,
        'levels.Fighter', '=', null,
         'magicNotes.casterLevelBonus', '+', null
      );
      rules.defineRule('casterLevels.W', 'casterLevels.Fi', '^=', null);
      rules.defineRule('casterLevelArcane', 'casterLevels.W', '+=', null);
      rules.defineRule('spellsKnownLevel.Fighter',
        'fighterFeatures.Eldritch Knight Archetype', '?', null
      );
      rules.defineRule('spellAttackModifier.Fighter',
        'fighterFeatures.Eldritch Knight Archetype', '?', null
      );
*/

  } else if(name == 'Way Of The Four Elements Tradition') {

    rules.defineRule('magicNotes.discipleOfTheElements',
      'monkFeatures.Way Of The Four Elements Tradition', '?', null,
      'levels.Monk', '=', 'Math.floor( (source + 4) / 5)'
    );
    rules.defineRule('selectableFeatureCount.Monk',
      'magicNotes.discipleOfTheElements', '+', null
    );

/* TODO
      rules.defineRule('magicMonk',
        'monkFeatures.Way Of The Shadow Tradition', '=', null,
        'monkFeatures.Way Of The Four Elements Tradition', '=', null
      );
      rules.defineRule('casterLevels.Mo',
        'magicMonk', '?', null,
        'levels.Monk', '=', null,
        'magicNotes.casterLevelBonus', '+', null
      );
      rules.defineRule('spellDifficultyClass.Mo',
        'casterLevels.Mo', '?', null,
        'kiSaveDC', '=', null
      );
*/

  } else if(name == 'Oath Of The Ancients') {

    rules.defineRule('saveNotes.auraOfWarding',
      'levels.Paladin', '=', 'source < 18 ? 10 : 30'
    );

  } else if(name == 'Assassin Archetype') {

    rules.defineRule('combatNotes.deathStrike',
      'dexterityModifier', '=', '8 + source',
      'proficiencyBonus', '+', null
    );

  } else if(name == 'Arcane Trickster Archetype') {

    rules.defineRule('magicNotes.spellThief',
      'intelligenceModifier', '=', '8 + source',
      'proficiencyBonus', '+', null
    );

/* TODO
      spellAbility = 'intelligence';
      spellsKnown = [
        'W0:3:3/10:4',
        'W:3:3/4:4/7:5/8:6/10:7/11:8/13:9/14:10/16:11/19:12/20:13',
      ];
      spellSlots = [
        'W1:3:2/4:3/7:4',
        'W2:7:2/10:3',
        'W3:13:2/16:3',
        'W4:19:1'
      ];
      rules.defineRule('casterLevels.Ro',
        'rogueFeatures.Arcane Trickster Archetype', '?', null,
        'levels.Rogue', '=', null,
         'magicNotes.casterLevelBonus', '+', null
      );
      rules.defineRule('casterLevels.W', 'casterLevels.Ro', '^=', null);
      rules.defineRule('casterLevelArcane', 'casterLevels.W', '+=', null);
      rules.defineRule('spellsKnownLevel.Rogue',
        'rogueFeatures.Arcane Trickster Archetype', '?', null
      );
      rules.defineRule('spellAttackModifier.Rogue',
        'rogueFeatures.Arcane Trickster Archetype', '?', null
      );
*/

  } else if(name == 'Abjuration Tradition') {

    rules.defineRule('magicNotes.arcaneWard',
      'levels.Wizard', '=', 'source * 2',
      'intelligenceModifier', '+', null
    );

  } else if(name == 'Divination Tradition') {

    rules.defineRule
      ('magicNotes.portent', 'levels.Wizard', '=', 'source < 14 ? 2 : 3');

  } else if(name == 'Enchantment Tradition') {

    rules.defineRule('magicNotes.alterMemories',
      'charismaModifier', '=', 'Math.max(source + 1, 1)'
    );

  } else if(name == 'Necromancy Tradition') {

    rules.defineRule('magicNotes.undeadThralls', 'levels.Wizard', '=', null);
    rules.defineRule
      ('magicNotes.undeadThralls.1', 'proficiencyBonus', '=', null);

  }

};

/*
 * Defines in #rules# the rules associated with feat #name# that are not
 * directly derived from the parmeters passed to featRules.
 */
PHB5E.featRulesExtra = function(rules, name) {

  if(name == 'Athlete') {
    rules.defineRule('abilityBoostCount', 'abilityNotes.athlete', '+=', '1');
  } else if(name == 'Defensive Duelist') {
    rules.defineRule
      ('combatNotes.defensiveDuelist', 'proficiencyBonus', '=', null);
  } else if(name == 'Durable') {
    rules.defineRule('featureNotes.durable',
      'constitutionModifier', '=', 'Math.max(source * 2, 2)'
    );
  } else if(name == 'Inspiring Leader') {
    rules.defineRule('featureNotes.inspiringLeader',
      'level', '=', null,
      'charismaModifier', '+', null
    );
  } else if(name == 'Lightly Armored') {
    rules.defineRule
      ('abilityBoostCount', 'abilityNotes.lightlyArmored', '+=', '1');
  } else if(name == 'Linguist') {
    rules.defineRule('featureNotes.linguist',
      'intelligence', '=', null,
      'proficiencyBonus', '+', null
    );
  } else if(name == 'Martial Adept') {
    rules.defineRule('maxDexOrStrMod',
      'dexterityModifier', '=', null,
      'strengthModifier', '^', null
    );
    rules.defineRule('combatNotes.martialAdept',
      'maxDexOrStrMod', '=', '8 + source',
      'proficiencyBonus', '+', null
    );
    rules.defineRule
      ('selectableFeatureCount.Fighter', 'combatNotes.martialAdept', '+=', '2');
    for(var feature in {
      "Commander's Strike":'', 'Disarming Attack':'', 'Distracting Strike':'',
      'Evasive Footwork':'', 'Feinting Attack':'', 'Goading Attack':'',
      'Lunging Attack':'', 'Maneuvering Attack':'', 'Menacing Attack':'',
      'Parry':'', 'Precision Attack':'', 'Pushing Attack':'', 'Rally':'',
      'Riposte':'', 'Sweeping Attack':'', 'Trip Attack':''
    }) {
      rules.defineRule(
        'validationNotes.fighter' + feature.replace(/ /g, '') + 'SelectableFeatureFeatures',
        'features.Martial Adept', '^', '0'
      );
      rules.defineRule(
        'validationNotes.fighter' + feature.replace(/ /g, '') + 'SelectableFeatureLevels',
        'features.Martial Adept', '^', '0'
      );
    }
  } else if(name == 'Medium Armor Master') {
    rules.defineRule('combatNotes.mediumArmorMaster',
      'dexterity', '?', 'source >= 16',
      'armor', '?', 'SRD5E.ARMORS.findIndex(x => x.match(new RegExp(source + ":.*Me"))) >= 0 ? 1 : null'
    );
  } else if(name == 'Moderately Armored') {
    rules.defineRule
      ('abilityBoostCount', 'abilityNotes.moderatelyArmored', '+=', '1');
  } else if(name == 'Observant') {
    rules.defineRule('abilityBoostCount', 'abilityNotes.observant', '+=', '1');
  } else if(name == 'Resilient') {
    rules.defineRule('abilityBoostCount', 'abilityNotes.resilient', '+=', '1');
  } else if(name == 'Skilled') {
    // TODO ... or tools
    rules.defineRule('skillChoiceCount', 'skillNotes.skilled', '+=', '3');
  } else if(name == 'Tavern Brawler') {
    rules.defineRule
      ('abilityBoostCount', 'abilityNotes.tavernBrawler', '+=', '1');
    rules.defineRule
      ('weapons.Unarmed.2', 'combatNotes.tavernBrawler', '=', '"1d4"');
  } else if(name == 'Tough') {
    rules.defineRule('combatNotes.tough', 'level', '=', '2 * source');
  } else if(name == 'Weapon Master') {
    rules.defineRule
      ('abilityBoostCount', 'abilityNotes.weaponMaster', '+=', '1');
    rules.defineRule
      ('weaponChoiceCount', 'combatNotes.weaponMaster', '+=', '4');
    // TODO How can user specify the choice of prof weapons?
  }

};

/*
 * Defines in #rules# the rules associated with race #name# that are not
 * directly derived from the parmeters passed to raceRules.
 */
PHB5E.raceRulesExtra = function(rules, name) {

  if(name == 'Dark Elf') {
    /* TODO
    rules.defineRule('casterLevels.S', 'drowMagicLevel', '^=', null);
    rules.defineRule('drowMagicLevel',
      'darkElfFeatures.Drow Magic', '?', null,
      'level', '=', null
    );
    rules.defineRule('magicNotes.drowMagic', 'level', '=', 'source >= 3 ? ", cast <i>Faerie Fire</i>" + (source >= 5 ? ", <i>Darkness</i>" : "") + " 1/long rest" : ""');
    */
  } else if(race == 'Forest Gnome') {
    /* TODO
      rules.defineRule
        ('casterLevels.W', 'casterLevels.Forest Gnome', '^=', null);
      rules.defineRule('casterLevels.Forest Gnome',
        'forestGnomeFeatures.Natural Illusionist', '?', null,
        'level', '=', null
      );
      rules.defineRule
        ('spellsKnown.W0', 'magicNotes.naturalIllusionis', '+=', '1');
    */
  }

};
