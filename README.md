## 5th Edition plugin for the Quilvyn RPG character sheet generator.

The quilvyn-5E package bundles modules that extend Quilvyn to work
with the 5th edition of D&D, applying the rules of the 5th edition System
Reference Document.

### Requirements

quilvyn-5E relies on the core modules installed by the quilvyn-core package.

### Installation

To use quilvyn-5E, unbundle the release package into the plugins/
subdirectory within the Quilvyn installation directory, then append the
following lines to the file plugins/plugins.js:

    RULESETS['5E (SRD only)'] = {
      url:'SRD5E.js',
      group:'5E',
      autoload:true,
      require:'v3.5 (SRD only)'
    };

### Usage

Once the SRD5E plugin is installed as described above, start Quilvyn and choose
5E from the Rules menu in the editor window.
