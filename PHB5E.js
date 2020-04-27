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

/*
 * This module loads the rules from Fifth Edition Player's Handbook that are
 * not part of the 5E PHB.  The PHB5E function contains methods that load rules
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
  PHB5E.raceRules(SRD5E.rules, PHB5E.RACES);
  PHB5E.classRules(SRD5E.rules, SRD5E.CLASSES);
  PHB5E.backgroundRules(SRD5E.rules, PHB5E.BACKGROUNDS);
  PHB5E.featRules(SRD5E.rules, PHB5E.FEATS);
  PHB5E.descriptionRules(SRD5E.rules, PHB5E.DEITIES);
  PHB5E.magicRules(SRD5E.rules, SRD5E.CLASSES);
  SRD5E.spellRules
    (SRD5E.rules, null, Object.assign({}, SRD5E.spellsDescriptions, PHB5E.spellsDescriptions));
  PHB5E.rules = SRD5E.rules;
}

PHB5E.BACKGROUNDS = [
  'Charlatan', 'Criminal', 'Entertainer', 'Folk Hero', 'Guild Artisan',
  'Hermit', 'Noble', 'Outlander', 'Sage', 'Sailor', 'Soldier', 'Urchin'
];
PHB5E.DEITIES = [
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
];
PHB5E.FEATS = [
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
];
PHB5E.RACES = [
  'Mountain Dwarf', 'Dark Elf', 'Wood Elf', 'Forest Gnome', 'Stout Halfling'
];
PHB5E.SPELLS = {
  'Arcane Gate':'Conjuration',
  'Armor Of Agathys':'Abjuration',
  'Arms Of Hadar':'Conjuration',
  'Aura Of Life':'Abjuration',
  'Aura Of Purity':'Abjuration',
  'Aura Of Vitality':'Evocation',
  'Banishing Smite':'Abjuration',
  'Beast Sense':'Divination',
  'Blade Ward':'Abjuration',
  'Blinding Smite':'Evocation',
  'Chromatic Orb':'Evocation',
  'Circle Of Power':'Abjuration',
  'Cloud Of Daggers':'Conjuration',
  'Compelled Duel':'Enchantment',
  'Conjure Barrage':'Conjuration',
  'Conjure Volley':'Conjuration',
  'Cordon Of Arrows':'Transmutation',
  'Crown Of Madness':'Enchantment',
  "Crusader's Mantle":'Evocation',
  'Destructive Wave':'Evocation',
  'Dissonant Whispers':'Enchantment',
  'Elemental Weapon':'Transmutation',
  'Ensnaring Strike':'Conjuration',
  'Feign Death':'Necromancy',
  'Friends':'Enchantment',
  'Grasping Vine':'Conjuration',
  'Hail Of Thorns':'Conjuration',
  'Hex':'Enchantment',
  'Hunger Of Hadar':'Conjuration',
  'Lightning Arrow':'Transmutation',
  'Phantasmal Force':'Illusion',
  'Power Word Heal':'Evocation',
  'Ray Of Sickness':'Necromancy',
  'Searing Smite':'Evocation',
  'Staggering Smite':'Evocation',
  'Swift Quiver':'Transmutation',
  'Telepathy':'Evocation',
  'Thorn Whip':'Transmutation',
  'Thunderous Smite':'Evocation',
  'Tsunami':'Conjuration',
  'Witch Bolt':'Evocation',
  'Wrathful Smite':'Evocation',
};

PHB5E.spellsDescriptions = {
  'Arcane Gate':"R10'/500' Connect portal pair for conc/10 min",
  'Armor Of Agathys':"Self frosted, +5 HP, 5 HP cold to successful attcker",
  'Arms Of Hadar':
    "All in 10' radius take 2d6 HP necrotic (Str half), no reactions until next turn",
  'Aura Of Life':
    "Self 30' radius gives resistance to necrotic damage, raise nonhostile 0 HP to 1 HP for conc/10 min",
  'Aura Of Purity':
    "Self 30' radius gives resist poison, no disease, Adv conditions for conc/10 min",
  'Aura Of Vitality':
    "Self 30' radius heals 2d6 HP designated target 1/rd for conc/1 min",
  'Banishing Smite':
    "Self attacks +5d10 HP force and banish to home/demiplane if lt 50 HP for conc/1 min",
  'Beast Sense':"Self use touched beast's senses for conc/1 hr",
  'Blade Ward':"Self resist bludgeon, pierce, slash damage for 1 rd",
  'Blinding Smite':
    "Self next attack +3d8 HP radiant and blind (Con neg) for conc/1 min",
  'Chromatic Orb':"R90' 4\" hurled sphere 3d8 HP acid/poison/energy",
  'Circle Of Power':
    "Allies in 30' radius from self Adv save vs. magic, neg instead of half for conc/10 min",
  'Cloud Of Daggers':
    "R60' Spinning daggers in 5' cu 4d4 HP slashing for conc/1 min",
  'Compelled Duel':
    "R30' Target attack only self w/Disadv for conc/1 min (Wis neg)",
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
  'Phantasmal Force':"R60' target illusion 1d6 HP/rd (Int neg)",
  'Power Word Heal':
    "Touched regains all HP, uncharm, unfright, unparalyze, unstun",
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
  'Wrathful Smite':"Next hit +1d6 HP, fright (Wis neg) for conc/1 min"
};

/* Defines the rules related to character backgrounds. */
PHB5E.backgroundRules = function(rules, backgrounds) {

  for(var i = 0; i < backgrounds.length; i++) {

    var name = backgrounds[i];
    var equipment = null;
    var features = null;
    var languages = null;
    var proficiencyCount = {};
    var proficienciesGiven = {};
    var proficiencyChoices = {};

    if(name == 'Charlatan') {
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
      features = ['1:Guild Membership:feature:Aid from guild members'];
      languages = [''];
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
        '1:Position Of Priviledge:feature:Treated with respect, deference'
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
        '1:Wanderer:feature:Excellent geography memory, forage for 6 people'
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
      features = ['1:Researcher:feature:Know who to ask about lore'];
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
      features = ['1:Military Rank:feature:Respect, deference from soldiers'];
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
    } else
      continue;

    SRD5E.defineBackground(
      rules, name, features, languages, proficiencyCount, proficienciesGiven,
      proficiencyChoices, equipment
    );

  }

};

/* Defines the rules related to character classes. */
PHB5E.classRules = function(rules, classes) {

  for(var i = 0; i < classes.length; i++) {

    var features = [],
        hitDie = 8,
        selectableFeatures = null,
        spellAbility = null,
        spellsKnown = null,
        spells = null,
        spellSlots = null;
    var name = classes[i];

    if(name == 'Barbarian') {

      features = [
        // Path Of The Totem Warrior
        '3:Spirit Seeker:magic:' +
          'Ritual <i>Beast Sense</i>, <i>Speak With Animals</i>',
        '3:Bear Totem Spirit:combat:Resist non-psychic damage when raging',
        '3:Eagle Totem Spirit:combat:' +
          'Foes Disadv OA, Dash as bonus action when raging (heavy armor neg)',
        '3:Wolf Totem Spirit:combat:' +
          "Allies Adv attack vs. self adjacent foes when raging",
        '6:Aspect Of The Bear:ability:' +
          'Dbl load/lift, Adv push, pull, lift, break Str checks',
        '6:Aspect Of The Eagle:skill:' +
          'See clearly 1 mi, no dim light Perception Disadv',
        '6:Aspect Of The Wolf:ability:' +
          'Track at fast pace, stealth at normal pace',
        '10:Spirit Walker:magic:Ritual <i>Commune With Nature</i>',
        '14:Bear Totemic Attunement:combat:' +
          'Adjacent foes Disadv attack others when self raging',
        '14:Eagle Totemic Attunement:ability:Fly for short bursts when raging',
        '14:Wolf Totemic Attunement:combat:' +
          'Knock prone lg foe after melee hit when raging'
      ];
      hitDie = 12;

      rules.defineRule('totemicBarbarian',
        'barbarianFeatures.Path Of The Totem Warrior (Bear)', '=', '1',
        'barbarianFeatures.Path Of The Totem Warrior (Eagle)', '=', '1',
        'barbarianFeatures.Path Of The Totem Warrior (Wolf)', '=', '1'
      );
      rules.defineRule
        ('barbarianFeatures.Spirit Seeker', 'totemicBarbarian', '?', null);
      rules.defineRule
        ('barbarianFeatures.Spirit Walker', 'totemicBarbarian', '?', null);
      rules.defineRule
        ('carry', 'abilityNotes.aspectOfTheBearFeature', '*', '2');
      rules.defineRule('lift', 'abilityNotes.aspectOfTheBearFeature', '*', '2');
      for(var feature in {
        'Aspect Of The $A':'', '$A Totem Spirit':'', '$A Totemic Attunement':''
      }) {
        for(var animal in {'Bear':'', 'Eagle':'', 'Wolf':''}) {
          rules.defineRule('barbarianFeatures.' + feature.replace('$A', animal),
            'barbarianFeatures.Path Of The Totem Warrior (' + animal + ')', '?', null
          );
        }
      }

    } else if(name == 'Bard') {

      features = [
        // College Of Valor
        '3:Armor Proficiency (Medium/Shield)',
        '3:Bonus Skills:skill:Prof 3 additional skills',
        '3:Combat Inspiration:combat:' +
          'Ally use Bardic Inspiration die to boost damage or AC',
        '3:Weapon Proficiency (Martial)',
        '6:Extra Attack:combat:%V additional attack(s) per Attack action',
        '14:Battle Magic:combat:Bonus attack after casting spell'
      ];
      hitDie = 8;
      selectableFeatures = ['3:College Of Valor::'];
      rules.defineRule('armorProficiencies.Medium Armor',
        'bardFeatures.College Of Valor', '=', '1'
      );
      rules.defineRule('armorProficiencies.Shield',
        'bardFeatures.College Of Valor', '=', '1'
      );
      rules.defineRule
        ('attacksPerRound', 'combatNotes.extraAttackFeature', '+', null);
      rules.defineRule('bardExtraAttacks',
        'bardFeatures.Extra Attack', '?', null,
        'levels.Bard', '=', 'source < 6 ? null : 1'
      );
      rules.defineRule
        ('combatNotes.extraAttackFeature', 'bardExtraAttacks', '+=', null);
      rules.defineRule
        ('proficiencyCount.Armor', 'bardFeatures.College Of Valor', '+=', '2');
      rules.defineRule
        ('proficiencyCount.Skill', 'skillNotes.bonusSkillsFeature', '+', '3');
      rules.defineRule
        ('proficiencyCount.Weapon', 'bardFeatures.College Of Valor', '+=', '1');
      rules.defineRule('weaponProficiencies.Martial',
        'bardFeatures.College Of Valor', '=', '1'
      );

      for(var feature in {
        'Battle Magic':'', 'Combat Inspiration':'', 'Extra Attack':''
      }) {
        rules.defineRule('bardFeatures.' + feature,
          'bardFeatures.College Of Valor', '?', null
        );
      }

    } else if(name == 'Cleric') {

      features = [
        // Knowledge Domain
        '1:Blessings Of Knowledge:skill:+2 languages, +2 skill proficiencies',
        '2:Knowledge Of The Ages:skill:' +
          'Channel Divinity for Prof chosen skill or tool for 10 min',
        '6:Read Thoughts:magic:' +
          "R60' Channel Divinity to read thoughts, <i>Suggestion</i> for 1 min (Wis neg)",
        '8:Potent Spellcasting:magic:+%V Cleric cantrip damage',
        '17:Visions Of The Past:magic:' +
          'Meditate for visions about surroundings or held object',
        // Light Domain
        '1:Light Cantrip:magic:Know <i>Light</i> cantrip',
        '1:Warding Flare:magic:' +
          "R30' Reaction flare foe Disadv on current attack %V/long rest",
        '2:Radiance Of The Dawn:magic:' +
          "R30' Channel Divinity to dispel magic darkness, 2d10+%V HP to foes (Con half)",
        '6:Improved Flare:magic:Warding Flare protects allies',
        '8:Potent Spellcasting:magic:+%V Cleric cantrip damage',
        "17:Corona Of Light:magic:" +
          "60' light, foe Disadv on fire, radiant spells for 1 min",
        // Nature Domain
        '1:Armor Proficiency (Heavy)',
        '1:Acolyte Of Nature:magic:Additional Druid cantrip',
        '1:Acolyte Of Nature:skill:Additional skill proficiency',
        '2:Charm Animals And Plants:magic:' +
          "R30' Channel Divinity charms for 1 min (Wis neg)",
        '6:Dampen Elements:magic:' +
          "R30' Reaction to grant resistance to acid, cold, fire, lightning, or thunder",
        '8:Divine Strike:combat:+%Vd8 HP 1/turn',
        '17:Master Of Nature:magic:Command charmed animals, plants',
        // Tempest Domain
        '1:Armor Proficiency (Heavy)::',
        '1:Weapon Proficiency (Martial)::',
        '1:Wrath Of The Storm:combat:Reaction 2d8 HP (Dex half) %V/long rest',
        '2:Destructive Wrath:magic:' +
          'Channel Divinity for max thunder, lightning damage',
        "6:Thunderbolt Strike:magic:Lightning damage pushes lg 10'",
        '8:Divine Strike:combat:+%Vd8 HP 1/turn',
        '17:Stormborn:ability:Fly at full speed outdoors',
        // Trickery Domain
        '1:Blessing Of The Trickster:magic:Touched Adv Stealth for 1 hr',
        "2:Invoke Duplicity:magic:R30' Illusionary duplicate for conc/1 min",
        '6:Cloak Of The Trickster:magic:Channel Divinity for invisible 1 turn',
        '8:Divine Strike:combat:+%Vd8 HP 1/turn',
        '17:Improved Duplicity:magic:Four duplicates',
        // War Domain
        '1:Armor Proficiency (Heavy)::',
        '1:Weapon Proficiency (Martial)::',
        '1:War Priest:combat:Bonus attack %V/long rest',
        '2:Guided Strike:combat:Channel Divinity for +10 attack',
        "6:War God's Blessing:magic:" +
          "R30' Channel Divinity reaction for ally +10 attack",
        '8:Divine Strike:combat:+%Vd8 HP 1/turn',
        '17:Avatar Of Battle:combat:' +
          'Resistance nonmagical bludgeon, pierce, slash'
      ];
      hitDie = 8;
      selectableFeatures = [
        '1:Knowledge Domain::',
        '1:Light Domain::',
        '1:Nature Domain::',
        '1:Tempest Domain::',
        '1:Trickery Domain::',
        '1:War Domain::'
      ];
      spells = {
        'Knowledge Domain':[
          '1:Command:Identify',
          '3:Augury:Suggestion',
          '5:Nondetection:Speak With Dead',
          '7:Arcane Eye:Confusion',
          '9:Legend Lore:Scrying'
        ],
        'Light Domain':[
          '1:Burning Hands:Faerie Fire',
          '3:Flaming Sphere:Scorching Ray',
          '5:Daylight:Fireball',
          '7:Guardian Of Faith:Wall Of Fire',
          '9:Flame Strike:Scrying'
        ],
        'Nature Domain':[
          '1:Animal Friendship:Speak With Animals',
          '3:Barkskin:Spike Growth',
          '5:Plant Growth:Wind Wall',
          '7:Dominate Beast:Grasping Vine',
          '9:Insect Plague:Tree Stride'
        ],
        'Tempest Domain':[
          '1:Fog Cloud:Thunderwave',
          '3:Gust Of Wind:Shatter',
          '5:Call Lightning:Sleet Storm',
          '7:Control Water:Ice Storm',
          '9:Destructive Wave:Insect Plague'
        ],
        'Trickery Domain':[
          '1:Charm Person:Disguise Self',
          '3:Mirror Image:Pass Without Trace',
          '5:Blink:Dispel Magic',
          '7:Dimension Door:Polymorph',
          '9:Dominate Person:Modify Memory'
        ],
        'War Domain':[
          '1:Divine Favor:Shield Of Faith',
          '3:Magic Weapon:Spiritual Weapon',
          "5:Crusader's Mantle:Spirit Guardians",
          '7:Freedom Of Movement:Stoneskin',
          '9:Flame Strike:Hold Monster'
        ]
      };

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

    } else if(name == 'Druid') {

      features = [
        // Circle Of The Moon
        '2:Combat Wild Shape:combat:' +
          'Wild Shape as bonus action, use spell slot to regain (slot level)d8 HP',
        '2:Circle Forms:magic:Increase Wild Shape CR to %V',
        '6:Primal Strike:combat:Wild Shape attacks count as magical',
        '10:Elemental Wild Shape:magic:' +
          'Use 2 Wild Shape uses to become elemental',
        '14:Thousand Forms:magic:<i>Alter Self</i> at will',
      ];
      hitDie = 8;
      selectableFeatures = [
        '2:Circle Of The Land (Underdark)::',
        '2:Circle Of The Moon::',
      ];
      spells = {
        'Circle Of The Land (Underdark)':[
          '3:Spider Climb:Web',
          '5:Gaseous Form:Stinking Cloud',
          '7:Greater Invisibility:Stone Shape',
          '9:Cloudkill:Insect Plague'
        ]
      };

      for(var feature in {
        'Circle Forms':'', 'Combat Wild Shape':'', 'Elemental Wild Shape':'',
        'Primal Strike':'', 'Thousand Forms':''
      }) {
        rules.defineRule('druidFeatures.' + feature,
          'druidFeatures.Circle Of The Moon', '?', null
        );
      }
      rules.defineRule('magicNotes.wildShapeFeature.1',
        'magicNotes.circleFormsFeature', '=', null
      );
      rules.defineRule('magicNotes.circleFormsFeature',
        'levels.Druid', '=', 'source < 6 ? 1 : Math.floor(source / 3)'
      );

    } else if(name == 'Fighter') {

      features = [
        // Battle Master Archetype
        '3:Maneuvers:combat:Select %V Fighter maneuver features',
        "3:Student Of War:skill:Artisan's Tools Prof",
        '3:Superiority Dice:combat:%Vd%1/short rest',
        '7:Know Your Enemy:combat:' +
          'Know how foe compares to you after 1 min study',
        '15:Relentless:combat:Min 1 superiority die after Init',
        // Eldritch Knight Archetype
        '3:Spellcasting::',
        '3:Weapon Bond:combat:Immune disarm, summon weapon',
        '7:War Magic:combat:Bonus attack after %V',
        '10:Eldritch Strike:combat:' +
          'Foe Disadv vs. your spells for 1 turn after you hit',
        "15:Arcane Charge:magic:Action Surge to teleport 30'"
      ];
      hitDie = 10;
      selectableFeatures = [
        '3:Battle Master Archetype::',
        '3:Eldritch Knight Archetype::',
        "3:Commander's Strike:combat:Add Superiority die to delegated attack",
        '3:Disarming Attack:combat:' +
          'Add Superiority die to damage, foe drops item (DC %V Str neg)',
        '3:Distracting Strike:combat:' +
          'Add Superiority die to damage, ally Adv attack same foe for 1 turn',
        '3:Evasive Footwork:combat:Add Superiority die to AC during move',
        '3:Feinting Attack:combat:' +
          'Adv next attack adjacent foe, add Superiority die to damage',
        '3:Goading Attack:combat:' +
          'Add Superiority die to damage, foe Disadv attack others for 1 turn (DC %V Wis neg)',
        "3:Lunging Attack:combat:+5' melee range, add Superiority die to damage",
        '3:Maneuvering Attack:combat:' +
          'Add Superiority die to damage, ally move half speed w/no OA',
        '3:Menacing Attack:combat:' +
          'Add Superiority die to damage, foe fright for 1 turn (DC %V Wis neg)',
        '3:Parry:combat:Reduce damage from foe hit by Superiority die + %V',
        '3:Precision Attack:combat:Add Superiority die to attack',
        '3:Pushing Attack:combat:' +
          "Add Superiority die to damage, foe pushed 15' (DC %V Str neg)",
        '3:Rally:combat:Chosen ally gains Superiority die + %V temp HP',
        '3:Riposte:combat:' +
          'Bonus attack after foe miss, add Superiority die to damage',
        '3:Sweeping Attack:combat:' +
          'After hit, Superiority die damage to second adjacent foe',
        '3:Trip Attack:combat:' +
          'Add Superiority die to damage, foe knocked prone (DC %V Str neg)'
      ];
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

      rules.defineRule
        ('proficiencyCount.Tool', 'skillNotes.studentOfWarFeature', '+=', '1');
      rules.defineRule('toolChoices.Artisan',
        'skillNotes.studentOfWarFeature', '=', '1'
      );

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

    } else if(name == 'Monk') {

      features = [
        // Way Of The Four Elements Tradition
        '3:Disciple Of The Elements:magic:%V elemental disciplines',
        '3:Elemental Attunement:magic:Minor elemental manipulation',
        // Way Of The Shadow Tradition
        '3:Shadow Arts:magic:' +
          '<i>Minor Illusion</i> cantrip, spend 2 Ki to cast <i>Darkness</i>, '+
          '<i>Darkvision</i>, <i>Pass Without Trace</i>, <i>Silence</i>',
        "6:Shadow Step:magic:Teleport 60' between dim/unlit areas",
        '11:Cloak Of Shadows:magic:Invisible in dim/unlit until attack or cast',
        '17:Opportunist:combat:Attack adjacent foe after ally hits it'
      ];
      hitDie = 8;
      selectableFeatures = [
        '3:Way Of The Four Elements Tradition::',
        '3:Way Of The Shadow Tradition::',
        // Way Of The Four Elements Tradition
        '17:Breath Of Winter:magic:Spend 6 Ki to cast <i>Cone Of Cold</i>',
        '6:Clench Of The North Wind:magic:' +
          'Spend 3 Ki to cast <i>Hold Person</i>',
        '17:Eternal Mountain Defense:magic:' +
          'Spend 5 Ki to cast self <i>Stoneskin</i>',
        '3:Fangs Of The Fire Snake:magic:' +
          "Spend 1 Ki to have unarmed attack extend 10', +1d10 HP fire",
        '3:Fist Of Four Thunders:magic:Spend 2 Ki to cast <i>Thunderwave</i>',
        '3:Fist Of Unbroken Air:magic:' +
          "R30' Spend 2 Ki to create air blast 3d10 HP, push 20' and knock prone (Str half)",
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
          "R30' Spend 2 Ki to create water whip 3d10 HP, pull 25' or knock prone (Str half)",
        '17:Wave Of The Rolling Earth:magic:' +
          'Spend 6 Ki to cast <i>Wall Of Stone</i>'
      ];

      rules.defineRule('magicMonk',
        'monkFeatures.Way Of The Shadow Tradition', '=', null,
        'monkFeatures.Way Of The Four Elements Tradition', '=', null
      );
      rules.defineRule('casterLevels.Mo',
        'magicMonk', '?', null,
        'levels.Monk', '=', null,
        'magicNotes.casterLevelBonusFeature', '+', null
      );
      rules.defineRule('spellDifficultyClass.Mo',
        'casterLevels.Mo', '?', null,
        'kiSaveDC', '=', null
      );
      rules.defineRule('magicNotes.discipleOfTheElementsFeature',
        'monkFeatures.Way Of The Four Elements Tradition', '?', null,
        'levels.Monk', '=', 'Math.floor( (source + 4) / 5)'
      );
      rules.defineRule('selectableFeatureCount.Monk',
        'magicNotes.discipleOfTheElementsFeature', '+', null
      );

      for(var feature in {
        'Disciple Of The Elements':'', 'Elemental Attunement':''
      }) {
        rules.defineRule('monkFeatures.' + feature,
          'monkFeatures.Way Of The Four Elements Tradition', '?', null
        );
      }
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


    } else if(name == 'Paladin') {

      features = [
        // Oath Of The Ancients
        "3:Nature's Wrath:magic:" +
         "R10' Channel Divinity for vines ensnare foe (Dex or Str neg)",
        '3:Turn The Faithless:magic:' +
          "R30' Channel Divinity for fiends, fey flee for 1 min (Wis neg)",
        "7:Aura Of Warding:save:R%V' Self, allies resist spell damage",
        '15:Undying Sentinel:combat:Keep 1 HP when brought to 0 1/long rest',
        '20:Elder Champion:magic:' +
          "Transform, regain 10 HP/turn, cast as bonus action, foes w/in 10' save Disadv 1/long rest",
        // Oath Of Vengeance
        '3:Abjure Enemy:magic:' +
          "R60' Channel Divinity for target halted 1 min (Wis half)",
        '3:Vow Of Enmity:combat:' +
          "R10' Channel Divinity for Adv attacks against target for 1 min",
        '7:Relentless Avenger:combat:Move half speed after OA hit',
        '15:Soul Of Vengeance:combat:Attack Vow Of Enmity target as reaction',
        '20:Avenging Angel:magic:' +
          "Fly 60', 30' foes fright (Wis neg) 1 hr/long rest"
      ];
      hitDie = 10;
      selectableFeatures = [
        '3:Oath Of The Ancients::',
        '3:Oath Of Vengeance::'
      ];
      spells = {
        'Oath Of The Ancients':[
          '3:Ensnaring Strike:Speak With Animals',
          '5:Moonbeam:Misty Step',
          '9:Plant Growth:Protection From Energy',
          '13:Ice Storm:Stoneskin',
          '17:Commune With Nature:Tree Stride',
        ],
        'Oath Of Vengeance':[
          "3:Bane:Hunter's Mark",
          '5:Hold Person:Misty Step',
          '9:Haste:Protection From Energy',
          '13:Banishment:Dimension Door',
          '17:Hold Monster:Scrying'
        ]
      };

      for(var feature in {
        'Aura Of Warding':'', 'Elder Champion':'', "Nature's Wrath":'',
        'Turn The Faithless':'', 'Undying Sentinel':''
      }) {
        rules.defineRule('paladinFeatures.' + feature,
          'paladinFeatures.Oath Of The Ancients', '?', null
        );
      }
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

    } else if(name == 'Ranger') {

      features = [
        // Beast Master Archetype
        "3:Ranger's Companion:feature:Companion beast obeys commands",
        '7:Exceptional Training:feature:' +
          'Companion can Dash, Disengage, Help instead of attack',
        '11:Bestial Fury:feature:Companion 2 attacks/rd',
        "15:Share Spells:feature:R30' Self spell affects companion"
      ];
      hitDie = 10;
      selectableFeatures = ['3:Beast Master Archetype::'];

      for(var feature in {
        'Bestial Fury':'', "Ranger's Companion":'', 'Exceptional Training':'',
        'Share Spells':''
      }) {
        rules.defineRule('rangerFeatures.' + feature,
          'rangerFeatures.Beast Master Archetype', '?', null
        );
      }

    } else if(name == 'Rogue') {

      features = [
        // Assassin Archetype
        "3:Assassin Proficiencies:skill:Prof Disguise Kit/Poisoner's Kit",
        '3:Assassinate:combat:Adv when foe has not acted, crit on surprise hit',
        '9:Infiltration Expertise:feature:Forge and adopt different identity',
        '13:Imposter:feature:Unerring mimicry',
        '17:Death Strike:combat:Dbl damage on surprise hit (DC %V Con neg)',
        // Arcane Trickster Archetype
        '3:Spellcasting::',
        '3:Mage Hand Legerdemain:magic:' +
          'Plant, retrieve, pick, disarm via invisible <i>Mage Hand</i>',
        '9:Magical Ambush:magic:Foe Disadv spell save when self hidden',
        '13:Versatile Trickster:magic:' +
          'Distract foe (self Adv attacks) via <i>Mage Hand</i>',
        '17:Spell Thief:magic:' +
          'Foe spell negated, self cast w/in 8 hours (DC %V neg) 1/long rest'
      ];
      hitDie = 8;
      selectableFeatures = [
        '3:Arcane Trickster Archetype::',
        '3:Assassin Archetype::'
      ];
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
      rules.defineRule('proficiencyCount.Tool',
        'skillNotes.assassinProficienciesFeature', '+=', '2'
      );
      rules.defineRule('toolProficiencies.Disguise Kit',
        'skillNotes.assassinProficienciesFeature', '=', '1'
      );
      rules.defineRule("toolProficiencies.Poisoner's Kit",
        'skillNotes.assassinProficienciesFeature', '=', '1'
      );

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

    } else if(name == 'Sorcerer') {

      features = [
        // Wild Magic
        '1:Wild Magic Surge:magic:5% chance of random magic effect',
        '1:Tides Of Chaos:feature:Adv on attack, ability, or save 1/long rest (may cause surge)',
        '6:Bend Luck:magic:' +
          'Spend 2 Sorcery Points to add or subtract 1d4 from target roll',
        '14:Controlled Chaos:magic:Reroll wild magic surge effect',
        '18:Spell Bombardment:magic:Add another die to max die 1/turn'
      ];
      hitDie = 6;
      selectableFeatures = ['1:Wild Magic::'];

      for(var feature in {
        'Bend Luck':'', 'Controlled Chaos':'', 'Spell Bombardment':'',
        'Tides Of Chaos':'', 'Wild Magic Surge':''
      }) {
        rules.defineRule('sorcererFeatures.' + feature,
          'sorcererFeatures.Wild Magic', '?', null
        );
      }

    } else if(name == 'Warlock') {

      features = [
        // Archfey Patron
        '1:Fey Presence:magic:' +
          "R10' All creatures charm or fright 1 turn (Wis neg) 1/short rest",
        '6:Misty Escape:magic:' +
          "After damage, teleport 60' and become invisible 1 turn 1/short rest",
        '10:Beguiling Defenses:save:Immune charm, reflect 1 min (Wis neg)',
        '14:Dark Delirium:magic:' +
          "R60' Target charm or fright 1 min, then unaware surroundings (Wis neg) 1/long rest",
        // Great Old One Patron
        "1:Awakened Mind:feature:R30' Telepathic communication",
        '6:Entropic World:combat:' +
          'Foe Disadv attack, miss gives you Adv next attack 1/short rest',
        '10:Thought Shield:save:' +
          'Immune telepathy, resist and reflect psychic damage',
        '14:Create Thrall:magic:Touch charms incapacitated humanoid'
      ];
      hitDie = 8;
      selectableFeatures = [
        '1:Archfey Patron::',
        '1:Great Old One Patron::'
      ];

      for(var feature in {
        'Beguiling Defenses':'', 'Dark Delirium':'', 'Fey Presence':'',
        'Misty Escape':''
      }) {
        rules.defineRule('warlockFeatures.' + feature,
          'warlockFeatures.Archfey Patron', '?', null
        );
      }
      for(var feature in {
        'Awakened Mind':'', 'Create Thrall':'', 'Entropic Shield':'',
        'Thought Shield':''
      }) {
        rules.defineRule('warlockFeatures.' + feature,
          'warlockFeatures.Great Old One Patron', '?', null
        );
      }

    } else if(name == 'Wizard') {

      features = [
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
      ];
      hitDie = 6;

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


    } else
      continue;

    SRD5E.defineClass(
      rules, name, hitDie, features, selectableFeatures, null,
      null, null, spellAbility, spellsKnown, spellSlots, spells);

  }

};

/* Defines the rules related to character description. */
PHB5E.descriptionRules = function(rules, deities) {
  rules.defineChoice('deities', deities);
};

/* Defines the rules related to feats. */
PHB5E.featRules = function(rules, feats) {

  for(var i = 0; i < feats.length; i++) {

    var feat = feats[i];
    var matchInfo;
    var notes = null;

    if(feat == 'Alert') {
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
      rules.defineRule('armorProficiencies.Heavy Armor',
        'skillNotes.heavilyArmoredFeature', '=', '1'
      );
      rules.defineRule('validationNotes.heavilyArmoredFeature',
        'feats.Heavily Armored', '=', '-1',
        'armorProficiencies.Medium Armor', '+', null
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
        'armorProficiencies.Heavy Armor', '+', null
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
        'combatNotes.tavernBrawlerFeature:Prof improvised, bonus to grapple'
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
    } else if(feat == 'Weapon Master') {
      notes = [
        'abilityNotes.weaponMasterFeature:+1 Dexterity or Strength',
        'skillNotes.weaponMasterFeature:Prof 4 weapons'
      ];
      rules.defineRule
        ('abilityBoostCount', 'abilityNotes.weaponMasterFeature', '+=', '1');
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
PHB5E.magicRules = function(rules, classes) {

  var schools = rules.getChoices('schools');

  for(var i = 0; i < classes.length; i++) {
    var klass = classes[i];
    var spells;
    if(klass == 'Bard') {
      spells = [
        'B0:Blade Ward:Friends',
        'B1:Dissonant Whispers',
        'B2:Cloud Of Daggers:Crown Of Madness:Phantasmal Force',
        'B3:Feign Death',
        'B7:Arcane Sword',
        'B9:Power Word Heal'
      ];
    } else if(klass == 'Cleric') {
      spells = [
        'C3:Feign Death'
      ];
    } else if(klass == 'Druid') {
      spells = [
        'D0:Thorn Whip',
        'D2:Beast Sense',
        'D3:Feign Death',
        'D4:Grasping Vine',
        'D8:Tsunami'
      ];
    } else if(klass == 'Paladin') {
      spells = [
        'P1:Compelled Duel:Searing Smite:Thunderous Smite:Wrathful Smite',
        "P3:Aura Of Vitality:Blinding Smite:Crusader's Mantle:Elemental Weapon",
        'P4:Aura Of Life:Aura Of Purity:Staggering Smite',
        'P5:Banishing Smite:Circle Of Power:Destructive Wave'
      ];
    } else if(klass == 'Ranger') {
      spells = [
        'R1:Ensnaring Strike:Hail Of Thorns',
        'R2:Beast Sense:Cordon Of Arrows',
        'R3:Conjure Barrage:Lightning Arrow',
        'R4:Grasping Vine',
        'R5:Conjure Volley:Swift Quiver'
      ];
    } else if(klass == 'Sorcerer') {
      spells = [
        'S0:Blade Ward:Friends',
        'S1:Chromatic Orb:Ray Of Sickness:Witch Bolt',
        'S2:Cloud Of Daggers:Crown Of Madness:Phantasmal Force',
        'S6:Arcane Gate'
      ];
    } else if(klass == 'Warlock') {
      spells = [
        'K0:Blade Ward:Friends',
        'K1:Armor Of Agathys:Arms Of Hadar:Hex:Witch Bolt',
        'K2:Cloud Of Daggers:Crown Of Madness',
        'K3:Hunger Of Hadar',
        'K6:Arcane Gate',
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
        'K5:Dominate Person:Telekinesis'
      ];
    } else if(klass == 'Wizard') {
      spells = [
        'W0:Blade Ward:Friends',
        'W2:Cloud Of Daggers:Crown Of Madness:Phantasmal Force',
        'W1:Chromatic Orb:Ray Of Sickness:Witch Bolt',
        'W3:Feign Death',
        'W6:Arcane Gate',
        'W7:Arcane Sword',
        'W8:Telepathy'
      ];
    } else
      continue;
    if(spells != null) {
      for(var j = 0; j < spells.length; j++) {
        var pieces = spells[j].split(':');
        for(var k = 1; k < pieces.length; k++) {
          var spell = pieces[k];
          var school = PHB5E.SPELLS[spell];
          if(school == null)
            school = SRD5E.SPELLS[spell];
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

};

/* Defines the rules related to character races. */
PHB5E.raceRules = function(rules, races) {

  // PHB races are subraces; get base attributes from SRD
  SRD5E.raceRules(rules, [], races);

  for(var i = 0; i < races.length; i++) {

    var adjustment = '';
    var features = [];
    var proficiencyCount = {};
    var proficienciesGiven = {};
    var proficiencyChoices = {};
    var race = races[i];
    var raceNoSpace =
      race.substring(0,1).toLowerCase() + race.substring(1).replace(/ /g, '');

    if(race == 'Mountain Dwarf') {
      adjustment = '+2 strength';
      features = [
        '1:Armor Proficiency (Light/Medium)'
      ]
      proficiencyCount['Armor'] = 2;
      proficienciesGiven['Armor'] = ['Light Armor', 'Medium Armor'];
    } else if(race == 'Wood Elf') {
      adjustment = '+1 wisdom';
      features = [
        '1:Fleet Of Foot:ability:+5 speed',
        '1:Mask Of The Wild:skill:Hide in light natural coverage',
        '1:Weapon Proficiency (Longbow/Longsword/Shortbow/Shortsword)::'
      ];
      proficiencyCount['Weapon'] = 4;
      proficienciesGiven['Weapon'] =
        ['Longbow', 'Longsword', 'Shortbow', 'Shortsword'];
      rules.defineRule('speed', 'abilityNotes.fleetOfFootFeature', '+', '5');
    } else if(race == 'Dark Elf') {
      adjustment = '+1 charisma';
      features = [
        '1:Drow Magic:magic:<i>Dancing Lights</i> cantrip%V',
        '1:Sunlight Sensitivity:combat:Disadv attack in direct sunlight',
        '1:Sunlight Sensitivity:skill:' +
          'Disadv sight Perception in direct sunlight',
        "1:Superior Darkvision:feature:R120' See one light level better",
        '1:Weapon Proficiency (Hand Crossbow/Rapier/Shortsword)::'
      ];
      proficiencyCount['Weapon'] = 3;
      proficienciesGiven['Weapon'] =
        ['Hand Crossbow', 'Rapier', 'Shortsword'];
      rules.defineRule('casterLevels.S', 'drowMagicLevel', '^=', null);
      rules.defineRule('drowMagicLevel',
        'darkElfFeatures.Drow Magic', '?', null,
        'level', '=', null
      );
      rules.defineRule('magicNotes.drowMagicFeature', 'level', '=', 'source >= 3 ? ", cast <i>Faerie Fire</i>" + (source >= 5 ? ", <i>Darkness</i>" : "") + " 1/long rest" : ""');

    } else if(race == 'Forest Gnome') {
      adjustment = '+1 dexterity';
      features = [
        '1:Natural Illusionist:magic:<i>Minor Illusion</i> cantrip',
        '1:Speak With Small Beasts:feature:' +
          'Simple communication with small animals'
      ];
      rules.defineRule
        ('casterLevels.W', 'casterLevels.Forest Gnome', '^=', null);
      rules.defineRule('casterLevels.Forest Gnome',
        'forestGnomeFeatures.Natural Illusionist', '?', null,
        'level', '=', null
      );
      rules.defineRule
        ('spellsKnown.W0', 'magicNotes.naturalIllusionisFeature', '+=', '1');

    } else if(race == 'Stout Halfling') {
      adjustment = '+1 constitution';
      features = [
        '1:Stout Resilience:save:Adv vs. poison, resistance poison damage'
      ];

    } else
      continue;

    var abilityNote = 'abilityNotes.' + raceNoSpace + 'AbilityAdjustment';
    rules.getChoices('notes')[abilityNote] += '/' + adjustment;
    var amountAndAbility = adjustment.split(/ +/);
    rules.defineRule
      (amountAndAbility[1], abilityNote, '+', amountAndAbility[0]);
    SRD5E.defineRace(
      rules, race, null, features, null, proficiencyCount,
      proficienciesGiven, proficiencyChoices
    );

  }

};
