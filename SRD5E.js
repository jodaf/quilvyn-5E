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

var SRD5E_VERSION = '1.8.1.0';

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
  rules.defineChoice('extras', 'feats', 'featCount', 'selectableFeatureCount');
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
  'None:', 'Padded:Li Bu', 'Leather:Li', 'Studded Leather:Li', 'Hide:Me',
  'Chain Shirt:Li', 'Scale Mail:Me Bu', 'Breastplate:Me', 'Half Plate:Me Bu',
  'Ring Mail:He Bu', 'Chain Mail:He Bu', 'Splint:He Bu', 'Plate:He Bu'
];
SRD5E.BACKGROUNDS = ['Acolyte'];
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
SRD5E.FEATS = [
  'Ability Boost', 'Ability Boost2', 'Ability Boost3', 'Ability Boost4',
  'Ability Boost5', 'Ability Boost6', 'Ability Boost7', 'Grappler'
];
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
  'White Dragonborn', 'Hill Dwarf', 'High Elf', 'Rock Gnome', 'Half-Elf',
  'Half-Orc', 'Lightfoot Halfling', 'Human', 'Tiefling'
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
  'Arcane Hand':'Evocation',
  'Arcane Lock':'Abjuration',
  'Arcane Sword':'Evocation',
  "Arcanist's Magic Aura":'Illusion',
  'Astral Projection':'Necromancy',
  'Augury':'Divination',
  'Awaken':'Transmutation',

  'Bane':'Enchantment',
  'Banishment':'Abjuration',
  'Barkskin':'Transmutation',
  'Beacon Of Hope':'Abjuration',
  'Bestow Curse':'Necromancy',
  'Black Tentacles':'Conjuration',
  'Blade Barrier':'Evocation',
  'Bless':'Enchantment',
  'Blight':'Necromancy',
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
  'Circle Of Death':'Necromancy',
  'Clairvoyance':'Divination',
  'Clone':'Necromancy',
  'Cloudkill':'Conjuration',
  'Color Spray':'Illusion',
  'Command':'Enchantment',
  'Commune':'Divination',
  'Commune With Nature':'Divination',
  'Comprehend Languages':'Divination',
  'Compulsion':'Enchantment',
  'Cone Of Cold':'Evocation',
  'Confusion':'Enchantment',
  'Conjure Animals':'Conjuration',
  'Conjure Celestial':'Conjuration',
  'Conjure Elemental':'Conjuration',
  'Conjure Fey':'Conjuration',
  'Conjure Minor Elementals':'Conjuration',
  'Conjure Woodland Beings':'Conjuration',
  'Contact Other Plane':'Divination',
  'Contagion':'Necromancy',
  'Contingency':'Evocation',
  'Continual Flame':'Evocation',
  'Control Water':'Transmutation',
  'Control Weather':'Transmutation',
  'Counterspell':'Abjuration',
  'Create Food And Water':'Conjuration',
  'Create Or Destroy Water':'Transmutation',
  'Create Undead':'Necromancy',
  'Creation':'Illusion',
  'Cure Wounds':'Evocation',

  'Dancing Lights':'Evocation',
  'Darkness':'Evocation',
  'Darkvision':'Transmutation',
  'Daylight':'Evocation',
  'Death Ward':'Abjuration',
  'Delayed Blast Fireball':'Evocation',
  'Demiplane':'Conjuration',
  'Detect Evil And Good':'Divination',
  'Detect Magic':'Divination',
  'Detect Poison And Disease':'Divination',
  'Detect Thoughts':'Divination',
  'Dimension Door':'Conjuration',
  'Disguise Self':'Illusion',
  'Disintegrate':'Transmutation',
  'Dispel Evil And Good':'Abjuration',
  'Dispel Magic':'Abjuration',
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
  'Enhance Ability':'Transmutation',
  'Enlarge/Reduce':'Transmutation',
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

  'Gaseous Form':'Transmutation',
  'Gate':'Conjuration',
  'Geas':'Enchantment',
  'Gentle Repose':'Necromancy',
  'Giant Insect':'Transmutation',
  'Glibness':'Transmutation',
  'Globe Of Invulnerability':'Abjuration',
  'Glyph Of Warding':'Abjuration',
  'Goodberry':'Transmutation',
  'Grease':'Conjuration',
  'Greater Invisibility':'Illusion',
  'Greater Restoration':'Abjuration',
  'Guardian Of Faith':'Conjuration',
  'Guards And Wards':'Abjuration',
  'Guidance':'Divination',
  'Guiding Bolt':'Evocation',
  'Gust Of Wind':'Evocation',

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
  'Hideous Laughter':'Enchantment',
  'Hold Monster':'Enchantment',
  'Hold Person':'Enchantment',
  'Holy Aura':'Abjuration',
  "Hunter's Mark":'Divination',
  'Hypnotic Pattern':'Illusion',

  'Ice Storm':'Evocation',
  'Identify':'Divination',
  'Illusory Script':'Illusion',
  'Imprisonment':'Abjuration',
  'Incendiary Cloud':'Conjuration',
  'Inflict Wounds':'Necromancy',
  'Insect Plague':'Conjuration',
  'Instant Summons':'Conjuration',
  'Invisibility':'Illusion',
  'Irresistible Dance':'Enchantment',

  'Jump':'Transmutation',

  'Knock':'Transmutation',

  'Legend Lore':'Divination',
  'Lesser Restoration':'Abjuration',
  'Levitate':'Transmutation',
  'Light':'Evocation',
  'Lightning Bolt':'Evocation',
  'Locate Animals Or Plants':'Divination',
  'Locate Creature':'Divination',
  'Locate Object':'Divination',
  'Longstrider':'Transmutation',

  'Mage Armor':'Conjuration',
  'Mage Hand':'Conjuration',
  'Magic Circle':'Abjuration',
  'Magic Jar':'Necromancy',
  'Magic Missile':'Evocation',
  'Magic Mouth':'Illusion',
  'Magic Weapon':'Transmutation',
  'Magnificent Mansion':'Conjuration',
  'Major Image':'Illusion',
  'Mass Cure Wounds':'Evocation',
  'Mass Heal':'Evocation',
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
  'Phantasmal Killer':'Illusion',
  'Phantom Steed':'Illusion',
  'Planar Ally':'Conjuration',
  'Planar Binding':'Abjuration',
  'Plane Shift':'Conjuration',
  'Plant Growth':'Transmutation',
  'Poison Spray':'Conjuration',
  'Polymorph':'Transmutation',
  'Power Word Kill':'Enchantment',
  'Power Word Stun':'Enchantment',
  'Prayer Of Healing':'Evocation',
  'Prestidigitation':'Transmutation',
  'Prismatic Spray':'Evocation',
  'Prismatic Wall':'Abjuration',
  'Private Sanctum':'Abjuration',
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
  'Regenerate':'Transmutation',
  'Reincarnate':'Transmutation',
  'Remove Curse':'Abjuration',
  'Resilient Sphere':'Evocation',
  'Resistance':'Abjuration',
  'Resurrection':'Necromancy',
  'Reverse Gravity':'Transmutation',
  'Revivify':'Necromancy',
  'Rope Trick':'Transmutation',

  'Sacred Flame':'Evocation',
  'Sanctuary':'Abjuration',
  'Scorching Ray':'Evocation',
  'Scrying':'Divination',
  'Secret Chest':'Conjuration',
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
  'Stinking Cloud':'Conjuration',
  'Stone Shape':'Transmutation',
  'Stoneskin':'Abjuration',
  'Storm Of Vengeance':'Conjuration',
  'Suggestion':'Enchantment',
  'Sunbeam':'Evocation',
  'Sunburst':'Evocation',
  'Symbol':'Abjuration',

  'Telekinesis':'Transmutation',
  'Telepathic Bond':'Divination',
  'Teleport':'Conjuration',
  'Teleportation Circle':'Conjuration',
  'Thaumaturgy':'Transmutation',
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
  'Word Of Recall':'Conjuration',

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
  'Disguise Kit:', 'Forgery Kit:',
  'Dice Set:Game', 'Dragonchess Set:Game', 'Playing Card Set:Game',
  'Three-Dragon Ante Set:Game',
  'Herbalism Kit:',
  'Bagpipes:Music', 'Drum:Music', 'Dulcimer:Music', 'Flute:Music',
  'Lute:Music', 'Lyre:Music', 'Horn:Music', 'Pan Flute:Music', 'Shawm:Music',
  'Viol:Music',
  "Navigator's Tools:", "Poisoner's Kit:", "Thieves' Tools:",
  'Vehicle (Land):', 'Vehicle (Water):'
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
SRD5E.VIEWERS = ['Collected Notes', ,'Compact', 'Standard'];
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
  'Sling:d4r30 Si', 'Spear:d8r20 Si Ve', 'Trident:d8r20 Ma Ve', 'Unarmed:d1 Si',
  'War Pick:d8 Ma 1h', 'Warhammer:d8 Ma Ve', 'Whip:d4 Ma 1h Fi'
];

// Related information used internally by SRD5E
SRD5E.armorsArmorClassBonuses = {
  'None': null, 'Padded': 1, 'Leather': 1, 'Studded Leather': 2,
  'Hide': 2, 'Chain Shirt': 3, 'Scale Mail': 4, 'Breastplate': 4,
  'Half Plate': 5, 'Ring Mail': 4, 'Chain Mail': 6, 'Splint': 7, 'Plate': 8
};
SRD5E.armorsMaxDexBonuses = {
  'None': null, 'Padded': null, 'Leather': null, 'Studded Leather': null,
  'Hide': 2, 'Chain Shirt': 2, 'Scale Mail': 2, 'Breastplate': 2,
  'Half Plate': 2, 'Ring Mail': 0, 'Chain Mail': 0, 'Splint': 0, 'Plate': 0
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
  85, 100, 120, 140, 165, 195, 225, 265, 305, 355, 1000
];
SRD5E.spellsDescriptions = {
  'Acid Arrow':"R90' Ranged spell attack 4d4 HP (miss half), 2d4 HP next turn",
  'Acid Splash':
    "R60' Ranged touch ${Math.floor((lvl+1)/6) + 1}d6 HP acid (Dex neg)",
  'Aid':"R30' Three targets +5 or more HP for 8 hr",
  'Alarm':"R30' Alert when tiny or larger creature enters 20' cu for 8 hr",
  'Alter Self':
    "Self aquatic, look different, or nat weapons for conc/1 hr",
  'Animal Friendship':
    "R30' Target beast(s) convinced of good intent for 1 dy (Wis neg)",
  'Animal Messenger':
    "R30' Tiny beast target move 24+ hr to deliver 25-word message to person described",
  'Animal Shapes':
    "R30' Polymorph all targets in range into max CR 4 max lg creature",
  'Animate Dead':
    "R10' Animate med/small bones/corpse, command w/in 60' for 1 dy",
  'Animate Objects':
    "R120' Animate 10 sm/5 md/2 lg/1 hg objects, command w/in 500' for conc/1 min",
  'Antilife Shell':"Self 10' sphere prevents living passage for conc/1 hr",
  'Antimagic Field':"Self 10' sphere suppresses magic for conc/1 hr",
  'Antipathy/Sympathy':
    "R60' Target object repels/attracts specified creatures for 10 dy",
  'Arcane Eye':"R30' See through invisible eye for conc/1 hr",
  'Arcane Hand':
    "R120' AC20, Str 26, Dex 10 hand can punch, push, grasp, block for conc/1 min",
  'Arcane Lock':"Touched barrier passable only by designated until dispelled",
  'Arcane Sword':"Force weapon 3d10, move 20' for conc/1 min",
  "Arcanist's Magic Aura":"Target reports false divinations for 1 dy",
  'Astral Projection':
    "Self + 8 companions w/in 10' project to astral plane until dispelled or 0 HP",
  'Augury':"Discern whether act w/in 30 min will yield weal/woe",
  'Awaken':"Touched beast or plant Int 10, friendly for 30 dy",

  'Bane':"R30' 3 targets -1d4 from attack/save (Cha neg) for conc/1 min",
  'Banishment':"R60' target banish to home/demiplane (Cha neg) for conc/1 min",
  'Barkskin':"Touched AC 16 for conc/1 hr",
  'Beacon Of Hope':"R30' Targets Adv Wis/death saves, max heal for conc/1 min",
  'Bestow Curse':
    "Touched one of Disadv specified ability rolls, Disadv self attacks, Wis save to take action, take +1d8 HP necrotic from self attacks (Wis neg) for conc/1 min",
  'Black Tentacles':
    "R90' All in 20' sq 3d6 HP and restrained for conc/1 min (Dex neg)",
  'Blade Barrier':
    "R90' 100'x20'x5' blade wall passers 6d10 HP slashing (Dex neg) for conc/10 min",
  'Bless':"R30' 3 targets +1d4 to attack/save rolls for conc/1 min",
  'Blight':"R30' target 8d8 HP necrotic (Con half)",
  'Blindness/Deafness':"R30' target blind or deaf (Con neg) for 1 min",
  'Blink':"Self 50% chance of ethereal for 1 min",
  'Blur':"Self foes Disadv attack for conc/1 min",
  'Branding Smite':
    "Self next attack +2d6 HP radiant and visible for conc/1 min",
  'Burning Hands':"15' cone 3d6 HP fire (Dex half)",

  'Call Lightning':
    "R120' Conjured storm cloud generates bolt for 3d10 HP (Dex half) in 5' radius each rd for conc/10 min",
  'Calm Emotions':
    "R60' 10' radius suppresses charm/fright or hostility (Cha neg) for conc/1 min",
  'Chain Lightning':
    "R150' 4 targets in 30' radius 10d8 HP lightning (Dex half)",
  'Charm Person':
    "R30' Target regards you as friend (Wis neg) for 1 hr/until harmed",
  'Chill Touch':
    "R120' Ghost hand ${Math.floor((lvl + 1) / 6) + 1} HP necrotic, undead also Disadv self attack for 1 rd",
  'Circle Of Death':"R150' 60' radius 8d6 HP necrotic (Con half)",
  'Clairvoyance':
    "R1 mi Invisible sensor allows sight or hearing for conc/10 min",
  'Clone':"Grow backup body for touched target",
  'Cloudkill':
    "R120' 20' radius 5d8 HP poison (Con half), moves 10'/rd for conc/10 min",
  'Color Spray':"Self 15' cone 6d10 HP targets blinded for 1 rd",
  'Command':"R60' Target obeys one-word command (Wis neg)",
  'Commune':"Self receive 3 yes/no answers w/in 1 min",
  'Commune With Nature':"Self gain 3 facts about territory w/in 3 miles",
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
  'Contagion':"Touched poisoned, then diseased after failing 3 Con saves (3 successes neg)",
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

  'Dancing Lights':"R120' 4 torch lights in 20' radius move 60' for conc/1 min",
  'Darkness':"R60' Target centers 15' radius lightless area for conc/10 min",
  'Darkvision':"Touched see in dark for 8 hr",
  'Daylight':"R60' Target centers 60' radius bright light for 1 hr",
  'Death Ward':"Touched keep 1 HP when next brought to 0",
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
  'Dispel Evil And Good':"Self aligned foes Disadv attack for conc/1 min",
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
    "R120' Ranged touch ${Math.max(Math.floor((lvl+1)/6),1)} rays do 1d10 HP ea",
  'Enhance Ability':"Touched Adv on chosen ability checks for 1 hr",
  'Enlarge/Reduce':"R30' Target dbl/half size for conc/1 min",
  'Entangle':"R90' Growth ensnare those in 20' sq for conc/1 min (Str neg)",
  'Enthrall':"R60' Target focused on caster for 1 min (Wis neg)",
  'Etherealness':"Self on Ethereal Plane for up to 8 hrs",
  'Expeditious Retreat':"Self Dash as bonus action for conc/10 min",
  'Eyebite':"R60' Target sleep, panic, or sick for conc/1 min",

  'Fabricate':"R120' Create product from raw materials",
  'Faerie Fire':
    "R60' Objects in 20' cu outlined (foe Adv attack) for conc/1 min (Dex neg)",
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
  'Flaming Sphere':"R60' 5' diameter sphere 2d6 HP (Dex half) move 30' for conc/1 min",
  'Flesh To Stone':
     "R60' Target petrified after 3 failed saves for conc/1 min (Con x3 neg)",
  'Floating Disk':
    "R30' 3'-diameter x 1\" force disk follows, holds 500 lbs at 3' for 1 hr",
  'Fly':"Touched fly 60'/rd for conc/10 min",
  'Fog Cloud':"R120' 20' radius fog obscures vision for conc/1 hr",
  'Forbiddance':
    "Touched 40K' sq bars teleport and portals, 5d10 HP on transit to chosen type for 1 dy",
  'Forcecage':"R100' 20' barred cube or 10' solid box for 1 hr",
  'Foresight':
    "Touched immune surprise, Adv attack, ability, save, foes Disadv attack for 8 hr",
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
    "Touched creature unexhaust, uncharm, unpetrify, uncurse, or restored ability or HP",
  'Guardian Of Faith':
    "R30' Lg spectral guardian 20 HP to hostile creatures (Dex half) for 8 hr/60 HP",
  'Guards And Wards': "Multiple magic effects protect 2500' sq area for 1 dy",
  'Guidance':"Touched +1d4 ability check w/in conc/1 min",
  'Guiding Bolt':"R120' Ranged spell 4d6 HP, next foe attack in rd Adv",
  'Gust Of Wind':
    "60'x10' wind pushes 15' (Str neg), half movement for conc/1 min",

  'Hallow': "60' radius warded against outsiders, evokes boon spell",
  'Hallucinatory Terrain': "R300' 150' cube terrain illusion (Int(Investigation) disbelieve) for 1 dy",
  'Harm':"R60' Target 14d6 HP (Con half)",
  'Haste':"R30' Target dbl speed, +1 AC, bonus action for conc/1 min",
  'Heal':"R60' Target heal 70 HP, unblind, undeaf, undisease",
  'Healing Word':"R60' Target 1d4+modifier HP",
  'Heat Metal':"R60' Touching target metal causes 2d8 HP for conc/1 min",
  'Hellish Rebuke':"R60' As a reaction, attacker 2d10 HP (Dex half)",
  "Heroes' Feast":"R30' 12 diners cured, immune poison and fright, Wis Adv, +2d10 HP for 1 dy",
  'Heroism':"Touched immune fright, +modifier HP each rd for conc/1 min",
  'Hideous Laughter': "R30' Target ROFL for conc/1 min (Wis neg)",
  'Hold Monster':"R90' target frozen for conc/1 min (Wis neg)",
  'Hold Person':"R60' target frozen for conc/1 min (Wis neg)",
  'Holy Aura':"Self 30' radius targets Adv saves, foes Disadv attack",
  "Hunter's Mark":
    "R90' Self attacks on target +1d6 HP, Adv Wis(Perception/Survival) to locate for conc/1 hr",
  'Hypnotic Pattern': "R120' creatures in 30' cu charmed for conc/1 min (Wis neg)",

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
  'Irresistible Dance':
    "R30' Target dance (Disadv Dex, attack, foes Adv attack) for conc/1 min (Wis neg)",

  'Jump':"Touched jump x3 for 1 min",

  'Knock':"R60' Target unlocked, unstuck, or unbarred",

  'Legend Lore':"Know info about named person, place, or object",
  'Lesser Restoration':"Touched creature unblind, unparalyze, or unpoison",
  'Levitate':"R60' Target floats 20' for conc/10 min (Con neg)",
  'Light':"Touched object lights 20' radius for 1 hr (Dex neg)",
  'Lightning Bolt':"100'x5' 8d6 HP (Dex half)",
  'Locate Animals Or Plants':"Know location of named beast or plant w/in 5 mi",
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
    "R60' Targets restore 700 HP total, unblind, undeaf, undisease",
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
  'Mirror Image':"3 duplicates draw attacks (AC 10+DexMod)",
  'Mislead':"Self invisible, control illusory duplicate for conc/1 hr",
  'Misty Step':"Self teleport 30'",
  'Modify Memory':"R30' Change target memory of event in prior dy (Wis neg)",
  'Moonbeam':"5' radius 2d10 HP (Con half) for conc/1 min",
  'Move Earth':"R120' Excavate 40' cu for conc/2 hr",

  'Nondetection':"Touched immune divination for 8 hr",

  'Pass Without Trace':
    "Allies within 30' self +10 Dexterity (Stealth), untrackable for conc/1 hr",
  'Passwall':"R30' 5'x8'x20' passage through wood, plaster, or stone",
  'Phantasmal Killer':
    "R120' Target fright, 4d10 HP/rd for conc/1 min (Wis neg)",
  'Phantom Steed':"R30' Self ride 100'/rd for 1 hr",
  'Planar Ally':"R60' Otherworld creature appears, bargain for service",
  'Planar Binding':
    "R60; Bind celestial, elemental, fey, or fiend to service for 1 dy (Cha neg)",
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
    "Touched poison neutralized, Adv save vs. poison for 1 hr",
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
  'Rope Trick': "Rope to extradimensional space for 8 creatures for 1 hr",

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
  'Suggestion': "R30' Target follow reasonable suggestion (Wis neg)",
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
  'Transport Via Plants':"Teleportation door between two plants for 1 rd",
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
    "R120' Targets in 30' radius fright, 4d10 HP/turn for conc/1 min (Wis neg)",
  'Wind Walk':"R30' Self + 10 others gaseous, fly 300'/rd for 8 hr",
  'Wind Wall':"R120' 50'x15' strong wind does 3d8 HP (Str half) for conc/1 min",
  'Wish': "Alter reality with few limits",
  'Word Of Recall':
    "R5' Self + 5 others instantly teleport to predetermined place",

  'Zone Of Truth':
    "R60' Creatures inside 15' radius cannot lie for 10 min (Cha neg)"

};

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
  rules.defineRule('carry', 'strength', '=', 'source * 15');
  rules.defineRule
    ('hitPoints', 'combatNotes.constitutionHitPointsAdjustment', '+', null);
  rules.defineRule('lift', 'strength', '=', 'source * 30');

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
        'Holy Symbol', 'Prayer Book', 'Incense', 'Vestments', 'Clothing',
        '15 GP'
      ];
      features = [
        '1:Shelter Of The Faithful:feature:Aid from associated temple'
      ];
      languages = ['', ''];
      proficiencyCount = {'Skill':2};
      proficienciesGiven = {'Skill':['Insight', 'Religion']};
    } else
      continue;

    SRD5E.defineBackground(
      rules, name, features, languages, proficiencyCount, proficienciesGiven,
      proficiencyChoices, equipment
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
        '7:Feral Instinct:combat:Adv Init, rage and act when surprised',
        '9:Brutal Critical:combat:+%V crit damage dice',
        '11:Relentless Rage:combat:DC 10+ Con to keep 1 HP when brought to 0',
        '15:Persistent Rage:combat:Rage has no time limit',
        '18:Indomitable Might:ability:Use Str instead of roll for Str check',
        '20:Primal Champion:ability:+4 strength/+4 constitution',
        // Path Of The Berserker
        '3:Frenzy:combat:Bonus attack during rage, exhausted after',
        '6:Mindless Rage:save:Immune charm, fright during rage',
        '10:Intimidating Presence:feature:' +
          "R30' Target creature fright (DC %V Will neg)",
        '14:Retaliation:combat:Melee attack reaction after taking damage'
      ];
      hitDie = 12;
      proficiencyCount = {'Save':2, 'Skill':2, 'Armor':3, 'Weapon':2};
      proficienciesGiven = {
        'Save': ['Constitution', 'Strength'],
        'Armor': ['Light Armor', 'Medium Armor', 'Shield'],
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

      rules.defineRule('abilityNotes.fastMovementFeature',
        'armorWeight', '?', 'source != "Heavy"'
      );
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
      rules.defineRule
        ('constitution', 'abilityNotes.primalChampionFeature', '+', '4');
      rules.defineRule('featureNotes.intimidatingPresenceFeature',
        'charismaModifier', '=', 'source + 8',
        'proficiencyBonus', '+', null
      );
      rules.defineRule('selectableFeatureCount.Barbarian',
        'levels.Barbarian', '=', 'source < 3 ? null : 1'
      );
      rules.defineRule('speed', 'abilityNotes.fastMovementFeature', '+', '10');
      rules.defineRule
        ('strength', 'abilityNotes.primalChampionFeature', '+', '4');

      for(var feature in {
        'Frenzy':'', 'Mindless Rage':'', 'Intimidating Presence':'',
        'Retaliation':''
      }) {
        rules.defineRule('barbarianFeatures.' + feature,
          'barbarianFeatures.Path Of The Berserker', '?', null
        );
      }

    } else if(name == 'Bard') {

      features = [
        '1:Armor Proficiency (Light)::',
        '1:Weapon Proficiency (Simple/Hand Crossbow/Longsword/Rapier/Shortsword)::',
        '1:Tool Proficiency (3 Musical Instruments)::',
        "1:Bardic Inspiration:magic:R60' Grant 1d%V w/in 10 min %1/long rest",
        '1:Ritual Casting:magic:Cast known spell as ritual',
        '1:Spellcasting::',
        '2:Jack Of All Trades:ability:+%V non-proficient ability checks',
        '2:Song Of Rest:magic:Listeners regain 1d%V HP after short rest',
        '3:Bard Expertise:skill:Dbl Prof %V skills',
        '5:Font Of Inspiration:feature:' +
          'Refresh Bardic Inspiration after short rest',
        "6:Countercharm:magic:R30' Friendly listeners Adv vs. charm, fright",
        '10:Magical Secrets:magic:Learn %V additional spells from any class',
        '20:Superior Inspiration:combat:Min 1 Bardic Inspiration after Init',
        // College Of Lore
        '3:Bonus Skills:skill:Prof 3 additional skills',
        '3:Cutting Words:combat:' +
          "R60' Reaction to subtract Bardic Inspiration die from foe roll",
        '6:Additional Magical Secrets:magic:' +
          'Learn 2 additional spells from any class',
        '14:Peerless Skill:ability:Add Bardic Inspiration die to ability check'
      ];
      hitDie = 8;
      proficiencyCount =
        {'Armor':1, 'Save':2, 'Skill':3, 'Tool':3, 'Weapon':5};
      proficienciesGiven = {
        'Armor':['Light Armor'],
        'Save':['Charisma', 'Dexterity'],
        'Weapon':['Simple','Hand Crossbow','Longsword','Rapier','Shortsword']
      };
      proficiencyChoices = {
        'Skill': SRD5E.SKILLS.map(function(skill){return skill.substring(0, skill.indexOf(':'));}),
        'Tool':['Music']
      };
      selectableFeatures = ['3:College Of Lore::'];
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
        'levels.Bard', '=', '6 + (source>=9 ? 2 * Math.floor((source-5)/4) : 0)'
      );
      rules.defineRule
        ('skillProficiencyCount', 'skillNotes.bonusSkillsFeature', '+', '3');
      rules.defineRule('selectableFeatureCount.Bard',
        'levels.Bard', '=', 'source < 3 ? null : 1'
      );
      rules.defineRule('skillNotes.bardExpertiseFeature',
        'levels.Bard', '=', 'source < 10 ? 2 : 4'
      );
      rules.defineRule('spellsKnown.B',
        'magicNotes.additionalMagicalSecretsFeature', '+', '2',
        'magicNotes.magicalSecretsFeature', '+', null
      );

      for(var feature in {
        'Additional Magical Secrets':'', 'Cutting Words':'', 'Extra Skills':'',
        'Peerless Skill':''
      }) {
        rules.defineRule('bardFeatures.' + feature,
          'bardFeatures.College Of Lore', '?', null
        );
      }

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
          'Healing spells restore additional 2 + spell level HP',
        '2:Preserve Life:magic:' +
          "R30' Channel Divinity to restore %V HP among targets, up to half max HP ea",
        '6:Blessed Healer:magic:' +
          'Self regain 2 + spell level HP from casting healing spells',
        '8:Divine Strike:combat:+%Vd8 HP 1/turn',
        '17:Supreme Healing:magic:Healing spells yield max HP'
      ];
      hitDie = 8;
      proficiencyCount = {'Save':2, 'Skill':2, 'Armor':3, 'Weapon':1};
      proficienciesGiven = {
        'Save':['Charisma', 'Wisdom'],
        'Armor':['Light Armor', 'Medium Armor', 'Shield'],
        'Weapon':['Simple']
      };
      proficiencyChoices = {
        'Skill':['History', 'Insight', 'Medicine', 'Persuasion', 'Religion']
      };
      selectableFeatures = ['1:Life Domain::'];
      spellAbility = 'wisdom';
      spellsKnown = [
        'C0:1:3/4:4/10:5',
        'C:1:2/2:3/3:6/4:7/5:9/6:10/7:11/8:12/9:14/10:15/11:16/13:17/15:18/17:19/18:20/19:21/20:22'
      ];
      spells = {
        'Life Domain':[
          '1:Bless:Cure Wounds',
          '3:Lesser Restoration:Spiritual Weapon',
          '5:Beacon Of Hope:Revivify',
          '7:Death Ward:Guardian Of Faith',
          '9:Mass Cure Wounds:Raise Dead'
        ]
      };
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

      rules.defineRule('armorProficiencies.Heavy Armor',
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
      rules.defineRule
        ('selectableFeatureCount.Cleric', 'levels.Cleric', '=', '1');
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
        '2:Bonus Cantrip:magic:Additional Druid cantrip',
        '2:Natural Recovery:magic:Recover %V spell slot levels in short rest',
        "6:Land's Stride:ability:Move normally through difficult terrain",
        "6:Land's Stride:save:Adv vs. impeding plants",
        "10:Nature's Ward:save:" +
          'Immune disease, poison, elemental and fey charm and fright',
        "14:Nature's Sanctuary:combat:" +
          'Beast, plant DC %V Will save to attack self'
      ];
      hitDie = 8;
      proficiencyCount =
       {'Armor':3, 'Save':2, 'Skill':2, 'Tool':1, 'Weapon':10};
      proficienciesGiven = {
        'Armor':['Light Armor', 'Medium Armor', 'Shield'],
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
      spellAbility = 'wisdom';
      spells = {
        'Circle Of The Land (Arctic)':[
          '3:Hold Person:Spike Growth',
          '5:Sleet Storm:Slow',
          '7:Freedom Of Movement:Ice Storm',
          '9:Commune With Nature:Cone Of Cold'
        ],
        'Circle Of The Land (Coast)':[
          '3:Mirror Image:Misty Step',
          '5:Water Breathing:Water Walk',
          '7:Control Water:Freedom Of Movement',
          '9:Conjure Elemental:Scrying'
        ],
        'Circle Of The Land (Desert)':[
          '3:Blur:Silence',
          '5:Create Food And Water:Protection From Energy',
          '7:Blight:Hallucinatory Terrain',
          '9:Insect Plague:Wall Of Stone'
        ],
        'Circle Of The Land (Forest)':[
          '3:Barkskin:Spider Climb',
          '5:Call Lightning:Plant Growth',
          '7:Divination:Freedom Of Movement',
          '9:Commune With Nature:Tree Stride'
        ],
        'Circle Of The Land (Grassland)':[
          '3:Invisibility:Pass Without Trace',
          '5:Daylight:Haste',
          '7:Divination:Freedom Of Movement',
          '9:Dream:Insect Plague'
        ],
        'Circle Of The Land (Mountain)':[
          '3:Spider Climb:Spike Growth',
          '5:Lightning Bolt:Meld Into Stone',
          '7:Stone Shape:Stoneskin',
          '9:Passwall:Wall Of Stone'
        ],
        'Circle Of The Land (Swamp)':[
          '3:Acid Arrow:Darkness',
          '5:Water Walk:Stinking Cloud',
          '7:Freedom Of Movement:Locate Creature',
          '9:Insect Plague:Scrying'
        ]
      };
      spellsKnown = [
        'D0:1:2/4:3/10:4',
        'D:1:2/2:3/3:6/4:7/5:9/6:10/7:11/8:12/9:14/10:15/11:16/13:17/15:18/17:19/18:20/19:21/20:22'
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
        'levels.Druid', '=', 'source < 4 ? "1/4" : source < 8 ? "1/2" : "1"'
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
      rules.defineRule('magicNotes.naturalRecoveryFeature',
        'levels.Druid', '=', 'Math.floor(source / 2)'
      );

      rules.defineRule('hasCircleOfTheLand',
        /Circle Of The Land/, '=', '1'
      );
      for(var feature in {
        'Bonus Cantrip':'', "Land's Stride":'', "Nature's Ward":'',
        "Nature's Sanctuary":''
      }) {
        rules.defineRule('druidFeatures.' + feature,
          'hasCircleOfTheLand', '?', null
        );
      }
      rules.defineRule
        ('spellsKnown.D0', 'magicNotes.bonusCantripFeature', '+', '1');

    } else if(name == 'Fighter') {

      features = [
        '1:Armor Proficiency (Light/Medium/Heavy/Shield)::',
        '1:Weapon Proficiency (Simple/Martial)::',
        '1:Second Wind:combat:Regain 1d10+%V HP 1/short rest',
        '2:Action Surge:combat:Extra action %V/short rest',
        '5:Extra Attack:combat:%V additional attack(s) per Attack action',
        '9:Indomitable:save:Re-roll failed save %V/long rest',
        // Champion Archetype
        '3:Improved Critical:combat:Crit on natural 19',
        '7:Remarkable Athlete:ability:+%V non-proficient Str, Dex, Con checks',
        "7:Remarkable Athlete:skill:+%V' running jump",
        '10:Additional Fighting Style:combat:Select second Fighting Style',
        '15:Superior Critical:combat:Crit on natural 18',
        '18:Survivor:combat:Regain %V HP each turn when between 1 and %1'
      ];
      hitDie = 10;
      proficiencyCount = {'Armor':4, 'Save':2, 'Skill':2, 'Weapon':2};
      proficienciesGiven = {
        'Armor':['Light Armor', 'Medium Armor', 'Heavy Armor', 'Shield'],
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
          'Re-roll damage of 1 or 2 with two-handed weapons',
        '1:Protection Style:combat:' +
          'Use shield to impose attack Disadv on adjacent foe',
        '1:Two-Weapon Fighting Style:combat:' +
          'Add ability modifier to second attack damage',
        '3:Champion Archetype::'
      ]
      spellAbility = null;
      spellsKnown = null;
      spells = null;
      spellSlots = null;

      rules.defineRule('abilityNotes.remarkableAthleteFeature',
        'proficiencyBonus', '=', 'Math.ceil(source / 2)'
      );
      rules.defineRule('armorClass',
        'combatNotes.defenseStyleFeature.1', '+', null
      );
      rules.defineRule
        ('attackBonus.Ranged', 'combatNotes.archeryStyleFeature', '+=', '2');
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
      rules.defineRule('saveNotes.indomitableFeature',
        'levels.Fighter', '=', 'source < 13 ? 1 : source < 17 ? 2 : 3'
      );
      rules.defineRule('selectableFeatureCount.Fighter',
        'levels.Fighter', '=', 'source < 3 ? 1 : 2',
        'combatNotes.additionalFightingStyleFeature', '+', '1'
      );
      rules.defineRule
        ('skillNotes.remarkableAthleteFeature', 'strengthModifier', '=', null);
      for(var feature in {
        'Improved Critical':'', 'Remarkable Athlete':'',
        'Additional Fighting Style':'', 'Superior Critical':'', 'Survivor':''
      }) {
        rules.defineRule('fighterFeatures.' + feature,
          'fighterFeatures.Champion Archetype', '?', null
        );
      }

    } else if(name == 'Monk') {

      features = [
        '1:Weapon Proficiency (Simple/Shortsword)::',
        "1:Tool Proficiency (Artisan's Tools or Musical Instrument)::",
        '1:Martial Arts:combat:' +
          'When unarmored, +%1 monk weapons attack and damage, raise damage die to 1d%V',
        '1:Monk Bonus Attack:combat:Unarmed strike after monk weapon attack',
        '1:Monk Unarmored Defense:combat:+%1 AC in no armor',
        '2:Flurry Of Blows:combat:Spend 1 Ki for 2 additional unarmed strikes',
        '2:Ki:feature:%V Ki points/short rest',
        '2:Patient Defense:combat:Spend 1 Ki to Dodge (foe attack Disadv)',
        '2:Step Of The Wind:combat:Spend 1 Ki to Disengage or Dash, dbl jump',
        '2:Unarmored Movement:ability:+%V speed in no armor',
        '3:Deflect Missiles:combat:React to reduce missile damage by 1d10+%V',
        '4:Slow Fall:ability:-%V HP fall damage',
        '5:Extra Attack:combat:%V additional attack(s) per Attack action',
        '5:Stunning Strike:combat:Spend 1 Ki to stun foe (DC %V Con neg)',
        '6:Ki-Empowered Strikes:combat:Unarmed attacks count as magical',
        '7:Evasion:save:Dex save yields no damage instead of half',
        '7:Stillness Of Mind:save:End self charm, fright at will',
        '9:Improved Unarmored Movement:ability:' +
          'Move across vertical surfaces and liquids',
        '10:Purity Of Body:save:Immune disease, poison',
        '13:Tongue Of Sun And Moon:feature:Communicate in any language',
        '14:Diamond Soul:save:Prof all saves, spend 1 Ki to re-roll',
        '15:Monk Timeless Body:feature:' +
          'No debility from aging, need no food or water',
        '18:Empty Body:magic:' +
          'Spend 4 Ki for <i>Invisibility</i> 1 min, 8 Ki for <i>Astral Projection</i>',
        '20:Perfect Self:combat:Min 4 Ki after Init',
        // Way Of The Open Hand Tradition
        '3:Open Hand Technique:combat:' +
          "On Flurry of Blows hit, choice of knock prone (DC %V Dex neg), push 15' (DC %V Str neg), or no foe react 1 turn",
        '6:Wholeness Of Body:feature:Regain %V HP 1/long rest',
        '11:Tranquility:magic:' +
          'Self <i>Sanctuary</i> until next long rest (DC %V Wis neg)',
        '17:Quivering Palm:combat:' +
          'Spend 3 Ki to reduce foe to 0 HP w/in 1 dy after unarmed hit (DC %V Con 10d10 HP)'
      ];
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

      for(var feature in {
        'Open Hand Technique':'', 'Quivering Palm':'', 'Tranquility':'',
        'Wholeness Of Body':''
      }) {
        rules.defineRule('monkFeatures.' + feature,
          'monkFeatures.Way Of The Open Hand Tradition', '?', null
        );
      }

    } else if(name == 'Paladin') {

      features = [
        '1:Armor Proficiency (Light/Medium/Heavy/Shield)::',
        '1:Weapon Proficiency (Simple/Martial)::',
        '1:Divine Sense:magic:' +
          "R60' Know location of celestials, fiends, undead %V/long rest",
        '1:Lay On Hands:magic:Heal %V HP, disease, poison 1/long rest',
        '2:Divine Smite:combat:' +
          'Spend spell slot for +(spell level + 1)d8 damage',
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
          "R30' Channel Divinity for fiends, undead flee for 1 min (Wis neg)",
        "7:Aura Of Devotion:save:R%V' Self and allies immune charm",
        '15:Purity Of Spirit:magic:' +
          'Self continuous <i>Protection From Evil And Good</i>',
        '20:Holy Nimbus:magic:' +
          "Self 30' bright light does 10 HP to foes 1/long rest",
        '20:Holy Nimbus:save:Adv vs. spells by fiends, undead'
      ];
      hitDie = 10;
      proficiencyCount = {'Save':2, 'Skill':2, 'Armor':4, 'Weapon':2};
      proficienciesGiven = {
        'Save':['Charisma', 'Wisdom'],
        'Armor':['Light Armor', 'Medium Armor', 'Heavy Armor', 'Shield'],
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
          'Re-roll damage of 1 or 2 with two-handed weapons',
        '2:Protection Style:combat:' +
          'Use shield to impose attack Disadv on adjacent foe'
      ];
      selectableFeatures.push('3:Oath Of Devotion::');
      spellAbility = 'charisma';
      spellsKnown = [
        'P:2:2/3:3/5:6/7:7/9:9/11:10/13:11/15:12/17:14/19:15'
      ];
      spells = {
        'Oath Of Devotion':[
          '3:Protection From Evil And Good:Sanctuary',
          '5:Lesser Restoration:Zone Of Truth',
          '9:Beacon Of Hope:Dispel Magic',
          '13:Freedom Of Movement:Guardian Of Faith',
          '17:Commune:Flame Strike'
        ]
      };
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
          'paladinFeatures.Oath Of Devotion', '?', null
        );
      }
      rules.defineRule('combatNotes.sacredWeaponFeature',
        'charismaModifier', '=', 'Math.max(source, 1)'
      );

    } else if(name == 'Ranger') {

      features = [
        '1:Armor Proficiency (Light/Medium/Shield)::',
        '1:Weapon Proficiency (Simple/Martial)::',
        '1:Favored Enemy:skill:' +
          'Adv Survival to track, info about %V creature types, learn enemy language',
        '1:Natural Explorer:skill:Dbl Int/Wis Prof, normal move in difficult terrain, always alert, full speed solo stealth, locate dbl food, extra track info for %V terrains',
        '2:Spellcasting::',
        '3:Primeval Awareness:magic:' +
          'Expend spell to sense creatures in 1 mi (favored terrain 6 mi)',
        '5:Extra Attack:combat:%V additional attack(s) per Attack action',
        "8:Land's Stride:ability:Move normally through difficult terrain",
        "8:Land's Stride:save:Adv vs. impeding plants",
        '10:Hide In Plain Sight:skill:' +
          '+10 Dex (Stealth) to hide w/prepared camouflage',
        '14:Vanish:skill:Hide as bonus action, untrackable non-magically',
        "18:Feral Senses:skill:30' awareness of invisible creatures",
        '18:Feral Senses:combat:No Disadv vs. invisible foe',
        '20:Foe Slayer:combat:+%V attack or damage vs. favored enemy'
      ];
      hitDie = 10;
      proficiencyCount = {'Armor':3, 'Save':2, 'Skill':3, 'Weapon':2};
      proficienciesGiven = {
        'Save':['Dexterity', 'Strength'],
        'Armor':['Light Armor', 'Medium Armor', 'Shield'],
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
      selectableFeatures.push(
        '3:Colossus Slayer:combat:+1d8 HP vs. damaged foe 1/turn',
        '3:Giant Killer:combat:React to attack adjacent lg foe after miss',
        '3:Horde Breaker:combat:Second attack on different adjacent foe',
        '7:Escape The Horde:combat:Foe Disadv on OA',
        '7:Multiattack Defense:combat:' +
          '+4 AC on additional foe attacks after hit',
        '7:Steel Will:save:Adv vs. fright',
        "11:Volley:combat:Ranged attack any number of foes in 10' radius",
        '11:Whirlwind Attack:combat:Melee attack any number of adjacent foes',
        '15:Evasion:save:Dex save yields no damage instead of half',
        '15:Stand Against The Tide:combat:' +
          'Redirect foe miss to another creature',
        '15:Uncanny Dodge:combat:Use reaction for half damage',
      );
      spellAbility = 'wisdom';
      spellsKnown = [
        'R:2:2/3:3/5:4/7:5/9:6/11:7/13:8/15:9/17:10/19:11'
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
        ('attackBonus.Ranged', 'combatNotes.archeryStyleFeature', '+=', '2');
      rules.defineRule('skillNotes.favoredEnemyFeature',
        'levels.Ranger', '=', 'source < 6 ? 1 : source < 14 ? 2 : 3'
      );
      rules.defineRule
        ('combatNotes.foeSlayerFeature', 'wisdomModifier', '=', null);
      rules.defineRule('hunterSelectableFeatureCount',
        'rangerFeatures.Hunter Archetype', '?', null,
        'levels.Ranger', '=', 'source<3 ? 0 : source<7 ? 1 : source<11 ? 2 : source<15 ? 3 : 4'
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

    } else if(name == 'Rogue') {

      features = [
        '1:Armor Proficiency (Light)::',
        '1:Weapon Proficiency (Simple/Hand Crossbow/Longsword/Rapier/Shortsword)::',
        "1:Tool Proficiency (Thieves' Tools)::",
        "1:Rogue Expertise:skill:Dbl Prof %V skills or thieves' tools",
        '1:Sneak Attack:combat:+%Vd6 damage on Adv/shared threat attacks',
        "1:Thief's Cant:skill:Signs and symbols known only by rogues",
        '2:Cunning Action:combat:Bonus Dash, Disengage, or Hide each turn',
        '5:Uncanny Dodge:combat:Use reaction for half damage',
        '7:Evasion:save:Dex save yields no damage instead of half',
        '11:Reliable Talent:ability:Min 10 on Prof ability rolls',
        "14:Blindsense:skill:R10' Hear hidden/invisible creatures",
        '15:Slippery Mind:save:Prof Wis',
        '18:Elusive:combat:Foe attacks never have Adv',
        '20:Stroke Of Luck:ability:Automatic 20 ability check 1/short rest',
        '20:Stroke Of Luck:combat:Turn miss into hit 1/short rest',
        // Thief Archetype
        '3:Fast Hands:combat:' +
          'Use Cunning Action for Sleight Of Hand, disarm trap, open lock, Use An Object',
        '3:Second-Story Work:ability:Full speed climb',
        "3:Second-Story Work:skill:+%V' Jump",
        '9:Supreme Sneak:skill:Adv Stealth at half speed',
        '13:Use Magic Device:skill:Ignore restrictions on magic device use',
        "17:Thief's Reflexes:combat:First round extra turn at -10 Init"
      ];
      hitDie = 8;
      proficiencyCount =
        {'Armor':1, 'Save':2, 'Skill':4, 'Tool':1, 'Weapon':5};
      proficienciesGiven = {
        'Armor':['Light Armor'],
        'Save':['Dexterity', 'Intelligence'],
        'Tool':["Thieves' Tools"],
        'Weapon':['Simple','Hand Crossbow','Longsword','Rapier','Shortsword']
      };
      proficiencyChoices = {
        'Skill':['Acrobatics', 'Athletics', 'Deception', 'Insight',
                 'Intimidation', 'Investigation', 'Perception', 'Performance',
                 'Persuasion', 'Sleight Of Hand', 'Stealth']
      };
      selectableFeatures = ['3:Thief Archetype::'];
      spellAbility = null;
      spellsKnown = null;
      spells = null;
      spellSlots = null;

      rules.defineRule('combatNotes.sneakAttackFeature',
        'levels.Rogue', '=', 'Math.floor((source + 1) / 2)'
      );
      rules.defineRule('featCount', 'rogueFeatBonus', '+', null);
      rules.defineRule
        ('rogueFeatBonus', 'levels.Rogue', '=', 'source < 10 ? null : 1');
      rules.defineRule('selectableFeatureCount.Rogue',
        'levels.Rogue', '=', 'source < 3 ? null : 1'
      );
      rules.defineRule('skillNotes.rogueExpertiseFeature',
        'levels.Rogue', '=', 'source < 6 ? 2 : 4'
      );
      rules.defineRule
        ('saveProficiencies.Wisdom', 'saveNotes.slipperyMindFeature', '=', '1');

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

    } else if(name == 'Sorcerer') {

      features = [
        '1:Weapon Proficiency (Dagger/Dart/Sling/Quarterstaff/Light Crossbow)::',
        '1:Spellcasting::',
        '2:Font Of Magic:magic:%V Sorcery Points/long rest',
        '2:Flexible Casting:magic:Convert Sorcery Points to/from spell slots',
        '20:Sorcerous Restoration:magic:Regain 4 Sorcery Points/short rest',
        // Draconic Bloodline
        '1:Draconic Resilience:combat:+%V HP, unarmored AC %1',
        '6:Elemental Affinity:magic:' +
          '+%V HP damage with ancestry type, spend 1 Sorcery Point for 1 hr resistance',
        '14:Dragon Wings:ability:Fly at full speed',
        "18:Draconic Presence:magic:R60' Spend 5 Sorcery Points for awe/fear aura for 1 min/conc (Wis neg)"
      ];
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
          'Spend 1 Sorcery Point to protect %V creature(s) from your spell',
        '3:Distant Spell:magic:' +
          "Spend 1 Sorcery Point to dbl spell range or touch at 30'",
        '3:Empowered Spell:magic:' +
          'Spend 1 Sorcery Point to re-roll %V spell damage dice',
        '3:Extended Spell:magic:Spend 1 sorcery point to dbl spell duration',
        '3:Heightened Spell:magic:' +
          'Spend 3 Sorcery Points for target Disadv on spell save',
        '3:Quickened Spell:magic:' +
          'Spend 2 Sorcery Points to cast spell as bonus action',
        '3:Subtle Spell:magic:' +
          'Spend 1 Sorcery Point to cast w/out somatic, verbal components',
        '3:Twinned Spell:magic:' +
          'Spend spell level Sorcery Points to add second target'
      ];
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
      rules.defineRule('magicNotes.elementalAffinityFeature',
        'charismaModifier', '=', null
      );

    } else if(name == 'Warlock') {

      features = [
        '1:Armor Proficiency (Light)::',
        '1:Weapon Proficiency (Simple)::',
        '1:Pact Magic::',
        '2:Eldritch Invocations:magic:%V',
        '11:Mystic Arcanum:magic:%V spells 1/long rest',
        '20:Eldritch Master:magic:Regain spells from patron 1/long rest',
        // Fiend Patron
        "1:Dark One's Blessing:combat:Gain %1 HP when foe drops to 0",
        "6:Dark One's Own Luck:feature:Add d10 to ability or save 1/short rest",
        '10:Fiendish Resilience:save:Resist chosen damage type',
        '14:Hurl Through Hell:combat:' +
          'Foe trip to hell 10d10 psychic HP 1/long rest'
      ];
      hitDie = 8;
      proficiencyCount = {'Armor':1, 'Save':2, 'Skill':2, 'Weapon':1};
      proficienciesGiven = {
        'Armor':['Light Armor'],
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
        '2:Book Of Ancient Secrets:magic:Inscribe rituals in Book Of Shadows',
        '15:Chains Of Carceri:magic:' +
          '<i>Hold Monster</i> on celestial, elemental, fiend 1/long rest',
        "2:Devil's Sight:feature:R120' See 1 light level better",
        '7:Dreadful Word:magic:<i>Confusion</i> 1/long rest',
        '2:Eldritch Sight:magic:<i>Detect Magic</i> at will',
        "2:Eldritch Spear:magic:R300' <i>Eldritch Blast</i>",
        '2:Eyes Of The Rune Keeper:feature:Read all writing',
        '2:Fiendish Vigor:magic:Self <i>False Life</i> at will',
        '2:Gaze Of Two Minds:magic:' +
          'Perceive via willing touched senses for 1 turn',
        '12:Lifedrinker:combat:+%V HP w/pact weapon',
        '2:Mask Of Many Faces:magic:<i>Disguise Self</i> at will',
        '15:Master Of Myriad Forms:magic:<i>Alter Self</i> at will',
        '9:Minions Of Chaos:magic:<i>Conjure Elemental</i> 1/long rest',
        '2:Misty Visions:magic:<i>Silent Image</i> at will',
        '5:Mire The Mind:magic:<i>Slow</i> 1/long rest',
        '5:One With Shadows:magic:Invisible in dim light until action',
        '9:Otherworldly Leap:magic:Self <i>Jump</i> at will',
        "2:Repelling Blast:magic:<i>Eldritch Blast</i> pushes 10'",
        '7:Sculptor Of Flesh:magic:<i>Polymorph</i> 1/long rest',
        '5:Sign Of Ill Omen:magic:<i>Bestow Curse</i> 1/long rest',
        '2:Thief Of Five Fates:magic:<i>Bane</i> 1/long rest',
        '5:Thirsting Blade:combat:Attack twice each turn w/pact blade',
        '15:Visions Of Distant Realms:magic:<i>Arcane Eye</i> at will',
        '2:Voice Of The Chain Master:feature:Perceive, speak via familiar',
        '9:Whispers Of The Grave:magic:<i>Speak With Dead</i> at will',
        "15:Witch Sight:feature:R30' See true forms"
      ];
      spellAbility = 'charisma';
      spellsKnown = [
        'K0:1:2/4:3/10:4',
        'K:1:2/2:3/3:4/4:5/5:6/6:7/7:8/8:9/9:10/11:11/13:12/15:13/17:14/19:15'
      ];
      spells = null;
      spellSlots = [
        'K1:1:1/2:2/3:null',
        'K2:3:2/5:null',
        'K3:5:2/7:null',
        'K4:7:2/9:null',
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
        'levels.Warlock', '=', 'source == 2 ? 2 : source < 9 ? Math.floor((source + 1) / 2) : Math.floor((source + 6) / 3)'
      );
      rules.defineRule('magicNotes.mysticArcanumFeature',
        'levels.Warlock', '=', 'source<13 ? "K6" : source<15 ? "K6, K7" : source<17 ? "K6, K7, K8" : "K6, K7, K8, K9"'
      );
      rules.defineRule('skillProficiencyCount',
        'skillNotes.beguilingInfluenceFeature', '+', '2'
      );
      rules.defineRule('selectableFeatureCount.Warlock',
        'levels.Warlock', '=', 'source < 3 ? 1 : 2',
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
        'validationNotes.warlockLifedrinkerSelectableFeatureFeatures:Requires Pact Of The Blade',
        'validationNotes.warlockThirstingBladeSelectableFeatureFeatures:Requires Pact Of The Blade',
        'validationNotes.warlockVoiceOfTheChainMasterSelectableFeatureFeatures:Requires Pact Of The Chain'
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

    } else if(name == 'Wizard') {

      features = [
        '1:Weapon Proficiency (Dagger/Dart/Light Crossbow/Quarterstaff/Sling)::',
        '1:Arcane Recovery:magic:Short rest recovers %V spell slots 1/dy',
        '1:Spellcasting::',
        '18:Spell Mastery:magic:Cast 1 ea W1, W2 at will',
        '20:Signature Spell:magic:Cast 2 W3 1/short rest',
        // Evocation Tradition
        '2:Evocation Savant:magic:Write evocation spells for half cost',
        '2:Sculpt Spells:magic:' +
          'Protect spell level + 1 targets from evocation spell effects',
        '6:Potent Cantrip:magic:Target takes half damage on cantrip save',
        '10:Empowered Evocation:magic:+%V HP evocation spell damage',
        '14:Overchannel:magic:' +
          'Max damage from evocation spell le level 5, self take damage 2nd+ time/long rest'
      ];
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
      selectableFeatures = ['2:Evocation Tradition::'];
      spellAbility = 'intelligence';
      spellsKnown = [
        'W0:1:3/4:4/10:5',
        'W:1:2/2:3/3:6/4:7/5:9/6:10/7:11/8:12/9:14/10:15/11:16/13:17/15:18/17:19/18:20/19:21/20:22'
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
            {name: 'Alignment', within: 'Section 1', format: '<b>Ali</b> %V'},
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
    } else if(name == 'Collected Notes' || name == 'Standard') {
      var innerSep = null;
      var listSep = '; ';
      var noteSep = listSep;
      noteSep = '\n';
      var outerSep = name == '\n';
      viewer.addElements(
        {name: '_top', borders: 1, separator: '\n'},
        {name: 'Header', within: '_top'},
          {name: 'Identity', within: 'Header', separator: ''},
            {name: 'Name', within: 'Identity', format: '<b>%V</b>'},
            {name: 'Gender', within: 'Identity', format: ' -- <b>%V</b>'},
            {name: 'Race', within: 'Identity', format: ' <b>%V</b>'},
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
            {name: 'Player', within: 'Description'},
          {name: 'AbilityStats', within: 'Attributes', separator: innerSep},
            {name: 'ExperienceInfo', within: 'AbilityStats', separator: ''},
              {name: 'Experience', within: 'ExperienceInfo'},
              {name: 'Experience Needed', within: 'ExperienceInfo',
               format: '/%V'},
            {name: 'Level', within: 'AbilityStats'},
            {name: 'Speed', within: 'AbilityStats'},
            {name: 'LoadInfo', within: 'AbilityStats', separator: ''},
              {name: 'Carry', within: 'LoadInfo',
               format: '<b>Carry/Lift:</b> %V'},
              {name: 'Lift', within: 'LoadInfo', format: '/%V'},
      );
      if(name != 'Collected Notes') {
        viewer.addElements(
          {name: 'Ability Notes', within: 'Attributes', separator: noteSep}
        );
      }
      viewer.addElements(
        {name: 'FeaturesAndSkills', within: '_top', separator: outerSep,
         format: '<b>Features/Skills</b><br/>%V'},
          {name: 'Proficiency Bonus', within: 'FeaturesAndSkills'},
          {name: 'FeaturePart', within: 'FeaturesAndSkills', separator: '\n'},
            {name: 'FeatStats', within: 'FeaturePart', separator: innerSep},
              {name: 'Feat Count', within: 'FeatStats', separator: listSep},
              {name: 'Selectable Feature Count', within: 'FeatStats',
               separator: listSep},
            {name: 'FeatLists', within: 'FeaturePart', separator: innerSep},
              {name: 'FeatList', within: 'FeatLists', separator: ''},
                {name: 'Feats', within: 'FeatLists', separator: listSep}
      );
      if(name != 'Collected Notes') {
        viewer.addElements(
            {name: 'Feature Notes', within: 'FeaturePart', separator: noteSep}
        );
      } else {
        viewer.addElements(
          {name: 'AllNotes', within: 'FeaturePart', separator: '\n', columns: "1L"},
            {name: 'Ability Notes', within: 'AllNotes', separator: null, columns: "1L", format: "%V"},
            {name: 'Feature Notes', within: 'AllNotes', separator: null, columns: "1L", format: "%V"},
            {name: 'Skill Notes', within: 'AllNotes', separator: null, columns: "1L", format: "%V"},
            {name: 'Combat Notes', within: 'AllNotes', separator: null, columns: "1L", format: "%V"},
            {name: 'Save Notes', within: 'AllNotes', separator: null, columns: "1L", format: "%V"},
            {name: 'Magic Notes', within: 'AllNotes', separator: null, columns: "1L", format: "%V"}
        );
      }
      viewer.addElements(
          {name: 'Skill Proficiencies', within: 'FeaturesAndSkill', separator: listSep},
          {name: 'Skills', within: 'FeaturesAndSkills', columns: '3LE', separator: null},
          {name: 'Tool Proficiencies', within: 'FeaturesAndSkill', separator: listSep},
          {name: 'Languages', within: 'FeaturesAndSkills', separator: listSep}
      );
      if(name != 'Collected Notes') {
        viewer.addElements(
            {name: 'Skill Notes', within: 'SkillPart', separator:noteSep}
        );
      }
      viewer.addElements(
        {name: 'Combat', within: '_top', separator: outerSep,
         format: '<b>Combat</b><br/>%V'},
          {name: 'CombatPart', within: 'Combat', separator: '\n'},
            {name: 'CombatStats', within: 'CombatPart', separator: innerSep},
              {name: 'Hit Points', within: 'CombatStats'},
              {name: 'Initiative', within: 'CombatStats'},
              {name: 'Armor Class', within: 'CombatStats'},
              {name: 'Attacks Per Round', within: 'CombatStats'},
            {name: 'CombatProfs', within: 'CombatPart', separator: innerSep},
              {name: 'Armor Proficiencies', within: 'CombatProfs', separator: listSep},
              {name: 'Weapon Proficiencies', within: 'CombatProfs', separator: listSep},
            {name: 'Gear', within: 'CombatPart', separator: innerSep},
              {name: 'Armor', within: 'Gear'},
              {name: 'Shield', within: 'Gear'},
              {name: 'Weapons', within: 'Gear', separator: listSep},
      );
      if(name != 'Collected Notes') {
        viewer.addElements(
            {name: 'Combat Notes', within: 'CombatPart', separator: noteSep}
        );
      }
      viewer.addElements(
          {name: 'SavePart', within: 'Combat', separator: '\n'},
            {name: 'Save Proficiencies', within: 'SavePart', separator: listSep},
            {name: 'Save', within: 'SavePart', separator: listSep}
      );
      if(name != 'Collected Notes') {
        viewer.addElements(
            {name: 'Save Notes', within: 'SavePart', separator: noteSep}
        );
      }
      viewer.addElements(
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
          {name: 'Spells', within: 'Magic', columns: '1L', separator: null}
      );
      if(name != 'Collected Notes') {
        viewer.addElements(
          {name: 'Magic Notes', within: 'Magic', separator: noteSep}
        );
      }
      viewer.addElements(
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

  rules.defineRule('proficient.None', '', '=', '1'); // Prof w/no armor
  rules.defineRule('proficient.Unarmed', '', '=', '1');
  rules.defineRule('weapons.Unarmed', '', '=', '1');

  rules.defineNote(
    'validationNotes.two-handedWeaponWithShield:' +
      'Shields cannot be used with two-handed weapons'
  );
  rules.defineRule('validationNotes.two-handedWeaponWithShield',
    'shield', '?', 'source != "None"'
  );

  rules.defineNote
    ('validationNotes.armorProficiencyAllocation:%1 available vs. %2 allocated');
  rules.defineRule('validationNotes.armorProficiencyAllocation.1',
    'armorProficiencyCount', '=', null
  );
  rules.defineRule('validationNotes.armorProficiencyAllocation.2',
    '', '=', '0',
    /^armorProficiencies\./, '+', null
  );
  rules.defineRule('validationNotes.armorProficiencyAllocation',
    'validationNotes.armorProficiencyAllocation.1', '=', '-source',
    'validationNotes.armorProficiencyAllocation.2', '+', null
  );
  rules.defineNote
    ('validationNotes.weaponProficiencyAllocation:%1 available vs. %2 allocated');
  rules.defineRule('validationNotes.weaponProficiencyAllocation.1',
    'weaponProficiencyCount', '=', null
  );
  rules.defineRule('validationNotes.weaponProficiencyAllocation.2',
    '', '=', '0',
    /^weaponProficiencies\./, '+', null
  );
  rules.defineRule('validationNotes.weaponProficiencyAllocation',
    'validationNotes.weaponProficiencyAllocation.1', '=', '-source',
    'validationNotes.weaponProficiencyAllocation.2', '+', null
  );

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

    rules.defineNote(
      weaponName + ':' + format,
      'sanityNotes.nonproficientWeaponPenalty.' + name + ':%V attack'
    );

    rules.defineRule('sanityNotes.nonproficientWeaponPenalty.' + name,
      weaponName, '?', null,
      'proficiencyBonus', '=', '-source',
      'proficient.' + name, '=', '0'
    );

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
      'attackBonus.' + (range ? 'Ranged' : 'Melee'), '+', null,
      'weaponBonus.' + name, '+', null,
      'weaponAttackAdjustment.' + name, '+', null
    );
    rules.defineRule('damageBonus.' + name,
      weaponName, '?', null,
      'combatNotes.' + (range ? 'dexterity' : 'strength') + 'DamageAdjustment', '=', null,
      'damageBonus.' + (range ? 'Ranged' : 'Melee'), '+', null,
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

    if(pieces[1].indexOf('2h') >= 0) {
      rules.defineRule('validationNotes.two-handedWeaponWithShield',
        weaponName, '=', '1'
      );
    }

  }

  var bulkyArmors = [];
  var heavyArmors = [];
  var mediumArmors = [];
  rules.defineRule('nonproficientArmor', '', '=', '1');
  for(var i = 0; i < armors.length; i++) {
    var pieces = armors[i].split(':');
    var category = pieces[1].indexOf('He')>=0 ? 'Heavy Armor' :
                   pieces[1].indexOf('Me')>=0 ? 'Medium Armor' : 'Light Armor';
    var name = pieces[0];
    rules.defineRule('proficient.' + name,
      'armor', '?', 'source == "' + name + '"',
      'armorProficiencies.' + name, '=', '1',
      'armorProficiencies.' + category, '=', '1'
    );
    rules.defineRule('nonproficientArmor', 'proficient.' + name, '=', '0');
    if(pieces[1].indexOf('Bu') >= 0)
      bulkyArmors.push(name);
    if(pieces[1].indexOf('He') >= 0)
      heavyArmors.push(name);
    if(pieces[1].indexOf('Me') >= 0)
      mediumArmors.push(name);
  }

  rules.defineNote(
    'sanityNotes.nonproficientArmorPenalty:' +
      'Disadv Dex, Str rolls, cannot cast spells',
    'skillNotes.bulkyArmor:Disadv Stealth'
  );
  rules.defineRule('armorWeight',
    'armor', '=', 'source.match(/' + heavyArmors.join('|') + '/) ? "Heavy" : source.match(/' + mediumArmors.join('|') + '/) ? "Medium" : "Light"'
  );
  rules.defineRule
    ('sanityNotes.nonproficientArmorPenalty', 'nonproficientArmor', '=', null);
  rules.defineRule('skillNotes.bulkyArmor',
    'armor', '=', 'source.match(/' + bulkyArmors.join('|') + '/) ? 1 : null'
  );

  rules.defineRule('armorFullSpeedStrShortfall',
    'armor', '=', 'source == "Chain" ? 13 : "SplintPlate".indexOf(source) >= 0 ? 15 : 3',
    'strength', '+', '-source',
    '', '^', '0'
  );
  rules.defineRule('abilityNotes.armorSpeedAdjustment',
    'armorFullSpeedStrShortfall', '=', 'source > 0 ? -10 : null'
  );
  rules.defineRule('combatNotes.dexterityArmorClassAdjustment',
    'armor', 'v', 'SRD5E.armorsMaxDexBonuses[source]'
  );
  rules.defineRule('speed', 'abilityNotes.armorSpeedAdjustment', '+', null);

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
      } else {
      }
    } else if(feat == 'Grappler') {
      notes = [
        'combatNotes.grapplerFeature:' +
          'Adv attacks vs. grappled foe, additional grapple to pin',
        'validationNotes.grapplerFeatAbility:Requires Strength >= 13'
      ];
    } else
      continue;

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
        'B0:Dancing Lights:Light:Mage Hand:Mending:Message:Minor Illusion:' +
        'Prestidigitation:True Strike:Vicious Mockery',
        'B1:Animal Friendship:Bane:Charm Person:Comprehend Languages:' +
        'Cure Wounds:Detect Magic:Disguise Self:Faerie Fire:Feather Fall:' +
        'Healing Word:Heroism:Hideous Laughter:Identify:Illusory Script:' +
        'Longstrider:Silent Image:Sleep:Speak With Animals:Unseen Servant',
        'B2:Animal Messenger:Blindness/Deafness:Calm Emotions:' +
        'Detect Thoughts:Enhance Ability:Enthrall:Heat Metal:Hold Person:' +
        'Invisibility:Knock:Lesser Restoration:Locate Animals Or Plants:' +
        'Locate Object:Magic Mouth:See Invisibility:Shatter:Silence:' +
        'Suggestion:Zone Of Truth',
        'B3:Bestow Curse:Clairvoyance:Dispel Magic:Fear:Glyph Of Warding:' +
        'Hypnotic Pattern:Major Image:Plant Growth:Sending:Speak With Dead:' +
        'Speak With Plants:Stinking Cloud:Tiny Hut:Tongues',
        'B4:Compulsion:Confusion:Dimension Door:Freedom Of Movement:' +
        'Greater Invisibility:Hallucinatory Terrain:Locate Creature:Polymorph',
        'B5:Animate Objects:Awaken:Dominate Person:Dream:Geas:' +
        'Greater Restoration:Hold Monster:Legend Lore:Mass Cure Wounds:' +
        'Mislead:Modify Memory:Planar Binding:Raise Dead:Scrying:Seeming:' +
        'Teleportation Circle',
        'B6:Eyebite:Find The Path:Guards And Wards:Irresistible Dance:' +
        'Mass Suggestion:Programmed Illusion:True Seeing',
        'B7:Etherealness:Forcecage:Magnificent Mansion:Mirage Arcane:' +
        'Project Image:Regenerate:Resurrection:Symbol:Teleport',
        'B8:Dominate Monster:Feeblemind:Glibness:Mind Blank:Power Word Stun',
        'B9:Foresight:Power Word Kill:True Polymorph'
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
        'Create Food And Water:Daylight:Dispel Magic:Glyph Of Warding:' +
        'Magic Circle:Mass Healing Word:Meld Into Stone:' +
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
        'Plane Shift:Regenerate:Resurrection:Symbol',
        'C8:Antimagic Field:Control Weather:Earthquake:Holy Aura',
        'C9:Astral Projection:Gate:Mass Heal:True Resurrection'
      ];
    } else if(klass == 'Druid') {
      spells = [
        'D0:Druidcraft:Guidance:Mending:Poison Spray:Produce Flame:' +
        'Resistance:Shillelagh',
        'D1:Animal Friendship:Charm Person:Create Or Destroy Water:' +
        'Cure Wounds:Detect Magic:Detect Poison And Disease:Entangle:' +
        'Faerie Fire:Fog Cloud:Goodberry:Healing Word:Jump:Longstrider:' +
        'Purify Food And Drink:Speak With Animals:Thunderwave',
        'D2:Animal Messenger:Barkskin:Darkvision:Enhance Ability:' +
        'Find Traps:Flame Blade:Flaming Sphere:Gust Of Wind:Heat Metal:' +
        'Hold Person:Lesser Restoration:Locate Animals Or Plants:' +
        'Locate Object:Moonbeam:Pass Without Trace:Protection From Poison:' +
        'Spike Growth',
        'D3:Call Lightning:Conjure Animals:Daylight:Dispel Magic:' +
        'Meld Into Stone:Plant Growth:Protection From Energy:Sleet Storm:' +
        'Speak With Plants:Water Breathing:Water Walk:Wind Wall',
        'D4:Blight:Confusion:Conjure Minor Elementals:' +
        'Conjure Woodland Beings:Control Water:Dominate Beast:' +
        'Freedom Of Movement:Giant Insect:Hallucinatory Terrain:Ice Storm:' +
        'Locate Creature:Polymorph:Stone Shape:Stoneskin:Wall Of Fire',
        'D5:Antilife Shell:Awaken:Commune With Nature:Conjure Elemental:' +
        'Contagion:Geas:Greater Restoration:Insect Plague:Mass Cure Wounds:' +
        'Planar Binding:Reincarnate:Scrying:Tree Stride:Wall Of Stone',
        "D6:Conjure Fey:Find The Path:Heal:Heroes' Feast:Move Earth:Sunbeam:" +
        'Transport Via Plants:Wall Of Thorns:Wind Walk',
        'D7:Fire Storm:Mirage Arcane:Plane Shift:Regenerate:Reverse Gravity',
        'D8:Animal Shapes:Antipathy/Sympathy:Control Weather:Earthquake:' +
        'Feeblemind:Sunburst',
        'D9:Foresight:Shapechange:Storm Of Vengeance:True Resurrection'
      ];
    } else if(klass == 'Paladin') {
      spells = [
        'P1:Bless:Command:Cure Wounds:Detect Evil And Good:Detect Magic:' +
        'Detect Poison And Disease:Divine Favor:Heroism:' +
        'Protection From Evil And Good:Purify Food And Drink:Shield Of Faith',
        'P2:Aid:Branding Smite:Find Steed:Lesser Restoration:Locate Object:' +
        'Magic Weapon:Protection From Poison:Zone Of Truth',
        'P3:Create Food And Water:Daylight:Dispel Magic:Magic Circle:' +
        'Remove Curse:Revivify',
        'P4:Banishment:Death Ward:Locate Creature',
        'P5:Dispel Evil And Good:Geas:Raise Dead'
      ];
    } else if(klass == 'Ranger') {
      spells = [
        'R1:Alarm:Animal Friendship:Cure Wounds:Detect Magic:' +
        "Detect Poison And Disease:Fog Cloud:Goodberry:Hunter's Mark:Jump:" +
        'Longstrider:Speak With Animals',
        'R2:Animal Messenger:Barkskin:Darkvision:Find Traps:' +
        'Lesser Restoration:Locate Animals Or Plants:Locate Object:' +
        'Pass Without Trace:Protection From Poison:Silence:Spike Growth',
        'R3:Conjure Animals:Daylight:Nondetection:Plant Growth:' +
        'Protection From Energy:Speak With Plants:Water Breathing:Water Walk:' +
        'Wind Wall',
        'R4:Conjure Woodland Beings:Freedom Of Movement:Locate Creature:' +
        'Stoneskin',
        'R5:Commune With Nature:Tree Stride'
      ];
    } else if(klass == 'Sorcerer') {
      spells = [
        'S0:Acid Splash:Chill Touch:Dancing Lights:Fire Bolt:Light:Mage Hand:' +
        'Mending:Message:Minor Illusion:Poison Spray:Prestidigitation:' +
        'Ray Of Frost:Shocking Grasp:True Strike',
        'S1:Burning Hands:Charm Person:Color Spray:Comprehend Languages:' +
        'Detect Magic:Disguise Self:Expeditious Retreat:False Life:' +
        'Feather Fall:Fog Cloud:Jump:Mage Armor:Magic Missile:Shield:' +
        'Silent Image:Sleep:Thunderwave',
        'S2:Alter Self:Blindness/Deafness:Blur:Darkness:Darkvision:' +
        'Detect Thoughts:Enhance Ability:Enlarge/Reduce:Gust Of Wind:' +
        'Hold Person:Invisibility:Knock:Levitate:Mirror Image:Misty Step:' +
        'Scorching Ray:See Invisibility:Shatter:Spider Climb:Suggestion:Web',
        'S3:Blink:Clairvoyance:Counterspell:Daylight:Dispel Magic:Fear:' +
        'Fireball:Fly:Gaseous Form:Haste:Hypnotic Pattern:Lightning Bolt:' +
        'Major Image:Protection From Energy:Sleet Storm:Slow:Stinking Cloud:' +
        'Tongues:Water Breathing:Water Walk',
        'S4:Banishment:Blight:Confusion:Dimension Door:Dominate Beast:' +
        'Greater Invisibility:Ice Storm:Polymorph:Stoneskin:Wall Of Fire',
        'S5:Animate Objects:Cloudkill:Cone Of Cold:Creation:Dominate Person:' +
        'Hold Monster:Insect Plague:Seeming:Telekinesis:Teleportation Circle:' +
        'Wall Of Stone',
        'S6:Chain Lightning:Circle Of Death:Disintegrate:Eyebite:' +
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
        'K0:Chill Touch:Eldritch Blast:Mage Hand:Minor Illusion:Poison Spray:' +
        'Prestidigitation:True Strike',
        'K1:Charm Person:Comprehend Languages:Expeditious Retreat:' +
        'Hellish Rebuke:Illusory Script:Protection From Evil And Good:' +
        'Unseen Servant',
        'K2:Darkness:Enthrall:Hold Person:Invisibility:Mirror Image:' +
        'Misty Step:Ray Of Enfeeblement:Shatter:Spider Climb:Suggestion',
        'K3:Counterspell:Dispel Magic:Fear:Fly:Gaseous Form:Hypnotic Pattern:' +
        'Magic Circle:Major Image:Remove Curse:Tongues:Vampiric Touch',
        'K4:Banishment:Blight:Dimension Door:Hallucinatory Terrain',
        'K5:Contact Other Plane:Dream:Hold Monster:Scrying',
        'K6:Circle Of Death:Conjure Fey:Create Undead:Eyebite:Flesh To Stone:' +
        'Mass Suggestion:True Seeing',
        'K7:Etherealness:Finger Of Death:Forcecage:Plane Shift',
        'K8:Demiplane:Dominate Monster:Feeblemind:Glibness:Power Word Stun',
        'K9:Astral Projection:Foresight:Imprisonment:Power Word Kill:' +
        'True Polymorph',
        // Fiend Patron
        'K1:Burning Hands:Command',
        'K2:Blindness/Deafness:Scorching Ray',
        'K3:Fireball:Stinking Cloud',
        'K4:Fire Shield:Wall Of Fire',
        'K5:Flame Strike:Hallow'
      ];
    } else if(klass == 'Wizard') {
      spells = [
        'W0:Acid Splash:Chill Touch:Dancing Lights:Fire Bolt:Light:Mage Hand:' +
        'Mending:Message:Minor Illusion:Poison Spray:Prestidigitation:' +
        'Ray Of Frost:Shocking Grasp:True Strike',
        'W1:Alarm:Burning Hands:Charm Person:Color Spray:' +
        'Comprehend Languages:Detect Magic:Disguise Self:Expeditious Retreat:' +
        'False Life:Feather Fall:Find Familiar:Floating Disk:Fog Cloud:' +
        'Grease:Hideous Laughter:Identify:Illusory Script:Jump:Longstrider:' +
        'Mage Armor:Magic Missile:Protection From Evil And Good:Shield:' +
        'Silent Image:Sleep:Thunderwave:Unseen Servant',
        "W2:Acid Arrow:Alter Self:Arcane Lock:Arcanist's Magic Aura:" +
        'Blindness/Deafness:Blur:Continual Flame:Darkness:Darkvision:' +
        'Detect Thoughts:Enlarge/Reduce:Flaming Sphere:Gentle Repose:' +
        'Gust Of Wind:Hold Person:Invisibility:Knock:Levitate:Locate Object:' +
        'Magic Mouth:Magic Weapon:Mirror Image:Misty Step:' +
        'Ray Of Enfeeblement:Rope Trick:Scorching Ray:See Invisibility:' +
        'Shatter:Spider Climb:Suggestion:Web',
        'W3:Animate Dead:Bestow Curse:Blink:Clairvoyance:Counterspell:' +
        'Dispel Magic:Fear:Fireball:Fly:Gaseous Form:Glyph Of Warding:Haste:' +
        'Hypnotic Pattern:Lightning Bolt:Magic Circle:Major Image:' +
        'Nondetection:Phantom Steed:Protection From Energy:Remove Curse:' +
        'Sending:Sleet Storm:Slow:Stinking Cloud:Tiny Hut:Tongues:' +
        'Vampiric Touch:Water Breathing',
        'W4:Arcane Eye:Banishment:Black Tentacles:Blight:Confusion:' +
        'Conjure Minor Elementals:Control Water:Dimension Door:Fabricate:' +
        'Faithful Hound:Fire Shield:Greater Invisibility:' +
        'Hallucinatory Terrain:Ice Storm:Locate Creature:Private Sanctum:' +
        'Phantasmal Killer:Polymorph:Resilient Sphere:Secret Chest:' +
        'Stone Shape:Stoneskin:Wall Of Fire',
        'W5:Animate Objects:Arcane Hand:Cloudkill:Cone Of Cold:' +
        'Conjure Elemental:Contact Other Plane:Creation:Dominate Person:' +
        'Dream:Geas:Hold Monster:Legend Lore:Mislead:Modify Memory:Passwall:' +
        'Planar Binding:Scrying:Seeming:Telekinesis:Telepathic Bond:' +
        'Teleportation Circle:Wall Of Force:Wall Of Stone',
        'W6:Chain Lightning:Circle Of Death:Contingency:Create Undead:' +
        'Disintegrate:Eyebite:Flesh To Stone:Freezing Sphere:' +
        'Globe Of Invulnerability:Guards And Wards:Instant Summons:' +
        'Irresistible Dance:Magic Jar:Mass Suggestion:Move Earth:' +
        'Programmed Illusion:Sunbeam:True Seeing:Wall Of Ice',
        'W7:Delayed Blast Fireball:Etherealness:Finger Of Death:Forcecage:' +
        'Magnificent Mansion:Mirage Arcane:Plane Shift:Prismatic Spray:' +
        'Project Image:Reverse Gravity:Sequester:Simulacrum:Symbol:Teleport',
        'W8:Antimagic Field:Antipathy/Sympathy:Clone:Control Weather:' +
        'Demiplane:Dominate Monster:Feeblemind:Incendiary Cloud:Maze:' +
        'Mind Blank:Power Word Stun:Sunburst',
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
          if(school == null) {
            console.log('No school for spell "' + spell + '"');
            continue;
          }
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
  // Default languageCount for most races, exceptions handled by defineRace
  rules.defineRule('languageCount', 'race', '=', '2');
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
        '1:Fey Ancestry:save:Adv vs. charmed, immune sleep',
        '1:Skill Versatility:skill:Prof two additional skills'
      ];
      languages = ['Common', 'Elvish', ''];
      proficiencyCount = {'Skill': 2};
      proficienciesGiven = {};
      proficiencyChoices = {
        'Skill': SRD5E.SKILLS.map(function(skill){return skill.substring(0, skill.indexOf(':'));})
      };
      rules.defineRule('abilityBoostCount',
        'abilityNotes.half-ElfAbilityAdjustment', '+=', '2'
      );
      // Redundant rule to get skill note to appear in italics
      rules.defineRule('skillChoices.Intimidation',
        'skillNotes.skillVersatilityFeature', '=', '1'
      );

    } else if(race == 'Half-Orc') {

      adjustment = '+2 strength/+1 constitution';
      features = [
        "1:Darkvision:feature:R60' See one light level better",
        '1:Menacing:skill:Prof Intimidation',
        '1:Relentless Endurance:combat:Keep 1 HP when brought to 0 1/long rest',
        '1:Savage Attacks:combat:Extra die on crit damage'
      ];
      languages = ['Common', 'Orc'];
      proficiencyCount = {'Skill': 2};
      proficienciesGiven = {'Skill': ['Intimidation']};
      proficiencyChoices = {};
      // Redundant rule to get skill note to appear in italics
      rules.defineRule('skillProficiencies.Intimidation',
        'skillNotes.menacingFeature', '=', '1'
      );

    } else if(race.match(/Dragonborn/)) {

      adjustment = '+2 strength/+1 charisma';
      features = [
        '1:Draconic Breath:combat:%1 %Vd6 HP %2 (DC %3 %4 half)',
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
      languages = ['Common', 'Dwarvish'];
      proficiencyCount = {'Tool':1, 'Weapon':4};
      proficienciesGiven = {
        'Weapon':['Battleaxe', 'Handaxe', 'Light Hammer', 'Warhammer']
      };
      proficiencyChoices = {
        'Tool':["Brewer's Supplies", "Mason's Tools", "Smith's Tools"]
      };
      rules.defineRule('abilityNotes.armorSpeedAdjustment',
        'abilityNotes.dwarvenArmorSpeedFeature', '^', '0'
      );
      rules.defineRule('speed', 'abilityNotes.slowFeature', '+', '-5');

      if(race == 'Hill Dwarf') {
        adjustment += '/+1 wisdom';
        features.push(
          '1:Dwarven Toughness:combat:+%V HP'
        );
        rules.defineRule
          ('combatNotes.dwarvenToughnessFeature', 'level', '=', null);
        rules.defineRule
          ('hitPoints', 'combatNotes.dwarvenToughnessFeature', '+', null);
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
      // Redundant rule to get skill note to appear in italics
      rules.defineRule('skillProficiencies.Perception',
        'skillNotes.keenSensesFeature', '=', '1'
      );

      if(race == 'High Elf') {
        adjustment += '/+1 intelligence';
        features.push(
          '1:Cantrip:magic:Additional Wizard cantrip',
          '1:Weapon Proficiency (Longbow/Longsword/Shortbow/Shortsword)::'
        );
        languages.push('');
        proficiencyCount['Weapon'] = 4;
        proficienciesGiven['Weapon'] =
          ['Longbow', 'Longsword', 'Shortbow', 'Shortsword'];
        rules.defineRule('casterLevels.W', 'casterLevels.High Elf', '^=', null);
        rules.defineRule('casterLevels.High Elf',
          'highElfFeatures.Cantrip', '?', null,
          'level', '=', null
        );
        rules.defineRule
          ('spellsKnown.W0', 'magicNotes.cantripFeature', '+=', '1');
      }

    } else if(race.match(/Gnome/)) {

      adjustment = '+2 intelligence';
      features = [
        "1:Darkvision:feature:R60' See one light level better",
        '1:Gnome Cunning:save:Adv Cha/Int/Wis vs magic',
        '1:Slow:ability:-5 speed',
        '1:Small:combat:Disadv heavy weapons'
      ];
      languages = ['Common', 'Gnomish'];
      proficiencyCount = {};
      proficienciesGiven = {};
      proficiencyChoices = {};
      rules.defineRule('speed', 'abilityNotes.slowFeature', '+', '-5');

      if(race == 'Rock Gnome') {
        adjustment += '/+1 constitution';
        features.push(
          "1:Artificer's Lore:skill:" +
            'Dbl Prof on magic, alchemical, tech objects History checks',
          "1:Tinker:skill:Prof Tinker's Tools"
        );
        proficiencyCount['Tool'] = 1;
        proficienciesGiven['Tool'] = ["Tinker's Tools"];
        // Redundant rule to get skill note to appear in italics
        rules.defineRule("toolProficiencies.Tinker's Tools",
          'skillNotes.tinkerFeature', '=', '1'
        );
      }

    } else if(race.match(/Halfling/)) {

      adjustment = '+2 dexterity';
      features = [
        '1:Brave:save:Adv vs. fright',
        '1:Halfling Luck:feature:Re-roll 1 on attack/ability/save',
        '1:Halfling Nimbleness:ability:' +
          'Move through space occupied by larger creature',
        '1:Slow:ability:-5 speed',
        '1:Small:combat:Disadv heavy weapons'
      ];
      languages = ['Common', 'Halfling'];
      proficiencyCount = {};
      proficienciesGiven = {};
      proficiencyChoices = {};
      rules.defineRule('speed', 'abilityNotes.slowFeature', '+', '-5');

      if(race == 'Lightfoot Halfling') {
        adjustment += '/+1 charisma';
        features.push(
          '1:Naturally Stealthy:feature:Hide behind larger creature'
        );
      }

    } else if(race.match(/Human/)) {

      adjustment = '+1 charisma/+1 constitution/+1 dexterity/+1 intelligence/+1 strength/+1 wisdom';
      features = [];
      languages = ['Common', ''];
      proficiencyCount = {};
      proficienciesGiven = {};
      proficiencyChoices = {};

    } else if(race.match(/Tiefling/)) {

      adjustment = '+1 intelligence/+2 charisma';
      features = [
        "1:Darkvision:feature:R60' See one light level better",
        '1:Hellish Resistance:save:Resistance fire damage',
        '1:Infernal Legacy:magic:<i>Thaumaturgy</i> cantrip%V'
      ];
      languages = ['Common', 'Infernal'];
      proficiencyCount = {};
      proficienciesGiven = {};
      proficiencyChoices = {};
      rules.defineRule('casterLevels.K', 'casterLevels.Tiefling', '^=', null);
      rules.defineRule('casterLevels.Tiefling',
        'tieflingFeatures.Infernal Legacy', '?', null,
        'level', '=', null
      );
      rules.defineRule('magicNotes.infernalLegacyFeature', 'level', '=', 'source >= 3 ? ", cast <i>Hellish Rebuke</i>" + (source >= 5 ? ", <i>Darkness</i>" : "") + " 1/long rest" : ""');

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

  rules.defineNote
    ('validationNotes.skillProficiencyAllocation:%1 available vs. %2 allocated');
  rules.defineRule('validationNotes.skillProficiencyAllocation.1',
    'skillProficiencyCount', '=', null
  );
  rules.defineRule('validationNotes.skillProficiencyAllocation.2',
    '', '=', '0',
    /^skillProficiencies\./, '+', null
  );
  rules.defineRule('validationNotes.skillProficiencyAllocation',
    'validationNotes.skillProficiencyAllocation.1', '=', '-source',
    'validationNotes.skillProficiencyAllocation.2', '+', null
  );
  rules.defineNote
    ('validationNotes.toolProficiencyAllocation:%1 available vs. %2 allocated');
  rules.defineRule('validationNotes.toolProficiencyAllocation.1',
    'toolProficiencyCount', '=', null
  );
  rules.defineRule('validationNotes.toolProficiencyAllocation.2',
    '', '=', '0',
    /^toolProficiencies\./, '+', null
  );
  rules.defineRule('validationNotes.toolProficiencyAllocation',
    'validationNotes.toolProficiencyAllocation.1', '=', '-source',
    'validationNotes.toolProficiencyAllocation.2', '+', null
  );

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
  else if(race == 'Half-Elf')
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
    ['strength', 'Str/Boost', 'select-one', abilityChoices],
    ['strengthAdjust', '', 'text', [3]],
    ['intelligence', 'Int/Boost', 'select-one', abilityChoices],
    ['intelligenceAdjust', '', 'text', [3]],
    ['wisdom', 'Wis/Boost', 'select-one', abilityChoices],
    ['wisdomAdjust', '', 'text', [3]],
    ['dexterity', 'Dex/Boost', 'select-one', abilityChoices],
    ['dexterityAdjust', '', 'text', [3]],
    ['constitution', 'Con/Boost', 'select-one', abilityChoices],
    ['constitutionAdjust', '', 'text', [3]],
    ['charisma', 'Cha/Boost', 'select-one', abilityChoices],
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
         attrs['armorProficiencies.Light Armor'] && armors[attr].indexOf('Li')>=0 ||
         attrs['armorProficiencies.Medium Armor'] && armors[attr].indexOf('Me')>=0 ||
         attrs['armorProficiencies.Heavy Armor'] && armors[attr].indexOf('He')>=0) {
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
    howMany = attrs['skillProficiencyCount'] || 0;
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
    howMany = attrs['toolProficiencyCount'] || 0;
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
    '    The Expertise features of bards and rogues are renamed Bard\n' +
    '    Expertise and Rogue Expertise to distinguish the two.\n' +
    '  </li><li>\n' +
    '    To allow feats to be taken instead of Ability Score Improvements,\n' +
    '    the latter are presented as feats named Ability Boost, Ability\n' +
    '    Boost2, Ability Boost3, etc. In the editor, text boxes next to\n' +
    '    each of the six basic attributes are used to enter the number of\n' +
    '    improvements to each.\n' +
    '  </li><li>\n' +
    '    Quilvyn presents sub-race choices (e.g., Lightfoot vs. Stout\n' +
    '    Halfling) as separate races in the editor Race menu.\n' +
    '  </li><li>\n' +
    '    Quilvyn includes spells granted by individual warlock patrons in\n' +
    '    the warlock spell list.\n' +
    '  </li>\n' +
    '</ul>\n' +
    '</p>\n' +
    '\n' +
    '<h3>Limitations</h3>\n' +
    '<p>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '    Quilvyn does not generate background traits, ideals, bonds, flaws,\n' +
    '    or equipment. These items can be entered in the Notes section.\n' +
    '  </li>\n' +
    '</ul>\n' +
    '</p>\n' +
    '\n' +
    '<h3>Known Bugs</h3>\n' +
    '<p>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '    Quilvyn does not test multiclass ability prerequisites, and Quilvyn\n'+
    '    gives multiclass characters the complete set of proficiencies for\n' +
    '    each class.\n' +
    '  </li>\n' +
    '</ul>\n' +
    '</p>\n';
};

SRD5E.defineBackground = function(
  rules, name, features, languages, proficiencyCount, proficienciesGiven,
  proficiencyChoices, equipment
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
    rules.defineChoice('extras', prefix + 'Features');
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
      rules.defineRule(a.toLowerCase() + 'ProficiencyCount',
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

  // TODO Do anything with equipment?

}

/*
 * A convenience function that adds #name# to the list of valid classes in
 * #rules#.  Characters of class #name# roll #hitDice# ([Nd]S, where N is the
 * number of dice and S the number of sides) more hit points at each level.
 * All other parameters are optional. #features# and #selectableFeatures# are
 * arrays of level:feature:section:note collections indicating features that
 * the class acquires when advancing levels; #proficiencyCount#,
 * #proficienciesGiven# and #proficiencyChoices# dictionaries indicating how
 * many and which proficiencies the class is granted; #spellAbility# the
 * abiity that pertains to this class' spells; #spellsKnown# and #spellSlots#
 * arrays of level:count pairs indicating how many spells are acquired at each
 * level, and #spells# a dictionary of spells that are granted by specified
 * class features.
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
    rules.defineChoice('extras', prefix + 'Features');
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
      rules.defineRule(a.toLowerCase() + 'ProficiencyCount',
        classLevel, '+=', proficiencyCount[a]
      );
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

  if(spells != null) {
    for(var feature in spells) {
      var note = 'magicNotes.' + feature.substring(0, 1).toLowerCase() + feature.substring(1).replace(/ /g, '') + 'Feature';
      rules.defineNote(note + ':%V');
      var code = '"Cast " + []';
      for(var i = 0; i < spells[feature].length; i++) {
        var pieces = spells[feature][i].split(':');
        var level = pieces.shift();
        code += '.concat(source >= ' + level + ' ? [' + pieces.map(x => '"<i>' + x + '</i>"') + '] : [])';
      }
      rules.defineRule(note, 'level', '=', code + '.sort().join(", ")');
    }
  }

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
    rules.defineChoice('extras', prefix + 'Features');
  }

  if(languages != null) {
    if(languages.length != 2)
      rules.defineRule
        ('languageCount', 'isRace.' + name, '+', languages.length - 2);
    for(var i = 0; i < languages.length; i++) {
      if(languages[i] != '')
        rules.defineRule
          ('languages.' + languages[i], 'isRace.' + name, '=', '1');
    }
  }

  if(proficiencyCount != null) {
    for(var a in proficiencyCount) {
      rules.defineRule(a.toLowerCase() + 'ProficiencyCount',
        'isRace.' + name, '+=', proficiencyCount[a]
      );
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
