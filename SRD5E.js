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

"use strict";

var SRD5E_VERSION = '1.7.0.1alpha';

/*
 * This module loads the rules from Fifth Edition.  The SRD5E function
 * contains methods that load rules for particular parts of the rules;
 * raceRules for character races, magicRules for spells, etc.  These member
 * methods can be called independently in order to use a subset of the Fifth
 * Edition rules.  Similarly, the constant fields of SRD5E (ALIGNMENTS,
 * FEATS, etc.) can be manipulated to modify the choices.
 */
function SRD5E() {
  var rules = new QuilvynRules('5E', SRD5E_VERSION);
  rules.editorElements = SRD5E.initialEditorElements();
  rules.randomizeOneAttribute = SRD5E.randomizeOneAttribute;
  rules.makeValid = SRD5E.makeValid;
  rules.ruleNotes = SRD5E.ruleNotes;
  SRD5E.viewer = new ObjectViewer();
  SRD5E.createViewers(rules, SRD5E.VIEWERS);
  SRD5E.abilityRules(rules);
  SRD5E.raceRules(rules, SRD5E.LANGUAGES, SRD5E.RACES);
  SRD5E.classRules(rules, SRD5E.CLASSES);
  SRD5E.backgroundRules(rules, SRD5E.BACKGROUNDS);
  SRD5E.skillRules(rules, SRD5E.SKILLS, SRD5E.TOOLS);
  SRD5E.featRules(rules, SRD5E.FEATS);
  SRD5E.descriptionRules(rules, SRD5E.ALIGNMENTS, SRD5E.DEITIES, SRD5E.GENDERS);
  SRD5E.equipmentRules(rules, SRD5E.ARMORS, SRD5E.SHIELDS, SRD5E.WEAPONS);
  SRD5E.combatRules(rules);
  SRD5E.movementRules(rules);
  SRD5E.magicRules(rules, SRD5E.CLASSES, SRD5E.SCHOOLS);
  SRD5E.spellRules(rules);
  rules.defineChoice('preset', 'background', 'race', 'level', 'levels');
  rules.defineChoice('random', SRD5E.RANDOMIZABLE_ATTRIBUTES);
  Quilvyn.addRuleSet(rules);
  SRD5E.rules = rules;
}

SRD5E.ALIGNMENTS = [
  'Chaotic Evil', 'Chaotic Good', 'Chaotic Neutral', 'Neutral', 'Neutral Evil',
  'Neutral Good', 'Lawful Evil', 'Lawful Good', 'Lawful Neutral'
];
SRD5E.ARMORS = [
  'None:', 'Padded:Li', 'Leather:Li', 'Studded Leather:Li', 'Hide:Me',
  'Chain Shirt:Li', 'Scale Mail:Me', 'Breastplate:Me', 'Half Plate:Me',
  'Ring Mail:He', 'Chain Mail:He', 'Splint:He', 'Plate:He'
];
SRD5E.BACKGROUNDS = ['Acolyte'];
// PHB
SRD5E.BACKGROUNDS.push(
  'Charlatan', 'Criminal', 'Entertainer', 'Folk Hero', 'Guild Artisan',
  'Hermit', 'Noble', 'Outlander', 'Sage', 'Sailor', 'Soldier', 'Urchin'
);
// ENDPHB
SRD5E.CLASSES = [
  'Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk', 'Paladin',
  'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard'
];
SRD5E.DEITIES = [
  'None:',
  // Celtic
  'Celtic-The Daghdha (CG):Nature/Trickery', 'Celtic-Arawn (NE):Life/Death',
  'Celtic-Belenus (NG):Light', 'Celtic-Briantia (NG):Life',
  'Celtic-Diancecht (LG):Life', 'Celtic-Dunatis (N):Nature',
  'Celtic-Goibhniu (NG):Knowledge/Life', 'Celtic-Lugh (CN):Knowledge/Life',
  'Celtic-Manannan Mac Lir (LN):Nature/Tempest',
  'Celtic-Math Mathonwy (NE):Knowledge', 'Celtic-Morrigan (CE):War',
  'Celtic-Nuada (N):War', 'Celtic-Oghma (NG):Knowledge',
  'Celtic-Silvanus (N):Nature',
  // Greek
  'Greek-Zeus (N):Tempest', 'Greek-Aphrodite (CG):Light',
  'Greek-Apollo (CG):Knowledge/Life/Light', 'Greek-Ares (CE):War',
  'Greek-Artemis (NG):Life/Nature', 'Greek-Athena (LG):Knowledge/War',
  'Greek-Demeter (NG):Life', 'Greek-Dionysus (CN):Life',
  'Greek-Hades (LE):Death', 'Greek-Hecate (CE):Knowledge/Trickery',
  'Greek-Hephaestus (NG):Knowledge', 'Greek-Hera (CN):Trickery',
  'Greek-Hercules (CG):Tempest/War', 'Greek-Hermes (CG):Trickery',
  'Greek-Hestia (NG):Life', 'Greek-Nike (LN):War', 'Greek-Pan (CN):Nature',
  'Greek-Poseidon (CN):Tempest', 'Greek-Tyche (N):Trickery',
  // Egyptian
  'Egyptian-Re-Horakhty (LG):Life/Light', 'Egyptian-Anubis (LN):Death',
  'Egyptian-Apep (NE):Trickery', 'Egyptian-Bast (CG):War',
  'Egyptian-Bes (CN):Trickery', 'Egyptian-Hathor (NG):Life/Light',
  'Egyptian-Imhotep (NG):Knowledge', 'Egyptian-Isis (NG):Knowledge/Life',
  'Egyptian-Nephthys (CG):Death', 'Egyptian-Osiris (LG):Life/Nature',
  'Egyptian-Ptah (LN):Knowledge', 'Egyptian-Set (CE):Death/Tempest/Trickery',
  'Egyptian-Sobek (LE):Nature/Tempest', 'Egyptian-Thoth (N):Knowledge',
  // Norse
  'Norse-Odin (NG):Knowledge/War', 'Norse-Aegir (NE):Tempest',
  'Norse-Balder (NG):Life/Light', 'Norse-Forseti (N):Light',
  'Norse-Frey (NG):Life/Light', 'Norse-Freya (NG):Life',
  'Norse-Frigga (N):Life/Light', 'Norse-Heimdall (LG):Light/War',
  'Norse-Hel (NE):Death', 'Norse-Hermod (CN):Trickery',
  'Norse-Loki (CE):Trickery', 'Norse-Njord (NG):Nature/Tempest',
  'Norse-Odor (CG):Light', 'Norse-Sif (CG):War', 'Norse-Skadi (N):Nature',
  'Norse-Surtur (LE):War', 'Norse-Thor (CG):Tempest/War',
  'Norse-Thrym (CE):War', 'Norse-Tyr (LN):Knowledge/War',
  'Norse-Uller (CNG):Nature'
];
// PHB
SRD5E.DEITIES.push(
  // Forgotten Realms
  'FR-Auril (NE):Nature/Tempest', 'FR-Azuth (LN):Knowledge', 'FR-Bane (LE):War',
  'FR-Beshaba (CE):Trickery', 'FR-Bhaal:Death (NE)', 'FR-Chauntea (NG):Life',
  'FR-Cyric (CE):Trickery', 'FR-Deneir (NG):Knowledge',
  'FR-Eldath (NG):Life/Nature', 'FR-Gond (N):Knowledge',
  'FR-Helm (LN):Life/Light', 'FR-Ilmater (LG):Life', 'FR-Kelemvor (LN):Death',
  'FR-Lathander (NG):Life/Light', 'FR-Leira (CN):Trickery',
  'FR-Lliira (CG):Life', 'FR-Loviatar (LE):Death', 'FR-Malar (CE):Nature',
  'FR-Mask (CN):Trickery', 'FR-Mielikki (NG):Nature', 'FR-Milil (NG):Light',
  'FR-Myrkul (NE):Death', 'FR-Mystra (NG):Knowledge', 'FR-Oghma (N):Knowledge',
  'FR-Savras (LN):Knowledge', 'FR-Selune (CG):Knowledge/Life',
  'FR-Shar (NE):Death/Trickery', 'FR-Silvanus (N):Nature',
  'FR-Sune (CG):Life/Light', 'FR-Talona (CE):Death', 'FR-Talos (CE):Tempest',
  'FR-Tempus (N):War', 'FR-Torm (LG):War', 'FR-Tymora (CG):Trickery',
  'FR-Tyr (LG):War', 'FR-Umberlee (CE):Tempest',
  'FR-Waukeen (N):Knowledge/Trickery',
  // Greyhawk
  'Greyhawk-Beory (N):Nature', 'Greyhawk-Boccob (N):Knowledge',
  'Greyhawk-Celestian (N):Knowledge', 'Greyhawk-Ehlonna (NG):Life/Nature',
  'Greyhawk-Erythnul (CE):War', 'Greyhawk-Fharlanghn (NG):Knowledge/Trickery',
  'Greyhawk-Heironeous (LG):War', 'Greyhawk-Hextor (LE) War',
  'Greyhawk-Kord (CG):Tempest/War', 'Greyhawk-Incabulous (NE):Death',
  'Greyhawk-Istus (N):Knowledge', 'Greyhawk-Iuz (CE):Death',
  'Greyhawk-Nerull (NE):Death', 'Greyhawk-Obad-Hai (N):Nature',
  'Greyhawk-Olidammara (CN):Trickery', 'Greyhawk-Pelor (NG):Life/Light',
  'Greyhawk-Pholtus (LG):Light', 'Greyhawk-Ralishaz (CN):Trickery',
  'Greyhawk-Rao (LG):Knowledge', 'Greyhawk-St. Cuthbert (LN):Knowledge',
  'Greyhawk-Tharizdun (CE):Trickery', 'Greyhawk-Trithereon (CG):War',
  'Greyhawk-Ulaa (LG):Life/War', 'Greyhawk-Vecna (NE):Knowledge',
  'Greyhawk-Wee Jas (LN):Death/Knowledge',
  // Nonhuman
  'NH-Bahamut (LG Dragon):Life/War', 'NH-Blibdoolpoolp (NE Kuo-Toa):Death',
  'NH-Corellon Larethian (CG Elf):Light',
  'NH-Deep Sashelas (CG Elf):Nature/Tempest',
  'NH-Eadro (N Merfolk):Nature/Tempest',
  'NH-Garl Glittergold (LG Gnome):Trickery',
  'NH-Grolantor (CE Hill Giant):War', 'NH-Gruumsh (CE Orc):Tempest/War',
  'NH-Hruggek (CE Bugbear):War', 'NH-Kurtulmak (LE Kobold):War',
  'NH-Laogzed (CE Trogolodyte):Death', 'NH-Lolth (CE Drow):Trickery',
  'NH-Maglubiyet (LE Goblinoid):War', 'NH-Moradin (LG Dwarf):Knowledge',
  'NH-Rillifane Rallathil (CG Elf):Nature',
  'NH-Sehanine Moonbow (CG Elf):Knowledge',
  'NH-Sekolah (LE Sahuagin):Nature/Tempest', 'NH-Semuanya (N Lizardfolk):Life',
  'NH-Skerrit (N Centaur):Knowledge',
  'NH-Skoraeus Stonebones (N Stone Giant):Knowledge',
  'NH-Surtur (LE Fire Giant):Knowledge/War', 'NH-Thryn (CE Frost Giant):War',
  'NH-Tiamat (LE Dragon):Trickery', 'NH-Yondalla (LG Halfling):Life'
);
// ENDPHB
SRD5E.FEATS = [
  'Ability Boost', 'Ability Boost2', 'Ability Boost3', 'Ability Boost4',
  'Ability Boost5', 'Ability Boost6', 'Ability Boost7', 'Grappler'
];
// PHB
SRD5E.FEATS.push(
  'Alert', 'Athleete', 'Actor', 'Charger', 'Crossbow Expert',
  'Defensive Duelist', 'Dual Wielder', 'Dungeon Delver', 'Durable',
  'Elemental Adept (Acid)', 'Elemental Adept (Cold)', 'Elemental Adept (Fire)',
  'Elemental Adept (Lightning)', 'Elemental Adept (Thunder)',
  'Great Weapon Master', 'Healer', 'Heavily Armored', 'Heavy Armor Master',
  'Inspiring Leader', 'Keen Mind', 'Lightly Armored', 'Linguist', 'Lucky',
  'Mage Slayer', 'Magic Initiate', 'Martial Adept', 'Medium Armor Master',
  'Mobile', 'Moderately Armored', 'Mounted Combatant', 'Observant',
  'Polearm Master', 'Resilient', 'Ritual Caster', 'Savage Attacker',
  'Sentinel', 'Sharpshooter', 'Shield Master', 'Skilled', 'Skulker',
  'Spell Sniper', 'Tavern Brawler', 'Tough', 'War Caster', 'Weapon Master'
);
// ENDPHB
SRD5E.GENDERS = ['Female', 'Male'];
SRD5E.LANGUAGES = [
  'Abyssal', 'Celestial', 'Common', 'Deep Speech', 'Draconic', 'Dwarvish',
  'Elvish', 'Giant', 'Gnomish', 'Goblin', 'Halfling', 'Infernal', 'Orc',
  'Primordial', 'Sylvan', 'Undercommon'
];
SRD5E.RACES = [
  'Black Dragonborn', 'Blue Dragonborn', 'Brass Dragonborn',
  'Bronze Dragonborn', 'Copper Dragonborn', 'Gold Dragonborn',
  'Green Dragonborn', 'Red Dragonborn', 'Silver Dragonborn',
  'White Dragonborn', 'Hill Dwarf', 'Mountain Dwarf', 'High Elf', 'Wood Elf',
  'Dark Elf', 'Forest Gnome', 'Rock Gnome', 'Half-Elf', 'Half-Orc',
  'Lightfoot Halfling', 'Stout Halfling', 'Human', 'Tiefling'
];
// Note: the order here handles dependencies among attributes when generating
// random characters
SRD5E.RANDOMIZABLE_ATTRIBUTES = [
  'charisma', 'constitution', 'dexterity', 'intelligence', 'strength', 'wisdom',
  'name', 'race', 'gender', 'alignment', 'background', 'deity', 'levels',
  'features', 'feats', 'skills', 'languages', 'hitPoints', 'armor', 'shield',
  'weapons', 'spells', 'tools'
];
SRD5E.SCHOOLS = [
  'Abjuration:Abju', 'Conjuration:Conj', 'Divination:Divi', 'Enchantment:Ench',
  'Evocation:Evoc', 'Illusion:Illu', 'Necromancy:Necr', 'Transmutation:Tran'
];
SRD5E.SPELLS = {

  'Acid Arrow':'Evocation',
  'Acid Splash':'Conjuration',
  'Aid':'Abjuration',
  'Alarm':'Abjuration',
  'Alter Self':'Transmutation',
  'Animal Friendship':'Enchantment',
  'Animal Messenger':'Enchantment',
  'Animal Shapes':'Transmutation',
  'Animate Dead':'Necromancy',
  'Animate Objects':'Transmutation',
  'Antilife Shell':'Abjuration',
  'Antimagic Field':'Abjuration',
  'Antipathy/Sympathy':'Enchantment',
  'Arcane Eye':'Divination',
  'Arcane Gate':'Conjuration',
  'Arcane Hand':'Evocation',
  'Arcane Lock':'Abjuration',
  "Arcanist's Magic Aura":'Illusion',
  'Armor Of Agathys':'Abjuration',
  'Arms Of Hadar':'Conjuration',
  'Astral Projection':'Necromancy',
  'Augury':'Divination',
  'Aura Of Life':'Abjuration',
  'Aura Of Purity':'Abjuration',
  'Aura Of Vitality':'Evocation',
  'Awaken':'Transmutation',

  'Bane':'Enchantment',
  'Banishing Smite':'Abjuration',
  'Banishment':'Abjuration',
  'Barkskin':'Transmutation',
  'Beacon Of Hope':'Abjuration',
  'Beast Sense':'Divination',
  'Bestow Curse':'Necromancy',
  "Black Tentacles":'Conjuration',
  'Blade Barrier':'Evocation',
  'Blade Ward':'Abjuration',
  'Bless':'Enchantment',
  'Blight':'Necromancy',
  'Blinding Smite':'Evocation',
  'Blindness/Deafness':'Necromancy',
  'Blink':'Transmutation',
  'Blur':'Illusion',
  'Branding Smite':'Evocation',
  'Burning Hands':'Evocation',

  'Call Lightning':'Evocation',
  'Calm Emotions':'Enchantment',
  'Chain Lightning':'Evocation',
  'Charm Person':'Enchantment',
  'Chill Touch':'Necromancy',
  'Chromatic Orb':'Evocation',
  'Circle Of Death':'Necromancy',
  'Circle Of Power':'Abjuration',
  'Clairvoyance':'Divination',
  'Clone':'Necromancy',
  'Cloud Of Daggers':'Conjuration',
  'Cloudkill':'Conjuration',
  'Color Spray':'Illusion',
  'Command':'Enchantment',
  'Commune':'Divination',
  'Commune With Nature':'Divination',
  'Compelled Duel':'Enchantment',
  'Comprehend Languages':'Divination',
  'Compulsion':'Enchantment',
  'Cone Of Cold':'Evocation',
  'Confusion':'Enchantment',
  'Conjure Animals':'Conjuration',
  'Conjure Barrage':'Conjuration',
  'Conjure Celestial':'Conjuration',
  'Conjure Elemental':'Conjuration',
  'Conjure Fey':'Conjuration',
  'Conjure Minor Elementals':'Conjuration',
  'Conjure Volley':'Conjuration',
  'Conjure Woodland Beings':'Conjuration',
  'Contact Other Plane':'Divination',
  'Contagion':'Necromancy',
  'Contingency':'Evocation',
  'Continual Flame':'Evocation',
  'Control Water':'Transmutation',
  'Control Weather':'Transmutation',
  'Cordon Of Arrows':'Transmutation',
  'Counterspell':'Abjuration',
  'Create Food And Water':'Conjuration',
  'Create Or Destroy Water':'Transmutation',
  'Create Undead':'Necromancy',
  'Creation':'Illusion',
  'Crown Of Madness':'Enchantment',
  "Crusader's Mantle":'Evocation',
  'Cure Wounds':'Evocation',

  'Dancing Lights':'Evocation',
  'Darkness':'Evocation',
  'Darkvision':'Transmutation',
  'Daylight':'Evocation',
  'Death Ward':'Abjuration',
  'Delayed Blast Fireball':'Evocation',
  'Demiplane':'Conjuration',
  'Destructive Wave':'Evocation',
  'Detect Evil And Good':'Divination',
  'Detect Magic':'Divination',
  'Detect Poison And Disease':'Divination',
  'Detect Thoughts':'Divination',
  'Dimension Door':'Conjuration',
  'Disguise Self':'Illusion',
  'Disintegrate':'Transmutation',
  'Dispel Evil And Good':'Abjuration',
  'Dispel Magic':'Abjuration',
  'Dissonant Whispers':'Enchantment',
  'Divination':'Divination',
  'Divine Favor':'Evocation',
  'Divine Word':'Evocation',
  'Dominate Beast':'Enchantment',
  'Dominate Monster':'Enchantment',
  'Dominate Person':'Enchantment',
  'Dream':'Illusion',
  'Druidcraft':'Transmutation',

  'Earthquake':'Evocation',
  'Eldritch Blast':'Evocation',
  'Elemental Weapon':'Transmutation',
  'Enhance Ability':'Transmutation',
  'Enlarge/Reduce':'Transmutation',
  'Ensnaring Strike':'Conjuration',
  'Entangle':'Conjuration',
  'Enthrall':'Enchantment',
  'Etherealness':'Transmutation',
  'Expeditious Retreat':'Transmutation',
  'Eyebite':'Necromancy',

  'Fabricate':'Transmutation',
  'Faerie Fire':'Evocation',
  'Faithful Hound':'Conjuration',
  'False Life':'Necromancy',
  'Fear':'Illusion',
  'Feather Fall':'Transmutation',
  'Feeblemind':'Enchantment',
  'Feign Death':'Necromancy',
  'Find Familiar':'Conjuration',
  'Find Steed':'Conjuration',
  'Find The Path':'Divination',
  'Find Traps':'Divination',
  'Finger Of Death':'Necromancy',
  'Fire Bolt':'Evocation',
  'Fire Shield':'Evocation',
  'Fire Storm':'Evocation',
  'Fireball':'Evocation',
  'Flame Blade':'Evocation',
  'Flame Strike':'Evocation',
  'Flaming Sphere':'Conjuration',
  'Flesh To Stone':'Transmutation',
  'Floating Disk':'Conjuration',
  'Fly':'Transmutation',
  'Fog Cloud':'Conjuration',
  'Forbiddance':'Abjuration',
  'Forcecage':'Evocation',
  'Foresight':'Divination',
  'Freedom Of Movement':'Abjuration',
  'Freezing Sphere':'Evocation',
  'Friends':'Enchantment',

  'Gaseous Form':'Transmutation',
  'Gate':'Conjuration',
  'Geas':'Enchantment',
  'Gentle Repose':'Necromancy',
  'Giant Insect':'Transmutation',
  'Glibness':'Transmutation',
  'Globe Of Invulnerability':'Abjuration',
  'Glyph Of Warding':'Abjuration',
  'Goodberry':'Transmutation',
  'Grasping Vine':'Conjuration',
  'Grease':'Conjuration',
  'Greater Invisibility':'Illusion',
  'Greater Restoration':'Abjuration',
  'Guardian Of Faith':'Conjuration',
  'Guards And Wards':'Abjuration',
  'Guidance':'Divination',
  'Guiding Bolt':'Evocation',
  'Gust Of Wind':'Evocation',

  'Hail Of Thorns':'Conjuration',
  'Hallow':'Evocation',
  'Hallucinatory Terrain':'Illusion',
  'Harm':'Necromancy',
  'Haste':'Transmutation',
  'Heal':'Evocation',
  'Healing Word':'Evocation',
  'Heat Metal':'Transmutation',
  'Hellish Rebuke':'Evocation',
  "Heroes' Feast":'Conjuration',
  'Heroism':'Enchantment',
  'Hex':'Enchantment',
  'Hideous Laughter':'Enchantment',
  'Hold Monster':'Enchantment',
  'Hold Person':'Enchantment',
  'Holy Aura':'Abjuration',
  'Hunger Of Hadar':'Conjuration',
  "Hunter's Mark":'Divination',
  'Hypnotic Pattern':'Illusion',

  'Ice Storm':'Evocation',
  'Identify':'Divination',
  'Imprisonment':'Abjuration',
  'Incendiary Cloud':'Conjuration',
  'Inflict Wounds':'Necromancy',
  'Insect Plague':'Conjuration',
  'Instant Summons':'Conjuration',
  'Irresistable Dance':'Enchantment',
  'Invisibility':'Illusion',

  'Jump':'Transmutation',

  'Knock':'Transmutation',

  'Legend Lore':'Divination',
  'Lesser Restoration':'Abjuration',
  'Levitate':'Transmutation',
  'Light':'Evocation',
  'Lightning Arrow':'Transmutation',
  'Lightning Bolt':'Evocation',
  'Locate Animal Or Plant':'Divination',
  'Locate Creature':'Divination',
  'Locate Object':'Divination',
  'Longstrider':'Transmutation',

  'Mage Armor':'Conjuration',
  'Mage Hand':'Conjuration',
  "Mage's Sword":'Evocation',
  'Magic Circle':'Abjuration',
  'Magic Jar':'Necromancy',
  'Magic Missile':'Evocation',
  'Magic Mouth':'Illusion',
  'Magic Weapon':'Transmutation',
  'Magnificent Mansion':'Conjuration',
  'Major Image':'Illusion',
  'Mass Cure Wounds':'Conjuration',
  'Mass Heal':'Conjuration',
  'Mass Healing Word':'Evocation',
  'Mass Suggestion':'Enchantment',
  'Maze':'Conjuration',
  'Meld Into Stone':'Transmutation',
  'Mending':'Transmutation',
  'Message':'Transmutation',
  'Meteor Swarm':'Evocation',
  'Mind Blank':'Abjuration',
  'Minor Illusion':'Illusion',
  'Mirage Arcane':'Illusion',
  'Mirror Image':'Illusion',
  'Mislead':'Illusion',
  'Misty Step':'Conjuration',
  'Modify Memory':'Enchantment',
  'Moonbeam':'Evocation',
  'Move Earth':'Transmutation',

  'Nondetection':'Abjuration',

  'Pass Without Trace':'Abjuration',
  'Passwall':'Transmutation',
  'Phantasmal Force':'Illusion',
  'Phantasmal Killer':'Illusion',
  'Phantom Steed':'Illusion',
  'Planar Ally':'Conjuration',
  'Planar Binding':'Abjuration',
  'Plane Shift':'Conjuration',
  'Plant Growth':'Transmutation',
  'Poison Spray':'Conjuration',
  'Polymorph':'Transmutation',
  'Power Word Heal':'Evocation',
  'Power Word Kill':'Enchantment',
  'Power Word Stun':'Enchantment',
  'Prayer Of Healing':'Evocation',
  'Prestidigitation':'Transmutation',
  'Prismatic Spray':'Evocation',
  'Prismatic Wall':'Abjuration',
  "Private Sanctum":'Abjuration',
  'Produce Flame':'Conjuration',
  'Programmed Illusion':'Illusion',
  'Project Image':'Illusion',
  'Protection From Energy':'Abjuration',
  'Protection From Evil And Good':'Abjuration',
  'Protection From Poison':'Abjuration',
  'Purify Food And Drink':'Transmutation',

  'Raise Dead':'Necromancy',
  'Ray Of Enfeeblement':'Necromancy',
  'Ray Of Frost':'Evocation',
  'Ray Of Sickness':'Necromancy',
  'Regenerate':'Transmutation',
  'Reincarnate':'Transmutation',
  'Remove Curse':'Abjuration',
  'Resilient Sphere':'Evocation',
  'Resistance':'Abjuration',
  'Resurrection':'Necromancy',
  'Reverse Gravity':'Transmutation',
  'Revivify':'Conjuration',
  'Rope Trick':'Transmutation',

  'Sacred Flame':'Evocation',
  'Sanctuary':'Abjuration',
  'Scorching Ray':'Evocation',
  'Scrying':'Divination',
  'Searing Smite':'Evocation',
  'Secret Chest':'Conjuraion',
  'See Invisibility':'Divination',
  'Seeming':'Illusion',
  'Sending':'Evocation',
  'Sequester':'Transmutation',
  'Shapechange':'Transmutation',
  'Shatter':'Evocation',
  'Shield':'Abjuration',
  'Shield Of Faith':'Abjuration',
  'Shillelagh':'Transmutation',
  'Shocking Grasp':'Evocation',
  'Silence':'Illusion',
  'Silent Image':'Illusion',
  'Simulacrum':'Illusion',
  'Sleep':'Enchantment',
  'Sleet Storm':'Conjuration',
  'Slow':'Transmutation',
  'Spare The Dying':'Necromancy',
  'Speak With Animals':'Divination',
  'Speak With Dead':'Necromancy',
  'Speak With Plants':'Transmutation',
  'Spider Climb':'Transmutation',
  'Spike Growth':'Transmutation',
  'Spirit Guardians':'Conjuration',
  'Spiritual Weapon':'Evocation',
  'Staggering Smite':'Evocation',
  'Stinking Cloud':'Conjuration',
  'Stone Shape':'Transmutation',
  'Stoneskin':'Abjuration',
  'Storm Of Vengeance':'Conjuration',
  'Suggestion':'Enchantment',
  'Sunbeam':'Evocation',
  'Sunburst':'Evocation',
  'Swift Quiver':'Transmutation',
  'Symbol':'Abjuration',

  'Telekinesis':'Transmutation',
  'Telepathic Bond':'Divination',
  'Telepathy':'Evocation',
  'Teleport':'Conjuration',
  'Teleportation Circle':'Conjuration',
  'Thaumaturgy':'Transmutation',
  'Thorn Whip':'Transmutation',
  'Thunderous Smite':'Evocation',
  'Thunderwave':'Evocation',
  'Time Stop':'Transmutation',
  'Tiny Hut':'Evocation',
  'Tongues':'Divination',
  'Transport Via Plants':'Conjuration',
  'Tree Stride':'Conjuration',
  'True Polymorph':'Transmutation',
  'True Resurrection':'Necromancy',
  'True Seeing':'Divination',
  'True Strike':'Divination',
  'Tsunami':'Conjuration',

  'Unseen Servant':'Conjuration',

  'Vampiric Touch':'Necromancy',
  'Vicious Mockery':'Enchantment',

  'Wall Of Fire':'Evocation',
  'Wall Of Force':'Evocation',
  'Wall Of Ice':'Evocation',
  'Wall Of Stone':'Evocation',
  'Wall Of Thorns':'Conjuration',
  'Warding Bond':'Abjuration',
  'Water Breathing':'Transmutation',
  'Water Walk':'Transmutation',
  'Web':'Conjuration',
  'Weird':'Illusion',
  'Wind Walk':'Transmutation',
  'Wind Wall':'Evocation',
  'Wish':'Conjuration',
  'Witch Bolt':'Evocation',
  'Word Of Recall':'Conjuration',
  'Wrathful Smite':'Evocation',

  'Zone Of Truth':'Enchantment'

};
SRD5E.TOOLS = [
  "Alchemist's Supplies:Artisan", "Brewer's Supplies:Artisan",
  "Calligrapher's Supplies:Artisan", "Carpenter's Tools:Artisan",
  "Cobbler's Tools:Artisan", "Cook's Utensils:Artisan",
  "Glassblower's Tools:Artisan", "Jeweler's Tools:Artisan",
  "Leatherworker's Tools:Artisan", "Mason's Tools:Artisan",
  "Painter's Supplies:Artisan", "Potter's Tools:Artisan",
  "Smith's Tools:Artisan", "Tinker's Tools:Artisan",
  "Weaver's Tools:Artisan", "Woodcarver's Tools:Artisan",
  "Disguise Kit:", "Forgery Kit:",
  "Dice Set:Game", "Dragonchess Set:Game", "Playing Card Set:Game",
  "Three-Dragon Ante Set:Game",
  "Herbalism Kit:",
  "Bagpipes:Music", "Drum:Music", "Dulcimer:Music", "Flute:Music",
  "Lute:Music", "Lyre:Music", "Horn:Music", "Pan Flute:Music", "Shawm:Music",
  "Viol:Music",
  "Navigator's Tools:", "Poisoner's Kit:", "Theives' Tools:",
  "Vehicle (Land):", "Vehicle (Water):"
];
SRD5E.SHIELDS = [
  'Buckler', 'Heavy Steel', 'Heavy Wooden', 'Light Steel', 'Light Wooden',
  'None'
];
SRD5E.SKILLS = [
  'Acrobatics:dex', 'Animal Handling:wis', 'Arcana:int', 'Athletics:str',
  'Deception:cha', 'History:int', 'Insight:wis', 'Intimidation:cha',
  'Investigation:int', 'Medicine:wis', 'Nature:int', 'Perception:wis',
  'Performance:cha', 'Persuasion:cha', 'Religion:int', 'Sleight Of Hand:dex',
  'Stealth:dex', 'Survival:wis'
];
SRD5E.VIEWERS = ['Compact', 'Standard', 'Vertical'];
SRD5E.WEAPONS = [
  'Battleaxe:d10 Ma Ve', 'Blowgun:d1r25 Ma', 'Club:d4 Si Li',
  'Dagger:d4 Si Li Fi', 'Dart:d4r20 Si Fi', 'Flail:d8 Ma 1h',
  'Glaive:d10 Ma 2h', 'Greataxe:d12 Ma 2h', 'Greatclub:d8 Si 2h',
  'Greatsword:2d6 Ma 2h', 'Halberd:d10 Ma 2h', 'Hand Crossbow:d6r30 Ma',
  'Handaxe:d6r20 Si Li', 'Heavy Crossbow:d10r100 Ma', 'Javelin:d6r30 Si',
  'Lance:d12 Ma 1h', 'Light Crossbow:d8r80 Si', 'Light Hammer:d4r20 Si Li',
  'Longbow:d8r150 Ma', 'Longsword:d10 Ma Ve', 'Mace:d6 Si 1h', 'Maul:2d6 Ma 2h',
  'Morningstar:d8 Ma 1h', 'Net:d0r5 Ma', 'Pike:d10 Ma 2h',
  'Quarterstaff:d6 Si Ve', 'Rapier:d8 Ma 1h Fi', 'Scimitar:d6 Ma Li Fi',
  'Shortbow:d6r80 Si', 'Shortsword:d6 Ma Li Fi', 'Sickle:d4 Si Li',
  'Sling:d4r30 Si', 'Spear:d8r20 Si Ve', 'Trident:d8r20 Ma Ve', 'Unarmed:d1S',
  'War Pick:d8 Ma 1h', 'Warhammer:d8 Ma Ve', 'Whip:d4 Ma 1h Fi'
];

// Related information used internally by SRD5E
SRD5E.armorsArmorClassBonuses = {
  'None': null, 'Padded': 1, 'Leather': 1, 'Studded Leather': 2,
  'Hide': 2, 'Chain Shirt': 3, 'Scale Mail': 4, 'Breastplate': 4,
  'Half Plate': 5, 'Ring Mail': 4, 'Chainmail': 6, 'Splint': 7, 'Plate': 8
};
SRD5E.armorsMaxDexBonuses = {
  'None': null, 'Padded': null, 'Leather': null, 'Studded Leather': null,
  'Hide': 2, 'Chain Shirt': 2, 'Scale Mail': 2, 'Breastplate': 2,
  'Half Plate': 2, 'Ring Mail': 0, 'Chainmail': 0, 'Splint': 0, 'Plate': 0
};
SRD5E.draconicBreathTypes = {
  'Black Dragonborn': 'acid',
  'Blue Dragonborn': 'lightning',
  'Brass Dragonborn': 'fire',
  'Bronze Dragonborn': 'lightning',
  'Copper Dragonborn': 'acid',
  'Gold Dragonborn': 'fire',
  'Green Dragonborn': 'poison',
  'Red Dragonborn': 'fire',
  'Silver Dragonborn': 'cold',
  'White Dragonborn': 'cold'
};
SRD5E.levelsExperience = [
  0, .3, .9, 2.7, 6.5, 14, 23, 34, 48, 64,
  85, 100, 120, 140, 165, 195, 225, 265, 305, 355
];
SRD5E.spellsDescriptions = {
  'Acid Arrow':"R90' Ranged spell attack 4d4 HP (miss half), 2d4 HP next turn",
  "Acid Splash":
    "R60' Ranged touch ${Math.floor((lvl+1)/6) + 1}d6 HP acid (Dex neg)",
  'Aid':"R30' Three targets +5 or more HP for 8 hr",
  'Alarm':"R30' Alert when tiny or larger creature enters 20' cu for 8 hr",
  'Alter Self':
    "Self aquatic, look different, or nat weapons for conc/1 hr",
  'Animal Friendship':
    "R30' Target beast(s) convinced of good intent for 1 dy (Wis neg)",
  'Animal Messenger':
    "R30' Tiny beast target move 24+ hr to deliver 25-word messsage to person described",
  'Animal Shapes':
    "R30' Polymorph all targets in range into max CR 4 max lg creature",
  'Animate Dead':
    "R10' Animate med/small bones/corpse, command w/in 60' for 1 dy",
  'Animate Objects':
    "R120' Animate 10 sm/5 md/2 lg/1 hg objects, command w/in 500' for conc/1 min",
  'Antilife Shell':"Self 10' sphere prevents living passage for conc/1 hr",
  'Antimagic Field':"Self 10' sphere supresses magic for conc/1 hr",
  'Antipathy/Sympathy':
    "R60' Target object repels/attracts specified creatures for 10 dy",
  'Arcane Eye':"R30' See through invisible eye for conc/1 hr",
  'Arcane Gate':"R10'/500' Connect portal pair for conc/10 min",
  'Arcane Hand':
    "R120' AC20, Str 26, Dex 10 hand can punch, push, grasp, block for conc/1 min",
  'Arcane Lock':"Touched barrier passable only by designated until dispelled",
  "Arcanist's Magic Aura":"Target reports false divinations for 1 dy",
  'Armor Of Agathys':"Self frosted, +5 HP, 5 HP cold to successful attcker",
  'Arms Of Hadar':
    "All in 10' radius take 2d6 HP necrotic (Str half), no reactions until next turn",
  'Astral Projection':
    "Self + 8 companions w/in 10' project to astral plane until dispelled or 0 HP",
  'Augury':"Discern whether act w/in 30 min will yield weal/woe",
  'Aura Of Life':
    "Self 30' radius gives resistance to necrotic damage, raise nonhostile 0 HP to 1 HP for conc/10 min",
  'Aura Of Purity':
    "Self 30' radius gives resist poison, no disease, Adv conditions for conc/10 min",
  'Aura Of Vitality':
    "Self 30' radius heals 2d6 HP designated target 1/rd for conc/1 min",
  'Awaken':"Touched beast or plant Int 10, friendly for 30 dy",

  'Bane':"R30' 3 targets -1d4 from attack/save (Cha neg) for conc/1 min",
  'Banishing Smite':
    "Self attacks +5d10 HP force and banish to home/demiplane if lt 50 HP for conc/1 min",
  'Banishment':"R60' target banish to home/demiplane (Cha neg) for conc/1 min",
  'Barkskin':"Touched AC 16 for conc/1 hr",
  'Beacon Of Hope':"R30' Targets Adv Wis/death saves, max heal for conc/1 min",
  'Beast Sense':"Self use touched beast's senses for conc/1 hr",
  'Bestow Curse':
    "Touched one of Disadv specified ability rolls, Disadv self attacks, Wis save to take action, take +1d8 HP necrotic from self attacks (Wis neg) for conc/1 min",
  'Black Tentacles':
    "R90' All in 20' sq 3d6 HP and restrained for conc/1 min (Dex neg)",
  'Blade Barrier':
    "R90' 100'x20'x5' blade wall passers 6d10 HP slashing (Dex neg) for conc/10 min",
  'Blade Ward':"Self resist bludgeon, pierce, slash damage for 1 rd",
  'Bless':"R30' 3 targets +1d4 to attack/save rolls for conc/1 min",
  'Blight':"R30' target 8d8 HP necrotic (Con half)",
  'Blinding Smite':
    "Self next attack +3d8 HP radiant and blind (Con neg) for conc/1 min",
  'Blindness/Deafness':"R30' target blind or deaf (Con neg) for 1 min",
  'Blink':"Self 50% chance of ethereal for 1 min",
  'Blur':"Self foes Disadv attack for conc/1 min",
  'Branding Smite':
    "Self next attack +2d6 HP radiant and visible for conc/1 min",
  'Burning Hands':"15' cone 3d6 HP fire (Dex half)",

  'Call Lightning':
    "R120' Conjured storm cloud 100' overhead generates bolt for 3d10 HP (Dex half) in 5' radius each rd for conc/10 min",
  'Calm Emotions':
    "R60' 10' radius suppresses charm/fright or hostility (Cha neg) for conc/1 min",
  'Chain Lightning':
    "R150' 4 targets in 30' radius 10d8 HP lightning (Dex half)",
  'Charm Person':
    "R30' Target regards you as friend (Wis neg) for 1 hr/until harmed",
  'Chill Touch':
    "R120' Ghost hand ${Math.floor((lvl + 1) / 6) + 1} HP necrotic, undead also Disadv self attack for 1 rd",
  'Chromatic Orb':"R90' 4\" hurled sphere 3d8 HP acid/poison/energy",
  'Circle Of Death':"R150' 60' radius 8d6 HP necrotic (Con half)",
  'Circle Of Power':
    "Allies in 30' radius from self Adv save vs. magic, neg instead of half for conc/10 min",
  'Clairvoyance':
    "R1 mi Invisible sensor allows sight or hearing for conc/10 min",
  'Clone':"Grow backup body for touched target",
  'Cloud Of Daggers':
    "R60' Spinning daggers in 5' cu 4d4 HP slashing for conc/1 min",
  'Cloudkill':
    "R120' 20' radius 5d8 HP poison (Con half), moves 10'/rd for conc/10 min",
  'Color Spray':"Self 15' cone 6d10 HP targets blinded for 1 rd",
  'Command':"R60' Target obeys one-word command (Wis neg)",
  'Commune':"Self receive 3 yes/no answers w/in 1 min",
  'Commune With Nature':"Self gain 3 facts about territory w/in 3 miles",
  'Compelled Duel':
    "R30' Target attack only self w/Disadv for conc/1 min (Wis neg)",
  'Comprehend Languages':"Self understand all language for 1 hr",
  'Compulsion':"R30' Self control target movement (Wis neg) for conc/1 min",
  'Cone Of Cold':"Self 60' cone 8d8 HP cold (Con half)",
  'Confusion':
    "R90' Targets in 10' radius act randomly (Wis neg) for conc/1 min",
  'Conjure Animals':"R60' Summon obedient fey creatures for conc/1 hr",
  'Conjure Celestial':"R90' Summon obedient celestial for conc/1 hr",
  'Conjure Elemental':
     "R90' Summon obedient elemental in appropriate environment for conc/1 hr",
  'Conjure Fey':"R90' Summon obedient fey for conc/1 hr",
  'Conjure Minor Elementals':"R90' Summon obedient elements for conc/1 hr",
  'Conjure Woodland Beings':"R60' Summon obedient fey for conc/1 hr",
  'Contact Other Plane':
    "Contact extraplanar being for five one-word answers (DC 15 Int or take 6d6 HP psychic)",
  'Contagion':"Touched diseased after failing 3 Con saves (3 successes neg)",
  'Contingency':"Cast spell becomes active on trigger w/in 10 dy",
  'Continual Flame':"Touched emits heatless flame until dispelled",
  'Control Water':
    "R300' Part, redirect, raise, or whirl 100'x100' water for conc/10 min",
  'Control Weather':"Determine weather in 5 mi radius for conc/8 hr",
  'Counterspell':"R60' Neg spell le level 3, DC 10+spell level for higher",
  'Create Food And Water':"R30' Create 40 lb food and 30 gal water",
  'Create Or Destroy Water':"R30' Affect 10 gal water",
  'Create Undead':"R10' Create 3 ghouls, obedient for 1 dy, renewable",
  'Creation':"R30' Create 5' cu false matter lasting up to 1 dy",
  'Cure Wounds':"Touched heals 1d8+spell mod HP",

  "Dancing Lights":"R120' 4 torch lights in 20' radius move 60' for conc/1 min",
  'Darkness':"R60' Target centers 15' radius lightless area for conc/10 min",
  'Darkvision':"Touched see in dark for 8 hr",
  'Daylight':"R60' Target centers 60' radius bright light for 1 hr",
  'Death Ward':"Touched retains 1 HP when next attack would take to 0",
  'Delayed Blast Fireball':"R150' 20' radius 12d6 HP (Dex half)",
  'Demiplane':"R60' Door leads to extradimensional 30' room for 1 hr",
  'Detect Evil And Good':
    "R30' Self sense aligned outsider, consecration/desecration for conc/10 min",
  'Detect Magic':"R30' Self sense magic aura for conc/10 min",
  'Detect Poison And Disease':"R30' Self sense poison for conc/10 min",
  'Detect Thoughts':"R30' Self sense target thoughts for conc/1 min",
  'Dimension Door':"R500' Self + 1 other teleport",
  'Disguise Self':"Self appear different body size for 1 hr",
  'Disintegrate':"R60' Target 10d6+40 HP force (Dex neg)",
  'Dispel Evil And Good':"Self aligned foes Disadv attck for conc/1 min",
  'Dispel Magic':"R120' End target effects le 3 level, higher DC 10+spell level",
  'Divination':"Receive truthful reply about even w/in 1 wk",
  'Divine Favor':"Self weapon +1d4 radiant HP for conc/1 min",
  'Divine Word':"R30' Targets deaf, blind, stunned or killed (Cha neg)",
  'Dominate Beast':
    "R60' Command target telepathically for conc/1 min (Wis neg)",
  'Dominate Monster':
    "R60' Command target telepathically for conc/1 hr (Wis neg)",
  'Dominate Person':
    "R60' Command target telepathically for conc/1 hr (Wis neg)",
  'Dream':"Touched communicate in dream with known target",
  'Druidcraft':"R30' Cause minor nature effects",

  'Earthquake':
    "R500' Shaking in 100' radius opens fissures and damages structures",
  'Eldritch Blast':
    "R120' Ranged touch ${Math.max(Math.floor((lvl+1)/6),1) rays do 1d10 HP ea",
  'Enhance Ability':"Touched Adv on chosen ability checks for 1 hr",
  'Enlarge/Reduce':"R30' Target dbl/half size for conc/1 min",
  'Entangle':"R90' Growth ensnare those in 20' sq for conc/1 min (Str neg)",
  'Enthrall':"R60' Target focused on caster for 1 min (Wis neg)",
  'Etherealness':"Self on Ethereal Plane for up to 8 hrs",
  'Expeditious Retreat':"Self Dash as bonus action for conc/10 min",
  'Eyebite':"R60' Target sleep, panic, or sick for conc/1 min",

  'Fabricate':"R120' Create product from raw materials",
  'Faerie Fire':"R60' Objects in 20' cu lit outline for conc/1 min",
  'Faithful Hound':"R30' Invisible watchdog warns and attacks for 8 hr",
  'False Life':"Self 1d4+4 temporary HP for 1 hr",
  'Fear':"Targets in 30' cone Dash away for conc/1 min (Wis neg)",
  'Feather Fall':"R60' Five falling targets slow to 60'/rd for 1 min",
  'Feeblemind':"R150' Target 4d6 HP psychic, Cha and Int drop to 1 (Int neg)",
  'Find Familiar':"R10' Telepathic communication w/summoned animal",
  'Find Steed':"R30' Summon loyal steed",
  'Find The Path':"Know shortest path to destination for 1 dy",
  'Find Traps':"R120' Sense presence of traps",
  'Finger Of Death':
    "R60' Target 7d8+30 HP (Con half), obedient zombie if killed",
  'Fire Bolt':"R120' Ranged spell 1d10 HP",
  'Fire Shield':"Self resist heat or cold, foe hit takes 2d8 HP for 10 min",
  'Fire Storm':"R150' Objects in 10 10' cu 7d10 HP (Dex half)",
  'Fireball':"R150' Creatures in 20' radius 8d6 HP (Dex half)",
  'Flame Blade':"Self flaming blade 3d6 HP, lights 10' radius",
  'Flame Strike':"R60' Objects in 10' radius 2x4d6 HP (Dex half)",
  "Flaming Sphere":"R60' 5' diameter sphere 2d6 HP (Dex half) move 30' for conc/1 min",
  'Flesh To Stone':
     "R60' Target petrified after 3 failed saves for conc/1 min (Con x3 neg)",
  "Floating Disk":
    "R30' 3'-diameter x 1\" force disk follows, holds 500 lbs at 3' for 1 hr",
  'Fly':"Touched fly 60'/rd for conc/10 min",
  "Fog Cloud":"R120' 20' radius fog obscures vision for conc/1 hr",
  "Forbiddance":
    "Touched 40K' sq bars teleport and portals, 5d10 HP on transit to chosen type for 1 dy",
  'Forcecage':"R100' 20' barred cube or 10' solid box for 1 hr",
  'Foresight':
    "Touched immune surprise, Adv attack, ability, save, foes Disadv attck for 8 hr",
  'Freedom Of Movement':"Touched immune impediments for 1 hr",
  'Freezing Sphere':"R300' Objects in 60' radius 10d6 HP (Con half)",

  'Gaseous Form':"Touched creature gaseous for conc/1 hr",
  'Gate':"R60' Open circular portal to another plane for conc/1 min",
  'Geas':"R60' Target charmed into obeying command for 30 dy (Wis neg)",
  'Gentle Repose':"Touched corpse no decay or animation for 10 dy",
  'Giant Insect':
    "R30' 10 centipedes, five wasps, 3 spiders, or one scorpion giant, obey commands for conc/10 min",
  'Glibness':"Self take 15 on Cha roll, detect truthful for 1 hr",
  'Globe Of Invulnerability':"Self 10' radius immune to spells level le 5",
  'Glyph Of Warding':
    "Glyph 20' radius 5d8 HP (Dex half) or spell levl le 3 on named trigger",
  'Goodberry':"10 berries heal 1 HP, provide food for 1 dy",
  'Grease':"R60' creatures in 10' sq fall (Dex neg) for 1 min",
  'Greater Invisibility':"Touched creature invisible for conc/1 min",
  'Greater Restoration':
    "Touched creature unexhausted, uncharmed, unpetrified, uncursed, or restored ability or HP",
  'Guardian Of Faith':
    "R30' Lg spectral guardian 20 HP to hostile creatures (Dex half) for 8 hr/60 HP",
  "Guards And Wards": "Multiple magic effects protect 2500' sq area for 1 dy",
  'Guidance':"Touched +1d4 ability check w/in conc/1 min",
  'Guiding Bolt':"R120' Ranged spell 4d6 HP, next foe attack in rd Adv",
  'Gust Of Wind':
    "60'x10' wind pushes 15' (Str neg), half movement for conc/1 min",

  "Hallow": "60' radius warded against outsiders, evokes boon spell",
  "Hallucinatory Terrain": "R300' 150' cube terrain illusion (Int(Investigation) disbelieve) for 1 dy",
  'Harm':"R60' Target 14d6 HP (Con half)",
  'Haste':"R30' Target dbl speed, +1 AC, bonus action for conc/1 min",
  'Heal':"R60' Target heal 70 HP, unblind, undeaf, undiseased",
  'Healing Word':"R60' Target 1d4+modifier HP",
  'Heat Metal':"R60' Touching target metal causes 2d8 HP for conc/1 min",
  'Hellish Rebuke':"R60' As a reaction, attacker 2d10 HP (Dex half)",
  "Heroes' Feast":"R30' Diners cured, immune poison and fright, Wis Adv, +2d10 HP for 1 dy",
  'Heroism':"Touched immune fright, +modifier HP each rd for conc/1 min",
  "Hideous Laughter": "R30' Target ROFL for conc/1 min (Wis neg)",
  'Hold Monster':"R90' target frozen for conc/1 min (Wis neg)",
  'Hold Person':"R60' target frozen for conc/1 min (Wis neg)",
  'Holy Aura':"Self 30' radius targets Adv saves, foes Disadv attack",
  "Hunter's Mark":
    "R90' Self attacks on target +1d6 HP, Adv Wis(Perception/Survival) to locate for conc/1 hr",
  "Hypnotic Pattern": "R120' creatures in 30' cu charmed for conc/1 min (Wis neg)",

  'Ice Storm':"R300' 20' radius 4d6 HP (Dex half)",
  'Identify':
    "Learn magic properties or spells affecting touched object or creature",
  'Illusory Script':"Writing legible only to specified creatures",
  'Imprisonment':"R30' Target restrained by choice of prisons (Wis neg)",
  'Incendiary Cloud':
    "R150' 20' radius 10d8 HP (Dex half), moves 10'/rd for conc/1 min",
  'Inflict Wounds':"Touched 3d10 HP",
  'Insect Plague':"R300' 20' radius 4d10 HP (Con half) for conc/10 min",
  'Instant Summons':"Prepared 10 lb item appears in hand",
  'Invisibility':
    "Touched creature invisible for conc/1 hr or until attacks/casts",
  "Irresistible Dance":
    "R30' Target dance (Disadv Dex, attack, foes Adv attack) for conc/1 min (Wis neg)",

  'Jump':"Touched jump x3 for 1 min",

  'Knock':"R60' Target unlocked, unstuck, or unbarred",

  'Legend Lore':"Know info about named person, place, or object",
  'Lesser Restoration':"Touched creature unblinded, unparalyzed, or unpoisoned",
  'Levitate':"R60' Target floats 20' for conc/10 min (Con neg)",
  'Light':"Touched object lights 20' radius for 1 hr (Dex neg)",
  'Lightning Bolt':"100'x5' 8d6 HP (Dex half)",
  'Locate Animal Or Plant':"Know location of named beast or plant w/in 5 mi",
  'Locate Creature':
    "Know location of named creature or species w/in 1000' for conc/1 hr",
  'Locate Object':
    "Know location of named object or type w/in 1000' for conc/10 min",
  'Longstrider':"Touched +10' speed for 1 hr",

  'Mage Armor':"Touched AC 13+DexMod in no armor for 8 hr",
  'Mage Hand':"R30' Spectral hand performs minor tasks le 10 lb for 1 min",
  'Magic Circle':
    "R10' 10' circle impassable by specified creature type, Disadv attacks for 1 hr",
  'Magic Jar':"R100' Possess creature, trap soul (Cha neg)",
  'Magic Missile':"R120' 3 darts 1d4+1 HP ea",
  'Magic Mouth':"R30' Object speaks 25-word message in response to trigger",
  'Magic Weapon':"Touched weapon +1 for conc/1 hr",
  'Magnificent Mansion':"R300' Comfortable extradimensional dwelling for 1 dy",
  'Major Image':"R120' 20' cu sight, sound, touch illusion for conc/10 min",
  'Mass Cure Wounds':"R60' 6 targets in 30' radius regain 3d8+spell mod HP",
  'Mass Heal':
    "R60' Targets restore 700 HP total, unblind, undeaf, undiseased",
  'Mass Healing Word':"R60' 6 targets regain 1d4+spell mod HP",
  'Mass Suggestion':"R60' 12 targets follow suggestion (Wis neg)",
  'Maze':"R60' Target sent to labyrinth (DC 20 Int escapes)",
  'Meld Into Stone':"Step into rock for 8 hr",
  'Mending':"Repair small tears",
  'Message':"R120 Whispered conversation w/target for 1 rd",
  'Meteor Swarm':"R1 mi 40' radius 20d6 fire + 20d6 bludgeoning (Dex half)",
  'Mind Blank':"Touched immune psychic damage, reading, charm for 1 dy",
  'Minor Illusion':
    "R30' Sound of 1 creature or 5' cu image (Investigation disbelieve) for 1 min",
  'Mirage Arcane':"Illusionary terrain for 10 dy",
  'Mirror Image':"3 duplcates draw attacks (AC 10+DexMod)",
  'Mislead':"Self invisible, control illusory duplcate for conc/1 hr",
  'Misty Step':"Self teleport 30'",
  'Modify Memory':"R30' Change target memory of event in prior dy (Wis neg)",
  'Moonbeam':"5' radius 2d10 HP (Con half) for conc/1 min",
  'Move Earth':"R120' Excavate 40' cu for conc/2 hr",

  'Nondetection':"Touched immune divination for 8 hr",

  'Pass Without Trace':
    "Allies within 30' self +10 Dexterity (Stealth), untrackable for conc/1 hr",
  'Passwall':"R30' 5'x8'x20' passage through wood, plaster, or stone",
  'Phantasmal Killer':
    "R120' Target frightened, 4d10 HP/rd for conc/1 min (Wis neg)",
  'Phantom Steed':"R30' Self ride 100'/rd for 1 hr",
  'Planar Ally':"R60' Otherworld creature appears, bargain for service",
  'Planar Binding':
    "R60; Bind celestial, elemental, fey, or fiend to servicce for 1 dy (Cha neg)",
  'Plane Shift':"Target or self + 8 willing move to different plane (Cha neg)",
  'Plant Growth':"R150' Enrich half mi radius for 1 yr or overgrow 100' radius",
  'Poison Spray':"R10' Target ${Math.floor((lvl+7)/6)}d12 HP (Con neg)",
  'Polymorph':"R60' Target creature transformed for conc/1 hr/0 HP (Wis neg)",
  'Power Word Kill':"R60' Slay target with le 100 HP",
  'Power Word Stun':"R60' Stun target with le 150 HP (Con neg)",
  'Prayer Of Healing':"R60' Six targets regain 2d8+spell Mod HP",
  'Prestidigitation':"R10' Minor magic effects for 1 hr",
  'Prismatic Spray':
    "R60' Targets in cone 10d6 HP (Dex half), held then stone (Dex neg), or blinded then plane shifted (Dex neg)",
  'Prismatic Wall':
    "R60' Transit causes 10d6 HP (Dex half), held then stone (Dex neg), or blinded then plane shifted (Dex neg) for 10 min",
  'Private Sanctum':
    "R120' Protect 100' sq from sound, vision, divination, teleport for 1 dy",
  'Produce Flame':"Hand flame lights 10' radius for 10 min, throw for ${Math.floor((lvl+7)/6)}d8 HP",
  'Programmed Illusion':"R120' 30' cu illusion on specified trigger",
  'Project Image':"R500 mi Illusory double mimics self for conc/1 dy",
  'Protection From Energy':
    "Resist acid, cold, fire, lightning, or thunder for conc/1 hr",
  'Protection From Evil And Good':
    "Touched specified foe type Disadv attack, immune charm, fright, possession",
  'Protection From Poison':
    "Touched poison neutralized, Adv save vs. poision for 1 hr",
  'Purify Food And Drink':"R10' 5' radius food, drink freed of poison, disease",

  'Raise Dead':"Touched 10-day-old corpse restored to life",
  'Ray Of Enfeeblement':"R60' Target does half Str damage until Con save",
  'Ray Of Frost':
    "R60' Target ${Math.floor((lvl+7)/6)}d8 HP, -10 speed for 1 turn",
  'Regenerate':
    "Touched regain 4d8+15 HP, 1 HP/min for 1 hr, restore severed members",
  'Reincarnate':"Touched resurrected in new body",
  'Remove Curse':"Touched freed from all curses",
  'Resilient Sphere':"R30' Target encased in impervious sphere for conc/1 min",
  'Resistance':"Touched +1d4 on save w/in conc/1 min",
  'Resurrection':"Touched 100-year-old corpse restored to life",
  'Reverse Gravity':"R50' Items in 50' radius fall up for conc/1 min",
  'Revivify':"Touched 1-minute-old corpse returned to life w/1 HP",
  "Rope Trick": "Rope to extradimensional space for 8 creatures for 1 hr",

  'Sacred Flame':"R60' Target ${Math.floor((lvl+7)/6)}d8 (Dex neg)",
  'Sanctuary':"R30' Target foes attack another for 1 min (Wis neg)",
  'Scorching Ray':"R120' 3 ranged attacks do 2d6 HP ea",
  'Scrying':"See, hear chosen target (Wis neg) for conc/10 min",
  'Secret Chest':"Touched chest moves to Ethereal Plane",
  'See Invisibility':"Self see invisible and ethereal items for 1 hr",
  'Seeming':"R30' Targets appearance change for 8 hr (Cha neg)",
  'Sending':"Exchange 25-word message with known target",
  'Sequester':"Touched hidden, suspended until trigger",
  'Shapechange':"Self polymorph for conc/1 hr/0 HP",
  'Shatter':"R60' 10' radius 3d8 HP (Con half)",
  'Shield':"Reaction self +5 AC, immune <i>Magic Missile</i> for 1 rd",
  'Shield Of Faith':"R60' Target +2 AC for conc/10 min",
  'Shillelagh':"Touched club attack with spell attack, does 1d8 HP for 1 min",
  'Shocking Grasp':"Touched ${Math.floor((lvl+7)/6)}d8 HP",
  'Silence':"R120' 20' radius blocks sound for conc/10 min",
  'Silent Image':"R60' 15' cu illusion for conc/10 min (Investigation neg)",
  'Simulacrum':"Friendly duplicate creature from snow, half HP of original",
  'Sleep':"R90' 20' radius sleeps up to 5d8 HP creatures, weakest first",
  'Sleet Storm':"R150' 40' radius slick ice causes falls (Dex neg)",
  'Slow':"R120' Targets in 40' cu half speed, -2 AC and Dex save (Wis neg)",
  'Spare The Dying':"Touched creature stable",
  'Speak With Animals':"Self talk to animals for 10 min",
  'Speak With Dead':"Self ask corpse 5 questions in 10 min",
  'Speak With Plants':"Self talk to plans in 30' for 10 min",
  'Spider Climb':"Touched travel walls and ceilings for conc/1 hr",
  'Spike Growth':"R150' 20' radius 2d4 HP/5' move for conc/10 min",
  'Spirit Guardians':"Self 15' radius 3d8 HP (Wis half)",
  'Spiritual Weapon':
    "R60' Spectral weapon 1d8 + spell mod HP, move 20' for 1 min",
  'Stinking Cloud':"R90' 20' radius causes retching for conc/1 min",
  'Stone Shape':"Touched medium-sized stone reforms",
  'Stoneskin':"Touched resists bludgeoning, piercing, slashing for conc/1 hr",
  'Storm Of Vengeance':
    "RSight 360' radius lightning, thunder, wind for conc/1 min",
  "Suggestion": "R30' Target follow reasonable suggestion (Wis neg)",
  'Sunbeam':
    "60' light 6d8 HP (Con half), blind 1 turn (Con neg) for conc/1 min",
  'Sunburst':"60' radius light 12d6 HP (Con half), blind 1 min (Con neg)",
  'Symbol':"Touched permanent glyph w/magic effects",

  'Telekinesis':"R60' Move 1000 lb 30'/rd for conc/10 min (Str neg)",
  'Telepathic Bond':"R30' Eight targets communicate mentally for 1 hr",
  'Teleport':"R10' One object or self + 8 allies teleport any distance",
  'Teleportation Circle':"R10' Permanent portal to similar circle",
  'Thaumaturgy':"R30' Minor magic effects for 1 min",
  'Thunderwave':"15' cu 2d8 HP, pushed 10' (Con half, no push)",
  'Time Stop':"Self extra 1d4+1 turns w/in 1000' or until other affected",
  'Tiny Hut':"10' radius dome immune to objects and spells for 8 hr",
  'Tongues':"Touched understand and speak any language for 1 hr",
  'Transport Via Plants':"Teleporation door between two plants for 1 rd",
  'Tree Stride':"Teleport between like trees 1/rd for conc/1 min",
  'True Polymorph':
    "R30' Target creature or object transformed for conc/1 hr/0 HP (Wis neg)",
  'True Resurrection':"Touched or named 200-year-old corpse restored to life",
  'True Seeing':
    "Touched 120' truesight, see magically concealed doors, Ethereal Plane for 1 hr",
  'True Strike':"R30' Adv next attack on target w/in 1 rd",

  'Unseen Servant':"R60' Invisible force performs simple tasks for 1 hr",

  'Vampiric Touch':"Touched 3d6 HP, self regain half for conc/1 min",
  'Vicious Mockery':
    "R60' Target insults ${Math.floor((lvl+7)/6)} HP, Disadv attack (Wis neg)",

  'Wall Of Fire':"R120' 60'x20' wall 5d8 HP (Dex half) for conc/1 min",
  'Wall Of Force':"R120' 10 10'x10' panels immune objects for conc/10 min",
  'Wall Of Ice':"R120' 10 10'x10' panels for conc/10 min",
  'Wall Of Stone':"R120' 10 10'x10' panels for conc/10 min",
  'Wall Of Thorns':"R120' 60'x10' wall 7d8 HP (Dex half) for conc/10 min",
  'Warding Bond':
    "Touched +1 AC, saves, resist damage within 60' of self, self share damage for 1 hr",
  'Water Breathing':"R30' 10 targets breathe underwater for 1 dy",
  'Water Walk':"R30' 10 targets cross liquid for 1 hr",
  'Web':"R60' 20' cu restrain creatures for conc/1 hr (Dex neg, Str frees)",
  'Weird':
    "R120' Targets in 30' radius frightened, 4d10 HP/turn for conc/1 min (Wis neg)",
  'Wind Walk':"R30' Self + 10 others gaseous, fly 300'/rd for 8 hr",
  'Wind Wall':"R120' 50'x15' strong wind does 3d8 HP (Str half) for conc/1 min",
  "Wish": "Alter reality with few limits",
  'Word Of Recall':
    "R5' Self + 5 others instantly teleport to predetermined place",

  'Zone Of Truth':
    "R60' Creatures inside 15' radius cannot lie for 10 min (Cha neg)"

};

// PHB
Object.assign(SRD5E.spellsDescriptions, {
  'Conjure Barrage':"60' weapon cone 3d8 HP (Dex half)",
  'Conjure Volley':"R150' 40' radius weapon hail 8d8 HP (Dex half)",
  'Cordon Of Arrows':"Four pieces of ammo attack 30' 1d6 HP (Dex neg) for 8 hr",
  'Crown Of Madness':
    "R120' Direct charmed creature's attacks for conc/1 min (Wis neg)",
  "Crusader's Mantle":"30' radius allies +1d4 damage for conc/1 min",
  'Destructive Wave':"Targets in 30' radius 5d6 HP (Con half), prone (Con neg)",
  'Dissonant Whispers':"R60' Target 3d6 HP (Wis half), flee (Wis neg)",
  'Elemental Weapon':"Touched weapon +1 attack, +1d4 damage for conc/1 hr",
  'Ensnaring Strike':
    "Successful attack restrains foe, 1d6 HP/turn for conc/1 min (Str neg)",
  'Feign Death':"Touched appears dead for 1 hr",
  'Friends':"Self Adv Cha w/target for conc/1 min",
  'Grasping Vine':"R30' Vine pulls target 20' for conc/1 min (Dex neg)",
  'Hail Of Thorns':"Ranged hit followed by 5' thorn rain 1d10 HP (Dex half)",
  'Hex':"R90' Self hits on target +1d6 HP, Disadv chosen ability for conc/1 hr",
  'Hunger Of Hadar':"R150' 20' void 2d6 HP for conc/1 min",
  'Lightning Arrow':"100' bolt 8d6 HP (Dex half)",
  "Mage's Sword":"Force weapon 3d10, move 20' for conc/1 min",
  'Phantasmal Force':"R60' target illusion 1d6 HP/rd (Int neg)",
  'Power Word Heal':
    "Touched regains all HP, uncharmed, unfrightened, unparalyzed, unstunned",
  'Ray Of Sickness':"R60' Target 2d8 HP, poisoned 1 turn (Con not poisoned)",
  'Searing Smite':
    "Hit +1d6 HP, 1d6 HP/turn for conc/1 min (Con no per-turn damage)",
  'Staggering Smite':"Next hit +4d6 HP w/in conc/1 min",
  'Swift Quiver':"Touched quiver endless ammo, dbl attack for conc/1 min",
  'Telepathy':"Mental communication with ally for 1 dy",
  'Thorn Whip':"R30' Vine attacks ${Math.floor((lvl+7)/6)}d6 HP, pulls 10'",
  'Thunderous Smite':"Next hit 2d6 HP, push 10' (Str no push)",
  'Tsunami':
    "RSight 300'x300' wall of water 6d10 HP (Str half), moves away 50'/turn for conc/6 rd",
  'Witch Bolt':"R30' Target 1d12/turn for conc/1 min",
  'Wrathful Smite':"Next hit +1d6 HP, frightened (Wis neg) for conc/1 min"
});
// ENDPHB

/* Defines the rules related to character abilities. */
SRD5E.abilityRules = function(rules) {

  // Ability modifier computation
  for(var ability in {'charisma':'', 'constitution':'', 'dexterity':'',
                      'intelligence':'', 'strength':'', 'wisdom':''}) {
    rules.defineRule(ability, ability + 'Adjust', '+', null);
    rules.defineRule
      (ability + 'Modifier', ability, '=', 'Math.floor((source - 10) / 2)');
    rules.defineNote(ability + ':%V (%1)');
    rules.defineRule(ability + '.1', ability + 'Modifier', '=', null);
  }

  // Effects of ability modifiers
  rules.defineRule('combatNotes.constitutionHitPointsAdjustment',
    'constitutionModifier', '=', null,
    'level', '*', null
  );
  rules.defineRule('combatNotes.dexterityArmorClassAdjustment',
    'dexterityModifier', '=', null
  );
  rules.defineRule('combatNotes.dexterityAttackAdjustment',
    'dexterityModifier', '=', null
  );
  rules.defineRule('combatNotes.dexterityDamageAdjustment',
    'dexterityModifier', '=', null
  );
  rules.defineRule('combatNotes.strengthAttackAdjustment',
    'strengthModifier', '=', null
  );
  rules.defineRule('combatNotes.strengthDamageAdjustment',
    'strengthModifier', '=', null
  );

  // Effects of the notes computed above
  rules.defineRule
    ('armorClass', 'combatNotes.dexterityArmorClassAdjustment', '+', null);
  rules.defineRule
    ('hitPoints', 'combatNotes.constitutionHitPointsAdjustment', '+', null);

  rules.defineNote
    ('validationNotes.abilityBoostAllocation:%1 available vs. %2 allocated');
  rules.defineRule('validationNotes.abilityBoostAllocation.1',
    '', '=', '0',
    'abilityBoostCount', '=', null
  );
  rules.defineRule('validationNotes.abilityBoostAllocation.2', '', '=', '0');
  rules.defineRule('validationNotes.abilityBoostAllocation',
    'validationNotes.abilityBoostAllocation.1', '=', '-source',
    'validationNotes.abilityBoostAllocation.2', '+=', null
  );

  for(var ability in {'charisma':'', 'constitution':'', 'dexterity':'',
                      'intelligence':'', 'strength':'', 'wisdom':''}) {
    rules.defineRule('validationNotes.abilityBoostAllocation.2',
      ability + 'Adjust', '+=', null
    );
    rules.defineRule(ability, '', 'v', '20');
  }

};

/* Defines the rules related to character backgrounds. */
SRD5E.backgroundRules = function(rules, backgrounds) {

  for(var i = 0; i < backgrounds.length; i++) {

    var name = backgrounds[i];
    var equipment = [];
    var features = [];
    var languages = [];
    var proficiencyCount = {};
    var proficienciesGiven = {};
    var proficiencyChoices = {};

    if(name === 'Acolyte') {
      equipment = [
        'Holy Symbol', 'Prayer Book/Wheel', 'Incense', 'Vestments', 'Clothing',
        '15 GP'
      ];
      features = [
        '1:Shelter Of The Faithful:feature:Aid from associated temple'
      ];
      languages = ['', ''];
      proficiencyCount = {'Skill':2};
      proficienciesGiven = {'Skill':['Insight', 'Religion']};
// PHB
    } else if(name == 'Charlatan') {
      equipment = [
        'Fine Clothes', 'Disguise Kit', 'Con Tools', '15 GP'
      ];
      features = ['1:False Identity:feature:Documented 2nd ID, forgery skills'];
      proficiencyCount = {'Skill':2, 'Tool':2};
      proficienciesGiven = {
        'Skill':['Deception', 'Sleight Of Hand'],
        'Tool':['Diguise Kit', 'Forgery Kit']
      };
    } else if(name == 'Criminal') {
      equipment = ['Crowbar', 'Dark Clothes w/Hood', '15 GP'];
      features = ['1:Criminal Contact:feature:Liaison to criminal network'];
      proficiencyCount = {'Skill':2, 'Tool':2};
      proficienciesGiven = {
        'Skill':['Deception', 'Stealth'],
        'Tool':["Thieves' Tools"]
      };
      proficiencyChoices = {
        'Tool':['Game']
      };
    } else if(name == 'Entertainer') {
      equipment = [
        'Musical Instrument', "Admirer's Favor", 'Costume', '15 GP'
      ];
      features = [
        '1:By Popular Demand:feature:Welcome, lodging for performing'
      ];
      proficiencyCount = {'Skill':2, 'Tool':2};
      proficienciesGiven = {
        'Skill':['Acrobatics', 'Performance'],
        'Tool':['Disguise Kit']
      };
      proficiencyChoices == {
        'Tool':['Music']
      };
    } else if(name == 'Folk Hero') {
      equipment = [
        "Artisan's Tools", 'Shovel', 'Iron Pot', 'Clothes', '10 GP'
      ];
      features = ['1:Rustic Hospitality:feature:Aid from common folk'];
      proficiencyCount = {'Skill':2, 'Tool':2};
      proficienciesGiven = {
        'Skill':['Animal Handling', 'Survival'],
        'Tool':['Vehicles (Land)']
      };
      proficiencyChoices = {
        'Tool':['Artisan']
      };
    } else if(name == 'Guild Artisan') {
      equipment = [
        "Artisan's Tools", 'Introduction Letter', "Traveler's Clothes",
        '15 GP'
      ];
      features = ['1:Guild Membership:feature:Aid from guild and members'];
      proficiencyCount = {'Skill':2, 'Tool':1};
      proficienciesGiven = {
        'Skill':['Insight', 'Persuasion']
      };
      proficiencyChoices = {
        'Tool':['Artisan']
      };
    } else if(name == 'Hermit') {
      equipment = [
        'Scroll Case With Notes', 'Winter Blanket', 'Clothes', 'Herbalism Kit',
        '5 GP'
      ];
      features = ['1:Discovery:feature:Knows rare truth'];
      languages = [''];
      proficiencyCount = {'Skill':2, 'Tool':1};
      proficienciesGiven = {
        'Skill':['Medicine', 'Religion'],
        'Tool':['Herbalism Kit']
      };
    } else if(name == 'Noble') {
      equipment = [
        'Fine Clothes', 'Signet Ring', 'Pedigree Scroll', '25 GP'
      ];
      features = [
        '1:Position Of Priviledge:feature:Treated with respect/deference'
      ];
      languages = [''];
      proficiencyCount = {'Skill':2, 'Tool':1};
      proficienciesGiven = {
        'Skill':['History', 'Persuasion']
      };
      proficiencyChoices = {
        'Tool':['Game']
      };
    } else if(name == 'Outlander') {
      equipment = [
        'Staff', 'Hunting Trap', 'Animal Trophy', "Traveler's Clothes", '10 GP'
      ];
      features = [
        '1:Wanderer:feature:Excellent geography memory, can forage for 6 people'
      ];
      languages = [''];
      proficiencyCount = {'Skill':2, 'Tool':1};
      proficienciesGiven = {
        'Skill':['Athletics', 'Survival']
      };
      proficiencyChoices = {
        'Tool':['Music']
      };
    } else if(name == 'Sage') {
      equipment = [
        'Bottle Ink', 'Quill', 'Small Knife', 'Letter With Unanswered Question',
        'Clothes', '10 GP'
      ];
      features = ['1:Researcher:feature:Know where to find lore'];
      languages = ['', ''];
      proficiencyCount = {'Skill':2};
      proficienciesGiven = {
        'Skill':['Arcana', 'History']
      };
    } else if(name == 'Sailor') {
      equipment = [
        'Belaying Pin', "50' Silk Rope", 'Lucky Charm', 'Clothes', '10 GP'
      ];
      features = ["1:Ship's Passage:feature:Free passage for self/companions"];
      proficiencyCount = {'Skill':2, 'Tool':2};
      proficienciesGiven = {
        'Skill':['Athletics', 'Perception'],
        'Tool':["Navigator's Tools", 'Vehicles (Water)']
      };
    } else if(name == 'Soldier') {
      equipment = [
        'Rank Insignia', 'Battle Trophy', 'Gambling Objects', 'Clothes', '10 GP'
      ];
      features = ['1:Military Rank:feature:Respect/deference from soldiers'];
      proficiencyCount = {'Skill':2, 'Tool':2};
      proficienciesGiven = {
        'Skill':['Athletics', 'Intimidation'],
        'Tool':['Vehicles (Land)']
      };
      proficiencyChoices = {
        'Tool':['Game']
      };
    } else if(name == 'Urchin') {
      equipment = [
        'Small Knife', 'City Map', 'Pet Mouse', "Parents' Token", 'Clothes',
        '10 GP'
      ];
      features = [
        '1:City Secrets:feature:Dbl speed through hidden urban ways'
      ];
      proficiencyCount = {'Skill':2, 'Tool':2};
      proficienciesGiven = {
        'Skill':['Sleight Of Hand', 'Stealth'],
        'Tool':['Diguise Kit', "Thieves' Tools"]
      };
// ENDPHB
    } else
      continue;

    SRD5E.defineBackground(
      rules, name, features, languages, proficiencyCount, proficienciesGiven,
      proficiencyChoices
    );

  }

};

/* Defines the rules related to character classes. */
SRD5E.classRules = function(rules, classes) {

  rules.defineRule
    ('experienceNeeded', 'level', '=', 'SRD5E.levelsExperience[source] * 1000');
  rules.defineRule('level',
    'experience', '=', 'SRD5E.levelsExperience.findIndex(item => item * 1000 > source)'
  );

  rules.defineNote
    ('validationNotes.levelAllocation:%1 available vs. %2 allocated');
  rules.defineRule('validationNotes.levelAllocation.1',
    '', '=', '0',
    'level', '=', null
  );
  rules.defineRule('validationNotes.levelAllocation.2',
    '', '=', '0',
    /^levels\./, '+', null
  );
  rules.defineRule('validationNotes.levelAllocation',
    'validationNotes.levelAllocation.1', '=', '-source',
    'validationNotes.levelAllocation.2', '+', null
  );

  rules.defineNote
    ('validationNotes.selectableFeatureAllocation: %1 available vs. %2 allocated');
  rules.defineRule('validationNotes.selectableFeatureAllocation.1',
    '', '=', '0',
    /^selectableFeatureCount\./, '+', null
  );
  rules.defineRule('validationNotes.selectableFeatureAllocation.2',
    '', '=', '0',
    /^selectableFeatures\./, '+', null
  );
  rules.defineRule('validationNotes.selectableFeatureAllocation',
    'validationNotes.selectableFeatureAllocation.1', '=', '-source',
    'validationNotes.selectableFeatureAllocation.2', '+', null
  );

  rules.defineRule('attacksPerRound', '', '=', '1');

  for(var i = 0; i < classes.length; i++) {

    var features, hitDie, proficiencyCount, proficiencyChoices,
        proficienciesGiven, selectableFeatures, spellAbility, spellsKnown,
        spells, spellSlots;
    var name = classes[i];

    rules.defineRule('featCount',
      'levels.' + name, '+=', 'source >= 19 ? 5 : Math.floor(source / 4)'
    );
    rules.defineRule('proficiencyBonus',
      'levels.' + name, '=', 'Math.floor((source + 7) / 4)'
    );

    if(name == 'Barbarian') {

      features = [
        '1:Armor Proficiency (Light/Medium/Shield)::',
        '1:Weapon Proficiency (Simple/Martial)::',
        '1:Rage:ability:Adv Str checks %V/long rest (heavy armor neg)',
        '1:Rage:combat:' +
          '+%1 melee damage, resist bludgeon/pierce/slash damage for 1 min %V/long rest (heavy armor neg)',
        '1:Barbarian Unarmored Defense:combat:+%1 AC in no armor',
        '2:Danger Sense:save:Adv Dex checks vs. visible dangers',
        '2:Reckless Attack:combat:Adv melee Str attacks, foes Adv all attacks',
        '5:Extra Attack:combat:%V additional attack(s) per Attack action',
        '5:Fast Movement:ability:+10 speed (heavy armor neg)',
        '7:Feral Instinct:combat:Adv initiative, act when surprised if rage',
        '9:Brutal Critical:combat:+%V crit damage dice',
        '11:Relentless Rage:combat:DC 10+ Con to keep 1 HP when brought to 0',
        '15:Persistent Rage:combat:Rage has no time limit',
        '18:Indominable Might:ability:Use Str instead of roll for Str check',
        '20:Primal Champion:ability:+4 strength/+4 constitution',
        // Path Of The Berserker
        '3:Frenzy:combat:Bonus attack during rage, exhausted after',
        '6:Mindless Rage:save:Immune charm, fright during rage',
        '10:Intimidating Presence:feature:' +
          "R30' Target creature frightened (DC %V Will neg)",
        '14:Retaliation:combat:Melee attack reaction after taking damage'
      ];
// PHB
      features.push(
        // Path Of The Totem Warrior
        '3:Spirit Seeker:magic:' +
          'Ritual <i>Beast Sense</i>, <i>Speak With Animals</i>', // TODO
        '3:Bear Totem Spirit:combat:Resist non-psychic damage when raging',
        '3:Eagle Totem Spirit:combat:' +
          'Foes Disadv OA, Dash as bonus action when raging (heavy armor neg)',
        '3:Wolf Totem Spirit:combat:' +
          "Allies Adv attack vs. foes w/in 5' of self when raging",
        '6:Aspect Of The Bear:ability:' +
          'Dbl load/lift, Adv push, pull, lift, break Str checks', // TODO
        '6:Aspect Of The Eagle:ability:' +
          'See 1 mile clearly, no Perception Disadv in dim light',
        '6:Aspect Of The Wolf:ability:' +
          'Track at fast pace, stealth at normal pace',
        '10:Spirit Walker:magic:Ritual <i>Commune With Nature</i>', // TODO
        '14:Bear Totemic Attunement:combat:' +
          "Foes w/in 5' Disadv attack others when raging",
        '14:Eagle Totemic Attunement:ability:Fly for short bursts when raging',
        '14:Wolf Totemic Attunement:combat:' +
          'Knock prone lg foe after melee hit when raging'
      );
//ENDPHB
      hitDie = 12;
      proficiencyCount = {'Save':2, 'Skill':2, 'Armor':3, 'Weapon':2};
      proficienciesGiven = {
        'Save': ['Constitution', 'Strength'],
        'Armor': ['Light', 'Medium', 'Shield'],
        'Weapon': ['Simple', 'Martial']
      };
      proficiencyChoices = {
        'Skill':['Animal Handling', 'Athletics', 'Intimidation', 'Nature',
                 'Perception', 'Survival']
      };
      selectableFeatures = [
        '3:Path Of The Berserker::',
        '3:Path Of The Totem Warrior (Bear)::',
        '3:Path Of The Totem Warrior (Eagle)::',
        '3:Path Of The Totem Warrior (Wolf)::'
      ];
      spellAbility = null;
      spellsKnown = null;
      spells = null;
      spellSlots = null;

      rules.defineRule('abilityNotes.rageFeature',
        'levels.Barbarian', '+=', 'source<3 ? 2 : source<6 ? 3 : source<12 ? 4 : source<17 ? 5 : source<20 ? 6 : "unlimited"'
      );
      rules.defineRule('armorClass',
        'combatNotes.barbarianUnarmoredDefenseFeature.2', '+', null
      );
      rules.defineRule
        ('attacksPerRound', 'combatNotes.extraAttackFeature', '+', null);
      rules.defineRule('combatNotes.brutalCriticalFeature',
        'levels.Barbarian', '=', 'Math.floor((source - 5) / 4)'
      );
      // Show Unarmored Defense note even if armor != None or conMod == 0
      rules.defineRule('combatNotes.barbarianUnarmoredDefenseFeature.1',
        'combatNotes.barbarianUnarmoredDefenseFeature', '?', null,
        'constitutionModifier', '=', null
      );
      rules.defineRule('combatNotes.barbarianUnarmoredDefenseFeature.2',
        'combatNotes.barbarianUnarmoredDefenseFeature', '?', null,
        'armor', '?', 'source == "None"',
        'combatNotes.barbarianUnarmoredDefenseFeature.1', '=', null
      );
      rules.defineRule('combatNotes.extraAttackFeature',
        'levels.Barbarian', '+=', 'source < 5 ? null : 1'
      );
      rules.defineRule('combatNotes.rageFeature',
        'levels.Barbarian', '+=', 'source<3 ? 2 : source<6 ? 3 : source<12 ? 4 : source<17 ? 5 : source<20 ? 6 : "unlimited"'
      );
      rules.defineRule('combatNotes.rageFeature.1',
        'levels.Barbarian', '+=', 'source<9 ? 2 : source<16 ? 3 : 4'
      );
      rules.defineRule('featureNotes.intimidatingPresenceFeature',
        'charismaModifier', '=', 'source + 8',
        'proficiencyBonus', '+', null
      );
      rules.defineRule('selectableFeatureCount.Barbarian',
        'levels.Barbarian', '=', 'source < 3 ? null : 1'
      );
      // TODO heavy armor neg (except for dwarves?)
      rules.defineRule('speed', 'abilityNotes.fastMovementFeature', '+', '10');

      for(var feature in {
        'Frenzy':'', 'Mindless Rage':'', 'Intimidating Presence':'',
        'Retaliation':''
      }) {
        rules.defineRule('barbarianFeatures.' + feature,
          'barbarianFeatures.Path Of The Berserker', '?', null
        );
      }
// PHB
      rules.defineRule('totemicBarbarian',
        'barbarianFeatures.Path Of The Totem Warrior (Bear)', '=', '1',
        'barbarianFeatures.Path Of The Totem Warrior (Eagle)', '=', '1',
        'barbarianFeatures.Path Of The Totem Warrior (Wolf)', '=', '1'
      );
      rules.defineRule
        ('barbarianFeatures.Spirit Seeker', 'totemicBarbarian', '?', null);
      rules.defineRule
        ('barbarianFeatures.Spirit Walker', 'totemicBarbarian', '?', null);
      for(var feature in {
        'Aspect Of The $A':'', '$A Totem Spirit':'', '$A Totemic Attunement':''
      }) {
        for(var animal in {'Bear':'', 'Eagle':'', 'Wolf':''}) {
          rules.defineRule('barbarianFeatures.' + feature.replace('$A', animal),
            'barbarianFeatures.Path Of The Totem Warrior (' + animal + ')', '?', null
          );
        }
      }
// ENDPHB

    } else if(name == 'Bard') {

      features = [
        '1:Armor Proficiency (Light)::',
        '1:Weapon Proficiency (Simple/Hand Crossbow/Longsword/Rapier/Shortsword)::',
        '1:Tool Proficiency (3 Musical Instruments)::',
        "1:Bardic Inspiration:magic:R60' Grant 1d%V w/in 10 min %1/long rest",
        '1:Ritual Casting:magic:Cast known spell as ritual',
        '1:Spellcasting::',
        '2:Jack Of All Trades:ability:+%V ability checks',
        '2:Song Of Rest:magic:Listeners regain 1d%V HP after short rest',
        '3:Expertise:feature:Dbl %V Profs',
        '5:Font Of Inspiration:feature:' +
          'Refresh Bardic Inspiration after short rest',
        "6:Countercharm:magic:R30' Friendly listeners Adv vs. charm, fright",
        '10:Magical Secrets:magic:Learn %V additional spells from any class', // TODO
        '20:Superior Inspiration:feature:Min 1 Bardic Inspiration',
        // College Of Lore
        '3:Bonus Skills:skill:Prof in 3 additional skills',
        '3:Cutting Words:feature:' +
          "R60' Reaction to subtract Bardic Inspiration from foe roll",
        '6:Additional Magical Secrets:magic:' +
          'Learn 2 additional spells from any class', // TODO
        '14:Peerless Skill:ability:Add Bardic Inspiration to ability check'
      ];
// PHB
      features.push(
        // College Of Valor
        '3:Bonus Skills:skill:Prof in 3 additional skills',
        '3:Combat Inspiration:feature:' +
          'Ally use Bardic Inspiration to boost damage or AC',
        '6:Extra Attack:combat:%V additional attack(s) per Attack action',
        '14:Battle Magic:combat:Bonus attack after casting spell'
      );
// ENDPHB
      hitDie = 8;
      proficiencyCount =
        {'Armor':1, 'Save':2, 'Skill':3, 'Tool':3, 'Weapon':5};
      proficienciesGiven = {
        'Armor':['Light'],
        'Save':['Charisma', 'Dexterity'],
        'Weapon':['Simple','Hand Crossbow','Longsword','Rapier','Shortsword']
      };
      proficiencyChoices = {
        'Skill': SRD5E.SKILLS.map(function(skill){return skill.substring(0, skill.indexOf(':'));}),
        'Tool':['Music']
      };
      selectableFeatures = ['3:College Of Lore::'];
// PHB
      selectableFeatures.push('3:College Of Valor::');
// ENDPHB
      spellAbility = 'charisma';
      spellsKnown = [
        'B0:1:2/4:3/10:4',
        'B:1:4/2:5/3:6/4:7/5:8/6:9/7:10/8:11/9:12/10:14/11:15/13:16/14:18/15:19/17:20/18:22'
      ];
      spells = null;
      spellSlots = [
        'B1:1:2/2:3/3:4',
        'B2:3:2/4:3',
        'B3:5:2/6:3',
        'B4:7:1/8:2/9:3',
        'B5:9:1/10:2/18:3',
        'B6:11:1/19:2',
        'B7:13:1/20:2',
        'B8:15:1',
        'B9:17:1'
      ];

      rules.defineRule('abilityNotes.jackOfAllTradesFeature',
        'proficiencyBonus', '=', 'Math.floor(source / 2)'
      );
      rules.defineRule('casterLevels.B',
        'levels.Bard', '=', null,
         'magicNotes.casterLevelBonusFeature', '+', null
      );
      rules.defineRule('casterLevelArcane', 'casterLevels.B', '+=', null);
      rules.defineRule('featureNotes.expertiseFeature',
        'levels.Bard', '=', 'source < 10 ? 2 : 4'
      );
      rules.defineRule('magicNotes.bardicInspirationFeature',
        'levels.Bard', '=', '6 + Math.floor(source / 5) * 2'
      );
      rules.defineRule('magicNotes.bardicInspirationFeature.1',
        'charismaModifier', '=', 'Math.max(source, 1)'
      );
      rules.defineRule('magicNotes.magicalSecretsFeature',
        'levels.Bard', '=', '2 * Math.floor((source - 6) / 4)'
      );
      rules.defineRule('magicNotes.songOfRestFeature',
        'levels.Bard', '=', '6 + 2 * source<9 ? 0 : Math.floor((source-5)/4)'
      );
      rules.defineRule
        ('proficiencyCount.Skill', 'skillNotes.bonusSkillsFeature', '+', '3');
      rules.defineRule('selectableFeatureCount.Bard',
        'levels.Bard', '=', 'source < 3 ? null : 1'
      );

      for(var feature in {
        'Additional Magical Secrets':'', 'Cutting Words':'', 'Extra Skills':'',
        'Peerless Skill':''
      }) {
        rules.defineRule('bardFeatures.' + feature,
          'bardFeatures.College Of Lore', '?', null
        );
      }

// PHB
      rules.defineRule
        ('attacksPerRound', 'combatNotes.extraAttackFeature', '+', null);
      rules.defineRule('bardExtraAttacks',
        'bardFeatures.Extra Attack', '?', null,
        'levels.Bard', '=', 'source < 6 ? null : 1'
      );
      rules.defineRule
        ('combatNotes.extraAttackFeature', 'bardExtraAttacks', '+=', null);
      rules.defineRule
        ('proficiencyCount.Skill', 'skillNotes.bonusSkillsFeature', '+', '3');

      for(var feature in {
        'Battle Magic':'', 'Combat Inspiration':'', 'Extra Attack':''
      }) {
        rules.defineRule('bardFeatures.' + feature,
          'bardFeatures.College Of Valor', '?', null
        );
      }
// ENDPHB

    } else if(name == 'Cleric') {

      features = [
        '1:Armor Proficiency (Light/Medium/Shield)::',
        '1:Weapon Proficiency (Simple)::',
        '1:Ritual Casting:magic:Cast known spell as ritual',
        '1:Spellcasting::',
        '2:Channel Divinity:feature:Effect %V/short rest',
        "2:Turn Undead:combat:R30' Undead flee for 1 min (%V DC Wis neg)",
        '5:Destroy Undead:combat:Turn destroys up to CR %V',
        '10:Divine Intervention:magic:%V% chance of deity help 1/wk',
        // Life Domain
        '1:Armor Proficiency (Heavy)',
        '1:Disciple Of Life:magic:' +
          'Healing spells restore additional 2 * spell level HP',
        '2:Preserve Life:magic:' +
          "R30' Channel Divinity restore %V HP among targets, up to half max HP",
        '6:Blessed Healer:magic:' +
          'Self regain 2 + spell level HP from casting healing spells',
        '8:Divine Strike:combat:+%Vd8 HP 1/turn',
        '17:Supreme Healing:magic:Use maximum values on healing spells'
      ];
// PHB
      features.push(
        // Knowledge Domain
        '1:Blessings Of Knowledge:skill:+2 languages, +2 skill proficiencies',
        '2:Knowledge Of The Ages:skill:' +
          'Channel Divinity Prof chosen skill or tool for 10 min',
        '6:Read Thoughts:magic:' +
          "R60' Channel Divinity read and command thoughts for 1 min (Wis neg)",
        '8:Potent Spellcasting:magic:+%V Cleric cantrip damage',
        '17:Visions Of The Past:magic:' +
          'Meditate for visions about surroundings or held object',
        // Light Domain
        '1:Light Cantrip:magic:Know <i>Light</i> cantrip', // TODO
        '1:Warding Flare:magic:' +
          "R30' Reaction flare foe Disadv on current attack %V/long rest",
        '2:Radiance Of The Dawn:magic:' +
          "R30' Channel Divinity dispel magic darkness, 2d10+%V HP to foes (Con half)",
        '6:Improved Flare:magic:Warding Flare protects allies',
        '8:Potent Spellcasting:magic:+%V Cleric cantrip damage',
        "17:Corona Of Light:magic:" +
          "60' light, foe Disadv on fire, radiant spells for 1 min",
        // Nature Domain
        '1:Armor Proficiency (Heavy)',
        '1:Acolyte Of Nature:magic:Additional Druid cantrip', // TODO
        '1:Acolyte Of Nature:skill:Additional skill proficiency',
        '2:Charm Animals And Plants:magic:' +
          "R30' Channel Divinity charms for 1 min",
        '6:Dampen Elements:magic:' +
          "R30' Reaction to grant resistance to acid, cold, fire, lightning, or thunder",
        '8:Divine Strike:combat:+%Vd8 HP 1/turn',
        '17:Master Of Nature:magic:Command charmed animals, plants',
        // Tempest Domain
        '1:Armor Proficiency (Heavy)::',
        '1:Weapon Proficiency (Martial)::',
        '1:Wrath Of The Storm:combat:Reaction 2d8 HP (Dex half) %V/long rest',
        '2:Destructive Wrath:magic:' +
          'Channel Divinity max thunder, lightning damage',
        "6:Thunderbolt Strike:magic:Lightning damage pushes lg 10'",
        '8:Divine Strike:combat:+%Vd8 HP 1/turn',
        '17:Stormborn:ability:Fly at full speed outdoors',
        // Trickery Domain
        '1:Blessing Of The Trickster:magic:Touched Adv Stealth for 1 hr',
        "2:Invoke Duplicity:magic:R30' Illusionary dulicate for conc/1 min",
        '6:Cloak Of The Trickster:magic:Channel Divinity invisibile 1 turn',
        '8:Divine Strike:combat:+%Vd8 HP 1/turn',
        '17:Improved Duplicity:magic:Four duplicates',
        // War Domain
        '1:Armor Proficiency (Heavy)::',
        '1:Weapon Proficiency (Martial)::',
        '1:War Priest:combat:Bonus attack %V/long rest',
        '2:Guided Strike:combat:Channel Divinity +10 attack',
        "6:War God's Blessing:magic:" +
          "R30' Channel Divinity reaction ally +10 attack",
        '8:Divine Strike:combat:+%Vd8 HP 1/turn',
        '17:Avatar Of Battle:combat:' +
          'Resistance nonmagical bludgeon, pierce, slash'
      );
// ENDPHB
      hitDie = 8;
      proficiencyCount = {'Save':2, 'Skill':2, 'Armor':3, 'Weapon':1};
      proficienciesGiven = {
        'Save':['Charisma', 'Wisdom'],
        'Armor':['Light', 'Medium', 'Shield'],
        'Weapon':['Simple']
      };
      proficiencyChoices = {
        'Skill':['History', 'Insight', 'Medicine', 'Persuasion', 'Religion']
      };
      selectableFeatures = ['1:Life Domain::'];
// PHB
      selectableFeatures.push(
        '1:Knowledge Domain::',
        '1:Light Domain::',
        '1:Nature Domain::',
        '1:Tempest Domain::',
        '1:Trickery Domain::',
        '1:War Domain::'
      );
// ENDPHB
      spellAbility = 'wisdom';
      spellsKnown = [
        'C0:1:3/4:4/10:5',
        'C:1:"all"', 'Dom:1:"all"'
      ];
      spells = {
        'clericFeatures.Life Domain':[
          '1:Bless:Cure Wounds',
          '3:Lesser Restoration:Spiritual Weapon',
          '5:Beacon Of Hope:Revivify',
          '7:Death Ward:Guardian Of Faith',
          '9:Mass Cure Wounds:Raise Dead'
        ]
      };
// PHB
      Object.assign(spells, {
        'clericFeatures.Knowledge Domain':[
          '1:Command:Identify',
          '3:Augury:Suggestion',
          '5:Nondetection:Speak With Dead',
          '7:Arcane Eye:Confusion',
          '9:Legend Lore:Scrying'
        ],
        'clericFeatures.Light Domain':[
          '1:Burning Hands:Faerie Fire',
          '3:Flaming Sphere:Scorching Ray',
          '5:Daylight:Fireball',
          '7:Guardian Of Faith:Wall Of Fire',
          '9:Flame Strike:Scrying'
        ],
        'clericFeatures.Nature Domain':[
          '1:Animal Friendship:Speak With Animals',
          '3:Barkskin:Spike Growth',
          '5:Plant Growth:Wind Wall',
          '7:Dominate Beast:Grasping Vine',
          '9:Insect Plague:Tree Stride'
        ],
        'clericFeatures.Tempest Domain':[
          '1:Fog Cloud:Thunderwave',
          '3:Gust Of Wind:Shatter',
          '5:Call Lightning:Sleet Storm',
          '7:Control Water:Ice Storm',
          '9:Destructive Wave:Insect Plague'
        ],
        'clericFeatures.Trickery Domain':[
          '1:Charm Person:Disguise Self',
          '3:Mirror Image:Pass Without Trace',
          '5:Blink:Dispel Magic',
          '7:Dimension Door:Polymorph',
          '9:Dominate Person:Modify Memory'
        ],
        'clericFeatures.War Domain':[
          '1:Divine Favor:Shield Of Faith',
          '3:Magic Weapon:Spiritual Weapon',
          "5:Crusader's Mantle:Spirit Guardians",
          '7:Freedom Of Movement:Stoneskin',
          '9:Flame Strike:Hold Monster'
        ]
      });
// ENDPHB
      spellSlots = [
        'C1:1:2/2:3/3:4',
        'C2:3:2/4:3',
        'C3:5:2/6:3',
        'C4:7:1/8:2/9:3',
        'C5:9:1/10:2/18:3',
        'C6:11:1/19:2',
        'C7:13:1/20:2',
        'C8:15:1',
        'C9:17:1'
      ];

      rules.defineRule('armorProficiencies.Heavy',
        'clericFeatures.Armor Proficiency (Heavy)', '=', '1'
      );
      rules.defineRule('casterLevels.C',
        'levels.Cleric', '=', null,
         'magicNotes.casterLevelBonusFeature', '+', null
      );
      rules.defineRule('casterLevelDivine', 'casterLevels.C', '+=', null);
      rules.defineRule('combatNotes.destroyUndeadFeature',
        'levels.Cleric', '=', 'source < 8 ? 0.5 : Math.floor((source - 5) / 3)'
      );
      rules.defineRule('combatNotes.turnUndeadFeature',
        'wisdomModifier', '=', 'source + 8',
        'proficiencyBonus', '+', null
      );
      rules.defineRule('featureNotes.channelDivinityFeature',
        'levels.Cleric', '=', 'source < 6 ? 1: source < 18 ? 2 : 3'
      );
      rules.defineRule('magicNotes.divineInterventionFeature',
        'levels.Cleric', '=', 'source < 20 ? source : 100'
      );
      rules.defineRule('selectableFeatureCount.Cleric',
        'levels.Cleric', '=', 'source < 3 ? null : 1'
      );
      rules.defineRule('weaponProficiencies.Martial',
        'clericFeatures.Weapon Proficiency (Martial)', '=', '1'
      );

      rules.defineRule('combatNotes.divineStrikeFeature',
        'levels.Cleric', '=', 'source < 14 ? 1 : 2'
      );
      rules.defineRule
        ('magicNotes.preserveLifeFeature', 'levels.Cleric', '=', '5 * source');

      for(var feature in {
        'Blessed Healer':'', 'Disciple Of Life':'', 'Preserve Life':'',
        'Supreme Healing':''
      }) {
        rules.defineRule('clericFeatures.' + feature,
          'clericFeatures.Life Domain', '?', null
        );
      }
      rules.defineRule('hasDivineStrikeDomain',
        'clericFeatures.Life Domain', '=', '1'
      );
      rules.defineRule('clericFeatures.Divine Strike',
        'hasDivineStrikeDomain', '?', null
      );
      rules.defineRule('hasHeavyArmorDomain',
        'clericFeatures.Life Domain', '=', '1'
      );
      rules.defineRule('clericFeatures.Armor Proficiency (Heavy)',
        'hasHeavyArmorDomain', '?', null
      )

//PHB
      rules.defineRule('combatNotes.wrathOfTheStormFeature',
        'wisdomModifier', '=', 'Math.max(source, 1)'
      );
      rules.defineRule('combatNotes.warPriestFeature',
        'wisdomModifier', '=', 'Math.max(source, 1)'
      );
      rules.defineRule
        ('languageCount', 'skillNotes.blessingsOfKnowledgeFeature', '+', '2');
      rules.defineRule
        ('magicNotes.potentSpellcastingFeature', 'wisdomModifier', '=', null);
      rules.defineRule
        ('magicNotes.radianceOfTheDawnFeature', 'levels.Cleric', '=', null);
      rules.defineRule('magicNotes.wardingFlareFeature',
        'wisdomModifier', '=', 'Math.max(source, 1)'
      );
      rules.defineRule
        ('proficiencyCount.Armor', 'clericFeatures.Life Domain', '+=', '1');
      rules.defineRule('proficiencyCount.Skill',
        'skillNotes.acolyteOfNatureFeature', '+', '1',
        'skillNotes.blessingsOfKnowledgeFeature', '+', '2'
      );
      rules.defineRule('skillChoices.Animal Handling',
        'skillNotes.acolyteOfNatureFeature', '=', '1'
      );
      rules.defineRule('skillChoices.Arcana',
        'skillNotes.blessingsOfKnowledgeFeature', '=', '1'
      );
      rules.defineRule('skillChoices.History',
        'skillNotes.blessingsOfKnowledgeFeature', '=', '1'
      );
      rules.defineRule('skillChoices.Nature',
        'skillNotes.acolyteOfNatureFeature', '=', '1',
        'skillNotes.blessingsOfKnowledgeFeature', '=', '1'
      );
      rules.defineRule('skillChoices.Religion',
        'skillNotes.blessingsOfKnowledgeFeature', '=', '1'
      );
      rules.defineRule('skillChoices.Survival',
        'skillNotes.acolyteOfNatureFeature', '=', '1'
      );

      for(var feature in {
        'Blessings Of Knowledge':'', 'Knowledge Of The Ages':'',
        'Read Thoughts':'', 'Visions Of The Past':''
      }) {
        rules.defineRule('clericFeatures.' + feature,
          'clericFeatures.Knowledge Domain', '?', null
        );
      }
      for(var feature in {
        'Corona Of Light':'', 'Improved Flare':'', 'Light Cantrip':'',
        'Radiance Of The Dawn':'', 'Warding Flare':''
      }) {
        rules.defineRule('clericFeatures.' + feature,
          'clericFeatures.Light Domain', '?', null
        );
      }
      for(var feature in {
        'Acolyte Of Nature':'', 'Charm Animals And Plants':'',
        'Dampen Elements':'', 'Master Of Nature':''
      }) {
        rules.defineRule('clericFeatures.' + feature,
          'clericFeatures.Nature Domain', '?', null
        );
      }
      for(var feature in {
        'Destructive Wrath':'', 'Stormborn':'', 'Thunderbolt Strike':'',
        'Wrath Of The Storm':''
      }) {
        rules.defineRule('clericFeatures.' + feature,
          'clericFeatures.Tempest Domain', '?', null
        );
      }
      for(var feature in {
        'Blessing Of The Trickster':'', 'Cloak Of The Trickster':'',
        'Improved Duplicity':'', 'Invoke Duplicity':''
      }) {
        rules.defineRule('clericFeatures.' + feature,
          'clericFeatures.Trickery Domain', '?', null
        );
      }
      for(var feature in {
        'Avatar Of Battle':'', 'Guided Strike':'', "War God's Blessing":'',
        'War Priest':''
      }) {
        rules.defineRule('clericFeatures.' + feature,
          'clericFeatures.War Domain', '?', null
        );
      }

      rules.defineRule('hasDivineStrikeDomain',
        'clericFeatures.Nature Domain', '=', '1',
        'clericFeatures.Tempest Domain', '=', '1',
        'clericFeatures.Trickery Domain', '=', '1',
        'clericFeatures.War Domain', '=', '1'
      );
      rules.defineRule('hasHeavyArmorDomain',
        'clericFeatures.Nature Domain', '=', '1',
        'clericFeatures.Tempest Domain', '=', '1',
        'clericFeatures.War Domain', '=', '1'
      );
      rules.defineRule('hasMartialWeaponDomain',
        'clericFeatures.Tempest Domain', '=', '1',
        'clericFeatures.War Domain', '=', '1'
      );
      rules.defineRule('clericFeatures.Weapon Proficiency (Martial)',
        'hasMartialWeaponDomain', '?', null
      );
      rules.defineRule('hasPotentSpellcastingDomain',
        'clericFeatures.Knowledge Domain', '=', '1',
        'clericFeatures.Light Domain', '=', '1'
      );
      rules.defineRule('clericFeatures.Potent Spellcasting',
        'hasPotentSpellcastingDomain', '?', null
      );
//ENDPHB

    } else if(name == 'Druid') {

      features = [
        '1:Armor Proficiency (Light/Medium/Shield)::',
        '1:Weapon Proficiency (Club/Dagger/Dart/Javelin/Mace/Quarterstaff/Scimitar/Sickle/Sling/Spear)::',
        '1:Tool Proficiency (Herbalism Kit)::',
        '1:Druidic::',
        '1:Ritual Casting:magic:Cast known spell as ritual',
        '1:Spellcasting::',
        '2:Wild Shape:magic:' +
          'Transform into CR %1%2 creature for %3 hr 2/short rest',
        '18:Druid Timeless Body:feature:Age at 1/10 rate',
        '18:Beast Spells:magic:Cast spells during Wild Shape',
        '20:Archdruid:magic:Unlimited Wild Shape',
        // Circle Of The Land
        '2:Bonus Cantrip:magic:Additional Druid cantrip', // TODO
        '2:Natural Recovery:magic:Recover %V spell slot levels in short rest',
        '3:Circle Spells:magic:1/long rest',
        "6:Land's Stride:ability:Normal move through difficult terrain",
        "6:Land's Stride:save:Adv vs. impeding plants",
        "10:Nature's Ward:save:" +
          'Immune disease, poison, elemental or fey charm and fright',
        "14:Nature's Sanctuary:combat:Beast, plant DC %V Will save to attack"
      ];
// PHB
      features.push(
        // Circle Of The Moon
        '2:Combat Wild Shape:combat:' +
          'Wild Shape as bonus action, use spell slot to regain 1d8 * slot level HP',
        '2:Circle Forms:magic:Increase Wild Shape CR to %V',
        '6:Primal Strike:combat:Wild Shape attacks count as magical',
        '10:Elemental Wild Shape:magic:' +
          'Use 2 Wild Shape uses to become elemental',
        '14:Thousand Forms:magic:<i>Alter Self<i> at will',
      );
// ENDPHB
      hitDie = 8;
      proficiencyCount =
       {'Armor':3, 'Save':2, 'Skill':2, 'Tool':1, 'Weapon':10};
      proficienciesGiven = {
        'Armor':['Light', 'Medium', 'Shield'],
        'Save':['Intelligence', 'Wisdom'],
        'Tool':['Herbalism Kit'],
        'Weapon':['Club', 'Dagger', 'Dart', 'Javelin', 'Mace', 'Quarterstaff',
                  'Scimitar', 'Sickle', 'Sling', 'Spear']
      };
      proficiencyChoices = {
        'Skill':['Arcana', 'Animal Handling', 'Insight', 'Medicine', 'Nature',
                 'Perception', 'Religion', 'Survival']
      };
      selectableFeatures = [
        '2:Circle Of The Land (Arctic)::',
        '2:Circle Of The Land (Coast)::',
        '2:Circle Of The Land (Desert)::',
        '2:Circle Of The Land (Forest)::',
        '2:Circle Of The Land (Grassland)::',
        '2:Circle Of The Land (Mountain)::',
        '2:Circle Of The Land (Swamp)::'
      ];
// PHB
      selectableFeatures.push(
        '2:Circle Of The Land (Underdark)::',
        '2:Circle Of The Moon::'
      );
      selectableFeatures.push('2:Underdark Land::');
// ENDPHB
      spellAbility = 'wisdom';
      spells = {
        'druidFeatures.Circle Of The Land (Arctic)':[
          '3:Hold Person:Spike Growth',
          '5:Sleet Storm:Slow',
          '7:Freedom Of Movement:Ice Storm',
          '9:Commune With Nature:Cone Of Cold'
        ],
        'druidFeatures.Circle Of The Land (Coast)':[
          '3:Mirror Image:Misty Step',
          '5:Water Breathing:Water Walk',
          '7:Control Water:Freedom Of Movement',
          '9:Conjure Elemental:Scrying'
        ],
        'druidFeatures.Circle Of The Land (Desert)':[
          '3:Blur:Silence',
          '5:Create Food And Water:Protection From Energy',
          '7:Blight:Hallucinatory Terrain',
          '9:Insect Plague:Wall Of Stone'
        ],
        'druidFeatures.Circle Of The Land (Forest)':[
          '3:Barkskin:Spider Climb',
          '5:Call Lightning:Plant Growth',
          '7:Divination:Freedom Of Movement',
          '9:Commune With Nature:Tree Stride'
        ],
        'druidFeatures.Circle Of The Land (Grassland)':[
          '3:Invisibility:Pass Without Trace',
          '5:Daylight:Haste',
          '7:Divination:Freedom Of Movement',
          '9:Dream:Insect Plague'
        ],
        'druidFeatures.Circle Of The Land (Mountain)':[
          '3:Spider Climb:Plant Growth',
          '5:Lightning Bolt:Meld Into Stone',
          '7:Stone Shape:Stoneskin',
          '9:Passwall:Wall Of Stone'
        ],
        'druidFeatures.Circle Of The Land (Swamp)':[
          '3:Acid Arrow:Darkness',
          '5:Water Walk:Stinking Cloud',
          '7:Freedom Of Movement:Locate Creature',
          '9:Insect Plague:Scrying'
        ]
      };
// PHB
      Object.assign(spells, {
        'druidFeatures.Circle Of The Land (Underdark)':[
          '3:Spider Climb:Web',
          '5:Gaseous Form:Stinking Cloud',
          '7:Greater Invisibility:Stone Shape',
          '9:Cloudkill:Insect Plague'
        ]
      });
// ENDPHB
      spellsKnown = [
        'D0:1:2/4:3/10:4',
        'D:1:"all"'
      ];
      spellSlots = [
        'D1:1:2/2:3/3:4',
        'D2:3:2/4:3',
        'D3:5:2/6:3',
        'D4:7:1/8:2/9:3',
        'D5:9:1/10:2/18:3',
        'D6:11:1/19:2',
        'D7:13:1/20:2',
        'D8:15:1',
        'D9:17:1'
      ];

      rules.defineRule('casterLevels.D',
        'levels.Druid', '=', null,
         'magicNotes.casterLevelBonusFeature', '+', null
      );
      rules.defineRule('casterLevelDivine', 'casterLevels.D', '+=', null);
      rules.defineRule('languageCount', 'features.Druidic', '+', '1');
      rules.defineRule('languages.Druidic', 'features.Druidic', '=', '1');
      rules.defineRule('magicNotes.wildShapeFeature.1',
        'levels.Druid', '=', 'source < 4 ? "1/4" : source < 8 ? "1/2" : "1"',
        'magicNotes.circleFormsFeature', '=', null
      );
      rules.defineRule('magicNotes.wildShapeFeature.2',
        'levels.Druid', '=', 'source < 4 ? " (land only)" : source < 8 ? " (non-flying)" : ""'
      );
      rules.defineRule('magicNotes.wildShapeFeature.3',
        'levels.Druid', '=', 'Math.floor(source /2)'
      );
      rules.defineRule('selectableFeatureCount.Druid',
        'levels.Druid', '=', 'source < 2 ? null : 1'
      );

      rules.defineRule("combatNotes.nature'sSanctuaryFeature",
        'wisdomModifier', '=', 'source + 8',
        'proficiencyBonus', '+', null
      );
      rules.defineRule('magicNotes.circleFormsFeature',
        'levels.Druid', '=', 'source < 6 ? 1 : Math.floor(source / 3)'
      );
      rules.defineRule('magicNotes.naturalRecoveryFeature',
        'levels.Druid', '=', 'Math.floor(source / 2)'
      );

      rules.defineRule('hasCircleOfTheLand',
        /Circle Of The Land/, '=', '1'
      );
      for(var feature in {
        'Bonus Cantrip':'', 'Circle Spells':'', "Land's Stride":'',
        "Nature's Ward":'', "Nature's Sanctuary":''
      }) {
        rules.defineRule('druidFeatures.' + feature,
          'hasCircleOfTheLand', '?', null
        );
      }

// PHB
      for(var feature in {
        'Circle Forms':'', 'Combat Wild Shape':'', 'Elemental Wild Shape':'',
        'Primal Strike':'', 'Thousand Forms':''
      }) {
        rules.defineRule('druidFeatures.' + feature,
          'druidFeatures.Circle Of The Moon', '?', null
        );
      }
// ENDPHB

    } else if(name == 'Fighter') {

      features = [
        '1:Armor Proficiency (Light/Medium/Heavy/Shield)::',
        '1:Weapon Proficiency (Simple/Martial)::',
        '1:Second Wind:combat:Regain 1d10+%V HP 1/short rest',
        '2:Action Surge:combat:Extra action %V/short rest',
        '5:Extra Attack:combat:%V additional attack(s) per Attack action',
        '9:Indomitable:save:Reroll failed save %V/long rest'
      ];
      features.push(
        // Champion Archetype
        '3:Improved Critical:combat:Crit on natural 19',
        '7:Remarkable Athlete:ability:+%V non-proficient Str, Dex, Con checks',
        '10:Additional Fighting Style:combat:Select second Fighting Style',
        '15:Superior Critical:combat:Crit on natural 18',
        '18:Survivor:combat:Regain %V HP each turn when between 1 and %1'
      );
// PHB
      features.push(
        // Battle Master Archetype
        '3:Maneuvers:combat:Select %V Fighter maneuver features',
        "3:Student Of War:skill:Artisan's Tools Prof",
        '3:Superiority Dice:combat:%Vd%1',
        '7:Know Your Enemy:combat:' +
          'Know how foe compares to you after 1 min study',
        '15:Relentless:combat:Min 1 superiority die',
        // Eldritch Knight Archetype
        '3:Spellcasting::',
        '3:Weapon Bond:combat:Immune disarm, summon weapon',
        '7:War Magic:combat:Bonus attack after %V',
        '10:Eldritch Strike:combat:' +
          'Foe Disadv vs. spells for 1 turn after you hit',
        "15:Arcane Charge:magic:Action Surge to teleport 30'"
      );
// ENDPHB
      hitDie = 10;
      proficiencyCount = {'Armor':4, 'Save':2, 'Skill':2, 'Weapon':2};
      proficienciesGiven = {
        'Armor':['Light', 'Medium', 'Heavy', 'Shield'],
        'Save':['Constitution', 'Strength'],
        'Weapon':['Simple', 'Martial']
      };
      proficiencyChoices = {
        'Skill': ['Acrobatics', 'Animal Handling', 'Athletics', 'History',
                  'Insight', 'Intimidation', 'Perception', 'Survival']
      };
      selectableFeatures = [
        '1:Archery Style:combat:+2 ranged attack',
        '1:Defense Style:combat:+1 AC in armor',
        '1:Dueling Style:combat:+2 damage with single, one-hand weapon',
        '1:Great Weapon Fighting Style:combat:' +
          'Reroll damage of 1 or 2 with two-handed weapons',
        '1:Protection Style:combat:' +
          'Use shield to impose attack Disadv on adjacent foe',
        '1:Two-Weapon Fighting Style:combat:' +
          'Add ability modifier to second attack damage',
        '3:Champion Archetype::'
      ]
// PHB
      selectableFeatures.push(
        '3:Battle Master Archetype',
        '3:Eldritch Knight Archetype',
        "3:Commander's Strike:combat:Add sup die to delegated attack",
        '3:Disarming Attack:combat:' +
          'Add sup die to damage, foe drops item (DC %V Str neg)',
        '3:Distracting Strike:combat:' +
          'Add sup die to damage, ally Adv attack same foe for 1 turn',
        '3:Evasive Footwork:combat:Add sup die to AC during move',
        '3:Feinting Attack:combat:' +
          'Adv next attack adjacent foe, add sup die to damage',
        '3:Goading Attack:combat:' +
          'Add sup die to damage, foe Disadv attack others for 1 turn (DC %V Wis neg)',
        "3:Lunging Attack:combat:+5' melee range, add sup die to damage",
        '3:Maneuvering Attack:combat:' +
          'Add sup die to damage, ally move half speed w/no OA',
        '3:Menacing Attack:combat:' +
          'Add sup die to damage, foe frightened for 1 turn (DC %V Wis neg)',
        '3:Parry:combat:Reduce damage from foe hit by sup die + %V',
        '3:Precision Attack:combat:Add sup die to atteck',
        '3:Pushing Attack:combat:' +
          "Add sup die to damage, foe pushed 15' (DC %V Str neg)",
        '3:Rally:combat:Chosen ally gains sup die + %V temp HP',
        '3:Riposte:combat:Bonus attack after foe miss, add sup die to damage',
        '3:Sweeping Attack:combat:After hit, sup die HP to second adjacent foe',
        '3:Trip Attack:combat:' +
          'Add sup die to damage, foe knocked prone (DC %V Str neg)'
      );
// ENDPHB
      spellAbility = null;
      spellsKnown = null;
      spells = null;
      spellSlots = null;
// PHB
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
         'magicNotes.casterLevelBonusFeature', '+', null
      );
      rules.defineRule('casterLevels.W', 'casterLevels.Fi', '^=', null);
      rules.defineRule('casterLevelArcane', 'casterLevels.W', '+=', null);
      rules.defineRule('spellsKnownLevel.Fighter',
        'fighterFeatures.Eldritch Knight Archetype', '?', null
      );
      rules.defineRule('spellAttackModifier.Fighter',
        'fighterFeatures.Eldritch Knight Archetype', '?', null
      );
// ENDPHB

      rules.defineRule('abilityNotes.remarkableAthleteFeature',
        'proficiencyBonus', '=', 'Math.ceil(source / 2)'
      );
      rules.defineRule('armorClass',
        'combatNotes.defenseStyleFeature.1', '+', null
      );
      rules.defineRule
        ('attacksPerRound', 'combatNotes.extraAttackFeature', '+', null);
      rules.defineRule('combatNotes.actionSurgeFeature',
        'levels.Fighter', '=', 'source < 17 ? 1 : 2'
      );
      // Show Defense Style note even if armor == None
      rules.defineRule('combatNotes.defenseStyleFeature.1',
        'combatNotes.defenseStyleFeature', '?', null,
        'armor', '=', 'source == "None" ? null : 1'
      );
      rules.defineRule('combatNotes.extraAttackFeature',
        'levels.Fighter', '+=', 'source < 5 ? null : source < 11 ? 1 : source < 20 ? 2 : 3'
      );
      rules.defineRule
        ('combatNotes.secondWindFeature', 'levels.Fighter', '=', null);
      rules.defineRule('combatNotes.survivorFeature',
        'constitutionModifier', '=', '5 + source'
      );
      rules.defineRule('combatNotes.survivorFeature.1',
        'hitPoints', '=', 'Math.floor(source / 2)'
      );
      rules.defineRule('featCount', 'fighterFeatBonus', '+', null);
      rules.defineRule('fighterFeatBonus',
        'levels.Fighter', '=', 'source < 6 ? null : source < 14 ? 1 : 2'
      );
      rules.defineRule
        ('proficiencyCount.Tools', 'skillNotes.studentOfWarFeature', '+', '1');
      rules.defineRule
        ('rangedAttack', 'combatNotes.archeryStyleFeature', '+', '2');
      rules.defineRule('saveNotes.indomitableFeature',
        'levels.Fighter', '=', 'source < 13 ? 1 : source < 17 ? 2 : 3'
      );
      rules.defineRule('selectableFeatureCount.Fighter',
        'levels.Fighter', '=', 'source < 3 ? 1 : 2',
        'combatNotes.additionalFightingStyleFeature', '+', '1'
      );
      rules.defineRule('toolProficiencies.Artisan',
        'skillNotes.studentOfWarFeature', '=', '1'
      );
// PHB
      rules.defineRule('maxDexOrStrMod',
        'dexterityModifier', '=', null,
        'strengthModifier', '^', null
      );
      rules.defineRule('maneuverSaveDC',
        'fighterFeatures.Battle Master Archetype', '?', null,
        'proficiencyBonus', '=', '8 + source',
        'maxDexOrStrMod', '+', null
      );
      rules.defineRule
        ('combatNotes.disarmingAttackFeature', 'maneuverSaveDC', '=', null);
      rules.defineRule
        ('combatNotes.goadingAttackFeature', 'maneuverSaveDC', '=', null);
      rules.defineRule('combatNotes.maneuversFeature',
        'fighterFeatures.Battle Master Archetype', '?', null,
        'levels.Fighter', '=',
          'source<7 ? 3 : source<10 ? 5 : source<15 ? 7 : 9'
      );
      rules.defineRule
        ('combatNotes.menacingAttackFeature', 'maneuverSaveDC', '=', null);
      rules.defineRule
        ('combatNotes.parryFeature', 'dexterityModifier', '=', null);
      rules.defineRule
        ('combatNotes.pushingAttackFeature', 'maneuverSaveDC', '=', null);
      rules.defineRule
        ('combatNotes.rallyFeature', 'charismaModifier', '=', null);
      rules.defineRule('combatNotes.superiorityDiceFeature',
        'levels.Fighter', '=', 'source < 7 ? 4 : source < 15 ? 5 : 6'
      );
      rules.defineRule('combatNotes.superiorityDiceFeature.1',
        'fighterFeatures.Superiority Dice', '?', null,
        'levels.Fighter', '=', 'source < 10 ? 8 : source < 18 ? 10 : 12'
      );
      rules.defineRule
        ('combatNotes.tripAttackFeature', 'maneuverSaveDC', '=', null);
      rules.defineRule('combatNotes.warMagicFeature',
        'levels.Fighter', '=', 'source < 18 ? "cantrip" : "spell"'
      );
      rules.defineRule('selectableFeatureCount.Fighter',
        'combatNotes.maneuversFeature', '+', null
      );
// ENDPHB

      for(var feature in {
        'Improved Critical':'', 'Remarkable Athlete':'',
        'Additional Fighting Style':'', 'Superior Critical':'', 'Survivor':''
      }) {
        rules.defineRule('fighterFeatures.' + feature,
          'fighterFeatures.Champion Archetype', '?', null
        );
      }
// PHB
      for(var feature in {
        'Maneuvers':'', 'Know Your Enemy':'', 'Student Of War':'',
        'Superiority Dice':''
      }) {
        rules.defineRule('fighterFeatures.' + feature,
          'fighterFeatures.Battle Master Archetype', '?', null
        );
      }
      for(var feature in {
        'Arcane Charge':'', 'Eldritch Strike':'', 'Spellcasting':'',
        'War Magic':'', 'Weapon Bond':''
      }) {
        rules.defineRule('fighterFeatures.' + feature,
          'fighterFeatures.Eldritch Knight Archetype', '?', null
        );
      }
      for(var feature in {
        "Commander's Strike":'', 'Disarming Attack':'', 'Distracting Strike':'',
        'Evasive Footwork':'', 'Feinting Attack':'', 'Goading Attack':'',
        'Lunging Attack':'', 'Maneuvering Attack':'', 'Menacing Attack':'',
        'Parry':'', 'Precision Attack':'', 'Pushing Attack':'', 'Rally':'',
        'Riposte':'', 'Sweeping Attack':'', 'Trip Attack':''
      }) {
        rules.defineNote(
          'validationNotes.fighter' + feature.replace(/ /g, '') + 'SelectableFeatureFeatures:Requires Maneuvers'
        );
      }
// ENDPHB

    } else if(name == 'Monk') {

      features = [
        '1:Weapon Proficiency (Simple/Shortsword)::',
        "1:Tool Proficiency (Artisan's Tools or Musical Instrument)::",
        '1:Martial Arts:combat:' +
          'When unarmored, +%1 monk weapons attack and damage, raise damage die to 1d%V',
        '1:Monk Bonus Attack:combat:Unarmed strike after monk weapon attack',
        '1:Monk Unarmored Defense:combat:+%1 AC in no armor',
        '2:Flurry Of Blows:combat:Spend 1 Ki for 2 additional unarmed strikes',
        '2:Ki:feature:%V Ki points refresh after short rest',
        '2:Patient Defense:combat:Spend 1 Ki to Dodge (foe attack Disadv)',
        '2:Step Of The Wind:combat:Spend 1 Ki to Disengage or Dash, dbl jump',
        '2:Unarmored Movement:ability:+%V speed in no armor',
        '3:Deflect Missiles:combat:React to reduce missile damage by 1d10+%V',
        '4:Slow Fall:ability:React to reduce fall damage by %V',
        '5:Extra Attack:combat:%V additional attack(s) per Attack action',
        '5:Stunning Strike:combat:Spend 1 Ki to stun foe (DC %V Con neg)',
        '6:Ki-Empowered Strikes:combat:Unarmed attacks count as magical',
        '7:Evasion:save:Dex save yields no damage instead of half',
        '7:Stillness Of Mind:save:End self charm, fright at will',
        '9:Improved Unarmored Movement:ability:' +
          'Move across vertical surfaces and liquids',
        '10:Purity Of Body:save:Immune disease, poison',
        '13:Tongue Of Sun And Moon:feature:Communicate in any language',
        '14:Diamond Soul:save:Prof all saves, spend 1 Ki to reroll',
        '15:Monk Timeless Body:feature:' +
          'No debility from aging, need no food or water',
        '18:Empty Body:magic:' +
          'Spend 4 Ki for <i>Invisibility</i> 1 min, 8 Ki for <i>Astral Projection</i>',
        '20:Perfect Self:combat:Min 4 Ki'
      ];
      features.push(
        // Way Of The Open Hand Tradition
        '3:Open Hand Technique:combat:' +
          "Choice of knock prone (DC %V Dex neg), push 15' (DC %V Str neg), or no foe react after Flurry Of Blows hit",
        '6:Wholeness Of Body:feature:Recover %V HP 1/long rest',
        '11:Tranquility:magic:' +
          'Self <i>Sanctuary</i> until next long rest (DC %V Wis neg)',
        '17:Quivering Palm:combat:' +
          'Spend 3 Ki to reduce foe to 0 HP w/unarmed strike (DC %V Con 10d10 HP)'
      );
// PHB
      features.push(
        // Way Of The Four Elements Tradition
        '3:Disciple Of The Elements:magic:%V elemental disciplines',
        '3:Elemental Attunement:magic:Minor elemental manipulation',
        // Way Of The Shadow Tradition
        '3:Shadow Arts:magic:' +
          '<i>Minor Illusion</i> cantrip, spend 2 Ki to cast <i>Darkness</i>, '+
          '<i>Darkvision</i>, <i>Pass Without Trace</i>, <i>Silence</i>',
        "6:Shadow Step:magic:Teleport 60' between dim/unlit areas",
        '11:Cloak Of Shadows:magic:Invisible in dim/unlit until attack or cast',
        '17:Opportunist:combat:Attack adjacent after hit'
      );
// ENDPHB
      hitDie = 8;
      proficiencyCount = {'Save':2, 'Skill':2, 'Tool':1, 'Weapon':2};
      proficienciesGiven = {
        'Save':['Dexterity', 'Strength'],
        'Weapon':['Simple', 'Shortsword']
      };
      proficiencyChoices = {
        'Skill':['Acrobatics', 'Athletics', 'History', 'Insight', 'Religion',
                 'Stealth'],
        'Tool':['Artisan', 'Music']
      };
      selectableFeatures = ['3:Way Of The Open Hand Tradition::'];
// PHB
      selectableFeatures.push(
        '3:Way Of The Four Elements Tradition::',
        '3:Way Of The Shadow Tradition::'
      );
      selectableFeatures.push(
        '17:Breath Of Winter:magic:Spend 6 Ki to cast <i>Cone Of Cold</i>',
        '6:Clench Of The North Wind:magic:' +
          'Spend 3 Ki to cast <i>Hold Person</i>',
        '11:Eternal Mountain Defense:magic:Spend 5 Ki to cast <i>Stoneskin</i>',
        '3:Fangs Of The Fire Snake:magic:' +
          "Spend 1 Ki to have unarmed attack reach 10', do 1d10 HP fire extra",
        '3:Fist Of Four Thunders:magic:Spend 2 Ki to cast <i>Thunderwave</i>',
        '3:Fist Of Unbroken Air:magic:' +
          "R30' Spend 2 Ki to create air blast 3d10 HP, push 20' and knock prone (DC %V Str half)",
        '11:Flames Of The Phoenix:magic:Spend 4 Ki to cast <i>Fireball</i>',
        '6:Gong Of The Summit:magic:Spend 3 Ki to cast <i>Shatter</i>',
        '11:Mist Stance:magic:Spend 4 Ki to cast self <i>Gaseous Form</i>',
        '11:Ride The Wind:magic:Spend 4 Ki to cast self <i>Fly</i>',
        '17:River Of Hungry Flame:magic:Spend 5 Ki to cast <i>Wall Of Fire</i>',
        '3:Rush Of The Gale Spirits:magic:' +
          'Spend 2 Ki to cast <i>Gust Of Wind</i>',
        '3:Shape The Flowing River:magic:' +
          "R120' Freeze, thaw, shape 30'x30' water",
        '3:Sweeping Cinder Strike:magic:' +
          'Spend 2 Ki to cast <i>Burning Hands</i>',
        '3:Water Whip:magic:' +
          "R30' Spend 2 Ki to create water whip 3d10 HP, pull 25' or knock prone (DC %V Str half)",
        '17:Wave Of The Rolling Earth:magic:' +
          'Spend 6 Ki to cast <i>Wall Of Stone</i>'
      );
// ENDPHB
      spellAbility = null;
      spellsKnown = null;
      spells = null;
      spellSlots = null;

      rules.defineRule('abilityNotes.improvedUnarmoredMovementFeature',
        'armor', '?', 'source == "None"',
        'shield', '?', 'source == "None"'
      );
      rules.defineRule
        ('abilityNotes.slowFallFeature', 'levels.Monk', '=', 'source * 5');
      // Show Unarmored Movement note properly even if armor != "None"
      rules.defineRule('abilityNotes.unarmoredMovementFeature',
        'levels.Monk', '=', 'Math.floor((source + 6) / 4) * 5'
      );
      rules.defineRule('abilityNotes.unarmoredMovementFeature.1',
        'armor', '?', 'source == "None"',
        'shield', '?', 'source == "None"',
        'abilityNotes.unarmoredMovementFeature', '=', null
      );
      rules.defineRule('armorClass',
        'combatNotes.monkUnarmoredDefenseFeature.1', '+', null
      );
      rules.defineRule
        ('attacksPerRound', 'combatNotes.extraAttackFeature', '+', null);
      rules.defineRule('combatNotes.deflectMissilesFeature',
        'levels.Monk', '=', null,
        'dexterityModifier', '+', null
      );
      rules.defineRule('combatNotes.extraAttackFeature',
        'levels.Monk', '+=', 'source < 5 ? null : 1'
      );
      rules.defineRule('combatNotes.martialArtsFeature',
        'levels.Monk', '=', 'Math.floor((source + 13)/ 3)'
      );
      rules.defineRule('combatNotes.martialArtsFeature.1',
        'monkFeatures.Martial Arts', '?', null,
        'dexterityModifier', '=', 'source',
        'strengthModifier', '+', '-source',
        '', '^', '0'
      );
      // Show Unarmored Defense note even if armor != None or wisMod = 0
      rules.defineRule('combatNotes.monkUnarmoredDefenseFeature.1',
        'combatNotes.monkUnarmoredDefenseFeature', '?', null,
        'wisdomModifier', '=', null
      );
      rules.defineRule('combatNotes.monkUnarmoredDefenseFeature.2',
        'combatNotes.monkUnarmoredDefenseFeature', '?', null,
        'armor', '?', 'source == "None"',
        'combatNotes.monkUnarmoredDefenseFeature.1', '=', null
      );
      rules.defineRule
        ('combatNotes.openHandTechniqueFeature', 'kiSaveDC', '=', null);
      rules.defineRule
        ('combatNotes.quiveringPalmFeature', 'kiSaveDC', '=', null);
      rules.defineRule
        ('combatNotes.stunningStrikeFeature', 'kiSaveDC', '=', null);
      rules.defineRule('featureNotes.kiFeature', 'levels.Monk', '=', null);
      rules.defineRule
        ('featureNotes.wholenessOfBodyFeature', 'levels.Monk', '=', 'source*3');
      rules.defineRule('kiSaveDC',
        'monkFeatures.Ki', '?', null,
        'proficiencyBonus', '=', '8 + source',
        'wisdomModifier', '+', null
      );
      rules.defineRule('magicNotes.tranquilityFeature', 'kiSaveDC', '=', null);
      rules.defineRule('monkMeleeAttackBonus',
        'armor', '?', 'source == "None"',
        'dexterityModifier', '=', null,
        'strengthModifier', '+', '-source',
        '', '^', '0'
      );
      rules.defineRule('monkMeleeDamageBonus',
        'armor', '?', 'source == "None"',
        'dexterityModifier', '=', null,
        'strengthModifier', '+', '-source',
        '', '^', '0'
      );
      rules.defineRule('monkMeleeDieBonus',
        'armor', '?', 'source == "None"',
        'combatNotes.martialArtsFeature', '=', '"1d" + source'
      );
      for(var ability in {'Charisma':'', 'Constitution':'', 'Dexterity':'',
                          'Intelligence':'', 'Strength':'', 'Wisdom':''}) {
        rules.defineRule('saveProficiencies.' + ability,
          'saveNotes.diamondSoulFeature', '=', '1'
        );
      }
      rules.defineRule('selectableFeatureCount.Monk',
        'levels.Monk', '=', 'source < 3 ? null : 1'
      );
      rules.defineRule
        ('speed', 'abilityNotes.unarmoredMovementFeature.1', '+', null);
// PHB
      rules.defineRule('magicNotes.discipleOfTheElementsFeature',
        'levels.Monk', '=', 'source<6 ? 1 : source<11 ? 2 : source<17 ? 3 : 4'
      );
      rules.defineRule
        ('magicNotes.fistOfUnbrokenAirFeature', 'kiSaveDC', '=', null);
      rules.defineRule('magicNotes.waterWhipFeature', 'kiSaveDC', '=', null);
      rules.defineRule('selectableFeatureCount.Monk',
        'magicNotes.discipleOfTheElementsFeatures', '+', null
      );
// ENDPHB

      for(var feature in {
        'Open Hand Technique':'', 'Quivering Palm':'', 'Tranquility':'',
        'Wholeness Of Body':''
      }) {
        rules.defineRule('monkFeatures.' + feature,
          'monkFeatures.Way Of The Open Hand Tradition', '?', null
        );
      }

// PHB
      rules.defineRule('monkFeatures.Disciple Of The Elements',
        'monkFeatures.Way Of The Four Elements Tradition', '?', null
      );
      for(var feature in {
        'Cloak Of Shadows':'', 'Opportunist':'', 'Shadow Arts':'',
        'Shadow Step':''
      }) {
        rules.defineRule('monkFeatures.' + feature,
          'monkFeatures.Way Of The Shadow Tradition', '?', null
        );
      }
      for(var feature in {
        'Breath Of Winter':'', 'Clench Of The North Wind':'',
        'Eternal Mountain Defense':'', 'Fangs Of The Fire Snake':'',
        'Fist Of Four Thunders':'', 'Fist Of Unbroken Air':'',
        'Flames Of The Phoenix':'', 'Gong Of The Summit':'',
        'Mist Stance':'', 'Ride The Wind':'', 'River Of Hungry Flame':'',
        'Rush Of The Gale Spirits':'', 'Shape The Flowing River':'',
        'Sweeping Cinder Strike':'', 'Water Whip':'', 'Wave Of Rolling Earth':''
      }) {
        rules.defineNote
          ('validationNotes.monk' + feature.replace(/ /g, '') + 'SelectableFeatureFeatures:Requires Way Of The Four Elements Tradition');
      }
// ENDPHB


    } else if(name == 'Paladin') {

      features = [
        '1:Armor Proficiency (Light/Medium/Heavy/Shield)::',
        '1:Weapon Proficiency (Simple/Martial)::',
        '1:Divine Sense:magic:' +
          "R60' Know location of celestials, fiends, undead %V/long rest",
        '1:Lay On Hands:magic:Heal %V HP, disease, poison 1/long rest',
        '2:Divine Smite:combat:Expend spell for +2d8 up to +5d8 damage',
        '2:Spellcasting::',
        '3:Channel Divinity:feature:Effect %V/short rest',
        '3:Divine Health:save:Immune disease',
        '5:Extra Attack:combat:%V additional attack(s) per Attack action',
        "6:Aura Of Protection:save:R%V' +%1 saves self and allies",
        "10:Aura Of Courage:save:R%V' Self and allies immune fright",
        '11:Improved Divine Smite:combat:+1d8 melee damage',
        '14:Cleansing Touch:magic:Touch dispels %V/long rest',
        // Oath Of Devotion
        '3:Sacred Weapon:combat:' +
          "Channel Divinity for weapon +%V attack, 20' light for 1 min",
        '3:Turn The Unholy:magic:' +
          "R30' Channel Divinity for fiends, undead flee for 1 min (DC %V Wis neg)",
        "7:Aura Of Devotion:save:R%V' Self and allies immune charm",
        '15:Purity Of Spirit:magic:' +
          'Self continuous <i>Protection From Evil And Good</i>',
        '20:Holy Nimbus:magic:' +
          "Self 30' bright light does 10 HP to foes 1/long rest",
        '20:Holy Nimbus:save:Adv vs. spells by fiends, undead'
      ];
// PHB
      features.push(
        // Oath Of The Ancients
        "3:Nature's Wrath:magic:" +
         "R10' Channel energy for vines ensnare foe (DC %V Dex or Str neg)",
        '3:Turn The Faithless:magic:' +
          "R30' Channel energy for fiends, fey flee for 1 min (DC %V Wis neg)",
        "7:Aura Of Warding:save:R%V' Self, allies resist spell damage",
        '15:Undying Sentinel:combat:Keep 1 HP when brought to 0 HP 1/long rest',
        '20:Elder Champion:magic:' +
          "Transform, regain 10 HP/turn, cast as bonus action, foes w/in 10' save Disadv 1/long rest",
        // Oath Of Vengeance
        '3:Abjure Enemy:magic:' +
          "R60' Channel Divinity for target halted 1 min (DC %V Wis half)",
        '3:Vow Of Enmity:combat:' +
          "R10' Channel Divinity for Adv attacks against target for 1 min",
        '7:Relentless Avenger:combat:Move half speed after OA hit',
        '15:Soul Of Vengeance:combat:Attack Vow Of Enmity target as reaction',
        '20:Avenging Angel:magic:' +
          "Fly 60', 30' foes fright (DC %V Wis neg) 1 hr/long rest"
      );
// ENDPHB
      hitDie = 10;
      proficiencyCount = {'Save':2, 'Skill':2, 'Armor':4, 'Weapon':2};
      proficienciesGiven = {
        'Save':['Charisma', 'Wisdom'],
        'Armor':['Light', 'Medium', 'Heavy', 'Shield'],
        'Weapon':['Simple', 'Martial']
      };
      proficiencyChoices = {
        'Skill':['Athletics', 'Insight', 'Intimidation', 'Medicine',
                 'Persuasion', 'Religion']
      };
      selectableFeatures = [
        '2:Defense Style:combat:+1 AC in armor',
        '2:Dueling Style:combat:+2 damage with single, one-hand weapon',
        '2:Great Weapon Fighting Style:combat:' +
          'Reroll damage of 1 or 2 with two-handed weapons',
        '2:Protection Style:combat:' +
          'Use shield to impose attack Disadv on adjacent foe'
      ];
      selectableFeatures.push('3:Oath Of Devotion::');
// PHB
      selectableFeatures.push(
        '3:Oath Of The Ancients::',
        '3:Oath Of Vengeance::'
      );
// ENDPHB
      spellAbility = 'wisdom';
      spellsKnown = [
        'P1:2:"all"', 'P2:5:"all"', 'P3:9:"all"', 'P4:13:"all"', 'P5:17:"all"'
      ];
      spells = {
        'paladinFeatures.Oath Of Devotion':[
          '3:Protection From Evil And Good:Sanctuary',
          '5:Lesser Restoration:Zone Of Truth',
          '9:Beacon Of Hope:Dispel Magic',
          '13:Freedom Of Movement:Guardian Of Faith',
          '17:Commune:Flame Strike'
        ]
      };
// PHB
      Object.assign(spells, {
        'paladinFeatures.Oath Of The Ancients':[
          '3:Ensnaring Strike:Speak With Animals',
          '5:Moonbeam:Misty Step',
          '9:Plant Growth:Protection From Energy',
          '13:Ice Storm:Stoneskin',
          '17:Commune With Nature:Tree Stride',
        ],
        'paladinFeatures.Oath Of Vengeance':[
          "3:Bane:Hunter's Mark",
          '5:Hold Person:Misty Step',
          '9:Haste:Protection From Energy',
          '13:Banishment:Dimension Door',
          '17:Hold Monster:Scrying'
        ]
      });
// ENDPHB
      spellSlots = [
        'P1:2:2/3:3/5:4',
        'P2:5:2/7:3',
        'P3:9:2/11:3',
        'P4:13:1/15:2/17:3',
        'P5:17:1/19:2'
      ];

      rules.defineRule
        ('armorClass', 'combatNotes.defenseStyleFeature.1', '+', null);
      rules.defineRule
        ('attacksPerRound', 'combatNotes.extraAttackFeature', '+', null);
      rules.defineRule('casterLevels.P',
        'levels.Paladin', '=', 'source < 2 ? null : source',
         'magicNotes.casterLevelBonusFeature', '+', null
      );
      rules.defineRule('casterLevelDivine', 'casterLevels.P', '+=', null);
      // Show Defense Style note even if armor == None
      rules.defineRule('combatNotes.defenseStyleFeature.1',
        'combatNotes.defenseStyleFeature', '?', null,
        'armor', '=', 'source == "None" ? null : 1'
      );
      rules.defineRule('combatNotes.extraAttackFeature',
        'levels.Paladin', '+=', 'source < 5 ? null : 1'
      );
      rules.defineRule
        ('featureNotes.channelDivinityFeature', 'levels.Paladin', '=', '1');
      rules.defineRule('magicNotes.cleansingTouchFeature',
        'charismaModifier', '=', 'Math.max(source, 1)'
      );
      rules.defineRule
        ('magicNotes.divineSenseFeature', 'charismaModifier', '=', 'source+1');
      rules.defineRule
        ('magicNotes.layOnHandsFeature', 'levels.Paladin', '=', 'source*5');
      rules.defineRule('oathSaveDC',
        'proficiencyBonus', '=', '8 + source',
        'charismaModifier', '+', null
      );
      rules.defineRule('saveNotes.auraOfCourageFeature',
        'levels.Paladin', '=', 'source < 18 ? 10 : 30'
      );
      rules.defineRule('saveNotes.auraOfDevotionFeature',
        'levels.Paladin', '=', 'source < 18 ? 10 : 30'
      );
      rules.defineRule('saveNotes.auraOfProtectionFeature',
        'levels.Paladin', '=', 'source < 18 ? 10 : 30'
      );
      rules.defineRule('saveNotes.auraOfProtectionFeature.1',
        'charismaModifier', '=', 'Math.max(source, 1)'
      );
      rules.defineRule('selectableFeatureCount.Paladin',
        'levels.Paladin', '=', 'source < 2 ? null : source < 3 ? 1 : 2'
      );

      for(var feature in {
        'Aura Of Devotion':'', 'Holy Nimbus':'', 'Purity Of Spirit':'',
        'Sacred Weapon':'', 'Turn The Unholy':''
      }) {
        rules.defineRule('paladinFeatures.' + feature,
          'paladinFeatures.Oath Of Devition', '?', null
        );
      }
      rules.defineRule('combatNotes.sacredWeaponFeature',
        'charismaModifier', '=', 'Math.max(source, 1)'
      );
      rules.defineRule
        ('magicNotes.turnTheUnholyFeature', 'oathSaveDC', '=', null);

// PHB
      for(var feature in {
        'Aura Of Warding':'', 'Elder Champion':'', "Nature's Wrath":'',
        'Turn The Faithless':'', 'Undying Sentinel':''
      }) {
        rules.defineRule('paladinFeatures.' + feature,
          'paladinFeatures.Oath Of The Ancients', '?', null
        );
      }
      rules.defineRule
        ("magicNotes.nature'sWrathFeature", 'oathSaveDC', '=', null);
      rules.defineRule
        ('magicNotes.turnTheFaithlessFeature', 'oathSaveDC', '=', null);
      rules.defineRule('saveNotes.auraOfWardingFeature',
        'levels.Paladin', '=', 'source < 18 ? 10 : 30'
      );

      for(var feature in {
        'Abjure Enemy':'', 'Avenging Angel':'', 'Relentless Avenger':'',
        'Soul Of Vengeance':'', 'Vow Of Enmity':''
      }) {
        rules.defineRule('paladinFeatures.' + feature,
          'paladinFeatures.Oath Of Vengeance', '?', null
        );
      }
      rules.defineRule
        ('magicNotes.abjureEnemyFeature', 'oathSaveDC', '=', null);
      rules.defineRule
        ('magicNotes.avengingAngelFeature', 'oathSaveDC', '=', null);
// ENDPHB

    } else if(name == 'Ranger') {

      features = [
        '1:Armor Proficiency (Light/Medium/Shield)::',
        '1:Weapon Proficiency (Simple/Martial)::',
        '1:Favored Enemy:skill:' +
          'Adv Survival to track, Knowledge about %V creature types, learn enemy language',
        '1:Natural Explorer:skill:Dbl Int/Wis Prof, normal move in difficult terrain, always alert, full speed solo stealth, locate dbl food, extra track info for %V terrains',
        '2:Spellcasting::',
        '3:Primeval Awareness:magic:' +
          'Expend spell to sense creatures in 1 mi (favored terrain 6 mi)',
        '5:Extra Attack:combat:%V additional attack(s) per Attack action',
        "8:Land's Stride:ability:Move normally through difficult terrain",
        "8:Land's Stride:save:Adv vs. impeding plants",
        '10:Hide In Plain Sight:skill:' +
          '+10 Dex (Stealth) to hide w/prepared camouflage',
        '14:Vanish:skill:Hide as bonus action, untrackable',
        '18:Feral Senses:combat:' +
          "No Disadv vs. invisible foe, 30' awareness of invisible creatures",
        '20:Foe Slayer:combat:+%V attack or damage vs. favored enemy'
      ];
// PHB
      features.push(
        // Beast Master Archetype
        "3:Ranger's Companion:companion:Companion beast obeys commands",
        '7:Exceptional Training:companion:' +
          'Companion can Dash, Disengage, Dodge, Help instead of attack',
        '11:Bestial Fury:companion:Companion 2 attacks/rd',
        "15:Share Spells:companion:R30' Self spell affects companion"
      );
// ENDPBH
      hitDie = 10;
      proficiencyCount = {'Armor':3, 'Save':2, 'Skill':3, 'Weapon':2};
      proficienciesGiven = {
        'Save':['Dexterity', 'Strength'],
        'Armor':['Light', 'Medium', 'Shield'],
        'Weapon':['Simple', 'Martial']
      };
      proficiencyChoices = {
        'Skill':['Animal Handling', 'Athletics', 'Insight', 'Investigation',
                 'Nature', 'Perception', 'Stealth', 'Survival']
      };
      selectableFeatures = [
        '2:Archery Style:combat:+2 ranged attack',
        '2:Defense Style:combat:+1 AC in armor',
        '2:Dueling Style:combat:+2 damage with single, one-hand weapon',
        '2:Two-Weapon Fighting Style:combat:' +
          'Add ability modifier to second attack damage'
      ];
      selectableFeatures.push('3:Hunter Archetype::');
// PHB
      selectableFeatures.push('3:Beast Master Archetype::');
// ENDPHB
      selectableFeatures.push(
        '3:Colossus Slayer:combat:+1d8 HP vs. damaged foe 1/turn',
        '3:Giant Killer:combat:React to attack adjacent lg foe after miss',
        '3:Horde Breaker:combat:Second attack on different adjacent foe',
        '7:Escape The Horde:combat:Foe Disadv on OA',
        '7:Multiattack Defense:combat:+4 AC after foe hit',
        '7:Steel Will:save:Adv vs. fright',
        "11:Volley:combat:Ranged attack any number of foes in 10' radius",
        '11:Whirlwind Attack:combat:Melee attack any number of adjacent foes',
        '15:Evasion:save:Dex save yields no damage instead of half',
        '15:Stand Against The Tide:combat:Foe miss attacks another creature',
        '15:Uncanny Dodge:combat:Use reaction for half damage',
      );
      spellAbility = 'wisdom';
      spellsKnown = [
        'R1:2:"all"', 'R2:5:"all"', 'R3:9:"all"', 'R4:13:"all"', 'R5:17:"all"'
      ];
      spells = null;
      spellSlots = [
        'R1:2:2/3:3/5:4',
        'R2:5:2/7:3',
        'R3:9:2/11:3',
        'R4:13:1/15:2/17:3',
        'R5:17:1/19:2'
      ];

      rules.defineRule
        ('armorClass', 'combatNotes.defenseStyleFeature.1', '+', null);
      rules.defineRule
        ('attacksPerRound', 'combatNotes.extraAttackFeature', '+', null);
      rules.defineRule('casterLevels.R',
        'levels.Ranger', '=', null,
         'magicNotes.casterLevelBonusFeature', '+', null
      );
      rules.defineRule('casterLevelDivine', 'casterLevels.R', '+=', null);
      // Show Defense Style note even if armor == None
      rules.defineRule('combatNotes.defenseStyleFeature.1',
        'combatNotes.defenseStyleFeature', '?', null,
        'armor', '=', 'source == "None" ? null : 1'
      );
      rules.defineRule('combatNotes.extraAttackFeature',
        'levels.Ranger', '+=', 'source < 5 ? null : 1'
      );
      rules.defineRule
        ('rangedAttack', 'combatNotes.archeryStyleFeature', '+', '2');
      rules.defineRule('skillNotes.favoredEnemyFeature',
        'levels.Ranger', '=', 'source < 6 ? 1 : source < 14 ? 2 : 3'
      );
      rules.defineRule
        ('combatNotes.foeSlayerFeature', 'wisdomModifier', '=', null);
      rules.defineRule('hunterSelectableFeatureCount',
        'rangerFeatures.Hunter', '?', null,
        'levels.Ranger', '=', 'source<3 ? 0 : source<7 ? 1 : source<11 ? 2 : 3'
      );
      rules.defineRule('selectableFeatureCount.Ranger',
        'levels.Ranger', '=', 'source < 2 ? 0 : source < 3 ? 1 : 2',
        'hunterSelectableFeatureCount', '+', null
      );
      rules.defineRule('skillNotes.naturalExplorerFeature',
        'levels.Ranger', '=', 'source < 6 ? 1 : source < 10 ? 2 : 3'
      );

      for(var feature in {
        'Colossus Slayer':'', 'Escape The Horde':'', 'Evasion':'',
        'Giant Killer':'', 'Horde Breaker':'', 'Multiattack Defense':'',
        'Stand Against The Tide':'', 'Steel Will':'', 'Uncanny Dodge':'',
        'Volley':'', 'Whirlwind Attack':''
      }) {
        rules.defineRule('rangerFeatures.' + feature,
          'rangerFeatures.Hunter Archetype', '?', null
        );
      }

// PHB
      for(var feature in {
        'Bestial Fury':'', "Ranger's Companion":'', 'Exceptional Training':'',
        'Share Spells':''
      }) {
        rules.defineRule('rangerFeatures.' + feature,
          'rangerFeatures.Beast Master Archetype', '?', null
        );
      }
      rules.defineRule('rangerFeatures.Bestial Fury',
        'rangerFeatures.Beast Master', '?', null
      );
      rules.defineRule("rangerFeatures.Ranger's Companion",
        'rangerFeatures.Beast Master', '?', null
      );
      rules.defineRule('rangerFeatures.Exceptional Training',
        'rangerFeatures.Beast Master', '?', null
      );
      rules.defineRule('rangerFeatures.Share Spells',
        'rangerFeatures.Beast Master', '?', null
      );
// ENDPHB

    } else if(name == 'Rogue') {

      features = [
        '1:Armor Proficiency (Light)::',
        '1:Weapon Proficiency (Simple/Hand Crossbow/Longsword/Rapier/Shortsword)::',
        "1:Tool Proficiency (Thieves' Tools)::",
        '1:Expertise:skill:Dbl %V skill/tool Prof',
        '1:Sneak Attack:combat:+%Vd6 damage on Adv/flanked attacks',
        "1:Thieves' Cant:skill:Signs and symbols known only by rogues",
        '2:Cunning Action:combat:Bonus Dash, Disengage, or Hide each turn',
        '5:Uncanny Dodge:combat:Use reaction for half damage',
        '7:Evasion:save:Dex save yields no damage instead of half',
        '11:Reliable Talent:skill:Min 10 roll on Prof skills',
        "14:Blindsense:skill:R10' Hear hidden/invisible creatures",
        '15:Slippery Mind:save:Prof Wis',
        '18:Elusive:combat:Foe attacks never have Adv',
        '20:Stroke Of Luck:ability:Automatic 20 ability check 1/short rest',
        '20:Stroke Of Luck:combat:Turn miss into hit 1/short rest',
        // Thief Archetype
        '3:Fast Hands:skill:' +
          'Sleight Of Hand, disarm trap, open lock, Use An Object as bonus action',
        '3:Second-Story Work:ability:Normal movement when climbing',
        "3:Second-Story Work:skill:+%V' Jump",
        '9:Supreme Sneak:skill:Adv Stealth at half speed',
        '13:Use Magic Device:skill:Ignore restrictions on magic device use',
        "17:Thief's Reflexes:combat:First round extra turn at init-10"
      ];
// PHB
      features.push(
        // Assassin Archetype
        "3:Assassin Proficiencies:feature:Prof Disguise Kit/Poisoner's Kit",
        '3:Assassinate:combat:Adv when foe has not acted, crit on surprise hit',
        '9:Infiltration Expertise:feature:Forge and adopt different identity',
        '13:Imposter:feature:Unerring mimicry',
        '17:Death Strike:combat:Dbl damage on surprise hit (DC %V Dex neg)',
        // Arcane Trickster Archetype
        '3:Spellcasting::',
        '3:Mage Hand Legerdemain:magic:' +
          'Plant, retrieve, pick, disarm via <i>Mage Hand</i>',
        '9:Magical Ambush:magic:Foe Disadv spell save when self hidden',
        '13:Versatile Trickster:magic:' +
          'Distract foe (self Adv attacks) via <i>Mage Hand</i>',
        '17:Spell Thief:magic:' +
          'Foe spell negated, self cast w/in 8 hours (DC %V neg) 1/long rest'
      );
// ENDPHB
      hitDie = 8;
      proficiencyCount =
        {'Armor':1, 'Save':2, 'Skill':4, 'Tool':1, 'Weapon':5};
      proficienciesGiven = {
        'Armor':['Light'],
        'Save':['Dexterity', 'Intelligence'],
        'Tool':["Thieves' Tools"],
        'Weapon':['Simple','Hand Crossbow','Longsword','Rapier','Shortsword']
      };
      proficiencyChoices = {
        'Skill':['Acrobatics', 'Athletics', 'Deception', 'Insight',
                 'Intimidation', 'Investigation', 'Perception', 'Performance',
                 'Persuasion', 'Sleight Of Hand', 'Stealth']
      };
      selectableFeatures = ['3:Thief::'];
// PHB
      selectableFeatures.push('3:Arcane Trickster::', '3:Assassin::');
// ENDPHB
      spellAbility = null;
      spellsKnown = null;
      spells = null;
      spellSlots = null;
// PHB
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
         'magicNotes.casterLevelBonusFeature', '+', null
      );
      rules.defineRule('casterLevels.W', 'casterLevels.Ro', '^=', null);
      rules.defineRule('casterLevelArcane', 'casterLevels.W', '+=', null);
      rules.defineRule('spellsKnownLevel.Rogue',
        'rogueFeatures.Arcane Trickster Archetype', '?', null
      );
      rules.defineRule('spellAttackModifier.Rogue',
        'rogueFeatures.Arcane Trickster Archetype', '?', null
      );
// ENDPHB

      rules.defineRule('combatNotes.sneakAttackFeature',
        'levels.Rogue', '=', 'Math.floor((source + 7) / 4)'
      );
      rules.defineRule('selectableFeatureCount.Rogue',
        'levels.Rogue', '=', 'source < 3 ? null : 1'
      );
      rules.defineRule('skillNotes.expertiseFeature',
        'levels.Rogue', '=', 'source < 6 ? 2 : 4'
      );
      rules.defineRule('skillProficiencies.Wisdom',
        'skillNotes.slipperyMindFeature', '=', '1'
      );

      for(var feature in {
        'Fast Hands':'', 'Second-Story Work':'', 'Supreme Sneak':'',
        "Thief's Reflexes":'', 'Use Magic Device':''
      }) {
        rules.defineRule('rogueFeatures.' + feature,
          'rogueFeatures.Thief Archetype', '?', null
        );
      }
      rules.defineRule('skillNotes.second-StoryWorkFeature',
        'dexterityModifier', '=', null
      );

// PHB
      for(var feature in {
        'Assassin Proficiencies':'', 'Assassinate':'', 'Death Strike':'',
        'Imposter':'', 'Infiltration Expertise':''
      }) {
        rules.defineRule('rogueFeatures.' + feature,
          'rogueFeatures.Assassin Archetype', '?', null
        );
      }
      rules.defineRule('combatNotes.deathStrikeFeature',
        'dexterityModifier', '=', '8 + source',
        'proficiencyBonus', '+', null
      );
      rules.defineRule('toolProficiencies.Disguise Kit',
        'skillNotes.slipperyMindFeature', '=', '1'
      );
      rules.defineRule("toolProficiencies.Poisoner's Kit",
        'skillNotes.slipperyMindFeature', '=', '1'
      );

      for(var feature in {
        'Mage Hand Legerdemain':'', 'Magical Ambush':'', 'Spell Thief':'',
        'Spellcasting':'', 'Versatile Trickster':''
      }) {
        rules.defineRule('rogueFeatures.' + feature,
          'rogueFeatures.Arcane Trickster Archetype', '?', null
        );
      }
      rules.defineRule('magicNotes.spellThiefFeature',
        'intelligenceModifier', '=', '8 + source',
        'proficiencyBonus', '+', null
      );
// ENDPHB

    } else if(name == 'Sorcerer') {

      features = [
        '1:Weapon Proficiency (Dagger/Dart/Sling/Quarterstaff/Light Crossbow)::',
        '1:Spellcasting::',
        '2:Font Of Magic:magic:%V Sorcery pts/long rest',
        '2:Flexible Casting:magic:Convert sorcery pts to/from spell slots',
        '20:Sorcerous Restoration:magic:Regain 4 sorcery pts/short rest',
        // Draconic Bloodline
        '1:Draconic Resilience:combat:+%V HP, unarmored AC %1',
        '6:Elemental Affinity:magic:' +
          '+%V HP damage with ancestry type, spend 1 sorcery pt for 1 hr resistance',
        '14:Dragon Wings:ability:Fly at full speed',
        "18:Draconic Presence:feature:R60' Spend 5 sorcery pts for awe/fear aura for 1 min/conc (DC %V Wis neg)"
      ];
// PHB
      features.push(
        // Wild Magic
        '1:Wild Magic Surge:magic:5% chance of random magic effect',
        '1:Tides Of Chaos:feature:Adv on attack, ability, or save 1/long rest,may cause surge',
        '6:Bend Luck:magic:' +
          'Spend 2 sorcery pts to add or subtract 1d4 from target roll',
        '14:Controlled Chaos:magic:Reroll wild magic surge effect',
        '18:Spell Bombardment:magic:Add another die to maximum damage 1/turn'
      );
// ENDPHB
      hitDie = 6;
      proficiencyCount = {'Save':2, 'Skill':2, 'Weapon':5};
      proficienciesGiven = {
        'Save':['Charisma', 'Constitution'],
        'Weapon':['Dagger', 'Dart', 'Sling', 'Quarterstaff', 'Light Crossbow']
      };
      proficiencyChoices = {
        'Skill':['Arcana', 'Deception', 'Insight', 'Intimidation', 'Persuasion',
                 'Religion']
      };
      selectableFeatures = [
        '1:Draconic Bloodline::',
        '3:Careful Spell:magic:' +
          'Spend 1 sorcery pt to give %V creatures save on your spell',
        '3:Distant Spell:magic:' +
          "Spend 1 sorcery pt to dbl spell range or touch at 30'",
        '3:Empowered Spell:magic:' +
          'Spend 1 sorcery pt to reroll %V spell damage dice',
        '3:Extended Spell:magic:Spend 1 sorcery point to dbl spell duration',
        '3:Heightened Spell:magic:' +
          'Spend 3 sorcery pts for target Disadv on spell save',
        '3:Quickened Spell:magic:' +
          'Spend 2 sorcery pts to cast spell as bonus action',
        '3:Subtle Spell:magic:' +
          'Spend 1 sorcery pt to cast w/out somatic, verbal components',
        '3:Twinned Spell:magic:' +
          'Spend spell level sorcery pts to add second target'
      ];
// PHB
      selectableFeatures.push('1:Wild Magic::');
// ENDPHB
      spellAbility = 'charisma';
      spellsKnown = [
        'S0:1:4/4:5/10:6',
        'S:1:2/2:3/3:4/4:5/5:6/6:7/7:8/8:9/9:10/10:11/11:12/13:13/15:14/17:15'
      ];
      spells = null;
      spellSlots = [
        'S1:1:2/2:3/3:4',
        'S2:3:2/4:3',
        'S3:5:2/6:3',
        'S4:7:1/8:2/9:3',
        'S5:9:1/10:2/18:3',
        'S6:11:1/19:2',
        'S7:13:1/20:2',
        'S8:15:1',
        'S9:17:1'
      ];

      rules.defineRule('casterLevels.S',
        'levels.Sorcerer', '=', null,
         'magicNotes.casterLevelBonusFeature', '+', null
      );
      rules.defineRule('casterLevelArcane', 'casterLevels.S', '+=', null);
      rules.defineRule('magicNotes.carefulSpellFeature',
        'charismaModifier', '=', 'Math.max(source, 1)'
      );
      rules.defineRule('magicNotes.empoweredSpellFeature',
        'charismaModifier', '=', 'Math.max(source, 1)'
      );
      rules.defineRule
        ('magicNotes.fontOfMagicFeature', 'levels.Sorcerer', '=', null);
      rules.defineRule('selectableFeatureCount.Sorcerer',
        'levels.Sorcerer', '=', 'source<3?1 : source<10?3 : source<17?4 : 5'
      );

      for(var feature in {
        'Draconic Resilience':'', 'Draconic Presence':'', 'Dragon Wings':'',
        'Elemental Affinity':''
      }) {
        rules.defineRule('sorcererFeatures.' + feature,
          'sorcererFeatures.Draconic Bloodline', '?', null
        );
      }
      rules.defineRule
        ('armorClass', 'combatNotes.draconicResilienceFeature.2', '^', null);
      rules.defineRule
        ('combatNotes.draconicResilienceFeature', 'levels.Sorcerer', '=', null);
      rules.defineRule
        ('hitPoints', 'combatNotes.draconicResilienceFeature', '+', null);
      rules.defineRule('combatNotes.draconicResilienceFeature.1',
        'combatNotes.draconicResilienceFeature', '?', null,
        'dexterityModifier', '=', 'source + 13'
      );
      rules.defineRule('combatNotes.draconicResilienceFeature.2',
        'armor', '?', 'source == "None"',
        'combatNotes.draconicResilienceFeature.1', '=', null
      );
      rules.defineRule('featureNotes.draconicPresenceFeature',
        'charismaModifier', '=', '8 + source',
        'proficiencyBonus', '+', null
      );
      rules.defineRule('magicNotes.elementalAffinityFeature',
        'charismaModifier', '=', null
      );
// PHB
      for(var feature in {
        'Bend Luck':'', 'Controlled Chaos':'', 'Spell Bombardment':'',
        'Tides Of Chaos':'', 'Wild Magic Surge':''
      }) {
        rules.defineRule('sorcererFeatures.' + feature,
          'sorcererFeatures.Wild Magic', '?', null
        );
      }
// ENDPHB

    } else if(name == 'Warlock') {

      features = [
        '1:Armor Proficiency (Light)::',
        '1:Weapon Proficiency (Simple)::',
        '1:Otherworldly Patron::TODO',
        '1:Pact Magic::', // TODO "Arcane Focus"?
        '2:Eldritch Invocations:magic:%V',
        '11:Mystic Arcanum:magic:Warlock spells %V 1/long rest',
        '20:Eldritch Master:magic:Regain spells from patron 1/long rest',
        // Fiend Patron
        "1:Dark One's Blessing:combat:Gain %1 HP when foe drops to 0",
        "6:Dark One's Own Luck:feature:Add d10 to ability or save 1/short rest",
        '10:Fiendish Resilience:save:Resist chosen damage type',
        '14:Hurl Through Hell:combat:' +
          'Foe trip to hell 10d10 psychic HP 1/long rest'
      ];
// PHB
      features.push(
        // Archfey Patron
        '1:Fey Presence:magic:' +
          "R10' Creatures charm or fright 1 turn (DC %V Wis neg) 1/short rest",
        '6:Misty Escape:magic:' +
          "After damage, teleport 60' and become invisible 1 turn 1/short rest",
        '10:Beguiling Defenses:save:' +
          'Immune charm, reflect 1 min (DC %V Wis neg)',
        '14:Dark Delirium:magic:' +
          "R60' Target charm or fright 1 min, then unaware surroundings (DC %V Wis neg) 1/long rest",
        // Great Old One Patron
        "1:Awakened Mind:feature:R30' Telepathic communication",
        '6:Entropic World:combat:' +
          'Foe Disadv attack, miss gives you attack Adv 1/short rest',
        '10:Thought Shield:save:' +
          'Immune telepathy, resist and reflect psycic damage',
        '14:Create Thrall:magic:Touch charms incapacitated humanoid'
      );
// ENDPHB
      hitDie = 8;
      proficiencyCount = {'Armor':1, 'Save':2, 'Skill':2, 'Weapon':1};
      proficienciesGiven = {
        'Armor':['Light'],
        'Save':['Charisma', 'Wisdom'],
        'Weapon':['Simple']
      };
      proficiencyChoices = {
        'Skill':['Arcana', 'Deception', 'History', 'Intimidation',
                 'Investigation', 'Nature', 'Religion']
      };
      selectableFeatures = [
        '1:Fiend Patron::',
        '3:Pact Of The Blade:magic:Create magic weapon',
        '3:Pact Of The Chain:magic:<i>Find Familiar</i>',
        '3:Pact Of The Tome:magic:<i>Book Of Shadows</i> w/3 cantrips',
        '2:Agonizing Blast:magic:<i>Eldritch Blast</i> +%V HP',
        '2:Armor Of Shadows:magic:<i>Mage Armor</i> at will',
        '9:Ascendant Step:magic:<i>Levitate</i> at will',
        '2:Beast Speech:magic:<i>Speak With Animals</i> at will',
        '2:Beguiling Influence:skill:Prof Deception, Persuasion',
        '7:Bewitching Whispers:magic:<i>Compulsion</i> 1/long rest',
        '2:Book Of The Ancients:magic:Inscribe rituals in Book Of Shadows',
        '15:Chains Of Carceri:magic:' +
          '<i>Hold Monster</i> on celetial, elemental, fiend 1/long rest',
        "2:Devil's Sight:feature:R120' See 1 light level better",
        '7:Dreadful Word:magic:<i>Confusion</i> 1/long rest',
        '2:Eldritch Sight:magic:<i>Detect Magic</i> at will',
        "2:Eldritch Spear:magic:<i>R300' Eldritch Blast</i>",
        '2:Eyes Of The Rune Keeper:feature:Read all writing',
        '2:Fiendish Vigor:magic:Self <i>False Life</i> at will',
        '2:Gaze Of Two Minds:magic:' +
          "Perceive via willing touched senses for 1 turn",
        '12:Lifedrinker:combat:+%V HP with pact weapon',
        '2:Mask Of Many Faces:magic:<i>Disguise Self</i> at will',
        '15:Master Of Myriad Forms:magic:<i>Alter Self</i> at will',
        '9:Minions Of Chaos:magic:>Conjure Elemental</i> 1/long rest',
        '2:Misty Visions:magic:<i>Silent Image</i> at will',
        '5:Mire The Mind:magic:<i>Slow</i> 1/long rest',
        '5:One With Shadows:magic:Invisible in dim light until action',
        '9:Otherworldly Leap:magic:Self <i>Jump</i> at will',
        "2:Repelling Blast:magic:<i>Eldritch Blast</i> pushes 10'",
        '7:Sculptor Of Flesh:magic:<i>Polymorph</i> 1/long rest',
        '5:Sign Of Ill Omen:magic:<i>Bestow Curse</i> 1/long rest',
        '2:Thief Of Five Fates:magic:<i>Bane</i> 1/long rest',
        '5:Thirsting Blade:combat:Attack twice each turn',
        '15:Visions Of Distant Realms:magic:<i>Arcane Eye</i> at will',
        '2:Voice Of The Chain Master:companion:Perceive, speak via familiar',
        '9:Whispers Of The Grave:magic:<i>Speak With Dead</i> at will',
        "15:Witch Sight:feature:R30' See true forms"
      ];
// PHB
      selectableFeatures.push(
        '1:Archfey Patron::',
        '1:Great Old One Patron::'
      );
// ENDPHB
      spellAbility = 'charisma';
      spellsKnown = [
        'K0:1:2/4:3/10:4',
        'K:1:1/2:2/11:3/17:4'
      ];
      spells = null;
      spellSlots = [
        'K1:1:1/2:2/3:0',
        'K2:3:2/5:0',
        'K3:5:2/7:0',
        'K4:7:2/9:0',
        'K5:9:2/11:3/17:4'
      ];

      rules.defineRule
        ('attacksPerRound', 'combatNotes.thirstingBladeFeature', '+', '1');
      rules.defineRule('casterLevels.K',
        'levels.Warlock', '=', null,
         'magicNotes.casterLevelBonusFeature', '+', null
      );
      rules.defineRule('casterLevelArcane', 'casterLevels.K', '+=', null);
      rules.defineRule('combatNotes.lifedrinkerFeature',
        'charismaModifier', '=', 'Math.max(source, 1)'
      );
      rules.defineRule
        ('magicNotes.agonizingBlastFeature', 'charismaModifier', '=', null);
      rules.defineRule('magicNotes.eldritchInvocationsFeature',
        'levels.Warlock', '=', 'source == 2 ? 2 : source < 9 ? Math.floor((source + 3) / 2) : Math.floor((source + 6) / 3)'
      );
      rules.defineRule('magicNotes.mysticArcanumFeature',
        'levels.Warlock', '=', 'source<13 ? "6" : source<15 ? "6,7" : source<17 ? "6,7,8" : "6,7,8,9"'
      );
      rules.defineRule('selectableFeatureCount.Warlock',
        'warlockFeatures.Otherworldly Patron', '=', '1',
        'warlockFeatures.Pact Boon', '+', '1',
        'magicNotes.eldritchInvocationsFeature', '+', null
      );
      rules.defineRule('skillProficiencies.Deception',
        'skillNotes.beguilingInfluenceFeature', '=', '1'
      );
      rules.defineRule('skillProficiencies.Persuasion',
        'skillNotes.beguilingInfluenceFeature', '=', '1'
      );
      rules.defineNote(
        'validationNotes.warlockBookOfAncientSecretsSelectableFeatureFeatures:Requires Pact Of The Tome',
        'validationNotes.warlockChainsOfCarceriSelectableFeatureFeatures:Requires Pact Of The Chain',
        'validationNotes.warlockThirstingBladeSelectableFeatureFeatures:Requires Pact Of The Blade',
        'validationNotes.warlockVoieOfTheChainSelectableFeatureFeatures:Requires Pact Of The Chain'
      );

      for(var feature in {
        "Dark One's Blessing":'', "Dark One's Own Luck":'',
        'Fiendish Resilience':'', 'Hurl Through Hell':''
      }) {
        rules.defineRule('warlockFeatures.' + feature,
          'warlockFeatures.Fiend Patron', '?', null
        );
      }
      rules.defineRule("combatNotes.darkOne'sBlessingFeature.1",
        "warlockFeatures.Dark One's Blessing", '?', null,
        'charismaModifier', '=', null,
        'levels.Warlock', '+', null,
        '', '^', '1'
      );

// PHB
      for(var feature in {
        'Beguiling Defenses':'', 'Dark Delirium':'', 'Fey Presence':'',
        'Misty Escape':''
      }) {
        rules.defineRule('warlockFeatures.' + feature,
          'warlockFeatures.Archfey Patron', '?', null
        );
      }
      rules.defineRule('magicNotes.darkDeliriumFeature',
        'charismaModifier', '=', '8 + source',
        'proficiencyBonus', '+', null
      );
      rules.defineRule('magicNotes.feyPresenceFeature',
        'charismaModifier', '=', '8 + source',
        'proficiencyBonus', '+', null
      );
      rules.defineRule('saveNotes.beguilingDefensesFeature',
        'charismaModifier', '=', '8 + source',
        'proficiencyBonus', '+', null
      );

      for(var feature in {
        'Awakened Mind':'', 'Create Thrall':'', 'Entropic Shield':'',
        'Thought Shield':''
      }) {
        rules.defineRule('warlockFeatures.' + feature,
          'warlockFeatures.Great Old One Patron', '?', null
        );
      }
// ENDPHB

    } else if(name == 'Wizard') {

      features = [
        '1:Weapon Proficiency (Dagger/Dart/Light Crossbow/Quarterstaff/Sling)::',
        '1:Arcane Recovery:magic:Short rest recovers %V spell slots 1/dy',
        '1:Spellcasting::',
        '18:Spell Mastery:magic:Cast 1 ea 1st, 2nd spell at will',
        '20:Signature Spell:magic:Cast 2 3rd spells 1/short rest',
        // Evocation Tradition
        '2:Evocation Savant:magic:Write evocation spells for half cost',
        '2:Sculpt Spells:magic:' +
          'Protect spell level + 1 targets from evocation spell effects',
        '6:Potent Cantrip:magic:Target takes half damage on cantrip save',
        '10:Empowered Evocation:magic:+%V HP evocation spell damage',
        '14:Overchannel:magic:' +
          'Maximize damage from evocation spell le level 5, take damage 2nd+ time/long rest'
      ];
// PHB
      features.push(
        // Abjuration Tradition
        '2:Abjuration Savant:magic:Write abjuration spells for half cost',
        '2:Arcane Ward:magic:Abjuration casting creates %V HP shield',
        "6:Projected Ward:magic:R30' Use Arcane Ward to protect others",
        '10:Improved Abjuration:magic:' +
          'Add Prof Bonus to abjuration ability checks',
        '14:Spell Resistance:magic:Adv and resistance to spell damage',
        // Conjuration Tradition
        '2:Conjuration Savant:magic:Write conjuration spells for half cost',
        "2:Minor Conjuration:magic:R10' Create 3' cu object for 1 hr",
        '6:Benign Transposition:magic:' +
          "R30' Teleport or swap willing creature 1/long rest or cast",
        '10:Focused Conjuration:magic:' +
          'Damage cannot break conjuration concentration',
        '14:Durable Summons:magic:Summoned creatures +30 HP',
        // Divination Tradition
        '2:Divination Savant:magic:Write divination spells for half cost',
        '2:Portent:magic:Replace self, other roll %V/long rest',
        '6:Expert Divination:magic:' +
          'Regain lower spell slot when cast divination spell',
        '10:The Third Eye:magic:' +
          "60' Darkvision, 60' Ethereal Sight, read any language, or 10' see invisibility",
        // Enchantment Tradition
        '2:Enchantment Savant:magic:Write enchantment spells for half cost',
        '2:Hypnotic Gaze:magic:Daze adjacent creature (DC %V Wis neg)',
        '6:Instinctive Charm:magic:' +
          'Redirect foe attack to closest creature (DC %V Wis neg)',
        '10:Split Enchantment:magic:Add second target to charm spell',
        '14:Alter Memories:magic:' +
          'Target unaware charmed, forget %V hrs (DC %1 Int neg)',
        // Illusion Tradition
        '2:Illusion Savant:magic:Write illusion spells for half cost',
        '2:Improved Minor Illusion:magic:' +
          '<i>Minor Illusion</i> with sound, image',
        '6:Malleable Illusions:magic:Transform existing illusions',
        '10:Illusory Self:magic:React causes foe miss 1/short rest',
        '14:Illusory Reality:magic:Object in illusion real for 1 min',
        // Necromancy Tradition
        '2:Necromancy Savant:magic:Write necromancy spells for half cost',
        '2:Grim Harvest:magic:' +
          'Regain 2x spell level (3x necromantic) when spell kills',
        '6:Undead Thralls:magic:' +
          '<i>Animate Dead</i> +1 corpse, +%V HP, +%1 damage',
        '10:Inured To Undeath:save:Resist necrotic, immune max HP reduction',
        "14:Command Undead:magic:R60' Take control of undead target (DC %V Cha neg (Adv intelligent undead))",
        // Transmutation Tradition
        '2:Transmutation Savant:magic:Write transmutation spells for half cost',
        "2:Minor Alchemy:magic:Transform 1 cu'/10 min for 1 hr",
        "6:Transmuter's Stone:magic:" +
          "Stone gives 60' darkvision, +10 speed, Prof Con, or resist energy",
        '10:Shapechanger:magic:<i>Polymorph</i> 1/short rest',
        '14:Master Transmuter:magic:' +
          "Destroy stone to transmute 5' cu, remove curse, disease, and poision, <i>Raise Dead</i>, or restore youth"
      );
// ENDPHB
      hitDie = 6;
      proficiencyCount = {'Save':2, 'Skill':3, 'Weapon':5};
      proficienciesGiven = {
        'Save':['Intelligence', 'Wisdom'],
        'Weapon':['Dagger', 'Dart', 'Sling', 'Quarterstaff', 'Light Crossbow']
      };
      proficiencyChoices = {
        'Skill': ['Arcana', 'History', 'Insight', 'Investigation', 'Medicine',
                  'Religion']
      };
      selectableFeatures = SRD5E.SCHOOLS.map(function(school){return '1:' + school.substring(0, school.indexOf(':')) + ' Tradition::';}),
      spellAbility = 'intelligence';
      spellsKnown = [
        'W0:1:3/4:4/10:5',
        'W:1:6/2:8/3:10/4:12/5:14/6:16/7:18/8:20/9:22/10:24/11:26/12:28/13:30/14:32/15:34/16:36/17:38/18:40/19:42/20:44'
      ];
      spells = null;
      spellSlots = [
        'W1:1:2/2:3/3:4',
        'W2:3:2/4:3',
        'W3:5:2/6:3',
        'W4:7:1/8:2/9:3',
        'W5:9:1/10:2/18:3',
        'W6:11:1/19:2',
        'W7:13:1/20:2',
        'W8:15:1',
        'W9:17:1'
      ];

      rules.defineRule('casterLevels.W',
        'levels.Wizard', '=', null,
         'magicNotes.casterLevelBonusFeature', '+', null
      );
      rules.defineRule('casterLevelArcane', 'casterLevels.W', '+=', null);
      rules.defineRule('magicNotes.arcaneRecoveryFeature',
        'levels.Wizard', '=', 'Math.ceil(source / 2)'
      );
      rules.defineRule('selectableFeatureCount.Wizard',
        'levels.Wizard', '=', 'source < 2 ? null : 1'
      );

      for(var feature in {
        'Evocation Savant':'', 'Sculpt Spells':'', 'Potent Cantrip':'',
        'Empowered Evocation':'', 'Overchannel':''
      }) {
        rules.defineRule('wizardFeatures.' + feature,
          'wizardFeatures.Evocation Tradition', '?', null
        );
      }
      rules.defineRule('magicNotes.empoweredEvocationFeature',
        'intelligenceModifier', '=', null
      );

// PHB
      for(var feature in {
        'Abjuration Savant':'', 'Arcane Ward':'', 'Projected Ward':'',
        'Improved Abjuration':'', 'Spell Resistance':''
      }) {
        rules.defineRule('wizardFeatures.' + feature,
          'wizardFeatures.Abjuration Tradition', '?', null
        );
      }
      rules.defineRule('magicNotes.arcaneWardFeature',
        'levels.Wizard', '=', 'source * 2',
        'intelligenceModifier', '+', null
      );

      for(var feature in {
        'Conjuration Savant':'', 'Minor Conjuration':'',
        'Benign Transposition':'', 'Focused Conjuration':'',
        'Durable Summons':''
      }) {
        rules.defineRule('wizardFeatures.' + feature,
          'wizardFeatures.Conjuration Tradition', '?', null
        );
      }

      for(var feature in {
        'Divination Savant':'', 'Portent':'', 'Expert Divination':'',
        'The Third Eye':'', 'Greater Portent':''
      }) {
        rules.defineRule('wizardFeatures.' + feature,
          'wizardFeatures.Divination Tradition', '?', null
        );
      }
      rules.defineRule
        ('magicNotes.portentFeature', 'levels.Wizard', 'source < 14 ? 2 : 3');

      for(var feature in {
        'Enchantment Savant':'', 'Hypnotic Gaze':'', 'Instinctive Charm':'',
        'Split Enchantment':'', 'Alter Memories':''
      }) {
        rules.defineRule('wizardFeatures.' + feature,
          'wizardFeatures.Enchantment Tradition', '?', null
        );
      }
      rules.defineRule('magicNotes.alterMemoriesFeature',
        'intelligenceModifier', '=', '8 + source',
        'proficiencyBonus', '+', null
      );
      rules.defineRule('magicNotes.alterMemoriesFeature.1',
        'charismaModifier', '=', 'Math.max(source + 1, 1)'
      );
      rules.defineRule('magicNotes.hypnoticGazeFeature',
        'intelligenceModifier', '=', '8 + source',
        'proficiencyBonus', '+', null
      );
      rules.defineRule('magicNotes.instinctiveCharmFeature',
        'intelligenceModifier', '=', '8 + source',
        'proficiencyBonus', '+', null
      );

      for(var feature in {
        'Illusion Savant':'', 'Improved Minor Illusion':'',
        'Malleable Illusions':'', 'Illusory Self':'', 'Illusory Reality':''
      }) {
        rules.defineRule('wizardFeatures.' + feature,
          'wizardFeatures.Illusion Tradition', '?', null
        );
      }

      for(var feature in {
        'Necromancy Savant':'', 'Grim Harvest':'', 'Undead Thralls':'',
        'Inured To Undeath':'', 'Command Undead':''
      }) {
        rules.defineRule('wizardFeatures.' + feature,
          'wizardFeatures.Necromancy Tradition', '?', null
        );
      }
      rules.defineRule('magicNotes.commandUndeadFeature',
        'intelligenceModifier', '=', '8 + source',
        'proficiencyBonus', '+', null
      );
      rules.defineRule
        ('magicNotes.undeadThrallsFeature', 'levels.Wizard', '=', null);
      rules.defineRule
        ('magicNotes.undeadThrallsFeature.1', 'proficiencyBonus', '=', null);

      for(var feature in {
        'Transmutation Savant':'', 'Minor Alchemy':'', "Transmuter's Stone":'',
        'Shapechanger':'', 'Master Transmuter':''
      }) {
        rules.defineRule('wizardFeatures.' + feature,
          'wizardFeatures.Transmutation Tradition', '?', null
        );
      }

// ENDPHB

    } else
      continue;

    SRD5E.defineClass(
      rules, name, hitDie, features, selectableFeatures, proficiencyCount,
      proficienciesGiven, proficiencyChoices, spellAbility, spellsKnown,
      spellSlots, spells
    );

  }

};

/* Defines the rules related to combat. */
SRD5E.combatRules = function(rules) {
  rules.defineRule('armorClass',
    '', '=', '10',
    'armor', '+', 'SRD5E.armorsArmorClassBonuses[source]',
    'shield', '+', 'source == "None" ? null : 2'
  );
  rules.defineRule('initiative', 'dexterityModifier', '=', null);
  rules.defineRule('meleeAttack', 'proficiencyBonus', '=', null);
  rules.defineRule('rangedAttack', 'proficiencyBonus', '=', null);
  for(var ability in {'Charisma':'', 'Constitution':'', 'Dexterity':'',
                      'Intelligence':'', 'Strength':'', 'Wisdom':''}) {
    rules.defineRule('saveBonus.' + ability,
      'saveProficiencies.' + ability, '?', null,
      'proficiencyBonus', '=', null
    );
    rules.defineRule('save.' + ability,
      ability.toLowerCase() + 'Modifier', '=', null,
      'saveBonus.' + ability, '+', null
    );
  }
  rules.defineRule('weapons.Unarmed', '', '=', '1');
};

/* Returns an ObjectViewer loaded with the default character sheet format. */
SRD5E.createViewers = function(rules, viewers) {
  for(var i = 0; i < viewers.length; i++) {
    var name = viewers[i];
    var viewer = new ObjectViewer();
    if(name == 'Compact') {
      viewer.addElements(
        {name: '_top', separator: '\n'},
          {name: 'Section 1', within: '_top', separator: '; '},
            {name: 'Identity', within: 'Section 1', format: '%V',
             separator: ''},
              {name: 'Name', within: 'Identity', format: '<b>%V</b>'},
              {name: 'Gender', within: 'Identity', format: ' -- <b>%V</b>'},
              {name: 'Race', within: 'Identity', format: ' <b>%V</b>'},
              {name: 'Levels', within: 'Identity', format: ' <b>%V</b>',
               separator: '/'},
            {name: 'Hit Points', within: 'Section 1', format: '<b>HP</b> %V'},
            {name: 'Initiative', within: 'Section 1', format: '<b>Init</b> %V'},
            {name: 'Speed', within: 'Section 1', format: '<b>Speed</b> %V'},
            {name: 'Armor Class', within: 'Section 1', format: '<b>AC</b> %V'},
            {name: 'Weapons', within: 'Section 1', format: '<b>%N</b> %V',
             separator: '/'},
            {name: 'Turn Undead', within: 'Section 1', separator: '/'},
            {name: 'Alignment', within: 'Section 1', format: '<b>Ali</b> %V'},
            {name: 'Damage Reduction', within: 'Section 1',
             format: '<b>DR</b> %V', separator: '/'},
            {name: 'Save', within: 'Section 1', separator: '/'},
            {name: 'Resistance', within: 'Section 1', separator: '/'},
            {name: 'Abilities', within: 'Section 1',
             format: '<b>Str/Int/Wis/Dex/Con/Cha</b> %V', separator: '/'},
              {name: 'Strength', within: 'Abilities', format: '%V'},
              {name: 'Intelligence', within: 'Abilities', format: '%V'},
              {name: 'Wisdom', within: 'Abilities', format: '%V'},
              {name: 'Dexterity', within: 'Abilities', format: '%V'},
              {name: 'Constitution', within: 'Abilities', format: '%V'},
              {name: 'Charisma', within: 'Abilities', format: '%V'},
          {name: 'Section 2', within: '_top', separator: '; '},
            {name: 'Skill Modifier', within: 'Section 2', separator: '/'},
            {name: 'Feats', within: 'Section 2', separator: '/'},
            {name: 'Languages', within: 'Section 2', separator: '/'},
            {name: 'Spells', within: 'Section 2', separator: '/'},
            {name: 'Spell Difficulty Class', within: 'Section 2',
             separator: '/'},
            {name: 'Domains', within: 'Section 2', separator: '/'},
            {name: 'Notes', within: 'Section 2'},
            {name: 'Hidden Notes', within: 'Section 2', format: '%V'}
      );
    } else if(name == 'Standard' || name == 'Vertical') {
      var innerSep = name == 'Standard' ? null : '\n';
      var listSep = name == 'Standard' ? '; ' : '\n';
      var noteSep = listSep;
      noteSep = '\n';
      var outerSep = name == 'Standard' ? '\n' : null;
      viewer.addElements(
        {name: '_top', borders: 1, separator: '\n'},
        {name: 'Header', within: '_top'},
          {name: 'Identity', within: 'Header', separator: ''},
            {name: 'Name', within: 'Identity', format: '<b>%V</b>'},
            {name: 'Race', within: 'Identity', format: ' -- <b>%V</b>'},
            {name: 'Levels', within: 'Identity', format: ' <b>%V</b>',
             separator: '/'},
          {name: 'Image Url', within: 'Header', format: '<img src="%V"/>'},
        {name: 'Attributes', within: '_top', separator: outerSep},
          {name: 'Abilities', within: 'Attributes', separator: innerSep},
            {name: 'Strength', within: 'Abilities'},
            {name: 'Intelligence', within: 'Abilities'},
            {name: 'Wisdom', within: 'Abilities'},
            {name: 'Dexterity', within: 'Abilities'},
            {name: 'Constitution', within: 'Abilities'},
            {name: 'Charisma', within: 'Abilities'},
          {name: 'Description', within: 'Attributes', separator: innerSep},
            {name: 'Background', within: 'Description'},
            {name: 'Alignment', within: 'Description'},
            {name: 'Deity', within: 'Description'},
            {name: 'Origin', within: 'Description'},
            {name: 'Gender', within: 'Description'},
            {name: 'Player', within: 'Description'},
          {name: 'AbilityStats', within: 'Attributes', separator: innerSep},
            {name: 'ExperienceInfo', within: 'AbilityStats', separator: ''},
              {name: 'Experience', within: 'ExperienceInfo'},
              {name: 'Experience Needed', within: 'ExperienceInfo',
               format: '/%V'},
            {name: 'Level', within: 'AbilityStats'},
            {name: 'Speed', within: 'AbilityStats'},
            {name: 'LoadInfo', within: 'AbilityStats', separator: ''},
              {name: 'Load Light', within: 'LoadInfo',
               format: '<b>Light/Med/Max Load:</b> %V'},
              {name: 'Load Medium', within: 'LoadInfo', format: '/%V'},
              {name: 'Load Max', within: 'LoadInfo', format: '/%V'},
          {name: 'Ability Notes', within: 'Attributes', separator: noteSep},
        {name: 'FeaturesAndSkills', within: '_top', separator: outerSep,
         format: '<b>Features/Skills</b><br/>%V'},
          {name: 'Proficiency Bonus', within: 'FeaturesAndSkills'},
          {name: 'Proficiency Counts', within: 'FeaturesAndSkills', separator: listSep},
          {name: 'FeaturePart', within: 'FeaturesAndSkills', separator: '\n'},
            {name: 'FeatStats', within: 'FeaturePart', separator: innerSep},
              {name: 'Feat Count', within: 'FeatStats', separator: listSep},
              {name: 'Selectable Feature Count', within: 'FeatStats',
               separator: listSep},
            {name: 'FeatLists', within: 'FeaturePart', separator: innerSep},
              {name: 'Feats', within: 'FeatLists', separator: listSep},
            {name: 'Feature Notes', within: 'FeaturePart', separator: noteSep},
          {name: 'SkillPart', within: 'FeaturesAndSkills', separator: '\n'},
            {name: 'Skill Proficiencies', within: 'SkillPart', separator: listSep},
            {name: 'Skills', within: 'SkillPart', columns: '3LE', separator: null},
            {name: 'Skill Notes', within: 'SkillPart', separator: noteSep},
          {name: 'Tool Proficiencies', within: 'FeaturesAndSkills', separator: listSep},
          {name: 'Tools', within: 'FeaturesAndSkills', separator: listSep},
          {name: 'LanguagePart', within: 'FeaturesAndSkills', separator: '\n'},
            {name: 'LanguageStats', within: 'LanguagePart', separator:innerSep},
              {name: 'Language Count', within: 'LanguageStats'},
            {name: 'Languages', within: 'LanguagePart', separator: listSep},
        {name: 'Combat', within: '_top', separator: outerSep,
         format: '<b>Combat</b><br/>%V'},
          {name: 'CombatPart', within: 'Combat', separator: '\n'},
            {name: 'CombatStats', within: 'CombatPart', separator: innerSep},
              {name: 'Hit Points', within: 'CombatStats'},
              {name: 'Initiative', within: 'CombatStats'},
              {name: 'Armor Class', within: 'CombatStats'},
              {name: 'Attacks Per Round', within: 'CombatStats'},
            {name: 'Armor Proficiencies', within: 'CombatPart', separator: listSep},
            {name: 'Shield Proficiencies', within: 'CombatPart', separator: listSep},
            {name: 'Weapon Proficiencies', within: 'CombatPart', separator: listSep},
            {name: 'Gear', within: 'CombatPart', separator: innerSep},
              {name: 'Armor', within: 'Gear'},
              {name: 'Shield', within: 'Gear'},
              {name: 'Weapons', within: 'Gear', separator: listSep},
            {name: 'Turning', within: 'CombatPart', separator: innerSep},
              {name: 'Turn Undead', within: 'Turning', separator: listSep},
            {name: 'Combat Notes', within: 'CombatPart', separator: noteSep},
          {name: 'SavePart', within: 'Combat', separator: '\n'},
            {name: 'Save Proficiencies', within: 'SavePart', separator: listSep},
            {name: 'SaveAndResistance', within: 'SavePart', separator:innerSep},
              {name: 'Damage Reduction', within: 'SaveAndResistance',
               separator: innerSep},
              {name: 'Save', within: 'SaveAndResistance', separator: listSep},
              {name: 'Resistance', within: 'SaveAndResistance',
               separator: listSep},
            {name: 'Save Notes', within: 'SavePart', separator: noteSep},
        {name: 'Magic', within: '_top', separator: outerSep,
         format: '<b>Magic</b><br/>%V'},
          {name: 'SpellPart', within: 'Magic', separator: '\n'},
            {name: 'SpellStats', within: 'SpellPart', separator: innerSep},
              {name: 'Spells Known', within: 'SpellStats', separator: listSep},
              {name: 'Spell Slots', within: 'SpellStats', separator:listSep},
              {name: 'Spell Attack Modifier', within: 'SpellStats',
               format: '<b>Attack</b>: %V', separator: listSep},
              {name: 'Spell Difficulty Class', within: 'SpellStats',
               format: '<b>Spell DC</b>: %V', separator: listSep},
          {name: 'Spells', within: 'Magic', columns: '1L', separator: null},
          {name: 'Magic Notes', within: 'Magic', separator: noteSep},
        {name: 'Notes Area', within: '_top', separator: outerSep,
         format: '<b>Notes</b><br/>%V'},
          {name: 'NotesPart', within: 'Notes Area', separator: '\n'},
            {name: 'Notes', within: 'NotesPart', format: '%V'},
            {name: 'Hidden Notes', within: 'NotesPart', format: '%V'},
          {name: 'ValidationPart', within: 'Notes Area', separator: '\n'},
            {name: 'Sanity Notes', within: 'ValidationPart', separator:noteSep},
            {name: 'Validation Notes', within: 'ValidationPart',
             separator: noteSep}
      );
    } else
      continue;
    rules.defineViewer(name, viewer);
  }
};

/* Defines the rules related to character description. */
SRD5E.descriptionRules = function(rules, alignments, deities, genders) {
  rules.defineChoice('alignments', alignments);
  rules.defineChoice('deities', deities);
  rules.defineChoice('genders', genders);
};

/* Defines the rules related to equipment. */
SRD5E.equipmentRules = function(rules, armors, shields, weapons) {

  rules.defineChoice('armors', armors);
  rules.defineChoice('shields', shields);
  rules.defineChoice('weapons', weapons);

  for(var i = 0; i < weapons.length; i++) {

    var pieces = weapons[i].split(':');
    var matchInfo = pieces[1].match(/(\d?d\d+)(r(\d+))?/);
    if(! matchInfo)
      continue;

    var category = pieces[1].indexOf('Si') >= 0 ? 'Simple' : 'Martial';
    var damage = matchInfo[1];
    var name = pieces[0];
    var range = matchInfo[3];
    var weaponName = 'weapons.' + name;
    var format = '%V (%1 %2%3' + (range ? " R%4'" : '') + ')';

    if(damage.startsWith('d'))
      damage = '1' + damage;

    rules.defineNote(weaponName + ':' + format);

    rules.defineRule('proficient.' + name,
      weaponName, '?', null,
      'weaponProficiencies.' + name, '=', '1',
      'weaponProficiencies.' + category, '=', '1'
    );
    rules.defineRule('weaponBonus.' + name,
      weaponName, '?', null,
      'proficient.' + name, '?', null,
      'proficiencyBonus', '=', null
    );
    rules.defineRule('attackBonus.' + name,
      weaponName, '?', null,
      'combatNotes.' + (range ? 'dexterity' : 'strength') + 'AttackAdjustment', '=', null,
      'weaponBonus.' + name, '+', null,
      'weaponAttackAdjustment.' + name, '+', null
    );
    rules.defineRule('damageBonus.' + name,
      weaponName, '?', null,
      'combatNotes.' + (range ? 'dexterity' : 'strength') + 'DamageAdjustment', '=', null,
      'weaponBonus.' + name, '+', null,
      'weaponDamageAdjustment.' + name, '+', null
    );
    if(!range) {
      rules.defineRule('attackBonus.'+name, 'monkMeleeAttackBonus', '+', null);
      rules.defineRule('damageBonus.'+name, 'monkMeleeDamageBonus', '+', null);
    }

    rules.defineRule(weaponName + '.1',
      weaponName, '?', null,
      'attackBonus.' + name, '=', 'source < 0 ? source : ("+" + source)'
    );
    rules.defineRule(weaponName + '.2',
      weaponName, '=', '"' + damage + '"'
    );
    rules.defineRule(weaponName + '.3',
      weaponName, '?', null,
      'damageBonus.' + name, '=', 'source < 0 ? source : source == 0 ? "" : ("+" + source)'
    );
    if(range) {
      rules.defineRule('range.' + name,
        weaponName, '=', range,
        'weaponRangeAdjustment.' + name, '+', null
      );
      rules.defineRule(weaponName + '.4',
        weaponName, '?', null,
        'range.' + name, '=', null
      );
    }
    if(!range) {
      rules.defineRule(weaponName + '.2', 'monkMeleeDieBonus', '^', null);
    }

  }

  for(var i = 0; i < armors.length; i++) {
    var pieces = armors[i].split(':');
    var name = pieces[0];
    rules.defineRule('proficient.' + name,
      'armor', '?', 'source == "' + name + '"',
      'armorProficiencies.' + name, '=', '1'
    );
    if(pieces[1] != '') {
      var category = pieces[1] == 'H' ? 'Heavy' : pieces[1] == 'M' ? 'Medium' : 'Light';
      rules.defineRule
        ('proficient.' + name, 'armorProficiencies.' + category, '=', '1');
    }
  }

  // TODO Strength overcomes this; see PHB 144
  // rules.defineRule('abilityNotes.armorSpeedAdjustment',
  //   'armor', '=',
  //   'SRD5E.armorsCategories[source] == "Heavy" ? -10 : null'
  // );
  rules.defineRule('combatNotes.dexterityArmorClassAdjustment',
    'armor', 'v', 'SRD5E.armorsMaxDexBonuses[source]'
  );
  rules.defineRule('speed', 'abilityNotes.armorSpeedAdjustment', '+', null);

  // TODO arcane spells require armor proficiency
  // TODO armor, weapon proficiency

};

/* Defines the rules related to feats. */
SRD5E.featRules = function(rules, feats) {

  rules.defineNote
    ('validationNotes.featAllocation:%1 available vs. %2 allocated');
  rules.defineRule('validationNotes.featAllocation.1',
    '', '=', '0',
    'featCount', '=', null
  );
  rules.defineRule('validationNotes.featAllocation.2',
    '', '=', '0',
    /^feats\./, '+=', null
  );
  rules.defineRule('validationNotes.featAllocation',
    'validationNotes.featAllocation.1', '=', '-source',
    'validationNotes.featAllocation.2', '+=', null
  );

  for(var i = 0; i < feats.length; i++) {

    var feat = feats[i];
    var matchInfo;
    var notes = null;

    if((matchInfo = feat.match(/^Ability Boost(\d+)?$/)) != null) {
      var seq = matchInfo[1];
      notes = ['abilityNotes.abilityBoosts:+%V to distribute'];
      rules.defineRule('abilityBoostCount', 'features.' + feat, '+=', '2');
      rules.defineRule
        ('abilityNotes.abilityBoosts', 'abilityBoostCount', '=', null);
      if(seq) {
        notes.push('validationNotes.abilityBoost' + seq + 'FeatFeatures:Requires Ability Boost' + (seq != '2' ? seq - 1 : ''));
      }
    } else if(feat == 'Grappler') {
      notes = [
        'combatNotes.grapplerFeature:' +
          'Adv attacks vs. grappled foe, additional grapple to pin',
        'validationNotes.grapplerFeatAbility:Requires Strength >= 13'
      ];
// PHB
    } else if(feat == 'Alert') {
      notes = [
        'combatNotes.alertFeature:+5 Initiative, foes no surprise or hidden Adv'
      ];
      rules.defineRule('initiative', 'combatNotes.alertFeature', '+', '5');
    } else if(feat == 'Athlete') {
      notes = [
        "abilityNotes.athleteFeature:+1 Dexterity or Strength, climb full speed, stand uses 5' move",
        "skillNotes.athleteFeature:Long jump, running high jump uses 5' move"
      ];
      rules.defineRule
        ('abilityBoostCount', 'abilityNotes.athleteFeature', '+', '1');
    } else if(feat == 'Actor') {
      notes = [
        'abilityNotes.actorFeature:+1 Charisma',
        "skillNotes.actorFeature:Mimic others' speech/sounds, Adv Charisma(Deception/Performance) when impersonating"
      ];
    } else if(feat == 'Charger') {
      notes = [
        "combatNotes.chargerFeature:Bonus attack +5 HP or 10' push after dash"
      ];
    } else if(feat == 'Crossbow Expert') {
      notes = [
        'combatNotes.crossbowExpertFeature:' +
          'Quick load, no Disadv on close shot, bonus hand crossbow shot after one-handed attack'
      ];
    } else if(feat == 'Defensive Duelist') {
      notes = [
        'combatNotes.defensiveDuelistFeature:' +
          'React +%V AC when holding finesse weapon'
      ];
      rules.defineRule
        ('combatNotes.defensiveDuelistFeature', 'proficiencyBonus', '=', null);
    } else if(feat == 'Dual Wielder') {
      notes = [
        'combatNotes.dualWielderFeature:' +
          '+1 AC w/two weapons, two-weapon fighting w/non-light weapons, draw two weapons at once'
      ];
    } else if(feat == 'Dungeon Delver') {
      notes = [
        'abilityNotes.dungeonDelverFeature:Search for traps at full speed',
        'saveNotes.dungeonDelverFeature:Adv vs. traps',
        'skillNotes.dungeonDelverFeature:Adv detect secret doors'
      ];
    } else if(feat == 'Durable') {
      notes = [
        'abilityNotes.durableFeature:+1 Constitution',
        'featureNotes.durableFeature:Min %V/die when regaining HP'
      ];
      rules.defineRule('featureNotes.durableFeature',
        'constitutionModifier', '=', 'Math.max(source * 2, 2)'
      );
    } else if((matchInfo = feat.match(/^Elemental Adept \((.*)\)$/)) != null){
      var type = matchInfo[1];
      notes = [
        'magicNotes.elementalAdept(' + type + ')Feature:' +
          'Spells ignore ' + type + ' resistance, treat 1s as 2s on damage die',
        'validationNotes.elementalAdept(' + type + ')FeatCasterLevel:' +
          'Requires Caster Level >= 1'
      ];
    } else if(feat == 'Great Weapon Master') {
      notes = [
        'combatNotes.greatWeaponMasterFeature:' +
          'Bonus attack after crit or foe to 0 HP, may trade -5 attack for +10 damage'
      ];
    } else if(feat == 'Healer') {
      notes = [
        'featureNotes.healerFeature:' +
          "Stabilize w/healer's kit restores 1 HP, healer's kit heals 1d6+4 HP 1/short rest"
      ];
    } else if(feat == 'Heavily Armored') {
      notes = [
        'abilityNotes.heavilyArmoredFeature:+1 Strength',
        'skillNotes.heavilyArmoredFeature:Prof Armor (Heavy)',
        'validationNotes.heavilyArmoredFeature:' +
          'Requires medium armor proficiency'
      ];
      rules.defineRule('armorProficiencies.Heavy',
        'skillNotes.heavilyArmoredFeature', '=', '1'
      );
      rules.defineRule('validationNotes.heavilyArmoredFeature',
        'feats.Heavily Armored', '=', '-1',
        'armorProficiencies.Medium', '+', null
      );
    } else if(feat == 'Heavy Armor Master') {
      notes = [
        'abilityNotes.heavyArmorMasterFeature:+1 Strength',
        'combatNotes.heavyArmorMasterFeature:' +
          'Non-magical bludgeon, pierce, slash DR 3',
        'validationNotes.heavyArmorMasterFeature:' +
          'Requires heavy armor proficiency'
      ];
      rules.defineRule('validationNotes.heavyArmorMasterFeature',
        'feats.Heavy Armor Master', '=', '-1',
        'armorProficiencies.Heavy', '+', null
      );
    } else if(feat == 'Inspiring Leader') {
      notes = [
        'featureNotes.inspiringLeaderFeature:' +
          "R30' 10-min speech give 6 allies %V HP",
        'validationNotes.inspiringLeaderFeatAbility:Requires Charisma >= 13'
      ];
    } else if(feat == 'Keen Mind') {
      notes = [
        'abilityNotes.keenMindFeature:+1 Intelligence',
        'featureNotes.keenMindFeature:' +
          'Know N, hours until sun down/up, things seen/heard prior 30 days'
      ];
    } else if(feat == 'Lightly Armored') {
      notes = [
        'abilityNotes.lightlyArmoredFeature:+1 Dexterity or Strength',
        'skillNotes.lightlyArmoredFeature:Prof Armor (Light)'
      ];
      rules.defineRule
        ('abilityBoostCount', 'abilityNotes.lightlyArmoredFeature', '+=', '1');
    } else if(feat == 'Linguist') {
      notes = [
        'abilityNotes.linguistFeature:+1 Intelligence',
        'featureNotes.linguistFeature:Create ciphers, DC %V Int to decode',
        'skillNotes.linguistFeature:Learn 3 additional languages'
      ];
      rules.defineRule('featureNotes.linguistFeature',
        'intelligence', '=', null,
        'proficiencyBonus', '+', null
      );
      rules.defineRule('languageCount', 'skillNotes.linguistFeature', '+', '3');
    } else if(feat == 'Lucky') {
      notes = [
        'featureNotes.luckyFeature:' +
          'Adv attack/ability/save or foe Disadv attack 3/long rest'
      ];
    } else if(feat == 'Mage Slayer') {
      notes = [
        'combatNotes.mageSlayerFeature:' +
          'React to attack caster, foe Disadv concentration',
        "saveNotes.mageSlayerFeature:Adv vs. spells by foes w/in 5'"
      ];
    } else if(feat == 'Magic Initiate') {
      notes = [
        'magicNotes.magicInitiateFeature:2 cantrips, 1 1st-level/long rest'
      ];
    } else if(feat == 'Martial Adept') {
      notes = [
        'combatNotes.martialAdeptFeature:' +
          'Two maneuvers (DC %V), 1 superiority die/long rest'
      ];
      rules.defineRule('maxDexOrStrMod',
        'dexterityModifier', '=', null,
        'strengthModifier', '^', null
      );
      rules.defineRule('combatNotes.martialAdeptFeature',
        'maxDexOrStrMod', '=', '8 + source',
        'proficiencyBonus', '+', null
      );
    } else if(feat == 'Medium Armor Master') {
      notes = [
        'combatNotes.mediumArmorMasterFeature:+1 AC in medium armor',
        'validationNotes.mediumArmorMasterFeature:' +
          'Requires medium armor proficiency'
      ];
      var armors = rules.getChoices('armor');
      var mediumArmors = '';
      for(var armor in armors) {
        if(armors[armor].indexOf('M') >= 0)
          mediumArmors += armor;
      }
      rules.defineRule
        ('armorClass', 'classNotes.mediumArmorMasterFeature.1', '+', null);
      rules.defineRule('combatNotes.mediumArmorMasterFeature.1',
        'dexterity', '?', 'source >= 16',
        'armor', '=', '"' + mediumArmors + '".indexOf(source) >= 0 ? 1 : null'
      );
    } else if(feat == 'Mobile') {
      notes = [
        "abilityNotes.mobileFeature:+10' speed",
        'combatNotes.mobileFeature:Dash at full speed, no OA from targeted foe'
      ];
      rules.defineRule('speed', 'abilityNotes.modileFeature', '+', '10');
    } else if(feat == 'Moderately Armored') {
      notes = [
        'abilityNotes.moderatelyArmoredFeature:+1 Dexterity or Strength',
        'skillNotes.moderatelyArmoredFeature:Prof Armor (Heavy)',
        'validationNotes.moderateltyArmoredFeature:' +
          'Requires light armor proficiency'
      ];
      rules.defineRule('abilityBoostCount',
        'abilityNotes.moderatelyArmoredFeature', '+=', '1'
      );
    } else if(feat == 'Mounted Combatant') {
      notes = [
        'combatNotes.mountedCombatantFeature:' +
          'Adv unmounted foe smaller than mount, redirect attack on mount to sself, mount takes no damage on Dex save, half on fail'
      ];
    } else if(feat == 'Observant') {
      notes = [
        'abilityNotes.observantFeature:+1 Intelligence or Wisdom',
        'featureNotes.observantFeature:Read lips',
        'skillNotes.observantFeature:+5 passive Investigation, Perception'
      ];
      rules.defineRule
        ('abilityBoostCount', 'abilityNotes.observantFeature', '+=', '1');
    } else if(feat == 'Polearm Master') {
      notes = [
        'combatNotes.polearmMasterFeature:' +
          'Bonus attack w/polearm but 1d4 HP, OA when foe enters reach'
      ];
    } else if(feat == 'Resilient') {
      notes = [
        'abilityNotes.resilientFeature:+1 and prof saves in chosen ability'
      ];
    } else if(feat == 'Ritual Caster') {
      notes = [
        'magicNotes.ritualCasterFeature:Cast spells from ritual book'
      ];
    } else if(feat == 'Savage Attacker') {
      notes = [
        'combatNotes.savageAttackerFeature:Reroll damage 1/turn'
      ];
    } else if(feat == 'Sentinel') {
      notes = [
        'combatNotes.sentinelFeature:' +
          'Foe stuck by OA speed 0, OA on foe Disengage, react attack when foe targets other'
      ];
    } else if(feat == 'Sharpshooter') {
      notes = [
        'combatNotes.sharpshooterFeature:' +
          'No Disadv long range, ignore 3/4 cover, take -5 attack for +10 damage'
      ];
    } else if(feat == 'Shield Master') {
      notes = [
        "combatNotes.shieldMasterFeature:Bonus 5' Push",
        'saveNotes.shieldMasterFeature:' +
          '+2 Dex vs. targeted spell, save for no damage instead of half'
      ];
    } else if(feat == 'Skilled') {
      notes = [
        'skillNotes.skilledFeature:Prof 3 skills or tools'
      ];
    } else if(feat == 'Skulker') {
      notes = [
        'skillNotes.skulkerFeature:' +
          'Hide when lightly obscured, no Disadv on Perception in dim light',
        'validationNotes.skulkerFeatAbility:Requires Dexterity >= 13'
      ];
    } else if(feat == 'Spell Sniper') {
      notes = [
        'magicNotes.spellSniperFeature:' +
          'Dbl attack spell range, ignore 3/4 cover, additional attack cantrip'
      ];
    } else if(feat == 'Tavern Brawler') {
      notes = [
        'abilityNotes.tavernBrawlerFeature:+1 Constitution or Strength',
        'combatNotes.tavernBrawlerFeature:' +
          'Prof improvised and unarmed, bonus to grapple'
      ];
      rules.defineRule
        ('abilityBoostCount', 'abilityNotes.tavernBrawlerFeature', '+=', '1');
      rules.defineRule
        ('weapons.Unarmed.2', 'combatNotes.tavernBrawlerFeature', '=', '"1d4"');
    } else if(feat == 'Tough') {
      notes = [
        'combatNotes.toughFeature:+%V HP'
      ];
      rules.defineRule('combatNotes.toughFeature', 'level', '=', '2 * source');
      rules.defineRule('hitPoints', 'combatNotes.toughFeature', '+', null);
    } else if(feat == 'War Caster') {
      notes = [
        'combatNotes.warCasterFeature:' +
          'Adv concentration, cast when holding shield or weapon, cast as OA',
        'validationNotes.warCasterFeatCasterLevel:Requires Caster Level >= 1'
      ];
      // TODO
    } else if(feat == 'Weapon Master') {
      notes = [
        'abilityNotes.weaponMasterFeature:+1 Dexterity or Strength',
        'skillNotes.weaponMasterFeature:Prof 4 weapons'
      ];
      rules.defineRule
        ('abilityBoostCount', 'abilityNotes.weaponMasterFeature', '+=', '1');
// ENDPHB
    } else {
      continue;
    }
    rules.defineChoice('feats', feat);
    rules.defineRule('features.' + feat, 'feats.' + feat, '=', null);
    if(notes != null)
      rules.defineNote(notes);

  }

};

/* Defines the rules related to spells. */
SRD5E.magicRules = function(rules, classes, schools) {

  rules.defineChoice('schools', schools);
  schools = rules.getChoices('schools');

  for(var i = 0; i < classes.length; i++) {
    var klass = classes[i];
    var spells;
    if(klass == 'Bard') {
      spells = [
        'B0:Blade Ward:Dancing Lights:Friends:Light:Mage Hand:Mending:' +
        'Message:Minor Illusion:Prestidigitation:True Strike:Vicious Mockery',
        'B1:Animal Friendship:Bane:Charm Person:Comprehend Languages:' +
        'Cure Wounds:Detect Magic:Disguise Self:Dissonant Whispers:' +
        'Faerie Fire:Feather Fall:Healing Word:Heroism:Hideous Laughter:' +
        'Identify:Illusory Script:Longstrider:Silent Image:Sleep:' +
        'Speak With Animals:Unseen Servant',
        'B2:Animal Messenger:Blindness/Deafness:Calm Emotions:' +
        'Cloud Of Daggers:Crown Of Madness:Detect Thoughts:Enhance Ability:' +
        'Enthrall:Heat Metal:Hold Person:Invisibility:Knock:' +
        'Lesser Restoration:Locate Animals Or Plants:Locate Object:' +
        'Magic Mouth:Phantasmal Force:See Invisibility:Shatter:Silence:' +
        'Suggestion:Zone Of Truth',
        'B3:Bestow Curse:Clairvoyance:Dispel Magic:Fear:Feign Death:' +
        'Glyph Of Warding:Hypnotic Pattern:Major Image:Plant Growth:Sending:' +
        'Speak With Dead:Speak With Plants:Stinking Cloud:Tiny Hut:Tongues',
        'B4:Compulsion:Confusion:Dimension Door:Freedom Of Movement:' +
        'Greater Invisibility:Hallucinatory Terrain:Locate Creature:Polymorph',
        'B5:Animate Objects:Awaken:Dominate Person:Dream:Geas:' +
        'Greater Restoration:Hold Monster:Legend Lore:Mass Cure Wounds:' +
        'Mislead:Modify Memory:Planar Binding:Raise Dead:Scrying:Seeming:' +
        'Teleporation Circle',
        'B6:Eyebite:Find The Path:Guards And Wards:Irresistible Dance:' +
        'Mass Suggestion:Programmed Illusion:True Seeing',
        "B7:Etherealness:Forcecage:Mage's Sword:Magnificent Mansion:" +
        'Mirage Arcane:Project Image:Regenerate:Resurrection:Symbol:Teleport',
        'B8:Dominate Monster:Feeblemind:Glibness:Mind Blank:Power Word Stun',
        'B9:Foresight:Power Word Heal:Power Word Kill:True Polymorph'
      ];
    } else if(klass == 'Cleric') {
      spells = [
        'C0:Guidance:Light:Mending:Resistance:Sacred Flame:Spare The Dying:' +
        'Thaumaturgy',
        'C1:Bane:Bless:Command:Create Or Destroy Water:Cure Wounds:' +
        'Detect Evil And Good:Detect Magic:Detect Poison And Disease:' +
        'Guiding Bolt:Healing Word:Inflict Wounds:' +
        'Protection From Evil And Good:Purify Food And Drink:Sanctuary:' +
        'Shield Of Faith',
        'C2:Aid:Augury:Blindness/Deafness:Calm Emotions:Continual Flame:' +
        'Enhance Ability:Find Traps:Gentle Repose:Hold Person:' +
        'Lesser Restoration:Locate Object:Prayer Of Healing:' +
        'Protection From Poison:Silence:Spiritual Weapon:Warding Bond:' +
        'Zone Of Truth',
        'C3:Animate Dead:Beacon Of Hope:Bestow Curse:Clairvoyance:' +
        'Create Food And Water:Daylight:Dispel Magic:Feign Death:' +
        'Glyph Of Warding:Magic Circle:Mass Healing Word:Meld Into Stone:' +
        'Protection From Energy:Remove Curse:Revivify:Sending:' +
        'Speak With Dead:Spirit Guardians:Tongues:Water Walk',
        'C4:Banishment:Control Water:Death Ward:Divination:' +
        'Freedom Of Movement:Guardian Of Faith:Locate Creature:Stone Shape',
        'C5:Commune:Contagion:Dispel Evil And Good:Flame Strike:Geas:' +
        'Greater Restoration:Hallow:Insect Plague:Legend Lore:' +
        'Mass Cure Wounds:Planar Binding:Raise Dead:Scrying',
        'C6:Blade Barrier:Create Undead:Find The Path:Forbiddance:Harm:Heal:' +
        "Heroes' Feast:Planar Ally:True Seeing:Word Of Recall",
        'C7:Conjure Celestial:Divine Word:Etherealness:Fire Storm:' +
        'Plane Shift:Regerate:Resurrection:Symbol',
        'C8:Antimagic Field:Control Weather:Earthquake:Holy Aura',
        'C9:Astral Projection:Gate:Mass Heal:True Resurrection'
      ];
    } else if(klass == 'Druid') {
      spells = [
        'D0:Druidcraft:Guidance:Mending:Poison Spray:Produce Flame:' +
        'Resistance:Shillelagh:Thorn Whip',
        'D1:Animal Friendship:Charm Person:Create Or Destroy Water:' +
        'Cure Wounds:Detect Magic:Detect Poison And Disease:Entangle:' +
        'Faerie Fire:Fog Cloud:Goodberry:Healing Word:Jump:Longstrider:' +
        'Purify Food And Drink:Speak With Animals:Thunderwave',
        'D2:Animal Messenger:Barkskin:Beast Sense:Darkvision:Enhance Ability:' +
        'Find Traps:Flame Blade:Flaming Sphere:Gust Of Wind:Heat Metal:' +
        'Hold Person:Lesser Restoration:Locate Animals Or Plants:' +
        'Locate Object:Moonbeam:Pass Without Trace:Protection From Poison:' +
        'Spike Growth',
        'D3:Call Lightning:Conjure Animals:Daylight:Dispel Magic:Feign Death:' +
        'Meld Into Stone:Plant Growth:Protection From Energy:Sleet Storm:' +
        'Speak With Plants:Water Breathing:Water Walk:Wind Wall',
        'D4:Blight:Confusion:Conjure Minor Elementals:' +
        'Conjure Woodland Beings:Control Water:Dominate Beast:' +
        'Freedom Of Movement:Giant Insect:Grasping Vine:' +
        'Hallucinatory Terrain:Ice Storm:Locate Creature:Polymorph:' +
        'Stone Shape:Stoneskin:Wall Of Fire',
        'D5:Antilife Shell:Awaken:Commune With Nature:Conjure Elemental:' +
        'Contagion:Geas:Greater Restoration:Insect Plague:Mass Cure Wounds:' +
        'Planar Binding:Reincarnate:Scrying:Tree Stride:Wall Of Stone',
        "D6:Conjure Fey:Find The Path:Heal:Heroes' Feast:Move Earth:Sunbeam:" +
        'Transport Via Plants:Wall Of Thorns:Wind Walk',
        'D7:Fire Storm:Mirage Arcane:Plane Shift:Regenerate:Reverse Gravity',
        'D8:Animal Shapes:Antipathy/Sympathy:Control Weather:Earthquake:' +
        'Feeblemind:Sunburst:Tsunami',
        'D9:Foresight:Shapechange:Storm Of Vengeance:True Resurrection'
      ];
    } else if(klass == 'Paladin') {
      spells = [
        'P1:Bless:Command:Compelled Duel:Cure Wounds:Detect Evil And Good:' +
        'Detect Magic:Detect Poison And Disease:Divine Favor:Heroism:' +
        'Protection From Evil And Good:Purify Food And Drink:Searing Smite:' +
        'Shield Of Faith:Thunderous Smite:Wrathful Smite',
        'P2:Aid:Branding Smite:Find Steed:Lesser Restoration:Locate Object:' +
        'Magic Weapon:Protection From Poison:Zone Of Truth',
        'P3:Aura Of Vitality:Blinding Smite:Create Food And Water:' +
        "Crusader's Mantle:Daylight:Dispel Magic:Elemental Weapon:" +
        'Magic Circle:Remove Curse:Revivify',
        'P4:Aura Of Life:Aura Of Purity:Banishment:Death Ward:' +
        'Locate Creature:Staggering Smite',
        'P5:Banishing Smite:Circle Of Power:Destructive Smite:' +
        'Dispel Evil And Good:Geas:Raise Dead'
      ];
    } else if(klass == 'Ranger') {
      spells = [
        'R1:Alarm:Animal Friendship:Cure Wounds:Detect Magic:' +
        'Detect Poison And Disease:Ensnaring Strike:Fog Cloud:Goodberry:' +
        "Hail Of Thorns:Hunter's Mark:Jump:Longstrider:Speak With Animals",
        'R2:Animal Messenger:Barkskin:Beast Sense:Cordon Of Arrows:' +
        'Darkvision:Find Traps:Lesser Restoration:Locate Animals Or Plants:' +
        'Locate Object:Pass Without Trace:Protection From Poison:Silence:' +
        'Spike Growth',
        'R3:Conjure Animals:Conjure Barrage:Daylight:Lightning Arrow:' +
        'Nondetection:Plant Growth:Protection From Energy:Speak With Plants:' +
        'Water Breathing:Water Walk:Wind Wall',
        'R4:Conjure Woodland Beings:Freedom Of Movement:Grasping Vine:' +
        'Locate Creature:Stoneskin',
        'R5:Commune With Nature:Conjure Volley:Swift Quiver:Tree Stride'
      ];
    } else if(klass == 'Sorcerer') {
      spells = [
        'S0:Acid Splash:Blade Ward:Chill Touch:Dancing Lights:Fire Bolt:' +
        'Friends:Light:Mage Hand:Mending:Message:Minor Illusion:Poison Spray:' +
        'Prestidigitation:Ray Of Frost:Shocking Grasp:True Strike',
        'S1:Burning Hands:Charm Person:Chromatic Orb:Color Spray:' +
        'Comprehend Languages:Detect Magic:Disguise Self:Expeditious Retreat:' +
        'False Life:Feather Fall:Fog Cloud:Jump:Mage Armor:Magic Missile:' +
        'Ray Of Sickness:Shield:Silent Image:Sleep:Thunderwave:Witch Bolt',
        'S2:Alter Self:Blindness/Deafness:Blur:Cloud Of Daggers:' +
        'Crown Of Madness:Darkness:Darkvision:Detect Thoughts:' +
        'Enhance Ability:Enlarge/Reduce:Gust Of Wind:Hold Person:' +
        'Invisibility:Knock:Levitate:Mirror Image:Misty Step:' +
        'Phantasmal Force:Scorching Ray:See Invisibility:Shatter:' +
        'Spider Climb:Suggestion:Web',
        'S3:Blink:Clairvoyance:Counterspell:Daylight:Dispel Magic:Fear:' +
        'Fireball:Fly:Gaseous Form:Haste:Hypnotic Pattern:Lightning Bolt:' +
        'Major Image:Protection From Energy:Sleet Storm:Slow:Stinking Cloud:' +
        'Tongues:Water Breathing:Water Walk',
        'S4:Banishment:Blight:Confusion:Dimension Door:Dominate Beast:' +
        'Greater Invisibility:Ice Storm:Polymorph:Stoneskin:Wall Of Fire',
        'S5:Animate Objects:Cloudkill:Cone Of Cold:Creation:Dominate Person:' +
        'Hold Monster:Insect Plague:Seeming:Telekinesis:Teleportation Circle:' +
        'Wall Of Stone',
        'S6:Arcane Gate:Chain Lightning:Circle Of Death:Disintegrate:Eyebite:' +
        'Globe Of Invulnerability:Mass Suggestion:Move Earth:Sunbeam:' +
        'True Seeing',
        'S7:Delayed Blast Fireball:Etherealness:Finger Of Death:Fire Storm:' +
        'Plane Shift:Prismatic Spray:Reverse Gravity:Teleport',
        'S8:Dominate Monster:Earthquake:Incendiary Cloud:Power Word Stun:' +
        'Sunburst',
        'S9:Gate:Meteor Swarm:Power Word Kill:Time Stop:Wish'
      ];
    } else if(klass == 'Warlock') {
      spells = [
        'K0:Blade Ward:Chill Touch:Eldritch Blast:Friends:Mage Hand:' +
        'Minor Illusion:Poison Spray:Prestidigitation:True Strike',
        'K1:Armor Of Agathys:Arms Of Hadar:Charm Person:Comprehend Languages:' +
        'Expeditious Retreat:Hellish Rebuke:Hex:Illusory Script:' +
        'Protection From Evil And Good:Unseen Servant:Witch Bolt',
        'K2:Cloud Of Daggers:Crown Of Madness:Darkness:Enthrall:Hold Person:' +
        'Invisibility:Mirror Image:Misty Step:Ray Of Enfeeblement:Shatter:' +
        'Spider Climb:Suggestion',
        'K3:Counterspell:Dispel Magic:Fear:Fly:Gaseous Form:Hunger Of Hadar:' +
        'Hypnotic Pattern:Magic Circle:Major Image:Remove Curse:Tongues:' +
        'Vampiric Touch',
        'K4:Banishment:Blight:Dimension Door:Hallucinatory Terrain',
        'K5:Contact Other Plane:Dream:Hold Monster:Scrying',
        'K6:Arcane Gate:Circle Of Death:Conjure Fey:Create Undead:Eyebite:' +
        'Flesh To Stone:Mass Suggestion:True Seeing',
        'K7:Etherealness:Finger Of Death:Forcecage:Plane Shift',
        'K8:Demiplane:Dominate Monster:Feeblemind:Glibness:Power Word Stun',
        'K9:Astral Projection:Foresight:Imprisonment:Power Word Kill:' +
        'True Polymorph'
      ];
      // Fiend Patron
      spells.push(
        'K1:Burning Hands:Command',
        'K2:Blindness/Deafness:Scorching Ray',
        'K3:Fireball:Stinking Cloud',
        'K4:Fire Shield:Wall Of Fire',
        'K5:Flame Strike:Hallow'
      );
// PHB
      spells.push(
        // Archfey Patron
        'K1:Faerie Fire:Sleep',
        'K2:Calm Emotions:Phantasmal Force',
        'K3:Blink:Plant Growth',
        'K4:Dominate Beast:Greater Invisibility',
        'K5:Dominate Person:Seeming',
        // Great Old One Patron
        'K1:Dissonant Whispers:Hideous Laughter',
        'K2:Detect Thoughts:Phantasmal Force',
        'K3:Clairvoyance:Sending',
        'K4:Black Tentacles:Dominate Beast',
        'K5:Dominate Person:Telekenisis',
      );
// ENDPHB
    } else if(klass == 'Wizard') {
      spells = [
        'W0:Acid Splash:Blade Ward:Chill Touch:Dancing Lights:Fire Bolt:' +
        'Friends:Light:Mage Hand:Mending:Message:Minor Illusion:Poison Spray:' +
        'Prestidigitation:Ray Of Frost:Shocking Grasp:True Strike',
        'W1:Alarm:Burning Hands:Charm Person:Chromatic Orb:Color Spray:' +
        'Comprehend Languages:Detect Magic:Disguise Self:Expeditious Retreat:' +
        'False Life:Feather Fall:Find Familiar:Floating Disk:Fog Cloud:' +
        'Grease:Hideous Laughter:Identify:Illusory Script:Jump:Longstrider:' +
        'Mage Armor:Magic Missile:Protection From Evil And Good:' +
        'Ray Of Sickness:Shield:Silent Image:Sleep:Thunderwave:' +
        'Unseen Servant:Witch Bolt',
        "W2:Acid Arrow:Alter Self:Arcane Lock:Arcanist's Magic Aura:" +
        'Blindness/Deafness:Blur:Cloud Of Daggers:Continual Flame:' +
        'Crown Of Madness:Darkness:Darkvision:Detect Thoughts:Enlarge/Reduce:' +
        'Flaming Sphere:Gentle Repose:Gust Of Wind:Hold Person:Invisibility:' +
        'Knock:Levitate:Locate Object:Magic Mouth:Magic Weapon:Mirror Image:' +
        'Misty Step:Phantasmal Force:Ray Of Enfeeblement:Rope Trick:' +
        'Scorching Ray:See Invisibility:Shatter:Spider Climb:Suggestion:Web',
        'W3:Animate Dead:Bestow Curse:Blink:Clairvoyance:Counterspell:' +
        'Dispel Magic:Fear:Feign Death:Fireball:Fly:Gaseous Form:' +
        'Glyph Of Warding:Haste:Hypnotic Pattern:Lightning Bolt:' +
        'Magic Circle:Major Image:Nondetection:Phantom Steed:' +
        'Protection From Energy:Remove Curse:Sending:Sleet Storm:Slow:' +
        'Stinking Cloud:Tiny Hut:Tongues:Vampiric Touch:Water Breathing',
        'W4:Arcane Eye:Banishment:Black Tentacles:Blight:Confusion:' +
        "Conjure Minor Elementals:Control Water:Dimension Door:Fabricate:" +
        'Faithful Hound:Fire Shield:Greater Invisibility:' +
        'Hallucinatory Terrain:Ice Storm:Locate Creature:Private Sanctum:' +
        'Phantasmal Killer:Polymorph:Resilient Sphere:Secret Chest:' +
        'Stone Shape:Stoneskin:Wall Of Fire',
        'W5:Animate Objects:Arcane Hand:Cloudkill:Cone Of Cold:' +
        'Conjure Elemental:Contact Other Plane:Creation:Dominate Person:' +
        'Dream:Geas:Hold Monster:Legend Lore:Mislead:Modify Memory:Passwall:' +
        'Planar Binding:Scrying:Seeming:Telekinesis:Telepathic Bond:' +
        'Teleportation Circle:Wall Of Force:Wall Of Stone',
        'W6:Arcane Gate:Chain Lightning:Circle Of Death:Contingency:' +
        'Create Undead:Disintegrate:Eyebite:Flesh To Stone:Freezing Sphere:' +
        'Globe Of Invulnerability:Guards And Wards:Instant Summons:' +
        'Irresistible Dance:Magic Jar:Mass Suggestion:Move Earth:' +
        'Programmed Illusion:Sunbeam:True Seeing:Wall Of Ice',
        'W7:Delayed Blast Fireball:Etherealness:Finger Of Death:Forcecage:' +
        "Mage's Sword:Magnificent Mansion:Mirage Arcane:Plane Shift:" +
        'Prismatic Spray:Project Image:' +
        'Reverse Gravity:Sequester:Simulacrum:Symbol:Teleport',
        'W8:Antimagic Field:Antipathy/Sympathy:Clone:Control Weather:' +
        'Demiplane:Dominate Monster:Feeblemind:Incendiary Cloud:Maze:' +
        'Mind Blank:Power Word Stun:Sunburst:Telepathy:Trap The Soul',
        'W9:Astral Projection:Foresight:Gate:Imprisonment:Meteor Swarm:' +
        'Power Word Kill:Prismatic Wall:Shapechange:Time Stop:True Polymorph:' +
        'Weird:Wish'
      ];
    } else
      continue;
    if(spells != null) {
      for(var j = 0; j < spells.length; j++) {
        var pieces = spells[j].split(':');
        for(var k = 1; k < pieces.length; k++) {
          var spell = pieces[k];
          var school = SRD5E.SPELLS[spell];
          if(school == null)
            continue;
          spell += '(' + pieces[0] + ' ' + schools[school] + ')';
          rules.defineChoice('spells', spell);
        }
      }
    }
  }

  rules.defineRule('casterLevel',
    'casterLevelArcane', '+=', null,
    'casterLevelDivine', '+=', null
  );

};

/* Defines the rules related to character movement. */
SRD5E.movementRules = function(rules) {
  rules.defineRule('speed', '', '=', '30');
};

/* Defines the rules related to character races. */
SRD5E.raceRules = function(rules, languages, races) {

  rules.defineChoice('languages', languages);
  rules.defineRule('languageCount', 'race', '=', '0');
  rules.defineNote
    ('validationNotes.languageAllocation:%1 available vs. %2 allocated');
  rules.defineRule('validationNotes.languageAllocation.1',
    'languageCount', '=', null
  );
  rules.defineRule('validationNotes.languageAllocation.2',
    '', '=', '0',
    /^languages\./, '+', null
  );
  rules.defineRule('validationNotes.languageAllocation',
    'validationNotes.languageAllocation.1', '=', '-source',
    'validationNotes.languageAllocation.2', '+', null
  );

  for(var i = 0; i < races.length; i++) {

    var adjustment, features, languages;
    var proficiencyCount = null;
    var proficienciesGiven = null;
    var proficiencyChoices = null;
    var race = races[i];
    var raceNoSpace =
      race.substring(0,1).toLowerCase() + race.substring(1).replace(/ /g, '');

    if(race == 'Half-Elf') {

      adjustment = '+2 charisma/+1 any two';
      features = [
        "1:Darkvision:feature:R60' See one light level better",
        '1:Extra Language:feature:Speak 1 additional language',
        '1:Fey Ancestry:save:Adv vs. charmed, immune sleep',
        '1:Skill Versatility:skill:Prof two additional skills'
      ];
      languages = ['Common', 'Elvish'];
      proficiencyCount = {'Skill': 2};
      proficienciesGiven = {};
      proficiencyChoices = {
        'Skill': SRD5E.SKILLS.map(function(skill){return skill.substring(0, skill.indexOf(':'));})
      };
      rules.defineRule
        ('languageCount', 'featureNotes.extraLanguageFeature', '+', '1');

    } else if(race == 'Half-Orc') {

      adjustment = '+2 strength/+1 constitution';
      features = [
        "1:Darkvision:feature:R60' See one light level better",
        '1:Menacing:skill:Prof Intimidation',
        '1:Relentless Endurance:combat:Avoid drop to 0 HP 1/long rest',
        '1:Savage Attacks:combat:Extra die on crit damage'
      ];
      languages = ['Common', 'Orc'];
      proficiencyCount = {'Skill': 2};
      proficienciesGiven = {'Skill': ['Intimidation']};
      proficiencyChoices = {};

    } else if(race.match(/Dragonborn/)) {

      adjustment = '+2 strength/+1 charisma';
      features = [
        '1:Draconic Breath:combat:%1 %Vd6 %2 damage (DC %3 %4 half)',
        '1:Draconic Breath:save:Resistance %V damage'
      ];
      languages = ['Common', 'Draconic'];
      proficiencyCount = {};
      proficienciesGiven = {};
      proficiencyChoices = {};
      rules.defineRule('combatNotes.draconicBreathFeature',
        'level', '=', 'Math.floor((source + 9) / 5)'
      );
      rules.defineRule('combatNotes.draconicBreathFeature.1',
        'race', '=', 'source < "Gold" ? "5\'x30\' line" : "15\' cone"'
      );
      rules.defineRule('combatNotes.draconicBreathFeature.2',
        'race', '=', 'SRD5E.draconicBreathTypes[source]'
      );
      rules.defineRule('combatNotes.draconicBreathFeature.3',
        'constitutionModifier', '=', '8 + source',
        'proficiencyBonus', '+', null
      );
      rules.defineRule('combatNotes.draconicBreathFeature.4',
        'combatNotes.draconicBreathFeature.2', '=', 'source.match(/cold|poison/) ? "Con" : "Dex"'
      );
      rules.defineRule('saveNotes.draconicBreathFeature',
        'race', '=', 'SRD5E.draconicBreathTypes[source]'
      );

    } else if(race.match(/Dwarf/)) {

      adjustment = '+2 constitution';
      features = [
        "1:Darkvision:feature:R60' See one light level better",
        '1:Dwarven Armor Speed:ability:No speed penalty in heavy armor',
        '1:Dwarven Resilience:save:Adv vs. poison, resistance poison damage',
        '1:Slow:ability:-5 speed',
        '1:Stonecunning:skill:Dbl Prof on stonework History checks',
        "1:Tool Proficiency (Artisan's Tools)::",
        '1:Weapon Proficiency (Battleaxe/Handaxe/Light Hammer/Warhammer)::'
      ];
      languages = ['Common', 'Dwarven'];
      proficiencyCount = {'Tool':1, 'Weapon':4};
      proficienciesGiven = {
        'Weapon':['Battleaxe', 'Handaxe', 'Light Hammer', 'Warhammer']
      };
      proficiencyChoices = {
        'Tool':["Brewer's Supplies", "Mason's Tools", "Smith's Tools"]
      };
      rules.defineRule('abilityNotes.armorSpeedAdjustment',
        'abilityNotes.dwarvenArmorSpeed', '^', '0'
      );
      rules.defineRule('speed', 'abilityNotes.slowFeature', '+', '-5');

      if(race == 'Hill Dwarf') {
        adjustment += '/+1 wisdom';
        features.push(
          '1:Dwarven Toughness:combat:+%V HP'
        );
        rules.defineRule
          ('combatNotes.dwarvenToughnessFeature', 'level', '=', null);
// PHB
      } else if(race == 'Mountain Dwarf') {
        adjustment += '/+2 strength';
        proficiencyCount['Armor'] = 2;
        proficienciesGiven['Armor'] = ['Light', 'Medium'];
// ENDPHB
      }

    } else if(race.match(/Elf/)) {

      adjustment = '+2 dexterity';
      features = [
        "1:Darkvision:feature:R60' See one light level better",
        '1:Fey Ancestry:save:Adv vs. charmed, immune sleep',
        '1:Keen Senses:skill:Prof Perception',
        '1:Trance:feature:4 hr meditation gives benefit of 8 hr sleep'
      ];
      languages = ['Common', 'Elvish'];
      proficiencyCount = {'Skill': 1};
      proficienciesGiven = {'Skill': ['Perception']};
      proficiencyChoices = {};

      if(race == 'High Elf') {
        adjustment += '/+1 intelligence';
        features.push(
          '1:Cantrip:magic:Learn 1 additional Wizard cantrip (Int)', // TODO
          '1:Extra Language:feature:Speak 1 additional language',
          '1:Weapon Proficiency (Longbow/Longsword/Shortbow/Shortsword)::'
        );
        proficiencyCount['Weapon'] = 4;
        proficienciesGiven['Weapon'] =
          ['Longbow', 'Longsword', 'Shortbow', 'Shortsword'];
        rules.defineRule
          ('languageCount', 'featureNotes.extraLanguageFeature', '+', '1');
// PHB
      } else if(race == 'Wood Elf') {
        adjustment += '/+1 wisdom';
        features.push(
          '1:Fleet Of Foot:ability:+5 speed',
          '1:Mask Of The Wild:feature:Hide in light natural coverage',
          '1:Weapon Proficiency (Longbow/Longsword/Shortbow/Shortsword)::'
        );
        proficiencyCount['Weapon'] = 4;
        proficienciesGiven['Weapon'] =
          ['Longbow', 'Longsword', 'Shortbow', 'Shortsword'];
        rules.defineRule('speed', 'abilityNotes.fleetOfFootFeature', '+', '5');
      } else if(race == 'Dark Elf') {
        adjustment += '/+1 charisma';
        features.push(
          '1:Drow Magic:magic:<i>Dancing Lights</i> cantrip%V (Cha)', // TODO
          '1:Sunlight Sensitivity:combat:Disadv attack in direct sunlight',
          '1:Sunlight Sensitivity:skill:' +
            'Disadv sight Perception in direct sunlight',
          "1:Superior Darkvision:feature:R120' See one light level better",
          '1:Weapon Proficiency (Hand Crossbow/Rapier/Shortsword)::'
        );
        proficiencyCount['Weapon'] = 3;
        proficienciesGiven['Weapon'] =
          ['Hand Crossbow', 'Rapier', 'Shortsword'];
        rules.defineRule('magicNotes.drowMagicFeature', 'level', '=', 'source >= 3 ? ", cast <i>Faerie Fire</i>" + (source >= 5 ? ", <i>Darkness</i>" : "") + " 1/dy" : ""');
// ENDPHB
      }

    } else if(race.match(/Gnome/)) {

      adjustment = '+2 intelligence';
      features = [
        "1:Darkvision:feature:R60' See one light level better",
        '1:Gnome Cunning:save:Adv Cha/Int/Wis vs magic',
        '1:Slow:ability:-5 speed',
        '1:Small:ability:' // TODO
      ];
      languages = ['Common', 'Gnomish'];
      proficiencyCount = {};
      proficienciesGiven = {};
      proficiencyChoices = {};
      rules.defineRule('speed', 'abilityNotes.slowFeature', '+', '-5');

      if(race == 'Rock Gnome') {
        adjustment += '/+1 constitution';
        features.push(
          "1:Artificier's Lore:skill:" +
            'Dbl Prof on magic, alchemical, tech objects History checks',
          "1:Tinker:feature:Prof artisan's tools"
        );
        proficiencyCount['Tool'] = 1;
        proficienciesGiven['Tool'] = ['Artisan'];
// PHB
      } else if(race == 'Forest Gnome') {
        adjustment += '/+1 dexterity';
        features.push(
          '1:Natural Illusionist:magic:<i>Minor Illusion</i> cantrip (Int)',
          '1:Speak With Small Beasts:feature:' +
            'Simple communication with small animals'
        );
// ENDPHB
      }

    } else if(race.match(/Halfling/)) {

      adjustment = '+2 dexterity';
      features = [
        '1:Brave:save:Adv vs. frightened',
        '1:Lucky:feature:Reroll 1 on attack/ability/save',
        '1:Nimble:ability:Move through space occupied by larger creature',
        '1:Slow:ability:-5 speed',
        '1:Small:ability:' // TODO
      ];
      languages = ['Common', 'Halfling'];
      proficiencyCount = {};
      proficienciesGiven = {};
      proficiencyChoices = {};
      rules.defineRule('speed', 'abilityNotes.slowFeature', '+', '-5');

      if(race == 'Lightfoot Halfling') {
        adjustment += '/+1 charisma';
        features.push(
          '1:Stealthy:feature:Hide behind larger creature'
        );
// PHB
      } else if(race == 'Stout Halfling') {
        adjustment += '/+1 constitution';
        features.push(
          '1:Stout:save:Adv vs. poison, resistance poison damage'
        );
// ENDPHB
      }

    } else if(race.match(/Human/)) {

      adjustment = '+1 charisma/+1 constitution/+1 dexterity/+1 intelligence/+1 strength/+1 wisdom';
      features = [
        '1:Extra Language:feature:Speak 1 additional language'
      ];
      languages = ['Common'];
      proficiencyCount = {};
      proficienciesGiven = {};
      proficiencyChoices = {};
      rules.defineRule
        ('languageCount', 'featureNotes.extraLanguageFeature', '+', '1');

    } else if(race.match(/Tiefling/)) {

      adjustment = '+1 intelligence/+2 charisma';
      features = [
        "1:Darkvision:feature:R60' See one light level better",
        '1:Hellish Resistance:save:Resistance fire damage',
        '1:Infernal Legacy:magic:<i>Thaumaturgy</i> cantrip%V (Cha)' // TODO
      ];
      languages = ['Common', 'Infernal'];
      proficiencyCount = {};
      proficienciesGiven = {};
      proficiencyChoices = {};
      rules.defineRule('magicNotes.infernalLegacyFeature', 'level', '=', 'source >= 3 ? ", cast <i>Hellish Rebuke</i>" + (source >= 5 ? ", <i>Darkness</i>" : "") + " 1/dy" : ""');

    } else
      continue;

    SRD5E.defineRace(
      rules, race, adjustment, features, languages, proficiencyCount,
      proficienciesGiven, proficiencyChoices
    );

  }

};

/* Defines the rules related to skills. */
SRD5E.skillRules = function(rules, skills, tools) {

  var abilityNames = {
    'cha':'charisma', 'con':'constitution', 'dex':'dexterity',
    'int':'intelligence', 'str':'strength', 'wis':'wisdom'
  };

  rules.defineChoice('skills', skills);
  rules.defineChoice('tools', tools);

  for(var i = 0; i < skills.length; i++) {
    var pieces = skills[i].split(':');
    var skill = pieces[0];
    var ability = abilityNames[pieces[1]];
    rules.defineRule('skillBonus.' + skill,
      'skillProficiencies.' + skill, '?', null,
      'proficiencyBonus', '=', null
    );
    rules.defineNote('skills.' + skill + ':(' + pieces[1] + ') %V');
    rules.defineRule('skills.' + skill,
      ability + 'Modifier', '=', null,
      'skillBonus.' + skill, '+', null
    );
  }

};

/* Replaces spell names with longer descriptions on the character sheet. */
SRD5E.spellRules = function(rules, spells, descriptions) {
  if(spells == null) {
    spells = QuilvynUtils.getKeys(rules.choices.spells);
  }
  if(descriptions == null) {
    descriptions = SRD5E.spellsDescriptions;
  }
  var targets = rules.allTargets();
  for(var i = 0; i < spells.length; i++) {
    var spell = spells[i];
    var matchInfo = spell.match(/^([^\(]+)\(([A-Za-z ]+)(\d+)\s*(\w*)\)$/);
    if(matchInfo == null) {
      console.log("Bad format for spell " + spell);
      continue;
    }
    var classAbbr = matchInfo[2];
    var level = matchInfo[3];
    var name = matchInfo[1];
    var schoolAbbr = matchInfo[4];
    var description = descriptions[name];
    if(description == null) {
      console.log("No description for spell " + name);
      continue;
    }
    if(classAbbr.length > 2) {
      classAbbr = "Dom"; // Assume domain spell
    }
    var inserts = description.match(/\$(\w+|{[^}]+})/g);
    if(inserts != null) {
      for(var index = 1; index <= inserts.length; index++) {
        var insert = inserts[index - 1];
        var expr = insert[1] == "{" ?
            insert.substring(2, insert.length - 1) : insert.substring(1);
        expr = expr.replace(/lvl|L/g, 'source');
        rules.defineRule('spells.' + spell + '.' + index,
          'spells.' + spell, '?', null,
          'casterLevels.' + classAbbr, '=', expr
        );
        if(targets.includes('casterLevels.' + name)) {
          rules.defineRule('spells.' + spell + '.' + index,
            'casterLevels.' + name, '^=', expr
          );
        }
        description = description.replace(insert, "%" + index);
      }
    }
    rules.defineChoice("notes", "spells." + spell + ":" + description);
  }
};

/* Returns a random name for a character of race #race#. */
SRD5E.randomName = function(race) {

  /* Return a random character from #string#. */
  function randomChar(string) {
    return string.charAt(QuilvynUtils.random(0, string.length - 1));
  }

  if(race == null)
    race = 'Human';
  else if(race == 'Half Elf')
    race = QuilvynUtils.random(0, 99) < 50 ? 'Elf' : 'Human';
  else if(race.match(/Dwarf/))
    race = 'Dwarf';
  else if(race.match(/Elf/))
    race = 'Elf';
  else if(race.match(/Gnome/))
    race = 'Gnome';
  else if(race.match(/Halfling/))
    race = 'Halfling';
  else if(race.match(/Orc/))
    race = 'Orc';
  else
    race = 'Human';

  var clusters = {
    B:'lr', C:'hlr', D:'r', F:'lr', G:'lnr', K:'lnr', P:'lr', S:'chklt', T:'hr',
    W:'h',
    c:'hkt', l:'cfkmnptv', m: 'p', n:'cgkt', r: 'fv', s: 'kpt', t: 'h'
  };
  var consonants =
    {'Dwarf': 'dgkmnprst', 'Elf': 'fhlmnpqswy', 'Gnome': 'bdghjlmnprstw',
     'Halfling': 'bdfghlmnprst', 'Human': 'bcdfghjklmnprstvwz',
     'Orc': 'dgjkprtvxz'}[race];
  var endConsonant = '';
  var leading = 'ghjqvwy';
  var vowels =
    {'Dwarf': 'aeiou', 'Elf': 'aeioy', 'Gnome': 'aeiou',
     'Halfling': 'aeiou', 'Human': 'aeiou', 'Orc': 'aou'}[race];
  var diphthongs = {a:'wy', e:'aei', o: 'aiouy', u: 'ae'};
  var syllables = QuilvynUtils.random(0, 99);
  syllables = syllables < 50 ? 2 :
              syllables < 75 ? 3 :
              syllables < 90 ? 4 :
              syllables < 95 ? 5 :
              syllables < 99 ? 6 : 7;
  var result = '';
  var vowel;

  for(var i = 0; i < syllables; i++) {
    if(QuilvynUtils.random(0, 99) <= 80) {
      endConsonant = randomChar(consonants).toUpperCase();
      if(clusters[endConsonant] != null && QuilvynUtils.random(0, 99) < 15)
        endConsonant += randomChar(clusters[endConsonant]);
      result += endConsonant;
      if(endConsonant == 'Q')
        result += 'u';
    }
    else if(endConsonant.length == 1 && QuilvynUtils.random(0, 99) < 10) {
      result += endConsonant;
      endConsonant += endConsonant;
    }
    vowel = randomChar(vowels);
    if(endConsonant.length > 0 && diphthongs[vowel] != null &&
       QuilvynUtils.random(0, 99) < 15)
      vowel += randomChar(diphthongs[vowel]);
    result += vowel;
    endConsonant = '';
    if(QuilvynUtils.random(0, 99) <= 60) {
      while(leading.indexOf((endConsonant = randomChar(consonants))) >= 0)
        ; /* empty */
      if(clusters[endConsonant] != null && QuilvynUtils.random(0, 99) < 15)
        endConsonant += randomChar(clusters[endConsonant]);
      result += endConsonant;
    }
  }
  return result.substring(0, 1).toUpperCase() +
         result.substring(1).toLowerCase();

};

/* Returns the elements in a basic 5E character editor. */
SRD5E.initialEditorElements = function() {
  var abilityChoices = [
    3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18
  ];
  var editorElements = [
    ['name', 'Name', 'text', [20]],
    ['race', 'Race', 'select-one', 'races'],
    ['experience', 'Experience', 'text', [8]],
    ['levels', 'Levels', 'bag', 'levels'],
    ['imageUrl', 'Image URL', 'text', [20]],
    ['background', 'Background', 'select-one', 'backgrounds'],
    ['strength', 'Strength', 'select-one', abilityChoices],
    ['strengthAdjust', '', 'text', [3]],
    ['intelligence', 'Intelligence', 'select-one', abilityChoices],
    ['intellienceAdjust', '', 'text', [3]],
    ['wisdom', 'Wisdom', 'select-one', abilityChoices],
    ['wisdomAdjust', '', 'text', [3]],
    ['dexterity', 'Dexterity', 'select-one', abilityChoices],
    ['dexterityAdjust', '', 'text', [3]],
    ['constitution', 'Constitution', 'select-one', abilityChoices],
    ['constitutionAdjust', '', 'text', [3]],
    ['charisma', 'Charisma', 'select-one', abilityChoices],
    ['charismaAdjust', '', 'text', [3]],
    ['player', 'Player', 'text', [20]],
    ['alignment', 'Alignment', 'select-one', 'alignments'],
    ['gender', 'Gender', 'select-one', 'genders'],
    ['deity', 'Deity', 'select-one', 'deities'],
    ['origin', 'Origin', 'text', [20]],
    ['feats', 'Feats', 'set', 'feats'],
    ['selectableFeatures', 'Selectable Features', 'set', 'selectableFeatures'],
    ['skillProficiencies', 'Skills', 'set', 'skills'],
    ['toolProficiencies', 'Tools', 'set', 'tools'],
    ['languages', 'Languages', 'set', 'languages'],
    ['hitPoints', 'Hit Points', 'text', [4]],
    ['armor', 'Armor', 'select-one', 'armors'],
    ['shield', 'Shield', 'select-one', 'shields'],
    ['weapons', 'Weapons', 'bag', 'weapons'],
    ['spells', 'Spells', 'fset', 'spells'],
    ['notes', 'Notes', 'textarea', [40,10]],
    ['hiddenNotes', 'Hidden Notes', 'textarea', [40,10]]
  ];
  return editorElements;
};

/* Sets #attributes#'s #attribute# attribute to a random value. */
SRD5E.randomizeOneAttribute = function(attributes, attribute) {

  /*
   * Randomly selects #howMany# elements of the array #choices#, prepends
   * #prefix# to each, and sets those attributes in #attributes# to #value#.
   */
  function pickAttrs(attributes, prefix, choices, howMany, value) {
    var remaining = [].concat(choices);
    for(var i = 0; i < howMany && remaining.length > 0; i++) {
      var which = QuilvynUtils.random(0, remaining.length - 1);
      attributes[prefix + remaining[which]] = value;
      remaining = remaining.slice(0, which).concat(remaining.slice(which + 1));
    }
  }

  var attr;
  var attrs;
  var choices;
  var howMany;
  var i;

  if(attribute == 'armor') {
    var armors = this.getChoices('armors');
    attrs = this.applyRules(attributes);
    choices = ['None'];
    for(attr in armors) {
      if(attrs['armorProficiencies.' + attr] ||
         attrs['armorProficiencies.Light'] && armors[attr].indexOf('Li')>=0 ||
         attrs['armorProficiencies.Medium'] && armors[attr].indexOf('Me')>=0 ||
         attrs['armorProficiencies.Heavy'] && armors[attr].indexOf('He')>=0) {
        choices.push(attr);
      }
    }
    attributes['armor'] = choices[QuilvynUtils.random(0, choices.length - 1)];
  } else if(attribute == 'deity') {
    /* Pick a deity that's no more than one alignment position removed. */
    var aliInfo = attributes.alignment.match(/^([CLN]).* ([GEN])/);
    var aliPat;
    if(aliInfo == null) /* Neutral character */
      aliPat = '\\((N[ \\)]|N.|.N)';
    else if(aliInfo[1] == 'N')
      aliPat = '\\((N[ \\)]|.' + aliInfo[2] + ')';
    else if(aliInfo[2] == 'N')
      aliPat = '\\((N[ \\)]|' + aliInfo[1] + '.)';
    else
      aliPat = '\\(([N' + aliInfo[1] + '][N' + aliInfo[2] + '])';
    choices = [];
    for(attr in this.getChoices('deities')) {
      if(attr.match(aliPat))
        choices[choices.length] = attr;
    }
    if(choices.length > 0) {
      attributes['deity'] = choices[QuilvynUtils.random(0, choices.length - 1)];
    } else {
      attributes['deity'] = 'None';
    }
  } else if(attribute == 'feats' || attribute == 'features') {
    attribute = attribute == 'feats' ? 'feat' : 'selectableFeature';
    var countPat = new RegExp(
      attribute == 'feat' ? '^featCount$' : '^selectableFeatureCount\\.'
    );
    var prefix = attribute + 's';
    var suffix =
      attribute.substring(0, 1).toUpperCase() + attribute.substring(1);
    var toAllocateByType = {};
    attrs = this.applyRules(attributes);
    for(attr in attrs) {
      if(attr.match(countPat)) {
        toAllocateByType[attr.replace(countPat, '')] = attrs[attr];
      }
    }
    var availableChoices = {};
    var allChoices = this.getChoices(prefix);
    for(attr in allChoices) {
      if(attrs[prefix + '.' + attr] != null) {
        var type = '';
        for(var a in toAllocateByType) {
          if(QuilvynUtils.findElement(allChoices[attr].split('/'), a) >= 0 &&
             toAllocateByType[a] > 0) {
            type = a;
            break;
          }
        }
        toAllocateByType[type]--;
      } else if(attrs['features.' + attr] == null) {
        availableChoices[attr] = allChoices[attr];
      }
    }
    var debug = [];
    for(attr in toAllocateByType) {
      var availableChoicesInType = {};
      for(var a in availableChoices) {
        if(attr == '' ||
           QuilvynUtils.findElement(availableChoices[a].split('/'), attr) >= 0) {
          availableChoicesInType[a] = '';
        }
      }
      howMany = toAllocateByType[attr];
      debug[debug.length] = 'Choose ' + howMany + ' ' + attr + ' ' + prefix;
      while(howMany > 0 &&
            (choices=QuilvynUtils.getKeys(availableChoicesInType)).length > 0) {
        debug[debug.length] =
          'Pick ' + howMany + ' from ' +
          QuilvynUtils.getKeys(availableChoicesInType).length;
        var picks = {};
        pickAttrs(picks, '', choices, howMany, 1);
        debug[debug.length] =
          'From ' + QuilvynUtils.getKeys(picks).join(", ") + ' reject';
        for(var pick in picks) {
          attributes[prefix + '.' + pick] = 1;
          delete availableChoicesInType[pick];
        }
        var validate = this.applyRules(attributes);
        for(var pick in picks) {
          var name = pick.substring(0, 1).toLowerCase() +
                     pick.substring(1).replace(/ /g, '').
                     replace(/\(/g, '\\(').replace(/\)/g, '\\)');
          if(QuilvynUtils.sumMatching
               (validate,
                new RegExp('^(sanity|validation)Notes.'+name+suffix)) != 0) {
            delete attributes[prefix + '.' + pick];
            debug[debug.length - 1] += ' ' + name;
          } else {
            howMany--;
            delete availableChoices[pick];
          }
        }
      }
      debug[debug.length] = 'xxxxxxx';
    }
    if(window.DEBUG)
      attributes.notes =
        (attributes.notes ? attributes.notes + '\n' : '') + debug.join('\n');
  } else if(attribute == 'hitPoints') {
    attributes.hitPoints = 0;
    for(var klass in this.getChoices('levels')) {
      if((attr = attributes['levels.' + klass]) == null)
        continue;
      var matchInfo =
        this.getChoices('levels')[klass].match(/^((\d+)?d)?(\d+)$/);
      var number = matchInfo == null || matchInfo[2] == null ||
                   matchInfo[2] == '' ? 1 : matchInfo[2];
      var sides = matchInfo == null || matchInfo[3] == null ||
                  matchInfo[3] == '' ? 6 : matchInfo[3];
      attributes.hitPoints += number * sides;
      while(--attr > 0)
        attributes.hitPoints += QuilvynUtils.random(number, number * sides);
    }
  } else if(attribute == 'languages') {
    attrs = this.applyRules(attributes);
    howMany = attrs['languageCount'] || 0;
    choices = QuilvynUtils.getKeys(this.getChoices('languages'));
    pickAttrs(attributes, 'languages.', choices,
              howMany - QuilvynUtils.sumMatching(attrs, /^languages\./), 1);
  } else if(attribute == 'levels') {
    var assignedLevels = QuilvynUtils.sumMatching(attributes, /^levels\./);
    if(!attributes.level) {
      if(assignedLevels > 0)
        attributes.level = assignedLevels
      else if(attributes.experience)
        attributes.level =
          Math.floor((1 + Math.sqrt(1 + attributes.experience/125)) / 2);
      else
        // Random 1..8 with each value half as likely as the previous one.
        attributes.level =
          9 - Math.floor(Math.log(QuilvynUtils.random(2, 511)) / Math.log(2));
    }
    var max = SRD5E.levelsExperience[attributes.level] * 1000 - 1;
    var min = SRD5E.levelsExperience[attributes.level - 1] * 1000;
    if(!attributes.experience || attributes.experience < min)
      attributes.experience = QuilvynUtils.random(min, max);
    choices = QuilvynUtils.getKeys(this.getChoices('levels'));
    if(assignedLevels == 0) {
      var classesToChoose =
        attributes.level == 1 || QuilvynUtils.random(1,10) < 9 ? 1 : 2;
      // Find choices that are valid or can be made so
      while(classesToChoose > 0) {
        var which = 'levels.' + choices[QuilvynUtils.random(0,choices.length-1)];
        attributes[which] = 1;
        if(QuilvynUtils.sumMatching(this.applyRules(attributes),
             /^validationNotes.*(BaseAttack|CasterLevel|Spells)/) == 0) {
          assignedLevels++;
          classesToChoose--;
        } else {
          delete attributes[which];
        }
      }
    }
    while(assignedLevels < attributes.level) {
      var which = 'levels.' + choices[QuilvynUtils.random(0,choices.length-1)];
      while(!attributes[which]) {
        which = 'levels.' + choices[QuilvynUtils.random(0,choices.length-1)];
      }
      attributes[which]++;
      assignedLevels++;
    }
    delete attributes.level;
  } else if(attribute == 'name') {
    attributes['name'] = SRD5E.randomName(attributes['race']);
  } else if(attribute == 'shield') {
    attrs = this.applyRules(attributes);
    choices = ['None'];
    for(attr in this.getChoices('shields')) {
      if(attrs['armorProficiencies.' + attr] ||
         attrs['armorProficiencies.Shield']) {
        choices[choices.length] = attr;
      }
    }
    attributes['shield'] = choices[QuilvynUtils.random(0, choices.length - 1)];
  } else if(attribute == 'skills') {
    attrs = this.applyRules(attributes);
    howMany = attrs['proficiencyCount.Skill'] || 0;
    choices = [];
    for(attr in this.getChoices('skills')) {
      if(attrs['skillChoices.' + attr]) {
        choices[choices.length] = attr;
      }
    }
    pickAttrs(attributes, 'skillProficiencies.', choices,
              howMany - QuilvynUtils.sumMatching(attrs, /^skillProficiencies\./), 1);
  } else if(attribute == 'spells') {
    var allSpellsByClassAndLevel = {};
    var classAndLevel;
    attrs = this.applyRules(attributes);
    for(attr in this.getChoices('spells')) {
      classAndLevel = attr.split('(')[1].split(' ')[0];
      if(allSpellsByClassAndLevel[classAndLevel] == null)
        allSpellsByClassAndLevel[classAndLevel] = [];
      allSpellsByClassAndLevel[classAndLevel].push(attr);
    }
    for(attr in attrs) {
      if(!attr.startsWith('spellsKnown.'))
        continue;
      classAndLevel = attr.split('.')[1];
      howMany = attrs[attr];
      if(!classAndLevel.match(/\d$/)) {
        choices = [];
        for(var a in allSpellsByClassAndLevel) {
          if(a.startsWith(classAndLevel) &&
             !a.endsWith('0') &&
             attrs['spellSlots.' + a]) {
            choices = choices.concat(allSpellsByClassAndLevel[a]);
          }
        }
      } else if(classAndLevel.substring(0, 3) == 'Dom') {
        choices = [];
        for(var domain in this.getChoices('domains')) {
          if(attrs['domains.' + domain]) {
            var domainAndLevel = domain + classAndLevel.substring(3);
            if(allSpellsByClassAndLevel[domainAndLevel] != null) {
              choices=choices.concat(allSpellsByClassANdLevel[domainAndLevel]);
            }
          }
        }
      } else {
        choices = allSpellsByClassAndLevel[classAndLevel];
      }
      if(choices != null) {
        if(howMany == 'all') {
          howMany = choices.length;
        }
        var slots = attrs['spellSlots.' + classAndLevel];
        if(slots != null && slots < howMany) {
          howMany = slots;
        }
        pickAttrs
          (attributes, 'spells.', choices, howMany -
           QuilvynUtils.sumMatching(attributes, '^spells\\..*[(]' + classAndLevel + '[^0]'), 1);
      }
    }
  } else if(attribute == 'tools') {
    attrs = this.applyRules(attributes);
    howMany = attrs['proficiencyCount.Tool'] || 0;
    choices = [];
    for(attr in this.getChoices('tools')) {
      if(attrs['toolChoices.' + attr] ||
         attrs['toolChoices.' + this.getChoices('tools')[attr]]) {
        choices[choices.length] = attr;
      }
    }
    pickAttrs(attributes, 'toolProficiencies.', choices,
              howMany - QuilvynUtils.sumMatching(attrs, /^toolProficiencies\./), 1);
  } else if(attribute == 'weapons') {
    var weapons = this.getChoices('weapons');
    attrs = this.applyRules(attributes);
    choices = [];
    for(attr in weapons) {
      if(attrs['weaponProficiencies.' + attr] ||
         attrs['weaponProficiencies.Simple']&&weapons[attr].indexOf('Si')>=0 ||
         attrs['weaponProficiencies.Martial']&&weapons[attr].indexOf('Ma')>=0) {
        choices[choices.length] = attr;
      }
    }
    pickAttrs(attributes, 'weapons.', choices,
              3 - QuilvynUtils.sumMatching(attributes, /^weapons\./), 1);
  } else if(attribute == 'charisma' || attribute == 'constitution' ||
     attribute == 'dexterity' || attribute == 'intelligence' ||
     attribute == 'strength' || attribute == 'wisdom') {
    var rolls = [];
    for(i = 0; i < 4; i++)
      rolls[i] = QuilvynUtils.random(1, 6);
    rolls.sort();
    attributes[attribute] = rolls[1] + rolls[2] + rolls[3];
  } else if(this.getChoices(attribute + 's') != null) {
    attributes[attribute] =
      QuilvynUtils.randomKey(this.getChoices(attribute + 's'));
  }

};

/* Fixes as many validation errors in #attributes# as possible. */
SRD5E.makeValid = function(attributes) {

  var attributesChanged = {};
  var debug = [];
  var notes = this.getChoices('notes');

  // If 8 passes don't get rid of all repairable problems, give up
  for(var pass = 0; pass < 8; pass++) {

    var applied = this.applyRules(attributes);
    var fixedThisPass = 0;

    // Try to fix each sanity/validation note w/a non-zero value
    for(var attr in applied) {

      var matchInfo =
        attr.match(/^(sanity|validation)Notes\.(.*)([A-Z][a-z]+)/);
      var attrValue = applied[attr];

      if(matchInfo == null || !attrValue || notes[attr] == null) {
        continue;
      }

      var problemSource = matchInfo[2];
      var problemCategory = matchInfo[3].substring(0, 1).toLowerCase() +
                            matchInfo[3].substring(1).replace(/ /g, '');
      if(problemCategory == 'features') {
        problemCategory = 'selectableFeatures';
      }
      var requirements =
        notes[attr].replace(/^(Implies|Requires) /, '').split(/\s*\/\s*/);

      for(var i = 0; i < requirements.length; i++) {

        // Find a random requirement choice w/the format "name [op value]"
        var choices = requirements[i].split(/\s*\|\|\s*/);
        while(choices.length > 0) {
          var index = QuilvynUtils.random(0, choices.length - 1);
          matchInfo = choices[index].match(/^([^<>!=]+)(([<>!=~]+)(.*))?/);
          if(matchInfo != null) {
            break;
          }
          choices = choices.slice(0, index).concat(choice.slice(index + 1));
        }
        if(matchInfo == null) {
          continue;
        }

        var toFixCombiner = null;
        var toFixName = matchInfo[1].replace(/\s+$/, '');
        var toFixOp = matchInfo[3] == null ? '>=' : matchInfo[3];
        var toFixValue =
          matchInfo[4] == null ? 1 : matchInfo[4].replace(/^\s+/, '');;
        if(toFixName.match(/^(Max|Sum)/)) {
          toFixCombiner = toFixName.substring(0, 3);
          toFixName = toFixName.substring(4).replace(/^\s+/, '');
        }
        var toFixAttr = toFixName.substring(0, 1).toLowerCase() +
                        toFixName.substring(1).replace(/ /g, '');

        // See if this attr has a set of choices (e.g., race) or a category
        // attribute (e.g., a feat)
        choices = this.getChoices(toFixAttr + 's');
        if(choices == null) {
           choices = this.getChoices(problemCategory);
        }
        if(choices != null) {
          // Find the set of choices that satisfy the requirement
          var target =
            this.getChoices(problemCategory) == null ? toFixValue : toFixName;
          var possibilities = [];
          for(var choice in choices) {
            if((toFixOp.match(/[^!]=/) && choice == target) ||
               (toFixOp == '!=' && choice != target) ||
               (toFixCombiner != null && choice.indexOf(target) == 0) ||
               (toFixOp == '=~' && choice.match(new RegExp(target))) ||
               (toFixOp == '!~' && !choice.match(new RegExp(target)))) {
              possibilities[possibilities.length] = choice;
            }
          }
          if(possibilities.length == 0) {
            continue; // No fix possible
          }
          if(target == toFixName) {
            toFixAttr =
              problemCategory + '.' +
              possibilities[QuilvynUtils.random(0, possibilities.length - 1)];
          } else {
            toFixValue =
              possibilities[QuilvynUtils.random(0, possibilities.length - 1)];
          }
        }
        if((choices != null || attributes[toFixAttr] != null) &&
           attributesChanged[toFixAttr] == null) {
          // Directly-fixable problem
          debug[debug.length] =
            attr + " '" + toFixAttr + "': '" + attributes[toFixAttr] +
            "' => '" + toFixValue + "'";
          if(toFixValue == 0) {
            delete attributes[toFixAttr];
          } else {
            attributes[toFixAttr] = toFixValue;
          }
          attributesChanged[toFixAttr] = toFixValue;
          fixedThisPass++;
        } else if(problemCategory == 'total' && attrValue > 0 &&
                  (choices = this.getChoices(problemSource)) != null) {
          // Too many items allocated in a category
          var possibilities = [];
          for(var k in attributes) {
            if(k.match('^' + problemSource + '\\.') &&
               attributesChanged[k] == null) {
               possibilities[possibilities.length] = k;
            }
          }
          while(possibilities.length > 0 && attrValue > 0) {
            var index = QuilvynUtils.random(0, possibilities.length - 1);
            toFixAttr = possibilities[index];
            possibilities =
              possibilities.slice(0,index).concat(possibilities.slice(index+1));
            var current = attributes[toFixAttr];
            toFixValue = current > attrValue ? current - attrValue : 0;
            debug[debug.length] =
              attr + " '" + toFixAttr + "': '" + attributes[toFixAttr] +
              "' => '" + toFixValue + "'";
            if(toFixValue == 0) {
              delete attributes[toFixAttr];
            } else {
              attributes[toFixAttr] = toFixValue;
            }
            attrValue -= current - toFixValue;
            // Don't do this: attributesChanged[toFixAttr] = toFixValue;
            fixedThisPass++;
          }
        } else if(problemCategory == 'total' && attrValue < 0 &&
                  (choices = this.getChoices(problemSource)) != null) {
          // Too few items allocated in a category
          this.randomizeOneAttribute(attributes,
            problemSource == 'selectableFeatures' ? 'features' : problemSource
          );
          debug[debug.length] = attr + ' Allocate additional ' + problemSource;
          fixedThisPass++;
        } else if(attr.match(/validationNotes.abilityModifier(Sum|Minimum)/)) {
          // Special cases
          var abilities = {
            'charisma':'', 'constitution':'', 'dexterity':'',
            'intelligence':'', 'strength':'', 'wisdom':''
          };
          if(attr == 'validationNotes.abilityModifierMinimum') {
            toFixAttr = QuilvynUtils.randomKey(abilities);
            toFixValue = 14;
            debug[debug.length] =
              attr + " '" + toFixAttr + "': '" + attributes[toFixAttr] +
              "' => '" + toFixValue + "'";
            attributes[toFixAttr] = toFixValue;
            // Don't do this: attributesChanged[toFixAttr] = toFixValue;
            fixedThisPass++;
          } else {
            for(toFixAttr in abilities) {
              if(applied[toFixAttr + 'Modifier'] <= 0) {
                toFixValue = attributes[toFixAttr] + 2;
                debug[debug.length] =
                  attr + " '" + toFixAttr + "': '" + attributes[toFixAttr] +
                  "' => '" + toFixValue + "'";
                attributes[toFixAttr] = toFixValue;
                // Don't do this: attributesChanged[toFixAttr] = toFixValue;
                fixedThisPass++;
              }
            }
          }
        }

      }

    }

    debug[debug.length] = '-----';
    if(fixedThisPass == 0) {
      break;
    }

  }

  if(window.DEBUG)
    attributes.notes =
      (attributes.notes ? attributes.notes + '\n' : '') + debug.join('\n');

};

/* Returns HTML body content for user notes associated with this rule set. */
SRD5E.ruleNotes = function() {
  return '' +
    '<h2>SRD5E Quilvyn Module Notes</h2>\n' +
    'SRD5E Quilvyn Module Version ' + SRD5E_VERSION + '\n' +
    '\n' +
    '<h3>Usage Notes</h3>\n' +
    '<p>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '    Although they have a range increment, the weapons Club, Dagger,\n' +
    '    Light Hammer, Shortspear, Spear, and Trident are all considered\n' +
    '    melee weapons.  Substitute the ranged attack attribute for the\n' +
    '    melee attack attribute given on the character sheet when any of\n' +
    '    these is thrown.\n' +
    '  </li><li>\n' +
    '    The armor class of characters with the Dodge feat includes a +1\n' +
    '    bonus that applies only to one foe at a time.\n' +
    '  </li><li>\n' +
    '    A few feats have been renamed to emphasize the relationship\n' +
    '    between similar feats: "Shield Proficiency" and "Tower Shield\n' +
    '    Proficiency" to "Shield Proficiency (Heavy)" and "Shield\n' +
    '    Proficiency (Tower)"; "Simple Weapon Proficiency" to "Weapon\n' +
    '    Proficiency (Simple)"; "Exotic Weapon Proficiency" and "Martial\n' +
    '    Weapon Proficiency" to "Weapon Proficiency" (a base feat that\n' +
    '    should be used to define weapon-specific subfeats).\n' +
    '  </li><li>\n' +
    '    The distinction between feats and selectable features is\n' +
    '    arbitrary.  Selectable features could be treated as feats\n' +
    '    restricted to specific classes; however, doing so would\n' +
    '    significantly clutter up the feat selection list.\n' +
    '  </li><li>\n' +
    '    Monk bonus feats are instead treated as selectable features,\n' +
    '    because the selections are so restricted and because monks do not\n' +
    '    need to meet the normal requirements for the feats.\n' +
    '  </li><li>\n' +
    '    Use the animal companion editing fields to enter the creature\n' +
    '    types and names of Paladin mounts and Blackguard fiendish servants.\n'+
    '  </li>\n' +
    '</ul>\n' +
    '</p>\n' +
    '\n' +
    '<h3>Limitations</h3>\n' +
    '<p>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '    Racial favored class is not reported.\n' +
    '  </li><li>\n' +
    '    You can only select the feats Extra Turning, Spell Mastery,\n' +
    '    and Toughness once.  Multiple selections of these feats can be\n' +
    '    handled by defining custom feats (e.g., Improved Toughness).\n' +
    '  </li><li>\n' +
    '    Quilvyn provides no place other than the notes section to enter\n' +
    '    mundane possessions like lanterns and rope. The same goes for\n' +
    '    physical description.\n' +
    '  </li><li>\n' +
    '    Quilvyn presently defines no way to add additional types of armor\n' +
    '    because of all the extra information that would need to be\n' +
    '    specified&#151;arcane spell failure percentage, AC bonus, max\n' +
    '    dexterity bonus, skill check penalty, etc.\n' +
    '  </li><li>\n' +
    '    Quilvyn has problems dealing with attributes containing an\n' +
    '    uncapitalized word.  This is why, e.g., Quilvyn defines the skills\n' +
    '    "Sleight Of Hand" and "Knowledge (Arcana)" instead of "Sleight of\n' +
    '    Hand" and "Knowledge (arcana)".  There are other occasions when\n' +
    '    Quilvyn is picky about case; when defining your own attributes,\n' +
    '    it\'s safest to follow the conventions Quilvyn uses.\n' +
    '  </li><li>\n' +
    '    The customRule interface is not very intuitive, making it more\n' +
    '    confusing to add new rules than it should be.\n' +
    '  </li>\n' +
    '</ul>\n' +
    '</p>\n' +
    '\n' +
    '<h3>Known Bugs</h3>\n' +
    '<p>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '    Quilvyn adds the dexterity modifier to attack throws for all\n' +
    '    weapons of characters with the Weapon Finesse feat, not just\n' +
    '    light weapons.\n' +
    '  </li><li>\n' +
    '    When an character ability score is modified, Quilvyn recalculates\n' +
    '    attributes based on that ability from scratch.  For example,\n' +
    '    bumping intelligence when a character reaches fourth level causes\n' +
    '    Quilvyn to recompute the number of skill points awarded at first\n' +
    '    level.\n' +
    '  </li><li>\n' +
    '    Multi-class characters get quadruple spell points for the first\n' +
    '    level in each class, instead of just the first class.\n' +
    '  </li>\n' +
    '</ul>\n' +
    '</p>\n';
};

SRD5E.defineBackground = function(
  rules, name, features, languages, proficiencyCount, proficienciesGiven,
  proficiencyChoices
) {

  var prefix =
    name.substring(0, 1).toLowerCase() + name.substring(1).replace(/ /g, '');

  rules.defineChoice('backgrounds', name);
  rules.defineRule
    ('isBackground.' + name, 'background', '=', 'source == "' + name + '" ? 1 : null');

  if(features != null) {
    for(var i = 0; i < features.length; i++) {
      var pieces = features[i].split(/:/);
      var feature = pieces[1];
      var featurePrefix =
        feature.substring(0, 1).toLowerCase() + feature.substring(1).replace(/ /g, '');
      var level = pieces[0];
      var note = pieces[3];
      var section = pieces[2];
      rules.defineRule(prefix + 'Features.' + feature,
        'isBackground.' + name, '?', null,
        'level', '=', 'source >= ' + level + ' ? 1 : null'
      );
      rules.defineRule
        ('features.' + feature, prefix + 'Features.' + feature, '+=', null);
      if(section != '')
        rules.defineNote
          (section + 'Notes.' + featurePrefix + 'Feature:' + note);
    }
    rules.defineSheetElement(name + ' Features', 'Feats+', null, '; ');
  }

  if(languages != null) {
    rules.defineRule
      ('languageCount', 'isBackground.' + name, '+', languages.length);
    for(var i = 0; i < languages.length; i++) {
      if(languages[i] != '')
        rules.defineRule
          ('languages.' + languages[i], 'isBackground.' + name, '=', '1');
    }
  }

  if(proficiencyCount != null) {
    for(var a in proficiencyCount) {
      rules.defineRule('proficiencyCount.' + a,
        'isBackground.' + name, '+=', proficiencyCount[a]
      );
    }
  }

  if(proficienciesGiven != null) {
    for(var a in proficienciesGiven) {
      for(var i = 0; i < proficienciesGiven[a].length; i++) {
        rules.defineRule(a.toLowerCase() + 'Proficiencies.' + proficienciesGiven[a][i], 'isBackground.' + name, '=', '1');
      }
    }
  }

  if(proficiencyChoices != null) {
    for(var a in proficiencyChoices) {
      for(var i = 0; i < proficiencyChoices[a].length; i++) {
        rules.defineRule(a.toLowerCase() + 'Choices.' + proficiencyChoices[a][i], 'isBackground.' + name, '=', '1');
      }
    }
  }

}

/*
 * A convenience function that adds #name# to the list of valid classes in
 * #rules#.  Characters of class #name# roll #hitDice# ([Nd]S, where N is the
 * number of dice and S the number of sides) more hit points at each level.
 * All other parameters are optional.  #skillPoints# is the number of skill
 * points a character of the class receives each level; #baseAttackBonus#,
 * #saveFortitudeBonus#, #saveReflexBonus# and #saveWillBonus# are JavaScript
 * expressions that compute the attack and saving throw bonuses the character
 * accumulates each class level; #armorProficiencyLevel#,
 * #shieldProficiencyLevel# and #weaponProficiencyLevel# indicate any
 * proficiency in these categories that characters of the class gain;
 * #classSkills# is an array of skills that are class skills (as opposed to
 * cross-class) for the class, #features# an array of level:feature name pairs
 * indicating features that the class acquires when advancing levels,
 * #spellsKnown# an array of information about the type, number, and level of
 * spells known at each class level, #spellSlots# an array of information
 * about the type, number, and level of spells castable per day at each class
 * level, and #spellAbility# the ability that pertains to this class' spells.
 */
SRD5E.defineClass = function(
  rules, name, hitDice, features, selectableFeatures, proficiencyCount,
  proficienciesGiven, proficiencyChoices, spellAbility, spellsKnown,
  spellSlots, spells
) {

  var classLevel = 'levels.' + name;
  rules.defineChoice('levels', name + ':' + hitDice);

  if(features != null) {
    var prefix =
      name.substring(0, 1).toLowerCase() + name.substring(1).replace(/ /g, '');
    for(var i = 0; i < features.length; i++) {
      var pieces = features[i].split(/:/);
      var feature = pieces[1];
      var featurePrefix =
        feature.substring(0, 1).toLowerCase() + feature.substring(1).replace(/ /g, '');
      var level = pieces[0];
      var note = pieces[3];
      var section = pieces[2];
      rules.defineRule(prefix + 'Features.' + feature,
        'levels.' + name, '=', 'source >= ' + level + ' ? 1 : null'
      );
      rules.defineRule
        ('features.' + feature, prefix + 'Features.' + feature, '+=', null);
      if(section != '')
        rules.defineNote
          (section + 'Notes.' + featurePrefix + 'Feature:' + note);
    }
    rules.defineSheetElement(name + ' Features', 'Feats+', null, '; ');
  }
  if(selectableFeatures != null) {
    var prefix =
      name.substring(0, 1).toLowerCase() + name.substring(1).replace(/ /g, '');
    for(var i = 0; i < selectableFeatures.length; i++) {
      var pieces = selectableFeatures[i].split(/:/);
      var feature = pieces[1];
      var featurePrefix =
        feature.substring(0, 1).toLowerCase() + feature.substring(1).replace(/ /g, '');
      var level = pieces[0];
      var note = pieces[3];
      var section = pieces[2];
      var choice = name + ' ' + feature;
      rules.defineChoice('selectableFeatures', choice + ':' + name);
      rules.defineRule(prefix + 'Features.' + feature,
        'selectableFeatures.' + choice, '+=', null
      );
      rules.defineRule
        ('features.' + feature, prefix + 'Features.' + feature, '+=', null);
      rules.defineNote('validationNotes.' + prefix + feature.replace(/ /g, '') + 'SelectableFeatureLevels:Requires ' + name + ' >= ' + level);
      if(section != '')
        rules.defineNote
          (section + 'Notes.' + featurePrefix + 'Feature:' + note);
    }
  }

  if(proficiencyCount != null) {
    for(var a in proficiencyCount) {
      rules.defineRule
        ('proficiencyCount.' + a, classLevel, '+=', proficiencyCount[a]);
    }
  }

  if(proficienciesGiven != null) {
    for(var a in proficienciesGiven) {
      for(var i = 0; i < proficienciesGiven[a].length; i++) {
        rules.defineRule(a.toLowerCase() + 'Proficiencies.' + proficienciesGiven[a][i], classLevel, '=', '1');
      }
    }
  }

  if(proficiencyChoices != null) {
    for(var a in proficiencyChoices) {
      for(var i = 0; i < proficiencyChoices[a].length; i++) {
        rules.defineRule(a.toLowerCase() + 'Choices.' + proficiencyChoices[a][i], classLevel, '=', '1');
      }
    }
  }

  if(spellsKnown != null) {
    var spellModifier = spellAbility + 'Modifier';
    rules.defineRule('spellsKnownLevel.' + name,
      'levels.' + name, '=', null,
      'magicNotes.casterLevelBonusFeature', '+', null
    );
    rules.defineRule('spellAttackModifier.' + name,
      'levels.' + name, '?', null,
      spellModifier, '=', null,
      'proficiencyBonus', '+', null
    );
    for(var i = 0; i < spellsKnown.length; i++) {
      var spellTypeAndLevel = spellsKnown[i].split(/:/)[0];
      var spellType = spellTypeAndLevel.replace(/\d+/, '');
      var code = spellsKnown[i].substring(spellTypeAndLevel.length + 1).
                 split(/\//).reverse().join('source >= ');
      code = code.replace(/:/g, ' ? ').replace(/source/g, ' : source');
      code = 'source >= ' + code + ' : null';
      if(code.indexOf('source >= 1 ?') >= 0) {
        code = code.replace(/source >= 1 ./, '').replace(/ : null/, '');
      }
      rules.defineRule('spellsKnown.' + spellTypeAndLevel,
        'spellsKnownLevel.' + name, '=', code
      );
      rules.defineRule('spellDifficultyClass.' + spellType,
        'casterLevels.' + spellType, '?', null,
        spellModifier, '=', '8 + source',
        'proficiencyBonus', '+', null
      );
    }
    for(var i = 0; i < spellSlots.length; i++) {
      var spellTypeAndLevel = spellSlots[i].split(/:/)[0];
      var spellLevel = spellTypeAndLevel.replace(/[A-Z]*/, '');
      var code = spellSlots[i].substring(spellTypeAndLevel.length + 1).
                 split(/\//).reverse().join('source >= ');
      code = code.replace(/:/g, ' ? ').replace(/source/g, ' : source');
      code = 'source >= ' + code + ' : null';
      if(code.indexOf('source >= 1 ?') >= 0) {
        code = code.replace(/source >= 1 ./, '').replace(/ : null/, '');
      }
      rules.defineRule('spellSlots.' + spellTypeAndLevel,
        'spellsKnownLevel.' + name, '=', code
      );
    }

  }

  // TODO spells

};

/*
 * A convenience function that adds #name# to the list of valid races in
 * #rules#.  #abilityAdjustment# is either null or a note of the form "[+-]n
 * Ability[/[+-]n Ability]*", indicating ability adjustments for the race.
 * #features# is either null or an array of strings of the form
 * "level:Feature:section:note", indicating a list of features associated
 * with the race, the character levels at which they're acquired, and the
 * descriptive section and note for the feature. #languages# is an array of
 * languages known by all members of the race. #proficiencyCount#,
 * #proficienciesGiven#, and #proficiencyChoices# are dictionaries indicating
 * the armor, skill, tool, and weapon proficiencies of the race.
 */
SRD5E.defineRace = function(
  rules, name, abilityAdjustment, features, languages, proficiencyCount,
  proficienciesGiven, proficiencyChoices
) {

  rules.defineChoice('races', name);

  rules.defineRule
    ('isRace.' + name, 'race', '=', 'source == "' + name + '" ? 1 : null');

  var prefix =
    name.substring(0, 1).toLowerCase() + name.substring(1).replace(/ /g, '');

  if(abilityAdjustment != null) {
    var abilityNote = 'abilityNotes.' + prefix + 'AbilityAdjustment';
    rules.defineNote(abilityNote + ':' + abilityAdjustment);
    var adjustments = abilityAdjustment.split(/\//);
    for(var i = 0; i < adjustments.length; i++) {
      var amountAndAbility = adjustments[i].split(/ +/);
      rules.defineRule
        (amountAndAbility[1], abilityNote, '+', amountAndAbility[0]);
    }
    rules.defineRule(abilityNote, 'isRace.' + name, '=', '1');
  }

  if(features != null) {
    for(var i = 0; i < features.length; i++) {
      var pieces = features[i].split(/:/);
      var feature = pieces[1];
      var featurePrefix =
        feature.substring(0, 1).toLowerCase() + feature.substring(1).replace(/ /g, '');
      var level = pieces[0];
      var note = pieces[3];
      var section = pieces[2];
      var matchInfo;
      if(level == '1') {
        rules.defineRule
          (prefix + 'Features.' + feature, 'isRace.' + name, '=', '1');
      } else {
        rules.defineRule(prefix + 'Features.' + feature,
          'isRace.' + name, '?', '1',
          'level', '=', 'source >= ' + level + ' ? 1 : null'
        );
      }
      rules.defineRule
        ('features.' + feature, prefix + 'Features.' + feature, '+=', null);
      if(section != '')
        rules.defineNote
          (section + 'Notes.' + featurePrefix + 'Feature:' + note);
    }
    rules.defineSheetElement(name + ' Features', 'Feats+', null, '; ');
  }

  if(languages != null) {
    rules.defineRule('languageCount', 'isRace.' + name, '+', languages.length);
    for(var i = 0; i < languages.length; i++) {
      rules.defineRule('languages.' + languages[i], 'isRace.' + name, '=', '1');
    }
  }

  if(proficiencyCount != null) {
    for(var a in proficiencyCount) {
      rules.defineRule
        ('proficiencyCount.' + a, 'isRace.' + name, '+=', proficiencyCount[a]);
    }
  }

  if(proficienciesGiven != null) {
    for(var a in proficienciesGiven) {
      for(var i = 0; i < proficienciesGiven[a].length; i++) {
        rules.defineRule(a.toLowerCase() + 'Proficiencies.' + proficienciesGiven[a][i], 'isRace.' + name, '=', '1');
      }
    }
  }

  if(proficiencyChoices != null) {
    for(var a in proficiencyChoices) {
      for(var i = 0; i < proficiencyChoices[a].length; i++) {
        rules.defineRule(a.toLowerCase() + 'Choices.' + proficiencyChoices[a][i], 'isRace.' + name, '=', '1');
      }
    }
  }

};

/* Convenience functions that invoke QuilvynRules methods on the SRD5E rules. */
SRD5E.applyRules = function() {
  return SRD5E.rules.applyRules.apply(SRD5E.rules, arguments);
};

SRD5E.defineChoice = function() {
  return SRD5E.rules.defineChoice.apply(SRD5E.rules, arguments);
};

SRD5E.defineEditorElement = function() {
  return SRD5E.rules.defineEditorElement.apply(SRD5E.rules, arguments);
};

SRD5E.defineNote = function() {
  return SRD5E.rules.defineNote.apply(SRD5E.rules, arguments);
};

SRD5E.defineRule = function() {
  return SRD5E.rules.defineRule.apply(SRD5E.rules, arguments);
};

SRD5E.defineSheetElement = function() {
  return SRD5E.rules.defineSheetElement.apply(SRD5E.rules, arguments);
};

SRD5E.getChoices = function() {
  return SRD5E.rules.getChoices.apply(SRD5E.rules, arguments);
};

SRD5E.isSource = function() {
  return SRD5E.rules.isSource.apply(SRD5E.rules, arguments);
};
