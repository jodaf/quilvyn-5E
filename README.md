## 5th Edition plugin for the Quilvyn RPG character sheet generator.

The quilvyn-5E package bundles modules that extend Quilvyn to work
with the fifth edition of D&D, applying the rules of the following books:

- <a href="https://dnd.wizards.com/products/tabletop-games/rpg-products/rpg_playershandbook">5th edition Player's Handbook</a>
- <a href="https://dnd.wizards.com/products/tabletop-games/rpg-products/sc-adventurers-guide">Sword Coast Adventurer's Guide</a>
- <a href="https://dnd.wizards.com/products/tabletop-games/rpg-products/volos-guide-to-monsters">Volo's Guide to Monsters</a>
- <a href="https://dnd.wizards.com/products/tabletop-games/rpg-products/xanathars-guide-everything">Xanathar's Guide to Everything</a>

### Requirements

quilvyn-5E relies on the core modules installed by the quilvyn-core package.

### Installation

To use quilvyn-5E, unbundle the release package into the plugins/
subdirectory within the Quilvyn installation directory, then append the
following lines to the file plugins/plugins.js:

    RULESETS['D&D 5E'] = {
      url:'plugins/PHB5E.js',
      group:'5E',
      require:'5E (SRD only)'
    };
    RULESETS['5E (SRD only)'] = {
      url:'plugins/SRD5E.js',
      group:'5E',
      autoload:true,
      require:'v3.5 (SRD only)'
    };
    RULESETS["Volo's Guide supplement to D&D 5E rules - Character Races"] = {
      url:'plugins/Volo.js',
      group:'5E',
      supplement:'D&D 5E'
    };
    RULESETS["Volo's Guide supplement to D&D 5E rules - Monstrous Races"] = {
      url:'plugins/Volo.js',
      group:'5E',
      supplement:'D&D 5E'
    };
    RULESETS["Xanathar's Guide supplement to D&D 5E rules"] = {
      url:'plugins/Xanathar.js',
      group:'5E',
      supplement:'D&D 5E'
    };
    RULESETS['Sword Coast Campaign Setting using D&D 5E rules'] = {
      url:'plugins/SwordCoast.js',
      group:'5E',
      require:'D&D 5E'
    };

### Usage

Once the SRD5E plugin is installed as described above, start Quilvyn and choose
5E from the Rules menu in the editor window.

To use quilvyn-phb35, unbundle the release package into the plugins/
subdirectory within the Quilvyn installation directory, then append the
following lines to the file plugins/plugins.js:

    RULESETS['D&D v3.5'] = {
      url:'plugins/PHB35.js',
      group:'v3.5',
      require:'v3.5 (SRD only)'
    };

### Usage

Once the quilvyn-phb35 package is installed as described above, start Quilvyn
and choose 'D&D v3.5' from the rule sets menu in the initial window.
