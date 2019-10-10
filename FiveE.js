/*
Copyright 2019, James J. Hayes

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

var FiveE_VERSION = '0.1.0';

/*
 * This module loads the rules from Fifth Edition.  The FiveE function
 * contains methods that load rules for particular parts of the rules;
 * raceRules for character races, magicRules for spells, etc.  These member
 * methods can be called independently in order to use a subset of the Fifth
 * Edition rules.  Similarly, the constant fields of FiveE (ALIGNMENTS,
 * FEATS, etc.) can be manipulated to modify the choices.
 */
function FiveE() {
  var rules = new ScribeRules('FiveE', FiveE_VERSION);
  rules.editorElements = FiveE.initialEditorElements();
  rules.randomizeOneAttribute = FiveE.randomizeOneAttribute;
  rules.makeValid = FiveE.makeValid;
  rules.ruleNotes = FiveE.ruleNotes;
  FiveE.viewer = new ObjectViewer();
  FiveE.createViewers(rules, FiveE.VIEWERS);
  FiveE.abilityRules(rules);
  FiveE.raceRules(rules, FiveE.LANGUAGES, FiveE.RACES);
  FiveE.classRules(rules, FiveE.CLASSES);
  FiveE.backgroundRules(rules, FiveE.BACKGROUNDS);
/*
  FiveE.companionRules(rules, FiveE.ANIMAL_COMPANIONS, FiveE.FAMILIARS);
*/
  FiveE.skillRules(rules, FiveE.SKILLS, FiveE.TOOLS);
  FiveE.featRules(rules, FiveE.FEATS);
  FiveE.descriptionRules(rules, FiveE.ALIGNMENTS, FiveE.DEITIES, FiveE.GENDERS);
  FiveE.equipmentRules
    (rules, FiveE.ARMORS, FiveE.GOODIES, FiveE.SHIELDS, FiveE.WEAPONS);
  FiveE.combatRules(rules);
  FiveE.movementRules(rules);
  FiveE.magicRules(rules, FiveE.CLASSES, FiveE.DOMAINS, FiveE.SCHOOLS);
  FiveE.spellDescriptionRules(rules);
  rules.defineChoice('preset', 'background', 'race', 'level', 'levels');
  rules.defineChoice('random', FiveE.RANDOMIZABLE_ATTRIBUTES);
  Scribe.addRuleSet(rules);
  FiveE.rules = rules;
}

// Arrays of choices
FiveE.ALIGNMENTS = [
  'Chaotic Evil', 'Chaotic Good', 'Chaotic Neutral', 'Neutral', 'Neutral Evil',
  'Neutral Good', 'Lawful Evil', 'Lawful Good', 'Lawful Neutral'
];
/*
FiveE.ANIMAL_COMPANIONS = {
  'Badger': 'HD=1 AC=15 Dam=2x1d2-1,1d3-1 Str=8 Dex=17 Con=15 Int=2 Wis=12 Cha=6',
  'Camel': 'HD=3 AC=13 Dam=1d4+2 Str=18 Dex=16 Con=14 Int=2 Wis=11 Cha=4',
  'Crocodile': 'HD=3 AC=15 Dam=1d8+6,1d12+6 Str=19 Dex=12 Con=17 Int=1 Wis=12 Cha=2',
  'Dire Rat': 'HD=1 AC=15 Dam=1d4 Str=10 Dex=17 Con=12 Int=1 Wis=12 Cha=4',
  'Dog': 'HD=1 AC=15 Dam=1d4+1 Str=13 Dex=17 Con=15 Int=2 Wis=12 Cha=6',
  'Riding Dog': 'HD=2 AC=16 Dam=1d6+3 Str=15 Dex=15 Con=15 Int=2 Wis=12 Cha=6',
  'Eagle': 'HD=1 AC=14 Dam=2x1d4,1d4 Str=10 Dex=15 Con=12 Int=2 Wis=14 Cha=6',
  'Hawk': 'HD=1 AC=17 Dam=1d4-2 Str=6 Dex=17 Con=10 Int=2 Wis=14 Cha=6',
  'Heavy Horse': 'HD=3 AC=13 Dam=1d6+1 Str=16 Dex=13 Con=15 Int=2 Wis=12 Cha=6',
  'Light Horse': 'HD=3 AC=13 Dam=1d4+1 Str=14 Dex=13 Con=15 Int=2 Wis=12 Cha=6',
  'Medium Shark': 'HD=3 AC=15 Dam=1d6+1 Str=13 Dex=15 Con=13 Int=1 Wis=12 Cha=2',
  'Medium Viper': 'HD=2 AC=16 Dam=1d4-2 Str=8 Dex=17 Con=11 Int=1 Wis=12 Cha=2',
  'Owl': 'HD=1 AC=17 Dam=1d4-3 Str=4 Dex=17 Con=10 Int=2 Wis=14 Cha=4',
  'Pony': 'HD=2 AC=13 Dam=1d3 Str=13 Dex=13 Con=12 Int=2 Wis=11 Cha=4',
  'Porpoise': 'HD=2 AC=15 Dam=2d4 Str=11 Dex=17 Con=13 Int=2 Wis=12 Cha=6',
  'Small Viper': 'HD=1 AC=17 Dam=1d2-2 Str=6 Dex=17 Con=11 Int=1 Wis=12 Cha=2',
  'Squid': 'HD=3 AC=16 Dam=0 Str=14 Dex=17 Con=11 Int=1 Wis=12 Cha=2',
  'Wolf': 'HD=2 AC=14 Dam=1d6+1 Str=13 Dex=15 Con=15 Int=2 Wis=12 Cha=6',

  'Ape': 'HD=4 AC=14 Dam=1d6+5 Str=21 Dex=15 Con=14 Int=2 Wis=12 Cha=7 Level=4',
  'Bison': 'HD=5 AC=13 Dam=1d8+9 Str=22 Dex=10 Con=16 Int=2 Wis=11 Cha=4 Level=4',
  'Black Bear': 'HD=3 AC=13 Dam=2x1d4+4,1d6+2 Str=19 Dex=13 Con=15 Int=2 Wis=12 Cha=6 Level=4',
  'Boar': 'HD=3 AC=16 Dam=1d8+3 Str=15 Dex=10 Con=17 Int=2 Wis=13 Cha=4 Level=4',
  'Cheetah': 'HD=3 AC=15 Dam=2x1d2+1,1d6+3 Str=16 Dex=19 Con=15 Int=2 Wis=12 Cha=6 Level=4',
  'Constrictor': 'HD=3 AC=15 Dam=1d3+4 Str=17 Dex=17 Con=13 Int=1 Wis=12 Cha=2 Level=4',
  'Dire Badger': 'HD=3 AC=16 Dam=2x1d4+2,1d6+1 Str=14 Dex=17 Con=19 Int=2 Wis=12 Cha=10 Level=4',
  'Dire Bat': 'HD=4 AC=20 Dam=1d8+4 Str=17 Dex=22 Con=17 Int=2 Wis=14 Cha=6 Level=4',
  'Dire Weasel': 'HD=3 AC=16 Dam=1d6+3 Str=14 Dex=19 Con=10 Int=2 Wis=12 Cha=11 Level=4',
  'Large Shark': 'HD=7 AC=15 Dam=1d8+4 Str=17 Dex=15 Con=13 Int=1 Wis=12 Cha=2 Level=4',
  'Large Viper': 'HD=3 AC=15 Dam=1d4 Str=10 Dex=17 Con=11 Int=1 Wis=12 Cha=2 Level=4',
  'Leopard': 'HD=3 AC=15 Dam=1d6+3 Str=16 Dex=19 Con=15 Int=2 Wis=12 Cha=6 Level=4',
  'Monitor Lizard': 'HD=3 AC=15 Dam=1d8+4 Str=17 Dex=15 Con=17 Int=1 Wis=12 Cha=2 Level=4',
  'Wolverine': 'HD=3 AC=14 Dam=2x1d4+2,1d6+1 Str=14 Dex=15 Con=19 Int=2 Wis=12 Cha=10 Level=4',

  'Brown Bear': 'HD=6 AC=15 Dam=1d8+8,2d6+4 Str=27 Dex=13 Con=19 Int=2 Wis=12 Cha=6 Level=7',
  'Deinonychus': 'HD=4 AC=17 Dam=1d8+4,2x1d3+2,2d4+2 Str=19 Dex=15 Con=19 Int=2 Wis=12 Cha=10 Level=7',
  'Dire Ape': 'HD=5 AC=15 Dam=2x1d6+6,1d8+3 Str=22 Dex=15 Con=14 Int=2 Wis=12 Cha=7 Level=7',
  'Dire Boar': 'HD=7 AC=15 Dam=1d8+12 Str=27 Dex=10 Con=17 Int=2 Wis=13 Cha=8 Level=7',
  'Dire Wolf': 'HD=6 AC=14 Dam=1d8+10 Str=25 Dex=15 Con=17 Int=2 Wis=12 Cha=10 Level=7',
  'Dire Wolverine': 'HD=5 AC=16 Dam=2x1d6+6,1d8+3 Str=22 Dex=17 Con=19 Int=2 Wis=12 Cha=10 Level=7',
  'Elasmosaurus': 'HD=10 AC=13 Dam=2d8+12 Str=26 Dex=14 Con=22 Int=2 Wis=13 Cha=9 Level=7',
  'Giant Crocodile': 'HD=7 AC=16 Dam=2d8+12,1d12+12 Str=27 Dex=12 Con=19 Int=1 Wis=12 Cha=2 Level=7',
  'Huge Viper': 'HD=6 AC=15 Dam=1d6+4 Str=16 Dex=15 Con=13 Int=1 Wis=12 Cha=2 Level=7',
  'Lion': 'HD=5 AC=15 Dam=2x1d4+5,1d8+2 Str=21 Dex=17 Con=15 Int=2 Wis=12 Cha=6 Level=7',
  'Rhinoceros': 'HD=8 AC=16 Dam=2d6+12 Str=26 Dex=10 Con=21 Int=2 Wis=13 Cha=2 Level=7',
  'Tiger': 'HD=6 AC=14 Dam=2x1d8+6,2d6+3 Str=23 Dex=15 Con=17 Int=2 Wis=12 Cha=6 Level=7',

  'Dire Lion': 'HD=8 AC=15 Dam=2x1d6+7,1d8+3 Str=25 Dex=15 Con=17 Int=2 Wis=12 Cha=10 Level=10',
  'Giant Constrictor': 'HD=11 AC=15 Dam=1d8+10 Str=25 Dex=17 Con=13 Int=1 Wis=12 Cha=2 Level=10',
  'Huge Shark': 'HD=10 AC=15 Dam=2d6+7 Str=21 Dex=15 Con=15 Int=1 Wis=12 Cha=2 Level=10',
  'Megaraptor': 'HD=8 AC=17 Dam=2d6+5,2x1d4+2,1d8+2 Str=21 Dex=15 Con=21 Int=2 Wis=15 Cha=6 Level=10',
  'Orca': 'HD=9 AC=15 Dam=2d6+12 Str=27 Dex=15 Con=21 Int=2 Wis=14 Cha=6 Level=10',
  'Polar Bear': 'HD=8 AC=15 Dam=2x1d8+8,2d6+4 Str=27 Dex=13 Con=19 Int=2 Wis=12 Cha=6 Level=10',

  'Dire Bear': 'HD=12 AC=17 Dam=2x2d4+10,2d8+5 Str=31 Dex=13 Con=19 Int=2 Wis=12 Cha=10 Level=13',
  'Elephant': 'HD=11 AC=15 Dam=2d6+10,2d6+5 Str=30 Dex=10 Con=21 Int=2 Wis=13 Cha=7 Level=13',
  'Giant Octopus': 'HD=8 AC=18 Dam=8x1d4+5,1d8+2 Str=20 Dex=15 Con=13 Int=2 Wis=12 Cha=3 Level=13',

  'Dire Shark': 'HD=18 AC=17 Dam=2d8+9 Str=23 Dex=15 Con=17 Int=1 Wis=12 Cha=10 Level=16',
  'Dire Tiger': 'HD=16 AC=17 Dam=2x2d4+8,2d6+4 Str=27 Dex=15 Con=17 Int=2 Wis=12 Cha=10 Level=16',
  'Giant Squid': 'HD=12 AC=17 Dam=10x1d6+8,2d8+4 Str=26 Dex=17 Con=13 Int=1 Wis=12 Cha=2 Level=16',
  'Triceratops': 'HD=16 AC=18 Dam=2d8+15 Str=30 Dex=9 Con=25 Int=1 Wis=12 Cha=7 Level=16',
  'Tyrannosaurus': 'HD=18 AC=14 Dam=3d6+13 Str=29 Dex=12 Con=21 Int=2 Wis=15 Cha=10 Level=16'
};
*/
FiveE.ARMORS = [
  'None:', 'Padded:L', 'Leather:L', 'Studded Leather:L', 'Hide:M',
  'Chain Shirt:L', 'Scale Mail:M', 'Breastplate:M', 'Half Plate:M',
  'Ring Mail:H', 'Chain Mail:H', 'Splint:H', 'Plate:H'
];
FiveE.BACKGROUNDS = [
  'Acolyte', 'Charlatan', 'Criminal', 'Entertainer', 'Folk Hero',
  'Guild Artisan', 'Hermit', 'Noble', 'Outlander', 'Sage', 'Sailor', 'Soldier',
  'Urchin'
];
FiveE.BARD_COLLEGES = ['Lore', 'Valor'];
FiveE.BARBARIAN_PATHS = ['Berserker', 'Totem Warrior'];
FiveE.BARBARIAN_TOTEMS = ['Bear', 'Eagle', 'Wolf'];
FiveE.CLASSES = [
  'Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk', 'Paladin',
  'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard'
];
FiveE.DEITIES = [
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
FiveE.DOMAINS = [
  'Knowledge', 'Life', 'Light', 'Nature', 'Tempest', 'Trickery', 'War'
];
/*
FiveE.FAMILIARS = {
  'Bat': 'HD=1 AC=16 Dam=0 Str=1 Dex=15 Con=10 Int=2 Wis=14 Cha=4',
  'Cat': 'HD=1 AC=14 Dam=2@1d2-4,1d3-4 Str=3 Dex=15 Con=10 Int=2 Wis=12 Cha=7',
  'Hawk': 'HD=1 AC=17 Dam=1d4-2 Str=6 Dex=17 Con=10 Int=2 Wis=14 Cha=6',
  'Lizard': 'HD=1 AC=14 Dam=1d4-4 Str=3 Dex=15 Con=10 Int=1 Wis=12 Cha=2',
  'Owl': 'HD=1 AC=17 Dam=1d4-3 Str=4 Dex=17 Con=10 Int=2 Wis=14 Cha=4',
  'Rat': 'HD=1 AC=14 Dam=1d3-4 Str=2 Dex=15 Con=10 Int=2 Wis=12 Cha=2',
  'Raven': 'HD=1 AC=14 Dam=1d2-5 Str=1 Dex=15 Con=10 Int=2 Wis=14 Cha=6',
  'Tiny Viper': 'HD=1 AC=17 Dam=1 Str=4 Dex=17 Con=11 Int=1 Wis=12 Cha=2',
  'Toad': 'HD=1 AC=15 Dam=0 Str=1 Dex=12 Con=11 Int=1 Wis=14 Cha=4',
  'Weasel': 'HD=1 AC=14 Dam=1d3-4 Str=3 Dex=15 Con=10 Int=2 Wis=12 Cha=5',

  'Air Mephit': 'HD=3 AC=17 Dam=1d3 Str=10 Dex=17 Con=10 Int=6 Wis=11 Cha=15 Level=7',
  'Dust Mephit': 'HD=3 AC=17 Dam=1d3 Str=10 Dex=17 Con=10 Int=6 Wis=11 Cha=15 Level=7',
  'Earth Elemental': 'HD=2 AC=17 Dam=1d6+4 Str=17 Dex=8 Con=13 Int=4 Wis=11 Cha=11 Level=5',
  'Earth Mephit': 'HD=3 AC=16 Dam=1d3+3 Str=17 Dex=8 Con=13 Int=6 Wis=11 Cha=15 Level=7',
  'Fire Elemental': 'HD=2 AC=15 Dam=1d4+1d4 Str=10 Dex=13 Con=10 Int=4 Wis=11 Cha=11 Level=5',
  'Fire Mephit': 'HD=3 AC=16 Dam=1d3+1d4 Str=10 Dex=13 Con=10 Int=6 Wis=11 Cha=15 Level=7',
  'Formian Worker': 'HD=1 AC=17 Dam=1d4+1 Str=13 Dex=14 Con=13 Int=6 Wis=10 Cha=9 Level=7',
  'Homunculus': 'HD=2 AC=14 Dam=1d4-1 Str=8 Dex=15 Con=0 Int=10 Wis=12 Cha=7 Level=7',
  'Ice Mephit': 'HD=3 AC=18 Dam=1d3+1d4 Str=10 Dex=17 Con=10 Int=6 Wis=11 Cha=15 Level=7',
  'Imp': 'HD=3 AC=20 Dam=1d4 Str=10 Dex=17 Con=10 Int=10 Wis=12 Cha=14 Level=7',
  'Magma Mephit': 'HD=3 AC=16 Dam=1d3+1d4 Str=10 Dex=13 Con=10 Int=6 Wis=11 Cha=15 Level=7',
  'Ooze Mephit': 'HD=3 AC=16 Dam=1d3+2 Str=14 Dex=10 Con=13 Int=6 Wis=11 Cha=15 Level=7',
  'Pseudodragon': 'HD=2 AC=18 Dam=1d3-2 Str=6 Dex=15 Con=13 Int=10 Wis=12 Cha=10 Level=7',
  'Quasit': 'HD=3 AC=18 Dam=1d3-1 Str=8 Dex=17 Con=10 Int=10 Wis=12 Cha=10 Level=7',
  'Salt Mephit': 'HD=3 AC=16 Dam=1d3+3 Str=17 Dex=8 Con=13 Int=6 Wis=11 Cha=15 Level=7',
  'Shocker Lizard': 'HD=2 AC=16 Dam=1d4 Str=10 Dex=15 Con=13 Int=2 Wis=12 Cha=6 Level=5',
  'Steam Mephit': 'HD=3 AC=16 Dam=1d3+1d4 Str=10 Dex=13 Con=10 Int=6 Wis=11 Cha=15 Level=7',
  'Stirge': 'HD=1 AC=16 Dam=0 Str=3 Dex=19 Con=10 Int=1 Wis=12 Cha=6 Level=5',
  'Water Elemental': 'HD=2 AC=17 Dam=1d6+3 Str=14 Dex=10 Con=13 Int=4 Wis=11 Cha=11 Level=5',
  'Water Mephit': 'HD=3 AC=16 Dam=1d3+2 Str=14 Dex=10 Con=13 Int=6 Wis=11 Cha=15 Level=7',

  'Celestial': 'Level=3',
  'Fiendish': 'Level=3'

};
*/
FiveE.FEATS = [
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
FiveE.GENDERS = ['Female', 'Male'];
FiveE.GOODIES = [
  'Ring Of Protection +1',
  'Ring Of Protection +2',
  'Ring Of Protection +3',
  'Ring Of Protection +4'
];
FiveE.LANGUAGES = [
  'Abyssal', 'Celestial', 'Common', 'Deep Speech', 'Draconic', 'Dwarvish',
  'Elvish', 'Giant', 'Gnomish', 'Goblin', 'Halfling', 'Infernal', 'Orc',
  'Primordial', 'Sylvan', 'Undercommon'
];
FiveE.RACES = [
  'Black Dragonborn', 'Blue Dragonborn', 'Brass Dragonborn',
  'Bronze Dragonborn', 'Copper Dragonborn', 'Gold Dragonborn',
  'Green Dragonborn', 'Red Dragonborn', 'Silver Dragonborn',
  'White Dragonborn', 'Hill Dwarf', 'Mountain Dwarf', 'High Elf', 'Wood Elf',
  'Dark Elf', 'Forest Gnome', 'Rock Gnome', 'Half-Elf', 'Half-Orc',
  'Lightfoot Halfling', 'Stout Halfling', 'Human', 'Tiefling'
];
// Note: the order here handles dependencies among attributes when generating
// random characters
FiveE.RANDOMIZABLE_ATTRIBUTES = [
  'charisma', 'constitution', 'dexterity', 'intelligence', 'strength', 'wisdom',
  'name', 'race', 'gender', 'alignment', 'background', 'deity', 'levels',
  'features', 'feats', 'skills', 'languages', 'hitPoints', 'armor', 'shield',
  'weapons', 'spells', 'tools', 'goodies'
];
FiveE.SCHOOLS = [
  'Abjuration:Abju', 'Conjuration:Conj', 'Divination:Divi', 'Enchantment:Ench',
  'Evocation:Evoc', 'Illusion:Illu', 'Necromancy:Necr', 'Transmutation:Tran'
];
FiveE.TOOLS = [
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
FiveE.SHIELDS = [
  'Buckler', 'Heavy Steel', 'Heavy Wooden', 'Light Steel', 'Light Wooden',
  'None'
];
FiveE.SKILLS = [
  'Acrobatics:dex', 'Animal Handling:wis', 'Arcana:int', 'Athletics:str',
  'Deception:cha', 'History:int', 'Insight:wis', 'Intimidation:cha',
  'Investigation:int', 'Medicine:wis', 'Nature:int', 'Perception:wis',
  'Performance:cha', 'Persuasion:cha', 'Religion:int', 'Sleight Of Hand:dex',
  'Stealth:dex', 'Survival:wis'
];
FiveE.VIEWERS = ['Compact', 'Standard', 'Vertical'];
FiveE.WEAPONS = [
  'Battleaxe:d10M', 'Blowgun:d1r25M', 'Club:d4S', 'Dagger:d4S', 'Dart:d4r20S',
  'Flail:d8M', 'Glaive:d10M', 'Greataxe:d12M', 'Greatclub:d8S',
  'Greatsword:2d6M', 'Halberd:d10M', 'Hand Crossbow:d6r30M', 'Handaxe:d6r20S',
  'Heavy Crossbow:d10r100M', 'Javelin:d6r30S', 'Lance:d12M',
  'Light Crossbow:d8r80S', 'Light Hammer:d4r20S', 'Longbow:d8r150M',
  'Longsword:d10M', 'Mace:d6S', 'Maul:2d6M', 'Morningstar:d8M', 'Net:d0r5M',
  'Pike:d10M', 'Quarterstaff:d8S', 'Rapier:d8M', 'Scimitar:d6M',
  'Shortbow:d6r80S', 'Shortsword:d6M', 'Sickle:d4S', 'Sling:d4r30S',
  'Spear:d8r20S', 'Trident:d8r20M', 'Unarmed:d1S', 'War Pick:d8',
  'Warhammer:d8M', 'Whip:d4M'
];

// Related information used internally by FiveE
FiveE.armorsArmorClassBonuses = {
  'None': null, 'Padded': 1, 'Leather': 1, 'Studded Leather': 2,
  'Hide': 2, 'Chain Shirt': 3, 'Scale Mail': 4, 'Breastplate': 4,
  'Half Plate': 5, 'Ring Mail': 4, 'Chainmail': 6, 'Splint': 7, 'Plate': 8
};
FiveE.armorsMaxDexBonuses = {
  'None': null, 'Padded': null, 'Leather': null, 'Studded Leather': null,
  'Hide': 2, 'Chain Shirt': 2, 'Scale Mail': 2, 'Breastplate': 2,
  'Half Plate': 2, 'Ring Mail': 0, 'Chainmail': 0, 'Splint': 0, 'Plate': 0
};
FiveE.draconicBreathTypes = {
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
FiveE.proficiencyLevelNames = ['None', 'Light', 'Medium', 'Heavy'];
FiveE.spellsAbbreviations = {
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
FiveE.spellsDescriptions = {
/*
  "Antipathy": "Named kind/align creatures Will save or avoid $L10' cube for $L2 hr",
  "Antiplant Shell": "10'-radius bars animate plants for $L min",
  "Arcane Eye": "Invisible remote eye moves 30' for $L min",
  "Arcane Lock": "Magical lock on door/portal/chest open DC +10 with lock/20 otherwise",
  "Arcane Mark": "Permanent in/visible personal rune on object/creature",
  "Arcane Sight": "R120' See auras/spell abilities for $L min, DC 15+level to know school",
  "Astral Projection": "Projects you and others to Astral Plane",
  "Atonement": "Restore alignment/holy powers",
  "Augury": "${Math.min(70 + lvl, 90)}% chance to know weal/woe of act proposed w/in 30 min",
  "Awaken": "Animal/tree target gains human sentience",
  "Baleful Polymorph": "R$RS' Target Fort save or become 1HD creature, Will save to keep abilities",
  "Bane": "Enemies w/in 50' Will save or -1 attack/fear saves $L min",
  "Banishment": "R$RS' $L2 HD extraplanar creatures Will save or banished from plane",
  "Barkskin": "+$BarkskinAC natural armor for $L10 min",
  "Bear's Endurance": "Touched +4 Con for $L min",
  "Beast Shape I": "Become small (+2 Dex/+1 AC) or medium (+2 Str/+2 AC) animal for $L min",
  "Beast Shape II": "Become tiny (+4 Dex/-2 Str/+1 AC) or large (+4 Str/-2 Dex/+4 AC) animal for $L min",
  "Beast Shape III": "Become dimunitive (+6 Dex/-4 Str/+1 AC) or huge (+6 Str/-4 Dex/+6 AC) animal or small (+4 Dex/+2 AC) or medium (+4 Str/+4 AC) magical beast for $L min",
  "Beast Shape IV": "Become tiny (+8 Dex/-2 Str/+3 AC) or large (+6 Str/-2 Dex/+2 Con/+6 AC) magical beast for $L min",
  "Bestow Curse": "Touched Will save or permanent -6 ability, -4 attack/saves/checks, or 50% chance/rd of losing action",
  "Binding": "R$RS' Target Will save (min $Ldiv2 HD) or magically imprisoned",
  "Black Tentacles": "R$RM' Tentacles grapple (CMB/CMD ${lvl + 5}/${lvl + 15}) 20' radius, 1d6+4/rd HP for $L rd",
  "Blade Barrier": "R$RM' Blade wall ${Lmin15}d6 HP (Ref half) for $L min",
  "Blasphemy": "Nonevil creatures w/in 40' with equal/-1/-5/-10 HD Will save or dazed 1 rd/-2d6 Str (save half) 2d4 rd/paralyzed 1d10 min (save 1 rd)/killed (save 3d6+$Lmin25 HP)",
  "Bleed": "R$RS' Stabilized target Will save or resume dying",
  "Bless": "R50' Allies +1 attack/fear saves for $L min",
  "Bless Water": "Makes 1 pint holy water",
  "Bless Weapon": "Weapon good aligned, +1 vs. evil foe DR for $L min",
  "Blight": "Touched plant ${Lmin15}d6 HP, Fort half",
  "Blindness/Deafness": "R$RM' target Fort save or permanently blind or deaf",
  "Blink": "Self randomly ethereal for $L rd--foes 50% miss chance, half HP from area attacks/falling",
  "Blur": "Self foes 20% miss chance for $L min",
  "Break Enchantment": "R$RS' $L targets freed from enchantments/transmutations/curses",
  "Breath Of Life": "Heal 5d8+$L/max 25 plus resurrect target dead lt 1 rd",
  "Bull's Strength": "Touched +4 Str for $L min",
  "Burning Hands": "R15' cone ${Lmin5}d4 HP (Ref half)",
  "Call Lightning": "R$RM' $L bolts 3d6 HP (Ref half), 1/rd for $L min",
  "Call Lightning Storm": "R$RL' 15 bolts 5d6 HP (Ref half), 1/rd for $L min",
  "Calm Animals": "R$RS' 2d4+$L HD of animals Will save or docile for $L min",
  "Calm Emotions": "R$RM' Creatures in 20' radius Will save or pacified $L rd/conc",
  "Cat's Grace": "Touched +4 Dex for $L min",
  "Cause Fear": "R$RS' Target le 5 HD flee for 1d4 rd (Will shaken 1 rd)",
  "Chain Lightning": "R$RL' ${Lmin20}d6 HP primary/$Lmin20 secondary targets (Ref half, secondary save at +2)",
  "Changestaff": "Staff becomes treant-like creature for $L hr",
  "Chaos Hammer": "R$RM' Lawful in 20'-radius burst ${Math.min(Math.floor(source/2),5)}d8 HP and slowed 1d6 rd, neutral half (Will half)",
  "Charm Animal": "R$RS' Target Will save or treats you as trusted friend for $L hr",
  "Charm Monster": "R$RS' Target Will save or treats you as trusted friend for $L dy",
  "Charm Person": "R$RS' Target Will save or treats you as trusted friend for $L hr",
  "Chill Metal": "R$RS' Metal of $Ldiv2 creatures Will save or 0/1/2/2/2/1/0d4 HP for 7 rd",
  "Chill Touch": "$L touched Will save or 1d6 HP negative energy, Fort save or 1 Str (undead flee 1d4+$L rd instead)",
  "Circle Of Death": "R$RM' ${Lmin20}d4 HD of creatures le 8 HD in 40' Fort save or die",
  "Clairaudience/Clairvoyance": "$RL' Remote sight or hearing for $L min",
  "Clenched Fist": "R$RM' 10' (AC 20, caster HP) hand cover (+4 AC), move 60', hit (+$L+mod for 1d8+11, Fort save or stunned 1 rd), bull rush (CMB ${lvl + 12}) for $L rd",
  "Cloak Of Chaos": "$L targets in 20' +4 AC/saves and SR 25 and mental protection vs. lawful, lawful hits cause Will save or confused 1 rd for $L rd",
  "Clone": "Soul enters duplicate if original dies",
  "Cloudkill": "R$RM' 20' cylinder moves away 10', 1-3 HD die, 4-6 HD die (Fort 1d4 Con), 6+ HD 1d4 Con (Fort half) for $L min",
  "Color Spray": "R15' cone targets with 2/4/any HD Will save or unconscious 2d4 rd/blind 1d4 rd/stunned 1 rd",
  "Command": "R$RS' Target Will save or approach/drop/fall/flee/halt for 1 rd",
  "Command Plants": "R$RS' $L2 HD plant creatures Will save or obey for $L dy",
  "Command Undead": "R$RS' Undead target Will save or obey for $L dy",
  "Commune": "Deity answers $L yes/no questions",
  "Commune With Nature": "Learn natural facts for $L mi outdoors/$L100' underground",
  "Comprehend Languages": "Self understands all languages for $L10 min",
  "Cone Of Cold": "R60' cone ${Lmin15}d6 HP (Ref half)",
  "Confusion": "R$RM' Creatures in 15' radius Will save or randomly normal/babble/d8+str to self/attack nearest for $L rd",
  "Consecrate": "R$RS' Positive energy in 20' radius gives undead -1 attack/damage/saves for $L2 hr",
  "Contact Other Plane": "Ask $Ldiv2 questions of extraplanar entity",
  "Contagion": "Touched Fort save or diseased",
  "Contingency": "Set trigger for ${Math.min(Math.floor(source / 3), 6)}-level spell for $L dy",
  "Continual Flame": "Touched emits heatless torch flame permanently",
  "Control Plants": "R$RS' $L2 HD plant creatures Will save or obey for $L min",
  "Control Undead": "R$RS' Undead target Will save or obey for $L min",
  "Control Water": "R$RL' Raise/lower ${Math.pow(source, 3)} 10'x10'x2' of water $L2' for $L10 min",
  "Control Weather": "Create seasonal weather in 2 mi radius for 4d12 hr",
  "Control Winds": "R$L40' Changes wind direction/speed in $L40'x40' cylinder for $L10 min",
  "Corrupt Weapon": "Weapon evil aligned, +1 vs. good foe DR for $L min",
  "Create Food And Water": "Daily food/water for $L3 humans/$L horses",
  "Create Undead": "Raise ghoul/ghast/mummy/mohrg from physical remains at level -/12/15/18",
  "Create Greater Undead": "Raise shadow/wraith/spectr/devourer from physical remains at level -/16/18/20",
  "Create Water": "R$RS' Creates $L2 gallons of pure water",
  "Creeping Doom": "R${Math.min(25 + 5 * Math.floor(source / 2), 100)}' Four 60-HP insect swarms 4d6 HP obey for $L rd",
  "Crushing Despair": "R30' cone Targets Will save or -2 attack/damage/saves/checks for $L min",
  "Crushing Hand": "R$RM' 10' (AC 20, caster HP) hand cover (+4 AC), move 60', grapple (CMB ${lvl + 12}, 2d6+12 HP) for $L rd",
  "Cure Critical Wounds": "Touched heal/damage undead 4d8+$Lmin20 (Will half)",
  "Cure Light Wounds": "Touched heal/damage undead 1d8+$Lmin5 (Will half)",
  "Cure Minor Wounds": "Touched heal 1 HP",
  "Cure Moderate Wounds": "Touched heal/damage undead 2d8+$Lmin10 (Will half)",
  "Cure Serious Wounds": "Touched heal/damage undead 3d8+$Lmin15 (Will half)",
  "Curse Water": "Makes 1 pint unholy water",
  "Dancing Lights": "R$RM' 4 torch lights in 10' radius move 100' for 1 min",
  "Darkness": "Touched lowers illumination one step in 20'-radius for $L min",
  "Darkvision": "Touched sees 60' in total darkness for $L hr",
  "Daylight": "Touched radiates 60'-radius illumination for $L10 min",
  "Daze": "R$RS' Humanoid target le 4 HD Will save or lose next action",
  "Daze Monster": "R$RM' Creature target le 6 HD Will save or lose next action",
  "Death Knell": "Touched w/negative HP Will save or die and you gain 1d8 HP/+2 Str/+1 caster level for 10*target HD min",
  "Death Ward": "Touched +4 vs. death spells/effects, immune drain for $L min",
  "Deathwatch": "R30' cone Reveals state of targets for $L10 min",
  "Deep Slumber": "R$RS' 10 HD of targets Will save or sleep $L min",
  "Deeper Darkness": "Touched lowers illumination two steps in 60'-radius for $L10 min",
  "Delay Poison": "Touched immune to poison for $L hr",
  "Delayed Blast Fireball": "R$RL' ${Lmin20}d6 HP (Ref half) in 20' radius, delay le 5 rd",
  "Demand": "25-word message to target, Will save or carry out suggestion",
  "Desecrate": "R$RS' Negative energy in 20' radius gives undead +1 attack/damage/saves/HP per HD for $L2 hr",
  "Destruction": "R$RS' Target $L10 HP, consumed if slain (Fort 10d6 HP)",
  "Detect Animals Or Plants": "R$RL' cone info on animals/plants for $L10 min",
  "Detect Chaos": "R60' cone info on chaotic auras for $L10 min",
  "Detect Evil": "R60' cone info on evil auras for $L10 min",
  "Detect Good": "R60' cone info on good auras for $L10 min",
  "Detect Law": "R60' cone info on lawful auras for $L10 min",
  "Detect Magic": "R60' cone info on magical auras for $L min",
  "Detect Poison": "R$RS' Detects poison in target, DC20 Wis/Alchemy check for type",
  "Detect Scrying": "R40' Detects scrying, opposed caster check to see source",
  "Detect Secret Doors": "R60' cone info on secret doors for $L min",
  "Detect Snares And Pits": "R60' cone info on traps $L10 min",
  "Detect Thoughts": "R60' cone info on thoughts for $L min",
  "Detect Undead": "R60' cone info on undead auras for $L min",
  "Dictum": "R40' Nonlawful creatures with equal/-1/-5/-10 HD Will save or deafened 1d4 rd/staggered 2d4 rd (save 1d4)/paralyzed 1d10 min (save 1 rd)/killed (save 3d6+$Lmin25 HP)",
  "Dimension Door": "Teleports self and touched willing object/creature $RL'",
  "Dimensional Anchor": "R$RM' Ranged touch bars extradimensional travel for $L min",
  "Dimensional Lock": "R$RM' Bar extradimensional travel in 20' radius for $L dy",
  "Diminish Plants": "Prunes/blights growth of normal plants",
  "Discern Lies": "R$RS' Reveals lies from $L creatures for $L rd/conc",
  "Discern Location": "Know exact location of creature/object",
  "Disguise Self": "Self change appearance/+10 disguise for $L10 min",
  "Disintegrate": "R$RM' Target ${Math.min(lvl*2,40)}d6 HP (Fort half), dust if slain",
  "Dismissal": "R$RS' Target Will save or returned to native plane",
  "Dispel Chaos": "Touched +4 AC vs. chaotic/touch to dismiss chaotic creature/spell",
  "Dispel Evil": "Touched +4 AC vs. evil/touch to dismiss evil creature/spell",
  "Dispel Good": "Touched +4 AC vs. good/touch to dismiss good creature/spell",
  "Dispel Law": "Touched +4 AC vs. lawful/touch to dismiss lawful creature/spell",
  "Dispel Magic": "R$RM' d20+$L vs. 11+caster level cancels spell/effect",
  "Displacement": "Attacks on touched 50% miss for $L rd",
  "Disrupt Undead": "R$RS' Ranged touched undead 1d6 HP",
  "Disrupting Weapon": "Undead hit w/touched weapon Will save or destroyed for $L rd",
  "Divination": "${Math.min(70 + lvl, 90)}% chance for advice on act proposed w/in a week",
  "Divine Favor": "Self +${Math.min(Math.floor(lvl/3),3)} attack/damage for 1 min",
  "Divine Power": "Self +${Math.min(Math.floor(lvl/3),6)} attack/damage/Str check, +$L HP for $L rd",
  "Dominate Animal": "R$RS' Target animal Will save or obey thoughts for $L rd",
  "Dominate Monster": "R$RS' Target Will save or obey thoughts for $L dy",
  "Dominate Person": "R$RS' Target humanoid Will save or obey thoughts for $L dy",
  "Doom": "R$RM' Target will save or shaken (-2 attack/damage/saves/checks) for $L min",
  "Dream": "Touched sends message to sleeping target",
  "Eagle's Splendor": "Touched +4 Cha for $L min",
  "Earthquake": "R$RL Intense tremor shakes 80' radius for 1 rd",
  "Elemental Body I": "Become small air (+2 Dex/+2 AC/fly 60'/whirlwind), earth (+2 Str/+4 AC/earth glide), fire (+2 Dex/+2 AC/resist fire/burn), water (+2 Con/+4 AC/swim 60'/vortex/breathe water) elemental, 60' darkvision for $L min",
  "Elemental Body II": "Become medium air (+4 Dex/+3 AC/fly 60'/whirlwind), earth (+4 Str/+5 AC/earth glide), fire (+4 Dex/+3 AC/resist fire/burn), water (+4 Con/+5 AC/swim 60'/vortex/breathe water) elemental, 60' darkvision for $L min",
  "Elemental Body III": "Become large air (+2 Str/+4 Dex/+4 AC/fly 60'/whirlwind), earth (+6 Str/-2 Dex/+2 Con/+6 AC/earth glide), fire (+4 Dex/+2 Con/+4 AC/resist fire/burn), water (+2 Str/-2 Dex/+6 Con/+6 AC/swim 60'/vortex/breathe water) elemental, 60' darkvision/immune bleed, critical, sneak attack for $L min",
  "Elemental Body IV": "Become huge air (+4 Str/+6 Dex/+4 AC/fly 120'/whirlwind), earth (+8 Str/-2 Dex/+4 Con/+6 AC/earth glide), fire (+6 Dex/+4 Con/+4 AC/resist fire/burn), water (+4 Str/-2 Dex/+8 Con/+6 AC/swim 120'/vortex/breathe water) elemental, 60' darkvision/immune bleed, critical, sneak attack/DR 5/- for $L min",
  "Elemental Swarm": "R$RM' Summons 2d4 large, then 1d4 huge, then 1 greater  elementals for $L10 min",
  "Endure Elements": "Touched comfortable in at -50-140F for 1 dy",
  "Energy Drain": "R$RS' Ranged touch 2d4 negative levels for 1 dy, Fort save or permanent (undead +2d4x5 HP for 1 hr)",
  "Enervation": "R$RS' Ranged touch 1d4 negative levels for $L hr (undead +1d4x5 HP for 1 hr)",
  "Enlarge Person": "R$RS' Target humanoid Fort save or double size (+2 Str/-2 Dex/-1 attack/-1 AC) for $L min",
  "Entangle": "R$RL' Creatures in 40' radius Ref save or entangled for $L min",
  "Enthrall": "R$RM' Listeners Will save or captivated for 1 hr",
  "Entropic Shield": "Foes' ranged attacks 20% miss for $L min",
  "Erase": "R$RS' Two pages of writing vanish (magical writing DC 15 caster check)",
  "Ethereal Jaunt": "Self ethereal for $L rd",
  "Etherealness": "Self+$Ldiv3 others ethereal for $L min",
  "Expeditious Retreat": "Self speed +30 for $L min",
  "Explosive Runes": "Runes 6d6 HP when read (adjacent no save, 10' Ref half)",
  "Eyebite": "R$RS' 1 target/rd with 4/9/10+ HD Fort save or comatose $L10 min/panicked d4 rd and shaken 10 min/sickened 10 min for $L rd",
  "Fabricate": "Create $L10' cube ($L' mineral cube) of finished items from raw materials",
  "Faerie Fire": "R$RL' Creatures in 5' radius glow for $L min",
  "False Life": "Self +1d10+$Lmin10 temporary HP for $L hr",
  "False Vision": "Scrying in touched 40' radius sees illusion for $L hr",
  "Fear": "R30' cone Creatures flee for $L rd (Will shaken 1 rd)",
  "Feather Fall": "R$RS' $L targets Will save or fall 60' for $L rd",
  "Feeblemind": "R$RM' Target Will save (arcane -4) or Int/Cha permanently drop to 1",
  "Find The Path": "Know most direct route to location for $L10 min",
  "Find Traps": "Self +10 Perception to notice traps w/in 10' for $L min",
  "Finger Of Death": "R$RS' Target $L10 HP (Fort 3d6+$L)",
  "Fire Seeds": "4 acorn grenades ${Math.min(lvl,20)}d4 total/8 berry bombs 1d8+$L (Ref half) that detonate on command for $L10 min",
  "Fire Shield": "Cold/hot flames enveloping self do d6+$Lmin15 HP upon foe hit, take half HP from heat/cold attacks (Ref no HP) for $L rd",
  "Fire Storm": "R$RM' $L2 10' cubes do ${Lmin20}d6 HP to targets, burn for 4d6/rd (Ref half and no burn)",
  "Fire Trap": "Warded object 1d4+$Lmin20 HP (Ref half) w/in 5' when opened",
  "Fireball": "R$RL' ${Lmin10}d6 HP (Ref half) in 20' radius",
  "Flame Arrow": "R$RS' 50 projectiles +1d6 HP for $L10 min",
  "Flame Blade": "Touch 1d8+${Math.min(Math.floor(lvl/2),10)} HP for $L min",
  "Flame Strike": "R$RM' 10' radius x 40' high ${Lmin15}d6 HP (Ref half)",
  "Flaming Sphere": "R$RM' 5' diameter sphere 3d6 HP (Ref negate) jump/move 30' for $L rd",
  "Flare": "R$RS' Target Fort save or dazzled 1 min",
  "Flesh To Stone": "Target Fort save or statue permanently",
  "Floating Disk": "R$RS' 3'-diameter x 1\" force disk follows, holds $L100 lbs at 3' for $L hr",
  "Fly": "Touched fly at 60' for $L min",
  "Fog Cloud": "R$RM' 20'-radius fog obscures vision for $L10 min",
  "Forbiddance": "R$RM' 60' cube bars planar travel, 6d6/12d6 HP on transit if align differs in 1/2 dimensions",
  "Forcecage": "R$RS' Traps targets in 20' cage/10' cube for $L rd",
  "Forceful Hand": "R$RM' 10' (AC 20, caster HP) hand cover (+4 AC), move 60', bull rush (CMB ${lvl + 9}, 2d6+12 HP) for $L rd",
  "Foresight": "Warnings provide +2 AC/Ref, no surprise/flat-footed for $L min",
  "Form Of The Dragon I": "Become Medium dragon (+4 Str/+2 Con/+4 AC/Fly 60'/Darkvision 60'/breath weapon once 6d8 HP (Ref half)/element resistance/bite 1d8 HP/claws 2x1d6 HP/wings 2x1d4 HP) for $L min",
  "Form Of The Dragon II": "Become Large dragon (+6 Str/+4 Con/+6 AC/Fly 90'/Darkvision 60'/breath weapon twice 8d8 HP (Ref half)/element resistance/bite 2d6 HP/claws 2x1d8 HP/wings 2x1d6 HP) for $L min",
  "Form Of The Dragon III": "Become Huge dragon (+10 Str/+8 Con/+8 AC/Fly 120'/Blindsense 60'/Darkvision 120'/breath weapon 1/d4 rd 12d8 HP (Ref half)/element immunity/bite 2d8 HP/claws 2x2d6 HP/wings 2x1d8 HP/tail 2d6 HP) for $L min",
  "Fox's Cunning": "Touched +4 Int for $L min",
  "Freedom": "R$RS' Target released from movement restrictions",
  "Freedom Of Movement": "R$RS' Target moves freely for $L10 min",
  "Freezing Sphere": "R$RL' Burst ${Lmin15}d6 HP in 40' radius (Ref half)",
  "Gaseous Form": "Touched insubstantial (DR 10/magic, immune poison/sneak/critical, unable to use spell components, fly 10') for $L2 min",
  "Gate": "5'-20' disk connects another plane for $L rd",
  "Geas/Quest": "R$RS' Target must complete task",
  "Gentle Repose": "Corpse Will save or preserved $L dy",
  "Ghost Sound": "R$RS' produce sound volume of $L4 humans (Will disbelieve) for $L rd",
  "Ghoul Touch": "Touched Fort save or paralyzed 1d6+2 rd and stench sickens 10' radius",
  "Giant Form I": "Become large giant (+6 Str/-2 Dex/+4 Con/+4 AC/low-light vision/form abilities) for $L min",
  "Giant Form II": "Become huge giant (+8 Str/-2 Dex/+6 Con/+6 AC/low-light vision/form abilities) for $L min",
  "Giant Vermin": "R$RS' ${lvl<10?3:lvl<14?4:lvl<18?6:lvl<20?8:12} centipedes/${lvl<20?1+Math.floor((lvl-6)/4):6} scorpions/${lvl<20?2+Math.floor((lvl-6)/4):8} spiders become giant and obey for $L min",
  "Glibness": "+20 Bluff, DC ${lvl+15} magical lie detection for $L10 min",
  "Glitterdust": "R$RM' Creatures in 10'-radius outlined and Will save or blind for $L rd",
  "Globe Of Invulnerability": "R10' Bars spell effects le 4th level for $L rd",
  "Glyph Of Warding": "Proscribed creatures passing $L5 sq' area trigger ${1+Math.max(Math.floor(lvl/2),5)}d8 blast or harmful spell le 3rd level",
  "Good Hope": "$L targets +2 attack/damage/saves and skill/ability checks for $L min",
  "Goodberry": "2d4 berries provide meal and heal 1 HP for $L dy",
  "Grasping Hand": "R$RM' 10' (AC 20, caster HP) hand cover (+4 AC), move 60', grapple (CMB ${lvl + 12}) for $L rd",
  "Grease": "R$RS' Object or 10' square slippery (Ref or fall) for $L min",
  "Greater Arcane Sight": "R120' See auras/spell abilities and know spell for $L min",
  "Greater Command": "R$RS' $L targets Will save each rd or approach/drop/fall/flee/halt for $L rd",
  "Greater Dispel Magic": "R$RM' d20+$L vs. 11+caster level cancels $Ldiv4 spells/effects or all w/in 20' radius",
  "Greater Glyph Of Warding": "Proscribed creatures passing $L5 sq' area trigger ${1+Math.max(Math.floor(lvl/2),10)}d8 blast or harmful spell le 6th level",
  "Greater Heroism": "Touched +4 attack/saves/skill checks, +$Lmin20 HP, immune fear for $L10 min",
  "Greater Invisibility": "Touched invisible for $L rd",
  "Greater Magic Fang": "R$RS' target natural weapon +${Math.min(Math.floor(lvl/4),4)} attack/damage for $L hr",
  "Greater Magic Weapon": "R$RS' target weapon +${Math.min(Math.floor(lvl/4),4)} attack/damage for $L hr",
  "Greater Planar Ally": "Purchase service from extraplanar creature le 18 HD",
  "Greater Planar Binding": "Extraplanar creature(s) le 18 HD Will save or trapped until escape (DC ${Math.floor(lvl/2)+15}+cha) or performs a task",
  "Greater Polymorph": "Willing target becomes animal/elemental/plant/dragon for $L min",
  "Greater Prying Eyes": "1d4+$L floating eyes (AC 18, 1 HP) with True Seeing scout 1 mi for $L hr",
  "Greater Restoration": "Touched remove magical/temporary/permanent ability harm, fatigue/exhaustion, negative levels, mental effects",
  "Greater Scrying": "Target special Will save or viewed, subject to spells for $L hr",
  "Greater Shadow Conjuration": "Mimics conjuration (creation/summoning) le 6th level, Will save 60% effect",
  "Greater Shadow Evocation": "Mimics evocation le 7th level, Will save 60% effect",
  "Greater Shout": "60' cone 10d6 HP, deafened 4d6 rd, stunned 1 rd (Will half damage/deafened only)",
  "Greater Spell Immunity": "Touched immune to $Ldiv4 spells le 8th level for $L10 min",
  "Greater Teleport": "Transport you, $Ldiv3 others anywhere w/no error chance",
  "Guards And Wards": "Multiple magic effects protect $L200' sq area for $L2 hr",
  "Guidance": "Touched +1 next attack/save/skill check for 1 min",
  "Gust Of Wind": "60' gust affects medium/smaller creatures",
  "Hallow": "40' radius warded against evil, bars undead creation, evokes boon spell",
  "Hallucinatory Terrain": "R$RL' ${L} 30' cube terrain illusion (Will disbelieve) for $L2 hr",
  "Halt Undead": "R$RM' 3 undead Will save or immobilized for $L rd",
  "Harm": "Touched ${Math.min(lvl*10,150)} HP (Will half)",
  "Haste": "R$RS' $L targets extra attack, +1 attack/AC/Ref, +30 move for $L rd",
  "Heal": "Touched heal ${Math.min(lvl*10,150)}, remove negative conditions",
  "Heal Mount": "Mount heal ${Math.min(lvl*10,150)}, remove negative conditions",
  "Heat Metal": "R$RS' Metal of $Ldiv2 creatures Will save or 0/1/2/2/2/1/0d4 HP for 7 rd",
  "Helping Hand": "R5 miles Ghostly hand leads target to you for 4 hr",
  "Heroes' Feast": "Food for $L creatures cures sickness/poison/disease, 1d8+${Math.min(Math.floor(lvl/2),10)} temporary HP, +1 attack/Will, +4 saves vs. poison/fear for 12 hr",
  "Heroism": "Touched +2 attack/saves/skill checks for $L10 min",
  "Hide From Animals": "$L touched imperceptable to animals for $L10 min",
  "Hide From Undead": "$L touched imperceptable to undead for $L10 min",
  "Hideous Laughter": "R$RS' Target Will save or ROFL for $L rd",
  "Hold Animal": "R$RM' Target animal immobile until Will save/$L rd",
  "Hold Monster": "R$RM' Target immobile until Will save/$L rd",
  "Hold Person": "R$RM' Target humanoid immobile until Will save/$L rd",
  "Hold Portal": "R$RM' Door/gate/window locked, +5 DC to open for $L min",
  "Holy Aura": "$L creatures w/in 20' +4 AC/saves, SR 25 vs. evil spells, protected from possession, striking foes Fort save or blinded, for $L rd",
  "Holy Smite": "R$RM' Evil w/in 20'-radius burst ${Math.min(Math.floor(source/2),5)}d8 HP and blinded 1 rd, neutral half (Will half)",
  "Holy Sword": "Touched weapon +5 attack/damage, vs. evil +2d6 damage, +2 AC/saves, extra save vs. enchantment, bars contact for $L rd",
  "Holy Word": "Nongood creatures w/in 40' with equal/-1/-5/-10 HD Will save or deafened 1d4 rd/blinded 2d4 rd (save 1d4)/paralyzed 1d10 min (save 1 rd)/killed (save 3d6+$Lmin25 HP)",
  "Horrid Wilting": "R$RL' ${Lmin20}d6 HP (${Lmin20}d8 plants/water elementals) in 30' radius",
  "Hypnotic Pattern": "R$RM' 2d4+$Lmin10 HD of creatures Will save or fascinated for conc + 2 rd",
  "Hypnotism": "R$RS' 2d4 HD of creatures fascinated and suggestable for 2d4 rd",
  "Ice Storm": "R$RL' Hail in 40' cylinder 3d6 HP bludgeoning/2d6 HP cold, -4 Perception for $L rd",
  "Identify": "R60' cone info on magical auras, +10 Spellcraft for $L3 rd",
  "Illusory Script": "Unauthorized readers Will save or suggestion for $L dy",
  "Illusory Wall": "R$RS' Permanent illusionary 1'x10'x10' surface (Will disbelieve)",
  "Imbue With Spell Ability": "Touched with 2/4/5 HD can cast specified 1st/2x1st/2x1st+2nd level spells",
  "Implosion": "R$RS' 1 target/rd Fort save or $L10 HP for $Ldiv2 rd",
  "Imprisonment": "Target Will save or entombed",
  "Incendiary Cloud": "R$RM' 20' cylinder moves away 10', 6d6 HP (Ref half) for $L rd",
  "Inflict Critical Wounds": "Touched damage/heal undead 4d8+$Lmin20 (Will half)",
  "Inflict Light Wounds": "Touched damage/heal undead 1d8+$Lmin5 (Will half)",
  "Inflict Minor Wounds": "Touched 1 HP",
  "Inflict Moderate Wounds": "Touched damage/heal undead 2d8+$Lmin10 (Will half)",
  "Inflict Serious Wounds": "Touched damage/heal undead 3d8+$Lmin15 (Will half)",
  "Insanity": "R$RM' Target Will save or randomly normal/babble/d8+str to self/attack nearest permanently",
  "Insect Plague": "R$RL' ${Math.min(Math.floor(lvl/3),6)} wasp swarms attack for $L min",
  "Instant Summons": "Prepared object appears in your hand",
  "Interposing Hand": "R$RM' 10' (AC 20, caster HP) hand cover (+4 AC) for $L rd",
  "Invisibility": "Touched invisible for $L min/until attacks",
  "Invisibility Purge": "R$L5' Invisible becomes visible for $L min",
  "Invisibility Sphere": "Creatures w/in 10' of touched invisible for $L min/until attacks/leave area",
  "Iron Body": "Become iron (+6 Str/-6 Dex, half speed, 35% arcane failure, -6 skill, DR 15/adamantine, half damage acid/fire, immune other attacks/effects) for $L min",
  "Ironwood": "Make a wood object as strong as steel",
  "Irresistible Dance": "Touched dance (-4 AC, -10 Ref) for d4+1 rd (Will 1 rd)",
  "Jump": "Touched +${lvl<5?10:lvl<9?20:30} jump Acrobatics for $L min",
  "Keen Edge": "R$RS' Target weapon double threat range for $L10 min",
  "Knock": "R$RM' +${lvl+10} check to open stuck/barred/locked/magically held door/chest/shackle",
  "Know Direction": "Self determine north",
  "Legend Lore": "Info about target person/place/object",
  "Lesser Confusion": "R$RS' Target Will save or randomly normal/babble/d8+str to self/attack nearest for 1 rd",
  "Lesser Geas": "R$RS' Target le 7 HD Will save or must complete task",
  "Lesser Globe Of Invulnerability": "Bars spell effects le 3rd level in 10' radius for $L rd",
  "Lesser Planar Ally": "Purchase service from extraplanar creature le 6 HD",
  "Lesser Planar Binding": "Extraplanar creature le 6 HD Will save or trapped until escape (DC ${Math.floor(lvl/2)+15}+cha) or performs a task",
  "Lesser Restoration": "Touched remove 1 magical/1d4 temporary ability harm, fatigue/exhaustion, 1 negative level",
  "Levitate": "R$RS' Move willing target up/down 20' for $L min",
  "Light": "Touched gives torchlight for $L10 min",
  "Lightning Bolt": "120' bolt ${Lmin10}d6 HP (Ref half)",
  "Limited Wish": "Alter reality, with limits",
  "Liveoak": "Touched oak becomes treant guardian for $L dy",
  "Locate Creature": "R$RL' Sense direction of creature/kind for $L10 min",
  "Locate Object": "R$RL' Sense direction of object/type for $L min",
  "Longstrider": "Self +10 speed for $L hr",
  "Lullaby": "R$RM' Targets in 10' radius -5 Perception/-2 Will saves vs. sleep for conc + $L rd",
  "Mage Armor": "Touched +4 AC for $L hr",
  "Mage Hand": "R$RS' Move target le 5 lb 15'",
  "Mage's Disjunction": "R$RS' 40' radius dispelled, magic items Will save or inert for $L min, $L% chance to destroy antimagic field",
  "Mage's Faithful Hound": "R$RS' Invisible dog barks at intruders w/in 30', bites (+10 2d6+3) w/in 5' for $L hr",
  "Mage's Lucubration": "Recalls spell le 5th level from past day",
  "Mage's Magnificent Mansion": "R$RS' Door to extradimensional mansion for $L2 hr",
  "Mage's Private Sanctum": "Prevents outside view/scry/hear of ${L} 30' cubes for 1 dy",
  "Mage's Sword": "R$RS' Unattended force blade attacks (+${lvl+3}+abil 4d6+3x2@19) for $L rd",
  "Magic Aura": "Alters aura of target object le $L5 lb for $L dy",
  "Magic Circle Against Chaos": "10' radius from touched +2 AC/+2 saves/extra save vs. mental control/no contact vs. chaotic creatures for $L10 min",
  "Magic Circle Against Evil": "10' radius from touched +2 AC/+2 saves/extra save vs. mental control/no contact vs. evil creatures for $L10 min",
  "Magic Circle Against Good": "10' radius from touched +2 AC/+2 saves/extra save vs. mental control/no contact vs. good creatures for $L10 min",
  "Magic Circle Against Law": "10' radius from touched +2 AC/+2 saves/extra save vs. mental control/no contact vs. lawful creatures for $L10 min",
  "Magic Fang": "Touched natural weapon +1 attack/damage for $L min",
  "Magic Jar": "R$RM' Target Will save or possessed for $L hr",
  "Magic Missile": "R$RM' ${Math.min(Math.floor((lvl+1)/2),5)} missles 1d4+1 HP",
  "Magic Mouth": "R$RS' Mouth speaks 25 words upon trigger w/in $L15'",
  "Magic Stone": "3 touched stones +1 attack/1d6+1 HP (2d6+2 vs. undead) for 30 min",
  "Magic Vestment": "Touched armor/shield/clothing +${Math.min(Math.floor(lvl/4),5)} AC for $L hr",
  "Magic Weapon": "Touched weapon +1 attack/damage for $L min",
  "Major Creation": "Create $L' cu plant/mineral object for $L2 hr",
  "Major Image": "R$RL' ${(lvl+4)*10}' cu image w/sound/smell/thermal (Will disbelieve) for conc + 3 rd",
  "Make Whole": "R$RS' Repairs ${Lmin5}d6 damage to $L' cu object",
  "Mark Of Justice": "Touched permanent -6 ability, -4 attack/saves/checks, or 50% chance/rd of losing action upon trigger",
  "Mass Bear's Endurance": "R$RS' $L targets +4 Con for $L min",
  "Mass Bull's Strength": "R$RS' $L targets +4 Str for $L min",
  "Mass Cat's Grace": "R$RS' $L targets +4 Dex for $L min",
  "Mass Charm Monster": "R$RS' $L2 HD targets Will save or treats you as trusted friend for $L dy",
  "Mass Cure Critical Wounds": "R$RS' $L targets heal/damage undead 4d8+$Lmin40 (Will half)",
  "Mass Cure Light Wounds": "R$RS' $L targets heal/damage undead 1d8+$Lmin25 (Will half)",
  "Mass Cure Moderate Wounds": "R$RS' $L targets heal/damage undead 2d8+$Lmin30 (Will half)",
  "Mass Cure Serious Wounds": "R$RS' $L targets heal/damage undead 3d8+$Lmin35 (Will half)",
  "Mass Eagle's Splendor": "R$RS' $L targets +4 Cha for $L min",
  "Mass Enlarge Person": "R$RS' $L target humanoid Fort save or double size (+2 Str/-2 Dex/-1 attack/-1 AC) for $L min",
  "Mass Fox's Cunning": "R$RS' $L targets +4 Int for $L min",
  "Mass Heal": "R$RS' $L targets heal ${Math.min(lvl*10,150)}, remove negative conditions",
  "Mass Hold Monster": "R$RM' Targets in 30' radius immobile until Will save/$L rd",
  "Mass Hold Person": "R$RM' Targets in 30' radius immobile until Will save/$L rd",
  "Mass Inflict Critical Wounds": "R$RS' $L targets damage/heal undead 4d8+$Lmin40 (Will half)",
  "Mass Inflict Light Wounds": "R$RS' $L targets damage/heal undead 1d8+$Lmin25 (Will half)",
  "Mass Inflict Moderate Wounds": "R$RS' $L targets damage/heal undead 2d8+$Lmin30 (Will half)",
  "Mass Inflict Serious Wounds": "R$RS' $L targets damage/heal undead 3d8+$Lmin35 (Will half)",
  "Mass Invisibility": "R$RL' Targets in 90' radius invisible for $L min/until attacks",
  "Mass Owl's Wisdom": "R$RS' $L targets +4 Wis for $L min",
  "Mass Reduce Person": "R$RS' $L target humanoid Fort save or half size (-2 Str/+2 Dex/+1 attack/+1 AC) for $L min",
  "Mass Suggestion": "R$RM' $L targets Will save or follow reasonable suggestion",
  "Maze": "R$RS' Target in extradimensional maze for 10 min/until DC 20 Int check",
  "Meld Into Stone": "Self pass into stone for $L10 min",
  "Mending": "R10' Repairs 1d4 HP to $L-lb object",
  "Message": "R$RM' Target DC 25 Perception for $L10-min whispered dialogue",
  "Meteor Swarm": "R$RL' 4 spheres 6d6 HP fire 40' radius (Ref half)/ranged touch 2d6 HP bludgeoning",
  "Mind Blank": "R$RS' Target immune divination/+8 vs. mental for 1 dy",
  "Mind Fog": "20' fog cylinder -10 Wis/Will checks",
  "Minor Creation": "Create a $L' cu plant object lasting $L hr",
  "Minor Image": "R$RL' ${(lvl+4)*10}' cu image w/noise (Will disbelieve) for conc + 2 rd",
  "Miracle": "Requests deity's intercession",
  "Mirage Arcana": "R$RL' ${L} 20' cube terrain/structure illusion (Will disbelieve) for $L hr",
  "Mirror Image": "1d4+${Math.min(Math.floor(lvl/3),8)} self decoys mislead attacks for $L min",
  "Misdirection": "R$RS' Divinations upon target redirected for $L hr",
  "Mislead": "R$RS' Self invisible $L rd, false double (Will disbelieve) conc + 3 rd",
  "Mnemonic Enhancer": "Know +3 spell levels or retain just-cast spell le 3rd level for 1 dy",
  "Modify Memory": "Target Will save or change 5 min of memory",
  "Moment Of Prescience": "Self +$Lmin25 attack/check/save once w/in $L hr",
  "Mount": "R$RS' Summons riding horse for $L2 hr",
  "Move Earth": "R$RL' Slowly digs 7500' cu dirt",
  "Neutralize Poison": "Touched neutralized $L10 min/immunized/detoxified",
  "Nightmare": "Target Will save or 1d10 HP and fatigue",
  "Nondetection": "Touched DC ${lvl+11}/${lvl+15} resistance to divination for $L hr",
  "Obscure Object": "Touched immune to divination for 8 hr",
  "Obscuring Mist": "20'-radius fog around self obscures vision for $L min",
  "Open/Close": "R$RS' Target le 30 lb opens/closes",
  "Order's Wrath": "R$RM' Chaotic w/in 30' cube ${Math.min(Math.floor(source/2),5)}d8 HP and dazed 1 rd, neutral half (Will half)",
  "Overland Flight": "Self fly 40', +$Ldiv2 Fly for $L hr",
  "Owl's Wisdom": "Touched +4 Wis for $L min",
  "Pass Without Trace": "$L touched leave no tracks/scent for $L hr",
  "Passwall": "8'x5'x${Math.min(10+5*Math.floor((lvl-9)/3),25)}' passage through wood/stone/plaster lasts $L hr",
  "Permanency": "Makes certain spells permanent",
  "Permanent Image": "R$RL' ${(lvl+4)*10}' cu image w/sound/smell/thermal (Will disbelieve)",
  "Persistent Image": "R$RL' ${(lvl+4)*10}' cu image w/sound/smell/thermal (Will disbelieve) for $L min",
  "Phantasmal Killer": "R$RM' Target Will save or fears create creature, touch kills (Fort 3d6 HP)",
  "Phantom Steed": "Create mount (${lvl+7} HP, AC 18, MV ${Math.min(Math.floor(lvl/2)*20,100)}) for target for $L hr",
  "Phantom Trap": "Touched object appears trapped",
  "Phase Door": "Allow passage through 8'x5'x${Math.min(10+5*Math.floor((lvl-9)/3),25)}' wood/stone/plaster $Ldiv2 times",
  "Planar Ally": "Purchase service from extraplanar creature le 12 HD",
  "Planar Binding": "Extraplanar creature(s) le 12 HD Will save or trapped until escape (DC ${Math.floor(lvl/2)+15}+cha) or performs a task",
  "Plane Shift": "1 target (Will negate)/8 willing move to another plane",
  "Plant Growth": "$RL' vegetation becomes dense or 1/2 mi radius increases productivity",
  "Plant Shape I": "Become small (+2 Con/+2 AC) or medium (+2 Str/+2 Con/+2 AC) plant creature for $L min",
  "Plant Shape II": "Become large (+4 Str/+2 Con/+4 AC) plant creature for $L min",
  "Plant Shape III": "Become huge (+8 Str/-2 Dex/+4 Con/+6 AC) plant creature for $L min",
  "Poison": "Touched Fort save or 1d3 Con/rd for 6 rd",
  "Polar Ray": "R$RM' Ranged touch ${Lmin25}d6 HP/1d4 Dex",
  "Polymorph": "Willing target becomes animal/elemental for $L min",
  "Polymorph Any Object": "Target Fort save or become something else",
  "Power Word Blind": "R$RS' Target w/ 50/100/200 HP blinded for ever/1d4+1 min/1d4+1 rd",
  "Power Word Kill": "R$RS' Kills one creature le 100 HP",
  "Power Word Stun": "R$RS' Target w/ 40/100/150 HP stunned for 4d4/2d4/1d4 rd",
  "Prayer": "Allies w/in 40' +1 attack/damage/save/skill, foes -1 for $L rd",
  "Prestidigitation": "R10' Perform minor tricks for 1 hr",
  "Prismatic Sphere": "R$RS' 10' sphere blocks attacks for $L10 min",
  "Prismatic Spray": "R60' cone Blinds le 8 HD 2d4 rd, other effects",
  "Prismatic Wall": "R$RS' $L4'x$L2' wall blocks attacks for $L10 min",
  "Produce Flame": "Torch flame 1d6+$Lmin5 HP for $L min",
  "Programmed Image": "R$RL' ${(lvl+4)*10}' cu image w/sound/smell/thermal (Will disbelieve) for $L rd when triggered",
  "Project Image": "R$RM' See/cast through illusory double for $L rd",
  "Protection From Arrows": "Touched DR 10/magic vs. ranged for $L hr/${Math.min(lvl*10,100)} HP",
  "Protection From Chaos": "Touched +2 AC/+2 saves/extra save vs. mental control/no contact by chaotic creatures for $L min",
  "Protection From Energy": "Touched ignores up to ${Math.min(lvl*12,120)} HP from specified energy for $L10 min",
  "Protection From Evil": "Touched +2 AC/+2 saves/extra save vs. mental control/no contact by evil creatures for $L min",
  "Protection From Good": "Touched +2 AC/+2 saves/extra save vs. mental control/no contact by good creatures for $L min",
  "Protection From Law": "Touched +2 AC/+2 saves/extra save vs. mental control/no contact by lawful creatures for $L min",
  "Protection From Spells": "+8 spell saves for $L10 min",
  "Prying Eyes": "1d4+$L floating eyes (AC 18, 1 HP) scout 1 mi for $L hr",
  "Purify Food And Drink": "R10' Make $L' cu food/water safe",
  "Pyrotechnics": "R$RL' Fire becomes fireworks (120' Will save or blinded 1d4+1 rd) or choking smoke (20' Fort save or -4 Str/Dex d4+1 rd)",
  "Quench": "R$RM' Extinguish fire/dispel fire magic/${Lmin10}d6 HP to fire creatures in $L 20' cu",
  "Rage": "R$RM' $Ldiv3 willing targets +2 Str/Con, +1 Will, -2 AC for conc + $L rd",
  "Rainbow Pattern": "R$RM' 24 HD creatures in 20' radius Will save or facinated for conc + $L rd",
  "Raise Dead": "Restores life to touched corpse dead le $L dy",
  "Ray Of Enfeeblement": "R$RS' Ranged touch 1d6+${Math.min(Math.floor(lvl/2),5)} Str (Fort half)",
  "Ray Of Exhaustion": "R$RS' Ranged touch causes exhaustion for $L min (Save fatigued)",
  "Ray Of Frost": "R$RS' Ranged touch 1d3 HP",
  "Read Magic": "Self read magical writing",
  "Reduce Animal": "Touched willing animal half size (-2 Str/+2 Dex/+1 attack/+1 AC) for $L hr",
  "Reduce Person": "R$RS' Target humanoid Fort save or half size (-2 Str/+2 Dex/+1 attack/+1 AC) for $L min",
  "Refuge": "Breaking trigger transports you/target to other's location",
  "Regenerate": "Touched regrow maims, heal 4d8+$Lmin35 HP, rid fatigue/exhaustion",
  "Reincarnate": "Restore target dead le 1 week to new body",
  "Remove Blindness/Deafness": "Touched cured of blindness or deafness",
  "Remove Curse": "Dispels all curses from touched",
  "Remove Disease": "Cures all diseases affecting touched",
  "Remove Fear": "R$RS' ${Math.floor((lvl+3)/4)} targets +4 vs. fear, existing fear suppressed for 10 min",
  "Remove Paralysis": "R$RS' Frees one target from paralysis/slow, 2/3/4 targets extra save at +4/+2/+2",
  "Repel Metal Or Stone": "Repels 60' line of unanchored metal/stone for $L rd",
  "Repel Vermin": "10' radius bars vermin le $Ldiv3 HD, 2d6 HP to others w/Will save for $L10 min",
  "Repel Wood": "Repels 60' line of unanchored wood for $L min",
  "Repulsion": "Creatures Will save or stay $L10' away for $L rd",
  "Resilient Sphere": "R$RS' Impassible/immobile $L'-diameter sphere surrounds target for $L min",
  "Resist Energy": "Touched DR ${lvl>10?30:lvl>6?20:10} from specified energy for $L10 min",
  "Resistance": "Touched +1 saves for 1 min",
  "Restoration": "Touched remove magical/temporary/1 permanent ability harm, fatigue/exhaustion, 1 negative level",
  "Resurrection": "Fully restore target dead $L10 years w/1 negative level",
  "Reverse Gravity": "Objects in $L10' cu fall upward for $L rd",
  "Righteous Might": "Self double size (+4 Str/+4 Con/-2 Dex/-1 attack/-1 AC) and DR ${lvl>14?10:5}/align for $L rd",
  "Rope Trick": "Rope to extradimensional space for 8 creatures for $L hr",
  "Rusting Grasp": "Touch corrodes 3' radius",
  "Sanctuary": "Touched foes Will save to attack for $L rd/until attacks",
  "Scare": "R$RS' $Ldiv3 targets le 5 HD flee for 1d4 rd (Will shaken 1 rd)",
  "Scintillating Pattern": "R$RS' $Lmin20 HD creatures in 20' radius le 6/12/20 HD unconscious 1d4 rd/stunned 1d4 rd/confused 1d4 rd",
  "Scorching Ray": "${lvl>10?3:lvl>6?2:1} $RS' rays ranged touch 4d6 HP",
  "Screen": "Illusion hides $L x 30' cu from vision and scrying (Will disbelieve) for 1 dy",
  "Scrying": "Target special Will save or viewed for $L min",
  "Sculpt Sound": "R$RS' $L targets Will save or sounds changed for $L hr",
  "Searing Light": "R$RM' Range touch ${Math.min(Math.floor(lvl/2),5)}d8 HP, undead ${Lmin10}d6, object ${Math.min(Math.floor(lvl/2),5)}d6",
  "Secret Chest": "$L' cu ethereal chest can be recalled at will for 60 dy",
  "Secret Page": "Hide content of touched page permanently",
  "Secure Shelter": "R$RS' 20'x20' cottage lasts $L2 hr",
  "See Invisibility": "Self sees invisible creatures/objects for $L10 min",
  "Seeming": "R$RS' $Ldiv2 targets appearance change/+10 disguise for 12 hr",
  "Sending": "25-word exchange with target",
  "Sepia Snake Sigil": "Target reader Ref save or immobile 1d4+$L dy",
  "Sequester": "Willing touched invisible/unscryable/comatose for $L dy",
  "Shades": "Mimics conjuration (creation/summoning) le 8th level (Will 80% effect)",
  "Shadow Conjuration": "Mimics conjuration (creation/summoning) le 3rd level (Will 20% effect)",
  "Shadow Evocation": "Mimics evocation le 4th level (Will 20% effect)",
  "Shadow Walk": "Travel quickly via Plane of Shadow for $L hr",
  "Shambler": "R$RM' 1d4+2 advanced shambling mounds fight for 7 dy/guard for 7 mo",
  "Shapechange": "Become different animal 1/rd for $L10 min",
  "Shatter": "R$RS' Breakables in 5' radius Will save or shatter, or target ${Lmin10}d6 HP (Fort half)",
  "Shield": "Self +4 AC, block magic missle for $L min",
  "Shield Of Faith": "Touched +${Math.min(2+Math.floor(lvl/6),5)} AC for $L min",
  "Shield Of Law": "$L creatures w/in 20' radius +4 AC/saves, +25 vs chaotic spells, immune chaotic mental control, chaotic hit Will save or slowed for $L rd",
  "Shield Other": "R$RS' target +1 AC/saves, half damage transferred to you for $L hr",
  "Shillelagh": "S/M/L staff +1 attack, 1d8+1/2d6+1/3d6+1 damage for $L min",
  "Shocking Grasp": "Touch ${Lmin5}d6 HP, +3 attack vs metal",
  "Shout": "R30' cone 5d6 HP, deafened 2d6 rd (Will half damage only)",
  "Shrink Item": "Touched $L2' cu object Will save or 1/16 size, becomes cloth for $L dy",
  "Silence": "R$RL' Bars sound in 20' radius for $L rd",
  "Silent Image": "R$RL' ${(lvl+4)*10}' cu image (Will disbelieve) for conc",
  "Simulacrum": "Create permanent double of creature w/half HP/levels",
  "Slay Living": "Touch attack 12d6+$L HP (Fort 3d6+$L)",
  "Sleep": "R$RM' 4 HD creatures in 10' radius Will save or sleep for $L min",
  "Sleet Storm": "R$RL' Blinding sleet in 40' area, creatures DC 10 Acrobatics to move for $L rd",
  "Slow": "R$RS' $L creatures single action per rd/-1 AC/attack/Ref/half speed for $L rd",
  "Snare": "Touched vine/thong/rope becomes permanent DC 23 trap",
  "Soften Earth And Stone": "R$RS' $L 10'x4' squares of wet earth/dry earth/natural stone becomes mud/sand/clay",
  "Solid Fog": "R$RM' 20'-radius fog obscures vision and half speed/-2 damage/attack for $L min",
  "Song Of Discord": "R$RM' Creatures in 20' radius 50% chance each rd to attack neighbor for $L rd",
  "Soul Bind": "Imprisons soul dead le $L rd to prevent resurrection",
  "Sound Burst": "R$RS' 10' radius 1d8 HP/Fort save or stunned",
  "Speak With Animals": "Self converse w/animals for $L min",
  "Speak With Dead": "R10' Corpse answer $Ldiv2 questions",
  "Speak With Plants": "Self converse w/plants for $L min",
  "Spectral Hand": "Self yield 1d4 HP to glowing hand to deliver touch attacks at +2 for $L min",
  "Spell Immunity": "Touched immune to $Ldiv4 spells le 4th level for $L10 min",
  "Spell Resistance": "Touched +${lvl+12} saves vs spells for $L min",
  "Spell Turning": "Self reflect onto caster 1d4+6 non-touch spell levels for $L10 min",
  "Spellstaff": "Store 1 spell in wooden quarterstaff",
  "Spider Climb": "Touched climb walls/ceilings for $L10 min",
  "Spike Growth": "R$RM' Spikes on vegetation in 20' sq 1d4 HP each 5' movement and Ref save or slowed 1 dy to half speed for $L hr",
  "Spike Stones": "R$RM' Spikes on stony group in 20' sq 1d8 HP each 5' movement and Ref save or slowed 1 dy to half speed for $L hr",
  "Spiritual Weapon": "R$RM' Force weapon (+BAB+Wis 1d8+${Math.min(Math.floor(lvl/3),5)}) attacks designated foes for $L rd",
  "Stabilize": "R$RS' Stabilize dying target",
  "Statue": "Touched become statue at will for $L hr",
  "Status": "Monitor condition/position of $Ldiv3 touched allies for $L hr",
  "Stinking Cloud": "R$RM' 20'-radius fog obscures vision, Fort save or 1d4+1 rd nausea (no attacks/spells) for $L rd",
  "Stone Shape": "Shape ${10+lvl}' cu of stone",
  "Stone Tell": "Self dialogue w/stone for $L min",
  "Stone To Flesh": "R$RM' Restore stoned creature (DC 15 Fort to survive) or make flesh 10'x3' stone cyclinder",
  "Stoneskin": "Touched DR 10/adamantine for ${Math.min(lvl*10,150)} HP/$L min",
  "Storm Of Vengeance": "R$RL' 360' radius storm deafen 1d4x10 min (Fort negates), then rain acid 1d6 HP, then 6 bolts lightning 10d6 (Ref half), then hail 5d6 HP, then dark 6 rd",
  "Suggestion": "R$RS' Target Will save or follow reasonable suggestion",
  "Summon Instrument": "Musical instrument appears for $L min",
  "Summon Monster I": "R$RS' 1 1st-level creature appears, fights foes for $L rd",
  "Summon Monster II": "R$RS' 1 2nd-/1d3 1st-level creature appears, fights foes for $L rd",
  "Summon Monster III": "R$RS' 1 3rd-/1d3 2nd-/1d4+1 1st-level creature appears, fights foes for $L rd",
  "Summon Monster IV": "R$RS' 1 4th-/1d3 3rd-/1d4+1 lower-level creature appears, fights foes for $L rd",
  "Summon Monster V": "R$RS' 1 5th-/1d3 4th-/1d4+1 lower-level creature appears, fights foes for $L rd",
  "Summon Monster VI": "R$RS' 1 6th-/1d3 5th-/1d4+1 lower-level creature appears, fights foes for $L rd",
  "Summon Monster VII": "R$RS' 1 7th-/1d3 6th-/1d4+1 lower-level creature appears, fights foes for $L rd",
  "Summon Monster VIII": "R$RS' 1 8th-/1d3 7th-/1d4+1 lower-level creature appears, fights foes for $L rd",
  "Summon Monster IX": "R$RS' 1 9th-/1d3 8th-/1d4+1 lower-level creature appears, fights foes for $L rd",
  "Summon Nature's Ally I": "R$RS' 1 1st-level creature appears, fights foes for $L rd",
  "Summon Nature's Ally II": "R$RS' 1 2nd-/1d3 1st-level creature appears, fights foes for $L rd",
  "Summon Nature's Ally III": "R$RS' 1 3rd-/1d3 2nd-/1d4+1 1st-level creature appears, fights foes for $L rd",
  "Summon Nature's Ally IV": "R$RS' 1 4th-/1d3 3rd-/1d4+1 lower-level creature appears, fights foes for $L rd",
  "Summon Nature's Ally V": "R$RS' 1 5th-/1d3 4th-/1d4+1 lower-level creature appears, fights foes for $L rd",
  "Summon Nature's Ally VI": "R$RS' 1 6th-/1d3 5th-/1d4+1 lower-level creature appears, fights foes for $L rd",
  "Summon Nature's Ally VII": "R$RS' 1 7th-/1d3 6th-/1d4+1 lower-level creature appears, fights foes for $L rd",
  "Summon Nature's Ally VIII": "R$RS' 1 8th-/1d3 7th-/1d4+1 lower-level creature appears, fights foes for $L rd",
  "Summon Nature's Ally IX": "R$RS' 1 9th-/1d3 8th-/1d4+1 lower-level creature appears, fights foes for $L rd",
  "Summon Swarm": "R$RS' Swarm of bats/rats/spiders obey for conc + 2 rd",
  "Sunbeam": "60' beam blinds, 4d6 HP (undead ${Lmin20}d6) (Ref unblind/half) 1/rd for ${Math.min(Math.floor(lvl/30),6)} rd",
  "Sunburst": "R$RL' 80' radius blinds, 6d6 HP (undead ${Lmin25}d6) (Ref unblind/half)",
  "Symbol Of Death": "R60' Rune kills 150 HP of creatures (Fort negate) when triggered",
  "Symbol Of Fear": "R60' Rune panics creatures (Will negate) for $L rd when triggered",
  "Symbol Of Insanity": "R60' Rune makes creatures insane (Will negate) permanently when triggered",
  "Symbol Of Pain": "R60' Rune causes pain (-4 attack/skill/ability, Fort negate) when triggered for $L10 min",
  "Symbol Of Persuasion": "R60' Rune charms creatures (Will negate) for $L hrs when triggered for $L10 min",
  "Symbol Of Sleep": "R60' Rune sleeps creatures (Will negate) le 10 HD for 3d6x10 min when triggered for $L10 min",
  "Symbol Of Stunning": "R60' Rune stuns creatures (Will negate) for 1d6 rd when triggered",
  "Symbol Of Weakness": "R60' Rune weakens creatures (3d6 Str, Fort negate) permanently when triggered for $L10 min",
  "Sympathetic Vibration": "Touched structure 2d10 HP/rd for $L rd",
  "Sympathy": "Named kind/alignment creatures Will save or drawn to $L10' cube for $L2 hr",
  "Telekinesis": "R$RL' Move ${Math.min(lvl*25,375)} lb 20' for $L rd, combat maneuver (CMB $L) $L rd, or hurl ${Math.min(lvl,15)} objects ${Math.min(lvl*25,375)} lbs total (Will negate)",
  "Telekinetic Sphere": "R$RS' Impassible $L'-diameter sphere surrounds target, move 30' to $RM' away for $L min",
  "Telepathic Bond": "R$RS' Self share thoughts w/$Ldiv3 allies for $L10 min",
  "Teleport": "Transport you, $Ldiv3 others $L100 mi w/some error chance",
  "Teleport Object": "Transport touched object $L100 mi w/some error chance",
  "Teleportation Circle": "Transport creatures in 5' radius anywhere w/no error chance for $L10 min",
  "Temporal Stasis": "Touched Fort save or in permanent stasis",
  "Time Stop": "All others halt, invulnerable for 1d4+1 rd",
  "Tiny Hut": "20' sphere resists elements for $L2 hr",
  "Tongues": "Touched communicate in any language for $L10 min",
  "Touch Of Fatigue": "Touch attack fatigues target for $L rd",
  "Touch Of Idiocy": "Touch attack 1d6 Int/Wis/Cha for $L10 min",
  "Transformation": "Self +4 Str/Dex/Con/AC, +5 Fort, martial prof, no spells for $L rd",
  "Transmute Metal To Wood": "R$RL' Metal 40' radius becomes wood (-2 attack/damage/AC)",
  "Transmute Mud To Rock": "R$RM' $L2 10' mud cubes become rock",
  "Transmute Rock To Mud": "R$RM' $L2 10' natural rock cubes become mud",
  "Transport Via Plants": "Self and $Ldiv3 willing targets teleport via like plants",
  "Trap The Soul": "R$RS' Target Will save or imprisoned in gem",
  "Tree Shape": "Become tree for $L hr",
  "Tree Stride": "Teleport 3000' via like trees",
  "True Resurrection": "Fully restore target dead $L10 yr",
  "True Seeing": "Touched sees through 120' darkness/illusion/invisible for $L min",
  "True Strike": "Self +20 next attack",
  "Undeath To Death": "R$RM' ${Lmin20}d4 HD of creatures le 8 HD w/in 40' Will save or destroyed",
  "Undetectable Alignment": "R$RS' Target Will save or alignment concealed for 1 dy",
  "Unhallow": "40' radius warded against good, evokes bane spell",
  "Unholy Aura": "$L creatures w/in 20' +4 AC/saves, SR 25 vs. good spells, protected from possession, good hit Fort save or 1d6 Str, for $L rd",
  "Unholy Blight": "R$RM' Good w/in 20'-radius burst ${Math.min(Math.floor(source/2),5)}d8 HP and sickened 1d4 rd, neutral half (Will half)",
  "Unseen Servant": "R$RS' Invisible servant obey for $L hr",
  "Vampiric Touch": "Touch attack ${Math.min(Math.floor(lvl/2),10)} HP, gain half as temporary HP for 1 hr",
  "Veil": "R$RL' Targets in 30' radius Will save or appear as other creatures for conc + $L hr",
  "Ventriloquism": "R$RS' Self voice moves for $L min",
  "Virtue": "Touched +1 HP for 1 min",
  "Vision": "Info about target person/place/object",
  "Wail Of The Banshee": "R$RS' $L targets w/in 40' Fort save or $L10 HP",
  "Wall Of Fire": "R$RM' $L20' wall 2d4 HP w/in 10', 1d4 HP w/in 20', 2d6 HP transit (undead double) for conc + $L rd",
  "Wall Of Force": "R$RS' Impassible/immobile $L x 10' sq wall $L rd",
  "Wall Of Ice": "R$RM' $L x 10' x $L\" ice wall or ${lvl+3}' hemisphere for $L min",
  "Wall Of Iron": "R$RM' $L x 5' $Ldiv4\"-thick permanent iron wall",
  "Wall Of Stone": "R$RM' $L x 5' $Ldiv4\"-thick permanent stone wall",
  "Wall Of Thorns": "R$RM' $L x 10' cube thorns (25-AC) HP/rd to transiters for $L10 min",
  "Warp Wood": "R$RS' $L wooden objects Will save or warped",
  "Water Breathing": "Touched breathe underwater for $L2 hrs total",
  "Water Walk": "$L touched tread on liquid as if solid for $L10 min",
  "Waves Of Exhaustion": "60' cone exhausted",
  "Waves Of Fatigue": "30' cone fatigued",
  "Web": "R$RM' 20'-radius webs grapple (Ref negate), burn for 2d4 HP for $L10 min",
  "Weird": "R$RM' Targets in 30' radius Will save or fears create creature, touch kills (Fort 3d6 HP/1d4 Str/stun 1 rd)",
  "Whirlwind": "R$RL' 10'-radius wind 1d8 HP/rd for $L rd (Ref negate)",
  "Whispering Wind": "Send 25-word message $L mi to 10' area",
  "Wind Walk": "Self + $Ldiv3 touched vaporize and move 60 mph for $L hr",
  "Wind Wall": "R$RM' $L10'x5' curtain of air scatters objects, deflects arrows/bolts for $L rd",
  "Wish": "Alter reality, with few limits",
  "Wood Shape": "Shape ${10+lvl}' cu of wood",
  "Word Of Chaos": "Nonchaotic creatures w/in 40' with equal/-1/-5/-10 HD Will save or deafened 1d4 rd/stunned 1 rd/confused 1d10 min (save 1 rd)/killed (save 3d6+$Lmin25 HP)",
  "Word Of Recall": "Self + $Ldiv3 willing targets return to designated place",
  "Zone Of Silence": "No sound escapes 5' radius around self for $L hr",
  "Zone Of Truth": "R$RS' Creatures w/in 20' radius Will save or cannot lie for $L min"
*/
  "Acid Splash": "R60' Ranged touch ${Math.floor((lvl+1)/6) + 1}d6 HP (Ref neg)",
  'Aid':"R30' Three targets +5 or more HP for 8 hr",
  'Alarm':"R30' Alert when tiny or larger creature enters 20' cube for 8 hr",
  'Alter Self':"Self aquatic, look different, or nat weapons for conc up to 1 hr",
  'Animal Friendship':"R30' Target beast(s) Wis save or convinced of good intent for 1 dy",
  'Animal Messenger':"R30' Tiny beast target move 24+ hr to deliver 25-word messsage to person described",
  'Animal Shapes':"R30' Polymorph all targets in range into max large creature max CR 4",
  'Animate Dead':"R10' Animate med/small bones/corpse, command w/in 60' for 1 dy",
  'Animate Objects':"R120' Animate 10 sm/5 md/2 lg/1 hg objects, command w/in 500' for conc/1 min",
  'Antilife Shell':"Self 10' sphere prevents living passage for conc/1 hr",
  'Antimagic Field':"Self 10' sphere supresses magic for conc/1 hr",
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
  'Bigby\'s Hand':'Evocation',
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
  'Crusader\'s Mantle':'Evocation',
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
  'Drawmij\'s Instant Summons':'Conjuration',
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
  'Evard\'s Black Tentacles':'Conjuration',
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
  'Heroes\' Feast':'Conjuration',
  'Heroism':'Enchantment',
  'Hex':'Enchantment',
  'Hold Monster':'Enchantment',
  'Hold Person':'Enchantment',
  'Holy Aura':'Abjuration',
  'Hunger Of Hadar':'Conjuration',
  'Hunter\'s Mark':'Divination',
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
  'Leomund\'s Secret Chest':'Conjuraion',
  'Leomund\'s Tiny Hut':'Evocation',
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
  'Melf\'s Acid Arrow':'Evocation',
  'Mending':'Transmutation',
  'Message':'Transmutation',
  'Meteor Swarm':'Evocation',
  'Mind Blank':'Abjuration',
  'Mind Fog':'Enchantment',
  'Mordenkainen\'s Private Sanctum':'Abjuration',
  'Mordenkainen\'s Sword':'Evocation',
  'Move Earth':'Transmutation',

  'Nondetection':'Abjuration',
  'Nystul\'s Magic Aura':'Illusion',

  'Otiluke\'s Freezing Sphere':'Evocation',
  'Otiluke\'s Resilient Sphere':'Evocation',
  'Otto\'s Irresistable Dance':'Enchantment',

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
  'Rary\'s Telepathic Bond':'Divination',
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

  'Tasha\'s Hideous Laughter':'Enchantment',
  'Telekinesis':'Transmutation',
  'Telepathy':'Evocation',
  'Teleport':'Conjuration',
  'Teleportation Circle':'Conjuration',
  'Tenser\'s Floating Disk':'Conjuration',
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
FiveE.spellsSchools = {
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
  'Bigby\'s Hand':'Evocation',
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
  'Crusader\'s Mantle':'Evocation',
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
  'Drawmij\'s Instant Summons':'Conjuration',
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
  'Evard\'s Black Tentacles':'Conjuration',
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
  'Heroes\' Feast':'Conjuration',
  'Heroism':'Enchantment',
  'Hex':'Enchantment',
  'Hold Monster':'Enchantment',
  'Hold Person':'Enchantment',
  'Holy Aura':'Abjuration',
  'Hunger Of Hadar':'Conjuration',
  'Hunter\'s Mark':'Divination',
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
  'Leomund\'s Secret Chest':'Conjuraion',
  'Leomund\'s Tiny Hut':'Evocation',
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
  'Melf\'s Acid Arrow':'Evocation',
  'Mending':'Transmutation',
  'Message':'Transmutation',
  'Meteor Swarm':'Evocation',
  'Mind Blank':'Abjuration',
  'Mind Fog':'Enchantment',
  'Mordenkainen\'s Private Sanctum':'Abjuration',
  'Mordenkainen\'s Sword':'Evocation',
  'Move Earth':'Transmutation',

  'Nondetection':'Abjuration',
  'Nystul\'s Magic Aura':'Illusion',

  'Otiluke\'s Freezing Sphere':'Evocation',
  'Otiluke\'s Resilient Sphere':'Evocation',
  'Otto\'s Irresistable Dance':'Enchantment',

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
  'Rary\'s Telepathic Bond':'Divination',
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

  'Tasha\'s Hideous Laughter':'Enchantment',
  'Telekinesis':'Transmutation',
  'Telepathy':'Evocation',
  'Teleport':'Conjuration',
  'Teleportation Circle':'Conjuration',
  'Tenser\'s Floating Disk':'Conjuration',
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

/* Defines the rules related to character abilities. */
FiveE.abilityRules = function(rules) {

  for(var ability in {'charisma':'', 'constitution':'', 'dexterity':'',
                      'intelligence':'', 'strength':'', 'wisdom':''}) {
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
FiveE.backgroundRules = function(rules, backgrounds) {

  for(var i = 0; i < backgrounds.length; i++) {

    var name = backgrounds[i];
    var equipment = [];
    var features = [];
    var languages = [];
    var notes = [];
    var proficiencyCounts = {};
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
      proficiencyCounts = {'Skill':2};
      proficienciesGiven = {'Skill':['Insight', 'Religion']};
    } else if(name == 'Charlatan') {
      equipment = [
        'Fine Clothes', 'Disguise Kit', 'Con Tools', '15 GP'
      ];
      features = ['False Identity'];
      notes = [
        'featureNotes.falseIdentityFeature:Documented 2nd ID, forgery skills'
      ];
      proficiencyCounts = {'Skill':2, 'Tool':2};
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
      proficiencyCounts = {'Skill':2, 'Tool':2};
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
      proficiencyCounts = {'Skill':2, 'Tool':2};
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
      proficiencyCounts = {'Skill':2, 'Tool':2};
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
      proficiencyCounts = {'Skill':2, 'Tool':1};
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
      proficiencyCounts = {'Skill':2, 'Tool':1};
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
      proficiencyCounts = {'Skill':2, 'Tool':1};
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
      proficiencyCounts = {'Skill':2, 'Tool':1};
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
      proficiencyCounts = {'Skill':2};
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
      proficiencyCounts = {'Skill':2, 'Tool':2};
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
      proficiencyCounts = {'Skill':2, 'Tool':2};
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
      proficiencyCounts = {'Skill':2, 'Tool':2};
      proficienciesGiven = {
        'Skill':['Sleight Of Hand', 'Stealth'],
        'Tool':['Diguise Kit', "Thieves' Tools"]
      };
    } else
      continue;

    FiveE.defineBackground(
      rules, name, features, languages, proficiencyCounts, proficienciesGiven,
      proficiencyChoices, notes
    );

  }

};

/* Defines the rules related to character classes. */
FiveE.classRules = function(rules, classes) {

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

    var features, hitDie, notes, proficiencyCounts, proficiencyChoices,
        proficienciesGiven, selectableFeatures, spellAbility, spellsKnown,
        spellsPerDay;
    var name = classes[i];

    if(name == 'Barbarian') {

      features = [
        '1:Rage', '1:Unarmored Defense', '2:Danger Sense', '2:Reckless Attack',
        '3:Frenzy', '3:Primal Path', '3:Spirit Seeker', '3:Bear Totem Spirit',
        '3:Eagle Totem Spirit', '3:Wolf Totem Spirit', '5:Extra Attack',
        '5:Fast Movement', '6:Mindless Rage', '6:Aspect Of The Bear',
        '6:Aspect Of The Eagle', '6:Aspect Of The Wolf', '7:Feral Instinct',
        '9:Brutal Critical', '10:Intimidating Presence', '10:Spirit Walker',
        '11:Relentless Rage', '14:Retaliation', '14:Bear Totemic Attunement',
        '14:Eagle Totemic Attunement', '14:Wolf Totemic Attunement',
        '15:Persistent Rage', '18:Indominable Might', '20:Primal Champion'
      ];
      hitDie = 12;
      notes = [
        'abilityNotes.aspectOfTheBearFeature:Double load/lift, Adv Str checks',
        'abilityNotes.aspectOfTheEagleFeature:See 1 mile clearly, no perception Disadv in dim light',
        'abilityNotes.aspectOfTheWolfFeature:Track at fast pace, stealth at normal pace',
        'abilityNotes.eagleTotemicAttunement:Fly for short bursts when raging',
        'abilityNotes.fastMovementFeature:+10 speed in light/no armor',
        'abilityNotes.indominableMightFeature:Use strength instead of roll for Str check',
        'abilityNotes.primalChampionFeature:+4 strength/+4 constitution',
        'abilityNotes.rageFeature:Adv Str checks',
        'combatNotes.bearTotemicAttunement:When raging, foes w/in 5\' Disadv attacking others',
        'combatNotes.bearTotemSpiritFeature:Resist non-psychic damage',
        'combatNotes.brutalCriticalFeature:+%V critical damage dice',
        'combatNotes.eagleTotemSpiritFeature:Foes Disadv opportunity attack, Dash as bonus action',
        'combatNotes.extraAttackFeature:+1 attack per Attack action',
        'combatNotes.feralInstinctFeature:Adv on initiative, act when surprised if raging',
        'combatNotes.frenzyFeature:Bonus attack during rage',
        'combatNotes.persistentRageFeature:Rage ends only when unconscious or chosen',
        'combatNotes.rageFeature:' +
          '+%V melee damage, resist bludgeon/pierce/slash damage for 1 minute %1/long rest',
        'combatNotes.recklessAttackFeature:Adv on melee Str attacks, foes Adv on all attacks',
        'combatNotes.retaliationFeature:Melee attack reaction after taking damage',
        'combatNotes.relentlessRageFeature:DC 10/15/20/etc. Con to continue fighting w/1 HP when brought to 0 HP',
        'combatNotes.unarmoredDefenseFeature:Add Con modifier to AC in no armor',
        'combatNotes.wolfTotemicAttunement:Bonus knock large or smaller foe after successful attack',
        'combatNotes.wolfTotemSpiritFeature:Allies Adv attack vs. foes w/in 5\' of self',
        'featureNotes.intimidatingPresenceFeature:Target creature DC %V Will save or frightened',
        'magicNotes.spiritSeekerFeature:<i>Beast Sense</i>, <i>Speak With Animals</i> via ritual',
        'magicNotes.spiritWalkerFeature:<i>Commune With Nature</i> via ritual',
        'saveNotes.dangerSenseFeature:Adv vs. seen effects',
        'saveNotes.mindlessRageFeature:Immune charmed/frightened during rage'
      ];
      proficiencyCounts = {'Save':2, 'Skill':2, 'Armor':3, 'Weapon':2};
      proficienciesGiven = {
        'Save': ['Constitution', 'Strength'],
        'Armor': ['Light', 'Medium', 'Shield'],
        'Weapon': ['Simple', 'Martial']
      };
      proficiencyChoices = {
        'Skill':['Animal Handling', 'Athletics', 'Intimidation', 'Nature',
                 'Perception', 'Survival']
      };
      selectableFeatures = FiveE.BARBARIAN_PATHS.map(function (path) {return 'Primal Path (' + path + ')'}).concat(FiveE.BARBARIAN_TOTEMS.map(function (totem) {return totem + ' Totem'}));
      spellAbility = null;
      spellsKnown = null;
      spellsPerDay = null;

      rules.defineRule('barbarianFeatures.Frenzy',
        'barbarianFeatures.Primal Path (Berserker)', '?', null
      );
      rules.defineRule('barbarianFeatures.Mindless Rage',
        'barbarianFeatures.Primal Path (Berserker)', '?', null
      );
      rules.defineRule('barbarianFeatures.Intimidating Presence',
        'barbarianFeatures.Primal Path (Berserker)', '?', null
      );
      rules.defineRule('barbarianFeatures.Retaliation',
        'barbarianFeatures.Primal Path (Berserker)', '?', null
      );
      rules.defineRule('barbarianFeatures.Bear Totem Spirit',
        'barbarianFeatures.Bear Totem', '?', null
      );
      rules.defineRule('barbarianFeatures.Eagle Totem Spirit',
        'barbarianFeatures.Eagle Totem', '?', null
      );
      rules.defineRule('barbarianFeatures.Wolf Totem Spirit',
        'barbarianFeatures.Wolf Totem', '?', null
      );
      rules.defineRule('barbarianFeatures.Aspect Of The Bear',
        'barbarianFeatures.Bear Totem', '?', null
      );
      rules.defineRule('barbarianFeatures.Aspect Of The Eagle',
        'barbarianFeatures.Eagle Totem', '?', null
      );
      rules.defineRule('barbarianFeatures.Aspect Of The Wolf',
        'barbarianFeatures.Wolf Totem', '?', null
      );
      rules.defineRule('barbarianFeatures.Spirit Walker',
        'barbarianFeatures.Primal Path (Totem Warrior)', '?', null
      );
      rules.defineRule('barbarianFeatures.Bear Totemic Attunement',
        'barbarianFeatures.Bear Totem', '?', null
      );
      rules.defineRule('barbarianFeatures.Eagle Totemic Attunement',
        'barbarianFeatures.Eagle Totem', '?', null
      );
      rules.defineRule('barbarianFeatures.Wolf Totemic Attunement',
        'barbarianFeatures.Wolf Totem', '?', null
      );

      rules.defineRule('combatNotes.brutalCriticalFeature',
        'levels.Barbarian', '=', 'source >= 17 ? 3 : source >= 13 ? 2 : source >= 9 ? 1 : null'
      );
      rules.defineRule('combatNotes.rageFeature',
        'levels.Barbarian', '+=', 'Math.floor(source / 8) + 2'
      );
      rules.defineRule('combatNotes.rageFeature.1',
        'levels.Barbarian', '+=', 'source < 3 ? 2 : source < 6 ? 3 : source < 12 ? 4 : source < 17 ? 5 : source < 20 ? 6 : "unlimited"'
      );
      // Inelegant hacks to show unarmoredDefense note properly even when armor
      // != "None"
      rules.defineRule('combatNotes.unarmoredDefenseFeature.1',
        'constitutionModifier', '=', null
      );
      rules.defineRule('combatNotes.unarmoredDefenseFeature.2',
        'constitutionModifier', '=', '-source',
        'armor', '?', 'source != "None"'
      );
      rules.defineRule('armorClass',
        'combatNotes.unarmoredDefenseFeature', '+', '0',
        'combatNotes.unarmoredDefenseFeature.1', '+', null,
        'combatNotes.unarmoredDefenseFeature.2', '+', null
      );
      rules.defineRule('featureNotes.intimidatingPresenceFeature',
        'charismaModifier', '=', 'source + 8',
        'proficiencyBonus', '+', null
      );
      rules.defineRule
        ('attacksPerRound', 'combatNotes.extraAttackFeature', '+', '1');
      rules.defineRule('selectableFeatureCount.Barbarian',
        'levels.Barbarian', '=', 'source < 3 ? null : 1',
        'barbarianFeatures.Primal Path (Totem Warrior)', '+', '1'
      );
      rules.defineRule('speed', 'abilityNotes.fastMovementFeature', '+', '10');

    } else if(name == 'Bard') {

      features = [
        '1:Bardic Inspiration', '2:Jack Of All Trades', '2:Song Of Rest',
        '3:Bard College', 'Combat Inspiration', '3:Cutting Words',
        '3:Expertise', '5:Font Of Inspiration', '6:Countercharm',
        '6:Additional Magical Secrets', '6:Extra Attack', '10:Magical Secrets',
        '14:Battle Magic', '14:Peerless Skill', '20:Superior Inspiration'
      ];
      hitDie = 8;
      notes = [
        'combatNotes.battleMagicFeature:Bonus attack after casting Bard spell',
        'combatNotes.extraAttackFeature:+1 attack per Attack action',
        'featureNotes.bardicInspirationFeature:Grant d%V inspiration %1/long rest',
        'featureNotes.combatInspirationFeature:Ally use inspiration die to boost damage/AC',
        'featureNotes.cuttingWordsFeature:Reaction to subtract inspiration die from roll of creature w/in 60\'',
        'featureNotes.expertiseFeature:Double bonus for %V proficiencies',
        'featureNotes.fontOfInspirationFeature:Refresh Bardic Inspiration after rest',
        'featureNotes.jackOfAllTradesFeature:+%V ability checks',
        'featureNotes.songOfRestFeature:Listeners regain d%V HP after short rest',
        'featureNotes.superiorInspirationFeature:When all Bardic Inspiration used, regain 1 on initiative',
        'magicNotes.additionalMagicalSecretsFeature:Know 2 additional spells from any class',
        'magicNotes.countercharmFeature:Friendly listeners w/in 30\' Adv vs. charmed/frightened',
        'magicNotes.magicalSecretsFeature:Know %V additional spells from any class'
      ];
      proficiencyCounts =
        {'Save':2, 'Skill':3, 'Tool':3, 'Armor':1, 'Weapon':5};
      proficienciesGiven = {
        'Save':['Charisma', 'Dexterity'],
        'Armor':['Light'],
        'Weapon':['Simple','Hand Crossbow','Longsword','Rapier','Shortsword']
      };
      proficiencyChoices = {
        'Skill': FiveE.SKILLS.map(function(skill){return skill.substring(0, skill.indexOf(':'));}),
        'Tool':['Music']
      };
      selectableFeatures = FiveE.BARD_COLLEGES;
      spellAbility = 'charisma';
      // TODO spells known are total, not per level
      // 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 15, 16, 18, 19, 19, 20, 22
      spellsKnown = [
        'B0:1:4/4:3/10:4',
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
      spellsPerDay = [
        'B0:1:4/4:3/10:4',
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
      rules.defineRule('bardFeatures.Battle Magic',
        'bardFeatures.College Of Valor', '?', null
      );
      rules.defineRule('bardFeatures.Combat Inspiration',
        'bardFeatures.College Of Valor', '?', null
      );
      rules.defineRule('bardFeatures.Cutting Words',
        'bardFeatures.College Of Lore', '?', null
      );
      rules.defineRule('bardFeatures.Extra Attack',
        'bardFeatures.College Of Valor', '?', null
      );
      rules.defineRule('bardFeatures.Peerless Skill',
        'bardFeatures.College Of Lore', '?', null
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
      rules.defineRule('featureNotes.jackOfAllTradesFeature',
        'proficiencyBonus', '=', 'Math.floor(source / 2)'
      );
      rules.defineRule('featureNotes.songOfRestFeature',
        'levels.Bard', '=', 'source < 2 ? null : source < 9 ? 6 : (8 + Math.floor((source - 9) / 4) * 2)'
      );
      rules.defineRule('magicNotes.magicalSecretsFeature',
        'levels.Bard', '=', 'source < 10 ? null : (Math.floor((source - 6) / 4) * 2)'
      );
      rules.defineRule
        ('selectableFeatureCount.Bard', 'bardFeatures.Bard College', '=', '1');

    } else if(name == 'Cleric') {

      features = [
        '1:Divine Domain', '2:Channel Divinity', '5:Destroy Undead',
        '10:Divine Intervention'
      ];
      hitDie = 8;
      notes = [
        'combatNotes.destroyUndeadFeature:Turn destroys up to CR %V',
        'featureNotes.channelDivinityFeature:Turn undead, domain effect %V/short rest',
        'magicNotes.divineDomainFeature:Gain chosen domain benefits',
        'magicNotes.divineInterventionFeature:%V% chance of deity help 1/wk'
      ];
      proficiencyCounts = {'Save':2, 'Skill':2, 'Armor':3, 'Weapon':1};
      proficienciesGiven = {
        'Save':['Charisma', 'Wisdom'],
        'Armor':['Light', 'Medium', 'Shield'],
        'Weapon':['Simple']
      };
      proficiencyChoices = {
        'Skill':['History', 'Insight', 'Medicine', 'Persuasion', 'Religion']
      };
      selectableFeatures = [
        'Knowledge Domain', 'Life Domain', 'Light Domain', 'Nature Domain',
        'Tempest Domain', 'Trickery Domain', 'War Domain'
      ];
      spellAbility = 'wisdom';
      spellsKnown = [
        'C0:1:"all"', 'C1:1:"all"', 'C2:3:"all"', 'C3:5:"all"',
        'C4:7:"all"', 'C5:9:"all"', 'C6:11:"all"', 'C7:13:"all"',
        'C8:15:"all"', 'C9:17:"all"',
        'Dom1:1:"all"', 'Dom2:3:"all"', 'Dom3:5:"all"', 'Dom4:7:"all"',
        'Dom5:9:"all"', 'Dom6:11:"all"', 'Dom7:13:"all"', 'Dom8:15:"all"',
        'Dom9:17:"all"'
      ];
      spellsPerDay = [
        'C0:1:3/4:4/10:5',
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

      rules.defineRule('casterLevelDivine', 'levels.Cleric', '+=', null);
      rules.defineRule('combatNotes.destroyUndeadFeature', 'levels.Cleric', '=', 'source < 8 ? 0.5 : Math.floor((source - 5) / 3)');
      rules.defineRule('featureNotes.channelDivinityFeature', 'levels.Cleric', '=', 'source < 6 ? 1: source < 18 ? 2 : 3');
      rules.defineRule('magicNotes.divineInterventionFeature', 'level.Cleric', '=', null);
      rules.defineRule('selectableFeatureCount.Cleric',
        'clericFeatures.Divine Domain', '=', '1'
      );

    } else if(name == 'Druid') {

      continue; // TODO
      feats = null;
      features = [
        '1:Animal Companion', '1:Nature Sense', '1:Spontaneous Druid Spell',
        '1:Wild Empathy',
        '1:Weapon Proficiency ' +
          '(Club/Dagger/Dart/Quarterstaff/Scimitar/Sickle/Short Spear/Sling/Spear)',
        '2:Woodland Stride', '3:Trackless Step', '4:Resist Nature\'s Lure',
        '5:Wild Shape', '9:Venom Immunity', '13:Thousand Faces',
        '15:Timeless Body', '16:Elemental Shape'
      ];
      hitDie = 8;
      notes = [
        'featureNotes.animalCompanionFeature:Special bond/abilities',
        'featureNotes.timelessBodyFeature:No aging penalties',
        'featureNotes.tracklessStepFeature:Untrackable outdoors',
        'featureNotes.woodlandStrideFeature:' +
          'Normal movement through undergrowth',
        'magicNotes.elementalShapeFeature:Wild Shape to elemental %V/day',
        'magicNotes.spontaneousDruidSpellFeature:' +
          '<i>Summon Nature\'s Ally</i>',
        'magicNotes.thousandFacesFeature:<i>Alter Self</i> at will',
        'magicNotes.wildShapeFeature:' +
          'Change into creature of size %V for %1 hours %2/day',
        'saveNotes.resistNature\'sLureFeature:+4 vs. spells of feys',
        'saveNotes.venomImmunityFeature:Immune to poisons',
        'skillNotes.natureSenseFeature:+2 Knowledge (Nature)/Survival',
        'skillNotes.wildEmpathyFeature:+%V Diplomacy w/animals',
        'validationNotes.druidClassAlignment:Requires Alignment =~ Neutral',
        'validationNotes.druidClassArmor:' +
          'Requires Armor =~ None|Hide|Leather|Padded',
        'validationNotes.druidClassShield:Requires Shield =~ None|Wooden'
      ];
      proficiencyCounts =
       {'Save':2, 'Skill':2, 'Tool':1, 'Armor':3, 'Weapon':10};
      proficienciesGiven = {
        'Save':['Intelligence', 'Wisdom'],
        'Armor':['Light', 'Medium', 'Shield'],
        'Tool':['Herbalism Kit'],
        'Weapon':['Club', 'Dagger', 'Dart', 'Javelin', 'Quarterstaff',
                  'Scimitar', 'Sickle', 'Sling', 'Spear']
      };
      proficiencyChoices = {
        'Skill':['Arcana', 'Animal Handling', 'Insight', 'Medicine', 'Nature',
                 'Perception', 'Religion', 'Survival']
      };
      selectableFeatures = null;
      spellAbility = 'wisdom';
      spellsKnown = [
        'D0:1:"all"', 'D1:1:"all"', 'D2:3:"all"', 'D3:5:"all"',
        'D4:7:"all"', 'D5:9:"all"', 'D6:11:"all"', 'D7:13:"all"',
        'D8:15:"all"', 'D9:17:"all"'
      ];
      spellsPerDay = [
        'D0:1:3/2:4/4:5/7:6',
        'D1:1:1/2:2/4:3/7:4/11:5',
        'D2:3:1/4:2/6:3/9:4/13:5',
        'D3:5:1/6:2/8:3/11:4/15:5',
        'D4:7:1/8:2/10:3/13:4/17:5',
        'D5:9:1/10:2/12:3/15:4/19:5',
        'D6:11:1/12:2/14:3/17:4',
        'D7:13:1/14:2/16:3/19:4',
        'D8:15:1/16:2/18:3/20:4',
        'D9:17:1/18:2/19:3/20:4'
      ];
      rules.defineRule
        ('animalCompanionMasterLevel', 'levels.Druid', '+=', null);
      rules.defineRule('casterLevelDivine', 'levels.Druid', '+=', null);
      rules.defineRule('languageCount', 'levels.Druid', '+', '1');
      rules.defineRule('languages.Druidic', 'levels.Druid', '=', '1');
      rules.defineRule('magicNotes.elementalShapeFeature',
        'levels.Druid', '=', 'source < 16 ? null : Math.floor((source-14) / 2)'
      );
      rules.defineRule('magicNotes.wildShapeFeature',
        'levels.Druid', '=',
          'source < 5 ? null : ' +
          'source < 8 ? "small-medium" : ' +
          'source < 11 ? "small-large" : ' +
          'source == 11 ? "tiny-large" : ' +
          'source < 15 ? "tiny-large/plant" : "tiny-huge/plant"'
      );
      rules.defineRule
        ('magicNotes.wildShapeFeature.1', 'levels.Druid', '=', null);
      rules.defineRule('magicNotes.wildShapeFeature.2',
        'levels.Druid', '=',
           'source < 5 ? null : ' +
           'source == 5 ? 1 : ' +
           'source == 6 ? 2 : ' +
           'source < 10 ? 3 : ' +
           'source < 14 ? 4 : ' +
           'source < 18 ? 5 : 6'
      );
      rules.defineRule('skillNotes.wildEmpathyFeature',
        'levels.Druid', '+=', null,
        'charismaModifier', '+', null
      );

    } else if(name == 'Fighter') {

      features = [
        '1:Fighting Style', '1:Second Wind', '2:Action Surge',
        '3:Martial Archetype', '5:Extra Attack', '9:Indomitable'
      ];
      hitDie = 10;
      notes = [
        'combatNotes.actionSurgeFeature:TODO',
        'combatNotes.extraAttackFeature:+1 attack per Attack action',
        'combatNotes.fightingStyleFeature:TODO',
        'combatNotes.indomitableFeature:TODO',
        'combatNotes.martialArchetypeFeature:TODO',
        'combatNotes.secondWindFeature:TODO'
      ];
      proficiencyCounts = {'Save':2, 'Skill':2, 'Armor':4, 'Weapon':2};
      proficienciesGiven = {
        'Save':['Constitution', 'Strength'],
        'Armor':['Light', 'Medium', 'Heavy', 'Shield'],
        'Weapon':['Simple', 'Martial']
      };
      proficiencyChoices = {
        'Skill': ['Acrobatics', 'Animal Handling', 'Athletics', 'History',
                  'Insight', 'Intimidation', 'Perception', 'Survival']
      };
      selectableFeatures = null;
      spellAbility = null;
      spellsKnown = null;
      spellsPerDay = null;

      rules.defineRule
        ('attacksPerRound', 'combatNotes.extraAttackFeature', '+', '1');

    } else if(name == 'Monk') {

      continue; // TODO
      feats = null;
      features = [
        '1:Flurry Of Blows', '1:Improved Unarmed Strike',
        '1:Weapon Proficiency ' +
          '(Club/Dagger/Handaxe/Heavy Crossbow/Javelin/Kama/Light Crossbow/Nunchaku/Quarterstaff/Sai/Shuriken/Siangham/Sling)',
        '2:Evasion', '3:Fast Movement', '3:Still Mind', '4:Ki Strike',
        '4:Slow Fall', '5:Purity Of Body', '7:Wholeness Of Body',
        '9:Improved Evasion', '10:Lawful Ki Strike', '11:Diamond Body',
        '11:Greater Flurry', '12:Abundant Step', '13:Diamond Soul',
        '15:Quivering Palm', '16:Adamantine Ki Strike', '17:Timeless Body',
        '17:Tongue Of The Sun And Moon', '19:Empty Body', '20:Perfect Self'
      ];
      hitDie = 8;
      notes = [
        'abilityNotes.fastMovementFeature:+%V speed',
        'combatNotes.adamantineKiStrikeFeature:' +
          'Treat unarmed as adamantine weapon',
        'combatNotes.flurryOfBlowsFeature:Take %V penalty for extra attack',
        'combatNotes.greaterFlurryFeature:Extra attack',
        'combatNotes.improvedUnarmedStrikeFeature:' +
          'No AOO on unarmed attack, may deal lethal damage',
        'combatNotes.kiStrikeFeature:Treat unarmed as magic weapon',
        'combatNotes.lawfulKiStrikeFeature:Treat unarmed as lawful weapon',
        'combatNotes.perfectSelfFeature:' +
          'Ignore first 10 points of non-magical damage',
        'combatNotes.quiveringPalmFeature:' +
          'Foe makes DC %V Fortitude save or dies 1/week',
        'featureNotes.timelessBodyFeature:No aging penalties',
        'featureNotes.tongueOfTheSunAndMoonFeature:Speak w/any living creature',
        'magicNotes.abundantStepFeature:' +
          '<i>Dimension Door</i> at level %V 1/day',
        'magicNotes.emptyBodyFeature:<i>Etherealness</i> %V rounds/day',
        'magicNotes.wholenessOfBodyFeature:Heal %V damage to self/day',
        'sanityNotes.monkClassArmor:Implies Armor == None',
        'sanityNotes.monkClassShield:Implies Shield == None',
        'saveNotes.diamondBodyFeature:Immune to poison',
        'saveNotes.diamondSoulFeature:DC %V spell resistance',
        'saveNotes.evasionFeature:Reflex save yields no damage instead of 1/2',
        'saveNotes.improvedEvasionFeature:Failed save yields 1/2 damage',
        'saveNotes.perfectSelfFeature:Treat as outsider for magic saves',
        'saveNotes.purityOfBodyFeature:Immune to normal disease',
        'saveNotes.slowFallFeature:' +
          'Subtract %V ft from falling damage distance',
        'saveNotes.stillMindFeature:+2 vs. enchantment',
        'validationNotes.combatReflexesSelectableFeatureLevels:' +
           'Requires Monk >= 2',
        'validationNotes.deflectArrowsSelectableFeatureLevels:' +
           'Requires Monk >= 2',
        'validationNotes.improvedDisarmSelectableFeatureLevels:' +
           'Requires Monk >= 6',
        'validationNotes.improvedGrappleSelectableFeatureLevels:' +
           'Requires Monk >= 1',
        'validationNotes.improvedTripSelectableFeatureLevels:' +
           'Requires Monk >= 6',
        'validationNotes.monkClassAlignment:Requires Alignment =~ Lawful',
        'validationNotes.stunningFistSelectableFeatureLevels:Requires Monk >= 1'
      ];
      proficiencyCounts = {'Save':2, 'Skill':2, 'Weapon':2};
      proficienciesGiven = {
        'Save':['Dexterity', 'Strength'],
        'Weapon':['Simple', 'Shortsword']
      };
      proficiencyChoices = {
        'Skill':['Acrobatics', 'Athletics', 'History', 'Insight', 'Religion',
                 'Stealth']
      };
      selectableFeatures = [
        'Combat Reflexes', 'Deflect Arrows', 'Improved Disarm',
        'Improved Grapple', 'Improved Trip', 'Stunning Fist'
      ];
      spellAbility = null;
      spellsKnown = null;
      spellsPerDay = null;
      rules.defineRule('abilityNotes.fastMovementFeature',
        'levels.Monk', '+=', '10 * Math.floor(source / 3)'
      );
      rules.defineRule
        ('armorClass', 'combatNotes.monkArmorClassAdjustment', '+', null);
      rules.defineRule('combatNotes.flurryOfBlowsFeature',
        'levels.Monk', '=', 'source < 5 ? -2 : source < 9 ? -1 : 0'
      );
      rules.defineRule('combatNotes.monkArmorClassAdjustment',
        'levels.Monk', '+=', 'source >= 5 ? Math.floor(source / 5) : null',
        'wisdomModifier', '+', 'source > 0 ? source : null'
      );
      rules.defineRule('combatNotes.quiveringPalmFeature',
        'levels.Monk', '+=', '10 + Math.floor(source / 2)',
        'wisdomModifier', '+', null
      );
      rules.defineRule('combatNotes.stunningFistFeature.1',
        'levels.Monk', '+=', 'source - Math.floor(source / 4)'
      );
      rules.defineRule('magicNotes.abundantStepFeature',
        'levels.Monk', '+=', 'Math.floor(source / 2)'
      );
      rules.defineRule
        ('magicNotes.emptyBodyFeature', 'levels.Monk', '+=', null);
      rules.defineRule
        ('magicNotes.wholenessOfBodyFeature', 'levels.Monk', '+=', '2*source');
      rules.defineRule
        ('resistance.Enchantment', 'saveNotes.stillMindFeature', '+=', '2');
      rules.defineRule
        ('resistance.Spell', 'saveNotes.diamondSoulFeature', '+=', null);
      rules.defineRule
        ('saveNotes.diamondSoulFeature', 'levels.Monk', '+=', '10 + source');
      rules.defineRule('saveNotes.slowFallFeature',
        'levels.Monk', '=',
        'source < 4 ? null : source < 20 ? Math.floor(source / 2) * 10 : "all"'
      );
      rules.defineRule('selectableFeatureCount.Monk',
        'levels.Monk', '=', 'source < 2 ? 1 : source < 6 ? 2 : 3'
      );
      rules.defineRule('speed', 'abilityNotes.fastMovementFeature', '+', null);
      rules.defineRule('weaponDamage.Unarmed',
        'levels.Monk', '=',
        'source < 12 ? ("d" + (6 + Math.floor(source / 4) * 2)) : ' +
        '              ("2d" + (6 + Math.floor((source - 12) / 4) * 2))'
      );

    } else if(name == 'Paladin') {

      continue; // TODO
      feats = null;
      features = [
        '1:Aura Of Good', '1:Detect Evil', '1:Smite Evil', '2:Divine Grace',
        '2:Lay On Hands', '3:Aura Of Courage', '3:Divine Health',
        '4:Turn Undead', '5:Special Mount', '6:Remove Disease'
      ];
      hitDie = 10;
      notes = [
        'combatNotes.smiteEvilFeature:' +
          '+%V attack/+%1 damage vs. evil foe %2/day',
        'featureNotes.specialMountFeature:Magical mount w/special abilities',
        'magicNotes.auraOfGoodFeature:Visible to <i>Detect Good</i>',
        'magicNotes.detectEvilFeature:<i>Detect Evil</i> at will',
        'magicNotes.layOnHandsFeature:Harm undead or heal %V HP/day',
        'magicNotes.removeDiseaseFeature:<i>Remove Disease</i> %V/week',
        'saveNotes.auraOfCourageFeature:Immune fear, +4 to allies w/in 30 ft',
        'saveNotes.divineGraceFeature:+%V all saves',
        'saveNotes.divineHealthFeature:Immune to disease',
        'validationNotes.paladinClassAlignment:' +
          'Requires Alignment == Lawful Good'
      ];
      proficiencyCounts = {'Save':2, 'Skill':2, 'Armor':4, 'Weapon':2};
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
      skills = [
        'Concentration', 'Craft', 'Diplomacy', 'Handle Animal', 'Heal',
        'Knowledge (Nobility)', 'Knowledge (Religion)', 'Profession', 'Ride',
        'Sense Motive'
      ];
      spellAbility = 'wisdom';
      spellsKnown = [
        'P1:4:"all"', 'P2:8:"all"', 'P3:11:"all"', 'P4:14:"all"'
      ];
      spellsPerDay = [
        'P1:4:0/6:1/14:2/18:3',
        'P2:8:0/10:1/16:2/19:3',
        'P3:11:0/12:1/17:2/19:3',
        'P4:14:0/15:1/19:2/20:3'
      ];
      rules.defineRule('casterLevelDivine',
        'levels.Paladin', '+=', 'source < 4 ? null : Math.floor(source / 2)'
      );
      rules.defineRule('combatNotes.smiteEvilFeature',
        'charismaModifier', '=', 'source > 0 ? source : 0'
      );
      rules.defineRule
        ('combatNotes.smiteEvilFeature.1', 'levels.Paladin', '=', null);
      rules.defineRule('combatNotes.smiteEvilFeature.2',
        'levels.Paladin', '=', '1 + Math.floor(source / 5)'
      );
      rules.defineRule('magicNotes.layOnHandsFeature',
        'levels.Paladin', '+=', null,
        'charismaModifier', '*', null,
        'charisma', '?', 'source >= 12'
      );
      rules.defineRule('magicNotes.removeDiseaseFeature',
        'levels.Paladin', '+=', 'Math.floor((source - 3) / 3)'
      );
      rules.defineRule('mountMasterLevel', 'levels.Paladin', '=', null);
      rules.defineRule
        ('save.Fortitude', 'saveNotes.divineGraceFeature', '+', null);
      rules.defineRule
        ('save.Reflex', 'saveNotes.divineGraceFeature', '+', null);
      rules.defineRule('save.Will', 'saveNotes.divineGraceFeature', '+', null);
      rules.defineRule
        ('saveNotes.divineGraceFeature', 'charismaModifier', '=', null);
      rules.defineRule('turnUndead.level',
        'levels.Paladin', '+=', 'source > 3 ? source - 3 : null'
      );
      rules.defineRule('turningLevel', 'turnUndead.level', '^=', null);

    } else if(name == 'Ranger') {

      continue; // TODO
      feats = null;
      features = [
        '1:Favored Enemy', '1:Track', '1:Wild Empathy', '2:Rapid Shot',
        '2:Two-Weapon Fighting', '3:Endurance', '4:Animal Companion',
        '6:Manyshot', '6:Improved Two-Weapon Fighting', '7:Woodland Stride',
        '8:Swift Tracker', '9:Evasion', '11:Improved Precise Shot',
        '11:Greater Two-Weapon Fighting', '13:Camouflage',
        '17:Hide In Plain Sight'
      ];
      hitDie = 8;
      notes = [
        'combatNotes.favoredEnemyFeature:' +
          '+2 or more damage vs. %V type(s) of creatures',
        'combatNotes.greaterTwo-WeaponFightingFeature:' +
          'Third off-hand -10 attack',
        'combatNotes.improvedPreciseShotFeature:' +
          'No foe AC bonus for partial concealment, attack grappling target',
        'combatNotes.improvedTwo-WeaponFightingFeature:' +
          'Second off-hand -5 attack',
        'combatNotes.manyshotFeature:' +
          'Fire up to %V arrows simultaneously at -2 attack',
        'combatNotes.rapidShotFeature:Normal, extra ranged -2 attacks',
        'combatNotes.two-WeaponFightingFeature:' +
          'Reduce on-hand penalty by 2, off-hand by 6',
        'featureNotes.animalCompanionFeature:Special bond/abilities',
        'featureNotes.woodlandStrideFeature:' +
          'Normal movement through undergrowth',
        'saveNotes.enduranceFeature:+4 extended physical action',
        'saveNotes.evasionFeature:Reflex save yields no damage instead of 1/2',
        'skillNotes.camouflageFeature:Hide in any natural terrain',
        'skillNotes.favoredEnemyFeature:' +
          '+2 or more Bluff/Listen/Sense Motive/Spot/Survival ' +
          'vs. %V type(s) of creatures',
        'skillNotes.hideInPlainSightFeature:Hide even when observed',
        'skillNotes.swiftTrackerFeature:Track at full speed',
        'skillNotes.trackFeature:Survival to follow creatures\' trail',
        'skillNotes.wildEmpathyFeature:+%V Diplomacy w/animals'
      ];
      proficiencyCounts = {'Save':2, 'Skill':3, 'Armor':3, 'Weapon':2};
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
        'Combat Style (Archery)', 'Combat Style (Two-Weapon Combat)'
      ];
      spellAbility = 'wisdom';
      spellsKnown = [
        'R1:4:"all"', 'R2:8:"all"', 'R3:11:"all"', 'R4:14:"all"'
      ];
      spellsPerDay = [
        'R1:4:0/6:1/14:2/18:3',
        'R2:8:0/10:1/16:2/19:3',
        'R3:11:0/12:1/17:2/19:3',
        'R4:14:0/15:1/19:2/20:3'
      ];
      rules.defineRule('animalCompanionMasterLevel',
        'levels.Ranger', '+=', 'source < 4 ? null : Math.floor(source / 2)'
      );
      rules.defineRule('casterLevelDivine',
        'levels.Ranger', '+=', 'source < 4 ? null : Math.floor(source / 2)'
      );
      rules.defineRule('combatNotes.favoredEnemyFeature',
        'levels.Ranger', '+=', '1 + Math.floor(source / 5)'
      );
      rules.defineRule('rangerFeatures.Rapid Shot',
        'rangerFeatures.Combat Style (Archery)', '?', null
      );
      rules.defineRule('rangerFeatures.Manyshot',
        'rangerFeatures.Combat Style (Archery)', '?', null
      );
      rules.defineRule('rangerFeatures.Improved Precise Shot',
        'rangerFeatures.Combat Style (Archery)', '?', null
      );
      rules.defineRule('rangerFeatures.Two-Weapon Fighting',
        'rangerFeatures.Combat Style (Two-Weapon Combat)', '?', null
      );
      rules.defineRule('rangerFeatures.Improved Two-Weapon Fighting',
        'rangerFeatures.Combat Style (Two-Weapon Combat)', '?', null
      );
      rules.defineRule('rangerFeatures.Greater Two-Weapon Fighting',
        'rangerFeatures.Combat Style (Two-Weapon Combat)', '?', null
      );
      rules.defineRule('selectableFeatureCount.Ranger',
        'levels.Ranger', '=', 'source >= 2 ? 1 : null'
      );
      rules.defineRule('skillNotes.favoredEnemyFeature',
        'levels.Ranger', '+=', '1 + Math.floor(source / 5)'
      );
      rules.defineRule('skillNotes.wildEmpathyFeature',
        'levels.Ranger', '+=', null,
        'charismaModifier', '+', null
      );

    } else if(name == 'Rogue') {

      continue; // TODO
      feats = null;
      features = [
        '1:Sneak Attack', '1:Trapfinding',
        '1:Weapon Proficiency (Hand Crossbow/Rapier/Shortbow/Short Sword)',
        '2:Evasion', '3:Trap Sense', '4:Uncanny Dodge',
        '8:Improved Uncanny Dodge'
      ];
      hitDie = 6;
      notes = [
        'combatNotes.cripplingStrikeFeature: ' +
          '2 points strength damage from sneak attack',
        'combatNotes.defensiveRollFeature:' +
          'DC damage Reflex save vs. lethal blow for half damage',
        'combatNotes.improvedUncannyDodgeFeature:' +
          'Flanked only by rogue four levels higher',
        'combatNotes.opportunistFeature:AOO vs. foe struck by ally',
        'combatNotes.sneakAttackFeature:' +
          '%Vd6 extra damage when surprising or flanking',
        'combatNotes.uncannyDodgeFeature:Always adds dexterity modifier to AC',
        'saveNotes.evasionFeature:Reflex save yields no damage instead of 1/2',
        'saveNotes.improvedEvasionFeature:Failed save yields 1/2 damage',
        'saveNotes.slipperyMindFeature:Second save vs. enchantment',
        'saveNotes.trapSenseFeature:+%V Reflex, AC vs. traps',
        'skillNotes.skillMasteryFeature:' +
          'Take 10 despite distraction on %V designated skills',
        'skillNotes.trapfindingFeature:' +
          'Use Search/Disable Device to find/remove DC 20+ traps'
      ];
      proficiencyCounts =
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
      selectableFeatures = [
        'Crippling Strike', 'Defensive Roll', 'Feat Bonus', 'Improved Evasion',
        'Opportunist', 'Skill Mastery', 'Slippery Mind'
      ];
      spellAbility = null;
      spellsKnown = null;
      spellsPerDay = null;
      rules.defineRule('combatNotes.sneakAttackFeature',
        'levels.Rogue', '+=', 'Math.floor((source + 1) / 2)'
      );
      rules.defineRule
        ('featCount.General', 'features.Feat Bonus', '+=', 'null');
      rules.defineRule('saveNotes.trapSenseFeature',
        'levels.Rogue', '+=', 'source >= 3 ? Math.floor(source / 3) : null'
      );
      rules.defineRule('selectableFeatureCount.Rogue',
        'levels.Rogue', '+=', 'source>=10 ? Math.floor((source-7)/3) : null'
      );
      rules.defineRule('skillNotes.skillMasteryFeature',
        'intelligenceModifier', '=', 'source + 3',
        'rogueFeatures.Skill Mastery', '*', null
      );

    } else if(name == 'Sorcerer') {

      continue; // TODO
      feats = null;
      features = ['1:Familiar'];
      hitDie = 4;
      notes = [
        'featureNotes.familiarFeature:Special bond/abilities'
      ];
      proficiencyCounts = {'Save':2, 'Skill':2, 'Weapon':5};
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
        'S0:1:4/2:5/4:6/6:7/8:8/10:9',
        'S1:1:2/3:3/5:4/7:5',
        'S2:4:1/5:2/7:3/9:4/11:5',
        'S3:6:1/7:2/9:3/11:4',
        'S4:8:1/9:2/11:3/13:4',
        'S5:10:1/11:2/13:3/15:4',
        'S6:12:1/13:2/15:3',
        'S7:14:1/15:2/17:3',
        'S8:16:1/17:2/19:3',
        'S9:18:1/19:2/20:3'
      ];
      spellsPerDay = [
        'S0:1:5/2:6',
        'S1:1:3/2:4/3:5/4:6',
        'S2:4:3/5:4/6:5/7:6',
        'S3:6:3/7:4/8:5/9:6',
        'S4:8:3/9:4/10:5/11:6',
        'S5:10:3/11:4/12:5/13:6',
        'S6:12:3/13:4/14:5/15:6',
        'S7:14:3/15:4/16:5/17:6',
        'S8:16:3/17:4/18:5/19:6',
        'S9:18:3/19:4/20:6'
      ];
      rules.defineRule('casterLevelArcane', 'levels.Sorcerer', '+=', null);
      rules.defineRule('familiarMasterLevel', 'levels.Sorcerer', '+=', null);

    } else if(name == 'Warlock') {

      continue; // TODO
      features = [
      ];
      hitDie = 8;
      notes = [
      ];
      proficiencyCounts = {'Save':2, 'Skill':2, 'Armor':1, 'Weapon':1};
      proficienciesGiven = {
        'Save':['Charisma', 'Wisdom'],
        'Armor':['Light'],
        'Weapon':['Simple']
      };
      proficiencyChoices = {
        'Skill':['Arcana', 'Deception', 'History', 'Intimidation',
                 'Investigation', 'Nature', 'Religion']
      };

    } else if(name == 'Wizard') {

      features = [
        '1:Arcane Recovery', '2:Arcane Tradition',
        '1:Weapon Proficiency (Dagger/Dart/Light Crossbow/Quarterstaff/Sling)',
        '18:Spell Mastery', '20:Signature Spell'
      ];
      hitDie = 6;
      notes = [
        'magicNotes.arcaneRecoveryFeature:' +
          'Short rest recovers %V spell slots 1/dy',
        'magicNotes.arcaneTraditionFeature:Gain chosen school effects',
        'magicNotes.signatureSpellFeature:' +
          'Cast 2 2nd spells w/o using spell slot 1/short rest',
        'magicNotes.spellMasteryFeature:' +
          'Cast 1 ea 1st/2nd spell w/o using spell slot'
      ];
      proficiencyCounts = {'Save':2, 'Skill':3, 'Weapon':5};
      proficienciesGiven = {
        'Save':['Intelligence', 'Wisdom'],
        'Weapon':['Dagger', 'Dart', 'Sling', 'Quarterstaff', 'Light Crossbow']
      };
      proficiencyChoices = {
        'Skill': ['Arcana', 'History', 'Insight', 'Investigation', 'Medicine',
                  'Religion']
      };
      selectableFeatures = FiveE.SCHOOLS.map(function(school){return school.substring(0, school.indexOf(':')) + ' Tradition';}),
      spellAbility = 'intelligence';
      spellsKnown = [
        'W0:1:"all"', 'W1:1:3/2:5', 'W2:3:2/4:4', 'W3:5:2/6:4',
        'W4:7:2/8:4', 'W5:9:2/10:4', 'W6:11:2/12:4', 'W7:13:2/14:4',
        'W8:15:2/16:4', 'W9:17:2/18:4/19:6/20:8'
      ];
      spellsPerDay = [
        'W0:1:3/2:4/10:5',
        'W1:1:2/2:3/3:5',
        'W2:3:2/4:3',
        'W3:5:2/6:3',
        'W4:7:1/8:2/9:3',
        'W5:9:1/10:2/18:3',
        'W6:11:1/19:2',
        'W7:13:1/20:2',
        'W8:15:1',
        'W9:17:1'
      ];

      rules.defineRule('casterLevelArcane', 'levels.Wizard', '+=', null);
      rules.defineRule('magicNotes.arcaneRecoveryFeature',
        'levels.Wizard', '=', 'Math.floor(source / 2)'
      );
      rules.defineRule('selectableFeatureCount.Wizard',
        'wizardFeatures.Arcane Tradition', '=', '1'
      );

    } else
      continue;

    FiveE.defineClass(
      rules, name, hitDie, features, selectableFeatures, proficiencyCounts,
      proficienciesGiven, proficiencyChoices, spellAbility, spellsKnown,
      spellsPerDay, notes
    );

  }

};

/* Defines the rules related to combat. */
FiveE.combatRules = function(rules) {
  rules.defineRule('armorClass',
    '', '=', '10',
    'armor', '+', 'FiveE.armorsArmorClassBonuses[source]',
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
FiveE.companionRules = function(rules, companions, familiars) {

  var features, notes;

  notes = [
    "companionNotes.celestialCompanion:" +
      "Smite Evil (+%V damage) 1/day, 60' darkvision, " +
      "%1 acid/cold/electricity resistance, DR %2/magic",
    'companionNotes.companionEvasionFeature:' +
      'Reflex save yields no damage instead of 1/2',
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

    rules.defineChoice('animalCompanions', ScribeUtils.getKeys(companions));
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
      'companionStats.HD', '=', FiveE.ATTACK_BONUS_AVERAGE
    );
    rules.defineRule('companionStats.Dex',
      'animalCompanionLevel', '+', 'source - 1'
    );
    rules.defineRule('animalCompanionFort',
      'features.Animal Companion', '?', null,
      'companionStats.HD', '=', FiveE.SAVE_BONUS_GOOD,
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
      'companionStats.HD', '=', FiveE.SAVE_BONUS_GOOD,
      'companionStats.Dex', '+', 'Math.floor((source - 10) / 2)'
    );
    rules.defineRule('companionStats.Ref', 'animalCompanionRef', '=', null);
    rules.defineRule
      ('companionStats.Str', 'animalCompanionLevel', '+', 'source - 1');
    rules.defineRule
      ('companionStats.Tricks', 'animalCompanionLevel', '=', null);
    rules.defineRule('animalCompanionWill',
      'features.Animal Companion', '?', null,
      'companionStats.HD', '=', FiveE.SAVE_BONUS_POOR,
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
      'Empathic Link': 1, 'Share Saving Throws': 1, 'Improved Speed': 2,
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

    rules.defineChoice('familiars', ScribeUtils.getKeys(familiars));
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
FiveE.createViewers = function(rules, viewers) {
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
            {name: 'Goodies', within: 'Section 2', separator: '/'},
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
              {name: 'Spells Per Day', within: 'SpellStats', separator:listSep},
              {name: 'Spell Difficulty Class', within: 'SpellStats',
               format: '<b>Spell DC</b>: %V', separator: listSep},
            {name: 'SpellSpecialties', within: 'SpellPart', separator:innerSep},
              {name: 'Domains', within: 'SpellSpecialties', separator: listSep},
              {name: 'Specialize', within: 'SpellSpecialties'},
              {name: 'Prohibit', within: 'SpellSpecialties', separator:listSep},
            {name: 'Goodies', within: 'SpellPart', separator: listSep},
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
FiveE.descriptionRules = function(rules, alignments, deities, genders) {
  rules.defineChoice('alignments', alignments);
  rules.defineChoice('deities', deities);
  rules.defineChoice('genders', genders);
};

/* Defines the rules related to equipment. */
FiveE.equipmentRules = function(rules, armors, goodies, shields, weapons) {

  rules.defineChoice('armors', armors);
  rules.defineChoice('goodies', goodies);
  rules.defineChoice('shields', shields);
  rules.defineChoice('weapons', weapons);

  for(var i = 0; i < weapons.length; i++) {

    var pieces = weapons[i].split(':');
    var matchInfo = pieces[1].match(/(\d?d\d+)(r(\d+))?(M|S)?/);
    if(! matchInfo)
      continue;

    var category = !matchInfo[4] || matchInfo[4] == 'S' ? 'Simple' : 'Martial';
    var damage = matchInfo[1];
    var name = pieces[0];
    var range = matchInfo[3];
    var weaponName = 'weapons.' + name;
    var format = '%V (%1 %2%3' + (range ? " R%4'" : '') + ')';

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
  //   'FiveE.armorsCategories[source] == "Heavy" ? -10 : null'
  // );
  rules.defineRule('combatNotes.dexterityArmorClassAdjustment',
    'armor', 'v', 'FiveE.armorsMaxDexBonuses[source]'
  );
  rules.defineRule('speed', 'abilityNotes.armorSpeedAdjustment', '+', null);

  // TODO arcane spells require armor proficiency
  // TODO armor, weapon proficiency

};

/* Defines the rules related to feats. */
FiveE.featRules = function(rules, feats) {

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
        "skillNotes.actorFeature:Mimic others' speech/sounds, Adv on Charisma(Deception/Performance) when impersonating"
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

/*
    if(feat == 'Acrobatic') {
      notes = [
        'sanityNotes.acrobaticFeatSkills:Implies Jump||Tumble',
        'skillNotes.acrobaticFeature:+2 Jump/Tumble'
      ];
    } else if(feat == 'Agile') {
      notes = [
        'sanityNotes.agileFeatSkills:Implies Balance||Escape Artist',
        'skillNotes.agileFeature:+2 Balance/Escape Artist'
      ];
    } else if(feat == 'Alertness') {
      notes = [
        'sanityNotes.alertnessFeatSkills:Implies Listen||Spot',
        'skillNotes.alertnessFeature:+2 Listen/Spot'
      ];
    } else if(feat == 'Animal Affinity') {
      notes = [
        'sanityNotes.animalAffinityFeatSkills:Implies Handle Animal||Ride',
        'skillNotes.animalAffinityFeature:+2 Handle Animal/Ride'
      ];
    } else if(feat == 'Armor Proficiency (Heavy)') {
      notes = [
        'sanityNotes.armorProficiency(Heavy)FeatProficiency:' +
          'Implies Class Armor Proficiency Level < ' + FiveE.PROFICIENCY_HEAVY,
        'validationNotes.armorProficiency(Heavy)FeatProficiency:' +
          'Requires Armor Proficiency (Medium) || ' +
          'Class Armor Proficiency Level >= ' + FiveE.PROFICIENCY_MEDIUM
      ];
      rules.defineRule('armorProficiencyLevel',
        'features.Armor Proficiency (Heavy)', '^', FiveE.PROFICIENCY_HEAVY
      );
      rules.defineRule('validationNotes.armorProficiency(Heavy)FeatProficiency',
        'feats.Armor Proficiency (Heavy)', '=', '-1',
        'features.Armor Proficiency (Medium)', '+', '1',
        'classArmorProficiencyLevel', '+',
        'source == ' + FiveE.PROFICIENCY_MEDIUM + ' ? 1 : null'
      );
    } else if(feat == 'Armor Proficiency (Light)') {
      notes = [
        'sanityNotes.armorProficiency(Light)FeatProficiency:' +
          'Implies Class Armor Proficiency Level < ' + FiveE.PROFICIENCY_LIGHT
      ];
      rules.defineRule('armorProficiencyLevel',
        'features.Armor Proficiency (Light)', '^', FiveE.PROFICIENCY_LIGHT
      );
    } else if(feat == 'Armor Proficiency (Medium)') {
      notes = [
        'sanityNotes.armorProficiency(Medium)FeatProficiency:' +
          'Implies Class Armor Proficiency Level < '+FiveE.PROFICIENCY_MEDIUM,
        'validationNotes.armorProficiency(Medium)FeatProficiency:' +
          'Requires Armor Proficiency (Light) || ' +
          'Class Armor Proficiency Level >= ' + FiveE.PROFICIENCY_LIGHT
      ];
      rules.defineRule('armorProficiencyLevel',
        'features.Armor Proficiency (Medium)', '^', FiveE.PROFICIENCY_MEDIUM
      );
      rules.defineRule(
        'validationNotes.armorProficiency(Medium)FeatProficiency',
        'feats.Armor Proficiency (Medium)', '=', '-1',
        'features.Armor Proficiency (Light)', '+', '1',
        'classArmorProficiencyLevel', '+',
        'source == ' + FiveE.PROFICIENCY_LIGHT + ' ? 1 : null'
      );
    } else if(feat == 'Athletic') {
      notes = [
        'sanityNotes.athleticFeatSkills:Implies Climb||Swim',
        'skillNotes.athleticFeature:+2 Climb/Swim'
      ];
    } else if(feat == 'Augment Summoning') {
      notes = [
        'magicNotes.augmentSummoningFeature:' +
          'Summoned creatures +4 strength/constitution',
        'validationNotes.augmentSummoningFeatFeatures:' +
          'Requires Spell Focus (Conjuration)'
      ];
    } else if(feat == 'Blind-Fight') {
      notes = [
        'combatNotes.blind-FightFeature:' +
          'Reroll concealed miss, no bonus to invisible foe, half penalty ' +
          'for impaired vision'
      ];
    } else if(feat == 'Brew Potion') {
      notes = [
        'magicNotes.brewPotionFeature:Create potion for up to 3rd level spell',
        'validationNotes.brewPotionFeatCasterLevel:Requires Caster Level >= 3'
      ];
    } else if(feat == 'Cleave') {
      notes = [
        'combatNotes.cleaveFeature:Extra attack when foe drops',
        'validationNotes.cleaveFeatAbility:Requires Strength >= 13',
        'validationNotes.cleaveFeatFeatures:Requires Power Attack'
      ];
    } else if(feat == 'Combat Casting') {
      notes = [
        'sanityNotes.combatCastingFeatCasterLevel:Implies Caster Level >= 1',
        'skillNotes.combatCastingFeature:' +
          '+4 Concentration when casting on defensive/grappling'
      ];
    } else if(feat == 'Combat Expertise') {
      notes = [
        'combatNotes.combatExpertiseFeature:Up to -5 attack, +5 AC',
        'validationNotes.combatExpertiseFeatAbility:Requires Intelligence >= 13'
      ];
    } else if(feat == 'Combat Reflexes') {
      notes = [
        'combatNotes.combatReflexesFeature:Flatfooted AOO, up to %V AOO/round',
        'sanityNotes.combatReflexesFeatAbility:Implies Dexterity >= 12'
      ];
      rules.defineRule('combatNotes.combatReflexesFeature',
        'dexterityModifier', '=', 'source + 1'
      );
    } else if(feat == 'Craft Magic Arms And Armor') {
      notes = [
        'magicNotes.craftMagicArmsAndArmorFeature:' +
          'Create/mend magic weapon/armor/shield',
        'validationNotes.craftMagicArmsAndArmorFeatCasterLevel:' +
          'Requires Caster Level >= 5'
      ];
    } else if(feat == 'Craft Rod') {
      notes = [
        'magicNotes.craftRodFeature:Create magic rod',
        'validationNotes.craftRodFeatCasterLevel:Requires Caster Level >= 9'
      ];
    } else if(feat == 'Craft Staff') {
      notes = [
        'magicNotes.craftStaffFeature:Create magic staff',
        'validationNotes.craftStaffFeatCasterLevel:Requires Caster Level >= 12'
      ];
    } else if(feat == 'Craft Wand') {
      notes = [
        'magicNotes.craftWandFeature:Create wand for up to 4th level spell',
        'validationNotes.craftWandFeatCasterLevel:Requires Caster Level >= 5'
      ];
    } else if(feat == 'Craft Wondrous Item') {
      notes = [
        'magicNotes.craftWondrousItemFeature:' +
          'Create/mend miscellaneous magic item',
        'validationNotes.craftWondrousItemFeatCasterLevel:' +
          'Requires Caster Level >= 3'
      ];
    } else if(feat == 'Deceitful') {
      notes = [
        'sanityNotes.deceitfulFeatSkills:Implies Disguise||Forgery',
        'skillNotes.deceitfulFeature:+2 Disguise/Forgery'
      ];
    } else if(feat == 'Deflect Arrows') {
      notes = [
        'combatNotes.deflectArrowsFeature:Deflect ranged 1/round',
        'validationNotes.deflectArrowsFeatAbility:Requires Dexterity >= 13',
        'validationNotes.deflectArrowsFeatFeatures:' +
          'Requires Improved Unarmed Strike'
      ];
    } else if(feat == 'Deft Hands') {
      notes = [
        'sanityNotes.deftHandsFeatSkills:Implies Sleight Of Hand||Use Rope',
        'skillNotes.deftHandsFeature:+2 Sleight Of Hand/Use Rope'
      ];
    } else if(feat == 'Diehard') {
      notes = [
        'combatNotes.diehardFeature:Remain conscious/stable w/HP <= 0',
        'validationNotes.diehardFeatFeatures:Requires Endurance'
      ];
    } else if(feat == 'Diligent') {
      notes = [
        'sanityNotes.diligentFeatSkills:Implies Appraise||Decipher Script',
        'skillNotes.diligentFeature:+2 Appraise/Decipher Script'
      ];
    } else if(feat == 'Dodge') {
      notes = [
        'combatNotes.dodgeFeature:+1 AC vs. designated foe',
        'validationNotes.dodgeFeatAbility:Requires Dexterity >= 13'
      ];
      rules.defineRule('armorClass', 'combatNotes.dodgeFeature', '+', '1');
    } else if(feat == 'Empower Spell') {
      notes = [
        'magicNotes.empowerSpellFeature:' +
          'x1.5 designated spell variable effects uses +2 spell slot',
        'sanityNotes.empowerSpellFeatCasterLevel:Implies Caster Level >= 1'
      ];
    } else if(feat == 'Endurance') {
      notes = ['saveNotes.enduranceFeature:+4 extended physical action'];
    } else if(feat == 'Enlarge Spell') {
      notes = [
        'magicNotes.enlargeSpellFeature:' +
          'x2 designated spell range uses +1 spell slot',
        'sanityNotes.enlargeSpellFeatCasterLevel:Implies Caster Level >= 1'
      ];
    } else if(feat == 'Eschew Materials') {
      notes = [
        'magicNotes.eschewMaterialsFeature:Cast spells w/out materials',
        'sanityNotes.eschewMaterialsFeatCasterLevel:Implies Caster Level >= 1'
      ];
    } else if(feat == 'Extend Spell') {
      notes = [
        'magicNotes.extendSpellFeature:' +
          'x2 designated spell duration uses +1 spell slot',
        'sanityNotes.extendSpellFeatCasterLevel:Implies Caster Level >= 1'
      ];
    } else if(feat == 'Extra Turning') {
      notes = [
        'combatNotes.extraTurningFeature:+4/day',
        'validationNotes.extraTurningFeatTurningLevel:' +
          'Requires Turning Level >= 1'
      ];
      rules.defineRule(/^turn.*\.frequency$/,
        'combatNotes.extraTurningFeature', '+', '4 * source'
      );
    } else if(feat == 'Far Shot') {
      notes = [
        'combatNotes.farShotFeature:x1.5 projectile range, x2 thrown',
        'validationNotes.farShotFeatFeatures:Requires Point Blank Shot'
      ];
    } else if(feat == 'Forge Ring') {
      notes = [
        'magicNotes.forgeRingFeature:Create/mend magic ring',
        'validationNotes.forgeRingFeatCasterLevel:Requires Caster Level >= 12'
      ];
    } else if(feat == 'Great Cleave') {
      notes = [
        'combatNotes.greatCleaveFeature:Cleave w/out limit',
        'validationNotes.greatCleaveFeatAbility:Requires Strength >= 13',
        'validationNotes.greatCleaveFeatBaseAttack:Requires Base Attack >= 4',
        'validationNotes.greatCleaveFeatFeatures:Requires Cleave/Power Attack'
      ];
    } else if(feat == 'Great Fortitude') {
      notes = ['saveNotes.greatFortitudeFeature:+2 Fortitude'];
      rules.defineRule
        ('save.Fortitude', 'saveNotes.greatFortitudeFeature', '+', '2');
    } else if((matchInfo = feat.match(/^Greater Spell Focus \((.*)\)$/))!=null){
      var school = matchInfo[1];
      var schoolNoSpace = school.replace(/ /g, '');
      notes = [
        'magicNotes.spellFocus(' + schoolNoSpace + ')Feat:' +
          '+1 DC on ' + school + ' spells',
        'sanityNotes.greaterSpellFocus(' + schoolNoSpace + ')FeatCasterLevel:' +
          'Implies Caster Level >= 1',
        'validationNotes.greaterSpellFocus(' + schoolNoSpace + ')FeatFeatures:'+
          'Requires Spell Focus (' + school + ')'
      ];
    } else if(feat == 'Greater Spell Penetration') {
      notes = [
        'magicNotes.greaterSpellPenetrationFeature:' +
          '+2 caster level vs. resistance checks',
        'sanityNotes.greaterSpellPenetrationFeatCasterLevel:' +
          'Implies Caster Level >= 1',
        'validationNotes.greaterSpellPenetrationFeatFeatures:' +
          'Requires Spell Penetration'
      ];
    } else if(feat == 'Greater Two-Weapon Fighting') {
      notes = [
        'combatNotes.greaterTwo-WeaponFightingFeature:' +
          'Third off-hand -10 attack',
        'validationNotes.greaterTwo-WeaponFightingFeatAbility:' +
          'Requires Dexterity >= 19',
        'validationNotes.greaterTwo-WeaponFightingFeatBaseAttack:' +
          'Requires Base Attack >= 11',
        'validationNotes.greaterTwo-WeaponFightingFeatFeatures:' +
          'Requires Two-Weapon Fighting/Improved Two-Weapon Fighting'
      ];
    } else if((matchInfo =
               feat.match(/^Greater Weapon Focus \((.*)\)$/)) != null) {
      var weapon = matchInfo[1];
      var weaponNoSpace = weapon.replace(/ /g, '');
      var note = 'combatNotes.greaterWeaponFocus(' + weaponNoSpace + ')Feature';
      notes = [
        note + ':+1 attack',
        'sanityNotes.greaterWeaponFocus(' + weaponNoSpace + ')FeatWeapons:' +
          'Implies ' + weapon,
        'validationNotes.greaterWeaponFocus('+weaponNoSpace+')FeatFeatures:' +
          'Requires Weapon Focus (' + weapon + ')',
        'validationNotes.greaterWeaponFocus(' + weaponNoSpace + ')FeatLevels:' +
          'Requires Fighter >= 8'
      ];
      rules.defineRule('weaponAttackAdjustment.' + weapon, note, '+=', '1');
    } else if((matchInfo =
               feat.match(/^Greater Weapon Specialization \((.*)\)$/))!=null) {
      var weapon = matchInfo[1];
      var weaponNoSpace = weapon.replace(/ /g, '');
      var lead = 'greaterWeaponSpecialization(' + weaponNoSpace + ')';
      var note = 'combatNotes.' + lead + 'Feature';
      notes = [
        note + ':+2 damage',
        'sanityNotes.' + lead + 'FeatWeapons:Implies ' + weapon,
        'validationNotes.' + lead + 'FeatFeatures:' +
          'Requires Weapon Focus (' + weapon + ')/' +
          'Greater Weapon Focus (' + weapon + ')/' +
          'Weapon Specialization (' + weapon + ')',
        'validationNotes.' + lead + 'FeatLevels:Requires Fighter >= 12'
      ];
      rules.defineRule('weaponDamageAdjustment.' + weapon, note, '+=', '2');
    } else if(feat == 'Heighten Spell') {
      notes = [
        'magicNotes.heightenSpellFeature:Increase designated spell level',
        'sanityNotes.heightenSpellFeatCasterLevel:Implies Caster Level >= 1'
      ];
    } else if(feat == 'Improved Bull Rush') {
      notes = [
        'combatNotes.improvedBullRushFeature:' +
          'No AOO on Bull Rush, +4 strength check',
        'validationNotes.improvedBullRushFeatAbility:Requires Strength >= 13',
        'validationNotes.improvedBullRushFeatFeatures:Requires Power Attack'
      ];
    } else if(feat == 'Improved Counterspell') {
      notes = [
        'magicNotes.improvedCounterspellFeature:' +
          'Counter w/higher-level spell from same school',
        'sanityNotes.improvedCounterspellFeatCasterLevel:' +
          'Implies Caster Level >= 1'
      ];
    } else if((matchInfo = feat.match(/^Improved Critical \((.*)\)$/)) != null){
      var weapon = matchInfo[1];
      var weaponNoSpace = weapon.replace(/ /g, '');
      var note = 'combatNotes.improvedCritical(' + weaponNoSpace + ')Feature';
      notes = [
        note + ':x2 critical threat range',
        'sanityNotes.improvedCritical('+weaponNoSpace+')FeatWeapons:' +
          'Implies ' + weapon,
        'validationNotes.improvedCritical('+weaponNoSpace+')FeatBaseAttack:' +
          'Requires Base Attack >= 8'
      ];
      var weaponPat = new RegExp('^' + weapon + ':');
      var bump = 1;
      for(var j = 0; j < FiveE.WEAPONS.length; j++) {
        var spec = FiveE.WEAPONS[j];
        var criticalMatchInfo;
        if(weapon == null || !spec.match(weaponPat))
          continue;
        if((criticalMatchInfo = spec.match(/@(\d+)/)) != null)
          bump = 21 - criticalMatchInfo[1];
        break;
      }
      rules.defineRule('weaponCriticalAdjustment.' + weapon, note, '+=', bump);
    } else if(feat == 'Improved Disarm') {
      notes = [
        'combatNotes.improvedDisarmFeature:No AOO on Disarm, +4 attack',
        'validationNotes.improvedDisarmFeatAbility:Requires Intelligence >= 13',
        'validationNotes.improvedDisarmFeatFeatures:Requires Combat Expertise'
      ];
    } else if(feat == 'Improved Familiar') {
      notes = [
        'featureNotes.improvedFamiliarFeature:Expanded Familiar choices',
        'validationNotes.improvedFamiliarFeatFeatures:Requires Familiar'
      ];
    } else if(feat == 'Improved Feint') {
      notes = [
        'combatNotes.improvedFeintFeature:Bluff check to Feint as move action',
        'validationNotes.improvedFeintFeatAbility:Requires Intelligence >= 13',
        'validationNotes.improvedFeintFeatFeatures:Requires Combat Expertise'
      ];
    } else if(feat == 'Improved Grapple') {
      notes = [
        'combatNotes.improvedGrappleFeature:No AOO on Grapple, +4 Grapple',
        'validationNotes.improvedGrappleFeatAbility:Requires Dexterity >= 13',
        'validationNotes.improvedGrappleFeatFeatures:' +
          'Requires Improved Unarmed Strike'
      ];
    } else if(feat == 'Improved Initiative') {
      notes = ['combatNotes.improvedInitiativeFeature:+4 initiative'];
      rules.defineRule
        ('initiative', 'combatNotes.improvedInitiativeFeature', '+', '4');
    } else if(feat == 'Improved Overrun') {
      notes = [
        'combatNotes.improvedOverrunFeature:' +
          'Foe cannot avoid, +4 strength check',
        'validationNotes.improvedOverrunFeatAbility:Requires Strength >= 13',
        'validationNotes.improvedOverrunFeatFeatures:Requires Power Attack'
      ];
    } else if(feat == 'Improved Precise Shot') {
      notes = [
        'combatNotes.improvedPreciseShotFeature:' +
          'No foe AC bonus for partial concealment, attack grappling target',
        'validationNotes.improvedPreciseShotFeatAbility:' +
          'Requires Dexterity >= 19',
        'validationNotes.improvedPreciseShotFeatBaseAttack:' +
          'Requires Base Attack >= 11',
        'validationNotes.improvedPreciseShotFeatFeatures:' +
          'Requires Point Blank Shot/Precise Shot'
      ];
    } else if(feat == 'Improved Shield Bash') {
      notes = [
        'combatNotes.improvedShieldBashFeature:No AC penalty on Shield Bash',
        'sanityNotes.improvedShieldBashShield:Implies Shield != None',
        'validationNotes.improvedShieldBashFeatFeatures:' +
          'Requires Shield Proficiency (Heavy)'
      ];
    } else if(feat == 'Improved Sunder') {
      notes = [
        'combatNotes.improvedSunderFeature:No AOO on Sunder, +4 attack',
        'validationNotes.improvedSunderFeatAbility:Requires Strength >= 13',
        'validationNotes.improvedSunderFeatFeatures:Requires Power Attack'
      ];
    } else if(feat == 'Improved Trip') {
      notes = [
        'combatNotes.improvedTripFeature:' +
          'No AOO on Trip, +4 strength check, attack after trip',
        'validationNotes.improvedTripFeatAbility:Requires Intelligence >= 13',
        'validationNotes.improvedTripFeatFeats:Requires Combat Expertise'
      ];
    } else if(feat == 'Improved Turning') {
      notes = [
        'combatNotes.improvedTurningFeature:+1 turning level',
        'validationNotes.improvedTurningFeatTurningLevel:' +
          'Requires Turning Level >= 1'
      ];
      rules.defineRule
        (/^turn.*\.level$/, 'combatNotes.improvedTurningFeature', '+', '1');
    } else if(feat == 'Improved Two-Weapon Fighting') {
      notes = [
        'combatNotes.improvedTwo-WeaponFightingFeature:' +
          'Second off-hand -5 attack',
        'validationNotes.improvedTwo-WeaponFightingFeatAbility:' +
          'Requires Dexterity >= 17',
        'validationNotes.improvedTwo-WeaponFightingFeatBaseAttack:' +
          'Requires Base Attack >= 6',
        'validationNotes.improvedTwo-WeaponFightingFeatFeatures:' +
          'Requires Two-Weapon Fighting'
      ];
    } else if(feat == 'Improved Unarmed Strike') {
      notes = [
        'combatNotes.improvedUnarmedStrikeFeature:' +
          'No AOO on unarmed attack, may deal lethal damage'
      ];
    } else if(feat == 'Investigator') {
      notes = [
        'sanityNotes.investigatorFeatSkills:Implies Gather Information||Search',
        'skillNotes.investigatorFeature:+2 Gather Information/Search'
      ];
    } else if(feat == 'Iron Will') {
      notes = ['saveNotes.ironWillFeature:+2 Will'];
      rules.defineRule('save.Will', 'saveNotes.ironWillFeature', '+', '2');
    } else if(feat == 'Leadership') {
      notes = [
        'featureNotes.leadershipFeature:Attract followers',
        'validationNotes.leadershipFeatLevel:Requires Level >= 6'
      ];
    } else if(feat == 'Lightning Reflexes') {
      notes = ['saveNotes.lightningReflexesFeature:+2 Reflex'];
      rules.defineRule
        ('save.Reflex', 'saveNotes.lightningReflexesFeature', '+', '2');
    } else if(feat == 'Magical Aptitude') {
      notes = [
        'sanityNotes.magicalAptitudeFeatSkills:' +
          'Implies Spellcraft||Use Magic Device',
        'skillNotes.magicalAptitudeFeature:+2 Spellcraft/Use Magic Device'
      ];
    } else if(feat == 'Manyshot') {
      notes = [
        'combatNotes.manyshotFeature:' +
          'Fire up to %V arrows simultaneously at -2 attack',
        'validationNotes.manyshotFeatAbility:Requires Dexterity >= 17',
        'validationNotes.manyshotFeatBaseAttack:Requires Base Attack >= 6',
        'validationNotes.manyshotFeatFeatures:' +
          'Requires Point Blank Shot/Rapid Shot'
      ];
      rules.defineRule('combatNotes.manyshotFeature',
        'baseAttack', '=', 'Math.floor((source + 9) / 5)'
      );
    } else if(feat == 'Maximize Spell') {
      notes = [
        'magicNotes.maximizeSpellFeature:' +
          'Maximize all designated spell variable effects uses +3 spell slot',
        'sanityNotes.maximizeSpellFeatCasterLevel:Implies Caster Level >= 1'
      ];
    } else if(feat == 'Mobility') {
      notes = [
        'combatNotes.mobilityFeature:+4 AC vs. movement AOO',
        'validationNotes.mobilityFeatAbility:Requires Dexterity >= 13',
        'validationNotes.mobilityFeatFeatures:Requires Dodge'
      ];
    } else if(feat == 'Mounted Archery') {
      notes = [
        'combatNotes.mountedArcheryFeature:x.5 mounted ranged penalty',
        'validationNotes.mountedArcheryFeatFeatures:Requires Mounted Combat',
        'validationNotes.mountedArcheryFeatSkills:Requires Ride'
      ];
    } else if(feat == 'Mounted Combat') {
      notes = [
        'combatNotes.mountedCombatFeature:' +
          'Ride skill save vs. mount damage 1/round',
        'validationNotes.mountedCombatFeatSkills:Requires Ride'
      ];
    } else if(feat == 'Natural Spell') {
      notes = [
        'magicNotes.naturalSpellFeature:Cast spell during <i>Wild Shape</i>',
        'validationNotes.naturalSpellFeatAbility:Requires Wisdom >= 13',
        'validationNotes.naturalSpellFeatFeatures:Requires Wild Shape'
      ];
    } else if(feat == 'Negotiator') {
      notes = [
        'sanityNotes.negotiatorFeatSkills:Implies Diplomacy||Sense Motive',
        'skillNotes.negotiatorFeature:+2 Diplomacy/Sense Motive'
      ];
    } else if(feat == 'Nimble Fingers') {
      notes = [
        'sanityNotes.nimbleFingersFeatSkills:Implies Disable Device||Open Lock',
        'skillNotes.nimbleFingersFeature:+2 Disable Device/Open Lock'
      ];
    } else if(feat == 'Persuasive') {
      notes = [
        'sanityNotes.persuasiveFeatSkills:Implies Bluff||Intimidate',
        'skillNotes.persuasiveFeature:+2 Bluff/Intimidate'
      ];
    } else if(feat == 'Point Blank Shot') {
      notes = [
        'combatNotes.pointBlankShotFeature:+1 ranged attack/damage w/in 30 ft'
      ];
    } else if(feat == 'Power Attack') {
      notes = [
        'combatNotes.powerAttackFeature:Attack base -attack/+damage',
        'validationNotes.powerAttackFeatAbility:Requires Strength >= 13'
      ];
    } else if(feat == 'Precise Shot') {
      notes = [
        'combatNotes.preciseShotFeature:No penalty on shot into melee',
        'validationNotes.preciseShotFeatFeatures:Requires Point Blank Shot'
      ];
    } else if(feat == 'Quick Draw') {
      notes = [
        'combatNotes.quickDrawFeature:Draw weapon as free action',
        'validationNotes.quickDrawFeatBaseAttack:Requires Base Attack >= 1'
      ];
    } else if(feat == 'Quicken Spell') {
      notes = [
        'magicNotes.quickenSpellFeature:' +
          'Free action casting 1/round uses +4 spell slot',
        'sanityNotes.quickenSpellFeatCasterLevel:Implies Caster Level >= 1'
      ];
    } else if((matchInfo = feat.match(/^Rapid Reload \((.*)\)$/)) != null) {
      var weapon = matchInfo[1];
      var weaponNoSpace = weapon.replace(/ /g, '');
      notes = [
        'combatNotes.rapidReload(' + weaponNoSpace + ')Feature:' +
          'Reload ' + weapon + ' Crossbow as ' +
          (weapon == 'Heavy' ? 'move' : 'free') + ' action',
        'sanityNotes.rapidReload(' + weaponNoSpace + ')FeatWeapons:' +
          'Implies ' + weapon + ' Crossbow'
      ];
    } else if(feat == 'Rapid Shot') {
      notes = [
        'combatNotes.rapidShotFeature:Normal and extra ranged -2 attacks',
        'validationNotes.rapidShotFeatAbility:Requires Dexterity >= 13',
        'validationNotes.rapidShotFeatFeatures:Requires Point Blank Shot'
      ];
    } else if(feat == 'Ride-By Attack') {
      notes = [
        'combatNotes.ride-ByAttackFeature:Move before and after mounted attack',
        'validationNotes.ride-ByAttackFeatFeatures:Requires Mounted Combat',
        'validationNotes.ride-ByAttackFeatSkills:Requires Ride'
      ];
    } else if(feat == 'Run') {
      notes = [
        'abilityNotes.runFeature:+1 run speed multiplier',
        'skillNotes.runFeature:+4 running Jump'
      ];
      rules.defineRule
        ('runSpeedMultiplier', 'abilityNotes.runFeature', '+', '1');
    } else if(feat == 'Scribe Scroll') {
      notes = [
        'magicNotes.scribeScrollFeature:Create scroll of any known spell',
        'validationNotes.scribeScrollFeatCasterLevel:Requires Caster Level >= 1'
      ];
    } else if(feat == 'Self Sufficient') {
      notes = [
        'sanityNotes.selfSufficientFeatSkills:Implies Heal||Survival',
        'skillNotes.selfSufficientFeature:+2 Heal/Survival'
      ];
    } else if(feat == 'Shield Proficiency (Heavy)') {
      notes = [
        'sanityNotes.shieldProficiency(Heavy)FeatProficiency:' +
          'Implies Class Shield Proficiency Level < ' + FiveE.PROFICIENCY_HEAVY
      ];
      rules.defineRule('shieldProficiencyLevel',
        'features.Shield Proficiency (Heavy)', '^', FiveE.PROFICIENCY_HEAVY
      );
    } else if(feat == 'Shot On The Run') {
      notes = [
        'combatNotes.shotOnTheRunFeature:Move before and after ranged attack',
        'validationNotes.shotOnTheRunFeatAbility:Requires Dexterity >= 13',
        'validationNotes.shotOnTheRunFeatBaseAttack:Requires Base Attack >= 4',
        'validationNotes.shotOnTheRunFeatFeatures:' +
          'Requires Dodge/Mobility/Point Blank Shot'
      ];
    } else if(feat == 'Silent Spell') {
      notes = [
        'magicNotes.silentSpellFeature:' +
          'Cast spell w/out speech uses +1 spell slot',
        'sanityNotes.silentSpellFeatCasterLevel:Implies Caster Level >= 1'
      ];
    } else if((matchInfo = feat.match(/^Skill Focus \((.*)\)$/)) != null) {
      var skill = matchInfo[1];
      var skillNoSpace = skill.replace(/ /g, '');
      var note = 'skillNotes.skillFocus(' + skillNoSpace + ')Feature';
      notes = [
        note + ':+3 checks',
        'sanityNotes.skillFocus(' + skillNoSpace + ')FeatSkills:' +
          'Implies ' + skill
      ];
      rules.defineRule('skillModifier.' + skill, note, '+', '3');
    } else if(feat == 'Snatch Arrows') {
      notes = [
        'combatNotes.snatchArrowsFeature:Catch ranged weapons',
        'validationNotes.snatchArrowsFeatAbility:Requires Dexterity >= 15',
        'validationNotes.snatchArrowsFeatFeatures:' +
          'Requires Deflect Arrows/Improved Unarmed Strike'
      ];
    } else if((matchInfo = feat.match(/^Spell Focus \((.*)\)$/)) != null) {
      var school = matchInfo[1];
      var schoolNoSpace = school.replace(/ /g, '');
      notes = [
        'magicNotes.spellFocus(' + schoolNoSpace + ')Feature:' +
          '+1 DC on ' + school + ' spells',
        'sanityNotes.spellFocus(' + schoolNoSpace + ')FeatCasterLevel:' +
          'Implies Caster Level >= 1'
      ];
    } else if(feat == 'Spell Mastery') {
      notes = [
        'magicNotes.spellMasteryFeature:Prepare %V spells w/out spellbook',
        'validationNotes.spellMasteryFeatLevels:Requires Wizard >= 1'
      ];
      rules.defineRule
        ('magicNotes.spellMasteryFeature', 'intelligenceModifier', '=', null);
    } else if(feat == 'Spell Penetration') {
      notes = [
        'magicNotes.spellPenetrationFeature:' +
          '+2 checks to overcome spell resistance',
        'sanityNotes.spellPenetrationFeatCasterLevel:Implies Caster Level >= 1'
      ];
    } else if(feat == 'Spirited Charge') {
      notes = [
        'combatNotes.spiritedChargeFeature:' +
          'x2 damage (x3 lance) from mounted charge',
        'validationNotes.spiritedChargeFeatFeatures:' +
          'Requires Mounted Combat/Ride-By Attack',
        'validationNotes.spiritedChargeFeatSkills:Requires Ride'
      ];
    } else if(feat == 'Spring Attack') {
      notes = [
        'combatNotes.springAttackFeature:Move before and after melee attack',
        'validationNotes.springAttackFeatAbility:Requires Dexterity >= 13',
        'validationNotes.springAttackFeatBaseAttack:Requires Base Attack >= 4',
        'validationNotes.springAttackFeatFeatures:Requires Dodge/Mobility'
      ];
    } else if(feat == 'Stealthy') {
      notes = [
        'sanityNotes.stealthyFeatSkills:Implies Hide||Move Silently',
        'skillNotes.stealthyFeature:+2 Hide/Move Silently'
      ];
    } else if(feat == 'Still Spell') {
      notes = [
        'magicNotes.stillSpellFeature:' +
          'Cast spell w/out movement uses +1 spell slot',
        'sanityNotes.stillSpellFeatCasterLevel:Implies Caster Level >= 1'
      ];
    } else if(feat == 'Stunning Fist') {
      notes = [
        'combatNotes.stunningFistFeature:' +
          'Foe %V Fortitude save or stunned %1/day',
        'validationNotes.stunningFistFeatAbility:' +
          'Requires Dexterity >= 13/Wisdom >= 13',
        'validationNotes.stunningFistFeatBaseAttack:Requires Base Attack >= 8',
        'validationNotes.stunningFistFeatFeatures:' +
          'Requires Improved Unarmed Strike'
      ];
      rules.defineRule('combatNotes.stunningFistFeature',
        'level', '=', '10 + Math.floor(source / 2)',
        'wisdomModifier', '+', null
      );
      rules.defineRule('combatNotes.stunningFistFeature.1',
        'level', '+=', 'Math.floor(source / 4)'
      );
    } else if(feat == 'Toughness') {
      notes = ['combatNotes.toughnessFeature:+3 HP'];
      rules.defineRule('hitPoints', 'combatNotes.toughnessFeature', '+', '3');
    } else if(feat == 'Track') {
      notes = [
        'sanityNotes.trackFeatSkills:Implies Survival',
        'skillNotes.trackFeature:Survival to follow creatures\' trail'
      ];
    } else if(feat == 'Trample') {
      notes = [
        'combatNotes.trampleFeature:' +
          'Mounted overrun unavoidable, bonus hoof attack',
        'validationNotes.trampleFeatFeatures:Requires Mounted Combat',
        'validationNotes.trampleFeatSkills:Requires Ride'
      ];
    } else if(feat == 'Two-Weapon Defense') {
      notes = [
        'combatNotes.two-WeaponDefenseFeature:' +
          '+1 AC w/two weapons, +2 when fighting defensively',
        'validationNotes.two-WeaponDefenseFeatAbility:Requires Dexterity >= 15',
        'validationNotes.two-WeaponDefenseFeatFeatures:' +
          'Requires Two-Weapon Fighting'
      ];
    } else if(feat == 'Two-Weapon Fighting') {
      notes = [
        'combatNotes.two-WeaponFightingFeature:' +
          'Reduce on-hand penalty by 2, off-hand by 6',
        'validationNotes.two-WeaponFightingFeatAbility:Requires Dexterity >= 15'
      ];
    } else if(feat == 'Weapon Finesse') {
      notes = [
        'combatNotes.weaponFinesseFeature:' +
          '+%V light melee attack (dex instead of str)',
        'sanityNotes.weaponFinesseFeatAbility:' +
          'Implies Dexterity Modifier exceed Strength Modifier',
        'validationNotes.weaponFinesseFeatBaseAttack:Requires Base Attack >= 1'
      ];
      rules.defineRule('combatNotes.weaponFinesseFeature',
        'dexterityModifier', '=', null,
        'strengthModifier', '+', '-source'
      );
      rules.defineRule
        ('meleeAttack', 'combatNotes.weaponFinesseFeature', '+', null);
      rules.defineRule('sanityNotes.weaponFinesseFeatAbility',
        'feats.Weapon Finesse', '=', '-1',
        'dexterityModifier', '+', 'source',
        'strengthModifier', '+', '-source',
        '', 'v', '0'
      );
    } else if((matchInfo = feat.match(/^Weapon Focus \((.*)\)$/)) != null) {
      var weapon = matchInfo[1];
      var weaponNoSpace = weapon.replace(/ /g, '');
      var note = 'combatNotes.weaponFocus(' + weaponNoSpace + ')Feature';
      notes = [
        note + ':+1 attack',
        'sanityNotes.weaponFocus(' + weaponNoSpace + ')FeatWeapons:' +
          'Implies ' + weapon,
        'validationNotes.weaponFocus(' + weaponNoSpace + ')FeatBaseAttack:' +
          'Requires Base Attack >= 1'
      ];
      rules.defineRule('weaponAttackAdjustment.' + weapon, note, '+=', '1');
    } else if(feat == 'Weapon Proficiency (Simple)') {
      notes = [
        'sanityNotes.weaponProficiency(Simple)FeatProficiency:' +
          'Implies Class Weapon Proficiency Level < ' + FiveE.PROFICIENCY_LIGHT
      ];
      rules.defineRule('weaponProficiencyLevel',
        'features.' + feat, '^', FiveE.PROFICIENCY_LIGHT
      );
    } else if((matchInfo = feat.match(/^Weapon Proficiency \((.*)\)$/))!=null) {
      var weapon = matchInfo[1];
      var weaponNoSpace = weapon.replace(/ /g, '');
      var familiarityAttr = 'features.Weapon Familiarity (' + weapon + ')';
      notes = [
        'sanityNotes.weaponProficiency(' + weaponNoSpace + ')FeatWeapons:' +
          'Implies ' + weapon,
      ];
      if(FiveE.weaponsCategories[weapon] == FiveE.PROFICIENCY_HEAVY) {
        notes = notes.concat([
          'validationNotes.weaponProficiency(' + weaponNoSpace +
            ')FeatBaseAttack:Requires Base Attack >= 1'
        ]);
        rules.defineRule('validationNotes.weaponProficiency(' + weaponNoSpace +
          ')FeatBaseAttack', familiarityAttr, '^', '0');
      }
      if(weapon == 'Bastard Sword' || weapon == 'Dwarven Waraxe') {
        notes = notes.concat([
          'validationNotes.weaponProficiency(' + weaponNoSpace +
            ')FeatStrength:Requires Strength >= 13'
        ]);
        rules.defineRule('validationNotes.weaponProficiency(' + weaponNoSpace +
          ')FeatStrength', familiarityAttr, '^', '0');
      }
    } else if((matchInfo =
               feat.match(/^Weapon Specialization \((.*)\)$/)) != null) {
      var weapon = matchInfo[1];
      var weaponNoSpace = weapon.replace(/ /g, '');
      var note = 'combatNotes.weaponSpecialization('+weaponNoSpace+')Feature';
      notes = [
        note + ':+2 damage',
        'sanityNotes.weaponSpecialization(' + weaponNoSpace + ')FeatWeapons:' +
          'Implies ' + weapon,
        'validationNotes.weaponSpecialization('+weaponNoSpace+')FeatFeatures:' +
          'Requires Weapon Focus (' + weapon + ')',
        'validationNotes.weaponSpecialization('+weaponNoSpace+')FeatLevels:' +
          'Requires Fighter >= 4'
      ];
      rules.defineRule('weaponDamageAdjustment.' + weapon, note, '+=', '2');
    } else if(feat == 'Whirlwind Attack') {
      notes = [
        'combatNotes.whirlwindAttackFeature:Attack all foes w/in reach',
        'validationNotes.whirlwindAttackFeatAbility:' +
          'Requires Dexterity >= 13/Intelligence >= 13',
        'validationNotes.whirlwindAttackFeatBaseAttack:' +
          'Requires Base Attack >= 4',
        'validationNotes.whirlwindAttackFeatFeatures:' +
          'Requires Combat Expertise/Dodge/Mobility/Spring Attack'
      ];
    } else if(feat == 'Widen Spell') {
      notes = [
        'magicNotes.widenSpellFeature:x2 area of affect uses +3 spell slot',
        'sanityNotes.widenSpellFeatCasterLevel:Implies Caster Level >= 1'
      ];
    } else {
      continue;
    }
*/
  }

};

/* Defines the rules related to spells and domains. */
FiveE.magicRules = function(rules, classes, domains, schools) {

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
        'Tasha\'s Hideous Laughter:Thunderwave:Unseen Servant',
        'B2:Animal Messenger:Blindness/Deafness:Calm Emotions:' +
        'Cloud Of Daggers:Crown Of Madness:Detect Thoughts:Enhance Ability:' +
        'Enthrall:Heat Metal:Hold Person:Invisibility:Knock:' +
        'Lesser Restoration:Locate Animals Or Plants:Locate Object:' +
        'Magic Mouth:Phantasmal Force:See Invisibility:Shatter:Silence:' +
        'Suggestion:Zone Of Truth',
        'B3:Bestow Curse:Clairvoyance:Dispel Magic:Fear:Feign Death:' +
        'Glyph Of Warding:Hypnotic Pattern:Leomund\'s Tiny Hut:Major Image:' +
        'Nondetection:Plant Growth:Sending:Speak With Dead:Speak With Plants:' +
        'Stinking Cloud:Tongues',
        'B4:Compulsion:Confusion:Dimension Door:Freedom Of Movement:' +
        'Greater Invisibility:Hallucinatory Terrain:Locate Creature:Polymorph',
        'B5:Animate Objects:Awaken:Dominate Person:Dream:Geas:' +
        'Greater Restoration:Hold Monster:Legend Lore:Mass Cure Wounds:' +
        'Mislead:Modify Memory:Planar Binding:Raise Dead:Scrying:Seeming:' +
        'Teleporation Circle',
        'B6:Eyebite:Find The Path:Guards And Wards:Mass Suggestion:' +
        'Otto\'s Irresistible Dance:Programmed Illusion:True Seeing',
        'B7:Etherealness:Forcecage:Mirage Arcane:' +
        'Mordenkainen\'s Magnificent Mansion:Mordenkainen\'s Hound:' +
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
        'C2:Aid:Augury:Blindness/Deafness:Calm Emotions:Enhance Ability:' +
        'Find Traps:Gentle Repose:Hold Person:Lesser Restoration:' +
        'Locate Object:Prayer Of Healing:Protection From Poison:Silence:' +
        'Spiritual Weapon:Warding Bond:Zone Of Truth',
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
        'Heroes\' Feast:Planar Ally:True Seeing:Word Of Recall',
        'C7:Conjure Celestial:Divine Word:Etherealness:Fire Storm:' +
        'Plane Shift:Regerate:Resurrection:Symbol',
        'C8:Antimagic Field:Control Weather:Earthquake:Holy Aura',
        'C9:Astral Projection:Gate:Mass Heal:True Resurrection'
      ];
    } else if(klass == 'Druid') {
      spells = [
        'D0:Create Water:Cure Minor Wounds:Detect Magic:Detect Poison:Flare:' +
        'Guidance:Know Direction:Light:Mending:Purify Food And Drink:' +
        'Read Magic:Resistance:Virtue',
        'D1:Calm Animals:Charm Animal:Cure Light Wounds:' +
        'Detect Animals Or Plants:Detect Snares And Pits:Endure Elements:' +
        'Entangle:Faerie Fire:Goodberry:Hide From Animals:Jump:Longstrider:' +
        'Magic Fang:Magic Stone:Obscuring Mist:Pass Without Trace:' +
        'Produce Flame:Shillelagh:Speak With Animals:Summon Nature\'s Ally I',
        'D2:Animal Messenger:Animal Trance:Barkskin:Bear\'s Endurance:' +
        'Bull\'s Strength:Cat\'s Grace:Chill Metal:Delay Poison:Fire Trap:' +
        'Flame Blade:Flaming Sphere:Fog Cloud:Gust Of Wind:Heat Metal:' +
        'Hold Animal:Lesser Restoration:Owl\'s Wisdom:Reduce Animal:' +
        'Resist Energy:Soften Earth And Stone:Spider Climb:' +
        'Summon Nature\'s Ally II:Summon Swarm:Tree Shape:Warp Wood:Wood Shape',
        'D3:Call Lightning:Contagion:Cure Moderate Wounds:Daylight:' +
        'Diminish Plants:Dominate Animal:Greater Magic Fang:Meld Into Stone:' +
        'Neutralize Poison:Plant Growth:Poison:Protection From Energy:Quench:' +
        'Remove Disease:Sleet Storm:Snare:Speak With Plants:Spike Growth:' +
        'Stone Shape:Summon Nature\'s Ally III:Water Breathing:Wind Wall',
        'D4:Air Walk:Antiplant Shell:Blight:Command Plants:Control Water:' +
        'Cure Serious Wounds:Dispel Magic:Flame Strike:Freedom Of Movement:' +
        'Giant Vermin:Ice Storm:Reincarnate:Repel Vermin:Rusting Grasp:' +
        'Scrying:Spike Stones:Summon Nature\'s Ally IV',
        'D5:Animal Growth:Atonement:Awaken:Baleful Polymorph:' +
        'Call Lightning Storm:Commune With Nature:Control Winds:' +
        'Cure Critical Wounds:Death Ward:Hallow:Insect Plague:Stoneskin:' +
        'Summon Nature\'s Ally V:Transmute Mud To Rock:Transmute Rock To Mud:' +
        'Tree Stride:Unhallow:Wall Of Fire:Wall Of Thorns',
        'D6:Antilife Shell:Find The Path:Fire Seeds:Greater Dispel Magic:' +
        'Ironwood:Liveoak:Mass Bear\'s Endurance:Mass Bull\'s Strength:' +
        'Mass Cat\'s Grace:Mass Cure Light Wounds:Mass Owl\'s Wisdom:' +
        'Move Earth:Repel Wood:Spellstaff:Stone Tell:' +
        'Summon Nature\'s Ally VI:Transport Via Plants:Wall Of Stone',
        'D7:Animate Plants:Changestaff:Control Weather:Creeping Doom:' +
        'Fire Storm:Greater Scrying:Heal:Mass Cure Moderate Wounds:' +
        'Summon Nature\'s Ally VII:Sunbeam:Transmute Metal To Wood:' +
        'True Seeing:Wind Walk',
        'D8:Animal Shapes:Control Plants:Earthquake:Finger Of Death:' +
        'Mass Cure Serious Wounds:Repel Metal Or Stone:Reverse Gravity:' +
        'Summon Nature\'s Ally VIII:Sunburst:Whirlwind:Word Of Recall',
        'D9:Antipathy:Elemental Swarm:Foresight:Mass Cure Critical Wounds:' +
        'Regenerate:Shambler:Shapechange:Storm Of Vengeance:' +
        'Summon Nature\'s Ally IX:Sympathy'
      ];
    } else if(klass == 'Paladin') {
      spells = [
        'P1:Bless:Bless Water:Bless Weapon:Create Water:Cure Light Wounds:' +
        'Detect Poison:Detect Undead:Divine Favor:Endure Elements:' +
        'Lesser Restoration:Magic Weapon:Protection From Chaos:' +
        'Protection From Evil:Read Magic:Resistance:Virtue',
        'P2:Bull\'s Strength:Delay Poison:Eagle\'s Splendor:Owl\'s Wisdom:' +
        'Remove Paralysis:Resist Energy:Shield Other:Undetectable Alignment:' +
        'Zone Of Truth',
        'P3:Cure Moderate Wounds:Daylight:Discern Lies:Dispel Magic:' +
        'Greater Magic Weapon:Heal Mount:Magic Circle Against Chaos:' +
        'Magic Circle Against Evil:Prayer:Remove Blindness/Deafness:' +
        'Remove Curse',
        'P4:Break Enchantment:Cure Serious Wounds:Death Ward:Dispel Chaos:' +
        'Dispel Evil:Holy Sword:Mark Of Justice:Neutralize Poison:Restoration'
      ];
    } else if(klass == 'Ranger') {
      spells = [
        'R1:Alarm:Animal Messenger:Calm Animals:Charm Animal:Delay Poison:' +
        'Detect Animals Or Plants:Detect Poison:Detect Snares And Pits:' +
        'Endure Elements:Entangle:Hide From Animals:Jump:Longstrider:' +
        'Magic Fang:Pass Without Trace:Read Magic:Resist Energy:' +
        'Speak With Animals:Summon Nature\'s Ally I',
        'R2:Barkskin:Bear\'s Endurance:Cat\'s Grace:Cure Light Wounds:' +
        'Hold Animal:Owl\'s Wisdom:Protection From Energy:Snare:' +
        'Speak With Plants:Spike Growth:Summon Nature\'s Ally II:Wind Wall',
        'R3:Command Plants:Cure Moderate Wounds:Darkvision:Diminish Plants:' +
        'Greater Magic Fang:Neutralize Poison:Plant Growth:Reduce Animal:' +
        'Remove Disease:Repel Vermin:Summon Nature\'s Ally III:Tree Shape:' +
        'Water Walk',
        'R4:Animal Growth:Commune With Nature:Cure Serious Wounds:' +
        'Freedom Of Movement:Nondetection:Summon Nature\'s Ally IV:Tree Stride'
      ];
    } else if(klass == 'Sorcerer' || klass == 'Wizard') {
      // Identical spell lists
      spells = [
        'W0:Acid Splash:Arcane Mark:Dancing Lights:Daze:Detect Magic:' +
        'Detect Poison:Disrupt Undead:Flare:Ghost Sound:Light:Mage Hand:' +
        'Mending:Message:Open/Close:Prestidigitation:Ray Of Frost:Read Magic:' +
        'Resistance:Touch Of Fatigue',
        'W1:Alarm:Animate Rope:Burning Hands:Cause Fear:Charm Person:' +
        'Chill Touch:Color Spray:Comprehend Languages:Detect Secret Doors:' +
        'Detect Undead:Disguise Self:Endure Elements:Enlarge Person:Erase:' +
        'Expeditious Retreat:Feather Fall:Floating Disk:Grease:Hold Portal:' +
        'Hypnotism:Identify:Jump:Mage Armor:Magic Missile:Magic Weapon:' +
        'Magic Aura:Mount:Obscuring Mist:Protection From Chaos:' +
        'Protection From Evil:Protection From Good:Protection From Law:' +
        'Ray Of Enfeeblement:Reduce Person:Shield:Shocking Grasp:' +
        'Silent Image:Sleep:Summon Monster I:' +
        'True Strike:Unseen Servant:Ventriloquism',
        'W2:Acid Arrow:Alter Self:Arcane Lock:Bear\'s Endurance:' +
        'Blindness/Deafness:Blur:Bull\'s Strength:Cat\'s Grace:' +
        'Command Undead:Continual Flame:Darkness:Darkvision:Daze Monster:' +
        'Detect Thoughts:Eagle\'s Splendor:False Life:Flaming Sphere:' +
        'Fog Cloud:Fox\'s Cunning:Ghoul Touch:Glitterdust:Gust Of Wind:' +
        'Hideous Laughter:Hypnotic Pattern:Invisibility:Knock:Levitate:' +
        'Locate Object:Magic Mouth:Minor Image:Mirror Image:Misdirection:' +
        'Obscure Object:Owl\'s Wisdom:Phantom Trap:Protection From Arrows:' +
        'Pyrotechnics:Resist Energy:Rope Trick:Scare:Scorching Ray:' +
        'See Invisibility:Shatter:Spectral Hand:Spider Climb:' +
        'Summon Monster II:Summon Swarm:Touch Of Idiocy:Web:Whispering Wind',
        'W3:Arcane Sight:Blink:Clairaudience/Clairvoyance:Daylight:' +
        'Deep Slumber:Dispel Magic:Displacement:Explosive Runes:Fireball:' +
        'Flame Arrow:Fly:Gaseous Form:Gentle Repose:Greater Magic Weapon:' +
        'Halt Undead:Haste:Heroism:Hold Person:Illusory Script:' +
        'Invisibility Sphere:Keen Edge:Lightning Bolt:' +
        'Magic Circle Against Chaos:Magic Circle Against Evil:' +
        'Magic Circle Against Good:Magic Circle Against Law:Major Image:' +
        'Nondetection:Phantom Steed:Protection From Energy:Rage:' +
        'Ray Of Exhaustion:Secret Page:Sepia Snake Sigil:Shrink Item:' +
        'Sleet Storm:Slow:Stinking Cloud:Suggestion:Summon Monster III:' +
        'Tiny Hut:Tongues:Vampiric Touch:Water Breathing:Wind Wall',
        'W4:Animate Dead:Arcane Eye:Bestow Curse:Black Tentacles:' +
        'Charm Monster:Confusion:Contagion:Crushing Despair:Detect Scrying:' +
        'Dimension Door:Dimensional Anchor:Enervation:Fear:Fire Shield:' +
        'Fire Trap:Greater Invisibility:Hallucinatory Terrain:Ice Storm:' +
        'Illusory Wall:Lesser Geas:Lesser Globe Of Invulnerability:' +
        'Locate Creature:Mass Enlarge Person:Mass Reduce Person:' +
        'Minor Creation:Mnemonic Enhancer:Phantasmal Killer:Polymorph:' +
        'Rainbow Pattern:Remove Curse:Resilient Sphere:Scrying:' +
        'Secure Shelter:Shadow Conjuration:Shout:Solid Fog:Stone Shape:' +
        'Stoneskin:Summon Monster IV:Wall Of Fire:Wall Of Ice',
        'W5:Animal Growth:Baleful Polymorph:Blight:Break Enchantment:' +
        'Cloudkill:Cone Of Cold:Contact Other Plane:Dismissal:' +
        'Dominate Person:Dream:Fabricate:False Vision:Feeblemind:' +
        'Hold Monster:Interposing Hand:Lesser Planar Binding:' +
        'Mage\'s Faithful Hound:Mage\'s Private Sanctum:Magic Jar:' +
        'Major Creation:Mind Fog:Mirage Arcana:Nightmare:Overland Flight:' +
        'Passwall:Permanency:Persistent Image:Prying Eyes:Secret Chest:' +
        'Seeming:Sending:Shadow Evocation:Summon Monster V:Symbol Of Pain:' +
        'Symbol Of Sleep:Telekinesis:Telepathic Bond:Teleport:' +
        'Transmute Mud To Rock:Transmute Rock To Mud:Wall Of Force:' +
        'Wall Of Stone:Waves Of Fatigue',
        'W6:Acid Fog:Analyze Dweomer:Antimagic Field:Chain Lightning:' +
        'Circle Of Death:Contingency:Control Water:Create Undead:' +
        'Disintegrate:Eyebite:Flesh To Stone:Forceful Hand:Freezing Sphere:' +
        'Geas/Quest:Globe Of Invulnerability:Greater Dispel Magic:' +
        'Greater Heroism:Guards And Wards:Legend Lore:Mage\'s Lucubration:' +
        'Mass Bear\'s Endurance:Mass Bull\'s Strength:Mass Cat\'s Grace:' +
        'Mass Eagle\'s Splendor:Mass Fox\'s Cunning:Mass Owl\'s Wisdom:' +
        'Mass Suggestion:Mislead:Move Earth:Permanent Image:Planar Binding:' +
        'Programmed Image:Repulsion:Shadow Walk:Stone To Flesh:' +
        'Summon Monster VI:Symbol Of Fear:Symbol Of Persuasion:' +
        'Transformation:True Seeing:Undeath To Death:Veil:Wall Of Iron',
        'W7:Banishment:Control Undead:Control Weather:' +
        'Delayed Blast Fireball:Ethereal Jaunt:Finger Of Death:Forcecage:' +
        'Grasping Hand:Greater Arcane Sight:Greater Scrying:' +
        'Greater Shadow Conjuration:Greater Teleport:Insanity:' +
        'Instant Summons:Limited Wish:Mage\'s Magnificent Mansion:' +
        'Mage\'s Sword:Mass Hold Person:Mass Invisibility:Phase Door:' +
        'Plane Shift:Power Word Blind:Prismatic Spray:Project Image:' +
        'Reverse Gravity:Sequester:Simulacrum:Spell Turning:Statue:' +
        'Summon Monster VII:Symbol Of Stunning:Symbol Of Weakness:' +
        'Teleport Object:Vision:Waves Of Exhaustion',
        'W8:Antipathy:Binding:Clenched Fist:Clone:Create Greater Undead:' +
        'Demand:Dimensional Lock:Discern Location:Greater Planar Binding:' +
        'Greater Prying Eyes:Greater Shadow Evocation:Greater Shout:' +
        'Horrid Wilting:Incendiary Cloud:Iron Body:Irresistible Dance:' +
        'Mass Charm Monster:Maze:Mind Blank:Moment Of Prescience:Polar Ray:' +
        'Polymorph Any Object:Power Word Stun:Prismatic Wall:' +
        'Protection From Spells:Scintillating Pattern:Screen:' +
        'Summon Monster VIII:Sunburst:Symbol Of Death:Symbol Of Insanity:' +
        'Sympathy:Telekinetic Sphere:Temporal Stasis:Trap The Soul',
        'W9:Astral Projection:Crushing Hand:Dominate Monster:Energy Drain:' +
        'Etherealness:Foresight:Freedom:Gate:Imprisonment:' +
        'Mage\'s Disjunction:Mass Hold Monster:Meteor Swarm:Power Word Kill:' +
        'Prismatic Sphere:Refuge:Shades:Shapechange:Soul Bind:' +
        'Summon Monster IX:Teleportation Circle:Time Stop:' +
        'Wail Of The Banshee:Weird:Wish'
      ];
    } else
      continue;
    if(spells != null) {
      for(var j = 0; j < spells.length; j++) {
        var pieces = spells[j].split(':');
        for(var k = 1; k < pieces.length; k++) {
          var spell = pieces[k];
          var school = FiveE.spellsSchools[spell];
          if(school == null) {
            continue;
          }
          spell += '(' + pieces[0] + ' ' +
                    (school == 'Universal' ? 'Univ' : schools[school]) + ')';
          rules.defineChoice('spells', spell);
        }
      }
    }
  }

  rules.defineChoice('domains', domains);

  for(var i = 0; i < domains.length; i++) {
    var domain = domains[i];
    var notes = null;
    var spells = null;
    if(domain == 'Knowledge') {
      // TODO
    } else if(domain == 'Life') {
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
    } else
      continue;
    if(notes != null) {
      rules.defineNote(notes);
    }
    if(spells != null) {
      for(var j = 0; j < spells.length; j++) {
        var spell = spells[j];
        var school = FiveE.spellsSchools[spell];
        if(school == null) {
          continue;
        }
        spell += '(' + domain + (j + 1) + ' ' + schools[school] + ')';
        rules.defineChoice('spells', spell);
      }
    }
  }

  rules.defineRule
    ('armorClass', 'combatNotes.goodiesArmorClassAdjustment', '+', null);
  rules.defineRule('combatNotes.goodiesArmorClassAdjustment',
    'goodies.Ring Of Protection +1', '+=', null,
    'goodies.Ring Of Protection +2', '+=', 'source * 2',
    'goodies.Ring Of Protection +3', '+=', 'source * 3',
    'goodies.Ring Of Protection +4', '+=', 'source * 4'
  );
  rules.defineRule('casterLevel',
    'casterLevelArcane', '+=', null,
    'casterLevelDivine', '+=', null
  );

};

/* Defines the rules related to character movement. */
FiveE.movementRules = function(rules) {
  rules.defineRule('speed', '', '=', '30');
};

/* Defines the rules related to character races. */
FiveE.raceRules = function(rules, languages, races) {

  rules.defineChoice('languages', languages);
  rules.defineRule('languageCount', 'race', '=', '2');
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
    var proficiencyCounts = null;
    var proficienciesGiven = null;
    var proficiencyChoices = null;
    var race = races[i];
    var raceNoSpace =
      race.substring(0,1).toLowerCase() + race.substring(1).replace(/ /g, '');

    if(race == 'Half-Elf') {

      adjustment = '+2 charisma';
      features = [
        'Darkvision', 'Extra Language', 'Fey Ancestry', 'Skill Versatility'
      ];
      languages = ['Common', 'Elf', ''];
      notes = [
        "featureNotes.darkvisionFeature:See one light level better 60'",
        'saveNotes.feyAncestryFeature:Adv vs. charmed, immune sleep',
        'skillNotes.skillVersatilityFeature:Prof in two additional skills'
      ];
      proficiencyCounts = {'Skill': 2};
      proficienciesGiven = {};
      proficiencyChoices = {
        'Skill': FiveE.SKILLS.map(function(skill){return skill.substring(0, skill.indexOf(':'));})
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
        'skillNotes.menacingFeature:Prof in Intimidation'
      ];
      proficiencyCounts = {'Skill': 2};
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
      proficiencyCounts = {};
      proficienciesGiven = {};
      proficiencyChoices = {};

      rules.defineRule('combatNotes.draconicBreathFeature',
        'level', '=', '1 + Math.floor((source-1) / 5)'
      );
      rules.defineRule('combatNotes.draconicBreathFeature.1',
        'race', '=', 'source < "Gold" ? "5\'x30\' line" : "15\' cone"'
      );
      rules.defineRule('combatNotes.draconicBreathFeature.2',
        'race', '=', 'FiveE.draconicBreathTypes[source]'
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
        'Darkvision', 'Resist Poison', 'Slow', 'Stonecunning',
        'Tool Proficiency'
      ];
      languages = ['Common', 'Dwarven'];
      notes = [
        'abilityNotes.dwarfArmorSpeedAdjustment:No speed penalty in armor',
        'abilityNotes.slowFeature:-5 speed',
        "featureNotes.darkvisionFeature:See one light level better 60'",
        'featureNotes.toolProficiencyFeature:' +
          'Proficient in choice of artisan tool',
        'saveNotes.resistPoisonFeature:Adv vs. poison',
        'skillNotes.stonecunningFeature:Double prof on stonework History checks'
      ];
      proficiencyCounts = {
        'Tool':1, 'Weapon':4
      };
      proficienciesGiven = {
        'Weapon':['Battleaxe', 'Handaxe', 'Throwing Hammer', 'Warhammer']
      };
      proficiencyChoices = {
        'Tool':["Brewer's Supplies", "Mason's Tools", "Smith's Tools"]
      };

      if(race == 'Hill Dwarf') {
        adjustment += '/+1 wisdom';
      } else if(race == 'Mountain Dwarf') {
        adjustment += '/+2 strength';
        proficiencyCounts['Armor'] = 2;
        proficienciesGiven['Armor'] = ['Light', 'Medium'];
      }

      rules.defineRule('abilityNotes.armorSpeedAdjustment',
        'abilityNotes.dwarfArmorSpeedAdjustment', '^', '0'
      );
      rules.defineRule('speed', 'abilityNotes.slowFeature', '+', '-5');

    } else if(race.match(/Elf/)) {

      adjustment = '+2 dexterity';
      features = ['Fey Ancestry', 'Trance'];
      languages = ['Common', 'Elvish'];
      notes = [
        'featureNotes.tranceFeature:' +
          '4 hour meditation gives benefit of 8 hour sleep',
        'saveNotes.feyAncestryFeature:Adv vs. charmed, immune sleep'
      ];
      proficiencyCounts = {'Skill': 1};
      proficienciesGiven = {'Skill': ['Perception']};
      proficiencyChoices = {};;

      if(race == 'High Elf') {
        adjustment += '/+1 intelligence';
        proficiencyCounts['Weapons'] = 4;
        proficienciesGiven['Weapons'] =
          ['Longbow', 'Longsword', 'Shortbow', 'Shortsword'];
        features.push('Cantrip', 'Darkvision', 'Extra Language');
        // TODO Cantrip
        notes.push(
          "featureNotes.darkvisionFeature:See one light level better 60'",
          'featureNotes.extraLanguageFeature:Speak 1 additional language'
        );
        rules.defineRule
          ('languageCount', 'featureNotes.extraLanguageFeature', '+', '1');
      } else if(race == 'Wood Elf') {
        adjustment += '/+1 wisdom';
        features.push('Darkvision', 'Mask Of The Wild', 'Quick');
        proficiencyCounts['Weapons'] = 4;
        proficienciesGiven['Weapons'] =
          ['Longbow', 'Longsword', 'Shortbow', 'Shortsword'];
        notes.push(
          'abilityNotes.quickFeature:+5 speed',
          "featureNotes.darkvisionFeature:See one light level better 60'",
          'featureNotes.maskOfTheWildFeature:' +
            'Hide when lightly obscured by nature'
        );
        rules.defineRule('speed', 'abilityNotes.quickFeature', '+', '5');
      } else if(race == 'Dark Elf') {
        adjustment += '/+1 charisma';
        features.push
          ('Drow Magic', 'Sunlight Sensitivity', 'Superior Darkvision');
        notes.push(
          'featureNotes.superiorDarkvisionFeature:' +
            "See one light level better 120'",
          'featureNotes.sunlightSensitivityFeature:' +
            'Disadv attack, sight perception in direct sunlight',
          'magicNotes.drowMagicFeature:Cast %V 1/day (cha)'
        );
        proficiencyCounts['Weapons'] = 3;
        proficienciesGiven['Weapons'] = ['Hand Crossbow', 'Rapier', 'Shortsword'];
        rules.defineRule('magicNotes.drowMagicFeature', 'level', '=', '"<i>Dancing Lights</i>" + (source < 3 ? "" : ", <i>Faerie Fire</i>") + (source < 5 ? "" : ", <i>Darkness</i>")');
      }

    } else if(race.match(/Gnome/)) {

      adjustment = '+2 intelligence';
      features = ['Cunning', 'Slow'];
      languages = ['Common', 'Gnome'];
      notes = [
        'abilityNotes.slowFeature:-5 speed',
        'saveNotes.cunningFeature:Adv vs cha/int/wis magic'
      ];
      proficiencyCounts = {};
      proficienciesGiven = {};
      proficiencyChoices = {};

      if(race == 'Forest Gnome') {
        adjustment += '/+1 dexterity';
        features.push('Natural Illusionist', 'Speak With Small Beasts');
        notes.push(
          'featureNotes.speakWithSmallBeastsFeature:Simple communication with small or smaller animals',
          'magicNotes.naturalIllusionistFeature:Cast <i>Minor Illusion</i> (int)'
        );
      } else if(race == 'Rock Gnome') {
        adjustment += '/+1 constitution';
        features.push("Artificier's Lore", 'Tinker');
        notes.push(
          "featureNotes.tinkerFeature:Prof w/artisan's tools",
          "skillNotes.artificier'sLoreFeature:Double prof on magic, alchemical, tech objects History checks"
        );
        proficiencyCounts['Tool'] = 1;
        proficienciesGiven['Tool'] = ["Artisan's Tools"];
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
      proficiencyCounts = {};
      proficienciesGiven = {};
      proficiencyChoices = {};

      if(race == 'Lightfoot Halfling') {
        adjustment += '/+1 charisma';
        features = features.concat(['Stealthy']);
        notes = notes.concat
          (['featureNotes.stealthyFeature:Hide behind bigger creature']);
      } else if(race == 'Stout Halfling') {
        adjustment += '/+1 constitution';
        features.push('Stout');
        notes.push
          ('saveNotes.stoutFeature:Adv vs. poison, resist poison damage');
      }

      rules.defineRule('speed', 'abilityNotes.slowFeature', '+', '-5');

    } else if(race.match(/Human/)) {

      adjustment = '+1 strength/+1 intelligence/+1 wisdom/+1 dexterity/+1 constitution/+1 charisma';
      features = [];
      languages = ['Common'];
      notes = [];
      proficiencyCounts = {};
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
      proficiencyCounts = {};
      proficienciesGiven = {};
      proficiencyChoices = {};

      rules.defineRule('magicNotes.infernalLegacyFeature', 'level', '=', '"<i>Thaumaturgy</i>" + (source < 3 ? "" : ", <i>Hellish Rebuke</i>") + (source < 5 ? "" : ", <i>Darkness</i>")');

    } else
      continue;

    FiveE.defineRace(
      rules, race, adjustment, features, languages, proficiencyCounts,
      proficienciesGiven, proficiencyChoices, notes
    );

  }

};

/* Defines the rules related to skills. */
FiveE.skillRules = function(rules, skills, tools) {

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
FiveE.spellDescriptionRules = function(rules, spells, descriptions) {
  if(spells == null) {
    spells = ScribeUtils.getKeys(rules.choices.spells);
  }
  if(descriptions == null) {
    descriptions = FiveE.spellsDescriptions;
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
      alert("Bad format for spell " + spell);
      continue;
    }
    var abbr = matchInfo[2];
    var level = matchInfo[3];
    var name = matchInfo[1];
    var description = descriptions[name];
    if(description == null) {
      alert("No description for spell " + name);
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
        if(FiveE.spellsAbbreviations[expr] != null) {
          expr = FiveE.spellsAbbreviations[expr];
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
FiveE.randomName = function(race) {

  /* Return a random character from #string#. */
  function randomChar(string) {
    return string.charAt(ScribeUtils.random(0, string.length - 1));
  }

  if(race == null)
    race = 'Human';
  else if(race == 'Half Elf')
    race = ScribeUtils.random(0, 99) < 50 ? 'Elf' : 'Human';
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
  var syllables = ScribeUtils.random(0, 99);
  syllables = syllables < 50 ? 2 :
              syllables < 75 ? 3 :
              syllables < 90 ? 4 :
              syllables < 95 ? 5 :
              syllables < 99 ? 6 : 7;
  var result = '';
  var vowel;

  for(var i = 0; i < syllables; i++) {
    if(ScribeUtils.random(0, 99) <= 80) {
      endConsonant = randomChar(consonants).toUpperCase();
      if(clusters[endConsonant] != null && ScribeUtils.random(0, 99) < 15)
        endConsonant += randomChar(clusters[endConsonant]);
      result += endConsonant;
      if(endConsonant == 'Q')
        result += 'u';
    }
    else if(endConsonant.length == 1 && ScribeUtils.random(0, 99) < 10) {
      result += endConsonant;
      endConsonant += endConsonant;
    }
    vowel = randomChar(vowels);
    if(endConsonant.length > 0 && diphthongs[vowel] != null &&
       ScribeUtils.random(0, 99) < 15)
      vowel += randomChar(diphthongs[vowel]);
    result += vowel;
    endConsonant = '';
    if(ScribeUtils.random(0, 99) <= 60) {
      while(leading.indexOf((endConsonant = randomChar(consonants))) >= 0)
        ; /* empty */
      if(clusters[endConsonant] != null && ScribeUtils.random(0, 99) < 15)
        endConsonant += randomChar(clusters[endConsonant]);
      result += endConsonant;
    }
  }
  return result.substring(0, 1).toUpperCase() +
         result.substring(1).toLowerCase();

};

/* Returns the elements in a basic SRD character editor. */
FiveE.initialEditorElements = function() {
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
    ['selectableFeatures', 'Selectable Features', 'bag', 'selectableFeatures'],
    ['skillProficiencies', 'Skills', 'set', 'skills'],
    ['toolProficiencies', 'Tools', 'set', 'tools'],
    ['languages', 'Languages', 'set', 'languages'],
    ['hitPoints', 'Hit Points', 'text', [4]],
    ['armor', 'Armor', 'select-one', 'armors'],
    ['shield', 'Shield', 'select-one', 'shields'],
    ['weapons', 'Weapons', 'bag', 'weapons'],
    ['spells', 'Spells', 'fset', 'spells'],
    ['goodies', 'Goodies', 'bag', 'goodies'],
    ['domains', 'Cleric Domains', 'set', 'domains'],
    ['notes', 'Notes', 'textarea', [40,10]],
    ['hiddenNotes', 'Hidden Notes', 'textarea', [40,10]]
  ];
  return editorElements;
};

/* Sets #attributes#'s #attribute# attribute to a random value. */
FiveE.randomizeOneAttribute = function(attributes, attribute) {

  /*
   * Randomly selects #howMany# elements of the array #choices#, prepends
   * #prefix# to each, and sets those attributes in #attributes# to #value#.
   */
  function pickAttrs(attributes, prefix, choices, howMany, value) {
    var remaining = [].concat(choices);
    for(var i = 0; i < howMany && remaining.length > 0; i++) {
      var which = ScribeUtils.random(0, remaining.length - 1);
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
    attributes['armor'] = choices[ScribeUtils.random(0, choices.length - 1)];
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
      attributes['deity'] = choices[ScribeUtils.random(0, choices.length - 1)];
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
          if(ScribeUtils.findElement(allChoices[attr].split('/'), a) >= 0 &&
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
           ScribeUtils.findElement(availableChoices[a].split('/'), attr) >= 0) {
          availableChoicesInType[a] = '';
        }
      }
      howMany = toAllocateByType[attr];
      debug[debug.length] = 'Choose ' + howMany + ' ' + attr + ' ' + prefix;
      while(howMany > 0 &&
            (choices=ScribeUtils.getKeys(availableChoicesInType)).length > 0) {
        debug[debug.length] =
          'Pick ' + howMany + ' from ' +
          ScribeUtils.getKeys(availableChoicesInType).length;
        var picks = {};
        pickAttrs(picks, '', choices, howMany, 1);
        debug[debug.length] =
          'From ' + ScribeUtils.getKeys(picks).join(", ") + ' reject';
        for(var pick in picks) {
          attributes[prefix + '.' + pick] = 1;
          delete availableChoicesInType[pick];
        }
        var validate = this.applyRules(attributes);
        for(var pick in picks) {
          var name = pick.substring(0, 1).toLowerCase() +
                     pick.substring(1).replace(/ /g, '').
                     replace(/\(/g, '\\(').replace(/\)/g, '\\)');
          if(ScribeUtils.sumMatching
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
  } else if(attribute == 'goodies') {
    attrs = this.applyRules(attributes);
    choices = ScribeUtils.getKeys(this.getChoices('goodies'));
    howMany = Math.floor((attrs.level + 1) / 3);
    pickAttrs(attributes, 'goodies.', choices, howMany -
              ScribeUtils.sumMatching(attrs, /^goodies\./), 1);
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
        attributes.hitPoints += ScribeUtils.random(number, number * sides);
    }
  } else if(attribute == 'languages') {
    attrs = this.applyRules(attributes);
    howMany = attrs['languageCount'] || 0;
    choices = ScribeUtils.getKeys(this.getChoices('languages'));
    pickAttrs(attributes, 'languages.', choices,
              howMany - ScribeUtils.sumMatching(attrs, /^languages\./), 1);
  } else if(attribute == 'levels') {
    choices = ScribeUtils.getKeys(this.getChoices('levels'));
    var soFar = ScribeUtils.sumMatching(attributes, /^levels\./); 
    var level = attributes.level != null ? attributes.level - 0 : soFar;
    if(level == 0) {
      level = ScribeUtils.random(1, 100);
      level = level<=50 ? 1 : level<=75 ? 2 : level<=87 ? 3 : level<=93 ? 4 :
              level<=96 ? 5 : level<=98 ? 6 : level<=99 ? 7 : 8;
    }
    howMany = level - soFar;
    var classes = ScribeUtils.random(1, 100);
    classes = classes < 60 ? 1 : classes < 90 ? 2 : 3;
    if(classes > howMany) {
      classes = ScribeUtils.random(1, howMany);
    }
    for(i = 1; howMany > 0; i++) {
      var thisLevel = i == classes ? howMany : ScribeUtils.random(1, howMany);
      var which = 'levels.' + choices[ScribeUtils.random(0, choices.length-1)];
      // Find a choice that is valid or can be made so
      while(attributes[which] == null) {
        attributes[which] = 1;
        if(ScribeUtils.sumMatching(this.applyRules(attributes),
             /^validationNotes.*(BaseAttack|CasterLevel|Spells)/) == 0) {
          // ok
          attributes[which] = 0;
        } else {
          // try another
          delete attributes[which];
          which = 'levels.'+choices[ScribeUtils.random(0, choices.length-1)];
        }
      }
      attributes[which] += thisLevel;
      howMany -= thisLevel;
    }
    attributes.level = level;
  } else if(attribute == 'name') {
    attributes['name'] = FiveE.randomName(attributes['race']);
  } else if(attribute == 'shield') {
    attrs = this.applyRules(attributes);
    choices = ['None'];
    for(attr in this.getChoices('shields')) {
      if(attrs['armorProficiencies.' + attr] ||
         attrs['armorProficiencies.Shield']) {
        choices[choices.length] = attr;
      }
    }
    attributes['shield'] = choices[ScribeUtils.random(0, choices.length - 1)];
  } else if(attribute == 'skills') {
    attrs = this.applyRules(attributes);
    howMany = attrs['proficiencyCounts.Skill'] || 0;
    choices = [];
    for(attr in this.getChoices('skills')) {
      if(attrs['skillChoices.' + attr]) {
        choices[choices.length] = attr;
      }
    }
    pickAttrs(attributes, 'skillProficiencies.', choices,
              howMany - ScribeUtils.sumMatching(attrs, /^skillProficiencies\./), 1);
  } else if(attribute == 'spells') {
    var availableSpellsByLevel = {};
    var matchInfo;
    var schools = this.getChoices('schools');
    var spellLevel;
    attrs = this.applyRules(attributes);
    for(attr in this.getChoices('spells')) {
      spellLevel = attr.split('(')[1].split(' ')[0];
      if(availableSpellsByLevel[spellLevel] == null)
        availableSpellsByLevel[spellLevel] = [];
      availableSpellsByLevel[spellLevel]
        [availableSpellsByLevel[spellLevel].length] = attr;
    }
    for(attr in attrs) {
      if((matchInfo = attr.match(/^spellsKnown\.(.*)/)) == null) {
        continue;
      }
      spellLevel = matchInfo[1];
      howMany = attrs[attr];
      if(spellLevel.match(/^S\d+$/)) {
        spellLevel = spellLevel.replace(/S/, 'W');
        var additional = attrs['spellsKnown.' + spellLevel];
        if(additional == null)
          ; // empty
        else if(additional == 'all' || howMany == 'all')
          howMany = 'all';
        else
          howMany += additional;
      }
      if(spellLevel.substring(0, 3) == 'Dom') {
        choices = [];
        for(var domain in this.getChoices('domains')) {
          if(attrs['domains.' + domain] != null) {
            var domainLevel = domain + spellLevel.substring(3);
            if(availableSpellsByLevel[domainLevel] != null) {
              choices = choices.concat(availableSpellsByLevel[domainLevel]);
            }
          }
        }
      } else {
        choices = availableSpellsByLevel[spellLevel];
      }
      if(choices != null) {
        if(howMany == 'all') {
          howMany = choices.length;
        }
        var perDay = attrs['spellsPerDay.' + spellLevel];
        if(perDay != null && perDay < howMany) {
          howMany = perDay;
        }
        pickAttrs
          (attributes, 'spells.', choices, howMany -
           ScribeUtils.sumMatching(attributes, '^spells\\..*' + spellLevel),
           1);
      }
    }
  } else if(attribute == 'tools') {
    attrs = this.applyRules(attributes);
    howMany = attrs['proficiencyCounts.Tool'] || 0;
    choices = [];
    for(attr in this.getChoices('tools')) {
      if(attrs['toolChoices.' + attr] ||
         attrs['toolChoices.' + this.getChoices('tools')[attr]]) {
        choices[choices.length] = attr;
      }
    }
    pickAttrs(attributes, 'toolProficiencies.', choices,
              howMany - ScribeUtils.sumMatching(attrs, /^toolProficiencies\./), 1);
  } else if(attribute == 'weapons') {
    attrs = this.applyRules(attributes);
    choices = [];
    for(attr in this.getChoices('weapons')) {
      if(attrs['proficient.' + attr]) {
        choices[choices.length] = attr;
      }
    }
    pickAttrs(attributes, 'weapons.', choices,
              3 - ScribeUtils.sumMatching(attributes, /^weapons\./), 1);
  } else if(attribute == 'charisma' || attribute == 'constitution' ||
     attribute == 'dexterity' || attribute == 'intelligence' ||
     attribute == 'strength' || attribute == 'wisdom') {
    var rolls = [];
    for(i = 0; i < 4; i++)
      rolls[i] = ScribeUtils.random(1, 6);
    rolls.sort();
    attributes[attribute] = rolls[1] + rolls[2] + rolls[3];
  } else if(this.getChoices(attribute + 's') != null) {
    attributes[attribute] =
      ScribeUtils.randomKey(this.getChoices(attribute + 's'));
  }

};

/* Fixes as many validation errors in #attributes# as possible. */
FiveE.makeValid = function(attributes) {

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
          var index = ScribeUtils.random(0, choices.length - 1);
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
              possibilities[ScribeUtils.random(0, possibilities.length - 1)];
          } else {
            toFixValue =
              possibilities[ScribeUtils.random(0, possibilities.length - 1)];
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
            var index = ScribeUtils.random(0, possibilities.length - 1);
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
            toFixAttr = ScribeUtils.randomKey(abilities);
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
                toFixValue = attributes[toFixAttr] - 0 + 2;
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
FiveE.ruleNotes = function() {
  return '' +
    '<h2>FiveE Scribe Module Notes</h2>\n' +
    'FiveE Scribe Module Version ' + FiveE_VERSION + '\n' +
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
    '  </li><li>\n' +
    '    The Commoner NPC class is given an extra feat to represent the\n' +
    '    class\'s single simple weapon proficiency.\n' +
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
    '    Scribe provides no place other than the notes section to enter\n' +
    '    mundane possessions like lanterns and rope. The same goes for\n' +
    '    physical description.\n' +
    '  </li><li>\n' +
    '    Scribe presently defines no way to add additional types of armor\n' +
    '    because of all the extra information that would need to be\n' +
    '    specified&#151;arcane spell failure percentage, AC bonus, max\n' +
    '    dexterity bonus, skill check penalty, etc.\n' +
    '  </li><li>\n' +
    '    Scribe has problems dealing with attributes containing an\n' +
    '    uncapitalized word.  This is why, e.g., Scribe defines the skills\n' +
    '    "Sleight Of Hand" and "Knowledge (Arcana)" instead of "Sleight of\n' +
    '    Hand" and "Knowledge (arcana)".  There are other occasions when\n' +
    '    Scribe is picky about case; when defining your own attributes,\n' +
    '    it\'s safest to follow the conventions Scribe uses.\n' +
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
    '    Scribe adds the dexterity modifier to attack throws for all\n' +
    '    weapons of characters with the Weapon Finesse feat, not just\n' +
    '    light weapons.\n' +
    '  </li><li>\n' +
    '    When an character ability score is modified, Scribe recalculates\n' +
    '    attributes based on that ability from scratch.  For example,\n' +
    '    bumping intelligence when a character reaches fourth level causes\n' +
    '    Scribe to recompute the number of skill points awarded at first\n' +
    '    level.\n' +
    '  </li><li>\n' +
    '    Multi-class characters get quadruple spell points for the first\n' +
    '    level in each class, instead of just the first class.\n' +
    '  </li>\n' +
    '</ul>\n' +
    '</p>\n';
};

FiveE.defineBackground = function(
  rules, name, features, languages, proficiencyCounts, proficienciesGiven,
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

  if(proficiencyCounts != null) {
    for(var a in proficiencyCounts) {
      rules.defineRule('proficiencyCounts.' + a,
        'isBackground.' + name, '+=', proficiencyCounts[a]
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
 * spells known at each class level, #spellsPerDay# an array of information
 * about the type, number, and level of spells castable per day at each class
 * level, and #spellAbility# the ability that pertains to this class' spells.
 */
FiveE.defineClass = function(
  rules, name, hitDice, features, selectableFeatures, proficiencyCounts,
  proficienciesGiven, proficiencyChoices, spellAbility, spellsKnown,
  spellsPerDay, notes
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
      var choice = name + ' - ' + selectable;
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

  if(proficiencyCounts != null) {
    for(var a in proficiencyCounts) {
      rules.defineRule
        ('proficiencyCounts.' + a, classLevel, '+=', proficiencyCounts[a]);
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
    rules.defineRule('spellDifficultyClass.' + name,
      'levels.' + name, '?', null,
      spellAbility + 'Modifier', '=', '8 + source',
      'proficiencyBonus', '+', null
    );
  }

  if(spellsKnown != null || spellsPerDay != null) {
    rules.defineRule('casterSpellLevel.' + name,
      'levels.' + name, '=', null,
      'magicNotes.casterLevelBonusFeature', '+', null
    );
  }

  // if(spellsKnown != null) {
  //   for(var j = 0; j < spellsKnown.length; j++) {
  //     var typeAndLevel = spellsKnown[j].split(/:/)[0];
  //     var level = typeAndLevel.replace(/[A-Za-z]*/g, '');
  //     var code = spellsKnown[j].substring(typeAndLevel.length + 1).
  //                split(/\//).reverse().join('source >= ');
  //     code = code.replace(/:/g, ' ? ').replace(/source/g, ' : source');
  //     code = 'source >= ' + code + ' : null';
  //     if(code.indexOf('source >= 1 ?') >= 0) {
  //       code = code.replace(/source >= 1 ./, '').replace(/ : null/, '');
  //     }
  //     rules.defineRule
  //       ('spellsKnown.' + typeAndLevel, 'casterSpellLevel.' + name, '=', code);
  //   }
  // }

  if(spellsPerDay != null) {
    for(var j = 0; j < spellsPerDay.length; j++) {
      var typeAndLevel = spellsPerDay[j].split(/:/)[0];
      var level = typeAndLevel.replace(/[A-Z]*/, '');
      var code = spellsPerDay[j].substring(typeAndLevel.length + 1).
                 split(/\//).reverse().join('source >= ');
      code = code.replace(/:/g, ' ? ').replace(/source/g, ' : source');
      code = 'source >= ' + code + ' : null';
      if(code.indexOf('source >= 1 ?') >= 0) {
        code = code.replace(/source >= 1 ./, '').replace(/ : null/, '');
      }
      rules.defineRule
        ('spellsPerDay.' + typeAndLevel, 'casterSpellLevel.' + name, '=', code);
      if(spellAbility != null) {
        var modifier = spellAbility + 'Modifier';
        var level = typeAndLevel.replace(/[A-Za-z]*/g, '');
        if(level > 0) {
          code = 'source >= ' + level +
                 ' ? 1 + Math.floor((source - ' + level + ') / 4) : null';
          rules.defineRule
            ('spellsPerDay.' + typeAndLevel, modifier, '+', code);
        }
      }
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
FiveE.defineRace = function(
  rules, name, abilityAdjustment, features, languages, proficiencyCounts,
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

  if(proficiencyCounts != null) {
    for(var a in proficiencyCounts) {
      rules.defineRule
        ('proficiencyCounts.'+a, 'isRace.' + name, '+=', proficiencyCounts[a]);
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

/* Convenience functions that invoke ScribeRules methods on the FiveE rules. */
FiveE.applyRules = function() {
  return FiveE.rules.applyRules.apply(FiveE.rules, arguments);
};

FiveE.defineChoice = function() {
  return FiveE.rules.defineChoice.apply(FiveE.rules, arguments);
};

FiveE.defineEditorElement = function() {
  return FiveE.rules.defineEditorElement.apply(FiveE.rules, arguments);
};

FiveE.defineNote = function() {
  return FiveE.rules.defineNote.apply(FiveE.rules, arguments);
};

FiveE.defineRule = function() {
  return FiveE.rules.defineRule.apply(FiveE.rules, arguments);
};

FiveE.defineSheetElement = function() {
  return FiveE.rules.defineSheetElement.apply(FiveE.rules, arguments);
};

FiveE.getChoices = function() {
  return FiveE.rules.getChoices.apply(FiveE.rules, arguments);
};

FiveE.isSource = function() {
  return FiveE.rules.isSource.apply(FiveE.rules, arguments);
};
