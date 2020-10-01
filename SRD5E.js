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
 * This module loads the rules from the System Reference Document v5.  The
 * SRD5E function contains methods that load rules for particular parts of the
 * SRD: raceRules for character races, magicRules for spells, etc.  These
 * member methods can be called independently in order to use a subset of the
 * SRD v5 rules.  Similarly, the constant fields of SRD5E (ALIGNMENTS, FEATS,
 * etc.) can be manipulated to modify the choices.
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
  rules.defineChoice('extras',
    'feats', 'featCount', 'sanityNotes', 'selectableFeatureCount',
    'validationNotes'
  );
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
SRD5E.CHOICES = [
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
      '"Holy Symbol","Prayer Book",Incense,Vestments,Clothing,"15 GP" ' +
    'Features=' +
      '1:Shelter Of The Faithful ' +
    'Language=any,any ' +
    'Skill=Insight,Religion'
};
SRD5E.DEITIES = {
  'None':'',
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
  'Ability Boost2':'Require="features.Ability Boost"',
  'Ability Boost3':'Require="features.Ability Boost2"',
  'Ability Boost4':'Require="features.Ability Boost3"',
  'Ability Boost5':'Require="features.Ability Boost4"',
  'Ability Boost6':'Require="features.Ability Boost5"',
  'Ability Boost7':'Require="features.Ability Boost6"',
  'Grappler':'Require="Strength >= 13"'
};
SRD5E.FEATURES = {
  // Background
  'Shelter Of The Faithful':'Section=feature Note="Aid from associated temple"',
  // Class
  'Action Surge':'Section=combat Note="Extra action %V/short rest"',
  'Additional Fighting Style':'Section=combat Note="Select second Fighting Style"',
  'Additional Magical Secrets':'Section=magic Note="Learn 2 additional spells from any class"',
  'Agonizing Blast':'Section=magic Note="<i>Eldritch Blast</i> +%V HP"',
  'Arcane Recovery':'Section=magic Note="Short rest recovers %V spell slots 1/dy"',
  'Archdruid':'Section=magic Note="Unlimited Wild Shape"',
  'Archery Style':'Section=combat Note="+2 ranged attack"',
  'Armor Of Shadows':'Section=magic Note="<i>Mage Armor</i> at will"',
  'Ascendant Step':'Section=magic Note="<i>Levitate</i> at will"',
  'Aura Of Courage':'Section=save Note="R%V\' Self and allies immune fright"',
  'Aura Of Devotion':'Section=save Note="R%V\' Self and allies immune charm"',
  'Aura Of Protection':'Section=save Note="R%V\' +%1 saves self and allies"',
  'Barbarian Unarmored Defense':'Section=combat Note="+%1 AC in no armor"',
  'Bard Expertise':'Section=skill Note="Dbl Prof %V skills"',
  'Bardic Inspiration':'Section=magic Note="R60\' Grant 1d%V w/in 10 min %1/long rest"',
  'Beast Speech':'Section=magic Note="<i>Speak With Animals</i> at will"',
  'Beast Spells':'Section=magic Note="Cast spells during Wild Shape"',
  'Beguiling Influence':'Section=skill Note="Prof Deception/Prof Persuasion"',
  'Bewitching Whispers':'Section=magic Note="<i>Compulsion</i> 1/long rest"',
  'Blessed Healer':'Section=magic Note="Self regain 2 + spell level HP from casting healing spells"',
  'Blindsense':'Section=skill Note="R10\' Hear hidden/invisible creatures"',
  'Bonus Cantrip':'Section=magic Note="Additional Druid cantrip"',
  'Bonus Skills':'Section=skill Note="Prof 3 additional skills"',
  'Book Of Ancient Secrets':'Section=magic Note="Inscribe rituals in Book Of Shadows"',
  'Brutal Critical':'Section=combat Note="+%V crit damage dice"',
  'Careful Spell':'Section=magic Note="Spend 1 Sorcery Point to protect %V creature(s) from your spell"',
  'Chains Of Carceri':'Section=magic Note="<i>Hold Monster</i> on celestial, elemental, fiend 1/long rest"',
  'Channel Divinity':'Section=feature Note="Effect %V/short rest"',
  'Cleansing Touch':'Section=magic Note="Touch dispels %V/long rest"',
  'Countercharm':'Section=magic Note="R30\' Friendly listeners Adv vs. charm, fright"',
  'Cunning Action':'Section=combat Note="Bonus Dash, Disengage, or Hide each turn"',
  'Cutting Words':'Section=combat Note="R60\' Reaction to subtract Bardic Inspiration die from foe roll"',
  'Danger Sense':'Section=save Note="Adv Dex checks vs. visible dangers"',
  "Dark One's Blessing":'Section=combat Note="Gain %1 HP when foe drops to 0"',
  "Dark One's Own Luck":'Section=feature Note="Add d10 to ability or save 1/short rest"',
  "Devil's Sight":'Section=feature Note="R120\' See 1 light level better"',
  'Defense Style':'Section=combat Note="+1 AC in armor"',
  'Deflect Missiles':'Section=combat Note="React to reduce missile damage by 1d10+%V"',
  'Destroy Undead':'Section=combat Note="Turn destroys up to CR %V"',
  'Diamond Soul':'Section=save Note="Prof all saves, spend 1 Ki to re-roll"',
  'Disciple Of Life':'Section=magic Note="Healing spells restore additional 2 + spell level HP"',
  'Distant Spell':'Section=magic Note="Spend 1 Sorcery Point to dbl spell range or touch at 30\'"',
  'Divine Health':'Section=save Note="Immune disease"',
  'Divine Intervention':'Section=magic Note="%V% chance of deity help 1/wk"',
  'Divine Sense':'Section=magic Note="R60\' Know location of celestials, fiends, undead %V/long rest"',
  'Divine Smite':'Section=combat Note="Spend spell slot for +(spell level + 1)d8 damage"',
  'Divine Strike':'Section=combat Note="+%Vd8 HP 1/turn"',
  'Draconic Presence':'Section=magic Note="R60\' Spend 5 Sorcery Points for awe/fear aura for 1 min/conc (Wis neg)"',
  'Draconic Resilience':'Section=combat Note="+%V HP, unarmored AC %1"',
  'Dragon Wings':'Section=ability Note="Fly at full speed"',
  'Dreadful Word':'Section=magic Note="<i>Confusion</i> 1/long rest"',
  'Druid Timeless Body':'Section=feature Note="Age at 1/10 rate"',
  'Dueling Style':'Section=combat Note="+2 damage with single, one-hand weapon"',
  'Eldritch Invocations':'Section=magic Note="%V"',
  'Eldritch Master':'Section=magic Note="Regain spells from patron 1/long rest"',
  'Eldritch Sight':'Section=magic Note="<i>Detect Magic</i> at will"',
  'Eldritch Spear':'Section=magic Note="R300\' <i>Eldritch Blast</i>"',
  'Elemental Affinity':'Section=magic Note="+%V HP damage with ancestry type, spend 1 Sorcery Point for 1 hr resistance"',
  'Elusive':'Section=combat Note="Foe attacks never have Adv"',
  'Empowered Evocation':'Section=magic Note="+%V HP evocation spell damage"',
  'Empowered Spell':'Section=magic Note="Spend 1 Sorcery Point to re-roll %V spell damage dice"',
  'Empty Body':'Section=magic Note="Spend 4 Ki for <i>Invisibility</i> 1 min, 8 Ki for <i>Astral Projection</i>"',
  'Escape The Horde':'Section=combat Note="Foe Disadv on OA"',
  'Evasion':'Section=save Note="Dex save yields no damage instead of half"',
  'Evocation Savant':'Section=magic Note="Write evocation spells for half cost"',
  'Extended Spell':'Section=magic Note="Spend 1 sorcery point to dbl spell duration"',
  'Extra Attack':'Section=combat Note="%V additional attack per Attack action"',
  'Eyes Of The Rune Keeper':'Section=feature Note="Read all writing"',
  'Fast Hands':'Section=combat Note="Use Cunning Action for Sleight Of Hand, disarm trap, open lock, Use An Object"',
  'Fast Movement':'Section=ability Note="+10 speed (heavy armor neg)"',
  'Favored Enemy':'Section=skill Note="Adv Survival to track, info about %V creature types, learn enemy language"',
  'Feral Instinct':'Section=combat Note="Adv Init, rage and act when surprised"',
  'Feral Senses':'Section=combat,skill Note="No Disadv vs. invisible foe","30\' awareness of invisible creatures"',
  'Fiendish Resilience':'Section=save Note="Resist chosen damage type"',
  'Fiendish Vigor':'Section=magic Note="Self <i>False Life</i> at will"',
  'Flexible Casting':'Section=magic Note="Convert Sorcery Points to/from spell slots"',
  'Flurry Of Blows':'Section=combat Note="Spend 1 Ki for 2 additional unarmed strikes"',
  'Foe Slayer':'Section=combat Note="+%V attack or damage vs. favored enemy"',
  'Font Of Inspiration':'Section=feature Note="Refresh Bardic Inspiration after short rest"',
  'Font Of Magic':'Section=magic Note="%V Sorcery Points/long rest"',
  'Frenzy':'Section=combat Note="Bonus attack during rage, exhausted after"',
  'Gaze Of Two Minds':'Section=magic Note="Perceive via willing touched senses for 1 turn"',
  'Heightened Spell':'Section=magic Note="Spend 3 Sorcery Points for target Disadv on spell save"',
  'Hide In Plain Sight':'Section=skill Note="+10 Dex (Stealth) to hide w/prepared camouflage"',
  'Holy Nimbus':'Section=magic,save Note="Self 30\' bright light does 10 HP to foes 1/long rest","Adv vs. spells by fiends, undead"',
  'Horde Breaker':'Section=combat Note="Second attack on different adjacent foe"',
  'Hurl Through Hell':'Section=combat Note="Foe trip to hell 10d10 psychic HP 1/long rest"',
  'Improved Critical':'Section=combat Note="Crit on natural 19"',
  'Improved Divine Smite':'Section=combat Note="+1d8 melee damage"',
  'Improved Unarmored Movement':'Section=ability Note="Move across vertical surfaces and liquids"',
  'Indomitable Might':'Section=ability Note="Use Str instead of roll for Str check"',
  'Indomitable':'Section=save Note="Re-roll failed save %V/long rest"',
  'Intimidating Presence':'Section=feature Note="R30\' Target creature fright (DC %V Will neg)"',
  'Jack Of All Trades':'Section=ability Note="+%V non-proficient ability checks"',
  'Ki':'Section=feature Note="%V Ki points/short rest"',
  'Ki-Empowered Strikes':'Section=combat Note="Unarmed attacks count as magical"',
  "Land's Stride":'Section=ability,save Note="Move normally through difficult terrain","Adv vs. impeding plants"',
  'Lay On Hands':'Section=magic Note="Heal %V HP, disease, poison 1/long rest"',
  'Lifedrinker':'Section=combat Note="+%V HP w/pact weapon"',
  'Magical Secrets':'Section=magic Note="Learn %V additional spells from any class"',
  'Martial Arts':'Section=combat Note="When unarmored, +%1 monk weapons attack and damage, raise damage die to 1d%V"',
  'Mask Of Many Faces':'Section=magic Note="<i>Disguise Self</i> at will"',
  'Master Of Myriad Forms':'Section=magic Note="<i>Alter Self</i> at will"',
  'Mindless Rage':'Section=save Note="Immune charm, fright during rage"',
  'Minions Of Chaos':'Section=magic Note="<i>Conjure Elemental</i> 1/long rest"',
  'Mire The Mind':'Section=magic Note="<i>Slow</i> 1/long rest"',
  'Misty Visions':'Section=magic Note="<i>Silent Image</i> at will"',
  'Monk Bonus Attack':'Section=combat Note="Unarmed strike after monk weapon attack"',
  'Monk Timeless Body':'Section=feature Note="No debility from aging, need no food or water"',
  'Monk Unarmored Defense':'Section=combat Note="+%1 AC in no armor"',
  'Multiattack Defense':'Section=combat Note="+4 AC on additional foe attacks after hit"',
  'Mystic Arcanum':'Section=magic Note="%V spells 1/long rest"',
  'Natural Explorer':'Section=skill Note="Dbl Int/Wis Prof, normal move in difficult terrain, always alert, full speed solo stealth, locate dbl food, extra track info for %V terrains"',
  'Natural Recovery':'Section=magic Note="Recover %V spell slot levels in short rest"',
  "Nature's Sanctuary":'Section=combat Note="Beast, plant DC %V Will save to attack self"',
  "Nature's Ward":'Section=save Note="Immune disease, poison, elemental and fey charm and fright"',
  'One With Shadows':'Section=magic Note="Invisible in dim light until action"',
  'Open Hand Technique':'Section=combat Note="On Flurry of Blows hit, choice of knock prone (DC %V Dex neg), push 15\' (DC %V Str neg), or no foe react 1 turn"',
  'Otherworldly Leap':'Section=magic Note="Self <i>Jump</i> at will"',
  'Overchannel':'Section=magic Note="Max damage from evocation spell le level 5, self take damage 2nd+ time/long rest"',
  'Pact Of The Blade':'Section=magic Note="Create magic weapon"',
  'Pact Of The Chain':'Section=magic Note="<i>Find Familiar</i>"',
  'Pact Of The Tome':'Section=magic Note="<i>Book Of Shadows</i> w/3 cantrips"',
  'Patient Defense':'Section=combat Note="Spend 1 Ki to Dodge (foe attack Disadv)"',
  'Peerless Skill':'Section=ability Note="Add Bardic Inspiration die to ability check"',
  'Perfect Self':'Section=combat Note="Min 4 Ki after Init"',
  'Persistent Rage':'Section=combat Note="Rage has no time limit"',
  'Potent Cantrip':'Section=magic Note="Target takes half damage on cantrip save"',
  'Preserve Life':'Section=magic Note="R30\' Channel Divinity to restore %V HP among targets, up to half max HP ea"',
  'Primal Champion':'Section=ability Note="+4 strength/+4 constitution"',
  'Primeval Awareness':'Section=magic Note="Expend spell to sense creatures in 1 mi (favored terrain 6 mi)"',
  'Purity Of Body':'Section=save Note="Immune disease, poison"',
  'Purity Of Spirit':'Section=magic Note="Self continuous <i>Protection From Evil And Good</i>"',
  'Quickened Spell':'Section=magic Note="Spend 2 Sorcery Points to cast spell as bonus action"',
  'Quivering Palm':'Section=combat Note="Spend 3 Ki to reduce foe to 0 HP w/in 1 dy after unarmed hit (DC %V Con 10d10 HP)"',
  'Rage':'Section=ability,combat Note="Adv Str checks %V/long rest (heavy armor neg)","+%1 melee damage, resist bludgeon/pierce/slash damage for 1 min %V/long rest (heavy armor neg)"',
  'Reckless Attack':'Section=combat Note="Adv melee Str attacks, foes Adv all attacks"',
  'Relentless Rage':'Section=combat Note="DC 10+ Con to keep 1 HP when brought to 0"',
  'Reliable Talent':'Section=ability Note="Min 10 on Prof ability rolls"',
  'Remarkable Athlete':'Section=ability,skill Note="+%V non-proficient Str, Dex, Con checks","+%V\' running jump"',
  'Repelling Blast':'Section=magic Note="<i>Eldritch Blast</i> pushes 10\'"',
  'Retaliation':'Section=combat Note="Melee attack reaction after taking damage"',
  'Ritual Casting':'Section=magic Note="Cast known spell as ritual"',
  'Rogue Expertise':'Section=skill Note="Dbl Prof %V skills or thieves\' tools"',
  'Sacred Weapon':'Section=combat Note="Channel Divinity for weapon +%V attack, 20\' light for 1 min"',
  'Sculpt Spells':'Section=magic Note="Protect spell level + 1 targets from evocation spell effects"',
  'Sculptor Of Flesh':'Section=magic Note="<i>Polymorph</i> 1/long rest"',
  'Second Wind':'Section=combat Note="Regain 1d10+%V HP 1/short rest"',
  'Second-Story Work':'Section=ability,skill Note="Full speed climb","+%V\' Jump"',
  'Sign Of Ill Omen':'Section=magic Note="<i>Bestow Curse</i> 1/long rest"',
  'Signature Spell':'Section=magic Note="Cast 2 W3 1/short rest"',
  'Slippery Mind':'Section=save Note="Prof Wisdom"',
  'Slow Fall':'Section=ability Note="-%V HP fall damage"',
  'Sneak Attack':'Section=combat Note="+%Vd6 damage on Adv/shared threat attacks"',
  'Song Of Rest':'Section=magic Note="Listeners regain 1d%V HP after short rest"',
  'Sorcerous Restoration':'Section=magic Note="Regain 4 Sorcery Points/short rest"',
  'Spell Mastery':'Section=magic Note="Cast 1 ea W1, W2 at will"',
  'Stand Against The Tide':'Section=combat Note="Redirect foe miss to another creature"',
  'Steel Will':'Section=save Note="Adv vs. fright"',
  'Step Of The Wind':'Section=combat Note="Spend 1 Ki to Disengage or Dash, dbl jump"',
  'Stillness Of Mind':'Section=save Note="End self charm, fright at will"',
  'Stroke Of Luck':'Section=ability,combat Note="Automatic 20 ability check 1/short rest","Turn miss into hit 1/short rest"',
  'Stunning Strike':'Section=combat Note="Spend 1 Ki to stun foe (DC %V Con neg)"',
  'Subtle Spell':'Section=magic Note="Spend 1 Sorcery Point to cast w/out somatic, verbal components"',
  'Superior Critical':'Section=combat Note="Crit on natural 18"',
  'Superior Inspiration':'Section=combat Note="Min 1 Bardic Inspiration after Init"',
  'Supreme Healing':'Section=magic Note="Healing spells yield max HP"',
  'Supreme Sneak':'Section=skill Note="Adv Stealth at half speed"',
  'Survivor':'Section=combat Note="Regain %V HP each turn when between 1 and %1"',
  'Thief Of Five Fates':'Section=magic Note="<i>Bane</i> 1/long rest"',
  "Thief's Cant":'Section=skill Note="Signs and symbols known only by rogues"',
  "Thief's Reflexes":'Section=combat Note="First round extra turn at -10 Init"',
  'Thirsting Blade':'Section=combat Note="Attack twice each turn w/pact blade"',
  'Tongue Of Sun And Moon':'Section=feature Note="Communicate in any language"',
  'Tranquility':'Section=magic Note="Self <i>Sanctuary</i> until next long rest (DC %V Wis neg)"',
  'Turn The Unholy':'Section=magic Note="R30\' Channel Divinity for fiends, undead flee for 1 min (Wis neg)"',
  'Turn Undead':'Section=combat Note="R30\' Undead flee for 1 min (%V DC Wis neg)"',
  'Twinned Spell':'Section=magic Note="Spend spell level Sorcery Points to add second target"',
  'Two-Weapon Fighting Style':'Section=combat Note="Add ability modifier to second attack damage"',
  'Unarmored Movement':'Section=ability Note="+%V speed in no armor"',
  'Uncanny Dodge':'Section=combat Note="Use reaction for half damage"',
  'Use Magic Device':'Section=skill Note="Ignore restrictions on magic device use"',
  'Vanish':'Section=skill Note="Hide as bonus action, untrackable non-magically"',
  'Visions Of Distant Realms':'Section=magic Note="<i>Arcane Eye</i> at will"',
  'Voice Of The Chain Master':'Section=feature Note="Perceive, speak via familiar"',
  'Volley':'Section=combat Note="Ranged attack any number of foes in 10\' radius"',
  'Whirlwind Attack':'Section=combat Note="Melee attack any number of adjacent foes"',
  'Whispers Of The Grave':'Section=magic Note="<i>Speak With Dead</i> at will"',
  'Wholeness Of Body':'Section=feature Note="Regain %V HP 1/long rest"',
  'Wild Shape':'Section=magic Note="Transform into CR %1%2 creature for %3 hr 2/short rest"',
  'Witch Sight':'Section=feature Note="R30\' See true forms"',
  // Feats
  'Ability Boost':'Section=ability Note="%V to distribute"',
  'Grappler':'Section=combat Note="Adv attacks vs. grappled foe, additional grapple to pin"',
  // Races
  "Artificer's Lore":'Section=skill Note="Dbl Prof on magic, alchemical, tech objects History checks"',
  'Brave':'Section=save Note="Adv vs. fright"',
  'Cantrip':'Section=magic Note="Additional Wizard cantrip"',
  'Darkvision':'Section=feature Note="R60\' See one light level better"',
  'Draconic Breath':'Section=combat,save Note="%1 %Vd6 HP %2 (DC %3 %4 half)","Resistance %V damage"',
  'Dragonborn Ability Adjustment':'Section=ability Note="+2 Strength/+1 Charisma"',
  'Dwarven Armor Speed':'Section=ability Note="No speed penalty in heavy armor"',
  'Dwarven Resilience':'Section=save Note="Adv vs. poison, resistance poison damage"',
  'Dwarven Toughness':'Section=combat Note="+%V HP"',
  'Fey Ancestry':'Section=save Note="Adv vs. charmed, immune sleep"',
  'Gnome Cunning':'Section=save Note="Adv Cha/Int/Wis vs magic"',
  'Half-Elf Ability Adjustment':'Section=ability Note="+2 Charisma/+1 any two"',
  'Half-Orc Ability Adjustment':'Section=ability Note="+2 Strength/+1 Constitution"',
  'Halfling Luck':'Section=feature Note="Re-roll 1 on attack/ability/save"',
  'Halfling Nimbleness':'Section=ability Note="Move through space occupied by larger creature"',
  'Hellish Resistance':'Section=save Note="Resistance fire damage"',
  'High Elf Ability Adjustment':'Section=ability Note="+2 Dexterity/+1 Intelligence"',
  'Hill Dwarf Ability Adjustment':'Section=ability Note="+2 Constitution/+1 Wisdom"',
  'Human Ability Adjustment':'Section=ability Note="+1 charisma/+1 constitution/+1 dexterity/+1 intelligence/+1 strength/+1 wisdom"',
  'Infernal Legacy':'Section=magic Note="<i>Thaumaturgy</i> cantrip%V"',
  'Keen Senses':'Section=skill Note="Prof Perception"',
  'Lightfoot Halfling Ability Adjustment':'Section=ability Note="+2 Dexterity/+1 Charisma"',
  'Menacing':'Section=skill Note="Prof Intimidation"',
  'Naturally Stealthy':'Section=feature Note="Hide behind larger creature"',
  'Relentless Endurance':'Section=combat Note="Keep 1 HP when brought to 0 1/long rest"',
  'Rock Gnome Ability Adjustment':'Section=ability Note="+2 Intelligene/+1 Constitution"',
  'Savage Attacks':'Section=combat Note="Extra die on crit damage"',
  'Skill Versatility':'Section=skill Note="+2 Skill Proficiency Count"',
  'Slow':'Section=ability Note="-5 Speed"',
  'Small':'Section=combat Note="Disadv heavy weapons"',
  'Stonecunning':'Section=skill Note="Dbl Prof on stonework History checks"',
  'Tiefling Ability Adjustment':'Section=ability Note="+2 charisma/+1 intelligence"',
  'Tinker':'Section=skill Note="Prof Tinker\'s Tools"',
  'Trance':'Section=feature Note="4 hr meditation gives benefit of 8 hr sleep"',
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
  'Dwarvish':'',
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
    'Description="R90\' Ranged spell attack 4d4 HP (miss half), 2d4 HP next turn"',
  'Acid Splash':
    'School=Conjuration ' +
    'Description="R60\' Ranged touch ${Math.floor((lvl+1)/6) + 1}d6 HP acid (Dex neg)"',
  'Aid':
    'School=Abjuration ' +
    'Description="R30\' Three targets +5 or more HP for 8 hr"',
  'Alarm':
    'School=Abjuration ' +
    'Description="R30\' Alert when tiny or larger creature enters 20\' cu for 8 hr"',
  'Alter Self':
    'School=Transmutation ' +
    'Description="Self aquatic, look different, or nat weapons for conc/1 hr"',
  'Animal Friendship':
    'School=Enchantment ' +
    'Description="R30\' Target beast(s) convinced of good intent for 1 dy (Wis neg)"',
  'Animal Messenger':
    'School=Enchantment ' +
    'Description="R30\' Tiny beast target move 24+ hr to deliver 25-word message to person described"',
  'Animal Shapes':
    'School=Transmutation ' +
    'Description="R30\' Polymorph all targets in range into max CR 4 max lg creature"',
  'Animate Dead':
    'School=Necromancy ' +
    'Description="R10\' Animate med/small bones/corpse, command w/in 60\' for 1 dy"',
  'Animate Objects':
    'School=Transmutation ' +
    'Description="R120\' Animate 10 sm/5 md/2 lg/1 hg objects, command w/in 500\' for conc/1 min"',
  'Antilife Shell':
    'School=Abjuration ' +
    'Description="Self 10\' sphere prevents living passage for conc/1 hr"',
  'Antimagic Field':
    'School=Abjuration ' +
    'Description="Self 10\' sphere suppresses magic for conc/1 hr"',
  'Antipathy/Sympathy':
    'School=Enchantment ' +
    'Description="R60\' Target object repels/attracts specified creatures for 10 dy"',
  'Arcane Eye':
    'School=Divination ' +
    'Description="R30\' See through invisible eye for conc/1 hr"',
  'Arcane Hand':
    'School=Evocation ' +
    'Description="R120\' AC20, Str 26, Dex 10 hand can punch, push, grasp, block for conc/1 min"',
  'Arcane Lock':
    'School=Abjuration ' +
    'Description="Touched barrier passable only by designated until dispelled"',
  'Arcane Sword':
    'School=Evocation ' +
    'Description="Force weapon 3d10, move 20\' for conc/1 min"',
  "Arcanist's Magic Aura":
    'School=Illusion ' +
    'Description="Target reports false divinations for 1 dy"',
  'Astral Projection':
    'School=Necromancy ' +
    'Description="Self + 8 companions w/in 10\' project to astral plane until dispelled or 0 HP"',
  'Augury':
    'School=Divination ' +
    'Description="Discern whether act w/in 30 min will yield weal/woe"',
  'Awaken':
    'School=Transmutation ' +
    'Description="Touched beast or plant Int 10, friendly for 30 dy"',

  'Bane':
    'School=Enchantment ' +
    'Description="R30\' 3 targets -1d4 from attack/save (Cha neg) for conc/1 min"',
  'Banishment':
    'School=Abjuration ' +
    'Description="R60\' target banish to home/demiplane (Cha neg) for conc/1 min"',
  'Barkskin':
    'School=Transmutation ' +
    'Description="Touched AC 16 for conc/1 hr"',
  'Beacon Of Hope':
    'School=Abjuration ' +
    'Description="R30\' Targets Adv Wis/death saves, max heal for conc/1 min"',
  'Bestow Curse':
    'School=Necromancy ' +
    'Description="Touched one of Disadv specified ability rolls, Disadv self attacks, Wis save to take action, take +1d8 HP necrotic from self attacks (Wis neg) for conc/1 min"',
  'Black Tentacles':
    'School=Conjuration ' +
    'Description="R90\' All in 20\' sq 3d6 HP and restrained for conc/1 min (Dex neg)"',
  'Blade Barrier':
    'School=Evocation ' +
    'Description="R90\' 100\'x20\'x5\' blade wall passers 6d10 HP slashing (Dex neg) for conc/10 min"',
  'Bless':
    'School=Enchantment ' +
    'Description="R30\' 3 targets +1d4 to attack/save rolls for conc/1 min"',
  'Blight':
    'School=Necromancy ' +
    'Description="R30\' target 8d8 HP necrotic (Con half)"',
  'Blindness/Deafness':
    'School=Necromancy ' +
    'Description="R30\' target blind or deaf (Con neg) for 1 min"',
  'Blink':
    'School=Transmutation ' +
    'Description="Self 50% chance of ethereal for 1 min"',
  'Blur':
    'School=Illusion ' +
    'Description="Self foes Disadv attack for conc/1 min"',
  'Branding Smite':
    'School=Evocation ' +
    'Description="Self next attack +2d6 HP radiant and visible for conc/1 min"',
  'Burning Hands':
    'School=Evocation ' +
    'Description="15\' cone 3d6 HP fire (Dex half)"',

  'Call Lightning':
    'School=Evocation ' +
    'Description="R120\' Conjured storm cloud generates bolt for 3d10 HP (Dex half) in 5\' radius each rd for conc/10 min"',
  'Calm Emotions':
    'School=Enchantment ' +
    'Description="R60\' 10\' radius suppresses charm/fright or hostility (Cha neg) for conc/1 min"',
  'Chain Lightning':
    'School=Evocation ' +
    'Description="R150\' 4 targets in 30\' radius 10d8 HP lightning (Dex half)"',
  'Charm Person':
    'School=Enchantment ' +
    'Description="R30\' Target regards you as friend (Wis neg) for 1 hr/until harmed"',
  'Chill Touch':
    'School=Necromancy ' +
    'Description="R120\' Ghost hand ${Math.floor((lvl + 1) / 6) + 1} HP necrotic, undead also Disadv self attack for 1 rd"',
  'Circle Of Death':
    'School=Necromancy ' +
    'Description="R150\' 60\' radius 8d6 HP necrotic (Con half)"',
  'Clairvoyance':
    'School=Divination ' +
    'Description="R1 mi Invisible sensor allows sight or hearing for conc/10 min"',
  'Clone':
    'School=Necromancy ' +
    'Description="Grow backup body for touched target"',
  'Cloudkill':
    'School=Conjuration ' +
    'Description="R120\' 20\' radius 5d8 HP poison (Con half), moves 10\'/rd for conc/10 min"',
  'Color Spray':
    'School=Illusion ' +
    'Description="Self 15\' cone 6d10 HP targets blinded for 1 rd"',
  'Command':
    'School=Enchantment ' +
    'Description="R60\' Target obeys one-word command (Wis neg)"',
  'Commune':
    'School=Divination ' +
    'Description="Self receive 3 yes/no answers w/in 1 min"',
  'Commune With Nature':
    'School=Divination ' +
    'Description="Self gain 3 facts about territory w/in 3 miles"',
  'Comprehend Languages':
    'School=Divination ' +
    'Description="Self understand all language for 1 hr"',
  'Compulsion':
    'School=Enchantment ' +
    'Description="R30\' Self control target movement (Wis neg) for conc/1 min"',
  'Cone Of Cold':
    'School=Evocation ' +
    'Description="Self 60\' cone 8d8 HP cold (Con half)"',
  'Confusion':
    'School=Enchantment ' +
    'Description="R90\' Targets in 10\' radius act randomly (Wis neg) for conc/1 min"',
  'Conjure Animals':
    'School=Conjuration ' +
    'Description="R60\' Summon obedient fey creatures for conc/1 hr"',
  'Conjure Celestial':
    'School=Conjuration ' +
    'Description="R90\' Summon obedient celestial for conc/1 hr"',
  'Conjure Elemental':
    'School=Conjuration ' +
     'Description="R90\' Summon obedient elemental in appropriate environment for conc/1 hr"',
  'Conjure Fey':
    'School=Conjuration ' +
    'Description="R90\' Summon obedient fey for conc/1 hr"',
  'Conjure Minor Elementals':
    'School=Conjuration ' +
    'Description="R90\' Summon obedient elements for conc/1 hr"',
  'Conjure Woodland Beings':
    'School=Conjuration ' +
    'Description="R60\' Summon obedient fey for conc/1 hr"',
  'Contact Other Plane':
    'School=Divination ' +
    'Description="Contact extraplanar being for five one-word answers (DC 15 Int or take 6d6 HP psychic)"',
  'Contagion':
    'School=Necromancy ' +
    'Description="Touched poisoned, then diseased after failing 3 Con saves (3 successes neg)"',
  'Contingency':
    'School=Evocation ' +
    'Description="Cast spell becomes active on trigger w/in 10 dy"',
  'Continual Flame':
    'School=Evocation ' +
    'Description="Touched emits heatless flame until dispelled"',
  'Control Water':
    'School=Transmutation ' +
    'Description="R300\' Part, redirect, raise, or whirl 100\'x100\' water for conc/10 min"',
  'Control Weather':
    'School=Transmutation ' +
    'Description="Determine weather in 5 mi radius for conc/8 hr"',
  'Counterspell':
    'School=Abjuration ' +
    'Description="R60\' Neg spell le level 3, DC 10+spell level for higher"',
  'Create Food And Water':
    'School=Conjuration ' +
    'Description="R30\' Create 40 lb food and 30 gal water"',
  'Create Or Destroy Water':
    'School=Transmutation ' +
    'Description="R30\' Affect 10 gal water"',
  'Create Undead':
    'School=Necromancy ' +
    'Description="R10\' Create 3 ghouls, obedient for 1 dy, renewable"',
  'Creation':
    'School=Illusion ' +
    'Description="R30\' Create 5\' cu false matter lasting up to 1 dy"',
  'Cure Wounds':
    'School=Evocation ' +
    'Description="Touched heals 1d8+spell mod HP"',

  'Dancing Lights':
    'School=Evocation ' +
    'Description="R120\' 4 torch lights in 20\' radius move 60\' for conc/1 min"',
  'Darkness':
    'School=Evocation ' +
    'Description="R60\' Target centers 15\' radius lightless area for conc/10 min"',
  'Darkvision':
    'School=Transmutation ' +
    'Description="Touched see in dark for 8 hr"',
  'Daylight':
    'School=Evocation ' +
    'Description="R60\' Target centers 60\' radius bright light for 1 hr"',
  'Death Ward':
    'School=Abjuration ' +
    'Description="Touched keep 1 HP when next brought to 0"',
  'Delayed Blast Fireball':
    'School=Evocation ' +
    'Description="R150\' 20\' radius 12d6 HP (Dex half)"',
  'Demiplane':
    'School=Conjuration ' +
    'Description="R60\' Door leads to extradimensional 30\' room for 1 hr"',
  'Detect Evil And Good':
    'School=Divination ' +
    'Description="R30\' Self sense aligned outsider, consecration/desecration for conc/10 min"',
  'Detect Magic':
    'School=Divination ' +
    'Description="R30\' Self sense magic aura for conc/10 min"',
  'Detect Poison And Disease':
    'School=Divination ' +
    'Description="R30\' Self sense poison for conc/10 min"',
  'Detect Thoughts':
    'School=Divination ' +
    'Description="R30\' Self sense target thoughts for conc/1 min"',
  'Dimension Door':
    'School=Conjuration ' +
    'Description="R500\' Self + 1 other teleport"',
  'Disguise Self':
    'School=Illusion ' +
    'Description="Self appear different body size for 1 hr"',
  'Disintegrate':
    'School=Transmutation ' +
    'Description="R60\' Target 10d6+40 HP force (Dex neg)"',
  'Dispel Evil And Good':
    'School=Abjuration ' +
    'Description="Self aligned foes Disadv attack for conc/1 min"',
  'Dispel Magic':
    'School=Abjuration ' +
    'Description="R120\' End target effects le 3 level, higher DC 10+spell level"',
  'Divination':
    'School=Divination ' +
    'Description="Receive truthful reply about event w/in 1 wk"',
  'Divine Favor':
    'School=Evocation ' +
    'Description="Self weapon +1d4 radiant HP for conc/1 min"',
  'Divine Word':
    'School=Evocation ' +
    'Description="R30\' Targets deaf, blind, stunned or killed (Cha neg)"',
  'Dominate Beast':
    'School=Enchantment ' +
    'Description="R60\' Command target telepathically for conc/1 min (Wis neg)"',
  'Dominate Monster':
    'School=Enchantment ' +
    'Description="R60\' Command target telepathically for conc/1 hr (Wis neg)"',
  'Dominate Person':
    'School=Enchantment ' +
    'Description="R60\' Command target telepathically for conc/1 hr (Wis neg)"',
  'Dream':
    'School=Illusion ' +
    'Description="Touched communicate in dream with known target"',
  'Druidcraft':
    'School=Transmutation ' +
    'Description="R30\' Cause minor nature effects"',

  'Earthquake':
    'School=Evocation ' +
    'Description="R500\' Shaking in 100\' radius opens fissures and damages structures"',
  'Eldritch Blast':
    'School=Evocation ' +
    'Description="R120\' Ranged touch ${Math.max(Math.floor((lvl+1)/6),1)} rays do 1d10 HP ea"',
  'Enhance Ability':
    'School=Transmutation ' +
    'Description="Touched Adv on chosen ability checks for 1 hr"',
  'Enlarge/Reduce':
    'School=Transmutation ' +
    'Description="R30\' Target dbl/half size for conc/1 min"',
  'Entangle':
    'School=Conjuration ' +
    'Description="R90\' Growth ensnare those in 20\' sq for conc/1 min (Str neg)"',
  'Enthrall':
    'School=Enchantment ' +
    'Description="R60\' Target focused on caster for 1 min (Wis neg)"',
  'Etherealness':
    'School=Transmutation ' +
    'Description="Self on Ethereal Plane for up to 8 hrs"',
  'Expeditious Retreat':
    'School=Transmutation ' +
    'Description="Self Dash as bonus action for conc/10 min"',
  'Eyebite':
    'School=Necromancy ' +
    'Description="R60\' Target sleep, panic, or sick for conc/1 min"',

  'Fabricate':
    'School=Transmutation ' +
    'Description="R120\' Create product from raw materials"',
  'Faerie Fire':
    'School=Evocation ' +
    'Description="R60\' Objects in 20\' cu outlined (foe Adv attack) for conc/1 min (Dex neg)"',
  'Faithful Hound':
    'School=Conjuration ' +
    'Description="R30\' Invisible watchdog warns and attacks for 8 hr"',
  'False Life':
    'School=Necromancy ' +
    'Description="Self 1d4+4 temporary HP for 1 hr"',
  'Fear':
    'School=Illusion ' +
    'Description="Targets in 30\' cone Dash away for conc/1 min (Wis neg)"',
  'Feather Fall':
    'School=Transmutation ' +
    'Description="R60\' Five falling targets slow to 60\'/rd for 1 min"',
  'Feeblemind':
    'School=Enchantment ' +
    'Description="R150\' Target 4d6 HP psychic, Cha and Int drop to 1 (Int neg)"',
  'Find Familiar':
    'School=Conjuration ' +
    'Description="R10\' Telepathic communication w/summoned animal"',
  'Find Steed':
    'School=Conjuration ' +
    'Description="R30\' Summon loyal steed"',
  'Find The Path':
    'School=Divination ' +
    'Description="Know shortest path to destination for 1 dy"',
  'Find Traps':
    'School=Divination ' +
    'Description="R120\' Sense presence of traps"',
  'Finger Of Death':
    'School=Necromancy ' +
    'Description="R60\' Target 7d8+30 HP (Con half), obedient zombie if killed"',
  'Fire Bolt':
    'School=Evocation ' +
    'Description="R120\' Ranged spell 1d10 HP"',
  'Fire Shield':
    'School=Evocation ' +
    'Description="Self resist heat or cold, foe hit takes 2d8 HP for 10 min"',
  'Fire Storm':
    'School=Evocation ' +
    'Description="R150\' Objects in 10 10\' cu 7d10 HP (Dex half)"',
  'Fireball':
    'School=Evocation ' +
    'Description="R150\' Creatures in 20\' radius 8d6 HP (Dex half)"',
  'Flame Blade':
    'School=Evocation ' +
    'Description="Self flaming blade 3d6 HP, lights 10\' radius"',
  'Flame Strike':
    'School=Evocation ' +
    'Description="R60\' Objects in 10\' radius 2x4d6 HP (Dex half)"',
  'Flaming Sphere':
    'School=Conjuration ' +
    'Description="R60\' 5\' diameter sphere 2d6 HP (Dex half) move 30\' for conc/1 min"',
  'Flesh To Stone':
    'School=Transmutation ' +
     'Description="R60\' Target petrified after 3 failed saves for conc/1 min (Con x3 neg)"',
  'Floating Disk':
    'School=Conjuration ' +
    'Description="R30\' 3\'-diameter x 1\" force disk follows, holds 500 lbs at 3\' for 1 hr"',
  'Fly':
    'School=Transmutation ' +
    'Description="Touched fly 60\'/rd for conc/10 min"',
  'Fog Cloud':
    'School=Conjuration ' +
    'Description="R120\' 20\' radius fog obscures vision for conc/1 hr"',
  'Forbiddance':
    'School=Abjuration ' +
    'Description="Touched 40K\' sq bars teleport and portals, 5d10 HP on transit to chosen type for 1 dy"',
  'Forcecage':
    'School=Evocation ' +
    'Description="R100\' 20\' barred cube or 10\' solid box for 1 hr"',
  'Foresight':
    'School=Divination ' +
    'Description="Touched immune surprise, Adv attack, ability, save, foes Disadv attack for 8 hr"',
  'Freedom Of Movement':
    'School=Abjuration ' +
    'Description="Touched immune impediments for 1 hr"',
  'Freezing Sphere':
    'School=Evocation ' +
    'Description="R300\' Objects in 60\' radius 10d6 HP (Con half)"',

  'Gaseous Form':
    'School=Transmutation ' +
    'Description="Touched creature gaseous for conc/1 hr"',
  'Gate':
    'School=Conjuration ' +
    'Description="R60\' Open circular portal to another plane for conc/1 min"',
  'Geas':
    'School=Enchantment ' +
    'Description="R60\' Target charmed into obeying command for 30 dy (Wis neg)"',
  'Gentle Repose':
    'School=Necromancy ' +
    'Description="Touched corpse no decay or animation for 10 dy"',
  'Giant Insect':
    'School=Transmutation ' +
    'Description="R30\' 10 centipedes, five wasps, 3 spiders, or one scorpion giant, obey commands for conc/10 min"',
  'Glibness':
    'School=Transmutation ' +
    'Description="Self take 15 on Cha roll, detect truthful for 1 hr"',
  'Globe Of Invulnerability':
    'School=Abjuration ' +
    'Description="Self 10\' radius immune to spells level le 5"',
  'Glyph Of Warding':
    'School=Abjuration ' +
    'Description="Glyph 20\' radius 5d8 HP (Dex half) or spell levl le 3 on named trigger"',
  'Goodberry':
    'School=Transmutation ' +
    'Description="10 berries heal 1 HP, provide food for 1 dy"',
  'Grease':
    'School=Conjuration ' +
    'Description="R60\' creatures in 10\' sq fall (Dex neg) for 1 min"',
  'Greater Invisibility':
    'School=Illusion ' +
    'Description="Touched creature invisible for conc/1 min"',
  'Greater Restoration':
    'School=Abjuration ' +
    'Description="Touched creature unexhaust, uncharm, unpetrify, uncurse, or restored ability or HP"',
  'Guardian Of Faith':
    'School=Conjuration ' +
    'Description="R30\' Lg spectral guardian 20 HP to hostile creatures (Dex half) for 8 hr/60 HP"',
  'Guards And Wards':
    'School=Abjuration ' +
    'Description="Multiple magic effects protect 2500\' sq area for 1 dy"',
  'Guidance':
    'School=Divination ' +
    'Description="Touched +1d4 ability check w/in conc/1 min"',
  'Guiding Bolt':
    'School=Evocation ' +
    'Description="R120\' Ranged spell 4d6 HP, next foe attack in rd Adv"',
  'Gust Of Wind':
    'School=Evocation ' +
    'Description="60\'x10\' wind pushes 15\' (Str neg), half movement for conc/1 min"',

  'Hallow':
    'School=Evocation ' +
    'Description="60\' radius warded against outsiders, evokes boon spell"',
  'Hallucinatory Terrain':
    'School=Illusion ' +
    'Description="R300\' 150\' cube terrain illusion (Int(Investigation) disbelieve) for 1 dy"',
  'Harm':
    'School=Necromancy ' +
    'Description="R60\' Target 14d6 HP (Con half)"',
  'Haste':
    'School=Transmutation ' +
    'Description="R30\' Target dbl speed, +1 AC, bonus action for conc/1 min"',
  'Heal':
    'School=Evocation ' +
    'Description="R60\' Target heal 70 HP, unblind, undeaf, undisease"',
  'Healing Word':
    'School=Evocation ' +
    'Description="R60\' Target 1d4+modifier HP"',
  'Heat Metal':
    'School=Transmutation ' +
    'Description="R60\' Touching target metal causes 2d8 HP for conc/1 min"',
  'Hellish Rebuke':
    'School=Evocation ' +
    'Description="R60\' As a reaction, attacker 2d10 HP (Dex half)"',
  "Heroes' Feast":
    'School=Conjuration ' +
    'Description="R30\' 12 diners cured, immune poison and fright, Wis Adv, +2d10 HP for 1 dy"',
  'Heroism':
    'School=Enchantment ' +
    'Description="Touched immune fright, +modifier HP each rd for conc/1 min"',
  'Hideous Laughter':
    'School=Enchantment ' +
    'Description="R30\' Target ROFL for conc/1 min (Wis neg)"',
  'Hold Monster':
    'School=Enchantment ' +
    'Description="R90\' target frozen for conc/1 min (Wis neg)"',
  'Hold Person':
    'School=Enchantment ' +
    'Description="R60\' target frozen for conc/1 min (Wis neg)"',
  'Holy Aura':
    'School=Abjuration ' +
    'Description="Self 30\' radius targets Adv saves, foes Disadv attack"',
  "Hunter's Mark":
    'School=Divination ' +
    'Description="R90\' Self attacks on target +1d6 HP, Adv Wis(Perception/Survival) to locate for conc/1 hr"',
  'Hypnotic Pattern':
    'School=Illusion ' +
    'Description="R120\' creatures in 30\' cu charmed for conc/1 min (Wis neg)"',

  'Ice Storm':
    'School=Evocation ' +
    'Description="R300\' 20\' radius 4d6 HP (Dex half)"',
  'Identify':
    'School=Divination ' +
    'Description="Learn magic properties or spells affecting touched object or creature"',
  'Illusory Script':
    'School=Illusion ' +
    'Description="Writing legible only to specified creatures"',
  'Imprisonment':
    'School=Abjuration ' +
    'Description="R30\' Target restrained by choice of prisons (Wis neg)"',
  'Incendiary Cloud':
    'School=Conjuration ' +
    'Description="R150\' 20\' radius 10d8 HP (Dex half), moves 10\'/rd for conc/1 min"',
  'Inflict Wounds':
    'School=Necromancy ' +
    'Description="Touched 3d10 HP"',
  'Insect Plague':
    'School=Conjuration ' +
    'Description="R300\' 20\' radius 4d10 HP (Con half) for conc/10 min"',
  'Instant Summons':
    'School=Conjuration ' +
    'Description="Prepared 10 lb item appears in hand"',
  'Invisibility':
    'School=Illusion ' +
    'Description="Touched creature invisible for conc/1 hr or until attacks/casts"',
  'Irresistible Dance':
    'School=Enchantment ' +
    'Description="R30\' Target dance (Disadv Dex, attack, foes Adv attack) for conc/1 min (Wis neg)"',

  'Jump':
    'School=Transmutation ' +
    'Description="Touched jump x3 for 1 min"',

  'Knock':
    'School=Transmutation ' +
    'Description="R60\' Target unlocked, unstuck, or unbarred"',

  'Legend Lore':
    'School=Divination ' +
    'Description="Know info about named person, place, or object"',
  'Lesser Restoration':
    'School=Abjuration ' +
    'Description="Touched creature unblind, unparalyze, or unpoison"',
  'Levitate':
    'School=Transmutation ' +
    'Description="R60\' Target floats 20\' for conc/10 min (Con neg)"',
  'Light':
    'School=Evocation ' +
    'Description="Touched object lights 20\' radius for 1 hr (Dex neg)"',
  'Lightning Bolt':
    'School=Evocation ' +
    'Description="100\'x5\' 8d6 HP (Dex half)"',
  'Locate Animals Or Plants':
    'School=Divination ' +
    'Description="Know location of named beast or plant w/in 5 mi"',
  'Locate Creature':
    'School=Divination ' +
    'Description="Know location of named creature or species w/in 1000\' for conc/1 hr"',
  'Locate Object':
    'School=Divination ' +
    'Description="Know location of named object or type w/in 1000\' for conc/10 min"',
  'Longstrider':
    'School=Transmutation ' +
    'Description="Touched +10\' speed for 1 hr"',

  'Mage Armor':
    'School=Conjuration ' +
    'Description="Touched AC 13+DexMod in no armor for 8 hr"',
  'Mage Hand':
    'School=Conjuration ' +
    'Description="R30\' Spectral hand performs minor tasks le 10 lb for 1 min"',
  'Magic Circle':
    'School=Abjuration ' +
    'Description="R10\' 10\' circle impassable by specified creature type, Disadv attacks for 1 hr"',
  'Magic Jar':
    'School=Necromancy ' +
    'Description="R100\' Possess creature, trap soul (Cha neg)"',
  'Magic Missile':
    'School=Evocation ' +
    'Description="R120\' 3 darts 1d4+1 HP ea"',
  'Magic Mouth':
    'School=Illusion ' +
    'Description="R30\' Object speaks 25-word message in response to trigger"',
  'Magic Weapon':
    'School=Transmutation ' +
    'Description="Touched weapon +1 for conc/1 hr"',
  'Magnificent Mansion':
    'School=Conjuration ' +
    'Description="R300\' Comfortable extradimensional dwelling for 1 dy"',
  'Major Image':
    'School=Illusion ' +
    'Description="R120\' 20\' cu sight, sound, touch illusion for conc/10 min"',
  'Mass Cure Wounds':
    'School=Evocation ' +
    'Description="R60\' 6 targets in 30\' radius regain 3d8+spell mod HP"',
  'Mass Heal':
    'School=Evocation ' +
    'Description="R60\' Targets restore 700 HP total, unblind, undeaf, undisease"',
  'Mass Healing Word':
    'School=Evocation ' +
    'Description="R60\' 6 targets regain 1d4+spell mod HP"',
  'Mass Suggestion':
    'School=Enchantment ' +
    'Description="R60\' 12 targets follow suggestion (Wis neg)"',
  'Maze':
    'School=Conjuration ' +
    'Description="R60\' Target sent to labyrinth (DC 20 Int escapes)"',
  'Meld Into Stone':
    'School=Transmutation ' +
    'Description="Step into rock for 8 hr"',
  'Mending':
    'School=Transmutation ' +
    'Description="Repair small tears"',
  'Message':
    'School=Transmutation ' +
    'Description="R120 Whispered conversation w/target for 1 rd"',
  'Move Earth':'',
  'Meteor Swarm':
    'School=Evocation ' +
    'Description="R1 mi 40\' radius 20d6 fire + 20d6 bludgeoning (Dex half)"',
  'Mind Blank':
    'School=Abjuration ' +
    'Description="Touched immune psychic damage, reading, charm for 1 dy"',
  'Minor Illusion':
    'School=Illusion ' +
    'Description="R30\' Sound of 1 creature or 5\' cu image (Investigation disbelieve) for 1 min"',
  'Mirage Arcane':
    'School=Illusion ' +
    'Description="Illusionary terrain for 10 dy"',
  'Mirror Image':
    'School=Illusion ' +
    'Description="3 duplicates draw attacks (AC 10+DexMod)"',
  'Mislead':
    'School=Illusion ' +
    'Description="Self invisible, control illusory duplicate for conc/1 hr"',
  'Misty Step':
    'School=Conjuration ' +
    'Description="Self teleport 30\'"',
  'Modify Memory':
    'School=Enchantment ' +
    'Description="R30\' Change target memory of event in prior dy (Wis neg)"',
  'Moonbeam':
    'School=Evocation ' +
    'Description="5\' radius 2d10 HP (Con half) for conc/1 min"',
  'Move Earth':
    'School=Transmutation ' +
    'Description="R120\' Excavate 40\' cu for conc/2 hr"',

  'Nondetection':
    'School=Abjuration ' +
    'Description="Touched immune divination for 8 hr"',

  'Pass Without Trace':
    'School=Abjuration ' +
    'Description="Allies within 30\' self +10 Dexterity (Stealth), untrackable for conc/1 hr"',
  'Passwall':
    'School=Transmutation ' +
    'Description="R30\' 5\'x8\'x20\' passage through wood, plaster, or stone"',
  'Phantasmal Killer':
    'School=Illusion ' +
    'Description="R120\' Target fright, 4d10 HP/rd for conc/1 min (Wis neg)"',
  'Phantom Steed':
    'School=Illusion ' +
    'Description="R30\' Self ride 100\'/rd for 1 hr"',
  'Planar Ally':
    'School=Conjuration ' +
    'Description="R60\' Otherworld creature appears, bargain for service"',
  'Planar Binding':
    'School=Abjuration ' +
    'Description="R60; Bind celestial, elemental, fey, or fiend to service for 1 dy (Cha neg)"',
  'Plane Shift':
    'School=Conjuration ' +
    'Description="Target or self + 8 willing move to different plane (Cha neg)"',
  'Plant Growth':
    'School=Transmutation ' +
    'Description="R150\' Enrich half mi radius for 1 yr or overgrow 100\' radius"',
  'Poison Spray':
    'School=Conjuration ' +
    'Description="R10\' Target ${Math.floor((lvl+7)/6)}d12 HP (Con neg)"',
  'Polymorph':
    'School=Transmutation ' +
    'Description="R60\' Target creature transformed for conc/1 hr/0 HP (Wis neg)"',
  'Power Word Kill':
    'School=Enchantment ' +
    'Description="R60\' Slay target with le 100 HP"',
  'Power Word Stun':
    'School=Enchantment ' +
    'Description="R60\' Stun target with le 150 HP (Con neg)"',
  'Prayer Of Healing':
    'School=Evocation ' +
    'Description="R60\' Six targets regain 2d8+spell Mod HP"',
  'Prestidigitation':
    'School=Transmutation ' +
    'Description="R10\' Minor magic effects for 1 hr"',
  'Prismatic Spray':
    'School=Evocation ' +
    'Description="R60\' Targets in cone 10d6 HP (Dex half), held then stone (Dex neg), or blinded then plane shifted (Dex neg)"',
  'Prismatic Wall':
    'School=Abjuration ' +
    'Description="R60\' Transit causes 10d6 HP (Dex half), held then stone (Dex neg), or blinded then plane shifted (Dex neg) for 10 min"',
  'Private Sanctum':
    'School=Abjuration ' +
    'Description="R120\' Protect 100\' sq from sound, vision, divination, teleport for 1 dy"',
  'Produce Flame':
    'School=Conjuration ' +
    'Description="Hand flame lights 10\' radius for 10 min, throw for ${Math.floor((lvl+7)/6)}d8 HP"',
  'Programmed Illusion':
    'School=Illusion ' +
    'Description="R120\' 30\' cu illusion on specified trigger"',
  'Project Image':
    'School=Illusion ' +
    'Description="R500 mi Illusory double mimics self for conc/1 dy"',
  'Protection From Energy':
    'School=Abjuration ' +
    'Description="Resist acid, cold, fire, lightning, or thunder for conc/1 hr"',
  'Protection From Evil And Good':
    'School=Abjuration ' +
    'Description="Touched specified foe type Disadv attack, immune charm, fright, possession"',
  'Protection From Poison':
    'School=Abjuration ' +
    'Description="Touched poison neutralized, Adv save vs. poison for 1 hr"',
  'Purify Food And Drink':
    'School=Transmutation ' +
    'Description="R10\' 5\' radius food, drink freed of poison, disease"',

  'Raise Dead':
    'School=Necromancy ' +
    'Description="Touched 10-day-old corpse restored to life"',
  'Ray Of Enfeeblement':
    'School=Necromancy ' +
    'Description="R60\' Target does half Str damage until Con save"',
  'Ray Of Frost':
    'School=Evocation ' +
    'Description="R60\' Target ${Math.floor((lvl+7)/6)}d8 HP, -10 speed for 1 turn"',
  'Regenerate':
    'School=Transmutation ' +
    'Description="Touched regain 4d8+15 HP, 1 HP/min for 1 hr, restore severed members"',
  'Reincarnate':
    'School=Transmutation ' +
    'Description="Touched resurrected in new body"',
  'Remove Curse':
    'School=Abjuration ' +
    'Description="Touched freed from all curses"',
  'Resilient Sphere':
    'School=Evocation ' +
    'Description="R30\' Target encased in impervious sphere for conc/1 min"',
  'Resistance':
    'School=Abjuration ' +
    'Description="Touched +1d4 on save w/in conc/1 min"',
  'Resurrection':
    'School=Necromancy ' +
    'Description="Touched 100-year-old corpse restored to life"',
  'Reverse Gravity':
    'School=Transmutation ' +
    'Description="R50\' Items in 50\' radius fall up for conc/1 min"',
  'Revivify':
    'School=Necromancy ' +
    'Description="Touched 1-minute-old corpse returned to life w/1 HP"',
  'Rope Trick':
    'School=Transmutation ' +
    'Description="Rope to extradimensional space for 8 creatures for 1 hr"',

  'Sacred Flame':
    'School=Evocation ' +
    'Description="R60\' Target ${Math.floor((lvl+7)/6)}d8 (Dex neg)"',
  'Sanctuary':
    'School=Abjuration ' +
    'Description="R30\' Target foes attack another for 1 min (Wis neg)"',
  'Scorching Ray':
    'School=Evocation ' +
    'Description="R120\' 3 ranged attacks do 2d6 HP ea"',
  'Scrying':
    'School=Divination ' +
    'Description="See, hear chosen target (Wis neg) for conc/10 min"',
  'Secret Chest':
    'School=Conjuration ' +
    'Description="Touched chest moves to Ethereal Plane"',
  'See Invisibility':
    'School=Divination ' +
    'Description="Self see invisible and ethereal items for 1 hr"',
  'Seeming':
    'School=Illusion ' +
    'Description="R30\' Targets appearance change for 8 hr (Cha neg)"',
  'Sending':
    'School=Evocation ' +
    'Description="Exchange 25-word message with known target"',
  'Sequester':
    'School=Transmutation ' +
    'Description="Touched hidden, suspended until trigger"',
  'Shapechange':
    'School=Transmutation ' +
    'Description="Self polymorph for conc/1 hr/0 HP"',
  'Shatter':
    'School=Evocation ' +
    'Description="R60\' 10\' radius 3d8 HP (Con half)"',
  'Shield':
    'School=Abjuration ' +
    'Description="Reaction self +5 AC, immune <i>Magic Missile</i> for 1 rd"',
  'Shield Of Faith':
    'School=Abjuration ' +
    'Description="R60\' Target +2 AC for conc/10 min"',
  'Shillelagh':
    'School=Transmutation ' +
    'Description="Touched club attack with spell attack, does 1d8 HP for 1 min"',
  'Shocking Grasp':
    'School=Evocation ' +
    'Description="Touched ${Math.floor((lvl+7)/6)}d8 HP"',
  'Silence':
    'School=Illusion ' +
    'Description="R120\' 20\' radius blocks sound for conc/10 min"',
  'Silent Image':
    'School=Illusion ' +
    'Description="R60\' 15\' cu illusion for conc/10 min (Investigation neg)"',
  'Simulacrum':
    'School=Illusion ' +
    'Description="Friendly duplicate creature from snow, half HP of original"',
  'Sleep':
    'School=Enchantment ' +
    'Description="R90\' 20\' radius sleeps up to 5d8 HP creatures, weakest first"',
  'Sleet Storm':
    'School=Conjuration ' +
    'Description="R150\' 40\' radius slick ice causes falls (Dex neg)"',
  'Slow':
    'School=Transmutation ' +
    'Description="R120\' Targets in 40\' cu half speed, -2 AC and Dex save (Wis neg)"',
  'Spare The Dying':
    'School=Necromancy ' +
    'Description="Touched creature stable"',
  'Speak With Animals':
    'School=Divination ' +
    'Description="Self talk to animals for 10 min"',
  'Speak With Dead':
    'School=Necromancy ' +
    'Description="Self ask corpse 5 questions in 10 min"',
  'Speak With Plants':
    'School=Transmutation ' +
    'Description="Self talk to plans in 30\' for 10 min"',
  'Spider Climb':
    'School=Transmutation ' +
    'Description="Touched travel walls and ceilings for conc/1 hr"',
  'Spike Growth':
    'School=Transmutation ' +
    'Description="R150\' 20\' radius 2d4 HP/5\' move for conc/10 min"',
  'Spirit Guardians':
    'School=Conjuration ' +
    'Description="Self 15\' radius 3d8 HP (Wis half)"',
  'Spiritual Weapon':
    'School=Evocation ' +
    'Description="R60\' Spectral weapon 1d8 + spell mod HP, move 20\' for 1 min"',
  'Stinking Cloud':
    'School=Conjuration ' +
    'Description="R90\' 20\' radius causes retching for conc/1 min"',
  'Stone Shape':
    'School=Transmutation ' +
    'Description="Touched medium-sized stone reforms"',
  'Stoneskin':
    'School=Abjuration ' +
    'Description="Touched resists bludgeoning, piercing, slashing for conc/1 hr"',
  'Storm Of Vengeance':
    'School=Conjuration ' +
    'Description="RSight 360\' radius lightning, thunder, wind for conc/1 min"',
  'Suggestion':
    'School=Enchantment ' +
    'Description="R30\' Target follow reasonable suggestion (Wis neg)"',
  'Sunbeam':
    'School=Evocation ' +
    'Description="60\' light 6d8 HP (Con half), blind 1 turn (Con neg) for conc/1 min"',
  'Sunburst':
    'School=Evocation ' +
    'Description="60\' radius light 12d6 HP (Con half), blind 1 min (Con neg)"',
  'Symbol':
    'School=Abjuration ' +
    'Description="Touched permanent glyph w/magic effects"',

  'Telekinesis':
    'School=Transmutation ' +
    'Description="R60\' Move 1000 lb 30\'/rd for conc/10 min (Str neg)"',
  'Telepathic Bond':
    'School=Divination ' +
    'Description="R30\' Eight targets communicate mentally for 1 hr"',
  'Teleport':
    'School=Conjuration ' +
    'Description="R10\' One object or self + 8 allies teleport any distance"',
  'Teleportation Circle':
    'School=Conjuration ' +
    'Description="R10\' Permanent portal to similar circle"',
  'Thaumaturgy':
    'School=Transmutation ' +
    'Description="R30\' Minor magic effects for 1 min"',
  'Thunderwave':
    'School=Evocation ' +
    'Description="15\' cu 2d8 HP, pushed 10\' (Con half, no push)"',
  'Time Stop':
    'School=Transmutation ' +
    'Description="Self extra 1d4+1 turns w/in 1000\' or until other affected"',
  'Tiny Hut':
    'School=Evocation ' +
    'Description="10\' radius dome immune to objects and spells for 8 hr"',
  'Tongues':
    'School=Divination ' +
    'Description="Touched understand and speak any language for 1 hr"',
  'Transport Via Plants':
    'School=Conjuration ' +
    'Description="Teleportation door between two plants for 1 rd"',
  'Tree Stride':
    'School=Conjuration ' +
    'Description="Teleport between like trees 1/rd for conc/1 min"',
  'True Polymorph':
    'School=Transmutation ' +
    'Description="R30\' Target creature or object transformed for conc/1 hr/0 HP (Wis neg)"',
  'True Resurrection':
    'School=Necromancy ' +
    'Description="Touched or named 200-year-old corpse restored to life"',
  'True Seeing':
    'School=Divination ' +
    'Description="Touched 120\' truesight, see magically concealed doors, Ethereal Plane for 1 hr"',
  'True Strike':
    'School=Divination ' +
    'Description="R30\' Adv next attack on target w/in 1 rd"',

  'Unseen Servant':
    'School=Conjuration ' +
    'Description="R60\' Invisible force performs simple tasks for 1 hr"',

  'Vampiric Touch':
    'School=Necromancy ' +
    'Description="Touched 3d6 HP, self regain half for conc/1 min"',
  'Vicious Mockery':
    'School=Enchantment ' +
    'Description="R60\' Target insults ${Math.floor((lvl+7)/6)} HP, Disadv attack (Wis neg)"',

  'Wall Of Fire':
    'School=Evocation ' +
    'Description="R120\' 60\'x20\' wall 5d8 HP (Dex half) for conc/1 min"',
  'Wall Of Force':
    'School=Evocation ' +
    'Description="R120\' 10 10\'x10\' panels immune objects for conc/10 min"',
  'Wall Of Ice':
    'School=Evocation ' +
    'Description="R120\' 10 10\'x10\' panels for conc/10 min"',
  'Wall Of Stone':
    'School=Evocation ' +
    'Description="R120\' 10 10\'x10\' panels for conc/10 min"',
  'Wall Of Thorns':
    'School=Conjuration ' +
    'Description="R120\' 60\'x10\' wall 7d8 HP (Dex half) for conc/10 min"',
  'Warding Bond':
    'School=Abjuration ' +
    'Description="Touched +1 AC, saves, resist damage within 60\' of self, self share damage for 1 hr"',
  'Water Breathing':
    'School=Transmutation ' +
    'Description="R30\' 10 targets breathe underwater for 1 dy"',
  'Water Walk':
    'School=Transmutation ' +
    'Description="R30\' 10 targets cross liquid for 1 hr"',
  'Web':
    'School=Conjuration ' +
    'Description="R60\' 20\' cu restrain creatures for conc/1 hr (Dex neg, Str frees)"',
  'Weird':
    'School=Illusion ' +
    'Description="R120\' Targets in 30\' radius fright, 4d10 HP/turn for conc/1 min (Wis neg)"',
  'Wind Walk':
    'School=Transmutation ' +
    'Description="R30\' Self + 10 others gaseous, fly 300\'/rd for 8 hr"',
  'Wind Wall':
    'School=Evocation ' +
    'Description="R120\' 50\'x15\' strong wind does 3d8 HP (Str half) for conc/1 min"',
  'Wish':
    'School=Conjuration ' +
    'Description="Alter reality with few limits"',
  'Word Of Recall':
    'School=Conjuration ' +
    'Description="R5\' Self + 5 others instantly teleport to predetermined place"',

  'Zone Of Truth':
    'School=Enchantment ' +
    'Description="R60\' Creatures inside 15\' radius cannot lie for 10 min (Cha neg)"'

};
SRD5E.TOOLS = {
  "Alchemist's Supplies":'Type=Artisan',
  "Brewer's Supplies":'Type=Artisan',
  "Calligrapher's Supplies":'Type=Artisan',
  "Carpenter's Tools":'Type=Artisan',
  "Cobbler's Tools":'Type=Artisan',
  "Cook's Utensils":'Type=Artisan',
  "Glassblower's Tools":'Type=Artisan',
  "Jeweler's Tools":'Type=Artisan',
  "Leatherworker's Tools":'Type=Artisan',
  "Mason's Tools":'Type=Artisan',
  "Painter's Supplies":'Type=Artisan',
  "Potter's Tools":'Type=Artisan',
  "Smith's Tools":'Type=Artisan',
  "Tinker's Tools":'Type=Artisan',
  "Weaver's Tools":'Type=Artisan',
  "Woodcarver's Tools":'Type=Artisan',
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
  "Navigator's Tools":'Type=',
  "Poisoner's Kit":'Type=',
  "Thieves' Tools":'Type=',
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
    'HitDie=d12 ' +
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
      '"3:Path Of The Totem Warrior (Wolf)" ' +
    'Proficiencies=' +
      '"Armor:Light Armor;Medium Armor;Shield",' +
      '"Save:Constitution;Strength",' +
      '"2 Skill:Animal Handling;Athletics;Intimidation;Nature;Perception;Survival",' +
      '"Weapon:Simple;Martial"',
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
      '"features.College Of Lore ? 3:Bonus Skills",' +
      '"features.College Of Lore ? 3:Cutting Words",' +
      '"features.College Of Lore ? 6:Additional Magical Secrets",' +
      '"features.College Of Lore ? 14:Peerless Skill" ' +
    'Selectables=' +
      '"3:College Of Lore" ' +
    'Proficiencies=' +
      '"Armor:Light Armor",' +
      '"Save:Charisma;Dexterity",' +
      '"3 Skill:' + QuilvynUtils.getKeys(SRD5E.SKILLS).join(';') + '",' +
      '"3 Tool:Music",' +
      '"Weapon:Simple;Hand Crossbow;Longsword;Rapier;Shortsword" ' +
    'CasterLevelArcane=levels.Bard ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'B1:1=2;2=3;3=4,' +
      'B2:3=2;4=3,' +
      'B3:5=2;6=3,' +
      'B4:7=1;8=2;9=3,' +
      'B5:9=1;10=2;18=3,' +
      'B6:11=1;19=2,' +
      'B7:13=1;20=2,' +
      'B8:15=1,' +
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
    'HitDie=d8 ' +
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
    'Proficiencies=' +
      '"Armor:Light Armor;Medium Armor;Shield",' +
      '"Save:Charisma;Wisdom",' +
      '"2 Skill:History;Insight;Medicine;Persuasion;Religion",' +
      '"Weapon:Simple" ' +
    'CasterLevelDivine=levels.Cleric ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'C1:1=2;2=3;3=4,' +
      'C2:3=2;4=3,' +
      'C3:5=2;6=3,' +
      'C4:7=1;8=2;9=3,' +
      'C5:9=1;10=2;18=3,' +
      'C6:11=1;19=2,' +
      'C7:13=1;20=2,' +
      'C8:15=1,' +
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
    'Languages=Druidic ' +
    'Selectables=' +
      '"2:Circle Of The Land (Arctic)",' +
      '"2:Circle Of The Land (Coast)",' +
      '"2:Circle Of The Land (Desert)",' +
      '"2:Circle Of The Land (Forest)",' +
      '"2:Circle Of The Land (Grassland)",' +
      '"2:Circle Of The Land (Mountain)",' +
      '"2:Circle Of The Land (Swamp)" ' +
    'Proficiencies=' +
      '"Armor:Light Armor;Medium Armor;Shield",' +
      '"Save:Intelligence;Wisdom",' +
      '"2 Skill:Arcana;Animal Handling;Insight;Medicine;Nature;Perception;Religion;Survival",' +
      '"Tool:Herbalism Kit",' +
      '"Weapon:Club;Dagger;Dart;Javelin;Mace;Quarterstaff;Scimitar;Sickle;Sling;Spear" ' +
    'CasterLevelDivine=levels.Druid ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'D1:1=2;2=3;3=4,' +
      'D2:3=2;4=3,' +
      'D3:5=2;6=3,' +
      'D4:7=1;8=2;9=3,' +
      'D5:9=1;10=2;18=3,' +
      'D6:11=1;19=2,' +
      'D7:13=1;20=2,' +
      'D8:15=1,' +
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
      '"D6:Conjure Fey;Find The Path;Heal;Heroes\' Feast;Move Earth;Sunbeam;' +
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
      '"1:Two-Weapon Fighting Style","3:Champion Archetype" ' +
    'Proficiencies=' +
      '"Armor:Light Armor;Medium Armor;Heavy Armor;Shield",' +
      '"Save:Constitution;Strength",' +
      '"2 Skill:Acrobatics;Animal Handling;Athletics;History;Insight;Intimidation;Perception;Survival",' +
      '"Weapon:Simple;Martial"',
  'Monk':
    'HitDie=d8 ' +
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
      '"features.Way Of The Open Hand ? 3:Open Hand Technique",' +
      '"features.Way Of The Open Hand ? 6:Wholeness Of Body",' +
      '"features.Way Of The Open Hand ? 11:Tranquility",' +
      '"features.Way Of The Open Hand ? 17:Quivering Palm" ' +
    'Selectables=' +
      '"3:Way Of The Open Hand Tradition" ' +
    'Proficiencies=' +
      '"Save:Dexterity;Strength",' +
      '"2 Skill:Acrobatics;Athletics;History;Insight;Religion;Stealth",' +
      '"1 Tool:Artisan;Music",' +
      '"Weapon:Simple;Shortsword"',
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
    'Proficiencies=' +
      '"Armor:Light Armor;Medium Armor;Heavy Armor;Shield",' +
      '"Save:Charisma;Wisdom",' +
      '"2 Skill:Athletics;Insight;Intimidation;Medicine;Persuasion;Religion",' +
      '"Weapon:Simple;Martial" ' +
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
    'Proficiencies=' +
      '"Armor:Light Armor;Medium Armor;Shield",' +
      '"Save:Dexterity;Strength",' +
      '"3 Skill:Animal Handling;Athletics;Insight;Investigation;Nature;Perception;Stealth;Survival",' +
      '"Weapon:Simple;Martial" ' +
    'CasterLevelDivine=levels.Ranger ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'R1:2=2;3=3;5=4,' +
      'R2:5=2;7=3,' +
      'R3:9=2;11=3,' +
      'R4:13=1;15=2;17=3,' +
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
      '"features.Thief Archetype ? 3:Fast Hands",' +
      '"features.Thief Archetype ? 3:Second-Story Work",' +
      '"features.Thief Archetype ? 9:Supreme Sneak",' +
      '"features.Thief Archetype ? 13:Use Magic Device",' +
      '"features.Thief Archetype ? 17:Thief\'s Reflexes" ' +
    'Selectables=' +
      '"3:Thief Archetype" ' +
    'Proficiencies=' +
      '"Armor:Light Armor",' +
      '"Save:Dexterity;Intelligence",' +
      '"4 Skill:Acrobatics;Athletics;Deception;Insight;Intimidation;Investigation;Perception;Performance;Persuasion;Sleight Of Hand;Stealth",' +
      '"Tool:"Thieves\' Tools",' +
      '"Weapon:Simple;Hand Crossbow;Longsword;Rapier;Shortsword"',
  'Sorcerer':
    'HitDie=d6 ' +
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
    'Proficiencies=' +
      '"Save:Charisma;Constitution ' +
      '"2 Skill:Arcana;Deception;Insight;Intimidation;Persuasion;Religion",' +
      '"Weapon:Dagger;Dart;Light Crossbow;Sling;Quarterstaff" ' +
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
      '"20:Eldritch Master",' +
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
      '"2:Mask Of Many Faces","15:Master Of Myriad Forms",' +
      '"9:Minions Of Chaos","2:Misty Visions","5:Mire The Mind",' +
      '"5:One With Shadows","9:Otherworldly Leap","2:Repelling Blast",' +
      '"7:Sculptor Of Flesh","5:Sign Of Ill Omen:","2:Thief Of Five Fates",' +
      '"5:Thirsting Blade","15:Visions Of Distant Realms",' +
      '"2:Voice Of The Chain Master","9:Whispers Of The Grave",' +
      '"15:Witch Sight" ' +
    'Proficiencies=' +
      '"Armor:"Light Armor",' +
      '"Save:Charisma;Wisdom",' +
      '"2 Skill:Arcana;Deception;History;Intimidation;Investigation;Nature;Religigion",' +
      '"Weapon:Simple" ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'K1:1=1;2=2;3=0,' +
      'K2:3=2;5=0,' +
      'K3:5=2;7=0,' +
      'K4:7=2;9=0,' +
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
      '"features.Evocation Tradition ? 2:Evocation Savant",' +
      '"features.Evocation Tradition ? 2:Sculpt Spells",' +
      '"features.Evocation Tradition ? 6:Potent Cantrip",' +
      '"features.Evocation Tradition ? 10:Empowered Evocation",' +
      '"features.Evocation Tradition ? 14:Overchannel" ' +
    'Selectables=' +
      '"2:Evocation Tradition" ' +
    'Proficiencies=' +
      '"Save:Intelligence;Wisdom",' +
      '"3 Skill:Arcana;History;Insight;Investigation;Medicine;Religion",' +
      '"Weapon:Dagger;Dart;Light Crossbow;Sling;Quarterstaff" ' +
    'SpellAbility=intelligence ' +
    'SpellSlots=' +
      'W1:1;2;2;3;3;4,' +
      'W2:3;2;4;3,' +
      'W3:5;2;6;3,' +
      'W4:7;1;8;2;9;3,' +
      'W5:9;1;10;2;18;3,' +
      'W6:11;1;19;2,' +
      'W7:13;1;20;2,' +
      'W8:15;1,' +
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
      '"W2:Acid Arrow;Alter Self;Arcane Lock;Arcanist\'s Magic Aura;' +
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
SRD5E.RACES = {
  'Black Dragonborn':
    'Features=' +
      '"1:Draconic Breath","1:Dragonborn Ability Adjustment" ' +
    'Languages=Common,Draconic',
  'Blue Dragonborn':
    'Features=' +
      '"1:Draconic Breath","1:Dragonborn Ability Adjustment" ' +
    'Languages=Common,Draconic',
  'Brass Dragonborn':
    'Features=' +
      '"1:Draconic Breath","1:Dragonborn Ability Adjustment" ' +
    'Languages=Common,Draconic',
  'Bronze Dragonborn':
    'Features=' +
      '"1:Draconic Breath","1:Dragonborn Ability Adjustment" ' +
    'Languages=Common,Draconic',
  'Copper Dragonborn':
    'Features=' +
      '"1:Draconic Breath","1:Dragonborn Ability Adjustment" ' +
    'Languages=Common,Draconic',
  'Gold Dragonborn':
    'Features=' +
      '"1:Draconic Breath","1:Dragonborn Ability Adjustment" ' +
    'Languages=Common,Draconic',
  'Green Dragonborn':
    'Features=' +
      '"1:Draconic Breath","1:Dragonborn Ability Adjustment" ' +
    'Languages=Common,Draconic',
  'Red Dragonborn':
    'Features=' +
      '"1:Draconic Breath","1:Dragonborn Ability Adjustment" ' +
    'Languages=Common,Draconic',
  'Silver Dragonborn':
    'Features=' +
      '"1:Draconic Breath","1:Dragonborn Ability Adjustment" ' +
    'Languages=Common,Draconic',
  'White Dragonborn':
    'Features=' +
      '"1:Draconic Breath","1:Dragonborn Ability Adjustment" ' +
    'Languages=Common,Draconic',
  'Hill Dwarf':
    'Features=' +
      '1:Darkvision,"1:Hill Dwarf Ability Adjustment",' +
      '"1:Dwarven Armor Speed","1:Dwarven Resilience",1:Slow,1:Stonecunning,' +
      '"1:Tool Proficiency (Artisan\'s Tools)",' +
      '"1:Weapon Proficiency (Battleaxe/Handaxe/Light Hammer/Warhammer)" ' +
    'Languages=Common,Dwarvish ' +
    'Proficiencies=' +
      '"1 Tool:Brewer\'s Supplies;Mason\'s Tools;Smith\'s Tools",' +
      '"Weapon:Battleaxe;Handaxe;Light Hammer;Warhammer"',
  'High Elf':
    'Features=' +
      '1:Darkvision,"1:Fey Ancestry","1:High Elf Ability Adjustment",' +
      '"1:Keen Senses",1:Trance,1:Cantrip,' +
      '"1:Weapon Proficiency (Longbow/Longsword/Shortbow/Shortsword)" ' +
    'Languages=Common,Elvish,any ' +
    'Proficiencies=' +
      'Skill:Perception ' +
    'SpellAbility=intelligence ' +
    'Spells=' +
      '"Elf0:Acid Splash;Chill Touch;Dancing Lights;Fire Bolt;Light;Mage Hand;'+
      'Mending;Message;Minor Illusion;Poison Spray;Prestidigitation;' +
      'Ray Of Frost;Shocking Grasp;True Strike"',
  'Rock Gnome':
    'Features=' +
      '1:Darkvision,"1:Gnome Cunning","1:Rock Gnome Ability Adjustment",' +
      '1:Slow,1:Small,"1:Artificer\'s Lore",1:Tinker ' +
    'Languages=Common,Gnomish ' +
    'Proficiencies=' +
      '"Tool:Tinker\'s Tools"',
  'Half-Elf':
    'Features=' +
      '1:Darkvision,"1:Fey Ancestry","1:Half-Elf Ability Adjustment",' +
      '"1:Skill Versatility" ' +
    'Languages=Common,Elvish ' +
    'Proficiencies=' +
      '"2 Skill:' + QuilvynUtils.getKeys(SRD5E.SKILLS).join(';') + '"',
  'Half-Orc':
    'Features=' +
      '1:Darkvision,"1:Half-Orc Ability Adjustment",1:Menacing,' +
      '"1:Relentless Endurance","1:Savage Attacks" ' +
    'Languages=Common,Orc ' +
    'Proficiencies=' +
      '"Skill:Intimidation"',
  'Lightfoot Halfling':
    'Features=' +
      '1:Brave,"1:Halfling Luck","1:Halfling Nimbleness",' +
      '"1:Lightfoot Halfling Ability Adjustment","1:Naturally Stealthy",' +
      '1:Slow,1:Small ' +
    'Languages=Common,Halfling',
  'Human':
    'Features=' +
      '"1:Human Ability Adjustment" ' +
      'Languages=Common,any',
  'Tiefling':
    'Features=' +
      '1:Darkvision,"1:Hellish Resistance","1:Infernal Legacy",' +
      '"1:Tiefling Ability Adjustment" ' +
    'Languages=Common,Infernal ' +
    'SpellAbility=charisma ' +
    'Spells=' +
      '"Tiefling0:Thaumaturgy",' +
      '"Tiefling3:Hellish Rebuke",' +
      '"Tiefling5:Darkness"'
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
    rules.defineRule(ability, '', 'v', '20');
  }
  rules.defineRule('carry', 'strength', '=', 'source * 15');
  rules.defineRule('lift', 'strength', '=', 'source * 30');
  rules.defineRule('speed',
    '', '=', '30',
    'abilityNotes.armorSpeedAdjustment', '+', null
  );

  // TODO
  SRD35.validAllocationRules
    (rules, 'abilityBoost', 'abilityNotes.abilityBoosts', 'Sum "^(charisma|constitution|dexterity|intelligence|strength|wisdom)Adjust$"');

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
    'armorStrShortfall', '=', 'source > 0 ? -10 : null'
  );
  rules.defineRule
    ('armorClass', 'combatNotes.dexterityArmorClassAdjustment', '+', null);
  rules.defineRule('armorStrShortfall',
    'armorStrRequirement', '=', null,
    'strength', '+', '-source'
  );
  rules.defineRule('attacksPerRound', '', '=', '1');
  rules.defineRule('combatNotes.constitutionHitPointsAdjustment',
    'constitutionModifier', '=', null,
    'level', '*', null
  );
  rules.defineRule('combatNotes.dexterityArmorClassAdjustment',
    'dexterityModifier', '=', null
  );
  rules.defineRule
    ('combatNotes.dexterityAttackAdjustment', 'dexterityModifier', '=', null);
  rules.defineRule
    ('combatNotes.dexterityDamageAdjustment', 'dexterityModifier', '=', null);
  rules.defineRule
    ('combatNotes.strengthAttackAdjustment', 'strengthModifier', '=', null);
  rules.defineRule
    ('combatNotes.strengthDamageAdjustment', 'strengthModifier', '=', null);
  rules.defineRule
    ('hitPoints', 'combatNotes.constitutionHitPointsAdjustment', '+', null);
  rules.defineRule('initiative', 'dexterityModifier', '=', null);
  rules.defineRule('proficient.None', '', '=', '1'); // Prof w/no armor
  rules.defineRule('proficient.Unarmed', '', '=', '1');
  rules.defineRule('weapons.Unarmed', '', '=', '1');

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

  rules.defineChoice('notes',
    'validationNotes.two-handedWeaponWithShield:' +
      'Shields cannot be used with two-handed weapons'
  );
  rules.defineRule('validationNotes.two-handedWeaponWithShield',
    'shield', '?', 'source != "None"'
  );

  // TODO
  SRD35.validAllocationRules
    (rules, 'armorProficiency', 'armorProficiencyCount', 'Sum "^armorProficiencies\\."');
  SRD35.validAllocationRules
    (rules, 'weaponProficiency', 'weaponProficiencyCount', 'Sum "^weaponProficiencies\\."');

};

/* Defines the rules related to goodies included in character notes. */
SRD5E.goodiesRules = function(rules) {
  // TODO
  SRD35.goodiesRules(rules);
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
  // TODO
  SRD35.validAllocationRules(rules, 'level', 'level', 'Sum "^levels\\."');

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
  // TODO
  SRD35.validAllocationRules(rules, 'feat', 'featCount', 'Sum "^feats\\."');
  SRD35.validAllocationRules
    (rules, 'language', 'languageCount', 'Sum "^languages\\."');
  SRD35.validAllocationRules
    (rules, 'selectableFeature', 'Sum "^selectableFeatureCount\\."', 'Sum "^selectableFeatures\\."');
  SRD35.validAllocationRules
    (rules, 'skillProficiency', 'skillProficiencyCount', 'Sum "^skillProficiencies\\."');
  SRD35.validAllocationRules
    (rules, 'toolProficiency', 'toolProficiencyCount', 'Sum "^toolProficiencies\\."');

};

/*
 * Adds #name# as a possible user #type# choice and parses #attrs# to add rules
 * related to selecting that choice.
 */
SRD5E.choiceRules = function(rules, type, name, attrs) {
  if(type == 'Alignment')
    SRD5E.alignmentRules(rules, name);
  else if(type == 'Background')
    SRD5E.backgroundRules(rules, name,
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
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Selectables'),
      QuilvynUtils.getAttrValueArray(attrs, 'Proficiencies'),
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
  else if(type == 'Skill')
    SRD5E.skillRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Ability'),
      QuilvynUtils.getAttrValueArray(attrs, 'Class')
    );
  else if(type == 'Spell')
    SRD5E.spellRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'School'),
      QuilvynUtils.getAttrValue(attrs, 'Group'),
      QuilvynUtils.getAttrValue(attrs, 'Level'),
      QuilvynUtils.getAttrValue(attrs, 'Description')
    );
  else if(type == 'Tool')
    SRD5E.toolRules(rules, name);
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
  var category = ['None', 'Light Armor', 'Medium Armor', 'Heavy Armor'][weight];

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
  rules.defineRule('armorStrRequirement',
    'armor', '=', QuilvynUtils.dictLit(rules.armorStats.minStr) + '[source]'
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

  rules.defineRule('proficient.' + name,
    'armor', '?', 'source == "' + name + '"',
    'armorProficiencies.' + name, '=', '1',
    'armorProficiencies.' + category, '=', '1'
  );
  rules.defineRule('nonproficientArmor',
    '', '=', '1',
    'proficient.' + name, '^', '0'
  );

  rules.defineChoice('notes',
    'sanityNotes.nonproficientArmorPenalty:' +
      'Disadv Dex, Str rolls, cannot cast spells',
    'skillNotes.bulkyArmor:Disadv Stealth'
  );
  rules.defineRule
    ('sanityNotes.nonproficientArmorPenalty', 'nonproficientArmor', '=', null);

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
  var backgroundLevel = prefix + 'Level';

  rules.defineRule(backgroundLevel,
    'background', '?', 'source == "' + name + '"',
    'level', '=', null
  );

  // TODO
  SRD35.featureListRules(rules, features, name, backgroundLevel, false);
  rules.defineSheetElement(name + ' Features', 'Feats+', null, '; ');
  rules.defineChoice('extras', prefix + 'Features');

  if(languages.length > 0)
    rules.defineRule
      ('languageCount', 'isBackground.' + name, '+', languages.length);

  for(var i = 0; i < languages.length; i++) {
    if(languages[i] != 'any')
      rules.defineRule('languages.' + languages[i], backgroundLevel, '=', '1');
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
  rules, name, requires, hitDie, features, selectables, proficiencies,
  languages, casterLevelArcane, casterLevelDivine, spellAbility, spellsPerDay,
  spells, spellDict
) {

  if(!name) {
    console.log('Empty class name');
    return;
  }
  if(!(hitDie + '').match(/^(\d+)?d\d+$/)) {
    console.log('Bad hitDie "' + hitDie + '" for class ' + name);
    return;
  }

  var classLevel = 'levels.' + name;
  var prefix =
    name.charAt(0).toLowerCase() + name.substring(1).replace(/ /g, '');

  if(requires.length > 0)
    // TODO
    SRD35.prerequisiteRules
      (rules, 'validation', prefix + 'Class', classLevel, requires);

  // TODO
  SRD35.featureListRules(rules, features, name, classLevel, false);
  SRD35.featureListRules(rules, selectables, name, classLevel, true);
  rules.defineSheetElement(name + ' Features', 'Feats+', null, '; ');
  rules.defineChoice('extras', prefix + 'Features');

  for(var i = 0; i < proficiencies.length; i++) {
    var pieces = proficiencies[i].split(':');
    var items = pieces[1].split(';');
    var matchInfo = pieces[0].match(/^((\d+)\s+)?(.*)$/);
    var count = matchInfo[2] || items.length;
    var group = matchInfo[3].toLowerCase();
    rules.defineRule(group + 'ProficiencyCount', classLevel, '+=', count);
    for(var j = 0; j < items.length; j++) {
      rules.defineRule(group + (matchInfo[1] ? 'Choices' : 'Proficiencies') + '.' + items[j], classLevel, '=', '1');
    }
  }

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

  // TODO
  var spells;

  if(name == 'Barbarian') {

    rules.defineRule('abilityNotes.rage',
      'levels.Barbarian', '+=', 'source<3 ? 2 : source<6 ? 3 : source<12 ? 4 : source<17 ? 5 : source<20 ? 6 : "unlimited"'
    );
    rules.defineRule('armorClass',
      'combatNotes.barbarianUnarmoredDefense.2', '+', null
    );
    rules.defineRule('combatNotes.brutalCritical',
      'levels.Barbarian', '=', 'Math.floor((source - 5) / 4)'
    );
    // Show Unarmored Defense note even if armor != None or conMod == 0
    rules.defineRule('combatNotes.barbarianUnarmoredDefense.1',
      'combatNotes.barbarianUnarmoredDefense', '?', null,
      'constitutionModifier', '=', null
    );
    rules.defineRule('combatNotes.barbarianUnarmoredDefense.2',
      'combatNotes.barbarianUnarmoredDefense', '?', null,
      'armor', '?', 'source == "None"',
      'combatNotes.barbarianUnarmoredDefense.1', '=', null
    );
    rules.defineRule('combatNotes.extraAttack',
      'levels.Barbarian', '+=', 'source < 5 ? null : 1'
    );
    rules.defineRule('combatNotes.rage',
      'levels.Barbarian', '+=', 'source<3 ? 2 : source<6 ? 3 : source<12 ? 4 : source<17 ? 5 : source<20 ? 6 : "unlimited"'
    );
    rules.defineRule('combatNotes.rage.1',
      'levels.Barbarian', '+=', 'source<9 ? 2 : source<16 ? 3 : 4'
    );
    rules.defineRule('featureNotes.intimidatingPresence',
      'charismaModifier', '=', 'source + 8',
      'proficiencyBonus', '+', null
    );
    rules.defineRule('selectableFeatureCount.Barbarian',
      'levels.Barbarian', '=', 'source < 3 ? null : 1'
    );

  } else if(name == 'Bard') {

    rules.defineRule('abilityNotes.jackOfAllTrades',
      'proficiencyBonus', '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('magicNotes.bardicInspiration',
      'levels.Bard', '=', '6 + Math.floor(source / 5) * 2'
    );
    rules.defineRule('magicNotes.bardicInspiration.1',
      'charismaModifier', '=', 'Math.max(source, 1)'
    );
    rules.defineRule('magicNotes.magicalSecrets',
      'levels.Bard', '=', '2 * Math.floor((source - 6) / 4)'
    );
    rules.defineRule('magicNotes.songOfRest',
      'levels.Bard', '=', '6 + (source>=9 ? 2 * Math.floor((source-5)/4) : 0)'
    );
    rules.defineRule
      ('skillProficiencyCount', 'skillNotes.bonusSkills', '+', '3');
    rules.defineRule('selectableFeatureCount.Bard',
      'levels.Bard', '=', 'source < 3 ? null : 1'
    );
    rules.defineRule('skillNotes.bardExpertise',
      'levels.Bard', '=', 'source < 10 ? 2 : 4'
    );
    rules.defineRule('spellsKnown.B',
      'magicNotes.additionalMagicalSecrets', '+', '2',
      'magicNotes.magicalSecrets', '+', null
    );

  } else if(name == 'Cleric') {

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
    rules.defineRule('combatNotes.destroyUndead',
      'levels.Cleric', '=', 'source < 8 ? 0.5 : Math.floor((source - 5) / 3)'
    );
    rules.defineRule('combatNotes.turnUndead',
      'wisdomModifier', '=', 'source + 8',
      'proficiencyBonus', '+', null
    );
    rules.defineRule('featureNotes.channelDivinity',
      'levels.Cleric', '=', 'source < 6 ? 1: source < 18 ? 2 : 3'
    );
    rules.defineRule('magicNotes.divineIntervention',
      'levels.Cleric', '=', 'source < 20 ? source : 100'
    );
    rules.defineRule
      ('selectableFeatureCount.Cleric', 'levels.Cleric', '=', '1');
    rules.defineRule('weaponProficiencies.Martial',
      'clericFeatures.Weapon Proficiency (Martial)', '=', '1'
    );

    rules.defineRule('combatNotes.divineStrike',
      'levels.Cleric', '=', 'source < 14 ? 1 : 2'
    );
    rules.defineRule
      ('magicNotes.preserveLife', 'levels.Cleric', '=', '5 * source');

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

    rules.defineRule('magicNotes.wildShape.1',
      'levels.Druid', '=', 'source < 4 ? "1/4" : source < 8 ? "1/2" : "1"'
    );
    rules.defineRule('magicNotes.wildShape.2',
      'levels.Druid', '=', 'source < 4 ? " (land only)" : source < 8 ? " (non-flying)" : ""'
    );
    rules.defineRule('magicNotes.wildShape.3',
      'levels.Druid', '=', 'Math.floor(source /2)'
    );
    rules.defineRule('selectableFeatureCount.Druid',
      'levels.Druid', '=', 'source < 2 ? null : 1'
    );

    rules.defineRule("combatNotes.nature'sSanctuary",
      'wisdomModifier', '=', 'source + 8',
      'proficiencyBonus', '+', null
    );
    rules.defineRule('magicNotes.naturalRecovery',
      'levels.Druid', '=', 'Math.floor(source / 2)'
    );

    rules.defineRule('features.Circle Of The Land',
      /druidFeatures.Circle Of The Land/, '=', '1'
    );
    rules.defineRule
      ('spellsKnown.D0', 'magicNotes.bonusCantrip', '+', '1');

  } else if(name == 'Fighter') {

    rules.defineRule('abilityNotes.remarkableAthlete',
      'proficiencyBonus', '=', 'Math.ceil(source / 2)'
    );
    rules.defineRule
      ('attackBonus.Ranged', 'combatNotes.archeryStyle', '+=', '2');
    rules.defineRule('combatNotes.actionSurge',
      'levels.Fighter', '=', 'source < 17 ? 1 : 2'
    );
    // Show Defense Style note even if armor == None
    rules.defineRule('combatNotes.defenseStyle.1',
      'combatNotes.defenseStyle', '?', null,
      'armor', '=', 'source == "None" ? null : 1'
    );
    rules.defineRule('combatNotes.extraAttack',
      'levels.Fighter', '+=', 'source < 5 ? null : source < 11 ? 1 : source < 20 ? 2 : 3'
    );
    rules.defineRule('combatNotes.secondWind', 'levels.Fighter', '=', null);
    rules.defineRule
      ('combatNotes.survivor', 'constitutionModifier', '=', '5 + source');
    rules.defineRule
      ('combatNotes.survivor.1', 'hitPoints', '=', 'Math.floor(source / 2)');
    rules.defineRule('fighterFeatBonus',
      'levels.Fighter', '=', 'source < 6 ? null : source < 14 ? 1 : 2'
    );
    rules.defineRule('saveNotes.indomitable',
      'levels.Fighter', '=', 'source < 13 ? 1 : source < 17 ? 2 : 3'
    );
    rules.defineRule('selectableFeatureCount.Fighter',
      'levels.Fighter', '=', 'source < 3 ? 1 : 2',
      'combatNotes.additionalFightingStyle', '+', '1'
    );
    rules.defineRule
      ('skillNotes.remarkableAthlete', 'strengthModifier', '=', null);

  } else if(name == 'Monk') {

    rules.defineRule('abilityNotes.improvedUnarmoredMovement',
      'armor', '?', 'source == "None"',
      'shield', '?', 'source == "None"'
    );
    rules.defineRule('abilityNotes.slowFall', 'levels.Monk', '=', 'source * 5');
    // Show Unarmored Movement note properly even if armor != "None"
    rules.defineRule('abilityNotes.unarmoredMovement',
      'levels.Monk', '=', 'Math.floor((source + 6) / 4) * 5'
    );
    rules.defineRule('abilityNotes.unarmoredMovement.1',
      'armor', '?', 'source == "None"',
      'shield', '?', 'source == "None"',
      'abilityNotes.unarmoredMovement', '=', null
    );
    rules.defineRule('combatNotes.deflectMissiles',
      'levels.Monk', '=', null,
      'dexterityModifier', '+', null
    );
    rules.defineRule('combatNotes.extraAttack',
      'levels.Monk', '+=', 'source < 5 ? null : 1'
    );
    rules.defineRule('combatNotes.martialArts',
      'levels.Monk', '=', 'Math.floor((source + 13)/ 3)'
    );
    rules.defineRule('combatNotes.martialArts.1',
      'monkFeatures.Martial Arts', '?', null,
      'dexterityModifier', '=', 'source',
      'strengthModifier', '+', '-source',
      '', '^', '0'
    );
    // Show Unarmored Defense note even if armor != None or wisMod = 0
    rules.defineRule('combatNotes.monkUnarmoredDefense.1',
      'combatNotes.monkUnarmoredDefense', '?', null,
      'wisdomModifier', '=', null
    );
    rules.defineRule('combatNotes.monkUnarmoredDefense.2',
      'combatNotes.monkUnarmoredDefense', '?', null,
      'armor', '?', 'source == "None"',
      'combatNotes.monkUnarmoredDefense.1', '=', null
    );
    rules.defineRule('combatNotes.openHandTechnique', 'kiSaveDC', '=', null);
    rules.defineRule('combatNotes.quiveringPalm', 'kiSaveDC', '=', null);
    rules.defineRule('combatNotes.stunningStrike', 'kiSaveDC', '=', null);
    rules.defineRule('featureNotes.ki', 'levels.Monk', '=', null);
    rules.defineRule
      ('featureNotes.wholenessOfBody', 'levels.Monk', '=', 'source*3');
    rules.defineRule('kiSaveDC',
      'monkFeatures.Ki', '?', null,
      'proficiencyBonus', '=', '8 + source',
      'wisdomModifier', '+', null
    );
    rules.defineRule('magicNotes.tranquility', 'kiSaveDC', '=', null);
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
      'combatNotes.martialArts', '=', '"1d" + source'
    );
    for(var ability in SRD35.ABILITIES) {
      rules.defineRule
        ('saveProficiencies.' + ability, 'saveNotes.diamondSoul', '=', '1');
    }
    rules.defineRule('selectableFeatureCount.Monk',
      'levels.Monk', '=', 'source < 3 ? null : 1'
    );
    rules.defineRule('speed', 'abilityNotes.unarmoredMovement.1', '+', null);


  } else if(name == 'Paladin') {

    spells = {
      'Oath Of Devotion':[
        '3:Protection From Evil And Good:Sanctuary',
        '5:Lesser Restoration:Zone Of Truth',
        '9:Beacon Of Hope:Dispel Magic',
        '13:Freedom Of Movement:Guardian Of Faith',
        '17:Commune:Flame Strike'
      ]
    };

    rules.defineRule('armorClass', 'combatNotes.defenseStyle.1', '+', null);
    // Show Defense Style note even if armor == None
    rules.defineRule('combatNotes.defenseStyle.1',
      'combatNotes.defenseStyle', '?', null,
      'armor', '=', 'source == "None" ? null : 1'
    );
    rules.defineRule('combatNotes.extraAttack',
      'levels.Paladin', '+=', 'source < 5 ? null : 1'
    );
    rules.defineRule('combatNotes.sacredWeapon',
      'charismaModifier', '=', 'Math.max(source, 1)'
    );
    rules.defineRule
      ('featureNotes.channelDivinity', 'levels.Paladin', '=', '1');
    rules.defineRule('magicNotes.cleansingTouch',
      'charismaModifier', '=', 'Math.max(source, 1)'
    );
    rules.defineRule
      ('magicNotes.divineSense', 'charismaModifier', '=', 'source+1');
    rules.defineRule
      ('magicNotes.layOnHands', 'levels.Paladin', '=', 'source*5');
    rules.defineRule('saveNotes.auraOfCourage',
      'levels.Paladin', '=', 'source < 18 ? 10 : 30'
    );
    rules.defineRule('saveNotes.auraOfDevotion',
      'levels.Paladin', '=', 'source < 18 ? 10 : 30'
    );
    rules.defineRule('saveNotes.auraOfProtection',
      'levels.Paladin', '=', 'source < 18 ? 10 : 30'
    );
    rules.defineRule('saveNotes.auraOfProtection.1',
      'charismaModifier', '=', 'Math.max(source, 1)'
    );
    rules.defineRule('selectableFeatureCount.Paladin',
      'levels.Paladin', '=', 'source < 2 ? null : source < 3 ? 1 : 2'
    );

  } else if(name == 'Ranger') {

    rules.defineRule('armorClass', 'combatNotes.defenseStyle.1', '+', null);
    // Show Defense Style note even if armor == None
    rules.defineRule('combatNotes.defenseStyle.1',
      'combatNotes.defenseStyle', '?', null,
      'armor', '=', 'source == "None" ? null : 1'
    );
    rules.defineRule('combatNotes.extraAttack',
      'levels.Ranger', '+=', 'source < 5 ? null : 1'
    );
    rules.defineRule
      ('attackBonus.Ranged', 'combatNotes.archeryStyle', '+=', '2');
    rules.defineRule('skillNotes.favoredEnemy',
      'levels.Ranger', '=', 'source < 6 ? 1 : source < 14 ? 2 : 3'
    );
    rules.defineRule('combatNotes.foeSlayer', 'wisdomModifier', '=', null);
    rules.defineRule('hunterSelectableFeatureCount',
      'rangerFeatures.Hunter Archetype', '?', null,
      'levels.Ranger', '=', 'source<3 ? 0 : source<7 ? 1 : source<11 ? 2 : source<15 ? 3 : 4'
    );
    rules.defineRule('selectableFeatureCount.Ranger',
      'levels.Ranger', '=', 'source < 2 ? 0 : source < 3 ? 1 : 2',
      'hunterSelectableFeatureCount', '+', null
    );
    rules.defineRule('skillNotes.naturalExplorer',
      'levels.Ranger', '=', 'source < 6 ? 1 : source < 10 ? 2 : 3'
    );

  } else if(name == 'Rogue') {

    rules.defineRule('combatNotes.sneakAttack',
      'levels.Rogue', '=', 'Math.floor((source + 1) / 2)'
    );
    rules.defineRule
      ('rogueFeatBonus', 'levels.Rogue', '=', 'source < 10 ? null : 1');
    rules.defineRule('selectableFeatureCount.Rogue',
      'levels.Rogue', '=', 'source < 3 ? null : 1'
    );
    rules.defineRule('skillNotes.rogueExpertise',
      'levels.Rogue', '=', 'source < 6 ? 2 : 4'
    );
    rules.defineRule
      ('skillNotes.second-StoryWork', 'dexterityModifier', '=', null);

  } else if(name == 'Sorcerer') {

    rules.defineRule('magicNotes.carefulSpell',
      'charismaModifier', '=', 'Math.max(source, 1)'
    );
    rules.defineRule('magicNotes.empoweredSpell',
      'charismaModifier', '=', 'Math.max(source, 1)'
    );
    rules.defineRule('magicNotes.fontOfMagic', 'levels.Sorcerer', '=', null);
    rules.defineRule('selectableFeatureCount.Sorcerer',
      'levels.Sorcerer', '=', 'source<3?1 : source<10?3 : source<17?4 : 5'
    );

    rules.defineRule
      ('armorClass', 'combatNotes.draconicResilience.2', '^', null);
    rules.defineRule
      ('combatNotes.draconicResilience', 'levels.Sorcerer', '=', null);
    rules.defineRule('combatNotes.draconicResilience.1',
      'combatNotes.draconicResilience', '?', null,
      'dexterityModifier', '=', 'source + 13'
    );
    rules.defineRule('combatNotes.draconicResilience.2',
      'armor', '?', 'source == "None"',
      'combatNotes.draconicResilience.1', '=', null
    );
    rules.defineRule
      ('magicNotes.elementalAffinity', 'charismaModifier', '=', null);

  } else if(name == 'Warlock') {

    rules.defineRule("combatNotes.darkOne'sBlessing.1",
      "warlockFeatures.Dark One's Blessing", '?', null,
      'charismaModifier', '=', null,
      'levels.Warlock', '+', null,
      '', '^', '1'
    );
    rules.defineRule('combatNotes.lifedrinker',
      'charismaModifier', '=', 'Math.max(source, 1)'
    );
    rules.defineRule
      ('magicNotes.agonizingBlast', 'charismaModifier', '=', null);
    rules.defineRule('magicNotes.eldritchInvocations',
      'levels.Warlock', '=', 'source == 2 ? 2 : source < 9 ? Math.floor((source + 1) / 2) : Math.floor((source + 6) / 3)'
    );
    rules.defineRule('magicNotes.mysticArcanum',
      'levels.Warlock', '=', 'source<13 ? "K6" : source<15 ? "K6, K7" : source<17 ? "K6, K7, K8" : "K6, K7, K8, K9"'
    );
    rules.defineRule
      ('skillProficiencyCount', 'skillNotes.beguilingInfluence', '+', '2');
    rules.defineRule('selectableFeatureCount.Warlock',
      'levels.Warlock', '=', 'source < 3 ? 1 : 2',
      'magicNotes.eldritchInvocations', '+', null
    );
    rules.defineChoice('notes',
      'validationNotes.warlockBookOfAncientSecretsSelectableFeatureFeatures:Requires Pact Of The Tome',
      'validationNotes.warlockChainsOfCarceriSelectableFeatureFeatures:Requires Pact Of The Chain',
      'validationNotes.warlockLifedrinkerSelectableFeatureFeatures:Requires Pact Of The Blade',
      'validationNotes.warlockThirstingBladeSelectableFeatureFeatures:Requires Pact Of The Blade',
      'validationNotes.warlockVoiceOfTheChainMasterSelectableFeatureFeatures:Requires Pact Of The Chain'
    );

  } else if(name == 'Wizard') {

    rules.defineRule('magicNotes.arcaneRecovery',
      'levels.Wizard', '=', 'Math.ceil(source / 2)'
    );
    rules.defineRule('magicNotes.empoweredEvocation',
      'intelligenceModifier', '=', null
    );
    rules.defineRule('selectableFeatureCount.Wizard',
      'levels.Wizard', '=', 'source < 2 ? null : 1'
    );

  }

};

/*
 * Defines in #rules# the rules associated with deity #name#. #alignment# gives
 * the deity's alignment and #domains# the associated domains.
 */
SRD5E.deityRules = function(rules, name, alignment, domains, weapons) {

  if(!name) {
    console.log('Empty deity name');
    return;
  }

  if(rules.deityStats == null) {
    rules.deityStats = {
      alignment:{},
      domains:{}
    };
  }

  rules.deityStats.alignment[name] = alignment;
  rules.deityStats.domains[name] = domains.join('/');

  rules.defineRule('deityAlignment',
    'deity', '=', QuilvynUtils.dictLit(rules.deityStats.alignment) + '[source]'
  );
  rules.defineRule('deityDomains',
    'deity', '=', QuilvynUtils.dictLit(rules.deityStats.domains) + '[source]'
  );

};

/*
 * Defines in #rules# the rules associated with feat #name#. #require# and
 * #implies# list any hard and soft prerequisites for the feat, and #types#
 * lists the categories of the feat.
 */
SRD5E.featRules = function(rules, name, requires, implies, types) {

  if(!name) {
    console.log('Empty feat name');
    return;
  }

  var prefix =
    name.charAt(0).toLowerCase() + name.substring(1).replace(/ /g, '');

  if(requires.length > 0)
    SRD35.prerequisiteRules
      (rules, 'validation', prefix + 'Feat', 'feats.' + name, requires);

  if(implies.length > 0)
    SRD35.prerequisiteRules
      (rules, 'sanity', prefix + 'Feat', 'feats.' + name, implies);

  rules.defineRule('features.' + name, 'feats.' + name, '=', null);

};

/*
 * Defines in #rules# the rules associated with feat #name# that are not
 * directly derived from the parmeters passed to featRules.
 */
SRD5E.featRulesExtra = function(rules, name) {
  if(name.startsWith('Ability Boost')) {
    rules.defineRule
      ('abilityNotes.abilityBoosts', 'features.' + name, '+=', '2');
  }
};

/*
 * Defines in #rules# the rules associated with feature #name#. #sections# lists
 * the sections of the notes related to the feature and #notes# the note texts;
 * the two must have the same number of elements.
 */
SRD5E.featureRules = function(rules, name, sections, notes) {
  // TODO
  SRD35.featureRules(rules, name, sections, notes);
  for(var i = 0; i < notes.length; i++) {
    if(!notes[i].match(/Prof /))
      continue;
    var pieces = notes[i].split('/');
    for(var j = 0; j < pieces.length; j++) {
      if(!pieces[j].match(/^Prof [A-Z][a-z']*( [A-Z][a-z']*)*$/))
        continue;
      var prefix = name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');
      var prof = pieces[j].replace('Prof ', '');
      if(prof.endsWith('Tools'))
        rules.defineRule
          ('toolProficiencies.' + prof, 'skillNotes.' + prefix, '=', '1');
      else if(sections[i] == 'save')
        rules.defineRule
          ('saveProficiencies.' + prof, 'saveNotes.' + prefix, '=', '1');
      else if(sections[i] == 'skill')
        rules.defineRule
          ('skillProficiencies.' + prof, 'skillNotes.' + prefix, '=', '1');
    }
  }
};

/* Defines in #rules# the rules associated with gender #name#. */
SRD5E.genderRules = function(rules, name) {
  if(!name) {
    console.log('Empty gender name');
    return;
  }
  // No rules pertain to gender
};

/* Defines in #rules# the rules associated with language #name#. */
SRD5E.languageRules = function(rules, name) {
  if(!name) {
    console.log('Empty language name');
    return;
  }
  // No rules pertain to language
};

/*
 * Defines in #rules# the rules associated with race #name#, which has the list
 * of hard prerequisites #requires#. #features# and #selectables# list
 * associated features and #languages# the automatic languages. #spells# lists
 * any natural spells, for which #spellAbility# is used to compute the save DC.
 * #spellDict# is the dictionary of all spells used to look up individual spell
 * attributes.
 */
SRD5E.raceRules = function(
  rules, name, requires, features, selectables, languages, spellAbility,
  spells, spellDict
) {

  if(!name) {
    console.log('Empty race name');
    return;
  }
  if(spellAbility &&
     !spellAbility.match(/^(charisma|constitution|dexterity|intelligence|strength|wisdom)$/i)) {
    console.log('Bad spellAbility "' + spellAbility + '" for class ' + name);
    return;
  }

  var matchInfo;
  var prefix =
    name.charAt(0).toLowerCase() + name.substring(1).replace(/ /g, '');
  var raceLevel = prefix + 'Level';

  rules.defineRule(raceLevel,
    'race', '?', 'source == "' + name + '"',
    'level', '=', null
  );

  if(requires.length > 0)
    SRD35.prerequisiteRules
      (rules, 'validation', prefix + 'Race', raceLevel, requires);

  // TODO
  SRD35.featureListRules(rules, features, name, raceLevel, false);
  SRD35.featureListRules(rules, selectables, name, raceLevel, true);
  rules.defineSheetElement(name + ' Features', 'Feats+', null, '; ');
  rules.defineChoice('extras', prefix + 'Features');

  if(languages.length > 0)
    rules.defineRule('languageCount', raceLevel, '=', languages.length);

  for(var i = 0; i < languages.length; i++) {
    if(languages[i] != 'any')
      rules.defineRule('languages.' + languages[i], raceLevel, '=', '1');
  }

  if(spellAbility && spells.length > 0) {
    rules.defineRule('casterLevels.' + name, raceLevel, '=', null);
    rules.defineRule('casterLevel', 'casterLevel.' + name, '^=', '1');
    rules.defineRule('spellDifficultyClass.' + name,
      raceLevel, '?', null,
      spellAbility.toLowerCase() + 'Modifier', '=', '10 + source'
    );
  }

  for(var i = 0; i < spells.length; i++) {

    var pieces = spells[i].split(':');
    if(pieces.length != 2) {
      console.log('Bad format for spell list "' + spells[i] + '"');
      break;
    }
    var condition = null;
    var groupAndLevel = pieces[0];
    var spellList = pieces[1];
    if(groupAndLevel.indexOf('?') >= 0) {
      pieces = groupAndLevel.split(/\s*\?\s*/);
      condition = pieces[0];
      groupAndLevel = pieces[1];
    }
    matchInfo = groupAndLevel.match(/^(\w+)(\d)$/);
    if(!matchInfo) {
      console.log('Bad format for spell list "' + spells[i] + '"');
      break;
    }
    var group = matchInfo[1];
    var level = matchInfo[2];
    var spellNames = spellList.split(';');
    for(var j = 0; j < spellNames.length; j++) {
      var spellName = spellNames[j];
      if(spellDict[spellName] == null) {
        console.log('Unknown spell "' + spellName + '"');
        continue;
      }
      var school = QuilvynUtils.getAttrValue(spellDict[spellName], 'School');
      if(school == null) {
        console.log('No school given for spell ' + spellName);
        continue;
      }
      var fullSpell =
        spellName + '(' + group + level + ' ' + school.substring(0, 4) + ')';
      rules.choiceRules
        (rules, 'Spell', fullSpell,
         spellDict[spellName] + ' Group=' + group + ' Level=' + level);
      if(condition) {
        SRD35.prerequisiteRules
          (rules, 'test', name + 'Spells' + j, raceLevel, condition);
        rules.defineRule('spells.' + fullSpell,
          raceLevel, '?', null,
          'testNotes.' + name + 'Spells' + j, '=', 'source == 0 ? 1 : null'
        );
      } else {
        rules.defineRule('spells.' + fullSpell, raceLevel, '=', '1');
      }
    }
  }

};

/*
 * Defines in #rules# the rules associated with race #name# that are not
 * directly derived from the parmeters passed to raceRules.
 */
SRD5E.raceRulesExtra = function(rules, name) {

  if(name == 'Half-Elf') {
    rules.defineRule('abilityBoostCount',
      'abilityNotes.half-ElfAbilityAdjustment', '+=', '2'
    );
    // Redundant rule to get skill note to appear in italics
    rules.defineRule
      ('skillChoices.Intimidation', 'skillNotes.skillVersatility', '=', '1');
  } else if(name.match(/Dragonborn/)) {
    var draconicBreathTypes = {
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
    rules.defineRule('combatNotes.draconicBreath',
      'level', '=', 'Math.floor((source + 9) / 5)'
    );
    rules.defineRule('combatNotes.draconicBreath.1',
      'race', '=', 'source < "Gold" ? "5\'x30\' line" : "15\' cone"'
    );
    rules.defineRule('combatNotes.draconicBreath.2',
      'race', '=', QuilvynUtils.dictLit(draconicBreathTypes) + '[source]'
    );
    rules.defineRule('combatNotes.draconicBreath.3',
      'constitutionModifier', '=', '8 + source',
      'proficiencyBonus', '+', null
    );
    rules.defineRule('combatNotes.draconicBreath.4',
      'combatNotes.draconicBreath.2', '=', 'source.match(/cold|poison/) ? "Con" : "Dex"'
    );
    rules.defineRule('saveNotes.draconicBreath',
      'race', '=', QuilvynUtils.dictLit(draconicBreathTypes) + '[source]'
    );
  } else if(name.match(/Dwarf/)) {
    rules.defineRule('abilityNotes.armorSpeedAdjustment',
      'abilityNotes.dwarvenArmorSpeed', '^', '0'
    );
    rules.defineRule('combatNotes.dwarvenToughness', 'level', '=', null);
  } else if(name.match(/Elf/)) {
    rules.defineRule('spellsKnown.W0', 'magicNotes.cantrip', '+=', '1');
  }

};

/*
 * Defines in #rules# the rules associated with magic school #name#, which
 * grants the list of #features#.
 */
SRD5E.schoolRules = function(rules, name) {
  if(!name) {
    console.log('Empty school name');
    return;
  }
  // No rules pertain to schools
};

/*
 * Defines in #rules# the rules associated with shield #name#, which adds #ac#
 * to the character's armor class.
 */
SRD5E.shieldRules = function(rules, name, ac) {

  if(!name) {
    console.log('Empty shield name');
    return;
  }
  if(typeof ac != 'number') {
    console.log('Bad ac "' + ac + '" for shield ' + name);
    return;
  }

  if(rules.shieldStats == null) {
    rules.shieldStats = {
      ac:{},
    };
  }
  rules.shieldStats.ac[name] = ac;

  rules.defineRule
    ('armorClass', 'shield', '+', QuilvynUtils.dictLit(rules.shieldStats.ac) + '[source]');

};

/*  
 * Defines in #rules# the rules associated with skill #name#, associated with
 * #ability# (one of 'strength', 'intelligence', etc.).
 * #classes# lists any classes that are proficient in this skill.
 */ 
SRD5E.skillRules = function(rules, name, ability, classes) { 

  if(!name) {
    console.log('Empty skill name');
    return;
  }
  if(ability != null &&
     !ability.match(/^(charisma|constitution|dexterity|intelligence|strength|wisdom)$/i)) {
    console.log('Bad ability "' + ability + '" for skill ' + name);
    return;
  }

  for(var i = 0; i < classes.length; i++) {
    rules.defineRule('skillProficiencies.' + name, 'levels.' + classes[i], '=', '1');
  }
  rules.defineRule('skillBonus.' + name,
    'skillProficiencies.' + name, '?', null,
    'proficiencyBonus', '=', null
  );
  rules.defineChoice('notes', 'skills.' + name + ':(' + ability.substring(0, 3) + ') %V');
  rules.defineRule('skills.' + name,
    ability + 'Modifier', '=', null,
    'skillBonus.' + name, '+', null
  );

};

/*
 * Defines in #rules# the rules associated with spell #name#, which is from
 * magic school #school#. #casterGroup# and #level# are used to compute any
 * saving throw value required by the spell. #description# is a verbose
 * description of the spell's effects.
 */
SRD5E.spellRules = function(
  rules, name, school, casterGroup, level, description
) {
  // TODO
  SRD35.spellRules(rules, name, school, casterGroup, level, description);
};

/* Defines in #rules# the rules associated with tool #name#. */
SRD5E.toolRules = function(rules, name) {
  if(!name) {
    console.log('Empty tool name');
    return;
  }
  // No rules pertain to tools
};

/*
 * Defines in #rules# the rules associated with weapon #name#, which requires a
 * #profLevel# proficiency level to use effectively and belongs to weapon
 * category #category# (one of '1h', '2h', 'Li', 'R', 'Un', 'Ve', or their
 * spelled-out equivalents). The weapon does #damage# HP on a successful
 * attack. If specified, the weapon can be used as a ranged weapon with a range
 * increment of #range# feet.
 */
SRD5E.weaponRules = function(rules, name, profLevel, category, damage, range) {

  if(!name) {
    console.log('Bad name for weapon  "' + name + '"');
    return;
  }
  if(profLevel == null ||
     !(profLevel + '').match(/^([0-2]|unarmed|simple|martial)$/i)) {
    console.log('Bad proficiency level "' + profLevel + '" for weapon ' + name);
    return;
  }
  if(category == null ||
     !(category + '').match(/^(1h|2h|Li|R|Un|Ve|one-handed|two-handed|light|ranged|unarmed|versatile)$/i)) {
    console.log('Bad category "' + category + '" for weapon ' + name);
    return;
  }
  var matchInfo = (damage + '').match(/^(((\d*d)?\d+)([-+]\d+)?)$/);
  if(!matchInfo) {
    console.log('Bad damage "' + damage + '" for weapon ' + name);
    return;
  }
  if(range && typeof range != 'number') {
    console.log('Bad range "' + range + '" for weapon ' + name);
  }

  if((profLevel + '').match(/^[0-2]$/))
    ; // empty
  else if(profLevel.match(/^unarmed$/i))
    profLevel = 0;
  else if(profLevel.match(/^simple$/i))
    profLevel = 1;
  else if(profLevel.match(/^martial$/i))
    profLevel = 2;
  if(category.match(/^one-handed$/i))
    category = '1h';
  else if(category.match(/^two-handed$/i))
    category = '2h';
  else if(category.match(/^light$/i))
    category = 'Li';
  else if(category.match(/^ranged$/i))
    category = 'R';
  else if(category.match(/^unarmed$/i))
    category = 'Un';
  else if(category.match(/^versatile$/i))
    category = 'Ve';

  var damage = matchInfo[1];
  var weaponName = 'weapons.' + name;
  var format = '%V (%1 %2%3' + (range ? " R%4'" : '') + ')';

  if(damage.startsWith('d'))
    damage = '1' + damage;

  rules.defineChoice('notes',
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
  } else {
    rules.defineRule(weaponName + '.2', 'monkMeleeDieBonus', '^', null);
  }

  if(category == '2h') {
    rules.defineRule
      ('validationNotes.two-handedWeaponWithShield', weaponName, '=', '1');
  }

};

/*
 * Returns the dictionary of attribute formats associated with character sheet
 * format #viewer# in #rules#.
 */
SRD5E.getFormats = function(rules, viewer) {
  var format;
  var formats = rules.getChoices('notes');
  var result = {};
  var matchInfo;
  if(viewer == 'Collected Notes') {
    for(format in formats) {
      result[format] = formats[format];
      if((matchInfo = format.match(/Notes\.(.*)$/)) != null) {
        var feature = matchInfo[1];
        feature = feature.charAt(0).toUpperCase() + feature.substring(1).replace(/([A-Z\(])/g, ' $1');
        formats['features.' + feature] = formats[format];
      }
    }
  } else if(viewer == 'Compact') {
    for(format in formats) {
      if(!format.startsWith('spells.'))
        result[format] = formats[format];
    }
  } else {
    result = formats;
  }
  return result;
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
              {name: 'Dexterity', within: 'Abilities', format: '%V'},
              {name: 'Constitution', within: 'Abilities', format: '%V'},
              {name: 'Intelligence', within: 'Abilities', format: '%V'},
              {name: 'Wisdom', within: 'Abilities', format: '%V'},
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
            {name: 'Dexterity', within: 'Abilities'},
            {name: 'Constitution', within: 'Abilities'},
            {name: 'Intelligence', within: 'Abilities'},
            {name: 'Wisdom', within: 'Abilities'},
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
            {name: 'Skill Notes', within: 'FeaturesAndSkills', separator:noteSep}
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

/*
 * Returns the list of editing elements needed by #choiceRules# to add a #type#
 * item to #rules#.
 */
SRD5E.choiceEditorElements = function(rules, type) {
  // TODO
  return SRD35.choiceEditorElements(rules, type);
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
    ['dexterity', 'Dex/Boost', 'select-one', abilityChoices],
    ['dexterityAdjust', '', 'text', [3]],
    ['constitution', 'Con/Boost', 'select-one', abilityChoices],
    ['constitutionAdjust', '', 'text', [3]],
    ['intelligence', 'Int/Boost', 'select-one', abilityChoices],
    ['intelligenceAdjust', '', 'text', [3]],
    ['wisdom', 'Wis/Boost', 'select-one', abilityChoices],
    ['wisdomAdjust', '', 'text', [3]],
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
