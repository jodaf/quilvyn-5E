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

var SRD5E_VERSION = '1.6.0.1alpha';

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
/*
  SRD5E.companionRules(rules, SRD5E.ANIMAL_COMPANIONS, SRD5E.FAMILIARS);
*/
  SRD5E.skillRules(rules, SRD5E.SKILLS, SRD5E.TOOLS);
  SRD5E.featRules(rules, SRD5E.FEATS);
  SRD5E.descriptionRules(rules, SRD5E.ALIGNMENTS, SRD5E.DEITIES, SRD5E.GENDERS);
  SRD5E.equipmentRules(rules, SRD5E.ARMORS, SRD5E.SHIELDS, SRD5E.WEAPONS);
  SRD5E.combatRules(rules);
  SRD5E.movementRules(rules);
  SRD5E.magicRules(rules, SRD5E.CLASSES, SRD5E.CLERIC_DOMAINS, SRD5E.SCHOOLS);
  SRD5E.spellDescriptionRules(rules);
  rules.defineChoice('preset', 'background', 'race', 'level', 'levels');
  rules.defineChoice('random', SRD5E.RANDOMIZABLE_ATTRIBUTES);
  Quilvyn.addRuleSet(rules);
  SRD5E.rules = rules;
}

// Arrays of choices
SRD5E.ALIGNMENTS = [
  'Chaotic Evil', 'Chaotic Good', 'Chaotic Neutral', 'Neutral', 'Neutral Evil',
  'Neutral Good', 'Lawful Evil', 'Lawful Good', 'Lawful Neutral'
];
SRD5E.ARMORS = [
  'None:', 'Padded:L', 'Leather:L', 'Studded Leather:L', 'Hide:M',
  'Chain Shirt:L', 'Scale Mail:M', 'Breastplate:M', 'Half Plate:M',
  'Ring Mail:H', 'Chain Mail:H', 'Splint:H', 'Plate:H'
];
SRD5E.BACKGROUNDS = [
  'Acolyte', 'Charlatan', 'Criminal', 'Entertainer', 'Folk Hero',
  'Guild Artisan', 'Hermit', 'Noble', 'Outlander', 'Sage', 'Sailor', 'Soldier',
  'Urchin'
];
SRD5E.BARD_COLLEGES = ['College Of Lore'];
// PHB
SRD5E.BARD_COLLEGES.push('College Of Valor');
// ENDPHB
SRD5E.BARBARIAN_PATHS = ['Path Of The Berserker', 'Path Of The Totem Warrior'];
// PHB
SRD5E.BARBARIAN_TOTEMS = ['Bear Totem', 'Eagle Totem', 'Wolf Totem'];
// ENDPHB
SRD5E.CLASSES = [
  'Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk', 'Paladin',
  'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard'
];
SRD5E.CLERIC_DOMAINS = ['Life Domain'];
// PHB
SRD5E.CLERIC_DOMAINS = SRD5E.CLERIC_DOMAINS.concat([
  'Knowledge Domain', 'Light Domain', 'Nature Domain', 'Tempest Domain',
  'Trickery Domain', 'War Domain'
]);
// ENDPHB
SRD5E.DEITIES = [
  'Auril (NE):Nature/Tempest', 'Azuth (LN):Knowledge', 'Bane (LE):War',
  'Beshaba (CE):Trickery', 'Bhaal:Death (NE)', 'Chauntea (NG):Life',
  'Cyric (CE):Trickery', 'Deneir (NG):Knowledge', 'Eldath (NG):Life/Nature',
  'Gond (N)::Knowledge', 'Helm (LN):Life/Light', 'Ilmater (LG):Life',
  'Kelemvor (LN):Death', 'Lathander (NG):Life/Light', 'Leira (CN):Trickery',
  'Lliira (CG):Life', 'Loviatar (LE):Death', 'Malar (CE):Nature',
  'Mask (CN):Trickery', 'Milil (NG):Light', 'Myrkul (NE):Death',
  'Mystra (NG):Knowledge', 'Oghma (N):Knowledge', 'Savras (LN):Knowledge',
  'Selune (CG):Knowledge/Life', 'Shar (NE):Death/Trickery',
  'Silvanus (N):Nature', 'Talona (CE):Death', 'Talos (CE):Tempest',
  'Torm (LG):War', 'Tymora (CG):Trickery', 'Tyr (LG):War',
  'Umberlee (CE):Tempest', 'Waukeen (N):Knowledge/Trickery', 'None:'
];
SRD5E.DRUID_CIRCLES = ['Circle Of The Land'];
// PHB
SRD5E.DRUID_CIRCLES = SRD5E.DRUID_CIRCLES.concat(['Circle Of The Moon']);
// ENDPHB
SRD5E.DRUID_LANDS = [
  'Arctic Land', 'Coast Land', 'Desert Land', 'Forest Land', 'Grassland Land',
  'Mountain Land', 'Swamp Land'
];
// PHB
SRD5E.DRUID_LANDS.push('Underdark Land');
// ENDPHB
SRD5E.FEATS = [
  'Alert', 'Athleete', 'Actor', 'Charger', 'Crossbow Expert',
  'Defensive Duelist', 'Dual Wielder', 'Dungeon Delver', 'Durable',
  'Elemental Adept', 'Grappler', 'Great Weapon Master', 'Healer',
  'Heavily Armored', 'Heavy Armor Master', 'Inspiring Leader', 'Keen Mind',
  'Lightly Armorned', 'Linguist', 'Lucky', 'Mage Slayer', 'Magic Initiate',
  'Martial Adept', 'Medium Armor Master', 'Mobile', 'Moderately Armored',
  'Mounted Combatant', 'Observant', 'Polearm Master', 'Resilient',
  'Ritual Caster', 'Savage Attacker', 'Sentinel', 'Sharpshooter',
  'Shield Master', 'Skilled', 'Skulker', 'Spell Sniper', 'Tavern Brawler',
  'Tough', 'War Caster', 'Weapon Master'
];
SRD5E.FIGHTER_FIGHTING_STYLES = [
  'Archery Style', 'Defense Style', 'Dueling Style',
  'Great Weapon Fighting Style', 'Protection Style', 'Two-Weapon Fighting Style'
];
SRD5E.FIGHTER_MARTIAL_ARCHETYPES = ['Champion Archetype'];
// PHB
SRD5E.FIGHTER_MARTIAL_ARCHETYPES = SRD5E.FIGHTER_MARTIAL_ARCHETYPES.concat([
  'Battle Master Archetype', 'Eldritch Knight Archetype'
]);
SRD5E.FIGHTER_MANEUVERS = [
  "Commander's Strike", 'Disarming Attack', 'Distracting Strike',
  'Evasive Footwork', 'Feinting Attack', 'Goading Attack', 'Lunging Attack',
  'Maneuvering Attack', 'Menacing Attack', 'Parry', 'Precision Attack',
  'Pushing Attack', 'Rally', 'Riposte', 'Sweeping Attack', 'Trip Attack'
];
// ENDPHB
SRD5E.GENDERS = ['Female', 'Male'];
SRD5E.LANGUAGES = [
  'Abyssal', 'Celestial', 'Common', 'Deep Speech', 'Draconic', 'Dwarvish',
  'Elvish', 'Giant', 'Gnomish', 'Goblin', 'Halfling', 'Infernal', 'Orc',
  'Primordial', 'Sylvan', 'Undercommon'
];
SRD5E.MONK_MONASTIC_TRADITIONS = ['Way Of The Open Hand Tradition'];
// PHB
SRD5E.MONK_MONASTIC_TRADITIONS = SRD5E.MONK_MONASTIC_TRADITIONS.concat([
  'Way Of The Four Elements Tradition', 'Way Of The Shadow Tradition'
]);
SRD5E.MONK_ELEMENTAL_DISCIPLINES = [
  'Breath Of Winter', 'Clench Of The North Wind', 'Eternal Mountain Defense',
  'Fangs Of The Fire Snake', 'Fist Of Four Thunders', 'Fist Of Unbroken Air',
  'Flames Of The Phoenix', 'Gong Of The Summit', 'Mist Stance', 'Ride The Wind',
  'River Of Hungry Flame', 'Rush Of The Gale Spirits',
  'Shape Of The Flowing River', 'Sweeping Cinder Strike', 'Water Whip',
  'Wave Of The Rolling Earth'
];
// ENDPHB
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
SRD5E.ROGUISH_ARCHETYPES = ['Arcane Trickster', 'Assassin', 'Thief'];
SRD5E.SCHOOLS = [
  'Abjuration:Abju', 'Conjuration:Conj', 'Divination:Divi', 'Enchantment:Ench',
  'Evocation:Evoc', 'Illusion:Illu', 'Necromancy:Necr', 'Transmutation:Tran'
];
SRD5E.SPELLS = {

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
  'Arcane Lock':'Abjuration',
  'Armor Of Agathys':'Abjuration',
  'Arms Of Hadar':'Conjuaration',
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
  "Bigby's Hand":'Evocation',
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
  "Drawmij's Instant Summons":'Conjuration',
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
  "Evard's Black Tentacles":'Conjuration',
  'Expeditious Retreat':'Transmutation',
  'Eyebite':'Necromancy',

  'Fabricate':'Transmutation',
  'Faerie Fire':'Evocation',
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
  'Fly':'Transmutation',
  'Fog Cloud':'Conjuration',
  'Forbiddance':'Abjuration',
  'Forcecage':'Evocation',
  'Foresight':'Divination',
  'Freedom Of Movement':'Abjuration',
  'Friends':'Enchantment',

  'Gaseous Form':'Transmutation',
  'Gate':'Conjuration',
  'Geas':'Enchantment',
  'Gentle Repose':'Necromancy',
  'Giant Insect':'Transmutation',
  'Glibness':'Transmutation',
  'Globe Of Invulnerability':'Abjuration',
  'Glyph Of Warding':'Abjuration',
  'Good Hope':'Enchantment',
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
  'Invisibility':'Illusion',

  'Jump':'Transmutation',

  'Knock':'Transmutation',

  'Legend Lore':'Divination',
  "Leomund's Secret Chest":'Conjuraion',
  "Leomund's Tiny Hut":'Evocation',
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
  'Magic Circle':'Abjuration',
  'Magic Jar':'Necromancy',
  'Magic Missile':'Evocation',
  'Magic Mouth':'Illusion',
  'Magic Weapon':'Transmutation',
  'Major Image':'Illusion',
  'Mass Cure Wounds':'Conjuration',
  'Mass Heal':'Conjuration',
  'Mass Healing Word':'Evocation',
  'Mass Suggestion':'Enchantment',
  'Maze':'Conjuration',
  'Meld Into Stone':'Transmutation',
  "Melf's Acid Arrow":'Evocation',
  'Mending':'Transmutation',
  'Message':'Transmutation',
  'Meteor Swarm':'Evocation',
  'Mind Blank':'Abjuration',
  'Mind Fog':'Enchantment',
  "Mordenkainen's Private Sanctum":'Abjuration',
  "Mordenkainen's Sword":'Evocation',
  'Move Earth':'Transmutation',

  'Nondetection':'Abjuration',
  "Nystul's Magic Aura":'Illusion',

  "Otiluke's Freezing Sphere":'Evocation',
  "Otiluke's Resilient Sphere":'Evocation',
  "Otto's Irresistable Dance":'Enchantment',

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
  'Produce Flame':'Conjuration',
  'Programmed Illusion':'Illusion',
  'Project Image':'Illusion',
  'Protection From Energy':'Abjuration',
  'Protection From Evil And Good':'Abjuration',
  'Protection From Poison':'Abjuration',
  'Purify Food And Drink':'Transmutation',

  'Raise Dead':'Necromancy',
  "Rary's Telepathic Bond":'Divination',
  'Ray Of Enfeeblement':'Necromancy',
  'Ray Of Frost':'Evocation',
  'Ray Of Sickness':'Necromancy',
  'Regenerate':'Transmutation',
  'Reincarnate':'Transmutation',
  'Remove Curse':'Abjuration',
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
  'Spike Stones':'Transmutation',
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

  "Tasha's Hideous Laughter":'Enchantment',
  'Telekinesis':'Transmutation',
  'Telepathy':'Evocation',
  'Teleport':'Conjuration',
  'Teleportation Circle':'Conjuration',
  "Tenser's Floating Disk":'Conjuration',
  'Thaumaturgy':'Transmutation',
  'Thorn Whip':'Transmutation',
  'Thunderous Smite':'Evocation',
  'Thunderwave':'Evocation',
  'Time Stop':'Transmutation',
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
SRD5E.landsCircleSpells = {
  'Arctic Land':[
    '3:Hold Person', '3:Spike Growth', '5:Sleet Storm', '5:Slow',
    '7:Freedom Of Movement', '7:Ice Storm', '9:Commune With Nature', '9:Cone Of Cold'
  ],
  'Coast Land':[
    '3:Mirror Image', '3:Misty Step', '5:Water Breathing', '5:Water Walk',
    '7:Control Weather', '7:Freedom Of Movement', '9:Conjure Elemental', '9:Scrying'
  ],
  'Desert Land':[
    '3:Blur', '3:Silence', '5:Create Food And Water', '5:Protection From Energy',
    '7:Blight', '7:Hallucinatory Terrain', '9:Insect Plague', '9:Wall Of Stone'
  ],
  'Forest Land':[
    '3:Barkskin', '3:Spider Climb', '5:Call Lightning', '5:Plant Growth',
    '7:Divination', '7:Freedom Of Movement', '9:Commune With Nature', '9:Tree Stride'
  ],
  'Grassland Land':[
    '3:Invisibility', '3:Pass Without Trace', '5:Daylight', '5:Haste',
    '7:Divination', '7:Freedom Of Movement', '9:Dream', '9:Insect Plague'
  ],
  'Mountain Land':[
    '3:Spider Climb', '3:Spike Growth', '5:Lightning Bolt', '5:Meld Into Stone',
    '7:Stone Shape', '7:Soneskin', '9:Passwall', '9:Wall Of Stone'
  ],
  'Swamp Land':[
    '3:Acid Arrow', '3:Darkness', '5:Water Walk', '5:Stinking Cloud',
    '7:Freedom Of Movement', '7:Locate Creature', '9:Insect Plague', '9:Scrying'
  ]
};
// PHB
SRD5E.landsCircleSpells['Underdark Land'] = [
  '3:Spider Climb', '3:Web', '5:Gaseous Form', '5:Stinking Cloud',
  '7:Greater Invisibility', '7:Stone Shape', '9:Cloudkill', '9:Insect Plague'
];
// ENDPHB
SRD5E.spellsAbbreviations = {
  "BarkskinAC": "2 + (source < 6 ? 0 : Math.min(Math.floor((source - 3)/ 3), 3))",
  "L": "lvl",
  "L2": "lvl * 2",
  "L3": "lvl * 3",
  "L4": "lvl * 4",
  "L5": "lvl * 5",
  "L10": "lvl * 10",
  "L15": "lvl * 15",
  "L20": "lvl * 20",
  "L40": "lvl * 40",
  "L100": "lvl * 100",
  "L200": "lvl * 200",
  "Ldiv2": "Math.floor(lvl/2)",
  "Ldiv3": "Math.floor(lvl/3)",
  "Ldiv4": "Math.floor(lvl/4)",
  "Lmin5": "Math.min(source, 5)",
  "Lmin10": "Math.min(source, 10)",
  "Lmin15": "Math.min(source, 15)",
  "Lmin20": "Math.min(source, 20)",
  "Lmin25": "Math.min(source, 25)",
  "Lmin30": "Math.min(source, 30)",
  "Lmin35": "Math.min(source, 35)",
  "Lmin40": "Math.min(source, 40)",
  "RL": "400 + 40 * source",
  "RM": "100 + 10 * source",
  "RS": "25 + 5 * Math.floor(source / 2)"
};
SRD5E.spellsDescriptions = {
  "Acid Splash": "R60' Ranged touch ${Math.floor((lvl+1)/6) + 1}d6 HP acid (Ref neg)",
  'Aid':"R30' Three targets +5 or more HP for 8 hr",
  'Alarm':"R30' Alert when tiny or larger creature enters 20' cu for 8 hr",
  'Alter Self':"Self aquatic, look different, or nat weapons for conc/1 hr",
  'Animal Friendship':"R30' Target beast(s) convinced of good intent for 1 dy (Wis neg)",
  'Animal Messenger':"R30' Tiny beast target move 24+ hr to deliver 25-word messsage to person described",
  'Animal Shapes':"R30' Polymorph all targets in range into max CR 4 max lg creature",
  'Animate Dead':"R10' Animate med/small bones/corpse, command w/in 60' for 1 dy",
  'Animate Objects':"R120' Animate 10 sm/5 md/2 lg/1 hg objects, command w/in 500' for conc/1 min",
  'Antilife Shell':"Self 10' sphere prevents living passage for conc/1 hr",
  'Antimagic Field':"Self 10' sphere supresses magic for conc/1 hr",
  'Antipathy/Sympathy':"R60' Target object repels/attracts specified creatures for 10 dy",
  'Arcane Eye':"R30' See through invisible eye for conc/1 hr",
  'Arcane Gate':"R10'/500' Connect portal pair for conc/10 min",
  'Arcane Lock':"Touched barrier passable only by designated until dispelled",
  'Armor Of Agathys':"Self frosted, +5 HP, 5 HP cold to successful attcker",
  'Arms Of Hadar':"All in 10' radius take 2d6 HP necrotic (Str half), no reactions until next turn",
  'Astral Projection':"Self + 8 companions w/in 10' project to astral plane until dispelled or 0 HP",
  'Augury':"Discern whether act w/in 30 min will yield weal/woe",
  'Aura Of Life':"Self 30' radius gives resistance to necrotic damage, raise nonhostile 0 HP to 1 HP for conc/10 min",
  'Aura Of Purity':"Self 30' radius gives resist poison, no disease, Adv conditions for conc/10 min",
  'Aura Of Vitality':"Self 30' radius heals 2d6 HP designated target 1/rd for conc/1 min",
  'Awaken':"Touched beast or plant Int 10, friendly for 30 dy",

  'Bane':"R30' 3 targets -1d4 from attack/save (Cha neg) for conc/1 min",
  'Banishing Smite':"Self attacks +5d10 HP force and banish to home/demiplane if lt 50 HP for conc/1 min",
  'Banishment':"R60' target banish to home/demiplane (Cha neg) for conc/1 min",
  'Barkskin':"Touched AC 16 for conc/1 hr",
  'Beacon Of Hope':"R30' Targets Adv Wis/death saves, max heal for conc/1 min",
  'Beast Sense':"Self use touched beast's senses for conc/1 hr",
  'Bestow Curse':"Touched one of Disadv specified ability rolls, Disadv self attacks, Wis save to take action, take +1d8 HP necrotic from self attacks (Wis neg) for conc/1 min",
  "Bigby's Hand":"R120' AC20, Str 26, Dex 10 hand can punch, push, grasp, block for conc/1 min",
  'Blade Barrier':"R90' 100'x20'x5' blade wall passers 6d10 HP slashing (Dex neg) for conc/10 min",
  'Blade Ward':"Self resist bludgeon, pierce, slash damage for 1 rd",
  'Bless':"R30' 3 targets +1d4 to attack/save rolls for conc/1 min",
  'Blight':"R30; target 8d8 HP necrotic (Con half)",
  'Blinding Smite':"Self next attack +3d8 HP radiant and blind (Con neg) for conc/1 min",
  'Blindness/Deafness':"R30' target blind or deaf (Con neg) for 1 min",
  'Blink':"Self 50% chance of ethereal for 1 min",
  'Blur':"Self foes Disadv attack for conc/1 min",
  'Branding Smite':"Self next attack +2d6 HP radiant and visible for conc/1 min",
  'Burning Hands':"15' cone 3d6 HP fire (Dex half)",

  'Call Lightning':"R120' Conjured storm cloud 100' overhead generates bolt for 3d10 HP (Dex half) in 5' radius each rd for conc/10 min",
  'Calm Emotions':"R60' 10' radius suppresses charm/fright or hostility (Cha neg) for conc/1 min",
  'Chain Lightning':"R150' 4 targets in 30' radius 10d8 HP lightning (Dex half)",
  'Charm Person':"R30' Target regards you as friend (Wis neg) for 1 hr/until harmed",
  'Chill Touch':"R120' Ghost hand ${Math.floor((lvl + 1) / 6) + 1} HP necrotic, undead also Disadv self attack for 1 rd",
  'Chromatic Orb':"R90' 4\" hurled sphere 3d8 HP acid/poison/energy",
  'Circle Of Death':"R150' 60' radius 8d6 HP necrotic (Con half)",
  'Circle Of Power':"Allies in 30' radius from self Adv save vs. magic, neg instead of half for conc/10 min",
  'Clairvoyance':"R1 mi Invisible sensor allows sight or hearing for conc/10 min",
  'Clone':"Grow backup body for touched target",
  'Cloud Of Daggers':"R60' Spinning daggers in 5' cu 4d4 HP slashing for conc/1 min",
  'Cloudkill':"R120' 20' radius 5d8 HP poison (Con half), moves 10'/rd for conc/10 min",
  'Color Spray':"Self 15' cone 6d10 HP targets blinded for 1 rd",
  'Command':"R60' Target obeys one-word command (Wis neg)",
  'Commune':"Self receive 3 yes/no answers w/in 1 min",
  'Commune With Nature':"Self gain 3 facts about territory w/in 3 miles",
  'Compelled Duel':"R30' Target attack only self w/Disadv for conc/1 min (Wis neg)",
  'Comprehend Languages':"Self understand all language for 1 hr",
  'Compulsion':"R30' Self control target movement (Wis neg) for conc/1 min",
  'Cone Of Cold':"Self 60' cone 8d8 HP cold (Con half)",
  'Confusion':"R90' Targets in 10' radius act randomly (Wis neg) for conc/1 min",
  'Conjure Animals':"TODO",
  'Conjure Barrage':"TODO",
  'Conjure Celestial':"TODO",
  'Conjure Elemental':"TODO",
  'Conjure Fey':"TODO",
  'Conjure Minor Elementals':"TODO",
  'Conjure Volley':"TODO",
  'Conjure Woodland Beings':"TODO",
  'Contact Other Plane':"TODO",
  'Contagion':"TODO",
  'Continual Flame':"TODO",
  'Control Water':"TODO",
  'Control Weather':"TODO",
  'Cordon Of Arrows':"TODO",
  'Counterspell':"TODO",
  'Create Food And Water':"TODO",
  'Create Or Destroy Water':"TODO",
  'Create Undead':"TODO",
  'Creation':"TODO",
  'Crown Of Madness':"TODO",
  "Crusader's Mantle":"TODO",
  'Cure Wounds':"TODO",

  'Dancing Lights':"TODO",
  'Darkness':"TODO",
  'Darkvision':"TODO",
  'Daylight':"TODO",
  'Death Ward':"TODO",
  'Delayed Blast Fireball':"TODO",
  'Demiplane':"TODO",
  'Destructive Wave':"TODO",
  'Detect Evil And Good':"TODO",
  'Detect Magic':"TODO",
  'Detect Poison And Disease':"TODO",
  'Detect Thoughts':"TODO",
  'Dimension Door':"TODO",
  'Disguise Self':"TODO",
  'Disintegrate':"TODO",
  'Dispel Evil And Good':"TODO",
  'Dispel Magic':"TODO",
  'Dissonant Whispers':"TODO",
  'Divination':"TODO",
  'Divine Favor':"TODO",
  'Divine Word':"TODO",
  'Dominate Beast':"TODO",
  'Dominate Monster':"TODO",
  'Dominate Person':"TODO",
  "Drawmij's Instant Summons":"TODO",
  'Dream':"TODO",
  'Druidcraft':"TODO",

  'Earthquake':"TODO",
  'Eldritch Blast':"TODO",
  'Elemental Weapon':"TODO",
  'Enhance Ability':"TODO",
  'Enlarge/Reduce':"TODO",
  'Ensnaring Strike':"TODO",
  'Entangle':"TODO",
  'Enthrall':"TODO",
  'Etherealness':"TODO",
  "Evard's Black Tentacles":"TODO",
  'Expeditious Retreat':"TODO",
  'Eyebite':"TODO",

  'Fabricate':"TODO",
  'Faerie Fire':"TODO",
  'False Life':"TODO",
  'Fear':"TODO",
  'Feather Fall':"TODO",
  'Feeblemind':"TODO",
  'Feign Death':"TODO",
  'Find Familiar':"TODO",
  'Find Steed':"TODO",
  'Find The Path':"TODO",
  'Find Traps':"TODO",
  'Finger Of Death':"TODO",
  'Fire Bolt':"TODO",
  'Fire Shield':"TODO",
  'Fire Storm':"TODO",
  'Fireball':"TODO",
  'Flame Blade':"TODO",
  'Flame Strike':"TODO",
  'Flaming Sphere':"TODO",
  'Flesh To Stone':"TODO",
  'Fly':"TODO",
  'Fog Cloud':"TODO",
  'Forbiddance':"TODO",
  'Forcecage':"TODO",
  'Foresight':"TODO",
  'Freedom Of Movement':"TODO",
  'Friends':"TODO",

  'Gaseous Form':"TODO",
  'Gate':"TODO",
  'Geas':"TODO",
  'Gentle Repose':"TODO",
  'Giant Insect':"TODO",
  'Glibness':"TODO",
  'Globe Of Invulnerability':"TODO",
  'Glyph Of Warding':"TODO",
  'Good Hope':"TODO",
  'Goodberry':"TODO",
  'Grasping Vine':"TODO",
  'Grease':"TODO",
  'Greater Invisibility':"TODO",
  'Greater Restoration':"TODO",
  'Guardian Of Faith':"TODO",
  'Guards And Wards':"TODO",
  'Guidance':"TODO",
  'Guiding Bolt':"TODO",
  'Gust Of Wind':"TODO",

  'Hail Of Thorns':"TODO",
  'Hallow':"TODO",
  'Hallucinatory Terrain':"TODO",
  'Harm':"TODO",
  'Haste':"TODO",
  'Heal':"TODO",
  'Healing Word':"TODO",
  'Heat Metal':"TODO",
  'Hellish Rebuke':"TODO",
  "Heroes' Feast":"TODO",
  'Heroism':"TODO",
  'Hex':"TODO",
  'Hold Monster':"TODO",
  'Hold Person':"TODO",
  'Holy Aura':"TODO",
  'Hunger Of Hadar':"TODO",
  "Hunter's Mark":"TODO",
  'Hypnotic Pattern':"TODO",

  'Ice Storm':"TODO",
  'Identify':"TODO",
  'Imprisonment':"TODO",
  'Incendiary Cloud':"TODO",
  'Inflict Wounds':"TODO",
  'Insect Plague':"TODO",
  'Invisibility':"TODO",

  'Jump':"TODO",

  'Knock':"TODO",

  'Legend Lore':"TODO",
  "Leomund's Secret Chest":"TODO",
  "Leomund's Tiny Hut":"TODO",
  'Lesser Restoration':"TODO",
  'Levitate':"TODO",
  'Light':"TODO",
  'Lightning Arrow':"TODO",
  'Lightning Bolt':"TODO",
  'Locate Animal Or Plant':"TODO",
  'Locate Creature':"TODO",
  'Locate Object':"TODO",
  'Longstrider':"TODO",

  'Mage Armor':"TODO",
  'Mage Hand':"TODO",
  'Magic Circle':"TODO",
  'Magic Jar':"TODO",
  'Magic Missile':"TODO",
  'Magic Mouth':"TODO",
  'Magic Weapon':"TODO",
  'Major Image':"TODO",
  'Mass Cure Wounds':"TODO",
  'Mass Heal':"TODO",
  'Mass Healing Word':"TODO",
  'Mass Suggestion':"TODO",
  'Maze':"TODO",
  'Meld Into Stone':"TODO",
  "Melf's Acid Arrow":"TODO",
  'Mending':"TODO",
  'Message':"TODO",
  'Meteor Swarm':"TODO",
  'Mind Blank':"TODO",
  'Mind Fog':"TODO",
  "Mordenkainen's Private Sanctum":"TODO",
  "Mordenkainen's Sword":"TODO",
  'Move Earth':"TODO",

  'Nondetection':"TODO",
  "Nystul's Magic Aura":"TODO",

  "Otiluke's Freezing Sphere":"TODO",
  "Otiluke's Resilient Sphere":"TODO",
  "Otto's Irresistable Dance":"TODO",

  'Pass Without Trace':"TODO",
  'Passwall':"TODO",
  'Phantasmal Force':"TODO",
  'Phantasmal Killer':"TODO",
  'Phantom Steed':"TODO",
  'Planar Ally':"TODO",
  'Planar Binding':"TODO",
  'Plane Shift':"TODO",
  'Plant Growth':"TODO",
  'Poison Spray':"TODO",
  'Polymorph':"TODO",
  'Power Word Heal':"TODO",
  'Power Word Kill':"TODO",
  'Power Word Stun':"TODO",
  'Prayer Of Healing':"TODO",
  'Prestidigitation':"TODO",
  'Prismatic Spray':"TODO",
  'Prismatic Wall':"TODO",
  'Produce Flame':"TODO",
  'Programmed Illusion':"TODO",
  'Project Image':"TODO",
  'Protection From Energy':"TODO",
  'Protection From Evil And Good':"TODO",
  'Protection From Poison':"TODO",
  'Purify Food And Drink':"TODO",

  'Raise Dead':"TODO",
  "Rary's Telepathic Bond":"TODO",
  'Ray Of Enfeeblement':"TODO",
  'Ray Of Frost':"TODO",
  'Ray Of Sickness':"TODO",
  'Regenerate':"TODO",
  'Reincarnate':"TODO",
  'Remove Curse':"TODO",
  'Resistance':"TODO",
  'Resurrection':"TODO",
  'Reverse Gravity':"TODO",
  'Revivify':"TODO",
  'Rope Trick':"TODO",

  'Sacred Flame':"TODO",
  'Sanctuary':"TODO",
  'Scorching Ray':"TODO",
  'Scrying':"TODO",
  'Searing Smite':"TODO",
  'See Invisibility':"TODO",
  'Seeming':"TODO",
  'Sending':"TODO",
  'Sequester':"TODO",
  'Shapechange':"TODO",
  'Shatter':"TODO",
  'Shield':"TODO",
  'Shield Of Faith':"TODO",
  'Shillelagh':"TODO",
  'Shocking Grasp':"TODO",
  'Silence':"TODO",
  'Silent Image':"TODO",
  'Simulacrum':"TODO",
  'Sleep':"TODO",
  'Sleet Storm':"TODO",
  'Slow':"TODO",
  'Spare The Dying':"TODO",
  'Speak With Animals':"TODO",
  'Speak With Dead':"TODO",
  'Speak With Plants':"TODO",
  'Spider Climb':"TODO",
  'Spike Growth':"TODO",
  'Spike Stones':"TODO",
  'Spirit Guardians':"TODO",
  'Spiritual Weapon':"TODO",
  'Staggering Smite':"TODO",
  'Stinking Cloud':"TODO",
  'Stone Shape':"TODO",
  'Stoneskin':"TODO",
  'Storm Of Vengeance':"TODO",
  'Suggestion':"TODO",
  'Sunbeam':"TODO",
  'Sunburst':"TODO",
  'Swift Quiver':"TODO",
  'Symbol':"TODO",

  "Tasha's Hideous Laughter":"TODO",
  'Telekinesis':"TODO",
  'Telepathy':"TODO",
  'Teleport':"TODO",
  'Teleportation Circle':"TODO",
  "Tenser's Floating Disk":"TODO",
  'Thaumaturgy':"TODO",
  'Thorn Whip':"TODO",
  'Thunderous Smite':"TODO",
  'Thunderwave':"TODO",
  'Time Stop':"TODO",
  'Tongues':"TODO",
  'Transport Via Plants':"TODO",
  'Tree Stride':"TODO",
  'True Polymorph':"TODO",
  'True Resurrection':"TODO",
  'True Seeing':"TODO",
  'True Strike':"TODO",
  'Tsunami':"TODO",

  'Unseen Servant':"TODO",

  'Vampiric Touch':"TODO",
  'Vicious Mockery':"TODO",

  'Wall Of Force':"TODO",
  'Wall Of Ice':"TODO",
  'Wall Of Stone':"TODO",
  'Wall Of Thorns':"TODO",
  'Warding Bond':"TODO",
  'Water Breathing':"TODO",
  'Water Walk':"TODO",
  'Web':"TODO",
  'Weird':"TODO",
  'Wind Walk':"TODO",
  'Wind Wall':"TODO",
  'Wish':"TODO",
  'Witch Bolt':"TODO",
  'Word Of Recall':"TODO",
  'Wrathful Smite':"TODO",

  'Zone Of Truth':"TODO"

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
  rules.defineRule
    ('hitPoints', 'combatNotes.constitutionHitPointsAdjustment', '+', null);

};

/* Defines the rules related to character backgrounds. */
SRD5E.backgroundRules = function(rules, backgrounds) {

  for(var i = 0; i < backgrounds.length; i++) {

    var name = backgrounds[i];
    var equipment = [];
    var features = [];
    var languages = [];
    var notes = [];
    var proficiencyCount = {};
    var proficienciesGiven = {};
    var proficiencyChoices = {};

    if(name === 'Acolyte') {
      equipment = [
        'Holy Symbol', 'Prayer Book/Wheel', 'Incense', 'Vestments', 'Clothing',
        '15 GP'
      ];
      features = ['Shelter Of The Faithful'];
      languages = ['', ''];
      notes = [
        'featureNotes.shelterOfTheFaithfulFeature:Aid from associated temple'
      ];
      proficiencyCount = {'Skill':2};
      proficienciesGiven = {'Skill':['Insight', 'Religion']};
    } else if(name == 'Charlatan') {
      equipment = [
        'Fine Clothes', 'Disguise Kit', 'Con Tools', '15 GP'
      ];
      features = ['False Identity'];
      notes = [
        'featureNotes.falseIdentityFeature:Documented 2nd ID, forgery skills'
      ];
      proficiencyCount = {'Skill':2, 'Tool':2};
      proficienciesGiven = {
        'Skill':['Deception', 'Sleight Of Hand'],
        'Tool':['Diguise Kit', 'Forgery Kit']
      };
    } else if(name == 'Criminal') {
      equipment = ['Crowbar', 'Dark Clothes w/Hood', '15 GP'];
      features = ['Criminal Contact'];
      notes = [
        'featureNotes.criminalContactFeature:Liaison to criminal network'
      ];
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
      features = ['By Popular Demand'];
      notes = [
        'featureNotes.byPopularDemandFeature:Welcome, lodging for performing'
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
      features = ['Rustic Hospitality'];
      notes = [
        'featureNotes.rusticHospitalityFeature:Aid from common folk'
      ]
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
      features = ['Guild Membership'];
      notes = [
        'featureNotes.guildMembershipFeature:Aid from guild and members'
      ];
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
      features = ['Discovery'];
      languages = [''];
      notes = [
        'featureNotes.discoveryFeature:Knows rare truth'
      ];
      proficiencyCount = {'Skill':2, 'Tool':1};
      proficienciesGiven = {
        'Skill':['Medicine', 'Religion'],
        'Tool':['Herbalism Kit']
      };
    } else if(name == 'Noble') {
      equipment = [
        'Fine Clothes', 'Signet Ring', 'Pedigree Scroll', '25 GP'
      ];
      features = ['Position Of Priviledge'];
      languages = [''];
      notes = [
        'featureNotes.positionOfPriviledgeFeature:Treated with respect/deference'
      ];
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
      features = ['Wanderer'];
      languages = [''];
      notes = [
        'featureNotes.wandererFeature:Excellent geography memory, can forage for 6 people'
      ];
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
      features = ['Researcher'];
      languages = ['', ''];
      notes = [
        'featureNotes.researcherFeature:Know where to find lore'
      ];
      proficiencyCount = {'Skill':2};
      proficienciesGiven = {
        'Skill':['Arcana', 'History']
      };
    } else if(name == 'Sailor') {
      equipment = [
        'Belaying Pin', "50' Silk Rope", 'Lucky Charm', 'Clothes', '10 GP'
      ];
      features == ["Ship's Passage"];
      notes = [
        "featureNotes.ship'sPassageFeature:Free passage for self/companions"
      ];
      proficiencyCount = {'Skill':2, 'Tool':2};
      proficienciesGiven = {
        'Skill':['Athletics', 'Perception'],
        'Tool':["Navigator's Tools", 'Vehicles (Water)']
      };
    } else if(name == 'Soldier') {
      equipment = [
        'Rank Insignia', 'Battle Trophy', 'Gambling Objects', 'Clothes', '10 GP'
      ];
      features = ['Military Rank'];
      notes = [
        'featureNotes.militaryRankFeature:Respect/deference from soldiers'
      ];
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
      features = ['City Secrets'];
      notes = [
        'featureNotes.citySecretsFeature:Double speed through hidden urban ways'
      ];
      proficiencyCount = {'Skill':2, 'Tool':2};
      proficienciesGiven = {
        'Skill':['Sleight Of Hand', 'Stealth'],
        'Tool':['Diguise Kit', "Thieves' Tools"]
      };
    } else
      continue;

    SRD5E.defineBackground(
      rules, name, features, languages, proficiencyCount, proficienciesGiven,
      proficiencyChoices, notes
    );

  }

};

/* Defines the rules related to character classes. */
SRD5E.classRules = function(rules, classes) {

  rules.defineNote
    ('validationNotes.levelAllocation:%1 available vs. %2 allocated');
  rules.defineRule('validationNotes.levelAllocation.1',
    '', '=', '0',
    'level', '=', null
  );
  rules.defineRule('validationNotes.levelAllocation.2',
    '', '=', '0',
    /^levels\./, '+=', null
  );
  rules.defineRule('validationNotes.levelAllocation',
    'validationNotes.levelAllocation.1', '=', '-source',
    'validationNotes.levelAllocation.2', '+=', null
  );
  rules.defineNote
    ('validationNotes.selectableFeatureAllocation: %1 available vs. %2 allocated');
  rules.defineRule('validationNotes.selectableFeatureAllocation.1',
    '', '=', '0',
    /^selectableFeatureCount\./, '+=', null
  );
  rules.defineRule('validationNotes.selectableFeatureAllocation.2',
    '', '=', '0',
    /^selectableFeatures\./, '+=', null
  );
  rules.defineRule('validationNotes.selectableFeatureAllocation',
    'validationNotes.selectableFeatureAllocation.1', '=', '-source',
    'validationNotes.selectableFeatureAllocation.2', '+=', null
  );

  rules.defineRule('attacksPerRound', '', '=', '1');
  rules.defineRule
    ('proficiencyBonus', 'level', '=', '2 + Math.floor((source-1) / 4)');

  for(var i = 0; i < classes.length; i++) {

    var features, hitDie, notes, proficiencyCount, proficiencyChoices,
        proficienciesGiven, selectableFeatures, spellAbility, spellsKnown,
        spellSlots;
    var name = classes[i];

    if(name == 'Barbarian') {

      features = [
        '1:Armor Proficiency (Light/Medium/Shield)',
        '1:Weapon Proficiency (Simple/Martial)', '1:Rage',
        '1:Barbarian Unarmored Defense', '2:Danger Sense', '2:Reckless Attack',
        '3:Frenzy', '3:Primal Path', '4:Ability Score Improvement',
        '5:Extra Attack', '5:Fast Movement', '6:Mindless Rage',
        '7:Feral Instinct', '9:Brutal Critical', '10:Intimidating Presence',
        '11:Relentless Rage', '14:Retaliation',
        '15:Persistent Rage', '18:Indominable Might', '20:Primal Champion',
        // Path Of The Berserker
        '3:Frenzy', '6:Mindless Rage', '10:Intimidating Presence',
        '14:Retaliation'
      ];
// PHB
      features = features.concat([
        // Path Of The Totem Warrior
        '3:Spirit Seeker', '3:Bear Totem Spirit', '3:Eagle Totem Spirit',
        '3:Wolf Totem Spirit', '6:Aspect Of The Bear', '6:Aspect Of The Eagle',
        '6:Aspect Of The Wolf', '10:Spirit Walker',
        '14:Bear Totemic Attunement', '14:Eagle Totemic Attunement',
        '14:Wolf Totemic Attunement'
      ]);
//ENDPHB
      hitDie = 12;
      notes = [
        'abilityNotes.abilityScoreImprovementFeature:+%V distributed',
        'abilityNotes.fastMovementFeature:+10 speed in no/light/medium armor',
        'abilityNotes.indomitableMightFeature:Use strength instead of roll for Str check',
        'abilityNotes.primalChampionFeature:+4 strength/+4 constitution',
        'abilityNotes.rageFeature:Adv Str checks',
        'combatNotes.brutalCriticalFeature:+%V critical damage dice',
        'combatNotes.extraAttackFeature:+1 attack per Attack action',
        'combatNotes.feralInstinctFeature:' +
          'Adv initiative, act when surprised if rage',
        'combatNotes.frenzyFeature:Bonus attack during rage',
        'combatNotes.persistentRageFeature:' +
          'Rage ends only when unconscious or chosen',
        'combatNotes.rageFeature:' +
          '+%V melee damage, resist bludgeon/pierce/slash damage for 1 min %1/long rest',
        'combatNotes.recklessAttackFeature:' +
          'Adv melee Str attacks, foes Adv all attacks',
        'combatNotes.retaliationFeature:' +
          'Melee attack reaction after taking damage',
        'combatNotes.relentlessRageFeature:' +
          'DC 10+ Con to continue fighting w/1 HP when brought to 0 HP',
        'combatNotes.barbarianUnarmoredDefenseFeature:+%1 AC in no armor',
        'featureNotes.intimidatingPresenceFeature:' +
          'Target creature frightened (DC %V Will neg)',
        'saveNotes.dangerSenseFeature:Adv vs. visible dangers',
        'saveNotes.mindlessRageFeature:Immune charmed/frightened during rage'
      ];
// PHB
      notes = notes.concat([
        'abilityNotes.aspectOfTheBearFeature:Double load/lift, Adv Str checks',
        'abilityNotes.aspectOfTheEagleFeature:' +
          'See 1 mile clearly, no perception Disadv in dim light',
        'abilityNotes.aspectOfTheWolfFeature:' +
          'Track at fast pace, stealth at normal pace',
        'abilityNotes.eagleTotemicAttunement:Fly for short bursts when raging',
        'combatNotes.bearTotemSpiritFeature:Resist non-psychic damage',
        'combatNotes.bearTotemicAttunement:' +
          "When raging, foes w/in 5' Disadv attacking others",
        'combatNotes.eagleTotemSpiritFeature:' +
          'Foes Disadv opportunity attack, Dash as bonus action',
        'combatNotes.wolfTotemSpiritFeature:' +
          "Allies Adv attack vs. foes w/in 5' of self",
        'combatNotes.wolfTotemicAttunement:' +
          'Bonus knock large or smaller foe after successful attack',
        'magicNotes.spiritSeekerFeature:' +
          '<i>Beast Sense</i>, <i>Speak With Animals</i> via ritual',
        'magicNotes.spiritWalkerFeature:<i>Commune With Nature</i> via ritual',
        'validationNotes.barbarianBearTotemSelectableFeatureFeatures:' +
          'Requires Path Of The Totem Warrior',
        'validationNotes.barbarianEagleTotemSelectableFeatureFeatures:' +
          'Requires Path Of The Totem Warrior',
        'validationNotes.barbarianWolfTotemSelectableFeatureFeatures:' +
          'Requires Path Of The Totem Warrior'
      ]);
// ENDPHB
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
      selectableFeatures = SRD5E.BARBARIAN_PATHS.concat(SRD5E.BARBARIAN_TOTEMS);
      spellAbility = null;
      spellsKnown = null;
      spellSlots = null;

      rules.defineRule('barbarianFeatures.Frenzy',
        'barbarianFeatures.Path Of The Berserker', '?', null
      );
      rules.defineRule('barbarianFeatures.Mindless Rage',
        'barbarianFeatures.Path Of The Berserker', '?', null
      );
      rules.defineRule('barbarianFeatures.Intimidating Presence',
        'barbarianFeatures.Path Of The Berserker', '?', null
      );
      rules.defineRule('barbarianFeatures.Retaliation',
        'barbarianFeatures.Path Of The Berserker', '?', null
      );
// PHB
      rules.defineRule('barbarianFeatures.Aspect Of The Bear',
        'barbarianFeatures.Bear Totem', '?', null
      );
      rules.defineRule('barbarianFeatures.Aspect Of The Eagle',
        'barbarianFeatures.Eagle Totem', '?', null
      );
      rules.defineRule('barbarianFeatures.Aspect Of The Wolf',
        'barbarianFeatures.Wolf Totem', '?', null
      );
      rules.defineRule('barbarianFeatures.Bear Totem Spirit',
        'barbarianFeatures.Bear Totem', '?', null
      );
      rules.defineRule('barbarianFeatures.Bear Totemic Attunement',
        'barbarianFeatures.Bear Totem', '?', null
      );
      rules.defineRule('barbarianFeatures.Eagle Totem Spirit',
        'barbarianFeatures.Eagle Totem', '?', null
      );
      rules.defineRule('barbarianFeatures.Eagle Totemic Attunement',
        'barbarianFeatures.Eagle Totem', '?', null
      );
      rules.defineRule('barbarianFeatures.Wolf Totem Spirit',
        'barbarianFeatures.Wolf Totem', '?', null
      );
      rules.defineRule('barbarianFeatures.Spirit Seeker',
        'barbarianFeatures.Path Of The Totem Warrior', '?', null
      );
      rules.defineRule('barbarianFeatures.Spirit Walker',
        'barbarianFeatures.Path Of The Totem Warrior', '?', null
      );
      rules.defineRule('barbarianFeatures.Wolf Totemic Attunement',
        'barbarianFeatures.Wolf Totem', '?', null
      );
// ENDPHB

      rules.defineRule('abilityNotes.abilityScoreImprovementFeature',
        'levels.Barbarian', '+=', 'source >= 19 ? 5 : Math.floor(source / 4)'
      );
      rules.defineRule('combatNotes.brutalCriticalFeature',
        'levels.Barbarian', '=',
          'source < 9 ? null : source < 13 ? 1 : source < 17 ? 2 : 3'
      );
      rules.defineRule('combatNotes.rageFeature',
        'levels.Barbarian', '+=', 'Math.floor(source / 8) + 2'
      );
      rules.defineRule('combatNotes.rageFeature.1',
        'levels.Barbarian', '+=', 'source < 3 ? 2 : source < 6 ? 3 : source < 12 ? 4 : source < 17 ? 5 : source < 20 ? 6 : "unlimited"'
      );
      // Inelegant hacks to show barbarianUnarmoredDefense note properly even
      // when armor != "None" or constitutionModifier == 0
      rules.defineRule('combatNotes.barbarianUnarmoredDefenseFeature.1',
        'combatNotes.unarmoredDefense', '?', null,
        'constitutionModifier', '=', null
      );
      rules.defineRule('combatNotes.barbarianUnarmoredDefenseFeature.2',
        'combatNotes.unarmoredDefense', '?', null,
        'armor', '?', 'source == "None"',
        'combatNotes.barbarianUnarmoredDefenseFeature.1', '=', null
      );
      rules.defineRule('armorClass',
        'combatNotes.barbarianUnarmoredDefenseFeature.2', '+', null
      );
      rules.defineRule('featureNotes.intimidatingPresenceFeature',
        'charismaModifier', '=', 'source + 8',
        'proficiencyBonus', '+', null
      );
      rules.defineRule
        ('attacksPerRound', 'combatNotes.extraAttackFeature', '+', '1');
      rules.defineRule('selectableFeatureCount.Barbarian',
        'barbarianFeatures.Primal Path', '=', '1',
        'barbarianFeatures.Path Of The Totem Warrior', '+', '1'
      );
      rules.defineRule('speed', 'abilityNotes.fastMovementFeature', '+', '10');

    } else if(name == 'Bard') {

      features = [
        '1:Armor Proficiency (Light)',
        '1:Weapon Proficiency (Simple/Hand Crossbow/Longsword/Rapier/Shortsword)',
        '1:Tool Proficiency (3 Musical Instruments)', '1:Bardic Inspiration',
        '1:Spellcasting', '2:Jack Of All Trades', '2:Song Of Rest',
        '3:Bard College', '3:Cutting Words', '3:Expertise', '3:Extra Skills',
        '4:Ability Score Improvement', '5:Font Of Inspiration',
        '6:Countercharm', '6:Additional Magical Secrets', '10:Magical Secrets',
        '14:Peerless Skill', '20:Superior Inspiration'
      ];
// PHB
      features = features.concat([
        '3:Combat Inspiration', '6:Extra Attack', '14:Battle Magic'
      ]);
// ENDPHB
      hitDie = 8;
      notes = [
        'abilityNotes.abilityScoreImprovementFeature:+%V distributed',
        'abilityNotes.jackOfAllTradesFeature:+%V ability checks',
        'abilityNotes.peerlessSkillFeature:' +
          'Add Bardic Inspiration to ability check',
        'featureNotes.bardicInspirationFeature:Grant 1d%V %1/long rest',
        'featureNotes.cuttingWordsFeature:' +
          "R60' Subtract Bardic Inspiration from foe roll",
        'featureNotes.expertiseFeature:Double bonus for %V proficiencies',
        'featureNotes.fontOfInspirationFeature:' +
          'Refresh Bardic Inspiration after rest',
        'featureNotes.songOfRestFeature:' +
          'Listeners regain 1d%V HP after short rest',
        'featureNotes.superiorInspirationFeature:' +
          'When all Bardic Inspiration used, regain 1 on initiative',
        'magicNotes.additionalMagicalSecretsFeature:' +
          'Know 2 additional spells from any class',
        'magicNotes.countercharmFeature:' +
          "R30' Friendly listeners Adv vs. charmed/frightened",
        'magicNotes.magicalSecretsFeature:' +
          'Know %V additional spells from any class',
        'skillNotes.extraSkillsFeature:Prof in three additional skills'
      ];
// PHB
      notes = notes.concat([
        'combatNotes.battleMagicFeature:Bonus attack after casting Bard spell',
        'combatNotes.extraAttackFeature:+1 attack per Attack action',
        'featureNotes.combatInspirationFeature:' +
          'Ally use inspiration die to boost damage/AC'
      ]);
// ENDPHB
      proficiencyCount =
        {'Save':2, 'Skill':3, 'Tool':3, 'Armor':1, 'Weapon':5};
      proficienciesGiven = {
        'Save':['Charisma', 'Dexterity'],
        'Armor':['Light'],
        'Weapon':['Simple','Hand Crossbow','Longsword','Rapier','Shortsword']
      };
      proficiencyChoices = {
        'Skill': SRD5E.SKILLS.map(function(skill){return skill.substring(0, skill.indexOf(':'));}),
        'Tool':['Music']
      };
      selectableFeatures = SRD5E.BARD_COLLEGES;
      spellAbility = 'charisma';
      spellsKnown = [
        'B0:1:2/4:3/10:4',
        'B:1:4/2:5/3:6/4:7/5:8/6:9/7:10/8:11/9:12/10:14/11:15/13:16/14:18/15:19/17:20/18:22'
      ];
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

      rules.defineRule('bardFeatures.Additional Magical Secrets',
        'bardFeatures.College Of Lore', '?', null
      );
      rules.defineRule('bardFeatures.Cutting Words',
        'bardFeatures.College Of Lore', '?', null
      );
      rules.defineRule('bardFeatures.Extra Skills',
        'bardFeatures.College Of Lore', '?', null
      );
      rules.defineRule('bardFeatures.Peerless Skill',
        'bardFeatures.College Of Lore', '?', null
      );

// PHB
      rules.defineRule('bardFeatures.Battle Magic',
        'bardFeatures.College Of Valor', '?', null
      );
      rules.defineRule('bardFeatures.Combat Inspiration',
        'bardFeatures.College Of Valor', '?', null
      );
      rules.defineRule('bardFeatures.Extra Attack',
        'bardFeatures.College Of Valor', '?', null
      );
// ENDPHB

      rules.defineRule('abilityNotes.abilityScoreImprovementFeature',
        'levels.Bard', '+=', 'source >= 19 ? 5 : Math.floor(source / 4)'
      );
      rules.defineRule('abilityNotes.jackOfAllTradesFeature',
        'proficiencyBonus', '=', 'Math.floor(source / 2)'
      );
      rules.defineRule
        ('attacksPerRound', 'combatNotes.extraAttackFeature', '+', '1');
      rules.defineRule('casterLevelArcane', 'levels.Bard', '+=', null);
      rules.defineRule('featureNotes.bardicInspirationFeature',
        'levels.Bard', '=', '6 + Math.floor(source / 5) * 2'
      );
      rules.defineRule('featureNotes.bardicInspirationFeature.1',
        'charismaModifier', '=', 'source <= 0 ? 1 : source'
      );
      rules.defineRule('featureNotes.expertiseFeature',
        'levels.Bard', '=', 'source < 3 ? null : source < 10 ? 2 : 4'
      );
      rules.defineRule('featureNotes.songOfRestFeature',
        'levels.Bard', '=',
           'source<2 ? null : 6 + 2 * source<9 ? 0 : Math.floor((source-5)/4)'
      );
      rules.defineRule('magicNotes.magicalSecretsFeature',
        'levels.Bard', '=', 'source<10 ? null : 2 * Math.floor((source-6)/4)'
      );
      rules.defineRule
        ('proficiencyCount.Skill', 'skillNotes.extraSkillsFeature', '+', '3');
      rules.defineRule
        ('selectableFeatureCount.Bard', 'bardFeatures.Bard College', '=', '1');

    } else if(name == 'Cleric') {

      features = [
        '1:Armor Proficiency (Light/Medium/Shield)',
        '1:Weapon Proficiency (Simple)', '1:Divine Domain', '1:Spellcasting',
        '2:Channel Divinity', '2:Turn Undead', '4:Ability Score Improvement',
        '5:Destroy Undead', '10:Divine Intervention'
      ];
      hitDie = 8;
      notes = [
        'abilityNotes.abilityScoreImprovementFeature:+%V distributed',
        'combatNotes.destroyUndeadFeature:Turn destroys up to CR %V',
        'combatNotes.turnUndeadFeature:' +
          "R30' Undead flee for 1 min (%V DC Wis neg)",
        'featureNotes.channelDivinityFeature:' +
          'Turn undead, domain effect %V/short rest',
        'magicNotes.divineDomainFeature:Gain chosen domain benefits',
        'magicNotes.divineInterventionFeature:%V% chance of deity help 1/wk'
      ];
      proficiencyCount = {'Save':2, 'Skill':2, 'Armor':3, 'Weapon':1};
      proficienciesGiven = {
        'Save':['Charisma', 'Wisdom'],
        'Armor':['Light', 'Medium', 'Shield'],
        'Weapon':['Simple']
      };
      proficiencyChoices = {
        'Skill':['History', 'Insight', 'Medicine', 'Persuasion', 'Religion']
      };
      selectableFeatures = SRD5E.CLERIC_DOMAINS;
      spellAbility = 'wisdom';
      spellsKnown = [
        'C0:1:3/4:4/10:5',
        'C1:1:"all"', 'C2:3:"all"', 'C3:5:"all"', 'C4:7:"all"',
        'C5:9:"all"', 'C6:11:"all"', 'C7:13:"all"', 'C8:15:"all"',
        'C9:17:"all"',
        'Dom1:1:"all"', 'Dom2:3:"all"', 'Dom3:5:"all"', 'Dom4:7:"all"',
        'Dom5:9:"all"', 'Dom6:11:"all"', 'Dom7:13:"all"', 'Dom8:15:"all"',
        'Dom9:17:"all"'
      ];
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

      rules.defineRule('abilityNotes.abilityScoreImprovementFeature',
        'levels.Cleric', '+=', 'source >= 19 ? 5 : Math.floor(source / 4)'
      );
      rules.defineRule('casterLevelDivine', 'levels.Cleric', '+=', null);
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
      rules.defineRule
        ('magicNotes.divineInterventionFeature', 'level.Cleric', '=', null);
      rules.defineRule('selectableFeatureCount.Cleric',
        'clericFeatures.Divine Domain', '=', '1'
      );

    } else if(name == 'Druid') {

      features = [
        '1:Armor Proficiency (Light/Medium/Shield)',
        '1:Weapon Proficiency (Club/Dagger/Dart/Javelin/Mace/Quarterstaff/Scimitar/Sickle/Sling/Spear)',
        '1:Tool Proficiency (Herbalism Kit)', '1:Druidic', '1:Spellcasting',
        '2:Druid Circle', '2:Wild Shape', '4:Ability Score Improvement',
        '18:Druid Timeless Body', '18:Beast Spells', '20:Archdruid',
        // Circle Of The Land
        '2:Bonus Cantrip', '2:Natural Recovery', '3:Circle Spells',
        "6:Land's Stride", "10:Nature's Ward", "14:Nature's Sanctuary"
      ];
// PHB
      features = features.concat([
        // Circle Of The Moon
        '2:Combat Wild Shape', '2:Circle Forms', '6:Primal Strike',
        '10:Elemental Wild Shape', '14:Thousand Forms'
      ]);
// ENDPHB
      hitDie = 8;
      notes = [
        'abilityNotes.abilityScoreImprovementFeature:+%V distributed',
        "abilityNotes.land'sStrideFeature:" +
          'Normal move through difficult terrain',
        "combatNotes.nature'sSanctuaryFeature:" +
          'Beast, plant DC %V Will save to attack',
        'featureNotes.druidTimelessBodyFeature:Age at 1/10 rate',
        'magicNotes.archdruidFeature:Unlimited Wild Shape',
        'magicNotes.beastSpellsFeature:Cast spells during Wild Shape',
        'magicNotes.circleSpellsFeature:%1 1/long rest',
        'magicNotes.naturalRecoveryFeature:' +
          'Recover %V spell slots during short rest',
        'magicNotes.wildShapeFeature:' +
          'Transform into CR %1%2 creature for %3 hr 2/short rest',
        "saveNotes.land'sStrideFeature:Adv vs. impeding plants",
        "saveNotes.nature'sWardFeature:" +
          'Immune disease, poison, elemental or fey charm and frighten',
        'validationNotes.druidArcticLandSelectableFeatureFeatures:' +
          'Requires Circle Of The Land',
        'validationNotes.druidCoastLandSelectableFeatureFeatures:' +
          'Requires Circle Of The Land',
        'validationNotes.druidDesertLandSelectableFeatureFeatures:' +
          'Requires Circle Of The Land',
        'validationNotes.druidForestLandSelectableFeatureFeatures:' +
          'Requires Circle Of The Land',
        'validationNotes.druidGrasslandLandSelectableFeatureFeatures:' +
          'Requires Circle Of The Land',
        'validationNotes.druidMountainLandSelectableFeatureFeatures:' +
          'Requires Circle Of The Land',
        'validationNotes.druidSwampLandSelectableFeatureFeatures:' +
          'Requires Circle Of The Land',
      ];
//PHB
      notes = notes.concat([
        'combatNotes.combatWildShapeFeature:' +
          'Wild Shape as bonus action, use spell slot to regain 1d8 * slot level HP',
        'combatNotes.primalStrikeFeature:Wild Shape attacks count as magical',
        'magicNotes.circleFormsFeature:Increase Wild Shape CR to %V',
        'magicNotes.elementalWildShapeFeature:' +
          'Use two Wild Shape uses to become elemental',
        'magicNotes.thousandFacesFeature:<i>Alter Self<i> at will',
        'validationNotes.druidUnderdarkLandSelectableFeatureFeatures:' +
          'Requires Circle Of The Land',
      ]);
//ENDPHB
      proficiencyCount =
       {'Save':2, 'Skill':2, 'Tool':1, 'Armor':3, 'Weapon':10};
      proficienciesGiven = {
        'Save':['Intelligence', 'Wisdom'],
        'Armor':['Light', 'Medium', 'Shield'],
        'Tool':['Herbalism Kit'],
        'Weapon':['Club', 'Dagger', 'Dart', 'Javelin', 'Mace', 'Quarterstaff',
                  'Scimitar', 'Sickle', 'Sling', 'Spear']
      };
      proficiencyChoices = {
        'Skill':['Arcana', 'Animal Handling', 'Insight', 'Medicine', 'Nature',
                 'Perception', 'Religion', 'Survival']
      };
      selectableFeatures = SRD5E.DRUID_CIRCLES.concat(SRD5E.DRUID_LANDS);
      spellAbility = 'wisdom';
      spellsKnown = [
        'D0:1:2/4:3/10:4',
        'D1:1:"all"', 'D2:3:"all"', 'D3:5:"all"', 'D4:7:"all"', 'D5:9:"all"',
        'D6:11:"all"', 'D7:13:"all"', 'D8:15:"all"', 'D9:17:"all"'
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

      rules.defineRule('druidFeatures.Bonus Cantrip',
        'druidFeatures.Circle Of The Land', '?', null
      );
      rules.defineRule('druidFeatures.Circle Spells',
        'druidFeatures.Circle Of The Land', '?', null
      );
      rules.defineRule("druidFeatures.Land's Stride",
        'druidFeatures.Circle Of The Land', '?', null
      );
      rules.defineRule("druidFeatures.Nature's Ward",
        'druidFeatures.Circle Of The Land', '?', null
      );
      rules.defineRule("druidFeatures.Nature's Sanctuary",
        'druidFeatures.Circle Of The Land', '?', null
      );
// PHB
      rules.defineRule('druidFeatures.Combat Wild Shape',
        'druidFeatures.Circle Of The Moon', '?', null
      );
      rules.defineRule('druidFeatures.Circle Forms',
        'druidFeatures.Circle Of The Moon', '?', null
      );
      rules.defineRule('druidFeatures.Primal Strike',
        'druidFeatures.Circle Of The Moon', '?', null
      );
      rules.defineRule('druidFeatures.Elemental Wild Shape',
        'druidFeatures.Circle Of The Moon', '?', null
      );
      rules.defineRule('druidFeatures.Thousand Forms',
        'druidFeatures.Circle Of The Moon', '?', null
      );
// ENDPHB

      rules.defineRule('abilityNotes.abilityScoreImprovementFeature',
        'levels.Druid', '+=', 'source >= 19 ? 5 : Math.floor(source / 4)'
      );
      rules.defineRule("combatNotes.nature'sSanctuaryFeature",
        'wisdomModifier', '=', 'source + 8',
        'proficiencyBonus', '+', null
      );
      rules.defineRule('languageCount', 'features.Druidic', '+', '1');
      rules.defineRule('languages.Druidic', 'features.Druidic', '=', '1');
      rules.defineRule('magicNotes.circleFormsFeature',
        'levels.Druid', '=', 'source < 6 ? 1 : Math.floor(source / 3)'
      );
      rules.defineRule('magicNotes.naturalRecoveryFeature',
        'levels.Druid', '=', 'Math.floor(source / 2)'
      );
      rules.defineRule('magicNotes.wildShapeFeature.1',
        'levels.Druid', '=', 'source < 4 ? "1/4" : source < 8 ? "1/2" : "1"',
        'magicNotes.circleFormsFeature', '=', null
      );
      rules.defineRule('magicNotes.wildShapeFeature.2',
        'levels.Druid', '=', 'source < 4 ? "(land only)" : source < 8 ? "(non-flying)" : ""'
      );
      rules.defineRule('magicNotes.wildShapeFeature.3',
        'levels.Druid', '=', 'Math.floor(source /2)'
      );
      rules.defineRule('selectableFeatureCount.Druid',
        'druidFeatures.Druid Circle', '=', '1',
        'druidFeatures.Circle Of The Land', '+', '1'
      );
      rules.defineRule('magicNotes.circleSpellsFeature.1',
        'features.Circle Spells', '?', 'SRD5E.landsCircleSpells.current = []'
      );
      for(var land in SRD5E.landsCircleSpells) {
        rules.defineRule('magicNotes.circleSpellsFeature.1',
          'druidFeatures.' + land, '=', 'SRD5E.landsCircleSpells.current = SRD5E.landsCircleSpells["' + land + '"]'
        );
      }
      rules.defineRule('magicNotes.circleSpellsFeature.1',
        'levels.Druid', '=', 'SRD5E.landsCircleSpells.current.filter(item => item.split(":")[0] <= source).map(function(spell){return "<i>" + spell.split(":")[1] + "</i>";}).join(", ")'
        );

    } else if(name == 'Fighter') {

      features = [
        '1:Armor Proficiency (Light/Medium/Heavy/Shield)',
        '1:Weapon Proficiency (Simple/Martial)',
        '1:Fighting Style', '1:Second Wind', '2:Action Surge',
        '3:Martial Archetype', '4:Ability Score Improvement', '5:Extra Attack',
        '9:Indomitable',
        // Champion Archetype
        '3:Improved Critical', '7:Remarkable Athlete',
        '10:Additional Fighting Style', '15:Superior Critical', '18:Survivor'
      ];
// PHB
      features = features.concat([
        // Battle Master Archetype
        '3:Maneuvers', '3:Student Of War', '3:Superiority Dice',
        '7:Know Your Enemy', '15:Relentless',
        // Eldritch Knight Archetype
        '3:Spellcasting', '3:Weapon Bond', '7:War Magic', '10:Eldritch Strike',
        '15:Arcane Charge'
      ]);
// ENDPHB
      hitDie = 10;
      notes = [
        'abilityNotes.abilityScoreImprovementFeature:+%V distributed',
        'abilityNotes.remarkableAthleteFeature:' +
          '+%V non-proficient Str/Dex/Con checks',
        'combatNotes.actionSurgeFeature:Extra action %V/short rest',
        'combatNotes.archeryStyleFeature:+2 ranged attack',
        'combatNotes.defenseStyleFeature:+1 AC in armor',
        'combatNotes.duelingStyleFeature:+2 HP with single, one-hand weapon',
        'combatNotes.extraAttackFeature:+1 attack per Attack action',
        'combatNotes.greatWeaponFightingStyleFeature:' +
          'Reroll damage of 1 or 2 with two-handed weapons',
        'combatNotes.improvedCriticalFeature:Crit on natural 19',
        'combatNotes.protectionStyleFeature:' +
          "Use shield to impose attack DisAdv on foe w/in 5'",
        'combatNotes.secondWindFeature:Regain 1d10+%V HP 1/short rest',
        'combatNotes.superiorCriticalFeature:Crit on natural 18',
        'combatNotes.survivorFeature:' +
          'Regain %V HP each turn when between 1 and %1',
        'combatNotes.two-weaponFightingStyleFeature:' +
          'Add ability modifier to second attack damage',
        'saveNotes.indomitableFeature:Reroll failed save %V/long rest'
      ];
// PHB
      notes = notes.concat([
        "combatNotes.commander'sStrikeFeatue:" +
          'Delegate one attack to companion, add superiority die to attack',
        'combatNotes.disarmingAttackFeature:' +
          'Add superiority die to damage, foe drops item (DC %V Str neg)',
        'combatNotes.distractingAttackFeature:' +
          'Add superiority die to damage, companion has Adv on attack same foe',
        'combatNotes.eldritchStrikeFeature:' +
          'Foe DisAdv vs. spells for 1 turn after you hit',
        'combatNotes.evasiveFootworkFeature:' +
          'Add superiority die to AC during move',
        'combatNotes.feigntingAttackFeature:' +
          'Adv next attack, add superiority die to damage',
        'combatNotes.goadingAttackFeature:' +
          'Add superiority die to damage, foe DisAdv attack others (DC %V Wis neg)',
        'combatNotes.knowYourEnemyFeature:' +
          'Know how foe compares to you after 1 min study',
        'combatNotes.lungingAttackFeature:' +
          "+5' melee range, add superiority die to damage",
        'combatNotes.maneuveringAttackFeature:' +
          'Add superiority die to damage, companion move half speed w/out AOO',
        'combatNotes.parryFeature:' +
          'Reduce damage from foe hit by superiority die + %V',
        'combatNotes.precisionAttackFeature:Add superiority die to atteck',
        'combatNotes.pushingFeature:' +
          "Add superiority die to damage, foe moves away 15' (DC %V Str neg)",
        'combatNotes.rallyFeature:' +
          'Chosen companion gains superiority die + %V temp HP',
        'combatNotes.relentlessFeature:' +
          'Regain 1 superiority die on init if all used',
        'combatNotes.riposteFeature:' +
          'Attack after foe miss, add superiority die to damage',
        'combatNotes.superiorityDiceFeature:%Vd%1',
        'combatNotes.sweepingAttackFeature:' +
          'Do Superiority die damage to second foe w/in reach',
        'combatNotes.tripAttackFeature:' +
          'Add superiority die to damage, foe knocked prone (DC %V Str neg)',
        'combatNotes.warMagicFeature:Bonus attack after %V',
        'combatNotes.weaponBondFeature:' +
          'Cannot be disarmed, can summon bonded weapon',
        "magicNotes.arcaneChargeFeature:Action Surge to Teleport 30'",
        "skillNotes.studentOfWarFeature:Artisan's Tool prof"
      ]);
// ENDPHB
      proficiencyCount = {'Save':2, 'Skill':2, 'Armor':4, 'Weapon':2};
      proficienciesGiven = {
        'Save':['Constitution', 'Strength'],
        'Armor':['Light', 'Medium', 'Heavy', 'Shield'],
        'Weapon':['Simple', 'Martial']
      };
      proficiencyChoices = {
        'Skill': ['Acrobatics', 'Animal Handling', 'Athletics', 'History',
                  'Insight', 'Intimidation', 'Perception', 'Survival']
      };
      selectableFeatures = SRD5E.FIGHTER_FIGHTING_STYLES.concat(SRD5E.FIGHTER_MARTIAL_ARCHETYPES);
// PHB
      selectableFeatures = selectableFeatures.concat(SRD5E.FIGHTER_MANEUVERS);
// ENDPHB
      spellAbility = null;
      spellsKnown = null;
      spellSlots = null;

      rules.defineRule('fighterFeatures.Improved Critical',
        'fighterFeatures.Champion Archetype', '?', null
      );
      rules.defineRule('fighterFeatures.Remarkable Athlete',
        'fighterFeatures.Champion Archetype', '?', null
      );
      rules.defineRule('fighterFeatures.Additional Fighting Style',
        'fighterFeatures.Champion Archetype', '?', null
      );
      rules.defineRule('fighterFeatures.Superior Critical',
        'fighterFeatures.Champion Archetype', '?', null
      );
      rules.defineRule('fighterFeatures.Survivor',
        'fighterFeatures.Champion Archetype', '?', null
      );
// PHB
      rules.defineRule('fighterFeatures.Maneuvers',
        'fighterFeatures.Battle Master Archetype', '?', null
      );
      rules.defineRule('fighterFeatures.Know Your Enemy',
        'fighterFeatures.Battle Master Archetype', '?', null
      );
      rules.defineRule('fighterFeatures.Student Of War',
        'fighterFeatures.Battle Master Archetype', '?', null
      );
      rules.defineRule('fighterFeatures.Superiority Dice',
        'fighterFeatures.Battle Master Archetype', '?', null
      );
      rules.defineRule('fighterFeatures.Arcane Charge',
        'fighterFeatures.Eldritch Knight Archetype', '?', null
      );
      rules.defineRule('fighterFeatures.Eldritch Strike',
        'fighterFeatures.Eldritch Knight Archetype', '?', null
      );
      rules.defineRule('fighterFeatures.Spellcasting',
        'fighterFeatures.Eldritch Knight Archetype', '?', null
      );
      rules.defineRule('fighterFeatures.War Magic',
        'fighterFeatures.Eldritch Knight Archetype', '?', null
      );
// ENDPHB

      rules.defineRule('abilityNotes.abilityScoreImprovementFeature',
        'levels.Fighter', '+=', '[0,0,0,0,2,2,4,4,6,6,6,6,8,8,10,10,12,12,12,14,14][source]'
      );
      rules.defineRule('abilityNotes.remarkableAthleteFeature',
        'proficiencyBonus', '=', 'Math.ceil(source / 2)'
      );
      rules.defineRule
        ('attacksPerRound', 'combatNotes.extraAttackFeature', '+', '1');
      rules.defineRule('combatNotes.actionSurgeFeature',
        'levels.Fighter', '=', 'source < 17 ? 1 : 2'
      );
      // Inelegant hacks to show defenseStyle note properly even when armor
      // == "None"
      rules.defineRule('combatNotes.defenseStyleFeature.1',
        'fighterFeatures.Defense Style', '?', null,
        'armor', '=', 'source == "None" ? null : 1'
      );
      rules.defineRule('armorClass',
        'combatNotes.defenseStyleFeature.1', '+', null
      );
      rules.defineRule
        ('rangedAttack', 'combatNotes.archeryStyleFeature', '+', '2');
      rules.defineRule
        ('combatNotes.secondWindFeature', 'levels.Fighter', '=', null);
      rules.defineRule('saveNotes.indomitableFeature',
        'levels.Fighter', '=', 'source < 13 ? 1 : source < 17 ? 2 : 3'
      );
      rules.defineRule('selectableFeatureCount.Fighter',
        'fighterFeatures.Fighting Style', '=', '1',
        'fighterFeatures.Additional Fighting Style', '+', '1',
        'fighterFeatures.Martial Archetype', '+', '1'
      );
      rules.defineRule('combatNotes.survivorFeature',
        'constitutionModifier', '=', '5 + source'
      );
      rules.defineRule('combatNotes.survivorFeature.1',
        'hitPoints', '=', 'Math.floor(source / 2)'
      );
// PHB
      rules.defineRule('maxDexOrStrMod',
        'dexterityModifier', '=', null,
        'strengthModifier', '^', null
      );
      rules.defineRule('maneuverSaveDC',
        'fighterFeatures.Battle Master', '?', null,
        'proficiencyBonus', '=', '8 + source',
        'maxDexOrStrMod', '+', null
      );
      rules.defineRule
        ('combatNotes.disarmingAttackFeature', 'maneuverSaveDC', '=', null);
      rules.defineRule
        ('combatNotes.goadingAttackFeature', 'maneuverSaveDC', '=', null);
      rules.defineRule('combatNotes.maneuversFeature',
        'fighterFeatures.Battle Master', '?', null,
        'levels.Fighter', '=',
          'source<7 ? 3 : source<10 ? 5 : source<15 ? 7 : 9'
      );
      rules.defineRule
        ('combatNotes.parryFeature', 'dexterityModifier', '=', null);
      rules.defineRule('combatNotes.superiorityDiceFeature',
        'levels.Fighter', '=', 'source < 7 ? 4 : source < 15 ? 5 : 6'
      );
      rules.defineRule
        ('combatNotes.pushingAttackFeature', 'maneuverSaveDC', '=', null);
      rules.defineRule
        ('combatNotes.rallyFeature', 'charismaModifier', '=', null);
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

    } else if(name == 'Monk') {

      features = [
        '1:Weapon Proficiency (Simple/Shortsword)',
        "1:Tool Proficiency (Artisan's Tools or Musical Instrument)",
        '1:Monk Unarmored Defense', '1:Martial Arts', '1:Monk Bonus Attack',
        '2:Flurry Of Blows', '2:Ki', '2:Patient Defense', '2:Step Of The Wind',
        '2:Unarmored Movement', '3:Monastic Tradition', '3:Deflect Missiles',
        '4:Ability Score Improvement', '4:Slow Fall', '5:Extra Attack',
        '5:Stunning Strike', '6:Ki-Empowered Strikes', '7:Evasion',
        '7:Stillness Of Mind', '9:Improved Unarmored Movement',
        '10:Purity Of Body', '13:Tongue Of Sun And Moon', '14:Diamond Soul',
        '15:Timeless Body', '18:Empty Body', '20:Perfect Self',
        // Way Of The Open Hand Tradition
        '3:Open Hand Technique', '6:Wholeness Of Body', '11:Tranquility',
        '17:Quivering Palm'
      ];
// PHB
      features = features.concat([
        // Way Of The Four Elements Tradition
        '3:Disciple Of The Elements', '3:Elemental Attunement',
        // Way Of The Shadow Tradition
        '3:Shadow Arts', '6:Shadow Step', '11:Cloak Of Shadows',
        '17:Opportunist'
      ]);
// ENDPHB
      hitDie = 8;
      notes = [
        'abilityNotes.abilityScoreImprovementFeature:+%V distributed',
        'abilityNotes.improvedUnarmoredMovementFeature:' +
          'Move across vertical surfaces and liquids',
        'abilityNotes.slowFallFeature:React to reduce fall damage by %V',
        'abilityNotes.unarmoredMovementFeature:+%1 speed in no armor',
        'combatNotes.deflectMissilesFeature:' +
          'React to reduce missile damage by 1d10+%V',
        'combatNotes.extraAttackFeature:+1 attack per Attack action',
        'combatNotes.flurryOfBlowsFeature:Spend 1 Ki for 2 unarmed strikes',
        'combatNotes.ki-EmpoweredStrikesFeature:' +
          'Unarmed attacks count as magical',
        'combatNotes.martialArtsFeature:' +
          'In no armor, unarmed and monk weapons use higher of Dex or Str and increase damage to 1d%V',
        'combatNotes.patientDefenseFeature:' +
          'Spend 1 Ki to Dodge (foe attack DisAdv)',
        'combatNotes.monkBonusAttackFeature:' +
          'Unarmed strike after attack w/monk weapon',
        'combatNotes.monkUnarmoredDefenseFeature:+%1 AC in no armor',
        'combatNotes.openHandTechniqueFeature:' +
          "Choice of knock prone (DC %V Dex neg), push 15' (DC %V Str neg), or no foe react after Flurry Of Blows hit",
        'combatNotes.perfectSelfFeature:Regain 4 Ki die on init if all used',
        'combatNotes.quiveringPalmFeature:' +
          'Spend 3 Ki to use unarmed strike to reduce foe to 0 HP (DC %V Con 10d10 HP)',
        'combatNotes.stepOfTheWindFeature:' +
          'Spend 1 Ki to Disengage or Dash, double jump',
        'combatNotes.stunningStrikeFeature:' +
          'Spend 1 Ki to stun melee foe (DC %V Con neg)',
        'featureNotes.kiFeature:%V Ki points refresh after short rest',
        'featureNotes.monkTimelessBodyFeature:' +
          'No debility from aging, need no food or water',
        'featureNotes.tongueOfSunAndMoonFeature:Communicate in any language',
        'featureNotes.wholenessOfBodyFeature:Recover %V HP 1/long rest',
        'magicNotes.emptyBodyFeature:' +
          'Spend 4 Ki for <i>Invisibility</i> 1 min, 8 Ki for <i>Astral Projection</i>',
        'magicNotes.tranquilityFeature:' +
          'Self <i>Sanctuary</i> until next long rest (DC %V Wis neg)',
        'saveNotes.diamondSoulFeature:Prof all saves, spend 1 Ki to reroll',
        'saveNotes.evasionFeature:Dex save yields no damage instead of 1/2',
        'saveNotes.purityOfBodyFeature:Immune disease, poison',
        'saveNotes.stillnessOfMindFeature:End self charmed, frightened at will'
      ];
// PHB
      notes = notes.concat([
        'combatNotes.opportunistFeature:Attack nearby creature when it is hit',
        'magicNotes.cloakOfShadowsFeature:' +
          'Invisible in dim/unlit until attack or cast',
        'magicNotes.breathOfWinterFeature:' +
          'Spend 6 Ki to cast <i>Cone Of Cold</i>',
        'magicNotes.clenchOfTheNorthWindFeature:' +
          'Spend 3 Ki to cast <i>Hold Person</i>',
        'magicNotes.discipleOfTheElementsFeature:%V',
        'magicNotes.elementalAttunementFeature:Minor elemental manipulation',
        'magicNotes.eternalMountainDefenseFeature:' +
          'Spend 5 Ki to cast <i>Stoneskin</i>',
        'magicNotes.fistOfUnbrokenAirFeature:' +
          "R30' Spend 2 Ki to create air blast 3d10 HP, push 20' and knock prone (DC %V Str half)",
        'magicNotes.flamesOfThePhoenixFeature:' +
          'Spend 4 Ki to cast <i>Fireball</i>',
        'magicNotes.GongOfTheSummitFeature:' +
          'Spend 3 Ki to cast <i>Shatter</i>',
        'magicNotes.mistStanceFeature:' +
          'Spend 4 Ki to cast self <i>Gaseous Form</i>',
        'magicNotes.rideTheWindFeature:Spend 4 Ki to cast self <i>Fly</i>',
        'magicNotes.riverOfHungryFlameFeature:' +
          'Spend 5 Ki to cast <i>Wall Of Fire</i>',
        'magicNotes.rushOfTheGaleSpiritsFeature:' +
          'Spend 2 Ki to cast <i>Gust Of Wind</i>',
        'magicNotes.shapeTheFlowingRiverFeature:' +
          "R120' Freeze, thaw, shape 30'x30' water",
        'magicNotes.sweepingCinderStrikeFeature:' +
          'Spend 2 Ki to cast <i>Burning Hands</i>',
        'magicNotes.shadowArtsFeature:' +
          '<i>Minor Illusion</i> cantrip, spend 2 Ki to cast <i>Darkness</i>, '+
          '<i>Darkvision</i>, <i>Pass Without Trace</i>, <i>Silence</i>',
        "magicNotes.shadowStepFeature:Teleport 60' between dim/unlit areas",
        'magicNotes.waterWhipFeature:' +
          "R30' Spend 2 Ki to create water whip 3d10 HP, pull 25' or knock prone (DC %V Str half)",
        'magicNotes.waveOfRollingEarthFeature:' +
          'Spend 6 Ki to cast <i>Wall Of Stone</i>',
      ]);
// ENDPHB
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
      selectableFeatures = SRD5E.MONK_MONASTIC_TRADITIONS;
// PHB
      selectableFeatures =
        selectableFeatures.concat(SRD5E.MONK_ELEMENTAL_DISCIPLINES);
// ENDPHB
      spellAbility = null;
      spellsKnown = null;
      spellSlots = null;

      rules.defineRule('monkFeatures.Open Hand Technique',
        'monkFeatures.Way Of The Open Hand Tradition', '?', null
      );
      rules.defineRule('monkFeatures.Quivering Palm',
        'monkFeatures.Way Of The Open Hand Tradition', '?', null
      );
      rules.defineRule('monkFeatures.Tranquility',
        'monkFeatures.Way Of The Open Hand Tradition', '?', null
      );
      rules.defineRule('monkFeatures.Wholeness Of Body',
        'monkFeatures.Way Of The Open Hand Tradition', '?', null
      );
// PHB
      rules.defineRule('monkFeatures.Disciple Of The Elements',
        'monkFeatures.Way Of The Four Elements Tradition', '?', null
      );
      rules.defineRule('monkFeatures.Shadow Arts',
        'monkFeatures.Way Of The Shadow Tradition', '?', null
      );
      rules.defineRule('monkFeatures.Shadow Step',
        'monkFeatures.Way Of The Shadow Tradition', '?', null
      );
      rules.defineRule('monkFeatures.Cloak Of Shadows',
        'monkFeatures.Way Of The Shadow Tradition', '?', null
      );
      rules.defineRule('monkFeatures.Opportunist',
        'monkFeatures.Way Of The Shadow Tradition', '?', null
      );
// ENDPHB

      rules.defineRule('abilityNotes.abilityScoreImprovementFeature',
        'levels.Monk', '+=', 'source >= 19 ? 5 : Math.floor(source / 4)'
      );
      rules.defineRule('abilityNotes.improvedUnarmoredMovementFeature',
        'armor', '?', 'source == "None"',
        'shield', '?', 'source == "None"'
      );
      rules.defineRule
        ('abilityNotes.slowFallFeature', 'levels.Monk', '=', 'source * 5');
      // Inelegant hacks to show unarmoredMovement note properly even
      // when armor != "None"
      rules.defineRule('abilityNotes.unarmoredMovementFeature.1',
        'abilityNotes.unarmoredMovementFeature', '?', null,
        'levels.Monk', '=', 'Math.floor((source + 8) / 4) * 5'
      );
      rules.defineRule('abilityNotes.unarmoredMovementFeature.2',
        'abilityNotes.unarmoredMovementFeature', '?', null,
        'armor', '?', 'source == "None"',
        'shield', '?', 'source == "None"',
        'abilityNotes.unarmoredMovementFeature.1', '=', null
      );
      rules.defineRule('armorClass',
        'combatNotes.monkUnarmoredDefenseFeature.2', '+', null
      );
      rules.defineRule
        ('attacksPerRound', 'combatNotes.extraAttackFeature', '+', '1');
      rules.defineRule('combatNotes.deflectMissilesFeature',
        'levels.Monk', '=', null,
        'dexterityModifier', '+', null
      );
      rules.defineRule('combatNotes.martialArtsFeature',
        'levels.Monk', '=', 'Math.floor((source + 13)/ 6) * 2'
      );
      // Inelegant hacks to show monkUnarmoredDefense note properly even
      // when armor != "None".
      rules.defineRule('combatNotes.monkUnarmoredDefenseFeature.1',
        'combatNotes.monkUnarmoredDefenseFeature', '?', null,
        'dexterityModifier', '=', null,
        'wisdomModifier', '+', null
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
      rules.defineRule('featureNotes.kiFeature',
        'monkFeatures.Ki', '?', null,
        'levels.Monk', '=', 'Math.floor((source + 7) / 4)'
      );
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
        'monkFeatures.Monastic Tradition', '=', '1'
      );
      rules.defineRule
        ('speed', 'abilityNotes.unarmoredMovementFeature.2', '+', null);
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

    } else if(name == 'Paladin') {

      features = [
        '1:Armor Proficiency (Light/Medium/Heavy/Shield)',
        '1:Weapon Proficiency (Simple/Martial)',
        '1:Divine Sense', '1:Lay On Hands', '2:Fighting Style',
        '2:Divine Smite', '3:Divine Health', '3:Sacred Oath',
        '4:Ability Score Improvement', '5:Extra Attack', '6:Aura Of Protection',
        '10:Aura Of Courage', '14:Cleansing Touch'
      ];
      hitDie = 10;
      notes = [
        'abilityNotes.abilityScoreImprovementFeature:+%V distributed'
        // TODO
      ];
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
      selectableFeatures = null;
      spellAbility = 'wisdom';
      spellsKnown = [
        'P1:2:"all"', 'P2:5:"all"', 'P3:9:"all"', 'P4:13:"all"', 'P5:17:"all"'
      ];
      spellSlots = [
        'P1:2:2/3:3/5:4',
        'P2:5:2/7:3',
        'P3:9:2/11:3',
        'P4:13:1/15:2/17:3',
        'P5:17:1/19:2'
      ];

      rules.defineRule('abilityNotes.abilityScoreImprovementFeature',
        'levels.Paladin', '+=', 'source >= 19 ? 5 : Math.floor(source / 4)'
      );

    } else if(name == 'Ranger') {

      features = [
        '1:Armor Proficiency (Light/Medium/Shield)',
        '1:Weapon Proficiency (Simple/Martial)',
        '1:Favored Enemy', '1:Natural Explorer', '2:Fighting Style',
        '3:Ranger Archetype', '3:Primeval Awareness',
        '4:Ability Score Improvement', '5:Extra Attack', "8:Land's Stride",
        '10:Hide In Plain Sight', '14:Vanish', '18:Feral Senses',
        '20:Foe Slayer'
      ];
      hitDie = 10;
      notes = [
        'abilityNotes.abilityScoreImprovementFeature:+%V distributed'
        // TODO
      ];
      proficiencyCount = {'Save':2, 'Skill':3, 'Armor':3, 'Weapon':2};
      proficienciesGiven = {
        'Save':['Dexterity', 'Strength'],
        'Armor':['Light', 'Medium', 'Shield'],
        'Weapon':['Simple', 'Martial']
      };
      proficiencyChoices = {
        'Skill':['Animal Handling', 'Athletics', 'Insight', 'Investigation',
                 'Nature', 'Perception', 'Stealth', 'Survival']
      };
      selectableFeatures = null;
      spellAbility = 'wisdom';
      spellsKnown = [
        'R1:2:"all"', 'R2:5:"all"', 'R3:9:"all"', 'R4:13:"all"', 'R5:17:"all"'
      ];
      spellSlots = [
        'R1:2:2/3:3/5:4',
        'R2:5:2/7:3',
        'R3:9:2/11:3',
        'R4:13:1/15:2/17:3',
        'R5:17:1/19:2'
      ];

      rules.defineRule('abilityNotes.abilityScoreImprovementFeature',
        'levels.Ranger', '+=', 'source >= 19 ? 5 : Math.floor(source / 4)'
      );

    } else if(name == 'Rogue') {

      features = [
        '1:Armor Proficiency (Light)',
        '1:Weapon Proficiency (Simple/Hand Crossbow/Longsword/Rapier/Shortsword)',
        "1:Tool Proficiency (Thieves' Tools)",
        '1:Expertise', '1:Sneak Attack', "1:Thieves' Cant", '2:Cunning Action',
        '3:Roguish Archetype', '4:Ability Score Improvement', '5:Uncanny Dodge',
        '7:Evasion', '11:Reliable Talent', '14:Blindsense',
        '15:Slippery Mind', '18:Elusive', '20:Stroke Of Luck'
      ];
      hitDie = 8;
      notes = [
        'abilityNotes.abilityScoreImprovementFeature:+%V distributed',
        'combatNotes.cunningAction:Bonus dash/disengage/hide each turn',
        'combatNotes.sneakAttackFeature:+%Vd6 damage on Adv/flanked attacks',
        'combatNotes.uncannyDodgeFeature:Use reaction for half damage',
        'saveNotes.evasionFeature:Dex save yields no damage instead of 1/2',
        'skillNotes.expertiseFeature:Double proficiency in %V skills/tools',
        'skillNotes.reliableTalentFeature:Min 10 roll on proficient skills',
        "skillNotes.thieves'CantFeature:Signs and symbols known only by rogues"
        // TODO
      ];
      proficiencyCount =
        {'Save':2, 'Skill':4, 'Tool':1, 'Armor':1, 'Weapon':5};
      proficienciesGiven = {
        'Save':['Dexterity', 'Intelligence'],
        'Tool':["Thieves' Tools"],
        'Armor':['Light'],
        'Weapon':['Simple','Hand Crossbow','Longsword','Rapier','Shortsword']
      };
      proficiencyChoices = {
        'Skill':['Acrobatics', 'Athletics', 'Deception', 'Insight',
                 'Intimidation', 'Investigation', 'Perception', 'Performance',
                 'Persuasion', 'Sleight Of Hand', 'Stealth']
      };
      selectableFeatures = SRD5E.ROGUE_ARCHETYPES;
      spellAbility = null;
      spellsKnown = null;
      spellSlots = null;

      rules.defineRule('abilityNotes.abilityScoreImprovementFeature',
        'levels.Rogue', '+=', 'source >= 19 ? 5 : Math.floor(source / 4)'
      );
      rules.defineRule('combatNotes.sneakAttackFeature',
        'levels.Rogue', '=', 'Math.floor((source + 1) / 2)'
      );
      rules.defineRule('skillNotes.expertiseFeature',
        'levels.Rogue', '=', 'source >= 6 ? 4 : 2'
      );
      rules.defineRule('selectableFeatureCount.Rogue',
        'rogueFeatures.Roguish Archetype', '=', '1'
      );

    } else if(name == 'Sorcerer') {

      features = [
        '1:Weapon Proficiency (Dagger/Dart/Sling/Quarterstaff/Light Crossbow)',
        '1:Sorcerous Origin', '2:Font Of Magic', '3:Metamagic',
        '4:Ability Score Improvement', '20:Sorcerous Restoration'
      ];
      hitDie = 8;
      notes = [
        'abilityNotes.abilityScoreImprovementFeature:+%V distributed'
        // TODO
      ];
      proficiencyCount = {'Save':2, 'Skill':2, 'Weapon':5};
      proficienciesGiven = {
        'Save':['Charisma', 'Constitution'],
        'Weapon':['Dagger', 'Dart', 'Sling', 'Quarterstaff', 'Light Crossbow']
      };
      proficiencyChoices = {
        'Skill':['Arcana', 'Deception', 'Insight', 'Intimidation', 'Persuasion',
                 'Religion']
      };
      selectableFeatures = null;
      spellAbility = 'charisma';
      spellsKnown = [
        'S0:1:4/4:5/10:6',
        'S:1:2/2:3/3:4/4:5/5:6/6:7/7:8/8:9/9:10/10:11/11:12/13:13/15:14/17:15'
      ];
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

      rules.defineRule('abilityNotes.abilityScoreImprovementFeature',
        'levels.Sorcerer', '+=', 'source >= 19 ? 5 : Math.floor(source / 4)'
      );
      rules.defineRule('casterLevelArcane', 'levels.Sorcerer', '+=', null);

    } else if(name == 'Warlock') {

      features = [
        '1:Armor Proficiency (Light)',
        '1:Weapon Proficiency (Simple)',
        '1:Otherworldly Patron', '1:Pact Magic', '2:Eldritch Invocation',
        '3:Pact Boon', '4:Ability Score Improvement', '11:Mystic Arcanum',
        '20:Eldritch Master'
      ];
      hitDie = 8;
      notes = [
        'abilityNotes.abilityScoreImprovementFeature:+%V distributed'
        // TODO
      ];
      proficiencyCount = {'Save':2, 'Skill':2, 'Armor':1, 'Weapon':1};
      proficienciesGiven = {
        'Save':['Charisma', 'Wisdom'],
        'Armor':['Light'],
        'Weapon':['Simple']
      };
      proficiencyChoices = {
        'Skill':['Arcana', 'Deception', 'History', 'Intimidation',
                 'Investigation', 'Nature', 'Religion']
      };
      spellAbility = 'charisma';
      spellsKnown = [
        'K0:1:2/4:3/10:4',
        'K:1:1/2:2/11:3/17:4'
      ];
      spellSlots = [
        'K1:1:1/2:2/3:0',
        'K2:3:2/5:0',
        'K3:5:2/7:0',
        'K4:7:2/9:0',
        'K5:9:2/11:3/17:4'
      ];

      rules.defineRule('abilityNotes.abilityScoreImprovementFeature',
        'levels.Warlock', '+=', 'source >= 19 ? 5 : Math.floor(source / 4)'
      );
      rules.defineRule('casterLevelArcane', 'levels.Warlock', '+=', null);

    } else if(name == 'Wizard') {

      features = [
        '1:Weapon Proficiency (Dagger/Dart/Light Crossbow/Quarterstaff/Sling)',
        '1:Arcane Recovery', '2:Arcane Tradition',
        '4:Ability Score Improvement', '18:Spell Mastery', '20:Signature Spell'
      ];
      hitDie = 6;
      notes = [
        'abilityNotes.abilityScoreImprovementFeature:+%V distributed',
        'magicNotes.arcaneRecoveryFeature:' +
          'Short rest recovers %V spell slots 1/dy',
        'magicNotes.arcaneTraditionFeature:Gain chosen school effects',
        'magicNotes.signatureSpellFeature:' +
          'Cast 2 2nd spells w/o using spell slot 1/short rest',
        'magicNotes.spellMasteryFeature:' +
          'Cast 1 ea 1st/2nd spell w/o using spell slot'
      ];
      proficiencyCount = {'Save':2, 'Skill':3, 'Weapon':5};
      proficienciesGiven = {
        'Save':['Intelligence', 'Wisdom'],
        'Weapon':['Dagger', 'Dart', 'Sling', 'Quarterstaff', 'Light Crossbow']
      };
      proficiencyChoices = {
        'Skill': ['Arcana', 'History', 'Insight', 'Investigation', 'Medicine',
                  'Religion']
      };
      selectableFeatures = SRD5E.SCHOOLS.map(function(school){return school.substring(0, school.indexOf(':')) + ' Tradition';}),
      spellAbility = 'intelligence';
      spellsKnown = [
        'W0:1:3/4:4/10:5',
        'W:1:6/2:8/3:10/4:12/5:14/6:16/7:18/8:20/9:22/10:24/11:26/12:28/13:30/14:32/15:34/16:36/17:38/18:40/19:42/20:44'
      ];
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

      rules.defineRule('abilityNotes.abilityScoreImprovementFeature',
        'levels.Wizard', '+=', 'source >= 19 ? 5 : Math.floor(source / 4)'
      );
      rules.defineRule('casterLevelArcane', 'levels.Wizard', '+=', null);
      rules.defineRule('magicNotes.arcaneRecoveryFeature',
        'levels.Wizard', '=', 'Math.floor(source / 2)'
      );
      rules.defineRule('selectableFeatureCount.Wizard',
        'wizardFeatures.Arcane Tradition', '=', '1'
      );

    } else
      continue;

    SRD5E.defineClass(
      rules, name, hitDie, features, selectableFeatures, proficiencyCount,
      proficienciesGiven, proficiencyChoices, spellAbility, spellsKnown,
      spellSlots, notes
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

/* Defines the rules related to companion creatures. */
SRD5E.companionRules = function(rules, companions, familiars) {

  var features, notes;

  notes = [
    "companionNotes.celestialCompanion:" +
      "Smite Evil (+%V damage) 1/day, 60' darkvision, " +
      "%1 acid/cold/electricity resistance, DR %2/magic",
    'companionNotes.companionEvasionFeature:' +
      'Dex save yields no damage instead of 1/2',
    'companionNotes.companionImprovedEvasionFeature:' +
      'Failed save yields 1/2 damage',
    'companionNotes.deliverTouchSpellsFeature:' +
      'Deliver touch spells if in contact w/master when cast',
    'companionNotes.devotionFeature:+4 Will vs. enchantment',
    'companionNotes.empathicLinkFeature:Share emotions up to 1 mile',
    "companionNotes.fiendishCompanion:" +
      "Smite Good (+%V damage) 1/day, 60' darkvision, " +
      "%1 cold/fire resistance, DR %2/magic",
    'companionNotes.improvedSpeedFeature:+10 speed',
    'companionNotes.multiattackFeature:' +
      'Reduce additional attack penalty to -2 or second attack at -5',
    'companionNotes.scryFeature:Master views companion 1/day',
    'companionNotes.shareSpellsFeature:' +
      'Master share self spell w/companion w/in 5 ft',
    'companionNotes.speakWithLikeAnimalsFeature:Talk w/similar creatures',
    'companionNotes.speakWithMasterFeature:Talk w/master in secret language',
    'skillNotes.companionAlertnessFeature:' +
      '+2 listen/spot when companion w/in reach',
    'skillNotes.linkFeature:+4 Handle Animal/Wild Empathy w/companion'
  ];
  rules.defineNote(notes);

  rules.defineRule('companionNotes.celestialCompanion',
    'animalCompanion.Celestial', '=', null,
    'familiar.Celestial', '=', null,
    'companionStats.HD', '^', null
  );
  rules.defineRule('companionNotes.celestialCompanion.1',
    'companionStats.HD', '=', 'Math.floor((source + 7) / 8) * 5'
  );
  rules.defineRule('companionNotes.celestialCompanion.2',
    'companionStats.HD', '=', 'source < 4 ? 0 : source < 12 ? 5 : 10'
  );
  rules.defineRule('companionNotes.fiendishCompanion',
    'animalCompanion.Fiendish', '=', null,
    'familiar.Fiendish', '=', null,
    'companionStats.HD', '^', null
  );
  rules.defineRule('companionNotes.fiendishCompanion.1',
    'companionStats.HD', '=', 'Math.floor((source + 7) / 8) * 5'
  );
  rules.defineRule('companionNotes.fiendishCompanion.2',
    'companionStats.HD', '=', 'source < 4 ? 0 : source < 12 ? 5 : 10'
  );

  rules.defineSheetElement('Companion Features', 'Notes', null, '; ');
  rules.defineSheetElement('Companion Stats', 'Notes', null, '; ');
  rules.defineSheetElement('Companion Notes', 'Notes', null, '; ');

  if(companions != null) {

    rules.defineChoice('animalCompanions', QuilvynUtils.getKeys(companions));
    rules.defineEditorElement
      ('animalCompanion', 'Animal Companion', 'set', 'animalCompanions',
       'notes');
    rules.defineEditorElement('animalCompanionName', '', 'text', [20], 'notes');
    rules.defineSheetElement
      ('Animal Companion', 'Companion Features', null, ' ');

    features = {
      'Link': 1, 'Share Spells': 1, 'Companion Evasion': 2, 'Devotion' : 3,
      'Multiattack': 4, 'Companion Improved Evasion': 6
    };
    for(var feature in features) {
      rules.defineRule('companionFeatures.' + feature,
        'animalCompanionLevel', '=',
        'source >= ' + features[feature] + ' ? 1 : null'
      );
      rules.defineRule
        ('features.' + feature, 'companionFeatures.' + feature, '=', '1');
    }

    notes = [
      'companionStats.BAB:+%V',
      'companionStats.Fort:+%V',
      'companionStats.Init:+%V',
      'companionStats.Ref:+%V',
      'companionStats.Tricks:+%V',
      'companionStats.Will:+%V',
      'validationNotes.animalCompanionCasterLevel:Requires %1'
    ];
    rules.defineNote(notes);

    rules.defineRule('animalCompanionLevel',
      'animalCompanionMasterLevel', '=', 'Math.floor((source + 3) / 3)'
    );
    rules.defineRule('companionStats.AC',
      'animalCompanionLevel', '+', '(source - 1) * 2',
      'companionStats.Dex', '+', 'Math.floor((source - 10) / 2)'
    );
    rules.defineRule('companionStats.BAB',
      'companionStats.HD', '=', SRD5E.ATTACK_BONUS_AVERAGE
    );
    rules.defineRule('companionStats.Dex',
      'animalCompanionLevel', '+', 'source - 1'
    );
    rules.defineRule('animalCompanionFort',
      'features.Animal Companion', '?', null,
      'companionStats.HD', '=', SRD5E.SAVE_BONUS_GOOD,
      'companionStats.Con', '+', 'Math.floor((source - 10)/2)'
    );
    rules.defineRule('companionStats.Fort', 'animalCompanionFort', '=', null);
    rules.defineRule('companionStats.HD',
      'animalCompanionLevel', '+', '(source - 1) * 2'
    );
    rules.defineRule('companionStats.Init',
      'companionStats.Dex', '=', 'Math.floor((source - 10) / 2)'
    );
    rules.defineRule('companionStats.Name', 'animalCompanionName', '=', null);
    rules.defineRule('animalCompanionRef',
      'features.Animal Companion', '?', null,
      'companionStats.HD', '=', SRD5E.SAVE_BONUS_GOOD,
      'companionStats.Dex', '+', 'Math.floor((source - 10) / 2)'
    );
    rules.defineRule('companionStats.Ref', 'animalCompanionRef', '=', null);
    rules.defineRule
      ('companionStats.Str', 'animalCompanionLevel', '+', 'source - 1');
    rules.defineRule
      ('companionStats.Tricks', 'animalCompanionLevel', '=', null);
    rules.defineRule('animalCompanionWill',
      'features.Animal Companion', '?', null,
      'companionStats.HD', '=', SRD5E.SAVE_BONUS_POOR,
      'companionStats.Wis', '+', 'Math.floor((source - 10)/2)'
    );
    rules.defineRule('companionStats.Will', 'animalCompanionWill', '=', null);
    rules.defineRule('validationNotes.animalCompanionCasterLevel',
      'validationNotes.animalCompanionCasterLevel.1', '=', null,
      'animalCompanionMasterLevel', '+', '-source',
      '', '^', '0'
    );
    rules.defineRule('validationNotes.animalCompanionCasterLevel.1',
      'features.Animal Companion', '=', '1'
    );

    for(var companion in companions) {
      var matchInfo;
      var stats = companions[companion].split(/\s+/);
      for(var i = 0; i < stats.length; i++) {
        if((matchInfo = stats[i].match(/(.+)=(.+)/)) == null)
          continue
        if(matchInfo[1] == 'Level') {
          rules.defineRule('animalCompanionLevel',
            'animalCompanion.' + companion, '+',
            '-Math.floor(' + matchInfo[2] + '/3)'
          );
          rules.defineRule('validationNotes.animalCompanionCasterLevel.1',
            'animalCompanion.' + companion, '^', matchInfo[2]
          );
        } else if(matchInfo[2].match(/^\d+$/)) {
          rules.defineRule('companionStats.' + matchInfo[1],
            'animalCompanion.' + companion, '=', matchInfo[2]
          );
        } else {
          rules.defineRule('companionStats.' + matchInfo[1],
            'animalCompanion.' + companion, '=', '"' + matchInfo[2] + '"'
          );
        }
      }
    }

    // Adapt Paladin mount rules to make it a form of animal companion.
    var features = {
      'Companion Evasion': 1, 'Companion Improved Evasion': 1, 
      'Empathic Link': 1, 'Share Saving Rolls': 1, 'Improved Speed': 2,
      'Command Like Creatures': 3, 'Companion Resist Spells': 4,
      'Link': 0, 'Devotion' : 0, 'Multiattack': 0
    };
    for(var feature in features) {
      if(features[feature] > 0) {
        rules.defineRule('companionFeatures.' + feature,
          'mountLevel', '=', 'source >= ' + features[feature] + ' ? 1 : null'
        );
        rules.defineRule
          ('features.' + feature, 'companionFeatures.' + feature, '=', '1');
      } else {
        // Disable N/A companion features
        rules.defineRule
          ('companionFeatures.' + feature, 'mountLevel', 'v', '0');
      }
    }
    notes = [
      'companionNotes.commandLikeCreaturesFeature:' +
        'DC %V <i>Command</i> vs. similar creatures %1/day',
    ];
    rules.defineNote(notes);
    rules.defineRule('mountLevel',
      'mountMasterLevel', '=',
      'source<5 ? null : source<8 ? 1 : source<11 ? 2 : source<15 ? 3 : 4'
    );
    rules.defineRule('companionNotes.commandLikeCreaturesFeature',
      'companionFeatures.Command Like Creatures', '?', null,
      'mountMasterLevel', '=', '10 + Math.floor(source / 2)',
      'charismaModifier', '+', null
    );
    rules.defineRule('companionNotes.commandLikeCreaturesFeature.1',
      'mountMasterLevel', '=', 'Math.floor(source / 2)'
    );
    rules.defineRule
      ('companionStats.SR', 'mountMasterLevel', '=', 'source + 5');

  }

  if(familiars != null) {

    rules.defineChoice('familiars', QuilvynUtils.getKeys(familiars));
    rules.defineEditorElement
      ('familiar', 'Familiar', 'set', 'familiars', 'notes');
    rules.defineEditorElement('familiarName', '', 'text', [20], 'notes');
    rules.defineSheetElement('Familiar', 'Companion Features', null, ' ');

    features = {
      'Companion Alertness': 1, 'Companion Evasion': 1,
      'Companion Improved Evasion': 1, 'Empathic Link': 1, 'Share Spells': 1,
      'Deliver Touch Spells': 2, 'Speak With Master': 3,
      'Speak With Like Animals': 4, 'Companion Resist Spells': 6, 'Scry': 7
    };
    for(var feature in features) {
      rules.defineRule('companionFeatures.' + feature,
        'familiarLevel', '=', 'source >= ' + features[feature] + ' ? 1 : null'
      );
      rules.defineRule
        ('features.' + feature, 'companionFeatures.' + feature, '=', '1');
    }

    notes = [
      'combatNotes.familiarToad:+3 Hit Points',
      'saveNotes.familiarRat:+2 Fortitude',
      'saveNotes.familiarWeasel:+2 Reflex',
      'skillNotes.familiarBat:+3 Listen',
      'skillNotes.familiarCat:+3 Move Silently',
      'skillNotes.familiarHawk:+3 Spot in bright light',
      'skillNotes.familiarLizard:+3 Climb',
      'skillNotes.familiarOwl:+3 Spot in shadows/darkness',
      'skillNotes.familiarRaven:+3 Appraise',
      'skillNotes.familiarViper:+3 Bluff',
      'companionStats.BAB:+%V',
      'companionStats.Fort:+%V',
      'companionStats.Init:+%V',
      'companionStats.Ref:+%V',
      'companionStats.SR:DC %V',
      'companionStats.Will:+%V',
      'validationNotes.familiarCasterLevel:Requires %1'
    ];
    rules.defineNote(notes);

    rules.defineRule('combatNotes.familiarToad', 'familiar.Toad', '=', '1');
    rules.defineRule('saveNotes.familiarRat', 'familiar.Rat', '=', '1');
    rules.defineRule('saveNotes.familiarWeasel', 'familiar.Weasel', '=', '1');
    rules.defineRule('skillNotes.familiarBat', 'familiar.Bat', '=', '1');
    rules.defineRule('skillNotes.familiarCat', 'familiar.Cat', '=', '1');
    rules.defineRule('skillNotes.familiarHawk', 'familiar.Hawk', '=', '1');
    rules.defineRule('skillNotes.familiarLizard', 'familiar.Lizard', '=', '1');
    rules.defineRule('skillNotes.familiarOwl', 'familiar.Owl', '=', '1');
    rules.defineRule('skillNotes.familiarRaven', 'familiar.Raven', '=', '1');
    rules.defineRule('skillNotes.familiarViper', 'familiar.Viper', '=', '1');

    rules.defineRule('hitPoints', 'combatNotes.familiarToad', '+', '3');
    rules.defineRule('save.Fortitude', 'saveNotes.familiarRat', '+', '2');
    rules.defineRule('save.Reflex', 'saveNotes.familiarWeasel', '+', '2');

    rules.defineRule('familiarLevel',
      'features.Familiar', '?', null,
      'familiarMasterLevel', '=', 'Math.floor((source + 1) / 2)'
    );
    rules.defineRule('companionStats.AC',
      'familiarLevel', '+', null,
      'companionStats.Dex', '+', 'Math.floor((source - 10) / 2)'
    );
    rules.defineRule('familiarAttackBonus',
      'companionStats.Dex', '=', 'Math.floor((source - 10) / 2)',
      'companionStats.Str', '^', 'Math.floor((source - 10) / 2)'
    );
    rules.defineRule('familiarBAB',
      'features.Familiar', '?', null,
      'baseAttack', '=', null,
      'familiarAttackBonus', '+', null
    );
    rules.defineRule('companionStats.BAB', 'familiarBAB', '=', null);
    rules.defineRule('familiarHD',
      'features.Familiar', '?', null,
      'level', '=', null
    );
    rules.defineRule('companionStats.HD', 'familiarHD', '^', null);
    rules.defineRule('companionStats.HP',
      'features.Familiar', '?', null,
      'hitPoints', '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('companionStats.Init',
      'companionStats.Dex', '=', 'Math.floor((source - 10) / 2)'
    );
    rules.defineRule('companionStats.Int', 'familiarLevel', '^', 'source + 5');
    rules.defineRule('companionStats.SR',
      'features.Companion Resist Spells', '?', null,
      'familiarMasterLevel', '=', 'source + 5'
    );
    rules.defineRule('familiarFort',
      'familiarLevel', '?', null,
      'classFortitudeBonus', '=', 'Math.max(source, 2)',
      'companionStats.Con', '+', 'Math.floor((source - 10) / 2)'
    );
    rules.defineRule('companionStats.Fort', 'familiarFort', '=', null);
    rules.defineRule('companionStats.Name', 'familiarName', '=', null);
    rules.defineRule('familiarRef',
      'familiarLevel', '?', null,
      'classReflexBonus', '=', 'Math.max(source, 2)',
      'companionStats.Dex', '+', 'Math.floor((source - 10) / 2)'
    );
    rules.defineRule('companionStats.Ref', 'familiarRef', '=', null);
    rules.defineRule('familiarWill',
      'familiarLevel', '?', null,
      'classWillBonus', '=', 'Math.max(source, 0)',
      'companionStats.Wis', '+', 'Math.floor((source - 10) / 2)'
    );
    rules.defineRule('companionStats.Will', 'familiarWill', '=', null);
    rules.defineRule('validationNotes.familiarCasterLevel',
      'validationNotes.familiarCasterLevel.1', '=', null,
      'familiarMasterLevel', '+', '-source',
      '', '^', '0'
    );
    rules.defineRule
      ('validationNotes.familiarCasterLevel.1', 'features.Familiar', '=', '1');

    for(var familiar in familiars) {
      var matchInfo;
      var stats = familiars[familiar].split(/\s+/);
      for(var i = 0; i < stats.length; i++) {
        if((matchInfo = stats[i].match(/(.+)=(.+)/)) == null)
          continue
        if(matchInfo[1] == 'Level') {
          rules.defineRule('validationNotes.familiarCasterLevel.1',
            'familiar.' + familiar, '^', matchInfo[2]
          );
        } else if(matchInfo[2].match(/^\d+$/)) {
          rules.defineRule('companionStats.' + matchInfo[1],
            'familiar.' + familiar, '=', matchInfo[2]
          );
        } else {
          rules.defineRule('companionStats.' + matchInfo[1],
            'familiar.' + familiar, '=', '"' + matchInfo[2] + '"'
          );
        }
      }
    }

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
      'weaponProficiencies.' + name, '=', '1',
      'weaponProficiencies.' + category, '=', '1'
    );
    rules.defineRule('weaponBonus.' + name,
      'proficient.' + name, '?', null,
      'proficiencyBonus', '=', null
    );
    rules.defineRule('attackBonus.' + name,
      'combatNotes.' + (range ? 'dexterity' : 'strength') + 'AttackAdjustment', '=', null,
      'weaponBonus.' + name, '+', null,
      'weaponAttackAdjustment.' + name, '+', null
    );
    rules.defineRule('damageBonus.' + name,
      'combatNotes.' + (range ? 'dexterity' : 'strength') + 'DamageAdjustment', '=', null,
      'weaponBonus.' + name, '+', null,
      'weaponDamageAdjustment.' + name, '+', null
    );
    if(!range) {
      rules.defineRule('attackBonus.'+name, 'monkMeleeAttackBonus', '+', null);
      rules.defineRule('damageBonus.'+name, 'monkMeleeDamageBonus', '+', null);
    }

    rules.defineRule(weaponName + '.1',
      'attackBonus.' + name, '=', 'source < 0 ? source : ("+" + source)'
    );
    rules.defineRule(weaponName + '.2', '', '=', '"' + damage + '"');
    rules.defineRule(weaponName + '.3',
      'damageBonus.' + name, '=', 'source < 0 ? source : source == 0 ? "" : ("+" + source)'
    );
    if(range) {
      rules.defineRule('range.' + name,
        '', '=', range,
        'weaponRangeAdjustment.' + name, '+', null
      );
      rules.defineRule(weaponName + '.4', 'range.' + name, '=', null);
    }
    if(!range) {
      rules.defineRule(weaponName + '.2', 'monkMeleeDieBonus', '^', null);
    }

  }

  for(var i = 0; i < armors.length; i++) {
    var pieces = armors[i].split(':');
    var name = pieces[0];
    rules.defineRule
      ('proficient.' + name, 'armorProficiencies.' + name, '=', '1');
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

  for(var i = 0; i < feats.length; i++) {

    var feat = feats[i];
    var matchInfo;
    var notes = null;

    if(feat == 'Alert') {
      notes = [
        'combatNotes.alertFeature:+5 Initiative, foes no surprise or hidden Adv'
      ];
      rules.defineRule('initiative', 'combatNotes.alertFeature', '+', '5');
    } else if(feat == 'Athelete') {
      // TODO
    } else if(feat == 'Actor') {
      notes = [
        //'abilityNotes.actorFeature:+1 Charisma',
        "skillNotes.actorFeature:Mimic others' speech/sounds, Adv Charisma(Deception/Performance) when impersonating"
      ];
      //rules.defineRule('charisma', 'abilityNotes.actorFeature', '+', '1');
    } else if(feat == 'Charger') {
      // TODO
    } else if(feat == 'Crossbow Expert') {
      // TODO
    } else if(feat == 'Defensive Duelist') {
      // TODO
    } else if(feat == 'Dual Wielder') {
      // TODO
    } else if(feat == 'Dungeon Delver') {
      // TODO
    } else if(feat == 'Durable') {
      // TODO
    } else if(feat == 'Elemental Adept') {
      // TODO
    } else if(feat == 'Grappler') {
      // TODO
    } else if(feat == 'Great Weapon Master') {
      // TODO
    } else if(feat == 'Healer') {
      // TODO
    } else if(feat == 'Heavily Armored') {
      // TODO
    } else if(feat == 'Heavy Armor Master') {
      // TODO
    } else if(feat == 'Inspiring Leader') {
      // TODO
    } else if(feat == 'Keen Mind') {
      // TODO
    } else if(feat == 'Lightly Armorned') {
      // TODO
    } else if(feat == 'Linguist') {
      // TODO
    } else if(feat == 'Lucky') {
      // TODO
    } else if(feat == 'Mage Slayer') {
      // TODO
    } else if(feat == 'Magic Initiate') {
      // TODO
    } else if(feat == 'Martial Adept') {
      // TODO
    } else if(feat == 'Medium Armor Master') {
      // TODO
    } else if(feat == 'Mobile') {
      // TODO
    } else if(feat == 'Moderately Armored') {
      // TODO
    } else if(feat == 'Mounted Combatant') {
      // TODO
    } else if(feat == 'Observant') {
      // TODO
    } else if(feat == 'Polearm Master') {
      // TODO
    } else if(feat == 'Resilient') {
      // TODO
    } else if(feat == 'Ritual Caster') {
      // TODO
    } else if(feat == 'Savage Attacker') {
      // TODO
    } else if(feat == 'Sentinel') {
      // TODO
    } else if(feat == 'Sharpshooter') {
      // TODO
    } else if(feat == 'Shield Master') {
      // TODO
    } else if(feat == 'Skilled') {
      // TODO
    } else if(feat == 'Skulker') {
      // TODO
    } else if(feat == 'Spell Sniper') {
      // TODO
    } else if(feat == 'Tavern Brawler') {
      // TODO
    } else if(feat == 'Tough') {
      // TODO
    } else if(feat == 'War Caster') {
      // TODO
    } else if(feat == 'Weapon Master') {
      // TODO
    } else {
      continue;
    }
    rules.defineChoice('feats', feat);
    rules.defineRule('features.' + feat, 'feats.' + feat, '=', null);
    if(notes != null)
      rules.defineNote(notes);

  }

};

/* Defines the rules related to spells and domains. */
SRD5E.magicRules = function(rules, classes, domains, schools) {

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
        'Faerie Fire:Feather Fall:Healing Word:Heroism:Identify:' +
        'Illusory Script:Longstrider:Silent Image:Sleep:Speak With Animals:' +
        "Tasha's Hideous Laughter:Thunderwave:Unseen Servant",
        'B2:Animal Messenger:Blindness/Deafness:Calm Emotions:' +
        'Cloud Of Daggers:Crown Of Madness:Detect Thoughts:Enhance Ability:' +
        'Enthrall:Heat Metal:Hold Person:Invisibility:Knock:' +
        'Lesser Restoration:Locate Animals Or Plants:Locate Object:' +
        'Magic Mouth:Phantasmal Force:See Invisibility:Shatter:Silence:' +
        'Suggestion:Zone Of Truth',
        'B3:Bestow Curse:Clairvoyance:Dispel Magic:Fear:Feign Death:' +
        "Glyph Of Warding:Hypnotic Pattern:Leomund's Tiny Hut:Major Image:" +
        'Nondetection:Plant Growth:Sending:Speak With Dead:Speak With Plants:' +
        'Stinking Cloud:Tongues',
        'B4:Compulsion:Confusion:Dimension Door:Freedom Of Movement:' +
        'Greater Invisibility:Hallucinatory Terrain:Locate Creature:Polymorph',
        'B5:Animate Objects:Awaken:Dominate Person:Dream:Geas:' +
        'Greater Restoration:Hold Monster:Legend Lore:Mass Cure Wounds:' +
        'Mislead:Modify Memory:Planar Binding:Raise Dead:Scrying:Seeming:' +
        'Teleporation Circle',
        'B6:Eyebite:Find The Path:Guards And Wards:Mass Suggestion:' +
        "Otto's Irresistible Dance:Programmed Illusion:True Seeing",
        'B7:Etherealness:Forcecage:Mirage Arcane:' +
        "Mordenkainen's Magnificent Mansion:Mordenkainen's Sword:" +
        'Project Image:Regenerate:Resurrection:Symbol:Teleport',
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
    } else if(klass == 'Wizard') {
      spells = [
        'W0:Acid Splash:Blade Ward:Chill Touch:Dancing Lights:Fire Bolt:' +
        'Friends:Light:Mage Hand:Mending:Message:Minor Illusion:Poison Spray:' +
        'Prestidigitation:Ray Of Frost:Shocking Grasp:True Strike',
        'W1:Alarm:Burning Hands:Charm Person:Chromatic Orb:Color Spray:' +
        'Comprehend Languages:Detect Magic:Disguise Self:Expeditious Retreat:' +
        'False Life:Feather Fall:Find Familiar:Fog Cloud:Grease:Identify:' +
        'Illusory Script:Jump:Longstrider:Mage Armor:Magic Missile:' +
        'Protection From Evil And Good:Ray Of Sickness:Shield:Silent Image:' +
        "Sleep:Tasha's Hideous Laughter:Tenser's Floating Disk:Thunderwave:" +
        'Unseen Servant:Witch Bolt',
        'W2:Alter Self:Arcane Lock:Blindness/Deafness:Blur:Cloud Of Daggers:' +
        'Continual Flame:Crown Of Madness:Darkness:Darkvision:' +
        'Detect Thoughts:Enlarge/Reduce:Flaming Sphere:Gentle Repose:' +
        'Gust Of Wind:Hold Person:Invisibility:Knock:Levitate:Locate Object:' +
        "Magic Mouth:Magic Weapon:Melf's Acid Arrow:Mirror Image:Misty Step:" +
        "Nystul's Magic Aura:Phantasmal Force:Ray Of Enfeeblement:" +
        'Rope Trick:Scorching Ray:See Invisibility:Shatter:Spider Climb:' +
        'Suggestion:Web',
        'W3:Animate Dead:Bestow Curse:Blink:Clairvoyance:Counterspell:' +
        'Dispel Magic:Fear:Feign Death:Fireball:Fly:Gaseous Form:' +
        "Glyph Of Warding:Haste:Hypnotic Pattern:Leomund's Tiny Hut:" +
        'Lightning Bolt:Magic Circle:Major Image:Nondetection:Phantom Steed:' +
        'Protection From Energy:Remove Curse:Sending:Sleet Storm:Slow:' +
        'Stinking Cloud:Tongues:Vampiric Touch:Water Breathing',
        'W4:Arcane Eye:Banishment:Blight:Confusion:Conjure Minor Elementals:' +
        "Control Water:Dimension Door:Evard's Black Tentacles:Fabricate:" +
        'Fire Shield:Greater Invisibility:Hallucinatory Terrain:Ice Storm:' +
        "Leomund's Secret Chest:Locate Creature:" +
        "Mordenkainen's Faithful Hound:Mordenkainen's Private Sanctum:" +
        "Otiluke's Resilient Sphere:Phantasmal Killer:Polymorph:Stone Shape:" +
        'Stoneskin:Wall Of Fire',
        "W5:Animate Objects:Bigby's Hand:Cloudkill:Cone Of Cold:" +
        'Conjure Elemental:Contact Other Plane:Creation:Dominate Person:' +
        'Dream:Geas:Hold Monster:Legend Lore:Mislead:Modify Memory:Passwall:' +
        "Planar Binding:Rary's Telepathic Bond:Scrying:Seeming:Telekinesis:" +
        'Teleportation Circle:Wall Of Force:Wall Of Stone',
        'W6:Arcane Gate:Chain Lightning:Circle Of Death:Contingency:' +
        "Create Undead:Disintegrate:Drawmij's Instant Summons:Eyebite:" +
        'Flesh To Stone:Globe Of Invulnerability:Guards And Wards:Magic Jar:' +
        "Mass Suggestion:Move Earth:Otiluke's Freezing Sphere:" +
        "Otto's Irresistible Dance:Programmed Illusion:Sunbeam:True Seeing:" +
        'Wall Of Ice',
        'W7:Delayed Blast Fireball:Etherealness:Finger Of Death:Forcecage:' +
        "Mirage Arcane:Mordenkainen's Magnificent Mansion:" +
        "Mordenkainen's Sword:Plane Shift:Prismatic Spray:Project Image:" +
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

  rules.defineChoice('domains', domains);

  for(var i = 0; i < domains.length; i++) {

    var domain = domains[i];
    var features = null;
    var notes = null;
    var proficiencyCount = {};
    var proficienciesGiven = {};
    var proficiencyChoices = {};
    var spells = null;

    if(domain == 'Life') {
      features = [
        '1:Disciple Of Life', '2:Preserve Life', '6:Blessed Healer',
        '8:Divine Strike', '17:Supreme Healing'
      ];
      notes = [
        'combatNotes.divineStrikeFeature:+%Vd8 HP 1/turn',
        'magicNotes.discipleOfLifeFeature:' +
          'Healing spells restore additional 2 * spell level HP',
        'magicNotes.preserveLifeFeature:' +
          "R30' Channel Energy to divide %V HP among chosen targets",
        'magicNotes.blessedHealerFeature:' +
          'Self regain 2 * spell level HP from casting healing spells',
        'magicNotes.supremeHealingFeature:Use maximum values on healing spells'
      ];
      proficiencyCount = {'Armor':1};
      proficienciesGiven = {'Armor':['Heavy']};
      spells = [
        'Bless', 'Cure Wounds', 'Lesser Restoration', 'Spiritual Weapon',
        'Beacon Of Hope', 'Revivify', ,'Death Ward', 'Guardian Of Faith',
        'Mass Cure Wounds', 'Raise Dead'
      ];
      rules.defineRule('combatNotes.divineStrikeFeature',
        'levels.cleric', '=', 'source < 8 ? null : source < 14 ? 1 : 2'
      );
      rules.defineRule
        ('magicNotes.preserveLifeFeature', 'levels.Cleric', '=', '5 * source');
// PHB
    } else if(domain == 'Knowledge') {
      // TODO
    } else if(domain == 'Light') {
      // TODO
    } else if(domain == 'Nature') {
      // TODO
    } else if(domain == 'Tempest') {
      // TODO
    } else if(domain == 'Trickery') {
      // TODO
    } else if(domain == 'War') {
      // TODO
// ENDPHB
    } else
      continue;

    if(features != null) {
      for(var j = 0; j < features.length; j++) {
        var levelAndFeature = features[j].split(/:/);
        var feature = levelAndFeature[levelAndFeature.length == 1 ? 0 : 1];
        var level = levelAndFeature.length == 1 ? 1 : levelAndFeature[0];
        var matchInfo;
        var prefix =
          name.substring(0, 1).toLowerCase() + name.substring(1).replace(/ /g, '');
        rules.defineRule('clericFeatures.' + feature,
          'selectableFeatures.' + domain + ' Domain', '?', null,
          'level', '=', 'source >= ' + level + ' ? 1 : null'
        );
        rules.defineRule
          ('features.' + feature, 'clericFeatures.' + feature, '+=', null);
      }
    }

    if(spells != null) {
      for(var j = 0; j < spells.length; j++) {
        var spell = spells[j];
        var school = SRD5E.SPELLS[spell];
        if(school == null) {
          continue;
        }
        spell += '(' + domain + (j + 1) + ' ' + schools[school] + ')';
        rules.defineChoice('spells', spell);
      }
    }

    if(notes != null)
      rules.defineNote(notes);

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
    '', '=', '0',
    'languageCount', '=', null
  );
  rules.defineRule('validationNotes.languageAllocation.2',
    '', '=', '0',
    /^languages\./, '+=', null
  );
  rules.defineRule('validationNotes.languageAllocation',
    'validationNotes.languageAllocation.1', '=', '-source',
    'validationNotes.languageAllocation.2', '+=', null
  );

  for(var i = 0; i < races.length; i++) {

    var adjustment, features, languages, notes;
    var proficiencyCount = null;
    var proficienciesGiven = null;
    var proficiencyChoices = null;
    var race = races[i];
    var raceNoSpace =
      race.substring(0,1).toLowerCase() + race.substring(1).replace(/ /g, '');

    if(race == 'Half-Elf') {

      adjustment = '+2 charisma/+1 any two';
      features = [
        'Darkvision', 'Extra Language', 'Fey Ancestry', 'Skill Versatility'
      ];
      languages = ['Common', 'Elvish', ''];
      notes = [
        "featureNotes.darkvisionFeature:See one light level better 60'",
        'saveNotes.feyAncestryFeature:Adv vs. charmed, immune sleep',
        'skillNotes.skillVersatilityFeature:Prof two additional skills'
      ];
      proficiencyCount = {'Skill': 2};
      proficienciesGiven = {};
      proficiencyChoices = {
        'Skill': SRD5E.SKILLS.map(function(skill){return skill.substring(0, skill.indexOf(':'));})
      };

    } else if(race == 'Half-Orc') {

      adjustment = '+2 strength/+1 constitution';
      features = [
        'Darkvision', 'Menacing', 'Relentless Endurance', 'Savage Attacks'
      ];
      languages = ['Orc'];
      notes = [
        'combatNotes.relentlessEnduranceFeature:Avoid drop below 1 hp 1/long rest',
        'combatNotes.savageAttacksFeature:Add extra die on critical damage',
        "featureNotes.darkvisionFeature:See one light level better 60'",
        'skillNotes.menacingFeature:Prof Intimidation'
      ];
      proficiencyCount = {'Skill': 2};
      proficienciesGiven = {'Skill': ['Intimidation']};
      proficiencyChoices = {};

    } else if(race.match(/Dragonborn/)) {

      adjustment = '+2 strength/+1 charisma';
      features = ['Draconic Breath'];
      languages = ['Common', 'Draconic'];
      notes = [
        'combatNotes.draconicBreathFeature:' +
          '%1 %Vd6 %2 damage (DC %3 %4 save for half)',
        'saveNotes.draconicFeature:Resistance to breath weapon damage type'
      ];
      proficiencyCount = {};
      proficienciesGiven = {};
      proficiencyChoices = {};

      rules.defineRule('combatNotes.draconicBreathFeature',
        'level', '=', '2 + Math.floor((source-1) / 5)'
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

    } else if(race.match(/Dwarf/)) {

      adjustment = '+2 constitution';
      features = [
        'Darkvision', 'Dwarven Armor Speed', 'Dwarven Resilience', 'Slow',
        'Stonecunning', 'Tool Proficiency'
      ];
      languages = ['Common', 'Dwarven'];
      notes = [
        'abilityNotes.dwarvenArmorSpeed:No speed penalty in armor',
        'abilityNotes.slowFeature:-5 speed',
        "featureNotes.darkvisionFeature:See one light level better 60'",
        'featureNotes.toolProficiencyFeature:' +
          'Proficient in choice of artisan tool',
        'saveNotes.dwarvenResilienceFeature:Adv vs. poison, resist poison damage',
        'skillNotes.stonecunningFeature:Double prof on stonework History checks'
      ];
      proficiencyCount = {
        'Tool':1, 'Weapon':4
      };
      proficienciesGiven = {
        'Weapon':['Battleaxe', 'Handaxe', 'Light Hammer', 'Warhammer']
      };
      proficiencyChoices = {
        'Tool':["Brewer's Supplies", "Mason's Tools", "Smith's Tools"]
      };

      if(race == 'Hill Dwarf') {
        adjustment += '/+1 wisdom';
        features.push('Dwarven Toughness');
        notes.push('combatNotes.dwarvenToughnessFeature:+%V HP');
        rules.defineRule
          ('combatNotes.dwarvenToughnessFeature', 'level', '=', null);
// PHB
      } else if(race == 'Mountain Dwarf') {
        adjustment += '/+2 strength';
        proficiencyCount['Armor'] = 2;
        proficienciesGiven['Armor'] = ['Light', 'Medium'];
// ENDPHB
      }

      rules.defineRule('abilityNotes.armorSpeedAdjustment',
        'abilityNotes.dwarvenArmorSpeed', '^', '0'
      );
      rules.defineRule('speed', 'abilityNotes.slowFeature', '+', '-5');

    } else if(race.match(/Elf/)) {

      adjustment = '+2 dexterity';
      features = ['Darkvision', 'Fey Ancestry', 'Keen Senses', 'Trance'];
      languages = ['Common', 'Elvish'];
      notes = [
        "featureNotes.darkvisionFeature:See one light level better 60'",
        'featureNotes.tranceFeature:' +
          '4 hour meditation gives benefit of 8 hour sleep',
        'saveNotes.feyAncestryFeature:Adv vs. charmed, immune sleep',
        'skillNotes.keenSensesFeature:Proficient Perception'
      ];
      proficiencyCount = {'Skill': 1};
      proficienciesGiven = {'Skill': ['Perception']};
      proficiencyChoices = {};

      if(race == 'High Elf') {
        adjustment += '/+1 intelligence';
        languages.push('');
        proficiencyCount['Weapons'] = 4;
        proficienciesGiven['Weapons'] =
          ['Longbow', 'Longsword', 'Shortbow', 'Shortsword'];
        features.push('Cantrip', 'Extra Language');
        // TODO Cantrip
        notes.push(
          'featureNotes.extraLanguageFeature:Speak 1 additional language'
        );
// PHB
      } else if(race == 'Wood Elf') {
        adjustment += '/+1 wisdom';
        features.push('Fleet Of Foot', 'Mask Of The Wild');
        proficiencyCount['Weapons'] = 4;
        proficienciesGiven['Weapons'] =
          ['Longbow', 'Longsword', 'Shortbow', 'Shortsword'];
        notes.push(
          'abilityNotes.fleetOfFootFeature:+5 speed',
          'featureNotes.maskOfTheWildFeature:Hide in minimal natural coverage'
        );
        rules.defineRule('speed', 'abilityNotes.fleetOfFootFeature', '+', '5');
      } else if(race == 'Dark Elf') {
        adjustment += '/+1 charisma';
        features.push
          ('Drow Magic', 'Sunlight Sensitivity', 'Superior Darkvision');
        notes.push(
          'combatNotes.sunlightSensitivityFeature:' +
            'Disadv attack in direct sunlight',
          'featureNotes.superiorDarkvisionFeature:' +
            "See one light level better 120'",
          'magicNotes.drowMagicFeature:Cast %V 1/day (cha)',
          'skillNotes.sunlightSensitivityFeature:' +
            'Disadv sight Perception in direct sunlight'
        );
        proficiencyCount['Weapons'] = 3;
        proficienciesGiven['Weapons'] = ['Hand Crossbow', 'Rapier', 'Shortsword'];
        rules.defineRule('magicNotes.drowMagicFeature', 'level', '=', '"<i>Dancing Lights</i>" + (source < 3 ? "" : ", <i>Faerie Fire</i>") + (source < 5 ? "" : ", <i>Darkness</i>")');
// ENDPHB
      }

    } else if(race.match(/Gnome/)) {

      adjustment = '+2 intelligence';
      features = ['Gnome Cunning', 'Slow'];
      languages = ['Common', 'Gnomish'];
      notes = [
        'abilityNotes.slowFeature:-5 speed',
        'saveNotes.gnomeCunningFeature:Adv cha/int/wis vs magic'
      ];
      proficiencyCount = {};
      proficienciesGiven = {};
      proficiencyChoices = {};

      if(race == 'Rock Gnome') {
        adjustment += '/+1 constitution';
        features.push("Artificier's Lore", 'Tinker');
        notes.push(
          "featureNotes.tinkerFeature:Prof w/artisan's tools",
          "skillNotes.artificier'sLoreFeature:Double prof on magic, alchemical, tech objects History checks"
        );
        proficiencyCount['Tool'] = 1;
        proficienciesGiven['Tool'] = ["Artisan's Tools"];
// PHB
      } else if(race == 'Forest Gnome') {
        adjustment += '/+1 dexterity';
        features.push('Natural Illusionist', 'Speak With Small Beasts');
        notes.push(
          'featureNotes.speakWithSmallBeastsFeature:Simple communication with small or smaller animals',
          'magicNotes.naturalIllusionistFeature:Cast <i>Minor Illusion</i> (int)'
        );
// ENDPHB
      }

      rules.defineRule('speed', 'abilityNotes.slowFeature', '+', '-5');

    } else if(race.match(/Halfling/)) {

      adjustment = '+2 dexterity';
      features = ['Brave', 'Lucky', 'Nimble', 'Slow'];
      languages = ['Common', 'Halfling'];
      notes = [
        'abilityNotes.nimbleFeature:' +
          'Move through space occupied by larger creature',
        'abilityNotes.slowFeature:-5 speed',
        'featureNotes.luckyFeature:Reroll 1 on attack/ability/save',
        'saveNotes.braveFeature:Adv vs. frightened'
      ];
      proficiencyCount = {};
      proficienciesGiven = {};
      proficiencyChoices = {};

      if(race == 'Lightfoot Halfling') {
        adjustment += '/+1 charisma';
        features = features.concat(['Stealthy']);
        notes = notes.concat
          (['featureNotes.stealthyFeature:Hide behind larger creature']);
// PHB
      } else if(race == 'Stout Halfling') {
        adjustment += '/+1 constitution';
        features.push('Stout');
        notes.push
          ('saveNotes.stoutFeature:Adv vs. poison, resist poison damage');
// ENDPHB
      }

      rules.defineRule('speed', 'abilityNotes.slowFeature', '+', '-5');

    } else if(race.match(/Human/)) {

      adjustment = '+1 strength/+1 intelligence/+1 wisdom/+1 dexterity/+1 constitution/+1 charisma';
      features = ['Extra Language'];
      languages = ['Common'];
      notes = [
        'featureNotes.extraLanguageFeature:Speak 1 additional language'
      ];
      proficiencyCount = {};
      proficienciesGiven = {};
      proficiencyChoices = {};

    } else if(race.match(/Tiefling/)) {

      adjustment = '+1 intelligence/+2 charisma';
      features = ['Darkvision', 'Hellish Resistance', 'Infernal Legacy'];
      languages = ['Common', 'Infernal'];
      notes = [
        "featureNotes.darkvisionFeature:See one light level better 60'",
        'magicNotes.infernalLegacyFeature:Cast %V 1/day (cha)',
        'saveNotes.hellishResistanceFeature:Resistance to fire damage'
      ];
      proficiencyCount = {};
      proficienciesGiven = {};
      proficiencyChoices = {};

      rules.defineRule('magicNotes.infernalLegacyFeature', 'level', '=', '"<i>Thaumaturgy</i>" + (source < 3 ? "" : ", <i>Hellish Rebuke</i>") + (source < 5 ? "" : ", <i>Darkness</i>")');

    } else
      continue;

    SRD5E.defineRace(
      rules, race, adjustment, features, languages, proficiencyCount,
      proficienciesGiven, proficiencyChoices, notes
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
SRD5E.spellDescriptionRules = function(rules, spells, descriptions) {

  if(spells == null) {
    spells = QuilvynUtils.getKeys(rules.choices.spells);
  }
  if(descriptions == null) {
    descriptions = SRD5E.spellsDescriptions;
  }

  rules.defineRule('casterLevels.B', 'levels.Bard', '=', null);
  rules.defineRule('casterLevels.C', 'levels.Cleric', '=', null);
  rules.defineRule('casterLevels.D', 'levels.Druid', '=', null);
  rules.defineRule('casterLevels.P', 'levels.Paladin', '=', null);
  rules.defineRule('casterLevels.R', 'levels.Ranger', '=', null);
  rules.defineRule('casterLevels.W', 'levels.Sorcerer', '=', null);
  rules.defineRule('casterLevels.W', 'levels.Wizard', '=', null);

  for(var i = 0; i < spells.length; i++) {

    var spell = spells[i];
    var matchInfo = spell.match(/^([^\(]+)\(([A-Za-z]+)(\d+)\s*\w*\)$/);
    if(matchInfo == null) {
      console.log("Bad format for spell " + spell);
      continue;
    }

    var abbr = matchInfo[2];
    var level = matchInfo[3];
    var name = matchInfo[1];
    var description = descriptions[name];

    if(description == null) {
      console.log("No description for spell " + name);
      continue;
    }

    if(abbr.length > 2) {
      abbr = "Dom"; // Assume domain spell
    }

    var inserts = description.match(/\$(\w+|{[^}]+})/g);

    if(inserts != null) {
      for(var index = 1; index <= inserts.length; index++) {
        var insert = inserts[index - 1];
        var expr = insert[1] == "{" ?
            insert.substring(2, insert.length - 1) : insert.substring(1);
        if(SRD5E.spellsAbbreviations[expr] != null) {
          expr = SRD5E.spellsAbbreviations[expr];
        }
        expr = expr.replace(/lvl/g, "source");
        rules.defineRule
          ("spells." + spell + "." + index, "casterLevels." + abbr, "=", expr);
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
    ['levels', 'Levels', 'bag', 'levels'],
    ['imageUrl', 'Image URL', 'text', [20]],
    ['background', 'Background', 'select-one', 'backgrounds'],
    ['strength', 'Strength', 'select-one', abilityChoices],
    ['intelligence', 'Intelligence', 'select-one', abilityChoices],
    ['wisdom', 'Wisdom', 'select-one', abilityChoices],
    ['dexterity', 'Dexterity', 'select-one', abilityChoices],
    ['constitution', 'Constitution', 'select-one', abilityChoices],
    ['charisma', 'Charisma', 'select-one', abilityChoices],
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
    attrs = this.applyRules(attributes);
    choices = ['None'];
    for(attr in this.getChoices('armors')) {
      if(attrs['proficient.' + attr]) {
        choices[choices.length] = attr;
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
    var countPat = new RegExp('^' + attribute + 'Count\\.');
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
        var type = 'General';
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
        if(attr == 'General' ||
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
    if(window.DEBUG) {
      var notes = attributes.notes;
      attributes.notes =
        (notes != null ? attributes.notes + '\n' : '') + debug.join('\n');
    }
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
    choices = QuilvynUtils.getKeys(this.getChoices('levels'));
    var soFar = QuilvynUtils.sumMatching(attributes, /^levels\./); 
    var level = attributes.level != null ? attributes.level : soFar;
    if(level == 0) {
      level = QuilvynUtils.random(1, 100);
      level = level<=50 ? 1 : level<=75 ? 2 : level<=87 ? 3 : level<=93 ? 4 :
              level<=96 ? 5 : level<=98 ? 6 : level<=99 ? 7 : 8;
    }
    howMany = level - soFar;
    var classes = QuilvynUtils.random(1, 100);
    classes = classes < 60 ? 1 : classes < 90 ? 2 : 3;
    if(classes > howMany) {
      classes = QuilvynUtils.random(1, howMany);
    }
    for(i = 1; howMany > 0; i++) {
      var thisLevel = i == classes ? howMany : QuilvynUtils.random(1, howMany);
      var which = 'levels.' + choices[QuilvynUtils.random(0, choices.length-1)];
      // Find a choice that is valid or can be made so
      while(attributes[which] == null) {
        attributes[which] = 1;
        if(QuilvynUtils.sumMatching(this.applyRules(attributes),
             /^validationNotes.*(BaseAttack|CasterLevel|Spells)/) == 0) {
          // ok
          attributes[which] = 0;
        } else {
          // try another
          delete attributes[which];
          which = 'levels.'+choices[QuilvynUtils.random(0, choices.length-1)];
        }
      }
      attributes[which] += thisLevel;
      howMany -= thisLevel;
    }
    attributes.level = level;
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
    attrs = this.applyRules(attributes);
    choices = [];
    for(attr in this.getChoices('weapons')) {
      if(attrs['proficient.' + attr]) {
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

  if(window.DEBUG) {
    var notes = attributes.notes;
    attributes.notes =
      (notes != null ? attributes.notes + '\n' : '') + debug.join('\n');
  }

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
  proficiencyChoices, notes
) {

  rules.defineChoice('backgrounds', name);
  rules.defineRule
    ('isBackground.' + name, 'background', '=', 'source == "' + name + '" ? 1 : null');

  if(features != null) {
    for(var i = 0; i < features.length; i++) {
      var levelAndFeature = features[i].split(/:/);
      var feature = levelAndFeature[levelAndFeature.length == 1 ? 0 : 1];
      var level = levelAndFeature.length == 1 ? 1 : levelAndFeature[0];
      var matchInfo;
      var prefix =
        name.substring(0, 1).toLowerCase() + name.substring(1).replace(/ /g, '');
      rules.defineRule(prefix + 'Features.' + feature,
        'background', '?', 'source == "' + name + '"',
        'level', '=', 'source >= ' + level + ' ? 1 : null'
      );
      rules.defineRule
        ('features.' + feature, prefix + 'Features.' + feature, '+=', null);
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

  if(notes != null)
    rules.defineNote(notes);

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
  spellSlots, notes
) {

  var classLevel = 'levels.' + name;
  rules.defineChoice('levels', name + ':' + hitDice);

  if(features != null) {
    var prefix =
      name.substring(0, 1).toLowerCase() + name.substring(1).replace(/ /g, '');
    for(var i = 0; i < features.length; i++) {
      var levelAndFeature = features[i].split(/:/);
      var feature = levelAndFeature[levelAndFeature.length == 1 ? 0 : 1];
      var level = levelAndFeature.length == 1 ? 1 : levelAndFeature[0];
      var matchInfo;
      rules.defineRule(prefix + 'Features.' + feature,
        'levels.' + name, '=', 'source >= ' + level + ' ? 1 : null'
      );
      rules.defineRule
        ('features.' + feature, prefix + 'Features.' + feature, '+=', null);
      if((matchInfo = feature.match(/^Weapon (Familiarity|Proficiency) \((.*\/.*)\)$/)) != null) {
        // Set individual features for each weapon on the list.
        var weapons = matchInfo[2].split('/');
        for(var j = 0; j < weapons.length; j++) {
          rules.defineRule('features.Weapon ' + matchInfo[1] + ' (' + weapons[j] + ')', 'features.' + feature, '=', '1');
        }
      }
    }
    rules.defineSheetElement(name + ' Features', 'Feats+', null, '; ');
  }
  if(selectableFeatures != null) {
    for(var j = 0; j < selectableFeatures.length; j++) {
      var selectable = selectableFeatures[j];
      var choice = name + ' ' + selectable;
      var nameNoSpace =
        name.substring(0,1).toLowerCase() + name.substring(1).replace(/ /g, '');
      rules.defineChoice('selectableFeatures', choice + ':' + name);
      rules.defineRule(nameNoSpace + 'Features.' + selectable,
        'selectableFeatures.' + choice, '+=', null
      );
      rules.defineRule('features.' + selectable,
        'selectableFeatures.' + choice, '+=', null
      );
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

  if(spellAbility != null) {
    rules.defineRule('spellAttackModifier.' + name,
      'levels.' + name, '?', null,
      spellAbility + 'Modifier', '=', null,
      'proficiencyBonus', '+', null
    );
    rules.defineRule('spellDifficultyClass.' + name,
      'levels.' + name, '?', null,
      spellAbility + 'Modifier', '=', '8 + source',
      'proficiencyBonus', '+', null
    );
  }

  if(spellsKnown != null || spellSlots != null) {
    rules.defineRule('casterSpellLevel.' + name,
      'levels.' + name, '=', null,
      'magicNotes.casterLevelBonusFeature', '+', null
    );
  }

  if(spellsKnown != null) {
    for(var j = 0; j < spellsKnown.length; j++) {
      var typeAndLevel = spellsKnown[j].split(/:/)[0];
      var code = spellsKnown[j].substring(typeAndLevel.length + 1).
                 split(/\//).reverse().join('source >= ');
      code = code.replace(/:/g, ' ? ').replace(/source/g, ' : source');
      code = 'source >= ' + code + ' : null';
      if(code.indexOf('source >= 1 ?') >= 0) {
        code = code.replace(/source >= 1 ./, '').replace(/ : null/, '');
      }
      rules.defineRule
        ('spellsKnown.' + typeAndLevel, 'casterSpellLevel.' + name, '=', code);
    }
  }

  if(spellSlots != null) {
    for(var j = 0; j < spellSlots.length; j++) {
      var typeAndLevel = spellSlots[j].split(/:/)[0];
      var code = spellSlots[j].substring(typeAndLevel.length + 1).
                 split(/\//).reverse().join('source >= ');
      code = code.replace(/:/g, ' ? ').replace(/source/g, ' : source');
      code = 'source >= ' + code + ' : null';
      if(code.indexOf('source >= 1 ?') >= 0) {
        code = code.replace(/source >= 1 ./, '').replace(/ : null/, '');
      }
      rules.defineRule
        ('spellSlots.' + typeAndLevel, 'casterSpellLevel.' + name, '=', code);
    }
  }

  if(notes != null)
    rules.defineNote(notes);

};

/*
 * A convenience function that adds #name# to the list of valid races in
 * #rules#.  #abilityAdjustment# is either null or a note of the form "[+-]n
 * Ability[/[+-]n Ability]*", indicating ability adjustments for the race.
 * #features# is either null or an array of strings of the form
 * "[level:]Feature", indicating a list of features associated with the race
 * and the character levels at which they're acquired.  If no level is included
 * with a feature, the feature is acquired at level 1.
 */
SRD5E.defineRace = function(
  rules, name, abilityAdjustment, features, languages, proficiencyCount,
  proficienciesGiven, proficiencyChoices, notes
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
      var levelAndFeature = features[i].split(/:/);
      var feature = levelAndFeature[levelAndFeature.length == 1 ? 0 : 1];
      var level = levelAndFeature.length == 1 ? 1 : levelAndFeature[0];
      var matchInfo;
      rules.defineRule(prefix + 'Features.' + feature,
        'isRace.' + name, '?', '1',
        'level', '=', 'source >= ' + level + ' ? 1 : null'
      );
      rules.defineRule
        ('features.' + feature, prefix + 'Features.' + feature, '+=', null);
      if((matchInfo = feature.match(/^Weapon (Familiarity|Proficiency) \((.*\/.*)\)$/)) != null) {
        // Set individual features for each weapon on the list.
        var weapons = matchInfo[2].split('/');
        for(var j = 0; j < weapons.length; j++) {
          rules.defineRule('features.Weapon ' + matchInfo[1] + ' (' + weapons[j] + ')', 'features.' + feature, '=', '1');
        }
      }
    }
    rules.defineSheetElement(name + ' Features', 'Feats+', null, '; ');
  }

  if(languages != null) {
    rules.defineRule('languageCount', 'isRace.' + name, '+', languages.length);
    for(var i = 0; i < languages.length; i++) {
      if(languages[i] != '')
        rules.defineRule
          ('languages.' + languages[i], 'isRace.' + name, '=', '1');
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

  if(notes != null)
    rules.defineNote(notes);

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
