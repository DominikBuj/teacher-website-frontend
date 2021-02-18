export class Update {
  id: number;
  title: string;
  subtitle: string;
  content: string;
  date: number;

  constructor(id: number, title: string, subtitle: string, content: string, date: number) {
    this.id = id;
    this.title = title;
    this.subtitle = subtitle;
    this.content = content;
    this.date = date;
  }
}
