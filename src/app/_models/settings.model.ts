export class Settings {
  isEditing: boolean;
  isDarkMode: boolean;

  constructor(isEditing: boolean, isDarkMode: boolean) {
    this.isEditing = isEditing;
    this.isDarkMode = isDarkMode;
  }
}
