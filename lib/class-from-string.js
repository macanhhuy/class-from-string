'use babel';

import ClassFromStringView from './class-from-string-view';
import { CompositeDisposable } from 'atom';

export default {

  classFromStringView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.classFromStringView = new ClassFromStringView(state.classFromStringViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.classFromStringView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'class-from-string:convert_snakecase': () => this.convertSnakeCase()
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'class-from-string:convert_camel': () => this.convertCamelCase()
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'class-from-string:convert_class': () => this.convertClass()
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'class-from-string:convert_dashes': () => this.convertDashesCase()
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'class-from-string:notification': () => this.showNotification()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.classFromStringView.destroy();
  },

  serialize() {
    return {
      classFromStringViewState: this.classFromStringView.serialize()
    };
  },

  convertSnakeCase() {
    let editor;
    if (editor = atom.workspace.getActiveTextEditor()) {
      let selection = editor.getSelectedText();
      let newText = selection.toLowerCase().replace(/\s+/ig, '_');
      console.log('convertSnakeCase', newText);
      editor.insertText(newText);
    }
  },

  convertDashesCase() {
    let editor = atom.workspace.getActiveTextEditor();
    if (editor) {
      let selection = editor.getSelectedText();
      let newText = selection.toLowerCase().replace(/\s+/ig, '-');
      console.log('convertDashesCase', newText);
      editor.insertText(newText);
    }
  },

  toCamelCase(text) {
      return text.replace(/^([A-Z])|\s(\w)/g, (match, p1, p2, offset) => {
          if (p2) {
            return p2.toUpperCase();
          }
          return p1.toLowerCase();
      });
  },

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },

  convertCamelCase() {
    let editor;
    if (editor = atom.workspace.getActiveTextEditor()) {
      let selection = editor.getSelectedText();
      let newText = this.toCamelCase(selection);
      console.log('convertCamelCase', newText);
      editor.insertText(newText);
    }
  },

  convertClass() {
    let editor;
    if (editor = atom.workspace.getActiveTextEditor()) {
      let selection = editor.getSelectedText();
      let newText = this.capitalizeFirstLetter(this.toCamelCase(selection));
      console.log('convertClass', newText);
      editor.insertText(newText);
    }
  },

  showNotification() {
    atom.notifications.addWarning('Mac Anh Huy');
  }

};
