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

var SRD5E_VERSION = '1.8.2.0';

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
  SRD5E.rules = rules;

  rules.defineChoice('choices', SRD5E.CHOICES);
  rules.choiceEditorElements = SRD5E.choiceEditorElements();
  rules.choiceRules = SRD5E.choiceRules;
  rules.editorElements = SRD5E.initialEditorElements();
  rules.getFormats = SRD5E.getFormats;
  rules.makeValid = SRD5E.makeValid;
  rules.randomizeOneAttribute = SRD5E.randomizeOneAttribute;
  rules.defineChoice('random', SRD5E.RANDOMIZABLE_ATTRIBUTES);
  rules.ruleNotes = SRD5E.ruleNotes;

  SRD5E.createViewers(rules, SRD5E.VIEWERS);
  rules.defineChoice('extras', 'feats', 'featCount', 'selectableFeatureCount');
  rules.defineChoice('preset', 'background', 'race', 'level', 'levels');

  SRD5E.abilityRules(rules);
  SRD5E.combatRules(rules, SRD5E.ARMORS, SRD5E.SHIELDS, SRD5E.WEAPONS);
  // Spell definition is handled by each individual class and domain. Schools
  // have to be defined before this can be done.
  SRD5E.magicRules(rules, SRD5E.SCHOOLS, {});
  SRD5E.identityRules(
    rules, SRD5E.ALIGNMENTS, SRD5E.BACKGROUNDS, SRD5E.CLASSES, SRD5E.DEITIES,
    SRD5E.GENDERS, SRD5E.RACES
  );
  SRD5E.talentRules
    (rules, SRD5E.FEATS, SRD5E.FEATURES, SRD5E.LANGUAGES, SRD5E.SKILLS,
     SRD5E.TOOLS);
  SRD5E.goodiesRules(rules);

  Quilvyn.addRuleSet(rules);

}

/* List of items handled by choiceRules method. */
SRD5E5.CHOICES = [
  'Alignment', 'Armor', 'Background', 'Class', 'Deity', 'Feat', 'Feature',
  'Gender', 'Language', 'Race', 'School', 'Shield', 'Skill', 'Spell', 'Tool',
  'Weapon'
];
/*
 * List of items handled by randomizeOneAttribute method. The order handles
 * dependencies among attributes when generating random characters.
 */
SRD5E.RANDOMIZABLE_ATTRIBUTES = [
  'charisma', 'constitution', 'dexterity', 'intelligence', 'strength', 'wisdom',
  'name', 'race', 'gender', 'alignment', 'background', 'deity', 'levels',
  'features', 'feats', 'skills', 'languages', 'hitPoints', 'armor', 'shield',
  'weapons', 'spells', 'tools'
];
SRD5E.VIEWERS = ['Collected Notes', ,'Compact', 'Standard'];

SRD5E.ABILITIES = {
  'Charisma':'',
  'Constitution':'',
  'Dexterity':'',
  'Intelligence':'',
  'Strength':'',
  'Wisdom':''
};
SRD5E.ALIGNMENTS = {
  'Chaotic Evil':'',
  'Chaotic Good':'',
  'Chaotic Neutral':'',
  'Neutral Evil':'',
  'Neutral Good':'',
  'Neutral':'',
  'Lawful Evil':'',
  'Lawful Good':'',
  'Lawful Neutral':''
};
    'armor', '=', 'source == "Chain" ? 13 : "SplintPlate".indexOf(source) >= 0 ? 15 : 3',
SRD5E.ARMORS = {
  'None':'AC=0 Dex=10 Weight=0',
  'Padded':'AC=1 Bulky=Y Dex=10 Weight=1',
  'Leather':'AC=1 Dex=10 Weight=1',
  'Studded Leather':'AC=2 Dex=10 Weight=1',
  'Hide':'AC=2 Dex=2 Weight=2',
  'Chain Shirt':'AC=3 Dex=2 Weight=2',
  'Scale Mail':'AC=4 Bulky=Y Dex=2 Weight=2',
  'Breastplate':'AC=4 Dex=2 Weight=2',
  'Half Plate':'AC=5 Bulky=Y Dex=2 Weight=2',
  'Ring Mail':'AC=4 Bulky=Y Dex=0 Weight=3',
  'Chain Mail':'AC=6 Bulky=Y Dex=0 Str=13 Weight=3',
  'Splint':'AC=7 Bulky=Y Dex=0 Str=15 Weight=3',
  'Plate':'AC=8 Bulky=Y Dex=0 Str=15 Weight=3'
};
SRD5E.BACKGROUNDS = {
  'Acolyte':
    'Equipment=' +
      '"Holy Symbol","Prayer Book",Incense,Vestments,Clothing,"15 GP" ' +'
    'Features=' +
      '1:Shelter Of The Faithful ' +
    'Language=any,any ' +
    'Skill=Insight,Religion'
};
SRD5E.DEITIES = {
  'None:',
  // Celtic
  'Celtic-The Daghdha':'Alignment=CG Domain=Nature,Trickery',
  'Celtic-Arawn':'Alignment=NE Domain=Life,Death',
  'Celtic-Belenus':'Alignment=NG Domain=Light',
  'Celtic-Briantia':'Alignment=NG Domain=Life',
  'Celtic-Diancecht':'Alignment=LG Domain=Life',
  'Celtic-Dunatis':'Alignment=N Domain=Nature',
  'Celtic-Goibhniu':'Alignment=NG Domain=Knowledge,Life',
  'Celtic-Lugh':'Alignment=CN Domain=Knowledge,Life',
  'Celtic-Manannan Mac Lir':'Alignment=LN Domain=Nature,Tempest',
  'Celtic-Math Mathonwy':'Alignment=NE Domain=Knowledge',
  'Celtic-Morrigan':'Alignment=CE Domain=War',
  'Celtic-Nuada':'Alignment=N Domain=War',
  'Celtic-Oghma':'Alignment=NG Domain=Knowledge',
  'Celtic-Silvanus':'Alignment=N Domain=Nature',
  // Greek
  'Greek-Zeus':'Alignment=N Domain=Tempest',
  'Greek-Aphrodite':'Alignment=CG Domain=Light',
  'Greek-Apollo':'Alignment=CG Domain=Knowledge,Life,Light',
  'Greek-Ares':'Alignment=CE Domain=War',
  'Greek-Artemis':'Alignment=NG Domain=Life,Nature',
  'Greek-Athena':'Alignment=LG Domain=Knowledge,War',
  'Greek-Demeter':'Alignment=NG Domain=Life',
  'Greek-Dionysus':'Alignment=CN Domain=Life',
  'Greek-Hades':'Alignment=LE Domain=Death',
  'Greek-Hecate':'Alignment=CE Domain=Knowledge,Trickery',
  'Greek-Hephaestus':'Alignment=NG Domain=Knowledge',
  'Greek-Hera':'Alignment=CN Domain=Trickery',
  'Greek-Hercules':'Alignment=CG Domain=Tempest,War',
  'Greek-Hermes':'Alignment=CG Domain=Trickery',
  'Greek-Hestia':'Alignment=NG Domain=Life',
  'Greek-Nike':'Alignment=LN Domain=War',
  'Greek-Pan':'Alignment=CN Domain=Nature',
  'Greek-Poseidon':'Alignment=CN Domain=Tempest',
  'Greek-Tyche':'Alignment=N Domain=Trickery',
  // Egyptian
  'Egyptian-Re-Horakhty':'Alignment=LG Domain=Life,Light',
  'Egyptian-Anubis':'Alignment=LN Domain=Death',
  'Egyptian-Apep':'Alignment=NE Domain=Trickery',
  'Egyptian-Bast':'Alignment=CG Domain=War',
  'Egyptian-Bes':'Alignment=CN Domain=Trickery',
  'Egyptian-Hathor':'Alignment=NG Domain=Life,Light',
  'Egyptian-Imhotep':'Alignment=NG Domain=Knowledge',
  'Egyptian-Isis':'Alignment=NG Domain=Knowledge,Life',
  'Egyptian-Nephthys':'Alignment=CG Domain=Death',
  'Egyptian-Osiris':'Alignment=LG Domain=Life,Nature',
  'Egyptian-Ptah':'Alignment=LN Domain=Knowledge',
  'Egyptian-Set':'Alignment=CE Domain=Death,Tempest,Trickery',
  'Egyptian-Sobek':'Alignment=LE Domain=Nature,Tempest',
  'Egyptian-Thoth':'Alignment=N Domain=Knowledge',
  // Norse
  'Norse-Odin':'Alignment=NG Domain=Knowledge,War',
  'Norse-Aegir':'Alignment=NE Domain=Tempest',
  'Norse-Balder':'Alignment=NG Domain=Life,Light',
  'Norse-Forseti':'Alignment=N Domain=Light',
  'Norse-Frey':'Alignment=NG Domain=Life,Light',
  'Norse-Freya':'Alignment=NG Domain=Life',
  'Norse-Frigga':'Alignment=N Domain=Life,Light',
  'Norse-Heimdall':'Alignment=LG Domain=Light,War',
  'Norse-Hel':'Alignment=NE Domain=Death',
  'Norse-Hermod':'Alignment=CN Domain=Trickery',
  'Norse-Loki':'Alignment=CE Domain=Trickery',
  'Norse-Njord':'Alignment=NG Domain=Nature,Tempest',
  'Norse-Odor':'Alignment=CG Domain=Light',
  'Norse-Sif':'Alignment=CG Domain=War',
  'Norse-Skadi':'Alignment=N Domain=Nature',
  'Norse-Surtur':'Alignment=LE Domain=War',
  'Norse-Thor':'Alignment=CG Domain=Tempest,War',
  'Norse-Thrym':'Alignment=CE Domain=War',
  'Norse-Tyr':'Alignment=LN Domain=Knowledge,War',
  'Norse-Uller':'Alignment=CN Domain=Nature'
};
SRD5E.FEATS = {
  'Ability Boost':'',
  'Ability Boost2':'',
  'Ability Boost3':'',
  'Ability Boost4':'',
  'Ability Boost5':'',
  'Ability Boost6':'',
  'Ability Boost7':'',
  'Grappler'
};
SRD5E.FEATURES = {
  // Background
  'Shelter Of The Faithful':'Section=feature Note="Aid from associated temple"'
  // Class
  'Rage':'Section=ability,combat Note="Adv Str checks %V/long rest (heavy armor neg)","+%1 melee damage, resist bludgeon/pierce/slash damage for 1 min %V/long rest (heavy armor neg)"',
  'Barbarian Unarmored Defense':'Section=combat Note="+%1 AC in no armor"',
  'Danger Sense':'Section=save Note="Adv Dex checks vs. visible dangers"',
  'Reckless Attack':'Section=combat Note="Adv melee Str attacks, foes Adv all attacks"',
  'Extra Attack':'Section=combat Note="%V additional attack(s) per Attack action"',
  'Fast Movement':'Section=ability Note="+10 speed (heavy armor neg)"',
  'Feral Instinct':'Section=combat Note="Adv Init, rage and act when surprised'",
  'Brutal Critical':'Section=combat Note="+%V crit damage dice"',
  'Relentless Rage':'Section=combat Note="DC 10+ Con to keep 1 HP when brought to 0"',
  'Persistent Rage':'Section=combat Note="Rage has no time limit"',
  'Indomitable Might':'Section=ability Note="Use Str instead of roll for Str check"',
  'Primal Champion':'Section=ability Note="+4 strength/+4 constitution"',
  'Frenzy':'Section=combat Note="Bonus attack during rage, exhausted after"',
  'Mindless Rage':'Section=save Note="Immune charm, fright during rage"',
  'Intimidating Presence':'Section=feature Note="R30\' Target creature fright (DC %V Will neg)"',
  'Retaliation':'Section=combat Note="Melee attack reaction after taking damage"'
  'Bardic Inspiration':'Section=magic Note="R60\' Grant 1d%V w/in 10 min %1/long rest"',
  'Ritual Casting':'Section=magic Note="Cast known spell as ritual"',
  'Jack Of All Trades':'Section=ability Note="+%V non-proficient ability checks"',
  'Song Of Rest':'Section=magic Note="Listeners regain 1d%V HP after short rest"',
  'Bard Expertise':'Section=skill Note="Dbl Prof %V skills"',
  'Font Of Inspiration':'Section=feature Note="Refresh Bardic Inspiration after short rest"',
  "Countercharm':'Section=magic Note="R30\' Friendly listeners Adv vs. charm, fright"',
  'Magical Secrets':'Section=magic Note="Learn %V additional spells from any class"',
  'Superior Inspiration':'Section=combat Note="Min 1 Bardic Inspiration after Init"',
  'Bonus Skills':'Section=skill Note="Prof 3 additional skills"',
  'Cutting Words':'Section=combat Note="R60\' Reaction to subtract Bardic Inspiration die from foe roll"',
  'Additional Magical Secrets':'Section=magic Note="Learn 2 additional spells from any class"',
  'Peerless Skill':'Section=ability Note="Add Bardic Inspiration die to ability check"',
  'Channel Divinity':'Section=feature Note="Effect %V/short rest"',
  'Turn Undead':'Section=combat Note="R30\' Undead flee for 1 min (%V DC Wis neg)"',
  'Destroy Undead':'Section=combat Note="Turn destroys up to CR %V"',
  'Divine Intervention':'Section=magic Note="%V% chance of deity help 1/wk"',
  'Disciple Of Life':'Section=magic Note="Healing spells restore additional 2 + spell level HP"',
  'Preserve Life':'Section=magic Note="R30\' Channel Divinity to restore %V HP among targets, up to half max HP ea"',
  'Blessed Healer':'Section=magic Note="Self regain 2 + spell level HP from casting healing spells"',
  'Divine Strike':'Section=combat Note="+%Vd8 HP 1/turn"',
  'Supreme Healing':'Section=magic Note="Healing spells yield max HP"'
  'Wild Shape:magic:Transform into CR %1%2 creature for %3 hr 2/short rest',
  'Druid Timeless Body':'Section=feature Note="Age at 1/10 rate"',
  'Beast Spells':'Section=magic Note="Cast spells during Wild Shape"',
  'Archdruid':'Section=magic Note="Unlimited Wild Shape"',
  'Bonus Cantrip':'Section=magic Note="Additional Druid cantrip"',
  'Natural Recovery':'Section=magic Note="Recover %V spell slot levels in short rest"',
  "Land's Stride":'Section=ability Note="Move normally through difficult terrain"',
  "Land's Stride":'Section=save Note="Adv vs. impeding plants"',
  "Nature's Ward":'Section=save Note="Immune disease, poison, elemental and fey charm and fright"',
  "Nature's Sanctuary":'Section=combat Note="Beast, plant DC %V Will save to attack self"',
  'Second Wind':'Section=combat Note="Regain 1d10+%V HP 1/short rest"',
  'Action Surge':'Section=combat Note="Extra action %V/short rest"',
  'Extra Attack':'Section=combat Note="%V additional attack(s) per Attack action"',
  'Indomitable':'Section=save Note="Re-roll failed save %V/long rest"',
  'Improved Critical':'Section=combat Note="Crit on natural 19"',
  'Remarkable Athlete':'Section=ability Note="+%V non-proficient Str, Dex, Con checks"',
  'Remarkable Athlete':'Section=skill Note="+%V\' running jump"",
  'Additional Fighting Style':'Section=combat Note="Select second Fighting Style"',
  'Superior Critical':'Section=combat Note="Crit on natural 18"',
  'Survivor':'Section=combat Note="Regain %V HP each turn when between 1 and %1"'
  'Martial Arts':'Section=combat Note="When unarmored, +%1 monk weapons attack and damage, raise damage die to 1d%V"',
  'Monk Bonus Attack':'Section=combat Note="Unarmed strike after monk weapon attack"',
  'Monk Unarmored Defense':'Section=combat Note="+%1 AC in no armor"',
  'Flurry Of Blows':'Section=combat Note="Spend 1 Ki for 2 additional unarmed strikes"',
  'Ki':'Section=feature Note="%V Ki points/short rest"',
  'Patient Defense':'Section=combat Note="Spend 1 Ki to Dodge (foe attack Disadv)"',
  'Step Of The Wind':'Section=combat Note="Spend 1 Ki to Disengage or Dash, dbl jump"',
  'Unarmored Movement':'Section=ability Note="+%V speed in no armor"',
  'Deflect Missiles':'Section=combat Note="React to reduce missile damage by 1d10+%V"',
  'Slow Fall':'Section=ability Note="-%V HP fall damage"',
  'Extra Attack':'Section=combat Note="%V additional attack(s) per Attack action"',
  'Stunning Strike':'Section=combat Note="Spend 1 Ki to stun foe (DC %V Con neg)"',
  'Ki-Empowered Strikes':'Section=combat Note="Unarmed attacks count as magical"',
  'Evasion':'Section=save Note="Dex save yields no damage instead of half"',
  'Stillness Of Mind':'Section=save Note="End self charm, fright at will"',
  'Improved Unarmored Movement':'Section=ability Note="Move across vertical surfaces and liquids"',
  'Purity Of Body':'Section=save Note="Immune disease, poison"',
  'Tongue Of Sun And Moon':'Section=feature Note="Communicate in any language"',
  'Diamond Soul':'Section=save Note="Prof all saves, spend 1 Ki to re-roll"',
  'Monk Timeless Body':'Section=feature Note="No debility from aging, need no food or water"',
  'Empty Body':'Section=magic Note="Spend 4 Ki for <i>Invisibility</i> 1 min, 8 Ki for <i>Astral Projection</i>"',
  'Perfect Self':'Section=combat Note="Min 4 Ki after Init"',
  'Open Hand Technique':'Section=combat Note="On Flurry of Blows hit, choice of knock prone (DC %V Dex neg), push 15\' (DC %V Str neg), or no foe react 1 turn"',
  'Wholeness Of Body':'Section=feature Note="Regain %V HP 1/long rest"',
  'Tranquility':'Section=magic Note="Self <i>Sanctuary</i> until next long rest (DC %V Wis neg)"',
  'Quivering Palm:combat Note="Spend 3 Ki to reduce foe to 0 HP w/in 1 dy after unarmed hit (DC %V Con 10d10 HP)"',
  'Divine Sense':'Section=magic Note="R60\' Know location of celestials, fiends, undead %V/long rest"',
  'Lay On Hands':'Section=magic Note="Heal %V HP, disease, poison 1/long rest"',
  'Divine Smite':'Section=combat Note="Spend spell slot for +(spell level + 1)d8 damage"',
  'Channel Divinity':'Section=feature Note="Effect %V/short rest"',
  'Divine Health':'Section=save Note="Immune disease"',
  'Extra Attack':'Section=combat Note="%V additional attack(s) per Attack action"',
  'Aura Of Protection':'Section=save Note="R%V\' +%1 saves self and allies"',
  'Aura Of Courage':'Section=save Note="R%V\' Self and allies immune fright"',
  'Improved Divine Smite':'Section=combat Note="+1d8 melee damage"',
  'Cleansing Touch':'Section=magic Note="Touch dispels %V/long rest"',
  'Sacred Weapon':'Section=combat Note="Channel Divinity for weapon +%V attack, 20\' light for 1 min"',
  'Turn The Unholy':'Section=magic Note="R30\' Channel Divinity for fiends, undead flee for 1 min (Wis neg)"',
  'Aura Of Devotion':'Section=save Note="R%V\' Self and allies immune charm"',
  'Purity Of Spirit':'Section=magic Note="Self continuous <i>Protection From Evil And Good</i>"',
  'Holy Nimbus':'Section=magic Note="Self 30\' bright light does 10 HP to foes 1/long rest"',
  'Holy Nimbus''Section=save Note="Adv vs. spells by fiends, undead"',
  'Favored Enemy''Section=skill Note="Adv Survival to track, info about %V creature types, learn enemy language"',
  'Natural Explorer''Section=skill Note="Dbl Int/Wis Prof, normal move in difficult terrain, always alert, full speed solo stealth, locate dbl food, extra track info for %V terrains"',
  'Primeval Awareness''Section=magic Note="Expend spell to sense creatures in 1 mi (favored terrain 6 mi)"',
  "Land's Stride''Section=ability Note="Move normally through difficult terrain"',
  "Land's Stride''Section=save Note="Adv vs. impeding plants"',
  'Hide In Plain Sight''Section=skill Note="+10 Dex (Stealth) to hide w/prepared camouflage"',
  'Vanish''Section=skill Note="Hide as bonus action, untrackable non-magically"',
  'Feral Senses''Section=combat,skill Note="No Disadv vs. invisible foe","30\' awareness of invisible creatures"',
  'Foe Slayer''Section=combat Note="+%V attack or damage vs. favored enemy"',
  'Archery Style''Section=combat Note="+2 ranged attack"',
  'Defense Style''Section=combat Note="+1 AC in armor"',
  'Dueling Style''Section=combat Note="+2 damage with single, one-hand weapon"',
  'Two-Weapon Fighting Style''Section=combat Note="Add ability modifier to second attack damage"',
  'Horde Breaker''Section=combat Note="Second attack on different adjacent foe"',
  'Escape The Horde''Section=combat Note="Foe Disadv on OA"',
  'Multiattack Defense''Section=combat Note="+4 AC on additional foe attacks after hit"',
  'Steel Will''Section=save Note="Adv vs. fright"',
  'Volley''Section=combat Note="Ranged attack any number of foes in 10\' radius"',
  'Whirlwind Attack''Section=combat Note="Melee attack any number of adjacent foes"',
  'Evasion''Section=save Note="Dex save yields no damage instead of half"',
  'Stand Against The Tide''Section=combat Note="Redirect foe miss to another creature"',
  'Uncanny Dodge''Section=combat Note="Use reaction for half damage"',
  "Rogue Expertise''Section=skill Note="Dbl Prof %V skills or thieves' tools",
  'Sneak Attack''Section=combat Note="+%Vd6 damage on Adv/shared threat attacks"',
  "Thief's Cant''Section=skill Note="Signs and symbols known only by rogues",
  'Cunning Action''Section=combat Note="Bonus Dash, Disengage, or Hide each turn"',
  'Uncanny Dodge''Section=combat Note="Use reaction for half damage"',
  'Evasion''Section=save Note="Dex save yields no damage instead of half"',
  'Reliable Talent''Section=ability Note="Min 10 on Prof ability rolls"',
  'Blindsense''Section=skill Note="R10\' Hear hidden/invisible creatures",
  'Slippery Mind''Section=save Note="Prof Wis"',
  'Elusive''Section=combat Note="Foe attacks never have Adv"',
  'Stroke Of Luck''Section=ability,combat Note="Automatic 20 ability check 1/short rest","Turn miss into hit 1/short rest"',
  'Fast Hands''Section=combat Note="Use Cunning Action for Sleight Of Hand, disarm trap, open lock, Use An Object"',
  'Second-Story Work''Section=ability,skill Note="Full speed climb","+%V\' Jump"',
  'Supreme Sneak''Section=skill Note="Adv Stealth at half speed"',
  'Use Magic Device''Section=skill Note="Ignore restrictions on magic device use"',
  "Thief's Reflexes''Section=combat Note="First round extra turn at -10 Init"',
  'Font Of Magic';'Section=magic Note="%V Sorcery Points/long rest"',
  'Flexible Casting';'Section=magic Note="Convert Sorcery Points to/from spell slots"',
  'Sorcerous Restoration';'Section=magic Note="Regain 4 Sorcery Points/short rest"',
  'Draconic Resilience';'Section=combat Note="+%V HP, unarmored AC %1"',
  'Elemental Affinity';'Section=magic Note="+%V HP damage with ancestry type, spend 1 Sorcery Point for 1 hr resistance"',
  'Dragon Wings';'Section=ability Note="Fly at full speed"',
  'Draconic Presence';'Section=magic Note="R60\' Spend 5 Sorcery Points for awe/fear aura for 1 min/conc (Wis neg)"',
  'Careful Spell';'Section=magic Note="Spend 1 Sorcery Point to protect %V creature(s) from your spell"',
  'Distant Spell';'Section=magic Note="Spend 1 Sorcery Point to dbl spell range or touch at 30'",
  'Empowered Spell';'Section=magic Note="Spend 1 Sorcery Point to re-roll %V spell damage dice"',
  'Extended Spell';'Section=magic Note="Spend 1 sorcery point to dbl spell duration"',
  'Heightened Spell';'Section=magic Note="Spend 3 Sorcery Points for target Disadv on spell save"',
  'Quickened Spell';'Section=magic Note="Spend 2 Sorcery Points to cast spell as bonus action"',
  'Subtle Spell';'Section=magic Note="Spend 1 Sorcery Point to cast w/out somatic, verbal components"',
  'Twinned Spell';'Section=magic Note="Spend spell level Sorcery Points to add second target"',
  'Eldritch Invocations';'Section=magic Note="%V"',
  'Mystic Arcanum';'Section=magic Note="%V spells 1/long rest"',
  'Eldritch Master';'Section=magic Note="Regain spells from patron 1/long rest"',
  "Dark One's Blessing";'Section=combat Note="Gain %1 HP when foe drops to 0",
  "Dark One's Own Luck";'Section=feature Note="Add d10 to ability or save 1/short rest"',
  'Fiendish Resilience';'Section=save Note="Resist chosen damage type"',
  'Hurl Through Hell';'Section=combat Note="Foe trip to hell 10d10 psychic HP 1/long rest"',
  'Pact Of The Blade';'Section=magic Note="Create magic weapon"',
  'Pact Of The Chain';'Section=magic Note="<i>Find Familiar</i>"',
  'Pact Of The Tome';'Section=magic Note="<i>Book Of Shadows</i> w/3 cantrips"',
  'Agonizing Blast';'Section=magic Note="<i>Eldritch Blast</i> +%V HP"',
  'Armor Of Shadows';'Section=magic Note="<i>Mage Armor</i> at will"',
  'Ascendant Step';'Section=magic Note="<i>Levitate</i> at will"',
  'Beast Speech';'Section=magic Note="<i>Speak With Animals</i> at will"',
  'Beguiling Influence';'Section=skill Note="Prof Deception, Persuasion"',
  'Bewitching Whispers';'Section=magic Note="<i>Compulsion</i> 1/long rest"',
  'Book Of Ancient Secrets';'Section=magic Note="Inscribe rituals in Book Of Shadows"',
  'Chains Of Carceri';'Section=magic Note="<i>Hold Monster</i> on celestial, elemental, fiend 1/long rest"',
  "Devil's Sight";'Section=feature Note="R120\' See 1 light level better"',
  'Dreadful Word';'Section=magic Note="<i>Confusion</i> 1/long rest"',
  'Eldritch Sight';'Section=magic Note="<i>Detect Magic</i> at will"',
  'Eldritch Spear';'Section=magic Note="R300\' <i>Eldritch Blast</i>"',
  'Eyes Of The Rune Keeper';'Section=feature Note="Read all writing"',
  'Fiendish Vigor';'Section=magic Note="Self <i>False Life</i> at will"',
  'Gaze Of Two Minds';'Section=magic Note="Perceive via willing touched senses for 1 turn"',
  'Lifedrinker';'Section=combat Note="+%V HP w/pact weapon"',
  'Mask Of Many Faces';'Section=magic Note="<i>Disguise Self</i> at will"',
  'Master Of Myriad Forms';'Section=magic Note="<i>Alter Self</i> at will"',
  'Minions Of Chaos';'Section=magic Note="<i>Conjure Elemental</i> 1/long rest"',
  'Misty Visions';'Section=magic Note="<i>Silent Image</i> at will"',
  'Mire The Mind';'Section=magic Note="<i>Slow</i> 1/long rest"',
  'One With Shadows';'Section=magic Note="Invisible in dim light until action"',
  'Otherworldly Leap';'Section=magic Note="Self <i>Jump</i> at will"',
  'Repelling Blast';'Section=magic Note="<i>Eldritch Blast</i> pushes 10\'"',
  'Sculptor Of Flesh';'Section=magic Note="<i>Polymorph</i> 1/long rest"',
  'Sign Of Ill Omen';'Section=magic Note="<i>Bestow Curse</i> 1/long rest"',
  'Thief Of Five Fates';'Section=magic Note="<i>Bane</i> 1/long rest"',
  'Thirsting Blade';'Section=combat Note="Attack twice each turn w/pact blade"',
  'Visions Of Distant Realms';'Section=magic Note="<i>Arcane Eye</i> at will"',
  'Voice Of The Chain Master';'Section=feature Note="Perceive, speak via familiar"',
  'Whispers Of The Grave';'Section=magic Note="<i>Speak With Dead</i> at will"',
  'Witch Sight';'Section=feature Note="R30\' See true forms"',
  'Arcane Recovery';'Section=magic Note="Short rest recovers %V spell slots 1/dy"',
  'Spell Mastery';'Section=magic Note="Cast 1 ea W1, W2 at will"',
  'Signature Spell';'Section=magic Note="Cast 2 W3 1/short rest"',
  'Evocation Savant';'Section=magic Note="Write evocation spells for half cost"',
  'Sculpt Spells';'Section=magic Note="Protect spell level + 1 targets from evocation spell effects"',
  'Potent Cantrip';'Section=magic Note="Target takes half damage on cantrip save"',
  'Empowered Evocation';'Section=magic Note="+%V HP evocation spell damage"',
  'Overchannel';'Section=magic Note="Max damage from evocation spell le level 5, self take damage 2nd+ time/long rest"',
  // TODO
};
SRD5E.GENDERS = {
  'Female':'',
  'Male':''
};
SRD5E.LANGUAGES = {
  'Abyssal':'',
  'Celestial':'',
  'Common':'',
  'Deep Speech':'',
  'Draconic':'',
  'Dwarvish',
  'Elvish':'',
  'Giant':'',
  'Gnomish':'',
  'Goblin':'',
  'Halfling':'',
  'Infernal':'',
  'Orc':'',
  'Primordial':'',
  'Sylvan':'',
  'Undercommon':''
};
SRD5E.RACES = [
  'Black Dragonborn':
    '',
  'Blue Dragonborn':
    '',
  'Brass Dragonborn':
    '',
  'Bronze Dragonborn':
    '',
  'Copper Dragonborn':
    '',
  'Gold Dragonborn':
    '',
  'Green Dragonborn':
    '',
  'Red Dragonborn':
    '',
  'Silver Dragonborn':
    '',
  'White Dragonborn':
    '',
  'Hill Dwarf':
    '',
  'High Elf':
    '',
  'Rock Gnome':
    '',
  'Half-Elf':
    '',
  'Half-Orc':
    '',
  'Lightfoot Halfling':
    '',
  'Human':
    '',
  'Tiefling':
    ''
];
SRD5E.SCHOOLS = {
  'Abjuration':'',
  'Conjuration':'',
  'Divination':'',
  'Enchantment':'',
  'Evocation':'',
  'Illusion':'',
  'Necromancy':'',
  'Transmutation':''
};
SRD5E.SHIELDS = {
  'None':'AC=0',
  'Buckler':'AC=2',
  'Heavy Steel':'AC=2',
  'Heavy Wooden':'AC=2',
  'Light Steel':'AC=2',
  'Light Wooden':'AC=2'
};
SRD5E.SKILLS = {
  'Acrobatics':'Ability=dexterity',
  'Animal Handling':'Ability=wisdom',
  'Arcana':'Ability=intelligence',
  'Athletics':'Ability=strength',
  'Deception':'Ability=charisma',
  'History':'Ability=intelligence',
  'Insight':'Ability=wisdom',
  'Intimidation':'Ability=charisma',
  'Investigation':'Ability=intelligence',
  'Medicine':'Ability=wisdom',
  'Nature':'Ability=intelligence',
  'Perception':'Ability=wisdom',
  'Performance':'Ability=charisma',
  'Persuasion':'Ability=charisma',
  'Religion':'Ability=intelligence',
  'Sleight Of Hand':'Ability=dexterity',
  'Stealth':'Ability=dexterity',
  'Survival':'Ability=wisdom'
};
SRD5E.SPELLS = {

  'Acid Arrow':
    'School=Evocation ' +
    'Description="R90\' Ranged spell attack 4d4 HP (miss half), 2d4 HP next turn",
  'Acid Splash':
    'School=Conjuration ' +
    'Description="R60\' Ranged touch ${Math.floor((lvl+1)/6) + 1}d6 HP acid (Dex neg)",
  'Aid':
    'School=Abjuration ' +
    'Description="R30\' Three targets +5 or more HP for 8 hr",
  'Alarm':
    'School=Abjuration ' +
    'Description="R30\' Alert when tiny or larger creature enters 20\' cu for 8 hr",
  'Alter Self':
    'School=Transmutation ' +
    'Description="Self aquatic, look different, or nat weapons for conc/1 hr",
  'Animal Friendship':
    'School=Enchantment ' +
    'Description="R30\' Target beast(s) convinced of good intent for 1 dy (Wis neg)",
  'Animal Messenger':
    'School=Enchantment ' +
    'Description="R30\' Tiny beast target move 24+ hr to deliver 25-word message to person described",
  'Animal Shapes':
    'School=Transmutation ' +
    'Description="R30\' Polymorph all targets in range into max CR 4 max lg creature",
  'Animate Dead':
    'School=Necromancy ' +
    'Description="R10\' Animate med/small bones/corpse, command w/in 60\' for 1 dy",
  'Animate Objects':
    'School=Transmutation ' +
    'Description="R120\' Animate 10 sm/5 md/2 lg/1 hg objects, command w/in 500\' for conc/1 min",
  'Antilife Shell':
    'School=Abjuration ' +
    'Description="Self 10\' sphere prevents living passage for conc/1 hr",
  'Antimagic Field':
    'School=Abjuration ' +
    'Description="Self 10\' sphere suppresses magic for conc/1 hr",
  'Antipathy/Sympathy':
    'School=Enchantment ' +
    'Description="R60\' Target object repels/attracts specified creatures for 10 dy",
  'Arcane Eye':
    'School=Divination ' +
    'Description="R30\' See through invisible eye for conc/1 hr",
  'Arcane Hand':
    'School=Evocation ' +
    'Description="R120\' AC20, Str 26, Dex 10 hand can punch, push, grasp, block for conc/1 min",
  'Arcane Lock':
    'School=Abjuration ' +
    'Description="Touched barrier passable only by designated until dispelled",
  'Arcane Sword':
    'School=Evocation ' +
    'Description="Force weapon 3d10, move 20\' for conc/1 min",
  "Arcanist's Magic Aura":
    'School=Illusion ' +
    'Description="Target reports false divinations for 1 dy"',
  'Astral Projection':
    'School=Necromancy ' +
    'Description="Self + 8 companions w/in 10\' project to astral plane until dispelled or 0 HP",
  'Augury':
    'School=Divination ' +
    'Description="Discern whether act w/in 30 min will yield weal/woe",
  'Awaken':
    'School=Transmutation ' +
    'Description="Touched beast or plant Int 10, friendly for 30 dy",

  'Bane':
    'School=Enchantment ' +
    'Description="R30\' 3 targets -1d4 from attack/save (Cha neg) for conc/1 min",
  'Banishment':
    'School=Abjuration ' +
    'Description="R60\' target banish to home/demiplane (Cha neg) for conc/1 min",
  'Barkskin':
    'School=Transmutation ' +
    'Description="Touched AC 16 for conc/1 hr",
  'Beacon Of Hope':
    'School=Abjuration ' +
    'Description="R30\' Targets Adv Wis/death saves, max heal for conc/1 min",
  'Bestow Curse':
    'School=Necromancy ' +
    'Description="Touched one of Disadv specified ability rolls, Disadv self attacks, Wis save to take action, take +1d8 HP necrotic from self attacks (Wis neg) for conc/1 min",
  'Black Tentacles':
    'School=Conjuration ' +
    'Description="R90\' All in 20\' sq 3d6 HP and restrained for conc/1 min (Dex neg)",
  'Blade Barrier':
    'School=Evocation ' +
    'Description="R90\' 100\'x20\'x5\' blade wall passers 6d10 HP slashing (Dex neg) for conc/10 min",
  'Bless':
    'School=Enchantment ' +
    'Description="R30\' 3 targets +1d4 to attack/save rolls for conc/1 min",
  'Blight':
    'School=Necromancy ' +
    'Description="R30\' target 8d8 HP necrotic (Con half)",
  'Blindness/Deafness':
    'School=Necromancy ' +
    'Description="R30\' target blind or deaf (Con neg) for 1 min",
  'Blink':
    'School=Transmutation ' +
    'Description="Self 50% chance of ethereal for 1 min",
  'Blur':
    'School=Illusion ' +
    'Description="Self foes Disadv attack for conc/1 min",
  'Branding Smite':
    'School=Evocation ' +
    'Description="Self next attack +2d6 HP radiant and visible for conc/1 min",
  'Burning Hands':
    'School=Evocation ' +
    'Description="15\' cone 3d6 HP fire (Dex half)",

  'Call Lightning':
    'School=Evocation ' +
    'Description="R120\' Conjured storm cloud generates bolt for 3d10 HP (Dex half) in 5\' radius each rd for conc/10 min",
  'Calm Emotions':
    'School=Enchantment ' +
    'Description="R60\' 10\' radius suppresses charm/fright or hostility (Cha neg) for conc/1 min",
  'Chain Lightning':
    'School=Evocation ' +
    'Description="R150\' 4 targets in 30\' radius 10d8 HP lightning (Dex half)",
  'Charm Person':
    'School=Enchantment ' +
    'Description="R30\' Target regards you as friend (Wis neg) for 1 hr/until harmed",
  'Chill Touch':
    'School=Necromancy ' +
    'Description="R120\' Ghost hand ${Math.floor((lvl + 1) / 6) + 1} HP necrotic, undead also Disadv self attack for 1 rd",
  'Circle Of Death':
    'School=Necromancy ' +
    'Description="R150\' 60\' radius 8d6 HP necrotic (Con half)",
  'Clairvoyance':
    'School=Divination ' +
    'Description="R1 mi Invisible sensor allows sight or hearing for conc/10 min",
  'Clone':
    'School=Necromancy ' +
    'Description="Grow backup body for touched target",
  'Cloudkill':
    'School=Conjuration ' +
    'Description="R120\' 20\' radius 5d8 HP poison (Con half), moves 10\'/rd for conc/10 min",
  'Color Spray':
    'School=Illusion ' +
    'Description="Self 15\' cone 6d10 HP targets blinded for 1 rd",
  'Command':
    'School=Enchantment ' +
    'Description="R60\' Target obeys one-word command (Wis neg)",
  'Commune':
    'School=Divination ' +
    'Description="Self receive 3 yes/no answers w/in 1 min",
  'Commune With Nature':
    'School=Divination ' +
    'Description="Self gain 3 facts about territory w/in 3 miles",
  'Comprehend Languages':
    'School=Divination ' +
    'Description="Self understand all language for 1 hr",
  'Compulsion':
    'School=Enchantment ' +
    'Description="R30\' Self control target movement (Wis neg) for conc/1 min",
  'Cone Of Cold':
    'School=Evocation ' +
    'Description="Self 60\' cone 8d8 HP cold (Con half)",
  'Confusion':
    'School=Enchantment ' +
    'Description="R90\' Targets in 10\' radius act randomly (Wis neg) for conc/1 min",
  'Conjure Animals':
    'School=Conjuration ' +
    'Description="R60\' Summon obedient fey creatures for conc/1 hr",
  'Conjure Celestial':
    'School=Conjuration ' +
    'Description="R90\' Summon obedient celestial for conc/1 hr",
  'Conjure Elemental':
    'School=Conjuration ' +
     'Description="R90\' Summon obedient elemental in appropriate environment for conc/1 hr",
  'Conjure Fey':
    'School=Conjuration ' +
    'Description="R90\' Summon obedient fey for conc/1 hr",
  'Conjure Minor Elementals':
    'School=Conjuration ' +
    'Description="R90\' Summon obedient elements for conc/1 hr",
  'Conjure Woodland Beings':
    'School=Conjuration ' +
    'Description="R60\' Summon obedient fey for conc/1 hr",
  'Contact Other Plane':
    'School=Divination ' +
    'Description="Contact extraplanar being for five one-word answers (DC 15 Int or take 6d6 HP psychic)",
  'Contagion':
    'School=Necromancy ' +
    'Description="Touched poisoned, then diseased after failing 3 Con saves (3 successes neg)",
  'Contingency':
    'School=Evocation ' +
    'Description="Cast spell becomes active on trigger w/in 10 dy",
  'Continual Flame':
    'School=Evocation ' +
    'Description="Touched emits heatless flame until dispelled",
  'Control Water':
    'School=Transmutation ' +
    'Description="R300\' Part, redirect, raise, or whirl 100\'x100\' water for conc/10 min",
  'Control Weather':
    'School=Transmutation ' +
    'Description="Determine weather in 5 mi radius for conc/8 hr",
  'Counterspell':
    'School=Abjuration ' +
    'Description="R60\' Neg spell le level 3, DC 10+spell level for higher",
  'Create Food And Water':
    'School=Conjuration ' +
    'Description="R30\' Create 40 lb food and 30 gal water",
  'Create Or Destroy Water':
    'School=Transmutation ' +
    'Description="R30\' Affect 10 gal water",
  'Create Undead':
    'School=Necromancy ' +
    'Description="R10\' Create 3 ghouls, obedient for 1 dy, renewable",
  'Creation':
    'School=Illusion ' +
    'Description="R30\' Create 5\' cu false matter lasting up to 1 dy",
  'Cure Wounds':
    'School=Evocation ' +
    'Description="Touched heals 1d8+spell mod HP",

  'Dancing Lights':
    'School=Evocation ' +
    'Description="R120\' 4 torch lights in 20\' radius move 60\' for conc/1 min",
  'Darkness':
    'School=Evocation ' +
    'Description="R60\' Target centers 15\' radius lightless area for conc/10 min",
  'Darkvision':
    'School=Transmutation ' +
    'Description="Touched see in dark for 8 hr",
  'Daylight':
    'School=Evocation ' +
    'Description="R60\' Target centers 60\' radius bright light for 1 hr",
  'Death Ward':
    'School=Abjuration ' +
    'Description="Touched keep 1 HP when next brought to 0",
  'Delayed Blast Fireball':
    'School=Evocation ' +
    'Description="R150\' 20\' radius 12d6 HP (Dex half)",
  'Demiplane':
    'School=Conjuration ' +
    'Description="R60\' Door leads to extradimensional 30\' room for 1 hr",
  'Detect Evil And Good':
    'School=Divination ' +
    'Description="R30\' Self sense aligned outsider, consecration/desecration for conc/10 min",
  'Detect Magic':
    'School=Divination ' +
    'Description="R30\' Self sense magic aura for conc/10 min",
  'Detect Poison And Disease':
    'School=Divination ' +
    'Description="R30\' Self sense poison for conc/10 min",
  'Detect Thoughts':
    'School=Divination ' +
    'Description="R30\' Self sense target thoughts for conc/1 min",
  'Dimension Door':
    'School=Conjuration ' +
    'Description="R500\' Self + 1 other teleport",
  'Disguise Self':
    'School=Illusion ' +
    'Description="Self appear different body size for 1 hr",
  'Disintegrate':
    'School=Transmutation ' +
    'Description="R60\' Target 10d6+40 HP force (Dex neg)",
  'Dispel Evil And Good':
    'School=Abjuration ' +
    'Description="Self aligned foes Disadv attack for conc/1 min",
  'Dispel Magic':
    'School=Abjuration ' +
    'Description="R120\' End target effects le 3 level, higher DC 10+spell level",
  'Divination':
    'School=Divination ' +
    'Description="Receive truthful reply about event w/in 1 wk",
  'Divine Favor':
    'School=Evocation ' +
    'Description="Self weapon +1d4 radiant HP for conc/1 min",
  'Divine Word':
    'School=Evocation ' +
    'Description="R30\' Targets deaf, blind, stunned or killed (Cha neg)",
  'Dominate Beast':
    'School=Enchantment ' +
    'Description="R60\' Command target telepathically for conc/1 min (Wis neg)",
  'Dominate Monster':
    'School=Enchantment ' +
    'Description="R60\' Command target telepathically for conc/1 hr (Wis neg)",
  'Dominate Person':
    'School=Enchantment ' +
    'Description="R60\' Command target telepathically for conc/1 hr (Wis neg)",
  'Dream':
    'School=Illusion ' +
    'Description="Touched communicate in dream with known target",
  'Druidcraft':
    'School=Transmutation ' +
    'Description="R30\' Cause minor nature effects",

  'Earthquake':
    'School=Evocation ' +
    'Description="R500\' Shaking in 100\' radius opens fissures and damages structures",
  'Eldritch Blast':
    'School=Evocation ' +
    'Description="R120\' Ranged touch ${Math.max(Math.floor((lvl+1)/6),1)} rays do 1d10 HP ea",
  'Enhance Ability':
    'School=Transmutation ' +
    'Description="Touched Adv on chosen ability checks for 1 hr",
  'Enlarge/Reduce':
    'School=Transmutation ' +
    'Description="R30\' Target dbl/half size for conc/1 min",
  'Entangle':
    'School=Conjuration ' +
    'Description="R90\' Growth ensnare those in 20\' sq for conc/1 min (Str neg)",
  'Enthrall':
    'School=Enchantment ' +
    'Description="R60\' Target focused on caster for 1 min (Wis neg)",
  'Etherealness':
    'School=Transmutation ' +
    'Description="Self on Ethereal Plane for up to 8 hrs",
  'Expeditious Retreat':
    'School=Transmutation ' +
    'Description="Self Dash as bonus action for conc/10 min",
  'Eyebite':
    'School=Necromancy ' +
    'Description="R60\' Target sleep, panic, or sick for conc/1 min",

  'Fabricate':
    'School=Transmutation ' +
    'Description="R120\' Create product from raw materials",
  'Faerie Fire':
    'School=Evocation ' +
    'Description="R60\' Objects in 20\' cu outlined (foe Adv attack) for conc/1 min (Dex neg)",
  'Faithful Hound':
    'School=Conjuration ' +
    'Description="R30\' Invisible watchdog warns and attacks for 8 hr",
  'False Life':
    'School=Necromancy ' +
    'Description="Self 1d4+4 temporary HP for 1 hr",
  'Fear':
    'School=Illusion ' +
    'Description="Targets in 30\' cone Dash away for conc/1 min (Wis neg)",
  'Feather Fall':
    'School=Transmutation ' +
    'Description="R60\' Five falling targets slow to 60\'/rd for 1 min",
  'Feeblemind':
    'School=Enchantment ' +
    'Description="R150\' Target 4d6 HP psychic, Cha and Int drop to 1 (Int neg)",
  'Find Familiar':
    'School=Conjuration ' +
    'Description="R10\' Telepathic communication w/summoned animal",
  'Find Steed':
    'School=Conjuration ' +
    'Description="R30\' Summon loyal steed",
  'Find The Path':
    'School=Divination ' +
    'Description="Know shortest path to destination for 1 dy",
  'Find Traps':
    'School=Divination ' +
    'Description="R120\' Sense presence of traps",
  'Finger Of Death':
    'School=Necromancy ' +
    'Description="R60\' Target 7d8+30 HP (Con half), obedient zombie if killed",
  'Fire Bolt':
    'School=Evocation ' +
    'Description="R120\' Ranged spell 1d10 HP",
  'Fire Shield':
    'School=Evocation ' +
    'Description="Self resist heat or cold, foe hit takes 2d8 HP for 10 min",
  'Fire Storm':
    'School=Evocation ' +
    'Description="R150\' Objects in 10 10\' cu 7d10 HP (Dex half)",
  'Fireball':
    'School=Evocation ' +
    'Description="R150\' Creatures in 20\' radius 8d6 HP (Dex half)",
  'Flame Blade':
    'School=Evocation ' +
    'Description="Self flaming blade 3d6 HP, lights 10\' radius",
  'Flame Strike':
    'School=Evocation ' +
    'Description="R60\' Objects in 10\' radius 2x4d6 HP (Dex half)",
  'Flaming Sphere':
    'School=Conjuration ' +
    'Description="R60\' 5\' diameter sphere 2d6 HP (Dex half) move 30\' for conc/1 min",
  'Flesh To Stone':
    'School=Transmutation ' +
     'Description="R60\' Target petrified after 3 failed saves for conc/1 min (Con x3 neg)",
  'Floating Disk':
    'School=Conjuration ' +
    'Description="R30\' 3'-diameter x 1\" force disk follows, holds 500 lbs at 3' for 1 hr",
  'Fly':
    'School=Transmutation ' +
    'Description="Touched fly 60\'/rd for conc/10 min",
  'Fog Cloud':
    'School=Conjuration ' +
    'Description="R120\' 20\' radius fog obscures vision for conc/1 hr",
  'Forbiddance':
    'School=Abjuration ' +
    'Description="Touched 40K' sq bars teleport and portals, 5d10 HP on transit to chosen type for 1 dy",
  'Forcecage':
    'School=Evocation ' +
    'Description="R100\' 20\' barred cube or 10\' solid box for 1 hr",
  'Foresight':
    'School=Divination ' +
    'Description="Touched immune surprise, Adv attack, ability, save, foes Disadv attack for 8 hr",
  'Freedom Of Movement':
    'School=Abjuration ' +
    'Description="Touched immune impediments for 1 hr",
  'Freezing Sphere':
    'School=Evocation ' +
    'Description="R300\' Objects in 60\' radius 10d6 HP (Con half)",

  'Gaseous Form':
    'School=Transmutation ' +
    'Description="Touched creature gaseous for conc/1 hr",
  'Gate':
    'School=Conjuration ' +
    'Description="R60\' Open circular portal to another plane for conc/1 min",
  'Geas':
    'School=Enchantment ' +
    'Description="R60\' Target charmed into obeying command for 30 dy (Wis neg)",
  'Gentle Repose':
    'School=Necromancy ' +
    'Description="Touched corpse no decay or animation for 10 dy",
  'Giant Insect':
    'School=Transmutation ' +
    'Description="R30\' 10 centipedes, five wasps, 3 spiders, or one scorpion giant, obey commands for conc/10 min",
  'Glibness':
    'School=Transmutation ' +
    'Description="Self take 15 on Cha roll, detect truthful for 1 hr",
  'Globe Of Invulnerability':
    'School=Abjuration ' +
    'Description="Self 10\' radius immune to spells level le 5",
  'Glyph Of Warding':
    'School=Abjuration ' +
    'Description="Glyph 20\' radius 5d8 HP (Dex half) or spell levl le 3 on named trigger",
  'Goodberry':
    'School=Transmutation ' +
    'Description="10 berries heal 1 HP, provide food for 1 dy",
  'Grease':
    'School=Conjuration ' +
    'Description="R60\' creatures in 10\' sq fall (Dex neg) for 1 min",
  'Greater Invisibility':
    'School=Illusion ' +
    'Description="Touched creature invisible for conc/1 min",
  'Greater Restoration':
    'School=Abjuration ' +
    'Description="Touched creature unexhaust, uncharm, unpetrify, uncurse, or restored ability or HP",
  'Guardian Of Faith':
    'School=Conjuration ' +
    'Description="R30\' Lg spectral guardian 20 HP to hostile creatures (Dex half) for 8 hr/60 HP",
  'Guards And Wards':
    'School=Abjuration ' +
    'Description="Multiple magic effects protect 2500\' sq area for 1 dy",
  'Guidance':
    'School=Divination ' +
    'Description="Touched +1d4 ability check w/in conc/1 min",
  'Guiding Bolt':
    'School=Evocation ' +
    'Description="R120\' Ranged spell 4d6 HP, next foe attack in rd Adv",
  'Gust Of Wind':
    'School=Evocation ' +
    'Description="60\'x10\' wind pushes 15\' (Str neg), half movement for conc/1 min",

  'Hallow':
    'School=Evocation ' +
    'Description="60\' radius warded against outsiders, evokes boon spell",
  'Hallucinatory Terrain':
    'School=Illusion ' +
    'Description="R300\' 150\' cube terrain illusion (Int(Investigation) disbelieve) for 1 dy",
  'Harm':
    'School=Necromancy ' +
    'Description="R60\' Target 14d6 HP (Con half)",
  'Haste':
    'School=Transmutation ' +
    'Description="R30\' Target dbl speed, +1 AC, bonus action for conc/1 min",
  'Heal':
    'School=Evocation ' +
    'Description="R60\' Target heal 70 HP, unblind, undeaf, undisease",
  'Healing Word':
    'School=Evocation ' +
    'Description="R60\' Target 1d4+modifier HP",
  'Heat Metal':
    'School=Transmutation ' +
    'Description="R60\' Touching target metal causes 2d8 HP for conc/1 min",
  'Hellish Rebuke':
    'School=Evocation ' +
    'Description="R60\' As a reaction, attacker 2d10 HP (Dex half)",
  "Heroes' Feast":
    'School=Conjuration ' +
    'Description="R30\' 12 diners cured, immune poison and fright, Wis Adv, +2d10 HP for 1 dy"',
  'Heroism':
    'School=Enchantment ' +
    'Description="Touched immune fright, +modifier HP each rd for conc/1 min",
  'Hideous Laughter':
    'School=Enchantment ' +
    'Description="R30\' Target ROFL for conc/1 min (Wis neg)",
  'Hold Monster':
    'School=Enchantment ' +
    'Description="R90\' target frozen for conc/1 min (Wis neg)",
  'Hold Person':
    'School=Enchantment ' +
    'Description="R60\' target frozen for conc/1 min (Wis neg)",
  'Holy Aura':
    'School=Abjuration ' +
    'Description="Self 30\' radius targets Adv saves, foes Disadv attack",
  "Hunter's Mark":
    'School=Divination ' +
    'Description="R90\' Self attacks on target +1d6 HP, Adv Wis(Perception/Survival) to locate for conc/1 hr",
  'Hypnotic Pattern':
    'School=Illusion ' +
    'Description="R120\' creatures in 30\' cu charmed for conc/1 min (Wis neg)",

  'Ice Storm':
    'School=Evocation ' +
    'Description="R300\' 20\' radius 4d6 HP (Dex half)",
  'Identify':
    'School=Divination ' +
    'Description="Learn magic properties or spells affecting touched object or creature",
  'Illusory Script':
    'School=Illusion ' +
    'Description="Writing legible only to specified creatures",
  'Imprisonment':
    'School=Abjuration ' +
    'Description="R30\' Target restrained by choice of prisons (Wis neg)",
  'Incendiary Cloud':
    'School=Conjuration ' +
    'Description="R150\' 20\' radius 10d8 HP (Dex half), moves 10\'/rd for conc/1 min",
  'Inflict Wounds':
    'School=Necromancy ' +
    'Description="Touched 3d10 HP",
  'Insect Plague':
    'School=Conjuration ' +
    'Description="R300\' 20\' radius 4d10 HP (Con half) for conc/10 min",
  'Instant Summons':
    'School=Conjuration ' +
    'Description="Prepared 10 lb item appears in hand",
  'Invisibility':
    'School=Illusion ' +
    'Description="Touched creature invisible for conc/1 hr or until attacks/casts",
  'Irresistible Dance':
    'School=Enchantment ' +
    'Description="R30\' Target dance (Disadv Dex, attack, foes Adv attack) for conc/1 min (Wis neg)",

  'Jump':
    'School=Transmutation ' +
    'Description="Touched jump x3 for 1 min",

  'Knock':
    'School=Transmutation ' +
    'Description="R60\' Target unlocked, unstuck, or unbarred",

  'Legend Lore':
    'School=Divination ' +
    'Description="Know info about named person, place, or object",
  'Lesser Restoration':
    'School=Abjuration ' +
    'Description="Touched creature unblind, unparalyze, or unpoison",
  'Levitate':
    'School=Transmutation ' +
    'Description="R60\' Target floats 20\' for conc/10 min (Con neg)",
  'Light':
    'School=Evocation ' +
    'Description="Touched object lights 20\' radius for 1 hr (Dex neg)",
  'Lightning Bolt':
    'School=Evocation ' +
    'Description="100\'x5\' 8d6 HP (Dex half)",
  'Locate Animals Or Plants':
    'School=Divination ' +
    'Description="Know location of named beast or plant w/in 5 mi",
  'Locate Creature':
    'School=Divination ' +
    'Description="Know location of named creature or species w/in 1000\' for conc/1 hr",
  'Locate Object':
    'School=Divination ' +
    'Description="Know location of named object or type w/in 1000\' for conc/10 min",
  'Longstrider':
    'School=Transmutation ' +
    'Description="Touched +10\' speed for 1 hr",

  'Mage Armor':
    'School=Conjuration ' +
    'Description="Touched AC 13+DexMod in no armor for 8 hr",
  'Mage Hand':
    'School=Conjuration ' +
    'Description="R30\' Spectral hand performs minor tasks le 10 lb for 1 min",
  'Magic Circle':
    'School=Abjuration ' +
    'Description="R10\' 10\' circle impassable by specified creature type, Disadv attacks for 1 hr",
  'Magic Jar':
    'School=Necromancy ' +
    'Description="R100\' Possess creature, trap soul (Cha neg)",
  'Magic Missile':
    'School=Evocation ' +
    'Description="R120\' 3 darts 1d4+1 HP ea",
  'Magic Mouth':
    'School=Illusion ' +
    'Description="R30\' Object speaks 25-word message in response to trigger",
  'Magic Weapon':
    'School=Transmutation ' +
    'Description="Touched weapon +1 for conc/1 hr",
  'Magnificent Mansion':
    'School=Conjuration ' +
    'Description="R300\' Comfortable extradimensional dwelling for 1 dy",
  'Major Image':
    'School=Illusion ' +
    'Description="R120\' 20\' cu sight, sound, touch illusion for conc/10 min",
  'Mass Cure Wounds':
    'School=Evocation ' +
    'Description="R60\' 6 targets in 30\' radius regain 3d8+spell mod HP",
  'Mass Heal':
    'School=Evocation ' +
    'Description="R60\' Targets restore 700 HP total, unblind, undeaf, undisease",
  'Mass Healing Word':
    'School=Evocation ' +
    'Description="R60\' 6 targets regain 1d4+spell mod HP",
  'Mass Suggestion':
    'School=Enchantment ' +
    'Description="R60\' 12 targets follow suggestion (Wis neg)",
  'Maze':
    'School=Conjuration ' +
    'Description="R60\' Target sent to labyrinth (DC 20 Int escapes)",
  'Meld Into Stone':
    'School=Transmutation ' +
    'Description="Step into rock for 8 hr",
  'Mending':
    'School=Transmutation ' +
    'Description="Repair small tears",
  'Message':
    'School=Transmutation ' +
    'Description="R120 Whispered conversation w/target for 1 rd",
  'Move Earth':'',
  'Meteor Swarm':
    'School=Evocation ' +
    'Description="R1 mi 40\' radius 20d6 fire + 20d6 bludgeoning (Dex half)",
  'Mind Blank':
    'School=Abjuration ' +
    'Description="Touched immune psychic damage, reading, charm for 1 dy",
  'Minor Illusion':
    'School=Illusion ' +
    'Description="R30\' Sound of 1 creature or 5\' cu image (Investigation disbelieve) for 1 min",
  'Mirage Arcane':
    'School=Illusion ' +
    'Description="Illusionary terrain for 10 dy",
  'Mirror Image':
    'School=Illusion ' +
    'Description="3 duplicates draw attacks (AC 10+DexMod)",
  'Mislead':
    'School=Illusion ' +
    'Description="Self invisible, control illusory duplicate for conc/1 hr",
  'Misty Step':
    'School=Conjuration ' +
    'Description="Self teleport 30\'",
  'Modify Memory':
    'School=Enchantment ' +
    'Description="R30\' Change target memory of event in prior dy (Wis neg)",
  'Moonbeam':
    'School=Evocation ' +
    'Description="5\' radius 2d10 HP (Con half) for conc/1 min",
  'Move Earth':
    'School=Transmutation ' +
    'Description="R120\' Excavate 40\' cu for conc/2 hr",

  'Nondetection':
    'School=Abjuration ' +
    'Description="Touched immune divination for 8 hr",

  'Pass Without Trace':
    'School=Abjuration ' +
    'Description="Allies within 30\' self +10 Dexterity (Stealth), untrackable for conc/1 hr",
  'Passwall':
    'School=Transmutation ' +
    'Description="R30\' 5\'x8'x20\' passage through wood, plaster, or stone",
  'Phantasmal Killer':
    'School=Illusion ' +
    'Description="R120\' Target fright, 4d10 HP/rd for conc/1 min (Wis neg)",
  'Phantom Steed':
    'School=Illusion ' +
    'Description="R30\' Self ride 100\'/rd for 1 hr",
  'Planar Ally':
    'School=Conjuration ' +
    'Description="R60\' Otherworld creature appears, bargain for service",
  'Planar Binding':
    'School=Abjuration ' +
    'Description="R60; Bind celestial, elemental, fey, or fiend to service for 1 dy (Cha neg)",
  'Plane Shift':
    'School=Conjuration ' +
    'Description="Target or self + 8 willing move to different plane (Cha neg)",
  'Plant Growth':
    'School=Transmutation ' +
    'Description="R150\' Enrich half mi radius for 1 yr or overgrow 100\' radius",
  'Poison Spray':
    'School=Conjuration ' +
    'Description="R10\' Target ${Math.floor((lvl+7)/6)}d12 HP (Con neg)",
  'Polymorph':
    'School=Transmutation ' +
    'Description="R60\' Target creature transformed for conc/1 hr/0 HP (Wis neg)",
  'Power Word Kill':
    'School=Enchantment ' +
    'Description="R60\' Slay target with le 100 HP",
  'Power Word Stun':
    'School=Enchantment ' +
    'Description="R60\' Stun target with le 150 HP (Con neg)",
  'Prayer Of Healing':
    'School=Evocation ' +
    'Description="R60\' Six targets regain 2d8+spell Mod HP",
  'Prestidigitation':
    'School=Transmutation ' +
    'Description="R10\' Minor magic effects for 1 hr",
  'Prismatic Spray':
    'School=Evocation ' +
    'Description="R60\' Targets in cone 10d6 HP (Dex half), held then stone (Dex neg), or blinded then plane shifted (Dex neg)",
  'Prismatic Wall':
    'School=Abjuration ' +
    'Description="R60\' Transit causes 10d6 HP (Dex half), held then stone (Dex neg), or blinded then plane shifted (Dex neg) for 10 min",
  'Private Sanctum':
    'School=Abjuration ' +
    'Description="R120\' Protect 100\' sq from sound, vision, divination, teleport for 1 dy",
  'Produce Flame':
    'School=Conjuration ' +
    'Description="Hand flame lights 10\' radius for 10 min, throw for ${Math.floor((lvl+7)/6)}d8 HP",
  'Programmed Illusion':
    'School=Illusion ' +
    'Description="R120\' 30\' cu illusion on specified trigger",
  'Project Image':
    'School=Illusion ' +
    'Description="R500 mi Illusory double mimics self for conc/1 dy",
  'Protection From Energy':
    'School=Abjuration ' +
    'Description="Resist acid, cold, fire, lightning, or thunder for conc/1 hr",
  'Protection From Evil And Good':
    'School=Abjuration ' +
    'Description="Touched specified foe type Disadv attack, immune charm, fright, possession",
  'Protection From Poison':
    'School=Abjuration ' +
    'Description="Touched poison neutralized, Adv save vs. poison for 1 hr",
  'Purify Food And Drink':
    'School=Transmutation ' +
    'Description="R10\' 5\' radius food, drink freed of poison, disease",

  'Raise Dead':
    'School=Necromancy ' +
    'Description="Touched 10-day-old corpse restored to life",
  'Ray Of Enfeeblement':
    'School=Necromancy ' +
    'Description="R60\' Target does half Str damage until Con save",
  'Ray Of Frost':
    'School=Evocation ' +
    'Description="R60\' Target ${Math.floor((lvl+7)/6)}d8 HP, -10 speed for 1 turn",
  'Regenerate':
    'School=Transmutation ' +
    'Description="Touched regain 4d8+15 HP, 1 HP/min for 1 hr, restore severed members",
  'Reincarnate':
    'School=Transmutation ' +
    'Description="Touched resurrected in new body",
  'Remove Curse':
    'School=Abjuration ' +
    'Description="Touched freed from all curses",
  'Resilient Sphere':
    'School=Evocation ' +
    'Description="R30\' Target encased in impervious sphere for conc/1 min",
  'Resistance':
    'School=Abjuration ' +
    'Description="Touched +1d4 on save w/in conc/1 min",
  'Resurrection':
    'School=Necromancy ' +
    'Description="Touched 100-year-old corpse restored to life",
  'Reverse Gravity':
    'School=Transmutation ' +
    'Description="R50\' Items in 50\' radius fall up for conc/1 min",
  'Revivify':
    'School=Necromancy ' +
    'Description="Touched 1-minute-old corpse returned to life w/1 HP",
  'Rope Trick':
    'School=Transmutation ' +
    'Description="Rope to extradimensional space for 8 creatures for 1 hr",

  'Sacred Flame':
    'School=Evocation ' +
    'Description="R60\' Target ${Math.floor((lvl+7)/6)}d8 (Dex neg)",
  'Sanctuary':
    'School=Abjuration ' +
    'Description="R30\' Target foes attack another for 1 min (Wis neg)",
  'Scorching Ray':
    'School=Evocation ' +
    'Description="R120\' 3 ranged attacks do 2d6 HP ea",
  'Scrying':
    'School=Divination ' +
    'Description="See, hear chosen target (Wis neg) for conc/10 min",
  'Secret Chest':
    'School=Conjuration ' +
    'Description="Touched chest moves to Ethereal Plane",
  'See Invisibility':
    'School=Divination ' +
    'Description="Self see invisible and ethereal items for 1 hr",
  'Seeming':
    'School=Illusion ' +
    'Description="R30\' Targets appearance change for 8 hr (Cha neg)",
  'Sending':
    'School=Evocation ' +
    'Description="Exchange 25-word message with known target",
  'Sequester':
    'School=Transmutation ' +
    'Description="Touched hidden, suspended until trigger",
  'Shapechange':
    'School=Transmutation ' +
    'Description="Self polymorph for conc/1 hr/0 HP",
  'Shatter':
    'School=Evocation ' +
    'Description="R60\' 10\' radius 3d8 HP (Con half)",
  'Shield':
    'School=Abjuration ' +
    'Description="Reaction self +5 AC, immune <i>Magic Missile</i> for 1 rd",
  'Shield Of Faith':
    'School=Abjuration ' +
    'Description="R60\' Target +2 AC for conc/10 min",
  'Shillelagh':
    'School=Transmutation ' +
    'Description="Touched club attack with spell attack, does 1d8 HP for 1 min",
  'Shocking Grasp':
    'School=Evocation ' +
    'Description="Touched ${Math.floor((lvl+7)/6)}d8 HP",
  'Silence':
    'School=Illusion ' +
    'Description="R120\' 20\' radius blocks sound for conc/10 min",
  'Silent Image':
    'School=Illusion ' +
    'Description="R60\' 15\' cu illusion for conc/10 min (Investigation neg)",
  'Simulacrum':
    'School=Illusion ' +
    'Description="Friendly duplicate creature from snow, half HP of original",
  'Sleep':
    'School=Enchantment ' +
    'Description="R90\' 20\' radius sleeps up to 5d8 HP creatures, weakest first",
  'Sleet Storm':
    'School=Conjuration ' +
    'Description="R150\' 40\' radius slick ice causes falls (Dex neg)",
  'Slow':
    'School=Transmutation ' +
    'Description="R120\' Targets in 40\' cu half speed, -2 AC and Dex save (Wis neg)",
  'Spare The Dying':
    'School=Necromancy ' +
    'Description="Touched creature stable",
  'Speak With Animals':
    'School=Divination ' +
    'Description="Self talk to animals for 10 min",
  'Speak With Dead':
    'School=Necromancy ' +
    'Description="Self ask corpse 5 questions in 10 min",
  'Speak With Plants':
    'School=Transmutation ' +
    'Description="Self talk to plans in 30\' for 10 min",
  'Spider Climb':
    'School=Transmutation ' +
    'Description="Touched travel walls and ceilings for conc/1 hr",
  'Spike Growth':
    'School=Transmutation ' +
    'Description="R150\' 20\' radius 2d4 HP/5\' move for conc/10 min",
  'Spirit Guardians':
    'School=Conjuration ' +
    'Description="Self 15\' radius 3d8 HP (Wis half)",
  'Spiritual Weapon':
    'School=Evocation ' +
    'Description="R60\' Spectral weapon 1d8 + spell mod HP, move 20\' for 1 min",
  'Stinking Cloud':
    'School=Conjuration ' +
    'Description="R90\' 20\' radius causes retching for conc/1 min",
  'Stone Shape':
    'School=Transmutation ' +
    'Description="Touched medium-sized stone reforms",
  'Stoneskin':
    'School=Abjuration ' +
    'Description="Touched resists bludgeoning, piercing, slashing for conc/1 hr",
  'Storm Of Vengeance':
    'School=Conjuration ' +
    'Description="RSight 360\' radius lightning, thunder, wind for conc/1 min",
  'Suggestion':
    'School=Enchantment ' +
    'Description="R30\' Target follow reasonable suggestion (Wis neg)",
  'Sunbeam':
    'School=Evocation ' +
    'Description="60\' light 6d8 HP (Con half), blind 1 turn (Con neg) for conc/1 min",
  'Sunburst':
    'School=Evocation ' +
    'Description="60\' radius light 12d6 HP (Con half), blind 1 min (Con neg)",
  'Symbol':
    'School=Abjuration ' +
    'Description="Touched permanent glyph w/magic effects",

  'Telekinesis':
    'School=Transmutation ' +
    'Description="R60\' Move 1000 lb 30\'/rd for conc/10 min (Str neg)",
  'Telepathic Bond':
    'School=Divination ' +
    'Description="R30\' Eight targets communicate mentally for 1 hr",
  'Teleport':
    'School=Conjuration ' +
    'Description="R10\' One object or self + 8 allies teleport any distance",
  'Teleportation Circle':
    'School=Conjuration ' +
    'Description="R10\' Permanent portal to similar circle",
  'Thaumaturgy':
    'School=Transmutation ' +
    'Description="R30\' Minor magic effects for 1 min",
  'Thunderwave':
    'School=Evocation ' +
    'Description="15\' cu 2d8 HP, pushed 10\' (Con half, no push)",
  'Time Stop':
    'School=Transmutation ' +
    'Description="Self extra 1d4+1 turns w/in 1000\' or until other affected",
  'Tiny Hut':
    'School=Evocation ' +
    'Description="10\' radius dome immune to objects and spells for 8 hr",
  'Tongues':
    'School=Divination ' +
    'Description="Touched understand and speak any language for 1 hr",
  'Transport Via Plants':
    'School=Conjuration ' +
    'Description="Teleportation door between two plants for 1 rd",
  'Tree Stride':
    'School=Conjuration ' +
    'Description="Teleport between like trees 1/rd for conc/1 min",
  'True Polymorph':
    'School=Transmutation ' +
    'Description="R30\' Target creature or object transformed for conc/1 hr/0 HP (Wis neg)",
  'True Resurrection':
    'School=Necromancy ' +
    'Description="Touched or named 200-year-old corpse restored to life",
  'True Seeing':
    'School=Divination ' +
    'Description="Touched 120\' truesight, see magically concealed doors, Ethereal Plane for 1 hr",
  'True Strike':
    'School=Divination ' +
    'Description="R30\' Adv next attack on target w/in 1 rd",

  'Unseen Servant':
    'School=Conjuration ' +
    'Description="R60\' Invisible force performs simple tasks for 1 hr",

  'Vampiric Touch':
    'School=Necromancy ' +
    'Description="Touched 3d6 HP, self regain half for conc/1 min",
  'Vicious Mockery':
    'School=Enchantment ' +
    'Description="R60\' Target insults ${Math.floor((lvl+7)/6)} HP, Disadv attack (Wis neg)",

  'Wall Of Fire':
    'School=Evocation ' +
    'Description="R120\' 60\'x20\' wall 5d8 HP (Dex half) for conc/1 min",
  'Wall Of Force':
    'School=Evocation ' +
    'Description="R120\' 10 10\'x10\' panels immune objects for conc/10 min",
  'Wall Of Ice':
    'School=Evocation ' +
    'Description="R120\' 10 10\'x10\' panels for conc/10 min",
  'Wall Of Stone':
    'School=Evocation ' +
    'Description="R120\' 10 10\'x10\' panels for conc/10 min",
  'Wall Of Thorns':
    'School=Conjuration ' +
    'Description="R120\' 60\'x10\' wall 7d8 HP (Dex half) for conc/10 min",
  'Warding Bond':
    'School=Abjuration ' +
    'Description="Touched +1 AC, saves, resist damage within 60\' of self, self share damage for 1 hr",
  'Water Breathing':
    'School=Transmutation ' +
    'Description="R30\' 10 targets breathe underwater for 1 dy",
  'Water Walk':
    'School=Transmutation ' +
    'Description="R30\' 10 targets cross liquid for 1 hr",
  'Web':
    'School=Conjuration ' +
    'Description="R60\' 20\' cu restrain creatures for conc/1 hr (Dex neg, Str frees)",
  'Weird':
    'School=Illusion ' +
    'Description="R120\' Targets in 30\' radius fright, 4d10 HP/turn for conc/1 min (Wis neg)",
  'Wind Walk':
    'School=Transmutation ' +
    'Description="R30\' Self + 10 others gaseous, fly 300\'/rd for 8 hr",
  'Wind Wall':
    'School=Evocation ' +
    'Description="R120\' 50\'x15\' strong wind does 3d8 HP (Str half) for conc/1 min",
  'Wish':
    'School=Conjuration ' +
    'Description="Alter reality with few limits",
  'Word Of Recall':
    'School=Conjuration ' +
    'Description="R5\' Self + 5 others instantly teleport to predetermined place",

  'Zone Of Truth':
    'School=Enchantment ' +
    'Description="R60\' Creatures inside 15\' radius cannot lie for 10 min (Cha neg)"'

};
SRD5E.TOOLS = {
  "Alchemist's Supplies':'Type=Artisan",
  "Brewer's Supplies':'Type=Artisan",
  "Calligrapher's Supplies':'Type=Artisan",
  "Carpenter's Tools':'Type=Artisan",
  "Cobbler's Tools':'Type=Artisan",
  "Cook's Utensils':'Type=Artisan",
  "Glassblower's Tools':'Type=Artisan",
  "Jeweler's Tools':'Type=Artisan",
  "Leatherworker's Tools':'Type=Artisan",
  "Mason's Tools':'Type=Artisan",
  "Painter's Supplies':'Type=Artisan",
  "Potter's Tools':'Type=Artisan",
  "Smith's Tools':'Type=Artisan",
  "Tinker's Tools':'Type=Artisan",
  "Weaver's Tools':'Type=Artisan",
  "Woodcarver's Tools':'Type=Artisan",
  'Disguise Kit':'Type=',
  'Forgery Kit':'Type=',
  'Dice Set':'Type=Game',
  'Dragonchess Set':'Type=Game',
  'Playing Card Set':'Type=Game',
  'Three-Dragon Ante Set':'Type=Game',
  'Herbalism Kit':'Type=',
  'Bagpipes':'Type=Music',
  'Drum':'Type=Music',
  'Dulcimer':'Type=Music',
  'Flute':'Type=Music',
  'Lute':'Type=Music',
  'Lyre':'Type=Music',
  'Horn':'Type=Music',
  'Pan Flute':'Type=Music',
  'Shawm':'Type=Music',
  'Viol':'Type=Music',
  "Navigator's Tools':'Type=",
  "Poisoner's Kit':'Type=",
  "Thieves' Tools':'Type=",
  'Vehicle (Land)':'Type=',
  'Vehicle (Water)':'Type='
};
SRD5E.WEAPONS = {
  'Battleaxe':'Level=2 Category=Ve Damage=d10',
  'Blowgun':'Level=2 Category=R Damage=d1 Range=25',
  'Club':'Level=1 Category=Li Damage=d4',
  'Dagger':'Level=1 Category=Li Damage=d4 Range=20 Fi',
  'Dart':'Level=1 Category=R Damage=d4 Range=20 Fi',
  'Flail':'Level=2 Category=1h Damage=d8',
  'Glaive':'Level=2 Category=2h Damage=d10',
  'Greataxe':'Level=2 Category=2h Damage=d12',
  'Greatclub':'Level=1 Category=2h Damage=d8',
  'Greatsword':'Level=2 Category=2h Damage=2d6',
  'Halberd':'Level=2 Category=2h Damage=d10',
  'Hand Crossbow':'Level=2 Category=R Damage=d6 Range=30',
  'Handaxe':'Level=1 Category=Li Damage=d6 Range=20',
  'Heavy Crossbow':'Level=2 Category=R Damage=d10 Range=100',
  'Javelin':'Level=1 Category=R Damage=d6 Range=30',
  'Lance':'Level=2 Category=1h Damage=d12',
  'Light Crossbow':'Level=1 Category=R Damage=d8 Range=80',
  'Light Hammer':'Level=1 Category=Li Damage=d4 Range=20',
  'Longbow':'Level=2 Category=R Damage=d8 Range=150',
  'Longsword':'Level=2 Category=Ve Damage=d10',
  'Mace':'Level=1 Category=1h Damage=d6',
  'Maul':'Level=2 Category=2h Damage=2d6',
  'Morningstar':'Level=2 Category=1h Damage=d8',
  'Net':'Level=2 Category=R Damage=d0 Range=5',
  'Pike':'Level=2 Category=2h Damage=d10',
  'Quarterstaff':'Level=1 Category=Ve Damage=d6',
  'Rapier':'Level=2 Category=1h Damage=d8 Fi',
  'Scimitar':'Level=2 Category=Li Damage=d6 Fi',
  'Shortbow':'Level=1 Category=R Damage=d6 Range=80',
  'Shortsword':'Level=2 Category=Li Damage=d6 Fi',
  'Sickle':'Level=1 Category=Li Damage=d4',
  'Sling':'Level=1 Category=R Damage=d4 Range=30',
  'Spear':'Level=1 Category=R Category=Ve Damage=d8 Range=20',
  'Trident':'Level=2 Category=Ve Damage=d8 Range=20',
  'Unarmed':'Level=1 Category=Un Damage=d1',
  'War Pick':'Level=2 Category=1h Damage=d8',
  'Warhammer':'Level=2 Category=Ve Damage=d8',
  'Whip':'Level=2 Category=1h Damage=d4 Fi'
};
SRD5E.CLASSES = {
  'Barbarian':
    'HitDie=d12 ',
    'Features=' +
      '"1:Armor Proficiency (Light/Medium/Shield)",' +
      '"1:Weapon Proficiency (Simple/Martial)",' +
      '"1:Barbarian Unarmored Defense",1:Rage,"2:Danger Sense",' +
      '"2:Reckless Attack","5:Extra Attack",' +
      '"armorWeight < 3 ? 5:Fast Movement",' +
      '"7:Feral Instinct","9:Brutal Critical","11:Relentless Rage",' +
      '"15:Persistent Rage","18:Indomitable Might","20:Primal Champion",' +
      '"features.Path Of The Berserker ? 3:Frenzy",' +
      '"Features.Path Of The Berserker ? 6:Mindless Rage",' +
      '"Features.Path Of The Berserker ? 10:Intimidating Presence",' +
      '"Features.Path Of The Berserker ? 14:Retaliation" ' +
    'Selectables=' +
      '"3:Path Of The Berserker",' +
      '"3:Path Of The Totem Warrior (Bear)",' +
      '"3:Path Of The Totem Warrior (Eagle)",' +
      '"3:Path Of The Totem Warrior (Wolf)"',
  'Bard':
    'HitDie=d8 ' +
    'Features=' +
      '"1:Armor Proficiency (Light)",' +
      '"1:Weapon Proficiency (Simple/Hand Crossbow/Longsword/Rapier/Shortsword)",' +
      '"1:Tool Proficiency (3 Musical Instruments)",' +
      '"1:Bardic Inspiration","1:Ritual Casting",1:Spellcasting,' +
      '"2:Jack Of All Trades","2:Song Of Rest","3:Bard Expertise",' +
      '"5:Font Of Inspiration",6:Countercharm,"10:Magical Secrets",' +
      '"20:Superior Inspiration",' +
      // College Of Lore
      '"features.College Of Lore ? 3:Bonus Skills",' +
      '"features.College Of Lore ? 3:Cutting Words",' +
      '"features.College Of Lore ? 6:Additional Magical Secrets",' +
      '"features.College Of Lore ? 14:Peerless Skill" ' +
    'Selectables=' +
      '"3:College Of Lore" ' +
    'CasterLevelArcane=levels.Bard ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'B1:1=2;2=3;3=4,'
      'B2:3=2;4=3,'
      'B3:5=2;6=3,'
      'B4:7=1;8=2;9=3,'
      'B5:9=1;10=2;18=3,'
      'B6:11=1;19=2,'
      'B7:13=1;20=2,'
      'B8:15=1,'
      'B9:17=1 ' +
    'Spells=' +
      '"B0:Dancing Lights;Light;Mage Hand;Mending;Message;Minor Illusion;' +
      'Prestidigitation:True Strike;Vicious Mockery",' +
      '"B1:Animal Friendship;Bane;Charm Person;Comprehend Languages;' +
      'Cure Wounds:Detect Magic;Disguise Self;Faerie Fire;Feather Fall;' +
      'Healing Word:Heroism;Hideous Laughter;Identify;Illusory Script;' +
      'Longstrider:Silent Image;Sleep;Speak With Animals;Unseen Servant",' +
      '"B2:Animal Messenger;Blindness/Deafness;Calm Emotions;' +
      'Detect Thoughts:Enhance Ability;Enthrall;Heat Metal;Hold Person;' +
      'Invisibility:Knock;Lesser Restoration;Locate Animals Or Plants;' +
      'Locate Object:Magic Mouth;See Invisibility;Shatter;Silence;' +
      'Suggestion:Zone Of Truth",' +
      '"B3:Bestow Curse;Clairvoyance;Dispel Magic;Fear;Glyph Of Warding;' +
      'Hypnotic Pattern:Major Image;Plant Growth;Sending;Speak With Dead;' +
      'Speak With Plants:Stinking Cloud;Tiny Hut;Tongues",' +
      '"B4:Compulsion;Confusion;Dimension Door;Freedom Of Movement;' +
      'Greater Invisibility:Hallucinatory Terrain;Locate Creature;Polymorph",' +
      '"B5:Animate Objects;Awaken;Dominate Person;Dream;Geas;' +
      'Greater Restoration:Hold Monster;Legend Lore;Mass Cure Wounds;' +
      'Mislead:Modify Memory;Planar Binding;Raise Dead;Scrying;Seeming;' +
      'Teleportation Circle",' +
      '"B6:Eyebite;Find The Path;Guards And Wards;Irresistible Dance;' +
      'Mass Suggestion:Programmed Illusion;True Seeing",' +
      '"B7:Etherealness;Forcecage;Magnificent Mansion;Mirage Arcane;' +
      'Project Image:Regenerate;Resurrection;Symbol;Teleport",' +
      '"B8:Dominate Monster;Feeblemind;Glibness;Mind Blank;Power Word Stun",' +
      '"B9:Foresight;Power Word Kill;True Polymorph"',
  'Cleric':
    'HitDie=d8 ',
    'Features=' +
      '"1:Armor Proficiency (Light/Medium/Shield)",' +
      '"1:Weapon Proficiency (Simple)",' +
      '"1:Ritual Casting",1:Spellcasting,"2:Channel Divinity",' +
      '"2:Turn Undead","5:Destroy Undead","10:Divine Intervention",' +
      '"features.Life Domain ? 1:Armor Proficiency (Heavy)",' +
      '"features.Life Domain ? 1:Disciple Of Life",' +
      '"features.Life Domain ? 2:Preserve Life",' +
      '"features.Life Domain ? 6:Blessed Healer",' +
      '"features.Life Domain ? 8:Divine Strike",' +
      '"features.Life Domain ? 17:Supreme Healing" ' +
    'Selectables=' +
      '"1:Life Domain" ' +
    'CasterLevelDivine=levels.Cleric ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'C1:1=2;2=3;3=4,'
      'C2:3=2;4=3,'
      'C3:5=2;6=3,'
      'C4:7=1;8=2;9=3,'
      'C5:9=1;10=2;18=3,'
      'C6:11=1;19=2,'
      'C7:13=1;20=2,'
      'C8:15=1,'
      'C9:17=1 ' +
    'Spells=' +
      '"C0:Guidance;Light;Mending;Resistance;Sacred Flame;Spare The Dying;' +
      'Thaumaturgy",' +
      '"C1:Bane;Bless;Command;Create Or Destroy Water;Cure Wounds;' +
      'Detect Evil And Good:Detect Magic;Detect Poison And Disease;' +
      'Guiding Bolt:Healing Word;Inflict Wounds;' +
      'Protection From Evil And Good:Purify Food And Drink;Sanctuary;' +
      'Shield Of Faith",' +
      '"C2:Aid;Augury;Blindness/Deafness;Calm Emotions;Continual Flame;' +
      'Enhance Ability:Find Traps;Gentle Repose;Hold Person;' +
      'Lesser Restoration:Locate Object;Prayer Of Healing;' +
      'Protection From Poison:Silence;Spiritual Weapon;Warding Bond;' +
      'Zone Of Truth",' +
      '"C3:Animate Dead;Beacon Of Hope;Bestow Curse;Clairvoyance;' +
      'Create Food And Water:Daylight;Dispel Magic;Glyph Of Warding;' +
      'Magic Circle:Mass Healing Word;Meld Into Stone;' +
      'Protection From Energy:Remove Curse;Revivify;Sending;' +
      'Speak With Dead:Spirit Guardians;Tongues;Water Walk",' +
      '"C4:Banishment;Control Water;Death Ward;Divination;' +
      'Freedom Of Movement:Guardian Of Faith;Locate Creature;Stone Shape",' +
      '"C5:Commune;Contagion;Dispel Evil And Good;Flame Strike;Geas;' +
      'Greater Restoration:Hallow;Insect Plague;Legend Lore;' +
      'Mass Cure Wounds:Planar Binding;Raise Dead;Scrying",' +
      '"C6:Blade Barrier;Create Undead;Find The Path;Forbiddance;Harm;Heal;' +
      'Heroes\' Feast:Planar Ally;True Seeing;Word Of Recall",' +
      '"C7:Conjure Celestial;Divine Word;Etherealness;Fire Storm;' +
      'Plane Shift:Regenerate;Resurrection;Symbol",' +
      '"C8:Antimagic Field;Control Weather;Earthquake;Holy Aura",' +
      '"C9:Astral Projection;Gate;Mass Heal;True Resurrection"',
  'Druid':
    'HitDie=d8 ' +
    'Features=' +
      '"1:Armor Proficiency (Light/Medium/Shield)",' +
      '"1:Weapon Proficiency (Club/Dagger/Dart/Javelin/Mace/Quarterstaff/Scimitar/Sickle/Sling/Spear)",' +
      '"1:Tool Proficiency (Herbalism Kit)",' +
      '"1:Ritual Casting",1:Spellcasting,"2:Wild Shape",' +
      '"18:Druid Timeless Body","18:Beast Spells",20:Archdruid,' +
      '"features.Circle Of The Land ? 2:Bonus Cantrip",' +
      '"features.Circle Of The Land ? 2:Natural Recovery",' +
      '"features.Circle Of The Land ? 6:Land\'s Stride",' +
      '"features.Circle Of The Land ? 10:Nature\'s Ward",' +
      '"features.Circle Of The Land ? 14:Nature\'s Sanctuary" ' +
    'Languages=Druidic ',
    'Selectables=' +
      '"2:Circle Of The Land (Arctic)",' +
      '"2:Circle Of The Land (Coast)",' +
      '"2:Circle Of The Land (Desert)",' +
      '"2:Circle Of The Land (Forest)",' +
      '"2:Circle Of The Land (Grassland)",' +
      '"2:Circle Of The Land (Mountain)",' +
      '"2:Circle Of The Land (Swamp)" ' +
    'CasterLevelDivine=levels.Druid ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'D1:1=2;2=3;3=4,'
      'D2:3=2;4=3,'
      'D3:5=2;6=3,'
      'D4:7=1;8=2;9=3,'
      'D5:9=1;10=2;18=3,'
      'D6:11=1;19=2,'
      'D7:13=1;20=2,'
      'D8:15=1,'
      'D9:17=1 ' +
    'Spells=' +
      '"D0:Druidcraft;Guidance;Mending;Poison Spray;Produce Flame;' +
      'Resistance:Shillelagh",' +
      '"D1:Animal Friendship;Charm Person;Create Or Destroy Water;' +
      'Cure Wounds:Detect Magic;Detect Poison And Disease;Entangle;' +
      'Faerie Fire:Fog Cloud;Goodberry;Healing Word;Jump;Longstrider;' +
      'Purify Food And Drink:Speak With Animals;Thunderwave",' +
      '"D2:Animal Messenger;Barkskin;Darkvision;Enhance Ability;' +
      'Find Traps:Flame Blade;Flaming Sphere;Gust Of Wind;Heat Metal;' +
      'Hold Person:Lesser Restoration;Locate Animals Or Plants;' +
      'Locate Object:Moonbeam;Pass Without Trace;Protection From Poison;' +
      'Spike Growth",' +
      '"D3:Call Lightning;Conjure Animals;Daylight;Dispel Magic;' +
      'Meld Into Stone:Plant Growth;Protection From Energy;Sleet Storm;' +
      'Speak With Plants:Water Breathing;Water Walk;Wind Wall",' +
      '"D4:Blight;Confusion;Conjure Minor Elementals;' +
      'Conjure Woodland Beings:Control Water;Dominate Beast;' +
      'Freedom Of Movement:Giant Insect;Hallucinatory Terrain;Ice Storm;' +
      'Locate Creature:Polymorph;Stone Shape;Stoneskin;Wall Of Fire",' +
      '"D5:Antilife Shell;Awaken;Commune With Nature;Conjure Elemental;' +
      'Contagion:Geas;Greater Restoration;Insect Plague;Mass Cure Wounds;' +
      'Planar Binding:Reincarnate;Scrying;Tree Stride;Wall Of Stone",' +
      '"D6:Conjure Fey;Find The Path;Heal;Heroes\' Feast;Move Earth;Sunbeam;" +
      'Transport Via Plants:Wall Of Thorns;Wind Walk",' +
      '"D7:Fire Storm;Mirage Arcane;Plane Shift;Regenerate;Reverse Gravity",' +
      '"D8:Animal Shapes;Antipathy/Sympathy;Control Weather;Earthquake;' +
      'Feeblemind:Sunburst",' +
      '"D9:Foresight;Shapechange;Storm Of Vengeance;True Resurrection"',
  'Fighter':
    'HitDie=d10 ' +
    'Features=' +
      '"1:Armor Proficiency (Light/Medium/Heavy/Shield)",' +
      '"1:Weapon Proficiency (Simple/Martial)",' +
      '"1:Second Wind","2:Action Surge","5:Extra Attack",9:Indomitable' +
      '"features.Champion Archetype ? 3:Improved Critical",' +
      '"features.Champion Archetype ? 7:Remarkable Athlete",' +
      '"features.Champion Archetype ? 7:Remarkable Athlete",' +
      '"features.Champion Archetype ? 10:Additional Fighting Style",' +
      '"features.Champion Archetype ? 15:Superior Critical",' +
      '"features.Champion Archetype ? 18:Survivor" ' +
    'Selectables=' +
      '"1:Archery Style","1:Defense Style","1:Dueling Style",' +
      '"1:Great Weapon Fighting Style","1:Protection Style",' +
      '"1:Two-Weapon Fighting Style","3:Champion Archetype"',
  'Monk':
    'HitDie=d8 ',
    'Features=' +
      '1:Weapon Proficiency (Simple/Shortsword)",' +
      '"1:Tool Proficiency (Artisan\'s Tools or Musical Instrument)",' +
      '"1:Martial Arts","1:Monk Bonus Attack","1:Monk Unarmored Defense",' +
      '"2:Flurry Of Blows","2:Ki","2:Patient Defense","2:Step Of The Wind",' +
      '"2:Unarmored Movement","3:Deflect Missiles","4:Slow Fall",' +
      '"5:Extra Attack","5:Stunning Strike","6:Ki-Empowered Strikes",' +
      '7:Evasion,"7:Stillness Of Mind","9:Improved Unarmored Movement",' +
      '"10:Purity Of Body","13:Tongue Of Sun And Moon","14:Diamond Soul",' +
      '"15:Monk Timeless Body","18:Empty Body","20:Perfect Self",' +
      // Way Of The Open Hand Tradition
      '"features.Way Of The Open Hand ? 3:Open Hand Technique",' +
      '"features.Way Of The Open Hand ? 6:Wholeness Of Body",' +
      '"features.Way Of The Open Hand ? 11:Tranquility",' +
      '"features.Way Of The Open Hand ? 17:Quivering Palm" ' +
    'Selectables=' +
      '"3:Way Of The Open Hand Tradition"',
  'Paladin':
    'HitDie=d10 ' +
    'Features=' +
      '"1:Armor Proficiency (Light/Medium/Heavy/Shield)",' +
      '"1:Weapon Proficiency (Simple/Martial)",' +
      '"1:Divine Sense","1:Lay On Hands","2:Divine Smite",2:Spellcasting,' +
      '"3:Channel Divinity","3:Divine Health","5:Extra Attack",' +
      '"6:Aura Of Protection","10:Aura Of Courage",' +
      '"11:Improved Divine Smite","14:Cleansing Touch",' +
      '"features.Oath Of Devotion ? 3:Sacred Weapon",' +
      '"features.Oath Of Devotion ? 3:Turn The Unholy",' +
      '"features.Oath Of Devotion ? 7:Aura Of Devotion",' +
      '"features.Oath Of Devotion ? 15:Purity Of Spirit",' +
      '"features.Oath Of Devotion ? 20:Holy Nimbus:magic",' +
      '"features.Oath Of Devotion ? 20:Holy Nimbus" ' +
    'Selectables=' +
      '"2:Defense Style","2:Dueling Style","2:Great Weapon Fighting Style",' +
      '"2:Protection Style","3:Oath Of Devotion" ' +
    'CasterLevelArcane=levels.Paladin ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'P1:2=2;3=3;5=4,' +
      'P2:5=2;7=3,' +
      'P3:9=2;11=3,' +
      'P4:13=1;15=2;17=3,' +
      'P5:17=1;19=2 ' +
    'Spells=' +
      '"P1:Bless;Command;Cure Wounds;Detect Evil And Good;Detect Magic;' +
      'Detect Poison And Disease:Divine Favor;Heroism;' +
      'Protection From Evil And Good:Purify Food And Drink;Shield Of Faith",' +
      '"P2:Aid;Branding Smite;Find Steed;Lesser Restoration;Locate Object;' +
      'Magic Weapon:Protection From Poison;Zone Of Truth",' +
      '"P3:Create Food And Water;Daylight;Dispel Magic;Magic Circle;' +
      'Remove Curse:Revivify",' +
      '"P4:Banishment;Death Ward;Locate Creature",' +
      '"P5:Dispel Evil And Good;Geas;Raise Dead"',
  'Ranger':
    'HitDie=d10 ' +
    'Features=' +
      '"1:Armor Proficiency (Light/Medium/Shield)",' +
      '"1:Weapon Proficiency (Simple/Martial)",' +
      '"1:Favored Enemy","1:Natural Explorer",2:Spellcasting,' +
      '"3:Primeval Awareness","5:Extra Attack","8:Land\'s Stride",' +
      '"10:Hide In Plain Sight","14:Vanish","18:Feral Senses",' +
      '"20:Foe Slayer" ' +
    'Selectables=' +
      '"2:Archery Style","2:Defense Style","2:Dueling Style",' +
      '"2:Two-Weapon Fighting Style","3:Hunter Archetype","3:Horde Breaker",' +
      '"7:Escape The Horde","7:Multiattack Defense","7:Steel Will",11:Volley,' +
      '"11:Whirlwind Attack",15:Evasion,"15:Stand Against The Tide",' +
      '"15:Uncanny Dodge" ' +
    'CasterLevelDivine=levels.Ranger ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'R1:2=2;3=3;5=4,'
      'R2:5=2;7=3,'
      'R3:9=2;11=3,'
      'R4:13=1;15=2;17=3,'
      'R5:17=1;19=2 ' +
    'Spells=' +
      '"R1:Alarm;Animal Friendship;Cure Wounds;Detect Magic;' +
      'Detect Poison And Disease:Fog Cloud;Goodberry;Hunter\'s Mark;Jump;' +
      'Longstrider:Speak With Animals",' +
      '"R2:Animal Messenger;Barkskin;Darkvision;Find Traps;' +
      'Lesser Restoration:Locate Animals Or Plants;Locate Object;' +
      'Pass Without Trace:Protection From Poison;Silence;Spike Growth",' +
      '"R3:Conjure Animals;Daylight;Nondetection;Plant Growth;' +
      'Protection From Energy:Speak With Plants;Water Breathing;Water Walk;' +
      'Wind Wall",' +
      '"R4:Conjure Woodland Beings;Freedom Of Movement;Locate Creature;' +
      'Stoneskin",' +
      '"R5:Commune With Nature;Tree Stride"',
  'Rogue':
    'HitDie=d8 ' +
    'Features=' +
      '"1:Armor Proficiency (Light)",' +
      '"1:Weapon Proficiency (Simple/Hand Crossbow/Longsword/Rapier/Shortsword)",' +
      '"1:Tool Proficiency (Thieves\' Tools)",' +
      '"1:Rogue Expertise","1:Sneak Attack","1:Thief\'s Cant",' +
      '"2:Cunning Action","5:Uncanny Dodge",7:Evasion,"11:Reliable Talent",' +
      '14:Blindsense,"15:Slippery Mind",18:Elusive,"20:Stroke Of Luck",' +
      // Thief Archetype
      '"features.Thief Archetype ? 3:Fast Hands",' +
      '"features.Thief Archetype ? 3:Second-Story Work",' +
      '"features.Thief Archetype ? 9:Supreme Sneak",' +
      '"features.Thief Archetype ? 13:Use Magic Device",' +
      '"features.Thief Archetype ? 17:Thief\'s Reflexes" ' +
    'Selectables=' +
      '"3:Thief Archetype"',
  'Sorcerer':
    'HitDie=6 ' +
    'Features=' +
      '"1:Weapon Proficiency (Dagger/Dart/Sling/Quarterstaff/Light Crossbow)",' +
      '1:Spellcasting,"2:Font Of Magic","2:Flexible Casting",' +
      '"20:Sorcerous Restoration",' +
      '"features.Draconic Bloodline ? 1:Draconic Resilience",' +
      '"features.Draconic Bloodline ? 6:Elemental Affinity",' +
      '"features.Draconic Bloodline ? 14:Dragon Wings",' +
      '"features.Draconic Bloodline ? 18:Draconic Presence" ' +
    'Selectables=' +
      '"1:Draconic Bloodline","3:Careful Spell","3:Distant Spell",' +
      '"3:Empowered Spell","3:Extended Spell","3:Heightened Spell",' +
      '"3:Quickened Spell","3:Subtle Spell","3:Twinned Spell" ' +
    'CasterLevelArcane=levels.Sorcerer ' +
    'SpellAbility=charisma ' +
    'SpellSlots' +
      'S1:1=2;2=3;3=4,' +
      'S2:3=2;4=3,' +
      'S3:5=2;6=3,' +
      'S4:7=1;8=2;9=3,' +
      'S5:9=1;10=2;18=3,' +
      'S6:11=1;19=2,' +
      'S7:13=1;20=2,' +
      'S8:15=1,' +
      'S9:17=1 ' +
    'Spells=' +
      '"S0:Acid Splash;Chill Touch;Dancing Lights;Fire Bolt;Light;Mage Hand;' +
      'Mending:Message;Minor Illusion;Poison Spray;Prestidigitation;' +
      'Ray Of Frost:Shocking Grasp;True Strike",' +
      '"S1:Burning Hands;Charm Person;Color Spray;Comprehend Languages;' +
      'Detect Magic:Disguise Self;Expeditious Retreat;False Life;' +
      'Feather Fall:Fog Cloud;Jump;Mage Armor;Magic Missile;Shield;' +
      'Silent Image:Sleep;Thunderwave",' +
      '"S2:Alter Self;Blindness/Deafness;Blur;Darkness;Darkvision;' +
      'Detect Thoughts:Enhance Ability;Enlarge/Reduce;Gust Of Wind;' +
      'Hold Person:Invisibility;Knock;Levitate;Mirror Image;Misty Step;' +
      'Scorching Ray:See Invisibility;Shatter;Spider Climb;Suggestion;Web",' +
      '"S3:Blink;Clairvoyance;Counterspell;Daylight;Dispel Magic;Fear;' +
      'Fireball:Fly;Gaseous Form;Haste;Hypnotic Pattern;Lightning Bolt;' +
      'Major Image:Protection From Energy;Sleet Storm;Slow;Stinking Cloud;' +
      'Tongues:Water Breathing;Water Walk",' +
      '"S4:Banishment;Blight;Confusion;Dimension Door;Dominate Beast;' +
      'Greater Invisibility:Ice Storm;Polymorph;Stoneskin;Wall Of Fire",' +
      '"S5:Animate Objects;Cloudkill;Cone Of Cold;Creation;Dominate Person;' +
      'Hold Monster:Insect Plague;Seeming;Telekinesis;Teleportation Circle;' +
      'Wall Of Stone",' +
      '"S6:Chain Lightning;Circle Of Death;Disintegrate;Eyebite;' +
      'Globe Of Invulnerability:Mass Suggestion;Move Earth;Sunbeam;' +
      'True Seeing",' +
      '"S7:Delayed Blast Fireball;Etherealness;Finger Of Death;Fire Storm;' +
      'Plane Shift:Prismatic Spray;Reverse Gravity;Teleport",' +
      '"S8:Dominate Monster;Earthquake;Incendiary Cloud;Power Word Stun;' +
      'Sunburst",' +
      '"S9:Gate;Meteor Swarm;Power Word Kill;Time Stop;Wish"',
  'Warlock':
    'HitDie=d8 ' +
    'Features=' +
      '"1:Armor Proficiency (Light)",' +
      '"1:Weapon Proficiency (Simple)",' +
      '"1:Pact Magic","2:Eldritch Invocations","11:Mystic Arcanum",' +
      ''"20:Eldritch Master",' +
      '"features.Fiend Patron ? 1:Dark One\'s Blessing",' +
      '"features.Fiend Patron ? 6:Dark One\'s Own Luck",' +
      '"features.Fiend Patron ? 10:Fiendish Resilience",' +
      '"features.Fiend Patron ? 14:Hurl Through Hell" ' +
    'Selectables=' +
      '"1:Fiend Patron","3:Pact Of The Blade","3:Pact Of The Chain",' +
      '"3:Pact Of The Tome","2:Agonizing Blast","2:Armor Of Shadows",' +
      '"9:Ascendant Step","2:Beast Speech","2:Beguiling Influence",' +
      '"7:Bewitching Whispers","2:Book Of Ancient Secrets",' +
      '"15:Chains Of Carceri","2:Devil\'s Sight","7:Dreadful Word",' +
      '"2:Eldritch Sight","2:Eldritch Spear","2:Eyes Of The Rune Keeper",' +
      '"2:Fiendish Vigor","2:Gaze Of Two Minds","12:Lifedrinker",' +
      '"2:Mask Of Many Faces","15:Master Of Myriad Forms",
      '"9:Minions Of Chaos","2:Misty Visions","5:Mire The Mind",' +
      '"5:One With Shadows","9:Otherworldly Leap","2:Repelling Blast",' +
      '"7:Sculptor Of Flesh","5:Sign Of Ill Omen:","2:Thief Of Five Fates",' +
      '"5:Thirsting Blade","15:Visions Of Distant Realms",
      '"2:Voice Of The Chain Master","9:Whispers Of The Grave",' +
      '"15:Witch Sight"',
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'K1:1=1;2=2;3=0',
      'K2:3=2;5=0',
      'K3:5=2;7=0',
      'K4:7=2;9=0',
      'K5:9=2;11=3;17=4 ' +
    'Spells=' +
      '"K0:Chill Touch;Eldritch Blast;Mage Hand;Minor Illusion;Poison Spray;' +
      'Prestidigitation:True Strike",' +
      '"K1:Charm Person;Comprehend Languages;Expeditious Retreat;' +
      'Hellish Rebuke:Illusory Script;Protection From Evil And Good;' +
      'Unseen Servant",' +
      '"K2:Darkness;Enthrall;Hold Person;Invisibility;Mirror Image;' +
      'Misty Step:Ray Of Enfeeblement;Shatter;Spider Climb;Suggestion",' +
      '"K3:Counterspell;Dispel Magic;Fear;Fly;Gaseous Form;Hypnotic Pattern;' +
      'Magic Circle:Major Image;Remove Curse;Tongues;Vampiric Touch",' +
      '"K4:Banishment;Blight;Dimension Door;Hallucinatory Terrain",' +
      '"K5:Contact Other Plane;Dream;Hold Monster;Scrying",' +
      '"K6:Circle Of Death;Conjure Fey;Create Undead;Eyebite;Flesh To Stone;' +
      'Mass Suggestion:True Seeing",' +
      '"K7:Etherealness;Finger Of Death;Forcecage;Plane Shift",' +
      '"K8:Demiplane;Dominate Monster;Feeblemind;Glibness;Power Word Stun",' +
      '"K9:Astral Projection;Foresight;Imprisonment;Power Word Kill;' +
      'True Polymorph",' +
      // Fiend Patron
      '"K1:Burning Hands;Command",' +
      '"K2:Blindness/Deafness;Scorching Ray",' +
      '"K3:Fireball;Stinking Cloud",' +
      '"K4:Fire Shield;Wall Of Fire",' +
      '"K5:Flame Strike;Hallow"',
  'Wizard':
    'HitDie=d6 ' +
    'Features=' +
      '"1:Weapon Proficiency (Dagger/Dart/Light Crossbow/Quarterstaff/Sling)",' +
      '"1:Arcane Recovery",1:Spellcasting,"18:Spell Mastery",' +
      '"20:Signature Spell",' +
      // Evocation Tradition
      '"features.Evocation Tradition ? 2:Evocation Savant",' +
      '"features.Evocation Tradition ? 2:Sculpt Spells",' +
      '"features.Evocation Tradition ? 6:Potent Cantrip",' +
      '"features.Evocation Tradition ? 10:Empowered Evocation",' +
      '"features.Evocation Tradition ? 14:Overchannel",' +
    'Selectables=' +
      '"2:Evocation Tradition" ' +
    'SpellAbility=intelligence ' +
    'SpellSlots=' +
      'W1:1;2;2;3;3;4',
      'W2:3;2;4;3',
      'W3:5;2;6;3',
      'W4:7;1;8;2;9;3',
      'W5:9;1;10;2;18;3',
      'W6:11;1;19;2',
      'W7:13;1;20;2',
      'W8:15;1',
      'W9:17;1 ' +
    'Spells=' +
      '"W0:Acid Splash;Chill Touch;Dancing Lights;Fire Bolt;Light;Mage Hand;' +
      'Mending;Message;Minor Illusion;Poison Spray;Prestidigitation;' +
      'Ray Of Frost;Shocking Grasp;True Strike",' +
      '"W1:Alarm;Burning Hands;Charm Person;Color Spray;' +
      'Comprehend Languages;Detect Magic;Disguise Self;Expeditious Retreat;' +
      'False Life;Feather Fall;Find Familiar;Floating Disk;Fog Cloud;' +
      'Grease;Hideous Laughter;Identify;Illusory Script;Jump;Longstrider;' +
      'Mage Armor;Magic Missile;Protection From Evil And Good;Shield;' +
      'Silent Image;Sleep;Thunderwave;Unseen Servant",' +
      '"W2:Acid Arrow;Alter Self;Arcane Lock;Arcanist\'s Magic Aura;" +
      'Blindness/Deafness;Blur;Continual Flame;Darkness;Darkvision;' +
      'Detect Thoughts;Enlarge/Reduce;Flaming Sphere;Gentle Repose;' +
      'Gust Of Wind;Hold Person;Invisibility;Knock;Levitate;Locate Object;' +
      'Magic Mouth;Magic Weapon;Mirror Image;Misty Step;' +
      'Ray Of Enfeeblement;Rope Trick;Scorching Ray;See Invisibility;' +
      'Shatter;Spider Climb;Suggestion;Web",' +
      '"W3:Animate Dead;Bestow Curse;Blink;Clairvoyance;Counterspell;' +
      'Dispel Magic;Fear;Fireball;Fly;Gaseous Form;Glyph Of Warding;Haste;' +
      'Hypnotic Pattern;Lightning Bolt;Magic Circle;Major Image;' +
      'Nondetection;Phantom Steed;Protection From Energy;Remove Curse;' +
      'Sending;Sleet Storm;Slow;Stinking Cloud;Tiny Hut;Tongues;' +
      'Vampiric Touch;Water Breathing",' +
      '"W4:Arcane Eye;Banishment;Black Tentacles;Blight;Confusion;' +
      'Conjure Minor Elementals;Control Water;Dimension Door;Fabricate;' +
      'Faithful Hound;Fire Shield;Greater Invisibility;' +
      'Hallucinatory Terrain;Ice Storm;Locate Creature;Private Sanctum;' +
      'Phantasmal Killer;Polymorph;Resilient Sphere;Secret Chest;' +
      'Stone Shape;Stoneskin;Wall Of Fire",' +
      '"W5:Animate Objects;Arcane Hand;Cloudkill;Cone Of Cold;' +
      'Conjure Elemental;Contact Other Plane;Creation;Dominate Person;' +
      'Dream;Geas;Hold Monster;Legend Lore;Mislead;Modify Memory;Passwall;' +
      'Planar Binding;Scrying;Seeming;Telekinesis;Telepathic Bond;' +
      'Teleportation Circle;Wall Of Force;Wall Of Stone",' +
      '"W6:Chain Lightning;Circle Of Death;Contingency;Create Undead;' +
      'Disintegrate;Eyebite;Flesh To Stone;Freezing Sphere;' +
      'Globe Of Invulnerability;Guards And Wards;Instant Summons;' +
      'Irresistible Dance;Magic Jar;Mass Suggestion;Move Earth;' +
      'Programmed Illusion;Sunbeam;True Seeing;Wall Of Ice",' +
      '"W7:Delayed Blast Fireball;Etherealness;Finger Of Death;Forcecage;' +
      'Magnificent Mansion;Mirage Arcane;Plane Shift;Prismatic Spray;' +
      'Project Image;Reverse Gravity;Sequester;Simulacrum;Symbol;Teleport",' +
      '"W8:Antimagic Field;Antipathy/Sympathy;Clone;Control Weather;' +
      'Demiplane;Dominate Monster;Feeblemind;Incendiary Cloud;Maze;' +
      'Mind Blank;Power Word Stun;Sunburst",' +
      '"W9:Astral Projection;Foresight;Gate;Imprisonment;Meteor Swarm;' +
      'Power Word Kill;Prismatic Wall;Shapechange;Time Stop;True Polymorph;' +
      'Weird;Wish'
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

/* Defines the rules related to character abilities. */
SRD5E.abilityRules = function(rules) {

  for(var ability in SRD5E.ABILITIES) {
    ability = ability.toLowerCase();
    rules.defineChoice('notes', ability + ':%V (%1)');
    rules.defineRule(ability, ability + 'Adjust', '+', null);
    rules.defineRule
      (ability + 'Modifier', ability, '=', 'Math.floor((source - 10) / 2)');
    rules.defineRule(ability + '.1', ability + 'Modifier', '=', null);
  }
  rules.defineRule('carry', 'strength', '=', 'source * 15');
  rules.defineRule('lift', 'strength', '=', 'source * 30');
  rules.defineRule('speed',
    '', '=', '30',
    'abilityNotes.armorSpeedAdjustment', '+', null
  );

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
  for(var ability in SRD5E.ABILITIES) {
    ability = ability.toLowerCase();
    rules.defineRule('validationNotes.abilityBoostAllocation.2',
      ability + 'Adjust', '+=', null
    );
    rules.defineRule(ability, '', 'v', '20');
  }

};

/* Defines the rules related to combat. */
SRD5E.combatRules = function(rules, armors, shields, weapons) {

  for(var armor in armors) {
    rules.choiceRules(rules, 'Armor', armor, armors[armor]);
  }
  for(var shield in shields) {
    rules.choiceRules(rules, 'Shield', shield, shields[shield]);
  }
  for(var weapon in weapons) {
    rules.choiceRules(rules, 'Weapon', weapon, weapons[weapon]);
  }

  rules.defineRule('abilityNotes.armorSpeedAdjustment',
    'armorFullSpeedStrShortfall', '=', 'source > 0 ? -10 : null'
  );
  rules.defineRule
    ('armorClass', 'combatNotes.dexterityArmorClassAdjustment', '+', null);
  rules.defineRule('attacksPerRound', '', '=', '1');
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
  rules.defineRule
    ('hitPoints', 'combatNotes.constitutionHitPointsAdjustment', '+', null);
  rules.defineRule('initiative', 'dexterityModifier', '=', null);

  for(var ability in SRD5E.ABILITIES) {
    rules.defineRule('saveBonus.' + ability,
      'saveProficiencies.' + ability, '?', null,
      'proficiencyBonus', '=', null
    );
    rules.defineRule('save.' + ability,
      ability.toLowerCase() + 'Modifier', '=', null,
      'saveBonus.' + ability, '+', null
    );
  }

  // TODO
  rules.defineRule('armorFullSpeedStrShortfall',
    'armor', '=', 'source == "Chain" ? 13 : "SplintPlate".indexOf(source) >= 0 ? 15 : 3',
    'strength', '+', '-source',
    '', '^', '0'
  );

};

/* Defines the rules related to goodies included in character notes. */
SRD5E.goodiesRules = function(rules) {
  // TODO
};

/* Defines rules related to basic character identity. */
SRD5E.identityRules = function(
  rules, alignments, backgrounds, classes, deities, genders, races
) {

  for(var alignment in alignments) {
    rules.choiceRules(rules, 'Alignment', alignment, alignments[alignment]);
  }
  for(var background in backgrounds) {
    rules.choiceRules(rules, 'Background', background, backgrounds[background]);
  }
  for(var clas in classes) {
    rules.choiceRules(rules, 'Class', clas, classes[clas]);
  }
  for(var deity in deities) {
    rules.choiceRules(rules, 'Deity', deity, deities[deity]);
  }
  for(var gender in genders) {
    rules.choiceRules(rules, 'Gender', gender, genders[gender]);
  }
  for(var race in races) {
    rules.choiceRules(rules, 'Race', race, races[race]);
  }

  rules.defineRule('casterLevel',
    'casterLevelArcane', '+=', null,
    'casterLevelDivine', '+=', null
  );
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

};

/* Defnes rules related to magic use. */
SRD5E.magicRules = function(rules, schools, spells) {

  for(var school in schools) {
    rules.choiceRules(rules, 'School', school, schools[school]);
  }
  for(var spell in spells) {
    rules.choiceRules(rules, 'Spell', spell, spells[spell]);
  }

};

/* Defines rules related to character feats, languages, skills, and tools. */
SRD5E.talentRules = function(rules, feats, features, languages, skills, tools) {

  for(var feat in feats) {
    rules.choiceRules(rules, 'Feat', feat, feats[feat]);
  }
  for(var feature in features) {
    rules.choiceRules(rules, 'Feature', feature, features[feature]);
  }
  for(var language in languages) {
    rules.choiceRules(rules, 'Language', language, languages[language]);
  }
  for(var skill in skills) {
    rules.choiceRules(rules, 'Skill', skill, skills[skill]);
  }
  for(var tool in tools) {
    rules.choiceRules(rules, 'Tool', tool, tools[tool]);
  }

  // Default languageCount for most races, exceptions handled by raceRules
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

};

/*
 * Adds #name# as a possible user #type# choice and parses #attrs# to add rules
 * related to selecting that choice.
 */
SRD5E.choiceRules = function(rules, type, name, attrs) {
  if(type == 'Alignment')
    SRD5E.alignmentRules(rules, name);
  else if(type == 'Background')
    SRD5E.backgroundRules(rules, name
      QuilvynUtils.getAttrValueArray(attrs, 'Equipment'),
      QuilvynUtils.getAttrValueArray(attrs, 'Feature'),
      QuilvynUtils.getAttrValueArray(attrs, 'Language'),
      QuilvynUtils.getAttrValueArray(attrs, 'Skill')
    );
  else if(type == 'Armor') {
    var bulky = QuilvynUtils.getAttrValue(attrs, 'Bulky');
    SRD5E.armorRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'AC'),
      QuilvynUtils.getAttrValue(attrs, 'Weight'),
      QuilvynUtils.getAttrValue(attrs, 'Dex'),
      QuilvynUtils.getAttrValue(attrs, 'Str'),
      bulky == 'y' || bulky == 'Y'
    );
  } else if(type == 'Class') {
    SRD5E.classRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValue(attrs, 'HitDie'),
      QuilvynUtils.getAttrValue(attrs, 'Attack'),
      QuilvynUtils.getAttrValue(attrs, 'SkillPoints'),
      QuilvynUtils.getAttrValue(attrs, 'Fortitude'),
      QuilvynUtils.getAttrValue(attrs, 'Reflex'),
      QuilvynUtils.getAttrValue(attrs, 'Will'),
      QuilvynUtils.getAttrValueArray(attrs, 'Skills'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Selectables'),
      QuilvynUtils.getAttrValueArray(attrs, 'Languages'),
      QuilvynUtils.getAttrValue(attrs, 'CasterLevelArcane'),
      QuilvynUtils.getAttrValue(attrs, 'CasterLevelDivine'),
      QuilvynUtils.getAttrValue(attrs, 'SpellAbility'),
      QuilvynUtils.getAttrValueArray(attrs, 'SpellsPerDay'),
      QuilvynUtils.getAttrValueArray(attrs, 'Spells'),
      SRD5E.SPELLS
    );
    SRD5E.classRulesExtra(rules, name);
  } else if(type == 'Deity')
    SRD5E.deityRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Alignment'),
      QuilvynUtils.getAttrValueArray(attrs, 'Domain')
    );
  else if(type == 'Feat') {
    SRD5E.featRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Imply'),
      QuilvynUtils.getAttrValueArray(attrs, 'Type')
    );
    SRD5E.featRulesExtra(rules, name);
  } else if(type == 'Feature')
    SRD5E.featureRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Section'),
      QuilvynUtils.getAttrValueArray(attrs, 'Note')
    );
  else if(type == 'Gender')
    SRD5E.genderRules(rules, name);
  else if(type == 'Language')
    SRD5E.languageRules(rules, name);
  else if(type == 'Race') {
    SRD5E.raceRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Selectables'),
      QuilvynUtils.getAttrValueArray(attrs, 'Languages'),
      QuilvynUtils.getAttrValue(attrs, 'SpellAbility'),
      QuilvynUtils.getAttrValueArray(attrs, 'Spells'),
      SRD5E.SPELLS
    );
    SRD5E.raceRulesExtra(rules, name);
  } else if(type == 'School')
    SRD5E.schoolRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Features')
    );
  else if(type == 'Shield')
    SRD5E.shieldRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'AC')
    );
  else if(type == 'Skill') {
    var untrained = QuilvynUtils.getAttrValue(attrs, 'Untrained');
    SRD5E.skillRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Ability')
    );
    SRD5E.skillRulesExtra(rules, name);
  } else if(type == 'Spell')
    SRD5E.spellRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'School'),
      QuilvynUtils.getAttrValue(attrs, 'Group'),
      QuilvynUtils.getAttrValue(attrs, 'Level'),
      QuilvynUtils.getAttrValue(attrs, 'Description')
    );
  else if(type == 'Weapon')
    SRD5E.weaponRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Level'),
      QuilvynUtils.getAttrValue(attrs, 'Category'),
      QuilvynUtils.getAttrValue(attrs, 'Damage'),
      QuilvynUtils.getAttrValue(attrs, 'Range')
    );
  else {
    console.log('Unknown choice type "' + type + '"');
    return;
  }
  if(type != 'Feature') {
    type = type == 'Class' ? 'levels' :
    type = type == 'Deity' ? 'deities' :
    (type.charAt(0).toLowerCase() + type.substring(1).replace(/ /g, '') + 's');
    rules.addChoice(type, name, attrs);
  }
};

/* Defines in #rules# the rules associated with alignment #name#. */
SRD5E.alignmentRules = function(rules, name) {
  if(!name) {
    console.log('Empty alignment name');
    return;
  }
  // No rules pertain to alignment
};

/*
 * Defines in #rules# the rules associated with armor #name#, which adds #ac#
 * to the character's armor class, requires a #weight# proficiency level to
 * use effectively, allows a maximum dex bonus to ac of #maxDex#, requires (if
 * specified) a strength of #minStr# to avoid a speed penalty, and is considered
 * bulky armor if #bulky# is true.
 */
SRD5E.armorRules = function(rules, name, ac, weight, maxDex, minStr, bulky) {

  if(!name) {
    console.log('Empty armor name');
    return;
  }
  if(typeof ac != 'number') {
    console.log('Bad ac "' + ac + '" for armor ' + name);
    return;
  }
  if(weight == null ||
     !(weight + '').match(/^([0-3]|none|light|medium|heavy)$/i)) {
    console.log('Bad weight "' + weight + '" for armor ' + name);
    return;
  }
  if(typeof maxDex != 'number') {
    console.log('Bad max dex "' + maxDex + '" for armor ' + name);
    return;
  }
  if(minStr != null && typeof minStr != 'number') {
    console.log('Bad min str "' + minStr + '" for armor ' + name);
    return;
  }
  if(bulky != null && typeof bulky != 'boolean') {
    console.log('Bad bulky "' + bulky + '" for skill ' + name);
  }

  if((weight + '').match(/^[0-3]$/))
    ; // empty
  else if(weight.match(/^none$/i))
    weight = 0;
  else if(weight.match(/^light$/i))
    weight = 1;
  else if(weight.match(/^medium$/i))
    weight = 2;
  else if(weight.match(/^heavy$/i))
    weight = 3;

  if(rules.armorStats == null) {
    rules.armorStats = {
      ac:{},
      weight:{},
      dex:{},
      str:{},
      bulky:{}
    };
  }
  rules.armorStats.ac[name] = ac;
  rules.armorStats.weight[name] = weight;
  rules.armorStats.dex[name] = maxDex;
  rules.armorStats.str[name] = minStr;
  rules.armorStats.bulky[name] = bulky;

  rules.defineRule('armorClass',
    '', '=', '10',
    'armor', '+', QuilvynUtils.dictLit(rules.armorStats.ac) + '[source]'
  );
  rules.defineRule('armorWeight',
    'armor', '=', QuilvynUtils.dictLit(rules.armorStats.weight) + '[source]'
  );
  rules.defineRule('combatNotes.dexterityArmorClassAdjustment',
    'armor', 'v', QuilvynUtils.dictLit(rules.armorStats.dex) + '[source]'
  );
  rules.defineRule('skillNotes.bulkyArmor',
    'armor', '=', QuilvynUtils.dictLit(rules.armorStats.bulky) + '[source]'
  );

};

/*
 * Defines in #rules# the rules associated with background #name#, which grants
 * the equipment, features, languages, and skills listed in #equipment#,
 * #features#, #languages#, and #skills#.
 */

SRD5E.backgroundRules = function(
  rules, name, equipment, features, languages, skills
) {

  var prefix =
    name.substring(0, 1).toLowerCase() + name.substring(1).replace(/ /g, '');

  rules.defineRule
    ('isBackground.' + name, 'background', '=', 'source == "' + name + '" ? 1 : null');

  for(var i = 0; i < features.length; i++) {
    var pieces = features[i].split(/:/);
    var feature = pieces[1];
    var featurePrefix =
      feature.substring(0, 1).toLowerCase() + feature.substring(1).replace(/ /g, '');
    var level = pieces[0];
    rules.defineRule(prefix + 'Features.' + feature,
      'isBackground.' + name, '?', null,
      'level', '=', 'source >= ' + level + ' ? 1 : null'
    );
    rules.defineRule
      ('features.' + feature, prefix + 'Features.' + feature, '+=', null);
  }
  rules.defineSheetElement(name + ' Features', 'Feats+', null, '; ');
  rules.defineChoice('extras', prefix + 'Features');

  if(languages.length > 0) {
    rules.defineRule
      ('languageCount', 'isBackground.' + name, '+', languages.length);
    for(var i = 0; i < languages.length; i++) {
      if(languages[i] != 'any')
        rules.defineRule
          ('languages.' + languages[i], 'isBackground.' + name, '=', '1');
    }
  }

  /* TODO
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
  */

  // TODO Do anything with equipment?

}


};

/*
 * Defines in #rules# the rules associated with class #name#, which has the list
 * of hard prerequisites #requires#. The class grants #hitDie# (format [n]'d'n)
 * additional hit points and #skillPoints# additional skill points with each
 * level advance. #attack# is one of '1', '1/2', or '3/4', indicating the base
 * attack progression for the class; similarly, #saveFort#, #saveRef#, and
 * #saveWill# are each one of '1/2' or '1/3', indicating the saving throw
 * progressions. #skills# indicate class skills for the class; see skillRules
 * for an alternate way these can be defined. #features# and #selectables# list
 * the fixed and selectable features acquired as the character advances in
 * class level, and #languages# lists any automatic languages for the class.
 * #casterLevelArcane# and #casterLevelDivine#, if specified, give the
 * Javascript expression for determining the caster level for the class; these
 * can incorporate a class level attribute (e.g., 'levels.Cleric') or the
 * character level attribute 'level'. #spellAbility#, if specified, names the
 * ability for computing spell difficulty class. #spellsPerDay# lists the
 * number of spells per level per day that the class can cast, and #spells#
 * lists spells defined by the class. #spellDict# is the dictionary of all
 * spells used to look up individual spell attributes.
 */
SRD5E.classRules = function(
  rules, name, requires, hitDie, attack, skillPoints, saveFort,
  saveRef, saveWill, skills, features, selectables, languages,
  casterLevelArcane, casterLevelDivine, spellAbility, spellsPerDay, spells,
  spellDict
) {


  rules.defineRule('featCount',
    'levels.' + name, '+=', 'source >= 19 ? 5 : Math.floor(source / 4)'
  );
  rules.defineRule('proficiencyBonus',
    'levels.' + name, '=', 'Math.floor((source + 7) / 4)'
  );

};

/*
 * Defines in #rules# the rules associated with class #name# that are not
 * directly derived from the parmeters passed to classRules.
 */
SRD5E.classRulesExtra = function(rules, name) {

  var proficiencyCount, proficiencyChoices, proficienciesGiven;

  if(name == 'Barbarian') {

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

    rules.defineRule('abilityNotes.rageFeature',
      'levels.Barbarian', '+=', 'source<3 ? 2 : source<6 ? 3 : source<12 ? 4 : source<17 ? 5 : source<20 ? 6 : "unlimited"'
    );
    rules.defineRule('armorClass',
      'combatNotes.barbarianUnarmoredDefenseFeature.2', '+', null
    );
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

  } else if(name == 'Bard') {

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

    rules.defineRule('abilityNotes.jackOfAllTradesFeature',
      'proficiencyBonus', '=', 'Math.floor(source / 2)'
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

  } else if(name == 'Cleric') {

    proficiencyCount = {'Save':2, 'Skill':2, 'Armor':3, 'Weapon':1};
    proficienciesGiven = {
      'Save':['Charisma', 'Wisdom'],
      'Armor':['Light Armor', 'Medium Armor', 'Shield'],
      'Weapon':['Simple']
    };
    proficiencyChoices = {
      'Skill':['History', 'Insight', 'Medicine', 'Persuasion', 'Religion']
    };
    spells = {
      'Life Domain':[
        '1:Bless:Cure Wounds',
        '3:Lesser Restoration:Spiritual Weapon',
        '5:Beacon Of Hope:Revivify',
        '7:Death Ward:Guardian Of Faith',
        '9:Mass Cure Wounds:Raise Dead'
      ]
    };

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

    rules.defineRule('features.Circle Of The Land',
      /druidFeatures.Circle Of The Land/, '=', '1'
    );
    rules.defineRule
      ('spellsKnown.D0', 'magicNotes.bonusCantripFeature', '+', '1');

  } else if(name == 'Fighter') {

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

    rules.defineRule('abilityNotes.remarkableAthleteFeature',
      'proficiencyBonus', '=', 'Math.ceil(source / 2)'
    );
    rules.defineRule
      ('attackBonus.Ranged', 'combatNotes.archeryStyleFeature', '+=', '2');
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

  } else if(name == 'Monk') {

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


  } else if(name == 'Paladin') {

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
    spells = {
      'Oath Of Devotion':[
        '3:Protection From Evil And Good:Sanctuary',
        '5:Lesser Restoration:Zone Of Truth',
        '9:Beacon Of Hope:Dispel Magic',
        '13:Freedom Of Movement:Guardian Of Faith',
        '17:Commune:Flame Strike'
      ]
    };

    rules.defineRule
      ('armorClass', 'combatNotes.defenseStyleFeature.1', '+', null);
    // Show Defense Style note even if armor == None
    rules.defineRule('combatNotes.defenseStyleFeature.1',
      'combatNotes.defenseStyleFeature', '?', null,
      'armor', '=', 'source == "None" ? null : 1'
    );
    rules.defineRule('combatNotes.extraAttackFeature',
      'levels.Paladin', '+=', 'source < 5 ? null : 1'
    );
    rules.defineRule('combatNotes.sacredWeaponFeature',
      'charismaModifier', '=', 'Math.max(source, 1)'
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

  } else if(name == 'Ranger') {

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

    rules.defineRule
      ('armorClass', 'combatNotes.defenseStyleFeature.1', '+', null);
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

  } else if(name == 'Rogue') {

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

    rules.defineRule('combatNotes.sneakAttackFeature',
      'levels.Rogue', '=', 'Math.floor((source + 1) / 2)'
    );
    rules.defineRule
      ('rogueFeatBonus', 'levels.Rogue', '=', 'source < 10 ? null : 1');
    rules.defineRule
      ('saveProficiencies.Wisdom', 'saveNotes.slipperyMindFeature', '=', '1');
    rules.defineRule('selectableFeatureCount.Rogue',
      'levels.Rogue', '=', 'source < 3 ? null : 1'
    );
    rules.defineRule('skillNotes.rogueExpertiseFeature',
      'levels.Rogue', '=', 'source < 6 ? 2 : 4'
    );
    rules.defineRule('skillNotes.second-StoryWorkFeature',
      'dexterityModifier', '=', null
    );

  } else if(name == 'Sorcerer') {

    proficiencyCount = {'Save':2, 'Skill':2, 'Weapon':5};
    proficienciesGiven = {
      'Save':['Charisma', 'Constitution'],
      'Weapon':['Dagger', 'Dart', 'Sling', 'Quarterstaff', 'Light Crossbow']
    };
    proficiencyChoices = {
      'Skill':['Arcana', 'Deception', 'Insight', 'Intimidation', 'Persuasion',
               'Religion']
    };

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

    rules.defineRule("combatNotes.darkOne'sBlessingFeature.1",
      "warlockFeatures.Dark One's Blessing", '?', null,
      'charismaModifier', '=', null,
      'levels.Warlock', '+', null,
      '', '^', '1'
    );
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

  } else if(name == 'Wizard') {

    proficiencyCount = {'Save':2, 'Skill':3, 'Weapon':5};
    proficienciesGiven = {
      'Save':['Intelligence', 'Wisdom'],
      'Weapon':['Dagger', 'Dart', 'Sling', 'Quarterstaff', 'Light Crossbow']
    };
    proficiencyChoices = {
      'Skill': ['Arcana', 'History', 'Insight', 'Investigation', 'Medicine',
                'Religion']
    };

    rules.defineRule('magicNotes.arcaneRecoveryFeature',
      'levels.Wizard', '=', 'Math.ceil(source / 2)'
    );
    rules.defineRule('magicNotes.empoweredEvocationFeature',
      'intelligenceModifier', '=', null
    );
    rules.defineRule('selectableFeatureCount.Wizard',
      'levels.Wizard', '=', 'source < 2 ? null : 1'
    );

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
          {name: 'Skill Proficiencies', within: 'FeaturesAndSkills', separator: listSep},
          {name: 'Skills', within: 'FeaturesAndSkills', columns: '3LE', separator: null},
          {name: 'Tool Proficiencies', within: 'FeaturesAndSkills', separator: listSep},
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
  }

  rules.defineNote(
    'sanityNotes.nonproficientArmorPenalty:' +
      'Disadv Dex, Str rolls, cannot cast spells',
    'skillNotes.bulkyArmor:Disadv Stealth'
  );
  rules.defineRule
    ('sanityNotes.nonproficientArmorPenalty', 'nonproficientArmor', '=', null);

  rules.defineRule('combatNotes.dexterityArmorClassAdjustment',
    'armor', 'v', 'SRD5E.armorsMaxDexBonuses[source]'
  );

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

/* Defines the rules related to character races. */
SRD5E.raceRules = function(rules, languages, races) {

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
